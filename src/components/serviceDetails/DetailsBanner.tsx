/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";

interface DetailsBannerProps {
  service: any; // You can refine this type
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DetailsBanner: React.FC<DetailsBannerProps> = ({ service }) => {
  return (
    <div className="w-full bg-[#16161A] relative overflow-hidden py-[100px]">
      {/* Bubble Effects */}
      <div className="absolute z-10 w-[450px] h-[450px] bg-purple-950 opacity-30 rounded-full top-[-60px] left-[-60px] blur-3xl animate-bubbleFloat"></div>
      <div className="absolute z-10 w-[400px] h-[400px] bg-green-950 opacity-30 rounded-full bottom-[-80px] right-[80px] blur-2xl animate-bubbleFloat"></div>

      {/* Content */}
      <div className="relative z-20 flex justify-center items-center w-full px-4">
        <div className="max-w-6xl mx-auto w-full">
          {/* Heading Section */}
          <div className="text-white max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold leading-snug">
              Available{" "}
              <span className="bg-gradient-to-r from-[#FF8609] to-[#FF6C32] text-transparent bg-clip-text">
                Taskers
              </span>
            </h1>
            <p className="text-base md:text-lg font-medium mt-4 text-white/80">
              Find experienced and trusted home cleaning professionals in your area.
              Compare rates, read reviews, and book the perfect cleaner for your needs.
            </p>
          </div>

          {/* Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 px-4 md:px-0">
            {/* Card 1 */}
            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-md">
              <div className="text-blue-400 text-3xl">👥</div>
              <div>
                <h3 className="text-white font-bold text-lg">487 Taskers</h3>
                <p className="text-white/80 text-sm">Available in your area</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-md">
              <div className="text-yellow-400 text-3xl">⭐</div>
              <div>
                <h3 className="text-white font-bold text-lg">4.9 Average Rating</h3>
                <p className="text-white/80 text-sm">
                  Trusted by hundreds of customers
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-md">
              <div className="text-green-400 text-3xl">⏰</div>
              <div>
                <h3 className="text-white font-bold text-lg">24/7 Availability</h3>
                <p className="text-white/80 text-sm">Book anytime, any day</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsBanner;
