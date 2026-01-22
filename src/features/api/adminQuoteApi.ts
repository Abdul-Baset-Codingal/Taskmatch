// src/features/api/adminQuoteApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export interface Quote {
    _id: string;
    taskTitle: string;
    taskDescription: string;
    status: string;
    client: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    tasker: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    bids: any[];
    payment?: {
        status: string;
        totalClientPays: number;
        taskerPayout: number;
        applicationFee: number;
    };
    createdAt: string;
    acceptedAt?: string;
    completedAt?: string;
}

export interface QuotesResponse {
    success: boolean;
    quotes: Quote[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalCount: number;
        limit: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export interface QuoteStatistics {
    success: boolean;
    statistics: {
        overview: {
            totalQuotes: number;
            statusBreakdown: Record<string, number>;
            paymentStatusBreakdown: Record<string, number>;
        };
        conversions: {
            acceptanceRate: string;
            completionRate: string;
            cancellationRate: string;
        };
        revenue: {
            totalBidAmount: number;
            totalClientPaid: number;
            totalTaskerPayout: number;
            totalPlatformFee: number;
            transactionCount: number;
        };
        heldPayments: {
            totalHeldAmount: number;
            count: number;
        };
        quotesPerDay: Array<{
            _id: string;
            count: number;
            totalBidAmount: number;
        }>;
        topTaskers: any[];
        topClients: any[];
    };
}

export const adminQuoteApi = createApi({
    reducerPath: 'adminQuoteApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/admin/quotes',
        credentials: 'include',
        prepareHeaders: (headers) => {
            const token = Cookies.get('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['AdminQuote', 'QuoteStats'],
    endpoints: (builder) => ({
        // Get all quotes with filters
        getAllAdminQuotes: builder.query<QuotesResponse, {
            page?: number;
            limit?: number;
            status?: string;
            search?: string;
            sortBy?: string;
            sortOrder?: string;
            startDate?: string;
            endDate?: string;
            paymentStatus?: string;
        }>({
            query: (params) => {
                const searchParams = new URLSearchParams();
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== '') {
                        searchParams.append(key, String(value));
                    }
                });
                return `/?${searchParams.toString()}`;
            },
            providesTags: ['AdminQuote'],
        }),

        // Get quote statistics
        getQuoteStatistics: builder.query<QuoteStatistics, {
            startDate?: string;
            endDate?: string;
        }>({
            query: (params) => {
                const searchParams = new URLSearchParams();
                if (params.startDate) searchParams.append('startDate', params.startDate);
                if (params.endDate) searchParams.append('endDate', params.endDate);
                return `/statistics?${searchParams.toString()}`;
            },
            providesTags: ['QuoteStats'],
        }),

        // Get single quote
        getAdminQuoteById: builder.query<{
            success: boolean;
            quote: Quote;
            stripePaymentDetails: any;
            timeline: any[];
        }, string>({
            query: (quoteId) => `/${quoteId}`,
            providesTags: (result, error, quoteId) => [{ type: 'AdminQuote', id: quoteId }],
        }),

        // Get revenue report
        getRevenueReport: builder.query<any, {
            startDate?: string;
            endDate?: string;
            groupBy?: string;
        }>({
            query: (params) => {
                const searchParams = new URLSearchParams();
                Object.entries(params).forEach(([key, value]) => {
                    if (value) searchParams.append(key, value);
                });
                return `/revenue?${searchParams.toString()}`;
            },
        }),

        // Get disputes
        getQuoteDisputes: builder.query<any, { page?: number; limit?: number }>({
            query: (params) => `/disputes?page=${params.page || 1}&limit=${params.limit || 20}`,
            providesTags: ['AdminQuote'],
        }),

        // Update quote status
        updateQuoteStatus: builder.mutation<any, {
            quoteId: string;
            status: string;
            reason?: string;
        }>({
            query: ({ quoteId, ...body }) => ({
                url: `/${quoteId}/status`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['AdminQuote', 'QuoteStats'],
        }),

        // Cancel quote
        cancelQuote: builder.mutation<any, {
            quoteId: string;
            reason?: string;
            refundPercentage?: number;
        }>({
            query: ({ quoteId, ...body }) => ({
                url: `/${quoteId}/cancel`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['AdminQuote', 'QuoteStats'],
        }),

        // Capture payment
        capturePayment: builder.mutation<any, {
            quoteId: string;
            reason?: string;
        }>({
            query: ({ quoteId, ...body }) => ({
                url: `/${quoteId}/capture`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['AdminQuote', 'QuoteStats'],
        }),

        // Refund payment
        refundPayment: builder.mutation<any, {
            quoteId: string;
            reason?: string;
            refundPercentage?: number;
            refundAmount?: number;
        }>({
            query: ({ quoteId, ...body }) => ({
                url: `/${quoteId}/refund`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['AdminQuote', 'QuoteStats'],
        }),

        // Bulk update
        bulkUpdateQuotes: builder.mutation<any, {
            quoteIds: string[];
            action: 'cancel' | 'expire' | 'mark_completed';
            reason?: string;
        }>({
            query: (body) => ({
                url: '/bulk',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['AdminQuote', 'QuoteStats'],
        }),

        // Export quotes
        exportQuotes: builder.query<any, {
            format?: string;
            startDate?: string;
            endDate?: string;
            status?: string;
        }>({
            query: (params) => {
                const searchParams = new URLSearchParams();
                Object.entries(params).forEach(([key, value]) => {
                    if (value) searchParams.append(key, value);
                });
                return `/export?${searchParams.toString()}`;
            },
        }),

        // Get admin history
        getQuoteAdminHistory: builder.query<any, string>({
            query: (quoteId) => `/${quoteId}/history`,
        }),
    }),
});

export const {
    useGetAllAdminQuotesQuery,
    useLazyGetAllAdminQuotesQuery,
    useGetQuoteStatisticsQuery,
    useGetAdminQuoteByIdQuery,
    useLazyGetAdminQuoteByIdQuery,
    useGetRevenueReportQuery,
    useGetQuoteDisputesQuery,
    useUpdateQuoteStatusMutation,
    useCancelQuoteMutation,
    useCapturePaymentMutation,
    useRefundPaymentMutation,
    useBulkUpdateQuotesMutation,
    useLazyExportQuotesQuery,
    useGetQuoteAdminHistoryQuery,
} = adminQuoteApi;