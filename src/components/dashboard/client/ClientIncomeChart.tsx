/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/ban-ts-comment */
// // @ts-nocheck
// "use client";

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts";
// import { TrendingUp, DollarSign } from "lucide-react";
// import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
// import { useGetTasksByClientQuery } from "@/features/api/taskApi";
// import { checkLoginStatus } from "@/resusable/CheckUser";
// import { useEffect, useState, useMemo } from "react";

// const chartConfig = {
//     spent: {
//         label: "Spent",
//         color: "hsl(var(--chart-1))",
//     },
//     estimated: {
//         label: "Estimated",
//         color: "hsl(var(--chart-2))",
//     },
// };

// export function ClientSpentChart() {
//     const [user, setUser] = useState(null);

//     // Fetch user data
//     useEffect(() => {
//         const fetchUser = async () => {
//             const { isLoggedIn, user } = await checkLoginStatus();
//             if (isLoggedIn) {
//                 setUser(user);
//                 console.log("User object:", user);
//             }
//         };

//         fetchUser();
//     }, []);

//     // Fetch tasks for the client
//     const {
//         data: clientTasks = [],
//         isLoading: isStatsLoading,
//         isError: isStatsError,
//     } = useGetTasksByClientQuery(user?._id ? { clientId: user._id } : { clientId: "" }, {
//         skip: !user?._id,
//     });

//     // Function to generate spending data for the current year
//     const getSpendingData = useMemo(() => {
//         const months = [
//             "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//             "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
//         ];
//         const spendingData = months.map((month) => ({
//             month,
//             spent: 0,
//             estimated: 0,
//         }));

//         const currentYear = new Date().getFullYear();

//         // Process client tasks
//         clientTasks.forEach((task) => {
//             const createdAt = new Date(task.createdAt);
//             if (createdAt.getFullYear() === currentYear) {
//                 const monthIndex = createdAt.getMonth(); // 0 = Jan, 11 = Dec
//                 if (task.status === "completed") {
//                     spendingData[monthIndex].spent += task.price || 0;
//                 }
//                 // Include pending and in-progress tasks as estimated spending
//                 if (task.status === "pending" || task.status === "in_progress") {
//                     spendingData[monthIndex].estimated += task.price || 0;
//                 }
//             }
//         });

//         return spendingData;
//     }, [clientTasks]);

//     // Determine current and previous month indices
//     const currentDate = new Date();
//     const currentMonthIndex = currentDate.getMonth(); // e.g., 9 for October 2025
//     const previousMonthIndex = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1; // Handle January edge case

//     // Calculate current and previous month spending
//     const currentMonthSpent = getSpendingData[currentMonthIndex]?.spent || 0;
//     const previousMonthSpent = getSpendingData[previousMonthIndex]?.spent || 0;
//     const growthPercentage = previousMonthSpent > 0
//         ? (((currentMonthSpent - previousMonthSpent) / previousMonthSpent) * 100).toFixed(1)
//         : currentMonthSpent > 0 ? "100.0" : "0.0"; // Handle no previous spending case

