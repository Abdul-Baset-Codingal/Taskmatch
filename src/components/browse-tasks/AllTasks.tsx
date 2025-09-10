
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";
import React, { useState } from "react";
import { FaTasks, FaDollarSign, FaMapMarkerAlt, FaClock, FaTools, FaInfoCircle, FaExclamationCircle, FaEye } from "react-icons/fa";
import TaskDetailsModal from "./TaskDetailsModal";

const AllTasks = ({ tasks, isLoading, error, selectedTask, onTaskSelect }) => {
    const [modalTask, setModalTask] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    console.log(tasks);

    const openModal = (task) => {
        setModalTask(task);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalTask(null);
    };

    const handleTaskClick = (task) => {
        onTaskSelect(task);
    };

    if (isLoading) return (
        <div className="flex justify-center items-center h-full">
            <div className="text-lg font-semibold text-white bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] px-6 py-3 rounded-lg animate-pulse flex items-center gap-2">
                <FaTasks className="text-xl animate-spin" />
                Loading...
            </div>
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center h-full">
            <div className="text-lg font-semibold text-white bg-gradient-to-r from-[#F48B0C] to-[#E7B6FE] px-6 py-3 rounded-lg flex items-center gap-2">
                <FaExclamationCircle className="text-xl" />
                Error: {error.message}
            </div>
        </div>
    );

    if (!tasks || tasks.length === 0) return (
        <div className="flex justify-center items-center h-full">
            <div className="text-lg font-semibold text-white bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] px-6 py-3 rounded-lg flex items-center gap-2">
                <FaTasks className="text-xl" />
                No tasks available.
            </div>
        </div>
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <>
            <div className="p-8 max-w-3xl mx-auto h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-[#8560F1] scrollbar-track-gray-100">
                <div className="space-y-6">
                    {tasks.map((task) => (
                        <div
                            key={task._id}
                            className={`bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border-2 cursor-pointer ${selectedTask?._id === task._id
                                ? 'border-[#8560F1] bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] p-[3px]'
                                : 'border-transparent bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] p-[2px]'
                                }`}
                            onClick={() => handleTaskClick(task)}
                        >
                            <div className="bg-white rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <FaTasks className="text-2xl text-[#8560F1] animate-bounce" />
                                    <h3 className="text-xl font-extrabold text-gray-900 truncate flex-1">{task.taskTitle}</h3>
                                    {selectedTask?._id === task._id && (
                                        <span className="text-xs text-white bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] px-2 py-1 rounded-full">
                                            Selected
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mb-3 text-gray-700">
                                    <FaTools className="text-lg text-[#8560F1] animate-pulse" />
                                    <span className="text-base font-semibold">{task.serviceTitle}</span>
                                </div>
                                <p className="text-gray-600 mb-4 text-base leading-relaxed line-clamp-3">{task.taskDescription}</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                    <div className="flex items-center gap-2">
                                        <FaDollarSign className="text-lg text-[#F48B0C]" />
                                        <span className="font-bold text-xl">{task.price}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-lg text-[#8560F1]" />
                                        <span className="text-base text-gray-600 truncate">{task.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaClock className="text-lg text-[#8560F1]" />
                                        <span className="text-base text-gray-600">{task.schedule}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaInfoCircle className="text-lg text-[#8560F1]" />
                                        <span className="text-base text-gray-600 capitalize">
                                            Status: <span className={`font-semibold ${task.status === "pending" ? "text-yellow-500" : "text-green-500"}`}>{task.status}</span>
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                                    <FaClock className="text-base" />
                                    <span>Posted: {formatDate(task.createdAt)}</span>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent task selection when clicking details button
                                        openModal(task);
                                    }}
                                    className="flex items-center gap-2 text-white bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] px-4 py-2 rounded-full hover:from-[#F48B0C] hover:to-[#E7B6FE] transition-all duration-300 transform hover:scale-105 shadow-lg"
                                >
                                    <FaEye className="text-lg" />
                                    <span>View Details</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Task Details Modal */}
            <TaskDetailsModal
                task={modalTask}
                isOpen={isModalOpen}
                onClose={closeModal}
            />
        </>
    );
};

export default AllTasks;