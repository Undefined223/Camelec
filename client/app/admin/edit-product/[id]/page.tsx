"use client";
import axiosInstance from '@/app/components/AxiosInstance';
import ImageSorter from '@/app/components/products/EditImage';
import ProductDetails from '@/app/components/products/ProductDetails';
import ProductInformation from '@/app/components/products/ProductInformation';
import ProductVariant from '@/app/components/products/ProductVariant';
import { FormDataa } from '@/app/types/types';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';

interface ImageData {
  url: string;
  id: string;
  file?: File;
  isServerImage?: boolean;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  subCategory: string;
  brand: string;
  avatars: string[];
  availability: 'En stock' | 'On order' | 'Out of stock';
  description: string;
  colors: string[];
  sizes: string[];
  selectedColor?: string;
  quantity?: number;
  discount?: number;
  color?: string;
}

const ParentComponent = () => {
  const params = useParams();
  const { id } = params;

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

  const [isLoading, setIsLoading] = useState(true);

  const convertServerImages = (avatars: string[]): ImageData[] => {
    return avatars.map((avatar, index) => ({
      url: avatar,
      id: `server-image-${index}`,
      isServerImage: true
    }));
  };

  const fetchProductData = useCallback(async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const response = await axiosInstance.get<Product>(`/api/products/${id}`);
      const productData = response.data;

      const parsedColors = Array.isArray(productData.colors)
        ? productData.colors.map(color => {
            try {
              return typeof color === 'string' && color.startsWith('[')
                ? JSON.parse(color)
                : color;
            } catch {
              return color;
            }
          }).flat()
        : [];

      const parsedSizes = Array.isArray(productData.sizes)
        ? productData.sizes.map(size => {
            try {
              return typeof size === 'string' && size.startsWith('[')
                ? JSON.parse(size)
                : size;
            } catch {
              return size;
            }
          }).flat()
        : [];

      // Convert server images to the required format
      const initialImages = convertServerImages(productData.avatars);

      setFormData({
        productName: productData.name,
        category: productData.subCategory,
        subcategory: productData.subCategory,
        description: productData.description,
        price: productData.price.toString(),
        brand: productData.brand,
        availability: productData.availability,
        colors: parsedColors,
        sizes: parsedSizes,
        images: initialImages,
        discount: productData.discount ?? 0,
      });
    } catch (error) {
      console.error('Error fetching product data:', error);
      toast.error('Failed to fetch product data');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  const handleImagesChange = useCallback((images: ImageData[]) => {
    setFormData(prev => ({
      ...prev,
      images
    }));
  }, []);

  const handleSubmit = async () => {
    const formDataToSend = new FormData();

    // Add basic form fields
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

    // Create an array that preserves the order of both existing and new images
    const orderedImages = formData.images.map(img => ({
        path: img.url,
        isServerImage: img.isServerImage,
        file: img.file
    }));

    // Send the complete ordered list of images
    formDataToSend.append('imageOrder', JSON.stringify(
        orderedImages.map(img => ({
            path: img.path,
            isServerImage: img.isServerImage
        }))
    ));

    // Add files separately while maintaining their reference in the order
    orderedImages.forEach((img, index) => {
        if (img.file) {
            formDataToSend.append(`avatars`, img.file);
            // Add the index where this file should appear
            formDataToSend.append(`fileIndices`, index.toString());
        }
    });

    try {
        const response = await axiosInstance.put(`/api/products/${id}`, formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        if (response.data) {
            toast.success('Product updated successfully');
        }
    } catch (error) {
        console.error('Error updating product:', error);
        toast.error(error.response?.data?.message || 'Failed to update product');
    }
};
  if (isLoading) {
    return <div className="p-6 bg-white">Loading...</div>;
  }
  return (
    <div className="p-6 bg-white">
      <h1 className="text-3xl text-black font-bold mb-4">Product Images</h1>
      <ImageSorter 
        initialImages={formData.images}
        onImagesChange={handleImagesChange}
      />

      <h1 className="text-3xl text-black font-bold mb-4">Product Information</h1>
      <ProductInformation
        formData={formData}
        onFormChange={(data) => setFormData(prev => ({ ...prev, ...data }))}
      />

      <ProductDetails
        formData={formData}
        onFormChange={(data) => setFormData(prev => ({ ...prev, ...data }))}
      />

      <ProductVariant
        formData={formData}
        onFormChange={(data) => setFormData(prev => ({ ...prev, ...data }))}
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Update
      </button>
    </div>
  );
};

export default ParentComponent;