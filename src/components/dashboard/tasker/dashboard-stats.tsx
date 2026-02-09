"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetTasksByTaskerIdAndStatusQuery } from "@/features/api/taskApi";
import { checkLoginStatus } from "@/resusable/CheckUser";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { DollarSign, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

// ⭐ Helper function to get tasker's actual payout from a task
const getTaskerPayout = (task: any): number => {
    // Priority 1: Check payment.taskerPayout (in dollars)
    if (task.payment?.taskerPayout) {
        return task.payment.taskerPayout;
    }

    // Priority 2: Check payment.taskerPayoutCents (convert to dollars)
    if (task.payment?.taskerPayoutCents) {
        return task.payment.taskerPayoutCents / 100;
    }

    // Priority 3: Calculate from acceptedBidAmount if payment details not available
    // Using the fee structure: Tasker pays 12% platform fee + 13% tax = 25% deduction
    if (task.acceptedBidAmount) {
        const bidAmount = task.acceptedBidAmount;
        const taskerPlatformFee = bidAmount * 0.12;  // 12%
        const taskerTax = bidAmount * 0.13;          // 13%
        return bidAmount - taskerPlatformFee - taskerTax;
    }

    // Priority 4: Fallback to price (old data) - not ideal but prevents NaN
    if (task.price) {
        // Apply approximate deduction
        return task.price * 0.75; // ~25% fees
    }

    return 0;
};

export function DashboardStats() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { isLoggedIn, user } = await checkLoginStatus();
            if (isLoggedIn && user?.currentRole === "tasker") {
                setUser(user);
            }
        };
        fetchUser();
    }, []);

    const {
        data: completedTasks = [],
        isLoading: loadingCompleted,
    } = useGetTasksByTaskerIdAndStatusQuery(
        user?._id
            ? { taskerId: user._id, status: "completed" }
            : skipToken,
        { skip: !user?._id }
    );

    console.log("Completed tasks:", completedTasks);

    const {
        data: pendingTasks = [],
        isLoading: loadingPending,
    } = useGetTasksByTaskerIdAndStatusQuery(
        user?._id
            ? { taskerId: user._id, status: "pending" }
            : skipToken,
        { skip: !user?._id }
    );

    const {
        data: inProgressTasks = [],
        isLoading: loadingInProgress,
    } = useGetTasksByTaskerIdAndStatusQuery(
        user?._id
            ? { taskerId: user._id, status: "in_progress" }
            : skipToken,
        { skip: !user?._id }
    );

    // ⭐ UPDATED: Calculate total income using actual tasker payout
    const totalIncome = completedTasks.reduce(
        (sum: number, task: any) => sum + getTaskerPayout(task),
        0
    );

    // ⭐ OPTIONAL: Log breakdown for debugging
    useEffect(() => {
        if (completedTasks.length > 0) {
            console.log("💰 Earnings Breakdown:");
            completedTasks.forEach((task: any, index: number) => {
                const payout = getTaskerPayout(task);
                console.log(`  Task ${index + 1} (${task.taskTitle?.substring(0, 30)}...):`, {
                    bidAmount: task.acceptedBidAmount || task.payment?.bidAmount,
                    taskerPayout: payout,
                    paymentStatus: task.payment?.status,
                });
            });
            console.log(`  📊 Total Earnings: $${totalIncome.toFixed(2)}`);
        }
    }, [completedTasks, totalIncome]);

    const stats = [
        {
            title: "Total Earnings",
            value: loadingCompleted ? "—" : `$${totalIncome.toFixed(2)}`,
            icon: DollarSign,
            color: "text-[#109C3D]",
            bg: "bg-[#E5FFDB]",
            description: "Your earnings after fees",
        },
        {
            title: "Completed Tasks",
            value: loadingCompleted ? "—" : completedTasks.length,
            icon: CheckCircle2,
            color: "text-[#109C3D]",
            bg: "bg-[#E5FFDB]",
            description: "Successfully finished",
        },
        {
            title: "In Progress",
            value: loadingInProgress ? "—" : inProgressTasks.length,
            icon: Clock,
            color: "text-[#063A41]",
            bg: "bg-gray-100",
            description: "Active jobs",
        },
        {
            title: "Pending Approval",
            value: loadingPending ? "—" : pendingTasks.length,
            icon: AlertCircle,
            color: "text-orange-600",
            bg: "bg-orange-50",
            description: "Awaiting confirmation",
        },
    ];

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card
                    key={stat.title}
                    className="relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white group"
                >
                    {/* Subtle green accent on hover */}
                    <div className="absolute inset-x-0 top-0 h-1.5 bg-[#109C3D] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            {stat.title}
                        </CardTitle>
                        <div className={`p-3 rounded-full ${stat.bg} shadow-sm`}>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="text-3xl font-bold text-[#063A41]">
                            {stat.value}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}