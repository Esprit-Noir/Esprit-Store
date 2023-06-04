const Category = require('../models/ProductCategory');
const expressAsyncHandler = require('express-async-handler');
const { validateMongodbId } = require('../utils/ValidateMongdbId');

// Create Category
exports.createCategory = expressAsyncHandler(async (req, res) => {
  try {
    const category = await Category.create(req.body);

    res.json({
      success: true,
      category,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Get All Catgeory
exports.getAllCategories = expressAsyncHandler(async (req, res) => {
  try {
    const allCategories = await Category.find();
    res.json(allCategories);
  } catch (error) {
    throw new Error(error);
  }
});

// Get Single Category
exports.getCategory = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category is not found with this id',
      });
    }
    res.json(category);
  } catch (error) {
    throw new Error(error);
  }
});

// Update Category
exports.updateCategory = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const category = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category is not found with this id',
      });
    }
    res.json(category);
  } catch (error) {
    throw new Error(error);
  }
});

// Delete Product
exports.deleteCategory = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category is not found with this id',
      });
    }
    res.json({
      message: 'Category Deleted successfully',
    });
  } catch (error) {
    throw new Error(error);
  }
});
