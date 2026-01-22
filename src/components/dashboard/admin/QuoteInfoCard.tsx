// components/admin/quotes/detail/QuoteInfoCard.tsx
'use client';

import React from 'react';
import { Quote } from '@/types/admin';
import { MapPin, Calendar, Clock, DollarSign, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface QuoteInfoCardProps {
    quote: Quote;
}

export default function QuoteInfoCard({ quote }: QuoteInfoCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quote Details</h2>

            <div className="space-y-4">
                {/* Description */}
                <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        Description
                    </h3>
                    <p className="text-gray-900 whitespace-pre-wrap">
                        {quote.taskDescription}
                    </p>
                </div>

                <hr className="border-gray-100" />

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-gray-500">Location</p>
                            <p className="text-gray-900">{quote.location}</p>
                        </div>
                    </div>

                    {quote.preferredDateTime && (
                        <div className="flex items-start">
                            <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">Preferred Date</p>
                                <p className="text-gray-900">
                                    {format(new Date(quote.preferredDateTime), 'PPP p')}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-start">
                        <Clock className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-gray-500">Urgency</p>
                            <p className="text-gray-900">{quote.urgency}</p>
                        </div>
                    </div>

                    {quote.budget && (
                        <div className="flex items-start">
                            <DollarSign className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">Budget</p>
                                <p className="text-gray-900">${quote.budget.toFixed(2)}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}