// components/dashboard/admin/PaymentCardQuote.tsx
'use client';

import React, { useState } from 'react';
import {
    CreditCard,
    ExternalLink,
    RefreshCw,
    AlertTriangle,
    CheckCircle,
    Clock,
    XCircle,
    ChevronDown,
    ChevronUp,
    ArrowDownLeft,
    Loader2,
    Ban,
    Play,
} from 'lucide-react';
import { format } from 'date-fns';

// Match the schema's payment structure
interface PaymentDetails {
    status?: 'pending' | 'held' | 'authorized' | 'captured' | 'released' | 'refunded' | 'partial_refund' | 'failed' | 'cancelled';
    feeStructure?: string;

    // Bid amount
    bidAmount?: number;
    bidAmountCents?: number;

    // Client fees
    clientPlatformFee?: number;
    clientPlatformFeeCents?: number;
    reservationFee?: number;
    reservationFeeCents?: number;
    clientTax?: number;
    clientTaxCents?: number;
    totalClientPays?: number;
    totalClientPaysCents?: number;

    // Tasker fees
    taskerPlatformFee?: number;
    taskerPlatformFeeCents?: number;
    taskerTax?: number;
    taskerTaxCents?: number;
    taskerPayout?: number;
    taskerPayoutCents?: number;

    // Platform revenue
    applicationFee?: number;
    applicationFeeCents?: number;

    // Stripe IDs
    paymentIntentId?: string;
    transferId?: string;
    chargeId?: string;

    // Timestamps
    authorizedAt?: string;
    capturedAt?: string;
    releasedAt?: string;
    refundedAt?: string;
    cancelledAt?: string;

    // Refund details
    refundAmount?: number;
    refundAmountCents?: number;
    refundReason?: string;
    refundId?: string;

    currency?: string;
}

// Stripe details from the controller
interface StripePaymentDetails {
    id: string;
    status: string;
    amount: number;
    amountReceived?: number;
    currency: string;
    created: Date | string;
    captureMethod?: string;
    metadata?: Record<string, string>;
    charges?: string;
}

interface PaymentCardProps {
    payment?: PaymentDetails | null;
    stripeDetails?: StripePaymentDetails | null;
    quoteId: string;
    onRefresh: () => void;
    // Optional: for getting bid amount if not in payment
    acceptedBidAmount?: number;
}

// API base URL
const API_BASE =  '';

