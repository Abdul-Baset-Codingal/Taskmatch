// @ts-nocheck
"use client"
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import {
    Search,
    RefreshCw,
    Trash2,
    Edit,
    Eye,
    Download,
    MoreVertical,
    XCircle,
    CheckCircle,
    Calendar,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    X,
    AlertCircle,
    Check,
    Info,
    AlertTriangle,
} from 'lucide-react';
import { useBulkDeleteBookingsMutation, useBulkUpdateStatusMutation, useGetAdminBookingsQuery, useLazyExportBookingsQuery, useDeleteBookingMutation } from '@/features/api/adminBookingApi';

import BookingDetailsModal from '@/components/dashboard/admin/BookingDetailsModal';
import BookingEditModal from '@/components/dashboard/admin/BookingEditModal';
import CancelBookingModal from '@/components/dashboard/admin/CancelBookingModal';
import BookingStatsCards from '@/components/dashboard/admin/BookingStatsCards';

// ==================== TYPE DEFINITIONS ====================
interface Booking {
    _id: string;
    tasker: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        rating: number;
        profilePicture?: string;
    };
    client: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        profilePicture?: string;
    };
    service: {
        title: string;
        description: string;
        hourlyRate: number;
        estimatedDuration: string;
    };
    date: string;
    duration: number;
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
    payment?: {
        paymentIntentId: string;
        status: string;
        totalClientPays: number;
        taskerPayout?: number;
        platformFee?: number;
    };
    totalAmount: number;
    paymentIntentId?: string;
    createdAt: string;
    updatedAt: string;
}

interface ApiStats {
    _id: null;
    totalRevenue: number;
    platformFees: number;
    taskerPayouts: number;
    avgBookingValue: number;
    count: number;
}

interface BookingStats {
    total: number;
    pending: number;
    confirmed: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    noShow: number;
    totalRevenue: number;
    averageValue: number;
    todayBookings: number;
    weeklyGrowth?: number;
    monthlyGrowth?: number;
}

interface SnackbarState {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
}

interface ContextMenuState {
    x: number;
    y: number;
    booking: Booking | null;
}

interface QueryParams {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    paymentStatus?: string;
    dateRange?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

// ==================== API STATS TRANSFORM FUNCTION ====================
const transformStats = (
    apiStats: ApiStats | null | undefined,
    bookings: Booking[],
    totalItems: number
): BookingStats => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Count statuses from current page bookings
    const statusCounts = bookings.reduce((acc, booking) => {
        const status = booking.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Count today's bookings
    const todayBookings = bookings.filter(b => {
        const bookingDate = new Date(b.date);
        bookingDate.setHours(0, 0, 0, 0);
        return bookingDate.getTime() === today.getTime();
    }).length;

    return {
        total: apiStats?.count || totalItems || 0,
        pending: statusCounts['pending'] || 0,
        confirmed: statusCounts['confirmed'] || 0,
        inProgress: statusCounts['in_progress'] || 0,
        completed: statusCounts['completed'] || 0,
        cancelled: statusCounts['cancelled'] || 0,
        noShow: statusCounts['no_show'] || 0,
        totalRevenue: apiStats?.totalRevenue || 0,
        averageValue: apiStats?.avgBookingValue || 0,
        todayBookings: todayBookings,
        weeklyGrowth: undefined,
        monthlyGrowth: undefined,
    };
};

// ==================== CONFIG ====================
const STATUS_CONFIG: Record<string, { color: string; bgColor: string; label: string }> = {
    pending: { color: 'text-yellow-700', bgColor: 'bg-yellow-100', label: 'Pending' },
    confirmed: { color: 'text-blue-700', bgColor: 'bg-blue-100', label: 'Confirmed' },
    in_progress: { color: 'text-indigo-700', bgColor: 'bg-indigo-100', label: 'In Progress' },
    completed: { color: 'text-green-700', bgColor: 'bg-green-100', label: 'Completed' },
    cancelled: { color: 'text-red-700', bgColor: 'bg-red-100', label: 'Cancelled' },
    no_show: { color: 'text-gray-700', bgColor: 'bg-gray-100', label: 'No Show' },
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

// ==================== REUSABLE COMPONENTS ====================

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
        secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
        outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500',
        ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm gap-1.5',
        md: 'px-4 py-2 text-sm gap-2',
        lg: 'px-6 py-3 text-base gap-2',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            ) : icon}
            {children}
        </button>
    );
};

