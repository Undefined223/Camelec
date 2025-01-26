import React, { useState, useEffect } from 'react';
import { FormDataa } from '@/app/types/types';
import CategoryInput from '../CategoryInput';

interface ProductInformationProps {
  formData: FormDataa;
  onFormChange: (data: Partial<FormDataa>) => void;
}

const ProductInformation: React.FC<ProductInformationProps> = ({ formData, onFormChange }) => {
  const [localState, setLocalState] = useState({
    productName: formData.productName,
    subcategoryId: formData.subcategory || '',
    subcategoryName: ''
  });

  // Sync with parent form data only when it changes
  useEffect(() => {
    setLocalState(prev => ({
      ...prev,
      productName: formData.productName,
      subcategoryId: formData.subcategory || ''
    }));
  }, [formData.productName, formData.subcategory]);

  const handleProductNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setLocalState(prev => ({ ...prev, productName: newName }));
    onFormChange({ productName: newName });
  };

  const handleSubcategoryChange = (id: string, name: string) => {
    setLocalState(prev => ({
      ...prev,
      subcategoryId: id,
      subcategoryName: name
    }));
    onFormChange({ subcategory: id });
  };

  return (
    <div className="p-6 w-full bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Product Information</h2>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productName">
          Product Name <span className="text-red-500">Required</span>
        </label>
        <input
          type="text"
          id="productName"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={localState.productName}
          onChange={handleProductNameChange}
          maxLength={70}
        />
        <p className="text-gray-500 text-xs italic">
          Include min. 40 characters to make it more attractive and easy for buyers to find, consisting of product type, brand, and information such as color, material, or type.
        </p>
        <p className="text-gray-500 text-xs italic mt-1">
          Maximum character {localState.productName.length}/70
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subcategory">
          Subcategory <span className="text-red-500">Required</span>
        </label>
        <div className="flex items-center">
          <CategoryInput
            value={localState.subcategoryName}
            onInputChange={handleSubcategoryChange}
          />
          <p className="text-gray-500 text-xs italic ml-2">
            You can add a new subcategory or choose from the existing subcategory list.
          </p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductInformation);