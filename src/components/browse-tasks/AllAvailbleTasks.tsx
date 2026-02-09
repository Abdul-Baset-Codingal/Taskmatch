// AllAvailableTasks.tsx
"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
    FiMapPin,
    FiUser,
    FiMessageCircle,
    FiCalendar,
    FiX,
    FiDollarSign,
    FiList,
    FiCamera,
    FiImage,
    FiChevronDown,
    FiMaximize2,
    FiChevronLeft,
    FiChevronRight,
    FiSend,
    FiCornerDownRight,
    FiLock,
    FiClock,
} from "react-icons/fi";
import { MdWorkOutline } from "react-icons/md";
import {
    useBidOnTaskMutation,
    useAcceptTaskMutation,
    useAddCommentMutation,
    useRequestCompletionMutation,
    useGetScheduleTasksQuery,
    useGetFlexibleTasksQuery,
    useSendMessageMutation,
    useReplyToCommentMutation,
} from "@/features/api/taskApi";
import { checkLoginStatus } from "@/resusable/CheckUser";
import { useRouter } from "next/navigation";
import Footer from "@/shared/Footer";
import { toast } from "react-toastify";
import CommentSection from "./CommentSection";
import BidConfirmationModal from "./BidConfirmationModal";

// ============================================
// TYPES
// ============================================
interface UserType {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    currentRole: string;
    profilePicture?: string;
}

