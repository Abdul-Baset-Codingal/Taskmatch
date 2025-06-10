import React from "react";

const AllTimings = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold text-[#8560F1]">
        📊 Available Tasker Times
      </h2>
      <div className="flex items-start gap-10">
        <div className="w-[120px] bg-[#FFFCF1] border-t-2 rounded-2xl border-yellow-500 py-5 px-4 mt-4">
          <p className="text-yellow-500 font-bold text-sm mb-3 ml-3">Morning</p>

          <div className="space-y-3">
            {/* Time 1 - High */}
            <span className="relative px-4 py-3 bg-white text-[#72757E] text-xs font-semibold rounded-full shadow-sm hover:bg-[#e1d5fb] cursor-pointer transition inline-block">
              6:00 am
              <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
            </span>

            {/* Time 2 - Medium */}
            <span className="relative px-4 py-3 bg-white text-[#72757E] text-xs font-semibold rounded-full shadow-sm hover:bg-[#e1d5fb] cursor-pointer transition inline-block">
              6:30 am
              <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
            </span>

            {/* Time 3 - Popular + High */}
            <span className="relative px-4 py-2 bg-white text-[#72757E] text-xs font-semibold rounded-full shadow-sm border-2 border-yellow-400 hover:bg-[#e1d5fb] cursor-pointer transition inline-block">
              {/* Availability Dot - Top Right */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>

              {/* Popular Label - Top Left */}
              <span className="absolute top-6 left-[15px] text-[10px] text-white px-2 font-medium bg-yellow-400 rounded-2xl">
                Popular
              </span>

              {/* Actual Time */}
              <span className="block text-center">7:00 am</span>
            </span>

            {/* Time 4 - Low */}
            <span className="relative px-4 py-3 bg-white text-[#72757E] text-xs font-semibold rounded-full shadow-sm hover:bg-[#e1d5fb] cursor-pointer transition inline-block">
              7:30 am
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </span>

            {/* Time 5 - Medium */}
            <span className="relative px-4 py-3 bg-white text-[#72757E] text-xs font-semibold rounded-full shadow-sm hover:bg-[#e1d5fb] cursor-pointer transition inline-block">
              8:00 am
              <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
            </span>

            {/* Time 6 - High */}
            <span className="relative px-4 py-3 bg-white text-[#72757E] text-xs font-semibold rounded-full shadow-sm hover:bg-[#e1d5fb] cursor-pointer transition inline-block">
              8:30 am
              <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
            </span>
          </div>
        </div>
        {/* 2nd */}
        <div className="w-[120px] bg-[#EFF7FA] border-t-2 rounded-2xl border-blue-500 py-5 px-4 mt-4">
          <p className="text-blue-500 font-bold text-sm mb-3 ml-3">Afternoon</p>

          <div className="space-y-3">
            {/* Time 1 - High */}
            <span className="relative px-4 py-3 bg-white text-[#72757E] text-xs font-semibold rounded-full shadow-sm hover:bg-[#e1d5fb] cursor-pointer transition inline-block">
              12:00 pm
              <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
            </span>

            {/* Time 2 - Medium */}
            <span className="relative px-4 py-3 bg-white text-[#72757E] text-xs font-semibold rounded-full shadow-sm hover:bg-[#e1d5fb] cursor-pointer transition inline-block">
              1:30 pm
              <span className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full"></span>
            </span>

            {/* Time 3 - Popular + High */}
            <span className="relative px-4 py-3 bg-white text-[#72757E] text-xs font-semibold rounded-full shadow-sm hover:bg-[#e1d5fb] cursor-pointer transition inline-block">
              2:00 pm
              <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
            </span>

            {/* Time 4 - Low */}
            <span className="relative px-4 py-3 bg-white text-[#72757E] text-xs font-semibold rounded-full shadow-sm hover:bg-[#e1d5fb] cursor-pointer transition inline-block">
              3:30 pm
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </span>

            {/* Time 5 - Medium */}
            <span className="relative px-4 py-3 bg-white text-[#72757E] text-xs font-semibold rounded-full shadow-sm hover:bg-[#e1d5fb] cursor-pointer transition inline-block">
              4:00 pm
              <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
            </span>

            {/* Time 6 - High */}
            <span className="relative px-4 py-2 bg-white text-[#72757E] text-xs font-semibold rounded-full shadow-sm border-2 border-blue-400 hover:bg-[#e1d5fb] cursor-pointer transition inline-block">
              {/* Availability Dot - Top Right */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>

              {/* Popular Label - Top Left */}
              <span className="absolute top-6 left-[15px] text-[10px] text-white px-2 font-medium bg-blue-400 rounded-2xl">
                Popular
              </span>

              {/* Actual Time */}
              <span className="block text-center">5:00 pm</span>
            </span>
          </div>
        </div>
        {/* 3rd */}
        <div className="w-[120px] bg-[#F7F2F7] border-t-2 rounded-2xl border-[#8560F1] py-5 px-4 mt-4">
          <p className="text-[#8560F1] font-bold text-sm mb-3 ml-3">Evening</p>

          <div className="space-y-3">
            {/* Time 1 - High */}
            <span className="relative px-4 py-2 bg-white text-[#72757E] text-xs font-semibold rounded-full shadow-sm border-2 border-[#8560F1] hover:bg-[#e1d5fb] cursor-pointer transition inline-block">
              {/* Availability Dot - Top Right */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>

              {/* Popular Label - Top Left */}
              <span className="absolute top-6 left-[15px] text-[10px] text-white px-2 font-medium bg-[#8560F1] rounded-2xl">
                Popular
              </span>

              {/* Actual Time */}
              <span className="block text-center">6:00 pm</span>
            </span>

            {/* Time 2 - Medium */}
            <span className="relative px-4 py-3 bg-white text-[#72757E] text-xs font-semibold rounded-full shadow-sm hover:bg-[#e1d5fb] cursor-pointer transition inline-block">
              7:30 pm
              <span className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full"></span>
            </span>

            {/* Time 3 - Popular + High */}
            <span className="relative px-4 py-3 bg-white text-[#72757E] text-xs font-semibold rounded-full shadow-sm hover:bg-[#e1d5fb] cursor-pointer transition inline-block">
              8:00 pm
              <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
            </span>

            {/* Time 4 - Low */}
            <span className="relative px-4 py-3 bg-white text-[#72757E] text-xs font-semibold rounded-full shadow-sm hover:bg-[#e1d5fb] cursor-pointer transition inline-block">
              8:30 pm
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllTimings;
