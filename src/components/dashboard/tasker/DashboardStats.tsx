import React from "react";
import { FaTasks, FaDollarSign, FaStar, FaCheckCircle } from "react-icons/fa";

const DashboardStats = () => {
  const stats = [
    {
      title: "Active Tasks",
      value: "12",
      icon: <FaTasks className="text-2xl text-[#FF6B6B]" />,
      borderColor: "border-t-4 border-[#FF6B6B]",
    },
    {
      title: "This Month",
      value: "$1,450",
      icon: <FaDollarSign className="text-2xl text-[#4CAF50]" />,
      borderColor: "border-t-4 border-[#4CAF50]",
    },
    {
      title: "Rating",
      value: "4.9",
      icon: <FaStar className="text-2xl text-[#FFC107]" />,
      borderColor: "border-t-4 border-[#FFC107]",
    },
    {
      title: "Complete",
      value: "38",
      icon: <FaCheckCircle className="text-2xl text-[#2196F3]" />,
      borderColor: "border-t-4 border-[#2196F3]",
    },
  ];

  return (
    <section className=" py-10 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-md ${stat.borderColor}`}
          >
            <div className="flex items-center gap-5">
              <div className="p-4 bg-white rounded-full shadow-md text-3xl">
                {stat.icon}
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-800">
                  {stat.value}
                </h3>
                <p className="text-base text-gray-600">{stat.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DashboardStats;
