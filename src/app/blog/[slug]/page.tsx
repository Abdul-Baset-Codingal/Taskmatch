// @ts-nocheck
// app/blog/[slug]/page.tsx
"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useGetBlogBySlugQuery } from "@/features/api/blogApi";
import Navbar from "@/shared/Navbar";
import Footer from "@/shared/Footer";
import {
    FiArrowLeft,
    FiCalendar,
    FiClock,
    FiEye,
    FiShare2,
    FiTwitter,
    FiFacebook,
    FiLinkedin,
    FiLink,
    FiBookOpen,
    FiUser,
    FiArrowRight,
} from "react-icons/fi";
import { toast } from "react-toastify";

export default function BlogPostPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const { data, isLoading, error } = useGetBlogBySlugQuery(slug);

    // Debug log
    useEffect(() => {
        if (data) {
            console.log("Blog data:", data);
        }
    }, [data]);

    const blog = data?.data;
    const relatedBlogs = data?.relatedBlogs || [];

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [slug]);

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return "Unknown date";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch {
            return "Unknown date";
        }
    };

    const handleShare = (platform: string) => {
        const url = window.location.href;
        const title = blog?.title || "";

        let shareUrl = "";
        switch (platform) {
            case "twitter":
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
                break;
            case "facebook":
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case "linkedin":
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                break;
            case "copy":
                navigator.clipboard.writeText(url);
                toast.success("Link copied to clipboard!");
                return;
        }

        if (shareUrl) {
            window.open(shareUrl, "_blank", "width=600,height=400");
        }
    };

    // Helper function to get author display info
    const getAuthorInfo = () => {
        if (!blog?.author) {
            return {
                name: "Taskallo Team",
                avatar: null,
                initials: "T",
            };
        }

        // Check if author has full details or just _id
        if (typeof blog.author === "object" && blog.author.name) {
            return {
                name: blog.author.name,
                avatar: blog.author.avatar || null,
                initials: blog.author.name.charAt(0).toUpperCase(),
            };
        }

        // Author only has _id, use default
        return {
            name: "Taskallo Team",
            avatar: null,
            initials: "T",
        };
    };

    if (isLoading) {
        return (
            <div>
                <Navbar />
                <div className="min-h-screen bg-white">
                    <div className="max-w-4xl mx-auto px-6 py-20">
                        <div className="animate-pulse space-y-8">
                            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-96 bg-gray-200 rounded-2xl"></div>
                            <div className="space-y-4">
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div>
                <Navbar />
                <div className="min-h-screen bg-white flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-[#E5FFDB] rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiBookOpen className="w-10 h-10 text-[#109C3D]" />
                        </div>
                        <h1 className="text-3xl font-bold text-[#063A41] mb-4">Article Not Found</h1>
                        <p className="text-[#063A41]/60 mb-8">
                            The article you&apos;re looking for doesn&apos;t exist or has been removed.
                        </p>
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#063A41] to-[#109C3D] text-white rounded-full font-semibold hover:shadow-lg transition-all"
                        >
                            <FiArrowLeft className="w-4 h-4" />
                            Back to Blog
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const authorInfo = getAuthorInfo();

    return (
        <div>
            <Navbar />
            <div className="font-sans text-[#063A41] bg-white">
                {/* Article Header */}
                <header className="pt-8 pb-12 bg-gradient-to-b from-[#F8FDFB] to-white">
                    <div className="max-w-7xl mx-auto px-6">
                        {/* Back Button */}
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center gap-2 text-[#063A41]/60 hover:text-[#109C3D] transition-colors mb-8"
                        >
                            <FiArrowLeft className="w-4 h-4" />
                            Back to Blog
                        </button>

                        {/* Category & Meta */}
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <Link
                                href={`/blog?category=${encodeURIComponent(blog.category)}`}
                                className="px-4 py-1.5 bg-gradient-to-r from-[#063A41] to-[#109C3D] text-white text-sm font-semibold rounded-full hover:shadow-lg transition-all"
                            >
                                {blog.category}
                            </Link>
                            {blog.isFeatured && (
                                <span className="px-3 py-1 bg-[#E5FFDB] text-[#109C3D] text-xs font-semibold rounded-full">
                                    Featured
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#063A41] mb-6 leading-tight">
                            {blog.title}
                        </h1>

                        {/* Excerpt */}
                        {blog.excerpt && (
                            <p className="text-lg md:text-xl text-[#063A41]/70 mb-8 leading-relaxed">
                                {blog.excerpt}
                            </p>
                        )}

                        {/* Author & Meta Info */}
                        <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-t border-b border-gray-200">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3">
                                    {authorInfo.avatar ? (
                                        <Image
                                            src={authorInfo.avatar}
                                            alt={authorInfo.name}
                                            width={48}
                                            height={48}
                                            className="rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#063A41] to-[#109C3D] rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold text-lg">
                                                {authorInfo.initials}
                                            </span>
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-semibold text-[#063A41]">Sophia Ali</p>
                                        <p className="text-sm text-[#063A41]/60">Author</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-[#063A41]/60">
                                <span className="flex items-center gap-2">
                                    <FiCalendar className="w-4 h-4" />
                                    {formatDate(blog.publishedAt || blog.createdAt)}
                                </span>
                                <span className="flex items-center gap-2">
                                    <FiClock className="w-4 h-4" />
                                    {blog.readTime || 1} min read
                                </span>
                                <span className="flex items-center gap-2">
                                    <FiEye className="w-4 h-4" />
                                    {blog.views || 0} views
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Featured Image */}
                {blog.featuredImage?.url && (
                    <div className="max-w-7xl mx-auto px-6 mb-12">
                        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src={blog.featuredImage.url}
                                alt={blog.featuredImage.alt || blog.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                )}

                {/* Article Content */}
                <article className="max-w-7xl mx-auto px-6 pb-16">
                    <div className="grid lg:grid-cols-12 gap-10">
                        {/* Share Sidebar (Desktop) */}
                        <aside className="hidden lg:block lg:col-span-1">
                            <div className="sticky top-24 flex flex-col items-center gap-3">
                                <span
                                    className="text-xs text-[#063A41]/40 font-medium mb-2 rotate-180"
                                    style={{ writingMode: "vertical-rl" }}
                                >
                                    SHARE
                                </span>
                                <button
                                    onClick={() => handleShare("twitter")}
                                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-[#063A41]/60 hover:text-[#1DA1F2] hover:border-[#1DA1F2] transition-all"
                                    aria-label="Share on Twitter"
                                >
                                    <FiTwitter className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleShare("facebook")}
                                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-[#063A41]/60 hover:text-[#4267B2] hover:border-[#4267B2] transition-all"
                                    aria-label="Share on Facebook"
                                >
                                    <FiFacebook className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleShare("linkedin")}
                                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-[#063A41]/60 hover:text-[#0077B5] hover:border-[#0077B5] transition-all"
                                    aria-label="Share on LinkedIn"
                                >
                                    <FiLinkedin className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleShare("copy")}
                                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-[#063A41]/60 hover:text-[#109C3D] hover:border-[#109C3D] transition-all"
                                    aria-label="Copy link"
                                >
                                    <FiLink className="w-4 h-4" />
                                </button>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <div className="lg:col-span-11">
                            {/* Blog Content */}
                            <div
                                className="prose prose-lg max-w-none
                                    prose-headings:text-[#063A41] prose-headings:font-bold
                                    prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                                    prose-p:text-[#063A41]/80 prose-p:leading-relaxed
                                    prose-a:text-[#109C3D] prose-a:no-underline hover:prose-a:underline
                                    prose-strong:text-[#063A41]
                                    prose-blockquote:border-l-4 prose-blockquote:border-[#109C3D] prose-blockquote:bg-[#F8FDFB] prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                                    prose-code:bg-[#F8FDFB] prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-code:text-[#109C3D]
                                    prose-pre:bg-[#063A41] prose-pre:text-white
                                    prose-ul:list-disc prose-ol:list-decimal
                                    prose-li:text-[#063A41]/80
                                    prose-img:rounded-xl prose-img:shadow-lg"
                                dangerouslySetInnerHTML={{ __html: blog.content }}
                            />

                            {/* Tags */}
                            {blog.tags && blog.tags.length > 0 && (
                                <div className="mt-12 pt-8 border-t border-gray-200">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="text-sm font-semibold text-[#063A41]">Tags:</span>
                                        {blog.tags.map((tag: string) => (
                                            <Link
                                                key={tag}
                                                href={`/blog?search=${encodeURIComponent(tag)}`}
                                                className="px-3 py-1.5 bg-[#F8FDFB] text-[#063A41] text-sm rounded-full hover:bg-[#E5FFDB] transition-colors"
                                            >
                                                #{tag}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Share (Mobile) */}
                            <div className="lg:hidden mt-12 pt-8 border-t border-gray-200">
                                <div className="flex flex-wrap items-center gap-4">
                                    <span className="text-sm font-semibold text-[#063A41] flex items-center gap-2">
                                        <FiShare2 className="w-4 h-4" />
                                        Share this article:
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleShare("twitter")}
                                            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-[#063A41]/60 hover:text-[#1DA1F2] hover:border-[#1DA1F2] transition-all"
                                            aria-label="Share on Twitter"
                                        >
                                            <FiTwitter className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleShare("facebook")}
                                            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-[#063A41]/60 hover:text-[#4267B2] hover:border-[#4267B2] transition-all"
                                            aria-label="Share on Facebook"
                                        >
                                            <FiFacebook className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleShare("linkedin")}
                                            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-[#063A41]/60 hover:text-[#0077B5] hover:border-[#0077B5] transition-all"
                                            aria-label="Share on LinkedIn"
                                        >
                                            <FiLinkedin className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleShare("copy")}
                                            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-[#063A41]/60 hover:text-[#109C3D] hover:border-[#109C3D] transition-all"
                                            aria-label="Copy link"
                                        >
                                            <FiLink className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>

                {/* Related Articles */}
                {relatedBlogs.length > 0 && (
                    <section className="py-16 bg-[#F8FDFB]">
                        <div className="max-w-6xl mx-auto px-6">
                            <h2 className="text-2xl md:text-3xl font-bold text-[#063A41] mb-8">
                                Related Articles
                            </h2>

                            <div className="grid md:grid-cols-3 gap-6">
                                {relatedBlogs.map((relatedBlog) => (
                                    <Link
                                        key={relatedBlog._id}
                                        href={`/blog/${relatedBlog.slug}`}
                                        className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                                    >
                                        <div className="relative h-48 overflow-hidden">
                                            {relatedBlog.featuredImage?.url ? (
                                                <Image
                                                    src={relatedBlog.featuredImage.url}
                                                    alt={relatedBlog.featuredImage.alt || relatedBlog.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-[#063A41] to-[#109C3D] flex items-center justify-center">
                                                    <FiBookOpen className="w-12 h-12 text-white/50" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-5">
                                            <span className="text-xs text-[#109C3D] font-semibold">
                                                {relatedBlog.category}
                                            </span>
                                            <h3 className="text-lg font-bold text-[#063A41] mt-2 line-clamp-2 group-hover:text-[#109C3D] transition-colors">
                                                {relatedBlog.title}
                                            </h3>
                                            <div className="flex items-center gap-3 mt-3 text-xs text-[#063A41]/60">
                                                <span>{relatedBlog.readTime || 1} min read</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* CTA Section */}
                <section className="py-16 bg-white">
                    <div className="max-w-3xl mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#063A41] mb-4">
                            Enjoyed This Article?
                        </h2>
                        <p className="text-lg text-[#063A41]/70 mb-10">
                            Explore more insights and tips from our community.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link href="/blog">
                                <button className="px-6 py-3 bg-gradient-to-r from-[#063A41] to-[#109C3D] text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 mx-auto">
                                    Browse All Articles
                                    <FiArrowRight className="w-4 h-4" />
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