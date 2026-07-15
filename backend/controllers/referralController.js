const asyncHandler = require('express-async-handler');
const ReferralCode = require('../models/referralCodeModel');
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const { generateReferralCode: generateUniqueCode } = require('../utils/referralUtils');

// @desc    Generate a new referral code for a host
// @route   POST /api/referral/generate
// @access  Private/Host
const createReferralCode = asyncHandler(async (req, res) => {
  // Check if user is a host
  if (!req.user.isHost) {
    res.status(403);
    throw new Error('You must be registered as a host to generate a referral code');
  }

  // Check if host already has an active referral code
  const existingCode = await ReferralCode.findOne({
    host: req.user._id,
    isActive: true,
  });

  if (existingCode) {
    res.status(400);
    throw new Error('You already have an active referral code: ' + existingCode.code);
  }

  // Generate a new unique referral code
  const code = await generateUniqueCode();

  // Create a new referral code record
  const referralCode = await ReferralCode.create({
    code,
    host: req.user._id,
  });

  if (referralCode) {
    res.status(201).json({
      _id: referralCode._id,
      code: referralCode.code,
      createdAt: referralCode.createdAt,
      expiresAt: referralCode.expiresAt,
    });
  } else {
    res.status(400);
    throw new Error('Failed to generate referral code');
  }
});

// @desc    Get host's referral code
// @route   GET /api/referral/mycode
// @access  Private/Host
const getMyReferralCode = asyncHandler(async (req, res) => {
  // Check if user is a host
  if (!req.user.isHost) {
    res.status(403);
    throw new Error('You must be registered as a host to access referral codes');
  }

  // Fetch the host's active referral code
  const referralCode = await ReferralCode.findOne({
    host: req.user._id,
    isActive: true,
  });

  if (referralCode) {
    res.json({
      _id: referralCode._id,
      code: referralCode.code,
      createdAt: referralCode.createdAt,
      expiresAt: referralCode.expiresAt,
      usageCount: referralCode.usageCount,
      totalEarnings: referralCode.totalEarnings,
    });
  } else {
    res.status(404);
    throw new Error('No active referral code found');
  }
});

// @desc    Get referral statistics and earnings
// @route   GET /api/referral/stats
// @access  Private/Host
const getReferralStats = asyncHandler(async (req, res) => {
  // Check if user is a host
  if (!req.user.isHost) {
    res.status(403);
    throw new Error('You must be registered as a host to access referral statistics');
  }

  // Fetch all referral codes for this host (active and inactive)
  const referralCodes = await ReferralCode.find({
    host: req.user._id,
  }).populate({
    path: 'orders.order',
    select: 'totalPrice rentalStart rentalEnd status',
  });

  if (!referralCodes || referralCodes.length === 0) {
    return res.json({
      codesGenerated: 0,
      activeCode: null,
      totalUsage: 0,
      totalEarnings: 0,
      pendingPayout: req.user.referralEarnings?.pendingPayout || 0,
      totalPaidOut: req.user.referralEarnings?.totalPaidOut || 0,
      recentReferrals: [],
    });
  }

  // Get the active code
  const activeCode = referralCodes.find(code => code.isActive);

  // Calculate statistics
  const totalUsage = referralCodes.reduce((sum, code) => sum + code.usageCount, 0);
  const totalEarnings = referralCodes.reduce((sum, code) => sum + code.totalEarnings, 0);

  // Get recent referral orders (flattened and sorted by date)
  let recentReferrals = [];
  referralCodes.forEach(code => {
    if (code.orders && code.orders.length > 0) {
      code.orders.forEach(order => {
        if (order.order) {
          recentReferrals.push({
            date: order.date,
            orderAmount: order.amount,
            commission: order.commission,
            orderStatus: order.order.status,
            rentalPeriod: {
              start: order.order.rentalStart,
              end: order.order.rentalEnd,
            },
            code: code.code,
          });
        }
      });
    }
  });

  // Sort by date descending and limit to last 10
  recentReferrals = recentReferrals
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  // Get monthly earnings data for chart visualization
  const monthlyEarnings = getMonthlyEarningsData(referralCodes);

  res.json({
    codesGenerated: referralCodes.length,
    activeCode: activeCode ? {
      code: activeCode.code,
      usageCount: activeCode.usageCount,
      totalEarnings: activeCode.totalEarnings,
      expiresAt: activeCode.expiresAt,
    } : null,
    totalUsage,
    totalEarnings,
    pendingPayout: req.user.referralEarnings?.pendingPayout || 0,
    totalPaidOut: req.user.referralEarnings?.totalPaidOut || 0,
    recentReferrals,
    monthlyEarnings,
  });
});

