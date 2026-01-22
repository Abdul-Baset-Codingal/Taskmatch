// app/admin/activity-logs/page.tsx
"use client";

import React, { useState, useEffect } from "react";

import { format, subDays } from "date-fns";
import {
    Activity,
    Search,
    Filter,
    Download,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    User,
    Clock,
    Monitor,
    Smartphone,
    Tablet,
    Globe,
    AlertCircle,
    CheckCircle,
    XCircle,
    Info,
    Trash2,
    Eye,
    X,
    TrendingUp,
    Users,
    Shield,
    LogIn,
    UserPlus,
    Calendar,
} from "lucide-react";
import { ActivityLog, LogQueryParams, useDeleteOldLogsMutation, useGetActivityLogsQuery, useGetLogStatsQuery, useLazyExportLogsQuery } from "@/features/api/adminLogApi";
import LiveActivityFeed from "@/components/dashboard/admin/logs/LiveActivityFeed";
import ActivityCharts from "@/components/dashboard/admin/logs/ActivityChart";

// Stats Card Component
const StatsCard = ({
    title,
    value,
    icon: Icon,
    color,
    subtitle,
}: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    subtitle?: string;
}) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
            </div>
            <div className={`p-3 rounded-full ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
        </div>
    </div>
);

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
        success: "bg-green-100 text-green-800",
        failure: "bg-red-100 text-red-800",
        pending: "bg-yellow-100 text-yellow-800",
        warning: "bg-orange-100 text-orange-800",
    };

    const icons: Record<string, React.ElementType> = {
        success: CheckCircle,
        failure: XCircle,
        pending: Clock,
        warning: AlertCircle,
    };

    const Icon = icons[status] || Info;

    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-800"}`}>
            <Icon className="w-3 h-3" />
            {status}
        </span>
    );
};

// Module Badge Component
const ModuleBadge = ({ module }: { module: string }) => {
    const styles: Record<string, string> = {
        auth: "bg-blue-100 text-blue-800",
        task: "bg-purple-100 text-purple-800",
        booking: "bg-indigo-100 text-indigo-800",
        payment: "bg-green-100 text-green-800",
        review: "bg-yellow-100 text-yellow-800",
        profile: "bg-pink-100 text-pink-800",
        admin: "bg-red-100 text-red-800",
        communication: "bg-cyan-100 text-cyan-800",
        other: "bg-gray-100 text-gray-800",
    };

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[module] || styles.other}`}>
            {module}
        </span>
    );
};

// Device Icon Component
const DeviceIcon = ({ device }: { device: string }) => {
    const icons: Record<string, React.ElementType> = {
        desktop: Monitor,
        mobile: Smartphone,
        tablet: Tablet,
        unknown: Globe,
    };
    const Icon = icons[device] || Globe;
    return <Icon className="w-4 h-4 text-gray-400" />;
};

// Role Badge Component
const RoleBadge = ({ role }: { role: string }) => {
    const styles: Record<string, string> = {
        admin: "bg-red-500 text-white",
        tasker: "bg-blue-500 text-white",
        client: "bg-green-500 text-white",
        guest: "bg-gray-500 text-white",
        unknown: "bg-gray-300 text-gray-700",
    };

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[role] || styles.unknown}`}>
            {role}
        </span>
    );
};

