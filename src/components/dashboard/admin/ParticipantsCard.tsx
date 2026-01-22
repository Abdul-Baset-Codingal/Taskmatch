// components/admin/quotes/detail/ParticipantsCard.tsx
'use client';

import React from 'react';
import { Mail, Phone, Calendar, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface ParticipantsCardProps {
    client: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        createdAt?: string;
    };
    tasker: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        stripeConnectStatus?: string;
        createdAt?: string;
    };
}

export default function ParticipantsCard({ client, tasker }: ParticipantsCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Participants</h2>

            <div className="space-y-4">
                {/* Client */}
                <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-blue-600 uppercase">Client</span>
                        <Link
                            href={`/admin/users/${client._id}`}
                            className="text-blue-600 hover:text-blue-700"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-semibold">
                            {client.firstName?.[0]}{client.lastName?.[0]}
                        </div>
                        <div className="ml-3">
                            <p className="font-medium text-gray-900">
                                {client.firstName} {client.lastName}
                            </p>
                        </div>
                    </div>
                    <div className="space-y-1.5 text-sm">
                        <a
                            href={`mailto:${client.email}`}
                            className="flex items-center text-gray-600 hover:text-blue-600"
                        >
                            <Mail className="w-4 h-4 mr-2" />
                            {client.email}
                        </a>
                        {client.phone && (
                            <a
                                href={`tel:${client.phone}`}
                                className="flex items-center text-gray-600 hover:text-blue-600"
                            >
                                <Phone className="w-4 h-4 mr-2" />
                                {client.phone}
                            </a>
                        )}
                    </div>
                </div>

                {/* Tasker */}
                <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-green-600 uppercase">Tasker</span>
                        <Link
                            href={`/admin/users/${tasker._id}`}
                            className="text-green-600 hover:text-green-700"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-semibold">
                            {tasker.firstName?.[0]}{tasker.lastName?.[0]}
                        </div>
                        <div className="ml-3">
                            <p className="font-medium text-gray-900">
                                {tasker.firstName} {tasker.lastName}
                            </p>
                            {tasker.stripeConnectStatus && (
                                <span className={`text-xs px-1.5 py-0.5 rounded ${tasker.stripeConnectStatus === 'active'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    Stripe: {tasker.stripeConnectStatus}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="space-y-1.5 text-sm">
                        <a
                            href={`mailto:${tasker.email}`}
                            className="flex items-center text-gray-600 hover:text-green-600"
                        >
                            <Mail className="w-4 h-4 mr-2" />
                            {tasker.email}
                        </a>
                        {tasker.phone && (
                            <a
                                href={`tel:${tasker.phone}`}
                                className="flex items-center text-gray-600 hover:text-green-600"
                            >
                                <Phone className="w-4 h-4 mr-2" />
                                {tasker.phone}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}