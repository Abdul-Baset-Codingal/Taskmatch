// components/admin/users/UsersStats.tsx
"use client";

import React from "react";
import {
    Users,
    UserCheck,
    UserX,
    ShieldCheck,
    DollarSign,
    Star,
    ClipboardList,
    Calendar
} from "lucide-react";

interface StatsProps {
    stats: {
        total: number;
        active: number;
        blocked: number;
        verified: number;
        totalEarnings: number;
        avgRating: number | string;
        totalTasksCompleted: number;
        totalBookingsCompleted: number;
    };
    roleType: string;
}

export default function AllUsersStat({ stats, roleType }: StatsProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-CA', {
            style: 'currency',
            currency: 'CAD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-CA').format(num);
    };

    const statCards = [
        {
            title: 'Total Users',
            value: formatNumber(stats.total),
            icon: Users,
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-700',
        },
        {
            title: 'Active Users',
            value: formatNumber(stats.active),
            icon: UserCheck,
            color: 'bg-green-500',
            bgColor: 'bg-green-50',
            textColor: 'text-green-700',
            percentage: stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : 0,
        },
        {
            title: 'Blocked Users',
            value: formatNumber(stats.blocked),
            icon: UserX,
            color: 'bg-red-500',
            bgColor: 'bg-red-50',
            textColor: 'text-red-700',
        },
        {
            title: 'Verified Users',
            value: formatNumber(stats.verified),
            icon: ShieldCheck,
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-700',
            percentage: stats.total > 0 ? ((stats.verified / stats.total) * 100).toFixed(1) : 0,
        },
    ];

    // Add role-specific stats
    if (roleType === 'tasker' || roleType === 'both' || roleType === 'all') {
        statCards.push(
            {
                title: 'Total Earnings',
                value: formatCurrency(stats.totalEarnings || 0),
                icon: DollarSign,
                color: 'bg-emerald-500',
                bgColor: 'bg-emerald-50',
                textColor: 'text-emerald-700',
            },
            {
                title: 'Avg Rating',
                value: typeof stats.avgRating === 'number' ? stats.avgRating.toFixed(1) : stats.avgRating || 'N/A',
                icon: Star,
                color: 'bg-yellow-500',
                bgColor: 'bg-yellow-50',
                textColor: 'text-yellow-700',
            }
        );
    }

    if (roleType === 'client' || roleType === 'both' || roleType === 'all') {
        statCards.push({
            title: 'Tasks Completed',
            value: formatNumber(stats.totalTasksCompleted || 0),
            icon: ClipboardList,
            color: 'bg-indigo-500',
            bgColor: 'bg-indigo-50',
            textColor: 'text-indigo-700',
        });
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat, index) => (
                <div
                    key={index}
                    className={`${stat.bgColor} rounded-lg p-4 border border-gray-100`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                            <p className={`text-2xl font-bold ${stat.textColor} mt-1`}>
                                {stat.value}
                            </p>
                            {stat.percentage !== undefined && (
                                <p className="text-xs text-gray-500 mt-1">
                                    {stat.percentage}% of total
                                </p>
                            )}
                        </div>
                        <div className={`${stat.color} p-3 rounded-lg`}>
                            <stat.icon className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}