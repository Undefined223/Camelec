import Link from "next/link";
import DarkModeSwitcher from "./DarkModeSwitcher";
import DropdownMessage from "./DropdownMessage";
import DropdownNotification from "./DropdownNotification";
import DropdownUser from "./DropdownUser";
import Image from "next/image";
import logo from '@/app/components/assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt } from '@fortawesome/free-solid-svg-icons';

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  return (
    <header className="sticky top-0 z-999 flex w-full bg-sky-100 drop-shadow-md">
      {/* Electric top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-sky-300 to-blue-500 electric-flow"></div>
      
      <div className="flex flex-grow items-center justify-between px-4 py-3 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-sky-200 bg-white p-1.5 shadow-sm lg:hidden hover:bg-sky-50 transition-colors"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="du-block absolute right-0 h-full w-full">
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-blue-500 delay-[0] duration-200 ease-in-out ${
                    !props.sidebarOpen && "!w-full delay-300"
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-blue-500 delay-150 duration-200 ease-in-out ${
                    !props.sidebarOpen && "delay-400 !w-full"
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-blue-500 delay-200 duration-200 ease-in-out ${
                    !props.sidebarOpen && "!w-full delay-500"
                  }`}
                ></span>
              </span>
              <span className="absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-blue-500 delay-300 duration-200 ease-in-out ${
                    !props.sidebarOpen && "!h-0 !delay-[0]"
                  }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-blue-500 duration-200 ease-in-out ${
                    !props.sidebarOpen && "!h-0 !delay-200"
                  }`}
                ></span>
              </span>
            </span>
          </button>
          {/* <!-- Hamburger Toggle BTN --> */}

          <Link className="block flex-shrink-0 lg:hidden" href="/">
            <div className="relative">
              <Image
                width={32}
                height={32}
                src={logo}
                alt="Logo"
                className="z-10 relative"
              />
              <div className="absolute inset-0 bg-blue-400 rounded-full opacity-30 electric-glow"></div>
            </div>
          </Link>
          
          <div className="hidden lg:flex items-center gap-2">
            <h1 className="text-blue-800 font-bold text-lg">
              CAMELEC <span className="text-blue-600">ELECTRIQUE</span>
              <FontAwesomeIcon icon={faBolt} className="ml-1 text-yellow-500 electric-flicker" />
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* <!-- Dark Mode Toggler --> */}
            {/* <!-- Dark Mode Toggler --> */}

            {/* <!-- Notification Menu Area --> */}
            <DropdownNotification />
            {/* <!-- Notification Menu Area --> */}

            {/* <!-- Chat Notification Area --> */}
            <DropdownMessage />
            {/* <!-- Chat Notification Area --> */}
          </ul>

          {/* <!-- User Area --> */}
          <DropdownUser />
          {/* <!-- User Area --> */}
        </div>
      </div>
      
      {/* Add CSS for electrical effects */}
      <style jsx global>{`
        .electric-flow {
          background-size: 200% 100%;
          animation: flow 2s linear infinite;
        }
        
        .electric-glow {
          animation: glow 2s infinite alternate;
        }
        
        .electric-flicker {
          animation: flicker 3s infinite;
        }
        
        @keyframes flow {
          0% { background-position: 0% 0; }
          100% { background-position: 200% 0; }
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
      `}</style>
    </header>
  );
};

export default Header;