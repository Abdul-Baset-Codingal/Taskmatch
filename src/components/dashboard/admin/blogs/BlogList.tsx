// components/admin/blogs/BlogList.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
    useGetBlogsQuery,
    useDeleteBlogMutation,
    useToggleBlogStatusMutation,
    useToggleFeaturedMutation,
    useBulkDeleteBlogsMutation,
    useBulkUpdateStatusMutation,
    BlogStatus,
    BlogCategory,
} from "@/features/api/blogApi";
import {
    FiMoreHorizontal,
    FiPlus,
    FiSearch,
    FiTrash2,
    FiEdit,
    FiEye,
    FiStar,
    FiFileText,
    FiArchive,
    FiSend,
    FiRefreshCw,
    FiFilter,
    FiX,
    FiChevronLeft,
    FiChevronRight,
} from "react-icons/fi";
import { formatDistanceToNow, format } from "date-fns";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";

const CATEGORIES: BlogCategory[] = [
    "Tips & Tricks",
    "How-To Guides",
    "Industry News",
    "Company Updates",
    "Success Stories",
    "Tasker Spotlight",
    "Other",
];

const STATUS_OPTIONS: { value: BlogStatus; label: string; color: string }[] = [
    { value: "draft", label: "Draft", color: "bg-gray-100 text-gray-800" },
    { value: "published", label: "Published", color: "bg-green-100 text-green-800" },
    { value: "archived", label: "Archived", color: "bg-orange-100 text-orange-800" },
];

