/* eslint-disable @typescript-eslint/no-empty-object-type */
"use client";

import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  FaFileExport,
  FaPrint,
  FaThLarge,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

const marketTrendsData = [
  { month: "Jan", growth: 30 },
  { month: "Feb", growth: 32 },
  { month: "Mar", growth: 33 },
  { month: "Apr", growth: 34 },
  { month: "May", growth: 35 },
  { month: "Jun", growth: 36 },
  { month: "Jul", growth: 37 },
  { month: "Aug", growth: 38 },
  { month: "Sep", growth: 39 },
  { month: "Oct", growth: 40 },
  { month: "Nov", growth: 41 },
  { month: "Dec", growth: 42 },
];

const revenueData = [
  { month: "Jan", revenue: 220 },
  { month: "Feb", revenue: 240 },
  { month: "Mar", revenue: 250 },
  { month: "Apr", revenue: 260 },
  { month: "May", revenue: 270 },
  { month: "Jun", revenue: 280 },
  { month: "Jul", revenue: 300 },
  { month: "Aug", revenue: 310 },
  { month: "Sep", revenue: 320 },
  { month: "Oct", revenue: 340 },
  { month: "Nov", revenue: 360 },
  { month: "Dec", revenue: 380 },
];

const initiatives = [
  {
    title: "Geographic Expansion",
    progress: 65,
    lead: "Sarah Johnson",
    target: "Sep 30, 2024",
    status: "In Progress",
    description: "Expanding services to 5 new metropolitan areas by Q3 2024.",
  },
  {
    title: "Service Category Expansion",
    progress: 30,
    lead: "Mark Davis",
    target: "Dec 15, 2024",
    status: "Planning",
    description:
      "Adding specialized professional services including accounting and legal consultation.",
  },
  {
    title: "Mobile App Redesign",
    progress: 100,
    lead: "Alex Wong",
    target: "Mar 15, 2024",
    status: "Completed",
    description:
      "UX/UI overhaul improving conversion rates by 18% and reducing bounce rate.",
  },
];

const DashboardOverview = () => {
  return (
    <section className="max-w-7xl mx-auto lg:p-4 bg-[#f8fafc] rounded-2xl shadow-lg space-y-16">
      {/* Header + Tabs */}
      <header className="flex flex-wrap justify-between items-center gap-6">
        <h2 className="text-5xl font-extrabold text-gray-900 tracking-tight">
          Executive Overview
        </h2>
        <div className="flex gap-6 flex-wrap">
          {[
            { label: "Export Data", icon: <FaFileExport /> },
            { label: "Print Report", icon: <FaPrint /> },
            { label: "Board View", icon: <FaThLarge /> },
            { label: "Business Growth", icon: <FaChartLine /> },
          ].map(({ label, icon }) => (
            <button
              key={label}
              className="flex items-center gap-2 px-7 py-3 rounded-lg bg-[#0f172a] text-white    font-semibold shadow-md hover:bg-[#1e293b] transition-colors"
            >
              {React.cloneElement(icon, { className: "w-5 h-5" })}
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <SummaryCard
          title="Revenue (Last 12 Months)"
          value="$286K"
          growth="2.4%"
          growthType="up"
          color="teal"
          subtitle="Strong growth despite market volatility"
        />
        <SummaryCard
          title="New Users"
          value="23.5%"
          color="blue"
          subtitle="Quarterly user acquisition increase"
          growth={undefined}
          growthType={undefined}
        />
        <SummaryCard
          title="Customer Acquisition Cost"
          value="$42.18"
          growth="5.1%"
          growthType="down"
          color="red"
          subtitle="Avg cost to acquire a new customer"
        />
        <SummaryCard
          title="Customer Lifetime Value"
          value="$720"
          growth="8.7%"
          growthType="up"
          color="green"
          subtitle="Projected revenue from avg customer"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Revenue Chart */}
        <ChartCard title="Monthly Revenue">
          <ResponsiveContainer width="100%" height={230}>
            <LineChart
              data={revenueData}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#059669"
                strokeWidth={4}
                dot={{
                  r: 5,
                  strokeWidth: 2,
                  stroke: "#d1fae5",
                  fill: "#065f46",
                }}
              />
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis dataKey="month" stroke="#475569" />
              <YAxis stroke="#475569" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#dcfce7",
                  borderRadius: 8,
                  border: "none",
                }}
                itemStyle={{ color: "#065f46" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Market Trends Chart */}
        <ChartCard title="Market Trends">
          <ResponsiveContainer width="100%" height={230}>
            <BarChart
              data={marketTrendsData}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <Bar
                dataKey="growth"
                fill="#2563eb"
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              />
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis dataKey="month" stroke="#475569" />
              <YAxis stroke="#475569" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#bfdbfe",
                  borderRadius: 8,
                  border: "none",
                }}
                itemStyle={{ color: "#1e40af" }}
              />
            </BarChart>
          </ResponsiveContainer>
          <p className="mt-5 text-gray-700 font-semibold tracking-wide text-lg">
            On-demand professional services growing at 35% YoY
          </p>
        </ChartCard>

        {/* NPS Card */}
        <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center">
          <h3 className="text-3xl font-semibold mb-4 text-gray-900">
            Net Promoter Score
          </h3>
          <div className="text-7xl font-extrabold text-gray-800 mb-3">76</div>
          <div className="flex items-center gap-2 text-green-600 text-3xl font-bold">
            <FaArrowUp />
            <span>3</span>
          </div>
          <p className="mt-6 text-gray-600 font-medium max-w-xs">
            Customer satisfaction and loyalty measure, indicating strong brand
            loyalty.
          </p>
        </div>
      </div>

      {/* Strategic Initiatives */}
      <section>
        <h3 className="text-3xl font-extrabold mb-8 tracking-tight text-gray-900">
          Strategic Initiatives
        </h3>
        <div className="space-y-8">
          {initiatives.map(
            ({ title, progress, lead, target, status, description }) => (
              <InitiativeCard
                key={title}
                title={title}
                progress={progress}
                lead={lead}
                target={target}
                status={status}
                description={description}
              />
            )
          )}
          <button className="mt-6 px-8 py-3 rounded-lg bg-[#0f172a] text-white font-semibold shadow-md hover:bg-[#1e293b] transition-colors flex items-center gap-3">
            <FaArrowUp />+ Add New Initiative
          </button>
        </div>
      </section>
    </section>
  );
};

