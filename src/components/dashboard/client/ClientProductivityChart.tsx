/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { CheckCircle2, TrendingUp, Sparkles, Clock, Star } from "lucide-react";
import { useGetTasksByClientQuery } from "@/features/api/taskApi";
import { checkLoginStatus } from "@/resusable/CheckUser";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ClientProductivityChart() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { isLoggedIn, user } = await checkLoginStatus();
            if (isLoggedIn) setUser(user);
        };
        fetchUser();
    }, []);

    const { data: tasks = [], isLoading } = useGetTasksByClientQuery(
        user?._id ? { clientId: user._id } : skipToken,
        { skip: !user?._id }
    );

    // Generate monthly completed tasks data
    const chartData = useMemo(() => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentYear = new Date().getFullYear();

        const data = months.map((month) => ({ month, completed: 0 }));

        tasks.forEach((task: any) => {
            if (task.status !== "completed") return;

            const date = new Date(task.completedAt || task.createdAt);
            if (date.getFullYear() !== currentYear) return;

            const monthIndex = date.getMonth();
            data[monthIndex].completed += 1;
        });

        return data;
    }, [tasks]);

    // Calculate stats
    const totalCompleted = tasks.filter((t: any) => t.status === "completed").length;
    const totalTasks = tasks.length;
    const currentMonthCompleted = chartData[new Date().getMonth()]?.completed || 0;
    const previousMonthCompleted = chartData[new Date().getMonth() - 1]?.completed || 0;

    const growth = previousMonthCompleted === 0
        ? currentMonthCompleted > 0 ? 100 : 0
        : ((currentMonthCompleted - previousMonthCompleted) / previousMonthCompleted) * 100;

    // Calculate hours saved (estimate 2-4 hours per task)
    const hoursSaved = totalCompleted * 3; // Average 3 hours per task

    // Motivational messages based on activity
    const getMotivationalMessage = () => {
        if (totalCompleted === 0) return "Post your first task and let us handle the rest!";
        if (totalCompleted < 5) return "Great start! You're discovering the power of delegation.";
        if (totalCompleted < 15) return "You're on a roll! Keep the momentum going.";
        if (totalCompleted < 30) return "Power user alert! You've mastered productivity.";
        return "🏆 TaskMaster Pro! You're a delegation champion!";
    };

    return (
        <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white group">
            {/* Top accent */}
            <div className="absolute inset-x-0 top-0 h-1.5 " />

            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-gradient-to-br from-[#E5FFDB] to-[#d0f5c0] shadow-sm">
                            <CheckCircle2 className="w-6 h-6 text-[#109C3D]" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold text-[#063A41]">
                                Your Productivity Journey
                            </CardTitle>
                            <p className="text-sm text-gray-500">Tasks completed this year</p>
                        </div>
                    </div>

                    {!isLoading && totalCompleted > 0 && growth !== 0 && (
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${growth >= 0 ? "bg-[#E5FFDB] text-[#109C3D]" : "bg-orange-50 text-orange-600"
                            }`}>
                            <TrendingUp className={`w-4 h-4 ${growth < 0 ? "rotate-180" : ""}`} />
                            {growth >= 0 ? "+" : ""}{growth.toFixed(0)}% this month
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                {/* Stats Row */}
                <div className="mb-6 grid grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-[#E5FFDB]/50 to-white border border-[#E5FFDB]">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <CheckCircle2 className="w-5 h-5 text-[#109C3D]" />
                        </div>
                        <p className="text-3xl font-bold text-[#063A41]">{totalCompleted}</p>
                        <p className="text-xs text-gray-500">Tasks Done</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <p className="text-3xl font-bold text-[#063A41]">{hoursSaved}h</p>
                        <p className="text-xs text-gray-500">Time Saved</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-50 to-white border border-amber-100">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <Star className="w-5 h-5 text-amber-500" />
                        </div>
                        <p className="text-3xl font-bold text-[#063A41]">{totalTasks}</p>
                        <p className="text-xs text-gray-500">Total Tasks</p>
                    </div>
                </div>

                {/* Chart or Empty State */}
                {isLoading ? (
                    <div className="h-64 flex items-center justify-center text-gray-400">
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="w-12 h-12 bg-gray-200 rounded-full mb-3"></div>
                            <div className="h-4 w-32 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                ) : totalCompleted === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-[#E5FFDB]/30 to-white rounded-2xl border border-dashed border-[#109C3D]/30">
                        <div className="p-4 rounded-full bg-[#E5FFDB] mb-4">
                            <Sparkles className="w-10 h-10 text-[#109C3D]" />
                        </div>
                        <h3 className="text-xl font-bold text-[#063A41] mb-2">
                            Ready to save time?
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-sm">
                            Post your first task and watch your productivity soar! Our skilled taskers are ready to help.
                        </p>
                            <Link href="/urgent-task?search=general%20service">
                            <Button className="bg-[#109C3D] hover:bg-[#0d8a35] text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all">
                                <Sparkles className="w-4 h-4 mr-2" />
                                Post Your First Task
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <>
                        <ResponsiveContainer width="100%" height={240}>
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
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "white",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "12px",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    }}
                                    formatter={(value: number) => [`${value} tasks`, "Completed"]}
                                    labelStyle={{ fontWeight: "bold", color: "#063A41" }}
                                />
                                <defs>
                                    <linearGradient id="completedFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#109C3D" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#109C3D" stopOpacity={0.05} />
                                    </linearGradient>
                                </defs>
                                <Area
                                    type="monotone"
                                    dataKey="completed"
                                    stroke="#109C3D"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#completedFill)"
                                    dot={{ fill: "#109C3D", r: 4, strokeWidth: 2, stroke: "#fff" }}
                                    activeDot={{ r: 6, stroke: "#109C3D", strokeWidth: 2, fill: "#fff" }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>

                        {/* Motivational Footer */}
                        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-[#063A41] to-[#0a5259] text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Sparkles className="w-6 h-6 text-[#E5FFDB]" />
                                    <div>
                                        <p className="font-medium">{getMotivationalMessage()}</p>
                                        <p className="text-sm text-white/70">Keep delegating and focus on what matters most.</p>
                                    </div>
                                </div>
                                        <Link href="/urgent-task?search=general%20service">
                                    <Button
                                        size="sm"
                                        className="bg-[#109C3D] hover:bg-[#0d8a35] text-white rounded-full px-6"
                                    >
                                        Post Task
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}