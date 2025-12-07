/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetTasksByClientQuery } from "@/features/api/taskApi";
import { checkLoginStatus } from "@/resusable/CheckUser";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { Trophy, Clock, AlertCircle, Zap } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

export function ClientDashboardStats() {
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

    const stats = useMemo(() => {
        const completed = tasks.filter((t: any) => t.status === "completed").length;
        const inProgress = tasks.filter((t: any) =>
            t.status === "in_progress" || t.status === "in progress"
        ).length;
        const pending = tasks.filter((t: any) => t.status === "pending").length;
        const totalTasks = tasks.length;

        // Count unique taskers hired (assuming task has taskerId or assignedTo field)
        const uniqueTaskers = new Set(
            tasks
                .filter((t: any) => t.taskerId || t.assignedTo)
                .map((t: any) => t.taskerId || t.assignedTo)
        ).size;

        // Calculate success rate
        const successRate = totalTasks > 0
            ? Math.round((completed / totalTasks) * 100)
            : 0;

        return {
            completed,
            inProgress,
            pending,
            totalTasks,
            uniqueTaskers,
            successRate,
        };
    }, [tasks]);

    const statItems = [
        {
            title: "Tasks Completed",
            value: isLoading ? "—" : stats.completed,
            icon: Trophy,
            color: "text-[#109C3D]",
            bg: "bg-[#E5FFDB]",
            description: "Successfully finished",
            highlight: true,
        },
        {
            title: "Success Rate",
            value: isLoading ? "—" : `${stats.successRate}%`,
            icon: Zap,
            color: "text-amber-600",
            bg: "bg-amber-50",
            description: "Task completion rate",
        },
        {
            title: "In Progress",
            value: isLoading ? "—" : stats.inProgress,
            icon: Clock,
            color: "text-blue-600",
            bg: "bg-blue-50",
            description: "Currently active",
        },
        {
            title: "Pending Tasks",
            value: isLoading ? "—" : stats.pending,
            icon: AlertCircle,
            color: "text-orange-600",
            bg: "bg-orange-50",
            description: "Awaiting quotes",
        },
    ];

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {statItems.map((stat) => (
                <Card
                    key={stat.title}
                    className={`relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white group ${stat.highlight ? "ring-2 ring-[#109C3D]/20" : ""
                        }`}
                >
                    {/* Top accent */}
                    <div className={`absolute inset-x-0 top-0 h-1.5 ${stat.highlight ? "bg-[#109C3D]" : "bg-[#109C3D] scale-x-0 group-hover:scale-x-100"
                        } transition-transform duration-500 origin-left`} />

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