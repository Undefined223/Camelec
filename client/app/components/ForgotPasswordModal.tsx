// components/ForgotPasswordModal.tsx
import React, { useState } from "react";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { ToastContainer, toast } from "react-toastify";
import axiosInstance from "./AxiosInstance"; 
import { AxiosError } from "axios";
import Modal from "./ui/modal"; 
import 'react-toastify/dist/ReactToastify.css';


interface ForgotPasswordModalProps {
    isOpen?: boolean;
    onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = () => {
    const [email, setEmail] = useState<string>('');

    const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axiosInstance.post('api/password/forgot-password', { email });
            toast.success('Password reset email sent!');
        } catch (error) {
            console.error('Error sending reset email:', error);
            if (error instanceof AxiosError && error.response) {
                toast.error(error.response.data?.message || 'Failed to send reset email.');
            } else {
                toast.error('An unexpected error occurred.');
            }
        }
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

            <h2 className="text-2xl font-bold mb-4 text-white">Forgot Password</h2>
            <form onSubmit={handleForgotPassword} className="space-y-4 ">
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                        id="email"
                        type="email"
                        placeholder="example@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </LabelInputContainer>
                <button
                    type="submit"
                    className="bg-gradient-to-br from-black to-neutral-600 text-white rounded-md py-2 px-4 font-medium shadow-lg hover:shadow-xl transition-shadow duration-300 w-full"
                >
                    Send Reset Link
                </button>
            </form>
        </>

    );
};

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={`flex flex-col space-y-2 w-full ${className}`}>
            {children}
        </div>
    );
};

export default ForgotPasswordModal;
