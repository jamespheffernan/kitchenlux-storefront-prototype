const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 12,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isHost: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
    },
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    rentalHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
    hostInfo: {
      propertyListings: [
        {
          name: String,
          platform: {
            type: String,
            enum: ['airbnb', 'vrbo', 'other'],
          },
          listingUrl: String,
          address: {
            street: String,
            city: String,
            state: String,
            postalCode: String,
            country: String,
          },
        }
      ],
      paymentDetails: {
        preferredMethod: {
          type: String,
          enum: ['creditToAccount', 'bankTransfer', 'paypal'],
          default: 'creditToAccount',
        },
        paypalEmail: String,
        bankInfo: {
          accountName: String,
          accountNumber: String,
          routingNumber: String,
          bankName: String,
        }
      },
      verificationStatus: {
        type: String,
        enum: ['unverified', 'pending', 'verified'],
        default: 'unverified',
      },
      verificationDocuments: [
        {
          type: String,
          documentType: {
            type: String,
            enum: ['propertyDeed', 'hostingPlatformProfile', 'other'],
          },
          uploadDate: {
            type: Date,
            default: Date.now,
          },
          verifiedAt: Date,
          status: {
            type: String,
            enum: ['pending', 'verified', 'rejected'],
            default: 'pending',
          },
        }
      ],
    },
    referralEarnings: {
      totalEarned: {
        type: Number,
        default: 0,
      },
      pendingPayout: {
        type: Number,
        default: 0,
      },
      totalPaidOut: {
        type: Number,
        default: 0,
      },
      transactions: [
        {
          type: {
            type: String,
            enum: ['earning', 'payout'],
          },
          amount: Number,
          orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
          },
          referralCode: String,
          date: {
            type: Date,
            default: Date.now,
          },
          status: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending',
          },
          notes: String,
        }
      ],
    },
  },
  { timestamps: true }
);

// Method to check if entered password matches the user's hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash password before saving user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
