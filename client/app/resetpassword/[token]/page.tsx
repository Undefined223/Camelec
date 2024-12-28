"use client";
import React, { Suspense, useState } from 'react';
import axiosInstance from '@/app/components/AxiosInstance';
import { useParams, useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import Loading from '@/app/components/Loading';

const ResetPassword: React.FC = () => {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState<string>('');
    const router = useRouter();

    const handleChangePassword = async () => {
        try {
            if (!token) {
                console.error('Token is missing');
                return;
            }
    
            const response = await axiosInstance.post(`/api/password/reset-password/${token}`, {
                newPassword: newPassword,
            });
    
            if (response.status === 200) {
            toast.success('Password reset email sent!');

                // Password changed successfully, redirect to login or any other page
                router.push('/');
            } else {
                console.error('Error:', response.data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Suspense fallback={<Loading />}>


        <div className="flex items-center justify-center min-h-screen  text-white p-4 relative z-10">
            <div className="bg-slate-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-2xl font-semibold mb-4">Reset Password</h2>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    className="w-full p-2 mb-4 border border-slate-600 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleChangePassword}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition duration-300"
                >
                    Change Password
                </button>
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            
        </div>
        </Suspense>

    );
};

export default ResetPassword;
