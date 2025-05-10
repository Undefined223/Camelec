import { createContext } from "react";

interface User {
    _id: string;
    name: string;
    email: string;
    pic: string;
    isAdmin: boolean;
    verified: boolean;
    token: string;
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
    quantity?: number;
    discount?: number;
    color?: string;
}

// Renamed to avoid conflict with the browser's Notification interface
interface AppNotification {
    id: string;
    message: string;
    type: 'order' | 'delivery' | 'chat';
    timestamp: Date;
}

interface Message {
    id: string;
    content: string;
    sender: string;
    timestamp: Date;
}

interface UserContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    cartProducts: Product[];
    setCartProducts: React.Dispatch<React.SetStateAction<Product[]>>;
    wishlist: Product[];
    setWishlist: React.Dispatch<React.SetStateAction<Product[]>>;
    notifications: AppNotification[]; // Updated to use AppNotification
    setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>; // Updated
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    addToCart: (product: Product, color?: string, quantity?: number) => void;
    addToWishlist: (product: Product) => void;
    addAllToCart: () => void;
    removeFromWishlist: (productId: string) => void;
    clearWishlist: () => void;
    removeFromCart: (productId: string) => void;
    updateCartItemQuantity: (productId: string, newQuantity: number) => void;
    clearCart: () => void;
    addNotification: (notification: AppNotification) => void; // Updated
    removeNotification: (notificationId: string) => void;
    clearNotifications: () => void;
    addMessage: (message: Message) => void;
    removeMessage: (messageId: string) => void;
    clearMessages: () => void;
}

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => { },
    cartProducts: [],
    setCartProducts: () => { },
    wishlist: [],
    setWishlist: () => { },
    notifications: [],
    setNotifications: () => { },
    messages: [],
    setMessages: () => { },
    addToCart: () => { },
    addToWishlist: () => { },
    addAllToCart: () => { },
    removeFromWishlist: () => { },
    clearWishlist: () => { },
    removeFromCart: () => { },
    updateCartItemQuantity: () => { },
    clearCart: () => { },
    addNotification: () => { },
    removeNotification: () => { },
    clearNotifications: () => { },
    addMessage: () => { },
    removeMessage: () => { },
    clearMessages: () => { },
});

export default UserContext;
export type { User, Product, AppNotification, Message }; // Updated export