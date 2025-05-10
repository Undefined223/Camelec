"use client";
import axiosInstance from '@/app/components/AxiosInstance';
import UserContext from '@/app/context/InfoPlusProvider';
import { NextPage } from 'next'
import { useContext, useEffect, useState } from 'react'
import Modal from '@/app/components/ui/modal';
import AddressForm from '@/app/components/AddressForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBolt, faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import { motion } from 'framer-motion';

interface Props { }

interface Address {
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
}

const Page: NextPage<Props> = () => {
    const { user, setUser } = useContext(UserContext);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const getAddresses = async () => {
        try {
            const { data } = await axiosInstance.get(`/api/user/${user?._id}`)

            console.log(data)
            setAddresses(data.address)
        } catch (err) {
            console.log(err)
        }
    }

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setIsEditModalOpen(true);
    }

    const handleDelete = async (index: number) => {
        try {
            const updatedAddresses = addresses.filter((_, i) => i !== index);
            await axiosInstance.put(`/api/user/${user?._id}`, { address: updatedAddresses });
            setAddresses(updatedAddresses);
        } catch (err) {
            console.log(err);
        }
    }

    const handleSubmit = async (newAddress: Address, password: string) => {
        try {
            const updatedAddresses = [...addresses, newAddress];
            await axiosInstance.put(`/api/user/${user?._id}`, { address: updatedAddresses });
            setAddresses(updatedAddresses);
            setIsModalOpen(false);
        } catch (err) {
            console.log(err);
        }
    }

    const handleUpdate = async (updatedAddress: Address, password: string) => {
        try {
            if (editingIndex !== null) {
                const addressesCopy = [...addresses];
                addressesCopy[editingIndex] = updatedAddress;
                await axiosInstance.put(`/api/user/${user?._id}`, { address: addressesCopy });
                setAddresses(addressesCopy);
                setIsEditModalOpen(false);
                setEditingIndex(null);
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (user) {
            getAddresses()
        }
    }, [user])

    // Electrical pulse animation for the cards
    const pulseVariants = {
        pulse: {
            boxShadow: [
                "0 0 0 0 rgba(59, 130, 246, 0)",
                "0 0 0 10px rgba(59, 130, 246, 0.2)",
                "0 0 0 5px rgba(59, 130, 246, 0)"
            ],
            transition: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 2
            }
        }
    };

    // Lightning bolt animation
    const boltVariants = {
        hidden: { opacity: 0, scale: 0 },
        visible: { 
            opacity: [0, 1, 0.8, 1, 0],
            scale: [0, 1.2, 0.9, 1, 0.9],
            transition: { duration: 0.5 }
        }
    };

    return (
        <div className='min-h-[80vh] p-4 bg-gradient-to-b from-white to-sky-50'>
            <h1 className="text-3xl font-bold text-sky-700 mb-6 flex items-center">
                <FontAwesomeIcon icon={faBolt} className="text-yellow-400 mr-2" /> 
                Power Locations
            </h1>
            
            <div className='flex flex-wrap gap-4 sticky z-10'>
                {addresses?.map((address, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        variants={pulseVariants}
                        whileHover="pulse"
                        transition={{ duration: 0.3 }}
                        className="mb-4 block w-64 p-6 bg-white border border-sky-200 rounded-lg shadow-md hover:border-sky-400 relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 to-blue-500"></div>
                        <div className="absolute top-1 right-3">
                            <motion.div 
                                initial="hidden"
                                animate="visible"
                                variants={boltVariants}
                            >
                                <FontAwesomeIcon icon={faBolt} className="text-yellow-400 text-xs" />
                            </motion.div>
                        </div>
                        <h5 className="mb-2 text-xl font-bold tracking-tight text-sky-800">{address.address}</h5>
                        <p className="font-normal text-sky-600">{address.city}, {address.postalCode}</p>
                        <p className="font-normal text-sky-600">{address.country}</p>
                        <p className="font-normal text-sky-600">{address.phone}</p>
                        <div className="mt-4 flex justify-around">
                            <motion.button 
                                onClick={() => handleEdit(index)} 
                                whileHover={{ scale: 1.2, color: "#3B82F6" }}
                                className="mr-2 text-sky-500 hover:text-sky-700"
                            >
                                <FontAwesomeIcon icon={faEdit} />
                            </motion.button>
                            <motion.button 
                                onClick={() => handleDelete(index)} 
                                whileHover={{ scale: 1.2, color: "#EF4444" }}
                                className="text-red-400 hover:text-red-600"
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </motion.button>
                        </div>
                    </motion.div>
                ))}
            </div>
            
            <motion.button 
                onClick={() => setIsModalOpen(true)} 
                className="mt-6 px-4 py-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 sticky z-10 flex items-center shadow-lg"
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(56, 189, 248, 0.7)" }}
                whileTap={{ scale: 0.95 }}
            >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Add New Power Location
            </motion.button>
            
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isModalOpen ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            >
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <div className="p-2 bg-gradient-to-r from-sky-100 to-white rounded-lg">
                        <h3 className="text-xl font-bold text-sky-700 mb-4 flex items-center">
                            <FontAwesomeIcon icon={faBolt} className="text-yellow-400 mr-2" />
                            New Power Location
                        </h3>
                        <AddressForm onSubmit={handleSubmit} />
                    </div>
                </Modal>
            </motion.div>
            
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isEditModalOpen ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            >
                <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                    <div className="p-2 bg-gradient-to-r from-sky-100 to-white rounded-lg">
                        <h3 className="text-xl font-bold text-sky-700 mb-4 flex items-center">
                            <FontAwesomeIcon icon={faBolt} className="text-yellow-400 mr-2" />
                            Update Power Location
                        </h3>
                        <AddressForm onSubmit={handleUpdate} initialAddress={editingIndex !== null ? addresses[editingIndex] : undefined} />
                    </div>
                </Modal>
            </motion.div>
        </div>
    )
}

export default Page;