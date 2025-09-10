

/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { usePostTaskMutation } from "@/features/api/taskApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import TaskConfirmationModal from "./TaskConfirmationModal";

type Props = {
    onBack: () => void;
};

const UrgentTaskSummary = ({ onBack }: Props) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const taskForm = useSelector((state: RootState) => state.taskForm);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [postTask, { isLoading, isError, isSuccess }] = usePostTaskMutation();

    // Submit Handler
    const handleSubmit = async () => {
        const formData = new FormData();

        formData.append("serviceId", taskForm.serviceId || "");
        formData.append("serviceTitle", taskForm.serviceTitle || "");
        formData.append("taskTitle", taskForm.taskTitle || "");
        formData.append("estimatedTime", taskForm.estimatedTime ? String(taskForm.estimatedTime) : "1");
        formData.append("taskDescription", taskForm.taskDescription || "");
        formData.append("location", taskForm.location || "");
        formData.append("schedule", taskForm.schedule || "");
        formData.append("extraCharge", (taskForm.schedule === "Urgent").toString());
        formData.append("additionalInfo", taskForm.additionalInfo || "");
        formData.append("price", taskForm.price || "");
        formData.append("client", "689f3ddaed8035bd0d9d77e7");

        // Handle offerDeadline
        let finalDeadline: Date | null = null;
        const now = new Date();
        if (taskForm.schedule === "Today") {
            switch (taskForm.offerDeadline) {
                case "1 Hour":
                    finalDeadline = new Date(now.getTime() + 1 * 60 * 60 * 1000);
                    break;
                case "3 Hours":
                    finalDeadline = new Date(now.getTime() + 3 * 60 * 60 * 1000);
                    break;
                case "6 Hours":
                    finalDeadline = new Date(now.getTime() + 6 * 60 * 60 * 1000);
                    break;
                case "12 Hours":
                    finalDeadline = new Date(now.getTime() + 12 * 60 * 60 * 1000);
                    break;
                case "24 Hours":
                    finalDeadline = new Date(now.getTime() + 24 * 60 * 60 * 1000);
                    break;
                default:
                    finalDeadline = null;
            }
        } else if (
            taskForm.schedule === "Schedule" &&
            typeof taskForm.customDeadline === "string" &&
            taskForm.customDeadline
        ) {
            finalDeadline = new Date(taskForm.customDeadline);
        }

        if (finalDeadline) {
            formData.append("offerDeadline", finalDeadline.toISOString());
        }

        taskForm.photos.forEach((file: string | Blob) => {
            if (file instanceof Blob) {
                formData.append("photos", file);
            }
        });

        if (taskForm.video) {
            formData.append("video", taskForm.video);
        }

        try {
            await postTask(formData).unwrap();
            toast.success("Task posted successfully!", {
                onClose: () => router.push("/dashboard/client"),
                autoClose: 2000,
            });
        } catch (err) {
            console.error("Error posting task:", JSON.stringify(err, null, 2));
            toast.error("Failed to post task.", {
                onClose: () => router.push("/authentication"),
                autoClose: 2000,
            });
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-10 text-black bg-orange-50 rounded-b-2xl">
            <h2 className="text-3xl font-bold mb-6">3. Task Summary</h2>
            <p className="text-lg mb-4">Review your task details before posting.</p>

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
                            <p className="text-orange-600 capitalize">{taskForm.schedule || "Not specified"}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <span className="text-xl">💰</span>
                        <div>
                            <p className="font-semibold">Budget</p>
                            <p className="text-gray-500">{taskForm.price ? `$${taskForm.price}` : "Taskers will provide quotes"}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <span className="text-xl">📝</span>
                        <div>
                            <p className="font-semibold">Task Title</p>
                            <p className="text-gray-500">{taskForm.taskTitle || "Not specified"}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <span className="text-xl">📜</span>
                        <div>
                            <p className="font-semibold">Description</p>
                            <p className="text-gray-500">{taskForm.taskDescription || "Not specified"}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <span className="text-xl">⏰</span>
                        <div>
                            <p className="font-semibold">Estimated Time</p>
                            <p className="text-gray-500">{taskForm.estimatedTime ? `${taskForm.estimatedTime} hours` : "Not specified"}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <span className="text-xl">ℹ️</span>
                        <div>
                            <p className="font-semibold">Additional Information</p>
                            <p className="text-gray-500">{taskForm.additionalInfo || "None provided"}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between">
                
                <button onClick={onBack} className="text-orange-600 font-bold hover:underline">
                    ← Back
                </button>
                <button
                    onClick={() => setIsModalOpen(true)}
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
            <TaskConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleSubmit}
                taskForm={taskForm}
                timing={taskForm.schedule || ""}
                price={taskForm.price || ""}
                info={taskForm.additionalInfo || ""}
                isLoading={isLoading}
            />
        </div>
    );
};

export default UrgentTaskSummary;