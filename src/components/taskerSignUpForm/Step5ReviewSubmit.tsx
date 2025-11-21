/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useSignupMutation } from "@/features/auth/authApi";
import { RootState } from "@/app/store";
import { toast } from "react-toastify";

type Props = {
    onBack: () => void;
};

const Step5ReviewSubmit = ({ onBack }: Props) => {
    const [signup, { isLoading }] = useSignupMutation();

    // ✅ Use correct state key: 'form'
    type TaskerStep1 = {
        profilePicture?: string;
        about?: string;
        [key: string]: any;
    };
    type TaskerStep3 = {
        idType?: string;
        sin?: string;
        backgroundCheckConsent?: boolean;
        [key: string]: any;
    };
    const step1 = useSelector((state: RootState) => state.form.step1 as TaskerStep1);
    // const step2 = useSelector((state: RootState) => state.form.step2);
    const step3 = useSelector((state: RootState) => state.form.step3 as TaskerStep3);
    // const step4 = useSelector((state: RootState) => state.form.step4);

    const [agreed, setAgreed] = useState({
        terms: false,
        tax: false,
        accurate: false,
        pipeda: false,
    });

    const isFormValid = Object.values(agreed).every(Boolean);

    const handleSubmit = async () => {
        if (!isFormValid) {
            toast.error("Please agree to all the terms before submitting.");
            return;
        }

        // Frontend validation for required tasker fields
        // if (!step2.experienceYears) {
        //     toast.error("Years of experience is required. Please go back to step 2 and select it.");
        //     return;
        // }

        // if (!step2.serviceCategories || step2.serviceCategories.length === 0) {
        //     toast.error("Service categories are required. Please go back to step 2 and select at least one.");
        //     return;
        // }

        // if (!step2.services || step2.services.length === 0) {
        //     toast.error("Services are required. Please go back to step 2 and add at least one service.");
        //     return;
        // }

        if (!step3.idType) {
            toast.error("ID type is required. Please go back to step 3 and select one.");
            return;
        }

        // if (!step3.sin) {
        //     toast.error("SIN is required. Please go back to step 3 and enter it.");
        //     return;
        // }

        if (!step3.backgroundCheckConsent) {
            toast.error("Background check consent is required. Please go back to step 3 and agree.");
            return;
        }

        if (!step1.profilePicture) {
            toast.error("Profile picture is required. Please go back to step 1 and upload one.");
            return;
        }

        if (!step1.about || step1.about.trim().length < 50) {
            toast.error("About me must be at least 50 characters. Please go back to step 1.");
            return;
        }

        // Add more validations as needed for step4 (e.g., availability, serviceAreas)

        const finalData = {
            role: "tasker",
            ...step1,
            // ...step2,
            ...step3,
            // ...step4,
        };


        try {
            const response = await signup(finalData).unwrap();
            console.log("Submitted:", response);
            toast.success("Profile submitted successfully! Your profile is under review");
            console.log(finalData)
            // Optionally reset form or redirect
        } catch (err) {
            console.error("Submission error:", err);
            // Try to extract a message, fallback to a generic error
            const errorMessage =
                (err as any)?.data?.message ||
                (err as any)?.message ||
                "Submission failed. Please try again.";
            toast.error(errorMessage);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-8 bg-white rounded-3xl shadow-md text-gray-800">
            <div className="mb-10">
                <h2 className="text-3xl font-semibold flex items-center gap-3 mb-8 text-[#1A4F93]">
                    📋 Review & Submit
                </h2>
                <p className="text-gray-600 text-lg">
                    Please review your profile information below. You can go back to any
                    section to make changes before submitting.
                </p>
            </div>

            {/* Agreement Checkboxes */}
            <div className="space-y-6 mb-12">
                {[
                    {
                        id: "terms",
                        label: "I agree to TaskMatch's Terms of Service and Privacy Policy",
                    },
                    {
                        id: "tax",
                        label:
                            "I understand that I am responsible for reporting my income and paying applicable taxes in accordance with Canadian tax laws",
                    },
                    {
                        id: "accurate",
                        label: "I confirm that all information provided is accurate and complete",
                    },
                    {
                        id: "pipeda",
                        label:
                            "I understand that my information is protected under PIPEDA, and I consent to TaskMatch collecting and processing my data as described in the Privacy Policy",
                    },
                ].map(({ id, label }) => (
                    <label key={id} className="flex items-start gap-3 text-sm font-medium text-gray-700">
                        <input
                            type="checkbox"
                            checked={agreed[id as keyof typeof agreed]}
                            onChange={() =>
                                setAgreed((prev) => ({
                                    ...prev,
                                    [id]: !prev[id as keyof typeof agreed],
                                }))
                            }
                            className="mt-1 accent-black w-5 h-5"
                        />
                        {label}
                    </label>
                ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mb-10">
                <button
                    onClick={onBack}
                    className="px-10 py-3 font-bold border-2 border-[#1A4F93] rounded-xl text-[#1A4F93] hover:bg-[#1A4F93] hover:text-white transition"
                >
                    ← Back
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading || !isFormValid}
                    className={`px-12 py-3 font-extrabold rounded-xl shadow-lg transition transform hover:-translate-y-0.5 ${isFormValid
                        ? "bg-gradient-to-r from-[#C9303C] to-[#1A4F93] text-white hover:brightness-110"
                        : "bg-gray-400 text-white cursor-not-allowed"
                        }`}
                >
                    {isLoading ? "Submitting..." : "Submit Profile →"}
                </button>
            </div>

            {/* 🍁 Canadian Privacy Notice */}
            <div className="bg-red-100 border-l-4 border-red-600 p-6 rounded-lg text-sm text-red-800 space-y-2 font-semibold">
                <p>🍁 <strong>Canadian Privacy Notice</strong></p>
                <ul className="list-disc list-inside space-y-1">
                    <li>Access your personal information</li>
                    <li>Request corrections to inaccurate information</li>
                    <li>Know how your information is being used</li>
                    <li>Withdraw consent for certain uses of your information</li>
                </ul>
                <p>
                    For privacy concerns, contact:{" "}
                    <a href="mailto:privacy@taskmatch.ca" className="underline">
                        privacy@taskmatch.ca
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Step5ReviewSubmit;