// features/api/adminPaymentApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from 'js-cookie';

interface Transaction {
    id: string;
    type: string;
    title: string;
    date: string;
    status: string;
    paymentStatus: string;
    paymentIntentId: string;
    client: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    tasker?: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    totalAmount: number;
    netPayout: number;
    platformRevenue: number;
    currency: string;
}

interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalCount: number;
        limit: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
    stats?: {
        totalVolume: number;
        totalRevenue: number;
    };
}

interface Refund {
    id: string;
    amount: number;
    currency: string;
    status: string;
    reason: string;
    created: string;
    paymentIntentId: string;
    metadata?: Record<string, string>;
}

interface TaskerPayout {
    taskerId: string;
    taskerName: string;
    email: string;
    stripeAccountId?: string;
    totalEarned: number;
    jobsCount: number;
    lastJobDate?: string;
}

interface TaskerPayoutDetails {
    tasker: {
        id: string;
        name: string;
        email: string;
        stripeAccountId?: string;
        stripeStatus?: string;
    };
    earnings: {
        tasks: { total: number; count: number };
        bookings: { total: number; count: number };
        quotes: { total: number; count: number };
        totalEarnings: string;
    };
    stripeBalance?: {
        available: Array<{ amount: number; currency: string }>;
        pending: Array<{ amount: number; currency: string }>;
    };
}

interface PlatformConfig {
    _id: string;
    key: string;
    clientPlatformFeePercent: number;
    reservationFeeCents: number;
    clientTaxPercent: number;
    taskerPlatformFeePercent: number;
    taskerTaxPercent: number;
    lastUpdatedBy?: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
}

interface FeeSimulation {
    bidAmount: number;
    clientSide: {
        platformFee: number;
        reservationFee: number;
        tax: number;
        total: number;
    };
    taskerSide: {
        platformFee: number;
        tax: number;
        payout: number;
    };
    platform: {
        totalRevenue: number;
    };
}

interface Dispute {
    id: string;
    amount: number;
    currency: string;
    reason: string;
    status: string;
    created: string;
    deadline?: string;
    transaction?: {
        type: string;
        id: string;
        title: string;
    };
}

interface DisputeDetails {
    dispute: {
        id: string;
        amount: number;
        currency: string;
        reason: string;
        status: string;
        created: string;
        evidenceDueBy?: string;
        isChargeRefundable: boolean;
        hasEvidence: boolean;
        submissionCount: number;
    };
    relatedTransaction?: {
        type: string;
        data: any;
    };
}

interface DisputeStats {
    needsResponse: {
        count: number;
        totalAmount: number;
    };
    won: {
        count: number;
        totalAmount: number;
    };
    lost: {
        count: number;
        totalAmount: number;
    };
    winRate: string;
}

