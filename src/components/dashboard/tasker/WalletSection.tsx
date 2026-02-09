// app/dashboard/tasker/wallet/page.tsx
"use client";

import React, { useState } from "react";
import {
    Wallet, DollarSign, ArrowUpRight, ArrowDownRight, Clock,
    CheckCircle, XCircle, AlertCircle, Building2, CreditCard,
    TrendingUp, History, Send, X, Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    useGetWalletBalanceQuery,
    useGetMyWithdrawalsQuery,
    useGetWalletTransactionsQuery,
    useCreateWithdrawalMutation,
    useCancelWithdrawalMutation,
} from "@/features/api/walletApi";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function WalletSection() {
    const router = useRouter();
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [withdrawNote, setWithdrawNote] = useState("");
    const [activeTab, setActiveTab] = useState<"overview" | "withdrawals" | "transactions">("overview");

    // API Queries
    const { data: walletData, isLoading: loadingWallet, refetch: refetchWallet } = useGetWalletBalanceQuery();
    const { data: withdrawalsData, isLoading: loadingWithdrawals } = useGetMyWithdrawalsQuery({});
    const { data: transactionsData, isLoading: loadingTransactions } = useGetWalletTransactionsQuery({ limit: 10 });

    // Mutations
    const [createWithdrawal, { isLoading: isWithdrawing }] = useCreateWithdrawalMutation();
    const [cancelWithdrawal, { isLoading: isCancelling }] = useCancelWithdrawalMutation();

    const wallet = walletData?.wallet;
    const withdrawals = withdrawalsData?.withdrawals || [];
    const transactions = transactionsData?.transactions || [];

    console.log(walletData, "wallet dataa ")

    // Handle withdrawal submission
    const handleWithdraw = async () => {
        const amount = parseFloat(withdrawAmount);

        if (!amount || amount < 1) {
            return toast.error("Minimum withdrawal amount is $1");
        }

        if (amount > (wallet?.availableBalance || 0)) {
            return toast.error("Insufficient available balance");
        }

        try {
            await createWithdrawal({ amount, note: withdrawNote }).unwrap();
            toast.success("Withdrawal request submitted successfully!");
            setShowWithdrawModal(false);
            setWithdrawAmount("");
            setWithdrawNote("");
            refetchWallet();
        } catch (error: any) {
            toast.error(error?.data?.error || "Failed to submit withdrawal request");
        }
    };

    // Handle cancel withdrawal
    const handleCancelWithdrawal = async (id: string) => {
        if (!confirm("Are you sure you want to cancel this withdrawal request?")) return;

        try {
            await cancelWithdrawal(id).unwrap();
            toast.success("Withdrawal request cancelled");
            refetchWallet();
        } catch (error: any) {
            toast.error(error?.data?.error || "Failed to cancel");
        }
    };

    // Status badge component
    const StatusBadge = ({ status }: { status: string }) => {
        const styles: Record<string, string> = {
            pending: "bg-yellow-100 text-yellow-800",
            approved: "bg-blue-100 text-blue-800",
            completed: "bg-green-100 text-green-800",
            rejected: "bg-red-100 text-red-800",
            cancelled: "bg-gray-100 text-gray-800",
        };
        const icons: Record<string, React.ReactNode> = {
            pending: <Clock className="w-3 h-3" />,
            approved: <CheckCircle className="w-3 h-3" />,
            completed: <CheckCircle className="w-3 h-3" />,
            rejected: <XCircle className="w-3 h-3" />,
            cancelled: <X className="w-3 h-3" />,
        };

        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
                {icons[status]}
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    if (loadingWallet) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#109C3D]" />
            </div>
        );
    }

    return (
        <div className="  p-6">
            <div className="max-w-8xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#063A41] flex items-center gap-3">
                        <Wallet className="w-8 h-8 text-[#109C3D]" />
                        My Wallet
                    </h1>
                    <p className="text-gray-600 mt-1">Manage your earnings and withdrawals</p>
                </div>

                {/* Balance Cards */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                    {/* Available Balance */}
                    <Card className="bg-gradient-to-br from-[#109C3D] to-[#0d8534] text-white border-0">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-white/80 text-sm">Available Balance</span>
                                <DollarSign className="w-5 h-5 text-white/60" />
                            </div>
                            <div className="text-3xl font-bold">
                                ${(wallet?.availableBalance || 0).toFixed(2)}
                            </div>
                            <p className="text-white/60 text-xs mt-2">Ready to withdraw</p>
                        </CardContent>
                    </Card>

                    {/* Pending Withdrawal */}
                    <Card className="border-0 shadow-md">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-500 text-sm">Pending Withdrawal</span>
                                <Clock className="w-5 h-5 text-yellow-500" />
                            </div>
                            <div className="text-2xl font-bold text-[#063A41]">
                                ${(wallet?.pendingWithdrawal || 0).toFixed(2)}
                            </div>
                            <p className="text-gray-400 text-xs mt-2">Awaiting approval</p>
                        </CardContent>
                    </Card>

                    {/* Total Earned */}
                    <Card className="border-0 shadow-md">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-500 text-sm">Total Earned</span>
                                <TrendingUp className="w-5 h-5 text-[#109C3D]" />
                            </div>
                            <div className="text-2xl font-bold text-[#063A41]">
                                ${(wallet?.totalEarned || 0).toFixed(2)}
                            </div>
                            <p className="text-gray-400 text-xs mt-2">Lifetime earnings</p>
                        </CardContent>
                    </Card>

                    {/* Total Withdrawn */}
                    <Card className="border-0 shadow-md">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-500 text-sm">Total Withdrawn</span>
                                <ArrowUpRight className="w-5 h-5 text-blue-500" />
                            </div>
                            <div className="text-2xl font-bold text-[#063A41]">
                                ${(wallet?.totalWithdrawn || 0).toFixed(2)}
                            </div>
                            <p className="text-gray-400 text-xs mt-2">Successfully withdrawn</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Withdraw Button */}
                <div className="mb-8">
                    {!walletData?.hasBankAccount ? (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-amber-600" />
                                <div>
                                    <p className="font-medium text-amber-800">Bank Account Required</p>
                                    <p className="text-sm text-amber-700">Add your bank account to request withdrawals</p>
                                </div>
                            </div>
                            <button
                                onClick={() => router.push('/complete-tasker-profile')}
                                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                            >
                                Add Bank Account
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowWithdrawModal(true)}
                            disabled={(wallet?.availableBalance || 0) < 1}
                            className="w-full md:w-auto px-6 py-3 bg-[#109C3D] text-white font-medium rounded-lg hover:bg-[#0d8534] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-5 h-5" />
                            Request Withdrawal
                        </button>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b">
                    {["overview", "withdrawals", "transactions"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 -mb-px ${activeTab === tab
                                ? "border-[#109C3D] text-[#109C3D]"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === "overview" && (
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Recent Transactions */}
                        <Card className="border-0 shadow-md">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <History className="w-5 h-5 text-[#109C3D]" />
                                    Recent Transactions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {loadingTransactions ? (
                                    <div className="text-center py-8 text-gray-500">Loading...</div>
                                ) : transactions.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">No transactions yet</div>
                                ) : (
                                    <div className="space-y-3">
                                        {transactions.slice(0, 5).map((tx: any) => (
                                            <div key={tx._id} className="flex items-center justify-between py-2 border-b last:border-0">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-full ${tx.amount > 0 ? "bg-green-100" : "bg-red-100"
                                                        }`}>
                                                        {tx.amount > 0 ? (
                                                            <ArrowDownRight className="w-4 h-4 text-green-600" />
                                                        ) : (
                                                            <ArrowUpRight className="w-4 h-4 text-red-600" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-800">{tx.description}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(tx.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className={`font-semibold ${tx.amount > 0 ? "text-green-600" : "text-red-600"
                                                    }`}>
                                                    {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Pending Withdrawals */}
                        <Card className="border-0 shadow-md">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-yellow-500" />
                                    Pending Withdrawals
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {loadingWithdrawals ? (
                                    <div className="text-center py-8 text-gray-500">Loading...</div>
                                ) : withdrawals.filter((w: any) => w.status === "pending").length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">No pending withdrawals</div>
                                ) : (
                                    <div className="space-y-3">
                                        {withdrawals
                                            .filter((w: any) => w.status === "pending")
                                            .map((w: any) => (
                                                <div key={w._id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                                    <div>
                                                        <p className="font-semibold text-gray-800">${w.amount.toFixed(2)}</p>
                                                        <p className="text-xs text-gray-500">
                                                            Requested {new Date(w.requestedAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleCancelWithdrawal(w._id)}
                                                        disabled={isCancelling}
                                                        className="text-red-600 text-sm hover:underline"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeTab === "withdrawals" && (
                    <Card className="border-0 shadow-md">
                        <CardContent className="p-0">
                            {loadingWithdrawals ? (
                                <div className="text-center py-12 text-gray-500">Loading...</div>
                            ) : withdrawals.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">No withdrawal requests yet</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requested</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Processed</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Note</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {withdrawals.map((w: any) => (
                                                <tr key={w._id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 font-semibold">${w.amount.toFixed(2)}</td>
                                                    <td className="px-6 py-4"><StatusBadge status={w.status} /></td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {new Date(w.requestedAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {w.processedAt ? new Date(w.processedAt).toLocaleDateString() : "-"}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                                        {w.adminNote || w.note || "-"}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {w.status === "pending" && (
                                                            <button
                                                                onClick={() => handleCancelWithdrawal(w._id)}
                                                                className="text-red-600 text-sm hover:underline"
                                                            >
                                                                Cancel
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {activeTab === "transactions" && (
                    <Card className="border-0 shadow-md">
                        <CardContent className="p-0">
                            {loadingTransactions ? (
                                <div className="text-center py-12 text-gray-500">Loading...</div>
                            ) : transactions.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">No transactions yet</div>
                            ) : (
                                <div className="divide-y">
                                    {transactions.map((tx: any) => (
                                        <div key={tx._id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-full ${tx.amount > 0 ? "bg-green-100" : "bg-red-100"
                                                    }`}>
                                                    {tx.amount > 0 ? (
                                                        <ArrowDownRight className="w-5 h-5 text-green-600" />
                                                    ) : (
                                                        <ArrowUpRight className="w-5 h-5 text-red-600" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">{tx.description}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(tx.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-semibold ${tx.amount > 0 ? "text-green-600" : "text-red-600"
                                                    }`}>
                                                    {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    Balance: ${tx.balanceAfter.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Withdrawal Modal */}
                {showWithdrawModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl max-w-md w-full p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-[#063A41]">Request Withdrawal</h2>
                                <button
                                    onClick={() => setShowWithdrawModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Bank Account Info */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                    <Building2 className="w-4 h-4" />
                                    Withdraw to
                                </div>
                                <p className="font-medium text-gray-800">
                                    Bank Account ending in {walletData?.bankAccountLast4 || "****"}
                                </p>
                            </div>

                            {/* Available Balance */}
                            <div className="mb-6">
                                <p className="text-sm text-gray-600">Available Balance</p>
                                <p className="text-2xl font-bold text-[#109C3D]">
                                    ${(wallet?.availableBalance || 0).toFixed(2)}
                                </p>
                            </div>

                            {/* Amount Input */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Amount to Withdraw
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        min="1"
                                        max={wallet?.availableBalance || 0}
                                        step="0.01"
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D]"
                                    />
                                </div>
                                {/* Quick amounts */}
                                <div className="flex gap-2 mt-2">
                                    {[25, 50, 100].map((amt) => (
                                        <button
                                            key={amt}
                                            onClick={() => setWithdrawAmount(String(Math.min(amt, wallet?.availableBalance || 0)))}
                                            disabled={amt > (wallet?.availableBalance || 0)}
                                            className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
                                        >
                                            ${amt}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setWithdrawAmount(String(wallet?.availableBalance || 0))}
                                        className="px-3 py-1 text-sm bg-[#E5FFDB] text-[#109C3D] rounded hover:bg-[#d4f5c8]"
                                    >
                                        Max
                                    </button>
                                </div>
                            </div>

                            {/* Note */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Note (Optional)
                                </label>
                                <textarea
                                    value={withdrawNote}
                                    onChange={(e) => setWithdrawNote(e.target.value)}
                                    placeholder="Any additional notes..."
                                    rows={2}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] resize-none"
                                />
                            </div>

                            {/* Info */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                                <p className="text-sm text-blue-800">
                                    💡 Withdrawal requests are typically processed within 1-3 business days.
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowWithdrawModal(false)}
                                    className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleWithdraw}
                                    disabled={isWithdrawing || !withdrawAmount || parseFloat(withdrawAmount) < 1}
                                    className="flex-1 px-4 py-3 bg-[#109C3D] text-white rounded-lg hover:bg-[#0d8534] disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isWithdrawing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            Request Withdrawal
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}