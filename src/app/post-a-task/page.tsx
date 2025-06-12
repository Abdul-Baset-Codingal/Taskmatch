import TaskSteps from "@/components/post-a-task/TaskSteps";
import Navbar from "@/shared/Navbar";
import React from "react";
import { FaRegClock, FaUsers, FaRegComments } from "react-icons/fa";

const cardData = [
  {
    icon: <FaRegClock />,
    title: "3min",
    subtitle: "to post",
  },
  {
    icon: <FaUsers />,
    title: "15+",
    subtitle: "taskers available",
  },
  {
    icon: <FaRegComments />,
    title: "30min",
    subtitle: "avg. response time",
  },
];

const page = () => {
  return (
    <div className="bg-[#F7F8FF] min-h-screen w-full">
      <Navbar />
      <div className="px-4 md:px-8 py-10 max-w-7xl mx-auto">
        {/* Title Section */}
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-[#8F6DF2] to-[#B27BB2] bg-clip-text text-transparent">
            Post Your Task
          </h2>
          <div className="mt-4 w-[70px] h-[4px] bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] rounded-md" />
          <p className="mt-4 text-base md:text-lg text-gray-500 max-w-2xl">
            Describe what you need done and find the perfect tasker to help you.
            Posting a task is free, and you&#39;ll get competitive offers from
            top-rated taskers.
          </p>
        </div>

        {/* Cards Section */}
        <div className="flex flex-wrap justify-center gap-6 mt-10">
          {cardData.map((card, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-xl shadow-xl flex items-center gap-4 w-full sm:w-[280px]"
            >
              <div className="text-[#6F3DE9] text-4xl">{card.icon}</div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-[#6F3DE9]">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-500">{card.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Task Steps Section */}
        <div className="mt-12">
          <TaskSteps />
        </div>
      </div>
    </div>
  );
};

export default page;
