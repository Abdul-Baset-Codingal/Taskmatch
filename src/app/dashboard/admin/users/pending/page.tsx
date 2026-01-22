// app/dashboard/admin/users/pending-taskers/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import {
    Search,
    Eye,
    Mail,
    Phone,
    MapPin,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    RefreshCw,
    X,
    Star,
    Shield,
    Loader2,
    ChevronLeft,
    ChevronRight,
    UserCheck,
    ChevronDown,
    Filter,
    MoreVertical,
    ExternalLink,
    FileText,
    CreditCard,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';
import { useApproveRejectTaskerMutation, useGetAdminTaskersQuery } from '@/features/auth/authApi';
import Image from 'next/image';
import Link from 'next/link';

// ==================== HELPER FUNCTIONS ====================

const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
};

// ==================== SUB COMPONENTS ====================

// Verification Progress
const VerificationProgress: React.FC<{
    verification: { email: boolean; phone: boolean; identity: boolean; address: boolean }
}> = ({ verification }) => {
    const items = [
        { key: 'email', label: 'Email', icon: Mail },
        { key: 'phone', label: 'Phone', icon: Phone },
        { key: 'identity', label: 'ID', icon: Shield },
        { key: 'address', label: 'Address', icon: MapPin },
    ];

    const verifiedCount = Object.values(verification).filter(Boolean).length;

    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
                {items.map(({ key, label, icon: Icon }) => {
                    const isVerified = verification[key as keyof typeof verification];
                    return (
                        <div
                            key={key}
                            title={`${label}: ${isVerified ? 'Verified' : 'Not Verified'}`}
                            className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${isVerified
                                    ? 'bg-emerald-50 text-emerald-600'
                                    : 'bg-gray-50 text-gray-300'
                                }`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                        </div>
                    );
                })}
            </div>
            <span className="text-xs text-gray-500">{verifiedCount}/4</span>
        </div>
    );
};

// Category Pills
const CategoryPills: React.FC<{ categories: string[] }> = ({ categories }) => {
    if (!categories?.length) {
        return <span className="text-sm text-gray-400">No categories</span>;
    }

    const maxShow = 2;
    const remaining = categories.length - maxShow;

    return (
        <div className="flex items-center gap-1.5 flex-wrap">
            {categories.slice(0, maxShow).map((cat, i) => (
                <span
                    key={i}
                    className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded"
                >
                    {cat.length > 18 ? cat.slice(0, 18) + '...' : cat}
                </span>
            ))}
            {remaining > 0 && (
                <span className="px-2 py-0.5 bg-slate-50 text-slate-500 text-xs rounded">
                    +{remaining}
                </span>
            )}
        </div>
    );
};

// Payment Status Indicator
const PaymentStatus: React.FC<{ status: string }> = ({ status }) => {
    const config: Record<string, { dot: string; text: string; label: string }> = {
        active: { dot: 'bg-emerald-500', text: 'text-emerald-700', label: 'Connected' },
        pending: { dot: 'bg-amber-500', text: 'text-amber-700', label: 'Pending' },
        not_connected: { dot: 'bg-gray-300', text: 'text-gray-500', label: 'Not Set' },
    };

    const { dot, text, label } = config[status] || config.not_connected;

    return (
        <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${dot}`} />
            <span className={`text-xs font-medium ${text}`}>{label}</span>
        </div>
    );
};

// Stats Display
const StatsDisplay: React.FC<{ rating: number; tasks: number; rate: number }> = ({ rating, tasks, rate }) => {
    return (
        <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="font-medium text-gray-900">{rating.toFixed(1)}</span>
            </div>
            <div className="text-gray-400">•</div>
            <div className="text-gray-600">
                <span className="font-medium text-gray-900">{tasks}</span> tasks
            </div>
            <div className="text-gray-400">•</div>
            <div className="text-gray-600">
                <span className="font-medium text-gray-900">{rate}%</span> rate
            </div>
        </div>
    );
};

// ==================== REJECT MODAL ====================

const RejectModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
    taskerName: string;
    isLoading: boolean;
}> = ({ isOpen, onClose, onConfirm, taskerName, isLoading }) => {
    const [reason, setReason] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Reject Application</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        You are about to reject {taskerName}&apos;s application
                    </p>
                </div>

                <div className="p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reason for rejection
                        <span className="text-gray-400 font-normal ml-1">(optional)</span>
                    </label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Provide a reason that will be sent to the applicant..."
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none transition-all"
                        rows={4}
                    />
                </div>

                <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(reason)}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Reject Application
                    </button>
                </div>
            </div>
        </div>
    );
};

// ==================== DETAIL MODAL ====================

