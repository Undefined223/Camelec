const asyncHandler = require("express-async-handler");
const Business = require("../models/BusinessModel");
const generateToken = require("../config/generateToken");
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

// Function to format Business data
const formatBusinessData = (Business) => ({
    _id: Business._id,
    name: Business.name,
    email: Business.email,
    verified: Business.verified,
    address: Business.address,
    token: generateToken(Business._id),
});

// Register a new Business
const registerBusiness = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

  

    try {
        const BusinessExists = await Business.findOne({ email });

        if (BusinessExists) {
            return res.status(400).json({ message: 'Business already exists' });
        }

        const Business = await Business.create({
            name,
            email,
            password,
            role,
        });

        res.status(201).json(formatBusinessData(Business));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating Business' });
    }
});

// Authenticate Business and get token
const authBusiness = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const Business = await Business.findOne({ email });

    if (Business && (await Business.matchPassword(password))) {
        res.json(formatBusinessData(Business));
    } else {
        res.status(401);
        throw new Error("Invalid Email or Password");
    }
});

// Update Business
const updateBusiness = asyncHandler(async (req, res) => {
    try {
        const { name, email, newPassword, address, isAdmin, discount, verified } = req.body;
        const BusinessId = req.params.id;

        if (!BusinessId) {
            return res.status(400).json({ message: 'Business ID is required' });
        }

        const Business = await Business.findById(BusinessId);
        if (!Business) {
            return res.status(404).json({ message: 'Business not found' });
        }

        // Only allow admin to update admin status
        if (req.body.isAdmin !== undefined && req.Business.isAdmin) {
            Business.isAdmin = req.body.isAdmin;
        } else if (req.body.isAdmin !== undefined) {
            return res.status(403).json({ message: 'Not authorized to change admin status' });
        }

        if (newPassword) {
            Business.password = await bcrypt.hash(newPassword, 10);
        }

        Business.name = name || Business.name;
        Business.email = email || Business.email;

        if (address) {
            Business.address = address;
        }

        // Update discount if provided and within valid range
        if (discount !== undefined) {
            if (discount < 0 || discount > 100) {
                return res.status(400).json({ message: 'Discount must be between 0 and 100' });
            }
            Business.discount = discount;
        }

        // Update verified status if provided
        if (verified !== undefined) {
            Business.verified = verified;
        }

        await Business.save();
        res.json({ message: 'Business updated successfully', Business: formatBusinessData(Business) });
    } catch (error) {
        console.error('Error updating Business', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Get all Businesss
const getAllBusinesss = asyncHandler(async (req, res) => {
    try {
        const Businesss = await Business.find({});
        res.json(Businesss.map(formatBusinessData));
    } catch (error) {
        console.error('Error fetching Businesss', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Get Business by ID
const getBusinessById = asyncHandler(async (req, res) => {
    try {
        const Business = await Business.findById(req.params.id);
        if (Business) {
            res.json(formatBusinessData(Business));
        } else {
            res.status(404).json({ message: 'Business not found' });
        }
    } catch (error) {
        console.error('Error fetching Business', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = { registerBusiness, authBusiness, updateBusiness, getAllBusinesss, getBusinessById };
