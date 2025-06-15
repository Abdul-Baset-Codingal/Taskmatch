// FinancialPerformanceTab.jsx
"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#4C51BF", "#38B2AC", "#ECC94B", "#ED8936", "#E53E3E"];

const revenueData = [
  { category: "Home Cleaning", value: 420000 },
  { category: "Handyman", value: 300000 },
  { category: "Moving Services", value: 180000 },
  { category: "Electrical", value: 120000 },
  { category: "Plumbing", value: 95000 },
  { category: "Pet Services", value: 85000 },
];

const expenseData = [
  { category: "Marketing", value: 180000 },
  { category: "Salaries", value: 240000 },
  { category: "Maintenance", value: 120000 },
  { category: "Tech Upgrades", value: 80000 },
  { category: "Customer Support", value: 90000 },
];

const FinancialPerformanceTab = () => {
  return (
    <div className="space-y-16 p-10 bg-gradient-to-b from-white to-blue-50 rounded-3xl shadow-2xl border border-gray-100">
      <h2 className="text-4xl font-extrabold text-center text-blue-900 mb-4 tracking-tight">
        💼 Financial Performance Overview
      </h2>
      <p className="text-center text-gray-600 max-w-2xl mx-auto text-base">
        Insight into revenue generation, expense allocations, and quarterly performance metrics for strategic decision making.
      </p>

      {/* Revenue vs Expense Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white p-8 rounded-2xl shadow-md border border-blue-200">
          <h3 className="text-xl font-bold text-blue-700 mb-4">📊 Revenue by Service Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={revenueData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
            >
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="category" tick={{ fill: "#2D3748" }} />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Bar dataKey="value" fill="#4C51BF" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-md border border-teal-200">
          <h3 className="text-xl font-bold text-teal-700 mb-4">💸 Expense Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#38B2AC"
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quarterly Summary */}
      <div className="mt-16 p-8 bg-white rounded-2xl border border-indigo-200 shadow-md">
        <h4 className="text-2xl font-bold text-indigo-800 mb-6">📈 Quarterly Financial Snapshot</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-base text-gray-700">
          <div className="bg-indigo-50 p-4 rounded-xl shadow-inner">
            <p className="font-semibold">Total Revenue</p>
            <p className="text-2xl font-bold text-indigo-800">$1.28M</p>
          </div>
          <div className="bg-indigo-50 p-4 rounded-xl shadow-inner">
            <p className="font-semibold">Total Expenses</p>
            <p className="text-2xl font-bold text-indigo-800">$710K</p>
          </div>
          <div className="bg-indigo-50 p-4 rounded-xl shadow-inner">
            <p className="font-semibold">Profit Margin</p>
            <p className="text-2xl font-bold text-indigo-800">44.5%</p>
          </div>
          <div className="bg-indigo-50 p-4 rounded-xl shadow-inner">
            <p className="font-semibold">Avg Revenue per Client</p>
            <p className="text-2xl font-bold text-indigo-800">$752</p>
          </div>
          <div className="bg-indigo-50 p-4 rounded-xl shadow-inner">
            <p className="font-semibold">CAC Ratio</p>
            <p className="text-2xl font-bold text-indigo-800">3.8:1</p>
          </div>
          <div className="bg-indigo-50 p-4 rounded-xl shadow-inner">
            <p className="font-semibold">Financial Target</p>
            <p className="text-2xl font-bold text-indigo-800">Surpass $5M annual</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialPerformanceTab;
