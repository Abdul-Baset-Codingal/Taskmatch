// components/admin/users/ConfirmationModal.tsx
"use client";

import React from "react";
import { X, AlertTriangle, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface ConfirmationModalProps {
    type: 'warning' | 'danger' | 'success' | 'info';
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export default function ConfirmationModal({
    type,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    isLoading = false,
}: ConfirmationModalProps) {
    const iconConfig = {
        warning: { Icon: AlertTriangle, bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600' },
        danger: { Icon: AlertCircle, bgColor: 'bg-red-100', iconColor: 'text-red-600' },
        success: { Icon: CheckCircle, bgColor: 'bg-green-100', iconColor: 'text-green-600' },
        info: { Icon: AlertCircle, bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
    };

    const buttonConfig = {
        warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
        danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
        success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
        info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    };

    const { Icon, bgColor, iconColor } = iconConfig[type];

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    onClick={onCancel}
                />

                {/* Modal */}
                <div className="relative inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                    {/* Close button */}
                    <button
                        onClick={onCancel}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-start">
                        <div className={`flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${bgColor}`}>
                            <Icon className={`h-6 w-6 ${iconColor}`} />
                        </div>
                        <div className="ml-4 mt-0.5">
                            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                            <p className="mt-2 text-sm text-gray-500">{message}</p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                        >
                            {cancelText}
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${buttonConfig[type]}`}
                        >
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}