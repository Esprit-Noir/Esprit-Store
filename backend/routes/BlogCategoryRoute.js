const express = require('express');
const { isAdmin, authMiddleware } = require('../middlewares/AuthMiddleware');
const {
  createCategory,
  updateCategory,
  getAllCategories,
  deleteCategory,
  getCategory,
} = require('../controller/BlogCategoryController');

const router = express.Router();

router.route('/create').post(authMiddleware, isAdmin, createCategory);
router
  .route('/:id')
  .put(authMiddleware, isAdmin, updateCategory)
  .delete(authMiddleware, isAdmin, deleteCategory)
  .get(getCategory);
router.route('/').get(getAllCategories);

module.exports = router;
