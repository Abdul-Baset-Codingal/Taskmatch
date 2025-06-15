"use client";

import React, { useState } from "react";
import StrategicTabContent from "./StrategicInitiatives";
import FinancialPerformanceTab from "./FinancialPerformanceTab";
import MarketOverviewTab from "./MarketOverviewTab";
import OperationsOverviewTab from "./OperationsOverviewTab";
import GrowthOverviewTab from "./GrowthOverviewTab";
import PlatformOverviewTab from "./PlatformOverviewTab";
import RiskOverviewTab from "./RiskOverviewTab";

const tabs = [
  "Strategic",
  "Financial",
  "Market",
  "Operations",
  "Growth",
  "Platform",
  "Risk",
];

const TabContent = ({ active }: { active: string }) => {
  switch (active) {
    case "Strategic":
      return (
      <StrategicTabContent/>
      );
    case "Financial":
      return (
       <FinancialPerformanceTab/>
      );
    case "Market":
      return (
        <MarketOverviewTab/>
      );
    case "Operations":
      return (
        <OperationsOverviewTab/>
      );
    case "Growth":
      return (
        <GrowthOverviewTab/>
      );
    case "Platform":
      return (
       <PlatformOverviewTab/>
      );
    case "Risk":
      return (
        <RiskOverviewTab/>
      );
    default:
      return null;
  }
};

const OwnerTabs = () => {
  const [activeTab, setActiveTab] = useState("Strategic");

  return (
    <div className="max-w-7xl mx-auto mt-20 px-4">
      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-4 border-b border-white/10 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 text-sm md:text-base rounded-full font-medium transition-all duration-200
            ${
              activeTab === tab
                ? "bg-gradient-to-r from-[#1e3a8a] to-[#312e81] text-white shadow-md"
                : "bg-[#1f2937] text-white/70 border border-white/10 hover:bg-[#374151]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-10 bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {activeTab} Overview
        </h2>
        <div className="text-gray-800">
          <TabContent active={activeTab} />
        </div>
      </div>
    </div>
  );
};

export default OwnerTabs;
