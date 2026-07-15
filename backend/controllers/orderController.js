const Order = require('../models/orderModel');
const User = require('../models/userModel');
const ReferralCode = require('../models/referralCodeModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { calculateCommission, calculateDiscount, updateHostEarnings } = require('../utils/referralUtils');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      rentalAddress,
      paymentMethod,
      taxPrice,
      deliveryPrice,
      damageProtection,
      damageProtectionPrice,
      totalPrice,
      rentalStart,
      rentalEnd,
      referralCode, // Add referral code to request body
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    }

    if (!rentalStart || !rentalEnd) {
      res.status(400).json({ message: 'Rental dates are required' });
      return;
    }

    // Validate rental dates
    const start = new Date(rentalStart);
    const end = new Date(rentalEnd);

    if (start >= end) {
      res.status(400).json({ message: 'Rental end date must be after start date' });
      return;
    }

    // Calculate subtotal from order items
    const subtotalPrice = orderItems.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    // Process referral code if provided
    let referral = {};
    let adjustedTotalPrice = totalPrice;

    if (referralCode) {
      // Look up the referral code
      const validReferralCode = await ReferralCode.findOne({
        code: referralCode,
        isActive: true,
        expiresAt: { $gt: new Date() }
      }).populate('host');

      if (validReferralCode) {
        // Prevent hosts from using their own code
        if (validReferralCode.host._id.toString() === req.user._id.toString()) {
          res.status(400).json({ message: 'You cannot use your own referral code' });
          return;
        }

        // Calculate discount (10% of subtotal)
        const discountPercentage = 10;
        const discountAmount = calculateDiscount(subtotalPrice);

        // Calculate commission for the host (15% of subtotal)
        const commissionPercentage = 15;
        const commissionAmount = calculateCommission(subtotalPrice);

        // Adjust the total price with the discount
        adjustedTotalPrice = totalPrice - discountAmount;

        // Populate the referral object
        referral = {
          code: referralCode,
          host: validReferralCode.host._id,
          discountPercentage,
          discountAmount,
          commissionPercentage,
          commissionAmount,
          processed: false
        };
      }
    }

    const order = new Order({
      orderItems,
      user: req.user._id,
      rentalAddress,
      paymentMethod,
      taxPrice,
      deliveryPrice,
      damageProtection,
      damageProtectionPrice,
      subtotalPrice,
      totalPrice: adjustedTotalPrice, // Use adjusted price if a discount was applied
      referral,
      rentalStart,
      rentalEnd,
    });

    const createdOrder = await order.save();

    // Add to user's rental history
    const user = await User.findById(req.user._id);
    user.rentalHistory.push(createdOrder._id);
    await user.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (order) {
      // Check if the order belongs to the logged-in user or if user is admin
      if (
        order.user._id.toString() !== req.user._id.toString() &&
        !req.user.isAdmin
      ) {
        res.status(401).json({ message: 'Not authorized to view this order' });
        return;
      }

      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      // Process payment with Stripe
      const { paymentMethodId } = req.body;

      if (!paymentMethodId) {
        res.status(400).json({ message: 'Payment method ID is required' });
        return;
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(order.totalPrice * 100), // Stripe requires amount in cents
        currency: 'usd',
        payment_method: paymentMethodId,
        confirm: true,
      });

      if (paymentIntent.status === 'succeeded') {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.status = 'confirmed';
        order.paymentResult = {
          id: paymentIntent.id,
          status: paymentIntent.status,
          update_time: new Date().toISOString(),
          email_address: req.user.email,
        };

        // Process referral if there's a referral code associated with the order
        if (order.referral && order.referral.code && !order.referral.processed) {
          try {
            // Find the referral code
            const referralCode = await ReferralCode.findOne({
              code: order.referral.code,
              isActive: true
            });

            if (referralCode) {
              // Find the host
              const host = await User.findById(order.referral.host);

              if (host && host.isHost) {
                // Update the referral code usage stats
                referralCode.usageCount += 1;
                referralCode.totalEarnings += order.referral.commissionAmount;

                // Add this order to the referral code's orders list
                referralCode.orders.push({
                  order: order._id,
                  amount: order.subtotalPrice,
                  commission: order.referral.commissionAmount,
                });

                await referralCode.save();

                // Update the host's earnings
                await updateHostEarnings(host, order.referral.commissionAmount, order);

                // Mark referral as processed
                order.referral.processed = true;
              }
            }
          } catch (err) {
            console.error('Error processing referral:', err);
            // We don't want the order to fail if referral processing fails,
            // so we continue without throwing an error
          }
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
      } else {
        res.status(400).json({ message: 'Payment failed' });
      }
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      order.status = 'delivered';

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order to picked up
// @route   PUT /api/orders/:id/pickup
// @access  Private/Admin
const updateOrderToPickedUp = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPickedUp = true;
      order.pickedUpAt = Date.now();
      order.status = 'completed';

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const count = await Order.countDocuments({});
    const orders = await Order.find({})
      .populate('user', 'id name')
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ orders, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['pending', 'confirmed', 'delivered', 'completed', 'cancelled'].includes(status)) {
      res.status(400).json({ message: 'Invalid status' });
      return;
    }

    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;

      // Update related fields based on status
      if (status === 'delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      } else if (status === 'completed') {
        order.isPickedUp = true;
        order.pickedUpAt = Date.now();
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderToPickedUp,
  getMyOrders,
  getOrders,
  updateOrderStatus,
};