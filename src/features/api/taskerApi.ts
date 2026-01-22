


/* eslint-disable @typescript-eslint/no-explicit-any */
// src/features/api/taskerApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const taskerApi = createApi({
    reducerPath: 'taskerApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `/api/taskerBookings`,
        credentials: 'include',
        prepareHeaders: (headers) => {
            const token = Cookies.get('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Booking', 'RequestQuote'],
    endpoints: (builder) => ({
        // Create Booking
        createBooking: builder.mutation({
            query: (bookingData) => ({
                url: '/bookings',
                method: 'POST',
                body: bookingData,
            }),
            invalidatesTags: ['Booking'],
        }),

        // Get All Bookings
        getAllBookings: builder.query({
            query: () => '/bookings',
            providesTags: ['Booking'],
        }),

        // Get Booking By ID
        getUserBookings: builder.query({
            query: (userId) => `/bookings/user/${userId}`,
            providesTags: (result, error, userId) => [{ type: 'Booking', id: userId }],
        }),

        // Get Quotes by Tasker ID
        getQuotesByTaskerId: builder.query({
            query: (taskerId) => ({
                url: `/quotes/tasker/${taskerId}`,
                method: 'GET',
            }),
            providesTags: (result) =>
                result?.quotes && Array.isArray(result.quotes)
                    ? [
                        ...result.quotes.map((quote: { _id: any }) => ({ type: 'RequestQuote', id: quote._id })),
                        { type: 'RequestQuote', id: 'LIST' },
                    ]
                    : [{ type: 'RequestQuote', id: 'LIST' }],
        }),

        // Update Task Status
        updateTaskStatus: builder.mutation({
            query: ({ taskId, status }) => ({
                url: `/${taskId}/status`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: ['RequestQuote'],
        }),

        // Add Review
        addReview: builder.mutation({
            query: ({ bookingId, rating, message }) => ({
                url: '/reviews',
                method: 'POST',
                body: { bookingId, rating, message },
            }),
        }),

        // Update Booking
        updateBooking: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/bookings/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Booking', id }],
        }),

        // Delete Booking
        deleteBooking: builder.mutation({
            query: (id) => ({
                url: `/bookings/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Booking'],
        }),

        // Create Request Quote
        createRequestQuote: builder.mutation({
            query: (quoteData) => ({
                url: '/request-quotes',
                method: 'POST',
                body: quoteData,
            }),
            invalidatesTags: ['RequestQuote'],
        }),

        // Get All Request Quotes
        getAllRequestQuotes: builder.query({
            query: () => '/request-quotes',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map((quote: { _id: any }) => ({ type: 'RequestQuote', id: quote._id })),
                        { type: 'RequestQuote', id: 'LIST' },
                    ]
                    : [{ type: 'RequestQuote', id: 'LIST' }],
        }),

        // Get Request Quotes By Client ID
        getRequestQuotesByClientId: builder.query({
            query: (clientId) => `/request-quotes/client/${clientId}`,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map((quote: { _id: any }) => ({ type: 'RequestQuote', id: quote._id })),
                        { type: 'RequestQuote', id: 'LIST' },
                    ]
                    : [{ type: 'RequestQuote', id: 'LIST' }],
        }),

        // Update Request Quote
        updateRequestQuote: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/request-quotes/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'RequestQuote', id }],
        }),

        // Delete Request Quote
        deleteRequestQuote: builder.mutation({
            query: (id) => ({
                url: `/request-quotes/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['RequestQuote'],
        }),

        // Submit Bid
        // In your taskerApi.ts
        submitBid: builder.mutation({
            query: ({ quoteId, bidAmount, bidDescription, estimatedDuration }) => {
                console.log('📤 Sending bid request:', { quoteId, bidAmount, bidDescription, estimatedDuration });

                return {
                    url: `/request-quotes/${quoteId}/bid`,
                    method: 'POST',
                    body: {
                        bidAmount: Number(bidAmount),
                        bidDescription: bidDescription || '',
                        estimatedDuration: Number(estimatedDuration) || 1,
                    },
                };
            },
            invalidatesTags: ['RequestQuote'],
        }),
        // Accept Bid
        acceptBid: builder.mutation({
            query: ({ quoteId, bidId, paymentMethodId }) => ({
                url: `/request-quotes/${quoteId}/accept-bid/${bidId}`,
                method: 'POST',
                body: { paymentMethodId: paymentMethodId || undefined },
            }),
            invalidatesTags: ['RequestQuote'],
        }),

        // Reject Bid
        rejectBid: builder.mutation({
            query: ({ quoteId, bidId }) => ({
                url: `/request-quotes/${quoteId}/reject-bid/${bidId}`,
                method: 'POST',
            }),
            invalidatesTags: ['RequestQuote'],
        }),
    }),
});

export const {
    useCreateBookingMutation,
    useGetAllBookingsQuery,
    useGetUserBookingsQuery,
    useUpdateBookingMutation,
    useAddReviewMutation,
    useDeleteBookingMutation,
    useCreateRequestQuoteMutation,
    useGetQuotesByTaskerIdQuery,
    useUpdateTaskStatusMutation,
    useGetAllRequestQuotesQuery,
    useGetRequestQuotesByClientIdQuery,
    useLazyGetRequestQuotesByClientIdQuery, // Added lazy query hook
    useUpdateRequestQuoteMutation,
    useDeleteRequestQuoteMutation,
    useSubmitBidMutation,
    useAcceptBidMutation,
    useRejectBidMutation,
} = taskerApi;