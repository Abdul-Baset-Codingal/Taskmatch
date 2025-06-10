"use client";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className="relative w-full h-[110px] bg-[#1C1C2E] overflow-hidden ">
      {/* Bubble 1 */}
      <div className="absolute z-20 w-[300px] h-[300px] bg-slate-700 opacity-40 rounded-full top-[-50px] left-[10%]  animate-bubbleFloat"></div>

      {/* Bubble 2 */}
      <div className="absolute w-[250px] h-[250px] bg-slate-700 opacity-40 rounded-full top-[-100px] right-[15%]  animate-bubbleFloat delay-[2s]"></div>

      {/* Navbar Content */}
      <div className="relative z-10 flex items-center justify-between px-6 h-full text-white">
        <div className="flex items-center gap-2">
          <Link href={"/"}>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#8560F1]  to-[#E7B6FE] bg-clip-text text-transparent">
              TaskMatch
            </h1>
          </Link>
          <span className="w-2 h-2 rounded-full bg-[#FF8906] inline-block top-[18px] relative right-[11px] z-10"></span>
        </div>

        <ul className="flex gap-10 items-center">
          <li className="">
            <button className="relative text-lg font-bold text-[#FF8906] bg-[#3C2C2A] hover:bg-[#5A4038] py-3 px-5 rounded-lg overflow-hidden group cursor-pointer">
              Become a Tasker
              <span className="absolute left-0 bottom-0 w-0 h-[3px] bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] transition-all duration-500 group-hover:w-full"></span>
            </button>
          </li>
          <li className=" cursor-pointer font-semibold">
            <button className="relative font-semibold text-white py-3  overflow-hidden group cursor-pointer">
              Services
              <span className="absolute left-0 bottom-0 w-0 h-[3px] bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] transition-all duration-500 group-hover:w-full"></span>
            </button>
          </li>
          <li className=" cursor-pointer font-semibold">
            <button className="relative font-semibold text-white py-3  overflow-hidden group cursor-pointer">
              About
              <span className="absolute left-0 bottom-0 w-0 h-[3px] bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] transition-all duration-500 group-hover:w-full"></span>
            </button>
          </li>
          <li>
            <select className="bg-transparent text-white font-semibold px-2 py-1 rounded-md outline-none">
              <option className="bg-[#1C1C2E] text-white">us English</option>
              <option className="bg-[#1C1C2E] text-white">Spanish</option>
              <option className="bg-[#1C1C2E] text-white">French</option>
            </select>
          </li>
          <li>
            <button className="px-6 py-3 text-white font-bold rounded-3xl bg-gradient-to-r from-[#F48B0C] to-[#39B376] cursor-pointer hover:shadow-lg hover:shadow-[#F48B0C] hover:-translate-y-1 transform transition duration-300">
              Sign Up/Log In
            </button>
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
