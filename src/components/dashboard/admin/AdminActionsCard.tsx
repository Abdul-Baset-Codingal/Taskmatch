// components/dashboard/admin/AdminActionsCard.tsx
'use client';

import React, { useState } from 'react';
import {
    Shield,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Send,
    RefreshCw,
    Trash2,
    Flag,
    UserX,
    Clock,
    Loader2,
    ChevronDown,
    Mail,
    History,
} from 'lucide-react';

// Define the Quote type based on your schema
interface Quote {
    _id: string;
    taskTitle: string;
    status: 'pending' | 'bidded' | 'accepted' | 'in_progress' | 'completed' | 'rejected' | 'cancelled' | 'expired';
    tasker?: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    client?: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    payment?: {
        status: string;
        paymentIntentId?: string;
    };
}

interface AdminActionsCardProps {
    quote: Quote;
    onRefresh: () => void;
}

// Status options matching the schema
const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending', color: 'bg-gray-100 text-gray-800' },
    { value: 'bidded', label: 'Bidded', color: 'bg-blue-100 text-blue-800' },
    { value: 'accepted', label: 'Accepted', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
    { value: 'expired', label: 'Expired', color: 'bg-orange-100 text-orange-800' },
] as const;

type QuoteStatus = typeof STATUS_OPTIONS[number]['value'];

// API base URL - adjust as needed
const API_BASE ='';

