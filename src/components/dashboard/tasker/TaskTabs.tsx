"use client";
import React, { useState } from "react";
import ActiveTasks from "./ActiveTasks";
import AvailableTasks from "./AvailableTasks";
import CompletedTasks from "./CompletedTasks";
import PendingBids from "./PendingBids";

const tabs = [
  "Active Tasks",
  "Available Tasks",
  "Completed",
  "Pending Bids",
];



export default function TaskTabsWithContent() {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  const renderContent = () => {
    switch (selectedTab) {
  
      case "Active Tasks":
        return <ActiveTasks />;
      case "Available Tasks":
        return <AvailableTasks />;
      case "Completed":
        return <CompletedTasks />;
      case "Pending Bids":
        return <PendingBids />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-300 via-indigo-400 to-blue-400 p-6">
      {/* Tabs */}
      <div className="flex gap-3 flex-wrap justify-center mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-5 py-2 md:px-6 md:py-3 rounded-3xl cursor-pointer ${
              selectedTab === tab
                ? "bg-white text-indigo-800 font-semibold shadow-lg"
                : "bg-white/30 text-white"
            } hover:bg-white/80 hover:text-indigo-800 transition duration-300 text-sm md:text-base`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
}
