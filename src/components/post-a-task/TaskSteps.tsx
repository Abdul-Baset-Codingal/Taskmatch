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
    <div className="w-full max-w-6xl mx-auto  p-10 rounded-xl ">
      {/* Steps Indicator */}
      <div className="relative mb-12">
        {/* Progress Background Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 transform -translate-y-1/2 z-0" />

        {/* Progress Filled Line */}
        <div
          className="absolute top-1/2 left-0 h-1  bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] transform -translate-y-1/2 z-10 transition-all duration-500"
          style={{
            width: `${(currentStep / (steps.length - 1)) * 100}%`,
          }}
        />

        {/* Steps */}
        <div className="flex justify-between relative z-20 gap-20">
          {steps.map((step, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`flex-1 text-center py-2 px-3 cursor-pointer  rounded-md text-sm font-medium flex flex-col items-center justify-center transition duration-300 ${
                index === currentStep
                  ? "bg-[#6F3DE9] text-white"
                  : "border-2 border-[#8F6DF2]  text-[#72757E] bg-white"
              }`}
            >
              <span className="text-4xl font-bold">{index + 1}</span>
              <span>{step}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="relative rounded-md mb-6">
        {/* Top Gradient Border */}
        <div className="h-2 rounded-t-2xl bg-gradient-to-r from-[#8560F1] to-[#E7B6FE]" />

        {/* Inner Card Content */}
        <div className="bg-white p-6 shadow-md rounded-b-md rounded">
          {/* Your step content goes here */}
          {renderStepContent()}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentStep === steps.length - 1}
          className="px-4 py-2 bg-[#6F3DE9] text-white rounded hover:bg-[#5714E0] disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TaskSteps;
