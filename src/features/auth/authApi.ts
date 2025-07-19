/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface GetAllUsersParams {
    page?: any;
    limit?: any;
    search?: any;
    role?: any;
    province?: any;
}
export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth`,
        credentials: "include", // ✅ This is correct
        prepareHeaders: (headers) => {
            // Ensure proper headers for CORS
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    tagTypes: ["User"], // ✅ For cache invalidation
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

        // Get single user by ID
        getUserById: builder.query({
            query: (id) => `/users/${id}`,
            providesTags: (result, error, id) => [{ type: "User", id }],
        }),

        // Update user
        updateUser: builder.mutation({
            query: ({ id, ...userData }) => ({
                url: `/users/${id}`,
                method: "PUT",
                body: userData,
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

    // User management hooks
    useGetAllUsersQuery,
    useGetUserByIdQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useUpdatePasswordMutation,
    useGetUserStatsQuery,
} = authApi;