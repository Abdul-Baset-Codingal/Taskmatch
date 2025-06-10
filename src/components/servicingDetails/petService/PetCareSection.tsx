import React from "react";

const PetCareSection = () => {
  return (
    <div>
      <div className="flex justify-center">
        <div className="flex items-center text-6xl opacity-50">
          🐕 🐱 🐦 🐰 🐢
        </div>
      </div>
      <div>
        <div className="w-full flex justify-center mt-10">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-[#7F5BF0] to-[#DCACFD] text-transparent bg-clip-text custom-font">
            Pet Care Services
          </h2>
        </div>
        <div className="flex justify-center mt-2">
          <div className="flex rounded-md justify-center h-[4px] w-[70px] bg-gradient-to-r from-[#8560F1] to-[#E7B6FE]"></div>
        </div>
        <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-4xl mt-5 p-6 md:p-8 text-center space-y-4">
          <p className="text-lg font-medium text-gray-700">
            Professional pet care services for all your{" "}
            <span className="text-pink-500 font-bold">furry</span>,{" "}
            <span className="text-emerald-500 font-bold">feathery</span>, or{" "}
            <span className="text-yellow-500 font-bold">scaly</span> family
            members.
          </p>

          <p className="text-sm text-gray-500">
            Trusted by over{" "}
            <span className="font-semibold text-indigo-600">10,000</span> pet
            parents nationwide.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PetCareSection;
