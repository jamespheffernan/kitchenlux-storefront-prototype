const mongoose = require('mongoose');

const referralCodeSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: function() {
        // Default expiration is 1 year from creation
        const date = new Date();
        date.setFullYear(date.getFullYear() + 1);
        return date;
      }
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    orders: [
      {
        order: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Order',
        },
        amount: {
          type: Number,
          required: true,
        },
        commission: {
          type: Number,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        }
      }
    ],
    payouts: [
      {
        amount: {
          type: Number,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          required: true,
          enum: ['pending', 'processed', 'failed'],
          default: 'pending',
        },
        transactionId: {
          type: String,
        },
        notes: {
          type: String,
        },
      }
    ],
  },
  { timestamps: true }
);

// Index for faster lookups
referralCodeSchema.index({ code: 1 });
referralCodeSchema.index({ host: 1 });

const ReferralCode = mongoose.model('ReferralCode', referralCodeSchema);

module.exports = ReferralCode;