"use client";
import React from "react";
import { FaBell, FaBolt, FaComments } from "react-icons/fa";
import googlePlay from "../../../public/Images/googlePlay.png";
import appStore from "../../../public/Images/appStore.png";
import Image from "next/image";

const features = [
  {
    icon: <FaBell className="text-lg sm:text-xl text-white" />,
    title: "Real-time notifications",
    description: "Get instant updates on your tasks and bids",
  },
  {
    icon: <FaBolt className="text-lg sm:text-xl text-white" />,
    title: "Book services instantly",
    description: "Find and hire Taskers with just a few taps",
  },
  {
    icon: <FaComments className="text-lg sm:text-xl text-white" />,
    title: "Chat with Taskers",
    description: "Direct messaging to coordinate your tasks",
  },
];

const TaskMatchApp = () => {
  return (
    <div
      className="w-full relative overflow-hidden py-10 sm:py-12"
      style={{
        background: "linear-gradient(to right, #01A5CC, #1BB09D)",
      }}
    >
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-white text-xl sm:text-3xl md:text-4xl font-bold">
            Get the TaskMatch App
          </h2>
          <div className="h-[3px] w-[50px] bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] rounded-md mt-2"></div>
          <p className="mt-3 text-white text-sm sm:text-base max-w-xl">
            Book services on the go — faster, easier, and more convenient
          </p>

          {/* Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 w-full max-w-4xl">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 border border-white/20 rounded-xl p-4 flex items-center gap-3 hover:bg-white/20 transition-all duration-300"
              >
                <div className="bg-[#8560F1] p-2 rounded-full">{feature.icon}</div>
                <div className="text-left">
                  <h3 className="text-white text-base font-bold">{feature.title}</h3>
                  <p className="text-white/70 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button className="flex items-center gap-3 bg-black/60 px-4 py-3 rounded-lg hover:scale-105 transition-transform duration-300">
              <Image
                src={googlePlay}
                alt="Google Play"
                width={28}
                height={28}
              />
              <div className="text-left">
                <p className="text-xs text-gray-200">GET IT ON</p>
                <p className="text-sm font-semibold text-white">Google Play</p>
              </div>
            </button>
            <button className="flex items-center gap-3 bg-black/60 px-4 py-3 rounded-lg hover:scale-105 transition-transform duration-300">
              <Image src={appStore} alt="App Store" width={28} height={28} />
              <div className="text-left">
                <p className="text-xs text-gray-200">DOWNLOAD ON THE</p>
                <p className="text-sm font-semibold text-white">App Store</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskMatchApp;
