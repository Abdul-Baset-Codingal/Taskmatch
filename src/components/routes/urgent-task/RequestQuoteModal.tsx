/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/routes/urgent-task/RequestQuoteModal.tsx
"use client";
import { useState } from "react";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { useCreateRequestQuoteMutation } from "@/features/api/taskerApi";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";

interface Tasker {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    profilePicture: string;
    city: string;
    province: string;
    service: string;
    description: string;
    skills: string[];
    rate: number;
    availability: { day: string; from: string; to: string }[];
    experience: string;
    hasInsurance: boolean;
    backgroundCheckConsent: boolean;
    categories: string[];
    certifications: string[];
    qualifications: string[];
    serviceAreas: string[];
    services: { title: string; description: string; hourlyRate: number; estimatedDuration: string }[];
}

interface RequestQuoteModalProps {
    tasker: Tasker;
    isOpen: boolean;
    onClose: () => void;
}

const RequestQuoteModal: React.FC<RequestQuoteModalProps> = ({ tasker, isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        taskTitle: "",
        taskDescription: "",
        location: "",
        budget: "",
        dateTime: "",
        urgency: "Flexible - Whenever works",
        taskType: "In-Person",
    });
    const [createRequestQuote, { isLoading, error }] = useCreateRequestQuoteMutation();

    console.log('All Cookies:', Cookies.get()); // Debug: Shows isLoggedIn
    console.log('isLoggedIn:', Cookies.get('isLoggedIn')); // Debug: Shows true

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "taskType" ? { location: value === "Remote" ? "Remote" : "" } : {}),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.taskTitle || !formData.taskDescription || (!formData.location && formData.taskType !== "Remote")) {
            toast.error("Please fill in all required fields (Task Title, Description, Location)");
            return;
        }

        const quoteData = {
            taskerId: tasker._id,
            taskTitle: formData.taskTitle,
            taskDescription: formData.taskDescription,
            location: formData.taskType === "Remote" ? "Remote" : formData.location,
            budget: formData.budget || undefined,
            preferredDateTime: formData.dateTime || undefined,
            urgency: formData.urgency || undefined,
            taskType: formData.taskType,
        };

        console.log('Quote Data:', quoteData); // Debug

        try {
            const response = await createRequestQuote(quoteData).unwrap();
            console.log("Quote Request Response:", response);
            toast.success("Quote request submitted successfully!");
            onClose();
        } catch (err: any) {
            console.error("Error creating quote request:", err);
            toast.error(`Failed to submit quote request: ${err?.data?.message || "Unknown error"}`);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] animate-fade-in overflow-y-auto py-6">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 relative shadow-xl transform transition-all duration-300 scale-100 hover:scale-[1.02] sm:p-8">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-[#FF8609] transition-colors duration-200"
                    aria-label="Close modal"
                >
                    <FaTimes className="text-xl" />
                </button>
                <div className="max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 bg-clip-text  bg-gradient-to-r from-[#8560F1] to-[#E7B6FE]">
                        Request a Quote
                    </h2>
                    <div className="flex items-center gap-3 mb-6">
                        <Image
                            src={tasker.profilePicture || "/default-profile.png"}
                            alt={`${tasker.fullName}'s profile`}
                            width={48}
                            height={48}
                            className="rounded-full object-cover border-2 border-[#8560F1]"
                            priority
                        />
                        <div>
                            <p className="text-sm font-medium text-gray-600">Selected Tasker</p>
                            <p className="text-lg font-semibold text-[#8560F1]">{tasker.fullName}</p>
                            <p className="text-sm text-gray-500">{tasker.service}</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-6 italic">
                        This task will be visible only to {tasker.fullName} and yourself.
                    </p>
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Task Type *</label>
                            <select
                                name="taskType"
                                value={formData.taskType}
                                onChange={handleInputChange}
                                className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#8560F1] focus:ring-2 focus:ring-[#E7B6FE] transition-all duration-200 bg-white"
                                required
                            >
                                <option value="In-Person">In-Person</option>
                                <option value="Remote">Remote</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Task Title *</label>
                            <input
                                type="text"
                                name="taskTitle"
                                value={formData.taskTitle}
                                onChange={handleInputChange}
                                className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#8560F1] focus:ring-2 focus:ring-[#E7B6FE] transition-all duration-200"
                                placeholder="Brief description of what you need done"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Task Description *</label>
                            <textarea
                                name="taskDescription"
                                value={formData.taskDescription}
                                onChange={handleInputChange}
                                className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#8560F1] focus:ring-2 focus:ring-[#E7B6FE] transition-all duration-200"
                                placeholder="Provide detailed information about the task..."
                                rows={5}
                                required
                            />
                        </div>
                        {formData.taskType !== "Remote" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Location *</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#8560F1] focus:ring-2 focus:ring-[#E7B6FE] transition-all duration-200"
                                    placeholder="Enter your address or location"
                                    required
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Your Budget (Optional)</label>
                            <input
                                type="text"
                                name="budget"
                                value={formData.budget}
                                onChange={handleInputChange}
                                className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#8560F1] focus:ring-2 focus:ring-[#E7B6FE] transition-all duration-200"
                                placeholder="Enter your budget for this task"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Preferred Date & Time (Optional)</label>
                            <input
                                type="datetime-local"
                                name="dateTime"
                                value={formData.dateTime}
                                onChange={handleInputChange}
                                className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#8560F1] focus:ring-2 focus:ring-[#E7B6FE] transition-all duration-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Urgency Level</label>
                            <select
                                name="urgency"
                                value={formData.urgency}
                                onChange={handleInputChange}
                                className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#8560F1] focus:ring-2 focus:ring-[#E7B6FE] transition-all duration-200"
                            >
                                <option value="Flexible - Whenever works">Flexible - Whenever works</option>
                                <option value="Within a week">Within a week</option>
                                <option value="As soon as possible">As soon as possible</option>
                            </select>
                        </div>
                        {error && (
                            <p className="text-red-500 text-sm font-medium">
                                Error: {'data' in error ? (error.data as any)?.message || "Failed to submit quote request" : "Failed to submit quote request"}
                            </p>
                        )}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] text-white py-3 rounded-lg font-semibold shadow-md hover:from-[#FF8609] hover:to-[#FF6C32] transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Submitting..." : "Submit Quote Request"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RequestQuoteModal;