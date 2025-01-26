    const mongoose = require('mongoose');

    const orderSchema = new mongoose.Schema({
        orderItems: [
            {
                product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true }
            }
        ],
        
        shippingAddress: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
            phone: { type: String, required: true }
        },
        paymentMethod: { type: String, required: true },
        itemsPrice: { type: Number, required: true },
        taxPrice: { type: Number, default: 0 },
        shippingPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        paymentRef: { type: String,  },
        paymentStatus: { type: String, default: 'Pending' }, // Can be 'Pending', 'Paid', etc.
        orderStatus: { type: String, default: 'Processing' }, // Can be 'Processing', 'Shipped', 'Delivered'
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    }, { timestamps: true });


    const Order = mongoose.model('Order', orderSchema);
    module.exports = Order
