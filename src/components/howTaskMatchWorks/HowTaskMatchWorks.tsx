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
    <div
      className="w-full  bg-gradient-to-r from-[#6F3DE9] to-[#5714E0] relative overflow-hidden"
      style={{
        height: "150vh",
        clipPath: "polygon(0 0, 100% 0, 100% 140vh, 0 150vh)",
      }}
    >
      {/* Top-right bubble */}
      <div className="absolute -top-[50px] -right-[50px]  w-[350px] h-[350px] bg-[#7A51EE] rounded-full opacity-30"></div>

      {/* Title */}
      <h2 className="text-white text-4xl md:text-6xl font-bold z-10 text-center mt-32">
        How TaskMatch Works
      </h2>
      <div className="flex justify-center mt-3">
        <div className="flex rounded-md justify-center h-[4px] w-[70px] bg-gradient-to-r from-[#8560F1] to-[#E7B6FE]"></div>
      </div>
      <div className="flex justify-center mt-1">
        <p className="mt-2 text-white text-xl font-semibold text-center px-4">
          Finding help shouldn't be hard. We've made the process simple and
          secure.
        </p>
      </div>

      {/* Cards with bottom-right bubbles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20 px-6  mx-auto container mb-20">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="relative backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-xl p-8 text-white hover:scale-105 transition-transform duration-500 overflow-hidden "
            style={{
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            }}
          >
            {/* Bottom-right bubble (larger & visible) */}
            <div className="absolute w-40 h-40 bg-white/20 rounded-full bottom-[-80px] right-[-80px] group-hover:bottom-[-40px] group-hover:right-[-40px] opacity-50 z-0 transition-all duration-500"></div>

            {/* Card content */}
            <div className="relative z-10">
              <h2 className="text-white/50 text-7xl font-bold">{index}</h2>
              <h3 className="text-2xl font-bold mb-4 mt-7">{card.title}</h3>
              {index === 0 ? (
                <p className="text-white/80">
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
                <p className="text-white/80">{card.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowTaskMatchWorks;
