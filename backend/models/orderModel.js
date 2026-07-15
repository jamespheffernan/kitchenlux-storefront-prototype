const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],
    rentalAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    deliveryPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    damageProtection: {
      type: Boolean,
      default: false,
    },
    damageProtectionPrice: {
      type: Number,
      default: 0.0,
    },
    referral: {
      code: {
        type: String,
        trim: true,
      },
      host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      discountPercentage: {
        type: Number,
        default: 0,
      },
      discountAmount: {
        type: Number,
        default: 0,
      },
      commissionPercentage: {
        type: Number,
        default: 0,
      },
      commissionAmount: {
        type: Number,
        default: 0,
      },
      processed: {
        type: Boolean,
        default: false,
      },
    },
    subtotalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    rentalStart: {
      type: Date,
      required: true,
    },
    rentalEnd: {
      type: Date,
      required: true,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    isPickedUp: {
      type: Boolean,
      required: true,
      default: false,
    },
    pickedUpAt: {
      type: Date,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'confirmed', 'delivered', 'completed', 'cancelled'],
      default: 'pending',
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;