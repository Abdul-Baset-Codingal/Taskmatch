/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import Image from 'next/image';
import { FaBookmark, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaDollarSign, FaMoneyBill, FaInfoCircle, FaUsers, FaComments, FaUserCircle, FaEdit, FaCheckCircle, FaTimesCircle, FaExclamationCircle, FaImage, FaUserCheck, FaChevronDown, FaEllipsisH, FaTrash } from 'react-icons/fa';
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { useDeleteTaskMutation } from "@/features/api/taskApi";
import { toast } from "react-toastify";

type Bid = {
    createdAt: string | number | Date;
    message: string;
    offerPrice: number;
};
interface AcceptedUser {
    fullName?: string;
    email?: string;
}
type Reply = {
    role: any;
    createdAt: string | number | Date;
    message: string;
};

type Comment = {
    role: any;
    createdAt: string | number | Date;
    _id: string;
    message: string;
    replies?: Reply[];
};

type Client = {
    fullName?: string;
    email?: string;
};

type Task = {
    serviceId: ReactNode;
    acceptedBy?: AcceptedUser;
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
    handleReplySubmit: (taskId: string, commentId: string, replyText: string) => void;
    handleCompleteStatus: (taskId: string, status: string) => void;
    handleEditTask: (task: Task) => void;
}

