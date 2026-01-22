// components/admin/bookings/BookingStatsCards.tsx
"use client"

import React from 'react';
import {
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Users,
    AlertCircle,
} from 'lucide-react';

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

interface BookingStatsCardsProps {
    stats?: BookingStats | null; // Make stats optional
}

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    trend?: {
        value: number;
        label: string;
    };
    color: 'blue' | 'green' | 'yellow' | 'red' | 'indigo' | 'purple' | 'gray';
}

// Default stats for when data is undefined/null
const defaultStats: BookingStats = {
    total: 0,
    pending: 0,
    confirmed: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
    noShow: 0,
    totalRevenue: 0,
    averageValue: 0,
    todayBookings: 0,
    weeklyGrowth: undefined,
    monthlyGrowth: undefined,
};

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    subtitle,
    icon,
    trend,
    color,
}) => {
    const colorStyles = {
        blue: {
            bg: 'bg-blue-50',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            border: 'border-blue-100',
        },
        green: {
            bg: 'bg-green-50',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
            border: 'border-green-100',
        },
        yellow: {
            bg: 'bg-yellow-50',
            iconBg: 'bg-yellow-100',
            iconColor: 'text-yellow-600',
            border: 'border-yellow-100',
        },
        red: {
            bg: 'bg-red-50',
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
            border: 'border-red-100',
        },
        indigo: {
            bg: 'bg-indigo-50',
            iconBg: 'bg-indigo-100',
            iconColor: 'text-indigo-600',
            border: 'border-indigo-100',
        },
        purple: {
            bg: 'bg-purple-50',
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
            border: 'border-purple-100',
        },
        gray: {
            bg: 'bg-gray-50',
            iconBg: 'bg-gray-100',
            iconColor: 'text-gray-600',
            border: 'border-gray-100',
        },
    };

    const styles = colorStyles[color];

    return (
        <div className={`${styles.bg} rounded-xl p-4 border ${styles.border}`}>
            <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg ${styles.iconBg}`}>
                    <div className={styles.iconColor}>{icon}</div>
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${trend.value >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {trend.value >= 0 ? (
                            <TrendingUp className="w-4 h-4" />
                        ) : (
                            <TrendingDown className="w-4 h-4" />
                        )}
                        <span>{Math.abs(trend.value)}%</span>
                    </div>
                )}
            </div>
            <div className="mt-3">
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm font-medium text-gray-600 mt-1">{title}</p>
                {subtitle && (
                    <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
                )}
            </div>
        </div>
    );
};

const BookingStatsCards: React.FC<BookingStatsCardsProps> = ({ stats: propStats }) => {
    // Merge with defaults to ensure all values exist
    const stats: BookingStats = {
        ...defaultStats,
        ...propStats,
    };

    const formatCurrency = (amount: number | undefined | null) => {
        const safeAmount = amount ?? 0;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(safeAmount);
    };

    const formatNumber = (num: number | undefined | null) => {
        // Handle undefined/null values
        if (num === undefined || num === null) {
            return '0';
        }
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };

    return (
        <div className="mb-6">
            {/* Primary Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
                <StatCard
                    title="Total Bookings"
                    value={formatNumber(stats.total)}
                    icon={<Calendar className="w-5 h-5" />}
                    color="indigo"
                    trend={stats.monthlyGrowth !== undefined ? {
                        value: stats.monthlyGrowth,
                        label: 'vs last month'
                    } : undefined}
                />
                <StatCard
                    title="Today's Bookings"
                    value={stats.todayBookings ?? 0}
                    subtitle="Scheduled for today"
                    icon={<Clock className="w-5 h-5" />}
                    color="blue"
                />
                <StatCard
                    title="Pending"
                    value={stats.pending ?? 0}
                    subtitle="Awaiting confirmation"
                    icon={<AlertCircle className="w-5 h-5" />}
                    color="yellow"
                />
                <StatCard
                    title="In Progress"
                    value={stats.inProgress ?? 0}
                    subtitle="Currently active"
                    icon={<Users className="w-5 h-5" />}
                    color="purple"
                />
                <StatCard
                    title="Completed"
                    value={stats.completed ?? 0}
                    subtitle="Successfully finished"
                    icon={<CheckCircle className="w-5 h-5" />}
                    color="green"
                />
                <StatCard
                    title="Cancelled"
                    value={stats.cancelled ?? 0}
                    subtitle={(stats.noShow ?? 0) > 0 ? `${stats.noShow} no-shows` : undefined}
                    icon={<XCircle className="w-5 h-5" />}
                    color="red"
                />
            </div>

            {/* Revenue Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white">
                    <div className="flex items-center justify-between">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        {stats.weeklyGrowth !== undefined && (
                            <div className={`flex items-center gap-1 text-sm font-medium ${stats.weeklyGrowth >= 0 ? 'text-green-200' : 'text-red-200'
                                }`}>
                                {stats.weeklyGrowth >= 0 ? (
                                    <TrendingUp className="w-4 h-4" />
                                ) : (
                                    <TrendingDown className="w-4 h-4" />
                                )}
                                <span>{Math.abs(stats.weeklyGrowth)}% this week</span>
                            </div>
                        )}
                    </div>
                    <div className="mt-4">
                        <p className="text-3xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
                        <p className="text-indigo-100 mt-1">Total Revenue</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(stats.averageValue)}
                            </p>
                            <p className="text-sm text-gray-600">Average Booking Value</p>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Completion Rate</span>
                            <span className="font-semibold text-gray-900">
                                {(stats.total ?? 0) > 0
                                    ? (((stats.completed ?? 0) / stats.total) * 100).toFixed(1)
                                    : 0}%
                            </span>
                        </div>
                        <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-500 rounded-full transition-all duration-500"
                                style={{
                                    width: `${(stats.total ?? 0) > 0
                                        ? ((stats.completed ?? 0) / stats.total) * 100
                                        : 0}%`
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-600 mb-4">Booking Status Distribution</h4>
                    <div className="space-y-3">
                        {[
                            { label: 'Confirmed', value: stats.confirmed ?? 0, color: 'bg-blue-500' },
                            { label: 'In Progress', value: stats.inProgress ?? 0, color: 'bg-purple-500' },
                            { label: 'Pending', value: stats.pending ?? 0, color: 'bg-yellow-500' },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                                <span className="text-sm text-gray-600 flex-1">{item.label}</span>
                                <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                                <span className="text-xs text-gray-400 w-12 text-right">
                                    {(stats.total ?? 0) > 0
                                        ? ((item.value / stats.total) * 100).toFixed(0)
                                        : 0}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingStatsCards;