// @ts-nocheck
// components/admin/dashboard/StatsCards.tsx
'use client';

import React from 'react';
import {
    FileText,
    DollarSign,
    CheckCircle,
    Clock,
    TrendingUp,
    TrendingDown,
    AlertCircle,
} from 'lucide-react';
import { QuoteStatistics } from '@/types/admin';

interface StatsCardsProps {
    statistics?: QuoteStatistics;
    isLoading: boolean;
}

export default function StatsCards({ statistics, isLoading }: StatsCardsProps) {
    const cards = [
        {
            title: 'Total Quotes',
            value: statistics?.overview?.totalQuotes || 0,
            icon: FileText,
            color: 'blue',
            change: '+12%',
            changeType: 'increase' as const,
        },
        {
            title: 'Total Revenue',
            value: `$${(statistics?.revenue?.totalPlatformFee || 0).toLocaleString('en-CA', { minimumFractionDigits: 2 })}`,
            icon: DollarSign,
            color: 'green',
            change: '+8%',
            changeType: 'increase' as const,
        },
        {
            title: 'Completed',
            value: statistics?.overview?.statusBreakdown?.completed || 0,
            icon: CheckCircle,
            color: 'emerald',
            change: `${statistics?.conversions?.completionRate || 0}%`,
            changeType: 'neutral' as const,
            subtitle: 'completion rate',
        },
        {
            title: 'Pending Payments',
            value: statistics?.heldPayments?.count || 0,
            icon: Clock,
            color: 'yellow',
            change: `$${((statistics?.heldPayments?.totalHeldAmount || 0) / 100).toFixed(2)}`,
            changeType: 'neutral' as const,
            subtitle: 'held amount',
        },
    ];

    const colorClasses = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        emerald: 'bg-emerald-100 text-emerald-600',
        yellow: 'bg-yellow-100 text-yellow-600',
        red: 'bg-red-100 text-red-600',
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                        <div className="flex items-center justify-between">
                            <div className="h-4 bg-gray-200 rounded w-24" />
                            <div className="h-10 w-10 bg-gray-200 rounded-lg" />
                        </div>
                        <div className="mt-4 h-8 bg-gray-200 rounded w-32" />
                        <div className="mt-2 h-4 bg-gray-200 rounded w-20" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">{card.title}</span>
                        <div className={`p-2 rounded-lg ${colorClasses[card.color as keyof typeof colorClasses]}`}>
                            <card.icon className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <span className="text-2xl font-bold text-gray-900">{card.value}</span>
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                        {card.changeType === 'increase' && (
                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        )}
                        {card.changeType === 'decrease' && (
                            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                        )}
                        <span className={`font-medium ${card.changeType === 'increase' ? 'text-green-600' :
                                card.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                            }`}>
                            {card.change}
                        </span>
                        {card.subtitle && (
                            <span className="text-gray-500 ml-1">{card.subtitle}</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}