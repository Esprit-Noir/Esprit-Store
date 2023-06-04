const jwt = require('jsonwebtoken');

exports.generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: '3d' });
};
