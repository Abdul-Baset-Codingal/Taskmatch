import React from "react";
import { FaCheck } from "react-icons/fa";
import Step1Fields from "./Step1Fields";

const features = [
  "Priority matching",
  "Faster response",
  "Higher acceptance rate",
];
const features2 = ["Most affordable", "Better scheduling", "More options"];

const Step1 = () => {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#8560F1] flex items-center gap-2">
        <span className="ml-1 sm:ml-2 md:ml-3 mb-1">
          ⏰ Step 1: Select Timeline
        </span>
      </h2>

      <div className="flex rounded-md mt-4 md:mt-8 justify-center h-[4px] w-[50px] sm:w-[60px] md:w-[70px] bg-gradient-to-r from-[#8560F1] to-[#E7B6FE]"></div>

      <div className="mt-6 md:mt-8 bg-[#F4F7FF] rounded-2xl border-l-4 border-[#8560F1] p-4 sm:p-6 md:p-8">
        <p className="text-[#8560F1] text-lg sm:text-xl font-bold">
          💡 How Soon Do You Need It Done?
        </p>
        <p className="text-base sm:text-lg mt-3 sm:mt-5 text-[#72757E] font-medium">
          Select how quickly you need your task completed - this greatly impacts
          which taskers will be available and response times.
        </p>
      </div>

      <p className="text-[#FF7600] font-semibold mt-6 sm:mt-8 text-sm sm:text-base">
        👉 Choose ASAP for faster responses and quicker completion
      </p>

      <div className="flex flex-col lg:flex-row gap-6 mt-6 sm:mt-8 w-full">
        {/* 1st card */}
        <div className="w-full lg:w-1/2 border-2 rounded-3xl border-[#FF7600] p-4 bg-[#FFF9F2] shadow-xl shadow-[#FF7600]">
          <div className="flex justify-end">
            <button className="text-white bg-[#FF7600] px-3 py-1 rounded-2xl text-sm font-semibold">
              Recommend
            </button>
          </div>
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white text-3xl sm:text-4xl bg-gradient-to-br from-[#FF8E23] to-[#FFA546] ml-2 sm:ml-4">
            ⚡
          </div>
          <h2 className="text-xl sm:text-2xl text-[#FF7600] font-bold mt-2 ml-2 sm:ml-4">
            Urgent - ASAP!
          </h2>
          <p className="mt-2 sm:mt-3 text-[#72757E] ml-2 sm:ml-4 font-semibold text-sm sm:text-base">
            Need it done immediately? Taskers typically respond within 30
            minutes
          </p>
          <div className="space-y-2 mt-4 sm:mt-5 ml-2 sm:ml-4">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="bg-[#FFE3C3] p-1 rounded-full">
                  <FaCheck className="text-sm text-[#FF7600] font-semibold" />
                </div>
                <span className="text-[#FF7600] font-semibold text-sm sm:text-base">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 2nd card */}
        <div className="w-full lg:w-1/2 border-2 rounded-3xl border-[#8560F1] p-4 bg-[#F8F7FE] shadow-xl">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full mt-4 sm:mt-6 flex items-center justify-center text-white text-3xl sm:text-4xl bg-[#ECE6FD] ml-2 sm:ml-4">
            📅
          </div>
          <h2 className="text-xl sm:text-2xl text-[#8560F1] font-bold mt-2 ml-2 sm:ml-4">
            Standard Timeline
          </h2>
          <p className="mt-2 sm:mt-3 text-[#72757E] ml-2 sm:ml-4 font-semibold text-sm sm:text-base">
            Plan ahead with scheduled dates and times
          </p>
          <div className="space-y-2 mt-4 sm:mt-5 ml-2 sm:ml-4">
            {features2.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="bg-[#ECE6FD] p-1 rounded-full">
                  <FaCheck className="text-sm text-[#8560F1] font-semibold" />
                </div>
                <span className="text-[#8560F1] font-semibold text-sm sm:text-base">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pro Tip */}
      <div className="mt-6 sm:mt-8 bg-[#FFF9F2] border border-[#FF7600] rounded-3xl p-4 sm:p-6">
        <p className="text-[#72757E] text-xs sm:text-sm font-medium">
          💡 <span className="font-bold">Pro Tip:</span> Urgent tasks typically
          receive 3x faster responses but have a 15% higher average price.
        </p>
      </div>

      {/* Fields */}
      <div className="mt-6 sm:mt-8">
        <Step1Fields />
      </div>
    </div>
  );
};

export default Step1;
