// features/api/blogApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

// Types
export interface BlogAuthor {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
}

export interface Blog {
    _id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featuredImage: {
        url: string;
        publicId: string;
        alt: string;
    } | null;
    author: BlogAuthor | null;
    category: BlogCategory;
    tags: string[];
    status: BlogStatus;
    publishedAt: string | null;
    views: number;
    likes: number;
    isFeatured: boolean;
    metaTitle: string;
    metaDescription: string;
    readTime: number;
    createdAt: string;
    updatedAt: string;
}

export type BlogStatus = "draft" | "published" | "archived";
export type BlogCategory =
    | "Tips & Tricks"
    | "How-To Guides"
    | "Industry News"
    | "Company Updates"
    | "Success Stories"
    | "Tasker Spotlight"
    | "Other";

export interface BlogsResponse {
    success: boolean;
    data: Blog[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalBlogs: number;
        hasMore: boolean;
    };
}

export interface SingleBlogResponse {
    success: boolean;
    data: Blog;
    relatedBlogs?: Blog[];
}

export interface BlogStatsResponse {
    success: boolean;
    data: {
        totalBlogs: number;
        totalViews: number;
        byStatus: Array<{ _id: BlogStatus; count: number }>;
        byCategory: Array<{ _id: BlogCategory; count: number }>;
        recentBlogs: Array<{
            _id: string;
            title: string;
            status: BlogStatus;
            views: number;
            createdAt: string;
        }>;
        topViewed: Array<{
            _id: string;
            title: string;
            views: number;
            slug: string;
        }>;
    };
}

export interface BlogCategoriesResponse {
    success: boolean;
    data: Array<{ _id: BlogCategory; count: number }>;
}

export interface BlogQueryParams {
    page?: number;
    limit?: number;
    status?: BlogStatus;
    category?: BlogCategory;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    isFeatured?: boolean;
}

export interface CreateBlogRequest {
    title: string;
    content: string;
    excerpt?: string;
    featuredImage?: {
        url: string;
        publicId?: string;
        alt?: string;
    };
    category: BlogCategory;
    tags?: string[];
    status?: BlogStatus;
    isFeatured?: boolean;
    metaTitle?: string;
    metaDescription?: string;
}

export interface UpdateBlogRequest extends Partial<CreateBlogRequest> {
    id: string;
}

