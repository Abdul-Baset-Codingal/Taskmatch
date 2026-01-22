// components/dashboard/admin/CancelBookingModal.tsx
"use client"

import React, { useState } from 'react';
import { format, parseISO, isValid } from 'date-fns';
import {
    X,
    AlertTriangle,
    XCircle,
    DollarSign,
    User,
    Calendar,
    Info,
} from 'lucide-react';
import { useCancelBookingMutation } from '@/features/api/adminBookingApi';

interface Booking {
    _id: string;
    status: string;
    date: string;
    totalAmount?: number;
    service?: {
        title?: string;
    };
    client?: {
        firstName?: string;
        lastName?: string;
        email?: string;
    };
    tasker?: {
        firstName?: string;
        lastName?: string;
    };
    payment?: {
        status: string;
        totalClientPays?: number;
    };
}

interface CancelBookingModalProps {
    open: boolean;
    onClose: () => void;
    booking: Booking | null;
    onSuccess: () => void;
}

const CANCELLATION_REASONS = [
    { value: 'client_request', label: 'Client requested cancellation' },
    { value: 'tasker_unavailable', label: 'Tasker unavailable' },
    { value: 'service_issue', label: 'Service issue' },
    { value: 'payment_issue', label: 'Payment issue' },
    { value: 'duplicate_booking', label: 'Duplicate booking' },
    { value: 'scheduling_conflict', label: 'Scheduling conflict' },
    { value: 'policy_violation', label: 'Policy violation' },
    { value: 'other', label: 'Other reason' },
];

const REFUND_OPTIONS = [
    { value: 'full', label: 'Full Refund', description: '100% of payment returned to client' },
    { value: 'partial', label: 'Partial Refund', description: 'Custom amount returned to client' },
    { value: 'none', label: 'No Refund', description: 'No refund will be processed' },
];

// Safe date formatting helper
const safeFormatDate = (dateString: string | undefined | null, formatString: string, fallback: string = 'N/A'): string => {
    if (!dateString) return fallback;
    try {
        const date = parseISO(dateString);
        if (!isValid(date)) return fallback;
        return format(date, formatString);
    } catch {
        return fallback;
    }
};

