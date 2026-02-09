// // app/admin/withdrawals/page.tsx
// "use client";

// import React, { useState } from "react";
// import {
//     DollarSign, Clock, CheckCircle, XCircle, AlertCircle,
//     Search, Filter, User, Building2, Eye, Check, X, Loader2
// } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//     useGetAllWithdrawalsQuery,
//     useApproveWithdrawalMutation,
//     useRejectWithdrawalMutation,
// } from "@/features/api/walletApi";
// import { toast } from "react-toastify";
// import Image from "next/image";

// export default function AdminWithdrawalsPage() {
//     const [statusFilter, setStatusFilter] = useState<string>("pending");
//     const [selectedWithdrawal, setSelectedWithdrawal] = useState<any>(null);
//     const [showApproveModal, setShowApproveModal] = useState(false);
//     const [showRejectModal, setShowRejectModal] = useState(false);
//     const [paymentReference, setPaymentReference] = useState("");
//     const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
//     const [adminNote, setAdminNote] = useState("");
//     const [rejectReason, setRejectReason] = useState("");

//     // API
//     const { data, isLoading, refetch } = useGetAllWithdrawalsQuery({ status: statusFilter || undefined });
//     const [approveWithdrawal, { isLoading: isApproving }] = useApproveWithdrawalMutation();
//     const [rejectWithdrawal, { isLoading: isRejecting }] = useRejectWithdrawalMutation();

//     const withdrawals = data?.withdrawals || [];
//     const stats = data?.stats || {};

//     console.log(data)

//     // Handle approve
//     const handleApprove = async () => {
//         if (!selectedWithdrawal) return;

//         try {
//             await approveWithdrawal({
//                 id: selectedWithdrawal._id,
//                 paymentMethod,
//                 paymentReference,
//                 adminNote,
//             }).unwrap();
//             toast.success("Withdrawal approved and processed!");
//             setShowApproveModal(false);
//             setSelectedWithdrawal(null);
//             setPaymentReference("");
//             setAdminNote("");
//             refetch();
//         } catch (error: any) {
//             toast.error(error?.data?.error || "Failed to approve");
//         }
//     };

//     // Handle reject
//     const handleReject = async () => {
//         if (!selectedWithdrawal || !rejectReason) {
//             return toast.error("Please provide a reason for rejection");
//         }

//         try {
//             await rejectWithdrawal({
//                 id: selectedWithdrawal._id,
//                 adminNote: rejectReason,
//             }).unwrap();
//             toast.success("Withdrawal rejected");
//             setShowRejectModal(false);
//             setSelectedWithdrawal(null);
//             setRejectReason("");
//             refetch();
//         } catch (error: any) {
//             toast.error(error?.data?.error || "Failed to reject");
//         }
//     };

//     // Status badge
//     const StatusBadge = ({ status }: { status: string }) => {
//         const styles: Record<string, string> = {
//             pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
//             approved: "bg-blue-100 text-blue-800 border-blue-200",
//             completed: "bg-green-100 text-green-800 border-green-200",
//             rejected: "bg-red-100 text-red-800 border-red-200",
//             cancelled: "bg-gray-100 text-gray-800 border-gray-200",
//         };

//         return (
//             <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
//                 {status.charAt(0).toUpperCase() + status.slice(1)}
//             </span>
//         );
//     };

//     return (
//         <div className="min-h-screen bg-gray-50 p-6">
//             <div className="max-w-8xl mx-auto">
//                 {/* Header */}
//                 <div className="mb-8">
//                     <h1 className="text-3xl font-bold text-[#063A41]">Withdrawal Requests</h1>
//                     <p className="text-gray-600 mt-1">Manage tasker withdrawal requests</p>
//                 </div>

//                 {/* Stats Cards */}
//                 <div className="grid md:grid-cols-4 gap-4 mb-8">
//                     <Card className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
//                         onClick={() => setStatusFilter("pending")}>
//                         <CardContent className="p-4 flex items-center gap-4">
//                             <div className="p-3 bg-yellow-100 rounded-full">
//                                 <Clock className="w-6 h-6 text-yellow-600" />
//                             </div>
//                             <div>
//                                 <p className="text-2xl font-bold text-gray-800">{stats.pending?.count || 0}</p>
//                                 <p className="text-sm text-gray-500">Pending</p>
//                                 <p className="text-xs text-yellow-600">${(stats.pending?.amount || 0).toFixed(2)}</p>
//                             </div>
//                         </CardContent>
//                     </Card>

//                     <Card className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
//                         onClick={() => setStatusFilter("completed")}>
//                         <CardContent className="p-4 flex items-center gap-4">
//                             <div className="p-3 bg-green-100 rounded-full">
//                                 <CheckCircle className="w-6 h-6 text-green-600" />
//                             </div>
//                             <div>
//                                 <p className="text-2xl font-bold text-gray-800">{stats.completed?.count || 0}</p>
//                                 <p className="text-sm text-gray-500">Completed</p>
//                                 <p className="text-xs text-green-600">${(stats.completed?.amount || 0).toFixed(2)}</p>
//                             </div>
//                         </CardContent>
//                     </Card>

//                     <Card className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
//                         onClick={() => setStatusFilter("rejected")}>
//                         <CardContent className="p-4 flex items-center gap-4">
//                             <div className="p-3 bg-red-100 rounded-full">
//                                 <XCircle className="w-6 h-6 text-red-600" />
//                             </div>
//                             <div>
//                                 <p className="text-2xl font-bold text-gray-800">{stats.rejected?.count || 0}</p>
//                                 <p className="text-sm text-gray-500">Rejected</p>
//                                 <p className="text-xs text-red-600">${(stats.rejected?.amount || 0).toFixed(2)}</p>
//                             </div>
//                         </CardContent>
//                     </Card>

//                     <Card className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
//                         onClick={() => setStatusFilter("")}>
//                         <CardContent className="p-4 flex items-center gap-4">
//                             <div className="p-3 bg-gray-100 rounded-full">
//                                 <DollarSign className="w-6 h-6 text-gray-600" />
//                             </div>
//                             <div>
//                                 <p className="text-2xl font-bold text-gray-800">
//                                     {(stats.pending?.count || 0) + (stats.completed?.count || 0) + (stats.rejected?.count || 0)}
//                                 </p>
//                                 <p className="text-sm text-gray-500">All Time</p>
//                             </div>
//                         </CardContent>
//                     </Card>
//                 </div>

//                 {/* Filter */}
//                 <div className="flex gap-2 mb-6">
//                     {["", "pending", "completed", "rejected", "cancelled"].map((status) => (
//                         <button
//                             key={status}
//                             onClick={() => setStatusFilter(status)}
//                             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === status
//                                     ? "bg-[#063A41] text-white"
//                                     : "bg-white text-gray-600 hover:bg-gray-100"
//                                 }`}
//                         >
//                             {status ? status.charAt(0).toUpperCase() + status.slice(1) : "All"}
//                         </button>
//                     ))}
//                 </div>

