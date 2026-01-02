"use client";

import UrgentTaskDetails from "@/components/routes/urgent-task/UrgentTaskDetails";
import UrgentTaskSchedule from "@/components/routes/urgent-task/UrgentTaskSchedule";
import UrgentTaskSummary from "@/components/routes/urgent-task/UrgentTaskSummary";
import Navbar from "@/shared/Navbar";
import { useSearchParams, useRouter } from "next/navigation";
import React, { Suspense } from "react";

// Separate component that uses useSearchParams
const UrgentTaskContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const rawStep = searchParams?.get("step");
    let step = rawStep ? parseInt(rawStep, 10) : 1;
    if (Number.isNaN(step)) step = 1;
    step = Math.max(1, Math.min(3, step)); // Clamp to 1-3

    const handleContinue = () => {
        if (step < 3) {
            router.push(`?step=${step + 1}`);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            router.push(`?step=${step - 1}`);
        } else {
            router.back();
        }
    };

    return (
        <>
            {step === 1 && <UrgentTaskDetails onBack={handleBack} onContinue={handleContinue} />}
            {step === 2 && <UrgentTaskSchedule onBack={handleBack} onContinue={handleContinue} />}
            {step === 3 && <UrgentTaskSummary onBack={handleBack} />}
        </>
    );
};

const UrgentTaskClient = () => {
    return (
        <div>
            <Navbar />
            <div className="mt-2">
                <div className="max-w-7xl mx-auto px-4 lg:px-10 py-10 rounded-2xl">
                    <Suspense
                        fallback={
                            <div className="min-h-[400px] flex items-center justify-center text-gray-600">
                                Loading...
                            </div>
                        }
                    >
                        <UrgentTaskContent />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default UrgentTaskClient;