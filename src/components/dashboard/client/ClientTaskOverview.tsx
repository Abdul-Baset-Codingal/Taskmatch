/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts";
import { Activity } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useGetTasksByClientQuery } from "@/features/api/taskApi";
import { checkLoginStatus } from "@/resusable/CheckUser";
import { useEffect, useState, useMemo } from "react";

const chartConfig = {
    assigned: {
        label: "Assigned",
        color: "hsl(var(--chart-3))",
    },
    completed: {
        label: "Completed",
        color: "hsl(var(--chart-1))",
    },
    pending: {
        label: "Pending",
        color: "hsl(var(--chart-4))",
    },
};

export function ClientTaskOverview() {
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

    // Function to get tasks from the last 7 days and group by day
    const getTaskData = useMemo(() => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const taskData = days.map((day) => ({
            day,
            assigned: 0,
            completed: 0,
            pending: 0,
        }));

        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Helper to get day index from a date
        const getDayIndex = (date) => {
            const d = new Date(date);
            return d.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
        };

        // Process client tasks
        clientTasks.forEach((task) => {
            const createdAt = new Date(task.createdAt);
            if (createdAt >= oneWeekAgo) {
                const dayIndex = getDayIndex(createdAt);
                taskData[dayIndex].assigned += 1; // All tasks count as assigned
                if (task.status === "completed") {
                    taskData[dayIndex].completed += 1;
                } else if (task.status === "pending") {
                    taskData[dayIndex].pending += 1;
                }
            }
        });

        return taskData;
    }, [clientTasks]);

    // Calculate completion rate
    const totalTasks = getTaskData.reduce((sum, day) => sum + day.assigned, 0);
    const completedTasksCount = getTaskData.reduce((sum, day) => sum + day.completed, 0);
    const completionRate = totalTasks > 0 ? ((completedTasksCount / totalTasks) * 100).toFixed(1) : "0.0";

    // Handle loading and error states
    const isLoading = isStatsLoading;
    const isError = isStatsError;

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    Task Overview
                    <Activity className="h-4 w-4 text-primary" />
                </CardTitle>
                <CardDescription>Weekly task completion statistics</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="text-center text-muted-foreground">Loading...</div>
                ) : isError ? (
                    <div className="text-center text-red-500">Error loading task data</div>
                ) : (
                    <>
                        <div className="mb-4">
                            <div className="text-2xl font-bold">{completionRate}%</div>
                            <p className="text-xs text-muted-foreground">
                                Completion rate this week ({completedTasksCount}/{totalTasks} tasks)
                            </p>
                        </div>
                        <ChartContainer config={chartConfig} className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={getTaskData}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis
                                        dataKey="day"
                                        axisLine={false}
                                        tickLine={false}
                                        className="text-xs fill-muted-foreground"
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        className="text-xs fill-muted-foreground"
                                    />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="assigned" fill="var(--color-chart-3)" radius={[2, 2, 0, 0]} />
                                    <Bar dataKey="completed" fill="var(--color-chart-1)" radius={[2, 2, 0, 0]} />
                                    <Bar dataKey="pending" fill="var(--color-chart-4)" radius={[2, 2, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </>
                )}
            </CardContent>
        </Card>
    );
}