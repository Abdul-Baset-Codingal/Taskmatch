"use client";

import React, { useState, useMemo } from 'react';
import {
    FaDollarSign,
    FaClock,
    FaUser,
    FaMapMarkerAlt,
    FaCheck,
    FaCalendarAlt,
    FaComments,
    FaExternalLinkAlt,
    FaTimes,
    FaHourglassHalf,
    FaBan
} from 'react-icons/fa';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { useGetTaskerBidStatsQuery, useGetTasksBiddedByTaskerQuery } from '@/features/api/taskApi';
import Link from 'next/link';

interface Bid {
    _id?: string;
    taskerId: string | { _id: string; firstName: string; lastName: string };
    offerPrice: number;
    message: string;
    createdAt: string;
    status?: string;
}

interface Client {
    _id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
    email?: string;
}

interface Task {
    _id: string;
    taskTitle: string;
    taskDescription: string;
    serviceTitle: string;
    serviceId: string;
    location: string;
    schedule: string;
    estimatedTime?: string;
    status: string;
    price: number;
    createdAt: string;
    updatedAt: string;
    client: Client;
    myBid: Bid;
    myBidStatus: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
    totalBids: number;
    photos?: string[];
    acceptedBid?: {
        taskerId: string;
        offerPrice: number;
        message: string;
        acceptedAt: string;
    };
}

interface Stats {
    totalBids: number;
    pendingBids: number;
    acceptedBids: number;
    rejectedBids: number;
    withdrawnBids: number;
    totalBidAmount: number;
    averageBidAmount: number;
    acceptanceRate: number;
}

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const formatDateTime = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
    }).format(amount || 0);
};

