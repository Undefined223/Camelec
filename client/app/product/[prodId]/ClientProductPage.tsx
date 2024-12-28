"use client";

import { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import axiosInstance from '@/app/components/AxiosInstance';
import UserContext from '@/app/context/InfoPlusProvider';
import Modal from '@/app/components/ui/modal';
import Loading from '@/app/components/Loading';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  brand: string;
  avatars: string[];
  availability: 'En stock' | 'On order' | 'Out of stock';
  description: string;
  colors: string[];
}

interface ClientProductPageProps {
  prodId: string;
}

export default function ClientProductPage({ prodId }: ClientProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const { addToCart, addToWishlist } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);

  useEffect(() => {
    getProduct();
  }, [prodId]);

  useEffect(() => {
    if (product && product.avatars.length > 0) {
      setSelectedImage(product.avatars[0]);
    }
  }, [product]);

  const getProduct = async () => {
    setLoadingProduct(true);
    try {
      const { data } = await axiosInstance.get(`/api/products/${prodId}`);
      setProduct(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingProduct(false);
    }
  };

  const getColorClass = (colorName: string | null | undefined) => {
    if (!colorName) return 'bg-gray-300';
    const colorMap: { [key: string]: string } = {
      red: 'bg-red',
      blue: 'bg-blue',
      green: 'bg-green',
      yellow: 'bg-yellow',
      purple: 'bg-purple',
      pink: 'bg-pink',
      gray: 'bg-gray',
      black: 'bg-black',
      white: 'bg-white border border-gray-300',
    };
    return colorMap[colorName.toLowerCase()] || 'bg-gray-300';
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, selectedColor?.toString());
    setIsModalOpen(true);
  };

  if (loadingProduct) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen p-9 sticky z-10">
      <div className="bg-slate-700 rounded-xl py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row -mx-4">
            <div className="md:flex-1 px-4">
              <div className="h-fit rounded-lg bg-gray-300 mb-4 relative">
                {product && (
                  <>
                    <img
                      className="w-full h-full object-cover"
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${selectedImage}`}
                      alt="Product Image"
                    />
                    <div className="absolute inset-0 overflow-hidden">
                      <div
                        className="zoom"
                        style={{
                          backgroundImage: `url(${process.env.NEXT_PUBLIC_API_BASE_URL}/${selectedImage})`,
                          backgroundSize: '100%',
                          objectFit: 'contain',
                        }}
                      ></div>
                    </div>
                  </>
                )}
              </div>
              <div className="flex flex-wrap gap-5">
                {product?.avatars.map((avatar, index) => (
                  <img
                    key={index}
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${avatar}`}
                    alt={`Avatar ${index}`}
                    className="w-16 h-16 object-contain rounded cursor-pointer z-10"
                    onClick={() => setSelectedImage(avatar)}
                  />
                ))}
              </div>
            </div>
            <div className="md:flex-1 mt-2 px-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{product?.name}</h2>
              <div>
                <span className="font-bold text-gray-700">Description:</span>
                <p className="text-gray-600 text-sm mt-2">{product?.description}</p>
              </div>
              <br />
              <div className="flex mb-4">
                <div className="mr-4">
                  <span className="font-bold text-gray-700">Price:</span>
                  <span className="text-gray-600"> TND {product?.price}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-700">Availability:</span>
                  <span className="text-gray-600">{product?.availability}</span>
                </div>
              </div>
              {product?.colors && product.colors.length > 0 && (
                <div className="mb-4">
                  <span className="font-bold text-gray-700">Select Color:</span>
                  <div className="flex items-center mt-2 sticky z-30">
                    {product.colors.map((color, index) => (
                      <button
                        key={index}
                        className={`w-6 h-6 rounded-full ${getColorClass(color)} mr-2`}
                        title={color}
                        onClick={() => setSelectedColor(color)}
                      ></button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex -mx-2 mb-4">
                <div className="w-1/2 px-2">
                  <button
                    className="w-full bg-graydark text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800"
                    onClick={() => product && handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
                <div className="w-1/2 px-2">
                  <button
                    className="w-full bg-graydark text-gray-800 py-2 px-4 rounded-full font-bold hover:bg-gray-300"
                    onClick={() => product && addToWishlist(product)}
                  >
                    Add to Wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Product Added to Cart</h2>
          {selectedColor && (
            <p className="mb-4">
              <span className="font-bold">Selected Color:</span> {selectedColor}
            </p>
          )}
          <div className="flex justify-center space-x-4">
            <Link href="/cart">
              <button className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-700">Go to Cart</button>
            </Link>
            <button
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
              onClick={() => setIsModalOpen(false)}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
