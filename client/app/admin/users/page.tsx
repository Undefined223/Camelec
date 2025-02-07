"use client";
import { NextPage } from 'next';
import { Suspense, useContext, useEffect, useState } from 'react';
import axiosInstance from '@/app/components/AxiosInstance';
import { FaTrash, FaEdit, FaInfoCircle } from 'react-icons/fa'; // Added FaInfoCircle for tooltip
import UserContext from '@/app/context/InfoPlusProvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '@/app/components/Loading';

interface User {
    _id: string;
    name: string;
    email: string;
    pic: string;
    isAdmin: boolean;
    verified: boolean;
    discount: number; // New discount field
    addresses: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
        phone: string;
    }[];
}

const UsersPage: NextPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [editingField, setEditingField] = useState<{ userId: string; field: 'name' | 'email' | 'discount' } | null>(null);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axiosInstance.get("/api/user/all");
                setUsers(data);
                toast.success("Users loaded successfully");
            } catch (err) {
                console.error(err);
                toast.error("Failed to load users");
            }
        };
        fetchUsers();
    }, []);

    const toggleAdmin = async (userId: string, currentStatus: boolean) => {
        try {
            await axiosInstance.put(`/api/user/${userId}`, { isAdmin: !currentStatus });
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === userId ? { ...user, isAdmin: !currentStatus } : user
                )
            );
            toast.success(`Admin status ${!currentStatus ? 'granted' : 'revoked'}`);
        } catch (error) {
            console.error("Failed to update admin status:", error);
            toast.error("Failed to update admin status");
        }
    };

    const deleteUser = async (userId: string) => {
        try {
            await axiosInstance.delete(`/api/user/${userId}`);
            setUsers(users.filter((user) => user._id !== userId));
            toast.success("User deleted successfully");
        } catch (error) {
            console.error("Failed to delete user:", error);
            toast.error("Failed to delete user");
        }
    };

    const startEditing = (userId: string, field: 'name' | 'email' | 'discount') => {
        setEditingField({ userId, field });
    };

    const saveUser = async (user: User) => {
        try {
            await axiosInstance.put(`/api/user/${user._id}`, {
                name: user.name,
                email: user.email,
                discount: user.discount, // Save discount field
            });
            setEditingField(null);
            toast.success("User updated successfully");
        } catch (error) {
            console.error("Failed to update user:", error);
            toast.error("Failed to update user");
        }
    };

    const handleInputChange = (userId: string, field: 'name' | 'email' | 'discount', value: string | number) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user._id === userId ? { ...user, [field]: value } : user
            )
        );
    };

    const handleKeyPress = (e: React.KeyboardEvent, user: User) => {
        if (e.key === 'Enter') {
            saveUser(user);
        }
    };

    return (
        <Suspense fallback={<Loading />}>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
                <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
                <h1 className="text-3xl font-bold text-gray-900 mb-6">User Management</h1>
                <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase">ID</th>
                                <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase">Name</th>
                                <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase">Email</th>
                                <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase">Discount (%)</th>
                                <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase">Admin</th>
                                <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase">Verified</th>
                                <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr
                                    key={user._id}
                                    className="hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <td className="p-4 border-t border-gray-200 text-sm text-gray-700">{user._id}</td>
                                    <td
                                        className="p-4 border-t border-gray-200 text-sm text-gray-700"
                                        onDoubleClick={() => startEditing(user._id, 'name')}
                                    >
                                        {editingField?.userId === user._id && editingField.field === 'name' ? (
                                            <input
                                                type="text"
                                                value={user.name}
                                                onChange={(e) => handleInputChange(user._id, 'name', e.target.value)}
                                                onKeyPress={(e) => handleKeyPress(e, user)}
                                                onBlur={() => saveUser(user)}
                                                className="bg-gray-100 text-gray-700 p-1 rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                                autoFocus
                                            />
                                        ) : (
                                            <div className="flex items-center">
                                                {user.name}
                                                <span className="ml-2 text-gray-400 cursor-pointer group relative">
                                                    <FaInfoCircle className="inline-block" />
                                                    <span className="absolute left-6 -top-2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                        Double-tap to edit
                                                    </span>
                                                </span>
                                            </div>
                                        )}
                                    </td>
                                    <td
                                        className="p-4 border-t border-gray-200 text-sm text-gray-700"
                                        onDoubleClick={() => startEditing(user._id, 'email')}
                                    >
                                        {editingField?.userId === user._id && editingField.field === 'email' ? (
                                            <input
                                                type="email"
                                                value={user.email}
                                                onChange={(e) => handleInputChange(user._id, 'email', e.target.value)}
                                                onKeyPress={(e) => handleKeyPress(e, user)}
                                                onBlur={() => saveUser(user)}
                                                className="bg-gray-100 text-gray-700 p-1 rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                                autoFocus
                                            />
                                        ) : (
                                            <div className="flex items-center">
                                                {user.email}
                                                <span className="ml-2 text-gray-400 cursor-pointer group relative">
                                                    <FaInfoCircle className="inline-block" />
                                                    <span className="absolute left-6 -top-2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                        Double-tap to edit
                                                    </span>
                                                </span>
                                            </div>
                                        )}
                                    </td>
                                    <td
                                        className="p-4 border-t border-gray-200 text-sm text-gray-700"
                                        onDoubleClick={() => startEditing(user._id, 'discount')}
                                    >
                                        {editingField?.userId === user._id && editingField.field === 'discount' ? (
                                            <input
                                                type="number"
                                                value={user.discount}
                                                onChange={(e) => handleInputChange(user._id, 'discount', parseFloat(e.target.value))}
                                                onKeyPress={(e) => handleKeyPress(e, user)}
                                                onBlur={() => saveUser(user)}
                                                className="bg-gray-100 text-gray-700 p-1 rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                                autoFocus
                                            />
                                        ) : (
                                            <div className="flex items-center">
                                                {user.discount}%
                                                <span className="ml-2 text-gray-400 cursor-pointer group relative">
                                                    <FaInfoCircle className="inline-block" />
                                                    <span className="absolute left-6 -top-2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                        Double-tap to edit
                                                    </span>
                                                </span>
                                            </div>
                                        )}
                                    </td>
                                    <td
                                        className="p-4 border-t border-gray-200 text-sm text-gray-700 cursor-pointer"
                                        onDoubleClick={() => toggleAdmin(user._id, user.isAdmin)}
                                    >
                                        {user.isAdmin ? 'Yes' : 'No'}
                                    </td>
                                    <td className="p-4 border-t border-gray-200 text-sm text-gray-700">{user.verified ? 'Yes' : 'No'}</td>
                                    <td className="p-4 border-t border-gray-200 text-sm text-gray-700">
                                        <button
                                            className="text-red-500 hover:text-red-700 transition duration-200 p-2 rounded-full hover:bg-red-50"
                                            onClick={() => deleteUser(user._id)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Suspense>
    );
};

export default UsersPage;