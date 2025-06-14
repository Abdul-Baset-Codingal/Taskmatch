"use client";

import React, { useState } from "react";
import DashboardOverview from "./DashboardOverview";
import UserManagementTable from "./UserManagementTable";
import TaskManagementSection from "./TaskManagementSection";
import TransactionSection from "./TransactionSection";
import OperationsSection from "./OperationsSection";
import ReportsSection from "./ReportsSection";

const tabs = [
  { id: "dashboard", label: "Dashboard Overview" },
  { id: "users", label: "User Management" },
  { id: "tasks", label: "Task Management" },
  { id: "transactions", label: "Transactions" },
  { id: "operations", label: "Operations" },
  { id: "reports", label: "Reports" },
];

const TabsSection = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  // Switch case function to return content for each tab
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview/>;
      case "users":
        return <UserManagementTable/>;
      case "tasks":
        return <TaskManagementSection/>;
      case "transactions":
        return <TransactionSection/>;
      case "operations":
        return <OperationsSection/>;
      case "reports":
        return <ReportsSection/>;
      default:
        return null;
    }
  };

  return (
    <section className="max-w-7xl mx-auto lg:px-8 px-2 py-12">
      {/* Tabs Container */}
      <div className="flex flex-wrap justify-center gap-6 mb-10">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-8 py-3 rounded-full font-semibold text-lg transition-all
                ${
                  isActive
                    ? "bg-gradient-to-r from-[#222543] to-[#0F1123] text-white shadow-[0_8px_15px_rgba(34,37,67,0.4)] scale-105"
                    : "bg-[#1a1d35] text-gray-400 hover:bg-[#2a2f52] hover:text-white shadow-sm"
                }
                focus:outline-none focus:ring-4 focus:ring-indigo-500
              `}
              aria-selected={isActive}
              role="tab"
              type="button"
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div
        role="tabpanel"
        className="text-gray-800 text-xl min-h-[140px] p-8 bg-white rounded-xl shadow-lg"
      >
        {renderContent()}
      </div>
    </section>
  );
};

export default TabsSection;
