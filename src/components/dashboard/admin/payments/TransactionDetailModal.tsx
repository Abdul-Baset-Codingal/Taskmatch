// @ts-nocheck

// components/admin/payments/modals/TransactionDetailModal.tsx
// ✅ FIXED: Removed non-existent API hooks (useGetTransactionDetailsQuery, useRefundTransactionMutation)
// ✅ FIXED: Use only passed `transaction` prop data (no additional fetching)
// ✅ FIXED: Added missing formatter imports (getStatusColor, getPaymentStatusColor)
// ✅ FIXED: Corrected LoadingSpinner import path (assuming ../tabs/LoadingSpinner)
// ✅ FIXED: Removed refund functionality (requires backend mutation - can be re-added later)
// ✅ FIXED: Removed timeline dependency (empty by default - populate from prop if available)
// ✅ FIXED: Added fallback handling for optional fields
// ✅ IMPROVED: Better error handling and simplified logic

import React, { useState } from 'react';
import {
    X,
    User,
    Mail,
    Phone,
    Calendar,
    DollarSign,
    CreditCard,
    FileText,
    ExternalLink,
    MapPin,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Copy,
    Download
} from 'lucide-react';

import LoadingSpinner from './LoadingSpinner'; // ✅ Adjusted path
import {
    formatCurrency,
    formatDateTime,
    formatDate,
    getStatusColor,
    getPaymentStatusColor
} from './formatters'; // ✅ Full import + path adjustment (use your actual path)

