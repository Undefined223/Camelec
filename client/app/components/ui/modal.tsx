import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    zIndex?: number; // Made zIndex optional and corrected the type
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, zIndex = 50 }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            onClose();
        }
    };

    const handleClickOutside = (e: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    // useEffect(() => {
    //     if (isOpen) {
    //         document.addEventListener("keydown", handleEscape);
    //         document.addEventListener("mousedown", handleClickOutside);
    //     } else {
    //         document.removeEventListener("keydown", handleEscape);
    //         document.removeEventListener("mousedown", handleClickOutside);
    //     }

    //     return () => {
    //         document.removeEventListener("keydown", handleEscape);
    //         document.removeEventListener("mousedown", handleClickOutside);
    //     };
    // }, [isOpen]);

    return isOpen
        ? createPortal(
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`fixed inset-0 flex items-center justify-center z-${zIndex} bg-black bg-opacity-50`} // Fixed className for zIndex
                    onClick={onClose}
                >
                    <motion.div
                        ref={modalRef}
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-black-2  shadow-lg rounded-lg p-6 w-full max-w-md mx-4"
                    >
                        {children}
                    </motion.div>
                </motion.div>
            </AnimatePresence>,
            document.body
        )
        : null;
};

export default Modal;