const AllClientTasks: React.FC<AllClientTasksProps> = ({
    task,
    idx,
    handleReplySubmit,
    handleCompleteStatus,
    handleEditTask,
}) => {
    const [showBids, setShowBids] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [replyingTo, setReplyingTo] = useState<string | null>(null);

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: { target: any; }) => {
            // @ts-ignore


            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    // Your delete mutation hook
    const [deleteTask] = useDeleteTaskMutation();

    const handleDeleteTask = async (taskId: string) => {
        try {
            await deleteTask(taskId).unwrap();
            toast.success("Task Deleted succesfully!")
        } catch (error) {
            // Optional: Add error handling/notification
            console.error('Failed to delete task:', error);
        }
        setIsOpen(false);
    };
    if (!task) return null;
    // Utility function to validate URLs
    const isValidUrl = (url: string | boolean | URL): boolean => {
        if (typeof url === "boolean") return false; // filter out boolean first

        try {
            new URL(url); // now url is string | URL only
            return true;
        } catch {
            return false;
        }
    };

    console.log(task)

    const hasBids = (task.bids?.length ?? 0) > 0;

    return (
        <article
            key={idx}
            className={`relative bg-white rounded-xl shadow-xl border ${task.schedule === "Urgent" ? "border-red-500 shadow-red-300" : "border-gray-200"} overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] my-8 max-w-6xl mx-auto`}
        >
            {/* Urgent Task Indicator */}
            {task.schedule === "Urgent" && (
                <div className="absolute top-0 left-0 bg-red-600 text-white text-sm font-bold px-4 py-1.5 rounded-br-xl flex items-center gap-2">
                    <FaExclamationCircle /> URGENT
                </div>
            )}

            <div className="p-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-gray-100 pb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{task.taskTitle}</h2>
                        <p className="text-base text-gray-600 mt-2 flex items-center gap-2">
                            <FaInfoCircle className="text-indigo-500" />
                            {task.serviceTitle} (ID: {task.serviceId})
                        </p>
                    </div>
                    <div className="flex items-center gap-6 mt-4 sm:mt-0">
                        <button className="text-gray-600 hover:text-indigo-500 transition-colors" title="Bookmark Task">
                            <FaBookmark className="text-xl" />
                        </button>
                        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold ${task.status === "completed" ? "bg-green-100 text-green-700" : task.status === "in progress" ? "bg-blue-100 text-blue-700" : task.status === "not completed" ? "bg-red-100 text-red-700" : task.status === "requested" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"}`}>
                            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </span>
                    </div>
                    
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Description, Media, and Accepted By */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description */}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <FaInfoCircle className="text-indigo-500" /> Description
                            </h3>
                            <p className="text-gray-600 text-base leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
                                {task.taskDescription}
                            </p>
                        </div>

                        {/* Media */}
                        {(task.photos?.length > 0 || task.video) && (
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <FaImage className="text-teal-500" /> Media
                                </h3>
                                <div className="flex flex-wrap gap-4">
                                    {task.photos?.map((photo: string | boolean | URL | StaticImport, i: number) => {
                                        // Skip invalid photo types early
                                        if (typeof photo !== "string") {
                                            return (
                                                <div
                                                    key={i}
                                                    className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm"
                                                >
                                                    Invalid Image
                                                </div>
                                            );
                                        }

                                        return isValidUrl(photo) ? (
                                            <Image
                                                key={i}
                                                src={photo}
                                                alt={`Task photo ${i + 1}`} // ✅ Now safe
                                                width={120}
                                                height={120}
                                                className="object-cover rounded-lg border border-gray-200 shadow-sm"
                                                priority={i === 0}
                                            />
                                        ) : (
                                            <div
                                                key={i}
                                                className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm"
                                            >
                                                Invalid Image
                                            </div>
                                        );
                                    })}

                                </div>

                            </div>
                        )}

                        {/* Accepted By */}
                        {task.acceptedBy && (
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <FaUserCheck className="text-green-500" /> Accepted By
                                </h3>
                                <div className="bg-green-50 p-4 rounded-lg border border-green-200 flex items-center gap-3">
                                    <FaUserCircle className="text-2xl text-green-500" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">

                                            {task.acceptedBy?.fullName || "Unknown Tasker"}
                                        </p>
                                        <p className="text-xs text-gray-500">{task.acceptedBy?.email || "No email provided"}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Task Details */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <FaInfoCircle className="text-indigo-500" /> Task Details
                            </h3>
                            <div className="space-y-4 text-sm text-gray-700">
                                <div className="flex items-center gap-3">
                                    <FaMapMarkerAlt className="text-blue-500" />
                                    <span><strong>Location:</strong> {task.location}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FaCalendarAlt className="text-teal-500" />
                                    <span><strong>Schedule:</strong> {task.schedule}</span>
                                </div>
                                {task.offerDeadline && (
                                    <div className="flex items-center gap-3">
                                        <FaClock className="text-indigo-500" />
                                        <span><strong>Offer Deadline:</strong> {new Date(task.offerDeadline).toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3">
                                    <FaDollarSign className="text-green-500" />
                                    <span><strong>Price:</strong> {task.price ? `$${task.price}` : "Not specified"}</span>
                                </div>
                                {task.extraCharge && (
                                    <div className="flex items-center gap-3">
                                        <FaMoneyBill className="text-amber-500" />
                                        <span><strong>Extra Charge:</strong> Yes</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3">
                                    <FaInfoCircle className="text-purple-500" />
                                    <span><strong>Additional Info:</strong> {task.additionalInfo || "None"}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FaUsers className="text-blue-500" />
                                    <span><strong>Bids:</strong> {task.bids?.length || 0}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FaClock className="text-gray-500" />
                                    <span><strong>Created:</strong> {new Date(task.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FaClock className="text-gray-500" />
                                    <span><strong>Updated:</strong> {new Date(task.updatedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bids Section */}
                {(task.bids?.length ?? 0) > 0 && (
                    <div className="mt-10">
                        <button
                            onClick={() => setShowBids(!showBids)}
                            className="flex items-center justify-between w-full text-xl font-semibold text-gray-800 mb-4 hover:text-indigo-600 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <FaUsers className="text-indigo-500" /> Bids ({task.bids?.length})
                            </div>
                            <FaChevronDown
                                className={`transition-transform duration-300 ${showBids ? "rotate-180" : "rotate-0"}`}
                            />
                        </button>
                        {showBids &&
                            (task.bids ?? []).map((bid, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between bg-indigo-50 border border-indigo-100 px-5 py-3 rounded-lg mb-3 text-sm shadow-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <FaUserCircle className="text-indigo-500" />
                                        <span>{bid.message || "No message"}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-semibold text-indigo-700">${bid.offerPrice}</span>
                                        <span className="text-xs text-gray-500">{new Date(bid.createdAt).toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}

                {/* Comments Section */}
                {(task.comments?.length ?? 0) > 0 && (
                    <div className="mt-10">
                        <button
                            onClick={() => setShowComments(!showComments)}
                            className="flex items-center justify-between w-full text-xl font-semibold text-gray-800 mb-4 hover:text-green-600 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <FaComments className="text-green-600" /> Comments ({task.comments?.length})
                            </div>
                            <FaChevronDown
                                className={`transition-transform duration-300 ${showComments ? "rotate-180" : "rotate-0"}`}
                            />
                        </button>
                        {showComments &&
                            (task.comments ?? []).map((comment, i) => (
                                <div
                                    key={i}
                                    className="bg-green-50 border border-green-100 px-5 py-4 rounded-lg mb-4 shadow-sm"
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <FaUserCircle className="text-green-600 text-xl" />
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">
                                                {comment.role.charAt(0).toUpperCase() + comment.role.slice(1)}: {comment.message}
                                            </p>
                                            <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    {Array.isArray(comment.replies) && comment.replies.length > 0 && (
                                        <div className="ml-8 mt-3">
                                            {comment.replies.map((reply, j) => (
                                                <div
                                                    key={j}
                                                    className="pl-4 border-l-2 border-green-200 text-sm mb-3"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <FaUserCircle className="text-green-500" />
                                                        <div>
                                                            <p className="text-gray-600">
                                                                {reply.role.charAt(0).toUpperCase() + reply.role.slice(1)}: {reply.message}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {new Date(reply.createdAt).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="mt-4">
                                        <input
                                            type="text"
                                            value={replyingTo === comment._id ? replyText : ""}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            onFocus={() => setReplyingTo(comment._id)}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 transition-colors"
                                            placeholder="Reply to this comment"
                                        />
                                        <button
                                            className="mt-3 px-5 py-1.5 text-green-600 text-sm font-semibold rounded-lg hover:bg-green-100 transition-colors"
                                            onClick={() => handleReplySubmit(task._id, comment._id, replyText)}
                                        >
                                            Reply
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}

                {/* Actions and Client Info */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mt-10 pt-6 border-t border-gray-200">
                    <div className="flex flex-wrap gap-4 mb-6 lg:mb-0">
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                disabled={hasBids}
                                className={`flex items-center gap-3 px-6 py-2.5 text-yellow-600 border border-yellow-500 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition ease-in-out duration-200 font-semibold text-sm shadow-sm ${hasBids ? 'opacity-50 cursor-not-allowed bg-gray-200 border-gray-300 text-gray-500' : ''
                                    }`}
                            >
                                <FaEllipsisH className="text-lg" /> More Options
                            </button>

                            {isOpen && !hasBids && (
                                <div className="absolute bottom-full left-0 mb-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-visible">
                                    <button
                                        onClick={() => {
                                            handleEditTask(task);
                                            setIsOpen(false);
                                        }}
                                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                                    >
                                        <FaEdit className="text-base" /> Edit Task
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleDeleteTask(task._id);
                                            setIsOpen(false);
                                        }}
                                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                                    >
                                        <FaTrash className="text-base" /> Delete Task
                                    </button>
                                </div>
                            )}
                        </div>
                        {task.status === "requested" && (
                            <>
                                <button
                                    onClick={() => handleCompleteStatus(task._id, "completed")}
                                    aria-label="Mark task as completed"
                                    className="flex items-center gap-3 px-6 py-2.5 text-green-600 border border-green-500 rounded-lg bg-green-50 hover:bg-green-100 transition ease-in-out duration-200 font-semibold text-sm shadow-sm"
                                >
                                    <FaCheckCircle className="text-lg" /> Mark as Completed
                                </button>
                                <button
                                    onClick={() => handleCompleteStatus(task._id, "not completed")}
                                    aria-label="Mark task as not completed"
                                    className="flex items-center gap-3 px-6 py-2.5 text-red-600 border border-red-500 rounded-lg bg-red-50 hover:bg-red-100 transition ease-in-out duration-200 font-semibold text-sm shadow-sm"
                                >
                                    <FaTimesCircle className="text-lg" /> Not Completed
                                </button>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <FaUserCircle className="text-3xl text-gray-500" />
                        <div>
                            <p className="text-base font-semibold text-gray-800">
                                {task.client?.fullName || "Unknown Client"}
                            </p>
                            <p className="text-sm text-gray-500">{task.client?.email || "No email provided"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default AllClientTasks;
