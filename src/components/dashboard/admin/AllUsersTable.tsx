// components/admin/users/UsersTable.tsx
"use client";

import React from "react";
import Image from "next/image";
import {
    ChevronUp,
    ChevronDown,
    MoreVertical,
    Eye,
    Edit,
    Ban,
    CheckCircle,
    Mail,
    Phone,
    MapPin,
    Star,
    Shield,
    ShieldCheck,
    ShieldX,
} from "lucide-react";
import AllUsersActionMenu from "./AllUsersActionMenu";

interface User {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    profilePicture?: string;
    roles: string[];
    currentRole: string;
    status: 'active' | 'inactive' | 'suspended' | 'banned';
    verification: {
        email: boolean;
        phone: boolean;
        identity: boolean;
        address: boolean;
    };
    location: {
        city: string;
        province: string;
        country: string;
    };
    taskerStatus?: string;
    rating: number;
    reviewCount: number;
    stats: {
        tasksCompleted: number;
        bookingsCompleted: number;
        totalEarnings: number;
    };
    categories: string[];
    createdAt: string;
    lastActive: string;
}

interface UsersTableProps {
    users: User[];
    selectedUsers: string[];
    onSelectUser: (id: string) => void;
    onSelectAll: () => void;
    onSort: (field: string) => void;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    onViewUser: (id: string) => void;
    isLoading: boolean;
    roleType: string;
}

export default function AllUsersTable({
    users,
    selectedUsers,
    onSelectUser,
    onSelectAll,
    onSort,
    sortBy,
    sortOrder,
    onViewUser,
    isLoading,
    roleType,
}: UsersTableProps) {
    const SortIcon = ({ field }: { field: string }) => {
        if (sortBy !== field) return null;
        return sortOrder === 'asc' ? (
            <ChevronUp className="w-4 h-4" />
        ) : (
            <ChevronDown className="w-4 h-4" />
        );
    };

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
            active: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
            inactive: { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-500' },
            suspended: { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' },
            banned: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
        };
        const config = statusConfig[status] || statusConfig.inactive;

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${config.dot}`}></span>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const getTaskerStatusBadge = (status?: string) => {
        if (!status) return null;

        const statusConfig: Record<string, { bg: string; text: string }> = {
            not_applied: { bg: 'bg-gray-100', text: 'text-gray-600' },
            under_review: { bg: 'bg-blue-100', text: 'text-blue-600' },
            approved: { bg: 'bg-green-100', text: 'text-green-600' },
            rejected: { bg: 'bg-red-100', text: 'text-red-600' },
        };
        const config = statusConfig[status] || statusConfig.not_applied;

        return (
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.text}`}>
                {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
            </span>
        );
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-CA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (users.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 mb-2">
                    <Shield className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No users found</h3>
                <p className="text-gray-500 mt-1">
                    Try adjusting your filters or search terms.
                </p>
            </div>
        );
    }

    return (
        <div className={`overflow-x-auto ${isLoading ? 'opacity-50' : ''}`}>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left">
                            <input
                                type="checkbox"
                                checked={selectedUsers.length === users.length && users.length > 0}
                                onChange={onSelectAll}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                        </th>
                        <th
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => onSort('firstName')}
                        >
                            <div className="flex items-center space-x-1">
                                <span>User</span>
                                <SortIcon field="firstName" />
                            </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                        </th>
                        <th
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => onSort('status')}
                        >
                            <div className="flex items-center space-x-1">
                                <span>Status</span>
                                <SortIcon field="status" />
                            </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Verification
                        </th>
                        {(roleType === 'tasker' || roleType === 'all' || roleType === 'both') && (
                            <>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => onSort('rating')}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>Rating</span>
                                        <SortIcon field="rating" />
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tasker Status
                                </th>
                            </>
                        )}
                        <th
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={() => onSort('createdAt')}
                        >
                            <div className="flex items-center space-x-1">
                                <span>Joined</span>
                                <SortIcon field="createdAt" />
                            </div>
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                        <tr
                            key={user.id}
                            className={`hover:bg-gray-50 transition-colors ${selectedUsers.includes(user.id) ? 'bg-primary-50' : ''
                                }`}
                        >
                            <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.includes(user.id)}
                                    onChange={() => onSelectUser(user.id)}
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        {user.profilePicture ? (
                                            <Image
                                                src={user.profilePicture}
                                                alt={user.name}
                                                width={40}
                                                height={40}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                                <span className="text-primary-600 font-medium text-sm">
                                                    {user.firstName[0]}{user.lastName[0]}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {user.name}
                                        </div>
                                        <div className="text-sm text-gray-500 flex items-center">
                                            {user.roles.map((role, idx) => (
                                                <span
                                                    key={role}
                                                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${role === 'tasker'
                                                            ? 'bg-purple-100 text-purple-600'
                                                            : 'bg-blue-100 text-blue-600'
                                                        } ${idx > 0 ? 'ml-1' : ''}`}
                                                >
                                                    {role}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 flex items-center">
                                    <Mail className="w-4 h-4 mr-1 text-gray-400" />
                                    {user.email}
                                </div>
                                {user.phone && (
                                    <div className="text-sm text-gray-500 flex items-center mt-1">
                                        <Phone className="w-4 h-4 mr-1 text-gray-400" />
                                        {user.phone}
                                    </div>
                                )}
                                {user.location.city && (
                                    <div className="text-sm text-gray-500 flex items-center mt-1">
                                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                                        {user.location.city}, {user.location.province}
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {getStatusBadge(user.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                    <div
                                        className="flex items-center"
                                        title={`Email ${user.verification.email ? 'verified' : 'not verified'}`}
                                    >
                                        {user.verification.email ? (
                                            <ShieldCheck className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <ShieldX className="w-5 h-5 text-gray-300" />
                                        )}
                                    </div>
                                    <div
                                        className="flex items-center"
                                        title={`Phone ${user.verification.phone ? 'verified' : 'not verified'}`}
                                    >
                                        {user.verification.phone ? (
                                            <Phone className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <Phone className="w-5 h-5 text-gray-300" />
                                        )}
                                    </div>
                                    <div
                                        className="flex items-center"
                                        title={`Identity ${user.verification.identity ? 'verified' : 'not verified'}`}
                                    >
                                        {user.verification.identity ? (
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <CheckCircle className="w-5 h-5 text-gray-300" />
                                        )}
                                    </div>
                                </div>
                            </td>
                            {(roleType === 'tasker' || roleType === 'all' || roleType === 'both') && (
                                <>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                            <span className="text-sm font-medium text-gray-900">
                                                {user.rating.toFixed(1)}
                                            </span>
                                            <span className="text-sm text-gray-500 ml-1">
                                                ({user.reviewCount})
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {user.stats.bookingsCompleted} bookings
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getTaskerStatusBadge(user.taskerStatus)}
                                    </td>
                                </>
                            )}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(user.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <AllUsersActionMenu
                                    user={user}
                                    onViewUser={() => onViewUser(user.id)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}