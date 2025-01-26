import React, { useState, useEffect } from 'react';
import { FormDataa } from '@/app/types/types';

interface ProductDetailsProps {
  formData: FormDataa;
  onFormChange: (data: Partial<FormDataa>) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ formData, onFormChange }) => {
  const [localState, setLocalState] = useState({
    price: formData.price,
    description: formData.description,
    brand: formData.brand,
    availability: formData.availability || 'En Stock',
    discount: formData.discount || 0
  });

  // Only sync with parent form data when it changes
  useEffect(() => {
    setLocalState({
      price: formData.price,
      description: formData.description,
      brand: formData.brand,
      availability: formData.availability || 'En Stock',
      discount: formData.discount || 0
    });
  }, [formData.price, formData.description, formData.brand, formData.availability, formData.discount]);

  const handleInputChange = (field: keyof typeof localState, value: string | number) => {
    const updatedValue = field === 'discount' 
      ? Math.min(100, Math.max(0, Number(value)))
      : value;

    setLocalState(prev => ({
      ...prev,
      [field]: updatedValue
    }));

    onFormChange({ [field]: updatedValue });
  };

  // Calculate final price for display only
  const calculateFinalPrice = () => {
    const numericPrice = parseFloat(localState.price);
    if (!isNaN(numericPrice) && numericPrice > 0) {
      return (numericPrice * (1 - localState.discount / 100)).toFixed(2);
    }
    return '0.00';
  };

  return (
    <div className="p-6 w-full mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Product Details</h2>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
          Price
        </label>
        <input
          type="number"
          id="price"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={localState.price}
          onChange={(e) => handleInputChange('price', e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="discount">
          Discount (%)
        </label>
        <input
          type="number"
          id="discount"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={localState.discount}
          onChange={(e) => handleInputChange('discount', e.target.value)}
          min="0"
          max="100"
          step="1"
        />
        {localState.discount > 0 && localState.price && (
          <div className="mt-2 text-sm text-gray-600">
            Final price after discount: ${calculateFinalPrice()}
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={localState.description}
          rows={10}
          onChange={(e) => handleInputChange('description', e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="brand">
          Brand
        </label>
        <input
          type="text"
          id="brand"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={localState.brand}
          onChange={(e) => handleInputChange('brand', e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="availability">
          Availability
        </label>
        <select
          id="availability"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={localState.availability}
          onChange={(e) => handleInputChange('availability', e.target.value)}
        >
          <option value="En stock">En stock</option>
          <option value="On order">On order</option>
          <option value="Off stock">Off stock</option>
        </select>
      </div>
    </div>
  );
};

export default React.memo(ProductDetails);