interface ReplyType {
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

interface CommentType {
    _id: string;
    userId: string;
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

interface TaskType {
    _id: string;
    taskTitle: string;
    taskDescription: string;
    serviceTitle: string;
    location: string;
    price: number;
    estimatedTime: string;
    schedule: string;
    offerDeadline: string;
    status: string;
    createdAt: string;
    photos?: string[];
    client: {
        _id: string;
        firstName: string;
        lastName: string;
        profilePicture?: string;
    };
    acceptedBy?: {
        _id: string;
        firstName: string;
        lastName: string;
        profilePicture?: string;
    };
    messages?: any[];
    bids?: any[];
    comments?: CommentType[];
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
// REPLY ITEM COMPONENT
// ============================================
const ReplyItem = ({
    reply,
    index,
}: {
    reply: ReplyType;
    index: number;
}) => {
    if (reply.isBlocked) return null;

    return (
        <div className="flex gap-2.5 py-2.5 group">
            <Avatar
                firstName={reply.firstName}
                lastName={reply.lastName}
                profilePicture={reply.profilePicture}
                size="sm"
                colorIndex={index + 3}
            />
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-semibold text-xs text-[#063A41]">
                        {reply.firstName || "User"} {reply.lastName || ""}
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
                <p className="text-xs text-gray-600 leading-relaxed">
                    {reply.message}
                </p>
            </div>
        </div>
    );
};

// ============================================
// COMMENT ITEM COMPONENT
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
                <Avatar
                    firstName={comment.firstName}
                    lastName={comment.lastName}
                    profilePicture={comment.profilePicture}
                    size="lg"
                    colorIndex={commentIndex}
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className="font-semibold text-sm text-[#063A41]">
                            {comment.firstName || "User"} {comment.lastName || ""}
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

                    <p className="text-sm text-gray-700 leading-relaxed mb-2.5">
                        {comment.message}
                    </p>

                    <div className="flex items-center gap-4">
                        {user && (
                            <button
                                onClick={() => setShowReplyForm(!showReplyForm)}
                                className="text-xs text-[#109C3D] hover:text-[#063A41] font-medium flex items-center gap-1 transition-colors"
                            >
                                <FiCornerDownRight size={12} />
                                {showReplyForm ? "Cancel" : "Reply"}
                            </button>
                        )}

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

                    {showReplyForm && user && (
                        <div className="mt-3 flex gap-2 items-start animate-fadeIn">
                            <Avatar
                                firstName={user.firstName}
                                lastName={user.lastName}
                                profilePicture={user.profilePicture}
                                size="sm"
                                colorIndex={99}
                            />
                            <div className="flex-1 flex gap-2">
                                <input
                                    type="text"
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    placeholder={`Reply to ${comment.firstName || "User"}...`}
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
// COMMENT SECTION COMPONENT
// ============================================


// ============================================
// PHOTO GALLERY COMPONENT
// ============================================
const PhotoGallery = ({
    photos,
    taskId,
    expandedPhotoTaskId,
    setExpandedPhotoTaskId,
    selectedPhotoIndex,
    setSelectedPhotoIndex,
}: {
    photos: string[];
    taskId: string;
    expandedPhotoTaskId: string | null;
    setExpandedPhotoTaskId: (id: string | null) => void;
    selectedPhotoIndex: number;
    setSelectedPhotoIndex: (index: number) => void;
}) => {
    const isPhotoExpanded = expandedPhotoTaskId === taskId;

    if (!photos || photos.length === 0) return null;

    return (
        <div className="border-t border-gray-100">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    if (isPhotoExpanded) {
                        setExpandedPhotoTaskId(null);
                    } else {
                        setExpandedPhotoTaskId(taskId);
                        setSelectedPhotoIndex(0);
                    }
                }}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#109C3D]/20 to-[#063A41]/20 flex items-center justify-center">
                        <FiImage className="text-[#109C3D]" size={16} />
                    </div>
                    <span className="text-sm font-semibold text-[#063A41]">
                        Photos ({photos.length})
                    </span>
                </div>
                <FiChevronDown
                    className={`text-gray-400 transform transition-transform duration-300 ${isPhotoExpanded ? "rotate-180" : ""}`}
                    size={20}
                />
            </button>

            {isPhotoExpanded && (
                <div className="px-4 pb-4 animate-fadeIn">
                    <div className="relative mb-3 rounded-xl overflow-hidden bg-gray-100 aspect-video">
                        <img
                            src={photos[selectedPhotoIndex]}
                            alt={`Task photo ${selectedPhotoIndex + 1}`}
                            className="w-full h-full object-contain"
                        />

                        {photos.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedPhotoIndex(
                                            selectedPhotoIndex === 0 ? photos.length - 1 : selectedPhotoIndex - 1
                                        );
                                    }}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all"
                                >
                                    <FiChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedPhotoIndex(
                                            selectedPhotoIndex === photos.length - 1 ? 0 : selectedPhotoIndex + 1
                                        );
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all"
                                >
                                    <FiChevronRight size={24} />
                                </button>
                            </>
                        )}

                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            {selectedPhotoIndex + 1} / {photos.length}
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(photos[selectedPhotoIndex], "_blank");
                            }}
                            className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all"
                        >
                            <FiMaximize2 size={16} />
                        </button>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {photos.map((photo: string, index: number) => (
                            <button
                                key={index}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedPhotoIndex(index);
                                }}
                                className={`relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden transition-all ${selectedPhotoIndex === index
                                        ? "ring-2 ring-[#109C3D] ring-offset-2 scale-105"
                                        : "border-2 border-gray-200 hover:border-[#109C3D] opacity-70 hover:opacity-100"
                                    }`}
                            >
                                <img
                                    src={photo}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// ============================================
// SERVICE CATEGORIES
// ============================================
const SERVICE_CATEGORIES = [
    { value: "", label: "All Categories" },
    { value: "Handyman & Home Repairs", label: "Handyman & Home Repairs" },
    { value: "Pet Services", label: "Pet Services" },
    { value: "Cleaning Services", label: "Cleaning Services" },
    { value: "Plumbing, Electrical & HVAC (PEH)", label: "Plumbing, Electrical & HVAC" },
    { value: "Automotive Services", label: "Automotive Services" },
    { value: "All Other Specialized Services", label: "All Other Specialized Services" },
];

// ============================================
// MAIN COMPONENT
// ============================================
const AllAvailableTasks = () => {
    // RTK Query hooks
    const {
        data: scheduleTasks = [],
        error: scheduleError,
        isLoading: scheduleLoading,
        refetch: refetchSchedule,
    } = useGetScheduleTasksQuery({});

    const {
        data: flexibleTasks = [],
        error: flexibleError,
        isLoading: flexibleLoading,
        refetch: refetchFlexible,
    } = useGetFlexibleTasksQuery({});

    // Mutation hooks
    const [requestCompletion] = useRequestCompletionMutation();
    const [addBid, { isLoading: isBidding }] = useBidOnTaskMutation();
    const [acceptTask, { isLoading: isAccepting }] = useAcceptTaskMutation();
    const [addComment, { isLoading: isCommenting }] = useAddCommentMutation();
    const [replyToComment, { isLoading: isReplying }] = useReplyToCommentMutation();
    const [sendMessage] = useSendMessageMutation();

    const router = useRouter();

    // State
    const [user, setUser] = useState<UserType | null>(null);
    const [bidFormOpenId, setBidFormOpenId] = useState<string | null>(null);
    const [bidOfferPrice, setBidOfferPrice] = useState<number | "">("");
    const [bidMessage, setBidMessage] = useState("");
    const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null);
    const [activeInitialTaskId, setActiveInitialTaskId] = useState<string | null>(null);
    const [seenConversations, setSeenConversations] = useState<Set<string>>(new Set());
    const [categoryFilter, setCategoryFilter] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [minPrice, setMinPrice] = useState<number | null>(null);
    const [maxPrice, setMaxPrice] = useState<number | null>(null);
    const [deadlineFilter, setDeadlineFilter] = useState("");
    const [expandedPhotoTaskId, setExpandedPhotoTaskId] = useState<string | null>(null);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
    const [showBidConfirmModal, setShowBidConfirmModal] = useState(false);
    const [pendingBidTaskId, setPendingBidTaskId] = useState<string | null>(null);
    const [pendingBidTaskTitle, setPendingBidTaskTitle] = useState<string>("");
    // Memoized values
    const allTasks = useMemo(() => {
        const combinedTasks = [...scheduleTasks, ...flexibleTasks] as TaskType[];
        return combinedTasks.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
        });
    }, [scheduleTasks, flexibleTasks]);

