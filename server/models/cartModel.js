const mongoose = require("mongoose");
const Schema = mongoose.Schema


const CartSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    products: [
        {
            productId: { type: String, required: true },
            quantity: { type: Number, required: true },
        },
    ],
    created_at: {
        type: Date,
        default: Date.now(),
    },
    updated_at: {
        type: Date,
        default: Date.now(),
    },
});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart