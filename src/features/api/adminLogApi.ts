// features/api/adminLogApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

// Types
export interface ActivityLog {
    _id: string;
    userId: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        profilePicture?: string;
    } | null;
    userEmail: string | null;
    userName: string | null;
    userRole: "client" | "tasker" | "admin" | "guest" | "unknown";
    action: string;
    description: string;
    ipAddress: string | null;
    userAgent: string | null;
    browser: string | null;
    device: "desktop" | "mobile" | "tablet" | "unknown";
    location: {
        country: string | null;
        city: string | null;
        region: string | null;
    };
    metadata: Record<string, any>;
    status: "success" | "failure" | "pending" | "warning";
    module: "auth" | "task" | "booking" | "payment" | "review" | "profile" | "admin" | "communication" | "other";
    severity: "info" | "warning" | "error" | "critical";
    sessionId: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface LogsResponse {
    success: boolean;
    data: ActivityLog[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalLogs: number;
        limit: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export interface LogStatsResponse {
    success: boolean;
    stats: {
        totalLogs: number;
        byAction: Array<{ _id: string; count: number }>;
        byModule: Array<{ _id: string; count: number }>;
        byStatus: Array<{ _id: string; count: number }>;
        byRole: Array<{ _id: string; count: number }>;
        recentFailures: ActivityLog[];
        dailyStats: Array<{
            _id: string;
            total: number;
            logins: number;
            signups: number;
            failures: number;
        }>;
    };
}

export interface LogQueryParams {
    page?: number;
    limit?: number;
    action?: string;
    module?: string;
    status?: string;
    userRole?: string;
    userId?: string;
    userEmail?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
    severity?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export const adminLogApi = createApi({
    reducerPath: "adminLogApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/admin/adminLogs",
        credentials: "include",
        prepareHeaders: (headers) => {
            const token = Cookies.get("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["ActivityLog", "LogStats"],

    endpoints: (builder) => ({
        // Get all logs with filters and pagination
        getActivityLogs: builder.query<LogsResponse, LogQueryParams>({
            query: (params = {}) => {
                const queryParams = new URLSearchParams();
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== "") {
                        queryParams.append(key, String(value));
                    }
                });
                return `?${queryParams.toString()}`;
            },
            providesTags: ["ActivityLog"],
        }),

        // Get log statistics
        getLogStats: builder.query<LogStatsResponse, { startDate?: string; endDate?: string } | void>({
            query: (params) => {
                if (params) {
                    const queryParams = new URLSearchParams();
                    if (params.startDate) queryParams.append("startDate", params.startDate);
                    if (params.endDate) queryParams.append("endDate", params.endDate);
                    return `/stats?${queryParams.toString()}`;
                }
                return "/stats";
            },
            providesTags: ["LogStats"],
        }),

        // Get recent logs (for live feed)
        getRecentLogs: builder.query<{ success: boolean; data: ActivityLog[] }, number | void>({
            query: (limit = 20) => `/recent?limit=${limit}`,
            providesTags: ["ActivityLog"],
        }),

        // Get user-specific logs
        getUserLogs: builder.query<LogsResponse, { userId: string; page?: number; limit?: number }>({
            query: ({ userId, page = 1, limit = 20 }) => `/user/${userId}?page=${page}&limit=${limit}`,
            providesTags: (result, error, { userId }) => [{ type: "ActivityLog", id: userId }],
        }),

        // Export logs
        exportLogs: builder.query<
            any,
            {
                format?: "json" | "csv";
                startDate?: string;
                endDate?: string;
                action?: string;
                module?: string;
            }
        >({
            query: (params) => {
                const queryParams = new URLSearchParams();
                Object.entries(params).forEach(([key, value]) => {
                    if (value) queryParams.append(key, value);
                });
                return {
                    url: `/export?${queryParams.toString()}`,
                    // ✅ Handle response based on format
                    responseHandler: params.format === "csv"
                        ? (response) => response.text()
                        : (response) => response.json(),
                };
            },
        }),

        // Delete old logs
        deleteOldLogs: builder.mutation<{ success: boolean; message: string; deletedCount: number }, number>({
            query: (daysOld) => ({
                url: "/cleanup",
                method: "DELETE",
                body: { daysOld },
            }),
            invalidatesTags: ["ActivityLog", "LogStats"],
        }),
    }),
});

export const {
    useGetActivityLogsQuery,
    useGetLogStatsQuery,
    useGetRecentLogsQuery,
    useGetUserLogsQuery,
    useLazyExportLogsQuery,
    useDeleteOldLogsMutation,
} = adminLogApi;