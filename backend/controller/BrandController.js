const Brand = require('../models/Brand');
const expressAsyncHandler = require('express-async-handler');
const { validateMongodbId } = require('../utils/ValidateMongdbId');

// Create Category
exports.createBrand = expressAsyncHandler(async (req, res) => {
  try {
    const brand = await Brand.create(req.body);

    res.json({
      success: true,
      brand,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Get All Catgeory
exports.getAllBrands = expressAsyncHandler(async (req, res) => {
  try {
    const allBrands = await Brand.find();
    res.json(allBrands);
  } catch (error) {
    throw new Error(error);
  }
});

// Get Single Category
exports.getBrand = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const brand = await Brand.findById(id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand is not found with this id',
      });
    }
    res.json(brand);
  } catch (error) {
    throw new Error(error);
  }
});

// Update Category
exports.updateBrand = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const brand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Category is not found with this id',
      });
    }
    res.json(brand);
  } catch (error) {
    throw new Error(error);
  }
});

// Delete Product
exports.deleteBrand = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const brand = await Brand.findByIdAndDelete(id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand is not found with this id',
      });
    }
    res.json({
      message: 'Brand Deleted successfully',
    });
  } catch (error) {
    throw new Error(error);
  }
});
