import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faMapMarkerAlt, faCity, faMailBulk, faGlobe, faPhone, faLock } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

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

    // Input field animation
    const inputVariants = {
        focus: {
            boxShadow: "0 0 0 2px rgba(56, 189, 248, 0.6)",
            borderColor: "#38bdf8",
            transition: { duration: 0.2 }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-5">
            <h3 className="mb-4 text-xl font-bold text-sky-700 flex items-center">
                <FontAwesomeIcon icon={faBolt} className="mr-2 text-yellow-400" />
                {initialAddress ? 'Update Power Location' : 'Add New Power Location'}
            </h3>
            
            <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-10 text-sky-400">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                </div>
                <motion.input
                    type="text"
                    placeholder="Address"
                    value={newAddress.address}
                    onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                    className="flex-1 p-2 border border-sky-200 rounded bg-sky-50 text-sky-800 focus:outline-none"
                    whileFocus="focus"
                    variants={inputVariants}
                />
            </div>
            
            <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-10 text-sky-400">
                    <FontAwesomeIcon icon={faCity} />
                </div>
                <motion.input
                    type="text"
                    placeholder="City"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="flex-1 p-2 border border-sky-200 rounded bg-sky-50 text-sky-800 focus:outline-none"
                    whileFocus="focus"
                    variants={inputVariants}
                />
            </div>
            
            <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-10 text-sky-400">
                    <FontAwesomeIcon icon={faMailBulk} />
                </div>
                <motion.input
                    type="text"
                    placeholder="Postal Code"
                    value={newAddress.postalCode}
                    onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                    className="flex-1 p-2 border border-sky-200 rounded bg-sky-50 text-sky-800 focus:outline-none"
                    whileFocus="focus"
                    variants={inputVariants}
                />
            </div>
            
            <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-10 text-sky-400">
                    <FontAwesomeIcon icon={faGlobe} />
                </div>
                <motion.input
                    type="text"
                    placeholder="Country"
                    value={newAddress.country}
                    onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                    className="flex-1 p-2 border border-sky-200 rounded bg-sky-50 text-sky-800 focus:outline-none"
                    whileFocus="focus"
                    variants={inputVariants}
                />
            </div>
            
            <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-10 text-sky-400">
                    <FontAwesomeIcon icon={faPhone} />
                </div>
                <motion.input
                    type="text"
                    placeholder="Phone"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    className="flex-1 p-2 border border-sky-200 rounded bg-sky-50 text-sky-800 focus:outline-none"
                    whileFocus="focus"
                    variants={inputVariants}
                />
            </div>
            
            <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-10 text-sky-400">
                    <FontAwesomeIcon icon={faLock} />
                </div>
                <motion.input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex-1 p-2 border border-sky-200 rounded bg-sky-50 text-sky-800 focus:outline-none"
                    whileFocus="focus"
                    variants={inputVariants}
                />
            </div>
            
            <motion.button 
                type="submit" 
                className="w-full p-2 bg-gradient-to-r from-sky-400 to-blue-500 text-white rounded-md shadow-md flex items-center justify-center"
                whileHover={{ 
                    scale: 1.02, 
                    boxShadow: "0 0 15px rgba(56, 189, 248, 0.5)",
                    background: "linear-gradient(to right, #0ea5e9, #3b82f6)" 
                }}
                whileTap={{ scale: 0.98 }}
            >
                <FontAwesomeIcon icon={faBolt} className="mr-2 text-yellow-300" />
                {initialAddress ? 'Update Power Location' : 'Add Power Location'}
            </motion.button>
            
            {/* Decorative elements */}
            <div className="w-full h-1 bg-gradient-to-r from-sky-400 to-blue-500 mt-6 rounded-full"></div>
            <div className="w-full h-px bg-sky-200 mt-1"></div>
        </form>
    );
};

export default AddressForm;