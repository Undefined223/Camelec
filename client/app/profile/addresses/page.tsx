"use client";
import axiosInstance from '@/app/components/AxiosInstance';
import UserContext from '@/app/context/InfoPlusProvider';
import { NextPage } from 'next'
import { useContext, useEffect, useState } from 'react'
import Modal from '@/app/components/ui/modal';
import AddressForm from '@/app/components/AddressForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
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
            setAddresses(data.addresses)
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
            await axiosInstance.put(`/api/user/${user?._id}`, { addresses: updatedAddresses });
            setAddresses(updatedAddresses);
        } catch (err) {
            console.log(err);
        }
    }

    const handleSubmit = async (newAddress: Address, password: string) => {
        try {
            const updatedAddresses = [...addresses, newAddress];
            await axiosInstance.put(`/api/user/${user?._id}`, { addresses: updatedAddresses });
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
                await axiosInstance.put(`/api/user/${user?._id}`, { addresses: addressesCopy });
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

    return (
        <div className='min-h-[80vh] p-4'>
            <div className='flex flex-wrap gap-3 sticky z-10'>
                {addresses.map((address, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="mb-4 block max-w-sm p-6 bg-slate-900  border border-gray-200 rounded-lg shadow hover:bg-gray-100  "
                    >
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-white ">{address.address}</h5>
                        <p className="font-normal text-gray-700 ">{address.city}, {address.postalCode}, {address.country}</p>
                        <p className="font-normal text-gray-700 ">{address.phone}</p>
                        <div className="mt-4 flex justify-around">
                            <button onClick={() => handleEdit(index)} className="mr-2 text-blue-500 hover:underline">
                                <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button onClick={() => handleDelete(index)} className="text-red-500 hover:underline">
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
            <button onClick={() => setIsModalOpen(true)} className="mt-6 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 sticky z-10">
                Add New Address
            </button>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isModalOpen ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            >
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <AddressForm onSubmit={handleSubmit} />
                </Modal>
            </motion.div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isEditModalOpen ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            >
                <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                    <AddressForm onSubmit={handleUpdate} initialAddress={editingIndex !== null ? addresses[editingIndex] : undefined} />
                </Modal>
            </motion.div>
        </div>
    )
}

export default Page;
