/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { updateTaskField } from "@/features/taskForm/taskFormSlice";
import { usePostTaskMutation } from "@/features/api/taskApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";
import TaskConfirmationModal from "./TaskConfirmationModal";

type Props = {
    onBack: () => void;
    onContinue: () => void;
};

const UrgentTaskSchedule = ({ onBack, onContinue }: Props) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const taskForm = useSelector((state: RootState) => state.taskForm);

    // State
    const [timing, setTiming] = useState(taskForm.schedule || "Urgent");
    const [info, setInfo] = useState(taskForm.additionalInfo || "");
    const [offerDeadline, setOfferDeadline] = useState("1 Hour");
    const [customDeadline, setCustomDeadline] = useState<Date | null>(null);
    const [price, setPrice] = useState(taskForm.price || "");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [fullName, setFullName] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);

    const [selectedLoc, setSelectedLoc] = useState("");
    const [customLocation, setCustomLocation] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // RTK mutation hook
    const [postTask, { isLoading, isError, isSuccess }] = usePostTaskMutation();

    // Fetch login and user info
    const checkLoginStatus = async () => {
        try {
            const response = await fetch("https://taskmatch-backend.vercel.app/api/auth/verify-token", {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                setIsLoggedIn(true);
                setUserRole(data.user.role);
                setFullName(data.user.fullName);
                setUser(data.user);
            } else {
                setIsLoggedIn(false);
                setUserRole(null);
            }
        } catch (error) {
            setIsLoggedIn(false);
            setUserRole(null);
        }
    };

    useEffect(() => {
        checkLoginStatus();
    }, []);

    // Update Redux store when timing/info/price changes
    useEffect(() => {
        dispatch(updateTaskField({ field: "schedule", value: timing }));
        dispatch(updateTaskField({ field: "additionalInfo", value: info }));
        dispatch(updateTaskField({ field: "price", value: price }));
        if (customDeadline) {
            dispatch(updateTaskField({ field: "customDeadline", value: customDeadline.toISOString() }));
        }
    }, [timing, info, price, customDeadline, dispatch]);

    // Submit Handler (moved to UrgentTaskSummary)
    const handleContinue = () => {
        onContinue();
    };

    return (
        <div className="max-w-7xl mx-auto py-10 text-black bg-orange-50 rounded-b-2xl">
            <h2 className="text-3xl font-bold mb-6">2. Schedule</h2>
            <p className="text-lg mb-4">When do you need this done?</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <button
                    onClick={() => setTiming("Urgent")}
                    className={`border-2 rounded-xl p-6 text-center ${timing === "Urgent" ? "border-orange-500 bg-orange-100" : "border-gray-300"
                        }`}
                >
                    <div className="text-3xl mb-2">🔥</div>
                    <div className="text-lg font-semibold">Urgent</div>
                    <p className="text-sm">ASAP (+20% fee)</p>
                </button>

                <button
                    onClick={() => setTiming("Schedule")}
                    className={`border-2 rounded-xl p-6 text-center ${timing === "Schedule" ? "border-orange-500 bg-orange-100" : "border-gray-300"
                        }`}
                >
                    <div className="text-3xl mb-2">⏰</div>
                    <div className="text-lg font-semibold">Schedule</div>
                    <p className="text-sm">Custom time</p>
                </button>
            </div>

            {/* Custom DateTime Picker for "Schedule" */}
            {timing === "Schedule" && (
                <div className="mt-10">
                    <h3 className="text-lg font-bold mb-3 text-gray-800">
                        Select Scheduled Date <span className="text-red-500">*</span>
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Choose a specific date and time for your task to be scheduled.
                    </p>

                    <div className="mt-4 w-full mb-6">
                        <label className="block text-sm font-medium mb-1">Scheduled Date</label>
                        <DatePicker
                            selected={customDeadline}
                            onChange={(date: Date | null) => setCustomDeadline(date)}
                            showTimeSelect
                            timeIntervals={15}
                            dateFormat="Pp"
                            className="lg:w-[1200px] border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            placeholderText="Select schedule date and time..."
                        />
                    </div>
                </div>
            )}

            {/* Estimated Time */}
            <div>
                <label className="block text-sm font-medium mb-1">
                    Estimated Time (hours) <span className="text-red-500">*</span>
                </label>
                <input
                    type="number"
                    min="1"
                    value={taskForm.estimatedTime || ""}
                    onChange={(e) =>
                        dispatch(updateTaskField({ field: "estimatedTime", value: e.target.value }))
                    }
                    placeholder="e.g., 2"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <p className="text-sm text-gray-500 mt-1">
                    Estimate how long the task will take
                </p>
            </div>

            <div className="my-6 bg-orange-100 border border-orange-500 p-4 rounded-lg shadow-sm">
                <p className="text-lg font-semibold text-orange-500 mb-1">💰 Taskers will provide quotes</p>
                <p className="text-sm text-gray-700">
                    Taskers will review your task description and provide competitive quotes based on the details you provide.
                </p>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Additional Information (Optional)</label>
                <textarea
                    value={info}
                    onChange={(e) => setInfo(e.target.value)}
                    rows={4}
                    maxLength={500}
                    placeholder="Any other details we should know..."
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <div className="text-sm text-gray-500 mt-1">{info.length} / 500</div>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium mb-1">
                    Desired Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                    type="number"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter your budget for the task"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    required
                />
            </div>

            <div className="flex justify-between">
                <button onClick={onBack} className="text-orange-600 font-bold hover:underline">
                    ← Back
                </button>
                <button
                    onClick={handleContinue}
                    className="bg-gradient-to-r from-[#FF8906] to-[#FF8906] px-8 py-4 rounded-2xl font-bold text-white hover:shadow-lg hover:-translate-y-1 transition-transform duration-300"
                >
                    Continue
                </button>
            </div>

            {isError && (
                <p className="mt-4 text-red-600 font-semibold">
                    Error posting task. Please try again.
                </p>
            )}

            {isSuccess && (
                <p className="mt-4 text-green-600 font-semibold">
                    Task posted successfully!
                </p>
            )}
            <ToastContainer position="top-right" autoClose={3000} />
            <TaskConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={() => { }}
                taskForm={taskForm}
                timing={timing}
                price={price}
                info={info}
                isLoading={isLoading}
            />
        </div>
    );
};

export default UrgentTaskSchedule;