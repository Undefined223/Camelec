"use client";
import React, { useState, useContext, Suspense } from 'react';
import { NextPage } from 'next';
import Link from "next/link";
import { CardBody, CardContainer, CardItem, useMouseEnter } from '../components/ui/3d-card';
import UserContext from '../context/InfoPlusProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTable, faThLarge, faTrash, faBolt, faPlug } from '@fortawesome/free-solid-svg-icons';
import Loading from '../components/Loading';

interface Props { }

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    avatars: string[];
}

const WishlistPage: NextPage<Props> = () => {
    const { wishlist, addAllToCart, removeFromWishlist, clearWishlist } = useContext(UserContext);
    const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

    const toggleViewMode = (mode: 'table' | 'card') => {
        setViewMode(mode);
    };

    return (
        <Suspense fallback={<Loading />}>
            <div className="p-6 bg-white text-sky-700 min-h-screen sticky z-10 relative overflow-hidden">
                {/* Decorative electrical elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="lightning-bolt absolute top-10 left-10 h-16 w-2 bg-sky-300 opacity-60 animate-pulse"></div>
                    <div className="lightning-bolt absolute top-20 right-20 h-24 w-3 bg-sky-400 opacity-40 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    <div className="lightning-bolt absolute bottom-40 left-1/3 h-20 w-2 bg-sky-300 opacity-50 animate-pulse" style={{animationDelay: '1.2s'}}></div>
                    <div className="circuit-line absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-100 via-sky-400 to-sky-100"></div>
                    <div className="circuit-line absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-sky-100 via-sky-400 to-sky-100"></div>
                </div>
                
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-6 text-sky-700 flex items-center">
                        <FontAwesomeIcon icon={faBolt} className="mr-3 text-sky-500 animate-pulse" />
                        Your Power Wishlist
                    </h1>

                    {wishlist.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-sky-200 rounded-lg">
                            <FontAwesomeIcon icon={faPlug} className="text-5xl text-sky-300 mb-4" />
                            <p className="text-xl text-sky-600">Your power wishlist is disconnected.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            
                                <TableView products={wishlist} removeFromWishlist={removeFromWishlist} />
                          
                        </div>
                    )}
                    <div className="w-full flex justify-between p-4 mt-6">
                        <Link href="/" legacyBehavior>
                            <a className="inline-flex items-center text-sky-600 hover:text-sky-800 transition-colors">
                                <span className="border-b-2 border-sky-200 hover:border-sky-500 pb-1">Continue Shopping</span>
                                <svg className="ml-2 h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M10 6l-1.41 1.41L13.17 12l-4.58 4.59L10 18l6-6z" />
                                </svg>
                            </a>
                        </Link>
                        <div className="flex gap-4">
                            <button
                                onClick={addAllToCart}
                                className="inline-flex h-12 items-center justify-center rounded-md bg-gradient-to-r from-sky-400 to-sky-600 hover:from-sky-500 hover:to-sky-700 px-6 font-medium text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-white hover:shadow-lg hover:shadow-sky-200 group"
                            >
                                <FontAwesomeIcon icon={faBolt} className="mr-2 group-hover:animate-pulse" />
                                Add All to Cart
                            </button>
                            <button
                                onClick={clearWishlist}
                                className="inline-flex h-12 items-center justify-center rounded-md border border-red-300 bg-white text-red-500 hover:bg-red-50 px-6 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-white"
                            >
                                Clear Wishlist
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Suspense>
    );
};

interface TableViewProps {
    products: Product[];
    removeFromWishlist: (id: string) => void;
}
const TableView: React.FC<TableViewProps> = ({ products, removeFromWishlist }) => {
    return (
        <div className="overflow-x-auto rounded-xl shadow-lg">
            <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-gradient-to-r from-sky-400 to-sky-600 text-white">
                    <tr>
                        <th scope="col" className="px-6 py-3 rounded-tl-lg">Product</th>
                        <th scope="col" className="px-6 py-3">Price</th>
                        <th scope="col" className="px-6 py-3 rounded-tr-lg">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr 
                            key={product._id} 
                            className={`${index % 2 === 0 ? 'bg-sky-50' : 'bg-white'} hover:bg-sky-100 transition-colors duration-200`}
                        >
                            <td className="px-6 py-4 font-medium">
                                <div className="flex items-center space-x-3">
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-sky-300 flex-shrink-0 group">
                                        <img 
                                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${product.avatars[0]}`} 
                                            alt={product.name} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                    <div className="max-w-xs">
                                        <Link href={`/product/${product._id}`} legacyBehavior>
                                            <a className="font-bold text-sky-700 hover:text-sky-900 transition-colors">
                                                {product.name}
                                            </a>
                                        </Link>
                                        <div className="text-sm text-sky-600/70 truncate">{product.description}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 font-semibold">TND{product.price.toFixed(2)}</td>
                            <td className="px-6 py-4">
                                <button
                                    onClick={() => removeFromWishlist(product._id)}
                                    className="text-red-500 hover:text-red-700 transition-colors duration-200 flex items-center"
                                >
                                    <FontAwesomeIcon icon={faTrash} className="mr-1" /> Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};



export default WishlistPage;