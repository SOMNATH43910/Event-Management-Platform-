const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'event_mgmt_secret_key_change_in_production';

/**
 * Middleware to verify JWT token.
 * Attaches decoded user payload to req.user.
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken, JWT_SECRET };
