import React from "react";
import { FaBell, FaBolt, FaComments } from "react-icons/fa";
import googlePlay from "../../../public/Images/googlePlay.png";
import appStore from "../../../public/Images/appStore.png";
import Image from "next/image";

const features = [
  {
    icon: <FaBell className="text-2xl sm:text-3xl text-white" />,
    title: "Real-time notifications",
    description: "Get instant updates on your tasks and bids",
  },
  {
    icon: <FaBolt className="text-2xl sm:text-3xl text-white" />,
    title: "Book services instantly",
    description: "Find and hire Taskers with just a few taps",
  },
  {
    icon: <FaComments className="text-2xl sm:text-3xl text-white" />,
    title: "Chat with Taskers",
    description: "Direct messaging to coordinate your tasks",
  },
];

const TaskMatchApp = () => {
  return (
    <div
      className="w-full relative overflow-hidden min-h-screen py-12 sm:py-16 md:py-20"
      style={{
        clipPath: "polygon(0 10%, 100% 0, 100% 90%, 0 100%)",
        background: "linear-gradient(to right, #01A5CC, #1BB09D)",
      }}
    >
      {/* Top-right bubble */}
      <div className="absolute -top-[50px] -right-[50px] w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] md:w-[350px] md:h-[350px] bg-white/20 rounded-full opacity-30"></div>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col items-center">
          <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold z-10 text-center mt-8 sm:mt-10">
            Get the TaskMatch App
          </h2>
          <div className="flex justify-center mt-3 sm:mt-4">
            <div className="h-[4px] w-[50px] sm:w-[70px] bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] rounded-md"></div>
          </div>
          <p className="mt-3 sm:mt-4 text-white text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-center max-w-xs sm:max-w-md md:max-w-lg">
            Book services on the go with our mobile app - faster, easier, and
            more convenient
          </p>

          {/* Cards */}
          <div className="grid grid-cols-1 mt-8 sm:mt-10 md:mt-12 gap-4 sm:gap-6 w-full max-w-md sm:max-w-none">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-6 flex flex-col items-start gap-3 sm:gap-4 hover:bg-white/20 transition-all duration-500 hover:scale-105"
              >
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="bg-[#8560F1] p-2 sm:p-3 rounded-full">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-white text-lg sm:text-xl font-bold">
                      {feature.title}
                    </h3>
                    <p className="text-white/70 text-xs sm:text-sm md:text-base font-medium">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 sm:mt-10 md:mt-12">
            <button className="flex items-center gap-3 bg-black/60 px-4 py-3 sm:px-6 sm:py-4 rounded-lg shadow-md hover:scale-105 transition-transform duration-300 cursor-pointer">
              <Image
                src={googlePlay}
                alt="Google Play"
                width={32}
                height={32}
                className="sm:w-[40px] sm:h-[40px]"
              />
              <div className="text-left">
                <p className="text-xs text-gray-200">GET IT ON</p>
                <p className="text-base sm:text-lg font-semibold text-white">
                  Google Play
                </p>
              </div>
            </button>
            <button className="flex items-center gap-3 bg-black/60 px-4 py-3 sm:px-6 sm:py-4 rounded-lg shadow-md hover:scale-105 transition-transform duration-300 cursor-pointer">
              <Image
                src={appStore}
                alt="App Store"
                width={32}
                height={32}
                className="sm:w-[40px] sm:h-[40px]"
              />
              <div className="text-left">
                <p className="text-xs text-gray-200">DOWNLOAD ON THE</p>
                <p className="text-base sm:text-lg font-semibold text-white">
                  App Store
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskMatchApp;
