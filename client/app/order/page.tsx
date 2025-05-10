"use client";
import { NextPage } from 'next';
import { useState, useContext, useEffect, Suspense } from 'react';
import axiosInstance from '@/app/components/AxiosInstance';
import UserContext from '@/app/context/InfoPlusProvider';
import Modal from '@/app/components/ui/modal';
import AddressForm from '@/app/components/AddressForm';
import Loading from '../components/Loading';

interface Address {
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
}

const Page: NextPage = () => {
    const { user, cartProducts, setCartProducts } = useContext(UserContext);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [deliveryMethod, setDeliveryMethod] = useState<string>('inStore');
    const [paymentMethod, setPaymentMethod] = useState<string>('cash');
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

    useEffect(() => {
        if (user) {
            axiosInstance.get(`/api/user/${user?._id}`)
                .then(response => {
                    console.log('API Response:', response.data);
                    setAddresses(response.data.address || []);
                })
                .catch(err => {
                    console.error('Error fetching addresses:', err);
                    setAddresses([]); // Ensure addresses is an empty array on error
                });
        }
    }, [user]);

    const handleSubmit = async (newAddress: Address) => {
        try {
            const updatedAddresses = [...addresses, newAddress];
            await axiosInstance.put(`/api/user/${user?._id}`, { address: updatedAddresses });
            setAddresses(updatedAddresses);
            setIsAddressModalOpen(false);
            if (currentStep === 1) setCurrentStep(2);
        } catch (err) {
            console.error('Error updating addresses:', err);
        }
    }

    const handleAddressSelect = (address: Address) => {
        setSelectedAddress(address);
        setCurrentStep(2);
    }

    const handleDeliveryMethodChange = (method: string) => {
        setDeliveryMethod(method);
        setCurrentStep(3);
    }

    const handlePaymentMethodChange = (method: string) => {
        setPaymentMethod(method);
    }

    const calculateTotal = () => {
        let total = cartProducts.reduce((total, product) => total + (product.price * (product.quantity ?? 0)), 0);
        if (deliveryMethod === 'homeDelivery') {
            total += 8;
        }
        return total; // Return as a number
    };

    const handleFinalizeOrder = async () => {
        if (!selectedAddress) {
            alert('Please select an address');
            return;
        }
        if (!deliveryMethod) {
            alert('Please select a delivery method');
            return;
        }
        if (!paymentMethod) {
            alert('Please select a payment method');
            return;
        }

        const totalPrice = calculateTotal(); // Ensure this is a number

        const orderData = {
            orderItems: cartProducts.map(product => ({
                product: product._id, // Ensure _id is used here
                quantity: product.quantity,
                price: product.price
            })),
            shippingAddress: selectedAddress,
            paymentMethod,
            itemsPrice: totalPrice,
            taxPrice: 0,
            shippingPrice: deliveryMethod === 'homeDelivery' ? 8 : 0,
            totalPrice: totalPrice, // Ensure this is a number
            paymentToken: paymentMethod === 'creditCard' ? "TND" : undefined,
            userId: user?._id,
        };

        try {
            const orderResponse = await axiosInstance.post('/api/orders', orderData);

            if (paymentMethod === 'creditCard') {
                if (orderResponse.data.paymentUrl) {
                    // Redirect to payment URL
                    window.location.href = orderResponse.data.paymentUrl;
                } else {
                    alert('Payment initiation failed. Please try again.');
                }
            } else {
                alert('Order placed successfully with Cash on Delivery!');
                setCartProducts([]); // Clear the cart
                localStorage.setItem('cart', JSON.stringify([])); // Clear cart in local storage
                window.location.href = '/'; // Redirect to homepage
            }
        } catch (err) {
            console.error('Error placing order', err);
            alert('Error placing order');
        }
    };

    return (
        <Suspense fallback={<Loading />}>
            <div className='sticky z-10 bg-white text-blue-800 min-h-screen'>
                {/* Electrical circuit decoration at the top */}
                <div className="w-full h-8 bg-sky-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-full">
                        <div className="circuit-line absolute top-4 left-0 w-full h-1 bg-blue-500 animate-pulse"></div>
                        <div className="circuit-node absolute top-2 left-1/4 w-4 h-4 rounded-full bg-blue-400 animate-ping"></div>
                        <div className="circuit-node absolute top-2 left-1/2 w-4 h-4 rounded-full bg-blue-400 animate-ping" style={{animationDelay: "0.5s"}}></div>
                        <div className="circuit-node absolute top-2 left-3/4 w-4 h-4 rounded-full bg-blue-400 animate-ping" style={{animationDelay: "1s"}}></div>
                    </div>
                </div>

                <div className="flex flex-col items-center border-b border-sky-200 py-4 sm:flex-row sm:px-10 lg:px-20 xl:px-32">
                    <div className="mt-4 py-2 text-xs sm:mt-0 sm:ml-auto sm:text-base">
                        <div className="relative">
                            <ul className="relative flex w-full items-center justify-between space-x-2 sm:space-x-4">
                                <li className={`flex items-center space-x-3 text-left sm:space-x-4 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                                    <a className={`flex h-6 w-6 items-center justify-center rounded-full ${currentStep >= 1 ? 'bg-blue-600' : 'bg-sky-200'} text-xs font-semibold text-white power-button`} href="#">1</a>
                                    <span className="font-semibold">Address</span>
                                </li>
                                <li className="flex items-center space-x-3 text-left sm:space-x-4">
                                    <div className="circuit-line h-1 w-8 bg-sky-300"></div>
                                </li>
                                <li className={`flex items-center space-x-3 text-left sm:space-x-4 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                                    <a className={`flex h-6 w-6 items-center justify-center rounded-full ${currentStep >= 2 ? 'bg-blue-600' : 'bg-sky-200'} text-xs font-semibold text-white power-button`} href="#">2</a>
                                    <span className="font-semibold">Shipping</span>
                                </li>
                                <li className="flex items-center space-x-3 text-left sm:space-x-4">
                                    <div className="circuit-line h-1 w-8 bg-sky-300"></div>
                                </li>
                                <li className={`flex items-center space-x-3 text-left sm:space-x-4 ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                                    <a className={`flex h-6 w-6 items-center justify-center rounded-full ${currentStep >= 3 ? 'bg-blue-600' : 'bg-sky-200'} text-xs font-semibold text-white power-button`} href="#">3</a>
                                    <span className="font-semibold">Payment</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
                    <div className="px-4 pt-8">
                        <p className="text-xl font-medium text-blue-800">Order Summary</p>
                        <p className="text-sky-600">Check your items.</p>
                        <div className="mt-8 space-y-3 rounded-lg border border-sky-200 bg-sky-50 px-2 py-4 sm:px-6 shadow-sm">
                            {cartProducts.map((product) => (
                                <div key={product._id} className="flex flex-col rounded-lg bg-white shadow-sm sm:flex-row border border-sky-100">
                                    <img className="m-2 h-24 w-28 rounded-md border object-cover object-center" src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${product.avatars[0]}`} alt={product.name} />
                                    <div className="flex w-full flex-col px-4 py-4">
                                        <span className="font-semibold text-blue-800">{product.name}</span>
                                        <span className="float-right text-sky-600">Quantity: {product.quantity}</span>
                                        <p className="text-lg font-bold text-blue-800">TND {product.price * (product.quantity ?? 0)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 text-right">
                            <p className="text-xl font-bold text-blue-800">Total: TND {calculateTotal()}</p>
                            {deliveryMethod === 'homeDelivery' && (
                                <p className="text-sm text-sky-600">Including delivery fee of 8 TND</p>
                            )}
                        </div>

                        <p className="mt-8 text-lg font-medium text-blue-800">Shipping Methods</p>
                        <form className="mt-5 grid gap-6">
                            <div className="relative">
                                <input
                                    className="peer hidden"
                                    id="radio_1"
                                    type="radio"
                                    name="radio"
                                    checked={deliveryMethod === 'inStore'}
                                    onChange={() => handleDeliveryMethodChange('inStore')}
                                />
                                <label className={`peer-checked:border-blue-500 peer-checked:bg-sky-50 flex cursor-pointer select-none rounded-lg border border-sky-200 p-4 shadow-sm transition-all ${deliveryMethod === 'inStore' ? 'transform scale-102 electricity-glow' : ''}`} htmlFor="radio_1">
                                    <img className="w-14 object-contain" src="https://api.iconify.design/mdi:truck-fast-outline.svg?color=%230066cc" alt="shipping fast" />
                                    <div className="ml-5">
                                        <span className="mt-2 font-semibold text-blue-800">In-Store Pickup</span>
                                        <p className="text-sm leading-6 text-sky-600">Pickup your order from the store at your convenience.</p>
                                    </div>
                                </label>
                            </div>
                            <div className="relative">
                                <input
                                    className="peer hidden"
                                    id="radio_2"
                                    type="radio"
                                    name="radio"
                                    checked={deliveryMethod === 'homeDelivery'}
                                    onChange={() => handleDeliveryMethodChange('homeDelivery')}
                                />
                                <label className={`peer-checked:border-blue-500 peer-checked:bg-sky-50 flex cursor-pointer select-none rounded-lg border border-sky-200 p-4 shadow-sm transition-all ${deliveryMethod === 'homeDelivery' ? 'transform scale-102 electricity-glow' : ''}`} htmlFor="radio_2">
                                    <img className="w-14 object-contain" src="https://api.iconify.design/mdi:truck-delivery-outline.svg?color=%230066cc" alt="home delivery" />
                                    <div className="ml-5">
                                        <span className="mt-2 font-semibold text-blue-800">Home Delivery</span>
                                        <p className="text-sm leading-6 text-sky-600">Get your order delivered to your doorstep.</p>
                                    </div>
                                </label>
                            </div>
                        </form>

                        <p className="mt-8 text-lg font-medium text-blue-800">Payment Methods</p>
                        <form className="mt-5 grid gap-6">
                            <div className="relative">
                                <input
                                    className="peer hidden"
                                    id="payment_1"
                                    type="radio"
                                    name="payment"
                                    checked={paymentMethod === 'cash'}
                                    onChange={() => handlePaymentMethodChange('cash')}
                                />
                                <label className={`peer-checked:border-blue-500 peer-checked:bg-sky-50 flex cursor-pointer select-none rounded-lg border border-sky-200 p-4 shadow-sm transition-all ${paymentMethod === 'cash' ? 'transform scale-102 electricity-glow' : ''}`} htmlFor="payment_1">
                                    <img className="w-14 object-contain" src="https://api.iconify.design/mdi:cash.svg?color=%230066cc" alt="cash" />
                                    <div className="ml-5">
                                        <span className="mt-2 font-semibold text-blue-800">Cash on Delivery</span>
                                        <p className="text-sm leading-6 text-sky-600">Pay with cash when your order arrives.</p>
                                    </div>
                                </label>
                            </div>
                            <div className="relative">
                                <input
                                    className="peer hidden"
                                    id="payment_2"
                                    type="radio"
                                    name="payment"
                                    checked={paymentMethod === 'creditCard'}
                                    onChange={() => handlePaymentMethodChange('creditCard')}
                                />
                                <label className={`peer-checked:border-blue-500 peer-checked:bg-sky-50 flex cursor-pointer select-none rounded-lg border border-sky-200 p-4 shadow-sm transition-all ${paymentMethod === 'creditCard' ? 'transform scale-102 electricity-glow' : ''}`} htmlFor="payment_2">
                                    <img className="w-14 object-contain" src="https://api.iconify.design/mdi:credit-card-outline.svg?color=%230066cc" alt="credit card" />
                                    <div className="ml-5">
                                        <span className="mt-2 font-semibold text-blue-800">Credit Card</span>
                                        <p className="text-sm leading-6 text-sky-600">Pay with your credit card online.</p>
                                    </div>
                                </label>
                            </div>
                        </form>

                        <div className="mt-6 border-t border-sky-200 pt-4">
                            <div className="flex justify-between">
                                <span className="font-semibold text-blue-800">Total:</span>
                                <span className="font-bold text-blue-800">TND {calculateTotal()}</span>
                            </div>
                            <button
                                onClick={handleFinalizeOrder}
                                className="mt-4 w-full rounded-md bg-blue-600 py-1.5 font-medium text-white hover:bg-blue-700 transition-all electricity-button"
                            >
                                <span>Place Order</span>
                                <span className="ml-2 inline-block">⚡</span>
                            </button>
                        </div>
                    </div>

                    <div className="px-4 pt-8 lg:mt-0">
                        <p className="text-xl font-medium text-blue-800">Shipping Address</p>
                        <p className="text-sky-600">Choose a delivery address or add a new one.</p>
                        <div className="mt-8">
                            {addresses && addresses.length > 0 ? (
                                <div className="space-y-4">
                                    {addresses.map((address, index) => (
                                        <div
                                            key={index}
                                            className={`flex flex-col space-y-2 p-4 border rounded-lg cursor-pointer transition-all ${selectedAddress === address ? 'border-blue-500 bg-sky-50 electricity-glow' : 'border-sky-200 bg-white hover:bg-sky-50'
                                                }`}
                                            onClick={() => handleAddressSelect(address)}
                                        >
                                            <p className="text-sm font-medium text-blue-800">{address.address}, {address.city}, {address.postalCode}, {address.country}</p>
                                            <p className="text-sm text-sky-600">{address.phone}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-sky-600">No addresses found. Please add a new address.</p>
                            )}
                        </div>
                        <button
                            onClick={() => setIsAddressModalOpen(true)}
                            className="mt-6 w-full rounded-md bg-blue-600 py-1.5 font-medium text-white hover:bg-blue-700 transition-all electricity-button"
                        >
                            <span>Add New Address</span>
                            <span className="ml-2 inline-block">⚡</span>
                        </button>
                    </div>
                </div>

                {/* Footer with electrical circuit design */}
                <div className="w-full h-12 bg-sky-100 relative mt-12 overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 h-full">
                        <div className="circuit-line absolute bottom-4 left-0 w-full h-1 bg-blue-500 animate-pulse"></div>
                        <div className="circuit-node absolute bottom-2 right-1/4 w-4 h-4 rounded-full bg-blue-400 animate-ping"></div>
                        <div className="circuit-node absolute bottom-2 right-1/2 w-4 h-4 rounded-full bg-blue-400 animate-ping" style={{animationDelay: "0.5s"}}></div>
                        <div className="circuit-node absolute bottom-2 right-3/4 w-4 h-4 rounded-full bg-blue-400 animate-ping" style={{animationDelay: "1s"}}></div>
                    </div>
                </div>

                <Modal isOpen={isAddressModalOpen} onClose={() => setIsAddressModalOpen(false)}>
                    <div className="bg-white p-6 rounded-lg">
                        <h2 className="text-xl font-bold text-blue-800 mb-4">Add New Address</h2>
                        <AddressForm onSubmit={handleSubmit} />
                    </div>
                </Modal>

                {/* Add electrical CSS animations */}
                <style jsx>{`
                    @keyframes electricity {
                        0% { box-shadow: 0 0 5px 1px rgba(59, 130, 246, 0.3); }
                        50% { box-shadow: 0 0 15px 5px rgba(59, 130, 246, 0.6); }
                        100% { box-shadow: 0 0 5px 1px rgba(59, 130, 246, 0.3); }
                    }
                    
                    .electricity-glow {
                        animation: electricity 2s infinite;
                    }
                    
                    .electricity-button:hover {
                        box-shadow: 0 0 15px 5px rgba(59, 130, 246, 0.6);
                        transform: translateY(-2px);
                    }
                    
                    .power-button {
                        transition: all 0.3s ease;
                    }
                    
                    .power-button:hover {
                        transform: scale(1.1);
                        box-shadow: 0 0 10px 2px rgba(59, 130, 246, 0.5);
                    }
                    
                    .circuit-line {
                        position: relative;
                    }
                    
                    .circuit-line::before,
                    .circuit-line::after {
                        content: '';
                        position: absolute;
                        width: 6px;
                        height: 6px;
                        background-color: #3b82f6;
                        border-radius: 50%;
                        top: -2.5px;
                    }
                    
                    .circuit-line::before {
                        left: 30%;
                    }
                    
                    .circuit-line::after {
                        right: 30%;
                    }
                `}</style>
            </div>
        </Suspense>
    )
};

export default Page;