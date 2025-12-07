import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from 'js-cookie';

;

export const taskApi = createApi({
    reducerPath: "taskApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `https://taskmatch-backend.vercel.app/api`,
        credentials: "include", // keep if you want to send cookies too
        prepareHeaders: (headers) => {
            const token = Cookies.get("token"); // get your JWT token from cookies (or change source if needed)
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),

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


        checkPaymentMethod: builder.query({
            query: () => '/tasks/check-payment-method',
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

        // ✅ Get schedule tasks (with optional status)
        getScheduleTasks: builder.query({
            query: () => {
                return `/tasks/schedule`;
            },
        }),

        getFlexibleTasks: builder.query({
            query: () => {
                return `/tasks/flexible`;
            },
        }),


        // ✅ Get completed and in progress tasks
        getCompletedAndInProgressTasks: builder.query({
            query: () => '/tasks/completedAndInProgress',
            providesTags: ['Task'],
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


        getTasksByTaskerIdAndStatus: builder.query({
            query: ({ taskerId, status }) => ({
                url: `/tasks/taskertasks/${taskerId}`,
                params: status ? { status } : {}, // Include status as query param if provided
            }),
            providesTags: ['Task'],
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


        getTaskMessages: builder.query({
            query: (taskId) => `/tasks/${taskId}/messages`,
            providesTags: ["Task"],
        }),

        // Send a message in task chat
        sendMessage: builder.mutation({
            query: ({ taskId, message }) => ({
                url: `/tasks/${taskId}/messages`,
                method: "POST",
                body: { message },
            }),
            invalidatesTags: ["Task"],
        }),


        // In your taskApi endpoints
        createPaymentIntent: builder.mutation({
            query: (data: {
                amount: number;
                taskId: string;
                taskerId: string;
                description: string
            }) => ({
                url: '/tasks/create-payment-intent',
                method: 'POST',
                body: data,
            }),
        }),


        createSetupIntent: builder.mutation({
            query: () => ({
                url: '/tasks/setup-intent',
                method: 'POST',
            }),
        }),

        savePaymentMethod: builder.mutation({
            query: (paymentMethodId) => ({
                url: '/tasks/save-payment-method',
                method: 'POST',
                body: { paymentMethodId },
            }),
            invalidatesTags: ['Task'],
        }),

        // Edit a message
        updateMessage: builder.mutation({
            query: ({ taskId, messageId, message }) => ({
                url: `/tasks/${taskId}/messages/${messageId}`,
                method: "PATCH",
                body: { message },
            }),
            invalidatesTags: ["Task"],
        }),

        // Delete a messagea
        deleteMessage: builder.mutation({
            query: ({ taskId, messageId }) => ({
                url: `/tasks/${taskId}/messages/${messageId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Task"],
        }),

        // Mark messages as read
        // features/api/taskApi.ts

        // Update your markMessagesAsRead mutation
        markMessagesAsRead: builder.mutation<
            { success: boolean; updatedCount?: number; message?: string },
            string
        >({
            query: (taskId) => ({
                url: `/tasks/${taskId}/messages/mark-read`,
                method: 'PATCH',
            }),
            // Invalidate to refetch fresh data
            invalidatesTags: (result, error, taskId) => [
                'Task',
                { type: 'Task', id: taskId }
            ],
        }),

        // Add unread count query
        getUnreadCount: builder.query<
            { success: boolean; unreadCount: number; totalMessages: number },
            string
        >({
            query: (taskId) => `/tasks/${taskId}/messages/unread-count`,
            providesTags: (result, error, taskId) => [{ type: 'Task', id: taskId }],
        }),





        addTaskReview: builder.mutation({
            query: ({ taskId, rating, message }) => ({
                url: "/tasks/reviews",
                method: "POST",
                body: { taskId, rating, message },
            }),
            invalidatesTags: ["Task"],
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
        declineByTasker: builder.mutation({
            query: (taskId) => ({
                url: `/tasks/${taskId}/decline`,
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


        // accept bid by the client
        acceptBid: builder.mutation({
            query: ({ taskId, taskerId }) => ({
                url: `/tasks/${taskId}/accept-bid`,
                method: "PATCH",
                body: { taskerId },
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
        getMessageStatus: builder.query({
            query: (taskId) => `/tasks/${taskId}/messages/status`,
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
    useGetCompletedAndInProgressTasksQuery,
    useGetScheduleTasksQuery,
    useGetFlexibleTasksQuery,
    useGetTasksByStatusQuery,
    useGetTasksExcludingStatusQuery,
    useGetTasksByTaskerIdAndStatusQuery,
    useGetTasksByClientQuery,
    useAddTaskReviewMutation,
    useRequestCompletionMutation,
    useDeclineByTaskerMutation,
    useGetTaskByIdQuery,
    useAddCommentMutation,
    useBidOnTaskMutation,
    useAcceptTaskMutation,
    useAcceptBidMutation,
    useReplyToCommentMutation,
    useUpdateTaskStatusMutation,
    useUpdateTaskMutation,
    useGetMessageStatusQuery,
    useDeleteTaskMutation,
    useDeleteTaskAdminMutation,
    useBulkDeleteTasksMutation,
    useGetTaskFiltersQuery,
    useSendMessageMutation,
    useUpdateMessageMutation,
    useDeleteMessageMutation,
    useMarkMessagesAsReadMutation,
    useGetTaskMessagesQuery,
    useCheckPaymentMethodQuery,
    useCreateSetupIntentMutation,
    useSavePaymentMethodMutation,
    useCreatePaymentIntentMutation,
    useGetUnreadCountQuery
} = taskApi;
