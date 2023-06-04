const expressAsyncHandler = require('express-async-handler');
const User = require('../models/User');
const { generateToken } = require('../config/JwToken');
const { validateMongodbId } = require('../utils/ValidateMongdbId');
const { generateRefreshToken } = require('../config/RefreshToken');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('./EmailController');
const crypto = require('crypto');

// Register User
exports.register = expressAsyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email });
  if (!findUser) {
    const user = await User.create(req.body);
    res.status(201).json({
      success: true,
      message: 'User created successfully...',
      user,
    });
  } else {
    throw new Error('User already exists');
  }
});

// Login User
exports.login = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.isPasswordMatch(password))) {
    const refreshToken = await generateRefreshToken(user?._id);

    await User.findByIdAndUpdate(
      user.id,
      { refreshToken: refreshToken },
      { new: true }
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
      _id: user?._id,
      firstname: user?.firstname,
      lastname: user?.lastname,
      email: user?.email,
      mobile: user?.mobile,
      token: generateToken(user?._id),
    });
  } else {
    throw new Error('Invalid credentials please try agains');
  }
});

// Handle refresh token
exports.handleRefreshToken = expressAsyncHandler(async (req, res) => {
  const cookie = req.cookies;

  if (!cookie?.refreshToken) throw new Error('No Refresh token in cookies');

  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });

  if (!user) throw new Error('No Refresh Token present in db or not matched');

  jwt.verify(refreshToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error('There is something wrong with refresh token');
    }
    const accesstoken = generateToken(user?._id);
    res.json({ accesstoken });
  });
});

// Logout functionality
exports.logout = expressAsyncHandler(async (req, res) => {
  const cookie = req.cookies;

  if (!cookie?.refreshToken) throw new Error('No Refresh token in cookies');

  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie('refreshToken', { httpOnly: true, secure: true });
    res.sendStatus(204);
  }
  await User.findOneAndUpdate({ refreshToken }, { refreshToken: '' });
  res.clearCookie('refreshToken', { httpOnly: true, secure: true });
  res.sendStatus(204);
});

// Get All Users
exports.getUsers = expressAsyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    throw new Error(error);
  }
});

// Get Single user

exports.getSingleUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongodbId(id);

  try {
    const user = await User.findById(id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Delete User
exports.deleteUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  validateMongodbId(id);

  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Update user
exports.updateUser = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;

  validateMongodbId(_id);

  try {
    const user = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
        runValidators: true,
        useUnified: false,
      }
    );
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Blocked user
exports.blockUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    await User.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
    res.json({
      message: 'User Blocked',
    });
  } catch (error) {
    throw new Error(error);
  }
});

// UnBlocked user
exports.unblockUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    await User.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
    res.json({
      message: 'User Unblocked',
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Update Password
exports.updatedPassword = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongodbId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatePassword = await user.save();
    res.json(updatePassword);
  } else {
    res.json(user);
  }
});

exports.forgotPasswordToken = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) throw new Error('User not found with this email');
  const token = user.createPasswordResetToken();
  await user.save();
  const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now <a href="http://localhost:5000/api/user/reset-password-token/${token}">Click here</a>`;
  const data = {
    to: email,
    text: 'Hey User',
    subject: 'Forgot password link',
    html: resetURL,
  };
  sendEmail(data);
  res.json(token);
  try {
  } catch (error) {
    throw new Error(error);
  }
});

exports.resetPassword = expressAsyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) throw new Error('Token Expired, Please try again later ');
  user.password = password;
  user.passwordResetExpires = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.json(user);
});
