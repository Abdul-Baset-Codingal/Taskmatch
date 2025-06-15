"use client";

import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const stats = [
  {
    title: "Monthly Revenue",
    change: "+15.3%",
    value: "$1.28M",
    note: "This month's performance",
    up: true,
    gradient: {
      border: "from-[#1e3a8a] to-[#312e81]", // dark blue to indigo
      title: "from-[#3b82f6] to-[#6366f1]",
      value: "from-[#4338ca] via-[#4f46e5] to-[#6366f1]",
    },
  },
  {
    title: "User Growth",
    change: "+8.7%",
    value: "+2,458",
    note: "New users this month",
    up: true,
    gradient: {
      border: "from-[#064e3b] to-[#065f46]", // dark teal to deep green
      title: "from-[#10b981] to-[#059669]",
      value: "from-[#065f46] via-[#047857] to-[#34d399]",
    },
  },
  {
    title: "Profit Margin",
    change: "+2.8%",
    value: "38.5%",
    note: "5.5% industry average",
    up: true,
    gradient: {
      border: "from-[#78350f] to-[#92400e]", // deep amber
      title: "from-[#f59e0b] to-[#d97706]",
      value: "from-[#b45309] via-[#92400e] to-[#78350f]",
    },
  },
  {
    title: "Customer LTV",
    change: "+12.1%",
    value: "$752",
    note: "Up from $670 last quarter",
    up: true,
    gradient: {
      border: "from-[#831843] to-[#9d174d]", // dark rose
      title: "from-[#f472b6] to-[#db2777]",
      value: "from-[#9d174d] via-[#be185d] to-[#f472b6]",
    },
  },
  {
    title: "CAC Ratio",
    change: "-3.2%",
    value: "3.8:1",
    note: "Target is 3:1 or higher",
    up: false,
    gradient: {
      border: "from-[#7f1d1d] to-[#991b1b]", // deep red
      title: "from-[#ef4444] to-[#dc2626]",
      value: "from-[#b91c1c] via-[#ef4444] to-[#f87171]",
    },
  },
  {
    title: "Market Share",
    change: "+1.4%",
    value: "23.5%",
    note: "Leading in 3/5 major Ontario markets",
    up: true,
    gradient: {
      border: "from-[#0c4a6e] to-[#1e40af]", // dark blue tones
      title: "from-[#38bdf8] to-[#3b82f6]",
      value: "from-[#1e40af] via-[#2563eb] to-[#3b82f6]",
    },
  },
];

const DashboardStatsSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-6  mt-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl pt-1 shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300"
          >
            {/* Top Border */}
            <div
              className={`h-1 rounded-t-3xl bg-gradient-to-r ${item.gradient.border}`}
            ></div>

            {/* Card Content */}
            <div className="p-8 text-gray-900">
              <div className="flex items-center justify-between mb-4">
                <h3
                  className={`text-lg font-semibold bg-gradient-to-r ${item.gradient.title} text-transparent bg-clip-text`}
                >
                  {item.title}
                </h3>
                <span
                  className={`flex items-center text-sm font-medium ${
                    item.up ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {item.up ? (
                    <FaArrowUp className="mr-1" />
                  ) : (
                    <FaArrowDown className="mr-1" />
                  )}
                  {item.change}
                </span>
              </div>
              <h2
                className={`text-3xl font-bold bg-gradient-to-r ${item.gradient.value} text-transparent bg-clip-text mb-2`}
              >
                {item.value}
              </h2>
              <p className="text-sm text-gray-500">{item.note}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DashboardStatsSection;
