"use client";
import React from "react";
import BannerCard from "./BannerCard";
import Link from "next/link";

const Banner = () => {
  return (
    <div
      className="w-full bg-[#16161A] relative overflow-hidden"
      style={{
        height: "85vh",
        clipPath: "polygon(0 0, 100% 0, 100% 75vh, 0 85vh)",
      }}
    >
      {/* Bubble Top Left */}
      <div className="absolute z-10 w-[150px] xs:w-[200px] sm:w-[300px] md:w-[400px] lg:w-[450px] h-[150px] xs:h-[200px] sm:h-[300px] md:h-[400px] lg:h-[450px] bg-purple-950 opacity-30 rounded-full top-[-30px] xs:top-[-40px] sm:top-[-50px] lg:top-[-60px] left-[-30px] xs:left-[-40px] sm:left-[-50px] lg:left-[-60px] blur-xl sm:blur-2xl lg:blur-3xl animate-bubbleFloat"></div>

      {/* Bubble Bottom Right */}
      <div className="absolute z-10 w-[120px] xs:w-[160px] sm:w-[250px] md:w-[350px] lg:w-[400px] h-[120px] xs:h-[160px] sm:h-[250px] md:h-[350px] lg:h-[400px] bg-green-950 opacity-30 rounded-full bottom-[-30px] xs:bottom-[-40px] sm:bottom-[-60px] lg:bottom-[-80px] right-[-20px] xs:right-[-10px] sm:right-[20px] lg:right-[80px] blur-lg sm:blur-xl lg:blur-2xl animate-bubbleFloat"></div>

      {/* Content Container */}
      <div className="relative z-20 flex justify-center items-center h-full w-full">
        <div className="flex flex-col lg:flex-row items-center max-w-6xl mx-auto gap-6 xs:gap-8 sm:gap-12 lg:gap-16 px-4 xs:px-6 sm:px-8 lg:px-16 w-full justify-center">
          {/* Left Text */}
          <div className="text-white max-w-lg text-center lg:text-left">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight xs:leading-snug lg:leading-snug">
              Get help.
              <br />
              Get things done.
            </h1>
            <p className="text-sm xs:text-base sm:text-lg font-semibold mt-2 xs:mt-3 lg:mt-3">
              Connect with skilled professionals for any task, big or small.
            </p>

            {/* Search Bar */}
            <div className="mt-4 xs:mt-5 sm:mt-6 relative w-full max-w-md mx-auto lg:mx-0">
              <input
                type="text"
                placeholder="Search services..."
                className="w-full rounded-full py-2 xs:py-2.5 sm:py-3 px-3 xs:px-4 sm:px-5 pr-20 xs:pr-24 sm:pr-32 bg-[#252531] text-white placeholder-gray-400 text-xs xs:text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="absolute top-1/2 right-0 -translate-y-1/2 bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] text-white px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 rounded-full font-semibold text-xs xs:text-sm sm:text-base hover:shadow-lg transition cursor-pointer transform hover:scale-105 lg:hover:scale-110 duration-500"
              >
                Search
              </button>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-5 w-full">
              <Link href="/post-a-task" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto text-white text-sm sm:text-base md:text-lg bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] px-6 py-3 sm:px-8 sm:py-4 font-semibold rounded-3xl sm:rounded-4xl hover:shadow-lg hover:shadow-[#8560F1] hover:-translate-y-1 transform transition duration-300">
                  Post a Task
                </button>
              </Link>
              <button className="w-full sm:w-auto text-white text-sm sm:text-base md:text-lg bg-gradient-to-r from-[#28B584] to-[#02A6CB] px-6 py-3 sm:px-8 sm:py-4 font-semibold rounded-3xl sm:rounded-4xl hover:shadow-lg hover:shadow-[#28B584] hover:-translate-y-1 transform transition duration-300">
                Book Directly
              </button>
            </div>
          </div>
          <div className="hidden lg:block">
            <BannerCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
