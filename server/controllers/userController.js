const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

// Function to format user data
const formatUserData = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    pic: user.pic,
    isAdmin: user.isAdmin,
    verified: user.verified,
    role: user.role,
    address: user.address,
    token: generateToken(user._id),
});

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;
    const pic = req.file;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let picData;
    if (pic) {
        picData = {
            data: pic.path,
            contentType: pic.mimetype,
        };
    } else {
        picData = {
            data: 'uploads/default.jpg',
            contentType: 'image/jpeg',
        };
    }

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            pic: picData,
            role,
        });

        res.status(201).json(formatUserData(user));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user' });
    }
});

// Authenticate user and get token
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json(formatUserData(user));
    } else {
        res.status(401);
        throw new Error("Invalid Email or Password");
    }
});

// Update user
const updateUser = asyncHandler(async (req, res) => {
    try {
        const { name, email, newPassword, address, discount, isAdmin } = req.body;
        const pic = req.file;
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Only allow admin to update admin status
        if (req.body.isAdmin !== undefined && req.user.isAdmin) {
            user.isAdmin = req.body.isAdmin;
        } else if (req.body.isAdmin !== undefined) {
            return res.status(403).json({ message: 'Not authorized to change admin status' });
        }

        if (newPassword) {
            user.password = await bcrypt.hash(newPassword, 10);
        }

        user.name = name || user.name;
        user.email = email || user.email;

        if (pic) {
            user.pic = {
                data: pic.path,
                contentType: pic.mimetype,
            };
        }

        if (discount !== undefined) {
            if (discount < 0 || discount > 100) {
                return res.status(400).json({ message: 'Discount must be between 0 and 100' });
            }
            Business.discount = discount;
        }


        if (address) {
            user.address = address;
        }

        await user.save();
        res.json({ message: 'User updated successfully', user: formatUserData(user) });
    } catch (error) {
        console.error('Error updating user', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users.map(formatUserData));
    } catch (error) {
        console.error('Error fetching users', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Get user by ID
const getUserById = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            res.json(formatUserData(user));
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = { registerUser, authUser, updateUser, getAllUsers, getUserById };
