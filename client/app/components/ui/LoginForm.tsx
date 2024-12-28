"use client";
import React, { useContext, useState } from "react";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { cn } from "@/app/utils/cn";
import infoPlusImg from "@/app/components/assets/infoplus logo.png";
import Image from "next/image";
import UserContext from "@/app/context/InfoPlusProvider";
import axiosInstance from "../AxiosInstance";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import ForgotPasswordModal from "../ForgotPasswordModal";
import Modal from "./modal";

export function LoginFormDemo() {
    const { user, setUser } = useContext(UserContext);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const [isPasswordOpen, setIsPasswordOpen] = useState(false);

    const closePasswordModal = () => setIsPasswordOpen(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const { data } = await axiosInstance.post('/api/user/login', { email, password });
            setUser(data);
            localStorage.setItem("userInfo", JSON.stringify(data));
            toast.success('Login successful!');
            window.location.reload();
        } catch (error) {
            console.error('Error during login:', error);
            if (error instanceof AxiosError && error.response) {
                toast.error(error.response.data?.message || 'Login failed. Please try again.');
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-black-2  sticky z-20">
            <Image src={infoPlusImg} className="h-7 w-auto mx-auto" alt="Infoplus Logo" />

            <p className="text-white text-sm max-w-sm mt-2 ">
                Welcome back! Please enter your credentials to access your InfoPlus account.
            </p>

            <form className="my-8" onSubmit={handleSubmit}>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" onChange={(e) => setEmail(e.target.value)} placeholder="bmajd7743@gmail.com" type="email" />
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" type="password" />
                </LabelInputContainer>

                <button
                    className="bg-gradient-to-br relative group/btn from-black   to-neutral-600 block  w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] "
                    type="submit"
                >
                    Log in &rarr;
                    <BottomGradient />
                </button>

                <div className="bg-gradient-to-r from-transparent via-neutral-300  to-transparent my-8 h-[1px] w-full" />

                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        setIsPasswordOpen(true);
                    }}
                    className="text-blue-500 hover:underline"
                >
                    Forgot Password?
                </button>
            </form>

            <Modal isOpen={isPasswordOpen} onClose={closePasswordModal}>
                <ForgotPasswordModal  onClose={closePasswordModal}/>
            </Modal>
        </div>
    );
}

const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
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
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>
    );
};