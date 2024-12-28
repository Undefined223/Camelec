import React from 'react';
import { Link, Copy, Heart, Search } from 'lucide-react';

interface GridViewProps {
    products: Product[];
    hoveredProductId: string | null;
    setHoveredProductId: (id: string | null) => void;
    addToCart: (product: Product) => void;
    addToWishlist: (product: Product) => void;
}

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

const GridView: React.FC<GridViewProps> = ({ products, hoveredProductId, setHoveredProductId, addToCart, addToWishlist }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {products.map(product => (
                <div
                    key={product._id}
                    className="w-full group relative transform transition-transform duration-300 hover:scale-105"
                    onMouseEnter={() => setHoveredProductId(product._id)}
                    onMouseLeave={() => setHoveredProductId(null)}
                >
                    {/* Main Container with rounded corners */}
                    <div className="bg-gray-50 rounded-3xl overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-xl">
                        {/* Image Container */}
                        <div className="aspect-square w-full flex items-center justify-center p-8 bg-gray-50 relative overflow-hidden">
                            {/* First Image */}
                            <img
                                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${product.avatars[0]}`}
                                alt={product.name}
                                className={`w-full h-full object-contain absolute top-0 left-0 transition-opacity duration-500 ${
                                    hoveredProductId === product._id ? 'opacity-0' : 'opacity-100'
                                }`}
                            />
                            
                            {/* Second Image */}
                            {product.avatars.length > 1 && (
                                <img
                                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${product.avatars[1]}`}
                                    alt={`${product.name} - alternate view`}
                                    className={`w-full h-full object-contain absolute top-0 left-0 transition-opacity duration-500 ${
                                        hoveredProductId === product._id ? 'opacity-100' : 'opacity-0'
                                    }`}
                                />
                            )}
                            
                            {/* Hover Action Buttons */}
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
                        
                        {/* Footer Container */}
                        <div className="relative overflow-hidden">
                            {/* Default Footer (Yellow) */}
                            <div className="w-full bg-amber-400 p-4 text-center transform transition-transform duration-300 group-hover:-translate-y-full absolute top-0 left-0">
                                <h2 className="text-black font-normal text-lg mb-1">{product.name}</h2>
                                <p className="text-black font-normal text-lg">
                                    ${product.price.toFixed(2)}
                                </p>
                            </div>

                            {/* Hover Footer (Navy Blue) */}
                            <div className="w-full bg-[#1e2841] p-4 text-center transform transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                                <h2 className="text-amber-400 font-normal text-lg mb-1">{product.name}</h2>
                                <p className="text-white font-normal text-lg">
                                    ${product.price.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default GridView;