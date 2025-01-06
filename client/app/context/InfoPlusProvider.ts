import { createContext, Dispatch, SetStateAction } from "react";

interface User {
    _id: string; 
    name: string;
    email: string;
    pic: string;
    isAdmin: boolean;
    verified: boolean;
    token: string
}

interface Product {
    _id: string;
    name: string;
    price: number;
    category: string;
    brand: string;
    avatars: string[];
    availability: 'En stock' | 'On order' | 'Out of stock';
    description: string;
    colors: string[];
    selectedColor?: string; 
    quantity?: number
}

interface UserContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    cartProducts: Product[];
    setCartProducts: React.Dispatch<React.SetStateAction<Product[]>>;
    wishlist: Product[];
    setWishlist: React.Dispatch<React.SetStateAction<Product[]>>;
    addToCart: (product: Product, color?: string, quantity?: number) => void; // Updated type
    addToWishlist: (product: Product) => void;
    addAllToCart: () => void;
    removeFromWishlist: (productId: string) => void;
    clearWishlist: () => void;
    removeFromCart: (productId: string) => void;
    updateCartItemQuantity: (productId: string, newQuantity: number) => void;
    clearCart: () => void;
}


const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => { },
    cartProducts: [],
    setCartProducts: () => { },
    wishlist: [],
    setWishlist: () => { },
    addToCart: () => { },
    addToWishlist: () => { },
    addAllToCart: () => { },
    removeFromWishlist: () => { },
    clearWishlist: () => { },
    removeFromCart: () => { },
    updateCartItemQuantity: () => { },
    clearCart: () => {}, // Add this line
});

export default UserContext;
export type { User, Product };