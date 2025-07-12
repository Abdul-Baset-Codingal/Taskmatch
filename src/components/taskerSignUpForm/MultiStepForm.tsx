"use client";
import React, { useState } from "react";
import { FaUser, FaFileUpload, FaCogs, FaClock, FaCheckCircle } from "react-icons/fa";

import Step1BasicInfo from "./Step1BasicInfo";
import Step2SkillsAndRates from "./Step2SkillsAndRates";
import Step3VerificationCredentials from "./Step3VerificationCredentials";
import Step4RatesAvailability from "./Step4RatesAvailability";
import Step5ReviewSubmit from "./Step5ReviewSubmit";
// import Step2UploadDocs from "./Step2UploadDocs";
// import Step3SkillsAndRates from "./Step3SkillsAndRates";
// import Step4Availability from "./Step4Availability";
// import Step5ReviewSubmit from "./Step5ReviewSubmit";

const steps = [
    { id: 1, label: "Basic Info", icon: <FaUser /> },
    { id: 2, label: "Skills & Services", icon: <FaFileUpload /> },
    { id: 3, label: "Verifications", icon: <FaCogs /> },
    { id: 4, label: "Availability", icon: <FaClock /> },
    { id: 5, label: "Review & Submit", icon: <FaCheckCircle /> },
];

const MultiStepForm = () => {
    const [step, setStep] = useState(1);

    const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    const renderStep = () => {
        switch (step) {
            case 1:
                return <Step1BasicInfo onNext={nextStep} />;
            case 2:
                return <Step2SkillsAndRates onNext={nextStep} onBack={prevStep} />;
            case 3:
                return <Step3VerificationCredentials onNext={nextStep} onBack={prevStep} />;
            case 4:
                return <Step4RatesAvailability onNext={nextStep} onBack={prevStep} />;
            case 5:
                return <Step5ReviewSubmit onBack={prevStep} />;
            default:
                return <div>Invalid step</div>;
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-10 bg-white rounded-3xl shadow-lg">
            {/* Steps Indicator */}
            <div className="flex justify-between mb-10">
                {steps.map(({ id, label, icon }) => {
                    const isActive = id === step;
                    const isCompleted = id < step;
                    return (
                        <div
                            key={id}
                            className="flex flex-col items-center flex-1 cursor-default select-none relative"
                        >
                            <div
                                className={`rounded-full w-12 h-12 flex items-center justify-center mb-2 text-xl font-bold text-white`}
                                style={{
                                    background: isCompleted || isActive
                                        ? "linear-gradient(135deg, #C9303C, #1A4F93)"
                                        : undefined,
                                    backgroundColor: isCompleted || isActive ? undefined : "#d1d5db", // gray-300 fallback
                                }}
                            >
                                {icon}
                            </div>
                            <span
                                className={`text-sm font-semibold ${isActive ? "text-[#1A4F93]" : "text-gray-400"}`}
                            >
                                {label}
                            </span>


                        </div>
                    );
                })}
            </div>


            {/* Render current step form */}
            <div>{renderStep()}</div>
        </div>
    );
};

export default MultiStepForm;
