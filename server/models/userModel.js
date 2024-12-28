const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [isEmail, 'Invalid email format'],
    },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    discount: { 
        type: Number, 
        default: 0, // Default to 0% discount
        min: 0, // Minimum discount is 0%
        max: 100, // Maximum discount is 100%
    },
    address: 
        {
            address: { type: String },
            city: { type: String },
            postalCode: { type: String },
            country: { type: String },
            phone: { type: String },
        }
}, {
    timestamps: true,
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    try {
        return await bcrypt.compare(enteredPassword, this.password);
    } catch (error) {
        console.error('Password comparison failed', error);
        throw new Error('Password comparison failed');
    }
};

userSchema.pre('save', async function (next) {
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

const User = mongoose.model('User', userSchema);

module.exports = User;
