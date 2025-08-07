import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from 'js-cookie';

;

export const taskApi = createApi({
    reducerPath: "taskApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`,
        credentials: "include", // keep if you want to send cookies too
        prepareHeaders: (headers) => {
            const token = Cookies.get("token"); // get your JWT token from cookies (or change source if needed)
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    // export const taskApi = createApi({
    //     reducerPath: "taskApi",
    //     baseQuery: fetchBaseQuery({
    //         baseUrl: "https://taskmatch-backend-hiza.onrender.com/api",
    //         credentials: "include",
    //     }),
    tagTypes: ["Task", "TaskFilters"],

    endpoints: (builder) => ({
        // ✅ Create a task
        postTask: builder.mutation({
            query: (formData) => ({
                url: "/tasks",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Task"],
        }),

        getAllTasks: builder.query({
            query: (params = {}) => {
                const queryParams = new URLSearchParams();

                // Add all parameters to query string
                Object.keys(params).forEach(key => {
                    if (params[key] !== undefined && params[key] !== '') {
                        queryParams.append(key, params[key]);
                    }
                });

                return `/tasks?${queryParams.toString()}`;
            },
            providesTags: ['Task'],
        }),

        // Get filter options
        getTaskFilters: builder.query({
            query: () => '/tasks/filters',
            providesTags: ['TaskFilters'],
        }),

        // ✅ Get urgent tasks (with optional status)
        getUrgentTasks: builder.query({
            query: () => {
                return `/tasks/urgent`;
            },
        }),

        // ✅ Get tasks by status (e.g., "in progress", "completed")
        getTasksByStatus: builder.query({
            query: (status) => `/tasks/filter?status=${encodeURIComponent(status)}`,
            providesTags: ["Task"],
        }),

        getTasksExcludingStatus: builder.query({
            query: (excludeStatus = "completed") => `/tasks/filter/exclude?excludeStatus=${encodeURIComponent(excludeStatus)}`,
            providesTags: ["Task"],
        }),


        // ✅ Get tasks by the logged-in client
        getTasksByClient: builder.query({
            query: () => "/tasks/client",
            providesTags: ["Task"],
        }),

        // ✅ Get single task by ID
        getTaskById: builder.query({
            query: (taskId) => `/tasks/${taskId}`,
            providesTags: (result, error, taskId) => [{ type: "Task", id: taskId }],
        }),

        addComment: builder.mutation({
            query: ({ taskId, message }) => ({
                url: `/tasks/${taskId}/comment`,
                method: "POST",
                body: { message },
            }),
            invalidatesTags: ["Task"],
        }),
        // ✅ Request Completion
        requestCompletion: builder.mutation({
            query: (taskId) => ({
                url: `/tasks/${taskId}/request-completion`,
                method: "PATCH",
            }),
            invalidatesTags: ["Task"],
        }),

        // ✅ Bid on a task
        bidOnTask: builder.mutation({
            query: ({ taskId, offerPrice, message }) => ({
                url: `/tasks/${taskId}/bid`,
                method: "POST",
                body: { offerPrice, message },
            }),
            invalidatesTags: ["Task"],
        }),

        // ✅ Accept a task
        acceptTask: builder.mutation({
            query: (taskId) => ({
                url: `/tasks/${taskId}/accept`,
                method: "PATCH",
            }),
            invalidatesTags: ["Task"],
        }),
        // Add inside endpoints:
        replyToComment: builder.mutation({
            query: ({ taskId, commentId, message }) => ({
                url: `/tasks/${taskId}/comments/${commentId}/reply`,
                method: "PATCH",
                body: { message },
            }),
            invalidatesTags: ["Task"],
        }),

        updateTaskStatus: builder.mutation({
            query: ({ taskId, status }) => ({
                url: `/tasks/${taskId}/status`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["Task"],
        }),


        // ✅ Update a task
        updateTask: builder.mutation({
            query: ({ taskId, updateData }) => ({
                url: `/tasks/${taskId}`,
                method: "PATCH",
                body: updateData,
            }),
            invalidatesTags: ["Task"],
        }),

        // ✅ Delete a task
        deleteTask: builder.mutation({
            query: (taskId) => ({
                url: `/tasks/${taskId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Task"],
        }),
        // Delete single task
        deleteTaskAdmin: builder.mutation({
            query: (id) => ({
                url: `/tasks/tasks/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Task'],
        }),

        // Bulk delete tasks
        
        bulkDeleteTasks: builder.mutation({
            query: (taskIds) => ({
                url: '/tasks/bulk-delete',
                method: 'POST',
                body: { taskIds },
            }),
            invalidatesTags: ['Task'],
        }),
    }),
});

export const {
    usePostTaskMutation,
    useGetAllTasksQuery,
    useGetUrgentTasksQuery,
    useGetTasksByStatusQuery,
    useGetTasksExcludingStatusQuery,
    useGetTasksByClientQuery,
    useRequestCompletionMutation,
    useGetTaskByIdQuery,
    useAddCommentMutation,
    useBidOnTaskMutation,
    useAcceptTaskMutation,
    useReplyToCommentMutation,
    useUpdateTaskStatusMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
    useDeleteTaskAdminMutation,
    useBulkDeleteTasksMutation,
    useGetTaskFiltersQuery,
} = taskApi;
