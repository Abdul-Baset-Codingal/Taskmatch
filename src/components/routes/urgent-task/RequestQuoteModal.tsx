/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/routes/urgent-task/RequestQuoteModal.tsx
"use client";
import { useState } from "react";
import Image from "next/image";
import { FaTimes, FaUser, FaQuoteLeft, FaMapMarkerAlt, FaDollarSign, FaClock, FaExclamationTriangle } from "react-icons/fa";
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] animate-fade-in p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full relative shadow-2xl transform transition-all duration-300 scale-100 hover:scale-105 max-h-[90vh] overflow-y-auto border border-gray-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-color1 transition-all duration-200"
                    aria-label="Close modal"
                >
                    <FaTimes className="text-xl" />
                </button>
                <h2 className="text-xl font-bold text-color1 mb-6 text-center flex items-center justify-center gap-2">
                    <FaQuoteLeft className="text-color2" />
                    Request a Quote
                </h2>
                {/* Tasker Info */}
                <div className="mb-6 p-4 rounded-xl bg-color3/20 border border-color1/20">
                    <div className="flex items-center gap-3">
                        <Image
                            src={tasker.profilePicture || "/default-profile.png"}
                            alt={`${tasker.fullName}'s profile`}
                            width={48}
                            height={48}
                            className="rounded-full object-cover border-2 border-color1"
                            priority
                        />
                        <div>
                            <p className="text-sm font-medium text-text1">Selected Tasker</p>
                            <p className="text-lg font-semibold text-color1">{tasker.fullName}</p>
                            <p className="text-sm text-text1/80">{tasker.service}</p>
                        </div>
                    </div>
                    <p className="text-xs text-text1/60 mt-2 italic flex items-center gap-1">
                        <FaExclamationTriangle className="text-color2 text-xs" />
                        This task will be visible only to {tasker.fullName} and yourself.
                    </p>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Task Type */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-color1 mb-2">
                            <FaUser className="text-color2" />
                            Task Type *
                        </label>
                        <select
                            name="taskType"
                            value={formData.taskType}
                            onChange={handleInputChange}
                            className="w-full p-3 rounded-xl border border-color1/30 focus:border-color1 focus:ring-2 focus:ring-color3 transition-all duration-200 bg-white text-text1"
                            required
                        >
                            <option value="In-Person">In-Person</option>
                            <option value="Remote">Remote</option>
                        </select>
                    </div>
                    {/* Task Title */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-color1 mb-2">
                            Task Title *
                        </label>
                        <input
                            type="text"
                            name="taskTitle"
                            value={formData.taskTitle}
                            onChange={handleInputChange}
                            className="w-full p-3 rounded-xl border border-color1/30 focus:border-color1 focus:ring-2 focus:ring-color3 transition-all duration-200 text-text1"
                            placeholder="Brief description of what you need done"
                            required
                        />
                    </div>
                    {/* Task Description */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-color1 mb-2">
                            Task Description *
                        </label>
                        <textarea
                            name="taskDescription"
                            value={formData.taskDescription}
                            onChange={handleInputChange}
                            className="w-full p-3 rounded-xl border border-color1/30 focus:border-color1 focus:ring-2 focus:ring-color3 transition-all duration-200 text-text1 resize-none"
                            placeholder="Provide detailed information about the task..."
                            rows={4}
                            required
                        />
                    </div>
                    {/* Location */}
                    {formData.taskType !== "Remote" && (
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-color1 mb-2">
                                <FaMapMarkerAlt className="text-color2" />
                                Location *
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                className="w-full p-3 rounded-xl border border-color1/30 focus:border-color1 focus:ring-2 focus:ring-color3 transition-all duration-200 text-text1"
                                placeholder="Enter your address or location"
                                required
                            />
                        </div>
                    )}
                    {/* Budget */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-color1 mb-2">
                            <FaDollarSign className="text-color2" />
                            Your Budget (Optional)
                        </label>
                        <input
                            type="text"
                            name="budget"
                            value={formData.budget}
                            onChange={handleInputChange}
                            className="w-full p-3 rounded-xl border border-color1/30 focus:border-color1 focus:ring-2 focus:ring-color3 transition-all duration-200 text-text1"
                            placeholder="Enter your budget for this task (e.g., $100-200)"
                        />
                    </div>
                    {/* Date & Time */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-color1 mb-2">
                            <FaClock className="text-color2" />
                            Preferred Date & Time (Optional)
                        </label>
                        <input
                            type="datetime-local"
                            name="dateTime"
                            value={formData.dateTime}
                            onChange={handleInputChange}
                            className="w-full p-3 rounded-xl border border-color1/30 focus:border-color1 focus:ring-2 focus:ring-color3 transition-all duration-200 text-text1"
                        />
                    </div>
                    {/* Urgency */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-color1 mb-2">
                            Urgency Level
                        </label>
                        <select
                            name="urgency"
                            value={formData.urgency}
                            onChange={handleInputChange}
                            className="w-full p-3 rounded-xl border border-color1/30 focus:border-color1 focus:ring-2 focus:ring-color3 transition-all duration-200 text-text1"
                        >
                            <option value="Flexible - Whenever works">Flexible - Whenever works</option>
                            <option value="Within a week">Within a week</option>
                            <option value="As soon as possible">As soon as possible</option>
                        </select>
                    </div>
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                            <p className="text-red-600 text-sm font-medium flex items-center gap-1">
                                <FaExclamationTriangle className="text-red-500" />
                                {'data' in error ? (error.data as any)?.message || "Failed to submit quote request" : "Failed to submit quote request"}
                            </p>
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full color1 text-white py-3 rounded-xl font-semibold shadow-lg hover:bg-color1/90 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-color1/50"
                    >
                        {isLoading ? "Submitting..." : "Submit Quote Request"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RequestQuoteModal;