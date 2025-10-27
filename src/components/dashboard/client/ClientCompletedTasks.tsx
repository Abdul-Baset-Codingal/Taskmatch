/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import AllClientTasks from "./AllClientTasks";
import {
    useGetTasksByClientQuery,
    useReplyToCommentMutation,
    useUpdateTaskStatusMutation,
    useUpdateTaskMutation,
} from "@/features/api/taskApi";

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

const ClientCompletedTasks = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("Most Recent");
    const [replyText, setReplyText] = useState("");
    const [replyingTo, setReplyingTo] = useState(null);
    const [editTaskId, setEditTaskId] = useState<string | null>(null);
    const [editFormData, setEditFormData] = useState<TaskFormData>(initialTaskState);
    const [isRatingPopupOpen, setIsRatingPopupOpen] = useState(false);

    // @ts-ignore
    const { data: clientTasks = [], isLoading, isError } = useGetTasksByClientQuery();
    const [replyToComment] = useReplyToCommentMutation();
    const [updateTaskStatus] = useUpdateTaskStatusMutation();
    const [updateTask] = useUpdateTaskMutation();
    console.log(clientTasks)

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
            if (status === "completed") {
                setIsRatingPopupOpen(true);
            }
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

    // Filter and Sort Tasks - Only completed tasks
    const filteredTasks = clientTasks.filter((task: any) => {
        const matchesSearch =
            task.taskTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.taskDescription?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = task.status.toLowerCase() === "completed";
        return matchesSearch && matchesStatus;
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

    console.log(sortedTasks)

    return (
        <section className="min-h-screen bg-gradient-to-br from-[#F9FAFC] to-[#EDEEF2] p-6 md:p-8">
            {/* Top Filter Bar */}
            <div className=" top-[4.5rem] z-40 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-8 border border-[#8560F1]/10">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    {/* Search */}
                    <div className="relative w-full md:w-1/3">
                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="search"
                            placeholder="Search tasks by title or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 text-lg font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8560F1] transition-all duration-300"
                        />
                    </div>

                    {/* Sort By */}
                    <div className="w-full md:w-auto">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full md:w-48 px-4 py-3 rounded-xl border border-gray-300 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all duration-300"
                        >
                            {SORT_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Task List */}
            <main className="flex-1  lg:mx-auto lg:px-4 py-6">
                {isLoading ? (
                    <p className="text-center text-gray-600 text-xl font-semibold animate-pulse">Loading tasks...</p>
                ) : isError ? (
                    <p className="text-center text-red-600 text-xl font-semibold">Error loading tasks!</p>
                ) : sortedTasks.length === 0 ? (
                    <p className="text-center text-gray-600 text-xl font-semibold">No completed tasks found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 ">
                        {sortedTasks.map((task: any, idx: number) => (
                            <AllClientTasks
                                key={task._id || idx}
                                task={task}
                                idx={idx}
                                handleReplySubmit={handleReplySubmit}
                                handleCompleteStatus={handleCompleteStatus}
                                handleEditTask={handleEditTask} user={null} />
                        ))}
                    </div>
                )}
            </main>

            {/* Edit Task Modal */}
            {editTaskId && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fadeIn">
                        <button
                            onClick={() => {
                                setEditTaskId(null);
                                setEditFormData(initialTaskState);
                            }}
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition-colors duration-300"
                        >
                            <FaTimes className="text-2xl" />
                        </button>
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Edit Task</h3>
                        <form onSubmit={handleUpdateSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="taskTitle" className="block text-gray-800 font-medium mb-2">
                                        Task Title
                                    </label>
                                    <input
                                        id="taskTitle"
                                        type="text"
                                        name="taskTitle"
                                        placeholder="Task Title"
                                        value={editFormData.taskTitle}
                                        onChange={handleFormChange}
                                        className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8560F1] transition-all duration-300"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="price" className="block text-gray-800 font-medium mb-2">
                                        Price
                                    </label>
                                    <input
                                        id="price"
                                        type="number"
                                        name="price"
                                        placeholder="Price"
                                        value={editFormData.price}
                                        onChange={handleFormChange}
                                        className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8560F1] transition-all duration-300"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="location" className="block text-gray-800 font-medium mb-2">
                                        Location
                                    </label>
                                    <input
                                        id="location"
                                        type="text"
                                        name="location"
                                        placeholder="Location"
                                        value={editFormData.location}
                                        onChange={handleFormChange}
                                        className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8560F1] transition-all duration-300"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="schedule" className="block text-gray-800 font-medium mb-2">
                                        Schedule
                                    </label>
                                    <input
                                        id="schedule"
                                        type="text"
                                        name="schedule"
                                        placeholder="Schedule (e.g., Today)"
                                        value={editFormData.schedule}
                                        onChange={handleFormChange}
                                        className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8560F1] transition-all duration-300"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="taskDescription" className="block text-gray-800 font-medium mb-2">
                                    Task Description
                                </label>
                                <textarea
                                    id="taskDescription"
                                    name="taskDescription"
                                    placeholder="Task Description"
                                    value={editFormData.taskDescription}
                                    onChange={handleFormChange}
                                    rows={4}
                                    className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8560F1] transition-all duration-300"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="additionalInfo" className="block text-gray-800 font-medium mb-2">
                                    Additional Info
                                </label>
                                <textarea
                                    id="additionalInfo"
                                    name="additionalInfo"
                                    placeholder="Additional Info"
                                    value={editFormData.additionalInfo}
                                    onChange={handleFormChange}
                                    rows={2}
                                    className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8560F1] transition-all duration-300"
                                />
                            </div>
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-gradient-to-r from-[#8560F1] to-[#A78BFA] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                                >
                                    Update Task
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditTaskId(null);
                                        setEditFormData(initialTaskState);
                                    }}
                                    className="flex-1 py-3 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-all duration-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>


                </div>
            )}

            {/* Custom CSS for Animations */}
            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
        </section>
    );
};

export default ClientCompletedTasks;