// Helper function for API calls
const apiCall = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token'); // or however you store your auth token

    const response = await fetch(`${API_BASE}${url}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers,
        },
        credentials: 'include', // Include cookies if using cookie-based auth
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Request failed');
    }

    return data;
};

export default function AdminActionsCard({ quote, onRefresh }: AdminActionsCardProps) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationRecipients, setNotificationRecipients] = useState<string[]>(['client', 'tasker']);
    const [actionLog, setActionLog] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const showError = (message: string) => {
        setError(message);
        setTimeout(() => setError(null), 5000);
    };

    const showSuccess = (message: string) => {
        setActionLog(prev => [...prev, `✓ ${message}`]);
    };

    const handleStatusChange = async (newStatus: QuoteStatus) => {
        setIsUpdating(true);
        setShowStatusDropdown(false);
        setError(null);

        try {
            await apiCall(`/api/admin/quotes/${quote._id}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status: newStatus }),
            });

            showSuccess(`Status changed to ${newStatus}`);
            onRefresh();
        } catch (err) {
            showError(err instanceof Error ? err.message : 'Failed to update status');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleCancelQuote = async () => {
        if (!cancelReason.trim()) {
            showError('Please provide a reason for cancellation');
            return;
        }

        setIsUpdating(true);
        setError(null);

        try {
            await apiCall(`/api/admin/quotes/${quote._id}/cancel`, {
                method: 'POST',
                body: JSON.stringify({ reason: cancelReason }),
            });

            showSuccess('Quote cancelled successfully');
            setShowCancelModal(false);
            setCancelReason('');
            onRefresh();
        } catch (err) {
            showError(err instanceof Error ? err.message : 'Failed to cancel quote');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteQuote = async () => {
        setIsUpdating(true);
        setError(null);

        try {
            await apiCall(`/api/admin/quotes/${quote._id}`, {
                method: 'DELETE',
            });

            // Redirect to quotes list after deletion
            window.location.href = '/dashboard/admin/marketplace/quotes';
        } catch (err) {
            showError(err instanceof Error ? err.message : 'Failed to delete quote');
            setIsUpdating(false);
        }
    };

    const handleSendNotification = async () => {
        if (!notificationMessage.trim()) {
            showError('Please enter a notification message');
            return;
        }

        if (notificationRecipients.length === 0) {
            showError('Please select at least one recipient');
            return;
        }

        setIsUpdating(true);
        setError(null);

        try {
            await apiCall(`/api/admin/quotes/${quote._id}/notify`, {
                method: 'POST',
                body: JSON.stringify({
                    message: notificationMessage,
                    recipients: notificationRecipients,
                }),
            });

            showSuccess('Notification sent successfully');
            setShowNotificationModal(false);
            setNotificationMessage('');
        } catch (err) {
            showError(err instanceof Error ? err.message : 'Failed to send notification');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleForceComplete = async () => {
        if (!confirm('Are you sure you want to force complete this quote? This will mark it as completed without tasker confirmation.')) {
            return;
        }

        setIsUpdating(true);
        setError(null);

        try {
            await apiCall(`/api/admin/quotes/${quote._id}/force-complete`, {
                method: 'POST',
            });

            showSuccess('Quote marked as completed');
            onRefresh();
        } catch (err) {
            showError(err instanceof Error ? err.message : 'Failed to force complete');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleFlagQuote = async () => {
        const reason = prompt('Enter reason for flagging this quote:');
        if (!reason) return;

        setIsUpdating(true);
        setError(null);

        try {
            await apiCall(`/api/admin/quotes/${quote._id}/flag`, {
                method: 'POST',
                body: JSON.stringify({ reason }),
            });

            showSuccess('Quote flagged for review');
            onRefresh();
        } catch (err) {
            showError(err instanceof Error ? err.message : 'Failed to flag quote');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleReassignTasker = async () => {
        if (!confirm('Are you sure you want to remove the current tasker? The quote will be reopened for new bids.')) {
            return;
        }

        setIsUpdating(true);
        setError(null);

        try {
            await apiCall(`/api/admin/quotes/${quote._id}/reassign`, {
                method: 'POST',
            });

            showSuccess('Tasker removed, quote reopened');
            onRefresh();
        } catch (err) {
            showError(err instanceof Error ? err.message : 'Failed to reassign tasker');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleExtendDeadline = async () => {
        const days = prompt('Enter number of days to extend:');
        if (!days || isNaN(parseInt(days)) || parseInt(days) < 1) {
            if (days !== null) showError('Please enter a valid number of days');
            return;
        }

        setIsUpdating(true);
        setError(null);

        try {
            await apiCall(`/api/admin/quotes/${quote._id}/extend-deadline`, {
                method: 'POST',
                body: JSON.stringify({ days: parseInt(days) }),
            });

            showSuccess(`Deadline extended by ${days} days`);
            onRefresh();
        } catch (err) {
            showError(err instanceof Error ? err.message : 'Failed to extend deadline');
        } finally {
            setIsUpdating(false);
        }
    };

    const currentStatusOption = STATUS_OPTIONS.find(s => s.value === quote.status);

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Shield className="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Admin Actions</h3>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {/* Status Change */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Change Status
                        </label>
                        <div className="relative">
                            <button
                                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                                disabled={isUpdating}
                                className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                            >
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentStatusOption?.color || 'bg-gray-100 text-gray-800'}`}>
                                    {currentStatusOption?.label || quote.status}
                                </span>
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            </button>

                            {showStatusDropdown && (
                                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    {STATUS_OPTIONS.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleStatusChange(option.value)}
                                            disabled={option.value === quote.status}
                                            className="w-full flex items-center px-4 py-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed first:rounded-t-lg last:rounded-b-lg"
                                        >
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${option.color}`}>
                                                {option.label}
                                            </span>
                                            {option.value === quote.status && (
                                                <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Quick Actions
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setShowNotificationModal(true)}
                                disabled={isUpdating}
                                className="flex items-center justify-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                                <Send className="w-4 h-4 mr-2 text-blue-600" />
                                Notify
                            </button>
                            <button
                                onClick={handleFlagQuote}
                                disabled={isUpdating}
                                className="flex items-center justify-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                                <Flag className="w-4 h-4 mr-2 text-orange-600" />
                                Flag
                            </button>
                            <button
                                onClick={handleExtendDeadline}
                                disabled={isUpdating}
                                className="flex items-center justify-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                                <Clock className="w-4 h-4 mr-2 text-indigo-600" />
                                Extend
                            </button>
                            <button
                                onClick={onRefresh}
                                disabled={isUpdating}
                                className="flex items-center justify-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 text-gray-600 ${isUpdating ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>
                        </div>
                    </div>

                    {/* Tasker Actions - Only show when applicable */}
                    {quote.tasker && !['completed', 'cancelled', 'rejected', 'expired'].includes(quote.status) && (
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Tasker Actions
                            </label>
                            <div className="space-y-2">
                                <button
                                    onClick={handleReassignTasker}
                                    disabled={isUpdating}
                                    className="w-full flex items-center justify-center px-4 py-2 text-sm border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 disabled:opacity-50"
                                >
                                    <UserX className="w-4 h-4 mr-2" />
                                    Remove Tasker & Reopen
                                </button>
                                {['accepted', 'in_progress'].includes(quote.status) && (
                                    <button
                                        onClick={handleForceComplete}
                                        disabled={isUpdating}
                                        className="w-full flex items-center justify-center px-4 py-2 text-sm border border-green-300 text-green-700 rounded-lg hover:bg-green-50 disabled:opacity-50"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Force Complete
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Danger Zone */}
                    <div className="border-t border-gray-200 pt-4 mt-4">
                        <label className="block text-sm font-medium text-red-600 mb-2">
                            Danger Zone
                        </label>
                        <div className="space-y-2">
                            {quote.status !== 'cancelled' && (
                                <button
                                    onClick={() => setShowCancelModal(true)}
                                    disabled={isUpdating}
                                    className="w-full flex items-center justify-center px-4 py-2 text-sm border border-red-300 text-red-700 rounded-lg hover:bg-red-50 disabled:opacity-50"
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Cancel Quote
                                </button>
                            )}
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                disabled={isUpdating}
                                className="w-full flex items-center justify-center px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Quote
                            </button>
                        </div>
                    </div>

                    {/* Activity Log */}
                    {actionLog.length > 0 && (
                        <div className="border-t border-gray-200 pt-4 mt-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <History className="w-4 h-4 text-gray-500" />
                                <label className="block text-sm font-medium text-gray-700">
                                    Recent Actions
                                </label>
                            </div>
                            <ul className="text-xs text-gray-600 space-y-1 max-h-32 overflow-y-auto">
                                {actionLog.slice(-5).reverse().map((log, index) => (
                                    <li key={index} className="flex items-center space-x-2">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0"></span>
                                        <span>{log}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Cancel Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Cancel Quote</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-red-800">Warning</p>
                                        <p className="text-sm text-red-700 mt-1">
                                            Cancelling this quote will notify both the client and tasker.
                                            If payment has been made, it will be automatically refunded.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Reason for Cancellation *
                                </label>
                                <textarea
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    placeholder="Enter the reason for cancellation..."
                                />
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="px-4 py-2 text-gray-700 hover:text-gray-900"
                                disabled={isUpdating}
                            >
                                Close
                            </button>
                            <button
                                onClick={handleCancelQuote}
                                disabled={isUpdating || !cancelReason.trim()}
                                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isUpdating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Cancelling...
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Cancel Quote
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-red-600">Delete Quote</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-red-800">This action cannot be undone</p>
                                        <p className="text-sm text-red-700 mt-1">
                                            Deleting this quote will permanently remove all associated data including
                                            bids, messages, and payment records.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600">
                                Are you sure you want to delete quote <strong>{quote.taskTitle}</strong>?
                            </p>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-gray-700 hover:text-gray-900"
                                disabled={isUpdating}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteQuote}
                                disabled={isUpdating}
                                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                                {isUpdating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete Permanently
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification Modal */}
            {showNotificationModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Send Notification</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Recipients
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={notificationRecipients.includes('client')}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setNotificationRecipients([...notificationRecipients, 'client']);
                                                } else {
                                                    setNotificationRecipients(notificationRecipients.filter(r => r !== 'client'));
                                                }
                                            }}
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">
                                            Client {quote.client && `(${quote.client.email})`}
                                        </span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={notificationRecipients.includes('tasker')}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setNotificationRecipients([...notificationRecipients, 'tasker']);
                                                } else {
                                                    setNotificationRecipients(notificationRecipients.filter(r => r !== 'tasker'));
                                                }
                                            }}
                                            disabled={!quote.tasker}
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                                        />
                                        <span className={`ml-2 text-sm ${quote.tasker ? 'text-gray-700' : 'text-gray-400'}`}>
                                            Tasker {quote.tasker ? `(${quote.tasker.email})` : '(Not assigned)'}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Message
                                </label>
                                <textarea
                                    value={notificationMessage}
                                    onChange={(e) => setNotificationMessage(e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your notification message..."
                                />
                            </div>

                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <Mail className="w-4 h-4" />
                                <span>Recipients will be notified via email and in-app notification</span>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowNotificationModal(false)}
                                className="px-4 py-2 text-gray-700 hover:text-gray-900"
                                disabled={isUpdating}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendNotification}
                                disabled={isUpdating || !notificationMessage.trim() || notificationRecipients.length === 0}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isUpdating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        Send Notification
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}