// GrowthProjectionsTab.jsx
"use client";

import React from "react";

const revenueData = [
  { quarter: "Q1", value: "$4.1M" },
  { quarter: "Q2", value: "$4.5M" },
  { quarter: "Q3", value: "$4.8M" },
  { quarter: "Q4", value: "$5.1M" },
];

const userBaseData = [
  { label: "Taskers", value: 6100 },
  { label: "Individual Clients", value: 8390 },
  { label: "Business Accounts", value: 760 },
];

const marketExpansion = [
  { quarter: "Q1 2024", cities: ["Brampton"] },
  { quarter: "Q2 2024", cities: ["London", "Kitchener"] },
  { quarter: "Q3 2024", cities: ["Windsor"] },
  { quarter: "Q4 2024", cities: ["Vaughan"] },
];

const GrowthProjectionsTab = () => {
  return (
    <div className="space-y-10">
      {/* Revenue Forecast */}
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-2xl font-semibold mb-2 text-blue-800">
          📈 Revenue Forecast
        </h3>
        <p className="text-gray-600 mb-4 text-sm">
          Expected: $18.5M over next 12 months (43% growth)
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {revenueData.map((item, index) => (
            <div
              key={index}
              className="bg-blue-50 p-4 rounded-lg text-center shadow hover:shadow-md transition"
            >
              <h4 className="text-lg font-semibold text-blue-700">
                {item.quarter}
              </h4>
              <p className="text-xl font-bold text-blue-900">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* User Base Growth */}
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-2xl font-semibold mb-2 text-green-800">
          👥 User Base Growth
        </h3>
        <p className="text-gray-600 mb-4 text-sm">
          Projected active users: 15,250 (78% growth)
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {userBaseData.map((user, index) => (
            <div
              key={index}
              className="bg-green-50 p-6 rounded-lg text-center shadow hover:shadow-md transition"
            >
              <p className="text-lg font-medium text-green-700">{user.label}</p>
              <p className="text-2xl font-bold text-green-900">
                {user.value.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Ontario Market Expansion */}
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-2xl font-semibold mb-2 text-purple-800">
          🗺️ Ontario Market Expansion
        </h3>
        <p className="text-gray-600 mb-4 text-sm">
          Current: 5 → Target: 9 Markets (80% increase)
        </p>
        <div className="space-y-4">
          {marketExpansion.map((entry, index) => (
            <div
              key={index}
              className="bg-purple-50 px-6 py-4 rounded-lg border border-purple-100 shadow-sm"
            >
              <h4 className="font-semibold text-purple-700">{entry.quarter}</h4>
              <p className="text-sm text-purple-900">
                {entry.cities.join(", ")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GrowthProjectionsTab;
