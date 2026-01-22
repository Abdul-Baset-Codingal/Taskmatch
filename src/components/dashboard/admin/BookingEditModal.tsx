// components/dashboard/admin/BookingEditModal.tsx
"use client"

import React, { useState, useEffect } from 'react';
import { format, parseISO, isValid } from 'date-fns';
import {
    X,
    Save,
    AlertCircle,
    Calendar,
    Clock,
    MapPin,
    FileText,
    DollarSign,
} from 'lucide-react';
import { useUpdateAdminBookingMutation } from '@/features/api/adminBookingApi';

interface Booking {
    _id: string;
    status: string;
    date: string;
    duration?: number;
    totalAmount?: number;
    clientNotes?: string;
    taskerNotes?: string;
    location?: {
        address?: string;
        city?: string;
        postalCode?: string;
        notes?: string;
    };
    payment?: {
        status: string;
        serviceFee?: number;
        platformFee?: number;
        totalClientPays?: number;
    };
    service?: {
        title?: string;
    };
    client?: {
        firstName?: string;
        lastName?: string;
    };
    tasker?: {
        firstName?: string;
        lastName?: string;
    };
}

interface BookingEditModalProps {
    open: boolean;
    onClose: () => void;
    booking: Booking | null;
    onSuccess: () => void;
}

const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'no_show', label: 'No Show' },
];

const PAYMENT_STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending' },
    { value: 'held', label: 'Held' },
    { value: 'authorized', label: 'Authorized' },
    { value: 'captured', label: 'Captured' },
    { value: 'released', label: 'Released' },
    { value: 'refunded', label: 'Refunded' },
    { value: 'partial_refund', label: 'Partial Refund' },
    { value: 'failed', label: 'Failed' },
    { value: 'cancelled', label: 'Cancelled' },
];

// Safe date parsing helper
const safeParseDateToString = (dateString: string | undefined | null, formatStr: string, fallback: string = ''): string => {
    if (!dateString) return fallback;
    try {
        const date = parseISO(dateString);
        if (!isValid(date)) return fallback;
        return format(date, formatStr);
    } catch {
        return fallback;
    }
};

