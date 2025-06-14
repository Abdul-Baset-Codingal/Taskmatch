"use client";

import React from "react";
import Image from "next/image";
import {
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaTools,
  FaBriefcase,
} from "react-icons/fa";

type TaskStatus = "Pending" | "In Progress" | "Completed";
type TaskPriority = "Low" | "Medium" | "High";

const tasks: {
  id: string;
  title: string;
  assignedTo: string;
  image: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  dueTime: string;
  type: string;
  category: string;
}[] = [
  {
    id: "TSK-2023",
    title: "Fix plumbing issue in downtown apartment",
    assignedTo: "John Doe",
    image: "/Images/clientImage1.jpg",
    status: "In Progress",
    priority: "High",
    dueDate: "Jun 18, 2024",
    dueTime: "02:00 PM",
    type: "On-Site",
    category: "Maintenance",
  },
  {
    id: "TSK-2024",
    title: "Deliver marketing presentation to client",
    assignedTo: "Jane Smith",
    image: "/Images/clientImage2.jpg",
    status: "Pending",
    priority: "Medium",
    dueDate: "Jun 20, 2024",
    dueTime: "11:00 AM",
    type: "Remote",
    category: "Marketing",
  },
  {
    id: "TSK-2025",
    title: "Design landing page for summer promo",
    assignedTo: "Sarah Williams",
    image: "/Images/clientImage5.jpg",
    status: "Completed",
    priority: "Low",
    dueDate: "Jun 10, 2024",
    dueTime: "04:30 PM",
    type: "Remote",
    category: "Design",
  },
];

const statusClasses = {
  Pending: "bg-yellow-100 text-yellow-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
};

const priorityClasses = {
  Low: "bg-green-100 text-green-700",
  Medium: "bg-orange-100 text-orange-700",
  High: "bg-red-100 text-red-700",
};

const TaskManagementSection = () => {
  return (
    <section className="max-w-7xl mx-auto lg:px-6 py-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Task Management</h2>
      <div className="overflow-x-auto bg-white rounded-2xl shadow-xl">
        <table className="min-w-full text-left text-gray-800 table-auto">
          <thead className="bg-gray-100 text-sm uppercase tracking-wide">
            <tr>
              <th className="px-6 py-4">Task</th>
              <th className="px-6 py-4">Assigned To</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Priority</th>
              <th className="px-6 py-4">Due</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {tasks.map((task) => (
              <tr
                key={task.id}
                className="hover:bg-gray-50 transition duration-200"
              >
                <td className="px-6 py-4 font-medium whitespace-normal">
                  {task.title}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 relative rounded-full overflow-hidden border shrink-0">
                      <Image
                        src={task.image}
                        alt={task.assignedTo}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span>{task.assignedTo}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <FaBriefcase className="text-indigo-500" />
                    <span>{task.type}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <FaTools className="text-teal-500" />
                    <span>{task.category}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-block px-5 py-1 text-xs rounded-full font-medium ${
                      statusClasses[task.status]
                    }`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
                      priorityClasses[task.priority as keyof typeof priorityClasses]
                    }`}
                  >
                    {task.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span>{task.dueDate}</span>
                    <span className="text-xs text-gray-500">
                      {task.dueTime}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-4 text-lg">
                    <button className="text-blue-600 hover:text-blue-800 transition">
                      <FaEdit />
                    </button>
                    {task.status !== "Completed" && (
                      <button className="text-green-600 hover:text-green-800 transition">
                        <FaCheckCircle />
                      </button>
                    )}
                    <button className="text-red-600 hover:text-red-800 transition">
                      <FaTrash />
                    </button>
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

export default TaskManagementSection;
