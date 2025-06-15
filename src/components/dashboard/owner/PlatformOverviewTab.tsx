// PlatformOverviewTab.jsx
"use client";

import React from "react";
import {
  FaServer,
  FaClock,
  FaBolt,
  FaDatabase,
  FaCogs,
  FaShieldAlt,
  FaChartLine,
  FaCodeBranch,
  FaCheckCircle,
} from "react-icons/fa";

const platformMetrics = [
  {
    icon: <FaServer className="text-indigo-600 text-4xl" />,
    title: "Infrastructure",
    stat: "99.99% Uptime",
    detail:
      "Hosted on scalable cloud architecture with multi-zone redundancy and automatic failover. Ensures continuous service availability.",
  },
  {
    icon: <FaClock className="text-purple-600 text-4xl" />,
    title: "Average Response Time",
    stat: "220ms",
    detail:
      "Highly optimized APIs and caching strategy reduce latency for core features, keeping response time under 250ms.",
  },
  {
    icon: <FaBolt className="text-yellow-500 text-4xl" />,
    title: "Performance Score",
    stat: "98.2/100",
    detail:
      "Based on Lighthouse audits. Pages load quickly even under heavy traffic thanks to lazy loading and code splitting.",
  },
  {
    icon: <FaDatabase className="text-teal-600 text-4xl" />,
    title: "Database Health",
    stat: "Auto-Scaled",
    detail:
      "MongoDB cluster with horizontal scaling, replication, and daily backups ensures fast queries and data integrity.",
  },
  {
    icon: <FaCogs className="text-cyan-700 text-4xl" />,
    title: "Deployment Frequency",
    stat: "Weekly Releases",
    detail:
      "CI/CD pipelines using GitHub Actions automate tests and deploys, pushing stable features weekly.",
  },
  {
    icon: <FaShieldAlt className="text-red-500 text-4xl" />,
    title: "Security Layer",
    stat: "AES-256 Encryption",
    detail:
      "Data is encrypted in transit and at rest. Secure authentication via Firebase with JWT tokens and refresh tokens.",
  },
  {
    icon: <FaChartLine className="text-pink-600 text-4xl" />,
    title: "Platform Load",
    stat: "+42% Concurrent Usage",
    detail:
      "Improved socket handling and rate limiting allow handling over 10,000 concurrent active users reliably.",
  },
  {
    icon: <FaCodeBranch className="text-green-700 text-4xl" />,
    title: "Codebase Stability",
    stat: "98.5% Test Coverage",
    detail:
      "Comprehensive unit and integration tests using Jest and Cypress maintain platform reliability across all modules.",
  },
  {
    icon: <FaCheckCircle className="text-blue-500 text-4xl" />,
    title: "Bug Resolution Rate",
    stat: "<6 hrs avg",
    detail:
      "Dedicated ops team ensures that 92% of platform-related bugs are resolved within 6 hours of detection.",
  },
];

const PlatformOverviewTab = () => {
  return (
    <section className="bg-gray-50 text-gray-900 px-8 py-20 rounded-3xl shadow-2xl">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-6">
          🖥️ Platform Overview
        </h2>
        <p className="text-center text-lg text-gray-600 max-w-3xl mx-auto mb-16">
          A look under the hood of TaskMatch’s core technology — from
          performance to reliability, here’s how our platform sustains scalable
          operations, exceptional user experience, and unmatched uptime.
        </p>

        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {platformMetrics.map((item, index) => (
            <div
              key={index}
              className="relative bg-white p-6 rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition duration-300 group"
            >
              <div className="flex items-center gap-4 mb-4">
                {item.icon}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 group-hover:text-indigo-700">
                    {item.title}
                  </h3>
                  <p className="text-lg font-bold text-indigo-900 mt-1">
                    {item.stat}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mt-2 border-t pt-4 border-dashed">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformOverviewTab;
