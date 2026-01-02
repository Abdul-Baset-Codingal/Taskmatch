// features/stripe/stripeApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const stripeApi = createApi({
    reducerPath: 'stripeApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `/api`,
        credentials: 'include',
        prepareHeaders: (headers) => {
            const token = Cookies.get('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['StripeConnect'],
    endpoints: (builder) => ({
        // Start Stripe Connect onboarding
        startStripeOnboarding: builder.mutation<{ success: boolean; url: string }, void>({
            query: () => ({
                url: '/stripe/connect/onboard',
                method: 'POST',
            }),
            invalidatesTags: ['StripeConnect'],
        }),

        // Check Stripe Connect status
        getStripeConnectStatus: builder.query<{
            success: boolean;
            status: string;
            canReceivePayments: boolean;
            chargesEnabled?: boolean;
            payoutsEnabled?: boolean;
            detailsSubmitted?: boolean;
        }, void>({
            query: () => '/stripe/connect/status',
            providesTags: ['StripeConnect'],
        }),

        // Get Stripe Dashboard link
        getStripeDashboard: builder.query<{ success: boolean; url: string }, void>({
            query: () => '/stripe/connect/dashboard',
        }),

        // Refresh onboarding link
        refreshStripeOnboarding: builder.mutation<{ success: boolean; url: string }, void>({
            query: () => ({
                url: '/stripe/connect/refresh-onboarding',
                method: 'POST',
            }),
        }),
    }),
});

export const {
    useStartStripeOnboardingMutation,
    useGetStripeConnectStatusQuery,
    useLazyGetStripeDashboardQuery,
    useRefreshStripeOnboardingMutation,
} = stripeApi;