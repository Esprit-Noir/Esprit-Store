const express = require('express');
const {
  register,
  login,
  getUsers,
  getSingleUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatedPassword,
  forgotPasswordToken,
  resetPassword,
} = require('../controller/UserController');
const { authMiddleware, isAdmin } = require('../middlewares/AuthMiddleware');
const router = express.Router();

router.route('/register').post(register);
router.route('/forgot-password-token').post(forgotPasswordToken);
router.route('reset-password/:token').put(resetPassword);
router.route('/password').put(authMiddleware, updatedPassword);
router.route('/login').post(login);
router.route('/all').get(getUsers);
router.route('/refresh').get(handleRefreshToken);
router.route('/logout').get(logout);
router
  .route('/:id')
  .get(authMiddleware, isAdmin, getSingleUser)
  .delete(deleteUser);
router.route('/edit-user').put(authMiddleware, updateUser);
router.route('/block-user/:id').put(authMiddleware, isAdmin, blockUser);
router.route('/unblock-user/:id').put(authMiddleware, isAdmin, unblockUser);

module.exports = router;
