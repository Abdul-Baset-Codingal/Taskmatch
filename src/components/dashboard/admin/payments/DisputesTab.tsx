// @ts-nocheck
"use client"
// components/admin/payments/tabs/DisputesTab.tsx
import React, { useState } from 'react';
import {
    AlertTriangle,
    AlertCircle,
    CheckCircle,
    XCircle,
    Clock,
    Eye,
    FileText,
    Send,
    ExternalLink
} from 'lucide-react';

import { formatCurrency, formatDate } from './formatters';
import StatsCard from './StatsCard';
import { useGetDisputeDetailsQuery, useGetDisputesQuery, useSubmitDisputeEvidenceMutation } from '@/features/api/adminDashboardPaymentApi';
import LoadingSpinner from './LoadingSpinner';
import Modal from './Modal';

const DisputesTab: React.FC = () => {
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);
    const [showEvidenceModal, setShowEvidenceModal] = useState(false);
    const [evidenceForm, setEvidenceForm] = useState({
        disputeId: '',
        customerName: '',
        customerEmail: '',
        productDescription: '',
        customerCommunication: '',
        additionalNotes: '',
        submit: false,
    });

    const { data, isLoading, refetch } = useGetDisputesQuery({
        limit: 50,
        status: statusFilter || undefined,
    });

    const { data: disputeDetails, isLoading: isLoadingDetails } = useGetDisputeDetailsQuery(
        selectedDisputeId!,
        { skip: !selectedDisputeId }
    );

    const [submitEvidence, { isLoading: isSubmitting }] = useSubmitDisputeEvidenceMutation();

    const handleSubmitEvidence = async (submit: boolean) => {
        try {
            await submitEvidence({
                disputeId: evidenceForm.disputeId,
                customerName: evidenceForm.customerName,
                customerEmail: evidenceForm.customerEmail,
                productDescription: evidenceForm.productDescription,
                customerCommunication: evidenceForm.customerCommunication,
                additionalNotes: evidenceForm.additionalNotes,
                submit,
            }).unwrap();
            setShowEvidenceModal(false);
            setEvidenceForm({
                disputeId: '',
                customerName: '',
                customerEmail: '',
                productDescription: '',
                customerCommunication: '',
                additionalNotes: '',
                submit: false,
            });
            refetch();
        } catch (error) {
            console.error('Failed to submit evidence:', error);
        }
    };

    const openEvidenceModal = (disputeId: string) => {
        setEvidenceForm({ ...evidenceForm, disputeId });
        setShowEvidenceModal(true);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'needs_response':
                return <AlertCircle className="w-4 h-4 text-red-500" />;
            case 'under_review':
                return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'won':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'lost':
                return <XCircle className="w-4 h-4 text-red-500" />;
            default:
                return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            needs_response: 'bg-red-100 text-red-800',
            under_review: 'bg-yellow-100 text-yellow-800',
            won: 'bg-green-100 text-green-800',
            lost: 'bg-red-100 text-red-800',
            warning_needs_response: 'bg-orange-100 text-orange-800',
        };
        return styles[status] || 'bg-gray-100 text-gray-800';
    };

    if (isLoading) return <LoadingSpinner />;

    const disputes = data?.disputes || [];
    const stats = data?.stats || {
        needsResponse: { count: 0, totalAmount: 0 },
        won: { count: 0, totalAmount: 0 },
        lost: { count: 0, totalAmount: 0 },
        winRate: '0',
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatsCard
                    title="Needs Response"
                    value={stats.needsResponse?.count?.toString() || '0'}
                    subtitle={formatCurrency(stats.needsResponse?.totalAmount || 0)}
                    icon={<AlertCircle className="w-6 h-6 text-red-600" />}
                    urgent={stats.needsResponse?.count > 0}
                />
                <StatsCard
                    title="Won"
                    value={stats.won?.count?.toString() || '0'}
                    subtitle={formatCurrency(stats.won?.totalAmount || 0)}
                    icon={<CheckCircle className="w-6 h-6 text-green-600" />}
                />
                <StatsCard
                    title="Lost"
                    value={stats.lost?.count?.toString() || '0'}
                    subtitle={formatCurrency(stats.lost?.totalAmount || 0)}
                    icon={<XCircle className="w-6 h-6 text-red-600" />}
                />
                <StatsCard
                    title="Win Rate"
                    value={`${stats.winRate || '0'}%`}
                    icon={<AlertTriangle className="w-6 h-6 text-blue-600" />}
                />
            </div>

            {/* Urgent Disputes Alert */}
            {stats.needsResponse?.count > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                            <h4 className="text-sm font-medium text-red-800">Action Required</h4>
                            <p className="text-sm text-red-700 mt-1">
                                You have {stats.needsResponse.count} dispute(s) that need a response.
                                Submit evidence before the deadline to avoid automatic losses.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex flex-wrap gap-4 items-center">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Statuses</option>
                            <option value="needs_response">Needs Response</option>
                            <option value="under_review">Under Review</option>
                            <option value="won">Won</option>
                            <option value="lost">Lost</option>
                        </select>
                    </div>
                    <button
                        onClick={() => refetch()}
                        className="mt-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {/* Disputes Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Dispute
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
                                    Related Transaction
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Deadline
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {disputes.map((dispute: any) => (
                                <tr key={dispute.id} className={`hover:bg-gray-50 ${dispute.status === 'needs_response' ? 'bg-red-50' : ''}`}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-mono text-gray-900">{dispute.id}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-gray-900">
                                            {formatCurrency(dispute.amount)} {dispute.currency?.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-600 capitalize">
                                            {dispute.reason?.replace(/_/g, ' ') || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(dispute.status)}`}>
                                            {getStatusIcon(dispute.status)}
                                            <span className="ml-1 capitalize">{dispute.status?.replace(/_/g, ' ')}</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {dispute.transaction ? (
                                            <div className="text-sm">
                                                <span className="text-gray-900">{dispute.transaction.title}</span>
                                                <span className="text-gray-500 ml-2">({dispute.transaction.type})</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-400">Not found</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {dispute.deadline ? (
                                            <span className={`text-sm ${new Date(dispute.deadline) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                                                    ? 'text-red-600 font-medium'
                                                    : 'text-gray-500'
                                                }`}>
                                                {formatDate(dispute.deadline)}
                                            </span>
                                        ) : (
                                            <span className="text-sm text-gray-400">N/A</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={() => setSelectedDisputeId(dispute.id)}
                                                className="text-indigo-600 hover:text-indigo-900 p-1"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            {dispute.status === 'needs_response' && (
                                                <button
                                                    onClick={() => openEvidenceModal(dispute.id)}
                                                    className="text-green-600 hover:text-green-900 p-1"
                                                    title="Submit Evidence"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                </button>
                                            )}
                                            <a
                                                href={`https://dashboard.stripe.com/disputes/${dispute.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-gray-600 p-1"
                                                title="View in Stripe"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {disputes.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        No disputes found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Dispute Details Sidebar */}
            {selectedDisputeId && (
                <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-xl z-50 overflow-y-auto">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Dispute Details</h3>
                            <button
                                onClick={() => setSelectedDisputeId(null)}
                                className="text-gray-400 hover:text-gray-600 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        {isLoadingDetails ? (
                            <LoadingSpinner />
                        ) : disputeDetails ? (
                            <div className="space-y-6">
                                {/* Dispute Info */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="text-sm font-medium text-gray-900 mb-3">Dispute Information</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">ID:</span>
                                            <span className="font-mono text-gray-900">{disputeDetails.dispute?.id}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Amount:</span>
                                            <span className="font-medium text-gray-900">
                                                {formatCurrency(disputeDetails.dispute?.amount || 0)} {disputeDetails.dispute?.currency?.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Reason:</span>
                                            <span className="text-gray-900 capitalize">{disputeDetails.dispute?.reason?.replace(/_/g, ' ')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Status:</span>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(disputeDetails.dispute?.status || '')}`}>
                                                {disputeDetails.dispute?.status?.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Created:</span>
                                            <span className="text-gray-900">{formatDate(disputeDetails.dispute?.created)}</span>
                                        </div>
                                        {disputeDetails.dispute?.evidenceDueBy && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Evidence Due:</span>
                                                <span className={`font-medium ${new Date(disputeDetails.dispute.evidenceDueBy) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                                                        ? 'text-red-600'
                                                        : 'text-gray-900'
                                                    }`}>
                                                    {formatDate(disputeDetails.dispute.evidenceDueBy)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Evidence Status */}
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <h4 className="text-sm font-medium text-blue-900 mb-3">Evidence Status</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-blue-700">Has Evidence:</span>
                                            <span className="font-medium text-blue-900">
                                                {disputeDetails.dispute?.hasEvidence ? 'Yes' : 'No'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-blue-700">Submissions:</span>
                                            <span className="font-medium text-blue-900">{disputeDetails.dispute?.submissionCount || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-blue-700">Refundable:</span>
                                            <span className="font-medium text-blue-900">
                                                {disputeDetails.dispute?.isChargeRefundable ? 'Yes' : 'No'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Related Transaction */}
                                {disputeDetails.relatedTransaction && (
                                    <div className="bg-purple-50 rounded-lg p-4">
                                        <h4 className="text-sm font-medium text-purple-900 mb-3">Related Transaction</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-purple-700">Type:</span>
                                                <span className="font-medium text-purple-900">{disputeDetails.relatedTransaction.type}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-purple-700">Client:</span>
                                                <span className="text-purple-900">
                                                    {disputeDetails.relatedTransaction.data?.client?.firstName} {disputeDetails.relatedTransaction.data?.client?.lastName}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-purple-700">Email:</span>
                                                <span className="text-purple-900">{disputeDetails.relatedTransaction.data?.client?.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                {disputeDetails.dispute?.status === 'needs_response' && (
                                    <div className="pt-4 border-t">
                                        <button
                                            onClick={() => {
                                                setSelectedDisputeId(null);
                                                openEvidenceModal(disputeDetails.dispute!.id);
                                            }}
                                            className="w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                        >
                                            <FileText className="w-4 h-4 mr-2" />
                                            Submit Evidence
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

            {/* Evidence Submission Modal */}
            <Modal
                isOpen={showEvidenceModal}
                onClose={() => setShowEvidenceModal(false)}
                title="Submit Dispute Evidence"
                size="lg"
            >
                <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800">
                            Provide detailed evidence to support your case. Clear, documented proof increases your chances of winning the dispute.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                        <input
                            type="text"
                            value={evidenceForm.customerName}
                            onChange={(e) => setEvidenceForm({ ...evidenceForm, customerName: e.target.value })}
                            placeholder="Full name of the customer"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Customer Email</label>
                        <input
                            type="email"
                            value={evidenceForm.customerEmail}
                            onChange={(e) => setEvidenceForm({ ...evidenceForm, customerEmail: e.target.value })}
                            placeholder="customer@example.com"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product/Service Description</label>
                        <textarea
                            value={evidenceForm.productDescription}
                            onChange={(e) => setEvidenceForm({ ...evidenceForm, productDescription: e.target.value })}
                            placeholder="Describe the service that was provided..."
                            rows={3}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Customer Communication</label>
                        <textarea
                            value={evidenceForm.customerCommunication}
                            onChange={(e) => setEvidenceForm({ ...evidenceForm, customerCommunication: e.target.value })}
                            placeholder="Paste relevant communication logs, messages, or confirmations..."
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                        <textarea
                            value={evidenceForm.additionalNotes}
                            onChange={(e) => setEvidenceForm({ ...evidenceForm, additionalNotes: e.target.value })}
                            placeholder="Any other relevant information..."
                            rows={3}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button
                            onClick={() => setShowEvidenceModal(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => handleSubmitEvidence(false)}
                            disabled={isSubmitting}
                            className="px-4 py-2 border border-indigo-300 text-indigo-600 rounded-lg hover:bg-indigo-50 disabled:opacity-50"
                        >
                            Save Draft
                        </button>
                        <button
                            onClick={() => handleSubmitEvidence(true)}
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Evidence'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default DisputesTab;