const express = require('express');
const router = express.Router();
const {
  getKitEligibleProducts,
  createCustomKit,
  getMyKits,
  getKitById,
  updateKit,
  deleteKit,
  addKitToCart,
  getKitTemplates,
  generateKitFromTemplate,
} = require('../controllers/kitController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.route('/templates').get(getKitTemplates);

// Protected routes
router.route('/create').post(protect, createCustomKit);
router.route('/my-kits').get(protect, getMyKits);
router.route('/from-template').post(protect, generateKitFromTemplate);
router.route('/:id').get(protect, getKitById).put(protect, updateKit).delete(protect, deleteKit);
router.route('/:id/add-to-cart').post(protect, addKitToCart);

module.exports = router;