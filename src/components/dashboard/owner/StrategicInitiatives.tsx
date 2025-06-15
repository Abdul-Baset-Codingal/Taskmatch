// StrategicTabContent.jsx
"use client";

import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import CompetitiveIntelligenceTab from "./CompetitiveIntelligenceTab";
import GrowthProjectionsTab from "./GrowthProjectionsTab";

const COLORS = [
  "#1e293b",
  "#0f172a",
  "#334155",
  "#475569",
  "#64748b",
  "#94a3b8",
];

const revenueData = [
  { name: "Home Cleaning", value: 35 },
  { name: "Handyman", value: 25 },
  { name: "Moving Services", value: 15 },
  { name: "Electrical", value: 10 },
  { name: "Plumbing", value: 8 },
  { name: "Pet Services", value: 7 },
];

const userDemographics = [
  { name: "Taskers", value: 40 },
  { name: "Clients", value: 55 },
  { name: "Business Accounts", value: 5 },
];

const geoDistribution = [
  { city: "Toronto", value: 32 },
  { city: "Ottawa", value: 24 },
  { city: "Mississauga", value: 18 },
  { city: "Hamilton", value: 14 },
  { city: "Other Ontario Cities", value: 12 },
];

const initiatives = [
  {
    title: "Geographic Expansion",
    icon: "🗺️",
    percent: 65,
    description:
      "Expanding services to 4 new Ontario cities by Q3 2024 including London, Kitchener, Windsor and Vaughan.",
    lead: "Sarah Johnson",
    target: "Sep 30, 2024",
  },
  {
    title: "Service Category Expansion",
    icon: "🛠️",
    percent: 30,
    description:
      "Adding specialized services including beauty & wellness, tech support, automotive services, and education & tutoring.",
    lead: "Mark Davis",
    target: "Dec 15, 2024",
  },
  {
    title: "Enterprise Partnerships",
    icon: "🤝",
    percent: 45,
    description:
      "Establishing B2B relationships for office cleaning, administrative support, digital marketing, and IT support services.",
    lead: "James Wilson",
    target: "Nov 1, 2024",
  },
];

const StrategicTabContent = () => {
  const [filter, setFilter] = useState("monthly");

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h3 className="text-2xl font-semibold text-gray-800">
          Business Performance
        </h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg shadow-sm focus:outline-none"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="custom">Custom</option>
          <option value="previous">Previous Period</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Revenue by Service Category */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-semibold mb-4">
            Revenue by Service Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {revenueData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* User Demographics */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-semibold mb-4">User Demographics</h3>
          <div className="text-gray-700 text-lg mb-2">Total Users: 8,562</div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userDemographics}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {userDemographics.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-md md:col-span-2">
          <h3 className="text-xl font-semibold mb-4">
            Geographical Distribution in Ontario
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={geoDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="city" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#475569" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {initiatives.map((item, index) => (
          <div
            key={index}
            className="relative bg-white rounded-2xl shadow-lg border border-transparent p-8 min-h-[300px] transition-transform hover:scale-[1.02] hover:shadow-2xl before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:rounded-t-xl before:bg-gradient-to-r before:from-[#0f172a] before:to-[#334155]"
          >
            <div className="flex flex-col h-full justify-between">
              {/* Title */}
              <div>
                <h4 className="text-2xl font-bold flex items-center gap-2 mb-3">
                  <span className="text-3xl">{item.icon}</span>
                  {item.title}
                </h4>

                {/* Description */}
                <p className="text-gray-600 mb-4 text-sm">{item.description}</p>

                {/* Lead and Target */}
                <div className="text-sm text-gray-500 mb-4 space-y-1">
                  <p>
                    <strong>Lead:</strong> {item.lead}
                  </p>
                  <p>
                    <strong>Target:</strong> {item.target}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                  <span>Progress</span>
                  <span>{item.percent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-[#0f172a] h-3 rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${item.percent}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <CompetitiveIntelligenceTab/>
      </div>
      <div>
        <GrowthProjectionsTab/>
      </div>
    </div>
  );
};

export default StrategicTabContent;
