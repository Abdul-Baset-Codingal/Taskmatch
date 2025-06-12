"use client";
import React, { useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";

const steps = [
  "Select Timeline",
  "Location",
  "Task Details",
  "Budget",
  "Review and Post",
];

const TaskSteps = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <Step1 />;
      case 1:
        return <Step2 />;
      case 2:
        return <Step3 />;
      case 3:
        return <Step4 />;
      case 4:
        return <Step5 />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Steps Indicator */}
      <div className="relative mb-12">
        {/* Progress Background Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 transform -translate-y-1/2 z-0" />

        {/* Progress Filled Line */}
        <div
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] transform -translate-y-1/2 z-10 transition-all duration-500"
          style={{
            width: `${(currentStep / (steps.length - 1)) * 100}%`,
          }}
        />

        {/* Steps */}
        <div className="flex flex-wrap justify-between relative z-20 gap-4 sm:gap-6 md:gap-10">
          {steps.map((step, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`flex-1 min-w-[80px] text-center py-2 px-3 cursor-pointer rounded-md text-xs sm:text-sm font-medium flex flex-col items-center justify-center transition duration-300 ${
                index === currentStep
                  ? "bg-[#6F3DE9] text-white"
                  : "border-2 border-[#8F6DF2] text-[#72757E] bg-white"
              }`}
            >
              <span className="text-xl sm:text-2xl font-bold">{index + 1}</span>
              <span className="mt-1">{step}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="relative rounded-md mb-6">
        <div className="h-2 rounded-t-2xl bg-gradient-to-r from-[#8560F1] to-[#E7B6FE]" />
        <div className="bg-white p-4 sm:p-6 shadow-md rounded-b-md rounded">
          {renderStepContent()}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="w-full sm:w-auto px-4 py-3 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentStep === steps.length - 1}
          className="w-full sm:w-auto px-4 py-3 bg-[#6F3DE9] text-white rounded hover:bg-[#5714E0] disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TaskSteps;
