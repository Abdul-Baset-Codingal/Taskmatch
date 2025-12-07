/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useMemo } from "react";
import {
  FaSearch,
  FaTimes,
  FaFilter,
  FaSortAmountDown,
  FaTasks,
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaChevronDown,
  FaPlus,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaLaptop,
  FaUser
} from "react-icons/fa";
import { toast } from "react-toastify";
import AllClientTasks from "./AllClientTasks";
import {
  useGetTasksByClientQuery,
  useReplyToCommentMutation,
  useUpdateTaskStatusMutation,
  useUpdateTaskMutation,
} from "@/features/api/taskApi";
import Link from "next/link";

// Status mapping for frontend labels to backend statuses
const STATUS_MAP: { [key: string]: string } = {
  Pending: "pending",
  Completed: "completed",
  Requested: "requested",
};

const SORT_OPTIONS = [
  { value: "Most Recent", label: "Most Recent", icon: FaClock },
  { value: "Price: High to Low", label: "Price: High to Low", icon: FaSortAmountDown },
  { value: "Price: Low to High", label: "Price: Low to High", icon: FaSortAmountDown },
];

// Location and Schedule type options
const LOCATION_TYPES = [
  { value: "remote", label: "Remote", icon: FaLaptop },
  { value: "in-person", label: "In-Person", icon: FaUser },
];

const SCHEDULE_TYPES = [
  { value: "flexible", label: "Flexible", icon: FaClock },
  { value: "scheduled", label: "Scheduled", icon: FaCalendarAlt },
];

type TaskFormData = {
  taskTitle: string;
  taskDescription: string;
  price: number | string;
  locationType: string;
  address: string;
  scheduleType: string;
  scheduledDateTime: string;
  additionalInfo: string;
};

const initialTaskState: TaskFormData = {
  taskTitle: "",
  taskDescription: "",
  price: "",
  locationType: "",
  address: "",
  scheduleType: "",
  scheduledDateTime: "",
  additionalInfo: "",
};

// Validate MongoDB ObjectId
const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

// Helper function to parse existing location
const parseLocation = (location: string): { type: string; address: string } => {
  if (!location || location.toLowerCase() === "remote") {
    return { type: "remote", address: "" };
  }
  return { type: "in-person", address: location };
};

// Helper function to parse existing schedule
const parseSchedule = (schedule: string): { type: string; dateTime: string } => {
  if (!schedule || schedule.toLowerCase() === "flexible") {
    return { type: "flexible", dateTime: "" };
  }
  // Check if it's a valid date string
  const date = new Date(schedule);
  if (!isNaN(date.getTime())) {
    // Format for datetime-local input
    const formatted = date.toISOString().slice(0, 16);
    return { type: "scheduled", dateTime: formatted };
  }
  // If it's not "flexible" but also not a valid date, treat as scheduled with the value
  return { type: "scheduled", dateTime: schedule };
};

