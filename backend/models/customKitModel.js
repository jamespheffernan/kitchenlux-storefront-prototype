const mongoose = require('mongoose');

const customKitItemSchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    weight: {
      type: Number,
      default: 0,
    },
    depositAmount: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const customKitSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    items: [customKitItemSchema],
    itemCount: {
      type: Number,
      default: 0,
    },
    basePrice: {
      type: Number,
      default: 0, // Price before any discounts
    },
    discountPercentage: {
      type: Number,
      default: 0, // Volume discount percentage
    },
    totalPrice: {
      type: Number,
      default: 0, // Final price after discount
    },
    totalWeight: {
      type: Number,
      default: 0, // Total weight in grams
    },
    totalDeposit: {
      type: Number,
      default: 0, // Security deposit amount
    },
    isSaved: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      unique: true,
    },
    notes: {
      type: String,
    },
    validationErrors: [String], // Store any validation issues with the kit
    dateCreated: {
      type: Date,
      default: Date.now,
    },
    lastModified: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Middleware to update totalPrice, totalWeight, itemCount before saving
customKitSchema.pre('save', function(next) {
  // Calculate item count
  this.itemCount = this.items.reduce((total, item) => total + item.quantity, 0);

  // Calculate base price
  this.basePrice = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Calculate total weight
  this.totalWeight = this.items.reduce((total, item) => total + (item.weight * item.quantity), 0);

  // Calculate total deposit
  this.totalDeposit = this.items.reduce((total, item) => total + (item.depositAmount * item.quantity), 0);

  // Apply volume discounts
  if (this.itemCount >= 10) {
    this.discountPercentage = 10; // 10% off for 10+ items
  } else if (this.itemCount >= 5) {
    this.discountPercentage = 5; // 5% off for 5+ items
  } else {
    this.discountPercentage = 0;
  }

  // Calculate final price with discount
  this.totalPrice = this.basePrice * (1 - (this.discountPercentage / 100));

  // Update lastModified date
  this.lastModified = Date.now();

  next();
});

// Generate a unique slug if one isn't provided
customKitSchema.pre('save', async function(next) {
  if (!this.slug) {
    // Create a slug based on kit name and user ID
    const baseSlug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove non-word chars
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

    const uniqueId = this._id.toString().slice(-4);
    this.slug = `${baseSlug}-${uniqueId}`;
  }
  next();
});

// Method to validate a kit
customKitSchema.methods.validateKit = function() {
  const errors = [];

  // Check if there are any items
  if (this.items.length === 0) {
    errors.push('Kit must contain at least one item');
  }

  // Check for essential categories
  const hasKnife = this.items.some(item => item.category === 'knife');
  const hasPan = this.items.some(item => item.category === 'pan' || item.category === 'pot');
  const hasUtensil = this.items.some(item => item.category === 'utensil');

  if (!hasKnife) {
    errors.push('Kit should include at least one knife');
  }

  if (!hasPan) {
    errors.push('Kit should include at least one pan or pot');
  }

  if (!hasUtensil) {
    errors.push('Kit should include at least one utensil');
  }

  this.validationErrors = errors;
  return errors;
};

const CustomKit = mongoose.model('CustomKit', customKitSchema);

module.exports = CustomKit;
