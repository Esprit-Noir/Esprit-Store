const User = require('../models/User');
const jwt = require('jsonwebtoken');
const expressAsyncHandler = require('express-async-handler');

exports.authMiddleware = expressAsyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded?.id);

        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error('Not Authorized token expired, please login again');
    }
  } else {
    throw new Error('There is no token attached to header');
  }
});

exports.isAdmin = expressAsyncHandler(async (req, res, next) => {
  const { email } = req.user;

  const user = await User.findOne({ email });
  if (user.role !== 'admin') {
    throw new Error('You are not an admin');
  } else {
    next();
  }
});
