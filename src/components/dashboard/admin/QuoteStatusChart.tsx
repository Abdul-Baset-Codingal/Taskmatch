// components/admin/dashboard/QuoteStatusChart.tsx
'use client';

import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface QuoteStatusChartProps {
    data: Record<string, number>;
    isLoading: boolean;
}

const statusColors: Record<string, string> = {
    pending: '#FCD34D',
    bidded: '#60A5FA',
    accepted: '#34D399',
    in_progress: '#A78BFA',
    completed: '#10B981',
    rejected: '#F87171',
    cancelled: '#9CA3AF',
    expired: '#6B7280',
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
};

export default function QuoteStatusChart({ data, isLoading }: QuoteStatusChartProps) {
    const labels = Object.keys(data).map(key => statusLabels[key] || key);
    const values = Object.values(data);
    const colors = Object.keys(data).map(key => statusColors[key] || '#9CA3AF');
    const total = values.reduce((sum, val) => sum + val, 0);

    const chartData = {
        labels,
        datasets: [
            {
                data: values,
                backgroundColor: colors,
                borderColor: colors.map(() => '#FFFFFF'),
                borderWidth: 2,
                hoverOffset: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
            legend: {
                position: 'right' as const,
                labels: {
                    usePointStyle: true,
                    padding: 15,
                    font: {
                        size: 12,
                    },
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: function (context: any) {
                        const value = context.raw;
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${context.label}: ${value} (${percentage}%)`;
                    },
                },
            },
        },
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="h-4 bg-gray-200 rounded w-32 mb-4 animate-pulse" />
                <div className="h-64 flex items-center justify-center">
                    <div className="w-48 h-48 bg-gray-100 rounded-full animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quote Status Distribution</h3>
            <div className="h-64 relative">
                <Doughnut data={chartData} options={options} />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-gray-900">{total}</p>
                        <p className="text-sm text-gray-500">Total</p>
                    </div>
                </div>
            </div>
        </div>
    );
}