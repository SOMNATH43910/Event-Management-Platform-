const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// In-memory user store (keyed by username)
const users = {};

/**
 * POST /api/auth/register
 * Body: { username, password, email }
 */
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ message: 'username, password, and email are required' });
  }

  if (users[username]) {
    return res.status(409).json({ message: 'Username already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    id: uuidv4(),
    username,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  };

  users[username] = user;

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: '24h',
  });

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: { id: user.id, username: user.username, email: user.email },
  });
});

/**
 * POST /api/auth/login
 * Body: { username, password }
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'username and password are required' });
  }

  const user = users[username];
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: '24h',
  });

  res.json({
    message: 'Login successful',
    token,
    user: { id: user.id, username: user.username, email: user.email },
  });
});

// Export users for testing
module.exports = router;
module.exports.users = users;
