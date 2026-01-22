// components/admin/quotes/BulkActions.tsx
'use client';

import React, { useState } from 'react';
import { useBulkUpdateQuotesMutation } from '@/features/api/adminQuoteApi';
import { X, Ban, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

interface BulkActionsProps {
    selectedIds: string[];
    onComplete: () => void;
    onClear: () => void;
}

export default function BulkActions({ selectedIds, onComplete, onClear }: BulkActionsProps) {
    const [bulkUpdate, { isLoading }] = useBulkUpdateQuotesMutation();
    const [showConfirm, setShowConfirm] = useState<string | null>(null);
    const [reason, setReason] = useState('');

    const handleBulkAction = async (action: 'cancel' | 'expire' | 'mark_completed') => {
        try {
            const result = await bulkUpdate({
                quoteIds: selectedIds,
                action,
                reason: reason || `Bulk ${action} by admin`,
            }).unwrap();

            if (result.success) {
                toast.success(`${result.results.success.length} quotes updated successfully`);
                if (result.results.failed.length > 0) {
                    toast.error(`${result.results.failed.length} quotes failed to update`);
                }
                onComplete();
            }
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to perform bulk action');
        } finally {
            setShowConfirm(null);
            setReason('');
        }
    };

    return (
        <>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-semibold mr-3">
                            {selectedIds.length}
                        </span>
                        <span className="text-sm font-medium text-blue-900">
                            quotes selected
                        </span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setShowConfirm('cancel')}
                            disabled={isLoading}
                            className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
                        >
                            <Ban className="w-4 h-4 mr-1.5" />
                            Cancel Selected
                        </button>
                        <button
                            onClick={() => setShowConfirm('expire')}
                            disabled={isLoading}
                            className="inline-flex items-center px-3 py-1.5 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
                        >
                            <Clock className="w-4 h-4 mr-1.5" />
                            Mark Expired
                        </button>
                        <button
                            onClick={() => setShowConfirm('mark_completed')}
                            disabled={isLoading}
                            className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                            <CheckCircle className="w-4 h-4 mr-1.5" />
                            Mark Completed
                        </button>
                        <button
                            onClick={onClear}
                            className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-blue-600" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Confirm Bulk {showConfirm.replace('_', ' ')}
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to {showConfirm.replace('_', ' ')} {selectedIds.length} quote(s)?
                            This action cannot be undone.
                        </p>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Reason (optional)
                            </label>
                            <input
                                type="text"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Enter reason for this action..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowConfirm(null);
                                    setReason('');
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleBulkAction(showConfirm as any)}
                                disabled={isLoading}
                                className={`px-4 py-2 rounded-lg text-white font-medium flex items-center ${showConfirm === 'cancel' ? 'bg-red-600 hover:bg-red-700' :
                                        showConfirm === 'expire' ? 'bg-gray-600 hover:bg-gray-700' :
                                            'bg-green-600 hover:bg-green-700'
                                    } disabled:opacity-50`}
                            >
                                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}