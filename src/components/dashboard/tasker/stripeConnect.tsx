// components/tasker/StripeConnect.tsx

"use client"

import React, { useState, useEffect } from 'react'
import {
    CreditCard,
    CheckCircle,
    AlertCircle,
    ExternalLink,
    RefreshCw,
    Building2,
    DollarSign,
    Clock,
    ArrowRight,
    Shield,
    Loader2,
    XCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import axios from 'axios'

const API_BASE_URL = '/api/stripe-connect'

// Create axios instance with auth
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

interface ConnectStatus {
    connected: boolean
    status: 'not_connected' | 'pending' | 'active' | 'restricted'
    accountId?: string
    canReceivePayouts: boolean
    chargesEnabled?: boolean
    detailsSubmitted?: boolean
    requirements?: {
        currentlyDue: string[]
        eventuallyDue: string[]
        pastDue: string[]
        disabledReason?: string
    }
    payoutsSchedule?: {
        interval: string
        delay_days: number
    }
    defaultCurrency?: string
}

interface BalanceInfo {
    available: { amount: string; currency: string }[]
    pending: { amount: string; currency: string }[]
}

interface PayoutHistory {
    id: string
    amount: string
    currency: string
    status: string
    arrivalDate: string
    created: string
    method: string
    description: string
}

const StripeConnect = () => {
    const [status, setStatus] = useState<ConnectStatus | null>(null)
    const [balance, setBalance] = useState<BalanceInfo | null>(null)
    const [payouts, setPayouts] = useState<PayoutHistory[]>([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchConnectStatus()
    }, [])

    const fetchConnectStatus = async () => {
        try {
            setLoading(true)
            setError(null)
            const { data } = await api.get('/status')
            setStatus(data)

            // If connected and active, fetch balance and payouts
            if (data.connected && data.status === 'active') {
                await Promise.all([
                    fetchBalance(),
                    fetchPayoutHistory()
                ])
            }
        } catch (err: any) {
            console.error('Failed to fetch Connect status:', err)
            setError(err.response?.data?.error || 'Failed to load payout settings')
        } finally {
            setLoading(false)
        }
    }

    const fetchBalance = async () => {
        try {
            const { data } = await api.get('/balance')
            setBalance(data.balance)
        } catch (err) {
            console.error('Failed to fetch balance:', err)
        }
    }

    const fetchPayoutHistory = async () => {
        try {
            const { data } = await api.get('/payouts?limit=5')
            setPayouts(data.payouts)
        } catch (err) {
            console.error('Failed to fetch payouts:', err)
        }
    }

    const handleSetupPayouts = async () => {
        try {
            setActionLoading(true)
            setError(null)
            const { data } = await api.post('/create-account')

            // Redirect to Stripe onboarding
            window.location.href = data.onboardingUrl
        } catch (err: any) {
            console.error('Failed to create Connect account:', err)
            setError(err.response?.data?.error || 'Failed to start payout setup')
        } finally {
            setActionLoading(false)
        }
    }

    const handleContinueOnboarding = async () => {
        try {
            setActionLoading(true)
            setError(null)
            const { data } = await api.post('/onboarding-link')
            window.location.href = data.onboardingUrl
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to continue setup')
        } finally {
            setActionLoading(false)
        }
    }

    const handleViewDashboard = async () => {
        try {
            setActionLoading(true)
            setError(null)
            const { data } = await api.post('/dashboard-link')
            window.open(data.dashboardUrl, '_blank')
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to open dashboard')
        } finally {
            setActionLoading(false)
        }
    }

    const getStatusBadge = () => {
        if (!status) return null

        const statusConfig = {
            not_connected: { label: 'Not Connected', color: 'bg-gray-100 text-gray-700' },
            pending: { label: 'Pending Verification', color: 'bg-yellow-100 text-yellow-700' },
            active: { label: 'Active', color: 'bg-green-100 text-green-700' },
            restricted: { label: 'Restricted', color: 'bg-red-100 text-red-700' }
        }

        const config = statusConfig[status.status]
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                {config.label}
            </span>
        )
    }

    // Error Alert Component
    const ErrorAlert = ({ message }: { message: string }) => (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
                <p className="font-medium text-red-800">Error</p>
                <p className="text-sm text-red-600">{message}</p>
            </div>
            <button
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
            >
                <XCircle className="w-4 h-4" />
            </button>
        </div>
    )

    // Warning Alert Component
    const WarningAlert = ({ title, message }: { title: string; message: string }) => (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
                <p className="font-medium text-yellow-800">{title}</p>
                <p className="text-sm text-yellow-600">{message}</p>
            </div>
        </div>
    )

    // Loading State
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#109C3D] mx-auto" />
                    <p className="mt-2 text-gray-500">Loading payout settings...</p>
                </div>
            </div>
        )
    }

    // Not Connected State
    if (!status?.connected || status.status === 'not_connected') {
        return (
            <div className="max-w-3xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Payout Settings</h1>
                    <p className="text-gray-500 mt-1">Set up your account to receive payments</p>
                </div>

                {error && <ErrorAlert message={error} />}

                <Card className="border-2 border-dashed border-gray-200">
                    <CardContent className="pt-6">
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-[#109C3D]/10 rounded-full flex items-center justify-center mx-auto">
                                <CreditCard className="w-8 h-8 text-[#109C3D]" />
                            </div>
                            <h3 className="mt-4 text-xl font-semibold text-gray-900">
                                Set Up Payouts
                            </h3>
                            <p className="mt-2 text-gray-500 max-w-md mx-auto">
                                Connect your bank account to receive automatic payouts when you complete tasks.
                                Secure payments powered by Stripe.
                            </p>

                            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-lg mx-auto">
                                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                                    <DollarSign className="w-6 h-6 text-[#109C3D]" />
                                    <span className="mt-2 text-sm font-medium">Automatic Payouts</span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                                    <Shield className="w-6 h-6 text-[#109C3D]" />
                                    <span className="mt-2 text-sm font-medium">Secure & Safe</span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                                    <Clock className="w-6 h-6 text-[#109C3D]" />
                                    <span className="mt-2 text-sm font-medium">Fast Deposits</span>
                                </div>
                            </div>

                            <Button
                                onClick={handleSetupPayouts}
                                disabled={actionLoading}
                                className="mt-8 bg-[#109C3D] hover:bg-[#0d8a35] text-white px-8 py-3 rounded-xl"
                                size="lg"
                            >
                                {actionLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Setting up...
                                    </>
                                ) : (
                                    <>
                                        Get Started
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>

                            <p className="mt-4 text-xs text-gray-400">
                                You'll be redirected to Stripe to securely enter your details
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Info Cards */}
                <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-[#109C3D]" />
                                What you'll need
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="text-sm text-gray-600 space-y-2">
                                <li>• Bank account details (routing & account number)</li>
                                <li>• Government-issued ID</li>
                                <li>• Social Security Number (last 4 digits)</li>
                                <li>• Personal address</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Clock className="w-4 h-4 text-[#109C3D]" />
                                How payouts work
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="text-sm text-gray-600 space-y-2">
                                <li>• Client approves your completed work</li>
                                <li>• Payment is automatically transferred</li>
                                <li>• Money deposits to your bank (1-2 days)</li>
                                <li>• Track all earnings in your dashboard</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    // Pending Verification State
    if (status.status === 'pending') {
        return (
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Payout Settings</h1>
                        <p className="text-gray-500 mt-1">Complete your setup to start receiving payments</p>
                    </div>
                    {getStatusBadge()}
                </div>

                {error && <ErrorAlert message={error} />}

                <WarningAlert
                    title="Verification Pending"
                    message="Please complete your Stripe onboarding to enable payouts. This usually takes just a few minutes."
                />

                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center py-6">
                            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                                <Clock className="w-8 h-8 text-yellow-600" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold">Complete Your Setup</h3>
                            <p className="mt-2 text-gray-500">
                                You're almost there! Complete the verification to start receiving payments.
                            </p>

                            {status.requirements?.currentlyDue && status.requirements.currentlyDue.length > 0 && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg text-left max-w-md mx-auto">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Items needed:</p>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        {status.requirements.currentlyDue.slice(0, 5).map((item, index) => (
                                            <li key={index}>• {item.replace(/_/g, ' ')}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <Button
                                onClick={handleContinueOnboarding}
                                disabled={actionLoading}
                                className="mt-6 bg-[#109C3D] hover:bg-[#0d8a35]"
                            >
                                {actionLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Continue Setup
                                <ExternalLink className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Restricted State
    if (status.status === 'restricted') {
        return (
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Payout Settings</h1>
                        <p className="text-gray-500 mt-1">Action required for your account</p>
                    </div>
                    {getStatusBadge()}
                </div>

                {/* Restricted Error Box */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium text-red-800">Account Restricted</p>
                        <p className="text-sm text-red-600">
                            {status.requirements?.disabledReason || 'Your account has restrictions. Please update your information.'}
                        </p>
                    </div>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center py-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                                <AlertCircle className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold">Update Required</h3>
                            <p className="mt-2 text-gray-500">
                                Please update your account information to continue receiving payouts.
                            </p>

                            {status.requirements?.pastDue && status.requirements.pastDue.length > 0 && (
                                <div className="mt-4 p-4 bg-red-50 rounded-lg text-left max-w-md mx-auto">
                                    <p className="text-sm font-medium text-red-700 mb-2">Overdue items:</p>
                                    <ul className="text-sm text-red-600 space-y-1">
                                        {status.requirements.pastDue.map((item, index) => (
                                            <li key={index}>• {item.replace(/_/g, ' ')}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <Button
                                onClick={handleContinueOnboarding}
                                disabled={actionLoading}
                                className="mt-6 bg-red-600 hover:bg-red-700 text-white"
                            >
                                {actionLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Update Information
                                <ExternalLink className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Active State - Full Dashboard
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Payout Settings</h1>
                    <p className="text-gray-500 mt-1">Manage your earnings and payouts</p>
                </div>
                <div className="flex items-center gap-3">
                    {getStatusBadge()}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchConnectStatus}
                        disabled={loading}
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            {error && <ErrorAlert message={error} />}

            {/* Balance Cards */}
            <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-gradient-to-br from-[#109C3D] to-[#0d8a35] text-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium text-white/90">
                            Available Balance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            ${balance?.available[0]?.amount || '0.00'}
                        </div>
                        <p className="text-sm text-white/70 mt-1">
                            Ready for payout
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium text-gray-700">
                            Pending Balance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">
                            ${balance?.pending[0]?.amount || '0.00'}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            Processing (1-2 days)
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Account Status */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-[#109C3D]" />
                        Account Status
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className={`w-3 h-3 rounded-full ${status.canReceivePayouts ? 'bg-green-500' : 'bg-red-500'}`} />
                            <div>
                                <p className="text-sm font-medium">Payouts</p>
                                <p className="text-xs text-gray-500">
                                    {status.canReceivePayouts ? 'Enabled' : 'Disabled'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className={`w-3 h-3 rounded-full ${status.chargesEnabled ? 'bg-green-500' : 'bg-red-500'}`} />
                            <div>
                                <p className="text-sm font-medium">Charges</p>
                                <p className="text-xs text-gray-500">
                                    {status.chargesEnabled ? 'Enabled' : 'Disabled'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <div>
                                <p className="text-sm font-medium">Verification</p>
                                <p className="text-xs text-gray-500">Complete</p>
                            </div>
                        </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium">Payout Schedule</p>
                            <p className="text-xs text-gray-500">
                                {status.payoutsSchedule?.interval || 'Daily'} automatic payouts
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={handleViewDashboard}
                            disabled={actionLoading}
                        >
                            {actionLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Stripe Dashboard
                            <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Payouts */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-[#109C3D]" />
                        Recent Payouts
                    </CardTitle>
                    <CardDescription>
                        Your recent payout history
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {payouts.length > 0 ? (
                        <div className="space-y-3">
                            {payouts.map((payout) => (
                                <div
                                    key={payout.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${payout.status === 'paid' ? 'bg-green-500' :
                                                payout.status === 'pending' ? 'bg-yellow-500' :
                                                    payout.status === 'in_transit' ? 'bg-blue-500' :
                                                        'bg-gray-500'
                                            }`} />
                                        <div>
                                            <p className="text-sm font-medium">
                                                ${payout.amount} {payout.currency.toUpperCase()}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(payout.created).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-xs px-2 py-1 rounded-full ${payout.status === 'paid' ? 'bg-green-100 text-green-700' :
                                                payout.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    payout.status === 'in_transit' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-gray-100 text-gray-700'
                                            }`}>
                                            {payout.status}
                                        </span>
                                        {payout.arrivalDate && (
                                            <p className="text-xs text-gray-400 mt-1">
                                                Arrives: {new Date(payout.arrivalDate).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <DollarSign className="w-12 h-12 mx-auto text-gray-300" />
                            <p className="mt-2">No payouts yet</p>
                            <p className="text-sm">Complete tasks to start earning!</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Help Section */}
            <Card className="bg-gray-50">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-[#109C3D]/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <Shield className="w-5 h-5 text-[#109C3D]" />
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900">Secure Payments</h4>
                            <p className="text-sm text-gray-500 mt-1">
                                Your payments are processed securely through Stripe, trusted by millions of businesses worldwide.
                                We never store your bank details on our servers.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default StripeConnect