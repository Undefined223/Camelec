import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBasketShopping, faHeart, faUser, faSearch, faChevronDown, faBars, faBolt } from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "./AxiosInstance";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import infoPlusImg from "./assets/logo.png";
import Modal from "./ui/modal";
import { LoginFormDemo } from "./ui/LoginForm";
import UserContext from "../context/InfoPlusProvider";
import { SignupFormDemo } from "./ui/SignUpForm";
import { ToastContainer } from "react-toastify";

interface Category {
    _id: string;
    name: string;
    subCategory: SubCategory[];
}

interface SubCategory {
    _id: string;
    name: string;
}

interface UserPic {
    data: string;
}

interface User {
    pic: UserPic;
}

const Navbar: React.FC = () => {
    const router = useRouter();
    const { user, setUser, cartProducts, wishlist } = useContext(UserContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    const [isSignupOpen, setIsSignupOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const profileMenuRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        setUser(null);
        router.push("/");
    };

    const handleSearch = async () => {
        if (!searchQuery) return;

        try {
            const { data } = await axiosInstance.get(`/api/products/search?name=${searchQuery}`);
            setSearchResults(data);
        } catch (err) {
            console.error("Error fetching search results:", err);
        }
    };

    const handleProductClick = (productId: string) => {
        router.push(`/product/${productId}`);
        setSearchQuery('');
        setIsSearchActive(false);
    };

    const openSignupModal = () => setIsSignupOpen(true);
    const closeSignupModal = () => setIsSignupOpen(false);
    const openLoginModal = () => setIsLoginOpen(true);
    const closeLoginModal = () => setIsLoginOpen(false);

    useEffect(() => {
        const getCategories = async () => {
            try {
                const { data } = await axiosInstance.get<Category[]>("/api/categories");
                setCategories(data);
                console.log("cat", data);
            } catch (err) {
                console.log(err);
            }
        };
        getCategories();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                profileMenuRef.current &&
                !profileMenuRef.current.contains(event.target as Node)
            ) {
                setProfileMenuOpen(false);
            }
        };

        if (profileMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [profileMenuOpen]);

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    const toggleProfileMenu = () => setProfileMenuOpen(!profileMenuOpen);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const navbarVariants = {
        visible: {
          
            y: 0,
            transition: {
                duration: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
    };

    const logoVariants = {
        hidden: { opacity: 0, rotate: -1100 },
        visible: {
            opacity: 1,
            rotate: 0,
            transition: {
                type: "spring",
                stiffness: 2100,
                damping: 20,
            },
        },
    };
    const sparkVariants = {
        initial: { opacity: 0, scale: 0 },
        animate: {
            opacity: [0, 1, 0],
            scale: [0, 1.2, 0],
            transition: {
                duration: 0.3,
                repeat: Infinity,
                repeatDelay: 1.5
            }
        }
    };

    const menuVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 22,
            },
        },
        exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
    };

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    const subMenuVariants = isMobile ? {} : {
        hidden: { opacity: 0, x: 50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 22,
                duration: 0.1,
            },
        },
        exit: { opacity: 0, x: 50, transition: { duration: 0.1 } },
    };
    const mobileMenuVariants = {
        hidden: { x: "-100%" },
        visible: {
            x: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 22,
            },
        },
        exit: { x: "-100%", transition: { duration: 0.2 } },
    };
    const electricDropVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 500,
                damping: 25,
            },
        },
        exit: {
            opacity: 0,
            y: -10,
            transition: {
                duration: 0.2
            }
        },
    };

    const electricalAnimation = {
        hidden: { opacity: 0, scale: 0.5 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
            },
        },
    };

    return (
        <motion.nav
            className="bg-white border-gray-200 relative"
            variants={navbarVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="w-full p-1 bg-white border-b-[1px] border-[#92929277] pr-10 flex justify-between items-center relative z-9999">
                <button onClick={toggleMobileMenu} className="md:hidden text-2xl cursor-pointer mb-1 text-[#2DACD9]">
                    <FontAwesomeIcon icon={faBars} />
                </button>
                <motion.div className="relative flex items-center gap-2 ml-auto" variants={itemVariants}>
                    {user ? (
                        <>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative flex items-center gap-2 border-l border-slate-300 pl-6"
                            >
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="text-2xl cursor-pointer mb-1 text-[#2DACD9]"
                                    onClick={toggleProfileMenu}
                                />
                                <span className="text-xs hidden md:block">Account</span>

                                <AnimatePresence>
                                    {profileMenuOpen && (
                                        <motion.div
                                            ref={profileMenuRef}
                                            className="absolute text-center top-12 right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                                            variants={electricDropVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                        >
                                            <Link
                                                href="/profile"
                                                className="block px-4 py-2 text-gray-700 hover:bg-[#2DACD9] hover:text-white transition-colors duration-200"
                                            >
                                                <motion.div
                                                    whileHover={{ x: 3 }}
                                                    className="flex items-center"
                                                >
                                                    <span>Profile</span>
                                                    <motion.span
                                                        className="ml-2 text-yellow-400"
                                                        variants={sparkVariants}
                                                        initial="initial"
                                                        animate="animate"
                                                    >
                                                        <FontAwesomeIcon icon={faBolt} className="text-xs" />
                                                    </motion.span>
                                                </motion.div>
                                            </Link>
                                            {user.isAdmin && (
                                                <Link
                                                    href="/admin"
                                                    className="block px-4 py-2 text-gray-700 hover:bg-[#2DACD9] hover:text-white transition-colors duration-200"
                                                >
                                                    <motion.div
                                                        whileHover={{ x: 3 }}
                                                        className="flex items-center"
                                                    >
                                                        <span>Admin</span>
                                                        <motion.span
                                                            className="ml-2 text-yellow-400"
                                                            variants={sparkVariants}
                                                            initial="initial"
                                                            animate="animate"
                                                        >
                                                            <FontAwesomeIcon icon={faBolt} className="text-xs" />
                                                        </motion.span>
                                                    </motion.div>
                                                </Link>
                                            )}
                                            <button
                                                onClick={logoutHandler}
                                                className="block px-4 py-2 text-gray-700 w-full text-left hover:bg-[#2DACD9] hover:text-white transition-colors duration-200"
                                            >
                                                <motion.div
                                                    whileHover={{ x: 3 }}
                                                    className="flex items-center"
                                                >
                                                    <span>Logout</span>
                                                    <motion.span
                                                        className="ml-2 text-yellow-400"
                                                        variants={sparkVariants}
                                                        initial="initial"
                                                        animate="animate"
                                                    >
                                                        <FontAwesomeIcon icon={faBolt} className="text-xs" />
                                                    </motion.span>
                                                </motion.div>
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </>
                    ) : (
                        <>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative flex items-center gap-2 border-l border-slate-300 pl-6"
                            >
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="text-2xl cursor-pointer mb-1 text-[#2DACD9]"
                                    onClick={toggleMenu}
                                />
                                <span className="text-xs hidden md:block">Account</span>

                                <AnimatePresence>
                                    {menuOpen && (
                                        <motion.div
                                            className="absolute text-center top-12 right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
                                            variants={electricDropVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                        >
                                            <button
                                                onClick={openLoginModal}
                                                className="block px-4 py-2 text-gray-700 w-full text-left hover:bg-[#2DACD9] hover:text-white transition-colors duration-200"
                                            >
                                                <motion.div
                                                    whileHover={{ x: 3 }}
                                                    className="flex items-center"
                                                >
                                                    <span>Login</span>
                                                    <motion.span
                                                        className="ml-2 text-yellow-400"
                                                        variants={sparkVariants}
                                                        initial="initial"
                                                        animate="animate"
                                                    >
                                                        <FontAwesomeIcon icon={faBolt} className="text-xs" />
                                                    </motion.span>
                                                </motion.div>
                                            </button>
                                            <button
                                                onClick={openSignupModal}
                                                className="block px-4 py-2 text-gray-700 w-full text-left hover:bg-[#2DACD9] hover:text-white transition-colors duration-200"
                                            >
                                                <motion.div
                                                    whileHover={{ x: 3 }}
                                                    className="flex items-center"
                                                >
                                                    <span>Register</span>
                                                    <motion.span
                                                        className="ml-2 text-yellow-400"
                                                        variants={sparkVariants}
                                                        initial="initial"
                                                        animate="animate"
                                                    >
                                                        <FontAwesomeIcon icon={faBolt} className="text-xs" />
                                                    </motion.span>
                                                </motion.div>
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </>
                    )}

                    <Link href='/cart'>
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="relative flex items-center gap-2 border-l border-slate-300 px-6"
                        >
                            <div className="relative">
                                <FontAwesomeIcon icon={faBasketShopping} className="text-2xl cursor-pointer mb-1 text-[#2DACD9]" />
                                {cartProducts && cartProducts.length > 0 && (
                                    <div className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center bg-rose-700 text-white text-xs rounded-full">
                                        {cartProducts.length}
                                    </div>
                                )}
                            </div>
                            <span className="text-xs hidden md:block">Cart</span>
                        </motion.div>
                    </Link>
                    <Link href='/wishlist'>
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="relative flex items-center gap-2 border-l border-slate-300 pl-6"
                        >
                            <div className="relative">
                                <FontAwesomeIcon icon={faHeart} className="text-2xl cursor-pointer mb-1 text-[#2DACD9]" />
                                {wishlist && wishlist.length > 0 && (
                                    <div className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center bg-rose-700 text-white text-xs rounded-full">
                                        {wishlist.length}
                                    </div>
                                )}
                            </div>
                            <span className="text-xs hidden md:block">Wishlist</span>
                        </motion.div>
                    </Link>
                </motion.div>
            </div>
            <ToastContainer />
            <div className="flex flex-wrap items-center justify-around mx-auto max-w-screen-xl p-4">
                <motion.div variants={logoVariants} className="w-full flex justify-around items-center flex-wrap">
                    <Link href="/" className="flex items-center justify-center space-x-3 w-full m-2 md:w-auto">
                        <Image src={infoPlusImg} width={300} height={300} className="h-15 w-auto" alt="Infoplus Logo" />
                    </Link>

                    {/* Categories Button */}
                    <div className="relative flex justify-center hidden md:flex">
                        <button
                            onClick={toggleDropdown}
                            className="flex items-center px-4 py-1 rounded-tl-full rounded-bl-full text-white bg-[#2DACD9] "
                        >
                            Categories <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
                        </button>
                        <motion.div className="flex-grow md:flex-grow-0" variants={itemVariants}>

                            <div className="max-w-xs mx-auto md:mx-0">
                                <div className="relative flex items-center">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <FontAwesomeIcon icon={faSearch} className="text-slate-500" />
                                    </div>
                                    <input
                                        ref={searchInputRef}
                                        type="search"
                                        id="product-search"
                                        className="block w-full py-2 px-10 text-sm text-slate-900 border border-slate-300 rounded-l-none rounded-3xl bg-slate-50 "
                                        placeholder="Search for products..."
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setIsSearchActive(e.target.value !== "");
                                        }}
                                        onFocus={() => setIsSearchActive(true)}
                                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                                    />
                                </div>

                                {isSearchActive && searchResults.length > 0 && (
                                    <motion.ul
                                        className="absolute z-30 mt-2 bg-black border border-slate-200 rounded-md shadow-lg max-h-100 overflow-y-auto"
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {searchResults.map((product: any) => (
                                            <li
                                                key={product._id}
                                                className="cursor-pointer flex items-center px-4 py-2 hover:bg-gray-100"
                                                onClick={() => handleProductClick(product._id)}
                                            >
                                                <img src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${product.avatars[0]}`} className="w-16 h-16 object-cover rounded-md mr-3" /> {product.name}
                                            </li>
                                        ))}
                                    </motion.ul>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    <div className="flex justify-around items-center gap-4">
                        <div className="text-[#2DACD9] text-3xl font-medium">
                            O
                        </div>
                        <div>
                            Support +216 72 255 256 <br />
                            cameleceletrique@gmail.com
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="bg-[#2DACD9] p-2 flex justify-center w-full">

            </div>

            {/* Dropdown for Categories */}
            <div className="relative hidden md:block">
                <AnimatePresence>
                    {dropdownOpen && (
                        <motion.div
                            className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 flex"
                            variants={menuVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onMouseLeave={() => {
                                setHoveredCategory(null);
                                setDropdownOpen(false);
                            }}
                        >
                            <div
                                className="flex w-64 h-full border-r border-gray-200"
                            >
                                <div className="w-full">
                                    {categories.map((category) => (
                                        <div
                                            key={category._id}
                                            className={`relative p-2 hover:bg-gray-100 cursor-pointer ${hoveredCategory === category._id ? 'bg-gray-100' : ''}`}
                                            onMouseEnter={() => setHoveredCategory(hoveredCategory === category._id ? null : category._id)}
                                        >
                                            <span className="w-full block px-4 py-2">
                                                {category.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="w-1 bg-transparent h-full" />
                            </div>
                            <div
                                className="flex-grow p-4 min-h-[200px]"
                                onMouseEnter={() => hoveredCategory && setHoveredCategory(hoveredCategory)}
                            >
                                {hoveredCategory && categories.find(cat => cat._id === hoveredCategory) && (
                                    <motion.div
                                        className="grid grid-cols-3 gap-4"
                                        variants={subMenuVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                    >
                                        {categories.find(cat => cat._id === hoveredCategory)?.subCategory.map((subCategory) => (
                                            <Link
                                                key={subCategory._id}
                                                href={`/category/${subCategory._id}`}
                                                prefetch
                                                className="text-gray-700 hover:text-gray-900"
                                            >
                                                {subCategory.name}
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className="md:hidden fixed top-0 left-0 w-full h-full bg-white z-50"
                        variants={mobileMenuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div className="flex flex-col h-full">
                            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                                <span className="text-xl font-bold">Menu</span>
                                <button onClick={toggleMobileMenu}>
                                    <FontAwesomeIcon icon={faBars} className="text-2xl cursor-pointer mb-1 text-[#2DACD9]" />
                                </button>
                            </div>
                            <div className="flex-grow overflow-y-auto p-4">
                                {categories.map((category) => (
                                    <div key={category._id} className="mb-4">
                                        <button
                                            className="w-full text-left px-4 py-2 "
                                            onClick={() => setHoveredCategory(hoveredCategory === category._id ? null : category._id)}
                                        >
                                            {category.name}
                                        </button>
                                        {hoveredCategory === category._id && (
                                            <motion.div
                                                className="pl-4 mt-2"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                {category.subCategory.map((subCategory) => (
                                                    <Link key={subCategory._id} href={`/category/${subCategory._id}`} className="block text-gray-700 hover:text-gray-900 py-1">
                                                        {subCategory.name}
                                                    </Link>
                                                ))}
                                            </motion.div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modals */}
            <Modal isOpen={isSignupOpen} onClose={closeSignupModal}>
                <SignupFormDemo />
            </Modal>
            <Modal isOpen={isLoginOpen} onClose={closeLoginModal}>
                <LoginFormDemo />
            </Modal>
        </motion.nav>
    );
};

export default Navbar;