"use client";

import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import UserProvider from "./components/UserProvider";
import { Suspense, useEffect, useState } from "react";
import axiosInstance from "./components/AxiosInstance";
import Loading from "./components/Loading";
import FloatingChatButton from "./components/FloatingChatButton";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);

    const isAdminPage = pathname.startsWith('/admin');

    useEffect(() => {
        const trackVisit = async () => {
            try {
                await axiosInstance.post('/api/track-visit');
            } catch (error) {
                console.error('Failed to track visit:', error);
            }
        };

        trackVisit();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000); // Adjust timeout as needed
        return () => clearTimeout(timer);
    }, []);

    return (
        <UserProvider>
            {!isAdminPage && <Navbar />}
            <FloatingChatButton/> 
            <div className="relative h-full w-full bg-[#ffffff] ">
                <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]">
                </div>
                {loading ? (
                    <Loading />
                ) : (
                    <Suspense fallback={<Loading />}>
                        {children}
                    </Suspense>
                )}
            </div>
            {!isAdminPage && <Footer />}
        </UserProvider>
    );
}