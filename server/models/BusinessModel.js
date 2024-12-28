const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isEmail } = require('validator');

const businessSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        unique: true,
        validate: [isEmail, 'Invalid email format'],
    },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    address: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        phone: { type: String, required: true },
    },
    discount: { 
        type: Number, 
        default: 0, // Default to 0% discount
        min: 0, // Minimum discount is 0%
        max: 100, // Maximum discount is 100%
    },
}, {
    timestamps: true,
});

businessSchema.methods.matchPassword = async function (enteredPassword) {
    try {
        return await bcrypt.compare(enteredPassword, this.password);
    } catch (error) {
        console.error('Password comparison failed', error);
        throw new Error('Password comparison failed');
    }
};

businessSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) {
            return next();
        }
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

const Business = mongoose.model('Business', businessSchema);

module.exports = Business;
