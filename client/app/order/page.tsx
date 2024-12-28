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
                .then(response => setAddresses(response.data.addresses))
                .catch(err => console.error(err));
        }
    }, [user]);

    const handleSubmit = async (newAddress: Address) => {
        try {
            const updatedAddresses = [...addresses, newAddress];
            await axiosInstance.put(`/api/user/${user?._id}`, { addresses: updatedAddresses });
            setAddresses(updatedAddresses);
            setIsAddressModalOpen(false);
            if (currentStep === 1) setCurrentStep(2);
        } catch (err) {
            console.error(err);
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


        <div className='sticky z-10 bg-gray-900 text-white min-h-screen'>
            <div className="flex flex-col items-center border-b py-4 sm:flex-row sm:px-10 lg:px-20 xl:px-32">
                {/* <a href="#" className="text-2xl font-bold">InfoPlus</a> */}
                <div className="mt-4 py-2 text-xs sm:mt-0 sm:ml-auto sm:text-base">
                    <div className="relative">
                        <ul className="relative flex w-full items-center justify-between space-x-2 sm:space-x-4">
                            <li className={`flex items-center space-x-3 text-left sm:space-x-4 ${currentStep >= 1 ? 'text-[#D1A30D]' : 'text-gray-500'}`}>
                                <a className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D1A30D] text-xs font-semibold text-white" href="#">1</a>
                                <span className="font-semibold">Address</span>
                            </li>
                            <li className={`flex items-center space-x-3 text-left sm:space-x-4 ${currentStep >= 2 ? 'text-[#D1A30D]' : 'text-gray-500'}`}>
                                <a className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-600 text-xs font-semibold text-white" href="#">2</a>
                                <span className="font-semibold">Shipping</span>
                            </li>
                            <li className={`flex items-center space-x-3 text-left sm:space-x-4 ${currentStep >= 3 ? 'text-[#D1A30D]' : 'text-gray-500'}`}>
                                <a className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-400 text-xs font-semibold text-white" href="#">3</a>
                                <span className="font-semibold">Payment</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
                <div className="px-4 pt-8">
                    <p className="text-xl font-medium">Order Summary</p>
                    <p className="text-gray-400">Check your items.</p>
                    <div className="mt-8 space-y-3 rounded-lg border bg-gray-800 px-2 py-4 sm:px-6">
                        {cartProducts.map((product) => (
                            <div key={product._id} className="flex flex-col rounded-lg bg-gray-800 sm:flex-row">
                                <img className="m-2 h-24 w-28 rounded-md border object-cover object-center" src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${product.avatars[0]}`} alt={product.name} />
                                <div className="flex w-full flex-col px-4 py-4">
                                    <span className="font-semibold">{product.name}</span>
                                    <span className="float-right text-gray-400">Quantity: {product.quantity}</span>
                                    <p className="text-lg font-bold">TND {product.price * (product.quantity ?? 0)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 text-right">
                        <p className="text-xl font-bold">Total: TND {calculateTotal()}</p>
                        {deliveryMethod === 'homeDelivery' && (
                            <p className="text-sm text-gray-400">Including delivery fee of 8 TND</p>
                        )}
                    </div>

                    <p className="mt-0 text-lg font-medium">Shipping Methods</p>
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
                            <label className="peer-checked:border-[#D1A30D] peer-checked:bg-gray-800 flex cursor-pointer select-none rounded-lg border border-gray-700 p-4" htmlFor="radio_1">
                                <img className="w-14 object-contain" src="https://api.iconify.design/mdi:truck-fast-outline.svg?color=white" alt="shipping fast" />
                                <div className="ml-5">
                                    <span className="mt-2 font-semibold">In-Store Pickup</span>
                                    <p className="text-sm leading-6 text-gray-400">Pickup your order from the store at your convenience.</p>
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
                            <label className="peer-checked:border-[#D1A30D] peer-checked:bg-gray-800 flex cursor-pointer select-none rounded-lg border border-gray-700 p-4" htmlFor="radio_2">
                                <img className="w-14 object-contain" src="https://api.iconify.design/mdi:truck-delivery-outline.svg?color=white" alt="home delivery" />
                                <div className="ml-5">
                                    <span className="mt-2 font-semibold">Home Delivery</span>
                                    <p className="text-sm leading-6 text-gray-400">Get your order delivered to your doorstep.</p>
                                </div>
                            </label>
                        </div>
                    </form>

                    <p className="mt-1 text-lg font-medium">Payment Methods</p>
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
                            <label className="peer-checked:border-[#D1A30D] peer-checked:bg-gray-800 flex cursor-pointer select-none rounded-lg border border-gray-700 p-4" htmlFor="payment_1">
                                <img className="w-14 object-contain" src="https://api.iconify.design/mdi:cash.svg?color=white" alt="cash" />
                                <div className="ml-5">
                                    <span className="mt-2 font-semibold">Cash on Delivery</span>
                                    <p className="text-sm leading-6 text-gray-400">Pay with cash when your order arrives.</p>
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
                            <label className="peer-checked:border-[#D1A30D] peer-checked:bg-gray-800 flex cursor-pointer select-none rounded-lg border border-gray-700 p-4" htmlFor="payment_2">
                                <img className="w-14 object-contain" src="https://api.iconify.design/mdi:credit-card-outline.svg?color=white" alt="credit card" />
                                <div className="ml-5">
                                    <span className="mt-2 font-semibold">Credit Card</span>
                                    <p className="text-sm leading-6 text-gray-400">Pay with your credit card online.</p>
                                </div>
                            </label>
                        </div>
                    </form>

                    <div className="mt-6 border-t border-gray-700 pt-4">
                        <div className="flex justify-between">
                            <span className="font-semibold">Total:</span>
                            <span className="font-bold">TND {calculateTotal()}</span>
                        </div>
                        <button
                            onClick={handleFinalizeOrder}
                            className="mt-4 w-full rounded-md bg-[#D1A30D] py-1.5 font-medium text-white hover:bg-[#d1a30d]"
                        >
                            Place Order
                        </button>
                    </div>
                </div>

                <div className="px-4 pt-8 lg:mt-0">
                    <p className="text-xl font-medium">Shipping Address</p>
                    <p className="text-gray-400">Choose a delivery address or add a new one.</p>
                    <div className="mt-8">
                        {addresses.length > 0 ? (
                            <div className="space-y-4">
                                {addresses.map((address, index) => (
                                    <div
                                        key={index}
                                        className={`flex flex-col space-y-2 p-4 border rounded-lg cursor-pointer ${selectedAddress === address ? 'border-[#D1A30D] bg-gray-800' : 'border-gray-700 bg-gray-800'
                                            }`}
                                        onClick={() => handleAddressSelect(address)}
                                    >
                                        <p className="text-sm font-medium">{address.address}, {address.city}, {address.postalCode}, {address.country}</p>
                                        <p className="text-sm text-gray-400">{address.phone}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400">No addresses found. Please add a new address.</p>
                        )}
                    </div>
                    <button
                        onClick={() => setIsAddressModalOpen(true)}
                        className="mt-6 w-full rounded-md bg-[#D1A30D] py-1.5 font-medium text-white hover:bg-[#d1a30d]"
                    >
                        Add New Address
                    </button>
                </div>
            </div>

            <Modal isOpen={isAddressModalOpen} onClose={() => setIsAddressModalOpen(false)}>
                <AddressForm onSubmit={handleSubmit} />
            </Modal>
        </div>
        </Suspense>

    )
};

export default Page;