    const isAnyLoading = scheduleLoading || flexibleLoading;
    const hasAnyError = scheduleError || flexibleError;

    const filteredTasks = useMemo(() => {
        return allTasks.filter((task) => {
            const now = new Date();
            const deadline = new Date(task.offerDeadline);
            const diffInMs = deadline.getTime() - now.getTime();
            const isUrgent = diffInMs > 0 && diffInMs < 24 * 60 * 60 * 1000;

            const matchesCategory = !categoryFilter || task.serviceTitle === categoryFilter;
            const matchesLocation = !locationFilter || task.location.toLowerCase().includes(locationFilter.toLowerCase());
            const matchesPrice = (minPrice === null || task.price >= minPrice) && (maxPrice === null || task.price <= maxPrice);

            let matchesDeadline = !deadlineFilter;
            if (deadlineFilter === "Urgent") {
                matchesDeadline = isUrgent;
            } else if (deadlineFilter === "Flexible") {
                matchesDeadline = task.schedule === "Flexible";
            } else if (deadlineFilter === "Standard") {
                matchesDeadline = task.schedule !== "Flexible" && !isUrgent;
            }

            return matchesCategory && matchesLocation && matchesPrice && matchesDeadline;
        });
    }, [allTasks, categoryFilter, locationFilter, minPrice, maxPrice, deadlineFilter]);

    // Callbacks
    const refetchAll = useCallback(() => {
        refetchSchedule();
        refetchFlexible();
    }, [refetchSchedule, refetchFlexible]);

