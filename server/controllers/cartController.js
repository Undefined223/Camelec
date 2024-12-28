const Cart = require('../models/cartModel');

module.exports = {
    createCart: (req, res) => {
        console.log('create Cart triggered');
        Cart.create(req.body)
            .then((newCart) => {
                console.log('request body:', req.body);
                res.json(newCart);
            })
            .catch((err) => console.log(err));
    },
    getCarts: (req, res) => {
        Cart.find({})
            .then((allCarts) => {
                console.log(allCarts);
                res.json(allCarts);
            })
            .catch((err) => console.log(err));
    },
    getOneCart: (req, res) => {
        Cart.findById(req.params.id)
            .then((oneCart) => {
                console.log(oneCart);
                res.json(oneCart);
            })
            .catch((err) => console.log(err));
    },
    getOneCartandUpdate: (req, res) => {
        Cart.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
            .then((updatedCart) => {
                console.log('updated Cart:', updatedCart);
                res.json(updatedCart);
            })
            .catch((err) => console.log(err));
    },
    getOneCartandDelete: (req, res) => {
        Cart.findByIdAndDelete(req.params.id)
            .then((deletedCart) => {
                console.log(deletedCart);
                res.json(deletedCart);
            })
            .catch((err) => console.log(err));
    },
};
