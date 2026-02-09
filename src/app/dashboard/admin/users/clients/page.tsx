// @ts-nocheck
// app/dashboard/admin/users/clients/page.tsx
"use client";

import React, { useState, useMemo } from 'react';

import {
    Search,
    Filter,
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
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    UserPlus,
    SlidersHorizontal,
    X,
    ShoppingBag,
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
} from 'lucide-react';
import { useBulkUpdateUsersMutation, useGetAdminClientsQuery, useLazyExportUsersQuery, useUpdateUserStatusMutation } from '@/features/auth/authApi';
import Image from 'next/image';

// Status Badge Component
const StatusBadge: React.FC<{ status?: string }> = ({ status }) => {
    const safeStatus = status?.toLowerCase() || 'inactive';

    const styles: Record<string, string> = {
        active: 'bg-green-100 text-green-700 border-green-200',
        inactive: 'bg-gray-100 text-gray-700 border-gray-200',
        suspended: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        banned: 'bg-red-100 text-red-700 border-red-200',
        pending: 'bg-blue-100 text-blue-700 border-blue-200',
        not_connected: 'bg-gray-100 text-gray-700 border-gray-200',
    };

    const icons: Record<string, React.ReactNode> = {
        active: <CheckCircle className="w-3 h-3" />,
        inactive: <Clock className="w-3 h-3" />,
        suspended: <AlertCircle className="w-3 h-3" />,
        banned: <XCircle className="w-3 h-3" />,
        pending: <Clock className="w-3 h-3" />,
        not_connected: <XCircle className="w-3 h-3" />,
    };

    const displayStatus = safeStatus.replace(/_/g, ' '); // Handle snake_case

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[safeStatus] || styles.inactive}`}>
            {icons[safeStatus] || icons.inactive}
            {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
        </span>
    );
};

// Verification Badge Component
const VerificationBadge: React.FC<{
    verification?: {
        email?: boolean;
        phone?: boolean;
        identity?: boolean;
        address?: boolean
    }
}> = ({ verification }) => {
    // Provide default values
    const safeVerification = {
        email: verification?.email ?? false,
        phone: verification?.phone ?? false,
        identity: verification?.identity ?? false,
        address: verification?.address ?? false,
    };

    const verifiedCount = Object.values(safeVerification).filter(Boolean).length;
    const totalCount = Object.keys(safeVerification).length;
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
                {safeVerification.email && <Mail className="w-3 h-3 text-green-500" title="Email Verified" />}
                {safeVerification.phone && <Phone className="w-3 h-3 text-green-500" title="Phone Verified" />}
                {safeVerification.identity && <Shield className="w-3 h-3 text-green-500" title="Identity Verified" />}
                {safeVerification.address && <MapPin className="w-3 h-3 text-green-500" title="Address Verified" />}
            </div>
        </div>
    );
};

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
    }).format(amount / 100); // Assuming amount is in cents
};

export default function ClientsPage() {
    // State for filters
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedClients, setSelectedClients] = useState<string[]>([]);
    const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
    const [selectedClient, setSelectedClient] = useState<any | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        status: '',
        emailVerified: '',
        phoneVerified: '',
        identityVerified: '',
        city: '',
        province: '',
        minTasksCompleted: '',
        maxTasksCompleted: '',
        minRating: '',
        sortBy: 'createdAt',
        sortOrder: 'desc' as 'asc' | 'desc',
    });

    // Debounce search
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1); // Reset to first page on search
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // API Query
    const { data, isLoading, isFetching, refetch } = useGetAdminClientsQuery({
        page,
        limit,
        search: debouncedSearch,
        status: filters.status,
        emailVerified: filters.emailVerified,
        phoneVerified: filters.phoneVerified,
        identityVerified: filters.identityVerified,
        city: filters.city,
        province: filters.province,
        minTasksCompleted: filters.minTasksCompleted,
        maxTasksCompleted: filters.maxTasksCompleted,
        minRating: filters.minRating,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
    });

    // Mutations
    const [updateUserStatus, { isLoading: isUpdatingStatus }] = useUpdateUserStatusMutation();
    const [bulkUpdateUsers, { isLoading: isBulkUpdating }] = useBulkUpdateUsersMutation();
    const [triggerExport] = useLazyExportUsersQuery();

    const clients = data?.data?.users || [];
    const pagination = data?.data?.pagination;
    const stats = data?.data?.stats;

    // Handlers
    const handleSelectAll = () => {
        if (selectedClients.length === clients.length) {
            setSelectedClients([]);
        } else {
            setSelectedClients(clients.map((c: any) => c.id));
        }
    };

    const handleSelectClient = (clientId: string) => {
        setSelectedClients((prev) =>
            prev.includes(clientId)
                ? prev.filter((id) => id !== clientId)
                : [...prev, clientId]
        );
    };

    console.log(data)

    const handleStatusChange = async (clientId: string, action: 'block' | 'unblock' | 'suspend') => {
        try {
            await updateUserStatus({ id: clientId, action }).unwrap();
            setShowActionMenu(null);
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const handleBulkAction = async (action: 'block' | 'unblock' | 'delete') => {
        try {
            await bulkUpdateUsers({ userIds: selectedClients, action }).unwrap();
            setSelectedClients([]);
        } catch (error) {
            console.error('Failed to perform bulk action:', error);
        }
    };

    const handleExport = async () => {
        try {
            const result = await triggerExport({ roleType: 'client', format: 'csv' }).unwrap();
            // Handle download
            const blob = new Blob([result], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `clients-${Date.now()}.csv`;
            a.click();
        } catch (error) {
            console.error('Failed to export:', error);
        }
    };

    const clearFilters = () => {
        setFilters({
            status: '',
            emailVerified: '',
            phoneVerified: '',
            identityVerified: '',
            city: '',
            province: '',
            minTasksCompleted: '',
            maxTasksCompleted: '',
            minRating: '',
            sortBy: 'createdAt',
            sortOrder: 'desc',
        });
        setSearchQuery('');
    };

    const activeFiltersCount = Object.values(filters).filter(v => v && v !== 'createdAt' && v !== 'desc').length;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Bookers</h1>
                    <p className="text-gray-500 mt-1">
                        Manage and monitor all client accounts on the platform
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
                    <button className="flex items-center gap-2 px-4 py-2 text-white  bg-emerald-500  hover:bg-emerald-600 transition-colors">
                        <UserPlus className="w-4 h-4" />
                        <span>Add Client</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Clients</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {isLoading ? '-' : stats?.total || 0}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Active Clients</p>
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
                            <p className="text-sm text-gray-500">Verified</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {isLoading ? '-' : stats?.verified || 0}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-emerald-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Avg. Rating</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {isLoading ? '-' : stats?.avgRating || 0}
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
                    <div className="flex items-center gap-3">
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
                                    <option value="4.5">4.5+</option>
                                    <option value="4">4.0+</option>
                                    <option value="3.5">3.5+</option>
                                    <option value="3">3.0+</option>
                                </select>
                            </div>

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
                                    <option value="firstName">Name</option>
                                    <option value="rating">Rating</option>
                                </select>
                            </div>

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
            {selectedClients.length > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
                    <span className="text-emerald-700 font-medium">
                        {selectedClients.length} client(s) selected
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
                            onClick={() => setSelectedClients([])}
                            className="p-1.5 text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Clients Table */}
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
                                                checked={selectedClients.length === clients.length && clients.length > 0}
                                                onChange={handleSelectAll}
                                                className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                                            />
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            stripeConnectStatus
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Verification
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Last Active
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Stats
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                        {clients.map((client: any) => (
                                            <tr
                                                key={client.id}
                                                className={`hover:bg-gray-50 transition-colors ${selectedClients.includes(client.id) ? 'bg-emerald-50' : ''
                                                    }`}
                                            >
                                            <td className="px-4 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedClients.includes(client.id)}
                                                    onChange={() => handleSelectClient(client.id)}
                                                    className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                                                />
                                            </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-purple-400 to-indigo-500">
                                                            {client.profilePicture ? (
                                                                <Image
                                                                    src={client.profilePicture}
                                                                    alt={client.name || 'User'}
                                                                    width={40}
                                                                    height={40}
                                                                    className="object-cover w-full h-full"
                                                                />
                                                            ) : (
                                                                <span className="text-white font-semibold">
                                                                    {(client.name || 'U')
                                                                        .split(" ")
                                                                        .map((n: string) => n[0])
                                                                        .join("")
                                                                        .slice(0, 2)
                                                                        .toUpperCase()}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{client.name || 'Unknown'}</p>
                                                            <p className="text-sm text-gray-500">{client.email || '-'}</p>
                                                            <p className="text-xs text-gray-400">{client.phone || '-'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                            <td className="px-4 py-4">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                    Client
                                                </span>
                                            </td>
                                                <td className="px-4 py-4">
                                                    <StatusBadge status={client.stripeConnectStatus} />
                                                </td>

                                                {/* Verification cell */}
                                                <td className="px-4 py-4">
                                                    <VerificationBadge verification={client.verification} />
                                                </td>

                                                {/* Last Active cell - add null checks */}
                                                <td className="px-4 py-4">
                                                    <div>
                                                        <p className="text-sm text-gray-900">
                                                            {client.lastActive ? formatRelativeTime(client.lastActive) : 'Never'}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {client.location?.city || '-'}, {client.location?.province || '-'}
                                                        </p>
                                                    </div>
                                                </td>

                                                {/* Stats cell - add null checks */}
                                                <td className="px-4 py-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-4 text-sm">
                                                            <span className="flex items-center gap-1 text-gray-600">
                                                                <ShoppingBag className="w-3 h-3" />
                                                                {client.stats?.tasksCompleted ?? 0} tasks
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-sm text-yellow-600">
                                                            <Star className="w-3 h-3 fill-current" />
                                                            <span>{client.rating ?? 'N/A'}</span>
                                                            <span className="text-gray-400">
                                                                ({client.reviewCount ?? 0} reviews)
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedClient(client);
                                                            setShowDetailModal(true);
                                                        }}
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
                                                            onClick={() => setShowActionMenu(showActionMenu === client.id ? null : client.id)}
                                                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                        >
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </button>

                                                        {showActionMenu === client.id && (
                                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                                                                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                                    <MessageSquare className="w-4 h-4" />
                                                                    Send Message
                                                                </button>
                                                                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                                    <History className="w-4 h-4" />
                                                                    View Activity
                                                                </button>
                                                                <hr className="my-1" />
                                                                {client.status !== 'suspended' ? (
                                                                    <button
                                                                        onClick={() => handleStatusChange(client.id, 'suspend')}
                                                                        disabled={isUpdatingStatus}
                                                                        className="w-full px-4 py-2 text-left text-sm text-yellow-600 hover:bg-yellow-50 flex items-center gap-2"
                                                                    >
                                                                        <Ban className="w-4 h-4" />
                                                                        Suspend Account
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => handleStatusChange(client.id, 'unblock')}
                                                                        disabled={isUpdatingStatus}
                                                                        className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                                                                    >
                                                                        <Check className="w-4 h-4" />
                                                                        Reactivate Account
                                                                    </button>
                                                                )}
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
                        {clients.length === 0 && (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">No clients found</h3>
                                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination && clients.length > 0 && (
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