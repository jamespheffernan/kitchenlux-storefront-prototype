const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const CustomKit = require('../models/customKitModel');
const User = require('../models/userModel');

// @desc    Get all kit-eligible products
// @route   GET /api/products/kit-eligible
// @access  Public
const getKitEligibleProducts = asyncHandler(async (req, res) => {
  const pageSize = 20;
  const page = Number(req.query.pageNumber) || 1;
  const category = req.query.category || '';
  const keyword = req.query.keyword ? {
    name: {
      $regex: req.query.keyword,
      $options: 'i',
    },
  } : {};

  // Build filter
  const filter = {
    ...keyword,
    isKitEligible: true,
    isIndividualItem: true
  };

  // Add category filter if provided
  if (category) {
    filter.kitCategory = category;
  }

  const count = await Product.countDocuments(filter);

  const products = await Product.find(filter)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ kitCategory: 1, name: 1 });

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    count,
  });
});

// @desc    Create a new custom kit
// @route   POST /api/kits/create
// @access  Private
const createCustomKit = asyncHandler(async (req, res) => {
  const { name, items } = req.body;

  if (!name || !items || items.length === 0) {
    res.status(400);
    throw new Error('Kit name and items are required');
  }

  // Validate that all products exist and are kit eligible
  const productIds = items.map(item => item.product);
  const products = await Product.find({
    _id: { $in: productIds },
    isKitEligible: true,
    isIndividualItem: true
  });

  if (products.length !== productIds.length) {
    res.status(400);
    throw new Error('One or more products are not valid or not eligible for custom kits');
  }

  // Map full product data to items
  const kitItems = items.map(item => {
    const product = products.find(p => p._id.toString() === item.product.toString());
    return {
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.individualRentalPrice || product.price,
      category: product.kitCategory,
      quantity: item.quantity || 1,
      weight: product.itemWeight || 0,
      depositAmount: product.depositAmount || 0,
    };
  });

  // Create the custom kit
  const customKit = new CustomKit({
    user: req.user._id,
    name,
    items: kitItems,
    isSaved: true,
  });

  // Validate the kit
  const validationErrors = customKit.validateKit();

  // Save even with validation errors (they'll be stored in the model)
  const createdKit = await customKit.save();

  res.status(201).json({
    kit: createdKit,
    validationErrors,
  });
});

// @desc    Get all custom kits for a user
// @route   GET /api/kits/my-kits
// @access  Private
const getMyKits = asyncHandler(async (req, res) => {
  const kits = await CustomKit.find({ user: req.user._id, isSaved: true })
    .sort({ lastModified: -1 });

  res.json(kits);
});

// @desc    Get a custom kit by ID
// @route   GET /api/kits/:id
// @access  Private
const getKitById = asyncHandler(async (req, res) => {
  const kit = await CustomKit.findById(req.params.id);

  if (!kit) {
    res.status(404);
    throw new Error('Kit not found');
  }

  // Check if kit belongs to user or user is admin
  if (kit.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized to view this kit');
  }

  res.json(kit);
});

// @desc    Update a custom kit
// @route   PUT /api/kits/:id
// @access  Private
const updateKit = asyncHandler(async (req, res) => {
  const { name, items } = req.body;

  const kit = await CustomKit.findById(req.params.id);

  if (!kit) {
    res.status(404);
    throw new Error('Kit not found');
  }

  // Check if kit belongs to user
  if (kit.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this kit');
  }

  if (name) {
    kit.name = name;
  }

  if (items && items.length > 0) {
    // Validate that all products exist and are kit eligible
    const productIds = items.map(item => item.product);
    const products = await Product.find({
      _id: { $in: productIds },
      isKitEligible: true,
      isIndividualItem: true
    });

    if (products.length !== productIds.length) {
      res.status(400);
      throw new Error('One or more products are not valid or not eligible for custom kits');
    }

    // Map full product data to items
    const kitItems = items.map(item => {
      const product = products.find(p => p._id.toString() === item.product.toString());
      return {
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.individualRentalPrice || product.price,
        category: product.kitCategory,
        quantity: item.quantity || 1,
        weight: product.itemWeight || 0,
        depositAmount: product.depositAmount || 0,
      };
    });

    kit.items = kitItems;
  }

  // Validate the kit
  kit.validateKit();

  // Save the updated kit
  const updatedKit = await kit.save();

  res.json(updatedKit);
});

// @desc    Delete a custom kit
// @route   DELETE /api/kits/:id
// @access  Private
const deleteKit = asyncHandler(async (req, res) => {
  const kit = await CustomKit.findById(req.params.id);

  if (!kit) {
    res.status(404);
    throw new Error('Kit not found');
  }

  // Check if kit belongs to user
  if (kit.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this kit');
  }

  await kit.remove();

  res.json({ message: 'Kit removed' });
});

