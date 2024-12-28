"use client";
import { useContext, useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { NextPage } from 'next';
import axiosInstance from '@/app/components/AxiosInstance';
import UserContext from '@/app/context/InfoPlusProvider';
import { motion } from 'framer-motion';

interface Props { }

interface User {
    _id: string;
    name: string;
    email: string;
    
    token: string;
}

const Page: NextPage<Props> = ({ }) => {
    const { user } = useContext(UserContext) as unknown as { user: User };
    const { setUser } = useContext(UserContext)
    const [formData, setFormData] = useState({
        currentPassword: '',
        firstName: '',
        lastName: '',
        email: '',
        newPassword: '',
    });
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            const nameParts = user.name.split(' ');
            setFormData((prevState) => ({
                ...prevState,
                firstName: nameParts[0],
                lastName: nameParts.slice(1).join(' '),
                email: user.email,
            }));
            // Set initial picture preview if available
        }
    }, [user]);

  
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value, type, files } = e.target;
        if (type === 'file') {
            const file = files?.[0] || null;
            setFormData((prevState) => ({ ...prevState, pic: file }));
         
        } else {
            setFormData((prevState) => ({ ...prevState, [id]: value }));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        data.append('currentPassword', formData.currentPassword);
        data.append('name', `${formData.firstName} ${formData.lastName}`);
        data.append('email', formData.email);
        if (formData.newPassword) {
            data.append('newPassword', formData.newPassword);
        }

        try {
            const response = await axiosInstance.put(`/api/user/${user._id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`,
                },
            });
            localStorage.setItem("userInfo", JSON.stringify(response.data.user));
            setUser(response.data.user)
            console.log(response.data);
        } catch (error) {
            console.error('Error updating user', error);
        }
    };

    return (
        <div className="min-h-screen p-4 relative z-10 ">
            <motion.h1
                className="text-center text-2xl font-bold text-white mb-6"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Your Personal Information
            </motion.h1>
            <motion.div
                className="w-4/5 m-auto border-4 border-gray-600 rounded-xl p-6 shadow-lg bg-gray-900"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
            >
                <form onSubmit={handleSubmit}>
                    <motion.div
                        className="mb-6"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <label className="block mb-2 text-sm font-medium text-white">Current Password</label>
                        <input
                            type="password"
                            id="currentPassword"
                            className="bg-gray-700 border border-gray-600 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all duration-300 ease-in-out"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            required
                        />
                    </motion.div>
                    <div className="grid gap-6 mb-6 md:grid-cols-2">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <label className="block mb-2 text-sm font-medium text-white">First name</label>
                            <input
                                type="text"
                                id="firstName"
                                className="bg-gray-700 border border-gray-600 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all duration-300 ease-in-out"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />  
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <label className="block mb-2 text-sm font-medium text-white">Last name</label>
                            <input
                                type="text"
                                id="lastName"
                                className="bg-gray-700 border border-gray-600 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all duration-300 ease-in-out"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </motion.div>
                    </div>
                    <motion.div
                        className="mb-6"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <label className="block mb-2 text-sm font-medium text-white">Email address</label>
                        <input
                            type="email"
                            id="email"
                            className="bg-gray-700 border border-gray-600 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all duration-300 ease-in-out"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </motion.div>
                    <motion.div
                        className="mb-6"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <label className="block mb-2 text-sm font-medium text-white">New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            className="bg-gray-700 border border-gray-600 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all duration-300 ease-in-out"
                            value={formData.newPassword}
                            onChange={handleChange}
                        />
                    </motion.div>
                  
                    <motion.button
                        type="submit"
                        className="text-white bg-blue-700 hover focus
font-medium rounded-lg text-sm w-full sm
px-5 py-2.5 text-center transition-transform duration-300 transform hover
"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        Submit
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default Page;