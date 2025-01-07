import React, { useContext } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import NextLink from 'next/link';
import UserContext from '@/app/context/InfoPlusProvider';

interface Product {
    _id: string;
    name: string;
    price: number;
    category: string;
    brand: string;
    avatars: string[];
    colors: string[];
    availability: 'En stock' | 'On order' | 'Out of stock';
    description: string;
}

interface ListViewProps {
    products: Product[];
    hoveredProductId: string | null;
    setHoveredProductId: (id: string | null) => void;
}

const ListView: React.FC<ListViewProps> = ({ products, hoveredProductId, setHoveredProductId }) => {
    const { addToCart, addToWishlist, removeFromWishlist, removeFromCart, wishlist, cartProducts } = useContext(UserContext);

    const isInWishlist = (productId: string) => wishlist.some(item => item._id === productId);
    const isInCart = (productId: string) => cartProducts.some(item => item._id === productId);

    const handleToggleWishlist = (e: React.MouseEvent, product: Product) => {
        e.preventDefault();
        if (isInWishlist(product._id)) {
            removeFromWishlist(product._id);
        } else {
            addToWishlist(product);
        }
    };

    const handleToggleCart = (e: React.MouseEvent, product: Product) => {
        e.preventDefault();
        if (isInCart(product._id)) {
            removeFromCart(product._id);
        } else {
            addToCart(product);
        }
    };

    return (
        <div className="space-y-6">
            {products.map(product => (
                <NextLink key={product._id} href={`/product/${product._id}`} passHref legacyBehavior>
                    <a className="w-full group relative transform transition-transform duration-300 hover:scale-105">
                        <div
                            className="flex bg-slate-50 rounded-3xl overflow-hidden shadow-2xl border border-[#0909092e] transition-shadow duration-300 hover:shadow-xl"
                            onMouseEnter={() => setHoveredProductId(product._id)}
                            onMouseLeave={() => setHoveredProductId(null)}
                        >
                            <div className="w-1/2 aspect-[4/3] flex items-center justify-center p-8 bg-slate-50 relative overflow-hidden">
                                <img
                                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${product.avatars[0]}`}
                                    alt={product.name}
                                    className={`w-full h-full object-contain absolute top-0 left-0 transition-opacity duration-500 ${
                                        hoveredProductId === product._id ? 'opacity-0' : 'opacity-100'
                                    }`}
                                />
                                {product.avatars.length > 1 && (
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${product.avatars[1]}`}
                                        alt={`${product.name} - alternate view`}
                                        className={`w-full h-full object-contain absolute top-0 left-0 transition-opacity duration-500 ${
                                            hoveredProductId === product._id ? 'opacity-100' : 'opacity-0'
                                        }`}
                                    />
                                )}
                                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                    <button
                                        onClick={(e) => handleToggleWishlist(e, product)}
                                        className={`p-3 rounded-lg transform transition-all duration-200 hover:scale-110 ${
                                            isInWishlist(product._id)
                                            ? 'bg-rose-500 hover:bg-rose-600'
                                            : 'bg-amber-400 hover:bg-amber-500'
                                        }`}
                                        aria-label="Toggle wishlist"
                                    >
                                        <Heart
                                            size={24}
                                            className="text-white"
                                            fill={isInWishlist(product._id) ? "white" : "none"}
                                        />
                                    </button>
                                    <button
                                        onClick={(e) => handleToggleCart(e, product)}
                                        className={`p-3 rounded-lg transform transition-all duration-200 hover:scale-110 ${
                                            isInCart(product._id)
                                            ? 'bg-green-500 hover:bg-green-600'
                                            : 'bg-amber-400 hover:bg-amber-500'
                                        }`}
                                        aria-label="Toggle cart"
                                    >
                                        <ShoppingCart size={24} className="text-white" />
                                    </button>
                                </div>
                            </div>
                            <div className="w-1/2 relative overflow-hidden">
                                <div className="absolute inset-0 bg-amber-400 flex flex-col justify-center items-center transform transition-transform duration-300 group-hover:-translate-x-full">
                                    <h2 className="text-black font-normal text-xl mb-2">{product.name}</h2>
                                    <p className="text-black font-normal text-xl">
                                        ${product.price.toFixed(2)}
                                    </p>
                                </div>
                                <div className="absolute inset-0 bg-[#2DACD9] flex flex-col justify-center items-center transform transition-transform duration-300 translate-x-full group-hover:translate-x-0">
                                    <h2 className="text-white font-normal text-xl mb-2">{product.name}</h2>
                                    <p className="text-white font-normal text-xl">
                                        ${product.price.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </a>
                </NextLink>
            ))}
        </div>
    );
};

export default ListView;
