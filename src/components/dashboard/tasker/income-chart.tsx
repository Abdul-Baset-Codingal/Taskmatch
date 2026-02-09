"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";
import { DollarSign, TrendingUp } from "lucide-react";
import { useGetTasksByTaskerIdAndStatusQuery } from "@/features/api/taskApi";
import { checkLoginStatus } from "@/resusable/CheckUser";
import { skipToken } from "@reduxjs/toolkit/query/react";
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
        return task.price * 0.75; // ~25% fees
    }

    return 0;
};

export function IncomeChart() {
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

    const { data: completedTasks = [], isLoading } = useGetTasksByTaskerIdAndStatusQuery(
        user?._id
            ? { taskerId: user._id, status: "completed" }
            : skipToken,
        { skip: !user?._id }
    );

    // ⭐ Generate monthly income data using actual tasker payout
    const generateChartData = () => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentYear = new Date().getFullYear();

        const monthlyData = months.map((month) => ({
            month,
            income: 0,
        }));

        completedTasks.forEach((task: any) => {
            const date = new Date(task.completedAt || task.createdAt);
            if (date.getFullYear() === currentYear) {
                const monthIndex = date.getMonth();
                // ⭐ Use getTaskerPayout instead of task.price
                monthlyData[monthIndex].income += getTaskerPayout(task);
            }
        });

        // Round to 2 decimal places
        monthlyData.forEach(data => {
            data.income = Math.round(data.income * 100) / 100;
        });

        return monthlyData;
    };

    const chartData = isLoading ? [] : generateChartData();

    // Current month income
    const currentMonthIncome = chartData[new Date().getMonth()]?.income || 0;
    const previousMonthIncome = chartData[new Date().getMonth() - 1]?.income || 0;

    const growth = previousMonthIncome === 0
        ? currentMonthIncome > 0 ? 100 : 0
        : ((currentMonthIncome - previousMonthIncome) / previousMonthIncome) * 100;

    // ⭐ Calculate total yearly income
    const totalYearlyIncome = chartData.reduce((sum, month) => sum + month.income, 0);

    return (
        <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white group">
            {/* Subtle top accent */}
            <div className="absolute inset-x-0 top-0 h-1.5 bg-[#109C3D] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />

            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-[#E5FFDB] shadow-sm">
                            <DollarSign className="w-6 h-6 text-[#109C3D]" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold text-[#063A41]">
                                Income Overview
                            </CardTitle>
                            <p className="text-sm text-gray-500">Your earnings after platform fees</p>
                        </div>
                    </div>

                    {!isLoading && (
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${growth >= 0 ? "bg-[#E5FFDB] text-[#109C3D]" : "bg-red-50 text-red-700"
                            }`}>
                            <TrendingUp className={`w-4 h-4 ${growth >= 0 ? "rotate-0" : "rotate-180"}`} />
                            {growth >= 0 ? "+" : ""}{growth.toFixed(1)}%
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                {/* Current Month & Year Total */}
                <div className="mb-6 flex justify-between items-end">
                    <div>
                        <div className="text-4xl font-bold text-[#063A41]">
                            ${currentMonthIncome.toFixed(2)}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                        </p>
                    </div>
                    {/* ⭐ Show yearly total */}
                    {!isLoading && totalYearlyIncome > 0 && (
                        <div className="text-right">
                            <div className="text-lg font-semibold text-[#063A41]">
                                ${totalYearlyIncome.toFixed(2)}
                            </div>
                            <p className="text-xs text-gray-500">
                                Total this year
                            </p>
                        </div>
                    )}
                </div>

                {/* Chart */}
                {isLoading ? (
                    <div className="h-80 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                            <div className="w-8 h-8 border-2 border-[#109C3D] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                            Loading earnings...
                        </div>
                    </div>
                ) : chartData.every(d => d.income === 0) ? (
                    <div className="h-80 flex flex-col items-center justify-center text-center text-gray-500">
                        <DollarSign className="w-16 h-16 text-gray-300 mb-4" />
                        <p className="text-lg font-medium">No earnings yet</p>
                        <p className="text-sm">Complete your first task to see income here</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={320}>
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="4 4" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="month"
                                tick={{ fontSize: 12, fill: "#6b7280" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: "#6b7280" }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "white",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                }}
                                formatter={(value: number) => [`$${value.toFixed(2)}`, "Your Earnings"]}
                                labelFormatter={(label) => `${label} ${new Date().getFullYear()}`}
                            />
                            <defs>
                                <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#109C3D" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#109C3D" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="income"
                                stroke="#109C3D"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#incomeFill)"
                                dot={{ fill: "#109C3D", r: 5 }}
                                activeDot={{ r: 7 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}

            
            </CardContent>
        </Card>
    );
}