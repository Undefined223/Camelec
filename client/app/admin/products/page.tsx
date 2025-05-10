"use client";
import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import axiosInstance from '@/app/components/AxiosInstance';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import Loading from '@/app/components/Loading';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useRouter } from 'next/navigation';
import { Product } from '@/app/context/InfoPlusProvider';
import Link from 'next/link';


const ProductList: React.FC = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  const handleDelete = (productId: string) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm mx-auto">
            <h1 className="text-xl font-semibold mb-4">Confirm Delete</h1>
            <p className="mb-6">Are you sure you want to delete this product?</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                onClick={onClose}
              >
                No
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                onClick={async () => {
                  try {
                    await axiosInstance.delete(`/api/products/${productId}`);
                    setProducts(products.filter(product => product._id !== productId));
                    toast.success('Product deleted successfully');
                  } catch (error) {
                    toast.error('Failed to delete product');
                  }
                  onClose();
                }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        );
      }
    });
  };

  

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition-colors"
            onClick={() => router.push('/admin/add-product')}
          >
            <FaPlus /> Add New Product
          </button>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Images</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex -space-x-2">
                      {product.avatars?.slice(0, 3).map((avatar, index) => (
                        <img
                          key={index}
                          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${avatar}` || '/api/placeholder/40/40'}
                          alt=""
                          className="w-10 h-10 object-cover rounded-full border-2 border-white"
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.category}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{product.availability}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{product.discount}</td>

                  <td className="px-6 py-4 text-sm text-gray-500">TND{product.price}</td>

                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link href={`/edit-product/${product._id}`}>
                        <button className="text-gray-600 hover:text-blue-600 transition-colors">
                          <FaEdit className="w-5 h-5" />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <FaTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {loading && <Loading />}
    </div>
  );
};

export default ProductList;