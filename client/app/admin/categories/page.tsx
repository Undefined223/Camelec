"use client";
import axiosInstance from '@/app/components/AxiosInstance';
import { NextPage } from 'next';
import React, { Suspense, useEffect, useState } from 'react';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '@/app/components/Loading';

interface Props { }

interface Subcategory {
    _id: string;
    name: string;
}

interface Category {
    _id: string;
    name: string;
    subCategory: Subcategory[];
}

const Page: NextPage<Props> = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
    const [editingSubcategoryId, setEditingSubcategoryId] = useState<string | null>(null);
    const [newCategoryName, setNewCategoryName] = useState<string>('');
    const [newSubcategoryName, setNewSubcategoryName] = useState<string>('');
    const [addingSubcategoryTo, setAddingSubcategoryTo] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        getCategories();
    }, []);

    const handleCreateSubcategory = async (categoryId: string) => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.post(`/api/categories/addSubcategory`, {
                subCategoryName: newSubcategoryName,
                categoryId: categoryId,
            });
            setCategories(prevCategories =>
                prevCategories.map(category =>
                    category._id === categoryId
                        ? { ...category, subCategory: [...category.subCategory, data.subCategory] }
                        : category
                )
            );
            setNewSubcategoryName('');
            setAddingSubcategoryTo(null);
            setEditingCategoryId(null);
            setEditingSubcategoryId(null);
            toast.success('Subcategory added successfully');
            getCategories();
        } catch (err) {
            console.error(err);
            toast.error('Failed to add subcategory');
        } finally {
            setLoading(false);
        }
    };

    const getCategories = async () => {
        setLoading(true);
        try {
            const { data } = await axiosInstance.get('/api/categories');
            setCategories(data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    const handleDoubleClick = (category: Category) => {
        setEditingCategoryId(category._id);
        setNewCategoryName(category.name);
    };

    const handleSubcategoryDoubleClick = (subCatId: string, subCatName: string) => {
        setEditingSubcategoryId(subCatId);
        setNewSubcategoryName(subCatName);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewCategoryName(e.target.value);
    };

    const handleSubcategoryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewSubcategoryName(e.target.value);
    };

    const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>, categoryId: string) => {
        if (e.key === 'Enter') {
            await updateCategory(categoryId);
        }
    };

    const handleSubcategoryKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>, subCatId: string) => {
        if (e.key === 'Enter') {
            await updateSubcategory(subCatId);
        }
    };

    const handleBlur = async (categoryId: string) => {
        await updateCategory(categoryId);
    };

    const handleSubcategoryBlur = async (subCatId: string) => {
        await updateSubcategory(subCatId);
    };

    const updateCategory = async (categoryId: string) => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.put(`/api/categories/${categoryId}`, { name: newCategoryName });
            setCategories(categories.map((category) => (category._id === categoryId ? { ...category, name: newCategoryName } : category)));
            setEditingCategoryId(null);
            setNewCategoryName('');
            toast.success('Category updated successfully');
        } catch (err) {
            console.error(err);
            toast.error('Failed to update category');
        } finally {
            setLoading(false);
        }
    };

    const updateSubcategory = async (subCatId: string) => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.put(`/api/subcategories/${subCatId}`, { name: newSubcategoryName });
            setCategories(categories.map(category => {
                return {
                    ...category,
                    subCategory: category.subCategory.map(subCat =>
                        subCat?._id === subCatId ? { ...subCat, name: newSubcategoryName } : subCat
                    )
                };
            }));
            setEditingSubcategoryId(null);
            setNewSubcategoryName('');
            toast.success('Subcategory updated successfully');
        } catch (err) {
            console.error(err);
            toast.error('Failed to update subcategory');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (categoryId: string) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure you want to delete this category?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            setLoading(true);
                            await axiosInstance.delete(`/api/categories/${categoryId}`);
                            setCategories(categories.filter((category) => category._id !== categoryId));
                            toast.success('Category deleted successfully');
                        } catch (err) {
                            console.error(err);
                            toast.error('Failed to delete category');
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

    const handleDeleteSubcategory = (categoryId: string, subCategoryId: string) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure you want to delete this subcategory?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            setLoading(true);
                            await axiosInstance.post('/api/categories/removeSubcategory', {
                                categoryId,
                                subCategoryId,
                            });
                            setCategories(prevCategories =>
                                prevCategories.map(category =>
                                    category._id === categoryId
                                        ? {
                                            ...category,
                                            subCategory: category.subCategory.filter(subCat => subCat._id !== subCategoryId),
                                        }
                                        : category
                                )
                            );
                            toast.success('Subcategory deleted successfully');
                        } catch (err) {
                            console.error(err);
                            toast.error('Failed to delete subcategory');
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

    const handleCreateCategory = async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.post('/api/categories', { name: newCategoryName });
            setCategories([...categories, data]);
            setNewCategoryName('');
            toast.success('Category created successfully');
        } catch (err) {
            console.error(err);
            toast.error('Failed to create category');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Suspense fallback={<Loading />}>
                <ToastContainer />
                {loading && <div className="text-center text-sky-600 font-bold">Loading categories...</div>}
                <div className="flex justify-center my-8">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">Category Management</h1>
                        <div className="flex gap-4 mb-6">
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-300"
                                placeholder="Enter category name"
                            />
                            <button
                                onClick={handleCreateCategory}
                                className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-300"
                            >
                                Create Category
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {categories.map((category) => (
                                        <React.Fragment key={category._id}>
                                            <tr className="hover:bg-gray-50 transition duration-300">
                                                <td className="px-6 py-4 text-sm text-gray-700">{category._id}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {editingCategoryId === category._id ? (
                                                        <input
                                                            type="text"
                                                            value={newCategoryName}
                                                            onChange={handleInputChange}
                                                            onKeyPress={(e) => handleKeyPress(e, category._id)}
                                                            onBlur={() => handleBlur(category._id)}
                                                            className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-300"
                                                            autoFocus
                                                        />
                                                    ) : (
                                                        <div
                                                            onDoubleClick={() => handleDoubleClick(category)}
                                                            className="cursor-pointer"
                                                        >
                                                            {category.name} <span className="text-xs text-gray-500">(Category)</span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleDelete(category._id)}
                                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                        <button
                                                            onClick={() => setAddingSubcategoryTo(category._id)}
                                                            className="bg-sky-500 hover:bg-sky-600 text-white px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-300"
                                                        >
                                                            <FaPlus />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {addingSubcategoryTo === category._id && (
                                                <tr>
                                                    <td colSpan={3}>
                                                        <div className="flex gap-4 p-4 bg-gray-50">
                                                            <input
                                                                type="text"
                                                                value={newSubcategoryName}
                                                                onChange={(e) => setNewSubcategoryName(e.target.value)}
                                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-300"
                                                                placeholder="Enter subcategory name"
                                                            />
                                                            <button
                                                                onClick={() => handleCreateSubcategory(category._id)}
                                                                className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-300"
                                                            >
                                                                Create Subcategory
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                            {category.subCategory.map((subCat) => (
                                                <tr key={subCat?._id} className="hover:bg-gray-50 transition duration-300">
                                                    <td className="px-6 py-4 text-sm text-gray-500 pl-12">{subCat?._id}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {editingSubcategoryId === subCat?._id ? (
                                                            <input
                                                                type="text"
                                                                value={newSubcategoryName}
                                                                onChange={handleSubcategoryInputChange}
                                                                onKeyPress={(e) => handleSubcategoryKeyPress(e, subCat?._id)}
                                                                onBlur={() => handleSubcategoryBlur(subCat?._id)}
                                                                className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-300"
                                                                autoFocus
                                                            />
                                                        ) : (
                                                            <div
                                                                onDoubleClick={() => handleSubcategoryDoubleClick(subCat?._id, subCat?.name)}
                                                                className="cursor-pointer"
                                                            >
                                                                {subCat?.name} <span className="text-xs text-gray-400">(Subcategory)</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        <button
                                                            onClick={() => handleDeleteSubcategory(category._id, subCat._id)}
                                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Suspense>
        </>
    );
};

export default Page;