    const handleOpenChat = useCallback((userId: string, taskId: string | null = null) => {
        setActiveChatUserId(userId);
        setActiveInitialTaskId(taskId);
        if (taskId) {
            const convKey = `${taskId}-${userId}`;
            setSeenConversations((prev) => new Set([...prev, convKey]));
        } else {
            setSeenConversations((prev) => new Set([...prev, userId]));
        }
    }, []);

    const handleCloseChat = useCallback(() => {
        setActiveChatUserId(null);
        setActiveInitialTaskId(null);
    }, []);

    const handleSendMessage = useCallback(
        async (taskId: string, message: string) => {
            try {
                await sendMessage({ taskId, message }).unwrap();
                refetchAll();
            } catch (err) {
                toast.error("Failed to send message");
                console.error(err);
                throw err;
            }
        },
        [sendMessage, refetchAll]
    );

    const handleAuthRedirect = useCallback(() => {
        router.push("/authentication");
    }, [router]);

    const toggleBidForm = useCallback((id: string) => {
        setBidFormOpenId((prev) => (prev === id ? null : id));
        setBidOfferPrice("");
        setBidMessage("");
    }, []);

    const clearFilters = useCallback(() => {
        setCategoryFilter("");
        setLocationFilter("");
        setMinPrice(null);
        setMaxPrice(null);
        setDeadlineFilter("");
    }, []);

    const handlePlaceBid = useCallback(
        async (taskId: string) => {
            if (bidOfferPrice === "" || bidOfferPrice <= 0) {
                toast.error("Please enter a valid offer price");
                return;
            }
            try {
                await addBid({ taskId, offerPrice: bidOfferPrice, message: bidMessage }).unwrap();
                toast.success("Bid placed successfully!");
                setBidFormOpenId(null);
                setBidOfferPrice("");
                setBidMessage("");
                refetchAll();
            } catch (err) {
                toast.error("Failed to place bid");
                console.error(err);
            }
        },
        [addBid, bidOfferPrice, bidMessage, refetchAll]
    );

    const handleAcceptTask = useCallback(
        async (taskId: string) => {
            if (!window.confirm("Are you sure you want to accept this task?")) return;
            try {
                await acceptTask(taskId).unwrap();
                toast.success("Task accepted!");
                refetchAll();
            } catch (err) {
                toast.error("Failed to accept task");
                console.error(err);
            }
        },
        [acceptTask, refetchAll]
    );

    const handleRequestCompletion = useCallback(
        async (taskId: string) => {
            if (!window.confirm("Are you sure you want to request task completion?")) return;
            try {
                await requestCompletion(taskId).unwrap();
                toast.success("Completion request sent!");
                refetchAll();
            } catch (err) {
                console.error(err);
                toast.error("Failed to request completion.");
            }
        },
        [requestCompletion, refetchAll]
    );

    const handleAddComment = useCallback(
        async (taskId: string, message: string) => {
            try {
                await addComment({ taskId, message }).unwrap();
                toast.success("Comment added!");
                refetchAll();
            } catch (err) {
                toast.error("Failed to add comment");
                console.error(err);
            }
        },
        [addComment, refetchAll]
    );

    const handleReplyToComment = useCallback(
        async (taskId: string, commentId: string, message: string) => {
            try {
                await replyToComment({ taskId, commentId, message }).unwrap();
                toast.success("Reply added!");
                refetchAll();
            } catch (err) {
                toast.error("Failed to add reply");
                console.error(err);
            }
        },
        [replyToComment, refetchAll]
    );

    // Update handlePlaceBid to show modal first
    const handleShowBidConfirmation = useCallback(
        (taskId: string, taskTitle: string) => {
            if (bidOfferPrice === "" || bidOfferPrice <= 0) {
                toast.error("Please enter a valid offer price");
                return;
            }
            setPendingBidTaskId(taskId);
            setPendingBidTaskTitle(taskTitle);
            setShowBidConfirmModal(true);
        },
        [bidOfferPrice]
    );

