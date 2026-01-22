// features/api/adminBookingApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from 'js-cookie';

// ==================== TYPES ====================

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    profilePicture?: string;
    rating?: number;
    reviewCount?: number;
    currentRole?: string;
    stripeCustomerId?: string;
    stripeConnectId?: string;
    address?: {
        street?: string;
        city?: string;
        province?: string;
        postalCode?: string;
        country?: string;
    };
}

interface Service {
    title: string;
    description: string;
    hourlyRate: number;
    estimatedDuration: string;
}

interface Payment {
    paymentIntentId?: string;
    transferId?: string;
    chargeId?: string;
    status: 'pending' | 'held' | 'authorized' | 'captured' | 'released' | 'refunded' | 'partial_refund' | 'failed' | 'cancelled';
    feeStructure?: string;
    serviceAmount?: number;
    serviceAmountCents?: number;
    clientPlatformFee?: number;
    clientPlatformFeeCents?: number;
    reservationFee?: number;
    reservationFeeCents?: number;
    clientTax?: number;
    clientTaxCents?: number;
    totalClientPays?: number;
    totalClientPaysCents?: number;
    taskerPlatformFee?: number;
    taskerPlatformFeeCents?: number;
    taskerTax?: number;
    taskerTaxCents?: number;
    taskerPayout?: number;
    taskerPayoutCents?: number;
    applicationFee?: number;
    applicationFeeCents?: number;
    grossAmount?: number;
    platformFee?: number;
    currency?: string;
    authorizedAt?: string;
    capturedAt?: string;
    releasedAt?: string;
    refundedAt?: string;
    cancelledAt?: string;
    refundAmount?: number;
    refundReason?: string;
    refundId?: string;
}

interface ExtraTime {
    _id: string;
    hours: number;
    serviceAmount?: number;
    totalClientPays?: number;
    taskerPayout?: number;
    amount?: number;
    reason?: string;
    paymentIntentId?: string;
    status: 'pending' | 'approved' | 'paid' | 'rejected' | 'cancelled';
    requestedAt: string;
    approvedAt?: string;
    paidAt?: string;
}

interface Refund {
    status: 'none' | 'requested' | 'approved' | 'processed' | 'rejected';
    amount?: number;
    amountCents?: number;
    clientRefund?: number;
    taskerDeduction?: number;
    platformKeeps?: number;
    reason?: string;
    requestedAt?: string;
    requestedBy?: User;
    processedAt?: string;
    processedBy?: User;
    refundId?: string;
}

interface AdminNote {
    _id?: string;
    content: string;
    createdBy?: User;
    createdAt: string;
    isPrivate: boolean;
}

interface AuditLogEntry {
    action: string;
    performedBy: User | string;
    performedAt: string;
    changes?: Array<{
        field: string;
        oldValue?: any;
        newValue?: any;
    }>;
    reason?: string;
    ip?: string;
    userAgent?: string;
    metadata?: any;
}

interface Review {
    rating: number;
    message?: string;
    createdAt?: string;
}

interface Location {
    address?: string;
    city?: string;
    postalCode?: string;
    notes?: string;
}

export interface Booking {
    _id: string;
    tasker: User;
    client: User;
    service: Service;
    date: string;
    duration?: number;
    endTime?: string;
    location?: Location;
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
    payment?: Payment;
    totalAmount: number;
    paymentIntentId?: string;
    stripeStatus?: string;
    paymentMethod?: string;
    paymentDetails?: {
        amountCaptured?: number;
        currency?: string;
        paymentMethodType?: string;
        billingDetails?: {
            name?: string;
            email?: string;
            phone?: string;
        };
    };
    extraTime?: ExtraTime[];
    refund?: Refund;
    confirmedAt?: string;
    startedAt?: string;
    completedAt?: string;
    cancelledAt?: string;
    cancelledBy?: User;
    cancellationReason?: string;
    clientNotes?: string;
    taskerNotes?: string;
    adminNotes?: AdminNote[];
    auditLog?: AuditLogEntry[];
    clientReview?: Review;
    taskerReview?: Review;
    isDeleted?: boolean;
    deletedAt?: string;
    deletedBy?: User;
    createdAt: string;
    updatedAt: string;
    formattedDate?: string;
}

interface TimelineEvent {
    event: string;
    date: string;
    type: 'info' | 'success' | 'warning' | 'error';
}

