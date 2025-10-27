/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import {
    FiMapPin,
    FiUser,
    FiClock,
    FiMessageCircle,
    FiChevronDown,
    FiChevronUp,
    FiCalendar,
} from "react-icons/fi";
import { MdWorkOutline } from "react-icons/md";
import {
    useBidOnTaskMutation,
    useAcceptTaskMutation,
    useAddCommentMutation,
    useRequestCompletionMutation,
    useGetScheduleTasksQuery,
    useGetFlexibleTasksQuery,
} from "@/features/api/taskApi";
import { AiFillHourglass } from "react-icons/ai";
import CommentItem from "../dashboard/tasker/CommentItem";
import TaskCostBreakdownModal from "../dashboard/tasker/TaskCostBreakdownModal";

const AllAvailableTasks = () => {
    const { data: scheduleTasks = [], error: scheduleError, isLoading: scheduleLoading, refetch: refetchSchedule } = useGetScheduleTasksQuery({});
    const { data: flexibleTasks = [], error: flexibleError, isLoading: flexibleLoading, refetch: refetchFlexible } = useGetFlexibleTasksQuery({});

    const allTasks = [...scheduleTasks, ...flexibleTasks];

    const isAnyLoading = scheduleLoading || flexibleLoading;
    const hasAnyError = scheduleError || flexibleError;

    const refetchAll = () => {
        refetchSchedule();
        refetchFlexible();
    };

    console.log('🔍 Complete Debug Info:');
    console.log('📊 All Tasks:', allTasks);
    console.log('❌ Schedule Error:', scheduleError);
    console.log('❌ Flexible Error:', flexibleError);
    console.log('⏳ Loading:', isAnyLoading);

    if (hasAnyError) {
        console.log('🚨 Error details:', { scheduleError, flexibleError });
    }

    console.log('📈 All Tasks length:', allTasks?.length);
    console.log('📋 All Tasks type:', typeof allTasks);
    console.log('🔢 Is array?', Array.isArray(allTasks));

    const [requestCompletion] = useRequestCompletionMutation();
    const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
    const [bidFormOpenId, setBidFormOpenId] = useState<string | null>(null);
    const [bidOfferPrice, setBidOfferPrice] = useState<number | "">("");
    const [bidMessage, setBidMessage] = useState("");
    const [commentMessage, setCommentMessage] = useState("");
    const [commentFormOpenId, setCommentFormOpenId] = useState<string | null>(null);

    const [addBid, { isLoading: isBidding }] = useBidOnTaskMutation();
    const [acceptTask, { isLoading: isAccepting }] = useAcceptTaskMutation();
    const [addComment, { isLoading: isCommenting }] = useAddCommentMutation();
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = (task: any) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
    };

    const toggleComments = (id: string) => {
        setExpandedTaskId((prev) => (prev === id ? null : id));
    };

    const toggleBidForm = (id: string) => {
        setBidFormOpenId((prev) => (prev === id ? null : id));
        setBidOfferPrice("");
        setBidMessage("");
    };

    const toggleCommentForm = (id: string) => {
        setCommentFormOpenId((prev) => (prev === id ? null : id));
        setCommentMessage("");
    };

    if (isAnyLoading) return (
        <div className="flex justify-center items-center h-64">
            <p className="text-2xl font-semibold text-teal-600 animate-pulse">Loading tasks...</p>
        </div>
    );

    if (hasAnyError) return (
        <div className="flex justify-center items-center h-64">
            <p className="text-2xl font-semibold text-red-600">Error loading tasks</p>
        </div>
    );

    const handlePlaceBid = async (taskId: string) => {
        if (bidOfferPrice === "" || bidOfferPrice <= 0) {
            alert("Please enter a valid offer price");
            return;
        }
        try {
            await addBid({ taskId, offerPrice: bidOfferPrice, message: bidMessage }).unwrap();
            alert("Bid placed successfully!");
            toggleBidForm(taskId);
            refetchAll();
        } catch (err) {
            alert("Failed to place bid");
            console.error(err);
        }
    };

    const handleAcceptTask = async (taskId: string) => {
        if (!window.confirm("Are you sure you want to accept this task?")) return;
        try {
            await acceptTask(taskId).unwrap();
            alert("Task accepted!");
            refetchAll();
        } catch (err) {
            alert("Failed to accept task");
            console.error(err);
        }
    };

    const handleRequestCompletion = async (taskId: any) => {
        if (!window.confirm("Are you sure you want to request task completion?")) return;
        try {
            await requestCompletion(taskId).unwrap();
            alert("Completion request sent!");
            refetchAll();
        } catch (err) {
            console.error(err);
            alert("Failed to request completion.");
        }
    };

    const handleAddComment = async (taskId: string) => {
        if (commentMessage.trim() === "") {
            alert("Comment cannot be empty");
            return;
        }
        try {
            await addComment({ taskId, message: commentMessage }).unwrap();
            alert("Comment added!");
            toggleCommentForm(taskId);
            refetchAll();
        } catch (err) {
            alert("Failed to add comment");
            console.error(err);
        }
    };

    return (
        <section className="max-w-7xl mx-auto py-12 px-6">
            <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12 tracking-tight">
                🧰 Available Tasks
            </h2>

            <div className="grid gap-8">
                {allTasks?.length === 0 ? (
                    <p className="text-center text-lg text-gray-500 font-medium">
                        No tasks available right now.
                    </p>
                ) : (
                    allTasks.map((task: any) => {
                        const now = new Date();
                        const deadline = new Date(task.offerDeadline);
                        const diffInMs = deadline.getTime() - now.getTime();
                        const isUrgent = diffInMs > 0 && diffInMs < 24 * 60 * 60 * 1000;
                        const displaySchedule = isUrgent ? "Urgent" : task.schedule;
                        const primaryColor = isUrgent ? "red" : (task?.schedule === "Flexible" ? "orange" : "teal");
                        const postedTime = new Date(task.createdAt).toLocaleString();
                        const deadlineTime = new Date(task.offerDeadline).toLocaleString();
                        const isOpen = expandedTaskId === task._id;
                        const isBidFormOpen = bidFormOpenId === task._id;
                        const isCommentFormOpen = commentFormOpenId === task._id;
                        const isAccepted = task.status === "in progress" || task.status === "completed";

                        return (
                            <div
                                key={task._id}
                                className="grid grid-cols-1 lg:grid-cols-[240px_1fr] rounded-2xl bg-white border border-gray-200 shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                            >
                                {/* Sidebar */}
                                <div className={`bg-gradient-to-br from-${primaryColor}-500 to-${primaryColor}-700 text-white flex flex-col justify-center items-center p-6 lg:p-8`}>
                                    <MdWorkOutline className="text-5xl mb-4" />
                                    <span className="text-sm uppercase bg-white/20 px-4 py-1.5 rounded-full font-semibold tracking-wider">
                                        {displaySchedule}
                                    </span>
                                </div>

                                {/* Main Content */}
                                <div className="p-6 lg:p-8 space-y-6">
                                    {/* Header with Title and Price */}
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                        <h3 className="text-2xl font-bold text-gray-900 leading-snug">
                                            {task.taskTitle}
                                        </h3>
                                        <div className="  text-teal-500  rounded-xl  text-2xl font-bold  flex items-center gap-2">
                                            {task.price ? `$${task.price}` : "N/A"}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="flex items-start gap-2 mt-4">
                                        <FiMessageCircle className={`text-${primaryColor}-600 flex-shrink-0 mt-1`} />
                                        <div>
                                            <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">Description</p>
                                            <p className="text-gray-700 mt-1 leading-relaxed">{task.taskDescription}</p>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-start gap-2 mt-3">
                                        <FiMapPin className={`text-${primaryColor}-600 flex-shrink-0 mt-1`} />
                                        <div>
                                            <p className="text-xs uppercase text-gray-500 font-medium">Location</p>
                                            <p className="text-gray-700 mt-1">{task.location}</p>
                                        </div>
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm mt-5">
                                        <div className="flex items-start gap-2">
                                            <AiFillHourglass className={`text-${primaryColor}-600 mt-0.5`} />
                                            <div>
                                                <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">Est. Time</p>
                                                <p className="text-gray-800 font-medium">{task.estimatedTime || "Not specified"} hr</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2">
                                            <FiUser className={`text-${primaryColor}-600 mt-0.5`} />
                                            <div>
                                                <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">Client</p>
                                                <p className="text-gray-800 font-medium">
                                                    {task.client?.firstName || "N/A"} {task.client?.lastName || "N/A"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2">
                                            <FiCalendar className={`text-${primaryColor}-600 mt-0.5`} />
                                            <div>
                                                <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">Deadline</p>
                                                <p className="text-gray-800 font-medium">
                                                    {task.schedule === "Flexible" ? "flexible" : deadlineTime}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2">
                                            <FiClock className={`text-${primaryColor}-600 mt-0.5`} />
                                            <div>
                                                <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">Posted</p>
                                                <p className="text-gray-800 font-medium">{postedTime}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                        {task.status === "in progress" ? (
                                            <button
                                                onClick={() => handleRequestCompletion(task._id)}
                                                className="w-full sm:w-auto py-2.5 px-6 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-shadow shadow-sm hover:shadow-md"
                                            >
                                                📩 Request Completion
                                            </button>
                                        ) : task.status === "pending" ? (
                                            <>
                                                <button
                                                    disabled={isAccepted || isBidding}
                                                    onClick={() => toggleBidForm(task._id)}
                                                    className={`w-full sm:w-auto py-2.5 px-6 rounded-lg font-medium transition-shadow shadow-sm
                            ${isAccepted ? "bg-gray-300 cursor-not-allowed" : `bg-${primaryColor}-600 text-white hover:bg-${primaryColor}-700 hover:shadow-md`}`}
                                                >
                                                    💰 Place Bid
                                                </button>
                                                <button
                                                    disabled={isAccepted || isAccepting}
                                                    onClick={() => handleOpenModal(task)}
                                                    className={`w-full sm:w-auto py-2.5 px-6 rounded-lg font-medium transition-shadow shadow-sm
                            ${isAccepted ? "bg-gray-300 cursor-not-allowed" : `bg-gray-400 text-white hover:from-${primaryColor}-700 hover:to-${primaryColor}-900 hover:shadow-md`}`}
                                                >
                                                    ✅ Accept Task
                                                </button>
                                            </>
                                        ) : null}

                                        <button
                                            onClick={() => toggleCommentForm(task._id)}
                                            className="w-full sm:w-auto py-2.5 px-6 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-shadow shadow-sm hover:shadow-md"
                                        >
                                            💬 Comment ({task.comments?.length || 0})
                                        </button>
                                    </div>

                                    {/* Bid Form */}
                                    {isBidFormOpen && (
                                        <div className="mt-6 bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                                            <h4 className="text-lg font-semibold text-gray-800 mb-4">Place Your Bid</h4>
                                            <input
                                                type="number"
                                                min={1}
                                                placeholder="Offer Price ($)"
                                                className="w-full p-3 mb-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                value={bidOfferPrice}
                                                onChange={(e) => setBidOfferPrice(Number(e.target.value))}
                                            />
                                            <textarea
                                                placeholder="Message (optional)"
                                                className="w-full p-3 mb-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                                                rows={3}
                                                value={bidMessage}
                                                onChange={(e) => setBidMessage(e.target.value)}
                                            />
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handlePlaceBid(task._id)}
                                                    disabled={isBidding}
                                                    className={`bg-${primaryColor}-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-${primaryColor}-700 transition-shadow shadow-sm hover:shadow-md`}
                                                >
                                                    Submit Bid
                                                </button>
                                                <button
                                                    onClick={() => toggleBidForm(task._id)}
                                                    disabled={isBidding}
                                                    className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-200 transition-shadow shadow-sm"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Comment Form */}
                                    {isCommentFormOpen && (
                                        <div className="mt-6 bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className={`p-2 rounded-full bg-${primaryColor}-100 text-${primaryColor}-600`}>
                                                    💬
                                                </div>
                                                <h4 className="text-lg font-semibold text-gray-800">Add a Comment</h4>
                                            </div>
                                            <textarea
                                                placeholder="Write your thoughts here..."
                                                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                                                rows={4}
                                                value={commentMessage}
                                                onChange={(e) => setCommentMessage(e.target.value)}
                                            />
                                            <div className="flex justify-end gap-3 mt-4">
                                                <button
                                                    onClick={() => toggleCommentForm(task._id)}
                                                    disabled={isCommenting}
                                                    className="px-6 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-shadow shadow-sm"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleAddComment(task._id)}
                                                    disabled={isCommenting}
                                                    className={`px-6 py-2 text-sm font-medium text-white bg-${primaryColor}-600 hover:bg-${primaryColor}-700 rounded-lg transition-shadow shadow-sm hover:shadow-md`}
                                                >
                                                    {isCommenting ? "Submitting..." : "Submit Comment"}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Comments Toggle */}
                                    <div className="mt-6">
                                        <button
                                            onClick={() => toggleComments(task._id)}
                                            className={`flex items-center gap-2 text-sm font-medium text-${primaryColor}-600 hover:text-${primaryColor}-700 transition`}
                                        >
                                            {isOpen ? (
                                                <>
                                                    <FiChevronUp /> Hide Comments ({task.comments?.length || 0})
                                                </>
                                            ) : (
                                                <>
                                                    <FiChevronDown /> Show Comments ({task.comments?.length || 0})
                                                </>
                                            )}
                                        </button>

                                        {isOpen && (
                                            <div className="mt-4 space-y-3">
                                                {task.comments?.length === 0 ? (
                                                    <p className="text-sm text-gray-500">No comments yet.</p>
                                                ) : (
                                                    task.comments.map((comment: any, idx: number) => (
                                                        <CommentItem key={idx} comment={comment} />
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            <TaskCostBreakdownModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                task={selectedTask}
                onConfirm={() => handleAcceptTask(selectedTask?._id)}
                isAccepting={isAccepting}
            />
        </section>
    );
};

export default AllAvailableTasks;