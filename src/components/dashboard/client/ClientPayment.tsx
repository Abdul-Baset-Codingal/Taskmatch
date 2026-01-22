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
    Receipt
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/app/lib/utils"
import { toast } from "react-toastify"

// Types
interface TransactionDetails {
    taskId: string;
    taskTitle: string;
    tasker: {
        id: string;
        name: string;
        email: string;
        profileImage?: string;
    } | null;
    paymentMethod: string;
    bidAmount: number;
    clientPlatformFee: number;
    reservationFee: number;
    clientTax: number;
    totalClientPays: number;
    taskerPlatformFee: number;
    taskerTax: number;
    taskerPayout: number;
    authorizedAt: string;
    capturedAt?: string;
    releasedAt?: string;
    refundedAt?: string;
    currency: string;
    stripeStatus: string;
    receiptUrl?: string;
}

interface Transaction {
    id: string;
    paymentIntentId: string;
    date: string;
    type: string;
    amount: number;
    amountFormatted: string;
    description: string;
    status: string;
    taskStatus: string;
    details: TransactionDetails;
}

interface PaymentSummary {
    totalSpent: number;
    totalHeld: number;
    totalRefunded: number;
    completedTasks: number;
    inProgressTasks: number;
    totalTasks: number;
    savedCardsCount: number;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

const API_BASE_URL = '';

export function ClientPayment() {
    const [activeTab, setActiveTab] = useState<"all" | "completed" | "pending" | "refunded">("all");
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [summary, setSummary] = useState<PaymentSummary | null>(null);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);


    console.log(selectedTransaction)

    // Fetch payment history
    const fetchPaymentHistory = useCallback(async (page = 1, type = activeTab) => {
        try {
            setIsLoading(true);

            const response = await fetch(
                `/api/paymentsHistory/client/history?page=${page}&limit=20&type=${type}`,
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

    // Fetch payment summary
    const fetchSummary = useCallback(async () => {
        try {
            const response = await fetch(
                `/api/paymentsHistory/client/summary`,
                { credentials: 'include' }
            );

            const data = await response.json();

            console.log(data)

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
        toast.success('Payment data refreshed');
    };

    // Download receipt handler
    // const handleDownloadReceipt = async (taskId: string) => {
    //     try {
    //         setIsDownloading(true);

    //         const response = await fetch(
    //             `${API_BASE_URL}/api/paymentsHistory/receipt/${taskId}`,
    //             { credentials: 'include' }
    //         );

    //         const data = await response.json();

    //         if (data.success) {
    //             if (data.type === 'stripe_receipt' && data.receiptUrl) {
    //                 // Open Stripe receipt in new tab
    //                 window.open(data.receiptUrl, '_blank');
    //             } else if (data.receiptData) {
    //                 // Generate and download PDF (you can use a library like jsPDF)
    //                 // For now, show the data in console
    //                 console.log('Receipt Data:', data.receiptData);
    //                 toast.success('Receipt data loaded');
    //             }
    //         } else {
    //             toast.error(data.error || 'Failed to get receipt');
    //         }
    //     } catch (error) {
    //         console.error('Error downloading receipt:', error);
    //         toast.error('Failed to download receipt');
    //     } finally {
    //         setIsDownloading(false);
    //     }
    // };

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
            case 'Failed':
                return <XCircle className="h-4 w-4 text-red-600" />;
            case 'Fully Refunded':
            case 'Partially Refunded':
                return <RefreshCw className="h-4 w-4 text-blue-600" />;
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
            case 'Failed':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'Fully Refunded':
            case 'Partially Refunded':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

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
                    <h2 className="text-3xl font-bold tracking-tight">Payments & Transactions</h2>
                    <p className="text-muted-foreground">Track your payments, receipts, and invoices</p>
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

      

            {/* Tab Filters */}
            <div className="flex flex-wrap gap-2">
                {[
                    { key: 'all', label: 'All Transactions' },
                    { key: 'completed', label: 'Completed' },
                    { key: 'pending', label: 'Pending/Held' },
                    { key: 'refunded', label: 'Refunded' },
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
                            <Receipt className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
                            <p className="text-muted-foreground">
                                {activeTab === 'all'
                                    ? "You haven't made any payments yet."
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
                                        <th className="text-right py-3 px-2 font-medium text-sm text-foreground">Amount</th>
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
                                                    {tx.details.tasker && (
                                                        <p className="text-xs text-muted-foreground truncate">
                                                            Tasker: {tx.details.tasker.name}
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
                                                <span className="font-semibold text-red-600">
                                                    -${tx.amount.toFixed(2)}
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
                                                <div className="flex items-center justify-end gap-1">
                                                    {/* Details Button */}
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

                                                    {/* Receipt Button */}
                                                    {tx.details.receiptUrl && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => window.open(tx.details.receiptUrl, '_blank')}
                                                        >
                                                            <ExternalLink className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
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
                                    <CreditCard className="h-6 w-6" />
                                    Transaction Details
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

                                {/* Tasker Info */}
                                {selectedTransaction.details.tasker && (
                                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-100">
                                        <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center">
                                            <User className="h-5 w-5 text-green-700" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground">
                                                {selectedTransaction.details.tasker.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {selectedTransaction.details.tasker.email}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Fee Breakdown */}
                                <div>
                                    <h4 className="font-semibold mb-3 text-foreground flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                        Payment Breakdown
                                    </h4>
                                    <div className="space-y-2 bg-gray-50 rounded-lg p-4 border">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Task Price</span>
                                            <span className="font-medium">
                                                ${selectedTransaction.details.bidAmount?.toFixed(2) || '0.00'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Platform Fee </span>
                                            <span className="font-medium">
                                                ${selectedTransaction.details.clientPlatformFee?.toFixed(2) || '0.00'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Reservation Fee</span>
                                            <span className="font-medium">
                                                ${selectedTransaction.details.reservationFee?.toFixed(2) || '0.00'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">HST (13%)</span>
                                            <span className="font-medium">
                                                ${selectedTransaction.details.clientTax?.toFixed(2) || '0.00'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm pt-2 border-t border-gray-200 mt-2">
                                            <span className="font-bold text-foreground">Total Paid</span>
                                            <span className="font-bold text-red-600">
                                                ${selectedTransaction.details.totalClientPays?.toFixed(2) || selectedTransaction.amount.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Tasker Earnings (informational) */}
                                {/* <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                                    <h4 className="font-semibold text-amber-800 text-sm mb-2">
                                        💼 Tasker Earnings
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <span className="text-amber-700">Tasker receives:</span>
                                        <span className="font-bold text-green-700 text-right">
                                            ${selectedTransaction.details.taskerPayout?.toFixed(2) || '0.00'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-amber-600 mt-2">
                                        After 12% platform fee and 13% tax deduction
                                    </p>
                                </div> */}

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
                                <div className="flex justify-end gap-2 pt-4 border-t border-border">
                                    {selectedTransaction.details.receiptUrl && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-2"
                                            onClick={() => window.open(selectedTransaction.details.receiptUrl, '_blank')}
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                            View Receipt
                                        </Button>
                                    )}
                                    {/* <Button
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
                                        Download Receipt
                                    </Button> */}
                                </div>
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

export default ClientPayment;