    // This is called when user confirms in the modal
    const handleConfirmBid = useCallback(async () => {
        if (!pendingBidTaskId || bidOfferPrice === "" || bidOfferPrice <= 0) {
            return;
        }
        try {
            await addBid({
                taskId: pendingBidTaskId,
                offerPrice: bidOfferPrice,
                message: bidMessage
            }).unwrap();

            toast.success("Bid placed successfully!");

            // Reset all states
            setShowBidConfirmModal(false);
            setPendingBidTaskId(null);
            setPendingBidTaskTitle("");
            setBidFormOpenId(null);
            setBidOfferPrice("");
            setBidMessage("");

            refetchAll();
        } catch (err) {
            toast.error("Failed to place bid");
            console.error(err);
        }
    }, [addBid, pendingBidTaskId, bidOfferPrice, bidMessage, refetchAll]);

    // Close modal handler
    const handleCloseBidConfirmModal = useCallback(() => {
        setShowBidConfirmModal(false);
        setPendingBidTaskId(null);
        setPendingBidTaskTitle("");
    }, []);


    console.log(filteredTasks)

    // Effects
    useEffect(() => {
        const fetchUser = async () => {
            const { isLoggedIn, user: fetchedUser } = await checkLoginStatus();
            if (isLoggedIn) {
                setUser(fetchedUser);
            }
        };
        fetchUser();
    }, []);

    // Loading state
    if (isAnyLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-2xl font-semibold text-[#063A41] animate-pulse">Loading tasks...</p>
            </div>
        );
    }

