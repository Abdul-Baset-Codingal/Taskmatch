/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";
import { useGetQuotesByTaskerIdQuery, useUpdateTaskStatusMutation } from "@/features/api/taskerApi";
import React, { useState, useEffect } from "react";
import { FaDollarSign, FaClock, FaCalendar, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";

interface Task {
    _id: string;
    taskTitle: string;
    taskDescription: string;
    status: string;
    tasker: { _id: string; firstName: string; lastName: string; email: string; role: string; phone: string };
    client: { _id: string; firstName: string; lastName: string; email: string; role: string };
    budget: number | null;
    location: string;
    preferredDateTime: string | null;
    urgency: string;
    createdAt: string;
    updatedAt: string;
}

const getStatusBadge = (status: string) => {
    const statusStyles: { [key: string]: string } = {
        pending: 'bg-yellow-100 text-yellow-800',
        accepted: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
    };
    return (
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

const TaskerQuotes = () => {
    const [user, setUser] = useState<{ _id: string; role: string } | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [updateTaskStatus, { isLoading: isUpdating }] = useUpdateTaskStatusMutation();

    const checkLoginStatus = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/verify-token`, {
                method: "GET",
                credentials: "include",
            });
            const text = await response.text();
            console.log("Verify token response:", text);
            if (response.ok) {
                const data = JSON.parse(text);
                console.log("Parsed user data:", data);
                setIsLoggedIn(true);
                setUser({ _id: data.user._id, role: data.user.role });
            } else {
                console.error("Verify token failed:", response.status, text);
                setIsLoggedIn(false);
                setUser(null);
            }
        } catch (error) {
            console.error("Error checking login status:", error);
            setIsLoggedIn(false);
            setUser(null);
        }
    };

    useEffect(() => {
        checkLoginStatus();
    }, []);

    // Fetch all quotes for the tasker
    const {
        data,
        isLoading,
        isError,
        error,
    } = useGetQuotesByTaskerIdQuery(
        user?._id || '',
        { skip: !user?._id }
    );

    // Ensure tasks is always an array
    const tasks = Array.isArray(data?.quotes) ? data.quotes : [];

    const updateStatus = async (taskId: string, status: string) => {
        try {
            await updateTaskStatus({ taskId, status }).unwrap();
            toast.success(`Task status updated to ${status}`);
        } catch (error) {
            console.error("Error updating task status:", error);
            toast.error("Failed to update task status");
        }
    };

    // Debug logs
    console.log("API response:", data);
    console.log("Tasks:", tasks);
    console.log("Error:", error);

    if (!isLoggedIn || !user || user.role !== "tasker") {
        return (
            <div className="text-center py-16 text-gray-400 text-lg font-medium">
                Please log in as a tasker to view your quotes.
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="text-center py-16 text-gray-400 text-lg font-medium animate-pulse">
                Loading quotes...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center py-16 text-red-400 text-lg font-medium">
                Failed to load quotes: {error?.data?.message || "Unknown error"}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="max-w-6xl mx-auto p-6">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                        Tasker Quotes
                    </h1>
                    <p className="text-gray-600 text-lg">Manage your service quotes efficiently</p>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-4 rounded-full"></div>
                </div>

                {tasks.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaCalendar className="w-12 h-12 text-gray-400" />
                        </div>
                        <p className="text-xl text-gray-500">No quotes found</p>
                        <p className="text-gray-400 mt-2">Your quotes will appear here</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {tasks.map((task: Task, index: number) => (
                            <div
                                key={task._id}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                    animation: 'fadeInUp 0.6s ease-out forwards',
                                }}
                            >
                                <div className="p-8">
                                    {/* Header Section */}
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                                                {task.taskTitle}
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed">{task.taskDescription}</p>
                                        </div>
                                        <div className="ml-6">{getStatusBadge(task.status)}</div>
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                    <FaDollarSign className="w-5 h-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Budget</p>
                                                    <p className="font-semibold text-gray-800">${task.budget || "N/A"}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <FaClock className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Urgency</p>
                                                    <p className="font-semibold text-gray-800">{task.urgency || "N/A"}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                                    <FaCalendar className="w-5 h-5 text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Scheduled Date</p>
                                                    <p className="font-semibold text-gray-800">
                                                        {task.preferredDateTime
                                                            ? new Date(task.preferredDateTime).toLocaleDateString('en-US', {
                                                                  weekday: 'short',
                                                                  year: 'numeric',
                                                                  month: 'short',
                                                                  day: 'numeric',
                                                                  hour: '2-digit',
                                                                  minute: '2-digit',
                                                              })
                                                            : "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                                    <FaUser className="w-5 h-5 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Client</p>
                                                    <p className="font-semibold text-gray-800">
                                                        {task.client?.firstName && task.client?.lastName
                                                            ? `${task.client.firstName} ${task.client.lastName}`
                                                            : "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Section */}
                                    <div className="flex lg:flex-row flex-col lg:gap-0 gap-4 justify-between items-center pt-6 border-t border-gray-100">
                                        <div className="text-sm text-gray-500">Quote ID: #{task._id}</div>
                                        <div className="flex items-center space-x-3">
                                            <label className="text-sm font-medium text-gray-700">Update Status:</label>
                                            <select
                                                value={task.status}
                                                onChange={(e) => updateStatus(task._id, e.target.value)}
                                                disabled={isUpdating}
                                                className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 min-w-[140px] font-medium"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="accepted">Accepted</option>
                                                <option value="rejected">Rejected</option>
                                                <option value="completed">Completed</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default TaskerQuotes;