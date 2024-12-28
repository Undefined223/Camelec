// middleware/adminMiddleware.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// Protect middleware to ensure the user is authenticated
const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
});

// Admin middleware to ensure the user is an admin
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied, not an admin' });
    }
};

// Middleware to ensure the user is either an admin or the account owner
const adminOrOwner = asyncHandler(async (req, res, next) => {
    try {
        // Check if the user is an admin
        if (req.user && req.user.isAdmin) {
            return next();
        }

        // Check if the user is the account owner
        const userId = req.params.id || req.body.id; // Adjust this based on your request data
        if (req.user && req.user._id.toString() === userId) {
            return next();
        }

        res.status(403).json({ message: 'Access denied, not authorized' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = { protect, admin, adminOrOwner };
