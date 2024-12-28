"use client";
import React, { Suspense, useContext } from "react";
import Link from "next/link";
import UserContext from "@/app/context/InfoPlusProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Loading from "../components/Loading";

const CartPage: React.FC = () => {
  const { cartProducts, removeFromCart, updateCartItemQuantity } = useContext(UserContext);

  const totalPrice = cartProducts.reduce((acc, product) => {
    const quantity = product.quantity ?? 0; // Default to 0 if quantity is undefined
    return acc + (product.price * quantity);
  }, 0);
  

  return (
    <Suspense fallback={<Loading />}>
      

    <div className="p-6 text-white min-h-screen sticky z-10">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      {cartProducts.length === 0 ? (
        <p className="text-xl">Your cart is empty.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-slate-800">
              <tr>
                <th scope="col" className="px-6 py-3 rounded-tl-lg">Product</th>
                <th scope="col" className="px-6 py-3">Price</th>
                <th scope="col" className="px-6 py-3">Quantity</th>
                <th scope="col" className="px-6 py-3">Subtotal</th>
                <th scope="col" className="px-6 py-3 rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartProducts.map((product, index) => (
                <tr key={product._id} className={`bg-slate-700 hover:bg-slate-800 transition-colors duration-200`}>
                  <td className="px-6 py-4 font-medium">
                    <div className="flex items-center space-x-3">
                      <img src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${product.avatars[0]}`} alt={product.name} className="w-12 h-12 rounded-full" />
                      <div className="max-w-xs">
                        <Link href={`/product/${product._id}`} legacyBehavior>
                          <a className="font-bold text-blue-600 hover:underline">{product.name}</a>
                        </Link>
                        <div className="text-sm opacity-50 truncate">{product.description}</div>
                        {product.selectedColor && <div className="text-sm mt-1">Color: {product.selectedColor}</div>} {/* Display the selected color */}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">TND{product.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      min="1"
                      value={product.quantity}
                      onChange={(e) => updateCartItemQuantity(product._id, parseInt(e.target.value))}
                      className="w-16 px-2 py-1 text-black rounded"
                    />
                  </td>
                  <td className="px-6 py-4">TND{((product.price * (product.quantity ?? 1)).toFixed(2))}</td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => removeFromCart(product._id)}
                      className="font-medium text-red-500 hover:underline"
                    >
                      <FontAwesomeIcon icon={faTrash} />   Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr className="font-semibold text-gray-100 bg-gray-700">
                <th scope="row" className="px-6 py-3 text-base">Total</th>
                <td></td>
                <td></td>
                <td className="px-6 py-3">TND{totalPrice.toFixed(2)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <div className="w-full flex justify-between p-4">
        <Link href="/" legacyBehavior>
          <a className="inline-flex items-center text-blue-500 hover:underline">
            Continue Shopping
            <svg className="ml-2 h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M10 6l-1.41 1.41L13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </a>
        </Link>
        <Link href='order'>
          <button className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-white-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
            Order Now
          </button>
        </Link>
      </div>
    </div>
    </Suspense>

  );
};

export default CartPage;
