// RiskOverviewTab.jsx
"use client";

import React from "react";
import {
  FaExclamationTriangle,
  FaShieldAlt,
  FaBug,
  FaLock,
  FaUserSecret,
  FaBalanceScale,
} from "react-icons/fa";

const risks = [
  {
    icon: <FaExclamationTriangle className="text-red-500 text-3xl" />,
    title: "Operational Risk",
    description:
      "Potential service disruptions due to high demand, logistics delays, or technical faults may affect reliability.",
  },
  {
    icon: <FaShieldAlt className="text-blue-500 text-3xl" />,
    title: "Compliance Risk",
    description:
      "Expanding into new regions introduces varying local laws, requiring updated labor, tax, and data compliance strategies.",
  },
  {
    icon: <FaBug className="text-yellow-600 text-3xl" />,
    title: "Technical Vulnerabilities",
    description:
      "System bugs or infrastructure flaws can compromise platform uptime, impacting user experience and trust.",
  },
  {
    icon: <FaLock className="text-purple-600 text-3xl" />,
    title: "Data Security",
    description:
      "Sensitive user data must be protected from breaches; continuous audit and encryption updates are crucial.",
  },
  {
    icon: <FaUserSecret className="text-gray-700 text-3xl" />,
    title: "Fraud & Misuse",
    description:
      "Fake accounts or misuse of task payments could harm trust. We require layered identity verification and AI-driven detection.",
  },
  {
    icon: <FaBalanceScale className="text-green-700 text-3xl" />,
    title: "Reputation Risk",
    description:
      "Poor service quality or viral negative feedback on social media can reduce brand value and retention rates.",
  },
];

const RiskOverviewTab = () => {
  return (
    <section className="bg-white text-gray-900 px-6 md:px-16 py-16 rounded-3xl shadow-2xl">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-5xl font-bold mb-4">⚠️ Risk Overview</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Identifying key threats and compliance gaps helps us take a
            proactive approach to mitigate business, technical, and reputation
            risks.
          </p>
        </div>

        {/* Risk Blocks */}
        <div className="grid md:grid-cols-2 gap-10">
          {risks.map((risk, index) => (
            <div
              key={index}
              className="flex gap-4 bg-gray-50 border border-gray-200 p-6 rounded-2xl shadow hover:shadow-lg transition"
            >
              <div className="shrink-0">{risk.icon}</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {risk.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {risk.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Note */}
        <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-xl shadow text-sm text-red-700">
          <strong>Reminder:</strong> Regular audits, real-time monitoring, and
          proactive legal reviews are essential to keeping our risk exposure
          minimal.
        </div>
      </div>
    </section>
  );
};

export default RiskOverviewTab;
