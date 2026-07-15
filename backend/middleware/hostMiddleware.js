/**
 * Middleware to restrict access to host-only routes
 * Must be used after the protect middleware
 */
const hostAccess = (req, res, next) => {
  if (req.user && req.user.isHost) {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as a host');
  }
};

module.exports = { hostAccess };