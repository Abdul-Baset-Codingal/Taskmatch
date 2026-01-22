
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, Trash2, MessageSquare, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useLazyGetRequestQuotesByClientIdQuery, useDeleteRequestQuoteMutation } from "@/features/api/taskerApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";

export function ClientRecentQuotes() {
    const [clientId, setClientId] = useState<string | null>(null);

    const [trigger, { data: rawQuotes = [], isLoading, isError }] = useLazyGetRequestQuotesByClientIdQuery();
    const [deleteQuote, { isLoading: deleting }] = useDeleteRequestQuoteMutation();

    // Auth check
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("/api/auth/verify-token", { credentials: "include" });
                if (res.ok) {
                    const data = await res.json();
                    if (data.user?.currentRole === "client") {
                        setClientId(data.user._id);
                        trigger(data.user._id);
                    }
                }
            } catch (err) {
                console.error("Auth failed", err);
            }
        };
        checkAuth();
    }, [trigger]);

    const quotes = Array.isArray(rawQuotes) ? rawQuotes : [];

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "pending":
                return { label: "Pending", icon: Clock, bg: "bg-gray-100", text: "text-gray-700" };
            case "sent":
                return { label: "Sent", icon: MessageSquare, bg: "bg-[#E5FFDB]", text: "text-[#109C3D]" };
            case "accepted":
                return { label: "Accepted", icon: CheckCircle2, bg: "bg-[#E5FFDB]", text: "text-[#109C3D]" };
            case "rejected":
                return { label: "Rejected", icon: XCircle, bg: "bg-red-50", text: "text-red-700" };
            case "completed":
                return { label: "Completed", icon: CheckCircle2, bg: "bg-[#E5FFDB]", text: "text-[#109C3D]" };
            default:
                return { label: status, icon: Clock, bg: "bg-gray-100", text: "text-gray-700" };
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this quote request?")) return;
        try {
            await deleteQuote(id).unwrap();
            toast.success("Quote deleted");
            if (clientId) trigger(clientId);
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to delete");
        }
    };

    if (!clientId) {
        return (
            <Card className="border-0 shadow-md bg-white">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-[#063A41]">Recent Quote Requests</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-12 text-gray-500">
                    Log in as a client to view your quotes
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white">
            {/* Top green accent */}
            <div className="absolute inset-x-0 top-0 h-1.5 bg-[#109C3D] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />

            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-[#E5FFDB] shadow-sm">
                            <MessageSquare className="w-6 h-6 text-[#109C3D]" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold text-[#063A41]">
                                Recent Quote Requests
                            </CardTitle>
                            <p className="text-sm text-gray-500">Your sent requests to taskers</p>
                        </div>
                    </div>
                    <Badge className="bg-[#E5FFDB] text-[#109C3D] font-medium">
                        {quotes.length} total
                    </Badge>
                </div>
            </CardHeader>

            <CardContent>
                {isLoading ? (
                    <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4 animate-pulse">
                                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-48" />
                                    <div className="h-3 bg-gray-200 rounded w-32" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : isError ? (
                    <div className="text-center py-12 text-red-600">Failed to load quotes</div>
                ) : quotes.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="font-medium">No quote requests yet</p>
                        <p className="text-sm">Request quotes from taskers to see them here</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {quotes.slice(0, 5).map((quote: any) => {
                            const status = getStatusConfig(quote.status || "pending");
                            const StatusIcon = status.icon;
                            const taskerName = `${quote.tasker?.firstName || ""} ${quote.tasker?.lastName || ""}`.trim() || "Unknown Tasker";

                            return (
                                <div
                                    key={quote._id}
                                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                                >
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-10 w-10 ring-2 ring-white shadow-md">
                                            <AvatarImage src={quote.tasker?.profilePicture} />
                                            <AvatarFallback className="bg-[#063A41] text-white text-sm">
                                                {taskerName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div>
                                            <p className="font-medium text-[#063A41]">{taskerName}</p>
                                            <p className="text-sm text-gray-600 truncate max-w-64">{quote.taskTitle}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {formatDistanceToNow(new Date(quote.createdAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="font-bold text-[#109C3D]">
                                                {quote.budget ? `$${quote.budget.toLocaleString()}` : "Open"}
                                            </p>
                                            <Badge className={`mt-1 text-xs font-medium ${status.bg} ${status.text} border-0`}>
                                                <StatusIcon className="w-3 h-3 mr-1" />
                                                {status.label}
                                            </Badge>
                                        </div>

                                        <div className="flex gap-1">
                                            <Button size="icon" variant="ghost" className="h-9 w-9">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-9 w-9 text-red-600 hover:bg-red-50"
                                                onClick={() => handleDelete(quote._id)}
                                                disabled={deleting}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {quotes.length > 0 && (
                    <div className="mt-6 pt-4 border-t">
                        <Button variant="outline" className="w-full font-medium" asChild>
                            <a href="/client/quotes">
                                View All Quote Requests →
                            </a>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}