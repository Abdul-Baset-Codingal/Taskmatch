// @ts-nocheck
// components/dashboard/admin/BookingDetailsModal.tsx
"use client"

import React from 'react';
import { format, parseISO, isValid } from 'date-fns';
import {
    X,
    Calendar,
    Clock,
    MapPin,
    User,
    Mail,
    Phone,
    DollarSign,
    FileText,
    Edit,
    MessageSquare,
    AlertCircle,
    CheckCircle,
    XCircle,
    ExternalLink,
    Copy,
    Star,
} from 'lucide-react';
import { useGetAdminBookingByIdQuery } from '@/features/api/adminBookingApi';

interface BookingDetailsModalProps {
    open: boolean;
    onClose: () => void;
    bookingId: string | null;
    onEdit: () => void;
}

// Helper function to safely format dates
const safeFormatDate = (dateString: string | undefined | null, formatString: string, fallback: string = 'N/A'): string => {
    if (!dateString) return fallback;

    try {
        const date = parseISO(dateString);
        if (!isValid(date)) return fallback;
        return format(date, formatString);
    } catch (error) {
        console.error('Date parsing error:', error);
        return fallback;
    }
};

// Status Configurations
const STATUS_CONFIG: Record<string, { color: string; bgColor: string; label: string; icon: React.ReactNode }> = {
    pending: {
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-100',
        label: 'Pending',
        icon: <AlertCircle className="w-4 h-4" />
    },
    confirmed: {
        color: 'text-blue-700',
        bgColor: 'bg-blue-100',
        label: 'Confirmed',
        icon: <CheckCircle className="w-4 h-4" />
    },
    in_progress: {
        color: 'text-indigo-700',
        bgColor: 'bg-indigo-100',
        label: 'In Progress',
        icon: <Clock className="w-4 h-4" />
    },
    completed: {
        color: 'text-green-700',
        bgColor: 'bg-green-100',
        label: 'Completed',
        icon: <CheckCircle className="w-4 h-4" />
    },
    cancelled: {
        color: 'text-red-700',
        bgColor: 'bg-red-100',
        label: 'Cancelled',
        icon: <XCircle className="w-4 h-4" />
    },
    no_show: {
        color: 'text-gray-700',
        bgColor: 'bg-gray-100',
        label: 'No Show',
        icon: <XCircle className="w-4 h-4" />
    },
};

