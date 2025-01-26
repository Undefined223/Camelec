"use client";
import { NextPage } from 'next';
import { Suspense, useContext, useEffect, useState } from 'react';
import axiosInstance from '@/app/components/AxiosInstance';
import { FaTrash } from 'react-icons/fa';
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
    const [editingField, setEditingField] = useState<{ userId: string; field: 'name' | 'email' } | null>(null);
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

    const startEditing = (userId: string, field: 'name' | 'email') => {
        setEditingField({ userId, field });
    };

    const saveUser = async (user: User) => {
        try {
            await axiosInstance.put(`/api/user/${user._id}`, {
                name: user.name,
                email: user.email,
            });
            setEditingField(null);
            toast.success("User updated successfully");
        } catch (error) {
            console.error("Failed to update user:", error);
            toast.error("Failed to update user");
        }
    };

    const handleInputChange = (userId: string, field: 'name' | 'email', value: string) => {
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


        <div className="min-h-screen bg-gray-900 text-white p-4 relative z-10">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            <h1 className="text-2xl font-bold mb-4">User List</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg shadow-md">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="p-4 text-left">ID</th>
                            <th className="p-4 text-left">Name</th>
                            <th className="p-4 text-left">Email</th>
                            <th className="p-4 text-left">Admin</th>
                            <th className="p-4 text-left">Verified</th>
                            <th className="p-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr
                                key={user._id}
                                className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200"
                            >
                                <td className="p-4">{user._id}</td>
                                <td
                                    className="p-4"
                                    onDoubleClick={() => startEditing(user._id, 'name')}
                                >
                                    {editingField?.userId === user._id && editingField.field === 'name' ? (
                                        <input
                                            type="text"
                                            value={user.name}
                                            onChange={(e) => handleInputChange(user._id, 'name', e.target.value)}
                                            onKeyPress={(e) => handleKeyPress(e, user)}
                                            onBlur={() => saveUser(user)}
                                            className="bg-gray-700 text-black p-1 rounded"
                                            autoFocus
                                        />
                                    ) : (
                                        user.name
                                    )}
                                </td>
                                <td
                                    className="p-4"
                                    onDoubleClick={() => startEditing(user._id, 'email')}
                                >
                                    {editingField?.userId === user._id && editingField.field === 'email' ? (
                                        <input
                                            type="email"
                                            value={user.email}
                                            onChange={(e) => handleInputChange(user._id, 'email', e.target.value)}
                                            onKeyPress={(e) => handleKeyPress(e, user)}
                                            onBlur={() => saveUser(user)}
                                            className="bg-gray-700 text-black p-1 rounded"
                                            autoFocus
                                        />
                                    ) : (
                                        user.email
                                    )}
                                </td>
                                <td
                                    className="p-4 cursor-pointer"
                                    onDoubleClick={() => toggleAdmin(user._id, user.isAdmin)}
                                >
                                    {user.isAdmin ? 'Yes' : 'No'}
                                </td>
                                <td className="p-4">{user.verified ? 'Yes' : 'No'}</td>
                                <td className="p-4">
                                    <button
                                        className="text-red-500 hover:text-red transition duration-200"
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