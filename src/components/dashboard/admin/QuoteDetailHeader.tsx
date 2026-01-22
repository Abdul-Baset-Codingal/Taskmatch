// components/admin/quotes/detail/QuoteDetailHeader.tsx
'use client';

import React from 'react';
import { Quote } from '@/types/admin';
import { RefreshCw, Copy, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import StatusBadge from './StatusBadge';
import { toast } from 'react-toastify';

interface QuoteDetailHeaderProps {
    quote: Quote;
    onRefresh: () => void;
}

export default function QuoteDetailHeader({ quote, onRefresh }: QuoteDetailHeaderProps) {
    const copyId = () => {
        navigator.clipboard.writeText(quote._id);
        toast.success('Quote ID copied!');
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {quote.taskTitle}
                        </h1>
                        <StatusBadge status={quote.status} size="lg" />
                        {quote.payment?.status && (
                            <StatusBadge status={quote.payment.status} size="lg" type="payment" />
                        )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                            <span className="font-mono">{quote._id}</span>
                            <button
                                onClick={copyId}
                                className="ml-1 p-1 hover:bg-gray-100 rounded"
                            >
                                <Copy className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <span>•</span>
                        <span>Created {format(new Date(quote.createdAt), 'PPP')}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={onRefresh}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </button>
                    {quote.payment?.paymentIntentId && (
                        <a
                            href={`https://dashboard.stripe.com/payments/${quote.payment.paymentIntentId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
                        >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View in Stripe
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}