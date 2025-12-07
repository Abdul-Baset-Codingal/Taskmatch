/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface GetAllUsersParams {
    page?: any;
    limit?: any;
    search?: any;
    role?: any;
    province?: any;
}

// interface GetTaskersParams {
//     page?: number;
//     limit?: number;
//     search?: string;
//     category?: string;
//     province?: string;
// }

interface GetTaskersParams {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    province?: string;
    availability?: string;
    rating?: string;
    experience?: string;
    minPrice?: string;
    maxPrice?: string;
}


export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `https://taskmatch-backend.vercel.app/api/auth`,
        credentials: "include", // ✅ This is correct
        prepareHeaders: (headers) => {
            // Ensure proper headers for CORS
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    tagTypes: ["User", "Review"], // ✅ For cache invalidation
    endpoints: (builder) => ({
        // ===== AUTHENTICATION =====
        signup: builder.mutation({
            query: (userData) => ({
                url: "/signup",
                method: "POST",
                body: userData,
            }),
            invalidatesTags: ["User"], // Refresh users list after signup
        }),

        login: builder.mutation({
            query: (userData) => ({
                url: "/login",
                method: "POST",
                body: userData,
            }),
        }),

        logout: builder.mutation({
            query: () => ({
                url: "/logout",
                method: "POST",
            }),
        }),
        // Forgot Password endpoints
        forgotPassword: builder.mutation({
            query: (data) => ({
                url: "/forgot-password",
                method: "POST",
                body: data,
            }),
        }),
        verifyResetOtp: builder.mutation({
            query: (data) => ({
                url: "/verify-reset-otp",
                method: "POST",
                body: data,
            }),
        }),
        resetPassword: builder.mutation({
            query: (data) => ({
                url: "/reset-password",
                method: "POST",
                body: data,
            }),
        }),
        resendResetOtp: builder.mutation({
            query: (data) => ({
                url: "/resend-reset-otp",
                method: "POST",
                body: data,
            }),
        }),

        // ===== USER MANAGEMENT =====
        // Get all users with pagination and filters
        getAllUsers: builder.query<any, GetAllUsersParams | void>({
            query: ({ page = 1, limit = 10, search = "", role = "", province = "" } = {}) => {
                const params = new URLSearchParams({
                    page: page.toString(),
                    limit: limit.toString(),
                    ...(search && { search }),
                    ...(role && { role }),
                    ...(province && { province }),
                });
                return `/users?${params}`;
            },
            providesTags: ["User"], // ✅ For caching
        }),


        // Get taskers with pagination and enhanced filters
        getTaskers: builder.query<any, GetTaskersParams | void>({
            query: ({
                page = 1,
                limit = 10,
                search = "",
                category = "",
                province = "",
                availability = "",
                rating = "",
                experience = "",
                minPrice = "",
                maxPrice = "",
            } = {}) => {
                const params = new URLSearchParams({
                    page: page.toString(),
                    limit: limit.toString(),
                    ...(search && { search }),
                    ...(category && { category }),
                    ...(province && { province }),
                    ...(availability && availability !== "All" && { availability }),
                    ...(rating && rating !== "All Ratings" && { rating }),
                    ...(experience && experience !== "All Levels" && { experience }),
                    ...(minPrice && { minPrice }),
                    ...(maxPrice && { maxPrice }),
                });
                return `/taskers?${params.toString()}`;
            },
            providesTags: ["User"],
        }),

        getTopTaskerReviews: builder.query({
            query: () => "/top-reviews",
            providesTags: ["User"],
        }),
        // Get single user by ID
        getUserById: builder.query({
            query: (id) => `/users/single/${id}`,
            providesTags: (result, error, id) => [{ type: "User", id }],
        }),

        // ===== TASKER APPLICATION =====
        submitTaskerApplication: builder.mutation<
            { success: boolean; message: string; taskerStatus: string },
            void
        >({
            query: () => ({
                url: "/submit-tasker-application",
                method: "POST",
            }),
            invalidatesTags: ["User"], // This will refetch getUserById, getAllUsers, etc.
        }),

        // Inside endpoints(builder)
        approveRejectTasker: builder.mutation<
            { success: boolean; message: string; taskerStatus: string },
            { userId: string; action: 'approve' | 'reject'; reason?: string }
        >({
            query: ({ userId, action, reason }) => ({
                url: `/users/tasker-approval/${userId}`,
                method: 'PATCH',
                body: { action, reason },
            }),
            invalidatesTags: (result, error, { userId }) => [
                'User',
                { type: 'User', id: userId }
            ],
        }),

        updateUser: builder.mutation({
            query: ({ userId, ...userData }) => {
             //   console.log('Sending update user request with data:', { userId, ...userData });
                return {
                    url: `/updateProfile/${userId}`,
                    method: 'PUT',
                    body: userData,
                };
            },
            invalidatesTags: (result, error, { userId }) => {
            //    console.log('Invalidating tags for user ID:', userId);
                return userId ? [{ type: 'User', id: userId }, 'User'] : ['User'];
            },
        }),

        // Block or unblock user (admin feature)
        blockUser: builder.mutation({
            query: ({ id, block }) => ({
                url: `/users/block/${id}`,
                method: "PATCH",
                body: { block }, // { block: true } or { block: false }
            }),
            invalidatesTags: (result, error, { id }) => [
                "User",
                { type: "User", id }
            ],
        }),

        // Block or unblock user (admin feature)
        toggleTaskerProfileCheck: builder.mutation({
            query: ({ id, approve }) => ({
                url: `/users/taskerProfileCheck/${id}`,
                method: "PATCH",
                body: { approve }, // { approve: true } or { approve: false }
            }),
            invalidatesTags: (result, error, { id }) => [
                "User",
                { type: "User", id }
            ],
        }),


        // Delete user
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/users/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["User"], // ✅ Refresh users list after deletion
        }),

        // Update password
        updatePassword: builder.mutation({
            query: ({ id, currentPassword, newPassword }) => ({
                url: `/users/${id}/password`,
                method: "PATCH",
                body: { currentPassword, newPassword },
            }),
        }),
        // Submit a rating for a tasker
        submitRating: builder.mutation({
            query: ({ taskerId, taskId, rating, comment }) => ({
                url: "/ratings",
                method: "POST",
                body: { taskerId, taskId, rating, comment },
            }),
            invalidatesTags: (result, error, { taskerId }) => [
                "Review",
                { type: "User", id: taskerId },
            ],
        }),

        // Get user statistics
        getUserStats: builder.query({
            query: () => "/users/stats",
            providesTags: ["User"],
        }),
    }),
});

export const {
    // Authentication hooks
    useSignupMutation,
    useLoginMutation,
    useLogoutMutation,
    useGetTopTaskerReviewsQuery,
    useSubmitRatingMutation,
    // User management hooks
    useGetAllUsersQuery,
    useGetTaskersQuery,
    useGetUserByIdQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useUpdatePasswordMutation,
    useGetUserStatsQuery,
    useBlockUserMutation,
    useToggleTaskerProfileCheckMutation,
    useSubmitTaskerApplicationMutation,
    useApproveRejectTaskerMutation, 
    useForgotPasswordMutation,
    useVerifyResetOtpMutation,
    useResetPasswordMutation,
    useResendResetOtpMutation,

} = authApi;