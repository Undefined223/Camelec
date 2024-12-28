import { NextPage } from 'next';
import Image from 'next/image';
import { motion } from 'framer-motion';
import infoPlusImg from './assets/infoplus logo.png';

interface Props { }

const Loading: NextPage<Props> = () => {
    return (
        <div className='fixed top-0 left-0 z-[99999999] h-screen w-full bg-black-2 flex justify-center items-center '>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: 'easeInOut' }}
            >
                <Image
                    src={infoPlusImg}
                    width={200}
                    height={200}
                    className='m-auto'
                    alt='Infoplus Logo'
                />
            <div className='flex space-x-2 justify-center items-center h-20 '>
                <span className='sr-only'>Loading...</span>
                <div className='h-4 w-4 bg-yellow rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                <div className='h-4 w-4 bg-yellow rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                <div className='h-4 w-4 bg-yellow rounded-full animate-bounce'></div>
            </div>
            </motion.div>
        </div>
    );
};

export default Loading;