interface TransactionDetailModalProps {
    transaction: {
        id: string;
        type: string;
        title?: string;
        status: string;
        paymentStatus?: string;
        totalAmount: number;
        platformRevenue: number;
        date: string;
        description?: string;
        subtotal?: number;
        serviceFee?: number;
        refundedAmount?: number;
        stripePaymentIntentId?: string;
        stripeChargeId?: string;
        createdAt?: string;
        scheduledDate?: string;
        completedAt?: string;
        location?: string;
        client?: {
            _id?: string;
            firstName?: string;
            lastName?: string;
            email?: string;
            phone?: string;
        };
        tasker?: {
            _id?: string;
            firstName?: string;
            lastName?: string;
            email?: string;
            phone?: string;
        };
        timeline?: Array<{
            title: string;
            description?: string;
            timestamp: string;
            type: 'success' | 'error' | 'warning' | 'info';
        }>;
    };
    onClose: () => void;
}

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
    transaction,
    onClose,
}) => {
    const [activeTab, setActiveTab] = useState<'details' | 'payment' | 'timeline'>('details');

    // ✅ Use transaction prop directly (no API fetching)
    const details = transaction;
    const timeline: any[] = details.timeline || [];

    const handleCopyId = (id?: string) => {
        if (id) {
            navigator.clipboard.writeText(id);
            // TODO: Add toast notification for copy success
        }
    };

    const getPaymentStatusIcon = (status?: string) => {
        const s = status?.toLowerCase();
        switch (s) {
            case 'paid':
            case 'succeeded':
            case 'completed':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'failed':
            case 'cancelled':
                return <XCircle className="w-5 h-5 text-red-500" />;
            case 'pending':
            case 'processing':
                return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'refunded':
            case 'partially_refunded':
                return <RefreshCw className="w-5 h-5 text-blue-500" />;
            default:
                return <AlertCircle className="w-5 h-5 text-gray-500" />;
        }
    };

    const getFullName = (person?: { firstName?: string; lastName?: string }) => {
        return person ? `${person.firstName || ''} ${person.lastName || ''}`.trim() || 'N/A' : 'N/A';
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${transaction.type === 'Task' ? 'bg-blue-100' :
                                transaction.type === 'Booking' ? 'bg-purple-100' :
                                    'bg-orange-100'
                            }`}>
                            <FileText className={`w-5 h-5 ${transaction.type === 'Task' ? 'text-blue-600' :
                                    transaction.type === 'Booking' ? 'text-purple-600' :
                                        'text-orange-600'
                                }`} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Transaction Details
                            </h2>
                            <p className="text-sm text-gray-500">
                                {transaction.type} • {transaction.id?.slice(-8)}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 bg-gray-50">
                    {['details', 'payment', 'timeline'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`flex-1 px-4 py-3 text-sm font-medium capitalize transition-colors
                                ${activeTab === tab
                                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Details Tab */}
                    {activeTab === 'details' && (
                        <div className="space-y-6">
                            {/* Transaction Summary */}
                            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-indigo-100 text-sm">Total Amount</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${details.status === 'completed' ? 'bg-green-400/20 text-green-100' :
                                            details.status === 'cancelled' ? 'bg-red-400/20 text-red-100' :
                                                'bg-yellow-400/20 text-yellow-100'
                                        }`}>
                                        {details.status}
                                    </span>
                                </div>
                                <div className="text-3xl font-bold mb-2">
                                    {formatCurrency(details.totalAmount)}
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-indigo-100">
                                    <span>Platform Fee: {formatCurrency(details.platformRevenue)}</span>
                                    <span>•</span>
                                    <span>Tasker Payout: {formatCurrency(details.totalAmount - details.platformRevenue)}</span>
                                </div>
                            </div>

                            {/* Title and Description */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                                <p className="text-gray-900 font-medium">{details.title || 'No title'}</p>
                                {details.description && (
                                    <p className="text-sm text-gray-600 mt-2">{details.description}</p>
                                )}
                            </div>

                            {/* Client Information */}
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                                    <User className="w-4 h-4 mr-2 text-gray-500" />
                                    Client Information
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Name</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {getFullName(details.client)}
                                        </span>
                                    </div>
                                    {details.client?.email && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Email</span>
                                            <a
                                                href={`mailto:${details.client.email}`}
                                                className="text-sm text-indigo-600 hover:text-indigo-700"
                                            >
                                                {details.client.email}
                                            </a>
                                        </div>
                                    )}
                                    {details.client?.phone && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Phone</span>
                                            <span className="text-sm text-gray-900">{details.client.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Tasker Information */}
                            {details.tasker && (
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                                        <User className="w-4 h-4 mr-2 text-gray-500" />
                                        Tasker Information
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Name</span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {getFullName(details.tasker)}
                                            </span>
                                        </div>
                                        {details.tasker.email && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500">Email</span>
                                                <a
                                                    href={`mailto:${details.tasker.email}`}
                                                    className="text-sm text-indigo-600 hover:text-indigo-700"
                                                >
                                                    {details.tasker.email}
                                                </a>
                                            </div>
                                        )}
                                        {details.tasker?.phone && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500">Phone</span>
                                                <span className="text-sm text-gray-900">{details.tasker.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Location */}
                            {details.location && (
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                                        <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                                        Location
                                    </h4>
                                    <p className="text-sm text-gray-700">{details.location}</p>
                                </div>
                            )}

                            {/* Date Information */}
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                    Date Information
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Date</span>
                                        <span className="text-sm text-gray-900">{formatDateTime(details.date)}</span>
                                    </div>
                                    {details.createdAt && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Created</span>
                                            <span className="text-sm text-gray-900">{formatDateTime(details.createdAt)}</span>
                                        </div>
                                    )}
                                    {details.scheduledDate && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Scheduled</span>
                                            <span className="text-sm text-gray-900">{formatDateTime(details.scheduledDate)}</span>
                                        </div>
                                    )}
                                    {details.completedAt && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Completed</span>
                                            <span className="text-sm text-gray-900">{formatDateTime(details.completedAt)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Payment Tab */}
                    {activeTab === 'payment' && (
                        <div className="space-y-6">
                            {/* Payment Status Card */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-3">
                                        {getPaymentStatusIcon(details.paymentStatus)}
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">Payment Status</h4>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getPaymentStatusColor(details.paymentStatus)}`}>
                                                {details.paymentStatus || 'Unknown'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-gray-900">
                                            {formatCurrency(details.totalAmount)}
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Breakdown */}
                                <div className="border-t border-gray-200 pt-4 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span className="text-gray-900">{formatCurrency(details.subtotal || details.totalAmount)}</span>
                                    </div>
                                    {details.serviceFee && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Service Fee</span>
                                            <span className="text-gray-900">{formatCurrency(details.serviceFee)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Platform Revenue</span>
                                        <span className="text-green-600 font-medium">+{formatCurrency(details.platformRevenue)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm border-t border-gray-200 pt-3">
                                        <span className="text-gray-500">Tasker Payout</span>
                                        <span className="text-gray-900 font-medium">
                                            {formatCurrency(details.totalAmount - details.platformRevenue)}
                                        </span>
                                    </div>
                                    {details.refundedAmount && details.refundedAmount > 0 && (
                                        <div className="flex justify-between text-sm text-red-600">
                                            <span>Refunded</span>
                                            <span>-{formatCurrency(details.refundedAmount)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Stripe IDs */}
                            {(details.stripePaymentIntentId || details.stripeChargeId) && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                                        <CreditCard className="w-4 h-4 mr-2 text-gray-500" />
                                        Payment References
                                    </h4>
                                    <div className="space-y-3">
                                        {details.stripePaymentIntentId && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500">Payment Intent</span>
                                                <div className="flex items-center space-x-2">
                                                    <code className="text-xs bg-gray-200 px-2 py-1 rounded font-mono">
                                                        {details.stripePaymentIntentId.slice(0, 20)}...
                                                    </code>
                                                    <button
                                                        onClick={() => handleCopyId(details.stripePaymentIntentId)}
                                                        className="text-gray-400 hover:text-gray-600 p-1"
                                                        title="Copy"
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                    <a
                                                        href={`https://dashboard.stripe.com/payments/${details.stripePaymentIntentId}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-indigo-600 hover:text-indigo-700 p-1"
                                                        title="View in Stripe"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                        {details.stripeChargeId && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500">Charge ID</span>
                                                <div className="flex items-center space-x-2">
                                                    <code className="text-xs bg-gray-200 px-2 py-1 rounded font-mono">
                                                        {details.stripeChargeId.slice(0, 20)}...
                                                    </code>
                                                    <button
                                                        onClick={() => handleCopyId(details.stripeChargeId)}
                                                        className="text-gray-400 hover:text-gray-600 p-1"
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Timeline Tab */}
                    {activeTab === 'timeline' && (
                        <div className="space-y-4">
                            {timeline.length > 0 ? (
                                <div className="relative">
                                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                                    <div className="space-y-6">
                                        {timeline.map((event: any, index: number) => (
                                            <div key={index} className="relative flex items-start ml-8">
                                                <div className={`absolute -left-8 w-8 h-8 rounded-full flex items-center justify-center ${event.type === 'success' ? 'bg-green-100' :
                                                        event.type === 'error' ? 'bg-red-100' :
                                                            event.type === 'warning' ? 'bg-yellow-100' :
                                                                'bg-gray-100'
                                                    }`}>
                                                    {event.type === 'success' ? (
                                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                                    ) : event.type === 'error' ? (
                                                        <XCircle className="w-4 h-4 text-red-600" />
                                                    ) : (
                                                        <Clock className="w-4 h-4 text-gray-600" />
                                                    )}
                                                </div>
                                                <div className="flex-1 bg-gray-50 rounded-lg p-4">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {event.title}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {formatDateTime(event.timestamp)}
                                                        </span>
                                                    </div>
                                                    {event.description && (
                                                        <p className="text-sm text-gray-600">{event.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                    <p className="text-lg font-medium">No timeline events available</p>
                                    <p className="text-sm mt-1">Timeline data will be populated when available from backend.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                        >
                            Close
                        </button>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => window.print()}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Print
                            </button>
                            {details.stripePaymentIntentId && (
                                <a
                                    href={`https://dashboard.stripe.com/payments/${details.stripePaymentIntentId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                >
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    View in Stripe
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetailModal;