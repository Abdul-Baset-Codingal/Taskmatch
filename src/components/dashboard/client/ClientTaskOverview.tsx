/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/ban-ts-comment */
// // @ts-nocheck
// "use client";

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts";
// import { Activity } from "lucide-react";
// import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
// import { useGetTasksByClientQuery } from "@/features/api/taskApi";
// import { checkLoginStatus } from "@/resusable/CheckUser";
// import { useEffect, useState, useMemo } from "react";

// const chartConfig = {
//     assigned: {
//         label: "Assigned",
//         color: "hsl(var(--chart-3))",
//     },
//     completed: {
//         label: "Completed",
//         color: "hsl(var(--chart-1))",
//     },
//     pending: {
//         label: "Pending",
//         color: "hsl(var(--chart-4))",
//     },
// };

// export function ClientTaskOverview() {
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

//     // Function to get tasks from the last 7 days and group by day
//     const getTaskData = useMemo(() => {
//         const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
//         const taskData = days.map((day) => ({
//             day,
//             assigned: 0,
//             completed: 0,
//             pending: 0,
//         }));

//         const now = new Date();
//         const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

//         // Helper to get day index from a date
//         const getDayIndex = (date) => {
//             const d = new Date(date);
//             return d.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
//         };

//         // Process client tasks
//         clientTasks.forEach((task) => {
//             const createdAt = new Date(task.createdAt);
//             if (createdAt >= oneWeekAgo) {
//                 const dayIndex = getDayIndex(createdAt);
//                 taskData[dayIndex].assigned += 1; // All tasks count as assigned
//                 if (task.status === "completed") {
//                     taskData[dayIndex].completed += 1;
//                 } else if (task.status === "pending") {
//                     taskData[dayIndex].pending += 1;
//                 }
//             }
//         });

//         return taskData;
//     }, [clientTasks]);

//     // Calculate completion rate
//     const totalTasks = getTaskData.reduce((sum, day) => sum + day.assigned, 0);
//     const completedTasksCount = getTaskData.reduce((sum, day) => sum + day.completed, 0);
//     const completionRate = totalTasks > 0 ? ((completedTasksCount / totalTasks) * 100).toFixed(1) : "0.0";

//     // Handle loading and error states
//     const isLoading = isStatsLoading;
//     const isError = isStatsError;

//     return (
//         <Card className="hover:shadow-md transition-shadow">
//             <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                     Task Overview
//                     <Activity className="h-4 w-4 text-primary" />
//                 </CardTitle>
//                 <CardDescription>Weekly task completion statistics</CardDescription>
//             </CardHeader>
//             <CardContent>
//                 {isLoading ? (
//                     <div className="text-center text-muted-foreground">Loading...</div>
//                 ) : isError ? (
//                     <div className="text-center text-red-500">Error loading task data</div>
//                 ) : (
//                     <>
//                         <div className="mb-4">
//                             <div className="text-2xl font-bold">{completionRate}%</div>
//                             <p className="text-xs text-muted-foreground">
//                                 Completion rate this week ({completedTasksCount}/{totalTasks} tasks)
//                             </p>
//                         </div>
//                         <ChartContainer config={chartConfig} className="h-[300px]">
//                             <ResponsiveContainer width="100%" height="100%">
//                                 <BarChart
//                                     data={getTaskData}
//                                     margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
//                                 >
//                                     <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
//                                     <XAxis
//                                         dataKey="day"
//                                         axisLine={false}
//                                         tickLine={false}
//                                         className="text-xs fill-muted-foreground"
//                                     />
//                                     <YAxis
//                                         axisLine={false}
//                                         tickLine={false}
//                                         className="text-xs fill-muted-foreground"
//                                     />
//                                     <ChartTooltip content={<ChartTooltipContent />} />
//                                     <Bar dataKey="assigned" fill="var(--color-chart-3)" radius={[2, 2, 0, 0]} />
//                                     <Bar dataKey="completed" fill="var(--color-chart-1)" radius={[2, 2, 0, 0]} />
//                                     <Bar dataKey="pending" fill="var(--color-chart-4)" radius={[2, 2, 0, 0]} />
//                                 </BarChart>
//                             </ResponsiveContainer>
//                         </ChartContainer>
//                     </>
//                 )}
//             </CardContent>
//         </Card>
//     );
// }

