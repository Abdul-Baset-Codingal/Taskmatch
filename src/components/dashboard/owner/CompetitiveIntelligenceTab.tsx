// CompetitiveIntelligenceTab.jsx
"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444"];

const marketShareData = [
  { name: "TaskMatch (Us)", value: 23.5 },
  { name: "TaskRabbit", value: 26.8 },
  { name: "Handy", value: 18.2 },
  { name: "HomeAdvisor", value: 15.6 },
  { name: "Others", value: 15.9 },
];

const keyDifferentiators = [
  { title: "Pricing", value: "+3" },
  { title: "Service Quality", value: "+4" },
  { title: "Platform UX", value: "+5" },
];

const improvementAreas = [
  { title: "Service Diversity", value: "-3" },
  { title: "Response Time", value: "-2" },
  { title: "Ontario Coverage", value: "-3" },
];

const competitiveMoats = [
  { title: "Brand Recognition", percent: 68 },
  { title: "Tasker Quality", percent: 92 },
  { title: "Tech Innovation", percent: 85 },
  { title: "Customer Loyalty", percent: 74 },
  { title: "Network Effects", percent: 81 },
];

const CompetitiveIntelligenceTab = () => {
  return (
    <div className="space-y-10">
      {/* Market Share Comparison */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-2xl font-semibold mb-4">
          📊 Market Share Comparison
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={marketShareData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {marketShareData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Key Differentiators & Improvement Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h4 className="text-xl font-semibold mb-3">
            🌟 TaskMatch Advantages
          </h4>
          <p className="text-green-600 font-bold mb-4">+12 Net Score</p>
          <ul className="space-y-2">
            {keyDifferentiators.map((item, index) => (
              <li key={index} className="flex justify-between">
                <span>{item.title}</span>
                <span className="text-green-600 font-semibold">
                  {item.value}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h4 className="text-xl font-semibold mb-3">⚠️ Improvement Areas</h4>
          <p className="text-red-600 font-bold mb-4">-8 Net Score</p>
          <ul className="space-y-2">
            {improvementAreas.map((item, index) => (
              <li key={index} className="flex justify-between">
                <span>{item.title}</span>
                <span className="text-red-600 font-semibold">{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Competitive Moats */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h4 className="text-2xl font-semibold mb-4">🛡️ Competitive Moats</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {competitiveMoats.map((moat, index) => (
            <div
              key={index}
              className="bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div className="text-sm text-gray-500 mb-1">{moat.title}</div>
              <div className="text-xl font-bold text-gray-800 mb-1">
                {moat.percent}%
              </div>
              <div className="w-full bg-gray-300 h-2 rounded-full">
                <div
                  className="h-2 rounded-full bg-[#0f172a] "
                  style={{ width: `${moat.percent}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompetitiveIntelligenceTab;
