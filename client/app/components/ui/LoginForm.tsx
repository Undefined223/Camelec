"use client";
import React, { useContext, useState } from "react";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { cn } from "@/app/utils/cn";
import infoPlusImg from "@/app/components/assets/logo.png";
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
        <div className=" flex items-center justify-center bg-gradient-to-br from-white to-sky-50">
            <div className="max-w-md w-full mx-auto rounded-2xl p-8 shadow-2xl bg-white relative overflow-hidden">
                {/* Electric Vibe Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute w-32 h-32 bg-sky-200 rounded-full blur-2xl opacity-30 animate-electric-pulse"></div>
                    <div className="absolute w-24 h-24 bg-sky-300 rounded-full blur-2xl opacity-30 animate-electric-pulse delay-500"></div>
                </div>

                <div className="relative z-10">
                    <Image src={infoPlusImg} className="h-7 w-auto mx-auto" alt="Infoplus Logo" />
                    <p className="text-sky-900 text-sm max-w-sm mt-2 text-center">
                        Welcome back! Please enter your credentials to access your InfoPlus account.
                    </p>

                    <form className="my-8" onSubmit={handleSubmit}>
                        <LabelInputContainer className="mb-4">
                            <Label htmlFor="email" className="text-sky-700">Email Address</Label>
                            <Input
                                id="email"
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="bmajd7743@gmail.com"
                                type="email"
                                className="border-sky-300 focus:ring-sky-500 focus:border-sky-500"
                            />
                        </LabelInputContainer>
                        <LabelInputContainer className="mb-4">
                            <Label htmlFor="password" className="text-sky-700">Password</Label>
                            <Input
                                id="password"
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                type="password"
                                className="border-sky-300 focus:ring-sky-500 focus:border-sky-500"
                            />
                        </LabelInputContainer>
                        <button
      className="
        relative 
        group/btn 
        bg-[#2CACD8]
        w-full 
        text-white 
        rounded-lg 
        h-12 
        font-medium 
        overflow-visible
        shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]
        transition-all
        duration-300
        hover:shadow-[0_0_20px_5px_rgba(56,189,248,0.3)]
        mb-2
      "
    >
      Sign In →
      
      {/* Bottom Gradient Effect */}
      <span className="
        absolute 
        -bottom-px 
        left-0 
        w-full 
        h-[2px] 
        bg-gradient-to-r 
        from-transparent 
        via-primary 
        to-transparent 
        opacity-0 
        group-hover/btn:opacity-100 
        transition-opacity 
        duration-500
        z-20
      "/>
      
      {/* Glow Effect */}
      <span className="
        absolute 
        -bottom-1 
        left-1/2 
        w-[80%] 
        h-[30px] 
        -translate-x-1/2 
        bg-gradient-to-r 
        from-primary/30 
        via-primary/10 
        to-transparent 
        opacity-0 
        group-hover/btn:opacity-100 
        transition-opacity 
        duration-300 
        blur-sm
        z-10
      "/>
    </button>






                        {/* <div className="bg-gradient-to-r from-transparent via-sky-300 to-transparent  h-[1px] w-full" /> */}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                setIsPasswordOpen(true);
                            }}
                            className="text-sky-500 hover:text-sky-700 hover:underline"
                        >
                            Forgot Password?
                        </button>
                    </form>

                    <Modal isOpen={isPasswordOpen} onClose={closePasswordModal}>
                        <ForgotPasswordModal onClose={closePasswordModal} />
                    </Modal>
                </div>
            </div>
        </div>
    );
}


const BottomGradient = () => (
    <>
        <span className="absolute inset-x-0 -bottom-px h-px w-full bg-gradient-to-r from-transparent via-sky-500 to-transparent opacity-0 transition-opacity duration-500 group-hover/btn:opacity-100 z-20" />
        <span className="absolute inset-x-10 -bottom-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-sky-700 to-transparent blur-sm opacity-0 transition-opacity duration-500 group-hover/btn:opacity-100 z-20" />
    </>
);
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