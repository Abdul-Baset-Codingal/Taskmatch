// components/admin/quotes/QuotesTable.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Quote } from '@/types/admin';
import {
    ArrowUpDown,
    Eye,
    MoreHorizontal,
    User,
    DollarSign,
    Calendar,
} from 'lucide-react';
import { format } from 'date-fns';
import StatusBadge from './StatusBadge';

interface QuotesTableProps {
    quotes: Quote[];
    isLoading: boolean;
    selectedQuotes: string[];
    onSelectAll: (checked: boolean) => void;
    onSelectQuote: (quoteId: string, checked: boolean) => void;
    sortBy: string;
    sortOrder: string;
    onSort: (field: string) => void;
}

export default function QuotesTable({
    quotes,
    isLoading,
    selectedQuotes,
    onSelectAll,
    onSelectQuote,
    sortBy,
    sortOrder,
    onSort,
}: QuotesTableProps) {
    const allSelected = quotes.length > 0 && selectedQuotes.length === quotes.length;
    const someSelected = selectedQuotes.length > 0 && selectedQuotes.length < quotes.length;

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 w-10"><div className="h-4 bg-gray-200 rounded w-4 animate-pulse" /></th>
                                <th className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-24 animate-pulse" /></th>
                                <th className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-20 animate-pulse" /></th>
                                <th className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-20 animate-pulse" /></th>
                                <th className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-16 animate-pulse" /></th>
                                <th className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-16 animate-pulse" /></th>
                                <th className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-20 animate-pulse" /></th>
                                <th className="px-4 py-3 w-10"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(5)].map((_, i) => (
                                <tr key={i} className="border-b border-gray-100">
                                    <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-4 animate-pulse" /></td>
                                    <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-32 animate-pulse" /></td>
                                    <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-24 animate-pulse" /></td>
                                    <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-24 animate-pulse" /></td>
                                    <td className="px-4 py-4"><div className="h-6 bg-gray-200 rounded w-16 animate-pulse" /></td>
                                    <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-16 animate-pulse" /></td>
                                    <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-20 animate-pulse" /></td>
                                    <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded w-4 animate-pulse" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    if (quotes.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No quotes found</h3>
                <p className="text-gray-500 mt-1">Try adjusting your filters</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 w-10">
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    ref={input => {
                                        if (input) {
                                            input.indeterminate = someSelected;
                                        }
                                    }}
                                    onChange={(e) => onSelectAll(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                            </th>
                            <th className="px-4 py-3 text-left">
                                <button
                                    onClick={() => onSort('taskTitle')}
                                    className="flex items-center text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-gray-900"
                                >
                                    Task
                                    <ArrowUpDown className="w-3 h-3 ml-1" />
                                </button>
                            </th>
                            <th className="px-4 py-3 text-left">
                                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Client
                                </span>
                            </th>
                            <th className="px-4 py-3 text-left">
                                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Tasker
                                </span>
                            </th>
                            <th className="px-4 py-3 text-left">
                                <button
                                    onClick={() => onSort('status')}
                                    className="flex items-center text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-gray-900"
                                >
                                    Status
                                    <ArrowUpDown className="w-3 h-3 ml-1" />
                                </button>
                            </th>
                            <th className="px-4 py-3 text-left">
                                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Amount
                                </span>
                            </th>
                            <th className="px-4 py-3 text-left">
                                <button
                                    onClick={() => onSort('createdAt')}
                                    className="flex items-center text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-gray-900"
                                >
                                    Created
                                    <ArrowUpDown className="w-3 h-3 ml-1" />
                                </button>
                            </th>
                            <th className="px-4 py-3 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {quotes.map((quote) => (
                            <tr
                                key={quote._id}
                                className={`hover:bg-gray-50 transition-colors ${selectedQuotes.includes(quote._id) ? 'bg-blue-50' : ''
                                    }`}
                            >
                                <td className="px-4 py-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedQuotes.includes(quote._id)}
                                        onChange={(e) => onSelectQuote(quote._id, e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </td>
                                <td className="px-4 py-4">
                                    <div className="max-w-xs">
                                        <Link
                                            href={`/admin/quotes/${quote._id}`}
                                            className="text-sm font-medium text-gray-900 hover:text-blue-600 truncate block"
                                        >
                                            {quote.taskTitle}
                                        </Link>
                                        <p className="text-xs text-gray-500 truncate mt-0.5">
                                            {quote.location}
                                        </p>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    {quote.client ? (
                                        <div className="flex items-center">
                                            {quote.client.profilePicture ? (
                                                <img
                                                    src={quote.client.profilePicture}
                                                    alt="Client"
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-medium">
                                                    {quote.client.firstName?.[0]}
                                                    {quote.client.lastName?.[0]}
                                                </div>
                                            )}

                                            <div className="ml-2">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {quote.client.firstName} {quote.client.lastName}
                                                </p>
                                                <p className="text-xs text-gray-500">{quote.client.email}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 text-sm">N/A</span>
                                    )}
                                </td>

                                <td className="px-4 py-4">
                                    {quote.tasker ? (
                                        <div className="flex items-center">
                                            {quote.tasker.profilePicture ? (
                                                <img
                                                    src={quote.tasker.profilePicture}
                                                    alt="Tasker"
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs font-medium">
                                                    {quote.tasker.firstName?.[0]}
                                                    {quote.tasker.lastName?.[0]}
                                                </div>
                                            )}

                                            <div className="ml-2">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {quote.tasker.firstName} {quote.tasker.lastName}
                                                </p>
                                                <p className="text-xs text-gray-500">{quote.tasker.email}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 text-sm">N/A</span>
                                    )}
                                </td>

                                <td className="px-4 py-4">
                                    <div className="space-y-1">
                                        <StatusBadge status={quote.status} size="sm" />
                                        {quote.payment?.status && (
                                            <StatusBadge status={quote.payment.status} size="sm" type="payment" />
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    {quote.acceptedBid?.bidAmount ? (
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">
                                                ${quote.acceptedBid.bidAmount.toFixed(2)}
                                            </p>
                                            {quote.payment?.totalClientPays && (
                                                <p className="text-xs text-gray-500">
                                                    Total: ${quote.payment.totalClientPays.toFixed(2)}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-sm text-gray-400">
                                            {quote.bids?.length || 0} bid{quote.bids?.length !== 1 ? 's' : ''}
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        {format(new Date(quote.createdAt), 'MMM d, yyyy')}
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <Link
                                        href={`/dashboard/admin/marketplace/quotes/${quote._id}`}
                                        className="p-2 hover:bg-gray-100 rounded-lg inline-flex items-center justify-center text-gray-500 hover:text-gray-700"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}