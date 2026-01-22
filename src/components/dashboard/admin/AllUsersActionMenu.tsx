// components/admin/users/UserActionsMenu.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    MoreVertical,
    Eye,
    Edit,
    Ban,
    CheckCircle,
    Mail,
    Trash2,
    UserX,
    UserCheck,
    Shield
} from "lucide-react";

import { useApproveRejectTaskerMutation, useDeleteUserMutation, useUpdateUserStatusMutation } from "@/features/auth/authApi";
import { toast } from "react-toastify";
import ConfirmationModal from "./ConfirmationModal";

interface UserActionsMenuProps {
    user: {
        id: string;
        name: string;
        email: string;
        status: string;
        taskerStatus?: string;
        roles: string[];
    };
    onViewUser: () => void;
}

export default function AllUsersActionMenu({ user, onViewUser }: UserActionsMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState<{
        type: string;
        title: string;
        message: string;
        action: () => void;
    } | null>(null);

    const menuRef = useRef<HTMLDivElement>(null);

    const [updateStatus, { isLoading: isUpdating }] = useUpdateUserStatusMutation();
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
    const [approveReject, { isLoading: isApproving }] = useApproveRejectTaskerMutation();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleAction = async (action: string) => {
        setIsOpen(false);

        switch (action) {
            case 'view':
                onViewUser();
                break;
            case 'block':
                setShowConfirm({
                    type: 'warning',
                    title: 'Block User',
                    message: `Are you sure you want to block ${user.name}? They will not be able to access the platform.`,
                    action: async () => {
                        try {
                            await updateStatus({ id: user.id, action: 'block' }).unwrap();
                            toast.success('User blocked successfully');
                        } catch (error: any) {
                            toast.error(error?.data?.message || 'Failed to block user');
                        }
                    },
                });
                break;
            case 'unblock':
                setShowConfirm({
                    type: 'success',
                    title: 'Unblock User',
                    message: `Are you sure you want to unblock ${user.name}?`,
                    action: async () => {
                        try {
                            await updateStatus({ id: user.id, action: 'unblock' }).unwrap();
                            toast.success('User unblocked successfully');
                        } catch (error: any) {
                            toast.error(error?.data?.message || 'Failed to unblock user');
                        }
                    },
                });
                break;
            case 'suspend':
                setShowConfirm({
                    type: 'warning',
                    title: 'Suspend User',
                    message: `Are you sure you want to suspend ${user.name}?`,
                    action: async () => {
                        try {
                            await updateStatus({ id: user.id, action: 'suspend' }).unwrap();
                            toast.success('User suspended successfully');
                        } catch (error: any) {
                            toast.error(error?.data?.message || 'Failed to suspend user');
                        }
                    },
                });
                break;
            case 'activate':
                try {
                    await updateStatus({ id: user.id, action: 'activate' }).unwrap();
                    toast.success('User activated successfully');
                } catch (error: any) {
                    toast.error(error?.data?.message || 'Failed to activate user');
                }
                break;
            case 'approve_tasker':
                setShowConfirm({
                    type: 'success',
                    title: 'Approve Tasker',
                    message: `Are you sure you want to approve ${user.name} as a tasker?`,
                    action: async () => {
                        try {
                            await approveReject({ userId: user.id, action: 'approve' }).unwrap();
                            toast.success('Tasker approved successfully');
                        } catch (error: any) {
                            toast.error(error?.data?.message || 'Failed to approve tasker');
                        }
                    },
                });
                break;
            case 'reject_tasker':
                setShowConfirm({
                    type: 'danger',
                    title: 'Reject Tasker Application',
                    message: `Are you sure you want to reject ${user.name}'s tasker application?`,
                    action: async () => {
                        try {
                            await approveReject({ userId: user.id, action: 'reject' }).unwrap();
                            toast.success('Tasker application rejected');
                        } catch (error: any) {
                            toast.error(error?.data?.message || 'Failed to reject tasker');
                        }
                    },
                });
                break;
            case 'delete':
                setShowConfirm({
                    type: 'danger',
                    title: 'Delete User',
                    message: `Are you sure you want to permanently delete ${user.name}? This action cannot be undone.`,
                    action: async () => {
                        try {
                            await deleteUser(user.id).unwrap();
                            toast.success('User deleted successfully');
                        } catch (error: any) {
                            toast.error(error?.data?.message || 'Failed to delete user');
                        }
                    },
                });
                break;
        }
    };

    const menuItems = [
        { key: 'view', label: 'View Details', icon: Eye, always: true },
        { key: 'divider1', divider: true },
        {
            key: 'block',
            label: 'Block User',
            icon: Ban,
            show: user.status !== 'suspended' && user.status !== 'banned',
            className: 'text-red-600 hover:bg-red-50',
        },
        {
            key: 'unblock',
            label: 'Unblock User',
            icon: UserCheck,
            show: user.status === 'suspended' || user.status === 'banned',
            className: 'text-green-600 hover:bg-green-50',
        },
        {
            key: 'suspend',
            label: 'Suspend User',
            icon: UserX,
            show: user.status === 'active',
            className: 'text-yellow-600 hover:bg-yellow-50',
        },
        { key: 'divider2', divider: true, show: user.taskerStatus === 'under_review' },
        {
            key: 'approve_tasker',
            label: 'Approve Tasker',
            icon: Shield,
            show: user.taskerStatus === 'under_review',
            className: 'text-green-600 hover:bg-green-50',
        },
        {
            key: 'reject_tasker',
            label: 'Reject Tasker',
            icon: Shield,
            show: user.taskerStatus === 'under_review',
            className: 'text-red-600 hover:bg-red-50',
        },
        { key: 'divider3', divider: true },
        {
            key: 'delete',
            label: 'Delete User',
            icon: Trash2,
            always: true,
            className: 'text-red-600 hover:bg-red-50',
        },
    ];

    return (
        <>
            <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    disabled={isUpdating || isDeleting || isApproving}
                >
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        {menuItems.map((item) => {
                            if (item.divider) {
                                if (item.show === false) return null;
                                return <div key={item.key} className="border-t border-gray-200 my-1" />;
                            }

                            if (!item.always && item.show === false) return null;

                            return (
                                <button
                                    key={item.key}
                                    onClick={() => handleAction(item.key)}
                                    className={`w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors ${item.className || ''
                                        }`}
                                >
                                    {item.icon && <item.icon className="w-4 h-4 mr-3" />}
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <ConfirmationModal
                    type={showConfirm.type as any}
                    title={showConfirm.title}
                    message={showConfirm.message}
                    onConfirm={() => {
                        showConfirm.action();
                        setShowConfirm(null);
                    }}
                    onCancel={() => setShowConfirm(null)}
                    isLoading={isUpdating || isDeleting || isApproving}
                />
            )}
        </>
    );
}