//                 {/* Table */}
//                 <Card className="border-0 shadow-md">
//                     <CardContent className="p-0">
//                         {isLoading ? (
//                             <div className="text-center py-12">
//                                 <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
//                             </div>
//                         ) : withdrawals.length === 0 ? (
//                             <div className="text-center py-12 text-gray-500">
//                                 No withdrawal requests found
//                             </div>
//                         ) : (
//                             <div className="overflow-x-auto">
//                                 <table className="w-full">
//                                     <thead className="bg-gray-50 border-b">
//                                         <tr>
//                                             <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Tasker</th>
//                                             <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
//                                             <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Bank Account</th>
//                                             <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
//                                             <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Requested</th>
//                                             <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="divide-y">
//                                         {withdrawals.map((w: any) => (
//                                             <tr key={w._id} className="hover:bg-gray-50">
//                                                 <td className="px-6 py-4">
//                                                     <div className="flex items-center gap-3">
//                                                         <Image
//                                                             src={w.tasker?.profilePicture || "/placeholder-avatar.png"}
//                                                             alt=""
//                                                             width={40}
//                                                             height={40}
//                                                             className="rounded-full object-cover"
//                                                         />
//                                                         <div>
//                                                             <p className="font-medium text-gray-800">
//                                                                 {w.tasker?.firstName} {w.tasker?.lastName}
//                                                             </p>
//                                                             <p className="text-sm text-gray-500">{w.tasker?.email}</p>
//                                                         </div>
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-6 py-4">
//                                                     <span className="text-lg font-bold text-[#063A41]">
//                                                         ${w.amount.toFixed(2)}
//                                                     </span>
//                                                 </td>
//                                                 <td className="px-6 py-4">
//                                                     <div className="text-sm">
//                                                         <p className="font-medium">{w.bankAccountSnapshot?.bankName}</p>
//                                                         <p className="text-gray-500">****{w.bankAccountSnapshot?.last4}</p>
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-6 py-4">
//                                                     <StatusBadge status={w.status} />
//                                                 </td>
//                                                 <td className="px-6 py-4 text-sm text-gray-500">
//                                                     {new Date(w.requestedAt).toLocaleDateString()}
//                                                 </td>
//                                                 <td className="px-6 py-4">
//                                                     {w.status === "pending" ? (
//                                                         <div className="flex gap-2">
//                                                             <button
//                                                                 onClick={() => {
//                                                                     setSelectedWithdrawal(w);
//                                                                     setShowApproveModal(true);
//                                                                 }}
//                                                                 className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
//                                                                 title="Approve"
//                                                             >
//                                                                 <Check className="w-4 h-4" />
//                                                             </button>
//                                                             <button
//                                                                 onClick={() => {
//                                                                     setSelectedWithdrawal(w);
//                                                                     setShowRejectModal(true);
//                                                                 }}
//                                                                 className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
//                                                                 title="Reject"
//                                                             >
//                                                                 <X className="w-4 h-4" />
//                                                             </button>
//                                                         </div>
//                                                     ) : (
//                                                         <button
//                                                             onClick={() => setSelectedWithdrawal(w)}
//                                                             className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
//                                                             title="View Details"
//                                                         >
//                                                             <Eye className="w-4 h-4" />
//                                                         </button>
//                                                     )}
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//                     </CardContent>
//                 </Card>

//                 {/* Approve Modal */}
//                 {showApproveModal && selectedWithdrawal && (
//                     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//                         <div className="bg-white rounded-xl max-w-md w-full p-6">
//                             <h2 className="text-xl font-bold text-[#063A41] mb-4">Approve Withdrawal</h2>

//                             <div className="bg-gray-50 rounded-lg p-4 mb-4">
//                                 <p className="text-sm text-gray-600">Tasker</p>
//                                 <p className="font-medium">{selectedWithdrawal.tasker?.firstName} {selectedWithdrawal.tasker?.lastName}</p>
//                                 <p className="text-2xl font-bold text-[#109C3D] mt-2">${selectedWithdrawal.amount.toFixed(2)}</p>
//                             </div>

//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
//                                 <select
//                                     value={paymentMethod}
//                                     onChange={(e) => setPaymentMethod(e.target.value)}
//                                     className="w-full p-2 border rounded-lg"
//                                 >
//                                     <option value="bank_transfer">Bank Transfer</option>
//                                     <option value="e_transfer">E-Transfer</option>
//                                     <option value="cheque">Cheque</option>
//                                     <option value="other">Other</option>
//                                 </select>
//                             </div>

//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Payment Reference</label>
//                                 <input
//                                     type="text"
//                                     value={paymentReference}
//                                     onChange={(e) => setPaymentReference(e.target.value)}
//                                     placeholder="Transaction ID or reference number"
//                                     className="w-full p-2 border rounded-lg"
//                                 />
//                             </div>

//                             <div className="mb-6">
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Admin Note (Optional)</label>
//                                 <textarea
//                                     value={adminNote}
//                                     onChange={(e) => setAdminNote(e.target.value)}
//                                     rows={2}
//                                     className="w-full p-2 border rounded-lg resize-none"
//                                 />
//                             </div>

//                             <div className="flex gap-3">
//                                 <button
//                                     onClick={() => setShowApproveModal(false)}
//                                     className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     onClick={handleApprove}
//                                     disabled={isApproving}
//                                     className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
//                                 >
//                                     {isApproving ? "Processing..." : "Approve & Mark Paid"}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* Reject Modal */}
//                 {showRejectModal && selectedWithdrawal && (
//                     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//                         <div className="bg-white rounded-xl max-w-md w-full p-6">
//                             <h2 className="text-xl font-bold text-red-600 mb-4">Reject Withdrawal</h2>