const PAYMENT_STATUS_CONFIG: Record<string, { color: string; bgColor: string; label: string }> = {
    pending: { color: 'text-gray-700', bgColor: 'bg-gray-100', label: 'Pending' },
    held: { color: 'text-yellow-700', bgColor: 'bg-yellow-100', label: 'Held' },
    authorized: { color: 'text-blue-700', bgColor: 'bg-blue-100', label: 'Authorized' },
    captured: { color: 'text-green-700', bgColor: 'bg-green-100', label: 'Captured' },
    released: { color: 'text-green-700', bgColor: 'bg-green-100', label: 'Released' },
    refunded: { color: 'text-red-700', bgColor: 'bg-red-100', label: 'Refunded' },
    partial_refund: { color: 'text-yellow-700', bgColor: 'bg-yellow-100', label: 'Partial Refund' },
    failed: { color: 'text-red-700', bgColor: 'bg-red-100', label: 'Failed' },
    cancelled: { color: 'text-gray-700', bgColor: 'bg-gray-100', label: 'Cancelled' },
};

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
    open,
    onClose,
    bookingId,
    onEdit,
}) => {
    // Use the correct hook from adminBookingApi
    const { data, isLoading, error } = useGetAdminBookingByIdQuery(bookingId!, {
        skip: !bookingId || !open,
    });

    // Handle different response structures
    const booking = data?.data?.booking || data?.data || null;

    const handleCopyId = () => {
        if (booking?._id) {
            navigator.clipboard.writeText(booking._id);
        }
    };

    if (!open) return null;

    const statusConfig = booking?.status
        ? STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending
        : STATUS_CONFIG.pending;

    const paymentStatusConfig = booking?.payment?.status
        ? PAYMENT_STATUS_CONFIG[booking.payment.status] || PAYMENT_STATUS_CONFIG.pending
        : PAYMENT_STATUS_CONFIG.pending;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Booking Details
                        </h2>
                        {booking && (
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                                {statusConfig.icon}
                                {statusConfig.label}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onEdit}
                            disabled={!booking}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Edit className="w-4 h-4" />
                            Edit
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="space-y-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
                                    <div className="h-20 bg-gray-100 rounded-lg" />
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <AlertCircle className="w-12 h-12 text-red-400 mb-3" />
                            <p className="text-gray-600">Failed to load booking details</p>
                            <button
                                onClick={onClose}
                                className="mt-4 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg"
                            >
                                Close
                            </button>
                        </div>
                    ) : booking ? (
                        <div className="space-y-6">
                            {/* Booking ID */}
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>Booking ID:</span>
                                <code className="px-2 py-0.5 bg-gray-100 rounded font-mono text-gray-700">
                                    {booking._id}
                                </code>
                                <button
                                    onClick={handleCopyId}
                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                                    title="Copy ID"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Service Info */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                    Service Information
                                </h3>
                                <div className="flex items-start gap-4">
                                    <div className="flex-1">
                                        <h4 className="text-lg font-semibold text-gray-900">
                                            {booking.service?.title || 'N/A'}
                                        </h4>
                                        {booking.service?.description && (
                                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                {booking.service.description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-4 mt-2">
                                            {booking.service?.hourlyRate && (
                                                <span className="text-sm text-gray-600">
                                                    <strong>${booking.service.hourlyRate}</strong>/hr
                                                </span>
                                            )}
                                            {booking.service?.estimatedDuration && (
                                                <span className="text-sm text-gray-600">
                                                    Duration: <strong>{booking.service.estimatedDuration}</strong>
                                                </span>
                                            )}
                                            {booking.duration && (
                                                <span className="text-sm text-gray-600">
                                                    Booked: <strong>{booking.duration} hrs</strong>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Date & Time */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-blue-50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 text-blue-700 mb-2">
                                        <Calendar className="w-5 h-5" />
                                        <span className="font-medium">Date</span>
                                    </div>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {safeFormatDate(booking.date, 'EEEE, MMMM d, yyyy')}
                                    </p>
                                </div>
                                <div className="bg-indigo-50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 text-indigo-700 mb-2">
                                        <Clock className="w-5 h-5" />
                                        <span className="font-medium">Time</span>
                                    </div>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {safeFormatDate(booking.date, 'h:mm a')}
                                        {booking.endTime && (
                                            <span className="text-gray-500 font-normal">
                                                {' '}- {safeFormatDate(booking.endTime, 'h:mm a')}
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Location */}
                            {booking.location && (
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 text-gray-700 mb-2">
                                        <MapPin className="w-5 h-5" />
                                        <span className="font-medium">Location</span>
                                    </div>
                                    <p className="text-gray-900">
                                        {[
                                            booking.location.address,
                                            booking.location.city,
                                            booking.location.postalCode
                                        ].filter(Boolean).join(', ') || 'No address provided'}
                                    </p>
                                    {booking.location.notes && (
                                        <p className="text-sm text-gray-500 mt-2">
                                            <span className="font-medium">Notes:</span> {booking.location.notes}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Client & Tasker */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Client */}
                                <div className="border border-gray-200 rounded-xl p-4">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                        Client
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        {booking.client?.profilePicture ? (
                                            <img
                                                src={booking.client.profilePicture}
                                                alt={`${booking.client.firstName} ${booking.client.lastName}`}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                                <User className="w-6 h-6 text-gray-400" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900">
                                                {booking.client?.firstName || ''} {booking.client?.lastName || ''}
                                            </p>
                                            {booking.client?.email && (
                                                <p className="text-sm text-gray-500 flex items-center gap-1 truncate">
                                                    <Mail className="w-3 h-3 flex-shrink-0" />
                                                    <span className="truncate">{booking.client.email}</span>
                                                </p>
                                            )}
                                            {booking.client?.phone && (
                                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                                    <Phone className="w-3 h-3" />
                                                    {booking.client.phone}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Tasker */}
                                <div className="border border-gray-200 rounded-xl p-4">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                        Tasker
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        {booking.tasker?.profilePicture ? (
                                            <img
                                                src={booking.tasker.profilePicture}
                                                alt={`${booking.tasker.firstName} ${booking.tasker.lastName}`}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                                <User className="w-6 h-6 text-gray-400" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900">
                                                {booking.tasker?.firstName || ''} {booking.tasker?.lastName || ''}
                                            </p>
                                            {booking.tasker?.email && (
                                                <p className="text-sm text-gray-500 flex items-center gap-1 truncate">
                                                    <Mail className="w-3 h-3 flex-shrink-0" />
                                                    <span className="truncate">{booking.tasker.email}</span>
                                                </p>
                                            )}
                                            {booking.tasker?.rating !== undefined && (
                                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                    {booking.tasker.rating.toFixed(1)}
                                                    {booking.tasker.reviewCount !== undefined && (
                                                        <span className="text-gray-400">
                                                            ({booking.tasker.reviewCount} reviews)
                                                        </span>
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="bg-green-50 rounded-xl p-4">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4" />
                                    Payment Information
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Status</p>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${paymentStatusConfig.bgColor} ${paymentStatusConfig.color}`}>
                                            {paymentStatusConfig.label}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Service Amount</p>
                                        <p className="font-semibold text-gray-900">
                                            ${(booking.payment?.serviceAmount || booking.totalAmount || 0).toFixed(2)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Platform Fee</p>
                                        <p className="font-semibold text-gray-900">
                                            ${(booking.payment?.clientPlatformFee || booking.payment?.platformFee || 0).toFixed(2)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Total</p>
                                        <p className="text-lg font-bold text-green-700">
                                            ${(booking.payment?.totalClientPays || booking.totalAmount || 0).toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                {/* Additional Payment Details */}
                                {(booking.payment?.paymentIntentId || booking.paymentIntentId) && (
                                    <div className="mt-3 pt-3 border-t border-green-100">
                                        <p className="text-sm text-gray-500">
                                            Payment Intent:
                                            <code className="ml-2 text-gray-700 text-xs">
                                                {booking.payment?.paymentIntentId || booking.paymentIntentId}
                                            </code>
                                        </p>
                                    </div>
                                )}

                                {/* Tasker Payout Info */}
                                {booking.payment?.taskerPayout !== undefined && (
                                    <div className="mt-3 pt-3 border-t border-green-100">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Tasker Payout</p>
                                                <p className="font-semibold text-gray-900">
                                                    ${booking.payment.taskerPayout.toFixed(2)}
                                                </p>
                                            </div>
                                            {booking.payment?.taskerPlatformFee !== undefined && (
                                                <div>
                                                    <p className="text-sm text-gray-500">Tasker Fee</p>
                                                    <p className="font-semibold text-gray-900">
                                                        ${booking.payment.taskerPlatformFee.toFixed(2)}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Client Notes */}
                            {booking.clientNotes && (
                                <div className="border border-gray-200 rounded-xl p-4">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        Client Notes
                                    </h3>
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {booking.clientNotes}
                                    </p>
                                </div>
                            )}

                            {/* Tasker Notes */}
                            {booking.taskerNotes && (
                                <div className="border border-gray-200 rounded-xl p-4">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4" />
                                        Tasker Notes
                                    </h3>
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {booking.taskerNotes}
                                    </p>
                                </div>
                            )}

                            {/* Admin Notes */}
                            {booking.adminNotes && booking.adminNotes.length > 0 && (
                                <div className="border border-yellow-200 bg-yellow-50 rounded-xl p-4">
                                    <h3 className="text-sm font-semibold text-yellow-700 uppercase tracking-wider mb-2">
                                        Admin Notes
                                    </h3>
                                    <div className="space-y-2">
                                        {booking.adminNotes.map((note: any, index: number) => (
                                            <div key={note._id || index} className="bg-white rounded-lg p-3 border border-yellow-100">
                                                <p className="text-gray-700">{note.content}</p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {note.createdBy?.firstName} {note.createdBy?.lastName} • {safeFormatDate(note.createdAt, 'PPp')}
                                                    {note.isPrivate && <span className="ml-2 text-yellow-600">(Private)</span>}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Cancellation Info */}
                            {booking.status === 'cancelled' && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                    <h3 className="text-sm font-semibold text-red-700 uppercase tracking-wider mb-2">
                                        Cancellation Details
                                    </h3>
                                    <div className="space-y-2">
                                        {booking.cancelledBy && (
                                            <p className="text-sm">
                                                <span className="text-gray-500">Cancelled by:</span>{' '}
                                                <span className="text-gray-900 font-medium">
                                                    {booking.cancelledBy.firstName} {booking.cancelledBy.lastName}
                                                </span>
                                            </p>
                                        )}
                                        {booking.cancellationReason && (
                                            <p className="text-sm">
                                                <span className="text-gray-500">Reason:</span>{' '}
                                                <span className="text-gray-900">
                                                    {booking.cancellationReason}
                                                </span>
                                            </p>
                                        )}
                                        {booking.cancelledAt && (
                                            <p className="text-sm">
                                                <span className="text-gray-500">Date:</span>{' '}
                                                <span className="text-gray-900">
                                                    {safeFormatDate(booking.cancelledAt, 'PPpp')}
                                                </span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Refund Info */}
                            {booking.refund && booking.refund.status !== 'none' && (
                                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                                    <h3 className="text-sm font-semibold text-orange-700 uppercase tracking-wider mb-2">
                                        Refund Details
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Status</p>
                                            <p className="font-medium text-gray-900 capitalize">
                                                {booking.refund.status}
                                            </p>
                                        </div>
                                        {booking.refund.amount !== undefined && (
                                            <div>
                                                <p className="text-sm text-gray-500">Amount</p>
                                                <p className="font-medium text-gray-900">
                                                    ${booking.refund.amount.toFixed(2)}
                                                </p>
                                            </div>
                                        )}
                                        {booking.refund.reason && (
                                            <div className="col-span-2">
                                                <p className="text-sm text-gray-500">Reason</p>
                                                <p className="text-gray-900">{booking.refund.reason}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Reviews */}
                            {(booking.clientReview || booking.taskerReview) && (
                                <div className="border border-gray-200 rounded-xl p-4">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                        Reviews
                                    </h3>
                                    <div className="space-y-4">
                                        {booking.clientReview && (
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-medium text-gray-700">Client Review</span>
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                        <span className="text-sm font-semibold">{booking.clientReview.rating}</span>
                                                    </div>
                                                </div>
                                                {booking.clientReview.message && (
                                                    <p className="text-sm text-gray-600">{booking.clientReview.message}</p>
                                                )}
                                            </div>
                                        )}
                                        {booking.taskerReview && (
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-medium text-gray-700">Tasker Review</span>
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                        <span className="text-sm font-semibold">{booking.taskerReview.rating}</span>
                                                    </div>
                                                </div>
                                                {booking.taskerReview.message && (
                                                    <p className="text-sm text-gray-600">{booking.taskerReview.message}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Timestamps */}
                            <div className="text-sm text-gray-500 space-y-1 pt-4 border-t border-gray-100">
                                <p>
                                    Created: {safeFormatDate(booking.createdAt, 'PPpp')}
                                </p>
                                <p>
                                    Last Updated: {safeFormatDate(booking.updatedAt, 'PPpp')}
                                </p>
                                {booking.confirmedAt && (
                                    <p>
                                        Confirmed: {safeFormatDate(booking.confirmedAt, 'PPpp')}
                                    </p>
                                )}
                                {booking.startedAt && (
                                    <p>
                                        Started: {safeFormatDate(booking.startedAt, 'PPpp')}
                                    </p>
                                )}
                                {booking.completedAt && (
                                    <p>
                                        Completed: {safeFormatDate(booking.completedAt, 'PPpp')}
                                    </p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                            <AlertCircle className="w-12 h-12 text-gray-300 mb-3" />
                            <p className="text-gray-500">No booking data available</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingDetailsModal;