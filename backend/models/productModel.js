const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const productSchema = mongoose.Schema(
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
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Essential', 'Specialty', 'Chef'],
    },
    description: {
      type: String,
      required: true,
    },
    // Custom kit builder fields
    isIndividualItem: {
      type: Boolean,
      default: false,
    },
    isKitEligible: {
      type: Boolean,
      default: false,
    },
    kitCategory: {
      type: String,
      enum: ['knife', 'pan', 'pot', 'utensil', 'bakeware', 'appliance', 'storage', 'other'],
      default: 'other',
    },
    individualRentalPrice: {
      type: Number,
      default: 0,
    },
    itemWeight: {
      type: Number, // Weight in grams
      default: 0,
    },
    depostiAmount: {
      type: Number,
      default: 0,
    },
    isEssential: {
      type: Boolean, // Flag for must-have items in a custom kit
      default: false,
    },
    itemsIncluded: [
      {
        name: { type: String, required: true },
        description: { type: String },
      },
    ],
    specifications: [
      {
        name: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    perfect_for: [String],
    related_products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;