//     return (
//         <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 backdrop-blur-sm">
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//             <CardHeader className="relative">
//                 <div className="flex items-center justify-between">
//                     <div className="space-y-1">
//                         <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
//                             <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg">
//                                 <DollarSign className="h-5 w-5 text-white" />
//                             </div>
//                             Spending Overview
//                         </CardTitle>
//                         <CardDescription className="text-slate-600">
//                             Monthly spending and estimated costs for the current year
//                         </CardDescription>
//                     </div>
//                     {isStatsLoading ? (
//                         <div className="text-sm text-muted-foreground">Loading...</div>
//                     ) : isStatsError ? (
//                         <div className="text-sm text-red-500">Error</div>
//                     ) : (
//                         <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 rounded-full">
//                             <TrendingUp className="h-4 w-4 text-emerald-600" />
//                             <span className="text-sm font-semibold text-emerald-700">
//                                 {parseFloat(growthPercentage) >= 0 ? "+" : ""}{growthPercentage}%
//                             </span>
//                         </div>
//                     )}
//                 </div>
//             </CardHeader>
//             <CardContent className="relative">
//                 {isStatsLoading ? (
//                     <div className="text-center text-muted-foreground">Loading...</div>
//                 ) : isStatsError ? (
//                     <div className="text-center text-red-500">Error loading spending data</div>
//                 ) : (
//                     <>
//                         <div className="mb-6 p-4 bg-white/60 rounded-xl border border-white/40 shadow-sm">
//                             <div className="flex items-baseline gap-2">
//                                 <div className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                                     ${currentMonthSpent.toLocaleString()}
//                                 </div>
//                                 <div className="text-sm text-slate-500">this month</div>
//                             </div>
//                             <p className="text-sm text-slate-600 mt-1">
//                                 <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
//                                     {parseFloat(growthPercentage) >= 0 ? "+" : ""}{growthPercentage}%
//                                 </span>
//                                 <span className="ml-2">from last month</span>
//                             </p>
//                         </div>
//                         <div className="relative">
//                             <ChartContainer config={chartConfig} className="h-[320px]">
//                                 <ResponsiveContainer width="100%" height="100%">
//                                     <AreaChart data={getSpendingData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
//                                         <defs>
//                                             <linearGradient id="spentGradient" x1="0" y1="0" x2="0" y2="1">
//                                                 <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
//                                                 <stop offset="50%" stopColor="#10b981" stopOpacity={0.2} />
//                                                 <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
//                                             </linearGradient>
//                                             <linearGradient id="estimatedGradient" x1="0" y1="0" x2="0" y2="1">
//                                                 <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
//                                                 <stop offset="50%" stopColor="#f59e0b" stopOpacity={0.2} />
//                                                 <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
//                                             </linearGradient>
//                                         </defs>
//                                         <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
//                                         <XAxis
//                                             dataKey="month"
//                                             axisLine={false}
//                                             tickLine={false}
//                                             className="text-xs fill-slate-500"
//                                             tick={{ fontSize: 12 }}
//                                         />
//                                         <YAxis
//                                             axisLine={false}
//                                             tickLine={false}
//                                             className="text-xs fill-slate-500"
//                                             tickFormatter={(value) => `$${value}`}
//                                             tick={{ fontSize: 12 }}
//                                         />
//                                         <ChartTooltip content={<ChartTooltipContent />} />
//                                         <Area
//                                             type="monotone"
//                                             dataKey="spent"
//                                             stroke="#10b981"
//                                             fillOpacity={1}
//                                             fill="url(#spentGradient)"
//                                             strokeWidth={3}
//                                         />
//                                         <Area
//                                             type="monotone"
//                                             dataKey="estimated"
//                                             stroke="#f59e0b"
//                                             fillOpacity={1}
//                                             fill="url(#estimatedGradient)"
//                                             strokeWidth={3}
//                                         />
//                                     </AreaChart>
//                                 </ResponsiveContainer>
//                             </ChartContainer>
//                         </div>
//                     </>
//                 )}
//             </CardContent>
//         </Card>
//     );
// }

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
import { useGetTasksByClientQuery } from "@/features/api/taskApi";
import { checkLoginStatus } from "@/resusable/CheckUser";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useEffect, useState, useMemo } from "react";

export function ClientSpentChart() {
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

    // Generate monthly spending data (completed tasks only)
    const chartData = useMemo(() => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentYear = new Date().getFullYear();

        const data = months.map((month) => ({ month, spent: 0 }));

        tasks.forEach((task: any) => {
            if (task.status !== "completed") return;

            const date = new Date(task.createdAt || task.completedAt);
            if (date.getFullYear() !== currentYear) return;

            const monthIndex = date.getMonth();
            data[monthIndex].spent += task.price || 0;
        });

        return data;
    }, [tasks]);

    const currentMonthSpent = chartData[new Date().getMonth()]?.spent || 0;
    const previousMonthSpent = chartData[new Date().getMonth() - 1]?.spent || 0;

    const growth = previousMonthSpent === 0
        ? currentMonthSpent > 0 ? 100 : 0
        : ((currentMonthSpent - previousMonthSpent) / previousMonthSpent) * 100;

    const totalSpentThisYear = chartData.reduce((sum, m) => sum + m.spent, 0);

    return (
        <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white">
            {/* Top green accent */}
            <div className="absolute inset-x-0 top-0 h-1.5 bg-[#109C3D] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />

            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-[#E5FFDB] shadow-sm">
                            <DollarSign className="w-6 h-6 text-[#109C3D]" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold text-[#063A41]">
                                Spending Overview
                            </CardTitle>
                            <p className="text-sm text-gray-500">Your total spend this year</p>
                        </div>
                    </div>

                    {!isLoading && totalSpentThisYear > 0 && (
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${growth >= 0 ? "bg-[#E5FFDB] text-[#109C3D]" : "bg-red-50 text-red-700"
                            }`}>
                            <TrendingUp className={`w-4 h-4 ${growth >= 0 ? "" : "rotate-180"}`} />
                            {growth >= 0 ? "+" : ""}{growth.toFixed(0)}%
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                {/* Current Month + Total */}
                <div className="mb-6 grid grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm text-gray-500">This month</p>
                        <p className="text-3xl font-bold text-[#063A41]">
                            ${currentMonthSpent.toLocaleString()}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total this year</p>
                        <p className="text-3xl font-bold text-[#109C3D]">
                            ${totalSpentThisYear.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Chart */}
                {isLoading ? (
                    <div className="h-80 flex items-center justify-center text-gray-400">Loading spending...</div>
                ) : totalSpentThisYear === 0 ? (
                    <div className="h-80 flex flex-col items-center justify-center text-center text-gray-500">
                        <DollarSign className="w-16 h-16 text-gray-300 mb-4" />
                        <p className="text-lg font-medium">No spending yet</p>
                        <p className="text-sm">Your spending will appear here after completing tasks</p>
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
                                tickFormatter={(v) => `$${v}`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "white",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                }}
                                formatter={(value: number) => `$${value.toLocaleString()}`}
                            />
                            <defs>
                                <linearGradient id="spentFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#109C3D" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#109C3D" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="spent"
                                stroke="#109C3D"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#spentFill)"
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