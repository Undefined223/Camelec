// routes/passwordRoutes.js

const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { forgotPassword, resetPassword } = require('../controllers/passwordController');

// Request password reset
router.post('/forgot-password', [
    check('email', 'Please include a valid email').isEmail(),
], forgotPassword);

// Reset password
router.post('/reset-password/:token', [
    check('password', 'Password is required').exists(),
], resetPassword);

module.exports = router;
