"use client";
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import axiosInstance from './AxiosInstance';
import { motion, AnimatePresence } from 'framer-motion';

interface Props { }
interface Announcement {
    _id: string;
    text: string;
    imageUrl: string;
    product: {
        _id: string; // Assuming product is an object with an _id property
    };
}

const SlideShow: NextPage<Props> = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const router = useRouter(); // Initialize useRouter

    useEffect(() => {
        const getAnnouncements = async () => {
            try {
                const { data } = await axiosInstance.get('/api/announcments/all');
                console.log('ann', data);
                const filteredData = data.filter((announcement: Announcement) => announcement.text !== "Small");
                setAnnouncements(filteredData);
            } catch (err) {
                console.log(err);
            }
        };
        getAnnouncements();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                (prevIndex + 1) % announcements.length
            );
        }, 5000);

        return () => clearInterval(timer);
    }, [announcements]);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            (prevIndex - 1 + announcements.length) % announcements.length
        );
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) =>
            (prevIndex + 1) % announcements.length
        );
    };

    const slideVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };

    const handleImageClick = (productId: string) => {
        router.push(`/product/${productId}`);
    };

    return (
        <div id="default-carousel" className="relative w-full z-10" data-carousel="slide">
            <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
                <AnimatePresence mode="wait">
                    {announcements.map((announcement, index) => (
                        index === currentIndex && (
                            <motion.div
                                key={announcement._id}
                                className="absolute w-full h-full drop-shadow-2xl"
                                variants={slideVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ duration: 0.5 }}
                            >
                                <img
                                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${announcement.imageUrl}`}
                                    className="absolute inset-0 w-full h-full object-contain cursor-pointer"
                                    alt={announcement.text}
                                    onClick={() => handleImageClick(announcement.product._id)} // Navigate to product page
                                />
                            </motion.div>
                        )
                    ))}
                </AnimatePresence>
            </div>
            <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
                {announcements.map((_, index) => (
                    <motion.button
                        key={index}
                        type="button"
                        className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                        onClick={() => goToSlide(index)}
                        aria-current={index === currentIndex}
                        aria-label={`Slide ${index + 1}`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                    ></motion.button>
                ))}
            </div>
            <motion.button
                type="button"
                className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                onClick={goToPrevious}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-300  group-hover:bg-slate-200  group-focus:ring-4 group-focus:ring-white  group-focus:outline-none">
                    <svg className="w-4 h-4 text-white  rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                    </svg>
                    <span className="sr-only">Previous</span>
                </span>
            </motion.button>
            <motion.button
                type="button"
                className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                onClick={goToNext}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-300  group-hover:bg-slate-200  group-focus:ring-4 group-focus:ring-white  group-focus:outline-none">
                    <svg className="w-4 h-4 text-white  rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                    </svg>
                    <span className="sr-only">Next</span>
                </span>
            </motion.button>
        </div>
    );
};

export default SlideShow;
