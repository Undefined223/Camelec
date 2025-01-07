"use client";
import { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import axiosInstance from '@/app/components/AxiosInstance';
import UserContext from '@/app/context/InfoPlusProvider';
import Modal from '@/app/components/ui/modal';
import Loading from '@/app/components/Loading';
import { useRouter } from 'next/navigation';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  subCategory: subCategory,
  brand: string;
  avatars: string[];
  availability: 'En stock' | 'On order' | 'Out of stock';
  description: string;
  colors: string[];
  sizes: string[];

  quantity?: number; // Add quantity field
}

interface ClientProductPageProps {
  prodId: string;
}
interface subCategory {
  name: string,
  _id: string,
}

export default function ClientProductPage({ prodId }: ClientProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState('S');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, addToWishlist } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const router = useRouter()
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

  console.log(product)
  const handleAddToCart = (product: Product,) => {
    addToCart(product, selectedColor?.toString(), quantity);
    setIsModalOpen(true);
  };

  const handleBuyNow = (product: Product) => {
    addToCart(product, selectedColor?.toString(), quantity)
    router.replace('/order')

  }

  if (loadingProduct) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen p-9 relative z-10 bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Images */}
        <div>
          <div className="bg-slate-50 rounded-lg mb-4 aspect-square">
            {product && (
              <img
                className="w-full h-full object-contain"
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${selectedImage}`}
                alt="Product Image"
              />
            )}
          </div>
          <div className="flex gap-4">
            {product?.avatars.map((avatar, index) => (
              <img
                key={index}
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${avatar}`}
                alt={`Product view ${index + 1}`}
                className="w-20 h-20 object-contain rounded-lg cursor-pointer border-2 hover:border-yellow"
                onClick={() => setSelectedImage(avatar)}
              />
            ))}
          </div>
        </div>

        {/* Right Column - Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-8">{product?.name}</h1>

          {/* Price */}
          <div className="mb-6 flex flex-wrap justify-start gap-6 items-center">
            <div className="flex items-center gap-2">
              <span className="text-slate-700">Price:</span>
              <span className="text-yellow-500 font-semibold">${product?.price.toFixed(2)}</span>
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-6 flex flex-wrap justify-start gap-6 items-center">
            <span className="text-slate-700">Size:</span>
            <div className="flex gap-2 mt-2">
              {product?.sizes.map((size) => (
                <button
                  key={size}
                  className={`w-8 h-8 rounded-full ${selectedSize === size
                      ? 'border-2 border-yellow'
                      : 'border border-slate-300'
                    }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          {product?.colors && (
            <div className="mb-6 flex flex-wrap justify-start gap-6 items-center">
              <div className="flex gap-2 mt-2">
                {product?.colors && product.colors.length > 0 && (
                  <div className="mb-4 flex flex-wrap justify-start gap-6 items-center">
                    <span className="font-bold text-slate-700">Select Color:</span>
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
              </div>
            </div>
          )}

          {/* Product Details */}
          <div className="space-y-2 mb-6 ">
            <div className="flex ">
              <span className="text-slate-700 w-24">Vendor:</span>
              <span>{product?.brand}</span>
            </div>
            <div className="flex">
              <span className="text-slate-700 w-24">Type:</span>
              <span>{product?.subCategory.name}</span>
            </div>
            <div className="flex">
              <span className="text-slate-700 w-24">Availability:</span>
              <span className="text-green-600">{product?.availability}</span>
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6 flex flex-wrap justify-start gap-6 items-center">
            <span className="text-slate-700">Quantity:</span>
            <div className="flex items-center gap-2 mt-2">
              <button
                className="w-8 h-8 border rounded-lg"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="w-12 text-center">{quantity}</span>
              <button
                className="w-8 h-8 border rounded-lg"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => product && handleAddToCart(product)}
              className="w-full bg-yellow text-white py-3 rounded-full  hover:text-black"
            >
              Add to Cart
            </button>
            <button
            onClick={() => product && handleBuyNow(product)}
            className="w-full bg-yellow text-white py-3 rounded-full  hover:text-black">
              Buy it now
            </button>
            <button
              onClick={() => product && addToWishlist(product)}
              className="w-full bg-slate-100 text-slate-800 py-3 rounded-full hover:bg-slate-200"
            >
              Add to wishlist
            </button>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="max-w-6xl mx-auto mt-12">
        <div className="flex justify-start">
          <div className="bg-yellow text-white px-10 py-4 rounded-t-lg hover:bg-[#2DACD9] transition-colors duration-300">
            Product Description
          </div>
        </div>
        <div className="p-8 bg-white border border-gray-200 rounded-b-lg rounded-tr-lg  mx-auto">
          <div className="prose max-w-none text-gray-800 text-center">
            {product?.description}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="text-center bg-white">
          <h2 className="text-xl font-bold mb-4">Product Added to Cart</h2>
          {selectedColor && (
            <p className="mb-4">
              <span className="font-bold">Selected Color:</span> {selectedColor}
            </p>
          )}
          <div className="flex justify-center space-x-4">
            <Link href="/cart">
              <button className="bg-yellow text-white py-2 px-4 rounded hover:bg-yellow">
                Go to Cart
              </button>
            </Link>
            <button
              className="bg-slate-500 text-white py-2 px-4 rounded hover:bg-slate-700"
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
