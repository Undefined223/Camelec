"use client";
import React, { useState, useEffect, ReactNode, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import UserContext, { User, Product } from '@/app/context/InfoPlusProvider';
import Loading from './Loading';

interface UserProviderProps {
    children: ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [cartProducts, setCartProducts] = useState<Product[]>([]);
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null') as User | null;
        const storedCart = JSON.parse(localStorage.getItem('cart') || '[]') as Product[];
        const storedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]') as Product[];

        setUser(userInfo);
        setCartProducts(storedCart);
        setWishlist(storedWishlist);
    }, [pathname, searchParams]);

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
        <Suspense fallback={<Loading/>}>
            <UserContext.Provider
                value={{
                    user,
                    setUser,
                    cartProducts,
                    setCartProducts,
                    wishlist,
                    setWishlist,
                    addToCart,
                    addToWishlist,
                    addAllToCart,
                    removeFromWishlist,
                    clearWishlist,
                    removeFromCart,
                    updateCartItemQuantity,
                    clearCart,
                }}
            >
                {children}
            </UserContext.Provider>
        </Suspense>
    );
};

export default UserProvider;
