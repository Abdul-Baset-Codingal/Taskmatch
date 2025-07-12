"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation"; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);

  // Check if token cookie exists on mount
  useEffect(() => {
    const token = Cookies.get("token");
    setIsLoggedIn(!!token);
  }, []);

  // Logout handler
  const handleLogout = () => {
    Cookies.remove("token");
    setIsLoggedIn(false);
    router.push("/"); 
  };

  return (
    <div className="relative w-full h-[110px] bg-[#1C1C2E] overflow-visible">
      {/* Bubble 1 */}
      <div className="absolute z-20 w-[150px] xs:w-[200px] sm:w-[250px] lg:w-[300px] h-[150px] xs:h-[200px] sm:h-[250px] lg:h-[300px] bg-slate-700 opacity-40 rounded-full top-[-30px] xs:top-[-40px] sm:top-[-50px] lg:top-[-50px] left-[5%] xs:left-[8%] lg:left-[10%] animate-bubbleFloat"></div>

      {/* Bubble 2 */}
      <div className="absolute w-[120px] xs:w-[160px] sm:w-[200px] lg:w-[250px] h-[120px] xs:h-[160px] sm:h-[200px] lg:h-[250px] bg-slate-700 opacity-40 rounded-full top-[-60px] xs:top-[-80px] sm:top-[-90px] lg:top-[-100px] right-[5%] xs:right-[10%] lg:right-[15%] animate-bubbleFloat delay-[2s]"></div>

      {/* Navbar Content */}
      <div className="relative z-30 flex items-center justify-between px-4 xs:px-6 sm:px-8 lg:px-6 h-full text-white">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/">
            <h1 className="text-2xl xs:text-3xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] bg-clip-text text-transparent">
              TaskMatch
            </h1>
          </Link>
          <span className="w-2 h-2 rounded-full bg-[#FF8906] inline-block top-[12px] xs:top-[14px] sm:top-[16px] lg:top-[18px] relative right-[8px] xs:right-[10px] lg:right-[11px] z-10"></span>
        </div>

        {/* Hamburger for small screens */}
        <div className="lg:hidden z-40">
          <button onClick={toggleMenu}>
            {isOpen ? (
              <FiX className="w-6 h-6 xs:w-6.5 xs:h-6.5 sm:w-7 sm:h-7" />
            ) : (
              <FiMenu className="w-6 h-6 xs:w-6.5 xs:h-6.5 sm:w-7 sm:h-7" />
            )}
          </button>
        </div>

        {/* Menu */}
        <ul
          className={`flex flex-col lg:flex-row gap-4 xs:gap-5 sm:gap-6 lg:gap-10 items-start lg:items-center absolute lg:static top-[110px] left-0 w-full lg:w-auto bg-[#1C1C2E] lg:bg-transparent px-4 xs:px-6 sm:px-8 lg:px-0 py-4 sm:py-6 lg:p-0 transition-all duration-300 ease-in-out ${isOpen ? "flex z-[60]" : "hidden lg:flex"
            }`}
        >
          {/* Dashboard links */}
          <li>
            <Link href={"/dashboard/owner"}>
              <button className="relative text-base xs:text-lg sm:text-lg lg:text-lg font-semibold text-white py-2 xs:py-2.5 sm:py-3 overflow-hidden group cursor-pointer w-full xs:w-auto text-left">
                Owner Dashboard
                <span className="absolute left-0 bottom-0 w-0 h-[3px] bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] transition-all duration-500 group-hover:w-full"></span>
              </button>
            </Link>
          </li>
          <li>
            <Link href={"/dashboard/client"}>
              <button className="relative text-base xs:text-lg sm:text-lg lg:text-lg font-semibold text-white py-2 xs:py-2.5 sm:py-3 overflow-hidden group cursor-pointer w-full xs:w-auto text-left">
                Client Dashboard
                <span className="absolute left-0 bottom-0 w-0 h-[3px] bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] transition-all duration-500 group-hover:w-full"></span>
              </button>
            </Link>
          </li>
          <li>
            <Link href={"/dashboard/tasker"}>
              <button className="relative text-base xs:text-lg sm:text-lg lg:text-lg font-semibold text-white py-2 xs:py-2.5 sm:py-3 overflow-hidden group cursor-pointer w-full xs:w-auto text-left">
                Tasker Dashboard
                <span className="absolute left-0 bottom-0 w-0 h-[3px] bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] transition-all duration-500 group-hover:w-full"></span>
              </button>
            </Link>
          </li>
          <li>
            <Link href={"/dashboard/admin"}>
              <button className="relative text-base xs:text-lg sm:text-lg lg:text-lg font-semibold text-white py-2 xs:py-2.5 sm:py-3 overflow-hidden group cursor-pointer w-full xs:w-auto text-left">
                Admin Dashboard
                <span className="absolute left-0 bottom-0 w-0 h-[3px] bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] transition-all duration-500 group-hover:w-full"></span>
              </button>
            </Link>
          </li>

          {/* Sign Up / Log In or Logout */}
          <li>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-4 xs:px-5 sm:px-6 lg:px-6 py-2 xs:py-2.5 sm:py-3 lg:py-3 text-white font-bold rounded-2xl xs:rounded-3xl sm:rounded-3xl lg:rounded-3xl bg-gradient-to-r from-[#F48B0C] to-[#39B376] cursor-pointer hover:shadow-lg hover:shadow-[#F48B0C] hover:-translate-y-1 transform transition duration-300 w-full xs:w-auto text-left"
              >
                Logout
              </button>
            ) : (
              <Link href={"/authentication"}>
                <button className="px-4 xs:px-5 sm:px-6 lg:px-6 py-2 xs:py-2.5 sm:py-3 lg:py-3 text-white font-bold rounded-2xl xs:rounded-3xl sm:rounded-3xl lg:rounded-3xl bg-gradient-to-r from-[#F48B0C] to-[#39B376] cursor-pointer hover:shadow-lg hover:shadow-[#F48B0C] hover:-translate-y-1 transform transition duration-300 w-full xs:w-auto text-left">
                  Sign Up/Log In
                </button>
              </Link>
            )}
          </li>
        </ul>
      </div>

      <style jsx>{`
        @keyframes bubbleFloat {
          0% {
            transform: translate(0px, 0px);
          }
          25% {
            transform: translate(30px, -30px);
          }
          50% {
            transform: translate(0px, -30px);
          }
          75% {
            transform: translate(-30px, -30px);
          }
          100% {
            transform: translate(0px, 0px);
          }
        }

        .animate-bubbleFloat {
          animation: bubbleFloat 8s ease-in-out infinite;
        }

        .delay-[2s] {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default Navbar;