export default function BlogList() {
    const router = useRouter();

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<BlogStatus | "all">("all");
    const [categoryFilter, setCategoryFilter] = useState<BlogCategory | "all">("all");
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
    const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        const handleClickOutside = () => setOpenDropdownId(null);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const queryParams = useMemo(
        () => ({
            page,
            limit,
            search: debouncedSearch || undefined,
            status: statusFilter !== "all" ? statusFilter : undefined,
            category: categoryFilter !== "all" ? categoryFilter : undefined,
            sortBy,
            sortOrder,
        }),
        [page, limit, debouncedSearch, statusFilter, categoryFilter, sortBy, sortOrder]
    );

    const { data, isLoading, isFetching, refetch } = useGetBlogsQuery(queryParams);
    const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();
    const [toggleStatus] = useToggleBlogStatusMutation();
    const [toggleFeatured] = useToggleFeaturedMutation();
    const [bulkDelete, { isLoading: isBulkDeleting }] = useBulkDeleteBlogsMutation();
    const [bulkUpdateStatus] = useBulkUpdateStatusMutation();

    const blogs = data?.data || [];
    const pagination = data?.pagination;

    const handleDelete = async () => {
        if (!blogToDelete) return;
        try {
            await deleteBlog(blogToDelete).unwrap();
            toast.success("Blog deleted successfully");
            setDeleteDialogOpen(false);
            setBlogToDelete(null);
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to delete blog");
        }
    };

    const handleBulkDelete = async () => {
        if (selectedBlogs.length === 0) return;
        try {
            await bulkDelete(selectedBlogs).unwrap();
            toast.success(`${selectedBlogs.length} blogs deleted successfully`);
            setSelectedBlogs([]);
            setBulkDeleteDialogOpen(false);
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to delete blogs");
        }
    };

    const handleStatusChange = async (blogId: string, status: BlogStatus) => {
        try {
            await toggleStatus({ id: blogId, status }).unwrap();
            toast.success(`Blog ${status} successfully`);
            setOpenDropdownId(null);
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update status");
        }
    };

    const handleToggleFeatured = async (blogId: string) => {
        try {
            const result = await toggleFeatured(blogId).unwrap();
            toast.success(result.data.isFeatured ? "Blog featured" : "Blog unfeatured");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to toggle featured");
        }
    };

    const handleBulkStatusUpdate = async (status: BlogStatus) => {
        if (selectedBlogs.length === 0) return;
        try {
            await bulkUpdateStatus({ ids: selectedBlogs, status }).unwrap();
            toast.success(`${selectedBlogs.length} blogs updated to ${status}`);
            setSelectedBlogs([]);
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update blogs");
        }
    };

    const handleSelectAll = (checked: boolean) => {
        setSelectedBlogs(checked ? blogs.map((blog) => blog._id) : []);
    };

    const handleSelectBlog = (blogId: string, checked: boolean) => {
        setSelectedBlogs((prev) =>
            checked ? [...prev, blogId] : prev.filter((id) => id !== blogId)
        );
    };

    const clearFilters = () => {
        setSearch("");
        setStatusFilter("all");
        setCategoryFilter("all");
        setSortBy("createdAt");
        setSortOrder("desc");
        setPage(1);
    };

    const handleSortChange = (value: string) => {
        const [field, order] = value.split("-");
        setSortBy(field);
        setSortOrder(order as "asc" | "desc");
    };

    if (isLoading) {
        return <BlogListSkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Management</h1>
                    <p className="text-gray-500 dark:text-gray-400">Create, edit, and manage your blog posts</p>
                </div>
                <button
                    onClick={() => router.push("/dashboard/admin/blogs/create")}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    <FiPlus className="mr-2 h-4 w-4" />
                    New Blog Post
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="relative flex-1 max-w-md">
                        <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search blogs..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                        >
                            <FiFilter className="mr-2 h-4 w-4" />
                            Filters
                            {(statusFilter !== "all" || categoryFilter !== "all") && (
                                <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                                    Active
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => refetch()}
                            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                        >
                            <FiRefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                        </button>
                    </div>
                </div>

                {showFilters && (
                    <div className="mt-4 flex flex-wrap items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value as BlogStatus | "all");
                                setPage(1);
                            }}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="all">All Status</option>
                            {STATUS_OPTIONS.map((status) => (
                                <option key={status.value} value={status.value}>{status.label}</option>
                            ))}
                        </select>

                        <select
                            value={categoryFilter}
                            onChange={(e) => {
                                setCategoryFilter(e.target.value as BlogCategory | "all");
                                setPage(1);
                            }}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="all">All Categories</option>
                            {CATEGORIES.map((category) => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>

                        <select
                            value={`${sortBy}-${sortOrder}`}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="createdAt-desc">Newest First</option>
                            <option value="createdAt-asc">Oldest First</option>
                            <option value="title-asc">Title A-Z</option>
                            <option value="title-desc">Title Z-A</option>
                            <option value="views-desc">Most Views</option>
                        </select>

                        <button
                            onClick={clearFilters}
                            className="inline-flex items-center px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <FiX className="mr-2 h-4 w-4" />
                            Clear
                        </button>
                    </div>
                )}

                {selectedBlogs.length > 0 && (
                    <div className="mt-4 flex flex-wrap items-center gap-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {selectedBlogs.length} selected
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                onClick={() => handleBulkStatusUpdate("published")}
                                className="inline-flex items-center px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-white dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300"
                            >
                                <FiSend className="mr-2 h-4 w-4" />
                                Publish
                            </button>
                            <button
                                onClick={() => handleBulkStatusUpdate("draft")}
                                className="inline-flex items-center px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-white dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300"
                            >
                                <FiFileText className="mr-2 h-4 w-4" />
                                Draft
                            </button>
                            <button
                                onClick={() => handleBulkStatusUpdate("archived")}
                                className="inline-flex items-center px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-white dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300"
                            >
                                <FiArchive className="mr-2 h-4 w-4" />
                                Archive
                            </button>
                            <button
                                onClick={() => setBulkDeleteDialogOpen(true)}
                                className="inline-flex items-center px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                <FiTrash2 className="mr-2 h-4 w-4" />
                                Delete
                            </button>
                        </div>
                        <button
                            onClick={() => setSelectedBlogs([])}
                            className="ml-auto text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            Clear Selection
                        </button>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th className="w-12 px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={blogs.length > 0 && selectedBlogs.length === blogs.length}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[300px]">
                                    Blog
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Views
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Featured
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="w-12 px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {blogs.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <FiFileText className="h-12 w-12 text-gray-400" />
                                            <h3 className="font-medium text-gray-900 dark:text-white">No blogs found</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {search || statusFilter !== "all" || categoryFilter !== "all"
                                                    ? "Try adjusting your filters"
                                                    : "Get started by creating your first blog post"}
                                            </p>
                                            {!search && statusFilter === "all" && categoryFilter === "all" && (
                                                <button
                                                    onClick={() => router.push("/dashboard/admin/blogs/create")}
                                                    className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                    <FiPlus className="mr-2 h-4 w-4" />
                                                    Create Blog
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                blogs.map((blog) => (
                                    <tr key={blog._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedBlogs.includes(blog._id)}
                                                onChange={(e) => handleSelectBlog(blog._id, e.target.checked)}
                                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {blog.featuredImage?.url ? (
                                                    <div className="relative h-12 w-20 rounded overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                                                        <Image
                                                            src={blog.featuredImage.url}
                                                            alt={blog.featuredImage.alt || blog.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="h-12 w-20 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                                                        <FiFileText className="h-6 w-6 text-gray-400" />
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <p className="font-medium text-gray-900 dark:text-white truncate">{blog.title}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                        {blog.excerpt || "No excerpt"}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex px-2 py-1 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-300">
                                                {blog.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${STATUS_OPTIONS.find((s) => s.value === blog.status)?.color}`}>
                                                {STATUS_OPTIONS.find((s) => s.value === blog.status)?.label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                                                <FiEye className="h-4 w-4 text-gray-400" />
                                                {blog.views.toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => handleToggleFeatured(blog._id)}
                                                className={`p-1 rounded-lg transition-colors ${blog.isFeatured ? "text-yellow-500 hover:text-yellow-600" : "text-gray-400 hover:text-gray-600"}`}
                                            >
                                                <FiStar className={`h-5 w-5 ${blog.isFeatured ? "fill-current" : ""}`} />
                                            </button>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-gray-900 dark:text-white">
                                                    {format(new Date(blog.createdAt), "MMM d, yyyy")}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="relative">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenDropdownId(openDropdownId === blog._id ? null : blog._id);
                                                    }}
                                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                >
                                                    <FiMoreHorizontal className="h-4 w-4 text-gray-500" />
                                                </button>
                                                {openDropdownId === blog._id && (
                                                    <div
                                                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <div className="py-1">
                                                            <button
                                                                onClick={() => {
                                                                    router.push(`/dashboard/admin/blogs/${blog._id}`);
                                                                    setOpenDropdownId(null);
                                                                }}
                                                                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                            >
                                                                <FiEye className="mr-2 h-4 w-4" />
                                                                View
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    router.push(`/admin/blogs/${blog._id}/edit`);
                                                                    setOpenDropdownId(null);
                                                                }}
                                                                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                            >
                                                                <FiEdit className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </button>
                                                            <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                                                            {STATUS_OPTIONS.filter((s) => s.value !== blog.status).map((status) => (
                                                                <button
                                                                    key={status.value}
                                                                    onClick={() => handleStatusChange(blog._id, status.value)}
                                                                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                                >
                                                                    {status.value === "published" && <FiSend className="mr-2 h-4 w-4" />}
                                                                    {status.value === "draft" && <FiFileText className="mr-2 h-4 w-4" />}
                                                                    {status.value === "archived" && <FiArchive className="mr-2 h-4 w-4" />}
                                                                    {status.label}
                                                                </button>
                                                            ))}
                                                            <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                                                            <button
                                                                onClick={() => {
                                                                    setBlogToDelete(blog._id);
                                                                    setDeleteDialogOpen(true);
                                                                    setOpenDropdownId(null);
                                                                }}
                                                                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                            >
                                                                <FiTrash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {pagination && pagination.totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 gap-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, pagination.totalBlogs)} of {pagination.totalBlogs} blogs
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-300"
                            >
                                <FiChevronLeft className="h-4 w-4 mr-1" />
                                Previous
                            </button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                                    .filter((p) => p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1)
                                    .map((p, idx, arr) => (
                                        <React.Fragment key={p}>
                                            {idx > 0 && arr[idx - 1] !== p - 1 && (
                                                <span className="px-2 text-gray-400">...</span>
                                            )}
                                            <button
                                                onClick={() => setPage(p)}
                                                className={`w-9 h-9 text-sm rounded-lg transition-colors ${p === page
                                                    ? "bg-blue-600 text-white"
                                                    : "border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        </React.Fragment>
                                    ))}
                            </div>
                            <button
                                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                                disabled={page === pagination.totalPages}
                                className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-300"
                            >
                                Next
                                <FiChevronRight className="h-4 w-4 ml-1" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Dialog */}
            {deleteDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setDeleteDialogOpen(false)} />
                    <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Blog Post</h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this blog post? This action cannot be undone.
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteDialogOpen(false)}
                                className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Delete Dialog */}
            {bulkDeleteDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setBulkDeleteDialogOpen(false)} />
                    <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Multiple Blog Posts</h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete {selectedBlogs.length} blog posts? This action cannot be undone.
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setBulkDeleteDialogOpen(false)}
                                className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBulkDelete}
                                disabled={isBulkDeleting}
                                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                            >
                                {isBulkDeleting ? "Deleting..." : `Delete ${selectedBlogs.length} Posts`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function BlogListSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2" />
                </div>
                <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="h-10 w-full max-w-md bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            <div className="h-12 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            </div>
                            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}