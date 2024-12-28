import React from 'react';
interface Product {
    _id: string;
    name: string;
    price: number;
    category: string;
    brand: string;
    avatars: string[];
    colors: string[];
    availability: 'En stock' | 'On order' | 'Out of stock';
    description: string;
}

interface ListViewProps {
    products: Product[];
    hoveredProductId: string | null;
    setHoveredProductId: (id: string | null) => void;
    addToCart: (product: Product) => void;
    addToWishlist: (product: Product) => void;
}

const ListView: React.FC<ListViewProps> = ({ products, hoveredProductId, setHoveredProductId, addToCart, addToWishlist }) => {
    return (
        <div className="space-y-4">
            {products.map(product => (
                <div
                    key={product._id}
                    className="border-b p-4"
                    onMouseEnter={() => setHoveredProductId(product._id)}
                    onMouseLeave={() => setHoveredProductId(null)}
                >
                    <div className="relative">
                        <img
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${product.avatars[0]}`}
                            alt={product.name}
                            className={`w-full h-48 object-contain mb-4 transition-transform duration-500 ${hoveredProductId === product._id && product.avatars.length > 1 ? 'opacity-0' : 'opacity-100'}`}
                        />
                        {hoveredProductId === product._id && product.avatars.length > 1 && (
                            <img
                                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${product.avatars[1]}`}
                                alt={product.name}
                                className="w-full h-48 object-contain mb-4 absolute top-0 left-0 opacity-100 transition-transform duration-500"
                            />
                        )}
                    </div>
                    <h2 className="text-lg font-bold">{product.name}</h2>
                    <p className="text-gray-600">{product.description}</p>
                    <p className="text-gray-800">${product.price}</p>
                    <button onClick={() => addToCart(product)} className="bg-blue-500 text-white px-4 py-2 mt-2">Add to Cart</button>
                    <button onClick={() => addToWishlist(product)} className="bg-red-500 text-white px-4 py-2 mt-2 ml-2">Add to Wishlist</button>
                </div>
            ))}
        </div>
    );
};

export default ListView;
