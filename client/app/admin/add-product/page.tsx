"use client";
import axiosInstance from '@/app/components/AxiosInstance';
import ImageSorter from '@/app/components/products/ImageUploader';
import ProductDetails from '@/app/components/products/ProductDetails';
import ProductInformation from '@/app/components/products/ProductInformation';
import ProductVariant from '@/app/components/products/ProductVariant';
import { Product } from '@/app/context/InfoPlusProvider';
import { FormDataa } from '@/app/types/types';
import React, { useState, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';

const ParentComponent: React.FC = () => {
  const [formData, setFormData] = useState<FormDataa>({
    productName: '',
    category: '',
    subcategory: '',
    description: '',
    price: '',
    brand: '',
    availability: '',
    colors: [],
    sizes: [],
    images: [],
    discount: 0,
  });

  const handleFormChange = useCallback((data: Partial<FormDataa>) => {
    setFormData(prevData => ({ ...prevData, ...data }));
  }, []);

  const handleImagesChange = useCallback((images: Array<{ url: string; id: string; file: File }>) => {
    setFormData(prevData => ({
      ...prevData,
      images
    }));
  }, []);

  const handleSubmit = async () => {
    const formDataToSend = new FormData();
    
    formDataToSend.append('name', formData.productName ?? '');
    formDataToSend.append('category', formData.category ?? '');
    formDataToSend.append('subCategory', formData.subcategory ?? '');
    formDataToSend.append('description', formData.description ?? '');
    formDataToSend.append('price', formData.price ?? '');
    formDataToSend.append('brand', formData.brand ?? '');
    formDataToSend.append('availability', formData.availability ?? '');
    
    // Send colors and sizes as JSON strings of arrays, not arrays containing JSON strings
    formDataToSend.append('colors', JSON.stringify(formData.colors));
    formDataToSend.append('sizes', JSON.stringify(formData.sizes));
    formDataToSend.append('discount', (formData.discount ?? 0).toString());

    formData.images?.forEach((image) => {
      if (image.file) {
        formDataToSend.append('avatars', image.file);
      }
    });

    try {
      const response = await axiosInstance.post<Product>('/api/products/create', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Product created successfully');
    } catch (error) {
      console.error('Error submitting data:', error);
      toast.error('Failed to create product');
    }
  };

  const memoizedFormData = useMemo(() => formData, [formData]);

  return (
    <div className="p-6 bg-white">
      <h1 className="text-3xl text-black font-bold mb-4">Product Images</h1>
      <ImageSorter onImagesChange={handleImagesChange} />
      
      <h1 className="text-3xl text-black font-bold mb-4">Product Information</h1>
      <ProductInformation 
        formData={memoizedFormData} 
        onFormChange={handleFormChange} 
      />
      
      <ProductDetails 
        formData={memoizedFormData} 
        onFormChange={handleFormChange} 
      />
      
      <ProductVariant 
        formData={memoizedFormData} 
        onFormChange={handleFormChange} 
      />
      
      <button
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Submit
      </button>
    </div>
  );
};

export default ParentComponent;