//                             <div className="bg-gray-50 rounded-lg p-4 mb-4">
//                                 <p className="text-sm text-gray-600">Rejecting withdrawal of</p>
//                                 <p className="text-xl font-bold">${selectedWithdrawal.amount.toFixed(2)}</p>
//                                 <p className="text-sm text-gray-500">from {selectedWithdrawal.tasker?.firstName}</p>
//                             </div>

//                             <div className="mb-6">
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Reason for Rejection <span className="text-red-500">*</span>
//                                 </label>
//                                 <textarea
//                                     value={rejectReason}
//                                     onChange={(e) => setRejectReason(e.target.value)}
//                                     placeholder="Please provide a reason..."
//                                     rows={3}
//                                     className="w-full p-2 border rounded-lg resize-none"
//                                 />
//                             </div>

//                             <div className="flex gap-3">
//                                 <button
//                                     onClick={() => setShowRejectModal(false)}
//                                     className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     onClick={handleReject}
//                                     disabled={isRejecting || !rejectReason}
//                                     className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
//                                 >
//                                     {isRejecting ? "Rejecting..." : "Reject Withdrawal"}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }


// app/admin/withdrawals/page.tsx
"use client";

import React, { useState } from "react";
import {
    DollarSign, Clock, CheckCircle, XCircle, AlertCircle,
    Search, Filter, User, Building2, Eye, Check, X, Loader2,
    CreditCard, Copy, CheckCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    useGetAllWithdrawalsQuery,
    useApproveWithdrawalMutation,
    useRejectWithdrawalMutation,
} from "@/features/api/walletApi";
import { toast } from "react-toastify";
import Image from "next/image";

