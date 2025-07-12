"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Image from "next/image";
import {
  FiMessageCircle,
  FiPhoneCall,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";
import { useGetTasksByStatusQuery } from "@/features/api/taskApi";
import defaultAvatar from "../../../../public/Images/clientImage1.jpg"; // fallback

type TaskStatus = "in progress" | "scheduled" | "completed";

const statusColors: Record<TaskStatus, string> = {
  "in progress": "bg-yellow-400 text-yellow-900",
  scheduled: "bg-blue-400 text-blue-900",
  completed: "bg-green-400 text-green-900",
};

const ActiveTasks = () => {
  const {
    data: tasks = [],
    isLoading,
    isError,
  } = useGetTasksByStatusQuery("in progress");

  if (isLoading)
    return <p className="text-center text-purple-600">Loading active tasks...</p>;
  if (isError)
    return <p className="text-center text-red-600">Failed to load tasks.</p>;

  return (
    <section className="max-w-6xl mx-auto bg-gradient-to-r from-purple-300 via-indigo-300 to-blue-300 bg-opacity-50 rounded-xl p-8 shadow-lg text-gray-900">
      <h2 className="text-3xl font-bold mb-10 text-center text-purple-800">
        Active Tasks
      </h2>

      <div className="space-y-8">
        {tasks.map((task: any) => (
          <div
            key={task._id}
            className="bg-white/80 rounded-xl shadow-lg border-t-4 border-purple-600 p-6 flex flex-col md:flex-row gap-6 hover:shadow-2xl transition"
          >
            {/* Image */}
            <div className="relative w-28 h-28 rounded-full overflow-hidden flex-shrink-0 border-4 border-purple-500 shadow-md">
              <Image
                src={defaultAvatar}
                alt="Tasker Avatar"
                layout="fill"
                objectFit="cover"
              />
            </div>

            {/* Info */}
            <div className="flex flex-col justify-between flex-grow">
              <div>
                <h3 className="text-2xl font-bold text-purple-900">
                  {task.taskTitle}
                </h3>
                <p className="text-purple-700 font-semibold mt-1">
                  Assigned To: {task?.acceptedBy?.name || "N/A"}
                </p>
                <p className="text-yellow-500 font-semibold mt-1">
                  ★★★★★ (40 reviews)
                </p>
                <p className="mt-1 text-gray-700 italic">
                  {task.serviceTitle || "Category N/A"}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 mt-4 text-gray-700 font-semibold">
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-xl text-yellow-600" />
                  <span>Status:</span>
                  <span
                    className={`ml-1 inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusColors[task.status as TaskStatus] ||
                      "bg-gray-400 text-gray-900"
                      }`}
                  >
                    {task.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <FiClock className="text-xl text-purple-600" />
                  <span>Schedule:</span>
                  <span>{task.schedule || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 justify-center">
              <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition">
                <FiMessageCircle /> Message Tasker
              </button>
              <button className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg text-sm transition">
                <FiPhoneCall /> Call Tasker
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ActiveTasks;
