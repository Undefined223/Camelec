import React from 'react';
import { Link, Copy, Heart, Search } from 'lucide-react';
import NextLink from 'next/link';

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
    addToCart: (product: Product) => void;
    addToWishlist: (product: Product) => void;
}

const ListView: React.FC<ListViewProps> = ({ products, hoveredProductId, setHoveredProductId, addToCart, addToWishlist }) => {
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
                                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                    <button className="p-2 bg-amber-400 rounded-lg hover:bg-amber-500 transform transition-all duration-200 hover:scale-110">
                                        <Link size={20} className="text-white" />
                                    </button>
                                    <button className="p-2 bg-amber-400 rounded-lg hover:bg-amber-500 transform transition-all duration-200 hover:scale-110 delay-75">
                                        <Copy size={20} className="text-white" />
                                    </button>
                                    <button className="p-2 bg-amber-400 rounded-lg hover:bg-amber-500 transform transition-all duration-200 hover:scale-110 delay-100">
                                        <Heart size={20} className="text-white" />
                                    </button>
                                    <button className="p-2 bg-amber-400 rounded-lg hover:bg-amber-500 transform transition-all duration-200 hover:scale-110 delay-150">
                                        <Search size={20} className="text-white" />
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
                                <div className="absolute inset-0 bg-[#1e2841] flex flex-col justify-center items-center transform transition-transform duration-300 translate-x-full group-hover:translate-x-0">
                                    <h2 className="text-amber-400 font-normal text-xl mb-2">{product.name}</h2>
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
