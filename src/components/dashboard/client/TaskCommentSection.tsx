// components/TaskCommentSection.tsx
"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
    FaUser,
    FaComments,
    FaChevronDown,
    FaReply,
    FaPaperPlane,
    FaClock,
} from "react-icons/fa";
import { useGetUserByIdQuery } from "@/features/auth/authApi";

// Types
interface Reply {
    _id?: string;
    userId: string;
    role: "client" | "tasker";
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
    message: string;
    createdAt: string;
    isBlocked?: boolean;
}

interface Comment {
    _id: string;
    userId: string;
    role: "client" | "tasker";
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
    message: string;
    createdAt: string;
    isBlocked?: boolean;
    replies?: Reply[];
}

interface User {
    _id: string;
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
    currentRole?: string;
}

interface TaskCommentSectionProps {
    taskId: string;
    comments: Comment[];
    currentUser: User | null;
    onAddComment: (taskId: string, message: string) => Promise<void>;
    onReplyToComment: (taskId: string, commentId: string, message: string) => Promise<void>;
    isLoading?: boolean;
    maxHeight?: string;
    showAddComment?: boolean;
}

// Helper function for formatting dates
const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// Avatar colors for users without profile pictures
const avatarColors = [
    "from-[#109C3D] to-[#063A41]",
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-pink-500",
    "from-amber-500 to-orange-500",
    "from-cyan-500 to-teal-500",
];

const getAvatarColor = (index: number): string => {
    return avatarColors[index % avatarColors.length];
};

// Role badge styling
const getRoleBadgeStyle = (role: string): string => {
    return role === "client"
        ? "bg-blue-100 text-blue-700 border border-blue-200"
        : "bg-emerald-100 text-emerald-700 border border-emerald-200";
};

// ============================================
// Avatar Component with data fetching
// ============================================
const CommentAvatar = ({
    userId,
    firstName,
    lastName,
    profilePicture,
    size = "md",
    colorIndex = 0,
}: {
    userId?: string;
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
    size?: "sm" | "md" | "lg";
    colorIndex?: number;
}) => {
    // Fetch user data if only userId is provided
    const { data: userResponse } = useGetUserByIdQuery(userId || "", {
        skip: !userId || (!!firstName && !!profilePicture),
    });

    const user = userResponse?.user;
    const displayFirstName = firstName || user?.firstName;
    const displayLastName = lastName || user?.lastName;
    const displayPicture = profilePicture || user?.profilePicture;

    const sizeClasses = {
        sm: "w-7 h-7 text-[10px]",
        md: "w-9 h-9 text-xs",
        lg: "w-11 h-11 text-sm",
    };

    const initials = displayFirstName?.charAt(0)?.toUpperCase() || "U";

    return (
        <div
            className={`${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white shadow-sm`}
            title={`${displayFirstName || ""} ${displayLastName || ""}`}
        >
            {displayPicture ? (
                <Image
                    src={displayPicture}
                    alt={`${displayFirstName} ${displayLastName}`}
                    width={44}
                    height={44}
                    className="w-full h-full object-cover"
                />
            ) : (
                <div
                    className={`w-full h-full bg-gradient-to-br ${getAvatarColor(colorIndex)} flex items-center justify-center`}
                >
                    <span className="text-white font-bold">{initials}</span>
                </div>
            )}
        </div>
    );
};

