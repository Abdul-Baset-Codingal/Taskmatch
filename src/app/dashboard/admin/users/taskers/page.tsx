// @ts-nocheck
// app/dashboard/admin/users/taskers/page.tsx
"use client";

import React, { useState, useEffect } from 'react';

import {
    Search,
    Download,
    MoreHorizontal,
    Eye,
    Edit,
    Ban,
    Mail,
    Phone,
    MapPin,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    UserPlus,
    SlidersHorizontal,
    X,
    DollarSign,
    Star,
    TrendingUp,
    Shield,
    MessageSquare,
    History,
    FileText,
    Trash2,
    Check,
    Users,
    Loader2,
    Briefcase,
    Award,
    Wallet,
    CreditCard,
    ExternalLink,
    BadgeCheck,
    Wrench,
    MapPinned,
    Clock3,
    Percent,
} from 'lucide-react';
import { useApproveRejectTaskerMutation, useBulkUpdateUsersMutation, useGetAdminTaskersQuery, useLazyExportUsersQuery, useUpdateUserStatusMutation } from '@/features/auth/authApi';
import Image from 'next/image';
import Link from 'next/link';

// ==================== HELPER FUNCTIONS ====================

// Format relative time
const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
};

// Format currency
const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
    }).format(amount); // Amount is already in decimal format
};

// ==================== COMPONENTS ====================

// Status Badge Component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const styles: Record<string, string> = {
        active: 'bg-green-100 text-green-700 border-green-200',
        inactive: 'bg-gray-100 text-gray-700 border-gray-200',
        suspended: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        banned: 'bg-red-100 text-red-700 border-red-200',
    };

    const icons: Record<string, React.ReactNode> = {
        active: <CheckCircle className="w-3 h-3" />,
        inactive: <Clock className="w-3 h-3" />,
        suspended: <AlertCircle className="w-3 h-3" />,
        banned: <XCircle className="w-3 h-3" />,
    };

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.inactive}`}>
            {icons[status] || icons.inactive}
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

// Tasker Status Badge
const TaskerStatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const styles: Record<string, string> = {
        approved: 'bg-green-100 text-green-700 border-green-200',
        under_review: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        rejected: 'bg-red-100 text-red-700 border-red-200',
        not_applied: 'bg-gray-100 text-gray-700 border-gray-200',
    };

    const labels: Record<string, string> = {
        approved: 'Approved',
        under_review: 'Under Review',
        rejected: 'Rejected',
        not_applied: 'Not Applied',
    };

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.not_applied}`}>
            {status === 'approved' && <CheckCircle className="w-3 h-3" />}
            {status === 'under_review' && <Clock className="w-3 h-3" />}
            {status === 'rejected' && <XCircle className="w-3 h-3" />}
            {labels[status] || status}
        </span>
    );
};

