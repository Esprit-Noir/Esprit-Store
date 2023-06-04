const express = require('express');
const { isAdmin, authMiddleware } = require('../middlewares/AuthMiddleware');
const {
  createBlog,
  getBlog,
  updateBlog,
  deleteBlog,
  getAllBlog,
  likethePost,
  dislikethePost,
} = require('../controller/BogController');
const router = express.Router();

router.route('/create').post(authMiddleware, isAdmin, createBlog);
router.route('/likes').put(authMiddleware, likethePost);
router.route('/dislikes').put(authMiddleware, dislikethePost);

router.route('/:id').put(authMiddleware, isAdmin, updateBlog);
router.route('/:id').get(getBlog);
router.route('/').get(getAllBlog);

router.route('/:id').delete(authMiddleware, isAdmin, deleteBlog);

module.exports = router;
