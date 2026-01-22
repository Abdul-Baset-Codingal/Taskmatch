// @ts-nocheck

"use client"
// components/admin/payments/tabs/RefundsTab.tsx
import React, { useState } from 'react';
import {
    RefreshCcw,
    Plus,
    DollarSign,
    AlertCircle,
    CheckCircle,
    Clock,
    Search,
    X
} from 'lucide-react';

import { formatCurrency, formatDate } from './formatters';
import StatsCard from './StatsCard';
import { useCreateAdjustmentMutation, useGetRefundHistoryQuery, useProcessRefundMutation } from '@/features/api/adminDashboardPaymentApi';
import LoadingSpinner from './LoadingSpinner';
import Modal from './Modal';

const RefundsTab: React.FC = () => {
    const [page, setPage] = useState(1);
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
    const [filters, setFilters] = useState({
        status: '',
        startDate: '',
        endDate: '',
    });

    const { data, isLoading, refetch } = useGetRefundHistoryQuery({
        page,
        limit: 20,
        ...filters,
    });

    const [processRefund, { isLoading: isProcessing }] = useProcessRefundMutation();
    const [createAdjustment, { isLoading: isCreatingAdjustment }] = useCreateAdjustmentMutation();

    // Refund Form State
    const [refundForm, setRefundForm] = useState({
        transactionId: '',
        type: 'Task',
        amount: '',
        reason: '',
    });

    // Adjustment Form State
    const [adjustmentForm, setAdjustmentForm] = useState({
        userId: '',
        type: 'credit',
        amount: '',
        reason: '',
        direction: 'credit' as 'credit' | 'debit',
    });

    const handleProcessRefund = async () => {
        try {
            await processRefund({
                transactionId: refundForm.transactionId,
                type: refundForm.type,
                amount: parseFloat(refundForm.amount),
                reason: refundForm.reason,
            }).unwrap();
            setShowRefundModal(false);
            setRefundForm({ transactionId: '', type: 'Task', amount: '', reason: '' });
            refetch();
        } catch (error) {
            console.error('Refund failed:', error);
        }
    };

    const handleCreateAdjustment = async () => {
        try {
            await createAdjustment({
                userId: adjustmentForm.userId,
                type: adjustmentForm.type,
                amount: parseFloat(adjustmentForm.amount),
                reason: adjustmentForm.reason,
                direction: adjustmentForm.direction,
            }).unwrap();
            setShowAdjustmentModal(false);
            setAdjustmentForm({ userId: '', type: 'credit', amount: '', reason: '', direction: 'credit' });
        } catch (error) {
            console.error('Adjustment failed:', error);
        }
    };

    const getRefundStatusIcon = (status: string) => {
        switch (status) {
            case 'succeeded':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'pending':
                return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'failed':
                return <AlertCircle className="w-4 h-4 text-red-500" />;
            default:
                return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };

    if (isLoading) return <LoadingSpinner />;

    const refunds = data?.refunds || [];

    // Calculate stats
    const totalRefunded = refunds.reduce((acc: number, r: any) =>
        r.status === 'succeeded' ? acc + r.amount : acc, 0
    );
    const pendingRefunds = refunds.filter((r: any) => r.status === 'pending').length;
    const successfulRefunds = refunds.filter((r: any) => r.status === 'succeeded').length;

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Refunded"
                    value={totalRefunded}
                    icon={<RefreshCcw className="w-6 h-6 text-red-600" />}
                />
                <StatsCard
                    title="Pending Refunds"
                    value={pendingRefunds.toString()}
                    icon={<Clock className="w-6 h-6 text-yellow-600" />}
                />
                <StatsCard
                    title="Successful Refunds"
                    value={successfulRefunds.toString()}
                    icon={<CheckCircle className="w-6 h-6 text-green-600" />}
                />
                <StatsCard
                    title="Total Refund Count"
                    value={refunds.length.toString()}
                    icon={<DollarSign className="w-6 h-6 text-blue-600" />}
                />
            </div>

            {/* Action Buttons */}
            {/* <div className="flex flex-wrap gap-4">
                <button
                    onClick={() => setShowRefundModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Process Refund
                </button>
                <button
                    onClick={() => setShowAdjustmentModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Adjustment
                </button>
            </div> */}

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Statuses</option>
                            <option value="succeeded">Succeeded</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={() => refetch()}
                            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Refunds Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Refund ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Reason
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Payment Intent
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {refunds.map((refund: any) => (
                                <tr key={refund.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-mono text-gray-900">{refund.id}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-gray-900">
                                            {formatCurrency(refund.amount)} {refund.currency?.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-500">{refund.reason || 'N/A'}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {getRefundStatusIcon(refund.status)}
                                            <span className={`ml-2 text-sm font-medium capitalize
                        ${refund.status === 'succeeded' ? 'text-green-700' : ''}
                        ${refund.status === 'pending' ? 'text-yellow-700' : ''}
                        ${refund.status === 'failed' ? 'text-red-700' : ''}
                      `}>
                                                {refund.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-mono text-gray-500">
                                            {refund.paymentIntentId?.slice(-12)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(refund.created)}
                                    </td>
                                </tr>
                            ))}
                            {refunds.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No refunds found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Process Refund Modal */}
            <Modal
                isOpen={showRefundModal}
                onClose={() => setShowRefundModal(false)}
                title="Process Refund"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID</label>
                        <input
                            type="text"
                            value={refundForm.transactionId}
                            onChange={(e) => setRefundForm({ ...refundForm, transactionId: e.target.value })}
                            placeholder="Enter transaction ID"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
                        <select
                            value={refundForm.type}
                            onChange={(e) => setRefundForm({ ...refundForm, type: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="Task">Task</option>
                            <option value="Booking">Booking</option>
                            <option value="Quote">Quote</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                        <input
                            type="number"
                            value={refundForm.amount}
                            onChange={(e) => setRefundForm({ ...refundForm, amount: e.target.value })}
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                        <textarea
                            value={refundForm.reason}
                            onChange={(e) => setRefundForm({ ...refundForm, reason: e.target.value })}
                            placeholder="Enter reason for refund..."
                            rows={3}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            onClick={() => setShowRefundModal(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleProcessRefund}
                            disabled={isProcessing || !refundForm.transactionId || !refundForm.amount}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                        >
                            {isProcessing ? 'Processing...' : 'Process Refund'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Create Adjustment Modal */}
            <Modal
                isOpen={showAdjustmentModal}
                onClose={() => setShowAdjustmentModal(false)}
                title="Create Adjustment"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                        <input
                            type="text"
                            value={adjustmentForm.userId}
                            onChange={(e) => setAdjustmentForm({ ...adjustmentForm, userId: e.target.value })}
                            placeholder="Enter user ID"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
                        <div className="flex space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="credit"
                                    checked={adjustmentForm.direction === 'credit'}
                                    onChange={(e) => setAdjustmentForm({ ...adjustmentForm, direction: 'credit' })}
                                    className="mr-2"
                                />
                                <span className="text-green-600">Credit (Add funds)</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="debit"
                                    checked={adjustmentForm.direction === 'debit'}
                                    onChange={(e) => setAdjustmentForm({ ...adjustmentForm, direction: 'debit' })}
                                    className="mr-2"
                                />
                                <span className="text-red-600">Debit (Subtract funds)</span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                        <input
                            type="number"
                            value={adjustmentForm.amount}
                            onChange={(e) => setAdjustmentForm({ ...adjustmentForm, amount: e.target.value })}
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                        <textarea
                            value={adjustmentForm.reason}
                            onChange={(e) => setAdjustmentForm({ ...adjustmentForm, reason: e.target.value })}
                            placeholder="Enter reason for adjustment..."
                            rows={3}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            onClick={() => setShowAdjustmentModal(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreateAdjustment}
                            disabled={isCreatingAdjustment || !adjustmentForm.userId || !adjustmentForm.amount}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {isCreatingAdjustment ? 'Creating...' : 'Create Adjustment'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default RefundsTab;