export default function TaskListSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Tasks");
  const [sortBy, setSortBy] = useState("Most Recent");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<TaskFormData>(initialTaskState);
  const [isRatingPopupOpen, setIsRatingPopupOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // @ts-ignore
  const { data: clientTasks = [], isLoading, isError } = useGetTasksByClientQuery();
  const [replyToComment] = useReplyToCommentMutation();
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const [updateTask] = useUpdateTaskMutation();

  // Compute dynamic TASK_STATUS counts
  const TASK_STATUS = useMemo(() => {
    const statusCounts = clientTasks.reduce(
      (acc: { [key: string]: number }, task: any) => {
        const status = task.status || "unknown";
        const label =
          Object.keys(STATUS_MAP).find((key) => STATUS_MAP[key] === status) ||
          status.charAt(0).toUpperCase() + status.slice(1);
        acc[label] = (acc[label] || 0) + 1;
        return acc;
      },
      { "All Tasks": clientTasks.length }
    );

    return [
      { label: "All Tasks", count: statusCounts["All Tasks"] || 0, icon: FaClipboardList, color: "bg-[#063A41]" },
      { label: "Pending", count: statusCounts["Pending"] || 0, icon: FaClock, color: "bg-amber-500" },
      { label: "Completed", count: statusCounts["Completed"] || 0, icon: FaCheckCircle, color: "bg-[#109C3D]" },
      { label: "Requested", count: statusCounts["Requested"] || 0, icon: FaExclamationCircle, color: "bg-blue-500" },
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
      if (status === "completed") {
        setIsRatingPopupOpen(true);
      }
    } catch (err) {
      toast.error("Failed to update status!");
    }
  };

  // Handle Edit Task
  const handleEditTask = (task: any) => {
    if (!isValidObjectId(task._id)) {
      toast.error("Invalid task ID!");
      return;
    }

    const parsedLocation = parseLocation(task.location || "");
    const parsedSchedule = parseSchedule(task.schedule || "");

    setEditTaskId(task._id);
    setEditFormData({
      taskTitle: task.taskTitle || "",
      taskDescription: task.taskDescription || "",
      price: task.price || "",
      locationType: parsedLocation.type,
      address: parsedLocation.address,
      scheduleType: parsedSchedule.type,
      scheduledDateTime: parsedSchedule.dateTime,
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

    // Validate conditional fields
    if (editFormData.locationType === "in-person" && !editFormData.address.trim()) {
      toast.error("Please enter an address for in-person location!");
      return;
    }
    if (editFormData.scheduleType === "scheduled" && !editFormData.scheduledDateTime) {
      toast.error("Please select a date and time for scheduled tasks!");
      return;
    }

    try {
      // Format location and schedule for API
      const location = editFormData.locationType === "remote"
        ? "Remote"
        : editFormData.address;

      const schedule = editFormData.scheduleType === "flexible"
        ? "Flexible"
        : editFormData.scheduledDateTime;

      const updateData = {
        taskTitle: editFormData.taskTitle,
        taskDescription: editFormData.taskDescription,
        price: parseFloat(editFormData.price as string) || 0,
        location,
        schedule,
        additionalInfo: editFormData.additionalInfo,
      };

      await updateTask({ taskId: editTaskId, updateData }).unwrap();
      toast.success("Task updated successfully!");
      setEditTaskId(null);
      setEditFormData(initialTaskState);
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to update task!");
    }
  };

  // Handle Form Change
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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
      task.status.toLowerCase() === STATUS_MAP[selectedStatus] ||
      task.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const sortedTasks = [...filteredTasks].sort((a: any, b: any) => {
    if (sortBy === "Price: High to Low") {
      return (b.price || 0) - (a.price || 0);
    }
    if (sortBy === "Price: Low to High") {
      return (a.price || 0) - (b.price || 0);
    }
    return (
      new Date(b.updatedAt || b.createdAt).getTime() -
      new Date(a.updatedAt || a.createdAt).getTime()
    );
  });

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header Section */}
      <div className="bg-[#063A41] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
                <FaTasks className="text-[#109C3D]" />
                My Tasks
              </h1>
              <p className="text-white/70 mt-1 text-sm sm:text-base">
                Manage and track all your posted tasks
              </p>
            </div>
            <Link href={'/urgent-task?search=general%20service'}>
              <button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#109C3D] hover:bg-[#0d8a35] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-[#109C3D]/20">
                <FaPlus className="text-sm" />
                Post New Task
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {TASK_STATUS.map(({ label, count, icon: Icon, color }) => (
            <button
              key={label}
              onClick={() => setSelectedStatus(label)}
              className={`relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm border-2 transition-all duration-200 hover:shadow-md ${selectedStatus === label
                ? "border-[#109C3D] shadow-md"
                : "border-transparent hover:border-gray-200"
                }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className="text-white text-lg sm:text-xl" />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-xs text-gray-500 truncate">{label}</p>
                  <p className="text-xl sm:text-2xl font-bold text-[#063A41]">{count}</p>
                </div>
              </div>
              {selectedStatus === label && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#109C3D] rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#109C3D]/20 focus:border-[#109C3D] transition-all duration-200"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Filter Actions */}
            <div className="flex items-center gap-3">
              {/* Active Filter Indicator */}
              {selectedStatus !== "All Tasks" && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-[#E5FFDB] text-[#063A41] rounded-lg text-sm">
                  <span>Filtered by:</span>
                  <span className="font-semibold">{selectedStatus}</span>
                  <button
                    onClick={() => setSelectedStatus("All Tasks")}
                    className="ml-1 hover:text-red-600 transition-colors"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                </div>
              )}

              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm font-medium text-[#063A41] transition-colors border border-gray-200"
                >
                  <FaSortAmountDown className="text-[#109C3D]" />
                  <span className="hidden sm:inline">{sortBy}</span>
                  <FaChevronDown className={`text-xs transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                </button>

                {isSortOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsSortOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      {SORT_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setIsSortOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${sortBy === option.value
                            ? "bg-[#E5FFDB] text-[#063A41] font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                          <option.icon className={sortBy === option.value ? "text-[#109C3D]" : "text-gray-400"} />
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task List */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-[#E5FFDB] border-t-[#109C3D] rounded-full animate-spin mb-4" />
            <p className="text-[#063A41] font-medium">Loading your tasks...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-red-100">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <FaExclamationCircle className="text-red-500 text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Tasks</h3>
            <p className="text-gray-500 text-sm">Something went wrong. Please try again later.</p>
          </div>
        ) : sortedTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="w-20 h-20 bg-[#E5FFDB] rounded-full flex items-center justify-center mb-4">
              <FaClipboardList className="text-[#109C3D] text-3xl" />
            </div>
            <h3 className="text-lg font-semibold text-[#063A41] mb-2">No Tasks Found</h3>
            <p className="text-gray-500 text-sm text-center max-w-sm mb-6">
              {searchTerm
                ? `No tasks matching "${searchTerm}"`
                : selectedStatus !== "All Tasks"
                  ? `No ${selectedStatus.toLowerCase()} tasks at the moment`
                  : "You haven't posted any tasks yet. Start by creating your first task!"}
            </p>
            <Link href={'/urgent-task?search=general%20service'}>
              <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#109C3D] hover:bg-[#0d8a35] text-white font-semibold rounded-xl transition-colors">
                <FaPlus className="text-sm" />
                Post Your First Task
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                Showing <span className="font-semibold text-[#063A41]">{sortedTasks.length}</span>{" "}
                {sortedTasks.length === 1 ? "task" : "tasks"}
              </p>
            </div>

            {/* Tasks Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {sortedTasks.map((task: any, idx: number) => (
                <AllClientTasks
                  key={task._id || idx}
                  task={task}
                  idx={idx}
                  handleReplySubmit={handleReplySubmit}
                  handleCompleteStatus={handleCompleteStatus}
                  handleEditTask={handleEditTask}
                  user={null}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Edit Task Modal */}
      {editTaskId && (
        <div
          className="fixed inset-0 bg-[#063A41]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            setEditTaskId(null);
            setEditFormData(initialTaskState);
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-modalSlide"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#063A41] px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <FaTasks className="text-[#109C3D]" />
                Edit Task
              </h3>
              <button
                onClick={() => {
                  setEditTaskId(null);
                  setEditFormData(initialTaskState);
                }}
                className="text-white/70 hover:text-white transition-colors p-1"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleUpdateSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-5">
                {/* Task Title */}
                <div>
                  <label htmlFor="taskTitle" className="block text-sm font-medium text-[#063A41] mb-2">
                    Task Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="taskTitle"
                    type="text"
                    name="taskTitle"
                    placeholder="Enter task title"
                    value={editFormData.taskTitle}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#109C3D] focus:ring-0 transition-colors text-[#063A41] placeholder-gray-400"
                    required
                  />
                </div>

                {/* Price */}
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-[#063A41] mb-2">
                    Budget ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="price"
                    type="number"
                    name="price"
                    placeholder="0.00"
                    value={editFormData.price}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#109C3D] focus:ring-0 transition-colors text-[#063A41] placeholder-gray-400"
                    required
                  />
                </div>

                {/* Location Type Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-[#063A41]">
                    Location Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {LOCATION_TYPES.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setEditFormData(prev => ({
                            ...prev,
                            locationType: option.value,
                            address: option.value === "remote" ? "" : prev.address
                          }))}
                          className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${editFormData.locationType === option.value
                              ? "border-[#109C3D] bg-[#E5FFDB] text-[#063A41]"
                              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                            }`}
                        >
                          <Icon className={`text-lg ${editFormData.locationType === option.value ? "text-[#109C3D]" : "text-gray-400"}`} />
                          <span className="font-medium">{option.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Address Field - Shows only when In-Person is selected */}
                  {editFormData.locationType === "in-person" && (
                    <div className="animate-fadeIn">
                      <label htmlFor="address" className="block text-sm font-medium text-[#063A41] mb-2">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          id="address"
                          type="text"
                          name="address"
                          placeholder="Enter full address (e.g., 123 Main St, New York, NY 10001)"
                          value={editFormData.address}
                          onChange={handleFormChange}
                          className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#109C3D] focus:ring-0 transition-colors text-[#063A41] placeholder-gray-400"
                          required={editFormData.locationType === "in-person"}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Schedule Type Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-[#063A41]">
                    Schedule <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {SCHEDULE_TYPES.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setEditFormData(prev => ({
                            ...prev,
                            scheduleType: option.value,
                            scheduledDateTime: option.value === "flexible" ? "" : prev.scheduledDateTime
                          }))}
                          className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${editFormData.scheduleType === option.value
                              ? "border-[#109C3D] bg-[#E5FFDB] text-[#063A41]"
                              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                            }`}
                        >
                          <Icon className={`text-lg ${editFormData.scheduleType === option.value ? "text-[#109C3D]" : "text-gray-400"}`} />
                          <span className="font-medium">{option.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Date Time Field - Shows only when Scheduled is selected */}
                  {editFormData.scheduleType === "scheduled" && (
                    <div className="animate-fadeIn">
                      <label htmlFor="scheduledDateTime" className="block text-sm font-medium text-[#063A41] mb-2">
                        Date & Time <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaCalendarAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          id="scheduledDateTime"
                          type="datetime-local"
                          name="scheduledDateTime"
                          value={editFormData.scheduledDateTime}
                          onChange={handleFormChange}
                          min={new Date().toISOString().slice(0, 16)}
                          className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#109C3D] focus:ring-0 transition-colors text-[#063A41] placeholder-gray-400"
                          required={editFormData.scheduleType === "scheduled"}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Task Description */}
                <div>
                  <label htmlFor="taskDescription" className="block text-sm font-medium text-[#063A41] mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="taskDescription"
                    name="taskDescription"
                    placeholder="Describe your task in detail..."
                    value={editFormData.taskDescription}
                    onChange={handleFormChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#109C3D] focus:ring-0 transition-colors text-[#063A41] placeholder-gray-400 resize-none"
                    required
                  />
                </div>

                {/* Additional Info */}
                <div>
                  <label htmlFor="additionalInfo" className="block text-sm font-medium text-[#063A41] mb-2">
                    Additional Information
                  </label>
                  <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    placeholder="Any extra details or requirements..."
                    value={editFormData.additionalInfo}
                    onChange={handleFormChange}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#109C3D] focus:ring-0 transition-colors text-[#063A41] placeholder-gray-400 resize-none"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditTaskId(null);
                    setEditFormData(initialTaskState);
                  }}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 text-[#063A41] font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#109C3D] hover:bg-[#0d8a35] text-white font-semibold rounded-xl transition-colors shadow-lg shadow-[#109C3D]/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes modalSlide {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-modalSlide {
          animation: modalSlide 0.3s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </section>
  );
}