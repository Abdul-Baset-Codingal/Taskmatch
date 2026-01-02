/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useGetUserByIdQuery, useUpdateUserMutation } from "@/features/auth/authApi";
import { useGetTasksByClientQuery } from "@/features/api/taskApi";
import { checkLoginStatus } from "@/resusable/CheckUser";
import { toast } from "react-toastify";
import { Save, Upload, CheckCircle, Lock, AlertTriangle, Star, Award, TrendingUp, Briefcase, X, Trash2 } from "lucide-react";
import { HiOutlineDocumentText } from "react-icons/hi";
import Navbar from "@/shared/Navbar";

const uploadToImgBB = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(
        'https://api.imgbb.com/1/upload?key=8b35d4601167f12207fbc7c8117f897e',
        {
            method: 'POST',
            body: formData,
        }
    );
    const data = await res.json();
    if (!data.success) {
        throw new Error(data.error.message || 'Image upload failed');
    }
    return data.data.url;
};

// Tier configuration
const tierConfig = {
    bronze: {
        name: "Bronze Booker",
        icon: "🥉",
        color: "bg-amber-600",
        textColor: "text-amber-700",
        bgLight: "bg-amber-50",
        borderColor: "border-amber-300",
        gradientFrom: "from-amber-600",
        gradientTo: "to-amber-800",
        minTasks: 0,
        maxTasks: 5,
        nextTier: "Silver",
        perks: ["Basic support", "Standard visibility"],
    },
    silver: {
        name: "Silver Booker",
        icon: "🥈",
        color: "bg-slate-400",
        textColor: "text-slate-600",
        bgLight: "bg-slate-50",
        borderColor: "border-slate-300",
        gradientFrom: "from-slate-400",
        gradientTo: "to-slate-600",
        minTasks: 5,
        maxTasks: 15,
        nextTier: "Gold",
        perks: ["Priority support", "Enhanced visibility"],
    },
    gold: {
        name: "Gold Booker",
        icon: "🥇",
        color: "bg-yellow-500",
        textColor: "text-yellow-700",
        bgLight: "bg-yellow-50",
        borderColor: "border-yellow-400",
        gradientFrom: "from-yellow-400",
        gradientTo: "to-yellow-600",
        minTasks: 15,
        maxTasks: 30,
        nextTier: "Platinum",
        perks: ["VIP support", "Featured profile", "5% discount"],
    },
    platinum: {
        name: "Platinum Booker",
        icon: "💎",
        color: "bg-purple-500",
        textColor: "text-purple-700",
        bgLight: "bg-purple-50",
        borderColor: "border-purple-400",
        gradientFrom: "from-purple-400",
        gradientTo: "to-purple-600",
        minTasks: 30,
        maxTasks: 50,
        nextTier: "Diamond",
        perks: ["24/7 VIP support", "Top visibility", "10% discount"],
    },
    diamond: {
        name: "Diamond Booker",
        icon: "👑",
        color: "bg-cyan-500",
        textColor: "text-cyan-700",
        bgLight: "bg-cyan-50",
        borderColor: "border-cyan-400",
        gradientFrom: "from-cyan-400",
        gradientTo: "to-cyan-600",
        minTasks: 50,
        maxTasks: null,
        nextTier: null,
        perks: ["Elite support", "Maximum visibility", "15% discount", "Exclusive perks"],
    },
};

const getTierInfo = (completedTasks: number) => {
    if (completedTasks >= 50) return { tier: "diamond", ...tierConfig.diamond };
    if (completedTasks >= 30) return { tier: "platinum", ...tierConfig.platinum };
    if (completedTasks >= 15) return { tier: "gold", ...tierConfig.gold };
    if (completedTasks >= 5) return { tier: "silver", ...tierConfig.silver };
    return { tier: "bronze", ...tierConfig.bronze };
};

