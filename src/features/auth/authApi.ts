// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// interface GetAllUsersParams {
//     page?: any;
//     limit?: any;
//     search?: any;
//     role?: any;
//     province?: any;
// }

// // interface GetTaskersParams {
// //     page?: number;
// //     limit?: number;
// //     search?: string;
// //     category?: string;
// //     province?: string;
// // }

// interface GetTaskersParams {
//     page?: number;
//     limit?: number;
//     search?: string;
//     category?: string;
//     province?: string;
//     availability?: string;
//     rating?: string;
//     experience?: string;
//     minPrice?: string;
//     maxPrice?: string;
// }


// export const authApi = createApi({
//     reducerPath: "authApi",
//     baseQuery: fetchBaseQuery({
//         baseUrl: `http://localhost:5000/api/auth`,
//         credentials: "include", // ✅ This is correct
//         prepareHeaders: (headers) => {
//             // Ensure proper headers for CORS
//             headers.set('Content-Type', 'application/json');
//             return headers;
//         },
//     }),
//     tagTypes: ["User", "Review"], // ✅ For cache invalidation
//     endpoints: (builder) => ({
//         // ===== AUTHENTICATION =====
//         signup: builder.mutation({
//             query: (userData) => ({
//                 url: "/signup",
//                 method: "POST",
//                 body: userData,
//             }),
//             invalidatesTags: ["User"], // Refresh users list after signup
//         }),

//         login: builder.mutation({
//             query: (userData) => ({
//                 url: "/login",
//                 method: "POST",
//                 body: userData,
//             }),
//         }),

//         logout: builder.mutation({
//             query: () => ({
//                 url: "/logout",
//                 method: "POST",
//             }),
//         }),
//         // Forgot Password endpoints
//         forgotPassword: builder.mutation({
//             query: (data) => ({
//                 url: "/forgot-password",
//                 method: "POST",
//                 body: data,
//             }),
//         }),
//         verifyResetOtp: builder.mutation({
//             query: (data) => ({
//                 url: "/verify-reset-otp",
//                 method: "POST",
//                 body: data,
//             }),
//         }),
//         resetPassword: builder.mutation({
//             query: (data) => ({
//                 url: "/reset-password",
//                 method: "POST",
//                 body: data,
//             }),
//         }),
//         resendResetOtp: builder.mutation({
//             query: (data) => ({
//                 url: "/resend-reset-otp",
//                 method: "POST",
//                 body: data,
//             }),
//         }),

//         // ===== USER MANAGEMENT =====
//         // Get all users with pagination and filters
//         getAllUsers: builder.query<any, GetAllUsersParams | void>({
//             query: ({ page = 1, limit = 10, search = "", role = "", province = "" } = {}) => {
//                 const params = new URLSearchParams({
//                     page: page.toString(),
//                     limit: limit.toString(),
//                     ...(search && { search }),
//                     ...(role && { role }),
//                     ...(province && { province }),
//                 });
//                 return `/users?${params}`;
//             },
//             providesTags: ["User"], // ✅ For caching
//         }),


//         // Get taskers with pagination and enhanced filters
//         getTaskers: builder.query<any, GetTaskersParams | void>({
//             query: ({
//                 page = 1,
//                 limit = 10,
//                 search = "",
//                 category = "",
//                 province = "",
//                 availability = "",
//                 rating = "",
//                 experience = "",
//                 minPrice = "",
//                 maxPrice = "",
//             } = {}) => {
//                 const params = new URLSearchParams({
//                     page: page.toString(),
//                     limit: limit.toString(),
//                     ...(search && { search }),
//                     ...(category && { category }),
//                     ...(province && { province }),
//                     ...(availability && availability !== "All" && { availability }),
//                     ...(rating && rating !== "All Ratings" && { rating }),
//                     ...(experience && experience !== "All Levels" && { experience }),
//                     ...(minPrice && { minPrice }),
//                     ...(maxPrice && { maxPrice }),
//                 });
//                 return `/taskers?${params.toString()}`;
//             },
//             providesTags: ["User"],
//         }),

