"use client";
import React, { useState, useEffect, ReactNode, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import UserContext, { User, Product, Message, AppNotification } from '@/app/context/InfoPlusProvider';
import Loading from './Loading';
import {
    onNewOrderNotification,
    onDeliveryStarted,
    onNewChatNotification,
    onReceiveMessage,
    offNewOrderNotification,
    offDeliveryStarted,
    offNewChatNotification,
    offReceiveMessage,
} from '@/app/utils/socket';


interface UserProviderProps {
    children: ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [cartProducts, setCartProducts] = useState<Product[]>([]);
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const [notifications, setNotifications] = useState<AppNotification[]>([]); // Fixed here
    const [messages, setMessages] = useState<Message[]>([]);


    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null') as User | null;
        const storedCart = JSON.parse(localStorage.getItem('cart') || '[]') as Product[];
        const storedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]') as Product[];
        const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]') as AppNotification[];
        const storedMessages = JSON.parse(localStorage.getItem('messages') || '[]') as Message[];


        setUser(userInfo);
        setCartProducts(storedCart);
        setWishlist(storedWishlist);
        setNotifications(storedNotifications);
        setMessages(storedMessages);
        console.log(notifications)
    }, [pathname, searchParams]);

    // Notification handlers
    const addNotification = (notification: AppNotification) => {
        setNotifications((prev) => [...prev, notification]);
    };

    const removeNotification = (notificationId: string) => {
        setNotifications((prev) => prev.filter(n => n.id !== notificationId));
    };

    const clearNotifications = () => setNotifications([]);

    // Message handlers
    const addMessage = (message: Message) => {
        setMessages((prev) => [...prev, message]);
    };

    const removeMessage = (messageId: string) => {
        setMessages((prev) => prev.filter(m => m.id !== messageId));
    };

    const clearMessages = () => setMessages([]);

    // Socket.IO listeners
    useEffect(() => {
        const handleNewOrder = (data: { orderId: string; message: string }) =>
            addNotification({ id: data.orderId, message: data.message, type: 'order', timestamp: new Date() });

        const handleDeliveryStart = (data: { orderId: string; message: string }) =>
            addNotification({ id: data.orderId, message: data.message, type: 'delivery', timestamp: new Date() });
        console.log(notifications)
        const handleNewChat = (data: { chatId: string; message: string }) =>
            addNotification({ id: data.chatId, message: data.message, type: 'chat', timestamp: new Date() });

        const handleNewMessage = (data: Message) => addMessage(data);

        // Attach listeners
        onNewOrderNotification(handleNewOrder);
        onDeliveryStarted(handleDeliveryStart);
        onNewChatNotification(handleNewChat);
        onReceiveMessage(handleNewMessage);

        return () => {
            offNewOrderNotification();
            offDeliveryStarted();
            offNewChatNotification();
            offReceiveMessage();
        };
    }, []);



    const addToCart = (product: Product, color?: string, quantity: number = 1) => {
        const updatedProduct = { ...product, color, quantity };
        setCartProducts((prev) => {
            const existingProductIndex = prev.findIndex((p) => p._id === updatedProduct._id && p.color === updatedProduct.color);
            if (existingProductIndex > -1) {
                const updatedCart = [...prev];
                updatedCart[existingProductIndex] = {
                    ...updatedCart[existingProductIndex],
                    quantity: (updatedCart[existingProductIndex].quantity ?? 0) + quantity
                };
                localStorage.setItem('cart', JSON.stringify(updatedCart));
                return updatedCart;
            }
            const updatedCart = [...prev, updatedProduct];
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            return updatedCart;
        });
    };

    const removeFromCart = (productId: string) => {
        setCartProducts((prev) => {
            const updatedCart = prev.filter((product) => product._id !== productId);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            return updatedCart;
        });
    };

    const updateCartItemQuantity = (productId: string, newQuantity: number) => {
        setCartProducts((prev) => {
            const updatedCart = prev.map((product) =>
                product._id === productId ? { ...product, quantity: newQuantity } : product
            );
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            return updatedCart;
        });
    };

    const addToWishlist = (product: Product) => {
        setWishlist((prev) => {
            if (prev.some((p) => p._id === product._id)) {
                return prev;
            }
            const updatedWishlist = [...prev, product];
            localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
            return updatedWishlist;
        });
    };

    const addAllToCart = () => {
        if (wishlist.length > 0) {
            setCartProducts((prev) => {
                const updatedCart = [
                    ...prev,
                    ...wishlist.filter((item) => !prev.some((cartItem) => cartItem._id === item._id))
                        .map((item) => ({ ...item, quantity: 1 })),
                ];
                localStorage.setItem('cart', JSON.stringify(updatedCart));
                return updatedCart;
            });
            setWishlist([]);
            localStorage.setItem('wishlist', JSON.stringify([]));
        }
    };

    const removeFromWishlist = (productId: string) => {
        setWishlist((prev) => {
            const updatedWishlist = prev.filter((product) => product._id !== productId);
            localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
            return updatedWishlist;
        });
    };

    const clearWishlist = () => {
        setWishlist([]);
        localStorage.setItem('wishlist', JSON.stringify([]));
    };

    const clearCart = () => {
        setCartProducts([]);
        localStorage.setItem('cart', JSON.stringify([]));
    };

    

    return (
        <Suspense fallback={<Loading />}>
            <UserContext.Provider
                value={{
                    user,
                    setUser,
                    cartProducts,
                    setCartProducts,
                    wishlist,
                    setWishlist,
                    notifications,
                    setNotifications,
                    messages,
                    setMessages,
                    addToCart,
                    addToWishlist,
                    addAllToCart,
                    removeFromWishlist,
                    clearWishlist,
                    removeFromCart,
                    updateCartItemQuantity,
                    clearCart,
                    addNotification,
                    removeNotification,
                    clearNotifications,
                    addMessage,
                    removeMessage,
                    clearMessages,

                }}
            >
                {children}
            </UserContext.Provider>
        </Suspense>
    );
};

export default UserProvider;
