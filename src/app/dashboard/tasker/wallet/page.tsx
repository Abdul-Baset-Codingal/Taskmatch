// @ts-nocheck
// pages/tasker/Wallet.jsx
"use client"
import React, { useState, useEffect } from 'react';
import {
    Wallet,
    CreditCard,
    DollarSign,
    ExternalLink,
    CheckCircle,
    AlertCircle,
    Clock,
    ArrowRight,
    Loader2,
    Building,
    TrendingUp,
    History
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE = '/api';

const TaskerWallet = () => {
    const [loading, setLoading] = useState(true);
    const [connecting, setConnecting] = useState(false);
    const [stripeStatus, setStripeStatus] = useState(null);
    const [balance, setBalance] = useState({ available: '0.00', pending: '0.00' });
    const [payouts, setPayouts] = useState([]);
    const [summary, setSummary] = useState({ totalEarned: '0.00', totalPending: '0.00' });

    // Fetch Stripe Connect status
    const fetchStripeStatus = async () => {
        try {
            const response = await axios.get(
                `${API_BASE}/tasker/stripe/status`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setStripeStatus(response.data);
        } catch (error) {
            console.error('Error fetching Stripe status:', error);
        }
    };

    // Fetch balance
    const fetchBalance = async () => {
        try {
            const response = await axios.get(
                `${API_BASE}/tasker/stripe/balance`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setBalance(response.data.balance);
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    };

    // Fetch payout history
    const fetchPayouts = async () => {
        try {
            const response = await axios.get(
                `${API_BASE}/tasker/payouts`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setPayouts(response.data.payouts || []);
            setSummary(response.data.summary || {});
        } catch (error) {
            console.error('Error fetching payouts:', error);
        }
    };

    // Initial load
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([
                fetchStripeStatus(),
                fetchBalance(),
                fetchPayouts()
            ]);
            setLoading(false);
        };
        loadData();

        // Check URL params for success/refresh
        const params = new URLSearchParams(window.location.search);
        if (params.get('success') === 'true') {
            toast.success('Bank account connected successfully!');
            window.history.replaceState({}, '', '/tasker/wallet');
        }
        if (params.get('refresh') === 'true') {
            toast.info('Please complete your account setup');
            window.history.replaceState({}, '', '/tasker/wallet');
        }
    }, []);

    // Connect to Stripe
    const handleConnectStripe = async () => {
        setConnecting(true);
        try {
            const response = await axios.post(
                `${API_BASE}/tasker/stripe/connect`,
                {},
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            if (response.data.onboardingUrl) {
                // Redirect to Stripe onboarding
                window.location.href = response.data.onboardingUrl;
            }
        } catch (error) {
            console.error('Error connecting Stripe:', error);
            toast.error(error.response?.data?.error || 'Failed to connect');
            setConnecting(false);
        }
    };

    // Open Stripe Dashboard
    const handleOpenDashboard = async () => {
        try {
            const response = await axios.get(
                `${API_BASE}/tasker/stripe/dashboard`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            if (response.data.url) {
                window.open(response.data.url, '_blank');
            }
        } catch (error) {
            toast.error('Failed to open dashboard');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    const isConnected = stripeStatus?.connected && stripeStatus?.chargesEnabled && stripeStatus?.payoutsEnabled;
    const isPending = stripeStatus?.connected && !stripeStatus?.payoutsEnabled;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <Wallet className="w-7 h-7 mr-3 text-blue-600" />
                        My Wallet
                    </h1>
                    <p className="text-gray-500 mt-1">Manage your earnings and payouts</p>
                </div>

                {/* Connection Status Card */}
                <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isConnected ? 'bg-green-100' : isPending ? 'bg-yellow-100' : 'bg-gray-100'
                                }`}>
                                {isConnected ? (
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                ) : isPending ? (
                                    <Clock className="w-6 h-6 text-yellow-600" />
                                ) : (
                                    <Building className="w-6 h-6 text-gray-400" />
                                )}
                            </div>
                            <div className="ml-4">
                                <h3 className="font-semibold text-gray-900">
                                    {isConnected ? 'Bank Account Connected' :
                                        isPending ? 'Setup Pending' :
                                            'Connect Your Bank Account'}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {isConnected ? 'You can receive payouts directly to your bank' :
                                        isPending ? 'Complete your setup to receive payouts' :
                                            'Connect to receive payments from completed tasks'}
                                </p>
                            </div>
                        </div>

                        {isConnected ? (
                            <button
                                onClick={handleOpenDashboard}
                                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View Dashboard
                            </button>
                        ) : (
                            <button
                                onClick={handleConnectStripe}
                                disabled={connecting}
                                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {connecting ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <CreditCard className="w-4 h-4 mr-2" />
                                )}
                                {isPending ? 'Complete Setup' : 'Connect Bank'}
                            </button>
                        )}
                    </div>

                    {/* Requirements Warning */}
                    {stripeStatus?.requirements?.currently_due?.length > 0 && (
                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-start">
                                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                                <div>
                                    <p className="text-yellow-800 font-medium">Action Required</p>
                                    <p className="text-yellow-700 text-sm">
                                        Please complete your account setup to receive payouts.
                                    </p>
                                    <button
                                        onClick={handleConnectStripe}
                                        className="mt-2 text-yellow-800 underline text-sm"
                                    >
                                        Complete Setup →
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Balance Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Available Balance</p>
                                <p className="text-3xl font-bold text-green-600">
                                    ${balance.available}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">Ready for payout</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Pending</p>
                                <p className="text-3xl font-bold text-yellow-600">
                                    ${balance.pending}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">Processing</p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Earned</p>
                                <p className="text-3xl font-bold text-blue-600">
                                    ${summary.totalEarned || '0.00'}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">All time</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payout History */}
                <div className="bg-white rounded-xl shadow-sm border">
                    <div className="p-6 border-b flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 flex items-center">
                            <History className="w-5 h-5 mr-2" />
                            Payout History
                        </h3>
                        <span className="text-sm text-gray-500">
                            {payouts.length} payouts
                        </span>
                    </div>

                    {payouts.length > 0 ? (
                        <div className="divide-y">
                            {payouts.map((payout, index) => (
                                <div key={index} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${payout.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
                                            }`}>
                                            {payout.status === 'completed' ? (
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                            ) : (
                                                <Clock className="w-5 h-5 text-yellow-600" />
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <p className="font-medium text-gray-900">
                                                {payout.taskTitle}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(payout.date).toLocaleDateString()} • {payout.method}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-green-600">
                                            +${payout.amount}
                                        </p>
                                        <p className={`text-xs ${payout.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                                            }`}>
                                            {payout.status === 'completed' ? 'Completed' : 'Processing'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No payouts yet</p>
                            <p className="text-sm text-gray-400 mt-1">
                                Complete tasks to start earning!
                            </p>
                        </div>
                    )}
                </div>

                {/* How it works */}
                <div className="mt-8 bg-blue-50 rounded-xl p-6">
                    <h3 className="font-semibold text-blue-900 mb-4">How Payouts Work</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="flex items-start">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                1
                            </div>
                            <div>
                                <p className="font-medium text-blue-900">Complete Task</p>
                                <p className="text-sm text-blue-700">Client marks task as done</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                2
                            </div>
                            <div>
                                <p className="font-medium text-blue-900">Payment Captured</p>
                                <p className="text-sm text-blue-700">Money secured from client</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                3
                            </div>
                            <div>
                                <p className="font-medium text-blue-900">Payout Processed</p>
                                <p className="text-sm text-blue-700">Admin sends your earnings</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                4
                            </div>
                            <div>
                                <p className="font-medium text-blue-900">Money in Bank</p>
                                <p className="text-sm text-blue-700">1-2 business days</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskerWallet;