/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";
import {
    FiMapPin,
    FiUser,
    FiClock,
    FiMessageCircle,
    FiChevronDown,
    FiChevronUp,
    FiCalendar,
    FiX,
    FiSend,
    FiMinimize2,
    FiMaximize2,
    FiSearch,
    FiDollarSign,
    FiList,
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
import { FaUser as FaUserIcon } from "react-icons/fa";
import Image from 'next/image';
import { checkLoginStatus } from "@/resusable/CheckUser";
import { useRouter } from "next/navigation";
import Footer from "@/shared/Footer";
import MessengerInbox from "./MessengerInbox";
import MessengerChat from "./MessengerChat";


const AllAvailableTasks = () => {
    const { data: scheduleTasks = [], error: scheduleError, isLoading: scheduleLoading, refetch: refetchSchedule } = useGetScheduleTasksQuery({});
    const { data: flexibleTasks = [], error: flexibleError, isLoading: flexibleLoading, refetch: refetchFlexible } = useGetFlexibleTasksQuery({});
    const [user, setUser] = useState<UserType | null>(null);
    const allTasks = [...scheduleTasks, ...flexibleTasks] as TaskType[];
    const isAnyLoading = scheduleLoading || flexibleLoading;
    const hasAnyError = scheduleError || flexibleError;
    const refetchAll = () => {
        refetchSchedule();
        refetchFlexible();
    };
    const router = useRouter();
    useEffect(() => {
        const fetchUser = async () => {
            const { isLoggedIn, user: fetchedUser } = await checkLoginStatus();
            if (isLoggedIn) {
                setUser(fetchedUser);
                console.log("User object:", fetchedUser);
            }
        };
        fetchUser();
    }, []);
    console.log(scheduleTasks)
    const [requestCompletion] = useRequestCompletionMutation();
    const [bidFormOpenId, setBidFormOpenId] = useState<string | null>(null);
    const [bidOfferPrice, setBidOfferPrice] = useState<number | "">("");
    const [bidMessage, setBidMessage] = useState("");
    const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null);
    const [activeInitialTaskId, setActiveInitialTaskId] = useState<string | null>(null);
    const [addBid, { isLoading: isBidding }] = useBidOnTaskMutation();
    const [acceptTask, { isLoading: isAccepting }] = useAcceptTaskMutation();
    const [addComment, { isLoading: isCommenting }] = useAddCommentMutation();
    // Add this new state
    const [seenConversations, setSeenConversations] = useState<Set<string>>(new Set());
    // Filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [minPrice, setMinPrice] = useState<number | null>(null);
    const [maxPrice, setMaxPrice] = useState<number | null>(null);
    const [deadlineFilter, setDeadlineFilter] = useState("");

    const toggleBidForm = (id: string) => {
        setBidFormOpenId((prev) => (prev === id ? null : id));
        setBidOfferPrice("");
        setBidMessage("");
    };

    const clearFilters = () => {
        setSearchTerm("");
        setLocationFilter("");
        setMinPrice(null);
        setMaxPrice(null);
        setDeadlineFilter("");
    };

    const filteredTasks = useMemo(() => {
        return allTasks.filter((task) => {
            const now = new Date();
            const deadline = new Date(task.offerDeadline);
            const diffInMs = deadline.getTime() - now.getTime();
            const isUrgent = diffInMs > 0 && diffInMs < 24 * 60 * 60 * 1000;
            const displaySchedule = isUrgent ? "Urgent" : task.schedule;

            const matchesTitle = !searchTerm || task.taskTitle.toLowerCase().includes(searchTerm.toLowerCase());
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

            return matchesTitle && matchesLocation && matchesPrice && matchesDeadline;
        });
    }, [allTasks, searchTerm, locationFilter, minPrice, maxPrice, deadlineFilter]);

    const handleOpenChat = (userId: string) => {
        setActiveChatUserId(userId);
        setActiveInitialTaskId(null);

        // MARK AS SEEN WHEN USER OPENS THE CHAT
        setSeenConversations(prev => new Set(prev).add(userId));
    };
    const handleCloseChat = () => {
        setActiveChatUserId(null);
        setActiveInitialTaskId(null);
    };
    if (isAnyLoading) return (
        <div className="flex justify-center items-center h-64">
            <p className="text-2xl font-semibold text-[#063A41] animate-pulse">Loading tasks...</p>
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
    const handleSendMessage = async (taskId: string, message: string) => {
        try {
            await addComment({ taskId, message }).unwrap();
            refetchAll();
        } catch (err) {
            alert("Failed to send message");
            console.error(err);
        }
    };
    const handleAuthRedirect = () => {
        router.push('/authentication');
    };
    return (
        <div>
            <section className="min-h-screen  py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Filters */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-[#063A41] mb-6 flex items-center gap-2">
                            <FiList className="text-[#109C3D]" size={28} />
                            Available Tasks
                        </h2>
                        <div className="bg-gradient-to-r from-white via-[#E5FFDB]/30 to-white rounded-3xl p-6 shadow-lg border border-[#109C3D]/10 backdrop-blur-sm">
                            <div className="flex flex-wrap gap-4 items-end justify-between">
                                {/* Search by Task Title */}
                                <div className="relative flex-1 min-w-[220px]">
                                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search by title..."
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#109C3D]/50 focus:ring-2 focus:ring-[#109C3D]/20 transition-all bg-white/80 text-sm placeholder-gray-500"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
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
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#109C3D]/50 focus:ring-2 focus:ring-[#109C3D]/20 transition-all bg-white/80 text-sm appearance-none"
                                        value={deadlineFilter}
                                        onChange={(e) => setDeadlineFilter(e.target.value)}
                                    >
                                        <option value="">All Deadlines</option>
                                        <option value="Flexible">Flexible</option>
                                        <option value="Standard">Standard</option>
                                    </select>
                                </div>

                                {/* Clear Filters Button */}
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

                    <div className="grid  grid-cols-1 gap-8 items-start">
                        {allTasks.length === 0 ? (
                            <div className="col-span-1 lg:col-span-2 text-center py-20">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#109C3D]/10 to-[#063A41]/10 flex items-center justify-center mx-auto mb-6">
                                    <MdWorkOutline className="text-6xl text-[#109C3D]" />
                                </div>
                                <p className="text-xl text-gray-600 font-medium">
                                    No tasks available right now.
                                </p>
                                <p className="text-gray-500 mt-2">Check back soon for new opportunities!</p>
                            </div>
                        ) : filteredTasks.length === 0 ? (
                            <div className="col-span-1 lg:col-span-2 text-center py-20">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#109C3D]/10 to-[#063A41]/10 flex items-center justify-center mx-auto mb-6">
                                    <MdWorkOutline className="text-6xl text-[#109C3D]" />
                                </div>
                                <p className="text-xl text-gray-600 font-medium">
                                    No tasks match your filters.
                                </p>
                                <p className="text-gray-500 mt-2">Try adjusting your search criteria!</p>
                            </div>
                        ) : (
                            filteredTasks.map((task: any) => {
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
                                                    </div>
                                                    <h3 className="text-xl font-bold mb-1 text-white drop-shadow-md truncate">
                                                        {task.taskTitle}
                                                    </h3>
                                                    <p className="text-[#E5FFDB] text-xs opacity-90">
                                                        Posted {postedDate}
                                                    </p>
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
                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                {/* Location */}
                                                <div className="flex items-start gap-2 p-3 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100">
                                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#109C3D]/20 to-[#063A41]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                        <FiMapPin className="text-[#109C3D]" size={16} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">Location</p>
                                                        <p className="text-[#063A41] font-semibold text-xs truncate">{task.location}</p>
                                                    </div>
                                                </div>

                                                {/* Estimated Time */}
                                                <div className="flex items-start gap-2 p-3 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100">
                                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#109C3D]/20 to-[#063A41]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                        <AiFillHourglass className="text-[#109C3D]" size={16} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">Est. Time</p>
                                                        <p className="text-[#063A41] font-semibold text-xs">{task.estimatedTime || "N/A"}h</p>
                                                    </div>
                                                </div>

                                                {/* Client */}
                                                <div className="flex items-start gap-2 p-3 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100">
                                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#109C3D]/20 to-[#063A41]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                        <FiUser className="text-[#109C3D]" size={16} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">Client</p>
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

                                            {/* Action Buttons */}
                                            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                                                {task.status === "in progress" ? (
                                                    <button
                                                        disabled={!user || user.currentRole === "client" || isCommenting}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (!user) {
                                                                handleAuthRedirect();
                                                                return;
                                                            }
                                                            handleRequestCompletion(task._id);
                                                        }}
                                                        className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow-md ${user && user.currentRole !== "client"
                                                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transform hover:scale-105"
                                                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-center gap-1">
                                                            <span>✓</span>
                                                            <span>Request Completion</span>
                                                        </div>
                                                    </button>
                                                ) : task.status === "pending" ? (
                                                    <>
                                                        <button
                                                            disabled={!user || isAccepted || isBidding || user.currentRole === "client"}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (!user) {
                                                                    handleAuthRedirect();
                                                                    return;
                                                                }
                                                                toggleBidForm(task._id);
                                                            }}
                                                            className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow-md ${user && !(isAccepted || isBidding || user.currentRole === "client")
                                                                ? "bg-gradient-to-r from-[#109C3D] to-[#063A41] text-white hover:from-[#0d7a30] hover:to-[#042a2f] transform hover:scale-105"
                                                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                                }`}
                                                        >
                                                            <div className="flex items-center justify-center gap-1">
                                                                <span>💰</span>
                                                                <span>Place Bid</span>
                                                            </div>
                                                        </button>
                                                        <button
                                                            disabled={!user || isAccepted || isAccepting || user.currentRole === "client"}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (!user) {
                                                                    handleAuthRedirect();
                                                                    return;
                                                                }
                                                                handleAcceptTask(task._id);
                                                            }}
                                                            className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow-md ${user && !(isAccepted || isAccepting || user.currentRole === "client")
                                                                ? "bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 transform hover:scale-105"
                                                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                                }`}
                                                        >
                                                            <div className="flex items-center justify-center gap-1">
                                                                <span>✓</span>
                                                                <span>Accept Task</span>
                                                            </div>
                                                        </button>
                                                    </>
                                                ) : null}
                                                {/* Message Button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (!user) {
                                                            handleAuthRedirect();
                                                            return;
                                                        }
                                                        const otherUserId = user.currentRole === 'client'
                                                            ? task.acceptedBy?._id
                                                            : task.client?._id;
                                                        if (otherUserId) {
                                                            handleOpenChat(otherUserId, task._id);
                                                        } else {
                                                            alert('No assigned user to message yet.');
                                                        }
                                                    }}
                                                    className="flex-1 py-3 px-4 bg-gradient-to-r from-[#109C3D] to-[#063A41] text-white rounded-xl font-semibold text-sm hover:from-[#0d7a30] hover:to-[#042a2f] transition-all shadow-sm hover:shadow-md transform hover:scale-105 flex items-center justify-center gap-2"
                                                >
                                                    <FiMessageCircle size={16} />
                                                    <span>Message</span>
                                                </button>
                                            </div>

                                            {/* Bid Form */}
                                            {isBidFormOpen && (
                                                <div className="mt-6 bg-gradient-to-br from-[#E5FFDB]/20 to-white p-6 rounded-2xl border border-[#109C3D]/10 shadow-md">
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#109C3D] to-[#063A41] flex items-center justify-center shadow-md">
                                                            <span className="text-xl">💰</span>
                                                        </div>
                                                        <h4 className="text-lg font-bold text-[#063A41]">Place Your Bid</h4>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <div>
                                                            <label className="block text-sm font-bold text-[#063A41] mb-1">Offer Price ($)</label>
                                                            <input
                                                                type="number"
                                                                min={1}
                                                                placeholder="Enter your offer"
                                                                className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#109C3D] transition bg-white"
                                                                value={bidOfferPrice}
                                                                onChange={(e) => setBidOfferPrice(Number(e.target.value))}
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-bold text-[#063A41] mb-1">Message (Optional)</label>
                                                            <textarea
                                                                placeholder="Tell the client why you're the best fit..."
                                                                className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#109C3D] transition resize-none bg-white"
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
                                                                handlePlaceBid(task._id);
                                                            }}
                                                            disabled={isBidding}
                                                            className="flex-1 bg-gradient-to-r from-[#109C3D] to-[#063A41] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:from-[#0d7a30] hover:to-[#042a2f] transition-all shadow-sm hover:shadow-md transform hover:scale-105"
                                                        >
                                                            {isBidding ? "Submitting..." : "Submit Bid"}
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleBidForm(task._id);
                                                            }}
                                                            disabled={isBidding}
                                                            className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all shadow-sm"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
                {/* Messenger Inbox */}
                <MessengerInbox
                    user={user}
                    allTasks={allTasks}
                    onOpenChat={handleOpenChat}
                    seenConversations={seenConversations}   
                />
                {/* Active Chat */}
                {activeChatUserId && (
                    <MessengerChat
                        isOpen={activeChatUserId !== null}
                        onClose={handleCloseChat}
                        otherUserId={activeChatUserId}
                        initialTaskId={activeInitialTaskId || undefined}
                        allTasks={allTasks}
                        user={user}
                        onSendMessage={handleSendMessage}
                        isCommenting={isCommenting}
                    />
                )}
            </section>
            <Footer />
        </div>
    );
};
export default AllAvailableTasks;