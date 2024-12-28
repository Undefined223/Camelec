"use client";
import { NextPage } from 'next';
import React, { Suspense, useContext, useEffect, useState } from "react";
import axiosInstance from '@/app/components/AxiosInstance';
import { useParams } from 'next/navigation';
import UserContext from '@/app/context/InfoPlusProvider';
import Sidebar from '@/app/components/FilterSideBar';
import Head from 'next/head';
import Loading from '@/app/components/Loading';
import GridView from '@/app/components/GridView'; // Import the new GridView component
import ListView from '@/app/components/ListView'; // Import the new ListView component

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

interface Props { }

const Page: NextPage<Props> = () => {
    const { addToCart, addToWishlist } = useContext(UserContext);

    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const { id } = useParams<{ id: string }>();

    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedBrand, setSelectedBrand] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [selectedAvailability, setSelectedAvailability] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<number>(1000);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosInstance.get<Product[]>(`/api/products/subCategory/${id}`);
                const productsData = response.data;
                setProducts(productsData);

                // Set the maximum price based on the fetched products
                const highestPrice = Math.max(...productsData.map(p => p.price));
                setMaxPrice(highestPrice);
                setPriceRange([0, highestPrice]); // Adjust initial price range
            } catch (error) {
                console.error('Failed to fetch products:', error);
            }
        };

        fetchProducts();
    }, [id]);

    useEffect(() => {
        const applyFilters = () => {
            const filtered = products.filter(product =>
                product.price >= priceRange[0] && product.price <= priceRange[1] &&
                (selectedCategory === '' || product.category === selectedCategory) &&
                (selectedBrand === '' || product.brand === selectedBrand) &&
                (selectedColor === '' || product.colors.includes(selectedColor)) &&
                (selectedAvailability === '' || product.availability === selectedAvailability)
            );
            setFilteredProducts(filtered);
        };

        applyFilters();
    }, [products, priceRange, selectedCategory, selectedBrand, selectedColor, selectedAvailability]);

    const uniqueBrands = Array.from(new Set(products.map(p => p.brand)));
    const uniqueColors = Array.from(new Set(products.flatMap(p => p.colors)));
    const availabilityOptions = Array.from(new Set(products.map(p => p.availability)));

    const resetFilters = () => {
        setPriceRange([0, maxPrice]);
        setSelectedCategory('');
        setSelectedBrand('');
        setSelectedColor('');
        setSelectedAvailability('');
    };

    return (
        <>
            <Suspense fallback={<Loading />}>
                <Head>
                    <title>Product Category - Your E-commerce Store</title>
                    <meta name="description" content="Browse our wide range of products in this category. Find the best deals and offers on your favorite items." />
                    <meta name="keywords" content="products, category, e-commerce, online shopping" />
                    <meta property="og:title" content="Product Category - Your E-commerce Store" />
                    <meta property="og:description" content="Browse our wide range of products in this category. Find the best deals and offers on your favorite items." />
                    <meta property="og:url" content={`https://yourdomain.com/category/${id}`} />
                    <meta property="og:type" content="website" />
                    <link rel="canonical" href={`https://yourdomain.com/category/${id}`} />
                    <script type="application/ld+json">
                        {JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebPage",
                            "name": "Product Category - Your E-commerce Store",
                            "description": "Browse our wide range of products in this category. Find the best deals and offers on your favorite items.",
                            "url": `https://yourdomain.com/category/${id}`
                        })}
                    </script>
                </Head>
                <div className="min-h-screen flex flex-col md:flex-row relative z-10">
                    <Sidebar
                        brands={uniqueBrands}
                        colors={uniqueColors}
                        availabilityOptions={availabilityOptions}
                        priceRange={priceRange}
                        maxPrice={maxPrice}
                        onPriceChange={setPriceRange}
                        onBrandChange={setSelectedBrand}
                        onColorChange={setSelectedColor}
                        onAvailabilityChange={setSelectedAvailability}
                    />
                    <div className="flex-1 p-4">
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-4 py-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            >
                                Grid View
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-4 py-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            >
                                List View
                            </button>
                        </div>
                        {viewMode === 'grid' ? (
                            <GridView
                                products={filteredProducts}
                                hoveredProductId={hoveredProductId}
                                setHoveredProductId={setHoveredProductId}
                                addToCart={addToCart}
                                addToWishlist={addToWishlist}
                            />
                        ) : (
                            <ListView
                                products={filteredProducts}
                                hoveredProductId={hoveredProductId}
                                setHoveredProductId={setHoveredProductId}
                                addToCart={addToCart}
                                addToWishlist={addToWishlist}
                            />
                        )}
                    </div>
                </div>
            </Suspense>
        </>
    );
};

export default Page;
