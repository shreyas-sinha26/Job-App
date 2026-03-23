const express = require('express');
const { body } = require('express-validator');
const { signup, login } = require('../controllers/authController');

const router = express.Router();

router.post(
  '/signup',
  [
    body('name', 'Name must be at least 2 characters').notEmpty().trim().isLength({ min: 2 }),
    body('email', 'Please include a valid email').isEmail().normalizeEmail(),
    body('password', 'Password must be at least 8 characters').isLength({ min: 8 }),
    body('role', 'Invalid role').isIn(['jobseeker', 'employer'])
  ],
  signup
);

router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').notEmpty()
  ],
  login
);

module.exports = router;