export const adminDashboardPaymentApi = createApi({
    reducerPath: "adminPaymentApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/admin/dashboardPayments",
        credentials: "include",
        prepareHeaders: (headers) => {
            const token = Cookies.get("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Transactions", "Refunds", "Payouts", "PlatformConfig", "Disputes"],

    endpoints: (builder) => ({
        // Transactions & Ledger
        getAdminTransactions: builder.query<PaginatedResponse<Transaction> & { stats: { totalVolume: number; totalRevenue: number } }, {
            page?: number;
            limit?: number;
            type?: string;
            status?: string;
            search?: string;
            startDate?: string;
            endDate?: string;
        }>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined) {
                        queryParams.append(key, String(value));
                    }
                });
                return `/transactions?${queryParams.toString()}`;
            },
            providesTags: ["Transactions"],
        }),

        exportTransactions: builder.query<string, {
            format: string;
            type?: string;
            status?: string;
            search?: string;
            startDate?: string;
            endDate?: string;
        }>({
            query: (params) => ({
                url: '/transactions/export',
                params,
                // ✅ KEY FIX: Tell RTK Query to return raw text, not parse as JSON
                responseHandler: 'text',
            }),
        }),

        // Refunds & Adjustments
        getRefundHistory: builder.query<PaginatedResponse<Refund>, {
            page?: number;
            limit?: number;
            status?: string;
            startDate?: string;
            endDate?: string;
        }>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined) {
                        queryParams.append(key, String(value));
                    }
                });
                return `/refunds?${queryParams.toString()}`;
            },
            providesTags: ["Refunds"],
        }),

        processRefund: builder.mutation<{ success: boolean; message: string }, {
            transactionId: string;
            type: string;
            amount: number;
            reason: string;
        }>({
            query: (body) => ({
                url: '/refund',
                method: 'POST',
                body,
            }),
            invalidatesTags: ["Transactions", "Refunds"],
        }),

        createAdjustment: builder.mutation<{ success: boolean; message: string }, {
            userId: string;
            type: string;
            amount: number;
            reason: string;
            direction: 'credit' | 'debit';
        }>({
            query: (body) => ({
                url: '/adjustment',
                method: 'POST',
                body,
            }),
            invalidatesTags: ["Transactions"],
        }),

        // Payouts
        getTaskerPayouts: builder.query<PaginatedResponse<TaskerPayout>, {
            page?: number;
            limit?: number;
            search?: string;
        }>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined) {
                        queryParams.append(key, String(value));
                    }
                });
                return `/payouts?${queryParams.toString()}`;
            },
            providesTags: ["Payouts"],
        }),

        getTaskerPayoutDetails: builder.query<TaskerPayoutDetails, string>({
            query: (taskerId) => `/payouts/${taskerId}`,
            providesTags: (result, error, taskerId) => [{ type: "Payouts", id: taskerId }],
        }),

        initiateManualPayout: builder.mutation<{ success: boolean; message: string }, {
            taskerId: string;
            amount: number;
            reason: string;
        }>({
            query: (body) => ({
                url: '/payouts/manual',
                method: 'POST',
                body,
            }),
            invalidatesTags: ["Payouts"],
        }),

        // Platform Fees
        getPlatformConfig: builder.query<{ success: boolean; config: PlatformConfig }, void>({
            query: () => '/config',
            providesTags: ["PlatformConfig"],
        }),

        updatePlatformConfig: builder.mutation<{ success: boolean; message: string; config: PlatformConfig }, {
            clientPlatformFeePercent: number;
            reservationFeeCents: number;
            taskerPlatformFeePercent: number;
            clientTaxPercent: number;
            taskerTaxPercent: number;
        }>({
            query: (body) => ({
                url: '/config',
                method: 'PUT',
                body,
            }),
            invalidatesTags: ["PlatformConfig"],
        }),

        simulateFees: builder.mutation<{ success: boolean; simulation: FeeSimulation }, {
            bidAmount: number;
            clientPlatformFeePercent?: number;
            reservationFeeCents?: number;
            clientTaxPercent?: number;
            taskerPlatformFeePercent?: number;
            taskerTaxPercent?: number;
        }>({
            query: (body) => ({
                url: '/config/simulate',
                method: 'POST',
                body,
            }),
        }),

        // Disputes
        getDisputes: builder.query<PaginatedResponse<Dispute> & { stats: DisputeStats }, {
            page?: number;
            limit?: number;
            status?: string;
        }>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined) {
                        queryParams.append(key, String(value));
                    }
                });
                return `/disputes?${queryParams.toString()}`;
            },
            providesTags: ["Disputes"],
        }),

        getDisputeDetails: builder.query<DisputeDetails, string>({
            query: (disputeId) => `/disputes/${disputeId}`,
            providesTags: (result, error, disputeId) => [{ type: "Disputes", id: disputeId }],
        }),

        submitDisputeEvidence: builder.mutation<{ success: boolean; message: string }, {
            disputeId: string;
            customerName?: string;
            customerEmail?: string;
            productDescription?: string;
            customerCommunication?: string;
            additionalNotes?: string;
            submit?: boolean;
        }>({
            query: ({ disputeId, ...body }) => ({
                url: `/disputes/${disputeId}/evidence`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ["Disputes"],
        }),
    }),
});

export const {
    useGetAdminTransactionsQuery,
    useLazyExportTransactionsQuery,
    useGetRefundHistoryQuery,
    useProcessRefundMutation,
    useCreateAdjustmentMutation,
    useGetTaskerPayoutsQuery,
    useGetTaskerPayoutDetailsQuery,
    useInitiateManualPayoutMutation,
    useGetPlatformConfigQuery,
    useUpdatePlatformConfigMutation,
    useSimulateFeesMutation,
    useGetDisputesQuery,
    useGetDisputeDetailsQuery,
    useSubmitDisputeEvidenceMutation,
} = adminDashboardPaymentApi;