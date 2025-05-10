"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/app/components/Sidebar/SidebarItem";
import ClickOutside from "@/app/components/ClickOutside";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import logo from '@/app/components/assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faPlus, faBox, faExchangeAlt, faClipboardList, faFileAlt, faTruck, faUser, faDashboard, faBolt } from '@fortawesome/free-solid-svg-icons';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuGroups = [
  {
    name: "MENU",
    menuItems: [
      {
        icon: <FontAwesomeIcon icon={faDashboard} />,
        label: "Dashboard",
        route: "/admin/",
      },
      {
        icon: <FontAwesomeIcon icon={faList} />,
        label: "Categories",
        route: "/admin/categories",
      },
      {
        icon: <FontAwesomeIcon icon={faPlus} />,
        label: "Add Product",
        route: "/admin/add-product",
      },
      {
        icon: <FontAwesomeIcon icon={faBox} />,
        label: "Products",
        route: "/admin/products",
      },
      {
        icon: <FontAwesomeIcon icon={faTruck} />,
        label: "Deliveries",
        route: "/admin/deliveries",
      },
      {
        icon: <FontAwesomeIcon icon={faUser} />,
        label: "Users",
        route: "/admin/users",
      },
      {
        icon: <FontAwesomeIcon icon={faExchangeAlt} />,
        label: "Transactions",
        route: "/admin/transactions",
      },
      {
        icon: <FontAwesomeIcon icon={faClipboardList} />,
        label: "Transaction List",
        route: "/admin/transaction-list",
      },
      {
        icon: <FontAwesomeIcon icon={faFileAlt} />,
        label: "Transaction Detail",
        route: "/adminn/transaction-detail",
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  const [animating, setAnimating] = useState(false);

  // Electricity animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 1000);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden duration-300 ease-linear bg-blue-900 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${animating ? "electric-pulse" : ""}`}
      >
        {/* Electric top border */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 electric-flow"></div>
        
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="flex items-center justify-between mt-2 gap-2 px-6 py-4 border-b border-blue-700">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative">
              <Image
                width={48}
                height={48}
                src={logo}
                alt="Logo"
                priority
                className="z-10 relative"
              />
              <div className="absolute inset-0 bg-blue-400 rounded-full opacity-30 electric-glow"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white">
                CAMELEC
                <FontAwesomeIcon icon={faBolt} className="ml-1 text-yellow-300 electric-flicker" />
              </span>
              <span className="text-xs text-blue-200">ELECTRIQUE</span>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            className="block lg:hidden p-2 rounded hover:bg-blue-800 transition-colors"
          >
            <svg
              className="fill-blue-100"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              />
            </svg>
          </button>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <nav className="mt-4 px-4 py-2">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-4 ml-4 text-sm font-semibold text-blue-300 flex items-center">
                  <span className="inline-block w-8 h-0.5 bg-blue-500 mr-2 electric-spark"></span>
                  {group.name}
                </h3>

                <ul className="mb-6 flex flex-col gap-1">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <li key={menuIndex} className="electric-item group">
                      <Link
                        href={menuItem.route}
                        className={`group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium text-blue-100 duration-300 ease-in-out hover:bg-blue-800 ${
                          pathname === menuItem.route && "bg-blue-700 text-white"
                        }`}
                        onClick={() => setPageName(menuItem.label.toLowerCase())}
                      >
                        <span className={`text-blue-300 ${pathname === menuItem.route && "text-blue-200"}`}>
                          {menuItem.icon}
                        </span>
                        {menuItem.label}
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-10 electric-hover-effect"></span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          {/* <!-- Sidebar Menu --> */}
        </div>
        
        {/* Electrical circuit pattern decoration at bottom */}
        <div className="mt-auto p-4">
          <div className="circuit-pattern h-20 w-full opacity-20"></div>
        </div>
      </aside>
      
      {/* Add CSS for electrical effects */}
      <style jsx global>{`
        .electric-flow {
          background-size: 200% 100%;
          animation: flow 2s linear infinite;
        }
        
        .electric-pulse {
          animation: pulse 1s ease-in-out;
        }
        
        .electric-glow {
          animation: glow 2s infinite alternate;
        }
        
        .electric-flicker {
          animation: flicker 3s infinite;
        }
        
        .electric-spark::before {
          content: '';
          position: absolute;
          width: 4px;
          height: 4px;
          background: #60a5fa;
          border-radius: 50%;
          filter: blur(1px);
          opacity: 0;
          animation: spark 4s infinite;
        }
        
        .electric-hover-effect {
          transition: opacity 0.3s;
          animation: scan 2s infinite;
          background-size: 200% 100%;
        }
        
        .electric-item:hover .electric-hover-effect {
          opacity: 0.5;
        }
        
        .circuit-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10h80v80H10z' fill='none' stroke='%2360a5fa' stroke-width='1'/%3E%3Cpath d='M30 10v30h40v30H10' fill='none' stroke='%2360a5fa' stroke-width='1'/%3E%3Ccircle cx='30' cy='40' r='3' fill='%2360a5fa'/%3E%3Ccircle cx='70' cy='40' r='3' fill='%2360a5fa'/%3E%3Ccircle cx='10' cy='70' r='3' fill='%2360a5fa'/%3E%3C/svg%3E");
          background-repeat: repeat;
          opacity: 0.3;
        }
        
        @keyframes flow {
          0% { background-position: 0% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(96, 165, 250, 0.2); }
          70% { box-shadow: 0 0 0 10px rgba(96, 165, 250, 0); }
          100% { box-shadow: 0 0 0 0 rgba(96, 165, 250, 0); }
        }
        
        @keyframes glow {
          0% { opacity: 0.2; transform: scale(0.95); }
          100% { opacity: 0.4; transform: scale(1.05); }
        }
        
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          10% { opacity: 0.8; }
          20% { opacity: 1; }
          30% { opacity: 0.6; }
          40% { opacity: 1; }
          50% { opacity: 0.9; }
          60% { opacity: 0.7; }
          70% { opacity: 1; }
        }
        
        @keyframes spark {
          0%, 100% { opacity: 0; transform: translateX(0); }
          50% { opacity: 1; transform: translateX(10px); }
        }
        
        @keyframes scan {
          0% { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </ClickOutside>
  );
};

export default Sidebar;