"use client";
import React from "react";
import { FaBell, FaBolt, FaComments } from "react-icons/fa";
import googlePlay from "../../../public/Images/googlePlay.png";
import appStore from "../../../public/Images/appStore.png";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    icon: <FaBell className="w-6 h-6" />,
    title: "Real-time notifications",
    description: "Get instant updates on tasks, bids, and messages",
  },
  {
    icon: <FaBolt className="w-6 h-6" />,
    title: "Book instantly",
    description: "Hire verified Taskers in seconds",
  },
  {
    icon: <FaComments className="w-6 h-6" />,
    title: "In-app chat",
    description: "Message your Tasker directly — no phone numbers needed",
  },
];

const TaskMatchApp = () => {
  return (
    <section className="py-16 lg:py-20 bg-gradient-to-b from-white to-[#E5FFDB]/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold text-[#063A41]">
            Get the TaskAllo App
          </h2>
          <div className="mx-auto mt-4 w-24 h-1 bg-[#109C3D] rounded-full" />
          <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">
            Faster booking, real-time updates, and seamless communication — all in your pocket.
          </p>
        </div>

        {/* Feature Cards - Tight & Perfect Spacing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-6 lg:p-7 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-gray-200 hover:-translate-y-1.5"
            >
              <div
                className={`inline-flex p-3.5 rounded-xl mb-5 transition-colors duration-300 ${index === 1
                    ? "bg-[#109C3D] text-white group-hover:bg-[#063A41]"
                    : "bg-[#063A41] text-white group-hover:bg-[#109C3D]"
                  }`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-[#063A41] mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* App Store Buttons - Slightly Closer */}
        <div className="mt-12 lg:mt-14 flex flex-col sm:flex-row gap-5 justify-center items-center">
          <Link
            href="/not-found"
            className="group flex items-center gap-4 bg-black text-white px-8 py-5 rounded-2xl hover:bg-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <Image
              src={googlePlay}
              alt="Get it on Google Play"
              width={40}
              height={40}
              className="group-hover:scale-110 transition-transform"
            />
            <div className="text-left">
              <p className="text-xs opacity-80">GET IT ON</p>
              <p className="text-lg font-medium">Google Play</p>
            </div>
          </Link>

          <Link
            href="/not-found"
            className="group flex items-center gap-4 bg-black text-white px-8 py-5 rounded-2xl hover:bg-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <Image
              src={appStore}
              alt="Download on the App Store"
              width={40}
              height={40}
              className="group-hover:scale-110 transition-transform"
            />
            <div className="text-left">
              <p className="text-xs opacity-80">Download on the</p>
              <p className="text-lg font-medium">App Store</p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TaskMatchApp;