//         getTopTaskerReviews: builder.query({
//             query: () => "/top-reviews",
//             providesTags: ["User"],
//         }),
//         // Get single user by ID
//         getUserById: builder.query({
//             query: (id) => `/users/single/${id}`,
//             providesTags: (result, error, id) => [{ type: "User", id }],
//         }),

//         // ===== TASKER APPLICATION =====
//         submitTaskerApplication: builder.mutation<
//             { success: boolean; message: string; taskerStatus: string },
//             void
//         >({
//             query: () => ({
//                 url: "/submit-tasker-application",
//                 method: "POST",
//             }),
//             invalidatesTags: ["User"], // This will refetch getUserById, getAllUsers, etc.
//         }),

//         // Inside endpoints(builder)
//         approveRejectTasker: builder.mutation<
//             { success: boolean; message: string; taskerStatus: string },
//             { userId: string; action: 'approve' | 'reject'; reason?: string }
//         >({
//             query: ({ userId, action, reason }) => ({
//                 url: `/users/tasker-approval/${userId}`,
//                 method: 'PATCH',
//                 body: { action, reason },
//             }),
//             invalidatesTags: (result, error, { userId }) => [
//                 'User',
//                 { type: 'User', id: userId }
//             ],
//         }),

//         updateUser: builder.mutation({
//             query: ({ userId, ...userData }) => {
//              //   console.log('Sending update user request with data:', { userId, ...userData });
//                 return {
//                     url: `/updateProfile/${userId}`,
//                     method: 'PUT',
//                     body: userData,
//                 };
//             },
//             invalidatesTags: (result, error, { userId }) => {
//             //    console.log('Invalidating tags for user ID:', userId);
//                 return userId ? [{ type: 'User', id: userId }, 'User'] : ['User'];
//             },
//         }),

//         // Block or unblock user (admin feature)
//         blockUser: builder.mutation({
//             query: ({ id, block }) => ({
//                 url: `/users/block/${id}`,
//                 method: "PATCH",
//                 body: { block }, // { block: true } or { block: false }
//             }),
//             invalidatesTags: (result, error, { id }) => [
//                 "User",
//                 { type: "User", id }
//             ],
//         }),

//         // Block or unblock user (admin feature)
//         toggleTaskerProfileCheck: builder.mutation({
//             query: ({ id, approve }) => ({
//                 url: `/users/taskerProfileCheck/${id}`,
//                 method: "PATCH",
//                 body: { approve }, // { approve: true } or { approve: false }
//             }),
//             invalidatesTags: (result, error, { id }) => [
//                 "User",
//                 { type: "User", id }
//             ],
//         }),


//         // Delete user
//         deleteUser: builder.mutation({
//             query: (id) => ({
//                 url: `/users/${id}`,
//                 method: "DELETE",
//             }),
//             invalidatesTags: ["User"], // ✅ Refresh users list after deletion
//         }),

//         // Update password
//         updatePassword: builder.mutation({
//             query: ({ id, currentPassword, newPassword }) => ({
//                 url: `/users/${id}/password`,
//                 method: "PATCH",
//                 body: { currentPassword, newPassword },
//             }),
//         }),
//         // Submit a rating for a tasker
//         submitRating: builder.mutation({
//             query: ({ taskerId, taskId, rating, comment }) => ({
//                 url: "/ratings",
//                 method: "POST",
//                 body: { taskerId, taskId, rating, comment },
//             }),
//             invalidatesTags: (result, error, { taskerId }) => [
//                 "Review",
//                 { type: "User", id: taskerId },
//             ],
//         }),

//         // Get user statistics
//         getUserStats: builder.query({
//             query: () => "/users/stats",
//             providesTags: ["User"],
//         }),
//     }),
// });

// export const {
//     // Authentication hooks
//     useSignupMutation,
//     useLoginMutation,
//     useLogoutMutation,
//     useGetTopTaskerReviewsQuery,
//     useSubmitRatingMutation,
//     // User management hooks
//     useGetAllUsersQuery,
//     useGetTaskersQuery,
//     useGetUserByIdQuery,
//     useUpdateUserMutation,
//     useDeleteUserMutation,
//     useUpdatePasswordMutation,
//     useGetUserStatsQuery,
//     useBlockUserMutation,
//     useToggleTaskerProfileCheckMutation,
//     useSubmitTaskerApplicationMutation,
//     useApproveRejectTaskerMutation, 
//     useForgotPasswordMutation,
//     useVerifyResetOtpMutation,
//     useResetPasswordMutation,
//     useResendResetOtpMutation,

