// components/admin/blogs/BlogStats.tsx
"use client";

import React from "react";
import { useGetBlogStatsQuery } from "@/features/api/blogApi";
import { FiFileText, FiEye, FiTrendingUp, FiClock, FiSend, FiBarChart2 } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function BlogStats() {
    const { data, isLoading, error } = useGetBlogStatsQuery();

    if (isLoading) return <BlogStatsSkeleton />;

    if (error || !data?.success) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <p className="text-center text-gray-500 dark:text-gray-400">Failed to load stats</p>
            </div>
        );
    }

    const stats = data.data;
    const publishedCount = stats.byStatus.find((s) => s._id === "published")?.count || 0;
    const draftCount = stats.byStatus.find((s) => s._id === "draft")?.count || 0;

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Blogs" value={stats.totalBlogs} icon={FiFileText} color="bg-blue-500" subValue={`${publishedCount} published, ${draftCount} drafts`} />
                <StatCard title="Total Views" value={stats.totalViews.toLocaleString()} icon={FiEye} color="bg-purple-500" subValue="Across all posts" />
                <StatCard title="Published" value={publishedCount} icon={FiSend} color="bg-green-500" subValue="Live posts" />
                <StatCard title="Drafts" value={draftCount} icon={FiClock} color="bg-yellow-500" subValue="Pending" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Distribution */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Status Distribution</h3>
                    <div className="space-y-4">
                        {stats.byStatus.map((item, index) => (
                            <div key={item._id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{item._id}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${stats.totalBlogs > 0 ? (item.count / stats.totalBlogs) * 100 : 0}%`,
                                                backgroundColor: COLORS[index % COLORS.length],
                                            }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-8">{item.count}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Categories */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                        <FiBarChart2 className="h-5 w-5" />
                        Posts by Category
                    </h3>
                    <div className="space-y-3">
                        {stats.byCategory.length > 0 ? (
                            stats.byCategory.map((cat, index) => (
                                <div key={cat._id} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{cat._id}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full"
                                                style={{
                                                    width: `${(cat.count / stats.totalBlogs) * 100}%`,
                                                    backgroundColor: COLORS[index % COLORS.length],
                                                }}
                                            />
                                        </div>
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-8">{cat.count}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 dark:text-gray-400 py-4">No categories yet</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Top Posts */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <FiTrendingUp className="h-5 w-5" />
                        Top Performing Posts
                    </h3>
                </div>
                <div className="space-y-4">
                    {stats.topViewed.length > 0 ? (
                        stats.topViewed.map((blog, index) => (
                            <div key={blog._id} className="flex items-center gap-3">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-xs font-medium text-blue-600 dark:text-blue-300">
                                    {index + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <Link href={`/dashboard/admin/blogs/${blog._id}/edit`} className="text-sm font-medium text-gray-900 dark:text-white hover:underline truncate block">
                                        {blog.title}
                                    </Link>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                    <FiEye className="h-3 w-3" />
                                    {blog.views.toLocaleString()}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-4">No posts yet</p>
                    )}
                </div>
            </div>

            {/* Recent Posts */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Posts</h3>
                <div className="space-y-4">
                    {stats.recentBlogs.length > 0 ? (
                        stats.recentBlogs.map((blog) => (
                            <div key={blog._id} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                                <div className="flex-1 min-w-0">
                                    <Link href={`/dashboard/admin/blogs/${blog._id}/edit`} className="font-medium text-gray-900 dark:text-white hover:underline truncate block">
                                        {blog.title}
                                    </Link>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${blog.status === "published" ? "bg-green-100 text-green-800" : blog.status === "draft" ? "bg-gray-100 text-gray-800" : "bg-orange-100 text-orange-800"}`}>
                                        {blog.status}
                                    </span>
                                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                        <FiEye className="h-3 w-3" />
                                        {blog.views}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                            No posts yet.{" "}
                            <Link href="/dashboard/admin/blogs/create" className="text-blue-600 hover:underline">
                                Create your first post
                            </Link>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string; size?: number }>;
    color: string;
    subValue?: string;
}

function StatCard({ title, value, icon: Icon, color, subValue }: StatCardProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
                    {subValue && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subValue}</p>}
                </div>
                <div className={`p-3 rounded-full ${color}`}>
                    <Icon className="text-white" size={24} />
                </div>
            </div>
        </div>
    );
}

function BlogStatsSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2" />
                    </div>
                ))}
            </div>
        </div>
    );
}