interface FeeBreakdown {
    client: {
        serviceAmount: number;
        platformFee: number;
        platformFeePercent: string;
        reservationFee: number;
        tax: number;
        taxPercent: string;
        total: number;
    };
    tasker: {
        serviceAmount: number;
        platformFee: number;
        platformFeePercent: string;
        tax: number;
        taxPercent: string;
        payout: number;
    };
    platform: {
        totalFees: number;
    };
}

interface StripeDetails {
    id: string;
    status: string;
    amount: number;
    amountReceived: number;
    currency: string;
    created: string;
    paymentMethod: string[];
    metadata: Record<string, string>;
    charges?: Array<{
        id: string;
        amount: number;
        status: string;
        refunded: boolean;
        disputed: boolean;
        created: string;
    }>;
    applicationFeeAmount?: number;
    transferData?: any;
    error?: string;
}

interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

interface BookingStats {
    totalRevenue: number;
    platformFees: number;
    taskerPayouts: number;
    avgBookingValue: number;
    count: number;
}

// ==================== RESPONSE TYPES ====================

interface GetAllBookingsResponse {
    success: boolean;
    data: {
        bookings: Booking[];
        pagination: PaginationInfo;
        stats: BookingStats;
        filters: Record<string, any>;
    };
}

interface GetBookingDetailsResponse {
    success: boolean;
    data: {
        booking: Booking;
        stripeDetails: StripeDetails | null;
        relatedBookings: Partial<Booking>[];
        timeline: TimelineEvent[];
        feeBreakdown: FeeBreakdown;
    };
}

interface BookingStatisticsResponse {
    success: boolean;
    data: {
        overview: {
            totalBookings: number;
            totalRevenue: number;
            totalPlatformFees: number;
            totalTaskerPayouts: number;
            avgBookingValue: number;
            completedBookings: number;
            cancelledBookings: number;
            pendingBookings: number;
            confirmedBookings: number;
            completionRate: number;
            cancellationRate: number;
        };
        statusBreakdown: Array<{
            _id: string;
            count: number;
            revenue: number;
        }>;
        paymentStatusBreakdown: Array<{
            _id: string;
            count: number;
            amount: number;
        }>;
        timeSeries: Array<{
            _id: string;
            bookings: number;
            revenue: number;
            platformFees: number;
        }>;
        topTaskers: Array<{
            _id: string;
            bookings: number;
            revenue: number;
            earnings: number;
            name: string;
            email: string;
            rating?: number;
        }>;
        topClients: Array<{
            _id: string;
            bookings: number;
            totalSpent: number;
            name: string;
            email: string;
        }>;
        popularServices: Array<{
            _id: string;
            bookings: number;
            revenue: number;
            avgRate: number;
        }>;
        dateRange: {
            startDate?: string;
            endDate?: string;
            groupBy: string;
        };
    };
}

interface MutationResponse {
    success: boolean;
    message: string;
    data?: any;
}

interface CancelBookingResponse extends MutationResponse {
    data: {
        booking: Booking;
        refund?: {
            type: string;
            refundId?: string;
            amount?: number;
            status?: string;
            message?: string;
        };
    };
}

interface PaymentActionResponse extends MutationResponse {
    data: {
        booking: Booking;
        paymentIntent?: {
            id: string;
            status: string;
            amountCaptured?: number;
        };
        refund?: {
            id: string;
            amount: number;
            status: string;
            type: string;
        };
    };
}

interface ReassignTaskerResponse extends MutationResponse {
    data: {
        booking: Booking;
        oldTasker: { id: string; name: string };
        newTasker: { id: string; name: string };
    };
}

interface BulkActionResponse {
    success: boolean;
    message: string;
    data: {
        requestedCount: number;
        affectedCount?: number;
        modifiedCount?: number;
        deletedCount?: number;
        hardDelete?: boolean;
    };
}

// ==================== QUERY PARAMS ====================

