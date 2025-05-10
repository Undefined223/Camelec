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
import { Zap, Upload, Check } from 'lucide-react';

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

  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
    const formDataToSend = new FormData();
    
    formDataToSend.append('name', formData.productName ?? '');
    formDataToSend.append('category', formData.category ?? '');
    formDataToSend.append('subCategory', formData.subcategory ?? '');
    formDataToSend.append('description', formData.description ?? '');
    formDataToSend.append('price', formData.price ?? '');
    formDataToSend.append('brand', formData.brand ?? '');
    formDataToSend.append('availability', formData.availability ?? '');
    
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
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error submitting data:', error);
      toast.error('Failed to create product');
      setIsSubmitting(false);
    }
  };

  const memoizedFormData = useMemo(() => formData, [formData]);

  return (
    <div className="min-h-screen bg-white text-gray-900 p-8">
      <div className="max-w-4xl mx-auto bg-sky-50 rounded-2xl shadow-2xl border-2 border-sky-100 p-8 space-y-6 relative overflow-hidden">
        {/* Electrical grid background effect */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute w-full h-full bg-gradient-to-br from-sky-100 to-blue-100 animate-pulse"></div>
          <div className="absolute inset-0 bg-[linear-gradient(transparent_calc(100%/10),rgba(0,190,255,0.1)_calc(100%/10),rgba(0,190,255,0.1))] [background-size:50px_50px]"></div>
        </div>

        {/* Main content */}
        <div className="relative z-10">
          <div className="flex items-center mb-6 space-x-4">
            <Zap className="text-sky-600 w-10 h-10 animate-pulse" />
            <h1 className="text-4xl font-extrabold text-sky-800 tracking-tight">
              Electrical Product Creation
            </h1>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-sky-100 transition-all duration-300 hover:shadow-md">
              <h2 className="text-2xl text-sky-700 font-semibold mb-4 flex items-center">
                <Upload className="mr-3 text-sky-500" /> Product Images
              </h2>
              <ImageSorter onImagesChange={handleImagesChange} />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-sky-100 transition-all duration-300 hover:shadow-md">
              <h2 className="text-2xl text-sky-700 font-semibold mb-4">Product Information</h2>
              <ProductInformation 
                formData={memoizedFormData} 
                onFormChange={handleFormChange} 
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-sky-100 transition-all duration-300 hover:shadow-md">
              <ProductDetails 
                formData={memoizedFormData} 
                onFormChange={handleFormChange} 
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-sky-100 transition-all duration-300 hover:shadow-md">
              <ProductVariant 
                formData={memoizedFormData} 
                onFormChange={handleFormChange} 
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`
                w-full flex items-center justify-center 
                py-3 px-6 
                bg-sky-600 hover:bg-sky-700 
                text-white font-bold 
                rounded-lg 
                transition-all duration-300 
                transform hover:scale-105 
                focus:outline-none 
                focus:ring-2 focus:ring-sky-400 focus:ring-opacity-50
                ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}
              `}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2 animate-pulse">
                  <Zap className="w-5 h-5 animate-spin" />
                  <span>Submitting...</span>
                </div>
              ) : (
                <>
                  <Check className="mr-2" /> Submit Product
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentComponent;