// controllers/announcementController.js
const Announcement = require('../models/AnnouncmentModel');
const Product = require('../models/productModel');
const path = require('path');


module.exports = {
    createAnnouncement: async (req, res) => {
        try {
            console.log('Request body:', req.body);
            console.log('Request file:', req.file);
            console.log('All files:', req.files);
    
            const { text, productId } = req.body;
    
            if (!text || !productId) {
                return res.status(400).json({ message: 'Missing required fields' });
            }
    
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
    
            let imageUrl = null;
            if (req.file) {
                imageUrl = req.file.path;
                console.log('File uploaded:', req.file);
            } else {
                console.log('No file uploaded');
            }
    
            const announcement = new Announcement({
                text,
                imageUrl,
                product: product._id
            });
    
            await announcement.save();
    
            res.status(201).json(announcement);
        } catch (err) {
            console.error('Error in createAnnouncement:', err);
            res.status(500).json({ message: 'Server error', error: err.message });
        }
    },

    getAllAnnouncements: async (req, res) => {
        try {
            const announcements = await Announcement.find().populate('product');
            res.json(announcements);
        } catch (err) {
            console.error('Error in getAllAnnouncements:', err);
            res.status(500).json({ message: 'Server error' });
        }
    },

    updateAnnouncement: async (req, res) => {
        try {
            const { text, productId } = req.body;
            const product = await Product.findById(productId);

            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            let updateData = { text, product: product._id };

            if (req.file) {
                updateData.imageUrl = req.file.path;
            }

            const announcement = await Announcement.findByIdAndUpdate(
                req.params.id,
                updateData,
                { new: true }
            );

            if (!announcement) {
                return res.status(404).json({ message: 'Announcement not found' });
            }

            res.json(announcement);
        } catch (err) {
            console.error('Error in updateAnnouncement:', err);
            res.status(500).json({ message: 'Server error' });
        }
    },

    deleteAnnouncement: async (req, res) => {
        try {
            const announcement = await Announcement.findByIdAndDelete(req.params.id);

            if (!announcement) {
                return res.status(404).json({ message: 'Announcement not found' });
            }

            res.json({ message: 'Announcement deleted' });
        } catch (err) {
            console.error('Error in deleteAnnouncement:', err);
            res.status(500).json({ message: 'Server error' });
        }
    }
};