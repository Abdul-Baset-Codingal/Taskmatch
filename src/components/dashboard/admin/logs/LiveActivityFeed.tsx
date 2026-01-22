// components/admin/LiveActivityFeed.tsx
"use client";

import React from "react";
import { format } from "date-fns";
import {
    Activity,
    LogIn,
    LogOut,
    UserPlus,
    AlertCircle,
    CheckCircle,
    ShoppingCart,
    CreditCard,
    User,
} from "lucide-react";
import { useGetRecentLogsQuery } from "@/features/api/adminLogApi";

const getActionIcon = (action: string) => {
    const icons: Record<string, React.ElementType> = {
        LOGIN: LogIn,
        LOGOUT: LogOut,
        SIGNUP: UserPlus,
        LOGIN_FAILED: AlertCircle,
        SIGNUP_FAILED: AlertCircle,
        BOOKING_CREATED: ShoppingCart,
        PAYMENT_COMPLETED: CreditCard,
        TASK_CREATED: CheckCircle,
    };
    return icons[action] || Activity;
};

const getActionColor = (action: string, status: string) => {
    if (status === "failure") return "text-red-500 bg-red-100";

    const colors: Record<string, string> = {
        LOGIN: "text-green-500 bg-green-100",
        LOGOUT: "text-gray-500 bg-gray-100",
        SIGNUP: "text-blue-500 bg-blue-100",
        BOOKING_CREATED: "text-purple-500 bg-purple-100",
        PAYMENT_COMPLETED: "text-emerald-500 bg-emerald-100",
        TASK_CREATED: "text-indigo-500 bg-indigo-100",
    };
    return colors[action] || "text-gray-500 bg-gray-100";
};

export default function LiveActivityFeed() {
    const { data, isLoading } = useGetRecentLogsQuery(10, {
        pollingInterval: 30000, // Refresh every 30 seconds
    });

    const logs = data?.data || [];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Live Activity</h2>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-sm text-gray-500">Live</span>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            ) : logs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No recent activity</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {logs.map((log) => {
                        const Icon = getActionIcon(log.action);
                        const colorClass = getActionColor(log.action, log.status);

                        return (
                            <div key={log._id} className="flex items-start gap-3">
                                <div className={`p-2 rounded-full ${colorClass}`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-900 truncate">
                                        <span className="font-medium">{log.userName || "Guest"}</span>{" "}
                                        <span className="text-gray-600">{log.action.toLowerCase().replace(/_/g, " ")}</span>
                                    </p>
                                    <p className="text-xs text-gray-500">{format(new Date(log.createdAt), "HH:mm:ss")}</p>
                                </div>
                                {log.status === "failure" && (
                                    <span className="px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded">Failed</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}