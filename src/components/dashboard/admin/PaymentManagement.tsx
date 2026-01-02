// @ts-nocheck
// pages/admin/PaymentManagement.jsx
import React, { useState, useEffect } from 'react';
import {
    DollarSign,
    Users,
    Clock,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    Download,
    Filter,
    Search,
    Eye,
    Send,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    X,
    CreditCard,
    Building,
    Calendar,
    MoreVertical,
    ArrowUpRight,
    ArrowDownRight,
    Loader2,
    FileText,
    Settings,
    BarChart3,
    Database,
    ExternalLink,
    User,
    Mail,
    Phone,
    Zap,
    DollarSign as Dollar,
    Percent
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import PendingPayoutsTab from './PendingPayoutsTab';

const API_BASE = '/api';

const PaymentManagement = () => {
    // State management
    const [activeTab, setActiveTab] = useState('stripe');
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);

    // Data states
    const [stripePayments, setStripePayments] = useState([]);
    const [stripeSummary, setStripeSummary] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [pendingPayouts, setPendingPayouts] = useState(null);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [processingPayout, setProcessingPayout] = useState(false);
    const [settings, setSettings] = useState(null);

    // Expanded rows for stripe payments
    const [expandedRows, setExpandedRows] = useState({});

    // Filters
    const [filters, setFilters] = useState({
        status: '',
        startDate: '',
        endDate: '',
        search: '',
        page: 1,
        limit: 10
    });

    // Pagination
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0
    });

    // Toggle expanded row
    const toggleRow = (id) => {
        setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Fetch Stripe payments with tasker data
    const fetchStripePayments = async () => {
        try {
            const response = await axios.get(
                `${API_BASE}/admin/payments/stripe-payments`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setStripePayments(response.data.payments || []);
            setStripeSummary(response.data.summary || null);
        } catch (error) {
            console.error('Error fetching Stripe payments:', error);
            toast.error('Failed to fetch Stripe payments');
        }
    };

    // Fetch dashboard data
    const fetchDashboard = async () => {
        try {
            const response = await axios.get(`${API_BASE}/admin/payments/dashboard`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setDashboardData(response.data.dashboard);
        } catch (error) {
            console.error('Dashboard error:', error);
        }
    };

    // Fetch transactions
    const fetchTransactions = async () => {
        try {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });

            const response = await axios.get(
                `${API_BASE}/admin/payments/transactions?${params}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            setTransactions(response.data.transactions || []);
            setPagination(response.data.pagination || { currentPage: 1, totalPages: 1, totalCount: 0 });
        } catch (error) {
            console.error('Transactions error:', error);
        }
    };

    // Fetch pending payouts
    const fetchPendingPayouts = async () => {
        try {
            const response = await axios.get(
                `${API_BASE}/admin/payments/pending-payouts`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setPendingPayouts(response.data);
        } catch (error) {
            console.error('Pending payouts error:', error);
        }
    };

    // Fetch settings
    const fetchSettings = async () => {
        try {
            const response = await axios.get(
                `${API_BASE}/admin/payments/settings`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setSettings(response.data.settings);
        } catch (error) {
            console.error('Settings error:', error);
        }
    };

    // Sync Stripe to database
    const handleSyncStripe = async () => {
        setSyncing(true);
        try {
            const response = await axios.post(
                `${API_BASE}/admin/payments/sync-stripe`,
                {},
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            const { results } = response.data;
            toast.success(
                `Sync completed! Synced: ${results.synced}, Updated: ${results.updated}, Skipped: ${results.skipped}, Errors: ${results.errors}`
            );

            // Refresh all data
            await Promise.all([
                fetchStripePayments(),
                fetchTransactions(),
                fetchPendingPayouts(),
                fetchDashboard()
            ]);
        } catch (error) {
            console.error('Sync error:', error);
            toast.error('Failed to sync: ' + (error.response?.data?.error || error.message));
        } finally {
            setSyncing(false);
        }
    };

    // Capture payment
    const handleCapturePayment = async (paymentIntentId, taskId) => {
        try {
            await axios.post(
                `${API_BASE}/admin/payments/capture/${taskId}`,
                { paymentIntentId },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            toast.success('Payment captured successfully!');
            fetchStripePayments();
            fetchTransactions();
            fetchDashboard();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to capture payment');
        }
    };

    // Initial data load
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([
                fetchStripePayments(),
                fetchDashboard(),
                fetchTransactions(),
                fetchPendingPayouts(),
                fetchSettings()
            ]);
            setLoading(false);
        };
        loadData();
    }, []);

    // Refetch when filters change
    useEffect(() => {
        if (!loading) {
            fetchTransactions();
        }
    }, [filters]);

    // Process single payout
    const handleProcessPayout = async (transactionId, payoutMethod = 'stripe_connect') => {
        setProcessingPayout(true);
        try {
            await axios.post(
                `${API_BASE}/admin/payments/payout/${transactionId}`,
                { payoutMethod },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            toast.success('Payout processed successfully!');
            fetchPendingPayouts();
            fetchDashboard();
            setShowTransactionModal(false);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to process payout');
        } finally {
            setProcessingPayout(false);
        }
    };

    // Process bulk payouts
    const handleBulkPayout = async (transactionIds) => {
        setProcessingPayout(true);
        try {
            await axios.post(
                `${API_BASE}/admin/payments/payout/bulk`,
                { transactionIds, payoutMethod: 'stripe_connect' },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            toast.success('Bulk payouts processed successfully!');
            fetchPendingPayouts();
            fetchDashboard();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to process bulk payouts');
        } finally {
            setProcessingPayout(false);
        }
    };

    // View transaction details
    const handleViewTransaction = async (transactionId) => {
        try {
            const response = await axios.get(
                `${API_BASE}/admin/payments/transactions/${transactionId}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setSelectedTransaction(response.data.transaction);
            setShowTransactionModal(true);
        } catch (error) {
            toast.error('Failed to fetch transaction details');
        }
    };

    // Refund transaction
    const handleRefund = async (transactionId, reason) => {
        try {
            await axios.post(
                `${API_BASE}/admin/payments/refund/${transactionId}`,
                { reason },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            toast.success('Refund processed successfully!');
            fetchTransactions();
            fetchStripePayments();
            fetchDashboard();
            setShowTransactionModal(false);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to process refund');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
                    <p className="mt-4 text-gray-600">Loading payment data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Payment Management
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Manage transactions, payouts, and platform earnings
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            {/* Sync Button */}
                            <button
                                onClick={handleSyncStripe}
                                disabled={syncing}
                                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                            >
                                {syncing ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Database className="w-4 h-4 mr-2" />
                                )}
                                Sync from Stripe
                            </button>
                            <button
                                onClick={() => {
                                    fetchStripePayments();
                                    fetchDashboard();
                                    fetchTransactions();
                                    fetchPendingPayouts();
                                }}
                                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Refresh
                            </button>
                            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex space-x-8 -mb-px overflow-x-auto">
                        {[
                            { id: 'stripe', label: 'Stripe Payments', icon: CreditCard, badge: stripePayments.length },
                            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                            { id: 'pending', label: 'Pending Payouts', icon: Clock, badge: pendingPayouts?.payouts?.length || 0 },
                            { id: 'transactions', label: 'All Transactions', icon: FileText, badge: transactions.length },
                            { id: 'settings', label: 'Settings', icon: Settings }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center px-1 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4 mr-2" />
                                {tab.label}
                                {tab.badge > 0 && (
                                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id
                                            ? 'bg-blue-100 text-blue-600'
                                            : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {tab.badge}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'stripe' && (
                    <StripePaymentsTab
                        payments={stripePayments}
                        summary={stripeSummary}
                        expandedRows={expandedRows}
                        toggleRow={toggleRow}
                        onCapture={handleCapturePayment}
                        onSync={handleSyncStripe}
                        syncing={syncing}
                    />
                )}

                {activeTab === 'dashboard' && (
                    <DashboardTab
                        data={dashboardData}
                        onViewTransaction={handleViewTransaction}
                    />
                )}

                {activeTab === 'pending' && (
                    <PendingPayoutsTab
                        data={pendingPayouts}
                        onProcessPayout={handleProcessPayout}
                        onBulkPayout={handleBulkPayout}
                        onViewTransaction={handleViewTransaction}
                        processing={processingPayout}
                    />
                )}

                {activeTab === 'transactions' && (
                    <TransactionsTab
                        transactions={transactions}
                        filters={filters}
                        setFilters={setFilters}
                        pagination={pagination}
                        onViewTransaction={handleViewTransaction}
                    />
                )}

                {activeTab === 'settings' && (
                    <SettingsTab
                        settings={settings}
                        onSave={fetchSettings}
                    />
                )}
            </div>

            {/* Transaction Detail Modal */}
            {showTransactionModal && selectedTransaction && (
                <TransactionDetailModal
                    transaction={selectedTransaction}
                    onClose={() => setShowTransactionModal(false)}
                    onRefund={handleRefund}
                    onProcessPayout={handleProcessPayout}
                />
            )}
        </div>
    );
};

// ==================== STRIPE PAYMENTS TAB ====================
const StripePaymentsTab = ({ payments, summary, expandedRows, toggleRow, onCapture, onSync, syncing }) => {

    const getStatusBadge = (status) => {
        const config = {
            succeeded: { bg: 'bg-green-100', text: 'text-green-800', label: 'Captured' },
            requires_capture: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Authorized (Uncaptured)' },
            canceled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Canceled' },
            requires_payment_method: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Requires Payment' },
            processing: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Processing' }
        };
        const { bg, text, label } = config[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
        return (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
                {label}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            {summary && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <SummaryCard
                        title="Total Payments"
                        value={summary.total}
                        icon={CreditCard}
                        color="blue"
                    />
                    <SummaryCard
                        title="Captured"
                        value={summary.succeeded}
                        icon={CheckCircle}
                        color="green"
                    />
                    <SummaryCard
                        title="Authorized"
                        value={summary.uncaptured}
                        subtitle="Ready to capture"
                        icon={Clock}
                        color="yellow"
                    />
                    <SummaryCard
                        title="With Tasker Data"
                        value={summary.withTaskerData}
                        icon={Users}
                        color="purple"
                    />
                    <SummaryCard
                        title="Total Amount"
                        value={`$${summary.totalAmount}`}
                        subtitle={`Tasker Earnings: $${summary.totalTaskerEarnings}`}
                        icon={DollarSign}
                        color="green"
                    />
                </div>
            )}

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-medium text-blue-900">Direct Stripe Data with Tasker Information</h4>
                        <p className="text-sm text-blue-700 mt-1">
                            This shows payments from Stripe enriched with <strong>Client</strong> (who paid) and <strong>Tasker</strong> (who receives payout) data from your database.
                            Click on any row to see full details. Use "Sync from Stripe" to import payments for payout processing.
                        </p>
                    </div>
                </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Stripe Payment Intents</h3>
                    <button
                        onClick={onSync}
                        disabled={syncing}
                        className="flex items-center px-3 py-1.5 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 disabled:opacity-50"
                    >
                        {syncing ? (
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                            <Database className="w-4 h-4 mr-1" />
                        )}
                        Sync All
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-10"></th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client (Payer)</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tasker (Payee)</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Breakdown</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {payments.map((payment) => (
                                <React.Fragment key={payment.id}>
                                    {/* Main Row */}
                                    <tr className={`hover:bg-gray-50 ${expandedRows[payment.id] ? 'bg-blue-50' : ''}`}>
                                        <td className="px-4 py-4">
                                            <button
                                                onClick={() => toggleRow(payment.id)}
                                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                                            >
                                                {expandedRows[payment.id] ? (
                                                    <ChevronUp className="w-4 h-4 text-gray-500" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div>
                                                <span className="text-lg font-bold text-gray-900">
                                                    ${payment.amount}
                                                </span>
                                                <span className="text-sm text-gray-500 ml-1">
                                                    {payment.currency}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            {getStatusBadge(payment.status)}
                                        </td>
                                        <td className="px-4 py-4">
                                            {payment.client ? (
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {payment.client.name || 'Unknown'}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {payment.client.email}
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="text-sm text-gray-500">
                                                    {payment.stripeCustomer?.email || 'Unknown'}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            {payment.tasker ? (
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {payment.tasker.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {payment.tasker.email}
                                                    </p>
                                                    {payment.tasker.hasStripeConnect ? (
                                                        <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs bg-green-100 text-green-700">
                                                            <CheckCircle className="w-3 h-3 mr-1" />
                                                            Stripe Connected
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs bg-yellow-100 text-yellow-700">
                                                            <AlertCircle className="w-3 h-3 mr-1" />
                                                            No Stripe
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex items-center text-red-500">
                                                    <AlertCircle className="w-4 h-4 mr-1" />
                                                    <span className="text-sm">No tasker found</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            {payment.task ? (
                                                <div className="max-w-[200px]">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {payment.task.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Status: {payment.task.status}
                                                    </p>
                                                </div>
                                            ) : payment.taskId ? (
                                                <span className="text-xs text-gray-400 font-mono">
                                                    {payment.taskId.substring(0, 12)}...
                                                </span>
                                            ) : (
                                                <span className="text-sm text-gray-400">N/A</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            {payment.breakdown && (
                                                <div className="text-sm space-y-1">
                                                    <div className="flex items-center text-green-600">
                                                        <Percent className="w-3 h-3 mr-1" />
                                                        <span>Fee: ${payment.breakdown.platformFee}</span>
                                                    </div>
                                                    <div className="flex items-center text-blue-600 font-bold">
                                                        <Dollar className="w-3 h-3 mr-1" />
                                                        <span>Tasker: ${payment.breakdown.taskerEarnings}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                                            {new Date(payment.created).toLocaleDateString()}
                                            <br />
                                            <span className="text-xs">
                                                {new Date(payment.created).toLocaleTimeString()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                {payment.existsInDatabase ? (
                                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-700">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        Synced
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-400">Not synced</span>
                                                )}
                                                {payment.canCapture && payment.taskId && (
                                                    <button
                                                        onClick={() => onCapture(payment.id, payment.taskId)}
                                                        className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                                                    >
                                                        Capture
                                                    </button>
                                                )}
                                                <a
                                                    href={`https://dashboard.stripe.com/payments/${payment.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                                                    title="View in Stripe Dashboard"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Expanded Details Row */}
                                    {expandedRows[payment.id] && (
                                        <tr className="bg-gray-50">
                                            <td colSpan={9} className="px-4 py-6">
                                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                    {/* Payment Details */}
                                                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                                                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                                                            <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
                                                            Payment Details
                                                        </h4>
                                                        <div className="space-y-3 text-sm">
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-500">Payment ID</span>
                                                                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                                                    {payment.id.substring(0, 20)}...
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-500">Total Amount</span>
                                                                <span className="font-bold text-gray-900">
                                                                    ${payment.amount} {payment.currency}
                                                                </span>
                                                            </div>
                                                            {payment.breakdown && (
                                                                <>
                                                                    <div className="flex justify-between">
                                                                        <span className="text-gray-500">
                                                                            Platform Fee ({payment.breakdown.platformFeePercentage}%)
                                                                        </span>
                                                                        <span className="text-green-600 font-medium">
                                                                            ${payment.breakdown.platformFee}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex justify-between border-t pt-2">
                                                                        <span className="font-medium text-gray-900">Tasker Earnings</span>
                                                                        <span className="font-bold text-blue-600 text-lg">
                                                                            ${payment.breakdown.taskerEarnings}
                                                                        </span>
                                                                    </div>
                                                                </>
                                                            )}
                                                            {payment.paymentMethod && (
                                                                <div className="flex justify-between pt-2 border-t">
                                                                    <span className="text-gray-500">Card</span>
                                                                    <span className="flex items-center">
                                                                        <CreditCard className="w-4 h-4 mr-1 text-gray-400" />
                                                                        {payment.paymentMethod.brand} •••• {payment.paymentMethod.last4}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-500">Status</span>
                                                                {getStatusBadge(payment.status)}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Client Details */}
                                                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                                                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                                                            <User className="w-4 h-4 mr-2 text-orange-600" />
                                                            Client (Task Poster / Payer)
                                                        </h4>
                                                        {payment.client ? (
                                                            <div className="space-y-3">
                                                                <div className="flex items-center">
                                                                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                                                                        <User className="w-5 h-5 text-orange-600" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-medium text-gray-900">
                                                                            {payment.client.name}
                                                                        </p>
                                                                        <p className="text-xs text-gray-500">Client</p>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2 text-sm">
                                                                    <div className="flex items-center text-gray-600">
                                                                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                                                        {payment.client.email}
                                                                    </div>
                                                                    {payment.client.phone && (
                                                                        <div className="flex items-center text-gray-600">
                                                                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                                                            {payment.client.phone}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-4">
                                                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                                                    <User className="w-6 h-6 text-gray-400" />
                                                                </div>
                                                                <p className="text-gray-500 text-sm">
                                                                    Stripe Customer: {payment.stripeCustomer?.email}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Tasker Details */}
                                                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                                                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                                                            <Users className="w-4 h-4 mr-2 text-blue-600" />
                                                            Tasker (Receives Payout)
                                                        </h4>
                                                        {payment.tasker ? (
                                                            <div className="space-y-3">
                                                                <div className="flex items-center">
                                                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                                        <Users className="w-5 h-5 text-blue-600" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-medium text-gray-900">
                                                                            {payment.tasker.name}
                                                                        </p>
                                                                        <p className="text-xs text-gray-500">Tasker</p>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2 text-sm">
                                                                    <div className="flex items-center text-gray-600">
                                                                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                                                        {payment.tasker.email}
                                                                    </div>
                                                                    {payment.tasker.phone && (
                                                                        <div className="flex items-center text-gray-600">
                                                                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                                                            {payment.tasker.phone}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="pt-2 border-t">
                                                                    {payment.tasker.hasStripeConnect ? (
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                                                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                                                Stripe Connect Active
                                                                            </span>
                                                                            <Zap className="w-5 h-5 text-green-500" />
                                                                        </div>
                                                                    ) : (
                                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                                                                            <AlertCircle className="w-4 h-4 mr-1" />
                                                                            Manual Payout Required
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {payment.breakdown && (
                                                                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                                                        <p className="text-sm text-blue-600">Payout Amount</p>
                                                                        <p className="text-2xl font-bold text-blue-700">
                                                                            ${payment.breakdown.taskerEarnings}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="bg-red-50 p-4 rounded-lg text-center">
                                                                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                                                                <p className="text-red-700 font-medium">No Tasker Found</p>
                                                                <p className="text-red-600 text-sm mt-1">
                                                                    Check if the task has an assigned tasker or accepted bid.
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Task Details */}
                                                {payment.task && (
                                                    <div className="mt-4 bg-white p-4 rounded-lg border shadow-sm">
                                                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                                            <FileText className="w-4 h-4 mr-2 text-purple-600" />
                                                            Task Details
                                                        </h4>
                                                        <div className="flex flex-wrap gap-4">
                                                            <div>
                                                                <p className="text-sm text-gray-500">Title</p>
                                                                <p className="font-medium text-gray-900">{payment.task.title}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-gray-500">Status</p>
                                                                <p className="font-medium text-gray-900 capitalize">{payment.task.status}</p>
                                                            </div>
                                                            {payment.task.budget && (
                                                                <div>
                                                                    <p className="text-sm text-gray-500">Budget</p>
                                                                    <p className="font-medium text-gray-900">${payment.task.budget}</p>
                                                                </div>
                                                            )}
                                                            <div>
                                                                <p className="text-sm text-gray-500">Task ID</p>
                                                                <p className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                                                    {payment.taskId}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {payment.task.description && (
                                                            <div className="mt-3 pt-3 border-t">
                                                                <p className="text-sm text-gray-500">Description</p>
                                                                <p className="text-gray-700 text-sm mt-1">{payment.task.description}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

                {payments.length === 0 && (
                    <div className="text-center py-12">
                        <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No payments found</h3>
                        <p className="text-gray-500 mt-1">
                            Payments will appear here once customers make transactions.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

// ==================== SUMMARY CARD COMPONENT ====================
const SummaryCard = ({ title, value, subtitle, icon: Icon, color }) => {
    const colorClasses = {
        blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
        green: { bg: 'bg-green-100', text: 'text-green-600' },
        yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
        orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
        purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
        red: { bg: 'bg-red-100', text: 'text-red-600' }
    };

    const { bg, text } = colorClasses[color] || colorClasses.blue;

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <p className={`text-2xl font-bold ${text}`}>{value}</p>
                    {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
                </div>
                <div className={`p-3 rounded-lg ${bg}`}>
                    <Icon className={`w-6 h-6 ${text}`} />
                </div>
            </div>
        </div>
    );
};

// ==================== DASHBOARD TAB ====================
const DashboardTab = ({ data, onViewTransaction }) => {
    if (!data) {
        return (
            <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No data yet</h3>
                <p className="text-gray-500 mt-1">
                    Sync payments from Stripe to see dashboard statistics.
                </p>
            </div>
        );
    }

    const { summary, payoutsByStatus, recentTransactions } = data;

    const stats = [
        {
            title: 'Pending Payouts',
            value: `$${summary?.pendingPayoutsAmount || '0.00'}`,
            subtitle: `${summary?.pendingPayoutsCount || 0} payouts waiting`,
            icon: Clock,
            color: 'orange',
            trend: null
        },
        {
            title: 'This Month Revenue',
            value: `$${summary?.thisMonth?.totalRevenue || '0.00'}`,
            subtitle: `${summary?.thisMonth?.transactionCount || 0} transactions`,
            icon: DollarSign,
            color: 'green',
            trend: summary?.growth?.revenue > 0 ? 'up' : 'down',
            trendValue: `${Math.abs(summary?.growth?.revenue || 0)}%`
        },
        {
            title: 'Platform Earnings',
            value: `$${summary?.thisMonth?.platformFees || '0.00'}`,
            subtitle: 'This month',
            icon: TrendingUp,
            color: 'blue',
            trend: null
        },
        {
            title: 'Tasker Payouts',
            value: `$${summary?.thisMonth?.taskerPayouts || '0.00'}`,
            subtitle: 'This month',
            icon: Users,
            color: 'purple',
            trend: null
        }
    ];

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                            </div>
                            {stat.trend && (
                                <div className={`flex items-center text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {stat.trend === 'up' ? (
                                        <ArrowUpRight className="w-4 h-4" />
                                    ) : (
                                        <ArrowDownRight className="w-4 h-4" />
                                    )}
                                    {stat.trendValue}
                                </div>
                            )}
                        </div>
                        <div className="mt-4">
                            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                            <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
                            <p className="text-xs text-gray-400 mt-1">{stat.subtitle}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Rest of dashboard content... */}
            {payoutsByStatus && payoutsByStatus.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Payout Status Overview
                        </h3>
                        <div className="space-y-4">
                            {payoutsByStatus.map((status, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <StatusBadge status={status.status} />
                                        <span className="ml-2 text-sm text-gray-600">
                                            {status.count} payouts
                                        </span>
                                    </div>
                                    <span className="font-semibold text-gray-900">
                                        ${status.totalAmount}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Quick Actions
                        </h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                <span className="text-blue-700 font-medium">Process All Pending</span>
                                <Send className="w-5 h-5 text-blue-600" />
                            </button>
                            <button className="w-full flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                                <span className="text-green-700 font-medium">Export Report</span>
                                <Download className="w-5 h-5 text-green-600" />
                            </button>
                        </div>
                    </div>

                    {summary && (
                        <div className="bg-white rounded-xl shadow-sm border p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Month Comparison
                            </h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">This Month</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        ${summary.thisMonth?.totalRevenue || '0.00'}
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Last Month</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        ${summary.lastMonth?.totalRevenue || '0.00'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Recent Transactions Table */}
            {recentTransactions && recentTransactions.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border">
                    <div className="p-6 border-b">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Recent Transactions
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tasker</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {recentTransactions.map((txn, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-mono text-sm">{txn.transactionId}</td>
                                        <td className="px-6 py-4 text-sm truncate max-w-[150px]">{txn.task}</td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium">{txn.client?.name}</p>
                                            <p className="text-xs text-gray-500">{txn.client?.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium">{txn.tasker?.name}</p>
                                            <p className="text-xs text-gray-500">{txn.tasker?.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold">${txn.amounts?.total}</p>
                                            <p className="text-xs text-green-600">Fee: ${txn.amounts?.platformFee}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={txn.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => onViewTransaction(txn.transactionId)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

// ==================== PENDING PAYOUTS TAB ====================


// ==================== TRANSACTIONS TAB ====================
const TransactionsTab = ({
    transactions,
    filters,
    setFilters,
    pagination,
    onViewTransaction
}) => {
    const [showFilters, setShowFilters] = useState(false);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    if (!transactions || transactions.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No transactions yet</h3>
                <p className="text-gray-500 mt-1">
                    Sync payments from Stripe to see transactions here.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center px-4 py-2 border rounded-lg ${showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700'
                                }`}
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            Filters
                        </button>
                    </div>
                </div>

                {showFilters && (
                    <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Statuses</option>
                                <option value="authorized">Authorized</option>
                                <option value="captured">Captured</option>
                                <option value="tasker_paid">Tasker Paid</option>
                                <option value="refunded">Refunded</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input
                                type="date"
                                value={filters.startDate}
                                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <input
                                type="date"
                                value={filters.endDate}
                                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => setFilters({
                                    status: '', startDate: '', endDate: '', search: '', page: 1, limit: 10
                                })}
                                className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tasker</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Platform Fee</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {transactions.map((txn) => (
                            <tr key={txn._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <span className="text-sm font-mono text-gray-900">{txn.transactionId}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {txn.type?.replace(/_/g, ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-medium text-gray-900">{txn.client?.name || txn.clientSnapshot?.name}</p>
                                    <p className="text-xs text-gray-500">{txn.client?.email || txn.clientSnapshot?.email}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-medium text-gray-900">{txn.tasker?.name || txn.taskerSnapshot?.name}</p>
                                    <p className="text-xs text-gray-500">{txn.tasker?.email || txn.taskerSnapshot?.email}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-bold text-gray-900">${txn.amounts?.total}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-green-600 font-medium">${txn.amounts?.platformFee}</span>
                                    <span className="text-xs text-gray-500 ml-1">({txn.amounts?.platformFeePercentage}%)</span>
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={txn.status} />
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(txn.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => onViewTransaction(txn._id)}
                                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                {pagination && (
                    <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Showing {((pagination.currentPage - 1) * filters.limit) + 1} to{' '}
                            {Math.min(pagination.currentPage * filters.limit, pagination.totalCount)} of{' '}
                            {pagination.totalCount} transactions
                        </p>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                                disabled={!pagination.hasPrev}
                                className="p-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="px-4 py-2 text-sm">
                                Page {pagination.currentPage} of {pagination.totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                                disabled={!pagination.hasNext}
                                className="p-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ==================== SETTINGS TAB ====================
const SettingsTab = ({ settings, onSave }) => {
    const [formData, setFormData] = useState({
        platformFeePercentage: settings?.platformFeePercentage || 15,
        minimumPayoutAmount: (settings?.minimumPayoutAmount || 2500) / 100,
        payoutSchedule: settings?.payoutSchedule || 'weekly',
        payoutDay: settings?.payoutDay || 'friday',
        autoPayoutEnabled: settings?.autoPayoutEnabled || false,
        holdPeriodDays: settings?.holdPeriodDays || 7
    });
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.put(
                `${API_BASE}/admin/payments/settings`,
                {
                    ...formData,
                    minimumPayoutAmount: formData.minimumPayoutAmount * 100
                },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            toast.success('Settings saved successfully!');
            onSave();
        } catch (error) {
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-2xl">
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Platform Payment Settings</h3>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Platform Fee Percentage</label>
                        <div className="relative">
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={formData.platformFeePercentage}
                                onChange={(e) => setFormData({ ...formData, platformFeePercentage: parseFloat(e.target.value) })}
                                className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">The percentage deducted from each transaction</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Payout Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.minimumPayoutAmount}
                                onChange={(e) => setFormData({ ...formData, minimumPayoutAmount: parseFloat(e.target.value) })}
                                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hold Period (Days)</label>
                        <input
                            type="number"
                            min="0"
                            max="30"
                            value={formData.holdPeriodDays}
                            onChange={(e) => setFormData({ ...formData, holdPeriodDays: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="mt-1 text-sm text-gray-500">Days to hold funds before allowing payout</p>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <h4 className="font-medium text-gray-900">Auto-Process Payouts</h4>
                            <p className="text-sm text-gray-500">Automatically process payouts on schedule</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.autoPayoutEnabled}
                                onChange={(e) => setFormData({ ...formData, autoPayoutEnabled: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

// ==================== TRANSACTION DETAIL MODAL ====================
const TransactionDetailModal = ({ transaction, onClose, onRefund, onProcessPayout }) => {
    const [refundReason, setRefundReason] = useState('');
    const [showRefundConfirm, setShowRefundConfirm] = useState(false);

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

                <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Transaction Details</h2>
                            <p className="text-sm text-gray-500 font-mono">{transaction.transactionId}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Status */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <StatusBadge status={transaction.status} large />
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Payout Status</p>
                                <StatusBadge status={transaction.taskerPayout?.status || 'N/A'} />
                            </div>
                        </div>

                        {/* Amount Breakdown */}
                        <div className="border rounded-lg overflow-hidden">
                            <div className="bg-gray-50 px-4 py-3 border-b">
                                <h3 className="font-medium text-gray-900">Amount Breakdown</h3>
                            </div>
                            <div className="p-4 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Amount</span>
                                    <span className="font-bold text-gray-900">${transaction.amounts?.total}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Platform Fee ({transaction.amounts?.platformFeePercentage}%)</span>
                                    <span className="font-medium text-green-600">-${transaction.amounts?.platformFee}</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between">
                                    <span className="font-medium text-gray-900">Tasker Earnings</span>
                                    <span className="font-bold text-blue-600 text-lg">${transaction.amounts?.taskerEarnings}</span>
                                </div>
                            </div>
                        </div>

                        {/* Client Info */}
                        <div className="border rounded-lg overflow-hidden">
                            <div className="bg-gray-50 px-4 py-3 border-b flex items-center">
                                <User className="w-4 h-4 mr-2 text-orange-600" />
                                <h3 className="font-medium text-gray-900">Client Information (Payer)</h3>
                            </div>
                            <div className="p-4">
                                <p className="font-medium text-gray-900">{transaction.clientSnapshot?.name}</p>
                                <p className="text-sm text-gray-500">{transaction.clientSnapshot?.email}</p>
                            </div>
                        </div>

                        {/* Tasker Info */}
                        <div className="border rounded-lg overflow-hidden">
                            <div className="bg-gray-50 px-4 py-3 border-b flex items-center">
                                <Users className="w-4 h-4 mr-2 text-blue-600" />
                                <h3 className="font-medium text-gray-900">Tasker Information (Receives Payout)</h3>
                            </div>
                            <div className="p-4">
                                <p className="font-medium text-gray-900">{transaction.taskerSnapshot?.name}</p>
                                <p className="text-sm text-gray-500">{transaction.taskerSnapshot?.email}</p>
                                <div className="mt-2">
                                    {transaction.taskerSnapshot?.stripeConnectAccountId ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Stripe Connected
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            No Stripe Account
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Task Info */}
                        <div className="border rounded-lg overflow-hidden">
                            <div className="bg-gray-50 px-4 py-3 border-b">
                                <h3 className="font-medium text-gray-900">Task Information</h3>
                            </div>
                            <div className="p-4">
                                <p className="font-medium text-gray-900">{transaction.taskSnapshot?.title}</p>
                                {transaction.taskSnapshot?.description && (
                                    <p className="text-sm text-gray-500 mt-1">{transaction.taskSnapshot.description}</p>
                                )}
                            </div>
                        </div>

                        {/* Status History */}
                        {transaction.statusHistory && transaction.statusHistory.length > 0 && (
                            <div className="border rounded-lg overflow-hidden">
                                <div className="bg-gray-50 px-4 py-3 border-b">
                                    <h3 className="font-medium text-gray-900">Status History</h3>
                                </div>
                                <div className="p-4">
                                    <div className="space-y-3">
                                        {transaction.statusHistory.map((history, index) => (
                                            <div key={index} className="flex items-start">
                                                <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full mr-3" />
                                                <div>
                                                    <p className="font-medium text-gray-900">{history.status?.replace(/_/g, ' ')}</p>
                                                    <p className="text-xs text-gray-500">{new Date(history.changedAt).toLocaleString()}</p>
                                                    {history.reason && <p className="text-sm text-gray-600 mt-1">{history.reason}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Stripe Info */}
                        <div className="border rounded-lg overflow-hidden">
                            <div className="bg-gray-50 px-4 py-3 border-b">
                                <h3 className="font-medium text-gray-900">Stripe Information</h3>
                            </div>
                            <div className="p-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Payment Intent ID</span>
                                    <span className="font-mono text-gray-900 text-xs">{transaction.stripePaymentIntentId}</span>
                                </div>
                                {transaction.stripeTransferId && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Transfer ID</span>
                                        <span className="font-mono text-gray-900 text-xs">{transaction.stripeTransferId}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Refund Confirmation */}
                        {showRefundConfirm && (
                            <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                                <h4 className="font-medium text-red-800 mb-2">Confirm Refund</h4>
                                <textarea
                                    placeholder="Reason for refund..."
                                    value={refundReason}
                                    onChange={(e) => setRefundReason(e.target.value)}
                                    className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 mb-3"
                                    rows={3}
                                />
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => onRefund(transaction._id, refundReason)}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    >
                                        Confirm Refund
                                    </button>
                                    <button
                                        onClick={() => setShowRefundConfirm(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-between">
                        <div>
                            {['authorized', 'captured'].includes(transaction.status) && (
                                <button
                                    onClick={() => setShowRefundConfirm(true)}
                                    className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                                >
                                    Issue Refund
                                </button>
                            )}
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                            >
                                Close
                            </button>
                            {transaction.status === 'captured' && transaction.taskerPayout?.status === 'pending' && (
                                <button
                                    onClick={() => onProcessPayout(transaction._id)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Process Payout
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==================== STATUS BADGE COMPONENT ====================
const StatusBadge = ({ status, large = false }) => {
    const statusConfig = {
        pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
        authorized: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Authorized' },
        captured: { bg: 'bg-green-100', text: 'text-green-800', label: 'Captured' },
        tasker_payout_pending: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Payout Pending' },
        tasker_payout_processing: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Processing' },
        tasker_paid: { bg: 'bg-green-100', text: 'text-green-800', label: 'Paid' },
        completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
        refunded: { bg: 'bg-red-100', text: 'text-red-800', label: 'Refunded' },
        failed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Failed' },
        cancelled: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Cancelled' }
    };

    const config = statusConfig[status] || {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        label: status?.replace(/_/g, ' ') || 'Unknown'
    };

    return (
        <span className={`inline-flex items-center rounded-full font-medium ${config.bg} ${config.text} ${large ? 'px-4 py-1.5 text-sm' : 'px-2.5 py-0.5 text-xs'}`}>
            {config.label}
        </span>
    );
};

export default PaymentManagement;