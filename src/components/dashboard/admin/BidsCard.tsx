// components/admin/quotes/detail/BidsCard.tsx
'use client';

import React from 'react';
import { Bid } from '@/types/admin';
import { DollarSign, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import StatusBadge from './StatusBadge';

interface BidsCardProps {
    bids: Bid[];
    acceptedBid?: {
        bidId: string;
        bidAmount: number;
        bidDescription: string;
        estimatedDuration: number;
    };
}

export default function BidsCard({ bids, acceptedBid }: BidsCardProps) {
    if (bids.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Bids</h2>
                <p className="text-gray-500 text-center py-8">No bids submitted yet</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Bids ({bids.length})
            </h2>

            <div className="space-y-4">
                {bids.map((bid) => {
                    const isAccepted = acceptedBid?.bidId === bid._id;

                    return (
                        <div
                            key={bid._id}
                            className={`p-4 rounded-lg border-2 ${isAccepted
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-200 bg-gray-50'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium">
                                        {bid.tasker?.firstName?.[0]}{bid.tasker?.lastName?.[0]}
                                    </div>
                                    <div className="ml-3">
                                        <p className="font-medium text-gray-900">
                                            {bid.tasker?.firstName} {bid.tasker?.lastName}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Submitted {format(new Date(bid.submittedAt), 'PPP p')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {isAccepted && (
                                        <span className="inline-flex items-center text-green-600 text-sm font-medium">
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Accepted
                                        </span>
                                    )}
                                    <StatusBadge status={bid.status} size="sm" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-3">
                                <div className="flex items-center">
                                    <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                                    <div>
                                        <p className="text-xs text-gray-500">Bid Amount</p>
                                        <p className="font-semibold text-gray-900">
                                            ${bid.bidAmount.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 text-gray-400 mr-2" />
                                    <div>
                                        <p className="text-xs text-gray-500">Est. Duration</p>
                                        <p className="font-semibold text-gray-900">
                                            {bid.estimatedDuration} hour{bid.estimatedDuration !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {bid.bidDescription && (
                                <div>
                                    <p className="text-sm text-gray-700">{bid.bidDescription}</p>
                                </div>
                            )}

                            {bid.feeBreakdown && (
                                <details className="mt-3">
                                    <summary className="text-xs text-blue-600 cursor-pointer hover:underline">
                                        View fee breakdown
                                    </summary>
                                    <div className="mt-2 p-3 bg-white rounded border text-xs space-y-1">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Client Platform Fee (10%)</span>
                                            <span>${(bid.feeBreakdown.clientPlatformFeeCents / 100).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Reservation Fee</span>
                                            <span>${(bid.feeBreakdown.reservationFeeCents / 100).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Client Tax (13%)</span>
                                            <span>${(bid.feeBreakdown.clientTaxCents / 100).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between font-medium border-t pt-1">
                                            <span>Total Client Pays</span>
                                            <span>${(bid.feeBreakdown.totalClientPaysCents / 100).toFixed(2)}</span>
                                        </div>
                                        <hr />
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Tasker Fee (12%)</span>
                                            <span>-${(bid.feeBreakdown.taskerPlatformFeeCents / 100).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Tasker Tax (13%)</span>
                                            <span>-${(bid.feeBreakdown.taskerTaxCents / 100).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between font-medium text-green-600 border-t pt-1">
                                            <span>Tasker Receives</span>
                                            <span>${(bid.feeBreakdown.taskerPayoutCents / 100).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </details>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}