// } = authApi;


// @ts-nocheck
// store/api/authApi.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ==================== TYPES ====================

// Admin Users Types
interface AdminUsersParams {
    page?: number;
    limit?: number;
    roleType?: 'client' | 'tasker' | 'both' | 'pending' | 'all';
    search?: string;
    status?: 'active' | 'inactive' | 'suspended' | 'banned' | '';
    isBlocked?: string;
    emailVerified?: string;
    phoneVerified?: string;
    identityVerified?: string;
    taskerStatus?: string;
    stripeConnectStatus?: string;
    city?: string;
    province?: string;
    country?: string;
    minTasksCompleted?: string;
    maxTasksCompleted?: string;
    minBookingsCompleted?: string;
    maxBookingsCompleted?: string;
    minTotalEarnings?: string;
    maxTotalEarnings?: string;
    minRating?: string;
    maxRating?: string;
    createdFrom?: string;
    createdTo?: string;
    lastActiveFrom?: string;
    lastActiveTo?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    category?: string;
}

interface UserVerification {
    email: boolean;
    phone: boolean;
    identity: boolean;
    address: boolean;
}

interface UserLocation {
    city: string;
    province: string;
    country: string;
}

interface UserStats {
    tasksCompleted: number;
    bookingsCompleted: number;
    totalEarnings: number;
    responseRate: number;
    completionRate: number;
}

interface AdminUser {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    profilePicture?: string;
    roles: string[];
    currentRole: string;
    status: 'active' | 'inactive' | 'suspended' | 'banned';
    verification: UserVerification;
    location: UserLocation;
    taskerStatus?: string;
    stripeConnectStatus?: string;
    rating: number;
    reviewCount: number;
    stats: UserStats;
    categories: string[];
    createdAt: string;
    updatedAt: string;
    lastActive: string;
}

