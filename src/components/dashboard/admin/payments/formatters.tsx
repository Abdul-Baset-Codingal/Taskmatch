// components/admin/payments/utils/formatters.ts

/**
 * Format a number as currency (CAD - Canadian Dollars)
 * @param amount - Amount in dollars
 */
export const formatCurrency = (amount: number): string => {
    if (amount === null || amount === undefined || isNaN(amount)) {
        return '$0.00';
    }
    return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

/**
 * Format currency without decimal places (for whole dollar display)
 * @param amount - Amount in dollars
 */
export const formatCurrencyWhole = (amount: number): string => {
    if (amount === null || amount === undefined || isNaN(amount)) {
        return '$0';
    }
    return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

/**
 * Format currency with CAD suffix for clarity
 * @param amount - Amount in dollars
 */
export const formatCurrencyWithCode = (amount: number): string => {
    if (amount === null || amount === undefined || isNaN(amount)) {
        return 'CA$0.00';
    }
    return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        currencyDisplay: 'symbol',
    }).format(amount) + ' CAD';
};

/**
 * Format a date string to a readable format
 */
export const formatDate = (date: string | Date | number | undefined): string => {
    if (!date) return 'N/A';

    try {
        const dateObj = typeof date === 'number'
            ? new Date(date * 1000) // Unix timestamp
            : new Date(date);

        return new Intl.DateTimeFormat('en-CA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(dateObj);
    } catch {
        return 'Invalid date';
    }
};

/**
 * Format a date string to include time
 */
export const formatDateTime = (date: string | Date | number | undefined): string => {
    if (!date) return 'N/A';

    try {
        const dateObj = typeof date === 'number'
            ? new Date(date * 1000)
            : new Date(date);

        return new Intl.DateTimeFormat('en-CA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        }).format(dateObj);
    } catch {
        return 'Invalid date';
    }
};

/**
 * Format a date to relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: string | Date | number | undefined): string => {
    if (!date) return 'N/A';

    try {
        const dateObj = typeof date === 'number'
            ? new Date(date * 1000)
            : new Date(date);

        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

        return formatDate(date);
    } catch {
        return 'Invalid date';
    }
};

/**
 * Get CSS classes for transaction status badge
 */
export const getStatusColor = (status: string): string => {
    const statusColors: Record<string, string> = {
        // Transaction statuses
        'completed': 'bg-green-100 text-green-800',
        'paid': 'bg-green-100 text-green-800',
        'succeeded': 'bg-green-100 text-green-800',
        'active': 'bg-green-100 text-green-800',

        'pending': 'bg-yellow-100 text-yellow-800',
        'processing': 'bg-yellow-100 text-yellow-800',
        'in-progress': 'bg-blue-100 text-blue-800',
        'in_progress': 'bg-blue-100 text-blue-800',
        'assigned': 'bg-blue-100 text-blue-800',

        'cancelled': 'bg-red-100 text-red-800',
        'canceled': 'bg-red-100 text-red-800',
        'failed': 'bg-red-100 text-red-800',
        'declined': 'bg-red-100 text-red-800',
        'expired': 'bg-red-100 text-red-800',

        'refunded': 'bg-purple-100 text-purple-800',
        'partially_refunded': 'bg-purple-100 text-purple-800',

        'open': 'bg-blue-100 text-blue-800',
        'draft': 'bg-gray-100 text-gray-800',
        'closed': 'bg-gray-100 text-gray-800',
    };

    return statusColors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

/**
 * Get CSS classes for payment status badge
 */
export const getPaymentStatusColor = (status: string | undefined): string => {
    if (!status) return 'bg-gray-100 text-gray-800';

    const paymentStatusColors: Record<string, string> = {
        'paid': 'bg-green-100 text-green-800',
        'succeeded': 'bg-green-100 text-green-800',
        'captured': 'bg-green-100 text-green-800',

        'pending': 'bg-yellow-100 text-yellow-800',
        'processing': 'bg-yellow-100 text-yellow-800',
        'requires_payment_method': 'bg-yellow-100 text-yellow-800',
        'requires_confirmation': 'bg-yellow-100 text-yellow-800',
        'requires_action': 'bg-orange-100 text-orange-800',

        'failed': 'bg-red-100 text-red-800',
        'canceled': 'bg-red-100 text-red-800',
        'cancelled': 'bg-red-100 text-red-800',

        'refunded': 'bg-purple-100 text-purple-800',
        'partially_refunded': 'bg-purple-100 text-purple-800',

        'unpaid': 'bg-gray-100 text-gray-800',
        'not_required': 'bg-gray-100 text-gray-800',
    };

    return paymentStatusColors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

/**
 * Get CSS classes for payout status badge
 */
export const getPayoutStatusColor = (status: string): string => {
    const payoutStatusColors: Record<string, string> = {
        'paid': 'bg-green-100 text-green-800',
        'completed': 'bg-green-100 text-green-800',

        'pending': 'bg-yellow-100 text-yellow-800',
        'in_transit': 'bg-blue-100 text-blue-800',

        'failed': 'bg-red-100 text-red-800',
        'canceled': 'bg-red-100 text-red-800',
    };

    return payoutStatusColors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

/**
 * Format a percentage
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
    if (value === null || value === undefined || isNaN(value)) {
        return '0%';
    }
    return `${value.toFixed(decimals)}%`;
};

/**
 * Format a number with commas (Canadian style)
 */
export const formatNumber = (value: number): string => {
    if (value === null || value === undefined || isNaN(value)) {
        return '0';
    }
    return new Intl.NumberFormat('en-CA').format(value);
};

/**
 * Truncate a string with ellipsis
 */
export const truncateString = (str: string, maxLength: number = 20): string => {
    if (!str) return '';
    if (str.length <= maxLength) return str;
    return `${str.slice(0, maxLength)}...`;
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (str: string): string => {
    if (!str) return '';
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

/**
 * Convert snake_case or kebab-case to readable format
 */
export const formatStatusLabel = (status: string): string => {
    if (!status) return '';
    return status
        .replace(/_/g, ' ')
        .replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

/**
 * Parse currency string to number
 * Handles formats like "$1,234.56", "1234.56", "$1,234"
 */
export const parseCurrency = (value: string): number => {
    if (!value) return 0;
    // Remove currency symbols, commas, and spaces
    const cleaned = value.replace(/[$,\s]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
};

/**
 * Format currency for input fields (no symbol, just number)
 */
export const formatCurrencyInput = (amount: number): string => {
    if (amount === null || amount === undefined || isNaN(amount)) {
        return '0.00';
    }
    return amount.toFixed(2);
};

/**
 * Format compact currency for large numbers (e.g., $1.2K, $3.4M)
 */
export const formatCurrencyCompact = (amount: number): string => {
    if (amount === null || amount === undefined || isNaN(amount)) {
        return '$0';
    }

    if (amount >= 1000000) {
        return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
        return `$${(amount / 1000).toFixed(1)}K`;
    }
    return formatCurrency(amount);
};