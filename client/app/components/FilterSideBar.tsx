import React from 'react';

interface SidebarProps {
    brands: string[];
    colors: string[];
    availabilityOptions: string[];
    priceRange: [number, number];
    maxPrice: number;
    onPriceChange: (range: [number, number]) => void;
    onBrandChange: (brand: string) => void;
    onColorChange: (color: string) => void;
    onAvailabilityChange: (availability: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    brands,
    colors,
    availabilityOptions,
    priceRange = [0, 1000], // Default value for priceRange
    maxPrice,
    onPriceChange,
    onBrandChange,
    onColorChange,
    onAvailabilityChange,
}) => {
    if (!Array.isArray(priceRange) || priceRange.length !== 2 || typeof priceRange[0] !== 'number' || typeof priceRange[1] !== 'number') {
        throw new Error('priceRange must be an array of two numbers');
    }

    return (
        <div className="w-64 bg-[#002B5B] h-fit mt-2 ml-2 relative z-10 text-white p-4 rounded-xl">
            <h2 className="text-xl font-bold mb-4 text-[#87CEEB]">Filters</h2>

            <div className="mb-4">
                <h3 className="text-lg font-semibold text-[#87CEEB]">Price Range (TND)</h3>
                <input
                    type="range"
                    min={0}
                    max={maxPrice}
                    value={priceRange[0]}
                    onChange={(e) => onPriceChange([+e.target.value, priceRange[1]])}
                    className="w-full bg-[#FFA500]"
                />
                <div className="flex justify-between items-center mt-2">
                    <span className="text-[#FFA500]">TND{priceRange[0]}</span>
                    <span className="text-[#FFA500]">TND{priceRange[1]}</span>
                </div>
            </div>

            <div className="mb-4">
                <h3 className="text-lg font-semibold text-[#87CEEB]">Brand</h3>
                <select
                    onChange={(e) => onBrandChange(e.target.value)}
                    className="w-full bg-[#1E90FF] text-white rounded p-2"
                >
                    <option value="">All Brands</option>
                    {brands.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <h3 className="text-lg font-semibold text-[#87CEEB]">Color</h3>
                <select
                    onChange={(e) => onColorChange(e.target.value)}
                    className="w-full bg-[#1E90FF] text-white rounded p-2"
                >
                    <option value="">All Colors</option>
                    {colors.map(color => (
                        <option key={color} value={color}>{color}</option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <h3 className="text-lg font-semibold text-[#87CEEB]">Availability</h3>
                <select
                    onChange={(e) => onAvailabilityChange(e.target.value)}
                    className="w-full bg-[#1E90FF] text-white rounded p-2"
                >
                    <option value="">All</option>
                    {availabilityOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default Sidebar;
