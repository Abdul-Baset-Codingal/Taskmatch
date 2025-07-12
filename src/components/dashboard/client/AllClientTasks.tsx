"use client";
import React, { useState } from "react";
import {
    FaUsers,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaDollarSign,
    FaBookmark,
    FaChevronDown,
    FaClock,
    FaComments,
    FaInfoCircle,
    FaMoneyBill,
    FaUserCircle,
    FaClipboardList,
} from "react-icons/fa";

type Bid = {
    message: string;
    offerPrice: number;
};

type Reply = {
    message: string;
};

type Comment = {
    _id: string;
    message: string;
    replies?: Reply[];
};

type Client = {
    fullName?: string;
    email?: string;
};

type Task = {
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
}

const AllClientTasks: React.FC<AllClientTasksProps> = ({ task, idx, handleReplySubmit, handleCompleteStatus }) => {
    const [showBids, setShowBids] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [replyingTo, setReplyingTo] = useState<string | null>(null);

    if (!task) return null;

    return (
        <article
            key={idx}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] my-6"
        >
            <div className="flex flex-col lg:flex-row">
                {/* Left Panel */}
                <div className="bg-gradient-to-br from-purple-600 to-indigo-500 text-white p-6 lg:w-80 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <FaClipboardList className="text-lg" />
                            <p className="uppercase text-xs font-semibold tracking-widest">
                                {task.schedule || "Standard"}
                            </p>
                        </div>
                        <h3 className="text-2xl font-extrabold tracking-tight">{task.taskTitle}</h3>
                        <p className="text-sm mt-2 opacity-90">
                            Status: <span className="font-semibold">{task.status}</span>
                        </p>
                        <p className="text-sm mt-1 opacity-80">
                            Service: <span className="font-semibold">{task.serviceTitle}</span>
                        </p>
                    </div>
                    <div className="mt-4 flex flex-col gap-2">
                        {task.extraCharge && (
                            <span className="bg-yellow-400 text-gray-800 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                                <FaMoneyBill /> Extra Charge
                            </span>
                        )}
                        <div className="flex items-center gap-2 text-sm mt-2">
                            <FaClock />
                            <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="flex-1 p-6 lg:p-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800 tracking-tight">{task.taskTitle}</h2>
                        <div className="flex items-center gap-3">
                            <button className="text-gray-500 hover:text-purple-600 transition-transform hover:scale-110">
                                <FaBookmark className="text-lg" title="Bookmark Task" />
                            </button>
                        </div>
                    </div>

                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                        {task.taskDescription}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
                        <div className="flex items-center gap-2 bg-pink-50 border border-pink-200 px-4 py-2 rounded-xl">
                            <FaMapMarkerAlt className="text-pink-500" />
                            {task.location || "Remote"}
                        </div>
                        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-xl">
                            <FaCalendarAlt className="text-blue-500" />
                            Offer Deadline: {new Date(task.offerDeadline).toLocaleString()}
                        </div>
                        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-xl">
                            <FaInfoCircle className="text-indigo-500" />
                            {task.additionalInfo || "No additional info"}
                        </div>
                        <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 px-4 py-2 rounded-xl">
                            <FaDollarSign className="text-teal-500" />
                            Bids: {task.bids?.length || 0}
                        </div>
                    </div>

                    {/* Bids */}
                    {(task.bids?.length ?? 0) > 0 && (
                        <div className="mb-6">
                            <button
                                onClick={() => setShowBids(!showBids)}
                                className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-2"
                            >
                                <div className="flex items-center gap-2">
                                    <FaUsers className="text-purple-500" /> Bids
                                </div>
                                <FaChevronDown className={`transition-transform duration-300 ${showBids ? "rotate-180" : "rotate-0"}`} />
                            </button>
                            {showBids && (task.bids ?? []).map((bid, i) => (
                                <div key={i} className="flex items-center justify-between bg-purple-50 border border-purple-200 px-4 py-2 rounded-lg mb-2 text-sm">
                                    <span>💬 {bid.message}</span>
                                    <span className="font-semibold text-purple-700">${bid.offerPrice}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Comments */}
                    {(task.comments?.length ?? 0) > 0 && (
                        <div className="mb-6">
                            <button
                                onClick={() => setShowComments(!showComments)}
                                className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-2"
                            >
                                <div className="flex items-center gap-2">
                                    <FaComments className="text-green-600" /> Comments
                                </div>
                                <FaChevronDown className={`transition-transform duration-300 ${showComments ? "rotate-180" : "rotate-0"}`} />
                            </button>
                            {showComments && (task.comments ?? []).map((comment, i) => (
                                <div key={i} className="bg-green-50 border border-green-200 px-4 py-2 rounded-lg mb-2 text-sm">
                                    <p className="font-semibold">🗨️ {comment.message}</p>
                                    {(comment.replies && comment.replies.length > 0) && comment.replies.map((reply, j) => (
                                        <div key={j} className="ml-4 mt-2 pl-4 border-l-2 border-green-300 text-sm">
                                            <p className="text-gray-600">↪️ {reply.message}</p>
                                        </div>
                                    ))}
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            value={replyingTo === comment._id ? replyText : ""}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            onFocus={() => setReplyingTo(comment._id)}
                                            className="w-full px-3 py-1 rounded-md border border-gray-300 text-sm"
                                            placeholder="Reply to this comment"
                                        />
                                        <button
                                            className="mt-2 px-3 py-1  text-green-500 text-xs rounded font-bold"
                                            onClick={() => handleReplySubmit(task._id, comment._id, replyText)}
                                        >
                                            Reply
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Status Change */}
                    {/* Status Change */}
                    {task.status === "requested" && (
                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={() => handleCompleteStatus(task._id, "completed")}
                                aria-label="Mark task as completed"
                                className="flex items-center gap-2 px-5 py-3 
                 text-green-600 border-2 border-green-600 rounded-lg 
                 bg-white bg-opacity-10 backdrop-blur-sm 
                 hover:bg-opacity-20 transition ease-in-out duration-200
                 font-semibold text-sm"
                            >
                                <span className="text-lg">✅</span> Mark as Completed
                            </button>

                            <button
                                onClick={() => handleCompleteStatus(task._id, "not completed")}
                                aria-label="Mark task as not completed"
                                className="flex items-center gap-2 px-5 py-3 
                 text-red-600 border-2 border-red-600 rounded-lg 
                 bg-white bg-opacity-10 backdrop-blur-sm 
                 hover:bg-opacity-20 transition ease-in-out duration-200
                 font-semibold text-sm"
                            >
                                <span className="text-lg">❌</span> Not Completed
                            </button>
                        </div>
                    )}

                    {/* Client Info */}
                    <div className="flex items-center gap-3 border-t border-gray-200 pt-4">
                        <FaUserCircle className="text-2xl text-gray-500" />
                        <div>
                            <p className="text-sm text-gray-700 font-semibold">
                                {task.client?.fullName || "Unknown Client"}
                            </p>
                            <p className="text-xs text-gray-500">{task.client?.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default AllClientTasks;
