const jwt = require('jsonwebtoken');

/**
 * Generate JWT token and set it as HTTP-only cookie
 * @param {string} id - User ID to encode in token
 * @param {object} res - Express response object to set cookie on
 * @returns {string} - The generated token
 */
const generateToken = (id, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  // Set secure HTTP-only cookie for authentication
  if (res) {
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
  }

  return token;
};

module.exports = generateToken;