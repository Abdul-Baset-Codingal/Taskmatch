// components/admin/dashboard/RecentQuotes.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Quote } from '@/types/admin';
import { ExternalLink, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import StatusBadge from './StatusBadge';

interface RecentQuotesProps {
    quotes: Quote[];
    isLoading: boolean;
}

export default function RecentQuotes({ quotes, isLoading }: RecentQuotesProps) {
    if (isLoading) {
        return (
            <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-100">
                    <div className="h-5 bg-gray-200 rounded w-32 animate-pulse" />
                </div>
                <div className="divide-y divide-gray-100">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="p-4 animate-pulse">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="h-4 bg-gray-200 rounded w-48 mb-2" />
                                    <div className="h-3 bg-gray-200 rounded w-32" />
                                </div>
                                <div className="h-6 bg-gray-200 rounded w-20" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Quotes</h3>
                <Link
                    href="/admin/quotes"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                >
                    View all
                    <ExternalLink className="w-4 h-4 ml-1" />
                </Link>
            </div>
            <div className="divide-y divide-gray-100">
                {quotes.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No quotes found
                    </div>
                ) : (
                    quotes.map((quote) => (
                        <Link
                            key={quote._id}
                            href={`/admin/quotes/${quote._id}`}
                            className="block p-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {quote.taskTitle}
                                    </p>
                                    <div className="flex items-center mt-1 text-xs text-gray-500">
                                        <span className="truncate">
                                            {quote.client?.firstName} {quote.client?.lastName}
                                        </span>
                                        <span className="mx-2">→</span>
                                        <span className="truncate">
                                            {quote.tasker?.firstName} {quote.tasker?.lastName}
                                        </span>
                                    </div>
                                    <div className="flex items-center mt-1 text-xs text-gray-400">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {formatDistanceToNow(new Date(quote.createdAt), { addSuffix: true })}
                                    </div>
                                </div>
                                <div className="ml-4 flex flex-col items-end space-y-1">
                                    <StatusBadge status={quote.status} />
                                    {quote.acceptedBid?.bidAmount && (
                                        <span className="text-sm font-medium text-gray-900">
                                            ${quote.acceptedBid.bidAmount.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}