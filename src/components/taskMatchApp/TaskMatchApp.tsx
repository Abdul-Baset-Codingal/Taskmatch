import React from "react";
import { FaBell, FaBolt, FaComments } from "react-icons/fa";
import googlePlay from "../../../public/Images/googlePlay.png";
import appStore from "../../../public/Images/appStore.png";
import Image from "next/image";

const features = [
  {
    icon: <FaBell className="text-3xl text-white" />,
    title: "Real-time notifications",
    description: "Get instant updates on your tasks and bids",
  },
  {
    icon: <FaBolt className="text-3xl text-white" />,
    title: "Book services instantly",
    description: "Find and hire Taskers with just a few taps",
  },
  {
    icon: <FaComments className="text-3xl text-white" />,
    title: "Chat with Taskers",
    description: "Direct messaging to coordinate your tasks",
  },
];
const TaskMatchApp = () => {
  return (
    <div
      className="w-full relative overflow-hidden min-h-[190vh] py-20"
      style={{
        clipPath: "polygon(0 10vh, 100% 0, 100% 180vh, 0 190vh)",
        background: "linear-gradient(to right, #01A5CC, #1BB09D)",
      }}
    >
      {/* Top-right bubble */}
      <div className="absolute -top-[50px] -right-[50px]  w-[350px] h-[350px] bg-white/20 rounded-full opacity-30"></div>
      <div className="flex w-full px-6 mx-auto container">
        {/* left div */}
        <div>
          <div className="flex flex-col justify-center items-center w-full">
            <h2 className="text-white text-4xl md:text-6xl font-bold z-10 text-center mt-12 w-full">
              Get the TaskMatch <br /> App{" "}
            </h2>
            <div className="flex justify-center mt-6 w-full">
              <div className="flex rounded-md justify-center h-[4px] w-[70px] bg-gradient-to-r from-[#8560F1] to-[#E7B6FE]"></div>
            </div>
            <div className="flex justify-center mt-1 w-full">
              <p className="mt-2 text-white text-xl font-semibold text-center px-4 w-full">
                Book services on the go with our mobile app - faster, easier,
                and <br /> more convenient
              </p>
            </div>
          </div>
          {/* cards */}
          <div className="grid grid-cols-1 mt-12 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 w-full  border border-white/20 rounded-2xl p-6 flex flex-col items-start gap-4 hover:bg-white/20  transition-all duration-500 hover:scale-105"
              >
                <div className="flex items-center gap-6">
                  <div className="bg-[#8560F1] p-3 rounded-full">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-bold">
                      {feature.title}
                    </h3>
                    <p className="text-white/70 font-medium">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 flex-wrap mt-12">
            {/* Google Play Button */}
            <button className="flex items-center gap-3 bg-black/60 px-6 py-4  rounded-lg shadow-md hover:scale-105 transition-transform duration-300 cursor-pointer">
              <Image
                src={googlePlay}
                alt="Google Play"
                width={40}
                height={40}
              />
              <div className="text-left">
                <p className="text-xs text-gray-200">GET IT ON</p>
                <p className="text-lg font-semibold text-white">Google Play</p>
              </div>
            </button>

            {/* App Store Button */}
            <button className="flex items-center gap-3 bg-black/60 px-6 py-4  rounded-lg shadow-md hover:scale-105 transition-transform duration-300 cursor-pointer">
              <Image src={appStore} alt="App Store" width={40} height={40} />
              <div className="text-left">
                <p className="text-xs text-gray-200">DOWNLOAD ON THE</p>
                <p className="text-lg font-semibold text-white">App Store</p>
              </div>
            </button>
          </div>
        </div>
        {/* right div */}
        <div></div>
      </div>
    </div>
  );
};

export default TaskMatchApp;
