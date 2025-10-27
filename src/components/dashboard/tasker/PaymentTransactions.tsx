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
    AlertTriangle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/app/lib/utils"

export function PaymentTransactions() {
    const [activeTab, setActiveTab] = useState("payments") // tabs: payments, receipts, invoices

    const mockTransactions = [
        {
            id: 1,
            date: "2025-10-15",
            type: "Payment Received",
            amount: "+$150.00",
            description: "Task completion - Plumbing repair",
            status: "Completed",
            details: {
                taskId: "#TASK-123",
                client: "John Doe",
                method: "Stripe Card",
                invoiceId: "#INV-456",
                notes: "Full payment for completed plumbing service in kitchen. No issues reported.",
                timestamp: "2025-10-15T14:30:00Z",
                receiptUrl: "#"
            }
        },
        {
            id: 2,
            date: "2025-10-10",
            type: "Invoice Sent",
            amount: "-$75.00",
            description: "Quote for electrical work",
            status: "Pending",
            details: {
                taskId: "#TASK-124",
                client: "Jane Smith",
                method: "PayPal",
                invoiceId: "#INV-457",
                notes: "Quote sent for electrical wiring installation. Awaiting client approval.",
                timestamp: "2025-10-10T09:15:00Z",
                receiptUrl: "#"
            }
        },
        {
            id: 3,
            date: "2025-10-05",
            type: "Payment Sent",
            amount: "-$200.00",
            description: "Advance for gardening service",
            status: "Completed",
            details: {
                taskId: "#TASK-125",
                client: "Mike Johnson",
                method: "Bank Transfer",
                invoiceId: "#INV-458",
                notes: "Advance payment transferred for upcoming gardening project. Materials purchased.",
                timestamp: "2025-10-05T16:45:00Z",
                receiptUrl: "#"
            }
        },
        {
            id: 4,
            date: "2025-10-01",
            type: "Receipt Issued",
            amount: "+$100.00",
            description: "Deposit for cleaning task",
            status: "Completed",
            details: {
                taskId: "#TASK-126",
                client: "Emily Davis",
                method: "Credit Card",
                invoiceId: "#INV-459",
                notes: "Deposit received for deep cleaning service. Balance due upon completion.",
                timestamp: "2025-10-01T11:20:00Z",
                receiptUrl: "#"
            }
        },
    ]

    const filteredTransactions = mockTransactions.filter(tx => {
        if (activeTab === "payments") return ["Payment Received", "Payment Sent"].includes(tx.type)
        if (activeTab === "receipts") return tx.type === "Receipt Issued"
        if (activeTab === "invoices") return tx.type === "Invoice Sent"
        return true
    })

    const getAmountClass = (amount: string) => cn(
        "font-semibold",
        amount.startsWith('+') ? 'text-green-600' : 'text-destructive'
    )

    const getStatusIcon = (status: string) => {
        if (status === "Completed") return <CheckCircle className="h-4 w-4 text-green-600" />
        if (status === "Pending") return <Clock className="h-4 w-4 text-yellow-600" />
        return <AlertTriangle className="h-4 w-4 text-destructive" />
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight ">Payments & Transactions</h2>
                    <p className="text-muted-foreground">Track your payments, receipts, and invoices</p>
                </div>
                <div className="flex space-x-2">
                    <Button
                        variant={activeTab === "payments" ? "secondary" : "outline"}
                        onClick={() => setActiveTab("payments")}
                        className={cn(activeTab === "payments" && "color1")}
                    >
                        Payments
                    </Button>
                    <Button
                        variant={activeTab === "receipts" ? "secondary" : "outline"}
                        onClick={() => setActiveTab("receipts")}
                        className={cn(activeTab === "receipts" && "color1")}
                    >
                        Receipts
                    </Button>
                    <Button
                        variant={activeTab === "invoices" ? "secondary" : "outline"}
                        onClick={() => setActiveTab("invoices")}
                        className={cn(activeTab === "invoices" && "color1")}
                    >
                        Invoices
                    </Button>
                </div>
            </div>

            <div className="rounded-lg border bg-card shadow-sm">
                <div className="p-6">
                    {filteredTransactions.length === 0 ? (
                        <div className="text-center py-12">
                            <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2 color1">No {activeTab} found</h3>
                            <p className="text-muted-foreground">Get started by completing a task or sending an invoice.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-scroll">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-0 font-medium text-sm text-foreground">Date</th>
                                        <th className="text-left py-3 px-0 font-medium text-sm text-foreground">Type</th>
                                        <th className="text-left py-3 px-0 font-medium text-sm text-foreground">Description</th>
                                        <th className="text-right py-3 px-0 font-medium text-sm text-foreground">Amount</th>
                                        <th className="text-left py-3 px-0 font-medium text-sm text-foreground">Status</th>
                                        <th className="text-right py-3 px-0 font-medium text-sm text-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTransactions.map((tx) => (
                                        <tr key={tx.id} className="border-b last:border-b-0 ">
                                            <td className="py-4 px-0 text-sm font-medium text-foreground">{tx.date}</td>
                                            <td className="py-4 px-0 text-sm">
                                                <Badge variant="outline" className="capitalize color1 text-white ">{tx.type}</Badge>
                                            </td>
                                            <td className="py-4 px-0 text-sm text-foreground">{tx.description}</td>
                                            <td className="py-4 px-0 text-right text-sm"><span className={getAmountClass(tx.amount)}>{tx.amount}</span></td>
                                            <td className="py-4 px-0 text-sm">
                                                <div className="flex items-center gap-1">
                                                    {getStatusIcon(tx.status)}
                                                    <Badge
                                                        variant="outline"
                                                        className={cn(
                                                            "ml-1",
                                                            tx.status === "Completed" ? "bg-green-100 text-green-800 border-green-200" : "bg-yellow-100 text-yellow-800 border-yellow-200"
                                                        )}
                                                    >
                                                        {tx.status}
                                                    </Badge>
                                                </div>
                                            </td>
                                            <td className="py-4 px-0 text-right text-sm">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-lg p-0">
                                                        <div className="p-6">
                                                            <DialogHeader className="mb-6">
                                                                <DialogTitle className="flex items-center gap-2 text-2xl font-bold ">
                                                                    <CreditCard className="h-6 w-6 " />
                                                                    Transaction Details
                                                                </DialogTitle>
                                                                <DialogDescription className="text-muted-foreground">
                                                                    Full details for <span className="font-medium text-foreground">{tx.description}</span>
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="space-y-6">
                                                                {/* Summary Card */}
                                                                <div className=" rounded-lg p-4 border border-border">
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <h4 className="font-semibold text-foreground">Summary</h4>
                                                                    </div>
                                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                                        <div className="flex items-center gap-2">
                                                                            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                                            <span className="text-foreground">{tx.date}</span>
                                                                        </div>
                                                                        <div className="flex items-center justify-end gap-2">
                                                                            <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                                            <span className={getAmountClass(tx.amount)}>{tx.amount}</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                                            <span className="text-foreground">{tx.details.client}</span>
                                                                        </div>
                                                                        <div className="flex items-center justify-end gap-2">
                                                                            <CreditCard className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                                            <span className="text-foreground">{tx.details.method}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Status */}
                                                                <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg border border-border">
                                                                    <div className={cn("p-2 rounded-full", tx.status === "Completed" ? "bg-green-100 border-green-200" : "bg-yellow-100 border-yellow-200")}>
                                                                        {getStatusIcon(tx.status)}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-semibold text-foreground">{tx.status}</p>
                                                                        <p className="text-sm text-muted-foreground">Transaction {tx.status.toLowerCase()}</p>
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
                                                                            <Badge variant="outline" className="text-xs ">{tx.details.taskId}</Badge>
                                                                        </div>
                                                                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                                                                            <span className="text-sm text-foreground">Invoice ID</span>
                                                                            <Badge variant="outline" className="text-xs ">{tx.details.invoiceId}</Badge>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Notes */}
                                                                <div>
                                                                    <h4 className="font-semibold mb-3 text-foreground flex items-center gap-2">
                                                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                                                        Notes
                                                                    </h4>
                                                                    <div className="p-4 bg-muted rounded-lg border border-border">
                                                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{tx.details.notes}</p>
                                                                    </div>
                                                                </div>

                                                                {/* Actions */}
                                                                <div className="flex justify-end pt-4 border-t border-border">
                                                                    <Button variant="outline" size="sm" className="gap-2 ">
                                                                        <Download className="h-4 w-4" />
                                                                        Download Receipt
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
                <p>Need help? Contact support for payment issues.</p>
            </div>
        </div>
    )
}