// Badge/Chip Component
interface BadgeProps {
    children: React.ReactNode;
    color?: string;
    bgColor?: string;
    variant?: 'filled' | 'outline';
    size?: 'sm' | 'md';
    onDelete?: () => void;
}

const Badge: React.FC<BadgeProps> = ({
    children,
    color = 'text-gray-700',
    bgColor = 'bg-gray-100',
    variant = 'filled',
    size = 'md',
    onDelete,
}) => {
    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
    };

    const variantStyles = variant === 'outline'
        ? `border ${color.replace('text-', 'border-')} bg-transparent`
        : bgColor;

    return (
        <span className={`inline-flex items-center gap-1 font-medium rounded-full ${sizes[size]} ${color} ${variantStyles}`}>
            {children}
            {onDelete && (
                <button
                    onClick={onDelete}
                    className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                >
                    <X className="w-3 h-3" />
                </button>
            )}
        </span>
    );
};

// Select Component
interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    label?: string;
    className?: string;
}

const Select: React.FC<SelectProps> = ({
    value,
    onChange,
    options,
    placeholder = 'Select...',
    label,
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div ref={ref} className={`relative ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
                <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
                    {selectedOption?.label || placeholder}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-50 flex items-center justify-between
                                ${option.value === value ? 'bg-indigo-50 text-indigo-600' : 'text-gray-900'}`}
                        >
                            {option.label}
                            {option.value === value && <Check className="w-4 h-4" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: React.ReactNode;
    error?: string;
}

const Input: React.FC<InputProps> = ({
    label,
    icon,
    error,
    className = '',
    ...props
}) => {
    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        {icon}
                    </div>
                )}
                <input
                    className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                        disabled:bg-gray-50 disabled:text-gray-500
                        ${icon ? 'pl-10' : ''}
                        ${error ? 'border-red-500' : ''}`}
                    {...props}
                />
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

// Date Picker Component (Simple version)
interface DatePickerProps {
    value: Date | null;
    onChange: (date: Date | null) => void;
    label?: string;
    placeholder?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
    value,
    onChange,
    label,
    placeholder = 'Select date',
}) => {
    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    type="date"
                    value={value ? format(value, 'yyyy-MM-dd') : ''}
                    onChange={(e) => onChange(e.target.value ? new Date(e.target.value) : null)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder={placeholder}
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
        </div>
    );
};

// Toast/Snackbar Component
interface ToastProps {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ open, message, severity, onClose }) => {
    useEffect(() => {
        if (open) {
            const timer = setTimeout(onClose, 6000);
            return () => clearTimeout(timer);
        }
    }, [open, onClose]);

    if (!open) return null;

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        error: <AlertCircle className="w-5 h-5 text-red-500" />,
        warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />,
    };

    const bgColors = {
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
        warning: 'bg-yellow-50 border-yellow-200',
        info: 'bg-blue-50 border-blue-200',
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${bgColors[severity]}`}>
                {icons[severity]}
                <p className="text-sm font-medium text-gray-900">{message}</p>
                <button onClick={onClose} className="ml-2 text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

// Confirm Dialog Component
interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    confirmText?: string;
    confirmVariant?: 'primary' | 'danger';
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    title,
    message,
    confirmText = 'Confirm',
    confirmVariant = 'primary',
    onConfirm,
    onCancel,
    loading = false,
}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={onCancel} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        variant={confirmVariant === 'danger' ? 'danger' : 'primary'}
                        onClick={onConfirm}
                        loading={loading}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

// Context Menu Component
interface ContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
    children: React.ReactNode;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, children }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div
            ref={ref}
            className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-[180px]"
            style={{ top: y, left: x }}
        >
            {children}
        </div>
    );
};

