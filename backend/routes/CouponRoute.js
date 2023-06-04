const express = require('express');
const { isAdmin, authMiddleware } = require('../middlewares/AuthMiddleware');
const {
  createCoupon,
  getAllCoupon,
  getCoupon,
  updateCoupon,
  deleteCoupon,
} = require('../controller/CouponController');

const router = express.Router();

router.route('/create').post(authMiddleware, isAdmin, createCoupon);
router.route('/').get(getAllCoupon);
router
  .route('/:id')
  .get(getCoupon)
  .put(authMiddleware, isAdmin, updateCoupon)
  .delete(authMiddleware, isAdmin, deleteCoupon);

module.exports = router;
