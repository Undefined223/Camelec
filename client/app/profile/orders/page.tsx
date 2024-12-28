"use client";
import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import UserContext from '@/app/context/InfoPlusProvider';
import { NextPage } from 'next';
import axiosInstance from '@/app/components/AxiosInstance';

interface Props { }

interface Product {
    name: string;
    price: number;
    avatars: string[];
}
interface OrderItem {
    product: Product;
    quantity: number;
}

interface Order {
    _id: string;
    orderItems: OrderItem[];
    shippingAddress: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
        phone: string;
    };
    paymentMethod: string;
    itemsPrice: number;
    taxPrice: number;
    orderStatus: string;
    paymentStatus: string;
    shippingPrice: number;
    totalPrice: number;
    createdAt: string;
}

const Page: NextPage<Props> = () => {
    const { user } = useContext(UserContext);
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        if (user) {
            const fetchOrders = async () => {
                try {
                    const response = await axiosInstance.get(`/api/orders/${user._id}`);
                    setOrders(response.data);
                    console.log(response)
                } catch (error) {
                    console.error('Error fetching orders:', error);
                }
            };
            fetchOrders();
        }
    }, [user]);

    return (
        <div className="p-6 bg-gray-900 text-white min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
            {orders.length === 0 ? (
                <p className="text-lg">No orders found.</p>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <motion.div
                            key={order._id}
                            className="bg-gray-800 p-4 rounded-lg shadow-lg"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-xl font-semibold mb-2">Order ID: {order._id}</h2>
                            <p className="text-lg mb-2">Total Price: {order.totalPrice / 1000} TND</p>
                            <p className="text-sm mb-2">Payment Status: {order.paymentStatus}</p>
                            <p className="text-sm mb-2">Order Status: {order.orderStatus}</p>
                            <p className="text-sm mb-2">Payment Method: {order.paymentMethod}</p>
                            <p className="text-sm mb-2">Shipping Address: {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                            <div className="mt-2">
                                <h3 className="text-lg font-semibold mb-2">Order Items:</h3>
                                <ul className="space-y-2">
                                    {order.orderItems.map((item, index) => (
                                        <motion.li
                                            key={index}
                                            className="flex items-center space-x-4"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${item.product.avatars[0]}`}
                                                alt={item.product.name}
                                                className="w-16 h-16 object-cover rounded-md"
                                            />
                                            <div>
                                                <p className="font-semibold">{item.product.name}</p>
                                                <p className="text-sm">Quantity: {item.quantity}</p>
                                                <p className="text-sm">Price: {item.product.price} TND</p>
                                            </div>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Page;
