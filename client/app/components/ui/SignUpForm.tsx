"use client";
import React, { useState, ChangeEvent, FormEvent, useContext } from "react";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import infoPlusImg from "@/app/components/assets/infoplus logo.png";
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
            setUser(data)
            localStorage.setItem("userInfo", JSON.stringify(data));
            window.location.reload()
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
        <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-black-2 text-white ">
            <Image src={infoPlusImg} className="h-7 w-auto mx-auto" alt="Infoplus Logo" />

            <p className="text-white text-sm max-w-sm mt-2 ">
                Join InfoPlus today! Create your account to start exploring our features and services.
            </p>
            <form className="my-8" onSubmit={handleSubmit}>
                <div className="flex flex-row mb-4 text-white" >
                    <LabelInputContainer>
                        <Label htmlFor="firstname">First name</Label>
                        <Input id="firstname" placeholder="Tyler" type="text" onChange={handleChange} value={formData.firstname} />
                    </LabelInputContainer>
                    <LabelInputContainer>
                        <Label htmlFor="lastname">Last name</Label>
                        <Input id="lastname" placeholder="Durden" type="text" onChange={handleChange} value={formData.lastname} />
                    </LabelInputContainer>
                </div>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" placeholder="bmajd7743@gmail.com" type="email" onChange={handleChange} value={formData.email} />
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" placeholder="••••••••" type="password" onChange={handleChange} value={formData.password} />
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <Input
                        id="confirmPassword"
                        placeholder="••••••••"
                        type="password"
                        onChange={handleChange}
                        value={formData.confirmPassword}
                    />
                </LabelInputContainer>
                {/* <LabelInputContainer className="mb-8">
                    <Label htmlFor="pic">Profile Picture <span className="opacity-20">(optiona)</span> </Label>
                    <Input id="pic" type="file" accept="image/*" onChange={handleFileChange} />
                </LabelInputContainer> */}

                <button
                    className="bg-gradient-to-br relative group/btn from-black  to-neutral-600 block  w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] "
                    type="submit"
                >
                    Sign up &rarr;
                    <BottomGradient />
                </button>

                <div className="bg-gradient-to-r from-transparent via-neutral-300  to-transparent my-8 h-[1px] w-full" />
            </form>
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

interface LabelInputContainerProps {
    children: React.ReactNode;
    className?: string;
}

const LabelInputContainer: React.FC<LabelInputContainerProps> = ({
    children,
    className,
}) => {
    return (
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>
    );
};