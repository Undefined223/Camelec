"use client";
import React, { useState, useEffect, Suspense } from 'react';
import axiosInstance from '@/app/components/AxiosInstance';
import { NextPage } from 'next';
import { confirmAlert } from 'react-confirm-alert';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import ProductForm from '@/app/components/ProductForm';
import { AxiosResponse } from 'axios';
import Loading from '@/app/components/Loading';

interface Product {
    _id: string;
    name: string;
    price: number;
    category: string;
    subCategory: string;
    brand: string;
    avatars: string[];
    availability: 'En stock' | 'On order' | 'Out of stock';
    description: string;
    colors: string[];
}

const Page: NextPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get<Product[]>('/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId: string) => {
        confirmAlert({
            title: 'Confirm Delete',
            message: 'Are you sure you want to delete this product?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            setLoading(true);
                            await axiosInstance.delete(`/api/products/${productId}`);
                            setProducts((prevProducts) =>
                                prevProducts.filter((product) => product._id !== productId)
                            );
                            toast.success('Product deleted successfully');
                        } catch (error) {
                            console.error('Failed to delete product:', error);
                            toast.error('Failed to delete product');
                        } finally {
                            setLoading(false);
                        }
                    },
                },
                {
                    label: 'No',
                    onClick: () => { },
                },
            ],
        });
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleSubmitForm = async (formData: FormData) => {
        try {
            setLoading(true);
            let response: AxiosResponse;
            if (editingProduct) {
                response = await axiosInstance.put<Product>(
                    `/api/products/${editingProduct._id}`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
                // Re-fetch products to ensure the state is up-to-date
                await fetchProducts();
                toast.success('Product updated successfully');
            } else {
                response = await axiosInstance.post<Product>('/api/products/create', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setProducts((prevProducts) => [...prevProducts, response.data]);
                toast.success('Product created successfully');
            }
        } catch (error) {
            console.error('Failed to submit product:', error);
            toast.error('Failed to submit product');
        } finally {
            setLoading(false);
            setIsModalOpen(false);
            setEditingProduct(null);
        }
    };
    return (
        <Suspense fallback={<Loading />}>
            <div className="container mx-auto p-4 relative z-10 text-black">
                <h1 className="text-3xl font-bold mb-4 text-white">Product List</h1>
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-4 flex items-center"
                    onClick={() => setIsModalOpen(true)}
                >
                    <FaPlus className="mr-2" /> Add Product
                </button>

                <ProductForm
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingProduct(null);
                    }}
                    onSubmit={handleSubmitForm}
                    initialData={editingProduct ?? undefined}
                />

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {products.map((product) => (
                            <div key={product._id} className="bg-white rounded shadow p-4">
                                <h2 className="text-lg font-bold mb-2">{product.name}</h2>
                                <p className="text-gray-700 mb-2">{product.description}</p>
                                <p className="text-slate-600 mb-1">Category: {product.subCategory}</p>
                                <p className="text-slate-600 mb-1">Brand: {product.brand}</p>
                                <p className="text-slate-600 mb-1">Availability: {product.availability}</p>
                                <p className="text-slate-600 mb-2">Colors: {product.colors.join(', ')}</p>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-lg">
                                        ${product.price.toFixed(2)}
                                    </span>
                                    <div>
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className=" hover:bg-red-600  py-1 px-2 rounded"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className=" hover:bg-red-600  py-1 px-2 rounded"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-wrap">
                                    {product.avatars.map((avatar, index) => (
                                        <img
                                            key={index}
                                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${avatar}`}
                                            alt={`Product image ${index + 1}`}
                                            className="w-16 h-16 object-cover rounded mr-2 mb-2"
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Suspense>
    );
};

export default Page;
