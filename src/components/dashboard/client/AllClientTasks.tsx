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
    FaUserCircle,
    FaEdit,
    FaCheckCircle,
    FaTimesCircle,
    FaImage,
    FaChevronDown,
    FaEllipsisH,
    FaTrash,
    FaFire,
    FaExpand,
    FaCompress,
    FaFile,
    FaInfoCircle,
    FaMoneyBillWave,
    FaComments,
    FaUser,
    FaStar,
    FaTimes,
} from "react-icons/fa";
import { useAddTaskReviewMutation, useDeleteTaskMutation } from "@/features/api/taskApi";
import { toast } from "react-toastify";
import BidCard from "./BidCard";
import { useGetUserByIdQuery } from "@/features/auth/authApi";
import CommentCard from "./CommentCard";

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
} | string; // Allow client to be an ObjectId string

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
    user: { _id: string; role: string } | null; // Allow user to be null
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
    const dropdownRef = useRef(null);
    const [deleteTask] = useDeleteTaskMutation();
    const { data: tasker } = useGetUserByIdQuery(task.acceptedBy || "", { skip: !task.acceptedBy });
    const [addTaskReview, { isLoading: isReviewing }] = useAddTaskReviewMutation();

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

    const getStatusBadge = (status: string) => {
        const configs = {
            completed: { bg: "bg-green-100", text: "text-green-800", dot: "bg-green-500" },
            "in progress": { bg: "bg-blue-100", text: "text-blue-800", dot: "bg-blue-500" },
            "not completed": { bg: "bg-red-100", text: "text-red-800", dot: "bg-red-500" },
            requested: { bg: "bg-yellow-100", text: "text-yellow-800", dot: "bg-yellow-500" },
            pending: { bg: "bg-yellow-100", text: "text-yellow-800", dot: "bg-yellow-500" },
            default: { bg: "bg-yellow-100", text: "text-yellow-800", dot: "bg-yellow-500" },
        };
        return configs[status as keyof typeof configs] || configs.default;
    };

    const statusConfig = getStatusBadge(task.status);

    // Review Modal Content
    const modalContent = (
        <div className={`fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out ${isReviewModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className={`bg-white rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg p-4 sm:p-6 transform transition-all duration-300 ease-in-out ${isReviewModalOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                        Add Review for {tasker?.fullName || "Tasker"}
                    </h3>
                    <button
                        onClick={() => setIsReviewModalOpen(false)}
                        className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                        <FaTimes className="text-lg sm:text-xl" />
                    </button>
                </div>
                <div className="space-y-4 sm:space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                        <div className="flex gap-1 sm:gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                    key={star}
                                    className={`text-2xl sm:text-3xl cursor-pointer transition-colors duration-200 ${star <= reviewFormData.rating ? "text-yellow-400" : "text-gray-300"
                                        }`}
                                    onClick={() => handleReviewInputChange({ target: { name: "rating", value: star } })}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Review Message</label>
                        <textarea
                            name="message"
                            value={reviewFormData.message}
                            onChange={handleReviewInputChange}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm sm:text-base p-3 sm:p-4"
                            rows={4}
                            required
                            placeholder="Share your experience..."
                        />
                    </div>
                    <div className="flex justify-end gap-2 sm:gap-3">
                        <button
                            onClick={() => setIsReviewModalOpen(false)}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 text-sm sm:text-base transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => handleReviewSubmit(task._id)}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 text-sm sm:text-base transition-all duration-200 disabled:opacity-50"
                            disabled={isReviewing}
                        >
                            {isReviewing ? "Submitting..." : "Submit Review"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Safely get client ID

    return (
        <>
            <div className="w-full px-2 xs:px-3 sm:px-4 lg:mx-auto lg:max-w-7xl lg:px-4">
                <div className="">
                    <div className="w-full mb-3 xs:mb-4 sm:mb-6">
                        <div
                            className={`relative bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-lg xs:rounded-xl sm:rounded-2xl border-2 shadow-lg hover:shadow-xl transition-all duration-500
                    ${isUrgent ? "border-red-400 shadow-red-200" : "border-blue-300 shadow-blue-100"} transform hover:-translate-y-1`}
                        >
                            {/* Header */}
                            <div className="p-2 xs:p-3 sm:p-4 lg:p-5">
                                {/* Status Badges - Always visible */}
                                <div className="flex items-center flex-wrap gap-1.5 xs:gap-2 sm:gap-3 mb-2 xs:mb-3">
                                    {isUrgent && (
                                        <span className="inline-flex items-center gap-1 xs:gap-1.5 px-2 xs:px-2.5 sm:px-3 py-1 xs:py-1.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full animate-pulse">
                                            <FaFire className="text-xs flex-shrink-0" />
                                            <span className="whitespace-nowrap">URGENT</span>
                                        </span>
                                    )}
                                    <span
                                        className={`inline-flex items-center gap-1 xs:gap-1.5 px-2 xs:px-2.5 sm:px-3 py-1 xs:py-1.5 text-xs font-semibold rounded-full whitespace-nowrap ${statusConfig.bg} ${statusConfig.text}`}
                                    >
                                        <span className={`w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full flex-shrink-0 ${statusConfig.dot}`}></span>
                                        {task.status}
                                    </span>
                                </div>

                                {/* Title and Menu Row */}
                                <div className="flex items-start gap-2 xs:gap-3 mb-2 xs:mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm xs:text-base sm:text-lg lg:text-xl font-bold text-gray-900 leading-tight mb-1 xs:mb-2 break-words">
                                            {task.taskTitle}
                                        </h3>
                                        <p className="text-xs xs:text-sm text-blue-700 font-medium break-words">
                                            {task.serviceTitle}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 flex-shrink-0">
                                        <button className="text-blue-600 hover:text-yellow-500 transition-colors duration-300 p-1 xs:p-1.5">
                                            <FaBookmark className="text-sm xs:text-base" />
                                        </button>
                                        <div className="relative" ref={dropdownRef}>
                                            <button
                                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                                className="text-blue-600 hover:text-blue-800 transition-colors duration-300 p-1 xs:p-1.5"
                                            >
                                                <FaEllipsisH className="text-sm xs:text-base" />
                                            </button>
                                            {isMenuOpen && (
                                                <div className="absolute right-0 top-full mt-1 xs:mt-2 w-36 xs:w-40 sm:w-44 bg-white border-2 border-blue-200 rounded-lg xs:rounded-xl shadow-2xl z-50">
                                                    <button
                                                        onClick={() => {
                                                            handleEditTask(task);
                                                            setIsMenuOpen(false);
                                                        }}
                                                        disabled={hasBids}
                                                        className="flex items-center gap-2 w-full px-3 xs:px-4 py-2 text-xs xs:text-sm text-blue-700 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-t-lg xs:rounded-t-xl"
                                                    >
                                                        <FaEdit className="text-sm flex-shrink-0 text-blue-500" />
                                                        <span>Edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteTask(task._id)}
                                                        disabled={hasBids}
                                                        className="flex items-center gap-2 w-full px-3 xs:px-4 py-2 text-xs xs:text-sm text-red-600 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-b-lg xs:rounded-b-xl"
                                                    >
                                                        <FaTrash className="text-sm flex-shrink-0 text-red-500" />
                                                        <span>Delete</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Info Grid - Responsive and always visible */}
                                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4">
                                    {/* Location */}
                                    <div className="flex items-center gap-2 text-gray-700 min-w-0 bg-gray-50 rounded-md p-2">
                                        <FaMapMarkerAlt className="text-blue-600 text-sm sm:text-base flex-shrink-0" />
                                        <span className="text-sm break-words font-medium">{task.location || "Remote"}</span>
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-md p-2 font-semibold">
                                        <FaDollarSign className="text-green-600 text-sm sm:text-base flex-shrink-0" />
                                        <span className="text-sm whitespace-nowrap">
                                            {task.price ? `$${task.price}` : "Open"}
                                        </span>
                                    </div>
                                    {/* Bids */}
                                    <div className="flex items-center gap-2 text-gray-700 bg-gray-50 rounded-md p-2">
                                        <FaUsers className="text-purple-600 text-sm sm:text-base flex-shrink-0" />
                                        <span className="text-sm font-medium whitespace-nowrap">
                                            {task.bids?.length || 0} bids
                                        </span>
                                    </div>

                                    {/* Estimated Time */}
                                    <div className="flex items-center gap-2 text-orange-700 bg-orange-50 rounded-md p-2">
                                        <FaClock className="text-orange-600 text-sm sm:text-base flex-shrink-0" />
                                        <span className="text-sm font-medium whitespace-nowrap">
                                            Est. Time: {task.estimatedTime || "Flexible"} hr
                                        </span>
                                    </div>
                                </div>

                                {/* Description Preview */}
                                {!isExpanded && (
                                    <div className="mb-3 xs:mb-4">
                                        <p className="text-xs xs:text-sm text-gray-700 leading-relaxed break-words">
                                            {task.taskDescription
                                                ? task.taskDescription.length > 100
                                                    ? `${task.taskDescription.substring(0, 100)}...`
                                                    : task.taskDescription
                                                : "No description provided"}
                                        </p>
                                    </div>
                                )}

                                {/* Client Info and Expand Button */}
                                <div className="flex items-center justify-between gap-2 mb-3 xs:mb-4">
                                    <div className="flex items-center gap-2 xs:gap-3 min-w-0 flex-1">
                                        <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <FaUserCircle className="text-blue-600 text-sm xs:text-base sm:text-lg" />
                                        </div>
                                        <span className="text-xs xs:text-sm text-gray-700 font-medium break-words">
                                            {typeof task.client === "string" ? "Anonymous Client" : task.client?.fullName || "Anonymous Client"}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setIsExpanded(!isExpanded)}
                                        className="flex items-center gap-1 xs:gap-1.5 text-xs xs:text-sm text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-300 flex-shrink-0 bg-blue-50 hover:bg-blue-100 px-2 xs:px-3 py-1 xs:py-1.5 rounded-md"
                                    >
                                        {isExpanded ? <FaCompress className="text-xs xs:text-sm" /> : <FaExpand className="text-xs xs:text-sm" />}
                                        <span>{isExpanded ? "Less" : "More"}</span>
                                    </button>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
                                    {task.status === "requested" && (
                                        <>
                                            <button
                                                onClick={() => handleCompleteStatus(task._id, "completed")}
                                                className="flex-1 flex items-center justify-center gap-1.5 xs:gap-2 px-3 xs:px-4 py-2 xs:py-2.5 bg-green-500 text-white text-xs xs:text-sm font-semibold rounded-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
                                            >
                                                <FaCheckCircle className="text-sm flex-shrink-0" />
                                                <span>Mark Complete</span>
                                            </button>
                                            <button
                                                onClick={() => handleCompleteStatus(task._id, "not completed")}
                                                className="flex-1 flex items-center justify-center gap-1.5 xs:gap-2 px-3 xs:px-4 py-2 xs:py-2.5 bg-red-500 text-white text-xs xs:text-sm font-semibold rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
                                            >
                                                <FaTimesCircle className="text-sm flex-shrink-0" />
                                                <span>Mark Incomplete</span>
                                            </button>
                                        </>
                                    )}
                                    {task.status === "completed" && (
                                        <button
                                            onClick={() => setIsReviewModalOpen(true)}
                                            className="flex-1 flex items-center justify-center gap-1.5 xs:gap-2 px-3 xs:px-4 py-2 xs:py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs xs:text-sm font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                                        >
                                            <FaStar className="text-sm flex-shrink-0" />
                                            <span>Add Review</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Expanded Content */}
                            {isExpanded && (
                                <div className="border-t border-blue-200 bg-gradient-to-b from-blue-50 to-white">
                                    <div className="p-2 xs:p-3 sm:p-4 lg:p-5 space-y-3 xs:space-y-4 sm:space-y-5">
                                        {/* Full Description */}
                                        <div className="bg-white rounded-lg p-3 xs:p-4 border border-blue-100">
                                            <h4 className="text-xs xs:text-sm font-bold text-gray-900 mb-2 xs:mb-3 flex items-center gap-2">
                                                <FaFile className="text-blue-600 flex-shrink-0" />
                                                Description
                                            </h4>
                                            <p className="text-xs xs:text-sm text-gray-700 leading-relaxed break-words">
                                                {task.taskDescription}
                                            </p>
                                        </div>

                                        {/* Additional Info */}
                                        {task.additionalInfo && (
                                            <div className="bg-white rounded-lg p-3 xs:p-4 border border-blue-100">
                                                <h4 className="text-xs xs:text-sm font-bold text-gray-900 mb-2 xs:mb-3 flex items-center gap-2">
                                                    <FaInfoCircle className="text-blue-600 flex-shrink-0" />
                                                    Additional Information
                                                </h4>
                                                <p className="text-xs xs:text-sm text-gray-700 leading-relaxed break-words">
                                                    {task.additionalInfo}
                                                </p>
                                            </div>
                                        )}

                                        {/* Media Gallery */}
                                        {task.photos?.length > 0 && (
                                            <div className="bg-white rounded-lg p-3 xs:p-4 border border-blue-100">
                                                <h4 className="text-xs xs:text-sm font-bold text-gray-900 mb-2 xs:mb-3 flex items-center gap-2">
                                                    <FaImage className="text-blue-600 flex-shrink-0" />
                                                    Photos ({task.photos.length})
                                                </h4>
                                                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 xs:gap-3">
                                                    {task.photos.slice(0, 8).map((photo: string, i: number) => (
                                                        isValidUrl(photo) ? (
                                                            <div
                                                                key={i}
                                                                className="aspect-square overflow-hidden rounded-lg border-2 border-blue-200 hover:border-blue-400 transition-all duration-300"
                                                            >
                                                                <Image
                                                                    src={photo}
                                                                    alt={`Task photo ${i + 1}`}
                                                                    width={100}
                                                                    height={100}
                                                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div
                                                                key={i}
                                                                className="aspect-square bg-blue-100 rounded-lg flex items-center justify-center border-2 border-blue-200"
                                                            >
                                                                <FaImage className="text-blue-500 text-sm xs:text-base" />
                                                            </div>
                                                        )
                                                    ))}
                                                    {task.photos.length > 8 && (
                                                        <div className="aspect-square bg-blue-100 rounded-lg flex items-center justify-center border-2 border-blue-200">
                                                            <span className="text-xs xs:text-sm text-blue-600 font-bold">
                                                                +{task.photos.length - 8}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Tasker Info */}
                                        {task.acceptedBy && (
                                            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 xs:p-4">
                                                <div className="flex items-start gap-3">
                                                    {tasker?.profilePicture ? (
                                                        <div className="w-10 h-10 rounded-full overflow-hidden border border-green-300">
                                                            <Image
                                                                src={tasker.profilePicture}
                                                                alt={tasker.fullName || "User"}
                                                                width={40}
                                                                height={40}
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center border border-green-300">
                                                            <FaUser className="text-green-600 text-lg" />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-bold text-gray-900">
                                                            {tasker?.fullName || "Anonymous"}
                                                        </p>
                                                        {tasker?.email && (
                                                            <p className="text-xs text-gray-600 break-words">
                                                                {tasker.email}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Bids Section */}
                                        {(task.bids?.length ?? 0) > 0 && (
                                            <div className="bg-white rounded-lg border border-blue-100">
                                                <button
                                                    onClick={() => setShowBids(!showBids)}
                                                    className="flex items-center justify-between w-full p-3 xs:p-4 text-xs xs:text-sm font-bold text-gray-900"
                                                >
                                                    <span className="flex items-center gap-2">
                                                        <FaMoneyBillWave className="text-green-600 flex-shrink-0" />
                                                        Bids ({task.bids?.length})
                                                    </span>
                                                    <FaChevronDown
                                                        className={`text-sm xs:text-base text-blue-600 transition-transform duration-300 ${showBids ? "rotate-180" : ""}`}
                                                    />
                                                </button>
                                                {showBids && (
                                                    <div className="px-3 xs:px-4 pb-3 xs:pb-4">
                                                        <div className="space-y-2 xs:space-y-3 max-h-40 xs:max-h-48 overflow-y-auto">
                                                            {task.bids?.map((bid, i) => (
                                                                <BidCard key={i} bid={bid} taskStatus={task.status} task={task} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Comments Section */}
                                        {(task.comments?.length ?? 0) > 0 && (
                                            <div className="bg-white rounded-lg border border-blue-100">
                                                <button
                                                    onClick={() => setShowComments(!showComments)}
                                                    className="flex items-center justify-between w-full p-3 xs:p-4 text-xs xs:text-sm font-bold text-gray-900"
                                                >
                                                    <span className="flex items-center gap-2">
                                                        <FaComments className="text-blue-600 flex-shrink-0" />
                                                        Comments ({task.comments?.length})
                                                    </span>
                                                    <FaChevronDown
                                                        className={`text-sm xs:text-base text-blue-600 transition-transform duration-300 ${showComments ? "rotate-180" : ""}`}
                                                    />
                                                </button>
                                                {showComments && (
                                                    <div className="px-3 xs:px-4 pb-3 xs:pb-4">
                                                        <div className="space-y-3 xs:space-y-4 max-h-48 xs:max-h-60 overflow-y-auto">
                                                            {task.comments &&
                                                                task.comments.map((comment, i) => (
                                                                    <CommentCard
                                                                        key={i}
                                                                        taskId={task._id}
                                                                        comment={comment}
                                                                        replyingTo={replyingTo}
                                                                        replyText={replyText}
                                                                        setReplyingTo={setReplyingTo}
                                                                        setReplyText={setReplyText}
                                                                        handleReplySubmit={handleReplySubmit}
                                                                    />
                                                                ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <style jsx>{`
            /* Custom breakpoint for very small screens */
            @media (min-width: 375px) {
              .xs\\:px-3 {
                padding-left: 0.75rem;
                padding-right: 0.75rem;
              }
              .xs\\:px-4 {
                padding-left: 1rem;
                padding-right: 1rem;
              }
              .xs\\:py-1\\.5 {
                padding-top: 0.375rem;
                padding-bottom: 0.375rem;
              }
              .xs\\:py-2 {
                padding-top: 0.5rem;
                padding-bottom: 0.5rem;
              }
              .xs\\:p-3 {
                padding: 0.75rem;
              }
              .xs\\:p-4 {
                padding: 1rem;
              }
              .xs\\:gap-2 {
                gap: 0.5rem;
              }
              .xs\\:gap-3 {
                gap: 0.75rem;
              }
              .xs\\:mb-3 {
                margin-bottom: 0.75rem;
              }
              .xs\\:mb-4 {
                margin-bottom: 1rem;
              }
              .xs\\:text-sm {
                font-size: 0.875rem;
                line-height: 1.25rem;
              }
              .xs\\:text-base {
                font-size: 1rem;
                line-height: 1.5rem;
              }
              .xs\\:w-7 {
                width: 1.75rem;
              }
              .xs\\:h-7 {
                height: 1.75rem;
              }
              .xs\\:w-2 {
                width: 0.5rem;
              }
              .xs\\:h-2 {
                height: 0.5rem;
              }
              .xs\\:rounded-xl {
                border-radius: 0.75rem;
              }
              .xs\\:flex-row {
                flex-direction: row;
              }
              .xs\\:grid-cols-2 {
                grid-template-columns: repeat(2, minmax(0, 1fr));
              }
              .xs\\:grid-cols-3 {
                grid-template-columns: repeat(3, minmax(0, 1fr));
              }
              .xs\\:max-h-48 {
                max-height: 12rem;
              }
              .xs\\:max-h-60 {
                max-height: 15rem;
              }
              .xs\\:space-y-3 > :not([hidden]) ~ :not([hidden]) {
                margin-top: 0.75rem;
              }
              .xs\\:space-y-4 > :not([hidden]) ~ :not([hidden]) {
                margin-top: 1rem;
              }
            }

            .break-words {
              word-wrap: break-word;
              word-break: break-word;
              overflow-wrap: break-word;
              hyphens: auto;
            }

            .truncate {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            @media (min-width: 768px) {
              .max-w-7xl {
                max-width: 80rem;
              }
            }

            /* Ensure touch targets are large enough on mobile */
            @media (max-width: 640px) {
              button {
                min-height: 44px;
              }
              input {
                min-height: 44px;
              }
            }
          `}</style>
                </div>
            </div>
            {createPortal(modalContent, document.body)}
        </>
    );
};

export default AllClientTasks;