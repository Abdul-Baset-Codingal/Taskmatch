"use client";

import React from "react";
import {
  FaSyncAlt,
  FaExclamationCircle,
  FaCalendarCheck,
  FaEye,
  FaRedo,
} from "react-icons/fa";

type OperationStatus = "Success" | "Failed" | "Pending";

interface Operation {
  id: string;
  description: string;
  module: string;
  type: "Scheduled" | "Manual" | "Triggered";
  status: OperationStatus;
  lastRun: string;
  nextRun: string | null;
}

const operations: Operation[] = [
  {
    id: "OPR-1023",
    description: "Daily user data sync with external CRM",
    module: "User Management",
    type: "Scheduled",
    status: "Success",
    lastRun: "Jun 13, 2024 - 02:00 AM",
    nextRun: "Jun 14, 2024 - 02:00 AM",
  },
  {
    id: "OPR-1022",
    description: "Auto-payment batch job",
    module: "Billing",
    type: "Scheduled",
    status: "Failed",
    lastRun: "Jun 13, 2024 - 01:00 AM",
    nextRun: "Jun 14, 2024 - 01:00 AM",
  },
  {
    id: "OPR-1021",
    description: "Manual refund processed for Jane Smith",
    module: "Billing",
    type: "Manual",
    status: "Success",
    lastRun: "Jun 12, 2024 - 05:00 PM",
    nextRun: null,
  },
  {
    id: "OPR-1020",
    description: "Weekly performance report emailed",
    module: "Analytics",
    type: "Triggered",
    status: "Pending",
    lastRun: "Jun 11, 2024 - 06:00 AM",
    nextRun: "Jun 18, 2024 - 06:00 AM",
  },
];

const statusStyle: Record<OperationStatus, string> = {
  Success: "bg-green-100 text-green-700",
  Failed: "bg-red-100 text-red-700",
  Pending: "bg-yellow-100 text-yellow-700",
};

const OperationsSection = () => {
  return (
    <section className="max-w-7xl mx-auto lg:px-6 py-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Operations</h2>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-xl">
        <table className="min-w-[1100px] w-full text-left text-gray-800">
          <thead className="bg-gray-100 text-sm uppercase tracking-wide">
            <tr>
              <th className="px-6 py-4">Operation ID</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Module</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Run</th>
              <th className="px-6 py-4">Next Run</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {operations.map((op) => (
              <tr
                key={op.id}
                className="hover:bg-gray-50 transition duration-200"
              >
                <td className="px-6 py-4 font-semibold">{op.id}</td>
                <td className="px-6 py-4">{op.description}</td>
                <td className="px-6 py-4">{op.module}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 text-sm text-indigo-600 font-medium">
                    {op.type === "Scheduled" && <FaCalendarCheck />}
                    {op.type === "Manual" && <FaSyncAlt />}
                    {op.type === "Triggered" && <FaExclamationCircle />}
                    {op.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-4 py-1 text-xs font-semibold rounded-full ${
                      statusStyle[op.status]
                    }`}
                  >
                    {op.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{op.lastRun}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {op.nextRun || "—"}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-4 text-lg">
                    <button className="text-blue-600 hover:text-blue-800 transition">
                      <FaEye />
                    </button>
                    {op.status === "Failed" && (
                      <button className="text-red-600 hover:text-red-800 transition">
                        <FaRedo />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default OperationsSection;
