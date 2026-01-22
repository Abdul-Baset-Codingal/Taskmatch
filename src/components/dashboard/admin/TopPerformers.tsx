// components/admin/dashboard/TopPerformers.tsx
'use client';

import React, { useState } from 'react';
import { TopPerformer } from '@/types/admin';
import { Trophy, TrendingUp } from 'lucide-react';

interface TopPerformersProps {
    taskers: TopPerformer[];
    clients: TopPerformer[];
    isLoading: boolean;
}

export default function TopPerformers({ taskers, clients, isLoading }: TopPerformersProps) {
    const [activeTab, setActiveTab] = useState<'taskers' | 'clients'>('taskers');

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="h-5 bg-gray-200 rounded w-32 mb-4 animate-pulse" />
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center animate-pulse">
                            <div className="w-8 h-8 bg-gray-200 rounded-full" />
                            <div className="ml-3 flex-1">
                                <div className="h-4 bg-gray-200 rounded w-24" />
                                <div className="h-3 bg-gray-200 rounded w-16 mt-1" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const data = activeTab === 'taskers' ? taskers : clients;

    return (
        <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
                        Top Performers
                    </h3>
                </div>
                <div className="flex mt-4 space-x-1">
                    <button
                        onClick={() => setActiveTab('taskers')}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'taskers'
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        Taskers
                    </button>
                    <button
                        onClick={() => setActiveTab('clients')}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'clients'
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        Clients
                    </button>
                </div>
            </div>
            <div className="p-4">
                {data.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No data available</p>
                ) : (
                    <div className="space-y-3">
                        {data.slice(0, 5).map((performer, index) => (
                            <div
                                key={performer._id}
                                className="flex items-center p-2 rounded-lg hover:bg-gray-50"
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                        index === 1 ? 'bg-gray-100 text-gray-600' :
                                            index === 2 ? 'bg-orange-100 text-orange-700' :
                                                'bg-gray-50 text-gray-500'
                                    }`}>
                                    {index + 1}
                                </div>
                                <div className="ml-3 flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {performer.firstName} {performer.lastName}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {performer.email}
                                    </p>
                                </div>
                                <div className="text-right">
                                    {activeTab === 'taskers' ? (
                                        <>
                                            <p className="text-sm font-semibold text-green-600">
                                                ${(performer.totalEarnings || 0).toFixed(2)}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {performer.completedCount} jobs
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-sm font-semibold text-blue-600">
                                                ${(performer.totalSpent || 0).toFixed(2)}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {performer.quoteCount} quotes
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}