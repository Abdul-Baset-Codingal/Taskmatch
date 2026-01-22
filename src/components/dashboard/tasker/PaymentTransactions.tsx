"use client"

import {
    FileText,
    CreditCard,
    MoreHorizontal,
    Download,
    Calendar,
    DollarSign,
    User,
    CheckCircle,
    Clock,
    AlertTriangle,
    RefreshCw,
    ExternalLink,
    Loader2,
    XCircle,
    TrendingUp,
    Wallet,
    Receipt,
    ArrowDownRight,
    ArrowUpRight,
    Banknote,
    PiggyBank
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/app/lib/utils"
import { toast } from "react-toastify"

// Types
interface TransactionDetails {
    taskId: string;
    taskTitle: string;
    client: {
        id: string;
        name: string;
        email: string;
        profileImage?: string;
    } | null;
    paymentMethod: string;
    bidAmount: number;
    taskerPlatformFee: number;
    taskerTax: number;
    taskerPayout: number;
    platformFeePercent: number;
    taxPercent: number;
    totalDeductionPercent: number;
    authorizedAt: string;
    capturedAt?: string;
    releasedAt?: string;
    currency: string;
    receiptUrl?: string;
}

interface Transaction {
    id: string;
    paymentIntentId: string;
    date: string;
    type: string;
    grossAmount: number;
    netAmount: number;
    amount: number;
    amountFormatted: string;
    description: string;
    status: string;
    taskStatus: string;
    details: TransactionDetails;
}

interface EarningsSummary {
    totalEarned: number;
    totalGross: number;
    totalPending: number;
    pendingGross: number;
    totalDeductions: number;
    completedTasks: number;
    pendingTasks: number;
    totalTasks: number;
    averageEarning: number;
    stripeAccountStatus: string;
    payoutsEnabled: boolean;
    availableBalance: number;
    pendingBalance: number;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

const API_BASE_URL = '';

export function PaymentTransactions() {
    const [activeTab, setActiveTab] = useState<"all" | "received" | "pending" | "cancelled">("all");
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [summary, setSummary] = useState<EarningsSummary | null>(null);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    // Fetch payment history
    const fetchPaymentHistory = useCallback(async (page = 1, type = activeTab) => {
        try {
            setIsLoading(true);

            const response = await fetch(
                `/api/paymentsHistoryTasker/history?page=${page}&limit=20&type=${type}`,
                { credentials: 'include' }
            );

            const data = await response.json();

            if (data.success) {
                setTransactions(data.transactions);
                setPagination(data.pagination);
            } else {
                toast.error(data.error || 'Failed to fetch payments');
            }
        } catch (error) {
            console.error('Error fetching payment history:', error);
            toast.error('Failed to load payment history');
        } finally {
            setIsLoading(false);
        }
    }, [activeTab]);

    // Fetch earnings summary
    const fetchSummary = useCallback(async () => {
        try {
            const response = await fetch(
                `/api/paymentsHistoryTasker/summary`,
                { credentials: 'include' }
            );

            const data = await response.json();

            if (data.success) {
                setSummary(data.summary);
            }
        } catch (error) {
            console.error('Error fetching summary:', error);
        }
    }, []);

    // Initial load
    useEffect(() => {
        fetchPaymentHistory();
        fetchSummary();
    }, [fetchPaymentHistory, fetchSummary]);

    // Refresh when tab changes
    useEffect(() => {
        fetchPaymentHistory(1, activeTab);
    }, [activeTab, fetchPaymentHistory]);

    // Refresh handler
    const handleRefresh = async () => {
        setIsRefreshing(true);
        await Promise.all([fetchPaymentHistory(), fetchSummary()]);
        setIsRefreshing(false);
        toast.success('Earnings data refreshed');
    };

    // Download receipt handler
    const handleDownloadReceipt = async (taskId: string) => {
        try {
            setIsDownloading(true);

            const response = await fetch(
                `/api/paymentsHistoryTasker/receipt/${taskId}`,
                { credentials: 'include' }
            );

            const data = await response.json();

            if (data.success && data.receiptData) {
                // For now, log the data - you can implement PDF generation
                console.log('Receipt Data:', data.receiptData);
                toast.success('Earnings statement generated');

                // You could open a print dialog or generate PDF here
                // For example, open in new window as printable page
            } else {
                toast.error(data.error || 'Failed to get receipt');
            }
        } catch (error) {
            console.error('Error downloading receipt:', error);
            toast.error('Failed to download receipt');
        } finally {
            setIsDownloading(false);
        }
    };

    // Get status styling
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Completed':
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'Held':
            case 'Pending':
            case 'Processing':
                return <Clock className="h-4 w-4 text-yellow-600" />;
            case 'Cancelled':
            case 'Refunded':
                return <XCircle className="h-4 w-4 text-red-600" />;
            default:
                return <AlertTriangle className="h-4 w-4 text-gray-400" />;
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Held':
            case 'Pending':
            case 'Processing':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Cancelled':
            case 'Refunded':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getAmountClass = (amountFormatted: string) => cn(
        "font-semibold",
        amountFormatted.startsWith('+') ? 'text-green-600' : 'text-red-600'
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-CA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-CA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Payments & Earnings</h2>
                    <p className="text-muted-foreground">Track your earnings, payouts, and transaction history</p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="gap-2"
                >
                    <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
                    Refresh
                </Button>
            </div>

           

            {/* Stripe Account Status Banner */}
            {summary && !summary.payoutsEnabled && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium text-amber-800">Complete Your Payment Setup</p>
                        <p className="text-sm text-amber-700 mt-1">
                            {summary.stripeAccountStatus === 'not_connected'
                                ? 'Set up your Stripe account to receive payments from completed tasks.'
                                : 'Your payment account is pending verification. Complete the setup to enable payouts.'}
                        </p>
                        <Button
                            size="sm"
                            className="mt-2 bg-amber-600 hover:bg-amber-700"
                            onClick={() => window.location.href = '/update-document'}
                        >
                            Complete Setup
                        </Button>
                    </div>
                </div>
            )}

            {/* Tab Filters */}
            <div className="flex flex-wrap gap-2">
                {[
                    { key: 'all', label: 'All Transactions' },
                    { key: 'received', label: 'Received' },
                    { key: 'pending', label: 'Pending' },
                    { key: 'cancelled', label: 'Cancelled' },
                ].map((tab) => (
                    <Button
                        key={tab.key}
                        variant={activeTab === tab.key ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveTab(tab.key as typeof activeTab)}
                        className={cn(
                            "transition-all",
                            activeTab === tab.key && "bg-[#063A41] text-white hover:bg-[#063A41]/90"
                        )}
                    >
                        {tab.label}
                    </Button>
                ))}
            </div>

            {/* Transactions Table */}
            <div className="rounded-lg border bg-card shadow-sm">
                <div className="p-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">Loading transactions...</p>
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="text-center py-12">
                            <Banknote className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
                            <p className="text-muted-foreground">
                                {activeTab === 'all'
                                    ? "You haven't received any payments yet. Complete tasks to start earning!"
                                    : `No ${activeTab} transactions found.`
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-2 font-medium text-sm text-foreground">Date</th>
                                        <th className="text-left py-3 px-2 font-medium text-sm text-foreground">Task</th>
                                        <th className="text-left py-3 px-2 font-medium text-sm text-foreground">Type</th>
                                        <th className="text-right py-3 px-2 font-medium text-sm text-foreground">Gross</th>
                                        <th className="text-right py-3 px-2 font-medium text-sm text-foreground">You Receive</th>
                                        <th className="text-left py-3 px-2 font-medium text-sm text-foreground">Status</th>
                                        <th className="text-right py-3 px-2 font-medium text-sm text-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((tx) => (
                                        <tr key={tx.id} className="border-b last:border-b-0 hover:bg-muted/50 transition-colors">
                                            <td className="py-4 px-2 text-sm font-medium text-foreground">
                                                {formatDate(tx.date)}
                                            </td>
                                            <td className="py-4 px-2 text-sm">
                                                <div className="max-w-[200px]">
                                                    <p className="font-medium text-foreground truncate">
                                                        {tx.description}
                                                    </p>
                                                    {tx.details.client && (
                                                        <p className="text-xs text-muted-foreground truncate">
                                                            Client: {tx.details.client.name}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-2 text-sm">
                                                <Badge
                                                    variant="outline"
                                                    className="bg-[#063A41] text-white text-xs"
                                                >
                                                    {tx.type}
                                                </Badge>
                                            </td>
                                            <td className="py-4 px-2 text-right text-sm">
                                                <span className="text-gray-500">
                                                    ${tx.grossAmount.toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="py-4 px-2 text-right text-sm">
                                                <span className={getAmountClass(tx.amountFormatted)}>
                                                    {tx.amountFormatted}
                                                </span>
                                            </td>
                                            <td className="py-4 px-2 text-sm">
                                                <div className="flex items-center gap-1">
                                                    {getStatusIcon(tx.status)}
                                                    <Badge
                                                        variant="outline"
                                                        className={cn("ml-1 text-xs", getStatusBadgeClass(tx.status))}
                                                    >
                                                        {tx.status}
                                                    </Badge>
                                                </div>
                                            </td>
                                            <td className="py-4 px-2 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedTransaction(tx);
                                                        setIsDetailsOpen(true);
                                                    }}
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6 pt-4 border-t">
                            <p className="text-sm text-muted-foreground">
                                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                                {pagination.total} transactions
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={pagination.page === 1}
                                    onClick={() => fetchPaymentHistory(pagination.page - 1)}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={pagination.page === pagination.totalPages}
                                    onClick={() => fetchPaymentHistory(pagination.page + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Transaction Details Dialog */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="lg:max-w-lg w-[90%]  lg:h-[700px] h-[600px] overflow-y-scroll lg:mx-0 mr-10">
                    {selectedTransaction && (
                        <div className="p-6">
                            <DialogHeader className="mb-6">
                                <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
                                    <Banknote className="h-6 w-6" />
                                    Earnings Details
                                </DialogTitle>
                                <DialogDescription className="text-muted-foreground">
                                    Payment for{' '}
                                    <span className="font-medium text-foreground">
                                        {selectedTransaction.description}
                                    </span>
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6">
                                {/* Summary Card */}
                                <div className="rounded-lg p-4 border border-border bg-muted/30">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-semibold text-foreground">Payment Summary</h4>
                                        <Badge className={getStatusBadgeClass(selectedTransaction.status)}>
                                            {selectedTransaction.status}
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span>{formatDateTime(selectedTransaction.date)}</span>
                                        </div>
                                        <div className="flex items-center justify-end gap-2">
                                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                                            <span>{selectedTransaction.details.paymentMethod}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Client Info */}
                                {selectedTransaction.details.client && (
                                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                        <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center">
                                            <User className="h-5 w-5 text-blue-700" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground">
                                                {selectedTransaction.details.client.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Client
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Earnings Breakdown */}
                                <div>
                                    <h4 className="font-semibold mb-3 text-foreground flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                        Earnings Breakdown
                                    </h4>
                                    <div className="space-y-2 bg-gray-50 rounded-lg p-4 border">
                                        {/* Gross Amount */}
                                        <div className="flex justify-between text-sm">
                                            <span className="text-foreground font-medium">Task Earnings (Gross)</span>
                                            <span className="font-semibold text-foreground">
                                                ${selectedTransaction.details.bidAmount?.toFixed(2) || '0.00'}
                                            </span>
                                        </div>

                                        <div className="border-t border-gray-200 my-2 pt-2">
                                            <p className="text-xs text-gray-500 mb-2">Deductions:</p>
                                        </div>

                                        {/* Platform Fee */}
                                        <div className="flex justify-between text-sm pl-3">
                                            <span className="text-muted-foreground">
                                                Platform Fee 
                                            </span>
                                            <span className="font-medium text-red-600">
                                                -${selectedTransaction.details.taskerPlatformFee?.toFixed(2) || '0.00'}
                                            </span>
                                        </div>

                                        {/* Tax */}
                                        <div className="flex justify-between text-sm pl-3">
                                            <span className="text-muted-foreground">
                                                Tax Withholding ({selectedTransaction.details.taxPercent}%)
                                            </span>
                                            <span className="font-medium text-red-600">
                                                -${selectedTransaction.details.taskerTax?.toFixed(2) || '0.00'}
                                            </span>
                                        </div>

                                        {/* Net Amount */}
                                        <div className="flex justify-between text-sm pt-3 border-t-2 border-green-200 mt-3">
                                            <span className="font-bold text-foreground">Your Earnings (Net)</span>
                                            <span className="font-bold text-green-600 text-lg">
                                                ${selectedTransaction.details.taskerPayout?.toFixed(2) || selectedTransaction.netAmount.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                           

                                {/* References */}
                                <div>
                                    <h4 className="font-semibold mb-3 text-foreground flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        References
                                    </h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                                            <span className="text-sm text-foreground">Task ID</span>
                                            <Badge variant="outline" className="text-xs font-mono">
                                                {selectedTransaction.id.slice(-8).toUpperCase()}
                                            </Badge>
                                        </div>
                                        {selectedTransaction.paymentIntentId && (
                                            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                                                <span className="text-sm text-foreground">Payment ID</span>
                                                <Badge variant="outline" className="text-xs font-mono">
                                                    {selectedTransaction.paymentIntentId.slice(-12)}
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                {/* <div className="flex justify-end gap-2 pt-4 border-t border-border">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                        disabled={isDownloading}
                                        onClick={() => handleDownloadReceipt(selectedTransaction.id)}
                                    >
                                        {isDownloading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Download className="h-4 w-4" />
                                        )}
                                        Download Statement
                                    </Button>
                                </div> */}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Footer */}
            <div className="text-center text-sm text-muted-foreground">
                <p>Need help? Contact support for payment issues.</p>
            </div>
        </div>
    )
}

export default PaymentTransactions;