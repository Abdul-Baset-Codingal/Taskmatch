"use client";
import React from "react";
import { FaBell, FaBolt, FaComments } from "react-icons/fa";
import googlePlay from "../../../public/Images/googlePlay.png";
import appStore from "../../../public/Images/appStore.png";
import Image from "next/image";
import Link from "next/link";

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
    icon: <FaComments className="text-lg sm:text-xl text2" />,
    title: "Chat with Taskers",
    description: "Direct messaging to coordinate your tasks",
  },
];

const TaskMatchApp = () => {
  return (
    <div className="w-full relative overflow-hidden py-10 sm:py-12 color3">
      {/* Mesh Gradient Balls */}
      <div
        className="absolute top-0 left-0 w-40 h-40 sm:w-60 sm:h-60 rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle at center, #2F6F69 0%, transparent 70%)",
        }}
      ></div>

      <div
        className="absolute bottom-0 right-0 w-40 h-40 sm:w-60 sm:h-60 rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle at center, #2F6F69 0%, transparent 70%)",
        }}
      ></div>

      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-gray-800 text-xl sm:text-3xl md:text-4xl font-bold">
            Get the TaskAllo App
          </h2>
          <div className="h-[3px] w-[50px] color1 rounded-md mt-2"></div>
          <p className="mt-3 text-gray-700 text-sm sm:text-base max-w-xl">
            Book services on the go — faster, easier, and more convenient
          </p>

          {/* Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 w-full max-w-4xl">
            {features.map((feature, index) => {
              const bgColor =
                index === 0
                  ? "color1"
                  : index === 1
                    ? "color2"
                    : "color3";
              const textColor =
                index === 2 ? "text2" : "text-white";

              return (
                <div
                  key={index}
                  className={`${bgColor} border border-gray-200 rounded-xl p-5 flex items-center gap-3 transition-all duration-300 shadow-md hover:scale-105`}
                >
                  <div className="bg-white/20 p-3 rounded-full">{feature.icon}</div>
                  <div className={`text-left ${textColor}`}>
                    <h3 className="text-base font-bold">{feature.title}</h3>
                    <p className="text-sm opacity-90">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link href={"/not-found"}>
              <button className="flex items-center gap-3 bg-gray-800 px-4 py-3 rounded-lg hover:scale-105 transition-transform duration-300 shadow-md">
                <Image
                  src={googlePlay}
                  alt="Google Play"
                  width={28}
                  height={28}
                />
                <div className="text-left">
                  <p className="text-xs text-gray-300">GET IT ON</p>
                  <p className="text-sm font-semibold text-white">Google Play</p>
                </div>
              </button>
            </Link>
            <Link href={"/not-found"}>
              <button className="flex items-center gap-3 bg-gray-800 px-4 py-3 rounded-lg hover:scale-105 transition-transform duration-300 shadow-md">
                <Image src={appStore} alt="App Store" width={28} height={28} />
                <div className="text-left">
                  <p className="text-xs text-gray-300">DOWNLOAD ON THE</p>
                  <p className="text-sm font-semibold text-white">App Store</p>
                </div>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskMatchApp;
