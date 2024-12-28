const Order = require('../models/OrderSchema');
const axios = require('axios');
const User = require('../models/userModel');
const { sendOrderConfirmationEmail } = require('../services/emailService')

const splitName = (fullName) => {
    const [firstName, ...lastNameArr] = fullName.split(' ');
    const lastName = lastNameArr.join(' ');
    return { firstName, lastName };
};


const createOrder = async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paymentToken,
            userId: userId,
        } = req.body;

        console.log("userId:", userId)
        if (!userId) {
            return res.status(400).json({ message: 'user is required' });
        }

        const user = await User.findById(userId)

        console.log('user', user)
        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'Order items are required' });
        }

        const totalPriceInCents = totalPrice * 1000; // Convert to smallest unit if needed

        const newOrder = new Order({
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice: totalPriceInCents, // Ensure this is in the smallest unit
            userId // Add this line
        });




        const { firstName, lastName } = splitName(user.name);

        const savedOrder = await newOrder.save();

        if (paymentMethod === 'creditCard') {
            try {
                const paymentResponse = await axios.post('https://api.konnect.network/api/v2/payments/init-payment', {
                    receiverWalletId: process.env.KONNECT_WALLET_ID,
                    token: "TND",
                    amount: totalPriceInCents, // Send as integer in smallest unit
                    type: "immediate",
                    description: 'Order payment',
                    acceptedPaymentMethods: ['wallet', 'bank_card', 'e-DINAR'],
                    lifespan: 10,
                    checkoutForm: true,
                    addPaymentFeesToAmount: true,
                    firstName: firstName,
                    lastName: lastName,
                    phoneNumber: shippingAddress.phone,
                    email: user.email,
                    orderId: savedOrder._id,
                    webhook: 'https://d421-102-156-110-99.ngrok-free.app/webhook',
                    silentWebhook: true,
                    successUrl: 'https://gateway.sandbox.konnect.network/payment-success',
                    failUrl: 'https://gateway.sandbox.konnect.network/payment-failure',
                    theme: 'dark'
                }, {
                    headers: {
                        'x-api-key': process.env.API_KEY,
                        'Content-Type': 'application/json'
                    }
                });

                console.log(paymentResponse)
                if (paymentResponse.data && paymentResponse.data.payUrl) {
                    savedOrder.paymentRef = paymentResponse.data.paymentRef;
                    await savedOrder.save();

                    const populatedOrder = await Order.findById(savedOrder._id).populate('orderItems.product');
                    
                    await sendOrderConfirmationEmail(user, populatedOrder);


                    return res.status(200).json({
                        message: 'Payment initiated. Please complete the payment using the provided URL.',
                        paymentUrl: paymentResponse.data.payUrl,
                        paymentRef: paymentResponse.data.paymentRef,
                        orderId: savedOrder._id
                    });



                } else {
                    return res.status(400).json({ message: 'Payment initiation failed. Please try again.' });
                }
            } catch (paymentError) {
                console.error('Error initiating payment:', paymentError);
                return res.status(500).json({ message: 'Payment initiation error' });
            }
        } else {
            const populatedOrder = await Order.findById(savedOrder._id).populate('orderItems.product');
            await sendOrderConfirmationEmail(user, populatedOrder);

            return res.status(200).json({
                message: 'Order placed successfully with Cash on Delivery!',
                order: savedOrder
            });
        }
    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const getOrdersByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        const orders = await Order.find({ userId })
            .populate({
                path: 'orderItems.product',
            })
            .populate({
                path: 'userId',
            })
            .sort({ createdAt: -1 });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }

        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

const getOrders = async (req, res) => {
    try {
        // Fetch all orders, sorted by creation date in descending order
        const orders = await Order.find()
            .populate({
                path: 'orderItems.product', // Ensure this matches your schema
            })

            .sort({ createdAt: -1 });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }

        return res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const updateOrderStatus = async (req, res) => {
    const { orderId } = req.params; // Get the order ID from the request params
    const { status } = req.body; // Get the new status from the request body

    try {
        // Find the order by ID and update the order status
        const order = await Order.findByIdAndUpdate(
            orderId,
            { orderStatus: status },
            { new: true } // Return the updated order
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({ message: 'Order status updated successfully', order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, failed to update order status' });
    }
};

module.exports = { createOrder, getOrdersByUser, getOrders, updateOrderStatus };