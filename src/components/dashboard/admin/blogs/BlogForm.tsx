// @ts-nocheck
// components/admin/blogs/BlogForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    useCreateBlogMutation,
    useUpdateBlogMutation,
    useGetBlogByIdQuery,
    BlogCategory,
    BlogStatus,
} from "@/features/api/blogApi";
import {
    FiArrowLeft,
    FiSave,
    FiSend,
    FiImage,
    FiX,
    FiLoader,
    FiFileText,
    FiSettings,
    FiSearch,
} from "react-icons/fi";
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

const IMGBB_API_KEY = '8b35d4601167f12207fbc7c8117f897e';

interface FormData {
    title: string;
    content: string;
    excerpt: string;
    category: BlogCategory;
    tags: string[];
    status: BlogStatus;
    isFeatured: boolean;
    metaTitle: string;
    metaDescription: string;
    featuredImage: {
        url: string;
        publicId?: string;
        alt?: string;
    } | null;
}

interface FormErrors {
    title?: string;
    content?: string;
    excerpt?: string;
    metaTitle?: string;
    metaDescription?: string;
}

interface BlogFormProps {
    blogId?: string;
}

export default function BlogForm({ blogId }: BlogFormProps) {
    const router = useRouter();
    const isEditMode = !!blogId;

    const [formData, setFormData] = useState<FormData>({
        title: "",
        content: "",
        excerpt: "",
        category: "Other",
        tags: [],
        status: "draft",
        isFeatured: false,
        metaTitle: "",
        metaDescription: "",
        featuredImage: null,
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [tagInput, setTagInput] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const { data: blogData, isLoading: isLoadingBlog } = useGetBlogByIdQuery(blogId!, {
        skip: !blogId,
    });
    const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
    const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();

    const isSubmitting = isCreating || isUpdating;

    useEffect(() => {
        if (blogData?.data) {
            const blog = blogData.data;
            setFormData({
                title: blog.title,
                content: blog.content,
                excerpt: blog.excerpt || "",
                category: blog.category,
                tags: blog.tags || [],
                status: blog.status,
                isFeatured: blog.isFeatured,
                metaTitle: blog.metaTitle || "",
                metaDescription: blog.metaDescription || "",
                featuredImage: blog.featuredImage || null,
            });
        }
    }, [blogData]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = "Title is required";
        } else if (formData.title.length > 200) {
            newErrors.title = "Title must be less than 200 characters";
        }

        if (!formData.content.trim()) {
            newErrors.content = "Content is required";
        }

        if (formData.excerpt && formData.excerpt.length > 500) {
            newErrors.excerpt = "Excerpt must be less than 500 characters";
        }

        if (formData.metaTitle && formData.metaTitle.length > 70) {
            newErrors.metaTitle = "Meta title must be less than 70 characters";
        }

        if (formData.metaDescription && formData.metaDescription.length > 160) {
            newErrors.metaDescription = "Meta description must be less than 160 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB");
            return;
        }

        setIsUploading(true);

        try {
            const uploadFormData = new FormData();
            uploadFormData.append('image', file);

            const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                method: 'POST',
                body: uploadFormData,
            });

            const data = await response.json();

            if (data.success) {
                setFormData((prev) => ({
                    ...prev,
                    featuredImage: {
                        url: data.data.url,
                        publicId: data.data.id,
                        alt: file.name.split(".")[0],
                    },
                }));
                toast.success("Image uploaded successfully");
            } else {
                toast.error("Failed to upload image");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload image");
        } finally {
            setIsUploading(false);
            e.target.value = '';
        }
    };

    const handleRemoveImage = () => {
        setFormData((prev) => ({ ...prev, featuredImage: null }));
    };

    const handleAddTag = () => {
        const tag = tagInput.trim().toLowerCase();
        if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
            setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
            setTagInput("");
        } else if (formData.tags.length >= 10) {
            toast.error("Maximum 10 tags allowed");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((tag) => tag !== tagToRemove),
        }));
    };

    const handleTagKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleSubmit = async (submitStatus: BlogStatus) => {
        const updatedFormData = { ...formData, status: submitStatus };

        if (!validateForm()) {
            toast.error("Please fix the errors in the form");
            return;
        }

        try {
            if (isEditMode) {
                await updateBlog({ id: blogId, ...updatedFormData }).unwrap();
                toast.success("Blog updated successfully");
            } else {
                await createBlog(updatedFormData).unwrap();
                toast.success("Blog created successfully");
            }
            router.push("/admin/blogs");
        } catch (error: any) {
            console.error("Submit error:", error);
            toast.error(error?.data?.message || "Failed to save blog");
        }
    };

    if (isEditMode && isLoadingBlog) {
        return <BlogFormSkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        type="button"
                    >
                        <FiArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {isEditMode ? "Edit Blog Post" : "Create New Blog Post"}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            {isEditMode ? "Update your blog post" : "Write and publish a new blog post"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => handleSubmit("draft")}
                        disabled={isSubmitting}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors text-gray-700 dark:text-gray-300"
                    >
                        {isSubmitting ? <FiLoader className="mr-2 h-4 w-4 animate-spin" /> : <FiSave className="mr-2 h-4 w-4" />}
                        Save Draft
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSubmit("published")}
                        disabled={isSubmitting}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {isSubmitting ? <FiLoader className="mr-2 h-4 w-4 animate-spin" /> : <FiSend className="mr-2 h-4 w-4" />}
                        {isEditMode ? "Update & Publish" : "Publish"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Content Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                            <FiFileText className="h-5 w-5" />
                            Content
                        </h2>

                        <div className="space-y-6">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter blog title..."
                                    className={`w-full px-4 py-2 text-lg border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${errors.title ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
                                />
                                <div className="mt-1 flex justify-between">
                                    <span className={`text-xs ${formData.title.length > 180 ? 'text-orange-500' : 'text-gray-500'}`}>
                                        {formData.title.length}/200 characters
                                    </span>
                                    {errors.title && <span className="text-xs text-red-500">{errors.title}</span>}
                                </div>
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Content <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    placeholder="Write your blog content here... (HTML supported)"
                                    rows={15}
                                    className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-y font-mono text-sm transition-colors ${errors.content ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
                                />
                                <div className="mt-1 flex justify-between">
                                    <span className="text-xs text-gray-500">
                                        {formData.content.length} characters
                                    </span>
                                    {errors.content && <span className="text-xs text-red-500">{errors.content}</span>}
                                </div>
                            </div>

                            {/* Excerpt */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Excerpt
                                    <span className="text-gray-400 font-normal ml-1">(optional)</span>
                                </label>
                                <textarea
                                    name="excerpt"
                                    value={formData.excerpt}
                                    onChange={handleChange}
                                    placeholder="Brief summary of the blog post..."
                                    rows={3}
                                    className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-colors ${errors.excerpt ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
                                />
                                <div className="mt-1 flex justify-between">
                                    <span className={`text-xs ${formData.excerpt.length > 450 ? 'text-orange-500' : 'text-gray-500'}`}>
                                        {formData.excerpt.length}/500 characters
                                    </span>
                                    {errors.excerpt && <span className="text-xs text-red-500">{errors.excerpt}</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SEO Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <FiSearch className="h-5 w-5" />
                                SEO Settings
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Optimize your blog post for search engines
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Meta Title
                                    <span className="text-gray-400 font-normal ml-1">(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    name="metaTitle"
                                    value={formData.metaTitle}
                                    onChange={handleChange}
                                    placeholder="SEO title (defaults to blog title)"
                                    className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${errors.metaTitle ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
                                />
                                <div className="mt-1 flex justify-between">
                                    <span className={`text-xs ${formData.metaTitle.length > 60 ? 'text-orange-500' : 'text-gray-500'}`}>
                                        {formData.metaTitle.length}/70 characters
                                    </span>
                                    {errors.metaTitle && <span className="text-xs text-red-500">{errors.metaTitle}</span>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Meta Description
                                    <span className="text-gray-400 font-normal ml-1">(optional)</span>
                                </label>
                                <textarea
                                    name="metaDescription"
                                    value={formData.metaDescription}
                                    onChange={handleChange}
                                    placeholder="SEO description for search results..."
                                    rows={2}
                                    className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-colors ${errors.metaDescription ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
                                />
                                <div className="mt-1 flex justify-between">
                                    <span className={`text-xs ${formData.metaDescription.length > 140 ? 'text-orange-500' : 'text-gray-500'}`}>
                                        {formData.metaDescription.length}/160 characters
                                    </span>
                                    {errors.metaDescription && <span className="text-xs text-red-500">{errors.metaDescription}</span>}
                                </div>
                            </div>

                            {/* SEO Preview */}
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                                    Search Preview
                                </p>
                                <div className="space-y-1">
                                    <p className="text-blue-600 dark:text-blue-400 text-lg font-medium hover:underline cursor-pointer truncate">
                                        {formData.metaTitle || formData.title || "Blog Title"}
                                    </p>
                                    <p className="text-green-700 dark:text-green-500 text-sm">
                                        yoursite.com/blog/{formData.title ? formData.title.toLowerCase().replace(/\s+/g, '-').slice(0, 30) : 'your-blog-slug'}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                        {formData.metaDescription || formData.excerpt || "Blog description will appear here..."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Settings Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                            <FiSettings className="h-5 w-5" />
                            Settings
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    {CATEGORIES.map((category) => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                                <div>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Featured Post</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Show in featured section</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData((prev) => ({ ...prev, isFeatured: !prev.isFeatured }))}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isFeatured ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"}`}
                                    role="switch"
                                    aria-checked={formData.isFeatured}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${formData.isFeatured ? "translate-x-6" : "translate-x-1"}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Featured Image</h2>

                        {formData.featuredImage ? (
                            <div className="space-y-3">
                                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                                    <Image
                                        src={formData.featuredImage.url}
                                        alt={formData.featuredImage.alt || "Featured image"}
                                        fill
                                        className="object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg"
                                        title="Remove image"
                                    >
                                        <FiX className="h-4 w-4" />
                                    </button>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Alt Text
                                        <span className="text-gray-400 font-normal ml-1">(for accessibility)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.featuredImage.alt || ""}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                featuredImage: prev.featuredImage ? { ...prev.featuredImage, alt: e.target.value } : null,
                                            }))
                                        }
                                        placeholder="Describe the image..."
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="featured-image"
                                    disabled={isUploading}
                                />
                                <label htmlFor="featured-image" className={`cursor-pointer ${isUploading ? 'cursor-wait' : ''}`}>
                                    <div className="flex flex-col items-center gap-2">
                                        {isUploading ? (
                                            <FiLoader className="h-10 w-10 text-blue-500 animate-spin" />
                                        ) : (
                                            <FiImage className="h-10 w-10 text-gray-400" />
                                        )}
                                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                            {isUploading ? "Uploading..." : "Click to upload"}
                                        </p>
                                        <p className="text-xs text-gray-400">PNG, JPG, WebP up to 5MB</p>
                                    </div>
                                </label>
                            </div>
                        )}
                    </div>

                    {/* Tags */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tags</h2>
                            <span className="text-xs text-gray-500">{formData.tags.length}/10</span>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleTagKeyDown}
                                    placeholder="Add a tag..."
                                    maxLength={30}
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddTag}
                                    disabled={!tagInput.trim() || formData.tags.length >= 10}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-300"
                                >
                                    Add
                                </button>
                            </div>

                            {formData.tags.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {formData.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-full"
                                        >
                                            #{tag}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(tag)}
                                                className="ml-1.5 hover:text-red-500 transition-colors"
                                                title="Remove tag"
                                            >
                                                <FiX className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 italic">No tags added yet</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function BlogFormSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div>
                    <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2" />
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
                        <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="h-24 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="h-64 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
                        <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="h-40 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
}