const BiddedTasks: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('all');

    const { data, isLoading, isError, error, refetch } = useGetTasksBiddedByTaskerQuery(
        activeTab !== 'all' ? { bidStatus: activeTab } : undefined
    );

    const { data: statsData, isLoading: statsLoading } = useGetTaskerBidStatsQuery();

    const tasks: Task[] = data?.tasks || [];
    const stats: Stats = statsData?.stats || {
        totalBids: 0,
        pendingBids: 0,
        acceptedBids: 0,
        rejectedBids: 0,
        withdrawnBids: 0,
        totalBidAmount: 0,
        averageBidAmount: 0,
        acceptanceRate: 0
    };

    // Check if it's an empty state vs actual error
    const isEmptyOrNotFound =
        (error as any)?.status === 404 ||
        (error as any)?.data?.message?.toLowerCase()?.includes("no bids") ||
        tasks.length === 0;

    const isActualError = isError && !isEmptyOrNotFound;

    const getStatusStyle = (status: string) => {
        switch (status?.toLowerCase()) {
            case "pending": return "bg-amber-100 text-amber-800";
            case "open": return "bg-blue-100 text-blue-800";
            case "in progress": return "bg-purple-100 text-purple-800";
            case "completed": return "bg-[#063A41] text-white";
            case "cancelled": return "bg-gray-100 text-gray-600";
            case "declined": return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-600";
        }
    };

    const getBidStatusStyle = (status: string) => {
        switch (status) {
            case "accepted": return "bg-[#109C3D] text-white";
            case "rejected": return "bg-red-500 text-white";
            case "withdrawn": return "bg-gray-500 text-white";
            default: return "bg-amber-500 text-white";
        }
    };

    const getBidStatusIcon = (status: string) => {
        switch (status) {
            case "accepted": return <FaCheck className="w-3 h-3" />;
            case "rejected": return <FaBan className="w-3 h-3" />;
            case "withdrawn": return <FaTimes className="w-3 h-3" />;
            default: return <FaHourglassHalf className="w-3 h-3" />;
        }
    };

    const getBidStatusLabel = (status: string) => {
        switch (status) {
            case "accepted": return "Accepted";
            case "rejected": return "Not Selected";
            case "withdrawn": return "Withdrawn";
            default: return "Awaiting Response";
        }
    };

    // Tab stats
    const tabStats = useMemo(() => ({
        all: stats.totalBids,
        pending: stats.pendingBids,
        accepted: stats.acceptedBids,
        rejected: stats.rejectedBids,
    }), [stats]);

    // Loading State
    if (isLoading || statsLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-3 border-[#E5FFDB] border-t-[#109C3D] rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading your bids...</p>
                </div>
            </div>
        );
    }

    // Actual Error State
    if (isActualError) {
        return (
            <div className="min-h-screen bg-[#E5FFDB]/20 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-sm w-full border">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaTimes className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load bids</h3>
                    <p className="text-gray-500 text-sm mb-4">
                        {(error as any)?.data?.message || "Something went wrong. Please try again."}
                    </p>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-[#063A41] text-white rounded-lg hover:bg-[#063A41]/90 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#E5FFDB]/10">
            {/* Header */}
            <div className="bg-[#063A41]">
                <div className="max-w-5xl mx-auto px-4 py-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-white">My Bids</h1>
                            <p className="text-[#E5FFDB] text-sm mt-1">Track all the tasks you&apos;ve bid on</p>
                        </div>
                        {/* Quick Stats in Header */}
                        <div className="flex gap-4">
                            <div className="bg-white/10 rounded-lg px-4 py-2 text-center">
                                <p className="text-2xl font-bold text-white">{stats.totalBids}</p>
                                <p className="text-[#E5FFDB] text-xs">Total Bids</p>
                            </div>
                            <div className="bg-white/10 rounded-lg px-4 py-2 text-center">
                                <p className="text-2xl font-bold text-[#E5FFDB]">{formatCurrency(stats.totalBidAmount)}</p>
                                <p className="text-[#E5FFDB] text-xs">Total Value</p>
                            </div>
                            {stats.acceptanceRate > 0 && (
                                <div className="bg-white/10 rounded-lg px-4 py-2 text-center hidden sm:block">
                                    <p className="text-2xl font-bold text-[#109C3D]">{stats.acceptanceRate}%</p>
                                    <p className="text-[#E5FFDB] text-xs">Success Rate</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="flex gap-6 overflow-x-auto">
                        {[
                            { key: "all", label: "All Bids" },
                            { key: "pending", label: "Pending" },
                            { key: "accepted", label: "Accepted" },
                            { key: "rejected", label: "Not Selected" },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.key
                                        ? "border-[#109C3D] text-[#063A41]"
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                {tab.label}
                                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${activeTab === tab.key
                                        ? "bg-[#E5FFDB] text-[#109C3D]"
                                        : "bg-gray-100 text-gray-600"
                                    }`}>
                                    {tabStats[tab.key as keyof typeof tabStats] || 0}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 py-6">
                {tasks.length === 0 ? (
                    <div className="bg-white rounded-lg border p-12 text-center">
                        <div className="w-16 h-16 bg-[#E5FFDB] rounded-full flex items-center justify-center mx-auto mb-4">
                            <HiOutlineDocumentText className="w-8 h-8 text-[#109C3D]" />
                        </div>
                        <h3 className="text-lg font-medium text-[#063A41] mb-1">No bids found</h3>
                        <p className="text-gray-500 text-sm mb-4">
                            {activeTab === "all"
                                ? "You haven't placed any bids yet. Browse available tasks and start bidding!"
                                : `No ${activeTab === 'rejected' ? 'rejected' : activeTab} bids at the moment`}
                        </p>
                        <Link
                            href="/browse-tasks"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#109C3D] text-white rounded-lg hover:bg-[#0d8534] transition-colors"
                        >
                            <FaExternalLinkAlt className="w-3 h-3" />
                            Browse Tasks
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {tasks.map((task) => (
                            <div
                                key={task._id}
                                className="bg-white rounded-lg border hover:border-[#109C3D]/30 hover:shadow-md transition-all"
                            >
                                {/* Task Header */}
                                <div className="p-5 border-b">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusStyle(task.status)}`}>
                                                    {task.status?.charAt(0).toUpperCase() + task.status?.slice(1)}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    Posted {formatDate(task.createdAt)}
                                                </span>
                                                {task.serviceTitle && (
                                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                        {task.serviceTitle}
                                                    </span>
                                                )}
                                            </div>
                                            <Link
                                                href={`/tasks/${task._id}`}
                                                className="text-lg font-semibold text-[#063A41] hover:text-[#109C3D] transition-colors mb-1 block"
                                            >
                                                {task.taskTitle}
                                            </Link>
                                            <p className="text-gray-600 text-sm line-clamp-2">{task.taskDescription}</p>
                                        </div>

                                        {/* Task Budget */}
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-xs text-gray-500">Task Budget</p>
                                            <p className="text-xl font-bold text-[#109C3D]">
                                                {formatCurrency(task.price)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Task Details */}
                                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1.5">
                                            <FaUser className="w-3.5 h-3.5 text-[#109C3D]" />
                                            <span>{task.client?.firstName} {task.client?.lastName}</span>
                                        </div>

                                        {task.location && (
                                            <div className="flex items-center gap-1.5">
                                                <FaMapMarkerAlt className="w-3.5 h-3.5 text-[#109C3D]" />
                                                <span className="truncate max-w-[200px]">{task.location}</span>
                                            </div>
                                        )}

                                        {task.schedule && (
                                            <div className="flex items-center gap-1.5">
                                                <FaCalendarAlt className="w-3.5 h-3.5 text-[#109C3D]" />
                                                <span>{task.schedule}</span>
                                            </div>
                                        )}

                                        {task.estimatedTime && (
                                            <div className="flex items-center gap-1.5">
                                                <FaClock className="w-3.5 h-3.5 text-[#109C3D]" />
                                                <span>{task.estimatedTime}</span>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-1.5">
                                            <FaComments className="w-3.5 h-3.5 text-[#109C3D]" />
                                            <span>{task.totalBids} bid{task.totalBids !== 1 ? 's' : ''}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Your Bid Section */}
                                <div className="bg-[#E5FFDB]/30 p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-semibold text-[#063A41] flex items-center gap-2">
                                            <FaDollarSign className="w-4 h-4 text-[#109C3D]" />
                                            Your Bid
                                        </h4>
                                        <span className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${getBidStatusStyle(task.myBidStatus)}`}>
                                            {getBidStatusIcon(task.myBidStatus)}
                                            {getBidStatusLabel(task.myBidStatus)}
                                        </span>
                                    </div>

                                    {/* Bid Card */}
                                    <div className="bg-white rounded-lg border border-[#109C3D]/20 p-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="text-center">
                                                    <p className="text-2xl font-bold text-[#063A41]">
                                                        {formatCurrency(task.myBid?.offerPrice)}
                                                    </p>
                                                    <p className="text-xs text-gray-500">Your offer</p>
                                                </div>

                                                {task.myBid?.message && (
                                                    <div className="border-l border-[#109C3D]/20 pl-4 flex-1">
                                                        <p className="text-xs text-gray-500 mb-1">Your message:</p>
                                                        <p className="text-sm text-gray-600 line-clamp-2 italic">
                                                            &quot;{task.myBid.message}&quot;
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="text-right flex-shrink-0">
                                                <p className="text-xs text-gray-400">
                                                    {formatDateTime(task.myBid?.createdAt)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Comparison with budget */}
                                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4 text-xs">
                                            <span className="text-gray-500">
                                                Task Budget: <strong className="text-gray-700">{formatCurrency(task.price)}</strong>
                                            </span>
                                            <span className="text-gray-300">•</span>
                                            <span className={`${task.myBid?.offerPrice <= task.price
                                                    ? 'text-[#109C3D]'
                                                    : 'text-amber-600'
                                                }`}>
                                                {task.myBid?.offerPrice <= task.price
                                                    ? `${formatCurrency(task.price - task.myBid?.offerPrice)} under budget`
                                                    : `${formatCurrency(task.myBid?.offerPrice - task.price)} over budget`
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    {/* Accepted Message */}
                                    {task.myBidStatus === 'accepted' && (
                                        <div className="mt-4 bg-[#109C3D]/10 border border-[#109C3D]/20 rounded-lg p-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 bg-[#109C3D] rounded-full flex items-center justify-center flex-shrink-0">
                                                    <FaCheck className="w-4 h-4 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-[#063A41]">
                                                        Congratulations! Your bid was accepted
                                                    </p>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        The client has chosen you for this task. You can now start working on it.
                                                    </p>
                                                    {task.acceptedBid?.acceptedAt && (
                                                        <p className="text-xs text-gray-500 mt-2">
                                                            Accepted on {formatDateTime(task.acceptedBid.acceptedAt)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Rejected Message */}
                                    {task.myBidStatus === 'rejected' && (
                                        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <FaBan className="w-4 h-4 text-red-500" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800">
                                                        Another tasker was selected
                                                    </p>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        The client chose a different tasker for this job. Keep bidding on other tasks!
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Footer Actions */}
                                <div className="px-5 py-3 border-t bg-white flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        {task.photos && task.photos.length > 0 && (
                                            <span>{task.photos.length} photo{task.photos.length !== 1 ? 's' : ''}</span>
                                        )}
                                    </div>
                             
                                </div>

                                {/* Completed Badge */}
                                {task.status === "completed" && (
                                    <div className="px-5 py-3 border-t bg-[#E5FFDB] flex items-center gap-2">
                                        <FaCheck className="w-4 h-4 text-[#109C3D]" />
                                        <span className="text-sm font-medium text-[#063A41]">Task Completed</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BiddedTasks;