// @ts-nocheck
// app/admin/quotes/[id]/page.tsx
'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useGetAdminQuoteByIdQuery } from '@/features/api/adminQuoteApi';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import QuoteDetailHeader from '@/components/dashboard/admin/QuoteDetailHeader';
import BidsCard from '@/components/dashboard/admin/BidsCard';
import ParticipantsCard from '@/components/dashboard/admin/ParticipantsCard';
import QuoteInfoCard from '@/components/dashboard/admin/QuoteInfoCard';
import AdminActionsCard from '@/components/dashboard/admin/AdminActionsCard';
import PaymentCardQuote from '@/components/dashboard/admin/PaymentCardQuote';

export default function QuoteDetailPage() {
    const params = useParams();
    const quoteId = params.id as string;

    const { data, isLoading, error, refetch } = useGetAdminQuoteByIdQuery(quoteId);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error || !data?.quote) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-gray-900">Quote not found</h2>
                <p className="text-gray-500 mt-2">
                    The quote you&apos;re looking for doesn&apos;t exist or has been removed.
                </p>
                <Link
                    href="/dashboard/admin/marketplace/quotes"
                    className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-700"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to quotes
                </Link>
            </div>
        );
    }

    const { quote, stripePaymentDetails } = data;

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Link
                href="/dashboard/admin/marketplace/quotes"
                className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to quotes
            </Link>

            {/* Header */}
            <QuoteDetailHeader quote={quote} onRefresh={refetch} />

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    <QuoteInfoCard quote={quote} />
                    <BidsCard bids={quote.bids || []} acceptedBid={quote.acceptedBid} />
                    {quote.payment && (
                        <PaymentCardQuote
                            payment={quote.payment}
                            stripeDetails={stripePaymentDetails}
                            quoteId={quote._id}
                            onRefresh={refetch}
                        />
                    )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <ParticipantsCard client={quote.client} tasker={quote.tasker} />
                    <AdminActionsCard quote={quote} onRefresh={refetch} />
                </div>
            </div>
        </div>
    );
} 