// Helper function for API calls
const apiCall = async (url: string, options: RequestInit = {}) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const response = await fetch(`${API_BASE}${url}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...options.headers,
        },
        credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Request failed');
    }

    return data;
};

export default function PaymentCardQuote({
    payment,
    stripeDetails,
    quoteId,
    onRefresh,
    acceptedBidAmount,
}: PaymentCardProps) {
    // Safe defaults - handle null/undefined payment
    const paymentData = payment || {};

    const [showStripeDetails, setShowStripeDetails] = useState(false);
    const [showFeeBreakdown, setShowFeeBreakdown] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [showCaptureModal, setShowCaptureModal] = useState(false);
    const [refundAmount, setRefundAmount] = useState('');
    const [refundReason, setRefundReason] = useState('');
    const [refundPercentage, setRefundPercentage] = useState<number>(100);
    const [error, setError] = useState<string | null>(null);

    // Get status icon based on payment status
    const getPaymentStatusIcon = (status?: string) => {
        switch (status) {
            case 'captured':
            case 'released':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'held':
            case 'authorized':
                return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'pending':
                return <Clock className="w-5 h-5 text-gray-500" />;
            case 'failed':
            case 'cancelled':
                return <XCircle className="w-5 h-5 text-red-500" />;
            case 'refunded':
                return <ArrowDownLeft className="w-5 h-5 text-purple-500" />;
            case 'partial_refund':
                return <ArrowDownLeft className="w-5 h-5 text-orange-500" />;
            default:
                return <CreditCard className="w-5 h-5 text-gray-500" />;
        }
    };

    // Get status color
    const getPaymentStatusColor = (status?: string) => {
        switch (status) {
            case 'captured':
            case 'released':
                return 'bg-green-100 text-green-800';
            case 'held':
            case 'authorized':
                return 'bg-yellow-100 text-yellow-800';
            case 'pending':
                return 'bg-gray-100 text-gray-800';
            case 'failed':
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'refunded':
                return 'bg-purple-100 text-purple-800';
            case 'partial_refund':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get human-readable status
    const getStatusLabel = (status?: string) => {
        const labels: Record<string, string> = {
            pending: 'Pending',
            held: 'Held (Authorized)',
            authorized: 'Authorized',
            captured: 'Captured',
            released: 'Released to Tasker',
            refunded: 'Refunded',
            partial_refund: 'Partially Refunded',
            failed: 'Failed',
            cancelled: 'Cancelled',
        };
        return labels[status || ''] || status || 'No Payment';
    };

    // Handle refund
    const handleRefund = async () => {
        if (!refundAmount || parseFloat(refundAmount) <= 0) {
            setError('Please enter a valid refund amount');
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            await apiCall(`/api/admin/quotes/${quoteId}/refund`, {
                method: 'POST',
                body: JSON.stringify({
                    refundAmount: parseFloat(refundAmount),
                    refundPercentage: refundPercentage,
                    reason: refundReason || 'Admin refund',
                }),
            });

            setShowRefundModal(false);
            setRefundAmount('');
            setRefundReason('');
            onRefresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to process refund');
        } finally {
            setIsProcessing(false);
        }
    };

    // Handle capture payment
    const handleCapturePayment = async () => {
        setIsProcessing(true);
        setError(null);

        try {
            await apiCall(`/api/admin/quotes/${quoteId}/capture`, {
                method: 'POST',
                body: JSON.stringify({
                    reason: 'Manual capture by admin',
                }),
            });

            setShowCaptureModal(false);
            onRefresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to capture payment');
        } finally {
            setIsProcessing(false);
        }
    };

    // Handle cancel held payment
    const handleCancelPayment = async () => {
        if (!confirm('Are you sure you want to cancel this payment? This will release the hold and refund the customer.')) {
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            await apiCall(`/api/admin/quotes/${quoteId}/refund`, {
                method: 'POST',
                body: JSON.stringify({
                    refundPercentage: 100,
                    reason: 'Payment cancelled by admin',
                }),
            });

            onRefresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to cancel payment');
        } finally {
            setIsProcessing(false);
        }
    };

    // Calculate values with fallbacks
    const bidAmount = paymentData.bidAmount || acceptedBidAmount || 0;
    const clientPlatformFee = paymentData.clientPlatformFee || 0;
    const reservationFee = paymentData.reservationFee || 0;
    const clientTax = paymentData.clientTax || 0;
    const totalClientPays = paymentData.totalClientPays || 0;
    const taskerPlatformFee = paymentData.taskerPlatformFee || 0;
    const taskerTax = paymentData.taskerTax || 0;
    const taskerPayout = paymentData.taskerPayout || 0;
    const applicationFee = paymentData.applicationFee || 0;

    // Check what actions are available
    const canCapture = paymentData.status === 'held' && paymentData.paymentIntentId;
    const canRefund = ['captured', 'released'].includes(paymentData.status || '') && paymentData.paymentIntentId;
    const canCancelHold = paymentData.status === 'held' && paymentData.paymentIntentId;
    const isRefunded = paymentData.status === 'refunded' || paymentData.status === 'partial_refund';

    // Check if there's any payment data
    const hasPaymentData = paymentData.paymentIntentId || bidAmount > 0 || paymentData.status;

    if (!hasPaymentData) {
        return (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <CreditCard className="w-5 h-5 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
                    </div>
                </div>
                <div className="p-6">
                    <div className="text-center py-8">
                        <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No payment information available</p>
                        <p className="text-sm text-gray-400 mt-1">Payment will appear here once a bid is accepted</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CreditCard className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(paymentData.status)}`}>
                            {getPaymentStatusIcon(paymentData.status)}
                            <span className="ml-1.5">{getStatusLabel(paymentData.status)}</span>
                        </span>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                {/* Payment Summary */}
                <div className="p-6 space-y-4">
                    {/* Client Side */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Client Payment</h4>

                        <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-gray-600">Bid Amount</span>
                            <span className="text-sm font-medium text-gray-900">
                                ${bidAmount.toFixed(2)}
                            </span>
                        </div>

                        {clientPlatformFee > 0 && (
                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm text-gray-600">Platform Fee (10%)</span>
                                <span className="text-sm font-medium text-gray-900">
                                    +${clientPlatformFee.toFixed(2)}
                                </span>
                            </div>
                        )}

                        {reservationFee > 0 && (
                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm text-gray-600">Reservation Fee</span>
                                <span className="text-sm font-medium text-gray-900">
                                    +${reservationFee.toFixed(2)}
                                </span>
                            </div>
                        )}

                        {clientTax > 0 && (
                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm text-gray-600">HST (13%)</span>
                                <span className="text-sm font-medium text-gray-900">
                                    +${clientTax.toFixed(2)}
                                </span>
                            </div>
                        )}

                        {totalClientPays > 0 && (
                            <div className="flex justify-between items-center py-3 border-t border-gray-100">
                                <span className="text-sm font-semibold text-gray-900">Total Client Pays</span>
                                <span className="text-lg font-bold text-green-600">
                                    ${totalClientPays.toFixed(2)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Tasker Side */}
                    {taskerPayout > 0 && (
                        <div className="border-t border-gray-200 pt-4 space-y-3">
                            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Tasker Payout</h4>

                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm text-gray-600">Bid Amount</span>
                                <span className="text-sm font-medium text-gray-900">
                                    ${bidAmount.toFixed(2)}
                                </span>
                            </div>

                            {taskerPlatformFee > 0 && (
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm text-gray-600">Platform Fee (12%)</span>
                                    <span className="text-sm font-medium text-red-600">
                                        -${taskerPlatformFee.toFixed(2)}
                                    </span>
                                </div>
                            )}

                            {taskerTax > 0 && (
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm text-gray-600">Tax Withholding (13%)</span>
                                    <span className="text-sm font-medium text-red-600">
                                        -${taskerTax.toFixed(2)}
                                    </span>
                                </div>
                            )}

                            <div className="flex justify-between items-center py-3 border-t border-gray-100">
                                <span className="text-sm font-semibold text-gray-900">Tasker Receives</span>
                                <span className="text-lg font-bold text-blue-600">
                                    ${taskerPayout.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Platform Revenue */}
                    {applicationFee > 0 && (
                        <div className="border-t border-gray-200 pt-4">
                            <button
                                onClick={() => setShowFeeBreakdown(!showFeeBreakdown)}
                                className="flex items-center justify-between w-full py-2 text-sm text-gray-600 hover:text-gray-900"
                            >
                                <span className="font-medium">Platform Revenue</span>
                                <div className="flex items-center space-x-2">
                                    <span className="font-bold text-purple-600">${applicationFee.toFixed(2)}</span>
                                    {showFeeBreakdown ? (
                                        <ChevronUp className="w-4 h-4" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4" />
                                    )}
                                </div>
                            </button>

                            {showFeeBreakdown && (
                                <div className="mt-2 p-3 bg-purple-50 rounded-lg space-y-2 text-sm">
                                    {clientPlatformFee > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-purple-700">Client Platform Fee</span>
                                            <span className="font-medium text-purple-900">${clientPlatformFee.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {reservationFee > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-purple-700">Reservation Fee</span>
                                            <span className="font-medium text-purple-900">${reservationFee.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {taskerPlatformFee > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-purple-700">Tasker Platform Fee</span>
                                            <span className="font-medium text-purple-900">${taskerPlatformFee.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between border-t border-purple-200 pt-2">
                                        <span className="font-medium text-purple-800">Total Platform Revenue</span>
                                        <span className="font-bold text-purple-900">${applicationFee.toFixed(2)}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Refund Info */}
                    {isRefunded && (
                        <div className="bg-purple-50 rounded-lg p-4 mt-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <ArrowDownLeft className="w-4 h-4 text-purple-600" />
                                <span className="text-sm font-medium text-purple-900">
                                    {paymentData.status === 'partial_refund' ? 'Partial Refund Issued' : 'Full Refund Issued'}
                                </span>
                            </div>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-purple-700">Amount Refunded</span>
                                    <span className="font-medium text-purple-900">
                                        ${(paymentData.refundAmount || 0).toFixed(2)}
                                    </span>
                                </div>
                                {paymentData.refundReason && (
                                    <div className="flex justify-between">
                                        <span className="text-purple-700">Reason</span>
                                        <span className="font-medium text-purple-900">{paymentData.refundReason}</span>
                                    </div>
                                )}
                                {paymentData.refundedAt && (
                                    <div className="flex justify-between">
                                        <span className="text-purple-700">Refunded At</span>
                                        <span className="font-medium text-purple-900">
                                            {format(new Date(paymentData.refundedAt), 'MMM d, yyyy h:mm a')}
                                        </span>
                                    </div>
                                )}
                                {paymentData.refundId && (
                                    <div className="flex justify-between">
                                        <span className="text-purple-700">Refund ID</span>
                                        <code className="text-xs bg-purple-100 px-2 py-0.5 rounded font-medium">
                                            {paymentData.refundId}
                                        </code>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Stripe Details Toggle */}
                    {(stripeDetails || paymentData.paymentIntentId) && (
                        <div className="mt-4">
                            <button
                                onClick={() => setShowStripeDetails(!showStripeDetails)}
                                className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <span className="text-sm font-medium text-gray-700">Stripe Details</span>
                                {showStripeDetails ? (
                                    <ChevronUp className="w-4 h-4 text-gray-500" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                )}
                            </button>

                            {showStripeDetails && (
                                <div className="mt-3 p-4 bg-gray-50 rounded-lg space-y-3 text-sm">
                                    {paymentData.paymentIntentId && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Payment Intent</span>
                                            <div className="flex items-center space-x-2">
                                                <code className="text-xs bg-gray-200 px-2 py-1 rounded truncate max-w-[180px]">
                                                    {paymentData.paymentIntentId}
                                                </code>
                                                <a
                                                    href={`https://dashboard.stripe.com/payments/${paymentData.paymentIntentId}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-700 flex-shrink-0"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {paymentData.transferId && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Transfer ID</span>
                                            <code className="text-xs bg-gray-200 px-2 py-1 rounded">
                                                {paymentData.transferId}
                                            </code>
                                        </div>
                                    )}

                                    {paymentData.chargeId && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Charge ID</span>
                                            <code className="text-xs bg-gray-200 px-2 py-1 rounded">
                                                {paymentData.chargeId}
                                            </code>
                                        </div>
                                    )}

                                    {stripeDetails && (
                                        <>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Stripe Status</span>
                                                <span className="font-medium capitalize">{stripeDetails.status}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Amount (Stripe)</span>
                                                <span className="font-medium">
                                                    ${(stripeDetails.amount / 100).toFixed(2)} {(stripeDetails.currency || 'cad').toUpperCase()}
                                                </span>
                                            </div>
                                            {stripeDetails.created && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Created</span>
                                                    <span className="font-medium">
                                                        {format(new Date(stripeDetails.created), 'MMM d, yyyy h:mm a')}
                                                    </span>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {paymentData.authorizedAt && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Authorized At</span>
                                            <span className="font-medium">
                                                {format(new Date(paymentData.authorizedAt), 'MMM d, yyyy h:mm a')}
                                            </span>
                                        </div>
                                    )}

                                    {paymentData.capturedAt && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Captured At</span>
                                            <span className="font-medium">
                                                {format(new Date(paymentData.capturedAt), 'MMM d, yyyy h:mm a')}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Currency</span>
                                        <span className="font-medium uppercase">{paymentData.currency || 'CAD'}</span>
                                    </div>

                                    {paymentData.feeStructure && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Fee Structure</span>
                                            <code className="text-xs bg-gray-200 px-2 py-1 rounded">
                                                {paymentData.feeStructure}
                                            </code>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-gray-100">
                        {/* Capture Payment */}
                        {canCapture && (
                            <button
                                onClick={() => setShowCaptureModal(true)}
                                disabled={isProcessing}
                                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                                <Play className="w-4 h-4 mr-2" />
                                Capture Payment
                            </button>
                        )}

                        {/* Cancel Held Payment */}
                        {canCancelHold && (
                            <button
                                onClick={handleCancelPayment}
                                disabled={isProcessing}
                                className="inline-flex items-center justify-center px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                            >
                                <Ban className="w-4 h-4 mr-2" />
                                Cancel Hold
                            </button>
                        )}

                        {/* Issue Refund */}
                        {canRefund && (
                            <button
                                onClick={() => setShowRefundModal(true)}
                                disabled={isProcessing}
                                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-50"
                            >
                                <ArrowDownLeft className="w-4 h-4 mr-2" />
                                Issue Refund
                            </button>
                        )}

                        {/* Refresh */}
                        <button
                            onClick={onRefresh}
                            disabled={isProcessing}
                            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Capture Modal */}
            {showCaptureModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Capture Payment</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-green-800">Ready to Capture</p>
                                        <p className="text-sm text-green-700 mt-1">
                                            This will capture ${totalClientPays.toFixed(2)} from the customer and
                                            mark the payment as complete.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Amount to Capture</span>
                                    <span className="font-medium">${totalClientPays.toFixed(2)}</span>
                                </div>
                                {taskerPayout > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Tasker Payout</span>
                                        <span className="font-medium">${taskerPayout.toFixed(2)}</span>
                                    </div>
                                )}
                                {applicationFee > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Platform Fee</span>
                                        <span className="font-medium">${applicationFee.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowCaptureModal(false)}
                                className="px-4 py-2 text-gray-700 hover:text-gray-900"
                                disabled={isProcessing}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCapturePayment}
                                disabled={isProcessing}
                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Capturing...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Capture Payment
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Refund Modal */}
            {showRefundModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Issue Refund</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-yellow-800">Refund Warning</p>
                                        <p className="text-sm text-yellow-700 mt-1">
                                            This action cannot be undone. The refund will be processed through Stripe.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Refund Percentages */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quick Select
                                </label>
                                <div className="flex space-x-2">
                                    {[25, 50, 75, 100].map((percent) => (
                                        <button
                                            key={percent}
                                            onClick={() => {
                                                setRefundPercentage(percent);
                                                setRefundAmount((totalClientPays * percent / 100).toFixed(2));
                                            }}
                                            className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${refundPercentage === percent
                                                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                                                    : 'border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            {percent}%
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Refund Amount (max: ${totalClientPays.toFixed(2)})
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        max={totalClientPays}
                                        value={refundAmount}
                                        onChange={(e) => {
                                            setRefundAmount(e.target.value);
                                            const amt = parseFloat(e.target.value) || 0;
                                            setRefundPercentage(totalClientPays > 0 ? Math.round((amt / totalClientPays) * 100) : 0);
                                        }}
                                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Reason for Refund
                                </label>
                                <select
                                    value={refundReason}
                                    onChange={(e) => setRefundReason(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                >
                                    <option value="">Select a reason</option>
                                    <option value="requested_by_customer">Requested by customer</option>
                                    <option value="duplicate">Duplicate payment</option>
                                    <option value="fraudulent">Fraudulent payment</option>
                                    <option value="service_not_provided">Service not provided</option>
                                    <option value="service_unsatisfactory">Service unsatisfactory</option>
                                    <option value="admin_decision">Admin decision</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            )}
                        </div>
                        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowRefundModal(false);
                                    setError(null);
                                }}
                                className="px-4 py-2 text-gray-700 hover:text-gray-900"
                                disabled={isProcessing}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRefund}
                                disabled={isProcessing || !refundAmount || parseFloat(refundAmount) <= 0}
                                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <ArrowDownLeft className="w-4 h-4 mr-2" />
                                        Refund ${refundAmount || '0.00'}
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