"use client";
import React, { useState } from "react";
import ExactTime from "./ExactTime";
import AllTimings from "./AllTimings";

const Step1Fields = () => {
  const [activeTab, setActiveTab] = useState("flexible");

  const tabs = [
    { label: "⏱️ Flexible Time", value: "flexible" },
    { label: "🕒 Exact Time", value: "exact" },
    { label: "📊 All Timings", value: "all" },
  ];

  return (
    <div className="">
      <p className="font-semibold text-[#72757E] text-lg mb-4">
        When do you need it done?
      </p>
      <input
        type="date"
        className="w-[500px] border border-[#ccc] shadow-lg rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#8560F1] hover:border-[#8560F1] transition duration-300"
      />
      {/* Tabs */}
      <div className="flex w-full  rounded-2xl overflow-hidden mb-6 shadow mt-16">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex-1 py-5 cursor-pointer font-bold transition duration-300 ${
              activeTab === tab.value
                ? "bg-[#8560F1] text-white"
                : "bg-[#F3EDFF] text-[#72757E] hover:bg-[#e1d5fb] "
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conditional Content */}
      {activeTab === "exact" && (
        <div>
          <ExactTime />
        </div>
      )}
      {activeTab === "flexible" && (
        <div className="text-[#72757E] space-y-2">
          <p className="font-semibold text-[#72757E] text-lg mb-4">
            Preferred time window{" "}
          </p>{" "}
          <select className="w-full font-semibold border border-[#ccc] rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#8560F1] hover:border-[#8560F1] transition duration-300">
            <option className="font-semibold" value="morning">
              Morning (8am - 12pm)
            </option>
            <option className="font-semibold" value="afternoon">
              Afternoon (12pm - 5pm)
            </option>
            <option className="font-semibold" value="evening">
              Evening (5pm - 9pm)
            </option>
            <option className="font-semibold" value="any">
              Any time
            </option>
          </select>
          <p className="font-semibold text-[#72757E] italic text-sm  text-italic">
            This gives taskers flexibility to fit your task in their schedule
          </p>
        </div>
      )}

      {activeTab === "all" && (
        <div>
            <AllTimings />
        </div>
      )}
    </div>
  );
};

export default Step1Fields;
