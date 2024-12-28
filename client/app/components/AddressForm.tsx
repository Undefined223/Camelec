import React, { useState } from "react";

interface AddressFormProps {
    onSubmit: (address: Address, password: string) => void;
    initialAddress?: Address;
}

interface Address {
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
}

const AddressForm: React.FC<AddressFormProps> = ({ onSubmit, initialAddress }) => {
    const [newAddress, setNewAddress] = useState<Address>(initialAddress || { address: '', city: '', postalCode: '', country: '', phone: '' });
    const [password, setPassword] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(newAddress, password);
        setNewAddress({ address: '', city: '', postalCode: '', country: '', phone: '' });
        setPassword('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3 className="mb-4 text-xl font-bold text-white">{initialAddress ? 'Edit Address' : 'Add New Address'}</h3>
            <input
                type="text"
                placeholder="Address"
                value={newAddress.address}
                onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                className="w-full mb-4 p-2 border border-gray-300 rounded bg-slate-700 border-gray-600 text-white"
            />
            <input
                type="text"
                placeholder="City"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                className="w-full mb-4 p-2 border border-gray-300 rounded bg-slate-700 border-gray-600 text-white"
            />
            <input
                type="text"
                placeholder="Postal Code"
                value={newAddress.postalCode}
                onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                className="w-full mb-4 p-2 border border-gray-300 rounded bg-slate-700 border-gray-600 text-white"
            />
            <input
                type="text"
                placeholder="Country"
                value={newAddress.country}
                onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                className="w-full mb-4 p-2 border border-gray-300 rounded bg-slate-700 border-gray-600 text-white"
            />
            <input
                type="text"
                placeholder="Phone"
                value={newAddress.phone}
                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                className="w-full mb-4 p-2 border border-gray-300 rounded bg-slate-700 border-gray-600 text-white"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mb-4 p-2 border border-gray-300 rounded bg-slate-700 border-gray-600 text-white"
            />
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">{initialAddress ? 'Update Address' : 'Add Address'}</button>
        </form>
    );
};

export default AddressForm;
