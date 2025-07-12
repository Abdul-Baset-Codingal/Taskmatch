/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import {
  FaHome,
  FaTruckMoving,
  FaTools,
  FaBoxOpen,
  FaShippingFast,
  FaBars,
  FaTimes,

} from "react-icons/fa";
import AllClientTasks from "./AllClientTasks";
import { useGetTasksByClientQuery, useReplyToCommentMutation, useUpdateTaskStatusMutation } from "@/features/api/taskApi";

const TASK_STATUS = [
  { label: "All Tasks", count: 8 },
  { label: "Open for Bids", count: 1 },
  { label: "In Progress", count: 2 },
  { label: "Completed", count: 5 },
  { label: "Cancelled", count: 0 },
];

const TASK_CATEGORIES = [
  { label: "Home Cleaning", count: 3, icon: <FaHome /> },
  { label: "Moving", count: 2, icon: <FaTruckMoving /> },
  { label: "Handyman", count: 1, icon: <FaTools /> },
  { label: "Assembly", count: 1, icon: <FaBoxOpen /> },
  { label: "Delivery", count: 1, icon: <FaShippingFast /> },
];

const SORT_OPTIONS = [
  "Most Recent",
  "Price: High to Low",
  "Price: Low to High",
];




export default function TaskListSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Tasks");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Most Recent");
  const [showSidebar, setShowSidebar] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);


// If you're 100% sure it's okay
// @ts-ignore
const { data: clientTasks = [], isLoading, isError } = useGetTasksByClientQuery();
  console.log(clientTasks)
  const [replyToComment] = useReplyToCommentMutation();
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  // Reply Handler
  const handleReplySubmit = async (taskId: any, commentId: any, message: any) => {
    try {
      if (!message) return;
      await replyToComment({ taskId, commentId, message });
      setReplyText("");
      setReplyingTo(null);
    } catch (err) {
      console.error("Reply failed", err);
    }
  };

  // Status Change Handler
  const handleCompleteStatus = async (taskId: any, status: any) => {
    try {
      await updateTaskStatus({ taskId, status });
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-5">
      <div className="flex justify-between items-center mb-6">
        <button
          className="md:hidden text-3xl text-purple-700"
          onClick={() => setShowSidebar(true)}
        >
          <FaBars />
        </button>
      </div>

      <div className="flex flex-col md:flex-row max-w-7xl mx-auto gap-8 relative">
        {/* Sidebar */}
        {showSidebar && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}

        <aside
          className={`z-50 md:static fixed top-0 left-0 h-full w-80 bg-white p-8 overflow-y-auto transition-transform duration-300
          ${showSidebar ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0 rounded-xl shadow-lg`}
        >
          <div className="flex justify-between items-center md:hidden mb-6">
            <h2 className="text-xl font-bold">Filters</h2>
            <button
              onClick={() => setShowSidebar(false)}
              className="text-2xl text-red-500"
            >
              <FaTimes />
            </button>
          </div>

          {/* Search */}
          <div className="mb-8">
            <label
              htmlFor="search"
              className="block text-gray-800 font-bold mb-3 text-lg"
            >
              Search Tasks
            </label>
            <input
              id="search"
              type="search"
              placeholder="Search by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-5 py-3 text-lg font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-300 transition"
            />
          </div>

          {/* Status Filter */}
          <div className="mb-8">
            <h3 className="font-bold text-xl mb-5 text-purple-700 tracking-wide">
              Filter by Status
            </h3>
            <ul className="space-y-3">
              {TASK_STATUS.map(({ label, count }) => (
                <li key={label}>
                  <button
                    onClick={() => {
                      setSelectedStatus(label);
                      setShowSidebar(false);
                    }}
                    className={`w-full text-left px-5 py-3 rounded-xl font-semibold transition ${selectedStatus === label
                      ? "bg-purple-600 text-white shadow-lg"
                      : "hover:bg-purple-100 text-purple-800"
                      }`}
                  >
                    {label} <span className="font-bold ml-2">({count})</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <h3 className="font-bold text-xl mb-5 text-blue-700 tracking-wide">
              Filter by Category
            </h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setShowSidebar(false);
                  }}
                  className={`w-full text-left px-5 py-3 rounded-xl font-semibold transition ${selectedCategory === "All"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "hover:bg-blue-100 text-blue-800"
                    }`}
                >
                  All
                </button>
              </li>
              {TASK_CATEGORIES.map(({ label, count, icon }) => (
                <li key={label}>
                  <button
                    onClick={() => {
                      setSelectedCategory(label);
                      setShowSidebar(false);
                    }}
                    className={`flex items-center gap-4 w-full text-left px-5 py-3 rounded-xl font-semibold transition ${selectedCategory === label
                      ? "bg-blue-600 text-white shadow-lg"
                      : "hover:bg-blue-100 text-blue-800"
                      }`}
                  >
                    <span className="text-2xl">{icon}</span>
                    {label}
                    <span className="ml-auto font-bold">({count})</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Sort By */}
          <div>
            <h3 className="font-bold text-xl mb-4 text-pink-700 tracking-wide">
              Sort By
            </h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-5 py-3 text-lg font-medium focus:outline-none focus:ring-4 focus:ring-pink-300 transition"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </aside>

        <main className="flex-1 flex flex-col gap-10">
          {clientTasks.length === 0 ? (
            <p className="text-center text-gray-600 text-xl font-semibold">
              No tasks found.
            </p>
          ) : (
            clientTasks.map((task: any, idx: number) => (
              <AllClientTasks key={task._id || idx} task={task} idx={idx} handleReplySubmit={handleReplySubmit} handleCompleteStatus={handleCompleteStatus} />
            ))
          )}
        </main>

      </div>
    </section>
  );
}