// @desc    Submit a payout request
// @route   POST /api/referral/payout-request
// @access  Private/Host
const requestPayout = asyncHandler(async (req, res) => {
  // Check if user is a host
  if (!req.user.isHost) {
    res.status(403);
    throw new Error('You must be registered as a host to request payouts');
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check if the user has any pending earnings to be paid out
  if (!user.referralEarnings || user.referralEarnings.pendingPayout <= 0) {
    res.status(400);
    throw new Error('No pending earnings to pay out');
  }

  const { paymentMethod } = req.body;

  // Validate payment method
  if (!paymentMethod || !['creditToAccount', 'bankTransfer', 'paypal'].includes(paymentMethod)) {
    res.status(400);
    throw new Error('Valid payment method required');
  }

  // If bank transfer or PayPal, ensure needed details are provided
  if (paymentMethod === 'bankTransfer' &&
      (!user.hostInfo?.paymentDetails?.bankInfo?.accountName ||
       !user.hostInfo?.paymentDetails?.bankInfo?.accountNumber)) {
    res.status(400);
    throw new Error('Bank account details are required for bank transfers');
  }

  if (paymentMethod === 'paypal' && !user.hostInfo?.paymentDetails?.paypalEmail) {
    res.status(400);
    throw new Error('PayPal email is required for PayPal payouts');
  }

  const amountToPayOut = user.referralEarnings.pendingPayout;

  // Create a payout request in the referral code model
  // We'll add it to the most recently active code, or create a new inactive code record if needed
  let referralCode = await ReferralCode.findOne({
    host: user._id,
    isActive: true,
  });

  // If no active code found, use the most recent inactive one
  if (!referralCode) {
    referralCode = await ReferralCode.findOne({
      host: user._id,
    }).sort({ createdAt: -1 });
  }

  // If still no code found, create a placeholder one
  if (!referralCode) {
    const placeholderCode = await generateReferralCode();
    referralCode = await ReferralCode.create({
      code: placeholderCode,
      host: user._id,
      isActive: false,
    });
  }

  // Add payout record
  referralCode.payouts.push({
    amount: amountToPayOut,
    status: 'pending',
    notes: `Payout requested via ${paymentMethod}`,
  });

  await referralCode.save();

  // Record the transaction in user's history
  user.referralEarnings.transactions.push({
    type: 'payout',
    amount: amountToPayOut,
    date: new Date(),
    status: 'pending',
    notes: `Payout requested via ${paymentMethod}`,
  });

  // Update pending amount (will be processed by admin later)
  // The pending amount stays the same until admin processes the payout

  await user.save();

  res.status(200).json({
    message: 'Payout request submitted successfully',
    amount: amountToPayOut,
    status: 'pending',
    paymentMethod,
  });
});

// @desc    Validate a referral code
// @route   POST /api/referral/validate
// @access  Public
const validateReferralCode = asyncHandler(async (req, res) => {
  const { code } = req.body;

  if (!code) {
    res.status(400);
    throw new Error('Referral code is required');
  }

  const referralCode = await ReferralCode.findOne({
    code: code.trim(),
    isActive: true,
    expiresAt: { $gt: new Date() },
  }).populate('host', 'name email _id');

  if (!referralCode) {
    res.status(404);
    throw new Error('Invalid or expired referral code');
  }

  // Check if the user trying to use the code is the same as the host
  if (req.user && req.user._id.toString() === referralCode.host._id.toString()) {
    res.status(400);
    throw new Error('You cannot use your own referral code');
  }

  res.json({
    valid: true,
    code: referralCode.code,
    discountPercentage: 10, // Hard-coded 10% discount for guests
    host: {
      name: referralCode.host.name,
      _id: referralCode.host._id,
    },
  });
});

// @desc    Admin - Get all referral codes
// @route   GET /api/admin/referrals
// @access  Private/Admin
const getAllReferralCodes = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const count = await ReferralCode.countDocuments({});

  const referralCodes = await ReferralCode.find({})
    .populate('host', 'name email isHost')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    referralCodes,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Admin - Process a payout
// @route   PUT /api/admin/process-payout/:id
// @access  Private/Admin
const processPayoutRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, notes, transactionId } = req.body;

  if (!id || !status || !['processed', 'failed'].includes(status)) {
    res.status(400);
    throw new Error('Valid payout ID and status required');
  }

  // Find the referral code containing this payout
  const referralCode = await ReferralCode.findOne({
    'payouts._id': id,
  });

  if (!referralCode) {
    res.status(404);
    throw new Error('Payout request not found');
  }

  // Find the specific payout in the array
  const payoutIndex = referralCode.payouts.findIndex(p => p._id.toString() === id);

  if (payoutIndex === -1) {
    res.status(404);
    throw new Error('Payout request not found in referral code');
  }

  const payout = referralCode.payouts[payoutIndex];

  // Update the payout status
  referralCode.payouts[payoutIndex].status = status;
  referralCode.payouts[payoutIndex].notes = notes || payout.notes;

  if (transactionId) {
    referralCode.payouts[payoutIndex].transactionId = transactionId;
  }

  await referralCode.save();

  // Update the host's account
  const host = await User.findById(referralCode.host);

  if (!host) {
    res.status(404);
    throw new Error('Host user not found');
  }

  // Find the corresponding transaction in the user's history
  const txIndex = host.referralEarnings.transactions.findIndex(
    tx => tx.type === 'payout' &&
    tx.amount === payout.amount &&
    tx.status === 'pending'
  );

  if (txIndex !== -1) {
    // Update the transaction status
    host.referralEarnings.transactions[txIndex].status = status;
    host.referralEarnings.transactions[txIndex].notes = notes ||
      host.referralEarnings.transactions[txIndex].notes;
  }

  // If payout is processed successfully, update the balance
  if (status === 'processed') {
    host.referralEarnings.pendingPayout -= payout.amount;
    host.referralEarnings.totalPaidOut += payout.amount;
  }

  await host.save();

  res.json({
    message: `Payout ${status} successfully`,
    payout: referralCode.payouts[payoutIndex],
  });
});

