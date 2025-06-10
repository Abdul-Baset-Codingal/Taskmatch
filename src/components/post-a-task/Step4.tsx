"use client";
import React, { useState } from "react";

const Step4 = () => {
  const [selectedOption, setSelectedOption] = useState("");

  return (
    <div className="p-8">
      <h2 className="text-4xl font-semibold text-[#8560F1] flex items-center gap-2">
        <span className="ml-3 mb-1">💰 Step 4: Budget</span>
      </h2>
      <div className=" mt-8 h-[180px] w-full bg-[#F4F7FF] rounded-2xl border-l-4 border-[#8560F1] p-8">
        <p className="text-[#8560F1] text-xl font-bold">
          💡 Setting the right budget:
        </p>
        <p className="text-lg mt-5 text-[#72757E] font-medium">
          You can either set a total budget for the entire task or an hourly
          rate. Setting a fair budget will attract more qualified taskers.
        </p>
      </div>
      <div className="mt-8">
        <p className="font-semibold text-[#72757E] text-lg mb-4">
          How would you like to pay?
        </p>

        <div className="flex gap-6">
          {/* Hourly Rate Option */}
          <label
            className={`flex items-center gap-4 px-6 py-5 rounded-2xl  transition duration-300 cursor-pointer ${
              selectedOption === "hourly"
                ? "border-[#8560F1] text-[#8560F1]"
                : "border-[#ccc] text-[#72757E]"
            }`}
          >
            <input
              type="radio"
              name="payment"
              value="hourly"
              checked={selectedOption === "hourly"}
              onChange={() => setSelectedOption("hourly")}
              className="w-5 h-5 accent-[#8560F1]" // Bigger round radio
            />
            <span className="text-lg font-semibold">Hourly rate</span>
          </label>

          {/* Total Amount Option */}
          <label
            className={`flex items-center gap-4 px-6 py-5 rounded-2xl  transition duration-300 cursor-pointer ${
              selectedOption === "total"
                ? "border-[#8560F1] text-[#8560F1]"
                : "border-[#ccc] text-[#72757E]"
            }`}
          >
            <input
              type="radio"
              name="payment"
              value="total"
              checked={selectedOption === "total"}
              onChange={() => setSelectedOption("total")}
              className="w-5 h-5 accent-[#8560F1]" // Bigger round radio
            />
            <span className="text-lg font-semibold">Total amount</span>
          </label>
        </div>
      </div>
      <div className="mt-12">
        <p className="font-semibold text-[#72757E] text-lg mb-4">
          What is your total budget?
        </p>
        <input
          type="text"
          placeholder="e.g.. $200"
          className=" border border-[#ccc] shadow-lg rounded-2xl px-6 py-4 w-1/2 focus:outline-none focus:ring-2 focus:ring-[#8560F1] hover:border-[#8560F1] transition duration-300"
        />
      </div>
    </div>
  );
};

export default Step4;
