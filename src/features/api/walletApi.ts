// features/api/walletApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from 'js-cookie';

interface WalletBalance {
    balance: number;
    availableBalance: number;
    pendingWithdrawal: number;
    totalEarned: number;
    totalWithdrawn: number;
    lastUpdated: string;
}

interface WithdrawalRequest {
    _id: string;
    tasker: any;
    amount: number;
    status: "pending" | "approved" | "rejected" | "completed" | "cancelled";
    requestedAt: string;
    note?: string;
    processedAt?: string;
    adminNote?: string;
    paymentMethod?: string;
    paymentReference?: string;
    bankAccountSnapshot: {
        accountHolderName: string;
        bankName: string;
        last4: string;
        accountType: string;
    };
}

interface Transaction {
    _id: string;
    type: string;
    amount: number;
    balanceAfter: number;
    description: string;
    createdAt: string;
    taskId?: any;
    bookingId?: any;
}

export const walletApi = createApi({
    reducerPath: "walletApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `/api`,
        credentials: "include", // keep if you want to send cookies too
        prepareHeaders: (headers) => {
            const token = Cookies.get("token"); // get your JWT token from cookies (or change source if needed)
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Wallet", "Withdrawals", "Transactions"],
    endpoints: (builder) => ({
        // Get wallet balance
        getWalletBalance: builder.query<{
            wallet: WalletBalance;
            pendingWithdrawals: WithdrawalRequest[];
            hasBankAccount: boolean;
            bankAccountLast4?: string;
        }, void>({
            query: () => "/wallet/balance",
            providesTags: ["Wallet"],
        }),

        // Get transactions
        getWalletTransactions: builder.query<{
            transactions: Transaction[];
            pagination: any;
        }, { page?: number; limit?: number; type?: string }>({
            query: ({ page = 1, limit = 20, type }) =>
                `/wallet/transactions?page=${page}&limit=${limit}${type ? `&type=${type}` : ''}`,
            providesTags: ["Transactions"],
        }),

        // Get earnings breakdown
        getEarningsBreakdown: builder.query<any, { period?: string }>({
            query: ({ period = 'all' }) => `/wallet/earnings?period=${period}`,
        }),

        // Create withdrawal request
        createWithdrawal: builder.mutation<any, { amount: number; note?: string }>({
            query: (body) => ({
                url: "/wallet/withdraw",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Wallet", "Withdrawals"],
        }),

        // Get my withdrawal requests
        getMyWithdrawals: builder.query<{
            withdrawals: WithdrawalRequest[];
            pagination: any;
        }, { status?: string; page?: number }>({
            query: ({ status, page = 1 }) =>
                `/wallet/withdrawals?page=${page}${status ? `&status=${status}` : ''}`,
            providesTags: ["Withdrawals"],
        }),

        // Cancel withdrawal
        cancelWithdrawal: builder.mutation<any, string>({
            query: (id) => ({
                url: `/wallet/withdraw/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Wallet", "Withdrawals"],
        }),

        // ==================== ADMIN ====================

        // Get all withdrawal requests (admin)
        getAllWithdrawals: builder.query<{
            withdrawals: WithdrawalRequest[];
            stats: any;
            pagination: any;
        }, { status?: string; page?: number }>({
            query: ({ status, page = 1 }) =>
                `/wallet/admin/withdrawals?page=${page}${status ? `&status=${status}` : ''}`,
            providesTags: ["Withdrawals"],
        }),

        // Approve withdrawal (admin)
        approveWithdrawal: builder.mutation<any, {
            id: string;
            paymentMethod?: string;
            paymentReference?: string;
            adminNote?: string;
        }>({
            query: ({ id, ...body }) => ({
                url: `/wallet/admin/withdrawals/${id}/approve`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Withdrawals"],
        }),

        // Reject withdrawal (admin)
        rejectWithdrawal: builder.mutation<any, { id: string; adminNote: string }>({
            query: ({ id, adminNote }) => ({
                url: `/wallet/admin/withdrawals/${id}/reject`,
                method: "PUT",
                body: { adminNote },
            }),
            invalidatesTags: ["Withdrawals"],
        }),
    }),
});

export const {
    useGetWalletBalanceQuery,
    useGetWalletTransactionsQuery,
    useGetEarningsBreakdownQuery,
    useCreateWithdrawalMutation,
    useGetMyWithdrawalsQuery,
    useCancelWithdrawalMutation,
    useGetAllWithdrawalsQuery,
    useApproveWithdrawalMutation,
    useRejectWithdrawalMutation,
} = walletApi;