// @desc    Add a custom kit to cart
// @route   POST /api/kits/:id/add-to-cart
// @access  Private
const addKitToCart = asyncHandler(async (req, res) => {
  const kit = await CustomKit.findById(req.params.id);

  if (!kit) {
    res.status(404);
    throw new Error('Kit not found');
  }

  // Check if kit belongs to user
  if (kit.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to add this kit to cart');
  }

  // Validate the kit before adding to cart
  const validationErrors = kit.validateKit();

  if (validationErrors.length > 0) {
    res.status(400);
    throw new Error(`Kit validation failed: ${validationErrors.join(', ')}`);
  }

  // Check inventory availability for all items
  const productIds = kit.items.map(item => item.product);
  const products = await Product.find({ _id: { $in: productIds } });

  // Check if any item is out of stock
  const outOfStockItems = [];
  kit.items.forEach(item => {
    const product = products.find(p => p._id.toString() === item.product.toString());
    if (product.countInStock < item.quantity) {
      outOfStockItems.push(product.name);
    }
  });

  if (outOfStockItems.length > 0) {
    res.status(400);
    throw new Error(`The following items are out of stock: ${outOfStockItems.join(', ')}`);
  }

  // Return the kit info formatted for cart
  const cartItem = {
    _id: kit._id,
    name: kit.name,
    price: kit.totalPrice,
    deposit: kit.totalDeposit,
    isCustomKit: true,
    kitItems: kit.items,
    image: kit.items[0]?.image || 'default-kit-image.jpg', // Use first item's image or default
  };

  res.json(cartItem);
});

// @desc    Get kit templates (predefined starter kits)
// @route   GET /api/kits/templates
// @access  Public
const getKitTemplates = asyncHandler(async (req, res) => {
  // Define template categories
  const templates = [
    {
      id: 'basic',
      name: 'Basic Essentials',
      description: 'The must-have items for any kitchen setup',
      itemCount: 5,
      categories: ['knife', 'pan', 'utensil'],
      estimatedPrice: 45,
    },
    {
      id: 'advanced',
      name: 'Cooking Enthusiast',
      description: 'A comprehensive set for more ambitious cooking',
      itemCount: 10,
      categories: ['knife', 'pan', 'pot', 'utensil', 'bakeware'],
      estimatedPrice: 85,
    },
    {
      id: 'chef',
      name: 'Professional Chef',
      description: 'Premium tools for advanced cooking techniques',
      itemCount: 15,
      categories: ['knife', 'pan', 'pot', 'utensil', 'bakeware', 'appliance'],
      estimatedPrice: 120,
    },
    {
      id: 'baking',
      name: 'Baking Specialist',
      description: 'Everything you need for baking breads, cakes, and pastries',
      itemCount: 8,
      categories: ['bakeware', 'utensil'],
      estimatedPrice: 65,
    },
  ];

  res.json(templates);
});

// @desc    Generate a kit from template
// @route   POST /api/kits/from-template
// @access  Private
const generateKitFromTemplate = asyncHandler(async (req, res) => {
  const { templateId } = req.body;

  if (!templateId) {
    res.status(400);
    throw new Error('Template ID is required');
  }

  let categoryFilters = [];
  let itemCount = 0;
  let kitName = '';

  // Define what to include based on template
  switch (templateId) {
    case 'basic':
      categoryFilters = ['knife', 'pan', 'utensil'];
      itemCount = 5;
      kitName = 'Basic Essentials Kit';
      break;
    case 'advanced':
      categoryFilters = ['knife', 'pan', 'pot', 'utensil', 'bakeware'];
      itemCount = 10;
      kitName = 'Cooking Enthusiast Kit';
      break;
    case 'chef':
      categoryFilters = ['knife', 'pan', 'pot', 'utensil', 'bakeware', 'appliance'];
      itemCount = 15;
      kitName = 'Professional Chef Kit';
      break;
    case 'baking':
      categoryFilters = ['bakeware', 'utensil'];
      itemCount = 8;
      kitName = 'Baking Specialist Kit';
      break;
    default:
      res.status(400);
      throw new Error('Invalid template ID');
  }

  // Get essential products first (prioritize these)
  const essentialProducts = await Product.find({
    isKitEligible: true,
    isIndividualItem: true,
    isEssential: true,
    kitCategory: { $in: categoryFilters },
    countInStock: { $gt: 0 }
  }).limit(Math.ceil(itemCount / 2)); // Half the items should be essential

  // Get remaining products to fill the kit
  const remainingCount = itemCount - essentialProducts.length;
  const otherProducts = await Product.find({
    isKitEligible: true,
    isIndividualItem: true,
    isEssential: false,
    kitCategory: { $in: categoryFilters },
    countInStock: { $gt: 0 },
    _id: { $nin: essentialProducts.map(p => p._id) } // Exclude already selected products
  }).limit(remainingCount);

  // Combine the products
  const selectedProducts = [...essentialProducts, ...otherProducts];

  // Format items for kit creation
  const kitItems = selectedProducts.map(product => ({
    product: product._id,
    name: product.name,
    image: product.image,
    price: product.individualRentalPrice || product.price,
    category: product.kitCategory,
    quantity: 1,
    weight: product.itemWeight || 0,
    depositAmount: product.depositAmount || 0,
  }));

  // Create a temporary kit (not saved yet)
  const tempKit = new CustomKit({
    user: req.user._id,
    name: kitName,
    items: kitItems,
    isSaved: false,
  });

  // Validate but don't save to DB
  tempKit.validateKit();

  res.json({
    kit: tempKit,
    message: 'Template kit generated successfully. You can now customize or save it.'
  });
});

module.exports = {
  getKitEligibleProducts,
  createCustomKit,
  getMyKits,
  getKitById,
  updateKit,
  deleteKit,
  addKitToCart,
  getKitTemplates,
  generateKitFromTemplate,
};
