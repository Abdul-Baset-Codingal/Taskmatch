import Navbar from "@/shared/Navbar";
import React from "react";
import Accelerated from "./Accelerated";
import UrgentTask from "@/components/posted-task/UrgentTask";
import EmergencyTaskers from "@/components/posted-task/EmergencyTaskers";

const page = () => {
  return (
    <div className="bg-[#FFF7F0]">
      <div>
        <Navbar />
      </div>
      <div className="flex justify-center mt-24">
        <div className="w-4xl py-16 px-8 shadow-2xl border-t-[6px] border-amber-500 rounded-3xl bg-[#FFF6EB]">
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-[70px]">⚡</h2>
            <button className="px-4 py-2 mt-4 bg-gradient-to-r from-[#FF7000] to-[#FF9500] text-sm text-white font-bold rounded-3xl">
              HIGH PRIORITY REQUEST
            </button>
            <h2 className="mt-7 text-4xl text-[#FF7000] font-bold">

              
              Your URGENT Task Has Been Posted!
            </h2>
            <p className="text-lg text-[#72757E] font-medium mt-3">
              Taskers in your area will be notified immediately about your
              high-priority task
            </p>
            <div className="mt-14 flex items-center gap-1">
              <p className="text-2xl">🔥</p>
              <button className="px-6 py-3 rounded-3xl text-xl font-bold text-[#FF7000] bg-white">
                Expected response: 10-15 minutes
              </button>
              <p className="text-2xl">🔥</p>
            </div>
            {/* priority card */}
            <div className="w-full bg-[#FEE7D4] p-4 flex items-center border-l-4 border-[#FF7000] rounded-2xl mt-10">
              <div className="w-1/6">
                <div className="bg-[#FF7000] h-10 w-10 rounded-full flex items-center justify-center text-xl">
                  📱
                </div>
              </div>
              <div className="w-5/6 flex flex-col items-center ">
                <p className="text-[#FF7000] font-bold">
                  Priority Notifications Enabled{" "}
                </p>
                <p className="text-[#72757E]">
                  Taskers within your area will receive immediate push
                  notifications about your urgent request
                </p>
              </div>
            </div>
            <button className="px-5 py-3 mt-20 bg-gradient-to-r from-[#FF7000] to-[#FF9500] text-sm text-white font-bold rounded-3xl">
              URGENT task live - Task ID: #T47291
            </button>
            <div className="mt-10 flex items-center gap-4">
              <button className="text-white text-lg bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] px-6 py-4 font-semibold rounded-4xl  hover:shadow-lg hover:shadow-[#8560F1] hover:-translate-y-1 transform transition duration-300 cursor-pointer">
                Track Task Status
              </button>
              <button className=" text-lg bg-[white] px-6 py-4 border border-[#FF7000] font-semibold rounded-4xl text-[#FF7000]  hover:shadow-lg hover:shadow-[#FF7000] hover:-translate-y-1 transform transition duration-300 cursor-pointer">
                Post Another Task
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-10">
        <div className="flex flex-col items-center">
          <button className="px-4 py-2 mt-4 bg-gradient-to-r from-[#FF7000] to-[#FF9500] text-sm text-white font-bold rounded-3xl relative top-10">
            ⚡ URGENT REQUEST{" "}
          </button>
          {/* 2nd form */}
          <div className="w-4xl py-16 px-8 shadow-2xl border-t-[6px] border-amber-500 rounded-3xl bg-[#FFF6EB]">
            <h2 className="text-[#FF7000] text-xl font-bold">
              URGENT Task Summary
            </h2>
            <div className="w-full bg-[#FEE7D4] p-4 flex items-center border-l-4 border-[#FF7000] rounded-2xl mt-10">
              <div className="w-1/6">
                <div className="bg-[#FF7000] h-10 w-10 rounded-full flex items-center justify-center text-xl">
                  ⚡
                </div>
              </div>
              <div className="w-5/6 flex flex-col items-center ">
                <p className="text-[#FF7000] font-bold">
                  Urgent priority status activated. Your task has been flagged
                  for immediate attention by taskers.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-10">
              <div>
                <h2 className="text-3xl font-bold">Help Moving Furniture</h2>
                <button className="px-4 py-2 mt-8 bg-gradient-to-r from-[#FF7000] to-[#FF9500] text-sm text-white font-bold rounded-3xl">
                  Moving{" "}
                </button>
              </div>
              <div className="p-5 bg-[#FEE7D4] rounded-[60px]">
                <h2 className="text-4xl font-bold text-[#FF7000]">$200</h2>
              </div>
            </div>
            <div className="flex items-center justify-between mt-10 gap-5">
              <div className="w-1/2 bg-[#FEE7D4] px-8 py-4 rounded-xl font-medium  text-[#72757E]">
                <h2>📍 Location: Toronto, ON M5V 2K7</h2>
              </div>
              <div className="w-1/2 bg-[#FEE7D4] px-8 py-4 rounded-xl font-medium  text-[#72757E]">
                <h2>⚡ Timeline: ASAP - As soon as possible</h2>
              </div>
            </div>
            <div className="flex items-center justify-between mt-6 gap-5">
              <div className="w-1/2 bg-[#FEE7D4] px-8 py-4 rounded-xl font-medium  text-[#72757E]">
                <h2>⏰ Response: Taskers notified immediately</h2>
              </div>
              <div className="w-1/2 bg-[#FEE7D4] px-8 py-4 rounded-xl font-medium  text-[#72757E]">
                <h2>⚙️ Required: Truck, Moving Equipment</h2>
              </div>
            </div>
            <div className="mt-10">
              <h2 className="font-bold  text-[#72757E] ">Task Description</h2>
              <p className="text-[#72757E] mt-2">
                Need help moving a sofa, bed, and dining table from my apartment
                to a new home about 5km away. I&#39;ll need someone with a truck
                who can help load, transport, and unload the furniture. The sofa
                is quite large (3-seater) and the dining table is solid wood, so
                will need someone strong.
              </p>
            </div>
            <div className="mt-5 flex justify-end">
              <button className=" text-sm bg-[white] px-4 py-2 border border-[#FF7000] font-semibold rounded-4xl text-[#FF7000]  hover:shadow-lg hover:shadow-[#FF7000] hover:-translate-y-1 transform transition duration-300 cursor-pointer">
                Edit Task
              </button>
            </div>
          </div>
          <div className="mt-16">
            <Accelerated />
          </div>
          <div className="mt-16">
            <UrgentTask />
          </div>
          <div className="mt-16">
            <EmergencyTaskers /> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
