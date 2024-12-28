"use client";
import { NextPage } from 'next';
import { useContext, useEffect } from 'react';
import UserContext from '@/app/context/InfoPlusProvider';

const Page: NextPage = () => {
    const { clearCart } = useContext(UserContext);

    useEffect(() => {
        clearCart();
    }, [clearCart]);

    return (
        <div className="bg-gray-900 h-[80vh] flex items-center justify-center relative z-10">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <svg
                    viewBox="0 0 24 24"
                    className="text-green-400 w-16 h-16 mx-auto mb-6"
                >
                    <path
                        fill="currentColor"
                        d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
                    ></path>
                </svg>
                <div className="text-center">
                    <h3 className="md:text-2xl text-lg text-gray-100 font-semibold">Payment Done!</h3>
                    <p className="text-gray-400 my-2">Thank you for completing your secure online payment.</p>
                    <p className="text-gray-400">Have a great day!</p>
                    <div className="py-10 text-center">
                        <a
                            href="#"
                            className="px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-md"
                        >
                            GO BACK
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