interface MenuItemProps {
    icon?: React.ReactNode;
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    danger?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, children, onClick, disabled, danger }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
            ${danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'}`}
    >
        {icon}
        {children}
    </button>
);

const MenuDivider = () => <div className="my-1 border-t border-gray-100" />;

// Checkbox Component
interface CheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    indeterminate?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, indeterminate }) => {
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (ref.current) {
            ref.current.indeterminate = indeterminate || false;
        }
    }, [indeterminate]);

    return (
        <input
            ref={ref}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
        />
    );
};

// Tooltip Component
interface TooltipProps {
    content: string;
    children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
    const [show, setShow] = useState(false);

    return (
        <div className="relative inline-block">
            <div
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
            >
                {children}
            </div>
            {show && (
                <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap">
                    {content}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                </div>
            )}
        </div>
    );
};

// Skeleton Component
const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// Icon Button Component
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    size?: 'sm' | 'md';
}

const IconButton: React.FC<IconButtonProps> = ({
    children,
    size = 'md',
    className = '',
    ...props
}) => {
    const sizes = {
        sm: 'p-1',
        md: 'p-2',
    };

    return (
        <button
            className={`inline-flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

// ==================== MAIN COMPONENT ====================
const AdminBookingsPage: React.FC = () => {
    // ==================== STATE ====================
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('');
    const [dateRange, setDateRange] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [sortField, setSortField] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

    // Modals
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    // Snackbar
    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: '',
        severity: 'info',
    });

    // Context Menu
    const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

    // ==================== API QUERIES ====================
    const queryParams: QueryParams = useMemo(() => ({
        page: page + 1,
        limit: pageSize,
        search: debouncedSearch || undefined,
        status: statusFilter || undefined,
        paymentStatus: paymentStatusFilter || undefined,
        dateRange: dateRange || undefined,
        startDate: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
        endDate: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
        sortBy: sortField,
        sortOrder,
    }), [page, pageSize, debouncedSearch, statusFilter, paymentStatusFilter, dateRange, startDate, endDate, sortField, sortOrder]);

    const {
        data: bookingsData,
        isLoading,
        isFetching,
        refetch,
        error,
    } = useGetAdminBookingsQuery(queryParams);

    const [deleteBooking, { isLoading: isDeleting }] = useDeleteBookingMutation();
    const [bulkDeleteBookings, { isLoading: isBulkDeleting }] = useBulkDeleteBookingsMutation();
    const [bulkUpdateStatus, { isLoading: isBulkUpdating }] = useBulkUpdateStatusMutation();
    const [triggerExport, { isLoading: isExporting }] = useLazyExportBookingsQuery();

    // ==================== DATA EXTRACTION ====================
    const bookings: Booking[] = bookingsData?.data?.bookings || [];
    const pagination = bookingsData?.data?.pagination;
    const totalItems = pagination?.totalItems || 0;
    const totalPages = pagination?.totalPages || 0;
    const apiStats: ApiStats | null | undefined = bookingsData?.data?.stats;

    // ==================== TRANSFORM STATS ====================
    const transformedStats: BookingStats | null = useMemo(() => {
        if (!bookingsData?.data) return null;
        return transformStats(apiStats, bookings, totalItems);
    }, [apiStats, bookings, totalItems, bookingsData?.data]);

    // ==================== DEBOUNCED SEARCH ====================
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(0);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // ==================== DEBUG EFFECT ====================
    useEffect(() => {
        if (bookingsData) {
            console.log('Full bookingsData:', bookingsData);
            console.log('API Stats:', apiStats);
            console.log('Transformed Stats:', transformedStats);
        }
    }, [bookingsData, apiStats, transformedStats]);

    // ==================== HANDLERS ====================
    const showSnackbar = useCallback((message: string, severity: SnackbarState['severity']) => {
        setSnackbar({ open: true, message, severity });
    }, []);

    const handleViewDetails = useCallback((booking: Booking) => {
        setSelectedBooking(booking);
        setDetailsModalOpen(true);
        setContextMenu(null);
    }, []);

    const handleEdit = useCallback((booking: Booking) => {
        setSelectedBooking(booking);
        setEditModalOpen(true);
        setContextMenu(null);
    }, []);

    const handleCancelBooking = useCallback((booking: Booking) => {
        setSelectedBooking(booking);
        setCancelModalOpen(true);
        setContextMenu(null);
    }, []);

    const handleDeleteClick = useCallback((booking: Booking) => {
        setSelectedBooking(booking);
        setDeleteConfirmOpen(true);
        setContextMenu(null);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (!selectedBooking) return;

        try {
            await deleteBooking({
                bookingId: selectedBooking._id,
                reason: 'Deleted by admin',
            }).unwrap();

            showSnackbar('Booking deleted successfully', 'success');
            setDeleteConfirmOpen(false);
            setSelectedBooking(null);
        } catch (error: any) {
            showSnackbar(error.data?.message || 'Failed to delete booking', 'error');
        }
    }, [selectedBooking, deleteBooking, showSnackbar]);

    const handleBulkDelete = useCallback(async () => {
        if (selectedRows.length === 0) return;

        try {
            await bulkDeleteBookings({
                bookingIds: selectedRows,
                reason: 'Bulk deleted by admin',
            }).unwrap();

            showSnackbar(`${selectedRows.length} bookings deleted successfully`, 'success');
            setSelectedRows([]);
        } catch (error: any) {
            showSnackbar(error.data?.message || 'Failed to delete bookings', 'error');
        }
    }, [selectedRows, bulkDeleteBookings, showSnackbar]);

    const handleBulkStatusUpdate = useCallback(async (status: string) => {
        if (selectedRows.length === 0) return;

        try {
            await bulkUpdateStatus({
                bookingIds: selectedRows,
                status,
                notifyUsers: true,
            }).unwrap();

            showSnackbar(`${selectedRows.length} bookings updated to ${status}`, 'success');
            setSelectedRows([]);
        } catch (error: any) {
            showSnackbar(error.data?.message || 'Failed to update bookings', 'error');
        }
    }, [selectedRows, bulkUpdateStatus, showSnackbar]);

    const handleExport = useCallback(async (exportFormat: 'json' | 'csv') => {
        try {
            const result = await triggerExport({
                format: exportFormat,
                status: statusFilter || undefined,
                startDate: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
                endDate: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
            }).unwrap();

            const mimeType = exportFormat === 'csv' ? 'text/csv' : 'application/json';
            const content = exportFormat === 'csv' ? result : JSON.stringify(result, null, 2);
            const blob = new Blob([content], { type: mimeType });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `bookings-export-${Date.now()}.${exportFormat}`;
            a.click();
            window.URL.revokeObjectURL(url);

            showSnackbar('Export completed', 'success');
        } catch {
            showSnackbar('Export failed', 'error');
        }
    }, [triggerExport, statusFilter, startDate, endDate, showSnackbar]);

    const handleContextMenu = useCallback((event: React.MouseEvent, booking: Booking) => {
        event.preventDefault();
        setContextMenu({
            x: event.clientX,
            y: event.clientY,
            booking,
        });
    }, []);

    // ==================== SAFE DATE HELPER ====================
    const safeFormatDate = (dateString: string | undefined | null, formatStr: string, fallback: string = 'N/A'): string => {
        if (!dateString) return fallback;
        try {
            const date = parseISO(dateString);
            if (isNaN(date.getTime())) return fallback;
            return format(date, formatStr);
        } catch {
            return fallback;
        }
    };

    const safeParseDate = (dateString: string | undefined | null): Date | null => {
        if (!dateString) return null;
        try {
            const date = parseISO(dateString);
            if (isNaN(date.getTime())) return null;
            return date;
        } catch {
            return null;
        }
    };

    const handleResetFilters = useCallback(() => {
        setSearch('');
        setDebouncedSearch('');
        setStatusFilter('');
        setPaymentStatusFilter('');
        setDateRange('');
        setStartDate(null);
        setEndDate(null);
        setPage(0);
    }, []);

    const handleSelectAll = useCallback((checked: boolean) => {
        if (checked) {
            setSelectedRows(bookings.map((b) => b._id));
        } else {
            setSelectedRows([]);
        }
    }, [bookings]);

    const handleSelectRow = useCallback((id: string, checked: boolean) => {
        if (checked) {
            setSelectedRows((prev) => [...prev, id]);
        } else {
            setSelectedRows((prev) => prev.filter((rowId) => rowId !== id));
        }
    }, []);

    const handleSort = useCallback((field: string) => {
        if (sortField === field) {
            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    }, [sortField]);

    // ==================== SELECT OPTIONS ====================
    const statusOptions: SelectOption[] = [
        { value: '', label: 'All Statuses' },
        ...Object.entries(STATUS_CONFIG).map(([key, { label }]) => ({
            value: key,
            label,
        })),
    ];

    const paymentStatusOptions: SelectOption[] = [
        { value: '', label: 'All Payments' },
        ...Object.entries(PAYMENT_STATUS_CONFIG).map(([key, { label }]) => ({
            value: key,
            label,
        })),
    ];

    const dateRangeOptions: SelectOption[] = [
        { value: '', label: 'All Time' },
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' },
        { value: 'year', label: 'This Year' },
    ];

    const pageSizeOptions: SelectOption[] = [
        { value: '10', label: '10 per page' },
        { value: '20', label: '20 per page' },
        { value: '50', label: '50 per page' },
        { value: '100', label: '100 per page' },
    ];

    // ==================== RENDER ====================
    if (error) {
        return (
            <div className="p-6">
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    <AlertCircle className="w-5 h-5" />
                    <p>Failed to load bookings. Please try again.</p>
                </div>
            </div>
        );
    }

    const hasActiveFilters = statusFilter || paymentStatusFilter || dateRange || startDate || endDate || debouncedSearch;
    const allSelected = bookings.length > 0 && selectedRows.length === bookings.length;
    const someSelected = selectedRows.length > 0 && selectedRows.length < bookings.length;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        icon={<Download className="w-4 h-4" />}
                        onClick={() => handleExport('csv')}
                        loading={isExporting}
                    >
                        Export CSV
                    </Button>
                    <Button
                        variant="outline"
                        icon={<RefreshCw className="w-4 h-4" />}
                        onClick={() => refetch()}
                        loading={isFetching}
                    >
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            {transformedStats && (
                <BookingStatsCards stats={transformedStats} />
            )}

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                    <div className="lg:col-span-2">
                        <Input
                            placeholder="Search bookings..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            icon={<Search className="w-4 h-4" />}
                        />
                    </div>
                    <Select
                        value={statusFilter}
                        onChange={(value) => {
                            setStatusFilter(value);
                            setPage(0);
                        }}
                        options={statusOptions}
                        placeholder="Status"
                    />
                    <Select
                        value={paymentStatusFilter}
                        onChange={(value) => {
                            setPaymentStatusFilter(value);
                            setPage(0);
                        }}
                        options={paymentStatusOptions}
                        placeholder="Payment"
                    />
                    <DatePicker
                        value={startDate}
                        onChange={(date) => {
                            setStartDate(date);
                            setDateRange('');
                            setPage(0);
                        }}
                        label=""
                        placeholder="From"
                    />
                    <DatePicker
                        value={endDate}
                        onChange={(date) => {
                            setEndDate(date);
                            setDateRange('');
                            setPage(0);
                        }}
                        label=""
                        placeholder="To"
                    />
                </div>

                {/* Active Filters */}
                {hasActiveFilters && (
                    <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-500">Active filters:</span>
                        {debouncedSearch && (
                            <Badge
                                size="sm"
                                onDelete={() => {
                                    setSearch('');
                                    setDebouncedSearch('');
                                }}
                            >
                                Search: {debouncedSearch}
                            </Badge>
                        )}
                        {statusFilter && (
                            <Badge
                                size="sm"
                                color={STATUS_CONFIG[statusFilter]?.color}
                                bgColor={STATUS_CONFIG[statusFilter]?.bgColor}
                                onDelete={() => setStatusFilter('')}
                            >
                                Status: {STATUS_CONFIG[statusFilter]?.label}
                            </Badge>
                        )}
                        {paymentStatusFilter && (
                            <Badge
                                size="sm"
                                color={PAYMENT_STATUS_CONFIG[paymentStatusFilter]?.color}
                                bgColor={PAYMENT_STATUS_CONFIG[paymentStatusFilter]?.bgColor}
                                onDelete={() => setPaymentStatusFilter('')}
                            >
                                Payment: {PAYMENT_STATUS_CONFIG[paymentStatusFilter]?.label}
                            </Badge>
                        )}
                        {dateRange && (
                            <Badge size="sm" onDelete={() => setDateRange('')}>
                                Date: {dateRange}
                            </Badge>
                        )}
                        {(startDate || endDate) && (
                            <Badge
                                size="sm"
                                onDelete={() => {
                                    setStartDate(null);
                                    setEndDate(null);
                                }}
                            >
                                {startDate && format(startDate, 'MMM d')}
                                {startDate && endDate && ' - '}
                                {endDate && format(endDate, 'MMM d')}
                            </Badge>
                        )}
                        <button
                            onClick={handleResetFilters}
                            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                            Clear All
                        </button>
                    </div>
                )}
            </div>

            {/* Bulk Actions */}
            {selectedRows.length > 0 && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-indigo-900">
                        {selectedRows.length} booking(s) selected
                    </span>
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            icon={<CheckCircle className="w-4 h-4 text-green-600" />}
                            onClick={() => handleBulkStatusUpdate('completed')}
                            loading={isBulkUpdating}
                        >
                            Mark Completed
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            icon={<XCircle className="w-4 h-4 text-yellow-600" />}
                            onClick={() => handleBulkStatusUpdate('cancelled')}
                            loading={isBulkUpdating}
                        >
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            variant="danger"
                            icon={<Trash2 className="w-4 h-4" />}
                            onClick={handleBulkDelete}
                            loading={isBulkDeleting}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            )}

            {/* Data Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-4 py-3 text-left">
                                    <Checkbox
                                        checked={allSelected}
                                        indeterminate={someSelected}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th
                                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                                    onClick={() => handleSort('service.title')}
                                >
                                    <div className="flex items-center gap-1">
                                        Service
                                        {sortField === 'service.title' && (
                                            <ChevronDown className={`w-4 h-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                                        )}
                                    </div>
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Client
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Tasker
                                </th>
                                <th
                                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                                    onClick={() => handleSort('date')}
                                >
                                    <div className="flex items-center gap-1">
                                        Date
                                        {sortField === 'date' && (
                                            <ChevronDown className={`w-4 h-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                                        )}
                                    </div>
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Payment
                                </th>
                                <th
                                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                                    onClick={() => handleSort('createdAt')}
                                >
                                    <div className="flex items-center gap-1">
                                        Created
                                        {sortField === 'createdAt' && (
                                            <ChevronDown className={`w-4 h-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                                        )}
                                    </div>
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                // Loading Skeleton
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-4 py-4"><Skeleton className="w-4 h-4" /></td>
                                        <td className="px-4 py-4"><Skeleton className="w-16 h-4" /></td>
                                        <td className="px-4 py-4">
                                            <Skeleton className="w-32 h-4 mb-1" />
                                            <Skeleton className="w-24 h-3" />
                                        </td>
                                        <td className="px-4 py-4">
                                            <Skeleton className="w-24 h-4 mb-1" />
                                            <Skeleton className="w-32 h-3" />
                                        </td>
                                        <td className="px-4 py-4">
                                            <Skeleton className="w-24 h-4 mb-1" />
                                            <Skeleton className="w-32 h-3" />
                                        </td>
                                        <td className="px-4 py-4">
                                            <Skeleton className="w-20 h-4 mb-1" />
                                            <Skeleton className="w-16 h-3" />
                                        </td>
                                        <td className="px-4 py-4"><Skeleton className="w-20 h-6 rounded-full" /></td>
                                        <td className="px-4 py-4">
                                            <Skeleton className="w-16 h-4 mb-1" />
                                            <Skeleton className="w-14 h-5 rounded-full" />
                                        </td>
                                        <td className="px-4 py-4"><Skeleton className="w-20 h-4" /></td>
                                        <td className="px-4 py-4"><Skeleton className="w-20 h-8" /></td>
                                    </tr>
                                ))
                            ) : bookings.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="px-4 py-12 text-center">
                                        <div className="flex flex-col items-center">
                                            <Calendar className="w-12 h-12 text-gray-300 mb-3" />
                                            <p className="text-gray-500 font-medium">No bookings found</p>
                                            <p className="text-gray-400 text-sm">Try adjusting your filters</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                bookings.map((booking) => {
                                    const statusConfig = STATUS_CONFIG[booking.status] || {
                                        color: 'text-gray-700',
                                        bgColor: 'bg-gray-100',
                                        label: booking.status,
                                    };
                                    const paymentStatus = booking.payment?.status || 'pending';
                                    const paymentConfig = PAYMENT_STATUS_CONFIG[paymentStatus] || {
                                        color: 'text-gray-700',
                                        bgColor: 'bg-gray-100',
                                        label: paymentStatus,
                                    };
                                    const amount = booking.payment?.totalClientPays || booking.totalAmount || 0;

                                    return (
                                        <tr
                                            key={booking._id}
                                            className={`hover:bg-gray-50 transition-colors ${selectedRows.includes(booking._id) ? 'bg-indigo-50' : ''
                                                }`}
                                            onContextMenu={(e) => handleContextMenu(e, booking)}
                                        >
                                            <td className="px-4 py-4">
                                                <Checkbox
                                                    checked={selectedRows.includes(booking._id)}
                                                    onChange={(checked) => handleSelectRow(booking._id, checked)}
                                                />
                                            </td>
                                            <td className="px-4 py-4">
                                                <Tooltip content={booking._id}>
                                                    <span className="text-sm font-mono text-gray-500">
                                                        {booking._id.slice(-8)}
                                                    </span>
                                                </Tooltip>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                                                        {booking.service?.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        ${booking.service?.hourlyRate}/hr • {booking.service?.estimatedDuration}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center">
                                                    {booking.client?.profilePicture ? (
                                                        <img
                                                            src={booking.client.profilePicture}
                                                            alt="Client"
                                                            className="w-8 h-8 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-medium">
                                                            {booking.client?.firstName?.[0]}
                                                            {booking.client?.lastName?.[0]}
                                                        </div>
                                                    )}

                                                    <div className="ml-2">
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {booking.client?.firstName} {booking.client?.lastName}
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate max-w-[150px]">
                                                            {booking.client?.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="flex items-center">
                                                    {booking.tasker?.profilePicture ? (
                                                        <img
                                                            src={booking.tasker.profilePicture}
                                                            alt="Tasker"
                                                            className="w-8 h-8 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs font-medium">
                                                            {booking.tasker?.firstName?.[0]}
                                                            {booking.tasker?.lastName?.[0]}
                                                        </div>
                                                    )}

                                                    <div className="ml-2">
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {booking.tasker?.firstName} {booking.tasker?.lastName}
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate max-w-[150px]">
                                                            {booking.tasker?.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4">
                                                <div>
                                                    <p className="text-sm text-gray-900">
                                                        {safeFormatDate(booking.date, 'MMM d, yyyy')}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {safeFormatDate(booking.date, 'h:mm a')}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <Badge
                                                    color={statusConfig.color}
                                                    bgColor={statusConfig.bgColor}
                                                    size="sm"
                                                >
                                                    {statusConfig.label}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        ${amount.toFixed(2)}
                                                    </p>
                                                    <Badge
                                                        color={paymentConfig.color}
                                                        bgColor={paymentConfig.bgColor}
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        {paymentConfig.label}
                                                    </Badge>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <p className="text-sm text-gray-500">
                                                    {format(parseISO(booking.createdAt), 'MMM d, yyyy')}
                                                </p>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Tooltip content="View Details">
                                                        <IconButton
                                                            size="sm"
                                                            onClick={() => handleViewDetails(booking)}
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip content="Edit">
                                                        <IconButton
                                                            size="sm"
                                                            onClick={() => handleEdit(booking)}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip content="More Actions">
                                                        <IconButton
                                                            size="sm"
                                                            onClick={(e) => handleContextMenu(e as unknown as React.MouseEvent, booking)}
                                                        >
                                                            <MoreVertical className="w-4 h-4" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-4">
                        <Select
                            value={String(pageSize)}
                            onChange={(value) => {
                                setPageSize(Number(value));
                                setPage(0);
                            }}
                            options={pageSizeOptions}
                            className="w-36"
                        />
                        <span className="text-sm text-gray-500">
                            Showing {page * pageSize + 1} to {Math.min((page + 1) * pageSize, totalItems)} of {totalItems} results
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                            disabled={page === 0}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </Button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum: number;
                                if (totalPages <= 5) {
                                    pageNum = i;
                                } else if (page < 3) {
                                    pageNum = i;
                                } else if (page > totalPages - 4) {
                                    pageNum = totalPages - 5 + i;
                                } else {
                                    pageNum = page - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setPage(pageNum)}
                                        className={`w-8 h-8 text-sm font-medium rounded-lg transition-colors
                                            ${page === pageNum
                                                ? 'bg-emerald-600 text-white'
                                                : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        {pageNum + 1}
                                    </button>
                                );
                            })}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                            disabled={page >= totalPages - 1}
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Context Menu */}
            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onClose={() => setContextMenu(null)}
                >
                    <MenuItem
                        icon={<Eye className="w-4 h-4" />}
                        onClick={() => contextMenu.booking && handleViewDetails(contextMenu.booking)}
                    >
                        View Details
                    </MenuItem>
                    <MenuItem
                        icon={<Edit className="w-4 h-4" />}
                        onClick={() => contextMenu.booking && handleEdit(contextMenu.booking)}
                    >
                        Edit
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem
                        icon={<XCircle className="w-4 h-4 text-yellow-500" />}
                        onClick={() => contextMenu.booking && handleCancelBooking(contextMenu.booking)}
                        disabled={contextMenu.booking?.status === 'cancelled'}
                    >
                        Cancel Booking
                    </MenuItem>
                    <MenuItem
                        icon={<Trash2 className="w-4 h-4" />}
                        onClick={() => contextMenu.booking && handleDeleteClick(contextMenu.booking)}
                        danger
                    >
                        Delete
                    </MenuItem>
                </ContextMenu>
            )}

            {/* Modals */}
            <BookingDetailsModal
                open={detailsModalOpen}
                onClose={() => {
                    setDetailsModalOpen(false);
                    setSelectedBooking(null);
                }}
                bookingId={selectedBooking?._id || null}
                onEdit={() => {
                    setDetailsModalOpen(false);
                    setEditModalOpen(true);
                }}
            />

            <BookingEditModal
                open={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false);
                    setSelectedBooking(null);
                }}
                booking={selectedBooking}
                onSuccess={() => {
                    showSnackbar('Booking updated successfully', 'success');
                }}
            />

            <CancelBookingModal
                open={cancelModalOpen}
                onClose={() => {
                    setCancelModalOpen(false);
                    setSelectedBooking(null);
                }}
                booking={selectedBooking}
                onSuccess={() => {
                    showSnackbar('Booking cancelled successfully', 'success');
                }}
            />

            <ConfirmDialog
                open={deleteConfirmOpen}
                title="Delete Booking"
                message="Are you sure you want to delete this booking? This action cannot be undone."
                confirmText="Delete"
                confirmVariant="danger"
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                    setDeleteConfirmOpen(false);
                    setSelectedBooking(null);
                }}
                loading={isDeleting}
            />

            {/* Toast */}
            <Toast
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            />

            {/* Animation Styles */}
            <style>{`
                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default AdminBookingsPage;