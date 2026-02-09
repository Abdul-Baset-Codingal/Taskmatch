// @ts-nocheck
// app/blog/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    useGetPublishedBlogsQuery,
    useGetFeaturedBlogsQuery,
    useGetBlogCategoriesQuery,
    BlogCategory,
} from "@/features/api/blogApi";
import Navbar from "@/shared/Navbar";
import Footer from "@/shared/Footer";
import {
    FiSearch,
    FiCalendar,
    FiClock,
    FiEye,
    FiArrowRight,
    FiChevronLeft,
    FiChevronRight,
    FiTrendingUp,
    FiBookOpen,
    FiTag,
    FiX,
} from "react-icons/fi";

// Hero Background Image - replace with your actual image
import blogHeroBg from "../../../public/Images/our-story.jpeg";

const CATEGORIES: BlogCategory[] = [
    "Tips & Tricks",
    "How-To Guides",
    "Industry News",
    "Company Updates",
    "Success Stories",
    "Tasker Spotlight",
    "Other",
];

export default function BlogPageClient() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get initial values from URL
    const initialCategory = searchParams.get("category") || "";
    const initialSearch = searchParams.get("search") || "";
    const initialPage = parseInt(searchParams.get("page") || "1");

    const [searchInput, setSearchInput] = useState(initialSearch);
    const [activeSearch, setActiveSearch] = useState(initialSearch);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [currentPage, setCurrentPage] = useState(initialPage);

    // Sync state with URL changes (e.g., browser back/forward)
    useEffect(() => {
        const category = searchParams.get("category") || "";
        const search = searchParams.get("search") || "";
        const page = parseInt(searchParams.get("page") || "1");

        setSelectedCategory(category);
        setActiveSearch(search);
        setSearchInput(search);
        setCurrentPage(page);
    }, [searchParams]);

    // Build query params for API
    const queryParams = {
        page: currentPage,
        limit: 9,
        ...(selectedCategory && { category: selectedCategory }),
        ...(activeSearch && { search: activeSearch }),
    };

    // Debug log
    console.log("Query params:", queryParams);

    // Fetch blogs
    const { data: blogsData, isLoading: isLoadingBlogs, isFetching } = useGetPublishedBlogsQuery(queryParams);

    // Fetch featured blogs
    const { data: featuredData } = useGetFeaturedBlogsQuery(3);

    // Fetch categories with counts
    const { data: categoriesData } = useGetBlogCategoriesQuery();

    const blogs = blogsData?.data || [];
    const pagination = blogsData?.pagination;
    const featuredBlogs = featuredData?.data || [];
    const categoryStats = categoriesData?.data || [];

    // Update URL helper
    const updateURL = useCallback((category: string, search: string, page: number) => {
        const params = new URLSearchParams();
        if (category) params.set("category", category);
        if (search) params.set("search", search);
        if (page > 1) params.set("page", String(page));

        const queryString = params.toString();
        router.push(`/blog${queryString ? `?${queryString}` : ""}`, { scroll: false });
    }, [router]);

    // Handle search form submission
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedSearch = searchInput.trim();
        setActiveSearch(trimmedSearch);
        setCurrentPage(1);
        updateURL(selectedCategory, trimmedSearch, 1);
    };

    // Handle search input with debounce for live search (optional)
    useEffect(() => {
        // Only debounce if input has changed from active search
        if (searchInput === activeSearch) return;

        const timer = setTimeout(() => {
            const trimmedSearch = searchInput.trim();
            // Only auto-search if there's content or clearing search
            if (trimmedSearch !== activeSearch) {
                setActiveSearch(trimmedSearch);
                setCurrentPage(1);
                updateURL(selectedCategory, trimmedSearch, 1);
            }
        }, 800); // Longer debounce for auto-search

        return () => clearTimeout(timer);
    }, [searchInput, activeSearch, selectedCategory, updateURL]);

    // Handle category change
    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setCurrentPage(1);
        updateURL(category, activeSearch, 1);
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        updateURL(selectedCategory, activeSearch, page);
        window.scrollTo({ top: 400, behavior: "smooth" });
    };

    // Clear search
    const clearSearch = () => {
        setSearchInput("");
        setActiveSearch("");
        setCurrentPage(1);
        updateURL(selectedCategory, "", 1);
    };

    // Clear category
    const clearCategory = () => {
        setSelectedCategory("");
        setCurrentPage(1);
        updateURL("", activeSearch, 1);
    };

    // Clear all filters
    const clearAllFilters = () => {
        setSearchInput("");
        setActiveSearch("");
        setSelectedCategory("");
        setCurrentPage(1);
        router.push("/blog");
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch {
            return "";
        }
    };

    const showFeatured = featuredBlogs.length > 0 && !selectedCategory && !activeSearch && currentPage === 1;

    return (
        <div>
            <Navbar />
            <div className="font-sans text-[#063A41] bg-white">
                {/* Hero Section */}
                <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={blogHeroBg}
                            alt="Blog Background"
                            fill
                            priority
                            className="object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#063A41]/70 via-[#063A41]/80 to-[#063A41]/90"></div>
                    </div>

                    {/* Hero Content */}
                    <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                        <div className="mb-6 inline-block">
                            <div className="px-4 py-2 bg-[#109C3D]/20 backdrop-blur-sm rounded-full border border-[#109C3D]/30">
                                <span className="text-[#E5FFDB] text-xs font-semibold tracking-wider uppercase flex items-center gap-2">
                                    <FiBookOpen className="w-4 h-4" />
                                    Our Blog
                                </span>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            Insights & <span className="text-[#E5FFDB]">Stories</span>
                        </h1>

                        <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Discover tips, guides, and stories from our community. Learn how to make the most of Taskallo.
                        </p>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="max-w-xl mx-auto">
                            <div className="relative">
                                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    placeholder="Search articles..."
                                    className="w-full pl-12 pr-24 py-4 rounded-full bg-white/95 backdrop-blur-sm text-[#063A41] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#109C3D] shadow-lg"
                                />
                                {searchInput && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchInput("")}
                                        className="absolute right-24 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                                    >
                                        <FiX className="w-4 h-4" />
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-[#063A41] to-[#109C3D] text-white rounded-full font-medium hover:shadow-lg transition-all duration-300"
                                >
                                    Search
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
                        <div className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center">
                            <div className="w-1 h-2 bg-white rounded-full mt-1.5 animate-bounce"></div>
                        </div>
                    </div>
                </section>

                {/* Featured Blogs Section */}
                {showFeatured && (
                    <section className="py-16 bg-gradient-to-b from-[#E5FFDB]/30 to-white">
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-10 h-10 bg-gradient-to-br from-[#063A41] to-[#109C3D] rounded-xl flex items-center justify-center">
                                    <FiTrendingUp className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-[#063A41]">Featured Articles</h2>
                                    <p className="text-[#063A41]/60 text-sm">Hand-picked stories for you</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                {featuredBlogs.map((blog, index) => (
                                    <Link
                                        key={blog._id}
                                        href={`/blog/${blog.slug}`}
                                        className={`group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ${index === 0 ? "md:col-span-2 md:row-span-2" : ""
                                            }`}
                                    >
                                        <div className={`relative ${index === 0 ? "h-[400px] md:h-full" : "h-[250px]"}`}>
                                            {blog.featuredImage?.url ? (
                                                <Image
                                                    src={blog.featuredImage.url}
                                                    alt={blog.featuredImage.alt || blog.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-[#063A41] to-[#109C3D]"></div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#063A41]/90 via-[#063A41]/40 to-transparent"></div>

                                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="px-3 py-1 bg-[#109C3D] text-white text-xs font-semibold rounded-full">
                                                        Featured
                                                    </span>
                                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                                                        {blog.category}
                                                    </span>
                                                </div>

                                                <h3 className={`font-bold text-white mb-2 group-hover:text-[#E5FFDB] transition-colors ${index === 0 ? "text-2xl md:text-3xl" : "text-lg"
                                                    }`}>
                                                    {blog.title}
                                                </h3>

                                                {index === 0 && blog.excerpt && (
                                                    <p className="text-white/80 text-sm mb-4 line-clamp-2">
                                                        {blog.excerpt}
                                                    </p>
                                                )}

                                                <div className="flex items-center gap-4 text-white/70 text-xs">
                                                    <span className="flex items-center gap-1">
                                                        <FiCalendar className="w-3 h-3" />
                                                        {formatDate(blog.publishedAt || blog.createdAt)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <FiClock className="w-3 h-3" />
                                                        {blog.readTime || 1} min read
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Main Content */}
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid lg:grid-cols-4 gap-10">
                            {/* Sidebar */}
                            <aside className="lg:col-span-1 order-2 lg:order-1">
                                <div className="sticky top-24 space-y-8">
                                    {/* Categories */}
                                    <div className="bg-[#F8FDFB] rounded-2xl p-6 border border-[#E5FFDB]">
                                        <h3 className="text-lg font-bold text-[#063A41] mb-4 flex items-center gap-2">
                                            <FiTag className="w-5 h-5 text-[#109C3D]" />
                                            Categories
                                        </h3>
                                        <div className="space-y-2">
                                            <button
                                                onClick={() => handleCategoryChange("")}
                                                className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center justify-between ${selectedCategory === ""
                                                    ? "bg-gradient-to-r from-[#063A41] to-[#109C3D] text-white"
                                                    : "hover:bg-[#E5FFDB] text-[#063A41]"
                                                    }`}
                                            >
                                                <span className="text-sm font-medium">All Articles</span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === "" ? "bg-white/20" : "bg-[#063A41]/10"
                                                    }`}>
                                                    {categoryStats.reduce((acc, cat) => acc + cat.count, 0)}
                                                </span>
                                            </button>

                                            {CATEGORIES.map((category) => {
                                                const count = categoryStats.find((c) => c._id === category)?.count || 0;
                                                // Show all categories, even with 0 count
                                                return (
                                                    <button
                                                        key={category}
                                                        onClick={() => handleCategoryChange(category)}
                                                        className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center justify-between ${selectedCategory === category
                                                            ? "bg-gradient-to-r from-[#063A41] to-[#109C3D] text-white"
                                                            : "hover:bg-[#E5FFDB] text-[#063A41]"
                                                            }`}
                                                    >
                                                        <span className="text-sm font-medium">{category}</span>
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === category ? "bg-white/20" : "bg-[#063A41]/10"
                                                            }`}>
                                                            {count}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Newsletter Signup */}
                                    <div className="bg-gradient-to-br from-[#063A41] to-[#109C3D] rounded-2xl p-6 text-white">
                                        <h3 className="text-lg font-bold mb-2">Stay Updated</h3>
                                        <p className="text-white/80 text-sm mb-4">
                                            Get the latest articles delivered to your inbox.
                                        </p>
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/60 border border-white/20 focus:outline-none focus:border-white/40 mb-3"
                                        />
                                        <button className="w-full py-3 bg-white text-[#063A41] rounded-lg font-semibold hover:bg-[#E5FFDB] transition-colors">
                                            Subscribe
                                        </button>
                                    </div>
                                </div>
                            </aside>

                            {/* Blog Grid */}
                            <div className="lg:col-span-3 order-1 lg:order-2">
                                {/* Active Filters */}
                                {(selectedCategory || activeSearch) && (
                                    <div className="mb-8 p-4 bg-[#F8FDFB] rounded-xl border border-[#E5FFDB]">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="text-sm text-[#063A41]/60">Active filters:</span>

                                            {selectedCategory && (
                                                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white text-[#063A41] rounded-full text-sm font-medium border border-[#E5FFDB]">
                                                    <FiTag className="w-3 h-3" />
                                                    {selectedCategory}
                                                    <button
                                                        onClick={clearCategory}
                                                        className="hover:text-red-500 transition-colors ml-1"
                                                    >
                                                        <FiX className="w-3 h-3" />
                                                    </button>
                                                </span>
                                            )}

                                            {activeSearch && (
                                                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white text-[#063A41] rounded-full text-sm font-medium border border-[#E5FFDB]">
                                                    <FiSearch className="w-3 h-3" />
                                                    &quot;{activeSearch}&quot;
                                                    <button
                                                        onClick={clearSearch}
                                                        className="hover:text-red-500 transition-colors ml-1"
                                                    >
                                                        <FiX className="w-3 h-3" />
                                                    </button>
                                                </span>
                                            )}

                                            <button
                                                onClick={clearAllFilters}
                                                className="text-sm text-[#109C3D] hover:text-[#063A41] font-medium ml-auto"
                                            >
                                                Clear all
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Results count */}
                                {!isLoadingBlogs && blogs.length > 0 && (
                                    <div className="mb-6 flex items-center justify-between">
                                        <p className="text-sm text-[#063A41]/60">
                                            Showing {blogs.length} of {pagination?.totalBlogs || blogs.length} articles
                                            {isFetching && <span className="ml-2 text-[#109C3D]">Loading...</span>}
                                        </p>
                                    </div>
                                )}

                                {/* Loading State */}
                                {isLoadingBlogs ? (
                                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse">
                                                <div className="h-48 bg-gray-200"></div>
                                                <div className="p-5 space-y-3">
                                                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                                    <div className="h-6 bg-gray-200 rounded"></div>
                                                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : blogs.length === 0 ? (
                                    /* Empty State */
                                    <div className="text-center py-20 bg-[#F8FDFB] rounded-2xl border border-[#E5FFDB]">
                                        <div className="w-20 h-20 bg-[#E5FFDB] rounded-full flex items-center justify-center mx-auto mb-6">
                                            <FiBookOpen className="w-10 h-10 text-[#109C3D]" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-[#063A41] mb-3">No articles found</h3>
                                        <p className="text-[#063A41]/60 mb-6 max-w-md mx-auto">
                                            {activeSearch
                                                ? `We couldn't find any articles matching "${activeSearch}".`
                                                : selectedCategory
                                                    ? `No articles in "${selectedCategory}" category yet.`
                                                    : "No articles available at the moment."
                                            }
                                        </p>
                                        <button
                                            onClick={clearAllFilters}
                                            className="px-6 py-3 bg-gradient-to-r from-[#063A41] to-[#109C3D] text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300"
                                        >
                                            View All Articles
                                        </button>
                                    </div>
                                ) : (
                                    /* Blog Grid */
                                    <>
                                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                            {blogs.map((blog) => (
                                                <article
                                                    key={blog._id}
                                                    className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
                                                >
                                                    <Link href={`/blog/${blog.slug}`}>
                                                        {/* Image */}
                                                        <div className="relative h-48 overflow-hidden">
                                                            {blog.featuredImage?.url ? (
                                                                <Image
                                                                    src={blog.featuredImage.url}
                                                                    alt={blog.featuredImage.alt || blog.title}
                                                                    fill
                                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full bg-gradient-to-br from-[#063A41] to-[#109C3D] flex items-center justify-center">
                                                                    <FiBookOpen className="w-12 h-12 text-white/50" />
                                                                </div>
                                                            )}
                                                            <div className="absolute top-4 left-4">
                                                                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#063A41] text-xs font-semibold rounded-full">
                                                                    {blog.category}
                                                                </span>
                                                            </div>
                                                            {blog.isFeatured && (
                                                                <div className="absolute top-4 right-4">
                                                                    <span className="px-2 py-1 bg-[#109C3D] text-white text-xs font-semibold rounded-full">
                                                                        Featured
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Content */}
                                                        <div className="p-5">
                                                            <div className="flex items-center gap-3 text-xs text-[#063A41]/60 mb-3">
                                                                <span className="flex items-center gap-1">
                                                                    <FiCalendar className="w-3 h-3" />
                                                                    {formatDate(blog.publishedAt || blog.createdAt)}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <FiClock className="w-3 h-3" />
                                                                    {blog.readTime || 1} min
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <FiEye className="w-3 h-3" />
                                                                    {blog.views || 0}
                                                                </span>
                                                            </div>

                                                            <h3 className="text-lg font-bold text-[#063A41] mb-2 line-clamp-2 group-hover:text-[#109C3D] transition-colors">
                                                                {blog.title}
                                                            </h3>

                                                            {blog.excerpt && (
                                                                <p className="text-sm text-[#063A41]/70 line-clamp-2 mb-4">
                                                                    {blog.excerpt}
                                                                </p>
                                                            )}

                                                            <div className="flex items-center text-[#109C3D] text-sm font-semibold group-hover:gap-2 transition-all">
                                                                Read More
                                                                <FiArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </article>
                                            ))}
                                        </div>

                                        {/* Pagination */}
                                        {pagination && pagination.totalPages > 1 && (
                                            <div className="mt-12 flex justify-center items-center gap-2">
                                                <button
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                    className="p-2 rounded-lg border border-gray-200 hover:border-[#109C3D] hover:text-[#109C3D] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    <FiChevronLeft className="w-5 h-5" />
                                                </button>

                                                {[...Array(pagination.totalPages)].map((_, i) => {
                                                    const page = i + 1;
                                                    const isActive = page === currentPage;
                                                    const isNearCurrent = Math.abs(page - currentPage) <= 1;
                                                    const isEndPage = page === 1 || page === pagination.totalPages;

                                                    if (!isNearCurrent && !isEndPage) {
                                                        if (page === 2 || page === pagination.totalPages - 1) {
                                                            return (
                                                                <span key={page} className="px-2 text-gray-400">
                                                                    ...
                                                                </span>
                                                            );
                                                        }
                                                        return null;
                                                    }

                                                    return (
                                                        <button
                                                            key={page}
                                                            onClick={() => handlePageChange(page)}
                                                            className={`w-10 h-10 rounded-lg font-medium transition-all ${isActive
                                                                ? "bg-gradient-to-r from-[#063A41] to-[#109C3D] text-white"
                                                                : "border border-gray-200 hover:border-[#109C3D] hover:text-[#109C3D]"
                                                                }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    );
                                                })}

                                                <button
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    disabled={currentPage >= pagination.totalPages}
                                                    className="p-2 rounded-lg border border-gray-200 hover:border-[#109C3D] hover:text-[#109C3D] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    <FiChevronRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 bg-gradient-to-b from-[#E5FFDB]/50 to-white">
                    <div className="max-w-3xl mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#063A41] mb-4">
                            Ready to Get Started?
                        </h2>
                        <p className="text-lg text-[#063A41]/70 mb-10 leading-relaxed">
                            Join thousands of Canadians who trust Taskallo for their everyday tasks.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link href={'/urgent-task?search=general%20service'}>
                                <button className="px-6 py-3 bg-gradient-to-r from-[#063A41] to-[#109C3D] text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                                    Post a Task Now
                                </button>
                            </Link>
                            <Link href="/complete-tasker-profile">
                                <button className="px-6 py-3 bg-white text-[#063A41] border-2 border-[#063A41] rounded-full font-semibold hover:bg-[#063A41] hover:text-white transition-all duration-300">
                                    Become a Tasker
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
}