// Log Detail Modal Component
const LogDetailModal = ({
    log,
    onClose,
}: {
    log: ActivityLog;
    onClose: () => void;
}) => {
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                <div className="fixed inset-0 transition-opacity bg-black/60 bg-opacity-75" onClick={onClose} />

                <div className="relative inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Activity Log Details</h3>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="space-y-6">
                        {/* Action & Status */}
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <p className="text-sm text-gray-500">Action</p>
                                <p className="text-lg font-semibold text-gray-900">{log.action}</p>
                            </div>
                            <StatusBadge status={log.status} />
                            <ModuleBadge module={log.module} />
                        </div>

                        {/* Description */}
                        <div>
                            <p className="text-sm text-gray-500">Description</p>
                            <p className="text-gray-900 mt-1">{log.description}</p>
                        </div>

                        {/* User Info */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm font-medium text-gray-500 mb-3">User Information</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-400">Name</p>
                                    <p className="text-sm text-gray-900">{log.userName || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Email</p>
                                    <p className="text-sm text-gray-900">{log.userEmail || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Role</p>
                                    <RoleBadge role={log.userRole} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">User ID</p>
                                    <p className="text-sm text-gray-900 font-mono ">
                                        {typeof log.userId === "object" ? log.userId?._id : log.userId || "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Technical Info */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm font-medium text-gray-500 mb-3">Technical Information</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-400">IP Address</p>
                                    <p className="text-sm text-gray-900 font-mono">{log.ipAddress || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Device</p>
                                    <div className="flex items-center gap-2">
                                        <DeviceIcon device={log.device} />
                                        <span className="text-sm text-gray-900 capitalize">{log.device}</span>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-xs text-gray-400">Browser</p>
                                    <p className="text-sm text-gray-900">{log.browser || "N/A"}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-xs text-gray-400">User Agent</p>
                                    <p className="text-xs text-gray-600 font-mono break-all">{log.userAgent || "N/A"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Metadata */}
                        {log.metadata && Object.keys(log.metadata).length > 0 && (
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm font-medium text-gray-500 mb-3">Additional Data</p>
                                <pre className="text-xs text-gray-700 bg-gray-100 p-3 rounded overflow-x-auto">
                                    {JSON.stringify(log.metadata, null, 2)}
                                </pre>
                            </div>
                        )}

                        {/* Timestamp */}
                        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
                            <span>Created: {format(new Date(log.createdAt), "PPpp")}</span>
                            <span className="font-mono text-xs">{log._id}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Filter Panel Component
const FilterPanel = ({
    filters,
    setFilters,
    onClose,
}: {
    filters: LogQueryParams;
    setFilters: React.Dispatch<React.SetStateAction<LogQueryParams>>;
    onClose: () => void;
}) => {
  
    const actions = [
        // Auth
        "LOGIN",
        "LOGIN_FAILED",
        "LOGOUT",
        "SIGNUP",
        "SIGNUP_FAILED",
        // Tasks
        "TASK_CREATED",
        "TASK_UPDATED",
        "TASK_DELETED",
        "TASK_ACCEPTED",
        "TASK_CANCELLED",
        // Task Completion ✅ NEW
        "COMPLETION_REQUESTED",
        "COMPLETION_APPROVED",
        "COMPLETION_REJECTED",
        "TASK_COMPLETED",
        "TASK_NOT_COMPLETED",
        // Bids
        "BID_PLACED",
        "BID_ACCEPTED",
        "BID_REJECTED",
        "BID_WITHDRAWN",
        // Comments
        "COMMENT_ADDED",
        "COMMENT_DELETED",
        "REPLY_ADDED",
        // Reviews
        "REVIEW_POSTED",
        "REVIEW_UPDATED",
        "REVIEW_DELETED",
        // Bookings
        "BOOKING_CREATED",
        "BOOKING_CONFIRMED",
        "BOOKING_ACCEPTED",
        "BOOKING_REJECTED",
        "BOOKING_COMPLETED",
        "BOOKING_CANCELLED",
        // Quotes
        "QUOTE_REQUESTED",
        "QUOTE_RESPONDED",
        "QUOTE_ACCEPTED",
        "QUOTE_REJECTED",
        // Payments
        "PAYMENT_INITIATED",
        "PAYMENT_AUTHORIZED",
        "PAYMENT_CAPTURED",
        "PAYMENT_COMPLETED",
        "PAYMENT_FAILED",
        // Admin
        "USER_BLOCKED",
        "USER_UNBLOCKED",
        "TASKER_APPROVED",
        "TASKER_REJECTED",
    ];

    // Update modules to include "review"
    const modules = [
        "auth",
        "task",
        "booking",
        "payment",
        "review",  // ✅ NEW
        "profile",
        "admin",
        "communication",
        "other"
    ];
    const statuses = ["success", "failure", "pending", "warning"];
    const roles = ["client", "tasker", "admin", "guest"];
    const severities = ["info", "warning", "error", "critical"];

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Action Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                    <select
                        value={filters.action || ""}
                        onChange={(e) => setFilters({ ...filters, action: e.target.value, page: 1 })}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="">All Actions</option>
                        {actions.map((action) => (
                            <option key={action} value={action}>
                                {action}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Module Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
                    <select
                        value={filters.module || ""}
                        onChange={(e) => setFilters({ ...filters, module: e.target.value, page: 1 })}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="">All Modules</option>
                        {modules.map((module) => (
                            <option key={module} value={module}>
                                {module}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Status Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                        value={filters.status || ""}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="">All Statuses</option>
                        {statuses.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Role Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User Role</label>
                    <select
                        value={filters.userRole || ""}
                        onChange={(e) => setFilters({ ...filters, userRole: e.target.value, page: 1 })}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="">All Roles</option>
                        {roles.map((role) => (
                            <option key={role} value={role}>
                                {role}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Severity Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                    <select
                        value={filters.severity || ""}
                        onChange={(e) => setFilters({ ...filters, severity: e.target.value, page: 1 })}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="">All Severities</option>
                        {severities.map((sev) => (
                            <option key={sev} value={sev}>
                                {sev}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Start Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                        type="date"
                        value={filters.startDate || ""}
                        onChange={(e) => setFilters({ ...filters, startDate: e.target.value, page: 1 })}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                {/* End Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                        type="date"
                        value={filters.endDate || ""}
                        onChange={(e) => setFilters({ ...filters, endDate: e.target.value, page: 1 })}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                {/* User Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User Email</label>
                    <input
                        type="email"
                        placeholder="Search by email..."
                        value={filters.userEmail || ""}
                        onChange={(e) => setFilters({ ...filters, userEmail: e.target.value, page: 1 })}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Clear Filters Button */}
            <div className="mt-4 flex justify-end">
                <button
                    onClick={() =>
                        setFilters({
                            page: 1,
                            limit: 20,
                            sortBy: "createdAt",
                            sortOrder: "desc",
                        })
                    }
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    Clear All Filters
                </button>
            </div>
        </div>
    );
};

// Main Component
export default function ActivityLogsPage() {
    const [filters, setFilters] = useState<LogQueryParams>({
        page: 1,
        limit: 20,
        sortBy: "createdAt",
        sortOrder: "desc",
    });
    const [showFilters, setShowFilters] = useState(false);
    const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // API Hooks
    const { data: logsData, isLoading, isFetching, refetch } = useGetActivityLogsQuery(filters);
    const { data: statsData } = useGetLogStatsQuery();
    const [exportLogs] = useLazyExportLogsQuery();
    const [deleteOldLogs, { isLoading: isDeleting }] = useDeleteOldLogsMutation();

    // Handle search with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== filters.search) {
                setFilters((prev) => ({ ...prev, search: searchTerm, page: 1 }));
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Handle export
    const handleExport = async (format: "json" | "csv") => {
        try {
            const result = await exportLogs({
                format,
                startDate: filters.startDate,
                endDate: filters.endDate,
                action: filters.action,
                module: filters.module,
            }).unwrap();

            const currentDate = new Date().toISOString().split("T")[0];

            if (format === "csv") {
                // Result is already text for CSV
                const blob = new Blob([result], { type: "text/csv;charset=utf-8;" });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `activity_logs_${currentDate}.csv`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } else {
                // Result is JSON object
                const blob = new Blob([JSON.stringify(result.data, null, 2)], {
                    type: "application/json",
                });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `activity_logs_${currentDate}.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }

            // Show success message (optional)
            console.log(`✅ Exported as ${format.toUpperCase()}`);
        } catch (error) {
            console.error("Export failed:", error);
            // Show error toast/notification
        }
    };

    // Handle cleanup
    const handleCleanup = async () => {
        if (confirm("Are you sure you want to delete logs older than 90 days?")) {
            try {
                await deleteOldLogs(90).unwrap();
                refetch();
            } catch (error) {
                console.error("Cleanup failed:", error);
            }
        }
    };

    const logs = logsData?.data || [];
    const pagination = logsData?.pagination;
    const stats = statsData?.stats;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Activity Logs</h1>
                        <p className="text-gray-500 mt-1">Monitor all user activities across the platform</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => refetch()}
                            disabled={isFetching}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
                            Refresh
                        </button>
                        <div className="relative group">
                            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                <Download className="w-4 h-4" />
                                Export
                            </button>
                            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                <button
                                    onClick={() => handleExport("csv")}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
                                >
                                    Export as CSV
                                </button>
                                <button
                                    onClick={() => handleExport("json")}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-b-lg"
                                >
                                    Export as JSON
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={handleCleanup}
                            disabled={isDeleting}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Cleanup
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    title="Total Logs"
                    value={stats?.totalLogs?.toLocaleString() || 0}
                    icon={Activity}
                    color="bg-blue-500"
                    subtitle="All time"
                />
                <StatsCard
                    title="Today's Logins"
                    value={stats?.dailyStats?.[stats.dailyStats.length - 1]?.logins || 0}
                    icon={LogIn}
                    color="bg-green-500"
                    subtitle="Last 24 hours"
                />
                <StatsCard
                    title="New Signups"
                    value={stats?.dailyStats?.[stats.dailyStats.length - 1]?.signups || 0}
                    icon={UserPlus}
                    color="bg-purple-500"
                    subtitle="Last 24 hours"
                />
                <StatsCard
                    title="Failed Actions"
                    value={stats?.byStatus?.find((s) => s._id === "failure")?.count || 0}
                    icon={AlertCircle}
                    color="bg-red-500"
                    subtitle="Requires attention"
                />
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by description, email, or name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Quick Filters */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-colors ${showFilters ? "bg-blue-50 border-blue-300 text-blue-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            <Filter className="w-4 h-4" />
                            Filters
                            {Object.keys(filters).filter((k) => !["page", "limit", "sortBy", "sortOrder"].includes(k) && filters[k as keyof LogQueryParams])
                                .length > 0 && (
                                    <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                        {
                                            Object.keys(filters).filter(
                                                (k) => !["page", "limit", "sortBy", "sortOrder"].includes(k) && filters[k as keyof LogQueryParams]
                                            ).length
                                        }
                                    </span>
                                )}
                        </button>

                        {/* Quick Status Filters */}
                        <div className="hidden lg:flex items-center gap-2">
                            <button
                                onClick={() => setFilters((prev) => ({ ...prev, status: prev.status === "failure" ? "" : "failure", page: 1 }))}
                                className={`px-3 py-2 text-sm rounded-lg transition-colors ${filters.status === "failure" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                Failed Only
                            </button>
                            <button
                                onClick={() => setFilters((prev) => ({ ...prev, module: prev.module === "auth" ? "" : "auth", page: 1 }))}
                                className={`px-3 py-2 text-sm rounded-lg transition-colors ${filters.module === "auth" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                Auth Only
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Panel */}
            {showFilters && <FilterPanel filters={filters} setFilters={setFilters} onClose={() => setShowFilters(false)} />}

            {/* Logs Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <Activity className="w-16 h-16 mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No activity logs found</p>
                        <p className="text-sm">Try adjusting your filters</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {logs.map((log) => (
                                    <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                                        {/* Timestamp */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-900">{format(new Date(log.createdAt), "MMM dd, yyyy")}</p>
                                                    <p className="text-xs text-gray-500">{format(new Date(log.createdAt), "HH:mm:ss")}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* User */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                    {typeof log.userId === "object" && log.userId?.profilePicture ? (
                                                        <img
                                                            src={log.userId.profilePicture}
                                                            alt=""
                                                            className="w-8 h-8 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <User className="w-4 h-4 text-gray-500" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{log.userName || "Guest"}</p>
                                                    <p className="text-xs text-gray-500">{log.userEmail || "N/A"}</p>
                                                </div>
                                                <RoleBadge role={log.userRole} />
                                            </div>
                                        </td>

                                        {/* Action */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-medium text-gray-900">{log.action}</span>
                                                <ModuleBadge module={log.module} />
                                            </div>
                                        </td>

                                        {/* Description */}
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600 max-w-xs truncate" title={log.description}>
                                                {log.description}
                                            </p>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={log.status} />
                                        </td>

                                        {/* Device */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <DeviceIcon device={log.device} />
                                                <div>
                                                    <p className="text-sm text-gray-900 capitalize">{log.device}</p>
                                                    <p className="text-xs text-gray-500">{log.ipAddress || "N/A"}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => setSelectedLog(log)}
                                                className="flex items-center gap-1 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
                                {Math.min(pagination.currentPage * pagination.limit, pagination.totalLogs)} of {pagination.totalLogs} results
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page || 1) - 1 }))}
                                    disabled={!pagination.hasPrevPage}
                                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (pagination.totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (pagination.currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (pagination.currentPage >= pagination.totalPages - 2) {
                                            pageNum = pagination.totalPages - 4 + i;
                                        } else {
                                            pageNum = pagination.currentPage - 2 + i;
                                        }
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setFilters((prev) => ({ ...prev, page: pageNum }))}
                                                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${pagination.currentPage === pageNum
                                                    ? "bg-blue-500 text-white"
                                                    : "border border-gray-300 hover:bg-gray-100"
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))}
                                    disabled={!pagination.hasNextPage}
                                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Log Detail Modal */}
            {selectedLog && <LogDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />}

            <div>
                {/* <ActivityCharts/> */}
            </div>
        </div>
    );
}