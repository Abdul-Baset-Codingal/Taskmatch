/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useGetQuotesByTaskerIdQuery, useUpdateTaskStatusMutation, useSubmitBidMutation } from "@/features/api/taskerApi";
import { FaDollarSign, FaClock, FaUser, FaPlus, FaMapMarkerAlt, FaTimes, FaCheck, FaInfoCircle, FaCalculator } from "react-icons/fa";
import { HiOutlineDocumentText } from "react-icons/hi";
import { toast } from "react-toastify";

// Fee constants (same as backend)
const PLATFORM_FEE_PERCENT = 0.12;  // 12%
const TAX_PERCENT = 0.13;           // 13% HST (on bid amount)

interface FeeBreakdown {
    bidAmount: number;
    platformFee: number;
    tax: number;
    totalDeductions: number;
    taskerPayout: number;
    totalClientPays: number;
}

interface Bid {
    _id: string;
    bidAmount: number;
    bidDescription: string;
    estimatedDuration: number;
    submittedAt: string;
    status: "pending" | "accepted" | "rejected";
    feeBreakdown?: {
        taskerPayoutCents: number;
        totalClientPaysCents: number;
    };
}

interface Task {
    _id: string;
    taskTitle: string;
    taskDescription: string;
    status: string;
    tasker: { _id: string; firstName: string; lastName: string };
    client: { _id: string; firstName: string; lastName: string };
    budget: number | null;
    location: string;
    preferredDateTime: string | null;
    urgency: string;
    createdAt: string;
    bids: Bid[];
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const formatDateTime = (dateString: string) => {
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
    }).format(amount);
};

// Calculate fees on frontend (for instant preview)
// Platform Fee: 12% of bid, Tax: 13% of bid, Tasker gets 75%
const calculateFees = (bidAmount: number): FeeBreakdown => {
    const bidAmountCents = Math.round(bidAmount * 100);

    // Calculate deductions from tasker
    const platformFee = Math.round(bidAmountCents * PLATFORM_FEE_PERCENT); // 12%
    const tax = Math.round(bidAmountCents * TAX_PERCENT); // 13%
    const totalDeductions = platformFee + tax; // 25%
    const taskerPayout = bidAmountCents - totalDeductions; // 75%

    // What client pays (bid amount + their platform fee + tax on their fee)
    const clientPlatformFee = Math.round(bidAmountCents * PLATFORM_FEE_PERCENT);
    const clientTax = Math.round(clientPlatformFee * TAX_PERCENT);
    const totalClientPays = bidAmountCents + clientPlatformFee + clientTax;

    return {
        bidAmount: bidAmountCents / 100,
        platformFee: platformFee / 100,
        tax: tax / 100,
        totalDeductions: totalDeductions / 100,
        taskerPayout: taskerPayout / 100,
        totalClientPays: totalClientPays / 100,
    };
};

// Function to parse and format location based on task status
const formatLocation = (location: string, status: string): { display: string; isPartial: boolean } => {
    if (!location) return { display: "", isPartial: false };

    if (location.toLowerCase() === "remote") {
        return { display: "Remote", isPartial: false };
    }

    const parts = location.split(',').map(part => part.trim());

    if (status === "accepted" || status === "completed") {
        return { display: location, isPartial: false };
    }

    if (parts.length >= 3) {
        const cityAndProvince = parts.slice(-2).join(', ');
        return { display: cityAndProvince, isPartial: true };
    } else if (parts.length === 2) {
        return { display: location, isPartial: false };
    } else {
        return { display: location, isPartial: false };
    }
};

// ==================== FEE PREVIEW MODAL COMPONENT ====================
interface FeePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    bidData: {
        bidAmount: string;
        bidDescription: string;
        estimatedDuration: string;
    };
    taskTitle: string;
    isSubmitting: boolean;
}

