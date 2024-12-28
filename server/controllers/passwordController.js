
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { transporter } = require('../utils/transporter');
const { validationResult } = require('express-validator');
require("dotenv").config();

const jwt = require('jsonwebtoken')

const generateResetToken = require('../config/generateResetToken')



const forgotPassword = asyncHandler(async (req, res) => {
    // Extract the email from request body
    const { email } = req.body;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = generateResetToken(user._id);

    user.resetToken = resetToken;
    await user.save();

  
    // Generate reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
    const message = `
        <h1>Password Reset</h1>
        <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
    `;

    // Send password reset email
    try {
        await transporter.sendMail({
            to: email,
            subject: 'Password Reset',
            html: message,
        });

        res.json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('Error sending email', error);
        res.status(500).json({ message: 'Error sending email' });
    }
});

const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const decodedToken = Buffer.from(token, 'base64').toString();

        jwt.verify(decodedToken, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(400).json({ message: 'Invalid token' });
            }

            const { userId } = decoded;

            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Update user's password
            user.password = newPassword;
            user.resetToken = null; // Reset the reset token after password change
            await user.save();

            res.status(200).json({ message: 'Password updated successfully' });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = { forgotPassword, resetPassword };