interface AdminUsersPagination {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

interface AdminUsersStats {
    total: number;
    active: number;
    blocked: number;
    verified: number;
    totalEarnings: number;
    avgRating: number | string;
    totalTasksCompleted: number;
    totalBookingsCompleted: number;
}

interface AdminUsersResponse {
    success: boolean;
    data: {
        users: AdminUser[];
        pagination: AdminUsersPagination;
        stats: AdminUsersStats;
    };
}

interface AdminUserDetailResponse {
    success: boolean;
    data: any; // Full user object with all details
}

interface UpdateUserStatusParams {
    id: string;
    action: 'block' | 'unblock' | 'suspend' | 'activate' | 'ban';
    reason?: string;
}

interface UpdateUserStatusResponse {
    success: boolean;
    message: string;
    data: {
        id: string;
        isBlocked: boolean;
        status: string;
    };
}

interface BulkUpdateParams {
    userIds: string[];
    action: 'block' | 'unblock' | 'suspend' | 'activate' | 'delete';
    reason?: string;
}

interface BulkUpdateResponse {
    success: boolean;
    message: string;
    data?: {
        modifiedCount: number;
        action: string;
    };
}

interface ExportUsersParams {
    roleType?: 'client' | 'tasker' | 'both' | 'pending' | 'all';
    format?: 'json' | 'csv';
}

// Existing Types
interface GetAllUsersParams {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    province?: string;
}

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

interface ApproveRejectTaskerParams {
    userId: string;
    action: 'approve' | 'reject';
    reason?: string;
}

interface ApproveRejectTaskerResponse {
    success: boolean;
    message: string;
    taskerStatus: string;
}

// ==================== API DEFINITION ====================

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `/api/auth`,
        credentials: "include",
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    tagTypes: ["User", "AdminUsers", "Review"],
    endpoints: (builder) => ({

        // ==========================================
        // ========== AUTHENTICATION =================
        // ==========================================

        signup: builder.mutation<any, any>({
            query: (userData) => ({
                url: "/signup",
                method: "POST",
                body: userData,
            }),
            invalidatesTags: ["User", "AdminUsers"],
        }),

        login: builder.mutation<any, { email: string; password: string }>({
            query: (userData) => ({
                url: "/login",
                method: "POST",
                body: userData,
            }),
        }),

        logout: builder.mutation<any, void>({
            query: () => ({
                url: "/logout",
                method: "POST",
            }),
        }),

        // ==========================================
        // ========== FORGOT PASSWORD ================
        // ==========================================

        forgotPassword: builder.mutation<any, { email: string }>({
            query: (data) => ({
                url: "/forgot-password",
                method: "POST",
                body: data,
            }),
        }),

        verifyResetOtp: builder.mutation<any, { email: string; otp: string }>({
            query: (data) => ({
                url: "/verify-reset-otp",
                method: "POST",
                body: data,
            }),
        }),

        resetPassword: builder.mutation<any, { email: string; otp: string; newPassword: string }>({
            query: (data) => ({
                url: "/reset-password",
                method: "POST",
                body: data,
            }),
        }),

        resendResetOtp: builder.mutation<any, { email: string }>({
            query: (data) => ({
                url: "/resend-reset-otp",
                method: "POST",
                body: data,
            }),
        }),

        // ==========================================
        // ========== ADMIN USER MANAGEMENT ==========
        // ==========================================

        // Get admin users with all filters (generic - can filter by roleType)
        getAdminUsers: builder.query<AdminUsersResponse, AdminUsersParams>({
            query: (params = {}) => {
                const searchParams = new URLSearchParams();

                // Add all params that have values
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        searchParams.append(key, value.toString());
                    }
                });

                return `/admin/users?${searchParams.toString()}`;
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.users.map(({ id }) => ({
                            type: 'AdminUsers' as const,
                            id,
                        })),
                        { type: 'AdminUsers', id: 'LIST' },
                    ]
                    : [{ type: 'AdminUsers', id: 'LIST' }],
        }),

        // Get clients only (users who are ONLY clients, not taskers)
        getAdminClients: builder.query<AdminUsersResponse, Omit<AdminUsersParams, 'roleType'>>({
            query: (params = {}) => {
                const searchParams = new URLSearchParams();
                searchParams.append('roleType', 'client');

                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        searchParams.append(key, value.toString());
                    }
                });

                return `/admin/users?${searchParams.toString()}`;
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.users.map(({ id }) => ({
                            type: 'AdminUsers' as const,
                            id,
                        })),
                        { type: 'AdminUsers', id: 'CLIENTS' },
                    ]
                    : [{ type: 'AdminUsers', id: 'CLIENTS' }],
        }),

        // Get taskers only (approved taskers)
        getAdminTaskers: builder.query<AdminUsersResponse, Omit<AdminUsersParams, 'roleType'>>({
            query: (params = {}) => {
                const searchParams = new URLSearchParams();
                searchParams.append('roleType', 'tasker');

                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        searchParams.append(key, value.toString());
                    }
                });

                return `/admin/users?${searchParams.toString()}`;
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.users.map(({ id }) => ({
                            type: 'AdminUsers' as const,
                            id,
                        })),
                        { type: 'AdminUsers', id: 'TASKERS' },
                    ]
                    : [{ type: 'AdminUsers', id: 'TASKERS' }],
        }),

        // Get users with BOTH client and tasker roles
        getAdminBothRoles: builder.query<AdminUsersResponse, Omit<AdminUsersParams, 'roleType'>>({
            query: (params = {}) => {
                const searchParams = new URLSearchParams();
                searchParams.append('roleType', 'both');

                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        searchParams.append(key, value.toString());
                    }
                });

                return `/admin/users?${searchParams.toString()}`;
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.users.map(({ id }) => ({
                            type: 'AdminUsers' as const,
                            id,
                        })),
                        { type: 'AdminUsers', id: 'BOTH' },
                    ]
                    : [{ type: 'AdminUsers', id: 'BOTH' }],
        }),

        // Get pending verification users (taskerStatus = 'under_review')
        getAdminPendingUsers: builder.query<AdminUsersResponse, Omit<AdminUsersParams, 'roleType'>>({
            query: (params = {}) => {
                const searchParams = new URLSearchParams();
                searchParams.append('roleType', 'pending');

                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        searchParams.append(key, value.toString());
                    }
                });

                return `/admin/users?${searchParams.toString()}`;
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.users.map(({ id }) => ({
                            type: 'AdminUsers' as const,
                            id,
                        })),
                        { type: 'AdminUsers', id: 'PENDING' },
                    ]
                    : [{ type: 'AdminUsers', id: 'PENDING' }],
        }),

        // Get single user details for admin view
        getAdminUserById: builder.query<AdminUserDetailResponse, string>({
            query: (id) => `/admin/users/${id}`,
            providesTags: (result, error, id) => [{ type: 'AdminUsers', id }],
        }),

        // Update user status (block/unblock/suspend/activate/ban)
        updateUserStatus: builder.mutation<UpdateUserStatusResponse, UpdateUserStatusParams>({
            query: ({ id, action, reason }) => ({
                url: `/admin/users/${id}/status`,
                method: 'PATCH',
                body: { action, reason },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'AdminUsers', id },
                { type: 'AdminUsers', id: 'LIST' },
                { type: 'AdminUsers', id: 'CLIENTS' },
                { type: 'AdminUsers', id: 'TASKERS' },
                { type: 'AdminUsers', id: 'BOTH' },
                { type: 'AdminUsers', id: 'PENDING' },
                { type: 'User', id },
                'User',
            ],
        }),

        // Bulk update multiple users
        bulkUpdateUsers: builder.mutation<BulkUpdateResponse, BulkUpdateParams>({
            query: ({ userIds, action, reason }) => ({
                url: '/admin/users/bulk',
                method: 'PATCH',
                body: { userIds, action, reason },
            }),
            invalidatesTags: [
                { type: 'AdminUsers', id: 'LIST' },
                { type: 'AdminUsers', id: 'CLIENTS' },
                { type: 'AdminUsers', id: 'TASKERS' },
                { type: 'AdminUsers', id: 'BOTH' },
                { type: 'AdminUsers', id: 'PENDING' },
                'User',
                'AdminUsers',
            ],
        }),

        // Export users (lazy query for triggering download)
        exportUsers: builder.query<any, ExportUsersParams>({
            query: ({ roleType = 'all', format = 'json' }) =>
                `/admin/users/export?roleType=${roleType}&format=${format}`,
        }),

        // ==========================================
        // ========== EXISTING USER ENDPOINTS ========
        // ==========================================

        // Get all users (existing - for non-admin use)
        getAllUsers: builder.query<any, GetAllUsersParams | void>({
            query: (params = {}) => {
                const { page = 1, limit = 10, search = "", role = "", province = "" } = params;
                const searchParams = new URLSearchParams({
                    page: page.toString(),
                    limit: limit.toString(),
                    ...(search && { search }),
                    ...(role && { role }),
                    ...(province && { province }),
                });
                return `/users?${searchParams.toString()}`;
            },
            providesTags: ["User"],
        }),

        // Get taskers (existing - for public tasker listing)
        getTaskers: builder.query<any, GetTaskersParams | void>({
            query: (params = {}) => {
                const {
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
                } = params;

                const searchParams = new URLSearchParams({
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
                return `/taskers?${searchParams.toString()}`;
            },
            providesTags: ["User"],
        }),

        // Get top tasker reviews
        getTopTaskerReviews: builder.query<any, void>({
            query: () => "/top-reviews",
            providesTags: ["User"],
        }),

        // Get single user by ID (existing)
        getUserById: builder.query<any, string>({
            query: (id) => `/users/single/${id}`,
            providesTags: (result, error, id) => [{ type: "User", id }],
        }),

        // ==========================================
        // ========== TASKER APPLICATION =============
        // ==========================================

        // Submit tasker application
        submitTaskerApplication: builder.mutation<
            { success: boolean; message: string; taskerStatus: string },
            void
        >({
            query: () => ({
                url: "/submit-tasker-application",
                method: "POST",
            }),
            invalidatesTags: ["User", "AdminUsers"],
        }),

        // Approve or reject tasker
        approveRejectTasker: builder.mutation<ApproveRejectTaskerResponse, ApproveRejectTaskerParams>({
            query: ({ userId, action, reason }) => ({
                url: `/users/tasker-approval/${userId}`,
                method: 'PATCH',
                body: { action, reason },
            }),
            invalidatesTags: (result, error, { userId }) => [
                'User',
                'AdminUsers',
                { type: 'User', id: userId },
                { type: 'AdminUsers', id: userId },
                { type: 'AdminUsers', id: 'PENDING' },
                { type: 'AdminUsers', id: 'TASKERS' },
            ],
        }),

        // ==========================================
        // ========== USER PROFILE MANAGEMENT ========
        // ==========================================

        // Update user profile
        updateUser: builder.mutation<any, { userId: string;[key: string]: any }>({
            query: ({ userId, ...userData }) => ({
                url: `/updateProfile/${userId}`,
                method: 'PUT',
                body: userData,
            }),
            invalidatesTags: (result, error, { userId }) => [
                { type: 'User', id: userId },
                { type: 'AdminUsers', id: userId },
                'User',
                'AdminUsers',
            ],
        }),

        // Block or unblock user (existing admin feature)
        blockUser: builder.mutation<any, { id: string; block: boolean }>({
            query: ({ id, block }) => ({
                url: `/users/block/${id}`,
                method: "PATCH",
                body: { block },
            }),
            invalidatesTags: (result, error, { id }) => [
                "User",
                "AdminUsers",
                { type: "User", id },
                { type: "AdminUsers", id },
            ],
        }),

        // Toggle tasker profile check
        toggleTaskerProfileCheck: builder.mutation<any, { id: string; approve: boolean }>({
            query: ({ id, approve }) => ({
                url: `/users/taskerProfileCheck/${id}`,
                method: "PATCH",
                body: { approve },
            }),
            invalidatesTags: (result, error, { id }) => [
                "User",
                "AdminUsers",
                { type: "User", id },
                { type: "AdminUsers", id },
            ],
        }),

        // Delete user
        deleteUser: builder.mutation<any, string>({
            query: (id) => ({
                url: `/users/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["User", "AdminUsers"],
        }),

        // Update password
        updatePassword: builder.mutation<any, { id: string; currentPassword: string; newPassword: string }>({
            query: ({ id, currentPassword, newPassword }) => ({
                url: `/users/${id}/password`,
                method: "PATCH",
                body: { currentPassword, newPassword },
            }),
        }),

        // ==========================================
        // ========== REVIEWS & RATINGS ==============
        // ==========================================

        // Submit a rating for a tasker
        submitRating: builder.mutation<any, { taskerId: string; taskId: string; rating: number; comment: string }>({
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

        // ==========================================
        // ========== USER STATISTICS ================
        // ==========================================

        // Get user statistics
        getUserStats: builder.query<any, void>({
            query: () => "/users/stats",
            providesTags: ["User"],
        }),
    }),
});

// ==================== EXPORT HOOKS ====================

export const {
    // ========== Authentication Hooks ==========
    useSignupMutation,
    useLoginMutation,
    useLogoutMutation,

    // ========== Forgot Password Hooks ==========
    useForgotPasswordMutation,
    useVerifyResetOtpMutation,
    useResetPasswordMutation,
    useResendResetOtpMutation,

    // ========== Admin User Management Hooks ==========
    useGetAdminUsersQuery,
    useGetAdminClientsQuery,
    useGetAdminTaskersQuery,
    useGetAdminBothRolesQuery,
    useGetAdminPendingUsersQuery,
    useGetAdminUserByIdQuery,
    useUpdateUserStatusMutation,
    useBulkUpdateUsersMutation,
    useLazyExportUsersQuery,

    // ========== Existing User Hooks ==========
    useGetAllUsersQuery,
    useGetTaskersQuery,
    useGetTopTaskerReviewsQuery,
    useGetUserByIdQuery,

    // ========== Tasker Application Hooks ==========
    useSubmitTaskerApplicationMutation,
    useApproveRejectTaskerMutation,

    // ========== User Profile Hooks ==========
    useUpdateUserMutation,
    useBlockUserMutation,
    useToggleTaskerProfileCheckMutation,
    useDeleteUserMutation,
    useUpdatePasswordMutation,

    // ========== Reviews & Ratings Hooks ==========
    useSubmitRatingMutation,

    // ========== Statistics Hooks ==========
    useGetUserStatsQuery,
} = authApi;