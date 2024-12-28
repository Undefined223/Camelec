"use client";
import React, { useState, useEffect, Suspense } from "react";
import axiosInstance from '@/app/components/AxiosInstance';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Loading from '@/app/components/Loading';

interface Announcement {
    _id: string;
    text: string;
    imageUrl: string;
    product: {
        _id: string;
        name: string;
        price: number;
        category: string;
        brand: string;
        avatars: string[];
        availability: string;
        description: string;
    };
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
}

const HomePage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [size, setSize] = useState<'Small' | 'Big'>('Small');
    const [imageUrl, setImageUrl] = useState<File | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        fetchAnnouncements();
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axiosInstance.get<Product[]>('/api/products');
            console.log(response.data);
            setProducts(response.data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    const fetchAnnouncements = async () => {
        try {
            const res = await axiosInstance.get<Announcement[]>('/api/announcments/all');
            setAnnouncements(res.data);
        } catch (err) {
            console.error('Error fetching announcements:', err);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImageUrl(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('text', size); // Changed to size
            formData.append('productId', selectedProduct?._id || '');
            if (imageUrl) {
                formData.append('imageUrl', imageUrl);
            }

            console.log('FormData contents:');
            Array.from(formData.entries()).forEach(([key, value]) => {
                console.log(key + ', ' + value);
            });

            const response = await axiosInstance.post('/api/announcments/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Response:', response.data);

            fetchAnnouncements();

            setSize('Small'); // Reset size
            setImageUrl(null);
            setSelectedProduct(null);
        } catch (err) {
            console.error('Error creating announcement:', err);
        }
    };

    const handleProductSelect = (product: Product) => {
        setSelectedProduct(product);
        setIsDropdownOpen(false);
    };

    const handleDelete = (announcementId: string) => {
        confirmAlert({
            title: 'Confirm deletion',
            message: 'Are you sure you want to delete this announcement?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            await axiosInstance.delete(`/api/announcments/${announcementId}`);
                            fetchAnnouncements();
                        } catch (err) {
                            console.error('Error deleting announcement:', err);
                        }
                    }
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    };

    return (
        <Suspense fallback={<Loading />}>


        <div className="container mx-auto p-4 relative z-10">
            <h1 className="text-2xl font-bold mb-4">Create Announcement</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <select
                        value={size}
                        onChange={(e) => setSize(e.target.value as 'Small' | 'Big')}
                        className="w-full p-2 border text-black border-gray-300 rounded"
                    >
                        <option value="small">Small</option>
                        <option value="big">Big</option>
                    </select>
                </div>
                <input
                    type="file"
                    onChange={handleImageChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />

                <div className="relative">
                    <div
                        className="w-full p-2 border border-gray-300 rounded cursor-pointer flex items-center"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        {selectedProduct ? (
                            <>
                                <img
                                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${selectedProduct.avatars[0]}`}
                                    alt=""
                                    className="w-8 h-8 mr-2 object-cover"
                                />
                                <span>{selectedProduct?.name}</span>
                            </>
                        ) : (
                            "Select a product"
                        )}
                    </div>
                    {isDropdownOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-black border border-gray-300 rounded max-h-60 overflow-y-auto">
                            {products.map(product => (
                                <div
                                    key={product._id}
                                    className="p-2 hover:bg-yellow-400 cursor-pointer flex items-center"
                                    onClick={() => handleProductSelect(product)}
                                >
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${product.avatars[0]}`}
                                        alt=""
                                        className="w-8 h-8 mr-2 object-cover"
                                    />
                                    <span>{product?.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full p-2 bg-amber-400 text-white rounded hover:bg-yellow"
                >
                    Create Announcement
                </button>
            </form>

            <h2 className="text-xl font-bold mt-8 mb-4">Existing Announcements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {announcements.map((announcement) => (
                    <div key={announcement._id} className="border border-gray-300 rounded p-4">
                        <h3 className="font-bold mb-2">{announcement.text}</h3>
                        <img
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${announcement.imageUrl}`}
                            alt="Announcement Image"
                            className="w-full h-40 object-cover mb-2"
                        />
                        <p><strong>Product Name:</strong> {announcement?.product?.name}</p>
                        <p><strong>Price:</strong> {announcement.product.price}</p>
                        <p><strong>Category:</strong> {announcement.product.category}</p>
                        <p><strong>Brand:</strong> {announcement.product.brand}</p>
                        <p><strong>Availability:</strong> {announcement.product.availability}</p>
                        <p><strong>Description:</strong> {announcement.product.description}</p>
                        <button
                            onClick={() => handleDelete(announcement._id)}
                            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
        </Suspense>

    );
};

export default HomePage;
