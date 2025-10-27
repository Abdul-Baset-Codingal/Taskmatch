"use client";
import UrgentTaskDetails from "@/components/routes/urgent-task/UrgentTaskDetails";
import UrgentTaskSchedule from "@/components/routes/urgent-task/UrgentTaskSchedule";
import UrgentTaskSummary from "@/components/routes/urgent-task/UrgentTaskSummary";
import Navbar from "@/shared/Navbar";
import React, { Suspense, useState } from "react";

// Prevent static prerendering to avoid useSearchParams issues
export const dynamic = "force-dynamic";

const Page = () => {
  const [step, setStep] = useState(1);

  return (
    <div>
      <Navbar />
      <div className="mt-32">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 py-10 text-black bg-orange-50 border-t-4 border-orange-500 rounded-2xl">
          {/* Step Indicator */}
          <div className="flex justify-between items-center mb-10 max-w-md mx-auto">
            <div className="text-center">
              <div
                className={`text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center mx-auto ${step === 1 ? "bg-orange-500 text-white" : "text-gray-400 border border-gray-400"
                  }`}
              >
                1
              </div>
              <div
                className={`text-sm mt-1 ${step === 1 ? "text-orange-500 font-medium" : "text-gray-400"}`}
              >
                Details
              </div>
            </div>
            <div className="text-center">
              <div
                className={`text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center mx-auto ${step === 2 ? "bg-orange-500 text-white" : "text-gray-400 border border-gray-400"
                  }`}
              >
                2
              </div>
              <div
                className={`text-sm mt-1 ${step === 2 ? "text-orange-500 font-medium" : "text-gray-400"}`}
              >
                Schedule
              </div>
            </div>
            <div className="text-center">
              <div
                className={`text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center mx-auto ${step === 3 ? "bg-orange-500 text-white" : "text-gray-400 border border-gray-400"
                  }`}
              >
                3
              </div>
              <div
                className={`text-sm mt-1 ${step === 3 ? "text-orange-500 font-medium" : "text-gray-400"}`}
              >
                Summary
              </div>
            </div>
          </div>

          {/* Step Content */}
          <Suspense
            fallback={
              <div className="min-h-[400px] flex items-center justify-center text-gray-600">
                Loading...
              </div>
            }
          >
            {step === 1 && (
              <UrgentTaskDetails
                onBack={() => window.history.back()}
                onContinue={() => setStep(2)}
              />
            )}
            {step === 2 && <UrgentTaskSchedule onBack={() => setStep(1)} onContinue={() => setStep(3)} />}
            {step === 3 && <UrgentTaskSummary onBack={() => setStep(2)} />}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Page;