export const blogApi = createApi({
    reducerPath: "blogApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/blogs",
        credentials: "include",
        prepareHeaders: (headers) => {
            const token = Cookies.get("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Blog", "BlogStats", "PublicBlog"],

    endpoints: (builder) => ({
        // ==========================================
        // ADMIN ENDPOINTS
        // ==========================================

        // Get all blogs (Admin)
        getBlogs: builder.query<BlogsResponse, BlogQueryParams>({
            query: (params = {}) => {
                const queryParams = new URLSearchParams();
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== "") {
                        queryParams.append(key, String(value));
                    }
                });
                return `?${queryParams.toString()}`;
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ _id }) => ({ type: "Blog" as const, id: _id })),
                        { type: "Blog", id: "LIST" },
                    ]
                    : [{ type: "Blog", id: "LIST" }],
        }),

        // Get single blog by ID (Admin)
        getBlogById: builder.query<SingleBlogResponse, string>({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: "Blog", id }],
        }),

        // Get blog stats (Admin Dashboard)
        getBlogStats: builder.query<BlogStatsResponse, void>({
            query: () => "/stats",
            providesTags: ["BlogStats"],
        }),

        // Create blog
        createBlog: builder.mutation<SingleBlogResponse, CreateBlogRequest>({
            query: (blogData) => ({
                url: "/",
                method: "POST",
                body: blogData,
            }),
            invalidatesTags: [{ type: "Blog", id: "LIST" }, "BlogStats"],
        }),

        // Update blog
        updateBlog: builder.mutation<SingleBlogResponse, UpdateBlogRequest>({
            query: ({ id, ...blogData }) => ({
                url: `/${id}`,
                method: "PUT",
                body: blogData,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Blog", id },
                { type: "Blog", id: "LIST" },
                "BlogStats",
                "PublicBlog",
            ],
        }),

        // Delete blog
        deleteBlog: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "Blog", id: "LIST" }, "BlogStats", "PublicBlog"],
        }),

        // Toggle blog status
        toggleBlogStatus: builder.mutation<SingleBlogResponse, { id: string; status: BlogStatus }>({
            query: ({ id, status }) => ({
                url: `/${id}/status`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Blog", id },
                { type: "Blog", id: "LIST" },
                "BlogStats",
                "PublicBlog",
            ],
        }),

        // Toggle featured status
        toggleFeatured: builder.mutation<SingleBlogResponse, string>({
            query: (id) => ({
                url: `/${id}/featured`,
                method: "PATCH",
            }),
            invalidatesTags: (result, error, id) => [
                { type: "Blog", id },
                { type: "Blog", id: "LIST" },
                "PublicBlog",
            ],
        }),

        // Bulk delete blogs
        bulkDeleteBlogs: builder.mutation<{ success: boolean; message: string }, string[]>({
            query: (ids) => ({
                url: "/bulk-delete",
                method: "POST",
                body: { ids },
            }),
            invalidatesTags: [{ type: "Blog", id: "LIST" }, "BlogStats", "PublicBlog"],
        }),

        // Bulk update status
        bulkUpdateStatus: builder.mutation<
            { success: boolean; message: string },
            { ids: string[]; status: BlogStatus }
        >({
            query: ({ ids, status }) => ({
                url: "/bulk-status",
                method: "PATCH",
                body: { ids, status },
            }),
            invalidatesTags: [{ type: "Blog", id: "LIST" }, "BlogStats", "PublicBlog"],
        }),

        // ==========================================
        // PUBLIC ENDPOINTS
        // ==========================================

        // Get published blogs (Public)
        getPublishedBlogs: builder.query<
            BlogsResponse,
            { page?: number; limit?: number; category?: string; tag?: string; search?: string }
        >({
            query: (params = {}) => {
                const queryParams = new URLSearchParams();
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== "") {
                        queryParams.append(key, String(value));
                    }
                });
                return `/public?${queryParams.toString()}`;
            },
            providesTags: ["PublicBlog"],
        }),

        // Get featured blogs (Public)
        getFeaturedBlogs: builder.query<{ success: boolean; data: Blog[] }, number | void>({
            query: (limit = 5) => `/public/featured?limit=${limit}`,
            providesTags: ["PublicBlog"],
        }),

        // Get blog by slug (Public)
        getBlogBySlug: builder.query<SingleBlogResponse, string>({
            query: (slug) => `/public/${slug}`,
            providesTags: (result) =>
                result ? [{ type: "PublicBlog", id: result.data._id }] : ["PublicBlog"],
        }),

        // Get categories (Public)
        getBlogCategories: builder.query<BlogCategoriesResponse, void>({
            query: () => "/public/categories",
            providesTags: ["PublicBlog"],
        }),
    }),
});

export const {
    // Admin hooks
    useGetBlogsQuery,
    useGetBlogByIdQuery,
    useGetBlogStatsQuery,
    useCreateBlogMutation,
    useUpdateBlogMutation,
    useDeleteBlogMutation,
    useToggleBlogStatusMutation,
    useToggleFeaturedMutation,
    useBulkDeleteBlogsMutation,
    useBulkUpdateStatusMutation,
    // Public hooks
    useGetPublishedBlogsQuery,
    useGetFeaturedBlogsQuery,
    useGetBlogBySlugQuery,
    useGetBlogCategoriesQuery,
    // Lazy hooks
    useLazyGetBlogByIdQuery,
    useLazyGetBlogBySlugQuery,
} = blogApi;