interface BookingQueryParams {
    page?: number;
    limit?: number;
    status?: string;
    paymentStatus?: string;
    taskerId?: string;
    clientId?: string;
    startDate?: string;
    endDate?: string;
    dateRange?: 'today' | 'week' | 'month' | 'year';
    minAmount?: number;
    maxAmount?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

interface StatisticsQueryParams {
    startDate?: string;
    endDate?: string;
    groupBy?: 'hour' | 'day' | 'week' | 'month';
}

interface ExportQueryParams {
    format?: 'json' | 'csv';
    status?: string;
    startDate?: string;
    endDate?: string;
}

// ==================== API DEFINITION ====================

export const adminBookingApi = createApi({
    reducerPath: "adminBookingApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `/api/admin/bookings`,
        credentials: "include",
        prepareHeaders: (headers) => {
            const token = Cookies.get("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["AdminBooking", "BookingStats", "BookingDetails"],

    endpoints: (builder) => ({
        // ==================== GET ENDPOINTS ====================

        // Get all bookings with filters and pagination
        getAdminBookings: builder.query<GetAllBookingsResponse, BookingQueryParams>({
            query: (params = {}) => {
                const queryParams = new URLSearchParams();
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== '' && value !== null) {
                        queryParams.append(key, String(value));
                    }
                });
                return `?${queryParams.toString()}`;
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.bookings.map(({ _id }) => ({
                            type: "AdminBooking" as const,
                            id: _id,
                        })),
                        { type: "AdminBooking", id: "LIST" },
                    ]
                    : [{ type: "AdminBooking", id: "LIST" }],
        }),

        // Get single booking details
        getAdminBookingById: builder.query<GetBookingDetailsResponse, string>({
            query: (bookingId) => `/${bookingId}`,
            providesTags: (result, error, bookingId) => [
                { type: "BookingDetails", id: bookingId },
            ],
        }),

        // Get booking statistics
        getBookingStatistics: builder.query<BookingStatisticsResponse, StatisticsQueryParams | void>({
            query: (params) => {
                if (params) {
                    const queryParams = new URLSearchParams();
                    Object.entries(params).forEach(([key, value]) => {
                        if (value) queryParams.append(key, value);
                    });
                    return `/statistics?${queryParams.toString()}`;
                }
                return "/statistics";
            },
            providesTags: ["BookingStats"],
        }),

        // Export bookings
        exportBookings: builder.query<any, ExportQueryParams>({
            query: (params = {}) => {
                const queryParams = new URLSearchParams();
                Object.entries(params).forEach(([key, value]) => {
                    if (value) queryParams.append(key, String(value));
                });
                return `/export?${queryParams.toString()}`;
            },
        }),

        // ==================== UPDATE ENDPOINTS ====================

        // Update booking
        updateAdminBooking: builder.mutation<
            MutationResponse & { data: { booking: Booking; changes: any[] } },
            { bookingId: string; updateData: Partial<Booking> }
        >({
            query: ({ bookingId, updateData }) => ({
                url: `/${bookingId}`,
                method: "PUT",
                body: updateData,
            }),
            invalidatesTags: (result, error, { bookingId }) => [
                { type: "AdminBooking", id: bookingId },
                { type: "BookingDetails", id: bookingId },
                { type: "AdminBooking", id: "LIST" },
                "BookingStats",
            ],
        }),

        // Update booking status
        updateBookingStatus: builder.mutation<
            MutationResponse & { data: { booking: Booking; oldStatus: string; newStatus: string } },
            { bookingId: string; status: string; reason?: string; notifyUsers?: boolean }
        >({
            query: ({ bookingId, ...body }) => ({
                url: `/${bookingId}/status`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (result, error, { bookingId }) => [
                { type: "AdminBooking", id: bookingId },
                { type: "BookingDetails", id: bookingId },
                { type: "AdminBooking", id: "LIST" },
                "BookingStats",
            ],
        }),

        // Bulk update status
        bulkUpdateStatus: builder.mutation<
            BulkActionResponse,
            { bookingIds: string[]; status: string; reason?: string; notifyUsers?: boolean }
        >({
            query: (body) => ({
                url: "/bulk/status",
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["AdminBooking", "BookingStats"],
        }),

        // ==================== ACTION ENDPOINTS ====================

        // Cancel booking
        cancelBooking: builder.mutation<
            CancelBookingResponse,
            {
                bookingId: string;
                reason?: string;
                refundType?: 'full' | 'partial' | 'none';
                customRefundAmount?: number;
                notifyUsers?: boolean;
            }
        >({
            query: ({ bookingId, ...body }) => ({
                url: `/${bookingId}/cancel`,
                method: "POST",
                body,
            }),
            invalidatesTags: (result, error, { bookingId }) => [
                { type: "AdminBooking", id: bookingId },
                { type: "BookingDetails", id: bookingId },
                { type: "AdminBooking", id: "LIST" },
                "BookingStats",
            ],
        }),

        // Capture payment
        capturePayment: builder.mutation<
            PaymentActionResponse,
            { bookingId: string; amount?: number }
        >({
            query: ({ bookingId, ...body }) => ({
                url: `/${bookingId}/capture`,
                method: "POST",
                body,
            }),
            invalidatesTags: (result, error, { bookingId }) => [
                { type: "AdminBooking", id: bookingId },
                { type: "BookingDetails", id: bookingId },
                "BookingStats",
            ],
        }),

        // Refund payment
        refundPayment: builder.mutation<
            PaymentActionResponse,
            {
                bookingId: string;
                amount?: number;
                reason?: string;
                refundType?: 'full' | 'partial';
            }
        >({
            query: ({ bookingId, ...body }) => ({
                url: `/${bookingId}/refund`,
                method: "POST",
                body,
            }),
            invalidatesTags: (result, error, { bookingId }) => [
                { type: "AdminBooking", id: bookingId },
                { type: "BookingDetails", id: bookingId },
                "BookingStats",
            ],
        }),

        // Force complete booking
        forceCompleteBooking: builder.mutation<
            MutationResponse & { data: { booking: Booking; captureResult?: any } },
            { bookingId: string; capturePayment?: boolean; reason?: string }
        >({
            query: ({ bookingId, ...body }) => ({
                url: `/${bookingId}/complete`,
                method: "POST",
                body,
            }),
            invalidatesTags: (result, error, { bookingId }) => [
                { type: "AdminBooking", id: bookingId },
                { type: "BookingDetails", id: bookingId },
                { type: "AdminBooking", id: "LIST" },
                "BookingStats",
            ],
        }),

        // Reassign tasker
        reassignTasker: builder.mutation<
            ReassignTaskerResponse,
            { bookingId: string; newTaskerId: string; reason?: string; notifyUsers?: boolean }
        >({
            query: ({ bookingId, ...body }) => ({
                url: `/${bookingId}/reassign`,
                method: "POST",
                body,
            }),
            invalidatesTags: (result, error, { bookingId }) => [
                { type: "AdminBooking", id: bookingId },
                { type: "BookingDetails", id: bookingId },
            ],
        }),

        // Add admin note
        addAdminNote: builder.mutation<
            MutationResponse & { data: { bookingId: string; note: AdminNote } },
            { bookingId: string; note: string; isPrivate?: boolean }
        >({
            query: ({ bookingId, ...body }) => ({
                url: `/${bookingId}/note`,
                method: "POST",
                body,
            }),
            invalidatesTags: (result, error, { bookingId }) => [
                { type: "BookingDetails", id: bookingId },
            ],
        }),

        // ==================== DELETE ENDPOINTS ====================

        // Delete booking (soft delete by default)
        deleteBooking: builder.mutation<
            MutationResponse & { data: { bookingId: string; hardDelete: boolean } },
            { bookingId: string; hardDelete?: boolean; reason?: string }
        >({
            query: ({ bookingId, ...body }) => ({
                url: `/${bookingId}`,
                method: "DELETE",
                body,
            }),
            invalidatesTags: ["AdminBooking", "BookingStats"],
        }),

        // Bulk delete bookings
        bulkDeleteBookings: builder.mutation<
            BulkActionResponse,
            { bookingIds: string[]; hardDelete?: boolean; reason?: string }
        >({
            query: (body) => ({
                url: "/bulk/delete",
                method: "DELETE",
                body,
            }),
            invalidatesTags: ["AdminBooking", "BookingStats"],
        }),
    }),
});

// ==================== EXPORT HOOKS ====================

export const {
    // Queries
    useGetAdminBookingsQuery,
    useGetAdminBookingByIdQuery,
    useGetBookingStatisticsQuery,
    useLazyExportBookingsQuery,

    // Mutations - Update
    useUpdateAdminBookingMutation,
    useUpdateBookingStatusMutation,
    useBulkUpdateStatusMutation,

    // Mutations - Actions
    useCancelBookingMutation,
    useCapturePaymentMutation,
    useRefundPaymentMutation,
    useForceCompleteBookingMutation,
    useReassignTaskerMutation,
    useAddAdminNoteMutation,

    // Mutations - Delete
    useDeleteBookingMutation,
    useBulkDeleteBookingsMutation,
} = adminBookingApi;