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
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        setIsSubmitting(true);
        
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
            setUser(response.data.user);
            console.log(response.data);
            setTimeout(() => setIsSubmitting(false), 1000);
        } catch (error) {
            console.error('Error updating user', error);
            setIsSubmitting(false);
        }
    };

    // Lightning bolt SVG for decorative elements
    const LightningBolt = () => (
        <svg className="h-6 w-6 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    );

    // Circuit pattern animation for background
    const circuitVariants = {
        animate: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const circuitPathVariants = {
        initial: {
            pathLength: 0,
            opacity: 0
        },
        animate: {
            pathLength: 1,
            opacity: 0.5,
            transition: {
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 1
            }
        }
    };

    return (
        <div className="min-h-screen p-4 relative z-10 bg-white overflow-hidden">
            {/* Animated circuit background */}
            <div className="absolute inset-0 opacity-10 z-0">
                <motion.svg 
                    width="100%" 
                    height="100%" 
                    viewBox="0 0 100 100" 
                    variants={circuitVariants}
                    initial="initial"
                    animate="animate"
                >
                    <motion.path 
                        d="M10,30 L30,30 L30,10 L50,10 L50,30 L70,30 L70,50 L90,50" 
                        stroke="#0EA5E9" 
                        strokeWidth="0.5" 
                        fill="none"
                        variants={circuitPathVariants}
                    />
                    <motion.path 
                        d="M10,70 L30,70 L30,90 L50,90 L50,70 L70,70 L70,50 L90,50" 
                        stroke="#0EA5E9" 
                        strokeWidth="0.5" 
                        fill="none"
                        variants={circuitPathVariants}
                    />
                    <motion.path 
                        d="M10,50 L90,50" 
                        stroke="#0EA5E9" 
                        strokeWidth="0.5" 
                        fill="none"
                        variants={circuitPathVariants}
                    />
                    <motion.path 
                        d="M50,10 L50,90" 
                        stroke="#0EA5E9" 
                        strokeWidth="0.5" 
                        fill="none"
                        variants={circuitPathVariants}
                    />
                </motion.svg>
            </div>

            <motion.div 
                className="absolute top-10 right-10 h-12 w-12"
                animate={{ 
                    opacity: [0.5, 1, 0.5],
                    scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <svg className="w-full h-full text-sky-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.983 1.907a1 1 0 00-1.966 0l-3.5 14a1 1 0 001.77.884L12 13.708l3.713 3.083a1 1 0 001.77-.884l-3.5-14z" />
                </svg>
            </motion.div>

            <motion.h1
                className="text-center text-3xl font-bold text-sky-600 mb-6 flex items-center justify-center gap-3"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <LightningBolt />
                <span>Profile Settings</span>
                <LightningBolt />
            </motion.h1>

            <motion.div
                className="w-4/5 m-auto rounded-xl p-6 shadow-lg bg-white relative border border-sky-200"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
            >
                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-100 to-blue-100 opacity-30 blur-md -z-10"></div>
                
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-sky-300 rounded-tl-xl"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-sky-300 rounded-tr-xl"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-sky-300 rounded-bl-xl"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-sky-300 rounded-br-xl"></div>

                <form onSubmit={handleSubmit}>
                    <motion.div
                        className="mb-6 relative"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <label className="flex items-center mb-2 text-sm font-medium text-sky-600">
                            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Current Password
                        </label>
                        <input
                            type="password"
                            id="currentPassword"
                            className="bg-white border border-sky-200 text-gray-700 text-sm rounded-lg focus:ring-sky-400 focus:border-sky-400 block w-full p-2.5 transition-all duration-300 ease-in-out"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            required
                        />
                        <motion.div 
                            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-sky-300 to-blue-300"
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        />
                    </motion.div>
                    
                    <div className="grid gap-6 mb-6 md:grid-cols-2">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="relative"
                        >
                            <label className="flex items-center mb-2 text-sm font-medium text-sky-600">
                                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                First name
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                className="bg-white border border-sky-200 text-gray-700 text-sm rounded-lg focus:ring-sky-400 focus:border-sky-400 block w-full p-2.5 transition-all duration-300 ease-in-out"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />  
                            <motion.div 
                                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-sky-300 to-blue-300"
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 0.8, delay: 0.7 }}
                            />
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="relative"
                        >
                            <label className="flex items-center mb-2 text-sm font-medium text-sky-600">
                                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Last name
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                className="bg-white border border-sky-200 text-gray-700 text-sm rounded-lg focus:ring-sky-400 focus:border-sky-400 block w-full p-2.5 transition-all duration-300 ease-in-out"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                            <motion.div 
                                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-sky-300 to-blue-300"
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 0.8, delay: 0.9 }}
                            />
                        </motion.div>
                    </div>
                    
                    <motion.div
                        className="mb-6 relative"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <label className="flex items-center mb-2 text-sm font-medium text-sky-600">
                            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Email address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="bg-white border border-sky-200 text-gray-700 text-sm rounded-lg focus:ring-sky-400 focus:border-sky-400 block w-full p-2.5 transition-all duration-300 ease-in-out"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <motion.div 
                            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-sky-300 to-blue-300"
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 0.8, delay: 1.1 }}
                        />
                    </motion.div>
                    
                    <motion.div
                        className="mb-6 relative"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <label className="flex items-center mb-2 text-sm font-medium text-sky-600">
                            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                            New Password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            className="bg-white border border-sky-200 text-gray-700 text-sm rounded-lg focus:ring-sky-400 focus:border-sky-400 block w-full p-2.5 transition-all duration-300 ease-in-out"
                            value={formData.newPassword}
                            onChange={handleChange}
                        />
                        <motion.div 
                            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-sky-300 to-blue-300"
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 0.8, delay: 1.3 }}
                        />
                    </motion.div>
                  
                    <motion.button
                        type="submit"
                        className="relative overflow-hidden text-white bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-300 transform group"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isSubmitting}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {isSubmitting ? (
                                <>
                                    <motion.div
                                        className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <span>Update Profile</span>
                                </>
                            )}
                        </span>
                        
                        {/* Energy pulse effect */}
                        <motion.span 
                            className="absolute top-0 left-0 w-full h-full bg-white"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={isSubmitting ? {
                                scale: [0, 1.5],
                                opacity: [0.5, 0],
                            } : {}}
                            transition={{ duration: 0.8, repeat: isSubmitting ? Infinity : 0, repeatDelay: 0.2 }}
                        />
                    </motion.button>
                </form>
            </motion.div>
            
            {/* Power meter visualization */}
            <motion.div
                className="mt-8 flex justify-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.5 }}
            >
                <div className="bg-white border border-sky-200 rounded-lg p-3 shadow-md flex items-center gap-3">
                    <motion.div 
                        className="h-3 w-16 bg-gray-100 rounded-full overflow-hidden flex items-center"
                        animate={{ boxShadow: ["0 0 0px rgba(14, 165, 233, 0)", "0 0 10px rgba(14, 165, 233, 0.5)", "0 0 0px rgba(14, 165, 233, 0)"] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <motion.div 
                            className="h-full bg-gradient-to-r from-green-300 via-sky-400 to-blue-500"
                            animate={{ width: ["10%", "90%", "30%", "60%", "10%"] }}
                            transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
                        />
                    </motion.div>
                    <span className="text-xs text-sky-600">Power Status</span>
                </div>
            </motion.div>
        </div>
    );
};

export default Page;