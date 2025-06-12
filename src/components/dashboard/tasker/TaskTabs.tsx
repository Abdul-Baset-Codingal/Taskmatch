"use client";
import React, { useState } from "react";
import Image from "next/image";
import client1 from "../../../../public/Images/clientImage2.jpg";
import { FiMessageCircle, FiPhoneCall, FiMapPin } from "react-icons/fi";
import ActiveTasks from "./ActiveTasks";
import AvailableTasks from "./AvailableTasks";
import CompletedTasks from "./CompletedTasks";
import PendingBids from "./PendingBids";

const tabs = [
  "Track Task status",
  "Active Tasks",
  "Available Tasks",
  "Completed",
  "Pending Bids",
];

const trackTaskStatusContent = (
  <div className="max-w-6xl mx-auto bg-gradient-to-r from-purple-300 via-indigo-300 to-blue-300 bg-opacity-50 backdrop-blur-md rounded-xl p-8 text-gray-900 shadow-xl">
    {/* Profile Header */}
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden relative flex-shrink-0 shadow-lg ring-4 ring-white">
        <Image src={client1} alt="John D." layout="fill" objectFit="cover" />
      </div>
      <div className="text-center sm:text-left">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-1">
          John D.
        </h2>
        <p className="text-yellow-500 text-lg font-semibold mb-1">
          ★★★★★ <span className="text-sm text-gray-700">(48 reviews)</span>
        </p>
        <p className="text-indigo-700 text-md sm:text-lg font-medium tracking-wide">
          Plumbing, Home Repairs, Electrical
        </p>

        <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-5">
          <button className="flex text-white items-center gap-2 bg-purple-500 hover:bg-purple-600 transition rounded-lg px-5 py-2 text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400">
            <FiMessageCircle className="text-xl" /> Message Tasker
          </button>
          <button className="flex text-white items-center gap-2 bg-yellow-400 hover:bg-yellow-500 transition rounded-lg px-5 py-2 text-sm font-semibold  shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-300">
            <FiPhoneCall className="text-xl" /> Call Tasker
          </button>
          <button className="flex text-white items-center gap-2 bg-blue-500 hover:bg-blue-600 transition rounded-lg px-5 py-2 text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400">
            <FiMapPin className="text-xl" /> Map 📍📌
          </button>
          <div className="flex items-center justify-center bg-gray-300 text-gray-800 rounded-lg px-5 py-2 text-xl shadow-inner cursor-default select-none">
            🚗
          </div>
        </div>
      </div>
    </div>

    {/* Status Section */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      {[
        { title: "Current Status", value: "En Route to Location" },
        {
          title: "Estimated Time of Arrival",
          value: "15 minutes (ETA 3:45 PM)",
        },
        { title: "Contact Info", value: "+1 (555) 123-4567" },
      ].map(({ title, value }) => (
        <div
          key={title}
          className="bg-white/50 backdrop-blur-sm rounded-lg p-6 text-center shadow-md border border-white/50 hover:bg-white/70 transition cursor-default"
        >
          <p className="text-lg font-semibold mb-2 text-gray-900">{title}</p>
          <p className="text-xl font-bold text-indigo-700">{value}</p>
        </div>
      ))}
    </div>

    {/* Location */}
    <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 mb-8 shadow-md border border-white/50">
      <p className="font-semibold text-lg mb-2 text-gray-900">
        Current Location
      </p>
      <p className="text-indigo-700 text-lg font-semibold">
        Heading north on King St
      </p>
    </div>

    {/* Status Updates */}
    <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 mb-8 shadow-md border border-white/50">
      <p className="font-semibold text-lg mb-4 text-gray-900">Status Updates</p>
      <ul className="list-disc list-inside space-y-2 text-indigo-700 text-sm sm:text-base font-medium leading-relaxed">
        <li>3:30 PM - Tasker is en route, 15 minutes away</li>
        <li>3:25 PM - Tasker has all required equipment and materials</li>
        <li>3:15 PM - Tasker has accepted and confirmed your task</li>
        <li>3:00 PM - Task request posted</li>
      </ul>
    </div>

    {/* Actions */}
    <div className="flex flex-col sm:flex-row gap-5 justify-center">
      <button className="bg-red-500 hover:bg-red-600 transition text-white py-3 px-7 rounded-lg font-semibold shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400">
        Contact Support
      </button>
      <button className="bg-gray-200 hover:bg-gray-300 transition text-gray-900 py-3 px-7 rounded-lg font-semibold shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400">
        Cancel Task
      </button>
      <button className="bg-green-500 hover:bg-green-600 transition text-white py-3 px-7 rounded-lg font-semibold shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400">
        Confirm Task Completion
      </button>
    </div>
  </div>
);

export default function TaskTabsWithContent() {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  const renderContent = () => {
    switch (selectedTab) {
      case "Track Task status":
        return trackTaskStatusContent;
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