const Page = () => {
    const router = useRouter();
    const [user, setUser] = useState<{ _id: string; role: string } | null>(null);
    const [formData, setFormData] = useState({
        profilePicture: "" as string,
        firstName: "" as string,
        lastName: "" as string,
        email: "" as string,
    });

    const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({
        profilePicture: null,
    });

    const [isUploading, setIsUploading] = useState(false);
    const [uploadField, setUploadField] = useState<keyof typeof formData | null>(null);

    const localUrlsRef = useRef(new Map<string, string>());

    useEffect(() => {
        const fetchUser = async () => {
            const { isLoggedIn, user } = await checkLoginStatus();
            if (isLoggedIn) {
                setUser(user);
            } else {
                router.push("/login");
            }
        };
        fetchUser();
    }, [router]);

    const { data: userDetails, refetch, isLoading: isUserLoading } = useGetUserByIdQuery(user?._id || "", {
        skip: !user?._id,
    });

    // Fetch tasks by client to get completed tasks count
    const { data: tasksData = [], isLoading: isTasksLoading } = useGetTasksByClientQuery(user?._id || "", {
        skip: !user?._id,
    });

    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

    useEffect(() => {
        if (userDetails && userDetails.user && user?._id) {
            setFormData({
                profilePicture: userDetails.user.profilePicture || "",
                firstName: userDetails.user.firstName || "",
                lastName: userDetails.user.lastName || "",
                email: userDetails.user.email || "",
            });
        }
    }, [userDetails, user]);

    useEffect(() => {
        return () => {
            localUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
            localUrlsRef.current.clear();
        };
    }, []);


    console.log(tasksData)
    // Calculate completed tasks from API data
    const tasks = tasksData || [];
    const completedTasks = tasks.filter((task: any) => task.status === "completed").length;

    
    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter((task: any) => task.status === "pending").length;
    const inProgressTasks = tasks.filter((task: any) => task.status === "in-progress" || task.status === "accepted").length;

    // Calculate average rating from completed tasks
    const completedTasksWithRating = tasks.filter((task: any) => task.status === "completed" && task.rating);
    const averageRating = completedTasksWithRating.length > 0
        ? completedTasksWithRating.reduce((acc: number, task: any) => acc + (task.rating || 0), 0) / completedTasksWithRating.length
        : 0;

    // Get tier info based on completed tasks
    const tierInfo = getTierInfo(completedTasks);
    const tasksToNextTier = tierInfo.maxTasks ? tierInfo.maxTasks - completedTasks : 0;
    const tierProgress = tierInfo.maxTasks
        ? ((completedTasks - tierInfo.minTasks) / (tierInfo.maxTasks - tierInfo.minTasks)) * 100
        : 100;

    const handleFileUpload = async (file: File, field: keyof typeof formData): Promise<string | null> => {
        if (!file) return null;
        if (!file.type.startsWith('image/')) {
            toast.error(`${field} must be an image file.`);
            return null;
        }
        setIsUploading(true);
        setUploadField(field);
        try {
            const url = await uploadToImgBB(file);
            toast.success(`Uploaded successfully!`);
            setIsUploading(false);
            setUploadField(null);
            return url;
        } catch (error) {
            toast.error(`Failed to upload`);
            setIsUploading(false);
            setUploadField(null);
            return null;
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof formData) => {
        const file = e.target.files?.[0];
        if (file) {
            const localUrl = URL.createObjectURL(file);
            localUrlsRef.current.set(field, localUrl);
            setSelectedFiles(prev => ({ ...prev, [field]: file }));
            setFormData(prev => ({ ...prev, [field]: localUrl }));
            const uploadedUrl = await handleFileUpload(file, field);
            if (uploadedUrl) {
                setFormData(prev => ({ ...prev, [field]: uploadedUrl }));
                const oldLocalUrl = localUrlsRef.current.get(field);
                if (oldLocalUrl) {
                    URL.revokeObjectURL(oldLocalUrl);
                    localUrlsRef.current.delete(field);
                }
            }
            setSelectedFiles(prev => ({ ...prev, [field]: null }));
            e.target.value = '';
        }
    };

    const getPreviewUrl = (field: string): string => {
        return formData[field as keyof typeof formData] || '';
    };

    const isLocalPreview = (field: string): boolean => {
        const url = getPreviewUrl(field);
        return url.startsWith('blob:');
    };

    const needsUnoptimized = (src: string): boolean => !src.startsWith('/');

    // Get missing fields
    const getMissingFields = (): string[] => {
        const missing: string[] = [];
        if (!formData.profilePicture || formData.profilePicture.startsWith('blob:')) missing.push('Profile Picture');
        return missing;
    };

    // Check if form is complete
    const isFormComplete = formData.profilePicture && !formData.profilePicture.startsWith('blob:');

    // Check if profile is verified/approved
    const isProfileVerified = userDetails?.user?.isVerified || false;

    // Missing Fields Alert Component
    const MissingFieldsAlert = () => {
        const missing = getMissingFields();
        if (missing.length === 0) return null;

        return (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-amber-800">Missing Required Fields</p>
                        <p className="text-sm text-amber-700 mt-1">
                            Please complete: <span className="font-medium">{missing.join(', ')}</span>
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    const handleSavePersonalInfo = async () => {
        if (!user?._id) return toast.error("User not logged in.");
        if (formData.profilePicture?.startsWith('blob:')) return toast.warn("Please wait for upload to complete.");

        const missing = getMissingFields();
        if (missing.length > 0) {
            return toast.error(`Please fill in: ${missing.join(', ')}`);
        }

        const payload: any = { userId: user._id };
        if (formData.profilePicture && !formData.profilePicture.startsWith('blob:')) payload.profilePicture = formData.profilePicture;

        try {
            await updateUser(payload).unwrap();
            await refetch();
            toast.success("Profile updated successfully!");
        } catch (err: any) {
            toast.error(`Failed: ${err.data?.error || err.message}`);
        }
    };

    // Loading
    if (isUserLoading || isTasksLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-3 border-[#E5FFDB] border-t-[#109C3D] rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!userDetails || !userDetails.user) {
        return (
            <div className="min-h-screen bg-[#E5FFDB]/20 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-sm w-full border border-[#109C3D]/20">
                    <div className="w-16 h-16 bg-[#E5FFDB] rounded-full flex items-center justify-center mx-auto mb-4">
                        <HiOutlineDocumentText className="w-8 h-8 text-[#063A41]" />
                    </div>
                    <h2 className="text-xl font-semibold text-[#063A41] mb-2">Loading Profile</h2>
                    <p className="text-gray-500">Please wait...</p>
                </div>
            </div>
        );
    }

    const fullName = `${formData.firstName} ${formData.lastName}`.trim() || "User";

    return (
        <div className="min-h-screen bg-[#E5FFDB]/10">
            <Navbar />

            {/* Profile Header */}
            <div className="bg-[#063A41]">
                <div className="max-w-5xl mx-auto px-4 py-8">
                    {/* Profile Info Row */}
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                        {/* Profile Picture */}
                        <div className="relative flex-shrink-0 self-center lg:self-start">
                            <div className={`p-1 rounded-full bg-gradient-to-br ${tierInfo.gradientFrom} ${tierInfo.gradientTo}`}>
                                <Image
                                    src={getPreviewUrl("profilePicture") || "/placeholder-avatar.png"}
                                    alt="Profile"
                                    width={110}
                                    height={110}
                                    className="rounded-full object-cover border-4 border-[#063A41]"
                                    unoptimized={needsUnoptimized(getPreviewUrl("profilePicture") || "")}
                                />
                            </div>
                            {/* Tier Badge on Avatar */}
                            <div className={`absolute -bottom-2 -right-2 w-10 h-10 ${tierInfo.color} rounded-full flex items-center justify-center border-3 border-[#063A41] shadow-lg`}>
                                <span className="text-lg">{tierInfo.icon}</span>
                            </div>
                        </div>

                        {/* Name, Tier, Rating */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-3">
                                {/* Full Name */}
                                <h1 className="text-2xl md:text-3xl font-bold text-white">
                                    {fullName}
                                </h1>

                                {/* Tier Badge */}
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${tierInfo.bgLight} ${tierInfo.textColor} border ${tierInfo.borderColor}`}>
                                    <span>{tierInfo.icon}</span>
                                    {tierInfo.name}
                                </span>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    <span className="text-white font-semibold">
                                        {averageRating > 0 ? averageRating.toFixed(1) : "No ratings yet"}
                                    </span>
                                    {completedTasksWithRating.length > 0 && (
                                        <span className="text-white/60 text-sm">
                                            ({completedTasksWithRating.length} review{completedTasksWithRating.length !== 1 ? 's' : ''})
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Tier Progress Widget */}
                            {tierInfo.nextTier ? (
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 max-w-md mx-auto lg:mx-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4 text-[#E5FFDB]" />
                                            <span className="text-sm font-medium text-[#E5FFDB]">
                                                Progress to {tierInfo.nextTier}
                                            </span>
                                        </div>
                                        <span className="text-sm font-bold text-white">
                                            {completedTasks}/{tierInfo.maxTasks}
                                        </span>
                                    </div>
                                    <div className="w-full bg-white/20 rounded-full h-3 mb-3 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r ${tierInfo.gradientFrom} ${tierInfo.gradientTo}`}
                                            style={{ width: `${Math.min(Math.max(tierProgress, 0), 100)}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">🎯</span>
                                        <p className="text-sm text-[#E5FFDB]">
                                            <span className="font-semibold text-white">{tasksToNextTier} more task{tasksToNextTier !== 1 ? 's' : ''}</span>
                                            {' '}to unlock {tierInfo.nextTier}!
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                /* Max Tier Reached */
                                <div className="bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-4 border border-cyan-400/30 max-w-md mx-auto lg:mx-0">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">👑</span>
                                        <div>
                                            <p className="text-white font-bold text-lg">Maximum Tier Achieved!</p>
                                            <p className="text-sm text-[#E5FFDB]/90">
                                                You&apos;re a legendary booker with {completedTasks} completed tasks!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick Stats Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 lg:w-40">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <CheckCircle className="w-4 h-4 text-[#109C3D]" />
                                    <span className="text-2xl font-bold text-white">{completedTasks}</span>
                                </div>
                                <p className="text-xs text-[#E5FFDB]/80">Completed</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <Briefcase className="w-4 h-4 text-yellow-400" />
                                    <span className="text-2xl font-bold text-white">{totalTasks}</span>
                                </div>
                                <p className="text-xs text-[#E5FFDB]/80">Total Tasks</p>
                            </div>
                            {inProgressTasks > 0 && (
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center col-span-2 lg:col-span-1">
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                        <span className="text-2xl font-bold text-white">{inProgressTasks}</span>
                                    </div>
                                    <p className="text-xs text-[#E5FFDB]/80">In Progress</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tier Perks Preview */}
                    {/* <div className="mt-6 pt-6 border-t border-white/10">
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                            <span className="text-sm text-[#E5FFDB]/70">Your perks:</span>
                            {tierInfo.perks.map((perk, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/10 rounded-full text-xs text-white"
                                >
                                    <CheckCircle className="w-3 h-3 text-[#109C3D]" />
                                    {perk}
                                </span>
                            ))}
                        </div>
                    </div> */}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 py-6">
                {/* Personal Info */}
                <div className="space-y-4">
                    <MissingFieldsAlert />

                    <div className="bg-white rounded-xl border shadow-sm p-6">
                        <h3 className="font-semibold text-[#063A41] mb-6 flex items-center gap-2 text-lg">
                            <Award className="w-5 h-5 text-[#109C3D]" />
                            Profile Settings
                        </h3>

                        {/* Profile Picture Upload */}
                        {/* Profile Picture Upload */}
                        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 pb-6 border-b">
                            <div className="relative">
                                <div className={`p-0.5 rounded-full bg-gradient-to-br ${tierInfo.gradientFrom} ${tierInfo.gradientTo}`}>
                                    <Image
                                        src={getPreviewUrl("profilePicture") || "/placeholder-avatar.png"}
                                        alt="Profile"
                                        width={100}
                                        height={100}
                                        className="rounded-full object-cover border-3 border-white"
                                        unoptimized={needsUnoptimized(getPreviewUrl("profilePicture") || "")}
                                    />
                                </div>
                                {isUploading && uploadField === "profilePicture" && (
                                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                        <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                                {!formData.profilePicture && (
                                    <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center border-2 border-white">
                                        <AlertTriangle className="w-3.5 h-3.5 text-white" />
                                    </span>
                                )}
                                {/* Remove Button */}
                                {formData.profilePicture && !isUploading && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            // Revoke blob URL if exists
                                            const localUrl = localUrlsRef.current.get("profilePicture");
                                            if (localUrl) {
                                                URL.revokeObjectURL(localUrl);
                                                localUrlsRef.current.delete("profilePicture");
                                            }
                                            // Clear the profile picture
                                            setFormData(prev => ({ ...prev, profilePicture: "" }));
                                            setSelectedFiles(prev => ({ ...prev, profilePicture: null }));
                                            toast.info("Profile picture removed");
                                        }}
                                        className="absolute -top-1 -right-1 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center border-2 border-white shadow-lg transition-all hover:scale-110 z-10"
                                        title="Remove photo"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <div className="text-center sm:text-left">
                                <p className="text-sm text-gray-500 mb-2">
                                    Upload a professional photo for your profile
                                </p>
                                <div className="flex flex-wrap items-center gap-2">
                                    <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-[#E5FFDB] text-[#063A41] rounded-lg hover:bg-[#d4f5c8] transition-colors font-medium">
                                        <Upload className="w-4 h-4" />
                                        {getPreviewUrl("profilePicture") ? "Change Photo" : "Upload Photo"}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, "profilePicture")}
                                            className="hidden"
                                            disabled={isUploading}
                                        />
                                    </label>
                                    {/* Alternative Remove Button (Text) */}
                                    {formData.profilePicture && !isUploading && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const localUrl = localUrlsRef.current.get("profilePicture");
                                                if (localUrl) {
                                                    URL.revokeObjectURL(localUrl);
                                                    localUrlsRef.current.delete("profilePicture");
                                                }
                                                setFormData(prev => ({ ...prev, profilePicture: "" }));
                                                setSelectedFiles(prev => ({ ...prev, profilePicture: null }));
                                                toast.info("Profile picture removed");
                                            }}
                                            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Remove
                                        </button>
                                    )}
                                </div>
                                {getPreviewUrl("profilePicture") && !isLocalPreview("profilePicture") && (
                                    <span className="block mt-2 text-sm text-[#109C3D] font-medium">✓ Uploaded successfully</span>
                                )}
                                {isLocalPreview("profilePicture") && (
                                    <span className="block mt-2 text-sm text-amber-600 font-medium">⏳ Uploading...</span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#063A41] mb-1.5">First Name</label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        disabled
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#063A41] mb-1.5">Last Name</label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        disabled
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#063A41] mb-1.5">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSavePersonalInfo}
                        disabled={isUpdating || isUploading}
                        className="w-full py-3.5 bg-[#109C3D] text-white font-semibold rounded-xl hover:bg-[#0d8534] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#109C3D]/20"
                    >
                        <Save className="w-5 h-5" />
                        {isUpdating ? "Saving..." : "Save Changes"}
                    </button>
                </div>

                {/* Tier Information Card */}
                <div className="mt-6 bg-white rounded-xl border shadow-sm p-6">
                    <h3 className="font-semibold text-[#063A41] mb-4 flex items-center gap-2 text-lg">
                        <TrendingUp className="w-5 h-5 text-[#109C3D]" />
                        Tier Benefits
                    </h3>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        {Object.entries(tierConfig).map(([key, tier]) => {
                            const isCurrentTier = tierInfo.tier === key;
                            const isUnlocked = completedTasks >= tier.minTasks;

                            return (
                                <div
                                    key={key}
                                    className={`relative p-4 rounded-xl border-2 transition-all ${isCurrentTier
                                        ? `${tier.bgLight} ${tier.borderColor} shadow-md`
                                        : isUnlocked
                                            ? 'bg-gray-50 border-gray-200'
                                            : 'bg-gray-50/50 border-gray-100 opacity-60'
                                        }`}
                                >
                                    {isCurrentTier && (
                                        <div className="absolute -top-2 -right-2 bg-[#109C3D] text-white text-xs px-2 py-0.5 rounded-full font-medium">
                                            Current
                                        </div>
                                    )}
                                    <div className="text-center">
                                        <span className="text-2xl mb-2 block">{tier.icon}</span>
                                        <p className={`font-semibold text-sm ${isCurrentTier ? tier.textColor : 'text-gray-700'}`}>
                                            {tier.name.replace(' Booker', '')}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {tier.minTasks}+ tasks
                                        </p>
                                        {!isUnlocked && (
                                            <div className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-400">
                                                <Lock className="w-3 h-3" />
                                                Locked
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Success Message when complete */}
                {isFormComplete && (
                    <div className="mt-6 bg-[#E5FFDB] border border-[#109C3D] rounded-xl p-6 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <CheckCircle className="w-6 h-6 text-[#109C3D]" />
                            <h3 className="text-xl font-bold text-[#063A41]">Profile Complete!</h3>
                        </div>
                        <p className="text-gray-600">
                            Your profile is all set. Keep completing tasks to level up your tier!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Page;