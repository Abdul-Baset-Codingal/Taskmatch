// features/api/adminTaskApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from 'js-cookie';

interface Task {
    _id: string;
    taskTitle: string;
    taskDescription: string;
    serviceTitle: string;
    location: string;
    schedule: string;
    status: string;
    price: number;
    client: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        profilePicture?: string;
    };
    acceptedBy?: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        profilePicture?: string;
    };
    bids: Array<{
        _id: string;
        taskerId: {
            _id: string;
            firstName: string;
            lastName: string;
            email: string;
        };
        offerPrice: number;
        message: string;
        status: string;
        createdAt: string;
    }>;
    payment?: {
        status: string;
        totalClientPays: number;
        taskerPayout: number;
        applicationFee: number;
    };
    photos: string[];
    video?: string;
    createdAt: string;
    updatedAt: string;
}

interface PaginatedResponse {
    success: boolean;
    data: Task[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalCount: number;
        limit: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

interface TaskStatistics {
    success: boolean;
    data: {
        totalTasks: number;
        statusCounts: Record<string, number>;
        scheduleCounts: Record<string, number>;
        paymentStats: Array<{
            _id: string;
            count: number;
            totalAmount: number;
        }>;
        recentTasks: Task[];
        topClients: Array<{
            _id: string;
            taskCount: number;
            firstName: string;
            lastName: string;
            email: string;
        }>;
        topTaskers: Array<{
            _id: string;
            taskCount: number;
            firstName: string;
            lastName: string;
            email: string;
        }>;
        priceStats: {
            avgPrice: number;
            minPrice: number;
            maxPrice: number;
            totalRevenue: number;
        };
        dailyStats: Array<{
            _id: string;
            count: number;
        }>;
    };
}

interface QueryParams {
    page?: number;
    limit?: number;
    status?: string;
    schedule?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    startDate?: string;
    endDate?: string;
    minPrice?: number;
    maxPrice?: number;
    hasPayment?: boolean;
    clientId?: string;
    taskerId?: string;
}

export const adminTaskApi = createApi({
    reducerPath: "adminTaskApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/admin/tasks",
        credentials: "include",
        prepareHeaders: (headers) => {
            const token = Cookies.get("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["AdminTask", "TaskStats"],

    endpoints: (builder) => ({
        // Get all tasks with filters and pagination
        getAdminTasks: builder.query<PaginatedResponse, QueryParams>({
            query: (params = {}) => {
                const queryParams = new URLSearchParams();
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== '') {
                        queryParams.append(key, String(value));
                    }
                });
                return `?${queryParams.toString()}`;
            },
            providesTags: ["AdminTask"],
        }),

        // Get single task
        getAdminTaskById: builder.query<{ success: boolean; data: Task }, string>({
            query: (taskId) => `/${taskId}`,
            providesTags: (result, error, taskId) => [{ type: "AdminTask", id: taskId }],
        }),

        // Update task
        updateAdminTask: builder.mutation<
            { success: boolean; message: string; data: Task },
            { taskId: string; updateData: Partial<Task> }
        >({
            query: ({ taskId, updateData }) => ({
                url: `/${taskId}`,
                method: "PUT",  // Changed from PATCH to PUT
                body: updateData,
            }),
            invalidatesTags: ["AdminTask"],
        }),
        // Delete task
        deleteAdminTask: builder.mutation<{ success: boolean; message: string }, string>({
            query: (taskId) => ({
                url: `/${taskId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["AdminTask"],
        }),

        // Bulk delete tasks
        bulkDeleteAdminTasks: builder.mutation<
            { success: boolean; message: string; deletedCount: number },
            string[]
        >({
            query: (taskIds) => ({
                url: "/bulk-delete",
                method: "POST",
                body: { taskIds },
            }),
            invalidatesTags: ["AdminTask"],
        }),

        // Get statistics
        getTaskStatistics: builder.query<TaskStatistics, { startDate?: string; endDate?: string } | void>({
            query: (params) => {
                if (params) {
                    const queryParams = new URLSearchParams();
                    if (params.startDate) queryParams.append('startDate', params.startDate);
                    if (params.endDate) queryParams.append('endDate', params.endDate);
                    return `/statistics?${queryParams.toString()}`;
                }
                return "/statistics";
            },
            providesTags: ["TaskStats"],
        }),

        // Change task status
        changeTaskStatus: builder.mutation<
            { success: boolean; message: string; data: Task },
            { taskId: string; status: string; reason?: string }
        >({
            query: ({ taskId, status, reason }) => ({
                url: `/${taskId}/status`,
                method: "PATCH",
                body: { status, reason },
            }),
            invalidatesTags: ["AdminTask", "TaskStats"],
        }),

        // Refund payment
        refundTaskPayment: builder.mutation<
            { success: boolean; message: string; data: Task },
            { taskId: string; reason: string; amount?: number }
        >({
            query: ({ taskId, reason, amount }) => ({
                url: `/${taskId}/refund`,
                method: "POST",
                body: { reason, amount },
            }),
            invalidatesTags: ["AdminTask"],
        }),

        // Export tasks
        exportTasks: builder.query<any, { format?: 'json' | 'csv'; status?: string; startDate?: string; endDate?: string }>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                Object.entries(params).forEach(([key, value]) => {
                    if (value) queryParams.append(key, value);
                });
                return `/export?${queryParams.toString()}`;
            },
        }),

        // Toggle comment block
        toggleCommentBlock: builder.mutation<
            { success: boolean; message: string },
            { taskId: string; commentId: string; isBlocked: boolean; reason?: string }
        >({
            query: ({ taskId, commentId, isBlocked, reason }) => ({
                url: `/${taskId}/comments/${commentId}/block`,
                method: "PATCH",
                body: { isBlocked, reason },
            }),
            invalidatesTags: ["AdminTask"],
        }),

        // Delete bid
        deleteAdminBid: builder.mutation<
            { success: boolean; message: string },
            { taskId: string; bidId: string }
        >({
            query: ({ taskId, bidId }) => ({
                url: `/${taskId}/bids/${bidId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["AdminTask"],
        }),
    }),
});

export const {
    useGetAdminTasksQuery,
    useGetAdminTaskByIdQuery,
    useUpdateAdminTaskMutation,
    useDeleteAdminTaskMutation,
    useBulkDeleteAdminTasksMutation,
    useGetTaskStatisticsQuery,
    useChangeTaskStatusMutation,
    useRefundTaskPaymentMutation,
    useLazyExportTasksQuery,
    useToggleCommentBlockMutation,
    useDeleteAdminBidMutation,
} = adminTaskApi;