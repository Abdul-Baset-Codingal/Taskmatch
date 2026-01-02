// CommentSection.tsx
import React, { useState } from "react";
import {
    FiMessageCircle,
    FiChevronDown,
    FiSend,
    FiCornerDownRight,
    FiLock,
    FiClock,
} from "react-icons/fi";

// ============================================
// TYPES - Updated to handle populated userId
// ============================================
interface PopulatedUser {
    _id: string;
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
    email?: string;
}

interface ReplyType {
    _id?: string;
    userId: string | PopulatedUser;  // Can be string or populated object
    role: "client" | "tasker";
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
    message: string;
    createdAt: string;
    isBlocked?: boolean;
}

interface CommentType {
    _id: string;
    userId: string | PopulatedUser;  // Can be string or populated object
    role: "client" | "tasker";
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
    email?: string;
    message: string;
    createdAt: string;
    isBlocked?: boolean;
    replies?: ReplyType[];
}

interface UserType {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    currentRole: string;
    profilePicture?: string;
}

interface TaskType {
    _id: string;
    taskTitle: string;
    comments?: CommentType[];
    [key: string]: any;
}

// ============================================
// HELPER FUNCTIONS
// ============================================
const formatDate = (dateString: string): string => {
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
    if (diffDays < 30) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
};

const getRoleBadgeStyle = (role: string): string => {
    return role === "client"
        ? "bg-blue-100 text-blue-700 border border-blue-200"
        : "bg-emerald-100 text-emerald-700 border border-emerald-200";
};

const avatarColors = [
    "from-[#109C3D] to-[#063A41]",
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-pink-500",
    "from-amber-500 to-orange-500",
    "from-cyan-500 to-teal-500",
    "from-rose-500 to-red-500",
];

const getAvatarColor = (index: number): string => {
    return avatarColors[index % avatarColors.length];
};

// ============================================
// NEW HELPER: Extract user data from comment/reply
// ============================================
const getUserData = (item: CommentType | ReplyType): {
    firstName: string;
    lastName: string;
    profilePicture?: string;
} => {
    // Check if userId is a populated object
    if (typeof item.userId === 'object' && item.userId !== null) {
        return {
            firstName: item.userId.firstName || item.firstName || "User",
            lastName: item.userId.lastName || item.lastName || "",
            profilePicture: item.userId.profilePicture || item.profilePicture,
        };
    }

    // Fallback to top-level properties
    return {
        firstName: item.firstName || "User",
        lastName: item.lastName || "",
        profilePicture: item.profilePicture,
    };
};

