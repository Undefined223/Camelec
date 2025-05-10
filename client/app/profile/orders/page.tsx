"use client";
import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import UserContext from '@/app/context/InfoPlusProvider';
import { NextPage } from 'next';
import axiosInstance from '@/app/components/AxiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faBox, faTruck, faCreditCard, faMapMarkerAlt, faCalendar } from '@fortawesome/free-solid-svg-icons';

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
                    const response = await axiosInstance.get(`/api/orders/user/${user._id}`);
                    setOrders(response.data);
                    console.log(response);
                } catch (error) {
                    console.error('Error fetching orders:', error);
                }
            };
            fetchOrders();
        }
    }, [user]);

    // Electrical pulse animation for the cards
    const pulseVariants = {
        pulse: {
            boxShadow: [
                "0 0 0 0 rgba(59, 130, 246, 0)",
                "0 0 0 10px rgba(59, 130, 246, 0.2)",
                "0 0 0 5px rgba(59, 130, 246, 0)"
            ],
            transition: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 2
            }
        }
    };

    // Lightning bolt animation
    const boltVariants = {
        hidden: { opacity: 0, scale: 0 },
        visible: { 
            opacity: [0, 1, 0.8, 1, 0],
            scale: [0, 1.2, 0.9, 1, 0.9],
            transition: { duration: 0.5 }
        }
    };

    // Get status color based on order status
    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Delivered':
                return 'bg-green-500';
            case 'Processing':
                return 'bg-yellow-500';
            case 'Cancelled':
                return 'bg-red-500';
            case 'Shipping':
                return 'bg-blue-500';
            default:
                return 'bg-sky-500';
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <div className="p-6 bg-gradient-to-b from-white to-sky-50 min-h-screen relative z-10 ">
            <h1 className="text-2xl font-bold mb-6 text-sky-700 flex items-center">
                <FontAwesomeIcon icon={faBolt} className="mr-2 text-yellow-400" />
                Your Power Orders
            </h1>
            
            {orders.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <FontAwesomeIcon icon={faBox} className="text-5xl text-sky-400 mb-4" />
                    <p className="text-lg text-sky-700">No power orders found.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <motion.div
                            key={order._id}
                            className="bg-white p-6 rounded-lg shadow-md border border-sky-100 overflow-hidden relative"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            whileHover={{ scale: 1.01 }}
                            variants={pulseVariants}
                            whileHover="pulse"
                        >
                            {/* Top energy bar */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 to-blue-500"></div>
                            
                            {/* Lightning bolt animation */}
                            <div className="absolute top-2 right-4">
                                <motion.div 
                                    initial="hidden"
                                    animate="visible"
                                    variants={boltVariants}
                                >
                                    <FontAwesomeIcon icon={faBolt} className="text-yellow-400" />
                                </motion.div>
                            </div>
                            
                            <div className="flex flex-col md:flex-row md:justify-between mb-4">
                                <div>
                                    <h2 className="text-xl font-semibold mb-1 text-sky-800">Order #{order._id.slice(-6)}</h2>
                                    <div className="flex items-center text-sm text-sky-600 mb-2">
                                        <FontAwesomeIcon icon={faCalendar} className="mr-1" />
                                        {order.createdAt ? formatDate(order.createdAt) : 'Date unavailable'}
                                    </div>
                                </div>
                                <div className="mt-2 md:mt-0">
                                    <div className="text-lg font-bold text-sky-700">{order.totalPrice / 1000} TND</div>
                                    <div className="flex mt-2 space-x-2">
                                        <span className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(order.orderStatus)}`}>
                                            {order.orderStatus}
                                        </span>
                                        <span className={`px-2 py-1 rounded-full text-xs text-white ${order.paymentStatus === 'Paid' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                                            {order.paymentStatus}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="flex items-start">
                                    <FontAwesomeIcon icon={faCreditCard} className="mt-1 mr-2 text-sky-500" />
                                    <div>
                                        <h3 className="font-semibold text-sky-700">Payment Method</h3>
                                        <p className="text-sky-600">{order.paymentMethod}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mt-1 mr-2 text-sky-500" />
                                    <div>
                                        <h3 className="font-semibold text-sky-700">Shipping Address</h3>
                                        <p className="text-sky-600 text-sm">
                                            {order.shippingAddress.address}, {order.shippingAddress.city}, 
                                            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold mb-3 text-sky-700 flex items-center">
                                    <FontAwesomeIcon icon={faBox} className="mr-2 text-sky-500" />
                                    Order Items
                                </h3>
                                <div className="bg-sky-50 rounded-lg p-4">
                                    <ul className="divide-y divide-sky-100">
                                        {order.orderItems.map((item, index) => (
                                            <motion.li
                                                key={index}
                                                className="flex items-center py-3"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                            >
                                                <div className="w-16 h-16 bg-white rounded-md shadow-sm overflow-hidden flex-shrink-0 border border-sky-100">
                                                    <img
                                                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${item.product.avatars[0]}`}
                                                        alt={item.product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="ml-4 flex-grow">
                                                    <p className="font-semibold text-sky-800">{item.product.name}</p>
                                                    <div className="flex justify-between mt-1">
                                                        <p className="text-sm text-sky-600">Qty: {item.quantity}</p>
                                                        <p className="text-sm font-medium text-sky-700">{item.product.price} TND</p>
                                                    </div>
                                                </div>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            
                            {/* Bottom energy pulse line */}
                            <div className="mt-6 flex justify-between items-center">
                                <div className="w-full h-1 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full"></div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Page;