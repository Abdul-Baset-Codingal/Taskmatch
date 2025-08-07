import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const taskerApi = createApi({
    reducerPath: 'taskerApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/taskerBookings`,
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
            providesTags: (result, error, userId) => [{ type: "Booking", id: userId }],
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
            providesTags: ['RequestQuote'],
        }),

        // Get Request Quote By ID
        getRequestQuotesByClientId: builder.query({
            query: (clientId) => `/request-quotes/client/${clientId}`,

            providesTags: (result) =>
                result
                    ? [
                        ...result.map((quote: { _id: string }) => ({ type: "RequestQuote" as const, id: quote._id })),
                        { type: "RequestQuote", id: "LIST" },
                    ]
                    : [{ type: "RequestQuote", id: "LIST" }],
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
    }),
});

export const {
    useCreateBookingMutation,
    useGetAllBookingsQuery,
    useGetUserBookingsQuery,
    useUpdateBookingMutation,
    useDeleteBookingMutation,
    useCreateRequestQuoteMutation,
    useGetAllRequestQuotesQuery,
    useLazyGetRequestQuotesByClientIdQuery,
    useUpdateRequestQuoteMutation,
    useDeleteRequestQuoteMutation,
} = taskerApi;