    // Error state
    if (hasAnyError) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-2xl font-semibold text-red-600">Error loading tasks</p>
            </div>
        );
    }

    return (
        <div>
            <section className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Filters */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-[#063A41] mb-6 flex items-center gap-2">
                            <FiList className="text-[#109C3D]" size={28} />
                            Available Tasks
                        </h2>
                        <div className="bg-gradient-to-r from-white via-[#E5FFDB]/30 to-white rounded-3xl p-6 shadow-lg border border-[#109C3D]/10 backdrop-blur-sm">
                            <div className="flex flex-wrap gap-4 items-end justify-between">
                                {/* Category Filter */}
                                <div className="relative flex-1 min-w-[220px]">
                                    <MdWorkOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <select
                                        className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#109C3D]/50 focus:ring-2 focus:ring-[#109C3D]/20 transition-all bg-white/80 text-sm appearance-none cursor-pointer"
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                    >
                                        {SERVICE_CATEGORIES.map((category) => (
                                            <option key={category.value} value={category.value}>
                                                {category.label}
                                            </option>
                                        ))}
                                    </select>
                                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>

                                {/* Location Filter */}
                                <div className="relative flex-1 min-w-[220px]">
                                    <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Filter by location..."
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#109C3D]/50 focus:ring-2 focus:ring-[#109C3D]/20 transition-all bg-white/80 text-sm placeholder-gray-500"
                                        value={locationFilter}
                                        onChange={(e) => setLocationFilter(e.target.value)}
                                    />
                                </div>

                                {/* Price Range */}
                                <div className="flex-1 min-w-[280px] flex gap-2">
                                    <div className="relative flex-1">
                                        <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="Min"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#109C3D]/50 focus:ring-2 focus:ring-[#109C3D]/20 transition-all bg-white/80 text-sm placeholder-gray-500"
                                            value={minPrice ?? ""}
                                            onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : null)}
                                        />
                                    </div>
                                    <div className="relative flex-1">
                                        <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="Max"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#109C3D]/50 focus:ring-2 focus:ring-[#109C3D]/20 transition-all bg-white/80 text-sm placeholder-gray-500"
                                            value={maxPrice ?? ""}
                                            onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : null)}
                                        />
                                    </div>
                                </div>

                                {/* Deadline Filter */}
                                <div className="relative min-w-[180px]">
                                    <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <select
                                        className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#109C3D]/50 focus:ring-2 focus:ring-[#109C3D]/20 transition-all bg-white/80 text-sm appearance-none"
                                        value={deadlineFilter}
                                        onChange={(e) => setDeadlineFilter(e.target.value)}
                                    >
                                        <option value="">All Deadlines</option>
                                        <option value="Urgent">Urgent</option>
                                        <option value="Flexible">Flexible</option>
                                        <option value="Standard">Standard</option>
                                    </select>
                                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>

                                {/* Clear Filters */}
                                <div className="flex-shrink-0">
                                    <button
                                        onClick={clearFilters}
                                        className="flex items-center gap-2 bg-gradient-to-r from-[#109C3D] to-[#063A41] text-white px-6 py-3 rounded-2xl font-semibold text-sm hover:from-[#0d7a30] hover:to-[#042a2f] transition-all shadow-md hover:shadow-lg transform hover:scale-105 whitespace-nowrap"
                                    >
                                        <FiX size={16} />
                                        Clear
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tasks Grid */}
                    <div className="grid grid-cols-1 gap-8 items-start">
                        {allTasks.length === 0 ? (
                            <div className="col-span-1 lg:col-span-2 text-center py-20">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#109C3D]/10 to-[#063A41]/10 flex items-center justify-center mx-auto mb-6">
                                    <MdWorkOutline className="text-6xl text-[#109C3D]" />
                                </div>
                                <p className="text-xl text-gray-600 font-medium">No tasks available right now.</p>
                                <p className="text-gray-500 mt-2">Check back soon for new opportunities!</p>
                            </div>
                        ) : filteredTasks.length === 0 ? (
                            <div className="col-span-1 lg:col-span-2 text-center py-20">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#109C3D]/10 to-[#063A41]/10 flex items-center justify-center mx-auto mb-6">
                                    <MdWorkOutline className="text-6xl text-[#109C3D]" />
                                </div>
                                <p className="text-xl text-gray-600 font-medium">No tasks match your filters.</p>
                                <p className="text-gray-500 mt-2">Try adjusting your search criteria!</p>
                            </div>
                        ) : (
                            filteredTasks.map((task: TaskType) => {
                                const now = new Date();
                                const deadline = new Date(task.offerDeadline);
                                const diffInMs = deadline.getTime() - now.getTime();
                                const isUrgent = diffInMs > 0 && diffInMs < 24 * 60 * 60 * 1000;
                                const displaySchedule = isUrgent ? "Urgent" : task.schedule;

                                const getBadgeStyle = () => {
                                    if (isUrgent) return "bg-red-500 text-white";
                                    if (task.schedule === "Flexible") return "bg-orange-500 text-white";
                                    return "bg-[#109C3D] text-white";
                                };

                                const postedDate = new Date(task.createdAt).toLocaleDateString();
                                const deadlineDate = new Date(task.offerDeadline).toLocaleDateString();
                                const isBidFormOpen = bidFormOpenId === task._id;
                                const isAccepted = task.status === "in progress" || task.status === "completed";
                                const isOwnTask = user && (task.client?._id === user._id || (task.client as any) === user._id);
                                const hasPhotos = task.photos && task.photos.length > 0;

                                return (
                                    <div
                                        key={task._id}
                                        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#109C3D]/20 w-full"
                                    >
                                        {/* Card Header */}
                                        <div className="color1 p-4 text-white relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

                                            <div className="relative z-10 flex flex-col sm:flex-row items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                                        <span className={`${getBadgeStyle()} px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide shadow-md`}>
                                                            {displaySchedule}
                                                        </span>

                                                        {task.status === "in progress" && (
                                                            <span className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide shadow-md">
                                                                In Progress
                                                            </span>
                                                        )}
                                                        {task.status === "completed" && (
                                                            <span className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide shadow-md">
                                                                Completed
                                                            </span>
                                                        )}
                                                        {hasPhotos && (
                                                            <span className="bg-white/20 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide shadow-md flex items-center gap-1">
                                                                <FiCamera size={12} />
                                                                {task.photos!.length}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex">
                                                        <h3 className="text-xl font-bold mb-1 text-white drop-shadow-md truncate">
                                                            {task.taskTitle}
                                                        </h3>
                                                    </div>
                                                    <p className="text-white/90 text-sm font-medium mb-1">{task.serviceTitle}</p>
                                                    <p className="text-[#E5FFDB] text-xs opacity-90">Posted {postedDate}</p>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    <div className="bg-white/15 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-white/20">
                                                        <div className="text-[#E5FFDB] text-xs font-semibold mb-1 text-center">Budget</div>
                                                        <div className="text-2xl font-black text-white flex items-center justify-center gap-1">
                                                            <FiDollarSign size={20} />
                                                            {task.price}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Card Body */}
                                        <div className="p-6 flex flex-col">
                                            {/* Description */}
                                            <div className="mb-6">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#109C3D]/20 to-[#063A41]/20 flex items-center justify-center flex-shrink-0">
                                                        <FiMessageCircle className="text-[#109C3D]" size={16} />
                                                    </div>
                                                    <h4 className="text-xs font-bold text-[#063A41] uppercase tracking-wide">Description</h4>
                                                </div>
                                                <p className="text-gray-600 leading-relaxed text-sm pl-10 line-clamp-3">
                                                    {task.taskDescription}
                                                </p>
                                            </div>

                                            {/* Info Grid */}
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                                {/* Location */}
                                                <div className="flex items-start gap-2 p-3 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100">
                                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#109C3D]/20 to-[#063A41]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                        <FiMapPin className="text-[#109C3D]" size={16} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">Location</p>
                                                        <p className="text-[#063A41] font-semibold text-xs truncate">
                                                            {task.location === "Remote"
                                                                ? "Remote"
                                                                : task.location.split(",").slice(-2).map((s) => s.trim()).join(", ")}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Client */}
                                                <div className="flex items-start gap-2 p-3 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100">
                                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#109C3D]/20 to-[#063A41]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                        <FiUser className="text-[#109C3D]" size={16} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">Booker</p>
                                                        <p className="text-[#063A41] font-semibold text-xs truncate">
                                                            {task.client?.firstName || "N/A"} {task.client?.lastName || ""}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Deadline */}
                                                <div className="flex items-start gap-2 p-3 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100">
                                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#109C3D]/20 to-[#063A41]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                        <FiCalendar className="text-[#109C3D]" size={16} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">Deadline</p>
                                                        <p className="text-[#063A41] font-semibold text-xs">
                                                            {task.schedule === "Flexible" ? "Flexible" : deadlineDate}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons - Only for logged-in taskers */}
                                            {user && user.currentRole !== "client" && (
                                                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                                                    {task.status === "in progress" && user.currentRole === "tasker" && (
                                                        <button
                                                            disabled={isCommenting}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRequestCompletion(task._id);
                                                            }}
                                                            className="flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow-md bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transform hover:scale-105"
                                                        >
                                                            <div className="flex items-center justify-center gap-1">
                                                                <span>✓</span>
                                                                <span>Request Completion</span>
                                                            </div>
                                                        </button>
                                                    )}

                                                    {task.status === "pending" && user.currentRole === "tasker" && (
                                                        <button
                                                            disabled={isAccepted || isBidding}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleBidForm(task._id);
                                                            }}
                                                            className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow-md ${!(isAccepted || isBidding)
                                                                    ? "bg-gradient-to-r from-[#109C3D] to-[#063A41] text-white hover:from-[#0d7a30] hover:to-[#042a2f] transform hover:scale-105"
                                                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                                }`}
                                                        >
                                                            <div className="flex items-center justify-center gap-1">
                                                                <span>💰</span>
                                                                <span>{isBidFormOpen ? "Cancel" : "Place Bid"}</span>
                                                            </div>
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                            {/* Login Prompt for non-logged in users */}
                                            {!user && (
                                                <div className="mb-4 p-4 bg-gradient-to-r from-[#E5FFDB]/50 to-white rounded-xl border border-[#109C3D]/20 text-center">
                                                    <FiLock className="mx-auto text-[#109C3D] mb-2" size={24} />
                                                    <p className="text-sm text-gray-600 mb-3">
                                                        Log in to place bids and message clients
                                                    </p>
                                                    <button
                                                        onClick={handleAuthRedirect}
                                                        className="px-6 py-2 bg-gradient-to-r from-[#109C3D] to-[#063A41] text-white rounded-xl font-semibold text-sm hover:from-[#0d7a30] hover:to-[#042a2f] transition-all shadow-sm hover:shadow-md"
                                                    >
                                                        Log In / Sign Up
                                                    </button>
                                                </div>
                                            )}

                                            {/* Bid Form */}
                                            {isBidFormOpen && user && (
                                                <div className="bg-gradient-to-br from-[#E5FFDB]/20 to-white p-6 rounded-2xl border border-[#109C3D]/10 shadow-md mb-4">
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#109C3D] to-[#063A41] flex items-center justify-center shadow-md">
                                                            <span className="text-xl">💰</span>
                                                        </div>
                                                        <h4 className="text-lg font-bold text-[#063A41]">Place Your Bid</h4>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block text-sm font-bold text-[#063A41] mb-2">
                                                                Offer Price ($)
                                                            </label>
                                                            <input
                                                                type="number"
                                                                min={1}
                                                                placeholder="Enter your offer"
                                                                className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#109C3D] focus:ring-2 focus:ring-[#109C3D]/20 transition bg-white"
                                                                value={bidOfferPrice}
                                                                onChange={(e) => setBidOfferPrice(Number(e.target.value))}
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-bold text-[#063A41] mb-2">
                                                                Message (Optional)
                                                            </label>
                                                            <textarea
                                                                placeholder="Tell the client why you're the best fit..."
                                                                className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#109C3D] focus:ring-2 focus:ring-[#109C3D]/20 transition resize-none bg-white"
                                                                rows={3}
                                                                value={bidMessage}
                                                                onChange={(e) => setBidMessage(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                // Change this line to show modal instead of directly submitting
                                                                handleShowBidConfirmation(task._id, task.taskTitle);
                                                            }}
                                                            disabled={isBidding}
                                                            className="flex-1 bg-gradient-to-r from-[#109C3D] to-[#063A41] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:from-[#0d7a30] hover:to-[#042a2f] transition-all shadow-sm hover:shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {isBidding ? "Submitting..." : "Review & Submit Bid"}
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleBidForm(task._id);
                                                            }}
                                                            disabled={isBidding}
                                                            className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Photo Gallery */}
                                        {hasPhotos && (
                                            <PhotoGallery
                                                photos={task.photos!}
                                                taskId={task._id}
                                                expandedPhotoTaskId={expandedPhotoTaskId}
                                                setExpandedPhotoTaskId={setExpandedPhotoTaskId}
                                                selectedPhotoIndex={selectedPhotoIndex}
                                                setSelectedPhotoIndex={setSelectedPhotoIndex}
                                            />
                                        )}

                                        {/* Comment Section */}
                                        <CommentSection
                                            task={task}
                                            user={user}
                                            onAddComment={handleAddComment}
                                            onReplyToComment={handleReplyToComment}
                                            isCommenting={isCommenting || isReplying}
                                        />
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </section>

            <BidConfirmationModal
                isOpen={showBidConfirmModal}
                onClose={handleCloseBidConfirmModal}
                onConfirm={handleConfirmBid}
                bidAmount={typeof bidOfferPrice === "number" ? bidOfferPrice : 0}
                taskTitle={pendingBidTaskTitle}
                isLoading={isBidding}
            />

            {/* Global Styles */}
            <style jsx global>{`
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
                    animation: fadeIn 0.3s ease-out;
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
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default AllAvailableTasks;