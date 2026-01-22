// @ts-nocheck
// app/admin/users/page.tsx
"use client";

import React, { useState, useCallback, useMemo } from "react";

import { Loader2, Users, RefreshCw, Download, Plus } from "lucide-react";
import { useBulkUpdateUsersMutation, useGetAdminUsersQuery } from "@/features/auth/authApi";
import { toast } from "react-toastify";
import AllUsersStat from "@/components/dashboard/admin/AllUsersStat";
import AllUsersFilter from "@/components/dashboard/admin/AllUsersFilter";
import AllUsersTable from "@/components/dashboard/admin/AllUsersTable";
import AllUsersPagination from "@/components/dashboard/admin/AllUsersPagination";
import BulkActionsBar from "@/components/dashboard/admin/BulkActionsBar";
import UserDetailModal from "@/components/dashboard/admin/AllUserDetailModal";

// Types
export interface FilterState {
    page: number;
    limit: number;
    roleType: 'client' | 'tasker' | 'both' | 'pending' | 'all';
    search: string;
    status: string;
    isBlocked: string;
    emailVerified: string;
    phoneVerified: string;
    identityVerified: string;
    taskerStatus: string;
    stripeConnectStatus: string;
    city: string;
    province: string;
    country: string;
    minTasksCompleted: string;
    maxTasksCompleted: string;
    minBookingsCompleted: string;
    maxBookingsCompleted: string;
    minTotalEarnings: string;
    maxTotalEarnings: string;
    minRating: string;
    maxRating: string;
    createdFrom: string;
    createdTo: string;
    lastActiveFrom: string;
    lastActiveTo: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    category: string;
}

const initialFilters: FilterState = {
    page: 1,
    limit: 10,
    roleType: 'all',
    search: '',
    status: '',
    isBlocked: '',
    emailVerified: '',
    phoneVerified: '',
    identityVerified: '',
    taskerStatus: '',
    stripeConnectStatus: '',
    city: '',
    province: '',
    country: '',
    minTasksCompleted: '',
    maxTasksCompleted: '',
    minBookingsCompleted: '',
    maxBookingsCompleted: '',
    minTotalEarnings: '',
    maxTotalEarnings: '',
    minRating: '',
    maxRating: '',
    createdFrom: '',
    createdTo: '',
    lastActiveFrom: '',
    lastActiveTo: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    category: '',
};

export default function AdminUsersPage() {
    // State
    const [filters, setFilters] = useState<FilterState>(initialFilters);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(true);

    // API Hooks
    const {
        data,
        isLoading,
        isFetching,
        error,
        refetch
    } = useGetAdminUsersQuery(filters);

    const [bulkUpdate, { isLoading: isBulkUpdating }] = useBulkUpdateUsersMutation();

    // Memoized data
    const users = useMemo(() => data?.data?.users || [], [data]);
    const pagination = useMemo(() => data?.data?.pagination, [data]);
    const stats = useMemo(() => data?.data?.stats, [data]);

    // Handlers
    const handleFilterChange = useCallback((key: keyof FilterState, value: any) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: key !== 'page' ? 1 : value, // Reset page when filters change
        }));
        setSelectedUsers([]); // Clear selection when filters change
    }, []);

    const handleSearch = useCallback((searchTerm: string) => {
        handleFilterChange('search', searchTerm);
    }, [handleFilterChange]);

    const handleSort = useCallback((field: string) => {
        setFilters(prev => ({
            ...prev,
            sortBy: field,
            sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
        }));
    }, []);

    const handleSelectUser = useCallback((userId: string) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    }, []);

    const handleSelectAll = useCallback(() => {
        if (selectedUsers.length === users.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(users.map((u: any) => u.id));
        }
    }, [selectedUsers, users]);

    const handleBulkAction = useCallback(async (action: string, reason?: string) => {
        if (selectedUsers.length === 0) {
            toast.error('Please select users first');
            return;
        }

        try {
            await bulkUpdate({
                userIds: selectedUsers,
                action: action as any,
                reason,
            }).unwrap();

            toast.success(`Successfully ${action}ed ${selectedUsers.length} users`);
            setSelectedUsers([]);
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to perform bulk action');
        }
    }, [selectedUsers, bulkUpdate, refetch]);

    const handleExport = useCallback(() => {
        // Implement export logic
        toast.success('Export started...');
    }, []);

    const handleResetFilters = useCallback(() => {
        setFilters(initialFilters);
        setSelectedUsers([]);
    }, []);

    const handlePageChange = useCallback((newPage: number) => {
        handleFilterChange('page', newPage);
    }, [handleFilterChange]);

    const handleLimitChange = useCallback((newLimit: number) => {
        setFilters(prev => ({
            ...prev,
            limit: newLimit,
            page: 1,
        }));
    }, []);

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                <span className="ml-2 text-gray-600">Loading users...</span>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="text-red-500 mb-4">Failed to load users</div>
                <button
                    onClick={() => refetch()}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className=" mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center">
                            <Users className="w-8 h-8 text-primary-600 mr-3" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                                <p className="text-sm text-gray-500">
                                    Manage all users, clients, and taskers
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => refetch()}
                                disabled={isFetching}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>

                            <button
                                onClick={handleExport}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </button>

                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`inline-flex items-center px-3 py-2 border rounded-lg text-sm font-medium ${showFilters
                                        ? 'border-primary-500 text-primary-700 bg-primary-50'
                                        : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                                    }`}
                            >
                                Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Stats Cards */}
                {stats && <AllUsersStat stats={stats} roleType={filters.roleType} />}

                {/* Role Type Tabs */}
                <div className="mt-6 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        {[
                            { key: 'all', label: 'All Users' },
                            { key: 'client', label: 'Clients Only' },
                            { key: 'tasker', label: 'Taskers' },
                            { key: 'both', label: 'Both Roles' },
                            { key: 'pending', label: 'Pending Verification' },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => handleFilterChange('roleType', tab.key)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${filters.roleType === tab.key
                                        ? 'border-primary-500 text-primary-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Filters */}
                {showFilters && (
                    <AllUsersFilter
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onSearch={handleSearch}
                        onReset={handleResetFilters}
                        roleType={filters.roleType}
                    />
                )}

                {/* Bulk Actions Bar */}
                {selectedUsers.length > 0 && (
                    <BulkActionsBar
                        selectedCount={selectedUsers.length}
                        onAction={handleBulkAction}
                        onClearSelection={() => setSelectedUsers([])}
                        isLoading={isBulkUpdating}
                    />
                )}

                {/* Users Table */}
                <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
                    <AllUsersTable
                        users={users}
                        selectedUsers={selectedUsers}
                        onSelectUser={handleSelectUser}
                        onSelectAll={handleSelectAll}
                        onSort={handleSort}
                        sortBy={filters.sortBy}
                        sortOrder={filters.sortOrder}
                        onViewUser={(id) => setSelectedUser(id)}
                        isLoading={isFetching}
                        roleType={filters.roleType}
                    />

                    {/* Pagination */}
                    {pagination && (
                        <AllUsersPagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            totalCount={pagination.totalCount}
                            limit={pagination.limit}
                            onPageChange={handlePageChange}
                            onLimitChange={handleLimitChange}
                        />
                    )}
                </div>
            </div>

            {/* User Detail Modal */}
            {selectedUser && (
                <UserDetailModal
                    userId={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onRefresh={refetch}
                />
            )}
        </div>
    );
}