const FeePreviewModal: React.FC<FeePreviewModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    bidData,
    taskTitle,
    isSubmitting
}) => {
    const fees = useMemo(() => {
        const amount = Number(bidData.bidAmount) || 0;
        return calculateFees(amount);
    }, [bidData.bidAmount]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#063A41] to-[#0a5a65] px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <FaCalculator className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Confirm Your Bid</h3>
                                <p className="text-[#E5FFDB] text-sm">Review fee breakdown</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/70 hover:text-white transition-colors"
                        >
                            <FaTimes className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Task Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-500 mb-1">Bidding on</p>
                        <p className="font-semibold text-[#063A41] line-clamp-2">{taskTitle}</p>
                        {bidData.estimatedDuration && (
                            <p className="text-sm text-gray-500 mt-2">
                                <FaClock className="inline w-3 h-3 mr-1" />
                                Estimated: {bidData.estimatedDuration} hour{Number(bidData.estimatedDuration) !== 1 ? 's' : ''}
                            </p>
                        )}
                    </div>

                    {/* Fee Breakdown */}
                    <div className="space-y-4">
                        {/* Your Bid */}
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600">Your Bid Amount</span>
                            <span className="text-xl font-bold text-[#063A41]">
                                {formatCurrency(fees.bidAmount)}
                            </span>
                        </div>

                        {/* What You Receive Section */}
                        <div className="border-t border-dashed border-gray-200 pt-4">
                            <div className="flex items-center gap-2 mb-3">
                                <FaDollarSign className="w-4 h-4 text-[#109C3D]" />
                                <span className="text-sm font-medium text-gray-700">What you receive:</span>
                            </div>
                            <div className="bg-[#E5FFDB] rounded-lg p-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Bid Amount</span>
                                    <span>{formatCurrency(fees.bidAmount)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-red-600">
                                    <span>Platform Fee </span>
                                    <span>-{formatCurrency(fees.platformFee)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-red-600">
                                    <span>HST (13%)</span>
                                    <span>-{formatCurrency(fees.tax)}</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 pt-1">
                                    <span>Total Deductions </span>
                                    <span>-{formatCurrency(fees.totalDeductions)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-[#109C3D] pt-2 border-t border-green-300 text-lg">
                                    <span>You Receive </span>
                                    <span>{formatCurrency(fees.taskerPayout)}</span>
                                </div>
                            </div>
                        </div>

                     

                        {/* Note about payment */}
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
                            <p className="text-xs text-amber-800">
                                <FaInfoCircle className="inline w-3 h-3 mr-1" />
                                <strong>Note:</strong> Payment will be held securely when the client accepts your bid.
                                You&apos;ll receive {formatCurrency(fees.taskerPayout)} after task completion.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        Go Back
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-3 bg-[#109C3D] text-white font-medium rounded-lg hover:bg-[#0d8534] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Submitting...
                            </>
                        ) : (
                            <>
                                <FaCheck className="w-4 h-4" />
                                Submit Bid
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ==================== MAIN COMPONENT ====================
export default function TaskerQuotes() {
    const [user, setUser] = useState<{ _id: string; role: string } | null>(null);
    const [authChecked, setAuthChecked] = useState(false);
    const [activeTab, setActiveTab] = useState<string>("all");
    const [openBidForm, setOpenBidForm] = useState<string | null>(null);
    const [bidData, setBidData] = useState({ bidAmount: "", bidDescription: "", estimatedDuration: "1" });

    // State for modal
    const [showFeeModal, setShowFeeModal] = useState(false);
    const [currentTaskForBid, setCurrentTaskForBid] = useState<Task | null>(null);

    const [updateTaskStatus, { isLoading: isUpdating }] = useUpdateTaskStatusMutation();
    const [submitBid, { isLoading: isSubmitting }] = useSubmitBidMutation();

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const res = await fetch(`/api/auth/verify-token`, {
                    method: "GET",
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser({ _id: data.user._id, role: data.user.currentRole });
                }
            } catch (err) {
                console.error("Auth check failed:", err);
            } finally {
                setAuthChecked(true);
            }
        };
        checkLogin();
    }, []);

    const { data, isLoading: quotesLoading, isError, error } = useGetQuotesByTaskerIdQuery(user?._id || "", {
        skip: !user?._id || !authChecked,
        refetchOnMountOrArgChange: true,
    });

    const tasks: Task[] = data?.quotes || [];

    const isEmptyOrNotFound =
        (error as any)?.status === 404 ||
        (error as any)?.status === 400 ||
        (error as any)?.data?.message?.toLowerCase()?.includes("no quotes") ||
        (error as any)?.data?.message?.toLowerCase()?.includes("not found") ||
        (error as any)?.data?.quotes?.length === 0;

    const isActualError = isError && !isEmptyOrNotFound;

    const canBid = (task: Task) => task.status === "pending" || task.status === "rejected" || task.status === "bidded";

    const handleOpenBidForm = (taskId: string) => {
        setOpenBidForm(taskId);
        setBidData({ bidAmount: "", bidDescription: "", estimatedDuration: "1" });
    };

    const handleCloseBidForm = () => {
        setOpenBidForm(null);
        setBidData({ bidAmount: "", bidDescription: "", estimatedDuration: "1" });
    };

    // Show modal instead of submitting directly
    const handlePreviewBid = (task: Task) => {
        if (!bidData.bidAmount || Number(bidData.bidAmount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        if (Number(bidData.bidAmount) < 1) {
            toast.error("Minimum bid amount is $1.00");
            return;
        }

        setCurrentTaskForBid(task);
        setShowFeeModal(true);
    };

    // Actual submission after modal confirmation
    const handleConfirmBid = async () => {
        if (!currentTaskForBid) return;

        try {
            const result = await submitBid({
                quoteId: currentTaskForBid._id,
                bidAmount: Number(bidData.bidAmount),
                bidDescription: bidData.bidDescription,
                estimatedDuration: Number(bidData.estimatedDuration) || 1,
            }).unwrap();

            const fees = calculateFees(Number(bidData.bidAmount));
            toast.success(
                `Bid submitted! You'll receive ${formatCurrency(fees.taskerPayout)} upon completion.`,
                { autoClose: 5000 }
            );

            setShowFeeModal(false);
            setCurrentTaskForBid(null);
            handleCloseBidForm();
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to submit bid");
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "pending": return "bg-amber-100 text-amber-800";
            case "bidded": return "bg-blue-100 text-blue-800";
            case "accepted": return "bg-[#E5FFDB] text-[#109C3D]";
            case "completed": return "bg-[#063A41] text-white";
            case "rejected": return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-600";
        }
    };

    const getBidStatusStyle = (status: string) => {
        switch (status) {
            case "accepted": return "bg-[#109C3D] text-white";
            case "rejected": return "bg-red-500 text-white";
            default: return "bg-amber-500 text-white";
        }
    };

    const filteredTasks = activeTab === "all" ? tasks : tasks.filter((t) => t.status === activeTab);

    const stats = {
        all: tasks.length,
        pending: tasks.filter((t) => t.status === "pending").length,
        bidded: tasks.filter((t) => t.status === "bidded").length,
        accepted: tasks.filter((t) => t.status === "accepted").length,
        completed: tasks.filter((t) => t.status === "completed").length,
    };

    // Real-time fee preview while typing
    const currentFees = useMemo(() => {
        const amount = Number(bidData.bidAmount) || 0;
        if (amount <= 0) return null;
        return calculateFees(amount);
    }, [bidData.bidAmount]);

    // Loading
    if (!authChecked || quotesLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-3 border-[#E5FFDB] border-t-[#109C3D] rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading quotes...</p>
                </div>
            </div>
        );
    }

    // Auth Error
    if (!user || user.role !== "tasker") {
        return (
            <div className="min-h-screen bg-[#E5FFDB]/20 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-sm w-full border border-[#109C3D]/20">
                    <div className="w-16 h-16 bg-[#E5FFDB] rounded-full flex items-center justify-center mx-auto mb-4">
                        <HiOutlineDocumentText className="w-8 h-8 text-[#063A41]" />
                    </div>
                    <h2 className="text-xl font-semibold text-[#063A41] mb-2">Access Restricted</h2>
                    <p className="text-gray-500">Please log in as a tasker to view quotes.</p>
                </div>
            </div>
        );
    }

    // Actual Error
    if (isActualError) {
        return (
            <div className="min-h-screen bg-[#E5FFDB]/20 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-sm w-full border">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaTimes className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load quotes</h3>
                    <p className="text-gray-500 text-sm mb-4">
                        {(error as any)?.data?.message || "Something went wrong. Please try again."}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-[#063A41] text-white rounded-lg hover:bg-[#063A41]/90"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#E5FFDB]/10">
            {/* Fee Preview Modal */}
            <FeePreviewModal
                isOpen={showFeeModal}
                onClose={() => {
                    setShowFeeModal(false);
                    setCurrentTaskForBid(null);
                }}
                onConfirm={handleConfirmBid}
                bidData={bidData}
                taskTitle={currentTaskForBid?.taskTitle || ""}
                isSubmitting={isSubmitting}
            />

            {/* Header */}
            <div className="bg-[#063A41]">
                <div className="max-w-5xl mx-auto px-4 py-8">
                    <h1 className="text-2xl font-bold text-white">Quote Requests</h1>
                    <p className="text-[#E5FFDB] text-sm mt-1">Manage and respond to client quotes</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="flex gap-6 overflow-x-auto">
                        {[
                            { key: "all", label: "All" },
                            { key: "pending", label: "Pending" },
                            { key: "bidded", label: "Bidded" },
                            { key: "accepted", label: "Accepted" },
                            { key: "completed", label: "Completed" },
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
                                    {stats[tab.key as keyof typeof stats]}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 py-6">
                {(filteredTasks.length === 0 || isEmptyOrNotFound) ? (
                    <div className="bg-white rounded-lg border p-12 text-center">
                        <div className="w-16 h-16 bg-[#E5FFDB] rounded-full flex items-center justify-center mx-auto mb-4">
                            <HiOutlineDocumentText className="w-8 h-8 text-[#109C3D]" />
                        </div>
                        <h3 className="text-lg font-medium text-[#063A41] mb-1">No quotes available</h3>
                        <p className="text-gray-500 text-sm">
                            {activeTab === "all"
                                ? "New quote requests from clients will appear here"
                                : `No ${activeTab} quotes at the moment`}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredTasks.map((task) => {
                            const locationInfo = formatLocation(task.location, task.status);

                            return (
                                <div key={task._id} className="bg-white rounded-lg border hover:border-[#109C3D]/30 hover:shadow-md transition-all">
                                    {/* Task Header */}
                                    <div className="p-5 border-b">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusStyle(task.status)}`}>
                                                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        {formatDate(task.createdAt)}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-semibold text-[#063A41] mb-1">{task.taskTitle}</h3>
                                                <p className="text-gray-600 text-sm line-clamp-2">{task.taskDescription}</p>
                                            </div>
                                            {task.budget && (
                                                <div className="text-right flex-shrink-0">
                                                    <p className="text-xs text-gray-500">Client&apos;s Budget</p>
                                                    <p className="text-xl font-bold text-[#109C3D]">${task.budget}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Task Details */}
                                        <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1.5">
                                                <FaUser className="w-3.5 h-3.5 text-[#109C3D]" />
                                                <span>{task.client.firstName} {task.client.lastName}</span>
                                            </div>

                                            {task.location && (
                                                <div className="flex items-center gap-1.5">
                                                    <FaMapMarkerAlt className="w-3.5 h-3.5 text-[#109C3D]" />
                                                    <span>{locationInfo.display}</span>
                                                </div>
                                            )}

                                            {task.preferredDateTime && (
                                                <div className="flex items-center gap-1.5">
                                                    <FaClock className="w-3.5 h-3.5 text-[#109C3D]" />
                                                    <span>{formatDateTime(task.preferredDateTime)}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1.5">
                                                <span className={`text-xs px-2 py-0.5 rounded ${task.urgency?.toLowerCase() === "urgent" ? "bg-red-100 text-red-700" :
                                                    task.urgency?.toLowerCase() === "high" ? "bg-orange-100 text-orange-700" :
                                                        "bg-gray-100 text-gray-600"
                                                    }`}>
                                                    {task.urgency}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* BIDS SECTION */}
                                    <div className="bg-[#E5FFDB]/30 p-5">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-semibold text-[#063A41] flex items-center gap-2">
                                                <FaDollarSign className="w-4 h-4 text-[#109C3D]" />
                                                Your Bids
                                                {task.bids.length > 0 && (
                                                    <span className="bg-[#063A41] text-white text-xs px-2 py-0.5 rounded-full">
                                                        {task.bids.length}
                                                    </span>
                                                )}
                                            </h4>
                                            {canBid(task) && openBidForm !== task._id && (
                                                <button
                                                    onClick={() => handleOpenBidForm(task._id)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#109C3D] text-white text-sm font-medium rounded-lg hover:bg-[#0d8534] transition-colors"
                                                >
                                                    <FaPlus className="w-3 h-3" />
                                                    New Bid
                                                </button>
                                            )}
                                        </div>

                                        {/* Existing Bids List */}
                                        {task.bids.length > 0 ? (
                                            <div className="space-y-3 mb-4">
                                                {task.bids.map((bid) => {
                                                    const bidFees = calculateFees(bid.bidAmount);
                                                    return (
                                                        <div
                                                            key={bid._id}
                                                            className="bg-white rounded-lg border border-[#109C3D]/20 p-4"
                                                        >
                                                            <div className="flex items-center justify-between gap-4">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="text-center">
                                                                        <p className="text-2xl font-bold text-[#063A41]">${bid.bidAmount}</p>
                                                                        <p className="text-xs text-gray-500">{bid.estimatedDuration}h est.</p>
                                                                    </div>
                                                                    {bid.bidDescription && (
                                                                        <div className="border-l border-[#109C3D]/20 pl-4">
                                                                            <p className="text-sm text-gray-600 line-clamp-2">{bid.bidDescription}</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-3 flex-shrink-0">
                                                                    <span className="text-xs text-gray-400">{formatDate(bid.submittedAt)}</span>
                                                                    <span className={`text-xs font-medium px-2 py-1 rounded ${getBidStatusStyle(bid.status)}`}>
                                                                        {bid.status === "pending" ? "Awaiting" : bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            {/* Show payout info with updated fees */}
                                                            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500">
                                                                <span>
                                                                    Bid: <strong className="text-gray-700">{formatCurrency(bidFees.bidAmount)}</strong>
                                                                </span>
                                                                <span>•</span>
                                                                <span>
                                                                    Deductions (25%): <strong className="text-red-500">-{formatCurrency(bidFees.totalDeductions)}</strong>
                                                                </span>
                                                                <span>•</span>
                                                                <span>
                                                                    You receive: <strong className="text-[#109C3D]">{formatCurrency(bidFees.taskerPayout)}</strong>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="bg-white rounded-lg border border-dashed border-[#109C3D]/30 p-6 text-center mb-4">
                                                <p className="text-gray-500 text-sm">No bids submitted yet</p>
                                                {canBid(task) && (
                                                    <p className="text-[#109C3D] text-xs mt-1">Click &quot;New Bid&quot; to submit your offer</p>
                                                )}
                                            </div>
                                        )}

                                        {/* Bid Form */}
                                        {openBidForm === task._id && (
                                            <div className="bg-white rounded-lg border-2 border-[#109C3D] p-5">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h5 className="font-semibold text-[#063A41]">Submit New Bid</h5>
                                                    <button
                                                        onClick={handleCloseBidForm}
                                                        className="text-gray-400 hover:text-gray-600"
                                                    >
                                                        <FaTimes className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-[#063A41] mb-1">
                                                            Your Bid Amount ($) <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            step="0.01"
                                                            placeholder="0.00"
                                                            value={bidData.bidAmount}
                                                            onChange={(e) => setBidData({ ...bidData, bidAmount: e.target.value })}
                                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-[#063A41] mb-1">
                                                            Duration (hours)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min="0.5"
                                                            step="0.5"
                                                            placeholder="1"
                                                            value={bidData.estimatedDuration}
                                                            onChange={(e) => setBidData({ ...bidData, estimatedDuration: e.target.value })}
                                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-[#063A41] mb-1">
                                                        Message (optional)
                                                    </label>
                                                    <textarea
                                                        rows={2}
                                                        placeholder="Add a note about your bid..."
                                                        value={bidData.bidDescription}
                                                        onChange={(e) => setBidData({ ...bidData, bidDescription: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent resize-none"
                                                    />
                                                </div>

                                                {/* Real-time Fee Preview */}
                                                {currentFees && Number(bidData.bidAmount) > 0 && (
                                                    <div className="bg-gradient-to-r from-[#E5FFDB] to-[#d4f5c7] rounded-lg p-4 mb-4">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <FaCalculator className="w-4 h-4 text-[#109C3D]" />
                                                            <span className="text-sm font-semibold text-[#063A41]">Fee Preview</span>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="bg-white/70 rounded-lg p-3">
                                                                <p className="text-xs text-gray-500 mb-1">Your Bid</p>
                                                                <p className="text-lg font-bold text-[#063A41]">
                                                                    {formatCurrency(currentFees.bidAmount)}
                                                                </p>
                                                            </div>
                                                            <div className="bg-white/70 rounded-lg p-3">
                                                                <p className="text-xs text-gray-500 mb-1">You Receive </p>
                                                                <p className="text-lg font-bold text-[#109C3D]">
                                                                    {formatCurrency(currentFees.taskerPayout)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="mt-3 pt-3 border-t border-green-300/50 grid grid-cols-2 gap-2 text-xs text-gray-600">
                                                            <div className="flex justify-between">
                                                                <span>Platform Fee :</span>
                                                                <span className="text-red-500">-{formatCurrency(currentFees.platformFee)}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span>HST (13%):</span>
                                                                <span className="text-red-500">-{formatCurrency(currentFees.tax)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Submit Button - Opens Modal */}
                                                <button
                                                    onClick={() => handlePreviewBid(task)}
                                                    disabled={isSubmitting || !bidData.bidAmount || Number(bidData.bidAmount) <= 0}
                                                    className="w-full px-4 py-3 bg-[#109C3D] text-white font-medium rounded-lg hover:bg-[#0d8534] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <FaCalculator className="w-4 h-4" />
                                                    Review & Submit Bid
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Status Update for accepted tasks */}
                                    {!canBid(task) && task.status !== "completed" && (
                                        <div className="px-5 py-3 border-t bg-white flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Update task status:</span>
                                            <select
                                                value={task.status}
                                                onChange={(e) => updateTaskStatus({ taskId: task._id, status: e.target.value })}
                                                disabled={isUpdating}
                                                className="px-3 py-1.5 border border-[#109C3D]/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#109C3D] bg-white"
                                            >
                                                <option value="accepted">Accepted</option>
                                                <option value="completed">Mark Completed</option>
                                                <option value="rejected">Reject</option>
                                            </select>
                                        </div>
                                    )}

                                    {/* Completed Badge */}
                                    {task.status === "completed" && (
                                        <div className="px-5 py-3 border-t bg-[#E5FFDB] flex items-center gap-2">
                                            <FaCheck className="w-4 h-4 text-[#109C3D]" />
                                            <span className="text-sm font-medium text-[#063A41]">Task Completed</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}