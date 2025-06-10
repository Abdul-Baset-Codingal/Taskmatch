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
    <div className="bg-[#F7F8FF] w-full">
      <Navbar />
      <div>
        <div className="flex flex-col justify-center items-center w-full">
          <h2 className="text-4xl md:text-6xl font-bold z-10 text-center mt-12 w-full bg-gradient-to-r from-[#8F6DF2] to-[#B27BB2] bg-clip-text text-transparent">
            Post Your Task
          </h2>

          <div className="flex justify-center mt-6 w-full">
            <div className="flex rounded-md justify-center h-[4px] w-[70px] bg-gradient-to-r from-[#8560F1] to-[#E7B6FE]"></div>
          </div>
          <div className="flex justify-center mt-1 w-full">
            <p className="mt-2  text-xl  text-center px-4 w-full text-gray-500 ">
              Describe what you need done and find the perfect tasker to help
              you. Posting a <br /> task is free, and you&#39;ll get competitive
              offers from top-rated taskers.
            </p>
          </div>
        </div>
        <div className="flex justify-center mt-12">
          <div className="flex flex-wrap gap-5 items-center">
            {cardData.map((card, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-xl shadow-2xl text-center flex items-center gap-5 w-full sm:w-auto"
              >
                <div className="text-[#6F3DE9] text-5xl">{card.icon}</div>
                <div className="text-left">
                  <h3 className="text-2xl text-[#6F3DE9] font-medium">
                    {card.title}
                  </h3>
                  <p className="text-gray-500 text-sm">{card.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full mt-10">
          <TaskSteps />
        </div>
      </div>
    </div>
  );
};

export default page;
