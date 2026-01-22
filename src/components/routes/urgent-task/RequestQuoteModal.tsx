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
    FaExclamationTriangle,
    FaPaperPlane,
    FaFileAlt,
    FaLaptop,
    FaWalking,
    FaCalendarAlt,
    FaInfoCircle,
    FaCheckCircle,
    FaShieldAlt,
    FaChevronDown,
    FaBuilding,
    FaRoad,
    FaClock,
} from "react-icons/fa";
import { useCreateRequestQuoteMutation } from "@/features/api/taskerApi";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

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

// Canadian Provinces
const canadianProvinces = [
    { value: "", label: "Select Province" },
    { value: "AB", label: "Alberta" },
    { value: "BC", label: "British Columbia" },
    { value: "MB", label: "Manitoba" },
    { value: "NB", label: "New Brunswick" },
    { value: "NL", label: "Newfoundland and Labrador" },
    { value: "NS", label: "Nova Scotia" },
    { value: "NT", label: "Northwest Territories" },
    { value: "NU", label: "Nunavut" },
    { value: "ON", label: "Ontario" },
    { value: "PE", label: "Prince Edward Island" },
    { value: "QC", label: "Quebec" },
    { value: "SK", label: "Saskatchewan" },
    { value: "YT", label: "Yukon" },
];

