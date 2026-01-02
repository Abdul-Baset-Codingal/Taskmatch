/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
    FaBookmark,
    FaMapMarkerAlt,
    FaClock,
    FaDollarSign,
    FaUsers,
    FaEdit,
    FaCheckCircle,
    FaTimesCircle,
    FaImage,
    FaChevronDown,
    FaChevronRight,
    FaEllipsisV,
    FaTrash,
    FaFire,
    FaUser,
    FaStar,
    FaTimes,
    FaRegBookmark,
    FaCalendarAlt,
    FaArrowRight,
    FaComments,
    FaEye,
    FaHandshake,
    FaLaptop,
    FaExternalLinkAlt,
    FaRegClock,
    FaMoneyBillWave,
    FaUserCheck,
    FaGavel,
    FaAngleRight,
    FaClipboardList,
} from "react-icons/fa";
import { useAddTaskReviewMutation, useDeleteTaskMutation, useAddCommentMutation, useReplyToCommentMutation } from "@/features/api/taskApi";
import { toast } from "react-toastify";
import BidCard from "./BidCard";
import { useGetUserByIdQuery } from "@/features/auth/authApi";
import CommentCard from "./CommentCard";
import Link from "next/link";
import TaskCommentSection from "./TaskCommentSection";

type Bid = {
    taskerId: string;
    createdAt: string | number | Date;
    message: string;
    offerPrice: number;
};

type Reply = {
    role: any;
    createdAt: string;
    message: string;
};

type Comment = {
    userId: ReactNode;
    role: any;
    createdAt: string | number | Date;
    _id: string;
    message: string;
    replies?: Reply[];
};

type Client = {
    _id?: string;
    fullName?: string;
    email?: string;
} | string;

type Task = {
    estimatedTime: string;
    serviceId: ReactNode;
    acceptedBy?: string;
    updatedAt: string | number | Date;
    photos: any;
    video: boolean;
    price: any;
    _id: string;
    schedule?: string;
    taskTitle: string;
    status: string;
    serviceTitle?: string;
    extraCharge?: boolean;
    createdAt: string;
    location?: string;
    offerDeadline: string;
    additionalInfo?: string;
    bids?: Bid[];
    comments?: Comment[];
    client?: Client;
    taskDescription?: string;

    // ✅ NEW: Accepted bid fields from database
    acceptedBidAmount?: number;
    acceptedBidMessage?: string;
    acceptedAt?: string;
    acceptedBid?: {
        taskerId: string;
        offerPrice: number;
        message?: string;
        acceptedAt: string;
    };
    totalAmount?: number;
};

interface AllClientTasksProps {
    task: Task;
    idx: number;
    user: {
        _id: string;
        role: string;
        firstName?: string;
        lastName?: string;
        profilePicture?: string;
        currentRole?: string;
    } | null;
    handleReplySubmit: (taskId: string, commentId: string, replyText: string) => void;
    handleCompleteStatus: (taskId: string, status: string) => void;
    handleEditTask: (task: Task) => void;
    refetchTasks?: () => void; // Make it optional with ?

}

// Single Bidder Avatar Component that fetches its own data
const BidderAvatar = ({
    taskerId,
    index = 0,
    size = 'md',
    showBorder = true
}: {
    taskerId: string;
    index?: number;
    size?: 'sm' | 'md' | 'lg';
    showBorder?: boolean;
}) => {
    const { data: taskerResponse, isLoading } = useGetUserByIdQuery(taskerId, {
        skip: !taskerId
    });

    const tasker = taskerResponse?.user;

    const avatarColors = [
        'from-[#109C3D] to-[#063A41]',
        'from-blue-500 to-indigo-600',
        'from-purple-500 to-pink-500',
        'from-amber-500 to-orange-500',
        'from-cyan-500 to-teal-500',
    ];

    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 sm:w-11 sm:h-11 text-sm',
        lg: 'w-12 h-12 sm:w-14 sm:h-14 text-base',
    };

    const borderClass = showBorder ? 'border-[3px] border-white' : '';

    if (isLoading) {
        return (
            <div className={`${sizeClasses[size]} ${borderClass} rounded-full bg-gray-200 animate-pulse shadow-md`} />
        );
    }

    const initials = tasker?.firstName?.charAt(0)?.toUpperCase() || 'T';

    return (
        <div
            className={`relative ${sizeClasses[size]} ${borderClass} rounded-full shadow-md overflow-hidden ${!tasker?.profilePicture ? `bg-gradient-to-br ${avatarColors[index % avatarColors.length]}` : 'bg-gray-200'
                }`}
            title={tasker ? `${tasker.firstName} ${tasker.lastName}` : 'Tasker'}
        >
            {tasker?.profilePicture ? (
                <Image
                    src={tasker.profilePicture}
                    alt={`${tasker.firstName} ${tasker.lastName}`}
                    fill
                    className="object-cover"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <span className="text-white font-bold">
                        {initials}
                    </span>
                </div>
            )}
        </div>
    );
};

// Avatar Stack Component using individual fetches
const AvatarStack = ({ bids, maxDisplay = 4 }: { bids: Bid[]; maxDisplay?: number }) => {
    const displayBids = bids.slice(0, maxDisplay);
    const remaining = bids.length - maxDisplay;

    return (
        <div className="flex items-center">
            <div className="flex -space-x-3">
                {displayBids.map((bid, index) => (
                    <div key={bid.taskerId || index} style={{ zIndex: maxDisplay - index }}>
                        <BidderAvatar
                            taskerId={bid.taskerId}
                            index={index}
                            size="md"
                        />
                    </div>
                ))}
                {remaining > 0 && (
                    <div
                        className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full border-[3px] border-white shadow-md bg-[#063A41] flex items-center justify-center"
                        style={{ zIndex: 0 }}
                    >
                        <span className="text-white text-xs sm:text-sm font-bold">+{remaining}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

// Latest Bid Preview Component
const LatestBidPreview = ({ bid }: { bid: Bid }) => {
    const { data: taskerResponse, isLoading } = useGetUserByIdQuery(bid.taskerId, {
        skip: !bid.taskerId
    });

    const tasker = taskerResponse?.user;

    const formatRelativeTime = (dateString: string | number | Date) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return "Just now";
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInHours < 48) return "Yesterday";
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };


    // Add this near the top of your component, after other variable declarations
    const acceptedBid = React.useMemo(() => {
        if (!task.acceptedBy || !task.bids?.length) return null;

        // Get all bids from the accepted tasker
        const taskerBids = task.bids.filter(
            bid => bid.taskerId === task.acceptedBy || bid.taskerId === task.acceptedBy?._id
        );

        if (taskerBids.length === 0) return null;

        // Return the most recent bid (last one by date)
        return taskerBids.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];
    }, [task.acceptedBy, task.bids]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-between bg-white rounded-lg sm:rounded-xl p-2.5 sm:p-3 gap-3 animate-pulse">
                <div className="flex items-center gap-2 sm:gap-3 flex-1">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gray-200" />
                    <div className="flex-1">
                        <div className="h-3 bg-gray-200 rounded w-24 mb-1" />
                        <div className="h-2 bg-gray-200 rounded w-16" />
                    </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-12" />
            </div>
        );
    }

    const initials = tasker?.firstName?.charAt(0)?.toUpperCase() || 'T';
    const fullName = tasker ? `${tasker.firstName} ${tasker.lastName}` : 'Tasker';

    return (
        <div className="flex items-center justify-between bg-white rounded-lg sm:rounded-xl p-2.5 sm:p-3 gap-3">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                {/* Bidder Avatar */}
                <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0">
                    {tasker?.profilePicture ? (
                        <Image
                            src={tasker.profilePicture}
                            alt={fullName}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#109C3D] to-[#063A41] flex items-center justify-center">
                            <span className="text-white text-xs sm:text-sm font-bold">
                                {initials}
                            </span>
                        </div>
                    )}
                </div>
                <div className="min-w-0">
                    <p className="font-medium text-[#063A41] text-xs sm:text-sm truncate">
                        {fullName}
                    </p>
                    <div className="flex items-center gap-1">
                        <p className="text-[10px] sm:text-xs text-gray-400">
                            {formatRelativeTime(bid.createdAt)}
                        </p>
                        {tasker?.averageRating && (
                            <div className="flex items-center gap-0.5">
                                <span className="text-gray-300">•</span>
                                <FaStar className="text-yellow-400 text-[8px] sm:text-[10px]" />
                                <span className="text-[10px] text-gray-500">{tasker.averageRating.toFixed(1)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="text-right flex-shrink-0">
                <p className="font-bold text-[#109C3D] text-sm sm:text-base">
                    ${bid.offerPrice}
                </p>
            </div>
        </div>
    );
};

// Price Range Display
const PriceRange = ({ bids }: { bids: Bid[] }) => {
    if (!bids || bids.length === 0) return null;

    const prices = bids.map(b => b.offerPrice).filter(p => p > 0);
    if (prices.length === 0) return null;

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return (
        <span className="font-semibold text-[#109C3D]">
            {minPrice === maxPrice ? (
                <span>${minPrice}</span>
            ) : (
                <span>${minPrice} - ${maxPrice}</span>
            )}
        </span>
    );
};

const AllClientTasks: React.FC<AllClientTasksProps> = ({
    task,
    handleReplySubmit,
    handleCompleteStatus,
    handleEditTask,
    user, 
    refetchTasks, // Destructure it here

}) => {
    const [replyText, setReplyText] = useState("");
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviewFormData, setReviewFormData] = useState({ rating: 0, message: "" });
    const [isBookmarked, setIsBookmarked] = useState(false);
    const dropdownRef = useRef(null);
    const [deleteTask] = useDeleteTaskMutation();
    const { data: taskerResponse } = useGetUserByIdQuery(task.acceptedBy || "", { skip: !task.acceptedBy });
    const [addTaskReview, { isLoading: isReviewing }] = useAddTaskReviewMutation();
    const [addComment, { isLoading: isAddingComment }] = useAddCommentMutation();
    const [replyToComment, { isLoading: isReplying }] = useReplyToCommentMutation();
    const tasker = taskerResponse?.user;

    const handleReviewInputChange = (
        e: React.ChangeEvent<HTMLTextAreaElement> | { target: { name: string; value: number } }
    ) => {
        const { name, value } = "target" in e ? e.target : { name: "rating", value: e };
        setReviewFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleReviewSubmit = async (taskId: string) => {
        try {
            await addTaskReview({ taskId, ...reviewFormData }).unwrap();
            toast.success("Review submitted successfully!");
            setIsReviewModalOpen(false);
            setReviewFormData({ rating: 0, message: "" });
        } catch (error: any) {
            console.error("Error submitting review:", error);
            toast.error(`Failed to submit review: ${error?.data?.message || "Unknown error"}`);
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        try {
            await deleteTask(taskId).unwrap();
            toast.success("Task deleted successfully!");
        } catch (error) {
            console.error("Failed to delete task:", error);
            toast.error("Failed to delete task");
        }
        setIsMenuOpen(false);
    };

    // Handle adding a new comment
    const handleAddComment = async (taskId: string, message: string) => {
        try {
            await addComment({ taskId, message }).unwrap();
            toast.success("Comment added!");
            refetchTasks?.();
        } catch (error) {
            toast.error("Failed to add comment");
            console.error(error);
            throw error;
        }
    };

    // Handle replying to a comment
    const handleReplyToComment = async (taskId: string, commentId: string, message: string) => {
        try {
            await replyToComment({ taskId, commentId, message }).unwrap();
            toast.success("Reply added!");
            refetchTasks?.();
        } catch (error) {
            toast.error("Failed to add reply");
            console.error(error);
            throw error;
        }
    };


    useEffect(() => {
        const handleClickOutside = (event: { target: any }) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const isValidUrl = (url: string | boolean | URL): boolean => {
        if (typeof url === "boolean") return false;
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const hasBids = (task.bids?.length ?? 0) > 0;
    const isUrgent = task.schedule === "Urgent";
    const bidCount = task.bids?.length || 0;
    const commentCount = task.comments?.length || 0;
    const latestBid = task.bids?.[0];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return "Just now";
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInHours < 48) return "Yesterday";
        return formatDate(dateString);
    };

    // Helper function to get city and province from full address
    const formatLocation = (location: string | undefined): string => {
        if (!location) return "Remote";

        const parts = location.split(',');

        if (parts.length >= 2) {
            // Get the last two parts (city and province/state)
            return parts.slice(-2).map(part => part.trim()).join(', ');
        }

        return location;
    };



    const formatDeadline = (dateString: string) => {
        if (!dateString) return "No deadline";

        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = date.getTime() - now.getTime();
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        // Format the actual date and time
        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
        const formattedTime = date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });

        // If deadline has passed
        if (diffInMs < 0) {
            return `Expired`;
        }

        // Urgent (less than 24 hours)
        if (diffInHours < 24) {
            return `${formattedDate} at ${formattedTime} (${diffInHours}h left)`;
        }

        // Within a week
        if (diffInDays < 7) {
            return `${formattedDate} at ${formattedTime}`;
        }

        return `${formattedDate}`;
    };

    const getStatusConfig = (status: string) => {
        const configs: { [key: string]: { bg: string; text: string; border: string; icon: React.ReactNode; label: string } } = {
            completed: {
                bg: "bg-emerald-50",
                text: "text-emerald-700",
                border: "border-emerald-200",
                icon: <FaCheckCircle className="text-emerald-500" />,
                label: "Completed"
            },
            "in progress": {
                bg: "bg-blue-50",
                text: "text-blue-700",
                border: "border-blue-200",
                icon: <FaClock className="text-blue-500" />,
                label: "In Progress"
            },
            "not completed": {
                bg: "bg-red-50",
                text: "text-red-700",
                border: "border-red-200",
                icon: <FaTimesCircle className="text-red-500" />,
                label: "Not Completed"
            },
            requested: {
                bg: "bg-amber-50",
                text: "text-amber-700",
                border: "border-amber-200",
                icon: <FaHandshake className="text-amber-500" />,
                label: "Review Required"
            },
            "pending": {
                bg: "bg-slate-50",
                text: "text-slate-700",
                border: "border-slate-200",
                icon: <FaRegClock className="text-slate-500" />,
                label: "Awaiting Bids"
            },
        };
        return configs[status] || configs.pending;
    };

    const statusConfig = getStatusConfig(task.status);

    // Review Modal Content
    const modalContent = (
        <div
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300 ${isReviewModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            onClick={() => setIsReviewModalOpen(false)}
        >
            <div
                className={`bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 overflow-hidden ${isReviewModalOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header with Tasker Info */}
                <div className="bg-gradient-to-br from-[#063A41] to-[#0a5a63] px-4 sm:px-6 py-6 text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white/20 mx-auto mb-3 overflow-hidden bg-white/10">
                        {tasker?.profilePicture ? (
                            <Image
                                src={tasker.profilePicture}
                                alt={tasker.firstName}
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <FaUser className="text-white/50 text-xl sm:text-2xl" />
                            </div>
                        )}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                        Rate {tasker?.firstName || "Tasker"}
                    </h3>
                    <p className="text-white/70 text-sm mt-1">
                        How was your experience?
                    </p>
                </div>

                {/* Modal Body */}
                <div className="p-4 sm:p-6 space-y-5">
                    {/* Star Rating */}
                    <div className="flex justify-center gap-1 sm:gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => handleReviewInputChange({ target: { name: "rating", value: star } })}
                                className="focus:outline-none transform transition-all hover:scale-110 active:scale-95 p-1"
                            >
                                <FaStar
                                    className={`text-3xl sm:text-4xl transition-colors duration-200 ${star <= reviewFormData.rating
                                        ? "text-yellow-400 drop-shadow-md"
                                        : "text-gray-200 hover:text-yellow-200"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>

                    {/* Rating Label */}
                    <div className="text-center">
                        <span className="text-sm font-medium text-gray-500">
                            {reviewFormData.rating === 0 && "Tap to rate"}
                            {reviewFormData.rating === 1 && "Poor"}
                            {reviewFormData.rating === 2 && "Fair"}
                            {reviewFormData.rating === 3 && "Good"}
                            {reviewFormData.rating === 4 && "Very Good"}
                            {reviewFormData.rating === 5 && "Excellent!"}
                        </span>
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Share your experience (optional)
                        </label>
                        <textarea
                            name="message"
                            value={reviewFormData.message}
                            onChange={handleReviewInputChange}
                            className="w-full rounded-xl sm:rounded-2xl border-2 border-gray-100 focus:border-[#109C3D] focus:ring-0 transition-colors p-3 sm:p-4 text-sm resize-none bg-gray-50"
                            rows={3}
                            placeholder="What went well? What could be improved?"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <button
                            onClick={() => setIsReviewModalOpen(false)}
                            className="flex-1 px-4 py-2.5 sm:py-3 border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors order-2 sm:order-1"
                        >
                            Maybe Later
                        </button>
                        <button
                            onClick={() => handleReviewSubmit(task._id)}
                            disabled={isReviewing || reviewFormData.rating === 0}
                            className="flex-1 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-[#109C3D] to-[#0d8a35] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#109C3D]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none order-1 sm:order-2"
                        >
                            {isReviewing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Submitting...
                                </span>
                            ) : (
                                "Submit Review"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div className="w-full border-amber-600 group">
                <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 hover:border-[#109C3D]/30 hover:shadow-xl hover:shadow-[#109C3D]/5 transition-all duration-300 overflow-hidden">

                    {/* Urgent Banner */}
                    {isUrgent && (
                        <div className="bg-gradient-to-r from-red-500 to-orange-500 px-3 sm:px-4 py-1.5 sm:py-2 flex items-center justify-center gap-2">
                            <FaFire className="text-white text-xs sm:text-sm animate-pulse" />
                            <span className="text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider">Urgent Task</span>
                        </div>
                    )}

                    {/* Main Card Content */}
                    <div className="p-4 sm:p-5 ">
                        {/* Top Section: Status + Actions */}
                        <div className="flex items-start justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
                            {/* Left: Status, Service & Schedule */}
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                                {/* Status Badge */}
                                <span className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                                    {statusConfig.icon}
                                    <span className="hidden xs:inline">{statusConfig.label}</span>
                                    <span className="xs:hidden">{task.status}</span>
                                </span>

                                {/* Service Title Badge */}
                                {task.serviceTitle && (
                                    <span className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#E5FFDB] text-[#063A41] text-[10px] sm:text-xs font-medium truncate max-w-[100px] sm:max-w-none">
                                        {task.serviceTitle}
                                    </span>
                                )}

                                {/* Schedule Badge */}
                                {task.schedule && (
                                    <span className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium ${task.schedule === "Urgent"
                                        ? "bg-red-50 text-red-600 border border-red-200"
                                        : task.schedule === "Schedule"
                                            ? "bg-blue-50 text-blue-600 border border-blue-200"
                                            : "bg-purple-50 text-purple-600 border border-purple-200"
                                        }`}>
                                        {task.schedule === "Urgent" ? (
                                            <FaFire className="text-[10px] sm:text-xs" />
                                        ) : task.schedule === "Schedule" ? (
                                            <FaCalendarAlt className="text-[10px] sm:text-xs" />
                                        ) : (
                                            <FaClock className="text-[10px] sm:text-xs" />
                                        )}
                                        <span className="hidden xs:inline">
                                            {task.schedule === "Schedule" ? "Scheduled" : task.schedule}
                                        </span>
                                        <span className="xs:hidden">
                                            {task.schedule === "Schedule" ? "Scheduled" : task.schedule === "Flexible" ? "Flexible" : task.schedule}
                                        </span>
                                    </span>
                                )}
                            </div>

                            {/* Right: Actions */}
                            <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                                <button
                                    onClick={() => setIsBookmarked(!isBookmarked)}
                                    className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    {isBookmarked ? (
                                        <FaBookmark className="text-[#109C3D] text-sm" />
                                    ) : (
                                        <FaRegBookmark className="text-gray-400 text-sm" />
                                    )}
                                </button>

                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-colors"
                                    >
                                        <FaEllipsisV className="text-gray-400 text-sm" />
                                    </button>

                                    {isMenuOpen && (
                                        <div className="absolute right-0 top-full mt-1 sm:mt-2 w-36 sm:w-44 bg-white rounded-lg sm:rounded-xl shadow-xl border border-gray-100 py-1 sm:py-2 z-50 animate-fadeIn">
                                            <button
                                                onClick={() => {
                                                    handleEditTask(task);
                                                    setIsMenuOpen(false);
                                                }}
                                                disabled={hasBids}
                                                className="flex items-center gap-2 sm:gap-3 w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <FaEdit className="text-[#109C3D]" />
                                                Edit Task
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTask(task._id)}
                                                disabled={hasBids}
                                                className="flex items-center gap-2 sm:gap-3 w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <FaTrash />
                                                Delete Task
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-base sm:text-xl font-bold text-[#063A41] mb-1.5 sm:mb-2 line-clamp-2 group-hover:text-[#109C3D] transition-colors leading-snug">
                            {task.taskTitle}
                        </h3>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
                            {task.taskDescription || "No description provided"}
                        </p>

                        {/* Task Meta Info - Mobile Optimized */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-x-4 sm:gap-y-2 mb-4 sm:mb-5 pb-4 sm:pb-5 border-b border-gray-100">
                            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-[#E5FFDB] flex items-center justify-center flex-shrink-0">
                                    <FaMapMarkerAlt className="text-[#109C3D] text-[10px] sm:text-xs" />
                                </div>
                                <span className="text-gray-600 truncate max-w-[80px] sm:max-w-none">
                                    {formatLocation(task.location)}
                                </span>
                            </div>

                            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-[#E5FFDB] flex items-center justify-center flex-shrink-0">
                                    <FaDollarSign className="text-[#109C3D] text-[10px] sm:text-xs" />
                                </div>
                                <span className="font-bold text-[#063A41]">
                                    ${task.price || "Open"}
                                </span>
                            </div>

                            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                    <FaCalendarAlt className="text-gray-500 text-[10px] sm:text-xs" />
                                </div>
                                <span className="text-gray-500">{formatDeadline(task.offerDeadline)}</span>
                            </div>
                        </div>

                        {/* Assigned Tasker Section */}
                        {/* Assigned Tasker Section - Now uses database fields */}
                        {task.acceptedBy && tasker && (
                            <div className="mb-4 sm:mb-5">
                                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-[#E5FFDB] to-emerald-50 rounded-xl sm:rounded-2xl border border-[#109C3D]/20">

                                    {/* Avatar (Clickable) */}
                                    <Link href={`/taskers/${task.acceptedBy}`} className="relative flex-shrink-0 cursor-pointer">
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl overflow-hidden border-2 sm:border-3 border-white shadow-lg">
                                            {tasker.profilePicture ? (
                                                <Image
                                                    src={tasker.profilePicture}
                                                    alt={tasker.firstName}
                                                    width={56}
                                                    height={56}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-[#109C3D] to-[#063A41] flex items-center justify-center">
                                                    <span className="text-white text-base sm:text-lg font-bold">
                                                        {tasker.firstName?.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-[#109C3D] rounded-full border-2 border-white flex items-center justify-center">
                                            <FaCheckCircle className="text-white text-[6px] sm:text-[8px]" />
                                        </div>
                                    </Link>

                                    {/* Tasker Info */}
                                    <div className="flex-1 min-w-0">
                                        <span className="text-[10px] sm:text-xs font-medium text-[#109C3D] bg-white px-1.5 sm:px-2 py-0.5 rounded-full">
                                            Assigned
                                        </span>

                                        <Link href={`/taskers/${task.acceptedBy}`}>
                                            <h4 className="font-bold text-[#063A41] mt-0.5 sm:mt-1 text-sm sm:text-base truncate cursor-pointer hover:underline">
                                                {tasker.firstName} {tasker.lastName}
                                            </h4>
                                        </Link>

                                        {/* Show when bid was accepted */}
                                        {task.acceptedAt && (
                                            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                                                Accepted {new Date(task.acceptedAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        )}

                                        {tasker.averageRating && (
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <FaStar className="text-yellow-400 text-[10px] sm:text-xs" />
                                                <span className="text-[10px] sm:text-xs font-medium text-gray-600">
                                                    {tasker.averageRating.toFixed(1)}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* ✅ Accepted Bid Price - Now from database */}
                                    <div className="flex-shrink-0 text-right bg-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-[#109C3D]/20">
                                        <span className="text-[10px] sm:text-xs text-gray-500 block">Agreed Price</span>
                                        <div className="flex items-center justify-end gap-0.5">
                                            <span className="text-lg sm:text-xl font-bold text-[#109C3D]">
                                                ${task.acceptedBidAmount || task.acceptedBid?.offerPrice || '0'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* ✅ Show bid message if available */}
                                {(task.acceptedBidMessage || task.acceptedBid?.message) && (
                                    <div className="mt-2 p-3 bg-gray-50 rounded-xl text-sm text-gray-600 border border-gray-100">
                                        <div className="flex items-start gap-2">
                                            <FaComments className="text-gray-400 text-xs mt-0.5 flex-shrink-0" />
                                            <div>
                                                <span className="font-medium text-gray-700 text-xs">Tasker's note: </span>
                                                <span className="text-xs text-gray-600">
                                                    {task.acceptedBidMessage || task.acceptedBid?.message}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Bids Section - Show when there are bids and no tasker assigned */}
                        {/* Each bid is displayed in its own row - NO expand button */}
                        {/* Bids Section - Compact Design */}
                        {!task.acceptedBy && hasBids && (
                            <div className="mb-4 sm:mb-5">
                                <div className="p-2.5 sm:p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl border border-blue-100">
                                    {/* Compact Header Row */}
                                    <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3 pb-2 border-b border-blue-100">
                                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                <FaGavel className="text-blue-600 text-xs sm:text-sm" />
                                            </div>
                                            <div className="min-w-0 flex items-center gap-2 sm:gap-3 flex-wrap">
                                                <span className="font-bold text-[#063A41] text-xs sm:text-sm">
                                                    {bidCount} {bidCount === 1 ? 'Bid' : 'Bids'}
                                                </span>
                                                <span className="text-[10px] sm:text-xs text-gray-400">•</span>
                                                <span className="text-[10px] sm:text-xs">
                                                    <PriceRange bids={task.bids || []} />
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* All Bids List - Compact */}
                                    <div className="space-y-1.5 sm:space-y-2 max-h-[200px] sm:max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
                                        {task.bids?.map((bid, i) => (
                                            <BidCard
                                                key={bid.taskerId || i}
                                                bid={bid}
                                                taskStatus={task.status}
                                                task={task}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* No Bids State */}
                        {!task.acceptedBy && !hasBids && task.status === "pending" && (
                            <div className="mb-4 sm:mb-5">
                                <div className="p-4 sm:p-5 bg-gray-50 rounded-xl sm:rounded-2xl border border-dashed border-gray-200 text-center">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                                        <FaUsers className="text-gray-400 text-lg sm:text-xl" />
                                    </div>
                                    <p className="font-medium text-gray-600 text-sm sm:text-base mb-0.5 sm:mb-1">Waiting for bids</p>
                                    <p className="text-[10px] sm:text-xs text-gray-400">Taskers will start bidding soon</p>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons - Mobile Optimized */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            {task.status === "requested" ? (
                                <>
                                    <button
                                        onClick={() => handleCompleteStatus(task._id, "completed")}
                                        className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-[#109C3D] to-[#0d8a35] text-white text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl hover:shadow-lg hover:shadow-[#109C3D]/30 transition-all"
                                    >
                                        <FaCheckCircle className="text-xs sm:text-sm" />
                                        Mark Complete
                                    </button>
                                    <button
                                        onClick={() => handleCompleteStatus(task._id, "not completed")}
                                        className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-red-200 text-red-600 text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl hover:bg-red-50 transition-colors"
                                    >
                                        <FaTimesCircle className="text-xs sm:text-sm" />
                                        Not Complete
                                    </button>
                                </>
                            ) : task.status === "completed" ? (
                                <button
                                    onClick={() => setIsReviewModalOpen(true)}
                                    className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-[#063A41] to-[#0a5a63] text-white text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl hover:shadow-lg transition-all"
                                >
                                    <FaStar className="text-yellow-400 text-xs sm:text-sm" />
                                    Leave a Review
                                </button>
                            ) : null}
                        </div>
                    </div>
                    <TaskCommentSection
                        taskId={task._id}
                        comments={task.comments || []}
                        currentUser={user ? {
                            _id: user._id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            profilePicture: user.profilePicture,
                            currentRole: user.currentRole || user.role,
                        } : null}
                        onAddComment={handleAddComment}
                        onReplyToComment={handleReplyToComment}
                        isLoading={isAddingComment || isReplying}
                        maxHeight="280px"
                        showAddComment={true}
                    />
                </div>
            </div>

            {/* Review Modal Portal */}
            {typeof window !== 'undefined' && createPortal(modalContent, document.body)}

            {/* Custom Styles */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-8px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #c1c1c1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #a1a1a1;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </>
    );
};

export default AllClientTasks;