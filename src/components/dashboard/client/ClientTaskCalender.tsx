/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useGetTasksByClientQuery } from "@/features/api/taskApi";
import { checkLoginStatus } from "@/resusable/CheckUser";

interface Task {
    id: string;
    title: string;
    time: string;
    priority: "high" | "medium" | "low";
    type: "maintenance" | "installation" | "consultation" | "repair";
}

const priorityColors = {
    high: "bg-red-100 text-red-800 border-red-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    low: "bg-green-100 text-green-800 border-green-200",
};

const typeColors = {
    maintenance: "bg-blue-50 border-l-blue-400",
    installation: "bg-purple-50 border-l-purple-400",
    consultation: "bg-green-50 border-l-green-400",
    repair: "bg-orange-50 border-l-orange-400",
};

export function ClientTaskCalendar() {
    const [user, setUser] = useState<{ _id: string } | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date(2025, 8, 23)); // September 23, 2025
    const [selectedDate, setSelectedDate] = useState("2025-09-23");

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
        isLoading,
        isError,
    } = useGetTasksByClientQuery(user?._id ? { clientId: user._id } : { clientId: "" }, {
        skip: !user?._id,
    });

    // Map API tasks to tasksByDate structure, filtering for urgent tasks
    const tasksByDate: Record<string, Task[]> = useMemo(() => {
        return clientTasks.reduce((acc: Record<string, Task[]>, task: any) => {
            // Filter for urgent tasks (e.g., extraCharge or priority === "high")
            const isUrgent = task.extraCharge || task.priority === "high";
            if (!isUrgent) return acc;

            const taskDate = new Date(task.createdAt);
            const dateKey = taskDate.toISOString().split("T")[0]; // e.g., "2025-09-23"
            const time = taskDate.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            });

            const taskEntry: Task = {
                id: task.id || task._id,
                title: task.taskTitle || "Untitled Task",
                time,
                priority: task.priority
                    ? task.priority.toLowerCase()
                    : task.extraCharge
                        ? "high"
                        : "medium", // Fallback: extraCharge implies high priority
                type: task.serviceTitle
                    ? task.serviceTitle.toLowerCase().includes("cleaning")
                        ? "maintenance"
                        : task.serviceTitle.toLowerCase().includes("installation")
                            ? "installation"
                            : task.serviceTitle.toLowerCase().includes("consult")
                                ? "consultation"
                                : "repair"
                    : "repair", // Fallback to repair if serviceTitle is missing
            };

            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(taskEntry);
            return acc;
        }, {});
    }, [clientTasks]);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }

        return days;
    };

    const formatDateKey = (day: number) => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    };

    const days = getDaysInMonth(currentDate);
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const selectedTasks = tasksByDate[selectedDate] || [];

    if (isLoading) {
        return (
            <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Task Calendar
                    </CardTitle>
                    <CardDescription>Upcoming Scheduled tasks</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-8 text-gray-400 text-sm animate-pulse">
                    Loading urgent tasks...
                </CardContent>
            </Card>
        );
    }

    if (isError) {
        return (
            <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Task Calendar
                    </CardTitle>
                    <CardDescription>Upcoming Scheduled tasks</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-8 text-red-500 text-sm">
                    Error loading urgent tasks
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Task Calendar
                </CardTitle>
                <CardDescription>Upcoming Scheduled tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Calendar Header */}
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h3>
                    <div className="flex gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 bg-transparent"
                            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                        >
                            <ChevronLeft className="h-3 w-3" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 bg-transparent"
                            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                        >
                            <ChevronRight className="h-3 w-3" />
                        </Button>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 text-center">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day} className="p-2 text-xs font-medium text-muted-foreground">
                            {day}
                        </div>
                    ))}
                    {days.map((day, index) => {
                        if (day === null) {
                            return <div key={index} className="p-2" />;
                        }

                        const dateKey = formatDateKey(day);
                        const hasTasks = tasksByDate[dateKey]?.length > 0;
                        const isSelected = dateKey === selectedDate;

                        return (
                            <button
                                key={day}
                                className={`p-2 text-xs rounded-md hover:bg-accent transition-colors relative ${isSelected ? "bg-primary text-primary-foreground" : ""}`}
                                onClick={() => setSelectedDate(dateKey)}
                            >
                                {day}
                                {hasTasks && (
                                    <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Selected Date Tasks */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">Urgent Tasks for {new Date(selectedDate).toLocaleDateString()}</h4>
                        <Button size="sm" variant="outline" className="h-7 text-xs bg-transparent">
                            <Plus className="h-3 w-3 mr-1" />
                            Add Task
                        </Button>
                    </div>

                    {selectedTasks.length > 0 ? (
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                            {selectedTasks.map((task) => (
                                <div key={task.id} className={`p-2 rounded-md border-l-2 ${typeColors[task.type]} text-xs`}>
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">{task.title}</span>
                                        <span className={`px-2 py-1 rounded text-xs ${priorityColors[task.priority]}`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                    <div className="text-muted-foreground mt-1">{task.time}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-muted-foreground">No urgent tasks scheduled for this date</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}