const DetailModal: React.FC<{
    tasker: any;
    isOpen: boolean;
    onClose: () => void;
    onApprove: () => void;
    onReject: () => void;
    isLoading: boolean;
}> = ({ tasker, isOpen, onClose, onApprove, onReject, isLoading }) => {
    if (!isOpen || !tasker) return null;

    const verificationItems = [
        { key: 'email', label: 'Email Address', icon: Mail },
        { key: 'phone', label: 'Phone Number', icon: Phone },
        { key: 'identity', label: 'Identity Document', icon: Shield },
        { key: 'address', label: 'Address', icon: MapPin },
    ];

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Application Details</h2>
                        <p className="text-sm text-gray-500">Review before making a decision</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Applicant Info */}
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {tasker.profilePicture ? (
                                <Image
                                    src={tasker.profilePicture}
                                    alt={tasker.name}
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-xl font-semibold text-slate-400">
                                    {tasker.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                                </span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-semibold text-gray-900">{tasker.name}</h3>
                            <div className="mt-2 space-y-1">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    {tasker.email}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    {tasker.phone}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    {[tasker.location?.city, tasker.location?.province, tasker.location?.country]
                                        .filter(Boolean).join(', ') || 'Location not set'}
                                </div>
                            </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">
                                <Clock className="w-3 h-3" />
                                Pending
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                                Applied {formatDate(tasker.createdAt)}
                            </p>
                        </div>
                    </div>

                    {/* Service Categories */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Service Categories</h4>
                        <div className="flex flex-wrap gap-2">
                            {tasker.categories?.length > 0 ? (
                                tasker.categories.map((cat: string, i: number) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-sm rounded-lg"
                                    >
                                        {cat}
                                    </span>
                                ))
                            ) : (
                                <span className="text-sm text-gray-400">No categories selected</span>
                            )}
                        </div>
                    </div>

                    {/* Verification Status */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Verification Status</h4>
                        <div className="grid grid-cols-2 gap-3">
                            {verificationItems.map(({ key, label, icon: Icon }) => {
                                const isVerified = tasker.verification?.[key];
                                return (
                                    <div
                                        key={key}
                                        className={`flex items-center gap-3 p-3 rounded-lg border ${isVerified
                                                ? 'bg-emerald-50 border-emerald-100'
                                                : 'bg-gray-50 border-gray-100'
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isVerified ? 'bg-emerald-100' : 'bg-gray-100'
                                            }`}>
                                            <Icon className={`w-4 h-4 ${isVerified ? 'text-emerald-600' : 'text-gray-400'}`} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{label}</p>
                                            <p className={`text-xs ${isVerified ? 'text-emerald-600' : 'text-gray-400'}`}>
                                                {isVerified ? 'Verified' : 'Not verified'}
                                            </p>
                                        </div>
                                        {isVerified ? (
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        ) : (
                                            <AlertCircle className="w-5 h-5 text-gray-300" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Payment & Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Payment Setup</h4>
                            <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-gray-400" />
                                <PaymentStatus status={tasker.stripeConnectStatus || 'not_connected'} />
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Performance</h4>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                    <span className="font-medium">{tasker.rating?.toFixed(1) || '0.0'}</span>
                                </div>
                                <span className="text-gray-300">|</span>
                                <span className="text-gray-600">{tasker.stats?.tasksCompleted || 0} tasks</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between flex-shrink-0 bg-white">
                    <Link href={`/dashboard/admin/users/${tasker.id}`}>
                        <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1.5 transition-colors">
                            <ExternalLink className="w-4 h-4" />
                            View Full Profile
                        </button>
                    </Link>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onReject}
                            disabled={isLoading}
                            className="px-5 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                            Reject
                        </button>
                        <button
                            onClick={onApprove}
                            disabled={isLoading}
                            className="px-5 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Approve
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==================== TASKER CARD ====================

const TaskerCard: React.FC<{
    tasker: any;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    onViewDetails: (tasker: any) => void;
    isLoading: boolean;
}> = ({ tasker, onApprove, onReject, onViewDetails, isLoading }) => {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200">
            {/* Card Header */}
            <div className="p-5 pb-4">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {tasker.profilePicture ? (
                                <Image
                                    src={tasker.profilePicture}
                                    alt={tasker.name}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-sm font-semibold text-slate-400">
                                    {tasker.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                                </span>
                            )}
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">{tasker.name}</h3>
                            <p className="text-sm text-gray-500 truncate">{tasker.email}</p>
                        </div>
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                        {showMenu && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20">
                                    <button
                                        onClick={() => {
                                            onViewDetails(tasker);
                                            setShowMenu(false);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <Eye className="w-4 h-4" />
                                        View Details
                                    </button>
                                    <Link href={`/dashboard/admin/users/${tasker.id}`}>
                                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                            <ExternalLink className="w-4 h-4" />
                                            Full Profile
                                        </button>
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Contact & Location */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{tasker.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="truncate">
                            {[tasker.location?.city, tasker.location?.province, tasker.location?.country]
                                .filter(Boolean).join(', ') || 'Location not set'}
                        </span>
                    </div>
                </div>

                {/* Categories */}
                <div className="mb-4">
                    <CategoryPills categories={tasker.categories || []} />
                </div>

                {/* Stats */}
                <StatsDisplay
                    rating={tasker.rating || 0}
                    tasks={tasker.stats?.tasksCompleted || 0}
                    rate={tasker.stats?.completionRate || 100}
                />
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Card Footer */}
            <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <VerificationProgress
                        verification={tasker.verification || { email: false, phone: false, identity: false, address: false }}
                    />
                    <PaymentStatus status={tasker.stripeConnectStatus || 'not_connected'} />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatTimeAgo(tasker.createdAt)}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onReject(tasker.id)}
                            disabled={isLoading}
                            className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                            Reject
                        </button>
                        <button
                            onClick={() => onApprove(tasker.id)}
                            disabled={isLoading}
                            className="px-4 py-1.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5"
                        >
                            {isLoading ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <CheckCircle className="w-3.5 h-3.5" />
                            )}
                            Approve
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==================== MAIN COMPONENT ====================

export default function PendingTaskersPage() {
    // State
    const [page, setPage] = useState(1);
    const [limit] = useState(12);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedTasker, setSelectedTasker] = useState<any>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectingTaskerId, setRejectingTaskerId] = useState<string | null>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // API Query
    const { data, isLoading, isFetching, refetch } = useGetAdminTaskersQuery({
        page,
        limit,
        search: debouncedSearch,
        taskerStatus: 'under_review',
        sortBy: 'createdAt',
        sortOrder: 'desc',
    });

    // Mutations
    const [approveRejectTasker, { isLoading: isApproving }] = useApproveRejectTaskerMutation();

    // Process data
    const taskers = data?.data?.users || [];
    const pagination = data?.data?.pagination;
    const totalPending = pagination?.totalCount || 0;

    // Handlers
    const handleApprove = async (taskerId: string) => {
        try {
            await approveRejectTasker({ userId: taskerId, action: 'approve' }).unwrap();
            setShowDetailModal(false);
            setSelectedTasker(null);
            refetch();
        } catch (error) {
            console.error('Failed to approve:', error);
        }
    };

    const handleReject = async (reason: string) => {
        if (!rejectingTaskerId) return;
        try {
            await approveRejectTasker({
                userId: rejectingTaskerId,
                action: 'reject',
                reason
            }).unwrap();
            setShowRejectModal(false);
            setRejectingTaskerId(null);
            setShowDetailModal(false);
            setSelectedTasker(null);
            refetch();
        } catch (error) {
            console.error('Failed to reject:', error);
        }
    };

    const openRejectModal = (taskerId: string) => {
        setRejectingTaskerId(taskerId);
        setShowRejectModal(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
                    <p className="text-gray-500 mt-1">
                        Review and approve tasker applications
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium text-amber-700">
                            {totalPending} pending
                        </span>
                    </div>
                    <button
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-5 h-5 ${isFetching ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                        <p className="text-sm text-gray-500">Loading applications...</p>
                    </div>
                </div>
            ) : taskers.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserCheck className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">No pending applications</h3>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto">
                        All applications have been reviewed. New applications will appear here.
                    </p>
                </div>
            ) : (
                <>
                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {taskers.map((tasker: any) => (
                            <TaskerCard
                                key={tasker.id}
                                tasker={tasker}
                                onApprove={handleApprove}
                                onReject={openRejectModal}
                                onViewDetails={(t) => {
                                    setSelectedTasker(t);
                                    setShowDetailModal(true);
                                }}
                                isLoading={isApproving}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between pt-4">
                            <p className="text-sm text-gray-500">
                                Showing {((page - 1) * limit) + 1}-{Math.min(page * limit, totalPending)} of {totalPending}
                            </p>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={!pagination.hasPrevPage}
                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <span className="px-3 py-1 text-sm text-gray-700">
                                    {page} / {pagination.totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                    disabled={!pagination.hasNextPage}
                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Modals */}
            <DetailModal
                tasker={selectedTasker}
                isOpen={showDetailModal}
                onClose={() => {
                    setShowDetailModal(false);
                    setSelectedTasker(null);
                }}
                onApprove={() => selectedTasker && handleApprove(selectedTasker.id)}
                onReject={() => selectedTasker && openRejectModal(selectedTasker.id)}
                isLoading={isApproving}
            />

            <RejectModal
                isOpen={showRejectModal}
                onClose={() => {
                    setShowRejectModal(false);
                    setRejectingTaskerId(null);
                }}
                onConfirm={handleReject}
                taskerName={taskers.find((t: any) => t.id === rejectingTaskerId)?.name || ''}
                isLoading={isApproving}
            />
        </div>
    );
}