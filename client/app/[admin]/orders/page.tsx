"use client";
import axiosInstance from '@/app/components/AxiosInstance';
import { NextPage } from 'next';
import { Suspense, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Modal from '@/app/components/ui/modal';
import UserContext from '@/app/context/InfoPlusProvider';
import Loading from '@/app/components/Loading';

interface Order {
    _id: string;
    totalPrice: number;
    paymentStatus: string;
    orderStatus: string;
    createdAt: string;
    paymentRef: string;
    orderItems: Array<{
        product: {
            name: string;
            price: number;
            image: string;
            avatars: string[]; 
        };
        quantity: number;
    }>;
    shippingAddress: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
        phone: string;
    };
    userId: string;
}

interface PaymentDetails {
    id: string;
    amount: number;
    status: string;
    currency: string;
    method: string;
    created_at: string;
    orderId: string;
    acceptedPaymentMethods: string[];
    successUrl: string;
    failUrl: string;
    webhook: string;
    type: string;
    paymentDetails: {
        phoneNumber: string;
        email: string;
        name: string;
    };
    updatedAt: string;
}

interface User {
    name: string;
    email: string;
    addresses: Array<any>;
    pic: {
        data: string;
        contentType: string;
    };
    token: string;
}

interface Props { }

const Page: NextPage<Props> = () => {
    const { user } = useContext(UserContext);
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [selectedPaymentDetails, setSelectedPaymentDetails] = useState<PaymentDetails | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [modalContent, setModalContent] = useState<'details' | 'items' | 'user' | 'payment' | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
    const [newOrderStatus, setNewOrderStatus] = useState<string>('');

    useEffect(() => {
        if (user) { // Check if user is not null
            const fetchOrders = async () => {
                try {
                    const { data } = await axiosInstance.get("/api/orders/", {
                        headers: { Authorization: `Bearer ${user.token}` }
                    });
                    setOrders(data);
                    toast.success("Orders loaded successfully");
                } catch (err) {
                    console.error(err);
                    toast.error("Failed to load orders");
                }
            };
            fetchOrders();
        }
    }, [user]);

    const openModal = (order: Order, content: 'details' | 'items' | 'user' | 'payment') => {
        setSelectedOrder(order);
        setModalContent(content);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedOrder(null);
        setSelectedPaymentDetails(null);
        setSelectedUser(null);
        setModalContent(null);
        setIsModalOpen(false);
    };

    const fetchPaymentDetails = async (order: Order) => {
        if (!user) {
            toast.error("User is not authenticated");
            return;
        }
        try {
            const { data } = await axiosInstance.get(`https://api.konnect.network/api/v2/payments/${order.paymentRef}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setSelectedPaymentDetails(data.payment);
            openModal(order, 'payment');
        } catch (err) {
            console.error(err);
            toast.error("Failed to load payment details");
        }
    };

    const fetchUserDetails = async (userId: string) => {
        if (!user) {
            toast.error("User is not authenticated");
            return;
        }
        try {
            const { data } = await axiosInstance.get(`/api/user/${userId}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setSelectedUser(data);
            openModal(selectedOrder!, 'user');
        } catch (err) {
            console.error(err);
            toast.error("Failed to load user details");
        }
    };

    const handleStatusDoubleClick = (orderId: string, currentStatus: string) => {
        setEditingOrderId(orderId);
        setNewOrderStatus(currentStatus);
    };

    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>, orderId: string) => {
        const newStatus = e.target.value;
        setNewOrderStatus(newStatus);

        if (!user) {
            toast.error("User is not authenticated");
            return;
        }
        try {
            await axiosInstance.put(`/api/orders/${orderId}/status`, {
                status: newStatus
            }, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            });

            // Update the orders array with the new status
            setOrders(orders.map(order => order._id === orderId ? { ...order, orderStatus: newStatus } : order));

            toast.success("Order status updated successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update order status");
        } finally {
            setEditingOrderId(null);
        }
    };

    const handleStatusSave = () => {
        setEditingOrderId(null);
    };

    return (
        <Suspense fallback={<Loading />}>

        <div className="min-h-screen bg-slate-900 text-white p-8 relative z-10">
            <h1 className="text-3xl font-bold mb-6">Orders</h1>
            <div className="overflow-x-auto">
                <table className="w-full bg-slate-800 rounded-lg overflow-hidden">
                    <thead className="bg-slate-700">
                        <tr>
                            <th className="px-6 py-3 text-left">Order ID</th>
                            <th className="px-6 py-3 text-left">Total Price</th>
                            <th className="px-6 py-3 text-left">Order Status</th>
                            <th className="px-6 py-3 text-left">Date</th>
                            <th className="px-6 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id} className="hover:bg-slate-700 transition-colors">
                                <td className="px-6 py-4">{order._id}</td>
                                <td className="px-6 py-4">TND {(order.totalPrice / 1000).toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    {editingOrderId === order._id ? (
                                        <select
                                            value={newOrderStatus}
                                            onChange={(e) => handleStatusChange(e, order._id)}
                                            onBlur={() => handleStatusSave()}
                                            className="bg-slate-800 text-white border border-gray-500 rounded px-2 py-1"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    ) : (
                                        <span
                                            onDoubleClick={() => handleStatusDoubleClick(order._id, order.orderStatus)}
                                            className={`px-2 py-1 rounded cursor-pointer ${order.orderStatus === 'Delivered' ? 'bg-blue-500' :
                                                order.orderStatus === 'Shipped' ? 'bg-purple-500' :
                                                    order.orderStatus === 'Cancelled' ? 'bg-meta-1' : 'bg-orange-500'
                                                }`}
                                        >
                                            {order.orderStatus}
                                        </span>

                                    )}
                                </td>
                                <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 flex space-x-2">
                                    <button
                                        onClick={() => openModal(order, 'details')}
                                        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 transition"
                                    >
                                        Details
                                    </button>
                                    <button
                                        onClick={() => openModal(order, 'items')}
                                        className="px-4 py-2 bg-green-600 rounded hover:bg-green-500 transition"
                                    >
                                        Items
                                    </button>
                                    <button
                                        onClick={() => fetchUserDetails(order.userId)}
                                        className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-500 transition"
                                    >
                                        User
                                    </button>
                                    <button
                                        onClick={() => fetchPaymentDetails(order)}
                                        className="px-4 py-2 bg-yellow rounded hover:bg-yellow-500 transition"
                                    >
                                        Payment
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                {modalContent === 'details' && selectedOrder && (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Order Details</h2>
                        <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                        <p><strong>Total Price:</strong> TND {(selectedOrder.totalPrice / 1000).toFixed(2)}</p>
                        <p><strong>Order Status:</strong> {selectedOrder.orderStatus}</p>
                        <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                        <h3 className="text-lg font-semibold mt-4">Shipping Address</h3>
                        <p><strong>Address:</strong> {selectedOrder.shippingAddress.address}</p>
                        <p><strong>City:</strong> {selectedOrder.shippingAddress.city}</p>
                        <p><strong>Postal Code:</strong> {selectedOrder.shippingAddress.postalCode}</p>
                        <p><strong>Country:</strong> {selectedOrder.shippingAddress.country}</p>
                        <p><strong>Phone:</strong> {selectedOrder.shippingAddress.phone}</p>
                    </div>
                )}

                {modalContent === 'items' && selectedOrder && (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Order Items</h2>
                        {selectedOrder.orderItems.map((item, index) => (
                            <div key={index} className="mb-4">
                                <img src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${item.product.avatars[0]}`} alt={item.product.name} className="w-20 h-20 mb-2" />
                                <p><strong>Product Name:</strong> {item.product.name}</p>
                                <p><strong>Price:</strong> TND {(item.product.price / 1000).toFixed(2)}</p>
                                <p><strong>Quantity:</strong> {item.quantity}</p>
                            </div>
                        ))}
                    </div>
                )}

                {modalContent === 'user' && selectedUser && (
                    <div>
                        <h2 className="text-xl font-bold mb-4">User Details</h2>
                        <p><strong>Name:</strong> {selectedUser.name}</p>
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                        <h3 className="text-lg font-semibold mt-4">Addresses</h3>
                        {selectedUser.addresses.map((address, index) => (
                            <p key={index}>{address}</p>
                        ))}
                        {selectedUser.pic && (
                            <img
                                src={`data:${selectedUser.pic.contentType};base64,${selectedUser.pic.data}`}
                                alt={selectedUser.name}
                                className="w-20 h-20 mt-4 rounded-full"
                            />
                        )}
                    </div>
                )}

                {modalContent === 'payment' && selectedPaymentDetails && (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Payment Details</h2>
                        <p><strong>Payment ID:</strong> {selectedPaymentDetails.id}</p>
                        <p><strong>Amount:</strong> TND {(selectedPaymentDetails.amount / 1000).toFixed(2)}</p>
                        <p><strong>Status:</strong> {selectedPaymentDetails.status}</p>
                        <p><strong>Currency:</strong> {selectedPaymentDetails.currency}</p>
                        <p><strong>Method:</strong> {selectedPaymentDetails.method}</p>
                        <p><strong>Created At:</strong> {new Date(selectedPaymentDetails.created_at).toLocaleDateString()}</p>
                    </div>
                )}
            </Modal>
        </div>
        </Suspense>

    );
};

export default Page;
