"use client";
import React, { useEffect, useState } from "react";
import BannerCard from "./BannerCard";

const Banner = () => {
  const [clipPath, setClipPath] = useState(
    "polygon(0 0, 100% 0, 100% 210vh, 0 220vh)"
  );
  const [height, setHeight] = useState("120vh");

  useEffect(() => {
    const updateClipPath = () => {
      if (window.innerWidth < 768) {
        setClipPath("polygon(0 0, 100% 0, 100% 190vh, 0 200vh)");
        setHeight("200vh");
      } else {
        setClipPath("polygon(0 0, 100% 0, 100% 210vh, 0 120vh)");
        setHeight("120vh");
      }
    };

    updateClipPath(); // Run once on mount

    window.addEventListener("resize", updateClipPath);
    return () => window.removeEventListener("resize", updateClipPath);
  }, []);

  return (
    <div
      className="w-full bg-[#16161A] relative overflow-hidden"
      style={{
        height: height,
        clipPath: clipPath,
      }}
    >
      {/* Bubble Top Left */}
      <div className="absolute z-10 w-[450px] h-[450px] bg-purple-950 opacity-30 rounded-full top-[-60px] left-[-60px] blur-3xl animate-bubbleFloat"></div>

      {/* Bubble Bottom Right */}
      <div className="absolute z-10 w-[400px] h-[400px] bg-green-950 opacity-30 rounded-full bottom-[-80px] right-[80px] blur-2xl animate-bubbleFloat"></div>

      {/* Content Container */}
      <div className="relative z-20 flex justify-center items-center h-full w-full">
        <div className="flex items-center max-w-6xl mx-auto gap-16 w-full justify-center flex-col lg:flex-row px-4">
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
                placeholder="what pet service do you need?"
                className="w-full rounded-full py-3 px-5 pr-32 bg-[#252531] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="absolute top-1/2 right-0 -translate-y-1/2 bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition cursor-pointer tranform hover:scale-110 duration-500"
              >
                Search
              </button>
            </div>
            <div className="flex justify-center mt-12">
              <p className="text-white font-bold mr-16">Choose an option:</p>
            </div>
            <div className="max-w-md mt-4">
              <button className="text-white w-full font-bold bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] px-6 py-3  rounded-4xl  hover:shadow-lg hover:shadow-[#8560F1] hover:-translate-y-1 transform transition duration-300 cursor-pointer">
                Post a Pet Care Task
              </button>
              <button className="text-white w-full mt-5  bg-gradient-to-r from-[#FF8906] to-[#FF8906] px-6 py-3 font-bold rounded-4xl  hover:shadow-lg hover:shadow-[#FF8906] hover:-translate-y-1 transform transition duration-300 cursor-pointer">
                Book Pet Care Services
              </button>
            </div>
            <div className="flex justify-center mt-2">
              <p className="text-white text-sm mr-16">
                Choose the option that works best for you
              </p>
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
