// @ts-nocheck
// components/admin/PendingPayoutsTab.jsx

import React, { useState } from 'react';
import {
    Clock, CheckCircle, AlertCircle, Send, Eye, Building,
    CreditCard, DollarSign, Loader2, Copy, ExternalLink,
    User, Phone, Mail, X
} from 'lucide-react';
import { toast } from 'react-toastify';

const PendingPayoutsTab = ({
    data,
    onProcessPayout,
    onCompletePayout,
    processing
}) => {
    const [selectedPayout, setSelectedPayout] = useState(null);
    const [showPayoutModal, setShowPayoutModal] = useState(false);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [referenceNumber, setReferenceNumber] = useState('');
    const [notes, setNotes] = useState('');

    const payouts = data?.payouts || [];
    const summary = data?.summary || {};

    // Copy to clipboard
    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied!`);
    };

    // Open payout modal
    const handleOpenPayoutModal = (payout) => {
        setSelectedPayout(payout);
        setShowPayoutModal(true);
        setReferenceNumber('');
        setNotes('');
    };

    // Process the payout
    const handleProcessPayout = async () => {
        if (!selectedPayout) return;

        await onProcessPayout(
            selectedPayout._id || selectedPayout.transactionId,
            'manual_bank_transfer',
            { referenceNumber, notes }
        );

        setShowPayoutModal(false);
        setSelectedPayout(null);
    };

    // Open complete modal (for payouts in processing status)
    const handleOpenCompleteModal = (payout) => {
        setSelectedPayout(payout);
        setShowCompleteModal(true);
        setReferenceNumber('');
        setNotes('');
    };

    // Mark payout as complete
    const handleCompletePayout = async () => {
        if (!selectedPayout) return;

        await onCompletePayout(
            selectedPayout._id || selectedPayout.transactionId,
            { referenceNumber, notes }
        );

        setShowCompleteModal(false);
        setSelectedPayout(null);
    };

    if (payouts.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">All caught up!</h3>
                <p className="text-gray-500 mt-1">No pending payouts to process.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Pending</p>
                            <p className="text-2xl font-bold text-orange-600">
                                ${summary.totalAmount || '0.00'}
                            </p>
                        </div>
                        <Clock className="w-8 h-8 text-orange-500" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Pending Count</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {summary.totalPending || 0}
                            </p>
                        </div>
                        <DollarSign className="w-8 h-8 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">With Bank Details</p>
                            <p className="text-2xl font-bold text-green-600">
                                {summary.withBankDetails || 0}
                            </p>
                        </div>
                        <Building className="w-8 h-8 text-green-500" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Missing Bank Info</p>
                            <p className="text-2xl font-bold text-red-600">
                                {summary.withoutBankDetails || 0}
                            </p>
                        </div>
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                </div>
            </div>

            {/* Payouts Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="px-6 py-4 border-b bg-gray-50">
                    <h3 className="font-semibold text-gray-900">Pending Payouts</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Transaction
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Task
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Tasker
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Bank Details
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Amount
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {payouts.map((payout) => (
                                <tr key={payout._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-4">
                                        <span className="text-sm font-mono text-gray-900">
                                            {payout.transactionId}
                                        </span>
                                        <p className="text-xs text-gray-500">
                                            {new Date(payout.createdAt).toLocaleDateString()}
                                        </p>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="text-sm text-gray-900 truncate block max-w-[150px]">
                                            {payout.task?.title || 'Unknown Task'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {payout.tasker?.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {payout.tasker?.email}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        {payout.tasker?.bankDetails?.hasBankDetails ? (
                                            <div className="text-sm">
                                                <p className="font-medium text-gray-900">
                                                    {payout.tasker.bankDetails.accountHolder}
                                                </p>
                                                <p className="text-gray-500">
                                                    ****{payout.tasker.bankDetails.accountNumberLast4}
                                                </p>
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-green-100 text-green-700 mt-1">
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Verified
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center text-red-600">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                <span className="text-sm">No bank info</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-4">
                                        <div>
                                            <p className="text-lg font-bold text-blue-600">
                                                ${payout.amounts?.taskerEarnings}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Total: ${payout.amounts?.total}
                                            </p>
                                            <p className="text-xs text-green-600">
                                                Fee: ${payout.amounts?.platformFee}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        {payout.payoutStatus === 'processing' ? (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                <Clock className="w-3 h-3 mr-1" />
                                                Processing
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                <Clock className="w-3 h-3 mr-1" />
                                                Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            {payout.payoutStatus === 'processing' ? (
                                                <button
                                                    onClick={() => handleOpenCompleteModal(payout)}
                                                    className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                                                >
                                                    <CheckCircle className="w-4 h-4 inline mr-1" />
                                                    Complete
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleOpenPayoutModal(payout)}
                                                    disabled={!payout.tasker?.bankDetails?.hasBankDetails || processing}
                                                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Send className="w-4 h-4 inline mr-1" />
                                                    Pay
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Payout Modal */}
            {showPayoutModal && selectedPayout && (
                <PayoutModal
                    payout={selectedPayout}
                    onClose={() => {
                        setShowPayoutModal(false);
                        setSelectedPayout(null);
                    }}
                    onProcess={handleProcessPayout}
                    referenceNumber={referenceNumber}
                    setReferenceNumber={setReferenceNumber}
                    notes={notes}
                    setNotes={setNotes}
                    processing={processing}
                    copyToClipboard={copyToClipboard}
                />
            )}

            {/* Complete Payout Modal */}
            {showCompleteModal && selectedPayout && (
                <CompletePayoutModal
                    payout={selectedPayout}
                    onClose={() => {
                        setShowCompleteModal(false);
                        setSelectedPayout(null);
                    }}
                    onComplete={handleCompletePayout}
                    referenceNumber={referenceNumber}
                    setReferenceNumber={setReferenceNumber}
                    notes={notes}
                    setNotes={setNotes}
                    processing={processing}
                />
            )}
        </div>
    );
};

// Payout Modal Component
const PayoutModal = ({
    payout,
    onClose,
    onProcess,
    referenceNumber,
    setReferenceNumber,
    notes,
    setNotes,
    processing,
    copyToClipboard
}) => {
    const bankDetails = payout.tasker?.bankDetails;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

                <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Process Bank Transfer</h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Tasker Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="flex items-center mb-3">
                            <User className="w-5 h-5 text-gray-500 mr-2" />
                            <span className="font-medium">{payout.tasker?.name}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                            <Mail className="w-4 h-4 mr-2" />
                            {payout.tasker?.email}
                        </div>
                        {payout.tasker?.phone && (
                            <div className="flex items-center text-sm text-gray-600">
                                <Phone className="w-4 h-4 mr-2" />
                                {payout.tasker?.phone}
                            </div>
                        )}
                    </div>

                    {/* Bank Details */}
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                        <h3 className="font-medium text-blue-900 mb-3 flex items-center">
                            <Building className="w-5 h-5 mr-2" />
                            Bank Account Details
                        </h3>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-blue-700">Account Holder</span>
                                <div className="flex items-center">
                                    <span className="font-medium text-blue-900 mr-2">
                                        {bankDetails?.accountHolder}
                                    </span>
                                    <button
                                        onClick={() => copyToClipboard(bankDetails?.accountHolder, 'Account holder')}
                                        className="p-1 hover:bg-blue-100 rounded"
                                    >
                                        <Copy className="w-4 h-4 text-blue-600" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-blue-700">Account Number</span>
                                <div className="flex items-center">
                                    <span className="font-mono text-blue-900 mr-2">
                                        ****{bankDetails?.accountNumberLast4}
                                    </span>
                                    {bankDetails?.accountNumber && (
                                        <button
                                            onClick={() => copyToClipboard(bankDetails.accountNumber, 'Account number')}
                                            className="p-1 hover:bg-blue-100 rounded"
                                        >
                                            <Copy className="w-4 h-4 text-blue-600" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-blue-700">Routing Number</span>
                                <div className="flex items-center">
                                    <span className="font-mono text-blue-900 mr-2">
                                        {bankDetails?.routingNumber}
                                    </span>
                                    <button
                                        onClick={() => copyToClipboard(bankDetails?.routingNumber, 'Routing number')}
                                        className="p-1 hover:bg-blue-100 rounded"
                                    >
                                        <Copy className="w-4 h-4 text-blue-600" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Amount */}
                    <div className="bg-green-50 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-center">
                            <span className="text-green-700">Amount to Transfer</span>
                            <span className="text-2xl font-bold text-green-600">
                                ${payout.amounts?.taskerEarnings}
                            </span>
                        </div>
                    </div>

                    {/* Reference Number Input */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bank Reference Number (Optional)
                        </label>
                        <input
                            type="text"
                            value={referenceNumber}
                            onChange={(e) => setReferenceNumber(e.target.value)}
                            placeholder="Enter bank transfer reference..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Notes */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Notes (Optional)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add any notes..."
                            rows={2}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Instructions */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                        <p className="text-sm text-yellow-800">
                            <strong>Instructions:</strong> Copy the bank details above and process the transfer
                            through your bank. After completing the transfer, enter the reference number and
                            click "Mark as Processing".
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onProcess}
                            disabled={processing}
                            className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing ? (
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            ) : (
                                <Send className="w-5 h-5 mr-2" />
                            )}
                            Mark as Processing
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Complete Payout Modal
const CompletePayoutModal = ({
    payout,
    onClose,
    onComplete,
    referenceNumber,
    setReferenceNumber,
    notes,
    setNotes,
    processing
}) => {
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

                <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Complete Payout</h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <p className="text-sm text-gray-600">Transaction: <span className="font-mono">{payout.transactionId}</span></p>
                        <p className="text-sm text-gray-600">Tasker: <span className="font-medium">{payout.tasker?.name}</span></p>
                        <p className="text-lg font-bold text-blue-600 mt-2">${payout.amounts?.taskerEarnings}</p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bank Reference / Confirmation Number *
                        </label>
                        <input
                            type="text"
                            value={referenceNumber}
                            onChange={(e) => setReferenceNumber(e.target.value)}
                            placeholder="Enter the bank transfer confirmation..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Notes (Optional)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add any notes..."
                            rows={2}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onComplete}
                            disabled={processing || !referenceNumber.trim()}
                            className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                            {processing ? (
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            ) : (
                                <CheckCircle className="w-5 h-5 mr-2" />
                            )}
                            Mark Complete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PendingPayoutsTab;