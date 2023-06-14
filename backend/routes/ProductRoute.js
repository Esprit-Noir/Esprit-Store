const express = require('express');
const {
  createProduct,
  getProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
  uploadImage,
} = require('../controller/ProductController');
const {
  uploadPhoto,
  productImageResize,
} = require('../middlewares/uploadImage');
const { isAdmin, authMiddleware } = require('../middlewares/AuthMiddleware');
const router = express.Router();

router.route('/create').post(authMiddleware, isAdmin, createProduct);
router
  .route('/upload/:id')
  .put(
    authMiddleware,
    isAdmin,
    uploadPhoto.array('images', 10),
    productImageResize,
    uploadImage
  );
router.route('/').get(getAllProduct);
router.route('/wishlist').put(authMiddleware, addToWishlist);
router.route('/rating').put(authMiddleware, rating);

router
  .route('/:id')
  .get(getProduct)
  .put(authMiddleware, isAdmin, updateProduct)
  .delete(authMiddleware, isAdmin, deleteProduct);

module.exports = router;
