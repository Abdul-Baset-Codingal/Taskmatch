import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://taskmatch-backend-hiza.onrender.com/auth",
        credentials: "include", // if using cookies
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
