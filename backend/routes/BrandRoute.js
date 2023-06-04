const express = require('express');
const { isAdmin, authMiddleware } = require('../middlewares/AuthMiddleware');
const {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand,
  getAllBrands,
} = require('../controller/BrandController');

const router = express.Router();

router.route('/create').post(authMiddleware, isAdmin, createBrand);
router
  .route('/:id')
  .put(authMiddleware, isAdmin, updateBrand)
  .delete(authMiddleware, isAdmin, deleteBrand)
  .get(getBrand);
router.route('/').get(getAllBrands);

module.exports = router;
