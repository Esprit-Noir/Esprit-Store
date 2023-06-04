const expressAsyncHandler = require('express-async-handler');
const { validateMongodbId } = require('../utils/ValidateMongdbId');
const Coupon = require('../models/Coupon');

// Create a Coupon
exports.createCoupon = expressAsyncHandler(async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);

    res.json({
      success: true,
      coupon,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Get all coupn
exports.getAllCoupon = expressAsyncHandler(async (req, res) => {
  try {
    const allCoupon = await Coupon.find();
    res.json(allCoupon);
  } catch (error) {
    throw new Error(error);
  }
});

// Get Single Coupon
exports.getCoupon = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon is not found with this id',
      });
    }
    res.json(coupon);
  } catch (error) {
    throw new Error(error);
  }
});

// Update Coupon
exports.updateCoupon = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const coupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon is not found with this id',
      });
    }
    res.json(coupon);
  } catch (error) {
    throw new Error(error);
  }
});

// Delete Coupon
exports.deleteCoupon = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon is not found with this id',
      });
    }
    res.json({
      message: 'Coupon Deleted successfully',
    });
  } catch (error) {
    throw new Error(error);
  }
});
