/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts";
import { TrendingUp, DollarSign } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useGetTasksByClientQuery } from "@/features/api/taskApi";
import { checkLoginStatus } from "@/resusable/CheckUser";
import { useEffect, useState, useMemo } from "react";

const chartConfig = {
    spent: {
        label: "Spent",
        color: "hsl(var(--chart-1))",
    },
    estimated: {
        label: "Estimated",
        color: "hsl(var(--chart-2))",
    },
};

export function ClientSpentChart() {
    const [user, setUser] = useState(null);

    // Fetch user data
    useEffect(() => {
        const fetchUser = async () => {
            const { isLoggedIn, user } = await checkLoginStatus();
            if (isLoggedIn) {
                setUser(user);
                console.log("User object:", user);
            }
        };

        fetchUser();
    }, []);

    // Fetch tasks for the client
    const {
        data: clientTasks = [],
        isLoading: isStatsLoading,
        isError: isStatsError,
    } = useGetTasksByClientQuery(user?._id ? { clientId: user._id } : { clientId: "" }, {
        skip: !user?._id,
    });

    // Function to generate spending data for the current year
    const getSpendingData = useMemo(() => {
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ];
        const spendingData = months.map((month) => ({
            month,
            spent: 0,
            estimated: 0,
        }));

        const currentYear = new Date().getFullYear();

        // Process client tasks
        clientTasks.forEach((task) => {
            const createdAt = new Date(task.createdAt);
            if (createdAt.getFullYear() === currentYear) {
                const monthIndex = createdAt.getMonth(); // 0 = Jan, 11 = Dec
                if (task.status === "completed") {
                    spendingData[monthIndex].spent += task.price || 0;
                }
                // Include pending and in-progress tasks as estimated spending
                if (task.status === "pending" || task.status === "in_progress") {
                    spendingData[monthIndex].estimated += task.price || 0;
                }
            }
        });

        return spendingData;
    }, [clientTasks]);

    // Determine current and previous month indices
    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth(); // e.g., 9 for October 2025
    const previousMonthIndex = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1; // Handle January edge case

    // Calculate current and previous month spending
    const currentMonthSpent = getSpendingData[currentMonthIndex]?.spent || 0;
    const previousMonthSpent = getSpendingData[previousMonthIndex]?.spent || 0;
    const growthPercentage = previousMonthSpent > 0
        ? (((currentMonthSpent - previousMonthSpent) / previousMonthSpent) * 100).toFixed(1)
        : currentMonthSpent > 0 ? "100.0" : "0.0"; // Handle no previous spending case

    return (
        <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="relative">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
                            <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg">
                                <DollarSign className="h-5 w-5 text-white" />
                            </div>
                            Spending Overview
                        </CardTitle>
                        <CardDescription className="text-slate-600">
                            Monthly spending and estimated costs for the current year
                        </CardDescription>
                    </div>
                    {isStatsLoading ? (
                        <div className="text-sm text-muted-foreground">Loading...</div>
                    ) : isStatsError ? (
                        <div className="text-sm text-red-500">Error</div>
                    ) : (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 rounded-full">
                            <TrendingUp className="h-4 w-4 text-emerald-600" />
                            <span className="text-sm font-semibold text-emerald-700">
                                {parseFloat(growthPercentage) >= 0 ? "+" : ""}{growthPercentage}%
                            </span>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="relative">
                {isStatsLoading ? (
                    <div className="text-center text-muted-foreground">Loading...</div>
                ) : isStatsError ? (
                    <div className="text-center text-red-500">Error loading spending data</div>
                ) : (
                    <>
                        <div className="mb-6 p-4 bg-white/60 rounded-xl border border-white/40 shadow-sm">
                            <div className="flex items-baseline gap-2">
                                <div className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                    ${currentMonthSpent.toLocaleString()}
                                </div>
                                <div className="text-sm text-slate-500">this month</div>
                            </div>
                            <p className="text-sm text-slate-600 mt-1">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                                    {parseFloat(growthPercentage) >= 0 ? "+" : ""}{growthPercentage}%
                                </span>
                                <span className="ml-2">from last month</span>
                            </p>
                        </div>
                        <div className="relative">
                            <ChartContainer config={chartConfig} className="h-[320px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={getSpendingData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="spentGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                                <stop offset="50%" stopColor="#10b981" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="estimatedGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                                                <stop offset="50%" stopColor="#f59e0b" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                                        <XAxis
                                            dataKey="month"
                                            axisLine={false}
                                            tickLine={false}
                                            className="text-xs fill-slate-500"
                                            tick={{ fontSize: 12 }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            className="text-xs fill-slate-500"
                                            tickFormatter={(value) => `$${value}`}
                                            tick={{ fontSize: 12 }}
                                        />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Area
                                            type="monotone"
                                            dataKey="spent"
                                            stroke="#10b981"
                                            fillOpacity={1}
                                            fill="url(#spentGradient)"
                                            strokeWidth={3}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="estimated"
                                            stroke="#f59e0b"
                                            fillOpacity={1}
                                            fill="url(#estimatedGradient)"
                                            strokeWidth={3}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}