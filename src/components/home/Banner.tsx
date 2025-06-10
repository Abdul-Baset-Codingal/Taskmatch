"use client";
import React from "react";
import BannerCard from "./BannerCard";

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
      <div className="absolute z-10 w-[450px] h-[450px] bg-purple-950 opacity-30 rounded-full top-[-60px] left-[-60px] blur-3xl animate-bubbleFloat"></div>

      {/* Bubble Bottom Right */}
      <div className="absolute z-10 w-[400px] h-[400px] bg-green-950 opacity-30 rounded-full bottom-[-80px] right-[80px] blur-2xl animate-bubbleFloat"></div>

      {/* Content Container */}
      <div className="relative z-20 flex justify-center items-center h-full w-full">
        <div className="flex items-center max-w-6xl mx-auto gap-16 px-16 w-full justify-center">
          {/* Left Text */}
          <div className="text-white max-w-lg">
            <h1 className="text-6xl font-bold leading-snug">
              Get help.
              <br />
              Get things done.
            </h1>
            <p className="text-lg font-semibold mt-3">
              Connect with skilled professionals for any task, big or small.
            </p>

            {/* Search Bar */}
            <div className="mt-6 relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search services...(cleaning, repairs"
                className="w-full rounded-full py-3 px-5 pr-32 bg-[#252531] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="absolute top-1/2 right-0 -translate-y-1/2 bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition cursor-pointer tranform hover:scale-110 duration-500"
              >
                Search
              </button>
            </div>
            <div className="mt-6 flex items-center gap-5">
              <button className="text-white text-lg bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] px-6 py-4 font-semibold rounded-4xl  hover:shadow-lg hover:shadow-[#8560F1] hover:-translate-y-1 transform transition duration-300 cursor-pointer">
                Post a Task
              </button>
              <button className="text-white text-lg bg-gradient-to-r from-[#28B584] to-[#02A6CB] px-6 py-4 font-semibold rounded-4xl  hover:shadow-lg hover:shadow-[#28B584] hover:-translate-y-1 transform transition duration-300 cursor-pointer">
                Book Directly
              </button>
            </div>
          </div>
          <div>
            <BannerCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
