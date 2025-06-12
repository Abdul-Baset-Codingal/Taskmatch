import React from "react";

const AllTimings = () => {
  return (
    <div className="px-4 md:px-10 lg:px-16 py-6">
      <h2 className="text-lg md:text-xl font-semibold text-[#8560F1] mb-6">
        📊 Available Tasker Times
      </h2>

      <div className="flex flex-col md:flex-row items-start gap-6 md:gap-10">
        {/* Morning */}
        <div className="w-full md:w-[160px] bg-[#FFFCF1] border-t-2 rounded-2xl border-yellow-500 py-5 px-4">
          <p className="text-yellow-500 font-bold text-sm mb-3 ml-3">Morning</p>

          <div className="space-y-3">
            <TimeTag label="6:00 am" color="green-500" />
            <TimeTag label="6:30 am" color="yellow-400" />
            <PopularTimeTag
              label="7:00 am"
              dotColor="green-500"
              borderColor="border-yellow-400"
              bgColor="bg-yellow-400"
            />
            <TimeTag label="7:30 am" color="red-500" />
            <TimeTag label="8:00 am" color="yellow-400" />
            <TimeTag label="8:30 am" color="green-500" />
          </div>
        </div>

        {/* Afternoon */}
        <div className="w-full md:w-[160px] bg-[#EFF7FA] border-t-2 rounded-2xl border-blue-500 py-5 px-4">
          <p className="text-blue-500 font-bold text-sm mb-3 ml-3">Afternoon</p>

          <div className="space-y-3">
            <TimeTag label="12:00 pm" color="green-500" />
            <TimeTag label="1:30 pm" color="green-400" />
            <TimeTag label="2:00 pm" color="yellow-400" />
            <TimeTag label="3:30 pm" color="red-500" />
            <TimeTag label="4:00 pm" color="yellow-400" />
            <PopularTimeTag
              label="5:00 pm"
              dotColor="green-500"
              borderColor="border-blue-400"
              bgColor="bg-blue-400"
            />
          </div>
        </div>

        {/* Evening */}
        <div className="w-full md:w-[160px] bg-[#F7F2F7] border-t-2 rounded-2xl border-[#8560F1] py-5 px-4">
          <p className="text-[#8560F1] font-bold text-sm mb-3 ml-3">Evening</p>

          <div className="space-y-3">
            <PopularTimeTag
              label="6:00 pm"
              dotColor="green-500"
              borderColor="border-[#8560F1]"
              bgColor="bg-[#8560F1]"
            />
            <TimeTag label="7:30 pm" color="green-400" />
            <TimeTag label="8:00 pm" color="yellow-400" />
            <TimeTag label="8:30 pm" color="red-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

type TimeTagProps = {
  label: string;
  color: string;
};

const TimeTag = ({ label, color }: TimeTagProps) => (
  <span className="relative px-4 py-3 bg-white text-[#72757E] text-xs font-semibold rounded-full shadow-sm hover:bg-[#e1d5fb] cursor-pointer transition inline-block">
    {label}
    <span
      className={`absolute top-1 right-1 w-2 h-2 bg-${color} rounded-full`}
    ></span>
  </span>
);

type PopularTimeTagProps = {
  label: string;
  dotColor: string;
  borderColor: string;
  bgColor: string;
};

const PopularTimeTag = ({ label, dotColor, borderColor, bgColor }: PopularTimeTagProps) => (
  <span
    className={`relative px-4 py-2 bg-white text-[#72757E] text-xs font-semibold rounded-full shadow-sm ${borderColor} border-2 hover:bg-[#e1d5fb] cursor-pointer transition inline-block`}
  >
    <span
      className={`absolute top-1 right-1 w-2 h-2 ${dotColor} rounded-full`}
    ></span>
    <span
      className={`absolute top-6 left-[15px] text-[10px] text-white px-2 font-medium ${bgColor} rounded-2xl`}
    >
      Popular
    </span>
    <span className="block text-center">{label}</span>
  </span>
);

export default AllTimings;