// ============================================
// Single Reply Component
// ============================================
const ReplyItem = ({
    reply,
    index,
}: {
    reply: Reply;
    index: number;
}) => {
    const { data: userResponse } = useGetUserByIdQuery(reply.userId || "", {
        skip: !reply.userId,
    });

    const user = userResponse?.user;
    const displayName = reply.firstName || user?.firstName || "User";
    const displayLastName = reply.lastName || user?.lastName || "";

    console.log("reply", reply)

    if (reply.isBlocked) return null;

    return (
        <div className="flex gap-2.5 py-2.5 group animate-fadeIn">
            <CommentAvatar
                userId={reply.userId}
                firstName={reply.firstName}
                lastName={reply.lastName}
                profilePicture={reply.profilePicture}
                size="sm"
                colorIndex={index + 3}
            />
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-semibold text-xs text-[#063A41]">
                        {displayName} {displayLastName}
                    </span>
                    <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${getRoleBadgeStyle(reply.role)}`}
                    >
                        {reply.role === "client" ? "Client" : "Tasker"}
                    </span>
                    <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                        <FaClock size={9} />
                        {formatRelativeTime(reply.createdAt)}
                    </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed break-words">
                    {reply.message}
                </p>
            </div>
        </div>
    );
};

// ============================================
// Single Comment Component
// ============================================
const CommentItem = ({
    comment,
    taskId,
    currentUser,
    onReply,
    isReplying,
    commentIndex,
}: {
    comment: Comment;
    taskId: string;
    currentUser: User | null;
    onReply: (commentId: string, message: string) => Promise<void>;
    isReplying: boolean;
    commentIndex: number;
}) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyMessage, setReplyMessage] = useState("");
    const [showReplies, setShowReplies] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: userResponse } = useGetUserByIdQuery(comment.userId || "", {
        skip: !comment.userId,
    });

    const user = userResponse?.user;
    const displayName = comment.firstName || user?.firstName || "User";
    const displayLastName = comment.lastName || user?.lastName || "";
    const displayPicture = comment.profilePicture || user?.profilePicture;

    const handleSubmitReply = async () => {
        if (!replyMessage.trim()) return;
        setIsSubmitting(true);
        try {
            await onReply(comment._id, replyMessage);
            setReplyMessage("");
            setShowReplyForm(false);
            setShowReplies(true);
        } catch (error) {
            console.error("Failed to submit reply:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (comment.isBlocked) return null;

    const validReplies = comment.replies?.filter((r) => !r.isBlocked) || [];
    const hasReplies = validReplies.length > 0;

    return (
        <div className="border-b border-gray-100 last:border-b-0 py-4 first:pt-0">
            <div className="flex gap-3">
                <CommentAvatar
                    userId={comment.userId}
                    firstName={comment.firstName}
                    lastName={comment.lastName}
                    profilePicture={displayPicture}
                    size="lg"
                    colorIndex={commentIndex}
                />
                <div className="flex-1 min-w-0">
                    {/* Comment Header */}
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className="font-semibold text-sm text-[#063A41]">
                            {displayName} {displayLastName}
                        </span>
                        <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getRoleBadgeStyle(comment.role)}`}
                        >
                            {comment.role === "client" ? "Client" : "Tasker"}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                            <FaClock size={10} />
                            {formatRelativeTime(comment.createdAt)}
                        </span>
                    </div>

                    {/* Comment Message */}
                    <p className="text-sm text-gray-700 leading-relaxed mb-2.5 break-words">
                        {comment.message}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4">
                        {currentUser && (
                            <button
                                onClick={() => setShowReplyForm(!showReplyForm)}
                                className="text-xs text-[#109C3D] hover:text-[#063A41] font-medium flex items-center gap-1 transition-colors"
                            >
                                <FaReply size={11} />
                                {showReplyForm ? "Cancel" : "Reply"}
                            </button>
                        )}

                        {hasReplies && (
                            <button
                                onClick={() => setShowReplies(!showReplies)}
                                className="text-xs text-gray-500 hover:text-[#109C3D] font-medium flex items-center gap-1 transition-colors"
                            >
                                <FaChevronDown
                                    size={12}
                                    className={`transform transition-transform duration-200 ${showReplies ? "rotate-180" : ""}`}
                                />
                                {showReplies ? "Hide" : "View"} {validReplies.length}{" "}
                                {validReplies.length === 1 ? "reply" : "replies"}
                            </button>
                        )}
                    </div>

                    {/* Reply Form */}
                    {showReplyForm && currentUser && (
                        <div className="mt-3 flex gap-2 items-start animate-fadeIn">
                            <CommentAvatar
                                firstName={currentUser.firstName}
                                lastName={currentUser.lastName}
                                profilePicture={currentUser.profilePicture}
                                size="sm"
                                colorIndex={99}
                            />
                            <div className="flex-1 flex gap-2">
                                <input
                                    type="text"
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    placeholder={`Reply to ${displayName}...`}
                                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#109C3D] focus:ring-2 focus:ring-[#109C3D]/20 transition-all bg-white"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSubmitReply();
                                        }
                                    }}
                                    disabled={isSubmitting}
                                    autoFocus
                                />
                                <button
                                    onClick={handleSubmitReply}
                                    disabled={isSubmitting || !replyMessage.trim()}
                                    className="px-3 py-2 bg-[#109C3D] text-white rounded-lg text-sm font-medium hover:bg-[#0d8a35] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-[40px]"
                                >
                                    {isSubmitting ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <FaPaperPlane size={12} />
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Replies List */}
                    {hasReplies && showReplies && (
                        <div className="mt-3 pl-3 border-l-2 border-[#109C3D]/20 animate-fadeIn">
                            {validReplies.map((reply, idx) => (
                                <ReplyItem
                                    key={reply._id || `reply-${idx}`}
                                    reply={reply}
                                    index={idx}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ============================================
// Main TaskCommentSection Component
// ============================================
const TaskCommentSection: React.FC<TaskCommentSectionProps> = ({
    taskId,
    comments = [],
    currentUser,
    onAddComment,
    onReplyToComment,
    isLoading = false,
    maxHeight = "300px",
    showAddComment = true,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validComments = comments.filter((c) => !c.isBlocked);
    const commentCount = validComments.length;

    const handleAddComment = async () => {
        if (!newComment.trim() || !currentUser) return;
        setIsSubmitting(true);
        try {
            await onAddComment(taskId, newComment);
            setNewComment("");
            setIsExpanded(true); // Show comments after adding
        } catch (error) {
            console.error("Failed to add comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReply = async (commentId: string, message: string) => {
        await onReplyToComment(taskId, commentId, message);
    };

    return (
        <div className="border-t border-gray-100">
            {/* Header - Toggle Button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#109C3D]/20 to-[#063A41]/20 flex items-center justify-center">
                        <FaComments className="text-[#109C3D]" size={14} />
                    </div>
                    <span className="text-sm font-semibold text-[#063A41]">
                        Comments {commentCount > 0 && `(${commentCount})`}
                    </span>
                </div>
                <FaChevronDown
                    className={`text-gray-400 transform transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                    size={16}
                />
            </button>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="px-4 pb-4 animate-fadeIn">
                    {/* Add Comment Form */}
                    {showAddComment && currentUser && (
                        <div className="mb-4 pb-4 border-b border-gray-100">
                            <div className="flex gap-3">
                                <CommentAvatar
                                    firstName={currentUser.firstName}
                                    lastName={currentUser.lastName}
                                    profilePicture={currentUser.profilePicture}
                                    size="md"
                                    colorIndex={0}
                                />
                                <div className="flex-1">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Add a comment..."
                                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#109C3D] focus:ring-2 focus:ring-[#109C3D]/20 transition-all bg-white resize-none"
                                        rows={2}
                                        disabled={isSubmitting}
                                    />
                                    <div className="flex justify-end mt-2">
                                        <button
                                            onClick={handleAddComment}
                                            disabled={isSubmitting || !newComment.trim()}
                                            className="px-4 py-2 bg-gradient-to-r from-[#109C3D] to-[#063A41] text-white rounded-lg text-sm font-medium hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Posting...
                                                </>
                                            ) : (
                                                <>
                                                    <FaPaperPlane size={12} />
                                                    Post Comment
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Login Prompt */}
                    {showAddComment && !currentUser && (
                        <div className="mb-4 p-4 bg-gray-50 rounded-xl text-center border border-dashed border-gray-200">
                            <FaUser className="mx-auto text-gray-400 mb-2" size={20} />
                            <p className="text-sm text-gray-600">
                                Log in to add comments
                            </p>
                        </div>
                    )}

                    {/* Comments List */}
                    {commentCount > 0 ? (
                        <div
                            className="space-y-0 overflow-y-auto custom-scrollbar"
                            style={{ maxHeight }}
                        >
                            {validComments.map((comment, index) => (
                                <CommentItem
                                    key={comment._id}
                                    comment={comment}
                                    taskId={taskId}
                                    currentUser={currentUser}
                                    onReply={handleReply}
                                    isReplying={isLoading}
                                    commentIndex={index}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                                <FaComments className="text-gray-400" size={20} />
                            </div>
                            <p className="text-sm text-gray-500">No comments yet</p>
                            <p className="text-xs text-gray-400 mt-1">
                                Be the first to start a conversation
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Styles */}
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
            `}</style>
        </div>
    );
};

export default TaskCommentSection;