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
    <div className="p-8 ">
      <h2 className="text-4xl font-semibold text-[#8560F1] flex items-center gap-2">
        <span className="ml-3 mb-1">⏰ Step 1: Select Timeline</span>
      </h2>
      <div className="flex rounded-md mt-8 justify-center h-[4px] w-[70px] bg-gradient-to-r from-[#8560F1] to-[#E7B6FE]"></div>
      <div className=" mt-8 h-[180px] w-full bg-[#F4F7FF] rounded-2xl border-l-4 border-[#8560F1] p-8">
        <p className="text-[#8560F1] text-xl font-bold">
          💡 How Soon Do You Need It Done?
        </p>
        <p className="text-lg mt-5 text-[#72757E] font-medium">
          Select how quickly you need your task completed - this greatly impacts
          which taskers will be available and response times.
        </p>
      </div>

      {/* cards */}
      <p className="text-[#FF7600] font-semibold mt-8">
        👉 Choose ASAP for faster responses and quicker completion
      </p>
      <div className="flex items-center w-full gap-5 mt-8">
        {/* 1st card */}
        <div className="w-1/2 h-[360px] border-2 rounded-3xl  border-[#FF7600] p-3 bg-[#FFF9F2] shadow-xl shadow-[#FF7600]">
          <div className="flex justify-end ">
            <button className="text-white bg-[#FF7600] px-3 py-1 rounded-2xl text-sm font-semibold">
              Recommend
            </button>
          </div>
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-4xl bg-gradient-to-br from-[#FF8E23] to-[#FFA546] ml-4">
            ⚡
          </div>
          <h2 className="text-2xl text-[#FF7600] font-bold mt-2 ml-4">
            Urgent - ASAP!
          </h2>
          <p className="mt-3 text-[#72757E] ml-4 font-semibold">
            Need it done immediately? Taskers typically respond within 30
            minutes
          </p>
          <div className="space-y-2 mt-5 ml-4">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-gray-700">
                <div className="bg-[#FFE3C3] text-[#FF7600] p-1 rounded-full">
                  <FaCheck className="text-sm text-[#FF7600] font-semibold" />
                </div>
                <span className="text-[#FF7600] font-semibold">{feature}</span>
              </div>
            ))}
          </div>
        </div>
        {/* 2nd card */}
        <div className="w-1/2 h-[360px] border-2 rounded-3xl  border-[#8560F1] p-3 bg-[#F8F7FE] shadow-xl">
          <div className="w-16 h-16 rounded-full mt-6 flex items-center justify-center text-white text-4xl bg-[#ECE6FD] ml-4">
            📅
          </div>
          <h2 className="text-2xl text-[#8560F1] font-bold mt-2 ml-4">
            Standard Timeline{" "}
          </h2>
          <p className="mt-3 text-[#72757E] ml-4 font-semibold">
            Plan ahead with scheduled dates and times
          </p>
          <div className="space-y-2 mt-5 ml-4">
            {features2.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-gray-700">
                <div className="bg-[#ECE6FD] text-[#8560F1] p-1 rounded-full">
                  <FaCheck className="text-sm text-[#8560F1] font-semibold" />
                </div>
                <span className="text-[#8560F1] font-semibold">{feature}</span>
              </div>
            ))}
          </div>
        </div>{" "}
      </div>
      <div className="mt-8 h-[70px] bg-[#FFF9F2] border border-[#FF7600] rounded-3xl p-6">
        <p className="text-[#72757E] text-sm font-medium">
          💡 <span className="font-bold text-[#72757E] text-normal">Pro Tip:</span> Urgent tasks typically receive 3x faster responses but
          have a 15% higher average price.
        </p>
      </div>
      <div className="mt-8">
        <Step1Fields />
      </div>
    </div>
  );
};

export default Step1;
