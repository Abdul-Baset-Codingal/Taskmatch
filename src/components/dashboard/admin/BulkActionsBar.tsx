// components/admin/users/BulkActionsBar.tsx
"use client";

import React, { useState } from "react";
import { X, Ban, CheckCircle, Trash2, Loader2 } from "lucide-react";
import ConfirmationModal from "./ConfirmationModal";

interface BulkActionsBarProps {
    selectedCount: number;
    onAction: (action: string, reason?: string) => void;
    onClearSelection: () => void;
    isLoading: boolean;
}

export default function BulkActionsBar({
    selectedCount,
    onAction,
    onClearSelection,
    isLoading,
}: BulkActionsBarProps) {
    const [showConfirm, setShowConfirm] = useState<{
        action: string;
        type: 'warning' | 'danger' | 'success';
        title: string;
        message: string;
    } | null>(null);

    const handleActionClick = (
        action: string,
        type: 'warning' | 'danger' | 'success',
        title: string,
        message: string
    ) => {
        setShowConfirm({ action, type, title, message });
    };

    const handleConfirm = () => {
        if (showConfirm) {
            onAction(showConfirm.action);
            setShowConfirm(null);
        }
    };

    return (
        <>
            <div className="mt-4 bg-primary-50 border border-primary-200 rounded-lg p-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center">
                        <span className="text-primary-700 font-medium">
                            {selectedCount} user{selectedCount > 1 ? 's' : ''} selected
                        </span>
                        <button
                            onClick={onClearSelection}
                            className="ml-3 text-primary-600 hover:text-primary-800 text-sm"
                        >
                            Clear selection
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() =>
                                handleActionClick(
                                    'block',
                                    'warning',
                                    'Block Selected Users',
                                    `Are you sure you want to block ${selectedCount} user${selectedCount > 1 ? 's' : ''}?`
                                )
                            }
                            disabled={isLoading}
                            className="inline-flex items-center px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-200 disabled:opacity-50"
                        >
                            <Ban className="w-4 h-4 mr-1.5" />
                            Block
                        </button>

                        <button
                            onClick={() =>
                                handleActionClick(
                                    'unblock',
                                    'success',
                                    'Unblock Selected Users',
                                    `Are you sure you want to unblock ${selectedCount} user${selectedCount > 1 ? 's' : ''}?`
                                )
                            }
                            disabled={isLoading}
                            className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 disabled:opacity-50"
                        >
                            <CheckCircle className="w-4 h-4 mr-1.5" />
                            Unblock
                        </button>

                        <button
                            onClick={() =>
                                handleActionClick(
                                    'delete',
                                    'danger',
                                    'Delete Selected Users',
                                    `Are you sure you want to permanently delete ${selectedCount} user${selectedCount > 1 ? 's' : ''}? This action cannot be undone.`
                                )
                            }
                            disabled={isLoading}
                            className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 disabled:opacity-50"
                        >
                            <Trash2 className="w-4 h-4 mr-1.5" />
                            Delete
                        </button>

                        {isLoading && (
                            <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
                        )}
                    </div>
                </div>
            </div>

            {showConfirm && (
                <ConfirmationModal
                    type={showConfirm.type}
                    title={showConfirm.title}
                    message={showConfirm.message}
                    onConfirm={handleConfirm}
                    onCancel={() => setShowConfirm(null)}
                    isLoading={isLoading}
                />
            )}
        </>
    );
}