// Helper function to generate monthly earnings data
const getMonthlyEarningsData = (referralCodes) => {
  const monthlyData = {};

  // Get data for the last 12 months
  const today = new Date();
  for (let i = 0; i < 12; i++) {
    const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthKey = `${month.getFullYear()}-${month.getMonth() + 1}`;
    monthlyData[monthKey] = 0;
  }

  // Aggregate earnings by month
  referralCodes.forEach(code => {
    if (code.orders && code.orders.length > 0) {
      code.orders.forEach(order => {
        const orderDate = new Date(order.date);
        const monthKey = `${orderDate.getFullYear()}-${orderDate.getMonth() + 1}`;

        // Only include if it's within our 12-month window
        if (monthlyData.hasOwnProperty(monthKey)) {
          monthlyData[monthKey] += order.commission;
        }
      });
    }
  });

  // Convert to array format for frontend charts
  const result = Object.keys(monthlyData)
    .sort() // Sort chronologically
    .map(key => {
      const [year, month] = key.split('-');
      return {
        month: new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleString('default', { month: 'short' }),
        year: year,
        earnings: monthlyData[key],
      };
    });

  return result;
};

module.exports = {
  createReferralCode,
  getMyReferralCode,
  getReferralStats,
  requestPayout,
  validateReferralCode,
  getAllReferralCodes,
  processPayoutRequest,
};