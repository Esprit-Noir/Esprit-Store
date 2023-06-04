const Blog = require('../models/Blog');
// const User = require('../models/User');
const expressAsyncHandler = require('express-async-handler');
const { validateMongodbId } = require('../utils/ValidateMongdbId');

// Create a post
exports.createBlog = expressAsyncHandler(async (req, res) => {
  try {
    const blog = await Blog.create(req.body);

    res.json({
      success: true,
      blog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Get All Products
exports.getAllBlog = expressAsyncHandler(async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    throw new Error(error);
  }
});

// Update Product
exports.updateBlog = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const blog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Product is not found with this id',
      });
    }
    res.json(blog);
  } catch (error) {
    throw new Error(error);
  }
});

// Get Single Post
exports.getBlog = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const blog = await Blog.findById(id).populate('likes').populate('dislikes');
    await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      {
        new: true,
      }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Post is not found with this id',
      });
    }
    res.json(blog);
  } catch (error) {
    throw new Error(error);
  }
});

// Delete Product
exports.deleteBlog = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Post is not found with this id',
      });
    }
    res.json({
      message: 'Post Deleted successfully',
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Like a post
exports.likethePost = expressAsyncHandler(async (req, res) => {
  const { id } = req.body;
  validateMongodbId(id);
  const blog = await Blog.findById(id);

  const loginUserId = req?.user?._id;

  const isLiked = blog?.isLiked;

  const alredyDisliked = blog?.dislikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );

  if (alredyDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      id,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(blog);
  }

  if (isLiked) {
    const blog = await Blog.findByIdAndUpdate(
      id,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      id,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
});

// Dislike a post
exports.dislikethePost = expressAsyncHandler(async (req, res) => {
  const { id } = req.body;
  validateMongodbId(id);
  const blog = await Blog.findById(id);

  const loginUserId = req?.user?._id;

  const isDisliked = blog?.isDisliked;

  const alredyLiked = blog?.likes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );

  if (alredyLiked) {
    const blog = await Blog.findByIdAndUpdate(
      id,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  }

  if (isDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      id,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      id,
      {
        $push: { dislikes: loginUserId },
        isDisliked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
});