// @ts-nocheck

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { CheckCircle2 } from "lucide-react";
import { useGetTasksByClientQuery } from "@/features/api/taskApi";
import { checkLoginStatus } from "@/resusable/CheckUser";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useEffect, useState, useMemo } from "react";

export function ClientTaskOverview() {
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

    // Generate last 7 days data
    const chartData = useMemo(() => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const today = new Date();
        const data: { inProgress: number; }[] = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dayLabel = days[date.getDay()];

            data.push({
                day: dayLabel,
                created: 0,
                completed: 0,
                inProgress: 0,
            });
        }

        tasks.forEach((task: any) => {
            const taskDate = new Date(task.createdAt || task.updatedAt);
            const diffDays = Math.floor((today.getTime() - taskDate.getTime()) / (1000 * 60 * 60 * 24));

            if (diffDays <= 6) {
                const index = 6 - diffDays;
                data[index].created++;

                if (task.status === "completed") data[index].completed++;
                if (task.status === "in_progress" || task.status === "in progress") data[index].inProgress++;
            }
        });

        return data;
    }, [tasks]);

    const totalThisWeek = chartData.reduce((sum, d) => sum + d.created, 0);
    const completedThisWeek = chartData.reduce((sum, d) => sum + d.completed, 0);
    const completionRate = totalThisWeek > 0 ? Math.round((completedThisWeek / totalThisWeek) * 100) : 0;

    return (
        <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white">
            {/* Top green accent */}
            <div className="absolute inset-x-0 top-0 h-1.5 bg-[#109C3D] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />

            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-[#E5FFDB] shadow-sm">
                            <CheckCircle2 className="w-6 h-6 text-[#109C3D]" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold text-[#063A41]">
                                Task Activity
                            </CardTitle>
                            <p className="text-sm text-gray-500">Last 7 days</p>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-3xl font-bold text-[#109C3D]">{completionRate}%</div>
                        <p className="text-xs text-gray-500">completion rate</p>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                {isLoading ? (
                    <div className="h-72 flex items-center justify-center text-gray-400">Loading activity...</div>
                ) : totalThisWeek === 0 ? (
                    <div className="h-72 flex flex-col items-center justify-center text-center text-gray-500">
                        <CheckCircle2 className="w-16 h-16 text-gray-300 mb-4" />
                        <p className="text-lg font-medium">No tasks this week</p>
                        <p className="text-sm">Your activity will appear once you post tasks</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="4 4" stroke="#f0f0f0" vertical={false} />
                            <XAxis
                                dataKey="day"
                                tick={{ fontSize: 12, fill: "#6b7280" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: "#6b7280" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                cursor={{ fill: "rgba(16, 156, 61, 0.05)" }}
                                contentStyle={{
                                    backgroundColor: "white",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                }}
                            />

                            {/* Created Tasks - Dark Teal */}
                            <Bar dataKey="created" fill="#063A41" radius={[8, 8, 0, 0]} barSize={20} />

                            {/* Completed - Green */}
                            <Bar dataKey="completed" fill="#109C3D" radius={[8, 8, 0, 0]} barSize={20} />

                            {/* In Progress - Light Gray */}
                            <Bar dataKey="inProgress" fill="#94a3b8" radius={[8, 8, 0, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                )}

                {/* Legend */}
                <div className="flex justify-center gap-6 mt-6 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#063A41]" />
                        <span className="text-gray-600">Created</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#109C3D]" />
                        <span className="text-gray-600">Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#94a3b8]" />
                        <span className="text-gray-600">In Progress</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}