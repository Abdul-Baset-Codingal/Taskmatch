// OperationsOverviewTab.jsx
"use client";

import React from "react";
import {
  FaCogs,
  FaTruck,
  FaClock,
  FaProjectDiagram,
  FaTools,
  FaPeopleCarry,
  FaNetworkWired,
  FaShieldAlt,
  FaChartLine,
} from "react-icons/fa";

const operationMetrics = [
  {
    icon: <FaTruck className="text-indigo-600 text-3xl" />,
    title: "Supply Chain Efficiency",
    value: "92% On-time Delivery",
    description:
      "Our supply chain ensures prompt service material delivery with a 92% on-time rate, improving task completion speed.",
  },
  {
    icon: <FaClock className="text-yellow-500 text-3xl" />,
    title: "Task Turnaround Time",
    value: "2.4 Hrs Avg",
    description:
      "Average service completion time stands at 2.4 hours per task, reflecting operational efficiency across all categories.",
  },
  {
    icon: <FaProjectDiagram className="text-pink-500 text-3xl" />,
    title: "Workflow Automation",
    value: "78% Tasks Automated",
    description:
      "Automation of repetitive tasks like scheduling, confirmation, and routing has freed up resources and reduced errors.",
  },
  {
    icon: <FaTools className="text-green-500 text-3xl" />,
    title: "Maintenance & Downtime",
    value: "1.2% System Downtime",
    description:
      "Our platform maintains >98.8% uptime with proactive system checks and 24/7 infrastructure monitoring.",
  },
  {
    icon: <FaPeopleCarry className="text-red-500 text-3xl" />,
    title: "Employee Productivity",
    value: "89% Engagement",
    description:
      "Engagement levels among taskers and support staff remain high due to clear workflows, goals, and training resources.",
  },
  {
    icon: <FaCogs className="text-blue-600 text-3xl" />,
    title: "Operations Scalability",
    value: "+34% Ops Capacity",
    description:
      "Operational capacity has increased by 34% in the last year thanks to modular task routing and agile service deployment.",
  },
  {
    icon: <FaNetworkWired className="text-purple-600 text-3xl" />,
    title: "System Integration",
    value: "API-First Design",
    description:
      "All services integrate via a unified API layer, ensuring modularity and cross-platform compatibility.",
  },
  {
    icon: <FaShieldAlt className="text-gray-700 text-3xl" />,
    title: "Security & Compliance",
    value: "ISO 27001 Ready",
    description:
      "Our operations adhere to high security standards, including encryption-at-rest and access controls across environments.",
  },
  {
    icon: <FaChartLine className="text-orange-500 text-3xl" />,
    title: "KPI Monitoring",
    value: "Real-Time Dashboards",
    description:
      "Key operational KPIs like task velocity, error rates, and resource allocation are tracked in real-time dashboards.",
  },
];

const OperationsOverviewTab = () => {
  return (
    <div className="bg-white text-gray-900 p-12 rounded-3xl space-y-16 shadow-2xl">
      <h2 className="text-5xl font-bold text-center">⚙️ Operations Overview</h2>
      <p className="text-center max-w-3xl mx-auto text-gray-600 text-lg">
        This section provides a comprehensive look into TaskMatch’s operational
        backbone—from supply chain logistics to real-time system
        monitoring—ensuring we deliver consistent quality and reliability at
        scale.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {operationMetrics.map((item, index) => (
          <div
            key={index}
            className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              {item.icon}
              <h3 className="text-lg font-semibold text-gray-800">
                {item.title}
              </h3>
            </div>
            <p className="text-2xl font-bold text-indigo-800 mb-2">
              {item.value}
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OperationsOverviewTab;
