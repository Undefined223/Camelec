"use client";
import React, { useRef, useEffect } from "react";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalTrigger,
} from "../ui/animated-modal";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    zIndex?: number; // Made zIndex optional and corrected the type
}

const AnimatedModalDemo: React.FC<ModalProps> = ({ isOpen, onClose, children, zIndex = 50 }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Handle Escape key press
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    // Handle click outside the modal
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" style={{ zIndex }}>
            <motion.div
                ref={modalRef}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-black rounded-lg shadow-lg w-full max-w-md"
            >
                <Modal>
                    <ModalBody>
                        <ModalContent>
                            {children}
                        </ModalContent>
                    </ModalBody>
                    <ModalFooter>
                        <button
                            onClick={onClose}
                            className="bg-black dark:bg-white dark:text-black text-white px-4 py-2 rounded"
                        >
                            Close
                        </button>
                    </ModalFooter>
                </Modal>
            </motion.div>
        </div>,
        document.body
    );
};

export default AnimatedModalDemo;