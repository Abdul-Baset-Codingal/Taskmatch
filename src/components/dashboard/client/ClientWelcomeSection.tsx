/* eslint-disable react/no-unescaped-entities */
"use client";
import React from "react";
import { FiSettings, FiPlusCircle } from "react-icons/fi";

const ClientWelcomeSection = () => {
  return (
    <section className="max-w-full mx-auto  bg-gradient-to-br from-blue-200 via-white to-purple-200 rounded-2xl p-10  text-gray-900">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        {/* Text Content */}
        <div>
          <h1 className="text-4xl font-extrabold text-blue-900 mb-2">
            Client Dashboard
          </h1>
          <p className="text-gray-800 text-lg">
            Welcome back! Here's an overview of your tasks
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl shadow-md transition-all">
            <FiPlusCircle size={18} />
            New Task
          </button>
          <button className="flex items-center gap-2 bg-white border border-indigo-500 text-indigo-700 hover:bg-indigo-50 px-5 py-2.5 rounded-xl shadow-sm transition-all">
            <FiSettings size={18} />
            Settings
          </button>
        </div>
      </div>
    </section>
  );
};

export default ClientWelcomeSection;
