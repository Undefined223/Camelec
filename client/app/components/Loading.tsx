import { NextPage } from 'next';
import { motion } from 'framer-motion';
import { LampContainer } from './ui/lamp';
import { Orbitron } from 'next/font/google';

// Load Orbitron font
const orbitron = Orbitron({ subsets: ['latin'] });

interface Props {}

const Loading: NextPage<Props> = () => {
  return (
    <div className="fixed top-0 left-0 z-[99999999] h-screen w-full bg-black-2 flex justify-center items-center">
      <LampContainer>
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: 'easeInOut',
          }}
          className={`mt-8 bg-gradient-to-br from-cyan-400 to-cyan-600 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl ${orbitron.className}`}
        >
          Camelec Electrique
        </motion.h1>

        {/* Add electrical-like animations */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute inset-0 flex justify-center items-center"
        >
          <div className="absolute w-24 h-24 bg-cyan-500 rounded-full blur-2xl opacity-50 animate-pulse" />
          <div className="absolute w-16 h-16 bg-cyan-400 rounded-full blur-xl opacity-70 animate-ping" />
        </motion.div>

        {/* Add spark animations */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="absolute inset-0 flex justify-center items-center"
        >
          <div className="absolute w-8 h-8 bg-cyan-300 rounded-full blur-lg opacity-80 animate-spark" />
        </motion.div>
      </LampContainer>
    </div>
  );
};

export default Loading;