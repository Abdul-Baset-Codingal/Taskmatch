/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import Image from "next/image";
import {
    FaTimes,
    FaUser,
    FaQuoteLeft,
    FaMapMarkerAlt,
    FaDollarSign,
    FaClock,
    FaExclamationTriangle,
    FaPaperPlane,
    FaFileAlt,
    FaLaptop,
    FaWalking,
    FaCalendarAlt,
    FaInfoCircle,
    FaCheckCircle,
    FaShieldAlt,
} from "react-icons/fa";
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

    console.log('All Cookies:', Cookies.get());
    console.log('isLoggedIn:', Cookies.get('isLoggedIn'));

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

        console.log('Quote Data:', quoteData);

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
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-lg relative shadow-2xl max-h-[90vh] overflow-hidden animate-modalSlide"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="bg-[#063A41] px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#109C3D] rounded-xl flex items-center justify-center">
                                <FaQuoteLeft className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-white font-semibold text-lg">Request a Quote</h2>
                                <p className="text-white/70 text-sm">Get a personalized quote</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            aria-label="Close modal"
                        >
                            <FaTimes />
                        </button>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="px-6 py-5 overflow-y-auto max-h-[calc(90vh-80px)]">
                    {/* Tasker Info Card */}
                    <div className="mb-6 p-4 rounded-xl bg-[#E5FFDB]/50 border border-[#109C3D]/20">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#109C3D]/30 flex-shrink-0">
                                {tasker.profilePicture ? (
                                    <Image
                                        src={tasker.profilePicture}
                                        alt={`${tasker.fullName}'s profile`}
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-cover"
                                        priority
                                    />
                                ) : (
                                    <div className="w-full h-full bg-[#109C3D]/20 flex items-center justify-center">
                                        <FaUser className="text-[#109C3D]" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Selected Tasker</p>
                                <p className="text-base font-semibold text-[#063A41] truncate">{tasker.fullName}</p>
                                <p className="text-sm text-[#109C3D]">{tasker.service}</p>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-[#109C3D] bg-[#E5FFDB] px-2 py-1 rounded-full">
                                <FaCheckCircle className="text-[10px]" />
                                <span>Verified</span>
                            </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#109C3D]/10 flex items-center gap-2 text-xs text-gray-500">
                            <FaShieldAlt className="text-[#109C3D]" />
                            <span>This request will be visible only to {tasker.fullName.split(' ')[0]} and yourself</span>
                        </div>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* Task Type Toggle */}
                        <div>
                            <label className="block text-sm font-medium text-[#063A41] mb-3">
                                Task Type <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, taskType: "In-Person", location: "" }))}
                                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${formData.taskType === "In-Person"
                                            ? 'border-[#109C3D] bg-[#E5FFDB] text-[#063A41]'
                                            : 'border-gray-200 text-gray-500 hover:border-[#109C3D]/30'
                                        }`}
                                >
                                    <FaWalking className={formData.taskType === "In-Person" ? 'text-[#109C3D]' : ''} />
                                    <span className="font-medium">In-Person</span>
                                    {formData.taskType === "In-Person" && (
                                        <FaCheckCircle className="text-[#109C3D] text-sm" />
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, taskType: "Remote", location: "Remote" }))}
                                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${formData.taskType === "Remote"
                                            ? 'border-[#109C3D] bg-[#E5FFDB] text-[#063A41]'
                                            : 'border-gray-200 text-gray-500 hover:border-[#109C3D]/30'
                                        }`}
                                >
                                    <FaLaptop className={formData.taskType === "Remote" ? 'text-[#109C3D]' : ''} />
                                    <span className="font-medium">Remote</span>
                                    {formData.taskType === "Remote" && (
                                        <FaCheckCircle className="text-[#109C3D] text-sm" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Task Title */}
                        <div>
                            <label className="block text-sm font-medium text-[#063A41] mb-2">
                                Task Title <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                    <FaFileAlt className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="taskTitle"
                                    value={formData.taskTitle}
                                    onChange={handleInputChange}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#109C3D] focus:ring-2 focus:ring-[#109C3D]/20 transition-all text-[#063A41] placeholder-gray-400"
                                    placeholder="Brief description of what you need"
                                    required
                                />
                            </div>
                        </div>

                        {/* Task Description */}
                        <div>
                            <label className="block text-sm font-medium text-[#063A41] mb-2">
                                Task Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="taskDescription"
                                value={formData.taskDescription}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#109C3D] focus:ring-2 focus:ring-[#109C3D]/20 transition-all text-[#063A41] placeholder-gray-400 resize-none"
                                placeholder="Provide detailed information about the task, including any specific requirements..."
                                rows={4}
                                required
                            />
                            <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                                <FaInfoCircle className="text-[#109C3D]" />
                                Be as detailed as possible for an accurate quote
                            </p>
                        </div>

                        {/* Location - Only shown for In-Person */}
                        {formData.taskType !== "Remote" && (
                            <div>
                                <label className="block text-sm font-medium text-[#063A41] mb-2">
                                    Location <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                        <FaMapMarkerAlt className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#109C3D] focus:ring-2 focus:ring-[#109C3D]/20 transition-all text-[#063A41] placeholder-gray-400"
                                        placeholder="Enter your address or location"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {/* Two Column Layout */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Budget */}
                            <div>
                                <label className="block text-sm font-medium text-[#063A41] mb-2">
                                    Your Budget
                                    <span className="text-gray-400 font-normal ml-1">(Optional)</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                        <FaDollarSign className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleInputChange}
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#109C3D] focus:ring-2 focus:ring-[#109C3D]/20 transition-all text-[#063A41] placeholder-gray-400"
                                        placeholder="e.g., $100-200"
                                    />
                                </div>
                            </div>

                            {/* Date & Time */}
                            <div>
                                <label className="block text-sm font-medium text-[#063A41] mb-2">
                                    Preferred Date
                                    <span className="text-gray-400 font-normal ml-1">(Optional)</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                        <FaCalendarAlt className="text-gray-400" />
                                    </div>
                                    <input
                                        type="datetime-local"
                                        name="dateTime"
                                        value={formData.dateTime}
                                        onChange={handleInputChange}
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#109C3D] focus:ring-2 focus:ring-[#109C3D]/20 transition-all text-[#063A41]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Urgency Level */}
                        <div>
                            <label className="block text-sm font-medium text-[#063A41] mb-3">
                                Urgency Level
                            </label>
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    { value: "Flexible - Whenever works", icon: FaClock, label: "Flexible", sublabel: "Whenever works" },
                                    { value: "Within a week", icon: FaCalendarAlt, label: "Within a Week", sublabel: "Moderate priority" },
                                    { value: "As soon as possible", icon: FaExclamationTriangle, label: "ASAP", sublabel: "High priority" },
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, urgency: option.value }))}
                                        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${formData.urgency === option.value
                                                ? 'border-[#109C3D] bg-[#E5FFDB]'
                                                : 'border-gray-200 hover:border-[#109C3D]/30'
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${formData.urgency === option.value
                                                ? 'bg-[#109C3D] text-white'
                                                : 'bg-gray-100 text-gray-400'
                                            }`}>
                                            <option.icon className="text-sm" />
                                        </div>
                                        <div className="flex-1">
                                            <p className={`font-medium ${formData.urgency === option.value ? 'text-[#063A41]' : 'text-gray-700'
                                                }`}>
                                                {option.label}
                                            </p>
                                            <p className="text-xs text-gray-500">{option.sublabel}</p>
                                        </div>
                                        {formData.urgency === option.value && (
                                            <FaCheckCircle className="text-[#109C3D]" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                                <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <FaExclamationTriangle className="text-red-500 text-xs" />
                                </div>
                                <div>
                                    <p className="font-medium text-red-700 text-sm">Error</p>
                                    <p className="text-red-600 text-sm mt-0.5">
                                        {'data' in error ? (error.data as any)?.message || "Failed to submit quote request" : "Failed to submit quote request"}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#109C3D] text-white rounded-xl font-semibold hover:bg-[#0d8a35] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#109C3D]/20"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <FaPaperPlane />
                                    Submit Quote Request
                                </>
                            )}
                        </button>

                        {/* Footer Note */}
                        <p className="text-xs text-center text-gray-400">
                            By submitting, you agree to share your contact details with the tasker
                        </p>
                    </form>
                </div>
            </div>

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
            `}</style>
        </div>
    );
};

export default RequestQuoteModal;