// ============================================
// AVATAR COMPONENT
// ============================================
const Avatar = ({
    firstName,
    lastName,
    profilePicture,
    size = "md",
    colorIndex = 0,
}: {
    firstName?: string;
    lastName?: string;
    profilePicture?: string | null;
    size?: "xs" | "sm" | "md" | "lg";
    colorIndex?: number;
}) => {
    const sizeClasses = {
        xs: "w-5 h-5 text-[8px]",
        sm: "w-6 h-6 text-[10px]",
        md: "w-8 h-8 text-xs",
        lg: "w-10 h-10 text-sm",
    };

    const initials = firstName?.charAt(0)?.toUpperCase() || "U";

    return (
        <div
            className={`${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white shadow-sm`}
            title={`${firstName || ""} ${lastName || ""}`}
        >
            {profilePicture ? (
                <img
                    src={profilePicture}
                    alt={`${firstName} ${lastName}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                    }}
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
// REPLY ITEM COMPONENT - Updated
// ============================================
const ReplyItem = ({
    reply,
    index,
}: {
    reply: ReplyType;
    index: number;
}) => {
    if (reply.isBlocked) return null;

    // Extract user data (handles both populated and non-populated)
    const userData = getUserData(reply);

    return (
        <div className="flex gap-2.5 py-2.5 group">
            {/* Avatar */}
            <Avatar
                firstName={userData.firstName}
                lastName={userData.lastName}
                profilePicture={userData.profilePicture}
                size="sm"
                colorIndex={index + 3}
            />

            {/* Reply Content */}
            <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-semibold text-xs text-[#063A41]">
                        {userData.firstName} {userData.lastName}
                    </span>
                    <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${getRoleBadgeStyle(reply.role)}`}
                    >
                        {reply.role === "client" ? "Client" : "Tasker"}
                    </span>
                    <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                        <FiClock size={10} />
                        {formatDate(reply.createdAt)}
                    </span>
                </div>

                {/* Message */}
                <p className="text-xs text-gray-600 leading-relaxed">
                    {reply.message}
                </p>
            </div>
        </div>
    );
};

// ============================================
// COMMENT ITEM COMPONENT - Updated
// ============================================
const CommentItem = ({
    comment,
    taskId,
    user,
    onReply,
    isReplying,
    commentIndex,
}: {
    comment: CommentType;
    taskId: string;
    user: UserType | null;
    onReply: (commentId: string, message: string) => Promise<void>;
    isReplying: boolean;
    commentIndex: number;
}) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyMessage, setReplyMessage] = useState("");
    const [showReplies, setShowReplies] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Extract user data (handles both populated and non-populated)
    const userData = getUserData(comment);

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
            {/* Main Comment */}
            <div className="flex gap-3">
                {/* Commenter Avatar */}
                <Avatar
                    firstName={userData.firstName}
                    lastName={userData.lastName}
                    profilePicture={userData.profilePicture}
                    size="lg"
                    colorIndex={commentIndex}
                />

                {/* Comment Content */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className="font-semibold text-sm text-[#063A41]">
                            {userData.firstName} {userData.lastName}
                        </span>
                        <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getRoleBadgeStyle(comment.role)}`}
                        >
                            {comment.role === "client" ? "Client" : "Tasker"}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                            <FiClock size={11} />
                            {formatDate(comment.createdAt)}
                        </span>
                    </div>

                    {/* Message */}
                    <p className="text-sm text-gray-700 leading-relaxed mb-2.5">
                        {comment.message}
                    </p>

                    {/* Actions Row */}
                    <div className="flex items-center gap-4">
                        {/* Reply Button */}
                        {user && (
                            <button
                                onClick={() => setShowReplyForm(!showReplyForm)}
                                className="text-xs text-[#109C3D] hover:text-[#063A41] font-medium flex items-center gap-1 transition-colors"
                            >
                                <FiCornerDownRight size={12} />
                                {showReplyForm ? "Cancel" : "Reply"}
                            </button>
                        )}

                        {/* View Replies Toggle */}
                        {hasReplies && (
                            <button
                                onClick={() => setShowReplies(!showReplies)}
                                className="text-xs text-gray-500 hover:text-[#109C3D] font-medium flex items-center gap-1 transition-colors"
                            >
                                <FiChevronDown
                                    size={14}
                                    className={`transform transition-transform duration-200 ${showReplies ? "rotate-180" : ""}`}
                                />
                                {showReplies ? "Hide" : "View"} {validReplies.length}{" "}
                                {validReplies.length === 1 ? "reply" : "replies"}
                            </button>
                        )}
                    </div>

                    {/* Reply Form */}
                    {showReplyForm && user && (
                        <div className="mt-3 flex gap-2 items-start animate-fadeIn">
                            {/* Current User Avatar */}
                            <Avatar
                                firstName={user.firstName}
                                lastName={user.lastName}
                                profilePicture={user.profilePicture}
                                size="sm"
                                colorIndex={99}
                            />

                            {/* Reply Input */}
                            <div className="flex-1 flex gap-2">
                                <input
                                    type="text"
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    placeholder={`Reply to ${userData.firstName}...`}
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
                                        <FiSend size={14} />
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
// MAIN COMMENT SECTION COMPONENT
// ============================================
const CommentSection = ({
    task,
    user,
    onAddComment,
    onReplyToComment,
    isCommenting,
}: {
    task: TaskType;
    user: UserType | null;
    onAddComment: (taskId: string, message: string) => Promise<void>;
    onReplyToComment: (taskId: string, commentId: string, message: string) => Promise<void>;
    isCommenting: boolean;
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const comments = task.comments || [];
    const validComments = comments.filter((c) => !c.isBlocked);
    const commentCount = validComments.length;

    const totalReplies = validComments.reduce((acc, comment) => {
        return acc + (comment.replies?.filter((r) => !r.isBlocked)?.length || 0);
    }, 0);

    const handleSubmitComment = async () => {
        if (!newComment.trim()) return;
        setIsSubmitting(true);
        try {
            await onAddComment(task._id, newComment);
            setNewComment("");
        } catch (error) {
            console.error("Failed to submit comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReply = async (commentId: string, message: string) => {
        await onReplyToComment(task._id, commentId, message);
    };

    return (
        <div className="border-t border-gray-100">
            {/* Toggle Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50/80 transition-colors group"
            >
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#109C3D]/20 to-[#063A41]/20 flex items-center justify-center group-hover:from-[#109C3D]/30 group-hover:to-[#063A41]/30 transition-colors">
                        <FiMessageCircle className="text-[#109C3D]" size={18} />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#063A41]">
                            Comments
                        </span>
                        {commentCount > 0 && (
                            <span className="bg-[#109C3D] text-white text-xs px-2 py-0.5 rounded-full font-medium min-w-[20px] text-center">
                                {commentCount}
                            </span>
                        )}
                        {totalReplies > 0 && (
                            <span className="text-xs text-gray-400">
                                • {totalReplies} {totalReplies === 1 ? "reply" : "replies"}
                            </span>
                        )}
                    </div>
                </div>
                <FiChevronDown
                    className={`text-gray-400 transform transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                    size={20}
                />
            </button>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="px-4 pb-4 animate-fadeIn">
                    {/* Add Comment Form */}
                    {user ? (
                        <div className="mb-5 p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                            <div className="flex gap-3">
                                <Avatar
                                    firstName={user.firstName}
                                    lastName={user.lastName}
                                    profilePicture={user.profilePicture}
                                    size="lg"
                                    colorIndex={99}
                                />
                                <div className="flex-1 flex flex-col gap-2">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Write a comment..."
                                        className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#109C3D] focus:ring-2 focus:ring-[#109C3D]/20 transition-all bg-white resize-none min-h-[80px]"
                                        disabled={isSubmitting}
                                    />
                                    <div className="flex justify-end">
                                        <button
                                            onClick={handleSubmitComment}
                                            disabled={isSubmitting || !newComment.trim()}
                                            className="px-5 py-2 bg-gradient-to-r from-[#109C3D] to-[#063A41] text-white rounded-xl text-sm font-semibold hover:from-[#0d7a30] hover:to-[#042a2f] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    <span>Posting...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <FiSend size={14} />
                                                    <span>Post Comment</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="mb-5 p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl text-center border border-dashed border-gray-200">
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                                <FiLock className="text-gray-400" size={24} />
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                                Join the conversation
                            </p>
                            <a
                                href="/authentication"
                                className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#109C3D] to-[#063A41] text-white rounded-xl text-sm font-semibold hover:from-[#0d7a30] hover:to-[#042a2f] transition-all shadow-sm hover:shadow-md"
                            >
                                Log in to comment
                            </a>
                        </div>
                    )}

                    {/* Comments List */}
                    {commentCount > 0 ? (
                        <div className="max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
                            {validComments.map((comment, index) => (
                                <CommentItem
                                    key={comment._id}
                                    comment={comment}
                                    taskId={task._id}
                                    user={user}
                                    onReply={handleReply}
                                    isReplying={isCommenting}
                                    commentIndex={index}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center mx-auto mb-4">
                                <FiMessageCircle className="text-gray-300" size={28} />
                            </div>
                            <p className="text-sm text-gray-500 font-medium mb-1">
                                No comments yet
                            </p>
                            <p className="text-xs text-gray-400">
                                Be the first to ask a question or share your thoughts!
                            </p>
                        </div>
                    )}
                </div>
            )}

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
                    animation: fadeIn 0.25s ease-out;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #d1d1d1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #b1b1b1;
                }
            `}</style>
        </div>
    );
};

export default CommentSection;