export default function AdminWithdrawalsPage() {
    const [statusFilter, setStatusFilter] = useState<string>("pending");
    const [selectedWithdrawal, setSelectedWithdrawal] = useState<any>(null);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [paymentReference, setPaymentReference] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
    const [adminNote, setAdminNote] = useState("");
    const [rejectReason, setRejectReason] = useState("");
    const [copiedField, setCopiedField] = useState<string | null>(null);

    // API
    const { data, isLoading, refetch } = useGetAllWithdrawalsQuery({ status: statusFilter || undefined });
    const [approveWithdrawal, { isLoading: isApproving }] = useApproveWithdrawalMutation();
    const [rejectWithdrawal, { isLoading: isRejecting }] = useRejectWithdrawalMutation();

    const withdrawals = data?.withdrawals || [];
    const stats = data?.stats || {};

    console.log(data);

    // Copy to clipboard
    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopiedField(null), 2000);
    };

    // Handle approve
    const handleApprove = async () => {
        if (!selectedWithdrawal) return;

        try {
            await approveWithdrawal({
                id: selectedWithdrawal._id,
                paymentMethod,
                paymentReference,
                adminNote,
            }).unwrap();
            toast.success("Withdrawal approved and processed!");
            setShowApproveModal(false);
            setSelectedWithdrawal(null);
            setPaymentReference("");
            setAdminNote("");
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.error || "Failed to approve");
        }
    };

    // Handle reject
    const handleReject = async () => {
        if (!selectedWithdrawal || !rejectReason) {
            return toast.error("Please provide a reason for rejection");
        }

        try {
            await rejectWithdrawal({
                id: selectedWithdrawal._id,
                adminNote: rejectReason,
            }).unwrap();
            toast.success("Withdrawal rejected");
            setShowRejectModal(false);
            setSelectedWithdrawal(null);
            setRejectReason("");
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.error || "Failed to reject");
        }
    };

    // View details
    const handleViewDetails = (withdrawal: any) => {
        setSelectedWithdrawal(withdrawal);
        setShowDetailModal(true);
    };

    // Status badge
    const StatusBadge = ({ status }: { status: string }) => {
        const styles: Record<string, string> = {
            pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
            approved: "bg-blue-100 text-blue-800 border-blue-200",
            completed: "bg-green-100 text-green-800 border-green-200",
            rejected: "bg-red-100 text-red-800 border-red-200",
            cancelled: "bg-gray-100 text-gray-800 border-gray-200",
        };

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    // Copyable field component
    const CopyableField = ({ label, value, fieldKey }: { label: string; value: string; fieldKey: string }) => (
        <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
            <span className="text-sm text-gray-500">{label}</span>
            <div className="flex items-center gap-2">
                <span className="font-medium text-gray-800">{value}</span>
                <button
                    onClick={() => copyToClipboard(value, fieldKey)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    title="Copy"
                >
                    {copiedField === fieldKey ? (
                        <CheckCheck className="w-4 h-4 text-green-500" />
                    ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                    )}
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-8xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#063A41]">Withdrawal Requests</h1>
                    <p className="text-gray-600 mt-1">Manage tasker withdrawal requests</p>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                    <Card className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setStatusFilter("pending")}>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{stats.pending?.count || 0}</p>
                                <p className="text-sm text-gray-500">Pending</p>
                                <p className="text-xs text-yellow-600">${(stats.pending?.amount || 0).toFixed(2)}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setStatusFilter("completed")}>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-full">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{stats.completed?.count || 0}</p>
                                <p className="text-sm text-gray-500">Completed</p>
                                <p className="text-xs text-green-600">${(stats.completed?.amount || 0).toFixed(2)}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setStatusFilter("rejected")}>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-3 bg-red-100 rounded-full">
                                <XCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{stats.rejected?.count || 0}</p>
                                <p className="text-sm text-gray-500">Rejected</p>
                                <p className="text-xs text-red-600">${(stats.rejected?.amount || 0).toFixed(2)}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setStatusFilter("")}>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-3 bg-gray-100 rounded-full">
                                <DollarSign className="w-6 h-6 text-gray-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">
                                    {(stats.pending?.count || 0) + (stats.completed?.count || 0) + (stats.rejected?.count || 0)}
                                </p>
                                <p className="text-sm text-gray-500">All Time</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filter */}
                <div className="flex gap-2 mb-6">
                    {["", "pending", "completed", "rejected", "cancelled"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${statusFilter === status
                                ? "bg-[#063A41] text-white"
                                : "bg-white text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            {status ? status.charAt(0).toUpperCase() + status.slice(1) : "All"}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <Card className="border-0 shadow-md">
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="text-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                            </div>
                        ) : withdrawals.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                No withdrawal requests found
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Tasker</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Bank Details</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Requested</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {withdrawals.map((w: any) => (
                                            <tr key={w._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <Image
                                                            src={w.tasker?.profilePicture || "/placeholder-avatar.png"}
                                                            alt=""
                                                            width={40}
                                                            height={40}
                                                            className="rounded-full object-cover"
                                                        />
                                                        <div>
                                                            <p className="font-medium text-gray-800">
                                                                {w.tasker?.firstName} {w.tasker?.lastName}
                                                            </p>
                                                            <p className="text-sm text-gray-500">{w.tasker?.email}</p>
                                                            <p className="text-xs text-gray-400">{w.tasker?.phone}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <span className="text-lg font-bold text-[#063A41]">
                                                            ${w.amount.toFixed(2)}
                                                        </span>
                                                        <span className="text-sm text-gray-500 ml-1">{w.currency}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-400">
                                                        Balance: ${w.tasker?.wallet?.balance?.toFixed(2) || '0.00'}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <Building2 className="w-4 h-4 text-gray-400" />
                                                            <span className="font-medium">{w.bankAccountSnapshot?.bankName || w.tasker?.bankAccount?.bankName}</span>
                                                        </div>
                                                        <p className="text-gray-600">
                                                            {w.bankAccountSnapshot?.accountHolderName || w.tasker?.bankAccount?.accountHolderName}
                                                        </p>
                                                        <div className="flex items-center gap-2">
                                                            <CreditCard className="w-4 h-4 text-gray-400" />
                                                            <span className="text-gray-500">
                                                                ****{w.bankAccountSnapshot?.last4 || w.tasker?.bankAccount?.last4}
                                                            </span>
                                                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded capitalize">
                                                                {w.bankAccountSnapshot?.accountType || w.tasker?.bankAccount?.accountType}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <StatusBadge status={w.status} />
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    <div>{new Date(w.requestedAt).toLocaleDateString()}</div>
                                                    <div className="text-xs text-gray-400">
                                                        {new Date(w.requestedAt).toLocaleTimeString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleViewDetails(w)}
                                                            className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                                            title="View Full Details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        {w.status === "pending" && (
                                                            <>
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedWithdrawal(w);
                                                                        setShowApproveModal(true);
                                                                    }}
                                                                    className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                                                                    title="Approve"
                                                                >
                                                                    <Check className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedWithdrawal(w);
                                                                        setShowRejectModal(true);
                                                                    }}
                                                                    className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                                                                    title="Reject"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Detail Modal */}
                {showDetailModal && selectedWithdrawal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            {/* Header */}
                            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-[#063A41]">Withdrawal Details</h2>
                                <button
                                    onClick={() => {
                                        setShowDetailModal(false);
                                        setSelectedWithdrawal(null);
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Amount & Status */}
                                <div className="bg-gradient-to-r from-[#063A41] to-[#0a5c66] rounded-xl p-6 text-white">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm opacity-80">Withdrawal Amount</p>
                                            <p className="text-4xl font-bold mt-1">
                                                ${selectedWithdrawal.amount.toFixed(2)}
                                                <span className="text-lg ml-2">{selectedWithdrawal.currency}</span>
                                            </p>
                                        </div>
                                        <StatusBadge status={selectedWithdrawal.status} />
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="opacity-70">Requested</p>
                                            <p>{new Date(selectedWithdrawal.requestedAt).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="opacity-70">Updated</p>
                                            <p>{new Date(selectedWithdrawal.updatedAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Tasker Info */}
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <User className="w-4 h-4" /> Tasker Information
                                    </h3>
                                    <div className="flex items-center gap-4 mb-4">
                                        <Image
                                            src={selectedWithdrawal.tasker?.profilePicture || "/placeholder-avatar.png"}
                                            alt=""
                                            width={60}
                                            height={60}
                                            className="rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="font-bold text-lg">
                                                {selectedWithdrawal.tasker?.firstName} {selectedWithdrawal.tasker?.lastName}
                                            </p>
                                            <p className="text-gray-600">{selectedWithdrawal.tasker?.email}</p>
                                            <p className="text-gray-500">{selectedWithdrawal.tasker?.phone}</p>
                                        </div>
                                    </div>
                                    {/* Wallet Stats */}
                                    {selectedWithdrawal.tasker?.wallet && (
                                        <div className="grid grid-cols-3 gap-3 mt-3">
                                            <div className="bg-white rounded-lg p-3 text-center">
                                                <p className="text-xs text-gray-500">Current Balance</p>
                                                <p className="font-bold text-green-600">
                                                    ${selectedWithdrawal.tasker.wallet.balance?.toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="bg-white rounded-lg p-3 text-center">
                                                <p className="text-xs text-gray-500">Total Earned</p>
                                                <p className="font-bold text-gray-700">
                                                    ${selectedWithdrawal.tasker.wallet.totalEarned?.toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="bg-white rounded-lg p-3 text-center">
                                                <p className="text-xs text-gray-500">Total Withdrawn</p>
                                                <p className="font-bold text-gray-700">
                                                    ${selectedWithdrawal.tasker.wallet.totalWithdrawn?.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Bank Account Details */}
                                <div className="bg-blue-50 rounded-xl p-4">
                                    <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <Building2 className="w-4 h-4" /> Bank Account Details
                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded ml-auto">
                                            {selectedWithdrawal.tasker?.bankAccount?.verified ? "✓ Verified" : "Not Verified"}
                                        </span>
                                    </h3>

                                    <div className="bg-white rounded-lg p-4">
                                        <CopyableField
                                            label="Account Holder"
                                            value={selectedWithdrawal.tasker?.bankAccount?.accountHolderName || selectedWithdrawal.bankAccountSnapshot?.accountHolderName}
                                            fieldKey="holder"
                                        />
                                        <CopyableField
                                            label="Bank Name"
                                            value={selectedWithdrawal.tasker?.bankAccount?.bankName || selectedWithdrawal.bankAccountSnapshot?.bankName}
                                            fieldKey="bank"
                                        />
                                        <CopyableField
                                            label="Account Number"
                                            value={selectedWithdrawal.tasker?.bankAccount?.accountNumber || `****${selectedWithdrawal.bankAccountSnapshot?.last4}`}
                                            fieldKey="account"
                                        />
                                        <CopyableField
                                            label="Routing Number"
                                            value={selectedWithdrawal.tasker?.bankAccount?.routingNumber || "N/A"}
                                            fieldKey="routing"
                                        />
                                        <CopyableField
                                            label="Account Type"
                                            value={(selectedWithdrawal.tasker?.bankAccount?.accountType || selectedWithdrawal.bankAccountSnapshot?.accountType || "").toUpperCase()}
                                            fieldKey="type"
                                        />
                                        {selectedWithdrawal.tasker?.bankAccount?.addedAt && (
                                            <div className="flex justify-between items-center py-2 text-sm">
                                                <span className="text-gray-500">Account Added</span>
                                                <span className="text-gray-600">
                                                    {new Date(selectedWithdrawal.tasker.bankAccount.addedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Note */}
                                {selectedWithdrawal.note && (
                                    <div className="bg-yellow-50 rounded-xl p-4">
                                        <h3 className="font-semibold text-gray-700 mb-2">Tasker Note</h3>
                                        <p className="text-gray-600">{selectedWithdrawal.note}</p>
                                    </div>
                                )}

                                {/* Action Buttons for Pending */}
                                {selectedWithdrawal.status === "pending" && (
                                    <div className="flex gap-3 pt-4 border-t">
                                        <button
                                            onClick={() => {
                                                setShowDetailModal(false);
                                                setShowRejectModal(true);
                                            }}
                                            className="flex-1 px-4 py-3 border-2 border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium"
                                        >
                                            Reject Withdrawal
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowDetailModal(false);
                                                setShowApproveModal(true);
                                            }}
                                            className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                                        >
                                            Approve & Process Payment
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Approve Modal */}
                {showApproveModal && selectedWithdrawal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl max-w-lg w-full p-6">
                            <h2 className="text-xl font-bold text-[#063A41] mb-4">Approve Withdrawal</h2>

                            {/* Summary */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">Tasker</span>
                                    <span className="font-medium">{selectedWithdrawal.tasker?.firstName} {selectedWithdrawal.tasker?.lastName}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">Amount</span>
                                    <span className="text-2xl font-bold text-[#109C3D]">${selectedWithdrawal.amount.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-2 mt-2">
                                    <p className="text-sm text-gray-500">Bank: {selectedWithdrawal.tasker?.bankAccount?.bankName}</p>
                                    <p className="text-sm text-gray-500">Account: ****{selectedWithdrawal.bankAccountSnapshot?.last4}</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="bank_transfer">Bank Transfer (ACH/Wire)</option>
                                    <option value="e_transfer">Interac E-Transfer</option>
                                    <option value="cheque">Cheque</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Payment Reference / Transaction ID
                                </label>
                                <input
                                    type="text"
                                    value={paymentReference}
                                    onChange={(e) => setPaymentReference(e.target.value)}
                                    placeholder="Enter transaction reference number"
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Note (Optional)</label>
                                <textarea
                                    value={adminNote}
                                    onChange={(e) => setAdminNote(e.target.value)}
                                    rows={2}
                                    placeholder="Add any internal notes..."
                                    className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowApproveModal(false);
                                        setSelectedWithdrawal(null);
                                    }}
                                    className="flex-1 px-4 py-3 border rounded-lg hover:bg-gray-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleApprove}
                                    disabled={isApproving}
                                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
                                >
                                    {isApproving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Approve & Mark Paid
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Reject Modal */}
                {showRejectModal && selectedWithdrawal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl max-w-md w-full p-6">
                            <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
                                <XCircle className="w-6 h-6" />
                                Reject Withdrawal
                            </h2>

                            <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-4">
                                <p className="text-sm text-gray-600">You are rejecting a withdrawal request of</p>
                                <p className="text-2xl font-bold text-red-600">${selectedWithdrawal.amount.toFixed(2)}</p>
                                <p className="text-sm text-gray-500">from {selectedWithdrawal.tasker?.firstName} {selectedWithdrawal.tasker?.lastName}</p>
                                <p className="text-xs text-gray-400 mt-2">
                                    The amount will be returned to the tasker's wallet balance.
                                </p>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Reason for Rejection <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="Please provide a clear reason for rejection..."
                                    rows={3}
                                    className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">This will be visible to the tasker.</p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowRejectModal(false);
                                        setSelectedWithdrawal(null);
                                        setRejectReason("");
                                    }}
                                    className="flex-1 px-4 py-3 border rounded-lg hover:bg-gray-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReject}
                                    disabled={isRejecting || !rejectReason.trim()}
                                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
                                >
                                    {isRejecting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Rejecting...
                                        </>
                                    ) : (
                                        <>
                                            <X className="w-4 h-4" />
                                            Reject Withdrawal
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