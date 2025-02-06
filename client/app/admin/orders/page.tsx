"use client";
import React, { useEffect, useState } from 'react';
import { IOrder } from '@/app/types/types';
import axiosInstance from '@/app/components/AxiosInstance';

const OrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch orders from the backend
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axiosInstance.get<IOrder[]>('/api/orders');
                setOrders(response.data);
            } catch (error) {
                setError('Failed to fetch orders. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Handle click on an order to show its details
    const handleOrderClick = (order: IOrder) => {
        setSelectedOrder(order);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg text-gray-600">Loading orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order List */}
                    <div className="lg:col-span-1">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Order History</h2>
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div
                                    key={order._id}
                                    onClick={() => handleOrderClick(order)}
                                    className={`p-6 bg-white rounded-lg shadow-sm cursor-pointer transition-all ${
                                        selectedOrder?._id === order._id
                                            ? 'border-2 border-blue-500'
                                            : 'hover:shadow-md'
                                    }`}
                                >
                                    <p className="text-lg font-medium text-gray-900">Order #{order._id.slice(-6)}</p>
                                    <p className="text-sm text-gray-500">Status: {order.orderStatus}</p>
                                    <p className="text-sm text-gray-500">
                                        Total: <span className="font-semibold">${order.totalPrice}</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Details</h2>
                        {selectedOrder ? (
                            <div className="bg-white rounded-lg shadow-sm p-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                    Order #{selectedOrder._id.slice(-6)}
                                </h3>
                                <div className="space-y-6">
                                    {/* Order Summary */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-800 mb-2">Shipping Address</h4>
                                            <p className="text-gray-600">
                                                {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city},{' '}
                                                {selectedOrder.shippingAddress.postalCode}, {selectedOrder.shippingAddress.country}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-800 mb-2">Payment Details</h4>
                                            <p className="text-gray-600">
                                                Method: {selectedOrder.paymentMethod}
                                            </p>
                                            <p className="text-gray-600">
                                                Status: <span className="font-semibold">{selectedOrder.paymentStatus}</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h4>
                                        <div className="space-y-4">
                                            {selectedOrder.orderItems.map((item, index) => (
                                                <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                                                    <div className="flex-1">
                                                        <p className="text-lg font-medium text-gray-900">
                                                            {item.product.name}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            Brand: {item.product.brand}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            Quantity: {item.quantity}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            Price: ${item.product.price}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-semibold text-gray-900">
                                                            ${item.quantity * item.product.price}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Order Totals */}
                                    <div className="pt-6 border-t border-gray-200">
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="text-gray-600">Subtotal</p>
                                            <p className="text-gray-900 font-semibold">${selectedOrder.itemsPrice}</p>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="text-gray-600">Shipping</p>
                                            <p className="text-gray-900 font-semibold">${selectedOrder.shippingPrice}</p>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="text-gray-600">Tax</p>
                                            <p className="text-gray-900 font-semibold">${selectedOrder.taxPrice}</p>
                                        </div>
                                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                                            <p className="text-xl font-bold text-gray-900">Total</p>
                                            <p className="text-xl font-bold text-gray-900">${selectedOrder.totalPrice}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-600">Select an order to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrdersPage;