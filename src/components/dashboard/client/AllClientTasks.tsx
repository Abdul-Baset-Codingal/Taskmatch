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
    FaEllipsisV,
    FaTrash,
    FaFire,
    FaUser,
    FaStar,
    FaTimes,
    FaRegBookmark,
    FaCalendarAlt,
    FaArrowRight,
} from "react-icons/fa";
import { useAddTaskReviewMutation, useDeleteTaskMutation } from "@/features/api/taskApi";
import { toast } from "react-toastify";
import BidCard from "./BidCard";
import { useGetUserByIdQuery } from "@/features/auth/authApi";
import CommentCard from "./CommentCard";
import Link from "next/link";

type Bid = {
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
};

interface AllClientTasksProps {
    task: Task;
    idx: number;
    user: { _id: string; role: string } | null;
    handleReplySubmit: (taskId: string, commentId: string, replyText: string) => void;
    handleCompleteStatus: (taskId: string, status: string) => void;
    handleEditTask: (task: Task) => void;
}

const AllClientTasks: React.FC<AllClientTasksProps> = ({
    task,
    handleReplySubmit,
    handleCompleteStatus,
    handleEditTask,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showBids, setShowBids] = useState(false);
    const [showComments, setShowComments] = useState(false);
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

    useEffect(() => {
        const handleClickOutside = (event: { target: any }) => {
            // @ts-ignore
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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getStatusConfig = (status: string) => {
        const configs: { [key: string]: { bg: string; text: string; border: string; icon: React.ReactNode } } = {
            completed: {
                bg: "bg-[#E5FFDB]",
                text: "text-[#109C3D]",
                border: "border-[#109C3D]",
                icon: <FaCheckCircle className="text-[#109C3D]" />
            },
            "in progress": {
                bg: "bg-blue-50",
                text: "text-blue-700",
                border: "border-blue-400",
                icon: <FaClock className="text-blue-600" />
            },
            "not completed": {
                bg: "bg-red-50",
                text: "text-red-700",
                border: "border-red-400",
                icon: <FaTimesCircle className="text-red-600" />
            },
            requested: {
                bg: "bg-amber-50",
                text: "text-amber-700",
                border: "border-amber-400",
                icon: <FaClock className="text-amber-600" />
            },
            pending: {
                bg: "bg-[#E5FFDB]",
                text: "text-[#063A41]",
                border: "border-[#109C3D]/30",
                icon: <FaClock className="text-[#109C3D]" />
            },
        };
        return configs[status] || configs.pending;
    };

    const statusConfig = getStatusConfig(task.status);

    // Review Modal Content
    const modalContent = (
        <div
            className={`fixed inset-0 bg-[#063A41]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300 ${isReviewModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            onClick={() => setIsReviewModalOpen(false)}
        >
            <div
                className={`bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ${isReviewModalOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="bg-[#063A41] rounded-t-2xl px-6 py-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-white">
                            Review for {tasker?.firstName + " " + tasker?.lastName || "Tasker"}
                        </h3>
                        <button
                            onClick={() => setIsReviewModalOpen(false)}
                            className="text-white/70 hover:text-white transition-colors p-1"
                        >
                            <FaTimes className="text-lg" />
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-5">
                    {/* Rating */}
                    <div>
                        <label className="block text-sm font-medium text-[#063A41] mb-3">
                            How was your experience?
                        </label>
                        <div className="flex gap-2 justify-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => handleReviewInputChange({ target: { name: "rating", value: star } })}
                                    className="focus:outline-none transform transition-transform hover:scale-110"
                                >
                                    <FaStar
                                        className={`text-3xl transition-colors duration-200 ${star <= reviewFormData.rating
                                            ? "text-yellow-400"
                                            : "text-gray-200"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-medium text-[#063A41] mb-2">
                            Your Review
                        </label>
                        <textarea
                            name="message"
                            value={reviewFormData.message}
                            onChange={handleReviewInputChange}
                            className="w-full rounded-xl border-2 border-gray-200 focus:border-[#109C3D] focus:ring-0 transition-colors p-4 text-sm resize-none"
                            rows={4}
                            placeholder="Share your experience with this tasker..."
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={() => setIsReviewModalOpen(false)}
                            className="flex-1 px-4 py-2.5 border-2 border-gray-200 text-[#063A41] rounded-xl font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => handleReviewSubmit(task._id)}
                            disabled={isReviewing || reviewFormData.rating === 0}
                            className="flex-1 px-4 py-2.5 bg-[#109C3D] text-white rounded-xl font-medium hover:bg-[#0d8a35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isReviewing ? "Submitting..." : "Submit Review"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div className="w-full">
                <div className="bg-white rounded-lg border hover:border-[#109C3D]/30 hover:shadow-md transition-all overflow-hidden">
                    {/* Urgent Banner */}
                    {isUrgent && (
                        <div className="bg-red-500 px-4 py-2 flex items-center justify-center gap-2">
                            <FaFire className="text-white text-sm" />
                            <span className="text-white text-xs font-semibold uppercase">Urgent Task</span>
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="p-5">
                        {/* Header Row */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                            <div className="flex items-center gap-2 flex-wrap">
                                {/* Status Badge */}
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-medium ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                                    {statusConfig.icon}
                                    {task.status}
                                </span>

                                {/* Service Tag */}
                                {task.serviceTitle && (
                                    <span className="px-3 py-1 rounded bg-gray-100 text-gray-600 text-xs font-medium">
                                        {task.serviceTitle}
                                    </span>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 flex-shrink-0">
                                <button
                                    onClick={() => setIsBookmarked(!isBookmarked)}
                                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
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
                                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <FaEllipsisV className="text-gray-400 text-sm" />
                                    </button>

                                    {isMenuOpen && (
                                        <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border py-1 z-50">
                                            <button
                                                onClick={() => {
                                                    handleEditTask(task);
                                                    setIsMenuOpen(false);
                                                }}
                                                disabled={hasBids}
                                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[#063A41] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <FaEdit className="text-[#109C3D]" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTask(task._id)}
                                                disabled={hasBids}
                                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <FaTrash />
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-[#063A41] mb-2">
                            {task.taskTitle}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                            {task.taskDescription || "No description provided"}
                        </p>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                            <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-[#109C3D] text-sm flex-shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-400">Location</p>
                                    <p className="text-sm font-medium text-[#063A41] truncate">
                                        {task.location || "Remote"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <FaDollarSign className="text-[#109C3D] text-sm flex-shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-400">Budget</p>
                                    <p className="text-sm font-semibold text-[#109C3D]">
                                        {task.price ? `$${task.price}` : "Open"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <FaClock className="text-[#109C3D] text-sm flex-shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-400">Duration</p>
                                    <p className="text-sm font-medium text-[#063A41]">
                                        {task.estimatedTime || "Flexible"} hr
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <FaUsers className="text-[#109C3D] text-sm flex-shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-400">Bids</p>
                                    <p className="text-sm font-medium text-[#063A41]">
                                        {task.bids?.length || 0} received
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* BIDS SECTION - PROMINENT AND ALWAYS VISIBLE */}
                        {(task.bids?.length ?? 0) > 0 && (
                            <div className="bg-[#E5FFDB]/30 rounded-lg p-4 mb-5 border border-[#109C3D]/20">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-semibold text-[#063A41] flex items-center gap-2">
                                        <FaDollarSign className="text-[#109C3D]" />
                                        Bids Received ({task.bids?.length})
                                    </h4>
                                    {!showBids && task.bids.length > 2 && (
                                        <button
                                            onClick={() => setShowBids(true)}
                                            className="text-xs text-[#109C3D] hover:text-[#0d8a35] font-medium"
                                        >
                                            Show All
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    {/* Show first 2 bids, or all if showBids is true */}
                                    {(showBids ? task.bids : task.bids.slice(0, 2))?.map((bid, i) => (
                                        <BidCard key={i} bid={bid} taskStatus={task.status} task={task} />
                                    ))}

                                    {/* Show More/Less Button */}
                                    {task.bids.length > 2 && (
                                        <button
                                            onClick={() => setShowBids(!showBids)}
                                            className="w-full py-2 text-sm text-[#063A41] hover:text-[#109C3D] font-medium transition-colors flex items-center justify-center gap-1"
                                        >
                                            {showBids ? (
                                                <>
                                                    Show Less <FaChevronDown className="rotate-180 text-xs" />
                                                </>
                                            ) : (
                                                <>
                                                    Show {task.bids.length - 2} More Bids <FaChevronDown className="text-xs" />
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* No Bids Message */}
                        {(task.bids?.length ?? 0) === 0 && task.status === "pending" && (
                            <div className="bg-gray-50 rounded-lg p-6 mb-5 text-center">
                                <FaUsers className="text-gray-300 text-2xl mx-auto mb-2" />
                                <p className="text-sm text-gray-400">No bids yet</p>
                                <p className="text-xs text-gray-400 mt-1">Taskers will submit their offers soon</p>
                            </div>
                        )}

                        {/* Assigned Tasker */}
                        {task.acceptedBy && tasker && (
                            <div className="flex items-center justify-between p-4 bg-[#E5FFDB]/50 rounded-lg border border-[#109C3D]/20 mb-5">
                                <Link href={`/taskers/${task.acceptedBy}`} className="flex items-center gap-3 group">
                                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#109C3D]/30 flex-shrink-0 group-hover:border-[#109C3D] transition-colors">
                                        {tasker.profilePicture ? (
                                            <Image
                                                src={tasker.profilePicture}
                                                alt={tasker.firstName + " " + tasker.lastName || "Tasker"}
                                                width={40}
                                                height={40}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-[#E5FFDB] flex items-center justify-center">
                                                <FaUser className="text-[#109C3D]" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Assigned to</p>
                                        <p className="text-sm font-semibold text-[#063A41] group-hover:text-[#109C3D] transition-colors">
                                            {tasker.firstName + " " + tasker.lastName || "Anonymous"}
                                        </p>
                                    </div>
                                </Link>
                                <div className="flex items-center gap-1 text-[#109C3D]">
                                    <FaCheckCircle className="text-sm" />
                                    <span className="text-xs font-medium">Confirmed</span>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                            {task.status === "requested" && (
                                <>
                                    <button
                                        onClick={() => handleCompleteStatus(task._id, "completed")}
                                        className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 bg-[#109C3D] text-white text-sm font-medium rounded-lg hover:bg-[#0d8a35] transition-colors"
                                    >
                                        <FaCheckCircle />
                                        Mark Complete
                                    </button>
                                    <button
                                        onClick={() => handleCompleteStatus(task._id, "not completed")}
                                        className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
                                    >
                                        <FaTimesCircle />
                                        Mark Incomplete
                                    </button>
                                </>
                            )}

                            {task.status === "completed" && (
                                <button
                                    onClick={() => setIsReviewModalOpen(true)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#063A41] text-white text-sm font-medium rounded-lg hover:bg-[#052e33] transition-colors"
                                >
                                    <FaStar className="text-yellow-400" />
                                    Add Review
                                </button>
                            )}

                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 text-[#063A41] text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                {isExpanded ? "Show Less" : "More Details"}
                                <FaChevronDown className={`transition-transform text-xs ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                        <div className="border-t bg-gray-50">
                            <div className="p-5 space-y-4">
                                {/* Full Description */}
                                <div>
                                    <h4 className="text-sm font-semibold text-[#063A41] mb-2">Task Description</h4>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {task.taskDescription || "No description provided"}
                                    </p>
                                </div>

                                {/* Additional Info */}
                                {task.additionalInfo && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-[#063A41] mb-2">Additional Information</h4>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            {task.additionalInfo}
                                        </p>
                                    </div>
                                )}

                                {/* Photos Gallery */}
                                {task.photos?.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-[#063A41] mb-3 flex items-center justify-between">
                                            <span>Attachments</span>
                                            <span className="text-xs font-normal text-gray-400">
                                                {task.photos.length} photos
                                            </span>
                                        </h4>
                                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                            {task.photos.slice(0, 11).map((photo: string, i: number) => (
                                                isValidUrl(photo) ? (
                                                    <div
                                                        key={i}
                                                        className="aspect-square overflow-hidden rounded-lg bg-gray-100 cursor-pointer"
                                                    >
                                                        <Image
                                                            src={photo}
                                                            alt={`Photo ${i + 1}`}
                                                            width={80}
                                                            height={80}
                                                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div
                                                        key={i}
                                                        className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center"
                                                    >
                                                        <FaImage className="text-gray-300 text-xs" />
                                                    </div>
                                                )
                                            ))}
                                            {task.photos.length > 11 && (
                                                <div className="aspect-square bg-[#063A41] rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#052e33] transition-colors">
                                                    <span className="text-white text-xs font-semibold">
                                                        +{task.photos.length - 11}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Task Meta */}
                                <div className="flex flex-wrap items-center gap-4 pt-3 border-t text-xs text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <FaCalendarAlt />
                                        <span>Created {formatDate(task.createdAt)}</span>
                                    </div>
                                    {task.offerDeadline && (
                                        <div className="flex items-center gap-1">
                                            <FaClock />
                                            <span>Deadline {formatDate(task.offerDeadline)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {typeof window !== 'undefined' && createPortal(modalContent, document.body)}
        </>
    );
};

export default AllClientTasks;