type SummaryCardProps = {
  title: string;
  value: string | number;
  growth?: string;
  growthType?: "up" | "down";
  color: "teal" | "blue" | "red" | "green";
  subtitle?: string;
};

const SummaryCard = ({ title, value, growth, growthType, color, subtitle }: SummaryCardProps) => {
  const colors = {
    teal: {
      bg: "bg-teal-50",
      text: "text-teal-800",
      growthUp: "text-green-600",
      growthDown: "text-red-600",
    },
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-800",
      growthUp: "text-green-600",
      growthDown: "text-red-600",
    },
    red: {
      bg: "bg-red-50",
      text: "text-red-800",
      growthUp: "text-green-600",
      growthDown: "text-red-600",
    },
    green: {
      bg: "bg-green-50",
      text: "text-green-800",
      growthUp: "text-green-600",
      growthDown: "text-red-600",
    },
  };

  const selected = colors[color] || colors.blue;

  return (
    <div
      className={`${selected.bg} p-6 rounded-lg shadow-sm flex flex-col items-center text-center`}
    >
      <h4 className={`text-xl font-semibold mb-3 ${selected.text}`}>{title}</h4>
      <div className={`text-5xl font-extrabold ${selected.text}`}>{value}</div>
      {growth && (
        <div
          className={`mt-2 flex items-center justify-center gap-2 font-semibold ${
            growthType === "up" ? selected.growthUp : selected.growthDown
          }`}
        >
          {growthType === "up" ? <FaArrowUp /> : <FaArrowDown />}
          <span>{growth}</span>
        </div>
      )}
      {subtitle && <p className="mt-3 text-gray-600 text-sm">{subtitle}</p>}
    </div>
  );
};

type ChartCardProps = {
  title: string;
} & React.PropsWithChildren<{}>;

const ChartCard = ({ title, children }: ChartCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">{title}</h3>
      {children}
    </div>
  );
};

type InitiativeCardProps = {
  title: string;
  progress: number;
  lead: string;
  target: string;
  status: string;
  description: string;
};

const InitiativeCard = ({
  title,
  progress,
  lead,
  target,
  status,
  description,
}: InitiativeCardProps) => {
  let statusColor = "bg-gray-300 text-gray-800";
  if (status === "Completed") statusColor = "bg-green-200 text-green-800";
  else if (status === "In Progress")
    statusColor = "bg-yellow-200 text-yellow-800";
  else if (status === "Planning") statusColor = "bg-blue-200 text-blue-800";

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-2xl font-semibold text-gray-900">{title}</h4>
        <span
          className={`${statusColor} px-4 py-1 rounded-full font-semibold text-sm select-none`}
        >
          {status}
        </span>
      </div>
      <p className="mb-4 text-gray-700">{description}</p>
      <div className="flex gap-8 text-gray-700 font-semibold mb-5">
        <div>
          <span className="block text-sm font-medium mb-1 text-gray-500">
            Lead
          </span>
          {lead}
        </div>
        <div>
          <span className="block text-sm font-medium mb-1 text-gray-500">
            Target
          </span>
          {target}
        </div>
      </div>
      <ProgressBar progress={progress} />
    </div>
  );
};

const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-yellow-400 transition-all duration-1000 ease-in-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default DashboardOverview;
