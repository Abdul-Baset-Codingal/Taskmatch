/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/routes/urgent-task/RequestQuoteModal.tsx
"use client";
import { useState } from "react";
import { FaGem, FaTimes } from "react-icons/fa";
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
    });
    const [createRequestQuote, { isLoading, error }] = useCreateRequestQuoteMutation();

    console.log('All Cookies:', Cookies.get()); // Debug: Shows isLoggedIn
    console.log('isLoggedIn:', Cookies.get('isLoggedIn')); // Debug: Shows true

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.taskTitle || !formData.taskDescription || !formData.location) {
            alert("Please fill in all required fields (Task Title, Description, Location)");
            return;
        }

        const quoteData = {
            taskerId: tasker._id,
            taskTitle: formData.taskTitle,
            taskDescription: formData.taskDescription,
            location: formData.location,
            budget: formData.budget || undefined,
            preferredDateTime: formData.dateTime || undefined,
            urgency: formData.urgency || undefined,
        };

        console.log('Quote Data:', quoteData); // Debug

        try {
            const response = await createRequestQuote(quoteData).unwrap();
            console.log("Quote Request Response:", response);
            toast.success("Quote request submitted successfully!");
            onClose();
        } catch (err: any) {
            console.error("Error creating quote request:", err);
            alert(`Failed to submit quote request: ${err?.data?.message || "Unknown error"}`);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-[9999] animate-fade-in overflow-y-auto py-4">
            <div className="bg-white rounded-3xl p-6 max-w-lg w-full mx-4 relative shadow-2xl transform transition-all duration-500 scale-100 hover:scale-105 sm:p-8">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-[#FF8609] transition-all duration-300"
                >
                    <FaTimes className="text-2xl" />
                </button>
                <div className="max-h-[80vh] overflow-y-auto">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 bg-clip-text bg-gradient-to-r from-[#8560F1] to-[#E7B6FE]">
                        Request Quote
                    </h2>
                    <div className="flex items-center gap-2 mb-6">
                        <FaGem className="text-[#8560F1] text-lg animate-pulse" />
                        <div>
                            <p className="text-sm font-semibold text-gray-700">Selected Tasker:</p>
                            <p className="text-lg font-bold text-[#8560F1]">{tasker.fullName}</p>
                            <p className="text-sm text-gray-600">{tasker.service}</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-6 italic">
                        This task will be visible only to {tasker.fullName} and yourself.
                    </p>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Task Title *</label>
                            <input
                                type="text"
                                name="taskTitle"
                                value={formData.taskTitle}
                                onChange={handleInputChange}
                                className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#8560F1] focus:ring-2 focus:ring-[#E7B6FE] transition-all duration-300"
                                placeholder="Brief description of what you need done"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Task Description *</label>
                            <textarea
                                name="taskDescription"
                                value={formData.taskDescription}
                                onChange={handleInputChange}
                                className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#8560F1] focus:ring-2 focus:ring-[#E7B6FE] transition-all duration-300"
                                placeholder="Provide detailed information about the task, including specific requirements, preferred timing, and any special instructions..."
                                rows={4}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Location *</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#8560F1] focus:ring-2 focus:ring-[#E7B6FE] transition-all duration-300"
                                placeholder="Enter your address or location"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Your Budget (Optional)</label>
                            <input
                                type="text"
                                name="budget"
                                value={formData.budget}
                                onChange={handleInputChange}
                                className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#8560F1] focus:ring-2 focus:ring-[#E7B6FE] transition-all duration-300"
                                placeholder="Enter your budget for this task"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Preferred Date & Time</label>
                            <input
                                type="datetime-local"
                                name="dateTime"
                                value={formData.dateTime}
                                onChange={handleInputChange}
                                className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#8560F1] focus:ring-2 focus:ring-[#E7B6FE] transition-all duration-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Urgency Level</label>
                            <select
                                name="urgency"
                                value={formData.urgency}
                                onChange={handleInputChange}
                                className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#8560F1] focus:ring-2 focus:ring-[#E7B6FE] transition-all duration-300"
                            >
                                <option value="Flexible - Whenever works">Flexible - Whenever works</option>
                                <option value="Within a week">Within a week</option>
                                <option value="As soon as possible">As soon as possible</option>
                            </select>
                        </div>
                        {error && (
                            <p className="text-red-500 text-sm">
                                Error: {"Failed to submit quote request"}
                            </p>
                        )}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] text-white py-3 rounded-lg font-bold shadow-lg hover:from-[#FF8609] hover:to-[#FF6C32] transition-all duration-500 transform hover:scale-105 disabled:opacity-50"
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