"use client";
import React from "react";
import {
  FaTasks,
  FaClipboardList,
  FaCheckCircle,
  FaDollarSign,
} from "react-icons/fa";

const ClientStats = () => {
  const stats = [
    {
      title: "Total Tasks",
      value: "8",
      icon: <FaTasks className="text-blue-700 text-4xl" />,
      borderColor: "border-t-4 border-blue-500",
      bg: "bg-blue-100/70",
    },
    {
      title: "Active Tasks",
      value: "3",
      icon: <FaClipboardList className="text-yellow-700 text-4xl" />,
      borderColor: "border-t-4 border-yellow-500",
      bg: "bg-yellow-100/70",
    },
    {
      title: "Completed Tasks",
      value: "5",
      icon: <FaCheckCircle className="text-green-700 text-4xl" />,
      borderColor: "border-t-4 border-green-500",
      bg: "bg-green-100/70",
    },
    {
      title: "Total Spent",
      value: "$1,250",
      icon: <FaDollarSign className="text-purple-700 text-4xl" />,
      borderColor: "border-t-4 border-purple-500",
      bg: "bg-purple-100/70",
    },
  ];

  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`rounded-xl p-8 shadow-md ${stat.borderColor} ${stat.bg} transition hover:scale-[1.02] duration-300 flex flex-col items-center text-center`}
          >
            <div className="p-4 bg-white rounded-full shadow text-4xl mb-4">
              {stat.icon}
            </div>
            <h3 className="text-4xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-lg text-gray-700 mt-2">{stat.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ClientStats;
