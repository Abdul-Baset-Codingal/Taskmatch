/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useMemo } from "react";
import {
  FaTasks,
  FaClipboardList,
  FaCheckCircle,
  FaDollarSign,
} from "react-icons/fa";
import { useGetTasksByClientQuery } from "@/features/api/taskApi";

const ClientStats = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { data: clientTasks = [], isLoading, isError } = useGetTasksByClientQuery();

  const stats = useMemo(() => {
    const totalTasks = clientTasks.length;
    const pendingTasks = clientTasks.filter((task: any) => task.status === "pending").length;
    const completedTasks = clientTasks.filter((task: any) => task.status === "completed").length;
    const totalSpent = clientTasks.reduce((sum: number, task: any) => sum + (task.price || 0), 0);

    return [
      {
        title: "Total Tasks",
        value: totalTasks.toString(),
        icon: <FaTasks className="text-blue-700 text-4xl" />,
        borderColor: "border-t-4 border-blue-500",
        bg: "bg-blue-100/70",
      },
      {
        title: "Pending Tasks",
        value: pendingTasks.toString(),
        icon: <FaClipboardList className="text-yellow-700 text-4xl" />,
        borderColor: "border-t-4 border-yellow-500",
        bg: "bg-yellow-100/70",
      },
      {
        title: "Completed Tasks",
        value: completedTasks.toString(),
        icon: <FaCheckCircle className="text-green-700 text-4xl" />,
        borderColor: "border-t-4 border-green-500",
        bg: "bg-green-100/70",
      },
      {
        title: "Total Spent",
        value: `$${totalSpent.toLocaleString()}`,
        icon: <FaDollarSign className="text-purple-700 text-4xl" />,
        borderColor: "border-t-4 border-purple-500",
        bg: "bg-purple-100/70",
      },
    ];
  }, [clientTasks]);

  return (
    <section className="py-12 px-4">
      {isLoading ? (
        <p className="text-center text-gray-600 text-xl font-semibold">Loading stats...</p>
      ) : isError ? (
        <p className="text-center text-red-600 text-xl font-semibold">Error loading stats!</p>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`rounded-xl p-8 shadow-md ${stat.borderColor} ${stat.bg} transition hover:scale-[1.02] duration-300 flex flex-col items-center text-center`}
            >
              <div className="p-4 bg-white rounded-full shadow text-4xl mb-4">
                {stat.icon}
              </div>
              <h3 className="text-4xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-lg text-gray-700 mt-2">{stat.title}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ClientStats;