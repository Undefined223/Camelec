"use client";
import React from "react";
import Link from "next/link";
import { FaTachometerAlt, FaCog, FaBox, FaUsers, FaSignOutAlt, FaFirstOrder, FaFlag } from "react-icons/fa";
import { Sidebar, SidebarBody, SidebarLink } from "../components/ui/sidebar"; // Import Sidebar components

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Define your sidebar links
    const links = [
        { label: "Dashboard", href: "/admin/dashboard", icon: <FaTachometerAlt /> },
        { label: "Categories", href: "/admin/categories", icon: <FaCog /> },
        { label: "Products", href: "/admin/products", icon: <FaBox /> },
        { label: "Announcement", href: "/admin/announcment", icon: <FaFlag /> },
        { label: "Users", href: "/admin/users", icon: <FaUsers /> },
        { label: "Orders", href: "/admin/orders", icon: <FaFirstOrder /> },

        { label: "Home", href: "/", icon: <FaSignOutAlt /> },
        
    ];

    return (
        <div className="flex min-h-screen">
            <Sidebar>
                <SidebarBody>
                    {links.map((link, index) => (
                        <SidebarLink key={index} link={link} />
                    ))}
                </SidebarBody>
            </Sidebar>
            <main className="flex-1 p-4">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
