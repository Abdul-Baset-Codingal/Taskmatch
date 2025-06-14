"use client";

import React from "react";
import { FaUsers, FaTasks, FaDollarSign, FaTicketAlt } from "react-icons/fa";

const stats = [
  {
    title: "Total Users",
    value: "8,562",
    icon: <FaUsers />,
    borderColor: "border-blue-400",
    bg: "bg-blue-100",
  },
  {
    title: "Active Tasks",
    value: "1,290",
    icon: <FaTasks />,
    borderColor: "border-green-400",
    bg: "bg-green-100",
  },
  {
    title: "Monthly Revenue",
    value: "$286K",
    icon: <FaDollarSign />,
    borderColor: "border-yellow-400",
    bg: "bg-yellow-100",
  },
  {
    title: "Support Tickets",
    value: "24",
    icon: <FaTicketAlt />,
    borderColor: "border-red-400",
    bg: "bg-red-100",
  },
];

const StatsCards = () => {
  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`rounded-xl p-12 shadow-md border-t-4 ${stat.borderColor} ${stat.bg} transition hover:scale-[1.02] duration-300 flex flex-col items-center text-center`}
          >
            <div className="p-4 bg-white rounded-full shadow text-4xl mb-4 text-gray-700">
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

export default StatsCards;
