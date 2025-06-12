/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";

const cardData = [
  {
    title: "Post or Book Your Way",
    description:
      "Post a Task to get it done ASAP or schedule based on your budget. Book Directly by picking a top-rated Tasker based on reviews and price.",
  },
  {
    title: "Find Your Perfect Tasker",
    description:
      "Browse profiles, reviews, and offers. Chat directly to find the right match for your task.",
  },
  {
    title: "Get It Done & Pay Securely",
    description:
      "Your Tasker arrives and gets the job done. Pay securely through our platform only when the task is complete.",
  },
  {
    title: "Leave a Review",
    description:
      "Rate your experience and help other customers find great Taskers in your community.",
  },
];

const HowTaskMatchWorks = () => {
  return (
    <div className="w-full bg-gradient-to-r from-[#6F3DE9] to-[#5714E0] relative overflow-hidden py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-10 xl:px-20">
      {/* Top-right bubble */}
      <div className="absolute -top-12 -right-12 w-36 h-36 md:w-[350px] md:h-[350px] bg-[#7A51EE] rounded-full opacity-30"></div>

      {/* Title Section */}
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-white text-2xl sm:text-3xl md:text-5xl font-bold">
          How TaskMatch Works
        </h2>
        <div className="flex justify-center mt-3">
          <div className="h-1.5 w-16 sm:w-20 md:w-24 bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] rounded-md" />
        </div>
        <p className="mt-4 text-white text-sm sm:text-base md:text-xl font-semibold">
          Finding help shouldn't be hard. We've made the process simple and
          secure.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-12">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="relative backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-xl p-5 sm:p-6 md:p-8 text-white hover:scale-105 transition-transform duration-500 overflow-hidden"
          >
            {/* Bubble effect */}
            <div className="absolute w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-white/20 rounded-full bottom-[-48px] right-[-48px] sm:bottom-[-56px] sm:right-[-56px] opacity-50 z-0 transition-all duration-500"></div>

            {/* Card content */}
            <div className="relative z-10">
              <h2 className="text-white/50 text-4xl sm:text-5xl md:text-6xl font-bold leading-none">
                {index}
              </h2>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 mt-4 sm:mt-5">
                {card.title}
              </h3>
              {index === 0 ? (
                <p className="text-white/80 text-xs sm:text-sm md:text-base leading-relaxed">
                  <span className="text-[#FF8906] font-bold">Post a Task</span>{" "}
                  to get it done ASAP or schedule based on your budget.
                  <br />
                  <br />
                  <span className="text-[#FF8906] font-bold">
                    Book Directly
                  </span>{" "}
                  by picking a top-rated Tasker based on reviews and price.
                </p>
              ) : (
                <p className="text-white/80 text-xs sm:text-sm md:text-base leading-relaxed">
                  {card.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowTaskMatchWorks;
