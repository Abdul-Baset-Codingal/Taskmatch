/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useMemo } from "react";
import {
  FaFileExport,
  FaPrint,
  FaChartArea,
  FaChartPie,
} from "react-icons/fa";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const fullReportData = [
  { month: "Jan", revenue: 4000, tasks: 240, users: 50 },
  { month: "Feb", revenue: 3000, tasks: 221, users: 45 },
  { month: "Mar", revenue: 2000, tasks: 229, users: 60 },
  { month: "Apr", revenue: 2780, tasks: 200, users: 55 },
  { month: "May", revenue: 1890, tasks: 218, users: 70 },
  { month: "Jun", revenue: 2390, tasks: 250, users: 75 },
  { month: "Jul", revenue: 3490, tasks: 300, users: 80 },
  { month: "Aug", revenue: 3200, tasks: 270, users: 78 },
  { month: "Sep", revenue: 2800, tasks: 230, users: 74 },
  { month: "Oct", revenue: 3000, tasks: 240, users: 76 },
  { month: "Nov", revenue: 3500, tasks: 260, users: 82 },
  { month: "Dec", revenue: 4000, tasks: 280, users: 90 },
];

const pieDataFull = [
  { name: "Completed Tasks", value: 400 },
  { name: "Pending Tasks", value: 300 },
  { name: "Failed Tasks", value: 100 },
];

const COLORS = ["#0088FE", "#00C49F", "#FF8042"];

type DateRangeType = "Last 3 Months" | "Last 6 Months" | "Last 12 Months" | "Custom Range";

const ReportsSection = () => {
  const [dateRange, setDateRange] = useState<DateRangeType>("Last 12 Months");
  const [reportType, setReportType] = useState("Summary");

  // Determine how many months to slice for the selected date range
  const monthsCount: Record<DateRangeType, number> = {
    "Last 3 Months": 3,
    "Last 6 Months": 6,
    "Last 12 Months": 12,
    "Custom Range": 12, // for simplicity, same as 12 months here
  };

  // Filter data according to date range
  const filteredReportData = useMemo(() => {
    const count = monthsCount[dateRange] || 12;
    return fullReportData.slice(fullReportData.length - count);
  }, [dateRange]);

  // Summary calculations on filtered data
  const totalRevenue = filteredReportData.reduce(
    (sum, d) => sum + d.revenue,
    0
  );
  const totalTasks = filteredReportData.reduce((sum, d) => sum + d.tasks, 0);
  const totalUsers = filteredReportData.reduce((sum, d) => sum + d.users, 0);

  // Render summary cards based on reportType filter
  const renderSummaryCards = () => {
    if (reportType === "Revenue") {
      return (
        <div className="bg-indigo-50 p-6 rounded-xl shadow-md col-span-1 sm:col-span-3">
          <h3 className="text-lg font-semibold text-indigo-700 mb-2">
            Total Revenue
          </h3>
          <p className="text-3xl font-bold text-indigo-900">
            ${totalRevenue.toLocaleString()}
          </p>
          <p className="text-sm text-indigo-600 mt-1">{dateRange}</p>
        </div>
      );
    }

    if (reportType === "Tasks") {
      return (
        <div className="bg-green-50 p-6 rounded-xl shadow-md col-span-1 sm:col-span-3">
          <h3 className="text-lg font-semibold text-green-700 mb-2">
            Tasks Completed
          </h3>
          <p className="text-3xl font-bold text-green-900">
            {totalTasks.toLocaleString()}
          </p>
          <p className="text-sm text-green-600 mt-1">{dateRange}</p>
        </div>
      );
    }

    if (reportType === "Users") {
      return (
        <div className="bg-blue-50 p-6 rounded-xl shadow-md col-span-1 sm:col-span-3">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">
            New Users
          </h3>
          <p className="text-3xl font-bold text-blue-900">
            {totalUsers.toLocaleString()}
          </p>
          <p className="text-sm text-blue-600 mt-1">{dateRange}</p>
        </div>
      );
    }

    // Summary (default): show all three
    return (
      <>
        <div className="bg-indigo-50 p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-indigo-700 mb-2">
            Total Revenue
          </h3>
          <p className="text-3xl font-bold text-indigo-900">
            ${totalRevenue.toLocaleString()}
          </p>
          <p className="text-sm text-indigo-600 mt-1">{dateRange}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-green-700 mb-2">
            Tasks Completed
          </h3>
          <p className="text-3xl font-bold text-green-900">
            {totalTasks.toLocaleString()}
          </p>
          <p className="text-sm text-green-600 mt-1">{dateRange}</p>
        </div>
        <div className="bg-blue-50 p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">
            New Users
          </h3>
          <p className="text-3xl font-bold text-blue-900">
            {totalUsers.toLocaleString()}
          </p>
          <p className="text-sm text-blue-600 mt-1">{dateRange}</p>
        </div>
      </>
    );
  };

  // Decide which charts to show based on reportType filter
  const renderCharts = () => {
    if (reportType === "Revenue") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={filteredReportData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
            <Legend verticalAlign="top" height={36} />
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    if (reportType === "Tasks") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={filteredReportData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip />
            <Area
              type="monotone"
              dataKey="tasks"
              stroke="#82ca9d"
              fillOpacity={1}
              fill="url(#colorTasks)"
            />
            <Legend verticalAlign="top" height={36} />
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    if (reportType === "Users") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={filteredReportData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip />
            <Area
              type="monotone"
              dataKey="users"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorUsers)"
            />
            <Legend verticalAlign="top" height={36} />
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    // Default: show revenue + users area chart and pie chart
    return (
      <>
        <div className="flex-1 bg-gray-50 p-6 rounded-xl shadow-md">
          <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaChartArea /> Revenue & User Growth
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart
              data={filteredReportData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#82ca9d"
                fillOpacity={1}
                fill="url(#colorUsers)"
              />
              <Legend verticalAlign="top" height={36} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 bg-gray-50 p-6 rounded-xl shadow-md">
          <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaChartPie /> Task Status Distribution
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieDataFull}
                cx="50%"
                cy="50%"
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {pieDataFull.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </>
    );
  };

  return (
    <section className="max-w-7xl mx-auto lg:px-6 py-12 bg-white rounded-2xl shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FaChartArea /> Reports
        </h2>

        <div className="flex flex-wrap gap-4 items-center">
          <select
            className="border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as DateRangeType)}
          >
            <option>Last 3 Months</option>
            <option>Last 6 Months</option>
            <option>Last 12 Months</option>
            <option>Custom Range</option>
          </select>

          <select
            className="border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option>Summary</option>
            <option>Revenue</option>
            <option>Tasks</option>
            <option>Users</option>
          </select>

          <button className="flex items-center gap-2 bg-indigo-700 text-white px-5 py-2 rounded-md hover:bg-indigo-800 transition">
            <FaFileExport /> Export
          </button>
          <button className="flex items-center gap-2 bg-gray-700 text-white px-5 py-2 rounded-md hover:bg-gray-900 transition">
            <FaPrint /> Print
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className={`grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10`}>
        {renderSummaryCards()}
      </div>

      {/* Charts */}
      <div className="flex flex-col lg:flex-row gap-10">{renderCharts()}</div>
    </section>
  );
};

export default ReportsSection;
