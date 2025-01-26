import React, { useState, useCallback } from 'react';
import { FormDataa } from '@/app/types/types';

interface ProductVariantProps {
  formData: FormDataa;
  onFormChange: (data: Partial<FormDataa>) => void;
}

const ProductVariant: React.FC<ProductVariantProps> = ({ formData, onFormChange }) => {
  const [variantType, setVariantType] = useState<'color' | 'size'>('color');
  const [variantValue, setVariantValue] = useState('');

  const handleAddVariant = useCallback(() => {
    if (variantValue.trim() === '') return;

    const arrayKey = variantType === 'color' ? 'colors' : 'sizes';
    const currentArray = Array.isArray(formData[arrayKey]) ? formData[arrayKey] : [];

    // Add the new value to the array without any JSON stringification
    onFormChange({
      [arrayKey]: [...currentArray, variantValue.trim()]
    });

    setVariantValue('');
  }, [variantValue, variantType, formData, onFormChange]);

  const handleRemoveVariant = useCallback((type: 'colors' | 'sizes', valueToRemove: string) => {
    const currentArray = Array.isArray(formData[type]) ? formData[type] : [];
    const newArray = currentArray.filter(item => item !== valueToRemove);

    onFormChange({
      [type]: newArray
    });
  }, [formData, onFormChange]);

  const displayArray = useCallback((array: any[]): string[] => {
    return array.map(item => {
      if (typeof item === 'string') {
        try {
          // Check if the item is a JSON string
          return item.startsWith('[') ? JSON.parse(item) : item;
        } catch {
          return item;
        }
      }
      return item;
    }).flat();
  }, []);

  return (
    <div className="p-6 w-full mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Product Variant</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Variant Type</label>
        <select
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={variantType}
          onChange={(e) => setVariantType(e.target.value as 'color' | 'size')}
        >
          <option value="color">Color</option>
          <option value="size">Size</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Variant Value</label>
        <input
          type="text"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={variantValue}
          onChange={(e) => setVariantValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleAddVariant();
            }
          }}
        />
      </div>
      <button
        onClick={handleAddVariant}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Add Variant
      </button>

      <div className="mt-4">
        <h3 className="text-xl font-bold mb-2">Colors</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200">Color</th>
                <th className="py-2 px-4 border-b border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayArray(formData.colors || []).map((color, index) => (
                <tr key={`color-${index}`}>
                  <td className="py-2 px-4 border-b border-gray-200">{color}</td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <button
                      onClick={() => handleRemoveVariant('colors', color)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-bold mb-2 mt-4">Sizes</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200">Size</th>
                <th className="py-2 px-4 border-b border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayArray(formData.sizes || []).map((size, index) => (
                <tr key={`size-${index}`}>
                  <td className="py-2 px-4 border-b border-gray-200">{size}</td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <button
                      onClick={() => handleRemoveVariant('sizes', size)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductVariant;