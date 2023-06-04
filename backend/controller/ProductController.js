const expressAsyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const { default: slugify } = require('slugify');
const User = require('../models/User');
const { query } = require('express');

// Create Product
exports.createProduct = expressAsyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const product = await Product.create(req.body);
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});

// Get Single Product
exports.getProduct = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product is not found with this id',
      });
    }
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});

// Get All Products
exports.getAllProduct = expressAsyncHandler(async (req, res) => {
  try {
    // Filtering
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Product.find(JSON.parse(queryStr));

    // SOrting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // Pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error('This page does not exists');
    }

    console.log(page, limit, skip);

    const products = await query;

    res.json(products);
  } catch (error) {
    throw new Error(error);
  }
});

// Update Product
exports.updateProduct = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product is not found with this id',
      });
    }
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});

// Delete Product
exports.deleteProduct = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product is not found with this id',
      });
    }
    res.json({
      message: 'Product Deleted successfully',
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Add To wish list
exports.addToWishlist = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;

  try {
    const user = await User.findById(_id);
    const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);

    if (alreadyadded) {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: prodId },
        },
        {
          new: true,
        }
      );
      res.json(user);
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: prodId },
        },
        {
          new: true,
        }
      );
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Rating Product
exports.rating = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, comment, prodId } = req.body;
  try {
    const product = await Product.findById(prodId);
    let alreadyRated = product.ratings.find(
      (userId) => userId.postedBy.toString() === _id.toString()
    );

    if (alreadyRated) {
      await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { 'ratings.$.star': star, 'ratings.$.comment': comment },
        },
        {
          new: true,
        }
      );
    } else {
      await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedBy: _id,
            },
          },
        },
        { new: true }
      );
    }

    const getallratings = await Product.findById(prodId);
    let totalRating = getallratings.ratings.length;
    let ratingsum = getallratings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(ratingsum / totalRating);
    let finalProduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalrating: actualRating,
      },
      { new: true }
    );

    res.json(finalProduct);
  } catch (error) {
    throw new Error(error);
  }
});
