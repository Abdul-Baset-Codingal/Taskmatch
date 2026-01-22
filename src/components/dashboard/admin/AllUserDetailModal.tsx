// components/admin/users/UserDetailModal.tsx
"use client";

import React from "react";
import Image from "next/image";
import {
    X,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Star,
    Shield,
    ShieldCheck,
    CheckCircle,
    Clock,
    DollarSign,
    ClipboardList,
    Loader2,
    ExternalLink
} from "lucide-react";
import { useGetAdminUserByIdQuery } from "@/features/auth/authApi";

interface UserDetailModalProps {
    userId: string;
    onClose: () => void;
    onRefresh: () => void;
}

export default function UserDetailModal({ userId, onClose, onRefresh }: UserDetailModalProps) {
    const { data, isLoading, error } = useGetAdminUserByIdQuery(userId);

    const user = data?.data;

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-CA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-CA', {
            style: 'currency',
            currency: 'CAD',
        }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { bg: string; text: string }> = {
            active: { bg: 'bg-green-100', text: 'text-green-800' },
            inactive: { bg: 'bg-gray-100', text: 'text-gray-800' },
            suspended: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
            banned: { bg: 'bg-red-100', text: 'text-red-800' },
        };
        const config = statusConfig[status] || statusConfig.inactive;
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-start justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    onClick={onClose}
                />

                {/* Modal */}
                <div className="relative inline-block w-full max-w-3xl my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">User Details</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 p-2 rounded-lg hover:bg-gray-100"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <p className="text-red-500">Failed to load user details</p>
                            </div>
                        ) : user ? (
                            <div className="space-y-6">
                                {/* User Header */}
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        {user.profilePicture ? (
                                            <Image
                                                src={user.profilePicture}
                                                alt={user.name || 'User'}
                                                width={80}
                                                height={80}
                                                className="h-20 w-20 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center">
                                                <span className="text-primary-600 font-bold text-2xl">
                                                    {user.firstName?.[0]}{user.lastName?.[0]}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xl font-bold text-gray-900">
                                                {user.firstName} {user.lastName}
                                            </h3>
                                            {getStatusBadge(user.isBlocked ? 'suspended' : (user.isEmailVerified ? 'active' : 'inactive'))}
                                        </div>
                                        <div className="mt-1 flex flex-wrap gap-2">
                                            {user.roles?.map((role: string) => (
                                                <span
                                                    key={role}
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${role === 'tasker'
                                                            ? 'bg-purple-100 text-purple-700'
                                                            : role === 'admin'
                                                                ? 'bg-red-100 text-red-700'
                                                                : 'bg-blue-100 text-blue-700'
                                                        }`}
                                                >
                                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Contact Information</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex items-center">
                                            <Mail className="w-5 h-5 text-gray-400 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-500">Email</p>
                                                <p className="text-sm font-medium text-gray-900">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <Phone className="w-5 h-5 text-gray-400 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-500">Phone</p>
                                                <p className="text-sm font-medium text-gray-900">{user.phone || 'Not provided'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-500">Location</p>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {user.address?.city ? `${user.address.city}, ${user.address.province}` : 'Not provided'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-500">Joined</p>
                                                <p className="text-sm font-medium text-gray-900">{formatDate(user.createdAt)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Verification Status */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Verification Status</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        <div className="text-center p-3 bg-white rounded-lg border">
                                            {user.isEmailVerified ? (
                                                <ShieldCheck className="w-8 h-8 text-green-500 mx-auto" />
                                            ) : (
                                                <Shield className="w-8 h-8 text-gray-300 mx-auto" />
                                            )}
                                            <p className="text-xs text-gray-500 mt-2">Email</p>
                                        </div>
                                        <div className="text-center p-3 bg-white rounded-lg border">
                                            {user.isPhoneVerified ? (
                                                <ShieldCheck className="w-8 h-8 text-green-500 mx-auto" />
                                            ) : (
                                                <Shield className="w-8 h-8 text-gray-300 mx-auto" />
                                            )}
                                            <p className="text-xs text-gray-500 mt-2">Phone</p>
                                        </div>
                                        <div className="text-center p-3 bg-white rounded-lg border">
                                            {user.idVerification?.verified ? (
                                                <ShieldCheck className="w-8 h-8 text-green-500 mx-auto" />
                                            ) : (
                                                <Shield className="w-8 h-8 text-gray-300 mx-auto" />
                                            )}
                                            <p className="text-xs text-gray-500 mt-2">Identity</p>
                                        </div>
                                        <div className="text-center p-3 bg-white rounded-lg border">
                                            {user.address?.city ? (
                                                <ShieldCheck className="w-8 h-8 text-green-500 mx-auto" />
                                            ) : (
                                                <Shield className="w-8 h-8 text-gray-300 mx-auto" />
                                            )}
                                            <p className="text-xs text-gray-500 mt-2">Address</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats */}
                                {user.roles?.includes('tasker') && (
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Tasker Statistics</h4>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            <div className="bg-white p-3 rounded-lg border text-center">
                                                <Star className="w-6 h-6 text-yellow-400 mx-auto" />
                                                <p className="text-xl font-bold text-gray-900 mt-1">
                                                    {user.rating?.toFixed(1) || '0.0'}
                                                </p>
                                                <p className="text-xs text-gray-500">Rating</p>
                                            </div>
                                            <div className="bg-white p-3 rounded-lg border text-center">
                                                <ClipboardList className="w-6 h-6 text-blue-500 mx-auto" />
                                                <p className="text-xl font-bold text-gray-900 mt-1">
                                                    {user.stats?.bookingsCompleted || 0}
                                                </p>
                                                <p className="text-xs text-gray-500">Bookings</p>
                                            </div>
                                            <div className="bg-white p-3 rounded-lg border text-center">
                                                <DollarSign className="w-6 h-6 text-green-500 mx-auto" />
                                                <p className="text-xl font-bold text-gray-900 mt-1">
                                                    {formatCurrency(user.stats?.totalEarnings || 0)}
                                                </p>
                                                <p className="text-xs text-gray-500">Earnings</p>
                                            </div>
                                            <div className="bg-white p-3 rounded-lg border text-center">
                                                <CheckCircle className="w-6 h-6 text-purple-500 mx-auto" />
                                                <p className="text-xl font-bold text-gray-900 mt-1">
                                                    {user.stats?.completionRate || 100}%
                                                </p>
                                                <p className="text-xs text-gray-500">Completion</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Categories (for taskers) */}
                                {user.categories?.length > 0 && (
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Service Categories</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {user.categories.map((category: string) => (
                                                <span
                                                    key={category}
                                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-700"
                                                >
                                                    {category}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : null}
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Close
                        </button>
                        <a
                            href={`/admin/users/${userId}/edit`}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
                        >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Edit User
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}