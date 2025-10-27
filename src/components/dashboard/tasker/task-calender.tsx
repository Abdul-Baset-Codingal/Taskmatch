/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import {
    useGetScheduleTasksQuery,
    useGetFlexibleTasksQuery,
} from "@/features/api/taskApi";

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

export function TaskCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 8)); // October 08, 2025
    const [selectedDate, setSelectedDate] = useState("2025-10-08");

    // Fetch all tasks
    const { data: scheduleTasks = [], error: scheduleError, isLoading: scheduleLoading, refetch: refetchSchedule } = useGetScheduleTasksQuery({});
    const { data: flexibleTasks = [], error: flexibleError, isLoading: flexibleLoading, refetch: refetchFlexible } = useGetFlexibleTasksQuery({});
    const allTasks = [...scheduleTasks, ...flexibleTasks];
    const isLoading = scheduleLoading || flexibleLoading;
    const hasError = scheduleError || flexibleError;

    // Map API tasks to tasksByDate structure
    const tasksByDate: Record<string, Task[]> = allTasks.reduce((acc: Record<string, Task[]>, task: any) => {
        const now = new Date();
        const deadline = new Date(task.offerDeadline);
        const diffInMs = deadline.getTime() - now.getTime();
        const isUrgent = diffInMs > 0 && diffInMs < 24 * 60 * 60 * 1000;

        const taskDate = task.schedule === "Flexible" ? new Date(task.createdAt) : new Date(task.offerDeadline);
        const dateKey = taskDate.toISOString().split("T")[0]; // e.g., "2025-10-08"
        const time = taskDate.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });

        const taskEntry: Task = {
            id: task._id,
            title: task.taskTitle,
            time: time,
            priority: isUrgent ? "high" : "medium",
            type: task.taskTitle.toLowerCase().includes("cleaning")
                ? "maintenance"
                : task.taskTitle.toLowerCase().includes("installation")
                    ? "installation"
                    : task.taskTitle.toLowerCase().includes("consult")
                        ? "consultation"
                        : "repair",
        };

        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(taskEntry);
        return acc;
    }, {});

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
                    <CardDescription>Upcoming tasks</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-8 text-gray-400 text-sm animate-pulse">
                    Loading tasks...
                </CardContent>
            </Card>
        );
    }

    if (hasError) {
        return (
            <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Task Calendar
                    </CardTitle>
                    <CardDescription>Upcoming tasks</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-8 text-red-600 text-sm">
                    Error loading tasks
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
                <CardDescription>Upcoming tasks</CardDescription>
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
                                className={`p-2 text-xs rounded-md hover:bg-accent transition-colors relative ${isSelected ? "bg-primary text-primary-foreground" : ""
                                    }`}
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
                        <h4 className="font-medium text-sm">Tasks for {new Date(selectedDate).toLocaleDateString()}</h4>
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
                        <p className="text-xs text-muted-foreground">No tasks scheduled for this date</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}