const RequestQuoteModal: React.FC<RequestQuoteModalProps> = ({ tasker, isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        taskTitle: "",
        taskDescription: "",
        streetAddress: "",
        city: "",
        province: "",
        budget: "",
        preferredDate: "",
        preferredTime: "",
        urgency: "Flexible - Whenever works",
        taskType: "In-Person",
    });

    const [createRequestQuote, { isLoading, error }] = useCreateRequestQuoteMutation();

    console.log('All Cookies:', Cookies.get());
    console.log('isLoggedIn:', Cookies.get('isLoggedIn'));
    const router = useRouter();

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "taskType" && value === "Remote"
                ? { streetAddress: "", city: "", province: "" }
                : {}),
        }));
    };

    // Handle date change with blur to close picker
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Force blur to close the date picker
        e.target.blur();
    };

    // Handle time change with blur to close picker
    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Force blur to close the time picker
        e.target.blur();
    };

    // Get full location string for submission
    const getFullLocation = () => {
        if (formData.taskType === "Remote") {
            return "Remote";
        }
        const provinceName = canadianProvinces.find(p => p.value === formData.province)?.label || formData.province;
        const parts = [
            formData.streetAddress,
            formData.city,
            provinceName
        ].filter(Boolean);
        return parts.join(", ");
    };

    // Get combined date-time for submission
    const getCombinedDateTime = () => {
        if (formData.preferredDate && formData.preferredTime) {
            return `${formData.preferredDate}T${formData.preferredTime}`;
        } else if (formData.preferredDate) {
            return formData.preferredDate;
        }
        return undefined;
    };

    // Format date for display
    const formatDateDisplay = (dateStr: string) => {
        if (!dateStr) return "";
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('en-CA', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Format time for display
    const formatTimeDisplay = (timeStr: string) => {
        if (!timeStr) return "";
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.taskTitle || !formData.taskDescription) {
            toast.error("Please fill in Task Title and Description");
            return;
        }

        if (formData.taskType === "In-Person") {
            if (!formData.streetAddress || !formData.city || !formData.province) {
                toast.error("Please fill in all address fields (Street Address, City, Province)");
                return;
            }
        }

        const quoteData = {
            taskerId: tasker._id,
            taskTitle: formData.taskTitle,
            taskDescription: formData.taskDescription,
            location: getFullLocation(),
            budget: formData.budget || undefined,
            preferredDateTime: getCombinedDateTime(),
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

    const handleViewTaskerProfile = () => {
        router.push(`/taskers/${tasker._id}`);
    };
    // Get minimum date (today)
    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // Clear date
    const clearDate = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setFormData(prev => ({ ...prev, preferredDate: "" }));
    };

    // Clear time
    const clearTime = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setFormData(prev => ({ ...prev, preferredTime: "" }));
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
                            {/* Clickable Profile Picture */}
                            <div
                                onClick={handleViewTaskerProfile}
                                className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#109C3D]/30 flex-shrink-0 cursor-pointer hover:border-[#109C3D] hover:scale-105 transition-all duration-200"
                                title={`View ${tasker.fullName}'s profile`}
                            >
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
                                {/* Clickable Name */}
                                <p
                                    onClick={handleViewTaskerProfile}
                                    className="text-base font-semibold text-[#063A41] truncate cursor-pointer hover:text-[#109C3D] hover:underline transition-colors duration-200"
                                    title={`View ${tasker.fullName}'s profile`}
                                >
                                    {tasker.fullName}
                                </p>
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
                                    onClick={() => setFormData(prev => ({
                                        ...prev,
                                        taskType: "In-Person",
                                        streetAddress: "",
                                        city: "",
                                        province: ""
                                    }))}
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
                                    onClick={() => setFormData(prev => ({
                                        ...prev,
                                        taskType: "Remote",
                                        streetAddress: "",
                                        city: "",
                                        province: ""
                                    }))}
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

                        {/* Location Section - Only shown for In-Person */}
                        {formData.taskType !== "Remote" && (
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-[#063A41]">
                                    Location <span className="text-red-500">*</span>
                                </label>

                                {/* Street Address */}
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                        <FaRoad className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="streetAddress"
                                        value={formData.streetAddress}
                                        onChange={handleInputChange}
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#109C3D] focus:ring-2 focus:ring-[#109C3D]/20 transition-all text-[#063A41] placeholder-gray-400"
                                        placeholder="Street Address (e.g., 123 Main Street)"
                                        required
                                    />
                                </div>

                                {/* City and Province Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {/* City */}
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                            <FaBuilding className="text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#109C3D] focus:ring-2 focus:ring-[#109C3D]/20 transition-all text-[#063A41] placeholder-gray-400"
                                            placeholder="City"
                                            required
                                        />
                                    </div>

                                    {/* Province Dropdown */}
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                            <FaMapMarkerAlt className="text-gray-400" />
                                        </div>
                                        <select
                                            name="province"
                                            value={formData.province}
                                            onChange={handleInputChange}
                                            className="w-full pl-11 pr-10 py-3 rounded-xl border-2 border-gray-200 focus:border-[#109C3D] focus:ring-2 focus:ring-[#109C3D]/20 transition-all text-[#063A41] appearance-none bg-white cursor-pointer"
                                            required
                                        >
                                            {canadianProvinces.map((province) => (
                                                <option key={province.value} value={province.value}>
                                                    {province.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <FaChevronDown className="text-gray-400 text-sm" />
                                        </div>
                                    </div>
                                </div>

                                {/* Location Preview */}
                                {(formData.streetAddress || formData.city || formData.province) && (
                                    <div className="p-3 bg-[#E5FFDB]/50 rounded-lg border border-[#109C3D]/20">
                                        <p className="text-xs text-gray-500 mb-1">Full Address Preview:</p>
                                        <p className="text-sm text-[#063A41] font-medium">
                                            {getFullLocation() || "Start typing to see preview..."}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Remote Location Indicator */}
                        {formData.taskType === "Remote" && (
                            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <FaLaptop className="text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-blue-700">Remote Task</p>
                                    <p className="text-xs text-blue-600">This task will be completed remotely - no physical location needed</p>
                                </div>
                            </div>
                        )}

                        {/* Budget */}
                        <div>
                            <label className="block text-sm font-medium text-[#063A41] mb-2">
                                Your Budget
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
                                    placeholder="e.g., $100-200 or Leave blank for quote"
                                />
                            </div>
                        </div>

                        {/* Date & Time Section */}
                        <div>
                            <label className="block text-sm font-medium text-[#063A41] mb-2">
                                Preferred Date & Time <span className="text-gray-400 font-normal">(Optional)</span>
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* Date Input */}
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                                        <FaCalendarAlt className="text-gray-400" />
                                    </div>
                                    <input
                                        type="date"
                                        name="preferredDate"
                                        value={formData.preferredDate}
                                        onChange={handleDateChange}
                                        onBlur={(e) => e.target.blur()}
                                        min={getMinDate()}
                                        className="w-full pl-11 pr-10 py-3 rounded-xl border-2 border-gray-200 focus:border-[#109C3D] focus:ring-2 focus:ring-[#109C3D]/20 transition-all text-[#063A41] cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                    />
                                    {formData.preferredDate && (
                                        <button
                                            type="button"
                                            onClick={clearDate}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all z-20"
                                        >
                                            <FaTimes className="text-xs" />
                                        </button>
                                    )}
                                </div>

                                {/* Time Input */}
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                                        <FaClock className="text-gray-400" />
                                    </div>
                                    <input
                                        type="time"
                                        name="preferredTime"
                                        value={formData.preferredTime}
                                        onChange={handleTimeChange}
                                        onBlur={(e) => e.target.blur()}
                                        className="w-full pl-11 pr-10 py-3 rounded-xl border-2 border-gray-200 focus:border-[#109C3D] focus:ring-2 focus:ring-[#109C3D]/20 transition-all text-[#063A41] cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                    />
                                    {formData.preferredTime && (
                                        <button
                                            type="button"
                                            onClick={clearTime}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all z-20"
                                        >
                                            <FaTimes className="text-xs" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Date/Time Preview */}
                            {(formData.preferredDate || formData.preferredTime) && (
                                <div className="mt-2 p-3 bg-[#E5FFDB]/50 rounded-lg border border-[#109C3D]/20 flex items-center gap-2">
                                    <FaCheckCircle className="text-[#109C3D] text-sm flex-shrink-0" />
                                    <p className="text-sm text-[#063A41]">
                                        {formData.preferredDate && formatDateDisplay(formData.preferredDate)}
                                        {formData.preferredDate && formData.preferredTime && " at "}
                                        {formData.preferredTime && formatTimeDisplay(formData.preferredTime)}
                                    </p>
                                </div>
                            )}
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