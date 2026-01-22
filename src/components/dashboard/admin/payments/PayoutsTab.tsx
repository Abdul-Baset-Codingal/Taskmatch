// @ts-nocheck

"use client"
// components/admin/payments/tabs/PayoutsTab.tsx
import React, { useState } from 'react';
import {
    Wallet,
    DollarSign,
    Users,
    TrendingUp,
    Search,
    Eye,
    Send,
    ExternalLink,
    ChevronRight
} from 'lucide-react';

import { formatCurrency, formatDate } from './formatters';
import { useGetTaskerPayoutDetailsQuery, useGetTaskerPayoutsQuery, useInitiateManualPayoutMutation } from '@/features/api/adminDashboardPaymentApi';
import LoadingSpinner from './LoadingSpinner';
import StatsCard from './StatsCard';
import Modal from './Modal';

const PayoutsTab: React.FC = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [selectedTaskerId, setSelectedTaskerId] = useState<string | null>(null);
    const [showPayoutModal, setShowPayoutModal] = useState(false);
    const [payoutForm, setPayoutForm] = useState({
        taskerId: '',
        amount: '',
        reason: '',
    });

    const { data, isLoading, refetch } = useGetTaskerPayoutsQuery({
        page,
        limit: 20,
        search,
    });

    const { data: taskerDetails, isLoading: isLoadingDetails } = useGetTaskerPayoutDetailsQuery(
        selectedTaskerId!,
        { skip: !selectedTaskerId }
    );

    const [initiateManualPayout, { isLoading: isInitiating }] = useInitiateManualPayoutMutation();

    const handleManualPayout = async () => {
        try {
            await initiateManualPayout({
                taskerId: payoutForm.taskerId,
                amount: parseFloat(payoutForm.amount),
                reason: payoutForm.reason,
            }).unwrap();
            setShowPayoutModal(false);
            setPayoutForm({ taskerId: '', amount: '', reason: '' });
            refetch();
        } catch (error) {
            console.error('Manual payout failed:', error);
        }
    };

    const openPayoutModal = (taskerId: string) => {
        setPayoutForm({ ...payoutForm, taskerId });
        setShowPayoutModal(true);
    };

    if (isLoading) return <LoadingSpinner />;

    const payouts = data?.payouts || [];
    const totalEarnings = payouts.reduce((acc: number, p: any) => acc + parseFloat(p.totalEarned || 0), 0);
    const totalTaskers = payouts.length;
    const avgEarning = totalTaskers > 0 ? totalEarnings / totalTaskers : 0;

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Payouts"
                    value={(totalEarnings)}
                    icon={<Wallet className="w-6 h-6 text-green-600" />}
                />
                <StatsCard
                    title="Active Taskers"
                    value={totalTaskers.toString()}
                    icon={<Users className="w-6 h-6 text-blue-600" />}
                />
                <StatsCard
                    title="Avg. Earnings"
                    value={(avgEarning)}
                    icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
                />
                <StatsCard
                    title="Pending Transfers"
                    value="$0.00"
                    icon={<DollarSign className="w-6 h-6 text-orange-600" />}
                />
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search taskers by name or email..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {/* Tasker Payouts Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tasker
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total Earned
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Jobs Completed
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stripe Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Last Job
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {payouts.map((payout: any) => (
                                <tr key={payout.taskerId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {payout.profilePicture ? (
                                                <img
                                                    src={payout.profilePicture}
                                                    alt="tasker"
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                    <span className="text-indigo-600 font-medium">
                                                        {payout.taskerName?.charAt(0)?.toUpperCase()}
                                                    </span>
                                                </div>
                                            )}

                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {payout.taskerName}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {payout.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-green-600">
                                            {formatCurrency(parseFloat(payout.totalEarned || 0))}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-900">{payout.jobsCount}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {payout.stripeAccountId ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Connected
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                Not Connected
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {payout.lastJobDate ? formatDate(payout.lastJobDate) : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={() => setSelectedTaskerId(payout.taskerId)}
                                                className="text-indigo-600 hover:text-indigo-900 p-1"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            {payout.stripeAccountId && (
                                                <button
                                                    onClick={() => openPayoutModal(payout.taskerId)}
                                                    className="text-green-600 hover:text-green-900 p-1"
                                                    title="Manual Payout"
                                                >
                                                    <Send className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {payouts.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No taskers found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Tasker Details Sidebar */}
            {selectedTaskerId && (
                <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Tasker Details</h3>
                            <button
                                onClick={() => setSelectedTaskerId(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <span className="sr-only">Close</span>
                                ×
                            </button>
                        </div>

                        {isLoadingDetails ? (
                            <LoadingSpinner />
                        ) : taskerDetails ? (
                            <div className="space-y-6">
                                {/* Tasker Info */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                                            <span className="text-indigo-600 font-semibold text-lg">
                                                {taskerDetails.tasker?.name?.charAt(0)?.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-lg font-medium text-gray-900">
                                                {taskerDetails.tasker?.name}
                                            </div>
                                            <div className="text-sm text-gray-500">{taskerDetails.tasker?.email}</div>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Stripe Account:</span>
                                            <span className="font-mono text-gray-900">
                                                {taskerDetails.tasker?.stripeAccountId?.slice(-8) || 'Not connected'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Status:</span>
                                            <span className={`font-medium ${taskerDetails.tasker?.stripeStatus === 'active'
                                                    ? 'text-green-600'
                                                    : 'text-gray-600'
                                                }`}>
                                                {taskerDetails.tasker?.stripeStatus || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Earnings Breakdown */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 mb-3">Earnings Breakdown</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                            <span className="text-sm text-gray-700">Tasks</span>
                                            <div className="text-right">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {formatCurrency(taskerDetails.earnings?.tasks?.total || 0)}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {taskerDetails.earnings?.tasks?.count || 0} completed
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                                            <span className="text-sm text-gray-700">Bookings</span>
                                            <div className="text-right">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {formatCurrency(taskerDetails.earnings?.bookings?.total || 0)}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {taskerDetails.earnings?.bookings?.count || 0} completed
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                                            <span className="text-sm text-gray-700">Quotes</span>
                                            <div className="text-right">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {formatCurrency(taskerDetails.earnings?.quotes?.total || 0)}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {taskerDetails.earnings?.quotes?.count || 0} completed
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-green-100 rounded-lg border-2 border-green-200">
                                            <span className="text-sm font-medium text-gray-900">Total Earnings</span>
                                            <span className="text-lg font-bold text-green-600">
                                                {formatCurrency(parseFloat(taskerDetails.earnings?.totalEarnings || '0'))}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Stripe Balance */}
                                {taskerDetails.stripeBalance && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900 mb-3">Stripe Balance</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <div className="text-xs text-gray-500 mb-1">Available</div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {taskerDetails.stripeBalance.available?.[0]?.amount
                                                        ? formatCurrency(taskerDetails.stripeBalance.available[0].amount / 100)
                                                        : '$0.00'
                                                    }
                                                </div>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <div className="text-xs text-gray-500 mb-1">Pending</div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {taskerDetails.stripeBalance.pending?.[0]?.amount
                                                        ? formatCurrency(taskerDetails.stripeBalance.pending[0].amount / 100)
                                                        : '$0.00'
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                {taskerDetails.tasker?.stripeAccountId && (
                                    <div className="pt-4 border-t">
                                        <button
                                            onClick={() => {
                                                setSelectedTaskerId(null);
                                                openPayoutModal(selectedTaskerId);
                                            }}
                                            className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                        >
                                            <Send className="w-4 h-4 mr-2" />
                                            Initiate Manual Payout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500">No details available</div>
                        )}
                    </div>
                </div>
            )}

            {/* Manual Payout Modal */}
            <Modal
                isOpen={showPayoutModal}
                onClose={() => setShowPayoutModal(false)}
                title="Initiate Manual Payout"
            >
                <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-yellow-800">
                            This will create a direct transfer to the tasker's connected Stripe account.
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tasker ID</label>
                        <input
                            type="text"
                            value={payoutForm.taskerId}
                            onChange={(e) => setPayoutForm({ ...payoutForm, taskerId: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                        <input
                            type="number"
                            value={payoutForm.amount}
                            onChange={(e) => setPayoutForm({ ...payoutForm, amount: e.target.value })}
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                        <textarea
                            value={payoutForm.reason}
                            onChange={(e) => setPayoutForm({ ...payoutForm, reason: e.target.value })}
                            placeholder="Enter reason for manual payout..."
                            rows={3}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            onClick={() => setShowPayoutModal(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleManualPayout}
                            disabled={isInitiating || !payoutForm.amount || !payoutForm.reason}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                            {isInitiating ? 'Processing...' : 'Send Payout'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default PayoutsTab;