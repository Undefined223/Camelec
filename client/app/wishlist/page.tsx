"use client";
import React, { useState, useContext, Suspense } from 'react';
import { NextPage } from 'next';
import Link from "next/link";
import { CardBody, CardContainer, CardItem, useMouseEnter } from '../components/ui/3d-card';
import UserContext from '../context/InfoPlusProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTable, faThLarge, faTrash } from '@fortawesome/free-solid-svg-icons';
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
            <div className="p-6 text-white min-h-screen sticky z-10">
                <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>
                {wishlist.length === 0 ? (
                    <p className="text-xl">Your wishlist is empty.</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-end mb-4 gap-2">
                            <button
                                onClick={() => toggleViewMode('table')}
                                className={`px-4 py-2 rounded-full font-bold flex items-center gap-2 ${viewMode === 'table' ? 'bg-black text-white' : 'bg-gray-200 text-black '}`}
                            >
                                <FontAwesomeIcon icon={faTable} /> Table View
                            </button>
                            <button
                                onClick={() => toggleViewMode('card')}
                                className={`px-4 py-2 rounded-full font-bold flex items-center gap-2 ${viewMode === 'card' ? 'bg-black text-white' : 'bg-gray-200 text-black  '}`}
                            >
                                <FontAwesomeIcon icon={faThLarge} /> Card View
                            </button>
                        </div>
                        {viewMode === 'table' ? (
                            <TableView products={wishlist} removeFromWishlist={removeFromWishlist} />
                        ) : (
                            <CardView products={wishlist} removeFromWishlist={removeFromWishlist} />
                        )}
                    </div>
                )}
                <div className="w-full flex justify-between p-4 mt-6">
                    <Link href="/" legacyBehavior>
                        <a className="inline-flex items-center text-blue-500 hover:underline">
                            Continue Shopping
                            <svg className="ml-2 h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M10 6l-1.41 1.41L13.17 12l-4.58 4.59L10 18l6-6z" />
                            </svg>
                        </a>
                    </Link>
                    <div className="flex gap-4">
                        <button
                            onClick={addAllToCart}
                            className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-white-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                        >
                            Add All to Cart
                        </button>
                        <button
                            onClick={clearWishlist}
                            className="inline-flex h-12 items-center justify-center rounded-md border border-red-600 bg-red-500 px-6 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-slate-50 hover:bg-red-600"
                        >
                            Clear Wishlist
                        </button>
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
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-slate-800">
                    <tr>
                        <th scope="col" className="px-6 py-3 rounded-tl-lg">Product</th>
                        <th scope="col" className="px-6 py-3">Price</th>
                        <th scope="col" className="px-6 py-3 rounded-tr-lg">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product._id} className="bg-slate-700 hover:bg-slate-800 transition-colors duration-200">
                            <td className="px-6 py-4 font-medium">
                                <div className="flex items-center space-x-3">
                                    <img src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${product.avatars[0]}`} alt={product.name} className="w-12 h-12 rounded-full" />
                                    <div className="max-w-xs">
                                        <Link href={`/product/${product._id}`} legacyBehavior>
                                            <a className="font-bold text-blue-500 hover:underline">
                                                {product.name}
                                            </a>
                                        </Link>
                                        <div className="text-sm opacity-50 truncate">{product.description}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">TND{product.price.toFixed(2)}</td>
                            <td className="px-6 py-4">
                                <button
                                    onClick={() => removeFromWishlist(product._id)}
                                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                                >
                                    <FontAwesomeIcon icon={faTrash} /> Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

interface CardViewProps {
    products: Product[];
    removeFromWishlist: (id: string) => void;
}
const CardView: React.FC<CardViewProps> = ({ products, removeFromWishlist }) => {
    return (
        <div className='flex flex-wrap justify-center items-start gap-8'>
            {products.map((product) => (
                <CardContainer key={product._id} className="w-full sm:w-[20rem]">
                    <CardBody className="bg-black-2 text-white border-white relative group/card  border-black/[0.1] w-full h-[500px] rounded-xl p-6 border flex flex-col justify-between">
                        <div className="absolute top-4 right-4 z-10">
                            <CardItem
                                translateZ="50"
                                className="bg-white text-black   px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                            >
                                TND{product.price.toFixed(2)}
                            </CardItem>
                        </div>
                        <div>
                            <Link href={`/product/${product._id}`} legacyBehavior>
                                <a className="text-xl font-bold text-white hover:underline  w-3/4  h-6 overflow-hidden">
                                    <CardItem translateZ="50">
                                        {product.name}
                                    </CardItem>
                                </a>
                            </Link>
                            <CardItem
                                as="p"
                                translateZ="60"
                                className="text-white text-sm max-w-md mt-2  h-12 overflow-hidden"
                            >
                                <div className="line-clamp-2">{product.description}</div>
                            </CardItem>
                            <CardItem translateZ="100" className="w-full h-[300px] overflow-hidden rounded-xl group-hover/card:shadow-xl relative mt-4">
                                <ImageSwitcher
                                    firstImage={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${product.avatars[0]}`}
                                    secondImage={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${product.avatars[1]}`}
                                    alt={product.name}
                                />
                            </CardItem>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <CardItem
                                translateZ={20}
                                as="button"
                                className="px-4 py-2 rounded-xl bg-black   text-white text-xs font-bold"
                                onClick={() => removeFromWishlist(product._id)}
                            >
                                <FontAwesomeIcon icon={faTrash} /> Remove
                            </CardItem>
                        </div>
                    </CardBody>
                </CardContainer>
            ))}
        </div>
    );
};

interface ImageSwitcherProps {
    firstImage: string;
    secondImage: string;
    alt: string;
}

const ImageSwitcher: React.FC<ImageSwitcherProps> = ({ firstImage, secondImage, alt }) => {
    const [isMouseEntered] = useMouseEnter();

    return (
        <div className="relative w-full h-full">
            <img
                src={firstImage}
                className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ease-in-out"
                alt={alt}
                style={{ opacity: isMouseEntered ? 0 : 1 }}
            />
            <img
                src={secondImage}
                className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ease-in-out"
                alt={alt}
                style={{ opacity: isMouseEntered ? 1 : 0 }}
            />
        </div>
    );
};

export default WishlistPage;
