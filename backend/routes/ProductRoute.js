const express = require('express');
const {
  createProduct,
  getProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
} = require('../controller/ProductController');
const { isAdmin, authMiddleware } = require('../middlewares/AuthMiddleware');
const router = express.Router();

router.route('/create').post(authMiddleware, isAdmin, createProduct);
router.route('/').get(getAllProduct);
router.route('/wishlist').put(authMiddleware, addToWishlist);
router.route('/rating').put(authMiddleware, rating);

router
  .route('/:id')
  .get(getProduct)
  .put(authMiddleware, isAdmin, updateProduct)
  .delete(authMiddleware, isAdmin, deleteProduct);

module.exports = router;
