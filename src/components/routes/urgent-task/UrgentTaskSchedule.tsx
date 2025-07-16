/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store"; // Adjust path to your store
import { updateTaskField } from "@/features/taskForm/taskFormSlice";
import { usePostTaskMutation } from "@/features/api/taskApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
    onBack: () => void;
};

const UrgentTaskSchedule = ({ onBack }: Props) => {
    const dispatch = useDispatch();

    // Get form data from redux state
    const taskForm = useSelector((state: RootState) => state.taskForm);

    // Local state for schedule and additional info
    const [timing, setTiming] = useState(taskForm.schedule || "Urgent");
    const [info, setInfo] = useState(taskForm.additionalInfo || "");
    const [offerDeadline, setOfferDeadline] = useState("1 Hour");
    const [customDeadline, setCustomDeadline] = useState<Date | null>(null);
    const [price, setPrice] = useState(taskForm.price || "");

    // RTK mutation hook
    const [postTask, { isLoading, isError, isSuccess }] = usePostTaskMutation();

    // Update Redux store whenever timing or info changes
    useEffect(() => {
        dispatch(updateTaskField({ field: "schedule", value: timing }));
        dispatch(updateTaskField({ field: "additionalInfo", value: info }));
        dispatch(updateTaskField({ field: "price", value: price }));
    }, [timing, price, info, dispatch]);

    // Prepare data and submit
    const handleSubmit = async () => {
        // Build FormData to handle files (photos & video)
        const formData = new FormData();

        formData.append("serviceId", taskForm.serviceId);
        formData.append("serviceTitle", taskForm.serviceTitle);
        formData.append("taskTitle", taskForm.taskTitle);
        formData.append("taskDescription", taskForm.taskDescription);
        formData.append("location", taskForm.location);
        formData.append("schedule", timing);
        formData.append("extraCharge", (timing === "Urgent").toString());
        formData.append("additionalInfo", info);
        formData.append("offerDeadline", offerDeadline);
        formData.append("price", price);
        if (offerDeadline === "Custom" && customDeadline) {
            formData.append("customDeadline", customDeadline.toISOString());
        }

        // Append photos files
        taskForm.photos.forEach((photoFile: string | Blob, i: any) => {
            formData.append("photos", photoFile);
        });

        // Append video file if any
        if (taskForm.video) {
            formData.append("video", taskForm.video);
        }

        try {
            await postTask(formData).unwrap();
            toast.success("Task posted successfully!");
        } catch (err) {
            toast.error("Failed to post task.");
            console.error(err);
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-10 text-black bg-orange-50 rounded-b-2xl">
            <h2 className="text-3xl font-bold mb-6">3. Schedule</h2>
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
                    onClick={() => setTiming("Today")}
                    className={`border-2 rounded-xl p-6 text-center ${timing === "Today" ? "border-orange-500 bg-orange-100" : "border-gray-300"
                        }`}
                >
                    <div className="text-3xl mb-2">📅</div>
                    <div className="text-lg font-semibold">Today</div>
                    <p className="text-sm">Within 24h</p>
                </button>

                <button
                    onClick={() => setTiming("Tomorrow")}
                    className={`border-2 rounded-xl p-6 text-center ${timing === "Tomorrow" ? "border-orange-500 bg-orange-100" : "border-gray-300"
                        }`}
                >
                    <div className="text-3xl mb-2">⏰</div>
                    <div className="text-lg font-semibold">Tomorrow</div>
                    <p className="text-sm">Next Day</p>
                </button>
            </div>

            {/* 🕒 Offer Deadline Selection */}
            {timing !== "Urgent" && (
                <div className="mt-10">
                    <h3 className="text-lg font-bold mb-3 text-gray-800">
                        Offer Deadline <span className="text-red-500">*</span>
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Set a deadline for taskers to submit their offers. This helps you get timely responses.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        {[
                            { label: "1 Hour", icon: "⚡", note: "Quick turnaround" },
                            { label: "3 Hours", icon: "🕒", note: "Good response time" },
                            { label: "6 Hours", icon: "⏰", note: "More options" },
                            { label: "12 Hours", icon: "📅", note: "Balanced" },
                            { label: "24 Hours", icon: "🗓️", note: "Maximum choices" },
                            { label: "Custom", icon: "✏️", note: "Set specific time" },
                        ].map((item) => (
                            <button
                                key={item.label}
                                onClick={() => setOfferDeadline(item.label)}
                                className={`border-2 rounded-xl p-4 text-left transition ${offerDeadline === item.label
                                    ? "border-orange-500 bg-orange-100"
                                    : "border-gray-300"
                                    }`}
                            >
                                <div className="text-xl mb-1">{item.icon}</div>
                                <div className="font-semibold">{item.label}</div>
                                <p className="text-sm text-gray-600">{item.note}</p>
                            </button>
                        ))}
                    </div>

                    {/* Custom DateTime Picker */}
                    {offerDeadline === "Custom" && (
                        <div className="mt-4 w-full mb-6 ">
                            <label className="block text-sm font-medium mb-1">Select Deadline</label>
                            <DatePicker
                                selected={customDeadline}
                                onChange={(date: Date | null) => setCustomDeadline(date)}
                                showTimeSelect
                                timeIntervals={15}
                                dateFormat="Pp"
                                className="lg:w-[1200px] border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                placeholderText="Select custom deadline..."
                            />
                        </div>
                    )}
                </div>
            )}
            <div className="mb-6">
                <h3 className="text-lg font-bold mb-3 text-gray-800">📍 Tell us where</h3>
                <div className="flex gap-4 flex-wrap">
                    {["At My Location", "Other", "Remote"].map((loc) => (
                        <button
                            key={loc}
                            onClick={() =>
                                dispatch(updateTaskField({ field: "location", value: loc }))
                            }
                            className={`border-2 rounded-xl px-6 py-3 text-sm font-semibold ${taskForm.location === loc
                                ? "border-orange-500 bg-orange-100"
                                : "border-gray-300"
                                }`}
                        >
                            {loc}
                        </button>
                    ))}
                </div>
            </div>


            <div className="mb-6 bg-orange-100 border border-orange-500 p-4 rounded-lg shadow-sm">
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

            <div className="bg-gradient-to-br from-white to-orange-50 p-6 rounded-2xl shadow-xl border border-orange-200 mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">📝 Task Summary</h3>

                <div className="grid md:grid-cols-2 gap-6 text-gray-700 text-base">
                    <div className="flex items-start gap-3">
                        <span className="text-xl">🔧</span>
                        <div>
                            <p className="font-semibold">Service</p>
                            <p className="text-orange-600">{taskForm.serviceTitle || "Not specified"}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <span className="text-xl">📍</span>
                        <div>
                            <p className="font-semibold">Location</p>
                            <p className="text-gray-500">{taskForm.location || "Not specified"}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <span className="text-xl">⏱️</span>
                        <div>
                            <p className="font-semibold">Timing</p>
                            <p className="text-orange-600 capitalize">{timing}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <span className="text-xl">💰</span>
                        <div>
                            <p className="font-semibold">Budget</p>
                            <p className="text-gray-500">Taskers will provide quotes</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between">
                <button onClick={onBack} className="text-orange-600 font-bold hover:underline">
                    ← Back
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-[#FF8906] to-[#FF8906] px-8 py-4 rounded-2xl font-bold text-white hover:shadow-lg hover:-translate-y-1 transition-transform duration-300 disabled:opacity-50"
                >
                    {isLoading ? "Posting..." : "⚡ Post My URGENT Task"}
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

        </div>
    );
};

export default UrgentTaskSchedule;
