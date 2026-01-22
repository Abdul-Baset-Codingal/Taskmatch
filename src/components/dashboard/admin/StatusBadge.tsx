// components/admin/common/StatusBadge.tsx
'use client';

import React from 'react';
import { QuoteStatus, PaymentStatus } from '@/types/admin';

interface StatusBadgeProps {
    status: QuoteStatus | PaymentStatus | string;
    size?: 'sm' | 'md' | 'lg';
    type?: 'quote' | 'payment';
}

const quoteStatusStyles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    bidded: 'bg-blue-100 text-blue-800 border-blue-200',
    accepted: 'bg-green-100 text-green-800 border-green-200',
    in_progress: 'bg-purple-100 text-purple-800 border-purple-200',
    completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
    cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
    expired: 'bg-gray-100 text-gray-600 border-gray-200',
};

const paymentStatusStyles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    held: 'bg-orange-100 text-orange-800 border-orange-200',
    authorized: 'bg-blue-100 text-blue-800 border-blue-200',
    captured: 'bg-green-100 text-green-800 border-green-200',
    released: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    refunded: 'bg-purple-100 text-purple-800 border-purple-200',
    partial_refund: 'bg-purple-100 text-purple-800 border-purple-200',
    failed: 'bg-red-100 text-red-800 border-red-200',
    cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
};

const statusLabels: Record<string, string> = {
    pending: 'Pending',
    bidded: 'Bidded',
    accepted: 'Accepted',
    in_progress: 'In Progress',
    completed: 'Completed',
    rejected: 'Rejected',
    cancelled: 'Cancelled',
    expired: 'Expired',
    held: 'Held',
    authorized: 'Authorized',
    captured: 'Captured',
    released: 'Released',
    refunded: 'Refunded',
    partial_refund: 'Partial Refund',
    failed: 'Failed',
};

const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
};

export default function StatusBadge({ status, size = 'md', type = 'quote' }: StatusBadgeProps) {
    const styles = type === 'payment' ? paymentStatusStyles : quoteStatusStyles;
    const styleClass = styles[status] || 'bg-gray-100 text-gray-800 border-gray-200';

    return (
        <span className={`inline-flex items-center font-medium rounded-full border ${styleClass} ${sizeClasses[size]}`}>
            {statusLabels[status] || status}
        </span>
    );
}