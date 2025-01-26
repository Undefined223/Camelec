"use client";
import axiosInstance from '@/app/components/AxiosInstance';
import { NextPage } from 'next';
import React, { Suspense, useEffect, useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
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
            setEditingCategoryId(null)
            setEditingSubcategoryId(null)
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
                <div className="flex justify-center my-4 relative z-30">
                    <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="px-4 py-2 border border-sky-600 rounded-lg bg-white text-sky-800 focus:outline-none focus:ring focus:ring-sky-500 transition duration-300 ease-in-out"
                        placeholder="Enter category name"
                    />
                    <button
                        onClick={handleCreateCategory}
                        className="ml-2 bg-yellow-500 hover:bg-yellow-400 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-yellow-300 transition duration-300 ease-in-out"
                    >
                        Create Category
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white text-sky-800 rounded-lg overflow-hidden shadow-lg relative z-50">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border-b border-sky-300 text-left">ID</th>
                                <th className="px-4 py-2 border-b border-sky-300 text-left">Name</th>
                                <th className="px-4 py-2 border-b border-sky-300 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <React.Fragment key={category._id}>
                                    <tr className="hover:bg-sky-100 transition duration-300 ease-in-out">
                                        <td className="px-4 py-2 border-b border-sky-300 font-bold text-yellow-500 text-lg">{category._id}</td>
                                        <td className="px-4 py-2 border-b border-sky-300 font-bold text-yellow-500 text-lg">
                                            {editingCategoryId === category?._id ? (
                                                <input
                                                    type="text"
                                                    value={newCategoryName}
                                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                                    onKeyPress={(e) => handleKeyPress(e, category._id)}
                                                    onBlur={() => handleBlur(category._id)}
                                                    className="bg-transparent outline-none w-full text-sky-800"
                                                    autoFocus
                                                />
                                            ) : (
                                                <div onDoubleClick={() => handleDoubleClick(category)}>
                                                    {category.name} <span className="text-sm">(Category)</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 border-b border-sky-300">
                                            <button
                                                onClick={() => handleDelete(category._id)}
                                                className="bg-red-500 hover:bg-red-700 text-white px-4 py-1 rounded-lg transition duration-300 ease-in-out"
                                            >
                                                <FaTrash />
                                            </button>
                                            <button
                                                onClick={() => setAddingSubcategoryTo(category._id)}
                                                className="bg-sky-500 hover:bg-sky-400 text-white px-4 py-1 rounded-lg ml-2 transition duration-300 ease-in-out"
                                            >
                                                <FaPlus />
                                            </button>
                                        </td>
                                    </tr>
                                    {addingSubcategoryTo === category._id && (
                                        <tr>
                                            <td colSpan={3}>
                                                <div className="flex my-2">
                                                    <input
                                                        type="text"
                                                        value={newSubcategoryName}
                                                        onChange={(e) => setNewSubcategoryName(e.target.value)}
                                                        className="px-4 py-2 border border-sky-600 rounded-lg bg-white text-sky-800 focus:outline-none focus:ring focus:ring-sky-500 transition duration-300 ease-in-out"
                                                        placeholder="Enter subcategory name"
                                                    />
                                                    <button
                                                        onClick={() => handleCreateSubcategory(category._id)}
                                                        className="ml-2 bg-yellow-500 hover:bg-yellow-400 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-yellow-300 transition duration-300 ease-in-out"
                                                    >
                                                        Create Subcategory
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    {category?.subCategory.map((subCat) => (
                                        <tr key={subCat?._id} className="hover:bg-yellow-50 transition duration-300 ease-in-out">
                                            <td className="px-4 py-1 border-b border-sky-300 text-sky-500 pl-8 text-sm">
                                                {subCat?._id}
                                            </td>
                                            <td className="px-4 py-1 border-b border-sky-300 text-sm">
                                                {editingSubcategoryId === subCat?._id ? (
                                                    <input
                                                        type="text"
                                                        value={newSubcategoryName}
                                                        onChange={handleSubcategoryInputChange}
                                                        onKeyPress={(e) => handleSubcategoryKeyPress(e, subCat?._id)}
                                                        onBlur={() => handleSubcategoryBlur(subCat?._id)}
                                                        className="bg-transparent outline-none w-full text-sky-800"
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <div onDoubleClick={() => handleSubcategoryDoubleClick(subCat._id, subCat.name)}>
                                                        {subCat?.name} <span className="text-xs">(Subcategory)</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-1 border-b border-sky-300">
                                                <button
                                                    onClick={() => handleDeleteSubcategory(category._id, subCat._id)}
                                                    className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition duration-300 ease-in-out"
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
            </Suspense>
        </>
    );
};

export default Page;
