"use client";
import React, { useState, ChangeEvent, FormEvent, useContext } from "react";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import infoPlusImg from "@/app/components/assets/logo.png";
import Image from "next/image";
import { cn } from "@/app/utils/cn";
import axiosInstance from "../AxiosInstance";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import UserContext from "@/app/context/InfoPlusProvider";

interface FormData {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export function SignupFormDemo() {
    const { user, setUser } = useContext(UserContext);
    const [formData, setFormData] = useState<FormData>({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isSubmitting) return;
        setIsSubmitting(true);

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords don't match");
            setIsSubmitting(false);
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('name', `${formData.firstname} ${formData.lastname}`);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('role', 'user');

        try {
            const { data } = await axiosInstance.post('/api/user', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success('Registration successful!');
            console.log('Registration successful:', data);
            setUser(data);
            localStorage.setItem("userInfo", JSON.stringify(data));
            window.location.reload();
        } catch (error) {
            console.error('Error during registration:', error);
            if (error instanceof AxiosError && error.response) {
                toast.error(error.response.data?.message || 'Registration failed. Please try again.');
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
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
                        Join InfoPlus today! Create your account to start exploring our features and services.
                    </p>

                    <form className="my-8" onSubmit={handleSubmit}>
                        <div className="flex flex-row gap-4 mb-4">
                            <LabelInputContainer>
                                <Label htmlFor="firstname" className="text-sky-700">First name</Label>
                                <Input
                                    id="firstname"
                                    placeholder="Tyler"
                                    type="text"
                                    onChange={handleChange}
                                    value={formData.firstname}
                                    className="border-sky-300 focus:ring-sky-500 focus:border-sky-500"
                                />
                            </LabelInputContainer>
                            <LabelInputContainer>
                                <Label htmlFor="lastname" className="text-sky-700">Last name</Label>
                                <Input
                                    id="lastname"
                                    placeholder="Durden"
                                    type="text"
                                    onChange={handleChange}
                                    value={formData.lastname}
                                    className="border-sky-300 focus:ring-sky-500 focus:border-sky-500"
                                />
                            </LabelInputContainer>
                        </div>

                        <LabelInputContainer className="mb-4">
                            <Label htmlFor="email" className="text-sky-700">Email Address</Label>
                            <Input
                                id="email"
                                placeholder="bmajd7743@gmail.com"
                                type="email"
                                onChange={handleChange}
                                value={formData.email}
                                className="border-sky-300 focus:ring-sky-500 focus:border-sky-500"
                            />
                        </LabelInputContainer>

                        <LabelInputContainer className="mb-4">
                            <Label htmlFor="password" className="text-sky-700">Password</Label>
                            <Input
                                id="password"
                                placeholder="••••••••"
                                type="password"
                                onChange={handleChange}
                                value={formData.password}
                                className="border-sky-300 focus:ring-sky-500 focus:border-sky-500"
                            />
                        </LabelInputContainer>

                        <LabelInputContainer className="mb-4">
                            <Label htmlFor="confirmPassword" className="text-sky-700">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                placeholder="••••••••"
                                type="password"
                                onChange={handleChange}
                                value={formData.confirmPassword}
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
  "
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Signing up..." : "Sign up →"}

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

                        <div className="bg-gradient-to-r from-transparent via-sky-300 to-transparent my-8 h-[1px] w-full" />
                    </form>
                </div>
            </div>
        </div>
    );
}

const LabelInputContainer: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({ children, className }) => {
    return (
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>
    );
};