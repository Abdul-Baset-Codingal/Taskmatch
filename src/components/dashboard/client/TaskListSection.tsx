/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useMemo } from "react";
import {
  FaHome,
  FaTruckMoving,
  FaTools,
  FaBoxOpen,
  FaShippingFast,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";
import AllClientTasks from "./AllClientTasks";
import {
  useGetTasksByClientQuery,
  useReplyToCommentMutation,
  useUpdateTaskStatusMutation,
  useUpdateTaskMutation,
} from "@/features/api/taskApi";

// Status mapping for frontend labels to backend statuses
const STATUS_MAP: { [key: string]: string } = {
  Pending: "pending",
  Completed: "completed",
  Requested: "requested",
};

const TASK_CATEGORIES = [
  { label: "All", count: 8, icon: null },
  { label: "Home Cleaning", count: 3, icon: <FaHome /> },
  { label: "Moving", count: 2, icon: <FaTruckMoving /> },
  { label: "Handyman", count: 1, icon: <FaTools /> },
  { label: "Assembly", count: 1, icon: <FaBoxOpen /> },
  { label: "Delivery", count: 1, icon: <FaShippingFast /> },
  { label: "Plumbing Service", count: 1, icon: <FaTools /> },
];

const SORT_OPTIONS = [
  "Most Recent",
  "Price: High to Low",
  "Price: Low to High",
];

type TaskFormData = {
  taskTitle: string;
  taskDescription: string;
  price: number | string;
  location: string;
  schedule: string;
  additionalInfo: string;
};

const initialTaskState: TaskFormData = {
  taskTitle: "",
  taskDescription: "",
  price: "",
  location: "",
  schedule: "",
  additionalInfo: "",
};

// Validate MongoDB ObjectId
const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

export default function TaskListSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Tasks");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Most Recent");
  const [showSidebar, setShowSidebar] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<TaskFormData>(initialTaskState);

  // @ts-ignore
  const { data: clientTasks = [], isLoading, isError } = useGetTasksByClientQuery();
  const [replyToComment] = useReplyToCommentMutation();
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const [updateTask] = useUpdateTaskMutation();

  // Compute dynamic TASK_STATUS counts
  const TASK_STATUS = useMemo(() => {
    const statusCounts = clientTasks.reduce((acc: { [key: string]: number }, task: any) => {
      const status = task.status || "unknown";
      const label = Object.keys(STATUS_MAP).find(
        (key) => STATUS_MAP[key] === status
      ) || status.charAt(0).toUpperCase() + status.slice(1);
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    }, { "All Tasks": clientTasks.length });

    return [
      { label: "All Tasks", count: statusCounts["All Tasks"] || 0 },
      { label: "Pending", count: statusCounts["Pending"] || 0 },
      { label: "Completed", count: statusCounts["Completed"] || 0 },
      { label: "Requested", count: statusCounts["Requested"] || 0 },
    ];
  }, [clientTasks]);

  // Handle Reply to Comment
  const handleReplySubmit = async (taskId: string, commentId: string, message: string) => {
    try {
      if (!message) {
        toast.error("Reply cannot be empty!");
        return;
      }
      await replyToComment({ taskId, commentId, message }).unwrap();
      setReplyText("");
      setReplyingTo(null);
      toast.success("Reply submitted successfully!");
    } catch (err) {
      console.error("Reply failed", err);
      toast.error("Failed to submit reply!");
    }
  };

  // Handle Status Update
  const handleCompleteStatus = async (taskId: string, status: string) => {
    try {
      if (!isValidObjectId(taskId)) {
        toast.error("Invalid task ID!");
        return;
      }
      await updateTaskStatus({ taskId, status }).unwrap();
      toast.success("Task status updated!");
    } catch (err) {
      console.error("Status update failed", err);
      toast.error("Failed to update status!");
    }
  };

  // Handle Edit Task
  const handleEditTask = (task: any) => {
    if (!isValidObjectId(task._id)) {
      toast.error("Invalid task ID!");
      return;
    }
    setEditTaskId(task._id);
    setEditFormData({
      taskTitle: task.taskTitle || "",
      taskDescription: task.taskDescription || "",
      price: task.price || "",
      location: task.location || "",
      schedule: task.schedule || "",
      additionalInfo: task.additionalInfo || "",
    });
  };

  // Handle Update Task
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTaskId) return;
    if (!isValidObjectId(editTaskId)) {
      toast.error("Invalid task ID!");
      return;
    }
    try {
      const updateData = {
        ...editFormData,
        price: parseFloat(editFormData.price as string) || 0,
      };
      await updateTask({ taskId: editTaskId, updateData }).unwrap();
      toast.success("Task updated successfully!");
      setEditTaskId(null);
      setEditFormData(initialTaskState);
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to update task!");
      console.error(error);
    }
  };

  // Handle Form Change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Filter and Sort Tasks
  const filteredTasks = clientTasks.filter((task: any) => {
    const matchesSearch =
      task.taskTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.taskDescription?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "All Tasks" ||
      task.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchesCategory =
      selectedCategory === "All" ||
      task.serviceTitle?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const sortedTasks = [...filteredTasks].sort((a: any, b: any) => {
    if (sortBy === "Price: High to Low") {
      return (b.price || 0) - (a.price || 0);
    }
    if (sortBy === "Price: Low to High") {
      return (a.price || 0) - (b.price || 0);
    }
    return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
  });

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
          ${showSidebar ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 rounded-xl shadow-lg`}
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
            <label htmlFor="search" className="block text-gray-800 font-bold mb-3 text-lg">
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
                    {icon && <span className="text-2xl">{icon}</span>}
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
          {/* Task List */}
          {isLoading ? (
            <p className="text-center text-gray-600 text-xl font-semibold">Loading tasks...</p>
          ) : isError ? (
            <p className="text-center text-red-600 text-xl font-semibold">Error loading tasks!</p>
          ) : sortedTasks.length === 0 ? (
            <p className="text-center text-gray-600 text-xl font-semibold">No tasks found.</p>
          ) : (
            sortedTasks.map((task: any, idx: number) => (
              <AllClientTasks
                key={task._id || idx}
                task={task}
                idx={idx}
                handleReplySubmit={handleReplySubmit}
                handleCompleteStatus={handleCompleteStatus}
                handleEditTask={handleEditTask}
              />
            ))
          )}
        </main>
      </div>

      {/* Edit Task Modal */}
      {editTaskId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">Edit Task</h3>
              <button
                onClick={() => {
                  setEditTaskId(null);
                  setEditFormData(initialTaskState);
                }}
                className="text-2xl text-red-500 hover:text-red-600"
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="taskTitle" className="block text-gray-800 font-medium mb-1">
                    Task Title
                  </label>
                  <input
                    id="taskTitle"
                    type="text"
                    name="taskTitle"
                    placeholder="Task Title"
                    value={editFormData.taskTitle}
                    onChange={handleFormChange}
                    className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="price" className="block text-gray-800 font-medium mb-1">
                    Price
                  </label>
                  <input
                    id="price"
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={editFormData.price}
                    onChange={handleFormChange}
                    className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block text-gray-800 font-medium mb-1">
                    Location
                  </label>
                  <input
                    id="location"
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={editFormData.location}
                    onChange={handleFormChange}
                    className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="schedule" className="block text-gray-800 font-medium mb-1">
                    Schedule
                  </label>
                  <input
                    id="schedule"
                    type="text"
                    name="schedule"
                    placeholder="Schedule (e.g., Today)"
                    value={editFormData.schedule}
                    onChange={handleFormChange}
                    className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="taskDescription" className="block text-gray-800 font-medium mb-1">
                  Task Description
                </label>
                <textarea
                  id="taskDescription"
                  name="taskDescription"
                  placeholder="Task Description"
                  value={editFormData.taskDescription}
                  onChange={handleFormChange}
                  rows={4}
                  className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label htmlFor="additionalInfo" className="block text-gray-800 font-medium mb-1">
                  Additional Info
                </label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  placeholder="Additional Info"
                  value={editFormData.additionalInfo}
                  onChange={handleFormChange}
                  rows={2}
                  className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 py-3 text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-md"
                >
                  Update Task
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditTaskId(null);
                    setEditFormData(initialTaskState);
                  }}
                  className="flex-1 py-3 text-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-xl transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}