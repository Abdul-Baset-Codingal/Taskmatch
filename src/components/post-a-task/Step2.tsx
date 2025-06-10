import React from "react";

const Step2 = () => {
  return (
    <div className="p-8">
      <h2 className="text-4xl font-semibold text-[#8560F1] flex items-center gap-2">
        <span className="ml-3 mb-1">📍 Step 2: Location</span>
      </h2>
      <div className=" mt-8 h-[150px] w-full bg-[#F4F7FF] rounded-2xl border-l-4 border-[#8560F1] p-8">
        <p className="text-[#8560F1] text-xl font-bold">
          💡 Task Location Details
        </p>
        <p className="text-lg mt-5 text-[#72757E] font-medium">
          Tell us where your task will take place so we can match you with
          nearby taskers.
        </p>
      </div>
      <div className="grid grid-cols-4 gap-4 mt-6">
        {/* Card 1 - At my place */}
        <div className="group border border-purple-200 hover:border-[#8560F1] transition rounded-xl p-4 cursor-pointer flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 flex items-center justify-center bg-[#F2EEFD] rounded-full mb-2 text-2xl">
            🏠
          </div>
          <p className="text-lg text-[#72757E] font-semibold">At my place</p>
        </div>

        {/* Card 2 - At tasker's place */}
        <div className="group border border-purple-200 hover:border-[#8560F1] transition rounded-xl p-4 cursor-pointer flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 flex items-center justify-center bg-[#F2EEFD] rounded-full mb-2 text-2xl">
            🏢
          </div>
          <p className="text-lg text-[#72757E] font-semibold">
            At tasker&#39;s place
          </p>
        </div>

        {/* Card 3 - Remote/Online */}
        <div className="group border border-purple-200 hover:border-[#8560F1] transition rounded-xl p-4 cursor-pointer flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 flex items-center justify-center bg-[#F2EEFD] rounded-full mb-2 text-2xl">
            🌐
          </div>
          <p className="text-lg text-[#72757E] font-semibold">Remote/Online</p>
        </div>

        {/* Card 4 - Other location */}
        <div className="group border border-purple-200 hover:border-[#8560F1] transition rounded-xl p-4 cursor-pointer flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 flex items-center justify-center bg-[#F2EEFD] rounded-full mb-2 text-2xl">
            📍
          </div>
          <p className="text-lg text-[#72757E] font-semibold">Other location</p>
        </div>
      </div>
      <div className="mt-12">
        <div className="grid grid-cols-2 gap-6">
          {/* Street Address */}
          <div>
            <p className="font-semibold text-[#72757E] text-lg mb-4">
              Street Address{" "}
            </p>
            <input
              type="text"
              placeholder="Street Address"
              className="w-full border border-[#ccc] shadow-lg rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#8560F1] hover:border-[#8560F1] transition duration-300"
            />
          </div>

          {/* City */}
          <div>
            <p className="font-semibold text-[#72757E] text-lg mb-4">City</p>
            <input
              type="text"
              placeholder="City"
              className="w-full border border-[#ccc] shadow-lg rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#8560F1] hover:border-[#8560F1] transition duration-300"
            />
          </div>

          {/* Province/State */}
          <div className=" mt-12">
            <p className="font-semibold text-[#72757E] text-lg mb-4">
              Province/State
            </p>

            <input
              type="text"
              placeholder="Province/State"
              className="w-full border border-[#ccc] shadow-lg rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#8560F1] hover:border-[#8560F1] transition duration-300 "
            />
          </div>

          {/* Postal/ZIP Code */}
          <div className=" mt-12">
            <p className="font-semibold text-[#72757E] text-lg mb-4">
              Postal/ZIP Code
            </p>
            <input
              type="text"
              placeholder="Postal/ZIP Code"
              className="w-full border border-[#ccc] shadow-lg rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#8560F1] hover:border-[#8560F1] transition duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2;
