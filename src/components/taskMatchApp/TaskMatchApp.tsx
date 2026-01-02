"use client";
import React, { useState, useEffect } from "react";
import { FaBell, FaBolt, FaComments, FaTimes } from "react-icons/fa";
import SectionHeader from "@/resusable/SectionHeader";

const features = [
  {
    icon: <FaBell className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Real-time notifications",
    description: "Get instant updates on tasks, bids, and messages",
  },
  {
    icon: <FaBolt className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Book instantly",
    description: "Hire verified Taskers in seconds",
  },
  {
    icon: <FaComments className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "In-app chat",
    description: "Message your Tasker directly — no phone numbers needed",
  },
];

const TaskMatchApp = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAppButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  return (
    <>
      <section className="py-10 sm:py-14 md:py-16 lg:py-20 bg-gradient-to-b from-white to-[#E5FFDB]/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
            <SectionHeader
              title="How Taskallo works"
              description="Faster booking, real-time updates, and seamless communication."
            />
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-7 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-gray-200 hover:-translate-y-1.5 ${index === 2
                    ? "sm:col-span-2 lg:col-span-1 sm:max-w-md sm:mx-auto lg:max-w-none"
                    : ""
                  }`}
              >
                <div
                  className={`inline-flex p-3 sm:p-3.5 rounded-lg sm:rounded-xl mb-4 sm:mb-5 transition-colors duration-300 ${index === 1
                      ? "bg-[#109C3D] text-white group-hover:bg-[#063A41]"
                      : "bg-[#063A41] text-white group-hover:bg-[#109C3D]"
                    }`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-[#063A41] mb-1.5 sm:mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* App Store Buttons */}
          <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-14 flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 justify-center items-center px-4 sm:px-0">
            {/* Google Play Button */}
            <button
              onClick={handleAppButtonClick}
              className="group w-full sm:w-auto flex items-center justify-center sm:justify-start gap-3 sm:gap-4 bg-black text-white px-6 sm:px-8 py-4 sm:py-5 rounded-xl sm:rounded-2xl hover:bg-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 cursor-pointer"
            >
              <img
                src="/Images/googlePlay.png"
                alt="Get it on Google Play"
                className="w-8 h-8 sm:w-10 sm:h-10 group-hover:scale-110 transition-transform"
              />
              <div className="text-left">
                <p className="text-[10px] sm:text-xs opacity-80 uppercase tracking-wide">
                  Get it on
                </p>
                <p className="text-base sm:text-lg font-medium">Google Play</p>
              </div>
            </button>

            {/* App Store Button */}
            <button
              onClick={handleAppButtonClick}
              className="group w-full sm:w-auto flex items-center justify-center sm:justify-start gap-3 sm:gap-4 bg-black text-white px-6 sm:px-8 py-4 sm:py-5 rounded-xl sm:rounded-2xl hover:bg-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 cursor-pointer"
            >
              <img
                src="/Images/appStore.png"
                alt="Download on the App Store"
                className="w-8 h-8 sm:w-10 sm:h-10 group-hover:scale-110 transition-transform"
              />
              <div className="text-left">
                <p className="text-[10px] sm:text-xs opacity-80 uppercase tracking-wide">
                  Download on the
                </p>
                <p className="text-base sm:text-lg font-medium">App Store</p>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* MODAL - Close Button on Image Corner */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={handleBackdropClick}
        >
          {/* Image Wrapper with Relative Position */}
          <div
            className="relative inline-block"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - Positioned on Image Corner */}
            <button
              onClick={closeModal}
              className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-white rounded-full p-2 sm:p-2.5 shadow-xl hover:bg-gray-100 hover:scale-110 transition-all duration-200 z-30"
              aria-label="Close modal"
            >
              <FaTimes className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            </button>

            {/* Image */}
            <img
              src="/Images/taskalloComing.jpeg"
              alt="TaskAllo App - Coming Soon"
              className="h-full w-auto max-w-[90vw] lg:max-w-[60vw] object-contain rounded-2xl sm:rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TaskMatchApp;