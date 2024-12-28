import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from './AxiosInstance';

interface Category {
    _id: string;
    name: string;
}

interface CategoryInputProps {
    value: string;
    onInputChange: (id: string, name: string) => void;
}

const CategoryInput: React.FC<CategoryInputProps> = ({ value, onInputChange }) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<Category[]>([]);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            if (inputValue.length > 2) {
                try {
                    const response = await axiosInstance.get(`/api/subCategories/name/${inputValue}`);
                    setSuggestions(response.data);
                } catch (error) {
                    console.error('Failed to fetch categories:', error);
                }
            } else {
                setSuggestions([]);
            }
        };

        fetchCategories();
    }, [inputValue]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setSuggestions([]);
                setIsFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        onInputChange('', e.target.value); // Clear ID, update name
        setIsFocused(true);
    };

    const handleSuggestionClick = (category: Category) => {
        setInputValue(category.name);
        onInputChange(category._id, category.name);
        setSuggestions([]);
        setIsFocused(false);
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setTimeout(() => {
            if (!isFocused) {
                setSuggestions([]);
            }
        }, 100);
    };

    return (
        <div ref={containerRef} className="relative">
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="w-full border rounded py-2 px-3 text-black"
            />
            {suggestions.length > 0 && (
                <div className="absolute left-0 right-0 bg-white border text-black border-slate-300 mt-1 rounded">
                    {suggestions.map((category) => (
                        <div
                            key={category._id}
                            onClick={() => handleSuggestionClick(category)}
                            className="cursor-pointer hover:bg-gray-200 px-2 py-1"
                        >
                            {category.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryInput;