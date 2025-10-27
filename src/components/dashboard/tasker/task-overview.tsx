/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts";
import { Activity } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useGetTasksByTaskerIdAndStatusQuery } from "@/features/api/taskApi";
import { checkLoginStatus } from "@/resusable/CheckUser";
import { useEffect, useState } from "react";

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

export function TaskOverview() {
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

    // Fetch tasks for different statuses
    const {
        data: completedTasks = [],
        isLoading: isCompletedLoading,
        isError: isCompletedError,
    } = useGetTasksByTaskerIdAndStatusQuery(
        user?._id ? { taskerId: user._id, status: "completed" } : { taskerId: "", status: "completed" },
        { skip: !user?._id }
    );

    const {
        data: pendingTasks = [],
        isLoading: isPendingLoading,
        isError: isPendingError,
    } = useGetTasksByTaskerIdAndStatusQuery(
        user?._id ? { taskerId: user._id, status: "pending" } : { taskerId: "", status: "pending" },
        { skip: !user?._id }
    );

    // Assume "assigned" tasks are all tasks (completed + pending + in_progress) for simplicity
    const {
        data: allTasks = [],
        isLoading: isAllTasksLoading,
        isError: isAllTasksError,
    } = useGetTasksByTaskerIdAndStatusQuery(
        user?._id ? { taskerId: user._id, status: "" } : { taskerId: "", status: "" }, // Empty status to fetch all tasks
        { skip: !user?._id }
    );

    // Function to get tasks from the last 7 days and group by day
    const getTaskData = () => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const taskData = days.map((day, index) => ({
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

        // Process all tasks (assigned)
        allTasks.forEach((task) => {
            const createdAt = new Date(task.createdAt);
            if (createdAt >= oneWeekAgo) {
                const dayIndex = getDayIndex(createdAt);
                taskData[dayIndex].assigned += 1;
            }
        });

        // Process completed tasks
        completedTasks.forEach((task) => {
            const createdAt = new Date(task.createdAt);
            if (createdAt >= oneWeekAgo) {
                const dayIndex = getDayIndex(createdAt);
                taskData[dayIndex].completed += 1;
            }
        });

        // Process pending tasks
        pendingTasks.forEach((task) => {
            const createdAt = new Date(task.createdAt);
            if (createdAt >= oneWeekAgo) {
                const dayIndex = getDayIndex(createdAt);
                taskData[dayIndex].pending += 1;
            }
        });

        return taskData;
    };

    // Generate task data
    const taskData = (isAllTasksLoading || isCompletedLoading || isPendingLoading) ? [] : getTaskData();

    // Calculate completion rate
    const totalTasks = taskData.reduce((sum, day) => sum + day.assigned, 0);
    const completedTasksCount = taskData.reduce((sum, day) => sum + day.completed, 0);
    const completionRate = totalTasks > 0 ? ((completedTasksCount / totalTasks) * 100).toFixed(1) : "0.0";

    // Handle loading and error states
    const isLoading = isAllTasksLoading || isCompletedLoading || isPendingLoading;
    const isError = isAllTasksError || isCompletedError || isPendingError;

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
                                    data={taskData}
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