const CancelBookingModal: React.FC<CancelBookingModalProps> = ({
    open,
    onClose,
    booking,
    onSuccess,
}) => {
    const [cancelBooking, { isLoading }] = useCancelBookingMutation();

    const [reason, setReason] = useState('');
    const [customReason, setCustomReason] = useState('');
    const [refundType, setRefundType] = useState<'full' | 'partial' | 'none'>('full');
    const [partialRefundAmount, setPartialRefundAmount] = useState('');
    const [notifyClient, setNotifyClient] = useState(true);
    const [notifyTasker, setNotifyTasker] = useState(true);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!booking) return;

        if (!reason) {
            setError('Please select a cancellation reason');
            return;
        }

        if (reason === 'other' && !customReason.trim()) {
            setError('Please provide a reason for cancellation');
            return;
        }

        if (refundType === 'partial' && (!partialRefundAmount || isNaN(Number(partialRefundAmount)))) {
            setError('Please enter a valid refund amount');
            return;
        }

        try {
            await cancelBooking({
                bookingId: booking._id,
                reason: reason === 'other' ? customReason : CANCELLATION_REASONS.find(r => r.value === reason)?.label || reason,
                refundType,
                customRefundAmount: refundType === 'partial' ? Number(partialRefundAmount) : undefined,
                notifyUsers: notifyClient || notifyTasker,
            }).unwrap();

            onSuccess();
            handleClose();
        } catch (err: any) {
            setError(err.data?.message || 'Failed to cancel booking');
        }
    };

    const handleClose = () => {
        setReason('');
        setCustomReason('');
        setRefundType('full');
        setPartialRefundAmount('');
        setNotifyClient(true);
        setNotifyTasker(true);
        setError('');
        onClose();
    };

    if (!open) return null;

    const paymentAmount = booking?.payment?.totalClientPays || booking?.totalAmount || 0;
    const isPaymentProcessed = booking?.payment?.status &&
        ['held', 'authorized', 'captured'].includes(booking.payment.status);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 bg-red-50">
                    <div className="p-2 bg-red-100 rounded-lg">
                        <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Cancel Booking
                        </h2>
                        <p className="text-sm text-gray-500">
                            This action cannot be undone
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="ml-auto p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {!booking ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <AlertTriangle className="w-12 h-12 text-gray-300 mb-3" />
                            <p className="text-gray-500">No booking selected</p>
                        </div>
                    ) : (
                        <>
                            {/* Booking Summary */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-gray-500 mb-3">Booking Summary</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Service</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {booking.service?.title || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">
                                            <Calendar className="w-4 h-4 inline mr-1" />
                                            Date
                                        </span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {safeFormatDate(booking.date, 'PPp')}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">
                                            <User className="w-4 h-4 inline mr-1" />
                                            Client
                                        </span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {booking.client?.firstName || ''} {booking.client?.lastName || ''}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">
                                            <DollarSign className="w-4 h-4 inline mr-1" />
                                            Amount
                                        </span>
                                        <span className="text-sm font-medium text-gray-900">
                                            ${paymentAmount.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                    <p className="text-sm">{error}</p>
                                </div>
                            )}

                            {/* Cancellation Reason */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cancellation Reason <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={reason}
                                    onChange={(e) => {
                                        setReason(e.target.value);
                                        setError('');
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    <option value="">Select a reason...</option>
                                    {CANCELLATION_REASONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {reason === 'other' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Please specify <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={customReason}
                                        onChange={(e) => setCustomReason(e.target.value)}
                                        rows={3}
                                        placeholder="Enter the reason for cancellation..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                                    />
                                </div>
                            )}

                            {/* Refund Options */}
                            {isPaymentProcessed && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Refund Option
                                    </label>
                                    <div className="space-y-2">
                                        {REFUND_OPTIONS.map((option) => (
                                            <label
                                                key={option.value}
                                                className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${refundType === option.value
                                                        ? 'border-red-500 bg-red-50'
                                                        : 'border-gray-200 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="refundType"
                                                    value={option.value}
                                                    checked={refundType === option.value}
                                                    onChange={(e) => setRefundType(e.target.value as typeof refundType)}
                                                    className="mt-0.5 text-red-600 focus:ring-red-500"
                                                />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {option.label}
                                                        {option.value === 'full' && (
                                                            <span className="ml-2 text-green-600">
                                                                (${paymentAmount.toFixed(2)})
                                                            </span>
                                                        )}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{option.description}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>

                                    {refundType === 'partial' && (
                                        <div className="mt-3">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Refund Amount
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                                <input
                                                    type="text"
                                                    value={partialRefundAmount}
                                                    onChange={(e) => setPartialRefundAmount(e.target.value)}
                                                    placeholder="0.00"
                                                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                                />
                                            </div>
                                            <p className="mt-1 text-xs text-gray-500">
                                                Max refundable: ${paymentAmount.toFixed(2)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Notification Options */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Notifications
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={notifyClient}
                                            onChange={(e) => setNotifyClient(e.target.checked)}
                                            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                        />
                                        <span className="text-sm text-gray-700">
                                            Notify client {booking.client?.email && `(${booking.client.email})`}
                                        </span>
                                    </label>
                                    <label className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={notifyTasker}
                                            onChange={(e) => setNotifyTasker(e.target.checked)}
                                            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                        />
                                        <span className="text-sm text-gray-700">
                                            Notify tasker {booking.tasker?.firstName && `(${booking.tasker.firstName} ${booking.tasker.lastName || ''})`}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Warning */}
                            <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-yellow-800">
                                    <p className="font-medium mb-1">Important:</p>
                                    <ul className="list-disc list-inside space-y-1 text-yellow-700">
                                        <li>This action will immediately cancel the booking</li>
                                        <li>The tasker's calendar slot will be released</li>
                                        {isPaymentProcessed && refundType !== 'none' && (
                                            <li>
                                                {refundType === 'full'
                                                    ? 'Full refund will be processed within 5-10 business days'
                                                    : `$${partialRefundAmount || '0'} will be refunded within 5-10 business days`
                                                }
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                    >
                        Keep Booking
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || !booking}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Cancelling...
                            </>
                        ) : (
                            <>
                                <XCircle className="w-4 h-4" />
                                Cancel Booking
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CancelBookingModal;