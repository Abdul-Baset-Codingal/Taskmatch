import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const servicesApi = createApi({
    reducerPath: 'servicesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `/api`,
    }),
    tagTypes: ['Services'],
    endpoints: (builder) => ({
        getServices: builder.query({
            query: () => 'services',
            providesTags: ['Services'],
        }),
        getServiceById: builder.query({
            query: (id) => `services/${id}`,  // here id is MongoDB _id string
            providesTags: (result, error, id) => [{ type: 'Services', id }],
        }),
        createService: builder.mutation({
            query: (newService) => ({
                url: 'services',
                method: 'POST',
                body: newService,
            }),
            invalidatesTags: ['Services'],
        }),
        updateService: builder.mutation({
            query: (updatedService) => ({
                url: `services/${updatedService.id}`,
                method: 'PUT',
                body: updatedService,
            }),
            invalidatesTags: ['Services'],
        }),
        deleteService: builder.mutation({
            query: (id) => ({
                url: `services/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Services'],
        }),
    }),
});

export const {
    useGetServicesQuery,
    useGetServiceByIdQuery,  // export the new hook here
    useCreateServiceMutation,
    useUpdateServiceMutation,
    useDeleteServiceMutation,
} = servicesApi;
