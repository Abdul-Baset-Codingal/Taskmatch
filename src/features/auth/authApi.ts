import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://taskmatch-backend-hiza.onrender.com/api/auth",
        credentials: "include", // ✅ This is correct
        prepareHeaders: (headers) => {
            // Ensure proper headers for CORS
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    endpoints: (builder) => ({
        signup: builder.mutation({
            query: (userData) => ({
                url: "/signup",
                method: "POST",
                body: userData,
            }),
        }),

        login: builder.mutation({
            query: (userData) => ({
                url: "/login",
                method: "POST",
                body: userData,
            }),
        }),
    }),
});

export const { useSignupMutation, useLoginMutation } = authApi;