// Stripe Connect Status Badge
const StripeStatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const styles: Record<string, string> = {
        active: 'bg-green-100 text-green-700',
        pending: 'bg-yellow-100 text-yellow-700',
        not_connected: 'bg-gray-100 text-gray-600',
        onboarding_started: 'bg-blue-100 text-blue-700',
        restricted: 'bg-orange-100 text-orange-700',
        rejected: 'bg-red-100 text-red-700',
    };

    const labels: Record<string, string> = {
        active: 'Connected',
        pending: 'Pending',
        not_connected: 'Not Connected',
        onboarding_started: 'Onboarding',
        restricted: 'Restricted',
        rejected: 'Rejected',
    };

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.not_connected}`}>
            <CreditCard className="w-3 h-3" />
            {labels[status] || status}
        </span>
    );
};

// Verification Badge Component
const VerificationBadge: React.FC<{
    verification: {
        email: boolean;
        phone: boolean;
        identity: boolean;
        address: boolean
    }
}> = ({ verification }) => {
    const verifiedCount = Object.values(verification).filter(Boolean).length;
    const totalCount = Object.keys(verification).length;
    const percentage = (verifiedCount / totalCount) * 100;

    let colorClass = 'bg-red-100 text-red-700';
    if (percentage === 100) colorClass = 'bg-green-100 text-green-700';
    else if (percentage >= 50) colorClass = 'bg-yellow-100 text-yellow-700';

    return (
        <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                {verifiedCount}/{totalCount}
            </span>
            <div className="flex gap-1">
                {verification.email && (
                    <span title="Email Verified" className="text-green-500">
                        <Mail className="w-3 h-3" />
                    </span>
                )}
                {verification.phone && (
                    <span title="Phone Verified" className="text-green-500">
                        <Phone className="w-3 h-3" />
                    </span>
                )}
                {verification.identity && (
                    <span title="Identity Verified" className="text-green-500">
                        <Shield className="w-3 h-3" />
                    </span>
                )}
                {verification.address && (
                    <span title="Address Verified" className="text-green-500">
                        <MapPin className="w-3 h-3" />
                    </span>
                )}
            </div>
        </div>
    );
};

// Rating Stars Component
const RatingStars: React.FC<{ rating: number; reviewCount: number }> = ({ rating, reviewCount }) => {
    return (
        <div className="flex items-center gap-1">
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-3 h-3 ${star <= Math.round(rating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                    />
                ))}
            </div>
            <span className="text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
            <span className="text-xs text-gray-500">({reviewCount})</span>
        </div>
    );
};

// Categories Tags Component
const CategoryTags: React.FC<{ categories: string[] }> = ({ categories }) => {
    if (!categories || categories.length === 0) {
        return <span className="text-gray-400 text-sm">No categories</span>;
    }

    const displayCategories = categories.slice(0, 2);
    const remaining = categories.length - 2;

    return (
        <div className="flex flex-wrap gap-1">
            {displayCategories.map((cat, index) => (
                <span
                    key={index}
                    className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium"
                >
                    {cat}
                </span>
            ))}
            {remaining > 0 && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                    +{remaining} more
                </span>
            )}
        </div>
    );
};

// ==================== MAIN COMPONENT ====================

export default function TaskersPage() {
    // State for filters
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedTaskers, setSelectedTaskers] = useState<string[]>([]);
    const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
    const [selectedTasker, setSelectedTasker] = useState<any | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        status: '',
        taskerStatus: '',
        stripeConnectStatus: '',
        emailVerified: '',
        phoneVerified: '',
        identityVerified: '',
        city: '',
        province: '',
        category: '',
        minRating: '',
        minTasksCompleted: '',
        maxTasksCompleted: '',
        minTotalEarnings: '',
        maxTotalEarnings: '',
        sortBy: 'createdAt',
        sortOrder: 'desc' as 'asc' | 'desc',
    });

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
        status: filters.status,
        taskerStatus: filters.taskerStatus,
        stripeConnectStatus: filters.stripeConnectStatus,
        emailVerified: filters.emailVerified,
        phoneVerified: filters.phoneVerified,
        identityVerified: filters.identityVerified,
        city: filters.city,
        province: filters.province,
        category: filters.category,
        minRating: filters.minRating,
        minTasksCompleted: filters.minTasksCompleted,
        maxTasksCompleted: filters.maxTasksCompleted,
        minTotalEarnings: filters.minTotalEarnings,
        maxTotalEarnings: filters.maxTotalEarnings,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
    });

    // Mutations
    const [updateUserStatus, { isLoading: isUpdatingStatus }] = useUpdateUserStatusMutation();
    const [bulkUpdateUsers, { isLoading: isBulkUpdating }] = useBulkUpdateUsersMutation();
    const [triggerExport] = useLazyExportUsersQuery();
    const [approveRejectTasker, { isLoading: isApproving }] = useApproveRejectTaskerMutation();

    // Process data from API
    const taskers = data?.data?.users || [];
    const pagination = data?.data?.pagination;
    const stats = data?.data?.stats;

    console.log(taskers)
    // Handlers
    const handleSelectAll = () => {
        if (selectedTaskers.length === taskers.length) {
            setSelectedTaskers([]);
        } else {
            setSelectedTaskers(taskers.map((t: any) => t.id));
        }
    };

    const handleSelectTasker = (taskerId: string) => {
        setSelectedTaskers((prev) =>
            prev.includes(taskerId)
                ? prev.filter((id) => id !== taskerId)
                : [...prev, taskerId]
        );
    };

    const handleStatusChange = async (taskerId: string, action: 'block' | 'unblock' | 'suspend') => {
        try {
            await updateUserStatus({ id: taskerId, action }).unwrap();
            setShowActionMenu(null);
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const handleApproveReject = async (taskerId: string, action: 'approve' | 'reject', reason?: string) => {
        try {
            await approveRejectTasker({ userId: taskerId, action, reason }).unwrap();
            setShowActionMenu(null);
        } catch (error) {
            console.error('Failed to approve/reject tasker:', error);
        }
    };

    const handleBulkAction = async (action: 'block' | 'unblock' | 'delete') => {
        try {
            await bulkUpdateUsers({ userIds: selectedTaskers, action }).unwrap();
            setSelectedTaskers([]);
        } catch (error) {
            console.error('Failed to perform bulk action:', error);
        }
    };

    const handleExport = async () => {
        try {
            const result = await triggerExport({ roleType: 'tasker', format: 'csv' }).unwrap();
            const blob = new Blob([result], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `taskers-${Date.now()}.csv`;
            a.click();
        } catch (error) {
            console.error('Failed to export:', error);
        }
    };

    const handleViewDetails = (tasker: any) => {
        setSelectedTasker(tasker);
        setShowDetailModal(true);
        setShowActionMenu(null);
    };

    const clearFilters = () => {
        setFilters({
            status: '',
            taskerStatus: '',
            stripeConnectStatus: '',
            emailVerified: '',
            phoneVerified: '',
            identityVerified: '',
            city: '',
            province: '',
            category: '',
            minRating: '',
            minTasksCompleted: '',
            maxTasksCompleted: '',
            minTotalEarnings: '',
            maxTotalEarnings: '',
            sortBy: 'createdAt',
            sortOrder: 'desc',
        });
        setSearchQuery('');
    };

    const activeFiltersCount = Object.values(filters).filter(
        (v) => v && v !== 'createdAt' && v !== 'desc'
    ).length;

    // Category options (you can fetch these from API)
    const categoryOptions = [
        'Cleaning',
        'Handyman',
        'Moving',
        'Delivery',
        'Assembly',
        'Yard Work',
        'Painting',
        'Plumbing',
        'Electrical',
        'Pet Care',
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Taskers</h1>
                    <p className="text-gray-500 mt-1">
                        Manage and monitor all tasker accounts on the platform
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors">
                        <UserPlus className="w-4 h-4" />
                        <span>Add Tasker</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Taskers</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {isLoading ? '-' : stats?.total || 0}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Active Taskers</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {isLoading ? '-' : stats?.active || 0}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Earnings</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {isLoading ? '-' : formatCurrency(stats?.totalEarnings || 0)}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-emerald-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Tasks Completed</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {isLoading ? '-' : stats?.totalTasksCompleted || 0}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Award className="w-5 h-5 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Avg. Rating</p>
                            <p className="text-2xl font-bold text-gray-900 flex items-center gap-1">
                                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                {isLoading ? '-' : stats?.avgRating || '0.0'}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Star className="w-5 h-5 text-yellow-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, phone, or city..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                    </div>

                    {/* Quick Filters */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <select
                            value={filters.status}
                            onChange={(e) => {
                                setFilters({ ...filters, status: e.target.value });
                                setPage(1);
                            }}
                            className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-sm"
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspended</option>
                            <option value="banned">Banned</option>
                        </select>

                        <select
                            value={filters.stripeConnectStatus}
                            onChange={(e) => {
                                setFilters({ ...filters, stripeConnectStatus: e.target.value });
                                setPage(1);
                            }}
                            className="px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-sm"
                        >
                            <option value="">All Payment Status</option>
                            <option value="active">Connected</option>
                            <option value="pending">Pending</option>
                            <option value="not_connected">Not Connected</option>
                            <option value="restricted">Restricted</option>
                        </select>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-colors ${showFilters || activeFiltersCount > 0
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            <span>Filters</span>
                            {activeFiltersCount > 0 && (
                                <span className="w-5 h-5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => refetch()}
                            disabled={isFetching}
                            className="p-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                            title="Refresh"
                        >
                            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Advanced Filters Panel */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <select
                                    value={filters.category}
                                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-sm"
                                >
                                    <option value="">All Categories</option>
                                    {categoryOptions.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Email Verification */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Verification
                                </label>
                                <select
                                    value={filters.emailVerified}
                                    onChange={(e) => setFilters({ ...filters, emailVerified: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-sm"
                                >
                                    <option value="">All</option>
                                    <option value="true">Verified</option>
                                    <option value="false">Unverified</option>
                                </select>
                            </div>

                            {/* Phone Verification */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Verification
                                </label>
                                <select
                                    value={filters.phoneVerified}
                                    onChange={(e) => setFilters({ ...filters, phoneVerified: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-sm"
                                >
                                    <option value="">All</option>
                                    <option value="true">Verified</option>
                                    <option value="false">Unverified</option>
                                </select>
                            </div>

                            {/* Identity Verification */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Identity Verification
                                </label>
                                <select
                                    value={filters.identityVerified}
                                    onChange={(e) => setFilters({ ...filters, identityVerified: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-sm"
                                >
                                    <option value="">All</option>
                                    <option value="true">Verified</option>
                                    <option value="false">Unverified</option>
                                </select>
                            </div>

                            {/* City */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    City
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter city"
                                    value={filters.city}
                                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                />
                            </div>

                            {/* Province */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Province
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter province"
                                    value={filters.province}
                                    onChange={(e) => setFilters({ ...filters, province: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                />
                            </div>

                            {/* Min Rating */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Min Rating
                                </label>
                                <select
                                    value={filters.minRating}
                                    onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-sm"
                                >
                                    <option value="">Any</option>
                                    <option value="4.5">4.5+ ⭐</option>
                                    <option value="4">4.0+ ⭐</option>
                                    <option value="3.5">3.5+ ⭐</option>
                                    <option value="3">3.0+ ⭐</option>
                                </select>
                            </div>

                            {/* Min Earnings */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Min Earnings
                                </label>
                                <input
                                    type="number"
                                    placeholder="$0"
                                    value={filters.minTotalEarnings}
                                    onChange={(e) => setFilters({ ...filters, minTotalEarnings: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                />
                            </div>

                            {/* Sort By */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Sort By
                                </label>
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-sm"
                                >
                                    <option value="createdAt">Date Joined</option>
                                    <option value="updatedAt">Last Active</option>
                                    <option value="rating">Rating</option>
                                    <option value="stats.totalEarnings">Earnings</option>
                                    <option value="stats.tasksCompleted">Tasks Completed</option>
                                </select>
                            </div>

                            {/* Sort Order */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Order
                                </label>
                                <select
                                    value={filters.sortOrder}
                                    onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value as 'asc' | 'desc' })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-sm"
                                >
                                    <option value="desc">Descending</option>
                                    <option value="asc">Ascending</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 mt-4">
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Clear All
                            </button>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Bulk Actions */}
            {selectedTaskers.length > 0 && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center justify-between">
                    <span className="text-purple-700 font-medium">
                        {selectedTaskers.length} tasker(s) selected
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleBulkAction('block')}
                            disabled={isBulkUpdating}
                            className="px-3 py-1.5 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
                        >
                            {isBulkUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Suspend'}
                        </button>
                        <button
                            onClick={() => setSelectedTaskers([])}
                            className="p-1.5 text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Taskers Table */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-4 py-3 text-left">
                                            <input
                                                type="checkbox"
                                                checked={selectedTaskers.length === taskers.length && taskers.length > 0}
                                                onChange={handleSelectAll}
                                                className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                                            />
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Tasker
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Categories
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Verification
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Payment
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Performance
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {taskers.map((tasker: any) => (
                                        <tr
                                            key={tasker.id}
                                            className={`hover:bg-gray-50 transition-colors ${selectedTaskers.includes(tasker.id) ? 'bg-purple-50' : ''
                                                }`}
                                        >
                                            <td className="px-4 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTaskers.includes(tasker.id)}
                                                    onChange={() => handleSelectTasker(tasker.id)}
                                                    className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                                                />
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-purple-400 to-indigo-500">
                                                        {tasker.profilePicture ? (
                                                            <Image
                                                                src={tasker.profilePicture}
                                                                alt={tasker.name}
                                                                width={40}
                                                                height={40}
                                                                className="object-cover w-full h-full"
                                                            />
                                                        ) : (
                                                            <span className="text-white font-semibold">
                                                                {tasker.name
                                                                    .split(" ")
                                                                    .map((n: string) => n[0])
                                                                    .join("")
                                                                    .slice(0, 2)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-medium text-gray-900">{tasker.name}</p>
                                                            {tasker.verification?.identity && (
                                                                <BadgeCheck className="w-4 h-4 text-blue-500" />
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-500">{tasker.email}</p>
                                                        <p className="text-xs text-gray-400">
                                                            {tasker.phone}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <CategoryTags categories={tasker.categories || []} />
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="space-y-1">
                                                    <StatusBadge status={tasker.status} />
                                                    {tasker.taskerStatus && (
                                                        <div className="mt-1">
                                                            <TaskerStatusBadge status={tasker.taskerStatus} />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <VerificationBadge verification={tasker.verification} />
                                            </td>
                                            <td className="px-4 py-4">
                                                <StripeStatusBadge status={tasker.stripeConnectStatus || 'not_connected'} />
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="space-y-2">
                                                    <RatingStars rating={tasker.rating || 0} reviewCount={tasker.reviewCount || 0} />
                                                    <div className="flex items-center gap-4 text-sm">
                                                        <span className="flex items-center gap-1 text-gray-600">
                                                            <Award className="w-3 h-3" />
                                                            {tasker.stats?.tasksCompleted || 0} tasks
                                                        </span>
                                                        <span className="flex items-center gap-1 text-emerald-600">
                                                            <DollarSign className="w-3 h-3" />
                                                            {formatCurrency(tasker.stats?.totalEarnings || 0)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <Percent className="w-3 h-3" />
                                                            {tasker.stats?.completionRate || 100}% completion
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleViewDetails(tasker)}
                                                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <div className="relative">
                                                        <button
                                                            onClick={() =>
                                                                setShowActionMenu(
                                                                    showActionMenu === tasker.id ? null : tasker.id
                                                                )
                                                            }
                                                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                        >
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </button>

                                                        {/* Action Dropdown Menu */}
                                                        {showActionMenu === tasker.id && (
                                                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                                                                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                                    <MessageSquare className="w-4 h-4" />
                                                                    Send Message
                                                                </button>
                                                                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                                    <History className="w-4 h-4" />
                                                                    View Activity
                                                                </button>
                                                                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                                    <FileText className="w-4 h-4" />
                                                                    View Tasks
                                                                </button>
                                                                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                                    <Wallet className="w-4 h-4" />
                                                                    View Earnings
                                                                </button>
                                                                <hr className="my-1" />
                                                                {tasker.status !== 'suspended' ? (
                                                                    <button
                                                                        onClick={() => handleStatusChange(tasker.id, 'suspend')}
                                                                        disabled={isUpdatingStatus}
                                                                        className="w-full px-4 py-2 text-left text-sm text-yellow-600 hover:bg-yellow-50 flex items-center gap-2"
                                                                    >
                                                                        <Ban className="w-4 h-4" />
                                                                        Suspend Account
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => handleStatusChange(tasker.id, 'unblock')}
                                                                        disabled={isUpdatingStatus}
                                                                        className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                                                                    >
                                                                        <Check className="w-4 h-4" />
                                                                        Reactivate Account
                                                                    </button>
                                                                )}
                                                                <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                                                    <Trash2 className="w-4 h-4" />
                                                                    Delete Account
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Empty State */}
                        {taskers.length === 0 && (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Briefcase className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">No taskers found</h3>
                                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination && taskers.length > 0 && (
                            <div className="px-4 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span>Show</span>
                                    <select
                                        value={limit}
                                        onChange={(e) => {
                                            setLimit(Number(e.target.value));
                                            setPage(1);
                                        }}
                                        className="px-2 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                    >
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                    </select>
                                    <span>of {pagination.totalCount} results</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={!pagination.hasPrevPage}
                                        className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>

                                    <span className="px-3 py-1 text-sm">
                                        Page {pagination.currentPage} of {pagination.totalPages}
                                    </span>

                                    <button
                                        onClick={() => setPage((prev) => Math.min(prev + 1, pagination.totalPages))}
                                        disabled={!pagination.hasNextPage}
                                        className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Tasker Detail Modal */}
            {showDetailModal && selectedTasker && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Tasker Details</h2>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            {/* Profile Section */}
                            <div className="flex items-start gap-4">
                                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                                    {selectedTasker.name
                                        .split(' ')
                                        .map((n: string) => n[0])
                                        .join('')
                                        .slice(0, 2)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {selectedTasker.name}
                                        </h3>
                                        <StatusBadge status={selectedTasker.status} />
                                        {selectedTasker.verification?.identity && (
                                            <BadgeCheck className="w-5 h-5 text-blue-500" />
                                        )}
                                    </div>
                                    <p className="text-gray-500 mt-1">ID: {selectedTasker.id}</p>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <Mail className="w-4 h-4" />
                                            {selectedTasker.email}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Phone className="w-4 h-4" />
                                            {selectedTasker.phone}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                                        <MapPin className="w-4 h-4" />
                                        {selectedTasker.location.city || 'N/A'}, {selectedTasker.location.province || 'N/A'},{' '}
                                        {selectedTasker.location.country}
                                    </div>
                                </div>
                            </div>

                            {/* Categories & Skills */}
                            <div className="bg-purple-50 rounded-xl p-4">
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Wrench className="w-4 h-4" />
                                    Categories & Skills
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedTasker.categories?.map((cat: string, index: number) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                                        >
                                            {cat}
                                        </span>
                                    ))}
                                    {(!selectedTasker.categories || selectedTasker.categories.length === 0) && (
                                        <span className="text-gray-500">No categories assigned</span>
                                    )}
                                </div>
                            </div>

                            {/* Verification Status */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    Verification Status
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {Object.entries(selectedTasker.verification || {}).map(([key, value]) => (
                                        <div
                                            key={key}
                                            className={`flex items-center gap-2 p-3 rounded-lg ${value ? 'bg-green-100' : 'bg-red-100'
                                                }`}
                                        >
                                            {value ? (
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-red-600" />
                                            )}
                                            <span
                                                className={`text-sm font-medium capitalize ${value ? 'text-green-700' : 'text-red-700'
                                                    }`}
                                            >
                                                {key}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Status */}
                            <div className="bg-blue-50 rounded-xl p-4">
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <CreditCard className="w-4 h-4" />
                                    Payment Status
                                </h4>
                                <div className="flex items-center gap-4">
                                    <StripeStatusBadge status={selectedTasker.stripeConnectStatus || 'not_connected'} />
                                    <span className="text-sm text-gray-600">
                                        {selectedTasker.stripeConnectStatus === 'active'
                                            ? 'Can receive payouts'
                                            : 'Cannot receive payouts yet'}
                                    </span>
                                </div>
                            </div>

                            {/* Performance Stats */}
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    Performance Statistics
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-emerald-50 rounded-xl p-4">
                                        <p className="text-sm text-emerald-600">Total Earnings</p>
                                        <p className="text-2xl font-bold text-emerald-700">
                                            {formatCurrency(selectedTasker.stats?.totalEarnings || 0)}
                                        </p>
                                    </div>
                                    <div className="bg-blue-50 rounded-xl p-4">
                                        <p className="text-sm text-blue-600">Tasks Completed</p>
                                        <p className="text-2xl font-bold text-blue-700">
                                            {selectedTasker.stats?.tasksCompleted || 0}
                                        </p>
                                    </div>
                                    <div className="bg-yellow-50 rounded-xl p-4">
                                        <p className="text-sm text-yellow-600">Rating</p>
                                        <p className="text-2xl font-bold text-yellow-700 flex items-center gap-1">
                                            <Star className="w-5 h-5 fill-current" />
                                            {selectedTasker.rating?.toFixed(1) || '0.0'}
                                        </p>
                                    </div>
                                    <div className="bg-purple-50 rounded-xl p-4">
                                        <p className="text-sm text-purple-600">Completion Rate</p>
                                        <p className="text-2xl font-bold text-purple-700">
                                            {selectedTasker.stats?.completionRate || 100}%
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Activity Info */}
                            <div className="flex items-center gap-6 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>Joined: {new Date(selectedTasker.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>Last Active: {formatRelativeTime(selectedTasker.lastActive)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Link href={`/dashboard/admin/users/${selectedTasker.id}`}>
                                    <button className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        <ExternalLink className="w-4 h-4" />
                                        View Full Profile
                                    </button>
                                </Link>
                                <button className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                    <MessageSquare className="w-4 h-4" />
                                    Message
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                {selectedTasker.status !== 'suspended' ? (
                                    <button
                                        onClick={() => handleStatusChange(selectedTasker.id, 'suspend')}
                                        className="flex items-center gap-2 px-4 py-2 text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
                                    >
                                        <Ban className="w-4 h-4" />
                                        Suspend
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleStatusChange(selectedTasker.id, 'unblock')}
                                        className="flex items-center gap-2 px-4 py-2 text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                                    >
                                        <Check className="w-4 h-4" />
                                        Reactivate
                                    </button>
                                )}
                                <button className="flex items-center gap-2 px-4 py-2 text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors">
                                    <Edit className="w-4 h-4" />
                                    Edit Tasker
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Click outside to close action menu */}
            {showActionMenu && (
                <div
                    className="fixed inset-0 z-5"
                    onClick={() => setShowActionMenu(null)}
                />
            )}
        </div>
    );
}