"use client";
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import axiosInstance from './AxiosInstance';
import { motion } from 'framer-motion';

interface Props { }

interface Product {
    _id: string;
    availability: string;
    avatars: string[];
    brand: string;
    category: string;
    description: string;
    name: string;
    price: number;
}

interface Article {
    _id: string;
    text: string;
    imageUrl: string;
    product: Product;
}

const Articles: NextPage<Props> = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const router = useRouter(); // Initialize useRouter

    useEffect(() => {
        const getAnnouncements = async () => {
            try {
                const { data } = await axiosInstance.get('/api/announcments/all');
                const filteredData = data.filter((article: Article) => article.text.includes("Small"));
                console.log('arr', filteredData);
                setArticles(filteredData);
            } catch (err) {
                console.log(err);
            }
        };
        getAnnouncements();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    const handleArticleClick = (productId: string) => {
        router.push(`/product/${productId}`);
    };

    return (
        <div className="container mx-auto px-4 my-6">
            {articles.length > 0 ? (
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 drop-shadow-2xl"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {articles.map((article) => (
                        <motion.div
                            key={article._id}
                            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
                            variants={itemVariants}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleArticleClick(article.product._id)} // Navigate to product page
                        >
                            {article.imageUrl && (
                                <div className="aspect-square relative">
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${article.imageUrl}`}
                                        alt={article.text}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <p className="text-center text-gray-600">No articles found</p>
            )}
        </div>
    );
};

export default Articles;
