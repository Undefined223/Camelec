"use client";

import React, { useState, useEffect } from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined, MenuOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Button, Drawer } from 'antd';
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import infoPlusImg from "../components/assets/logo.png";

const { Header, Content, Footer, Sider } = Layout;

// Navigation items for the top menu
const items1: MenuProps['items'] = ['1', '2', '3'].map((key) => ({
    key,
    label: `nav ${key}`,
}));

// Animation variants for the logo
const logoVariants = {
    hidden: { opacity: 0, rotate: -1100 },
    visible: {
        opacity: 1,
        rotate: 0,
        transition: {
            type: "spring",
            stiffness: 2100,
            damping: 20,
        },
    },
};

// Navigation items for the sidebar menu
const items2: MenuProps['items'] = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
    (icon, index) => {
        const key = String(index + 1);

        return {
            key: `sub${key}`,
            icon: React.createElement(icon),
            label: `subnav ${key}`,
            children: new Array(4).fill(null).map((_, j) => {
                const subKey = index * 4 + j + 1;
                return {
                    key: subKey,
                    label: `option${subKey}`,
                };
            }),
        };
    }
);

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    const showDrawer = () => {
        setDrawerVisible(true);
    };

    const onClose = () => {
        setDrawerVisible(false);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div
            style={{
                minHeight: '100vh',
                position: 'relative',
                zIndex: 999,
                background: 'linear-gradient(to right, #1d73ff, #0f95d3)', // Linear gradient background
                display: 'flex',
            }}
        >
            {!isMobile && (
                <Sider
                    width={200}
                    collapsed={collapsed}
                    collapsedWidth={80}
                    style={{
                        background: 'transparent', // Make the sidebar background transparent
                        overflow: 'auto', // Make the sidebar scrollable if necessary
                        height: '100vh',
                        position: 'fixed',
                        left: 0,
                    }}
                >
                    <div className="flex flex-wrap items-center justify-around mx-auto max-w-screen-xl p-4 ">
                        <motion.div
                            variants={logoVariants}
                            initial="hidden"
                            animate="visible"
                            className="w-full flex justify-around items-center flex-wrap"
                        >
                            <Link href="/" className="flex items-center justify-center space-x-3 w-full m-2 md:w-auto hover:text-yellow">
                                {/* <Image src={infoPlusImg} width={300} height={300} className="h-15 w-auto p-1" alt="Infoplus Logo" /> */}
                                Camelec
                            </Link>
                        </motion.div>
                    </div>
                    <Menu
                        mode="inline"
                        style={{background:'transparent'}}
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        items={items2}
                    />
                </Sider>
            )}


            
            <Layout
                style={{
                    marginLeft: isMobile ? 0 : (collapsed ? 80 : 200), // Offset for fixed sidebar
                    padding: '24px',
                    background: 'transparent', // Make the content background transparent
                    borderRadius: borderRadiusLG,
                    transition: 'margin-left 0.2s',
                    flex: 1,
                }}
            >
                {isMobile && (
                    <Button
                        type="primary"
                        icon={<MenuOutlined />}
                        onClick={showDrawer}
                        style={{ marginLeft: 'auto', background: 'transparent', boxShadow: 'none' }}
                    />
                )}
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>List</Breadcrumb.Item>
                    <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb>
                <Content style={{ minHeight: '280px' }}>{children}</Content>
            </Layout>

            {/* Drawer for mobile sidebar */}
            <Drawer
                title="Menu"
                placement="left"
                closable={true}
                onClose={onClose}
                visible={drawerVisible}
                key="left"
                width={200}
            >
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    style={{ height: '100%' }}
                    items={items2}
                />
            </Drawer>
        </div>
    );
};

export default AdminLayout;