const BookingEditModal: React.FC<BookingEditModalProps> = ({
    open,
    onClose,
    booking,
    onSuccess,
}) => {
    const [updateBooking, { isLoading }] = useUpdateAdminBookingMutation();
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        status: '',
        date: '',
        time: '',
        duration: '',
        clientNotes: '',
        taskerNotes: '',
        paymentStatus: '',
        totalAmount: '',
        address: '',
        city: '',
        postalCode: '',
        locationNotes: '',
    });

    useEffect(() => {
        if (booking && open) {
            setFormData({
                status: booking.status || '',
                date: safeParseDateToString(booking.date, 'yyyy-MM-dd'),
                time: safeParseDateToString(booking.date, 'HH:mm'),
                duration: booking.duration?.toString() || '',
                clientNotes: booking.clientNotes || '',
                taskerNotes: booking.taskerNotes || '',
                paymentStatus: booking.payment?.status || 'pending',
                totalAmount: (booking.payment?.totalClientPays || booking.totalAmount)?.toString() || '',
                address: booking.location?.address || '',
                city: booking.location?.city || '',
                postalCode: booking.location?.postalCode || '',
                locationNotes: booking.location?.notes || '',
            });
            setErrors({});
        }
    }, [booking, open]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.status) {
            newErrors.status = 'Status is required';
        }
        if (!formData.date) {
            newErrors.date = 'Date is required';
        }
        if (!formData.time) {
            newErrors.time = 'Time is required';
        }
        if (formData.totalAmount && isNaN(Number(formData.totalAmount))) {
            newErrors.totalAmount = 'Invalid amount';
        }
        if (formData.duration && isNaN(Number(formData.duration))) {
            newErrors.duration = 'Invalid duration';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate() || !booking) return;

        try {
            const dateTime = new Date(`${formData.date}T${formData.time}`);

            await updateBooking({
                bookingId: booking._id,
                updateData: {
                    status: formData.status as any,
                    date: dateTime.toISOString(),
                    duration: formData.duration ? Number(formData.duration) : undefined,
                    clientNotes: formData.clientNotes || undefined,
                    taskerNotes: formData.taskerNotes || undefined,
                    totalAmount: formData.totalAmount ? Number(formData.totalAmount) : undefined,
                    location: {
                        address: formData.address || undefined,
                        city: formData.city || undefined,
                        postalCode: formData.postalCode || undefined,
                        notes: formData.locationNotes || undefined,
                    },
                },
            }).unwrap();

            onSuccess();
            onClose();
        } catch (error: any) {
            setErrors({
                submit: error.data?.message || 'Failed to update booking',
            });
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Edit Booking
                        </h2>
                        {booking && (
                            <p className="text-sm text-gray-500 mt-0.5">
                                {booking.service?.title || 'Service'} • {booking.client?.firstName} {booking.client?.lastName}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-6">
                        {/* Error Banner */}
                        {errors.submit && (
                            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="text-sm">{errors.submit}</p>
                            </div>
                        )}

                        {!booking ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <AlertCircle className="w-12 h-12 text-gray-300 mb-3" />
                                <p className="text-gray-500">No booking selected</p>
                            </div>
                        ) : (
                            <>
                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Booking Status
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.status ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    >
                                        <option value="">Select status...</option>
                                        {STATUS_OPTIONS.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.status && (
                                        <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                                    )}
                                </div>

                                {/* Date & Time */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Calendar className="w-4 h-4 inline mr-1" />
                                            Date
                                        </label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.date ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.date && (
                                            <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Clock className="w-4 h-4 inline mr-1" />
                                            Time
                                        </label>
                                        <input
                                            type="time"
                                            name="time"
                                            value={formData.time}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.time ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.time && (
                                            <p className="mt-1 text-sm text-red-600">{errors.time}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Duration (hours)
                                        </label>
                                        <input
                                            type="number"
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleChange}
                                            min="0.5"
                                            step="0.5"
                                            placeholder="e.g., 2"
                                            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.duration ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.duration && (
                                            <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <MapPin className="w-4 h-4 inline mr-1" />
                                        Location
                                    </label>
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="Street address"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                placeholder="City"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                            <input
                                                type="text"
                                                name="postalCode"
                                                value={formData.postalCode}
                                                onChange={handleChange}
                                                placeholder="Postal Code"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            name="locationNotes"
                                            value={formData.locationNotes}
                                            onChange={handleChange}
                                            placeholder="Location notes (e.g., buzzer code, parking instructions)"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>

                                {/* Payment */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <DollarSign className="w-4 h-4 inline mr-1" />
                                            Payment Status
                                        </label>
                                        <select
                                            name="paymentStatus"
                                            value={formData.paymentStatus}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            disabled
                                        >
                                            {PAYMENT_STATUS_OPTIONS.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="mt-1 text-xs text-gray-500">
                                            Payment status changes require separate actions
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Total Amount
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                            <input
                                                type="text"
                                                name="totalAmount"
                                                value={formData.totalAmount}
                                                onChange={handleChange}
                                                placeholder="0.00"
                                                className={`w-full pl-8 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.totalAmount ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                            />
                                        </div>
                                        {errors.totalAmount && (
                                            <p className="mt-1 text-sm text-red-600">{errors.totalAmount}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Client Notes */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FileText className="w-4 h-4 inline mr-1" />
                                        Client Notes
                                    </label>
                                    <textarea
                                        name="clientNotes"
                                        value={formData.clientNotes}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Notes from the client"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                    />
                                </div>

                                {/* Tasker Notes */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tasker Notes
                                    </label>
                                    <textarea
                                        name="taskerNotes"
                                        value={formData.taskerNotes}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Notes from/for the tasker"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </form>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || !booking}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingEditModal;