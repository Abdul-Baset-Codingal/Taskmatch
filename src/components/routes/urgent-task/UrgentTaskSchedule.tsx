/* eslint-disable react/no-unescaped-entities */

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { updateTaskField } from "@/features/taskForm/taskFormSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
    onBack: () => void;
    onContinue: () => void;
};

const UrgentTaskSchedule = ({ onBack, onContinue }: Props) => {
    const dispatch = useDispatch();
    const taskForm = useSelector((state: RootState) => state.taskForm);

    // Load from Redux or fallback
    const [timing, setTiming] = useState<"Urgent" | "Schedule" | "Flexible">(
        (taskForm.schedule as "Urgent" | "Schedule" | "Flexible") || "Urgent"
    );
    const [info, setInfo] = useState(taskForm.additionalInfo || "");
    const [price, setPrice] = useState(taskForm.price || "");

    // Safely parse stored customDeadline which may be null, string, number or Date
    const parseDeadline = (d: unknown): Date | null => {
        if (!d) return null;
        if (d instanceof Date) return d;
        if (typeof d === "string" || typeof d === "number") {
            const dt = new Date(d);
            return isNaN(dt.getTime()) ? null : dt;
        }
        return null;
    };

    const [customDeadline, setCustomDeadline] = useState<Date | null>(parseDeadline(taskForm.customDeadline));

    // Sync everything back to Redux on change
    useEffect(() => {
        dispatch(updateTaskField({ field: "schedule", value: timing }));
    }, [timing, dispatch]);

    useEffect(() => {
        dispatch(updateTaskField({ field: "additionalInfo", value: info }));
    }, [info, dispatch]);

    useEffect(() => {
        dispatch(updateTaskField({ field: "price", value: price }));
    }, [price, dispatch]);

    useEffect(() => {
        if (customDeadline) {
            dispatch(updateTaskField({ field: "customDeadline", value: customDeadline.toISOString() }));
        } else {
            dispatch(updateTaskField({ field: "customDeadline", value: null }));
        }
    }, [customDeadline, dispatch]);

    // ----------- Validation Logic -----------
    const isFormValid = useMemo(() => {
        const hasPrice = price && parseFloat(price) > 0;

        const hasValidSchedule =
            timing === "Flexible" ||
            (timing === "Schedule" && customDeadline !== null);

        return hasPrice && hasValidSchedule;
    }, [price, timing, customDeadline]);

    const handleContinue = () => {
        if (isFormValid) {
            onContinue();
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-[#063A41] text-white py-8 px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-2">When do you need it done?</h1>
                    <p className="text-[#E5FFDB] text-sm">Step 2 of 3</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Timing Options */}
                <div className="mb-8">
                    <label className="block text-[#063A41] font-semibold mb-4 text-lg">
                        Choose your timeline <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Urgent (Default)
                        <button
                            onClick={() => setTiming("Urgent")}
                            className={`border-2 rounded-xl p-6 text-left transition-all ${timing === "Urgent"
                                    ? "border-[#109C3D] bg-[#E5FFDB] shadow-md"
                                    : "border-gray-200 hover:border-[#109C3D] hover:bg-gray-50"
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`text-4xl ${timing === "Urgent" ? "text-[#109C3D]" : "text-gray-400"}`}>
                                    ⚡
                                </div>
                                <div>
                                    <div className="text-lg font-semibold text-[#063A41] mb-1">Urgent</div>
                                    <p className="text-sm text-gray-600">I need it done ASAP</p>
                                </div>
                            </div>
                        </button> */}

                        {/* Specific Date */}
                        <button
                            onClick={() => setTiming("Schedule")}
                            className={`border-2 rounded-xl p-6 text-left transition-all ${timing === "Schedule"
                                    ? "border-[#109C3D] bg-[#E5FFDB] shadow-md"
                                    : "border-gray-200 hover:border-[#109C3D] hover:bg-gray-50"
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`text-4xl ${timing === "Schedule" ? "text-[#109C3D]" : "text-gray-400"}`}>
                                    📅
                                </div>
                                <div>
                                    <div className="text-lg font-semibold text-[#063A41] mb-1">Specific Date</div>
                                    <p className="text-sm text-gray-600">Schedule for a specific time</p>
                                </div>
                            </div>
                        </button>

                        {/* Flexible */}
                        <button
                            onClick={() => setTiming("Flexible")}
                            className={`border-2 rounded-xl p-6 text-left transition-all ${timing === "Flexible"
                                    ? "border-[#109C3D] bg-[#E5FFDB] shadow-md"
                                    : "border-gray-200 hover:border-[#109C3D] hover:bg-gray-50"
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`text-4xl ${timing === "Flexible" ? "text-[#109C3D]" : "text-gray-400"}`}>
                                    🕒
                                </div>
                                <div>
                                    <div className="text-lg font-semibold text-[#063A41] mb-1">Flexible</div>
                                    <p className="text-sm text-gray-600">I'm flexible with timing</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Date & Time Picker - Only for Schedule */}
                {timing === "Schedule" && (
                    <div className="mb-8 bg-gray-50 rounded-xl p-6">
                        <label className="block text-[#063A41] font-semibold mb-3 text-base">
                            Select preferred date and time <span className="text-red-500">*</span>
                        </label>
                        <DatePicker
                            selected={customDeadline}
                            onChange={(date: Date | null) => setCustomDeadline(date)}
                            showTimeSelect
                            timeIntervals={15}
                            minDate={new Date()} // Cannot pick past dates
                            dateFormat="MMMM d, yyyy h:mm aa"
                            className={`w-full border-2 rounded-lg p-4 text-[#063A41] focus:outline-none focus:border-[#109C3D] transition-colors ${!customDeadline ? "border-red-300" : "border-gray-200"
                                }`}
                            placeholderText="Choose date and time..."
                        />
                        {!customDeadline && (
                            <p className="text-red-500 text-sm mt-2">Please select a date and time</p>
                        )}
                    </div>
                )}

                {/* Budget */}
                <div className="mb-8">
                    <label className="block text-[#063A41] font-semibold mb-3 text-lg">
                        What's your budget? <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#063A41] font-semibold text-lg">
                            $
                        </span>
                        <input
                            type="number"
                            min="1"
                            step="1"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="50"
                            className={`w-full border-2 rounded-lg p-4 pl-10 text-[#063A41] focus:outline-none focus:border-[#109C3D] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${!price || parseFloat(price) <= 0 ? "border-red-300" : "border-gray-200"
                                }`}
                        />
                    </div>
                    {!price || parseFloat(price) <= 0 ? (
                        <p className="text-red-500 text-sm mt-2">Please enter a valid budget amount</p>
                    ) : (
                        <div className="mt-4 bg-[#E5FFDB] border-l-4 border-[#109C3D] p-4 rounded">
                            <div className="flex items-start gap-3">
                                <span className="text-[#109C3D] text-xl">💡</span>
                                <div>
                                    <p className="text-[#063A41] font-semibold mb-1">
                                        Taskers will provide their quotes
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        Your budget helps taskers understand your expectations.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Additional Information (Optional) */}
                <div className="mb-8">
                    <label className="block text-[#063A41] font-semibold mb-3 text-lg">
                        Any other details? (optional)
                    </label>
                    <textarea
                        value={info}
                        onChange={(e) => setInfo(e.target.value)}
                        rows={4}
                        maxLength={500}
                        placeholder="Parking info, pet instructions, access codes, etc..."
                        className="w-full border-2 border-gray-200 rounded-lg p-4 text-[#063A41] focus:outline-none focus:border-[#109C3D] transition-colors resize-none"
                    />
                    <div className="text-sm text-gray-500 mt-2 text-right">
                        {info.length} / 500
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-6 border-t-2 border-gray-100">
                    <button
                        onClick={onBack}
                        className="text-[#063A41] font-semibold hover:text-[#109C3D] transition-colors flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>

                    <button
                        onClick={handleContinue}
                        disabled={!isFormValid}
                        className={`px-8 py-3 rounded-lg font-semibold transition-all shadow-md ${isFormValid
                                ? "bg-[#109C3D] text-white hover:bg-[#0d8332] hover:shadow-lg cursor-pointer"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UrgentTaskSchedule;