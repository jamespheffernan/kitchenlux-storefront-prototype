const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getProductBySlug,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
} = require('../controllers/productController');
const { getKitEligibleProducts } = require('../controllers/kitController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.get('/top', getTopProducts);

router.get('/kit-eligible', getKitEligibleProducts);

router.get('/slug/:slug', getProductBySlug);

router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

router.route('/:id/reviews').post(protect, createProductReview);

module.exports = router;