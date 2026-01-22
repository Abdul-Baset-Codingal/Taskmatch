// features/booking/bookingApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const bookingApi = createApi({
    reducerPath: 'bookingApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `/api`,
        prepareHeaders: (headers) => {
            const token = Cookies.get('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Booking'],
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
        getBookingById: builder.query({
            query: (id) => `/bookings/${id}`,
            providesTags: (result, error, id) => [{ type: 'Booking', id }],
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
    }),
});

export const {
    useCreateBookingMutation,
    useGetAllBookingsQuery,
    useGetBookingByIdQuery,
    useUpdateBookingMutation,
    useDeleteBookingMutation,
} = bookingApi;
