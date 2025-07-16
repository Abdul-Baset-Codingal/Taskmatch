/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import Service from '@/components/routes/urgent-task/Service';
import UrgentTaskDetails from '@/components/routes/urgent-task/UrgentTaskDetails';
import UrgentTaskSchedule from '@/components/routes/urgent-task/UrgentTaskSchedule';
import Navbar from '@/shared/Navbar';
import React, { useState } from 'react';

const page = () => {
  const [step, setStep] = useState(1);

  return (
    <div>
      <div>
        <Navbar />
      </div>
      {/* <div>
        <UrgentBanner/>
      </div> */}
      <div className="mt-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 py-10 text-black bg-orange-50 border-t-4 border-orange-500 rounded-2xl">
          {/* Step Indicator */}
          <div className="flex justify-between items-center mb-10">
            <div className="text-center">
              <div
                className={`text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
                  step === 1
                    ? "bg-orange-500 text-white"
                    : "text-gray-400 border border-gray-400"
                }`}
              >
                1
              </div>
              <div
                className={`text-sm mt-1 ${
                  step === 1 ? "text-orange-500 font-medium" : "text-gray-400"
                }`}
              >
                Service
              </div>
            </div>
            <div className="text-center">
              <div
                className={`text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
                  step === 2
                    ? "bg-orange-500 text-white"
                    : "text-gray-400 border border-gray-400"
                }`}
              >
                2
              </div>
              <div
                className={`text-sm mt-1 ${
                  step === 2 ? "text-orange-500 font-medium" : "text-gray-400"
                }`}
              >
                Details
              </div>
            </div>
            <div className="text-center">
              <div
                className={`text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
                  step === 3
                    ? "bg-orange-500 text-white"
                    : "text-gray-400 border border-gray-400"
                }`}
              >
                3
              </div>
              <div
                className={`text-sm mt-1 ${
                  step === 3 ? "text-orange-500 font-medium" : "text-gray-400"
                }`}
              >
                Schedule
              </div>
            </div>
          </div>

          {/* Step Content */}
          {step === 1 && <Service onContinue={() => setStep(2)} />}
          {step === 2 && (
            <UrgentTaskDetails
              onBack={() => setStep(1)}
              onContinue={() => setStep(3)}
            />
          )}
          {step === 3 && <UrgentTaskSchedule onBack={() => setStep(2)} />}
        </div>
      </div>
    </div>
  );
};

export default page;
