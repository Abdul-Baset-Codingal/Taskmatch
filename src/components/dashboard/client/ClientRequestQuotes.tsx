/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Trash2, Send, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLazyGetRequestQuotesByClientIdQuery, useDeleteRequestQuoteMutation } from "@/features/api/taskerApi";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

// Debug import
console.log("Importing useLazyGetRequestQuotesByClientIdQuery:", typeof useLazyGetRequestQuotesByClientIdQuery);

// Define the Quote interface to match the API structure
interface Quote {
    id: string;
    taskerName: string;
    taskerAvatar?: string;
    service: string;
    amount: number | null;
    status: "pending" | "sent" | "accepted" | "rejected" | "completed";
    createdAt: string;
}

// Status configuration for badges and icons
const statusConfig = {
    pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
    sent: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: Send },
    accepted: { color: "bg-green-100 text-green-800 border-green-200", icon: FileText },
    rejected: { color: "bg-red-100 text-red-800 border-red-200", icon: FileText },
    completed: { color: "bg-indigo-100 text-indigo-800 border-indigo-200", icon: FileText },
};

export function ClientRecentQuotes() {
    const [user, setUser] = useState<{ _id: string; role: string } | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [trigger, { data: quotes = [], isLoading, isError, error }] = useLazyGetRequestQuotesByClientIdQuery();
    const [deleteRequestQuote, { isLoading: isDeleting }] = useDeleteRequestQuoteMutation();

    // Debug hook and data
    useEffect(() => {
        console.log("useLazyGetRequestQuotesByClientIdQuery:", typeof useLazyGetRequestQuotesByClientIdQuery);
        console.log("Quotes data:", quotes);
        console.log("Error:", error);
    }, [quotes, error]);

    // Check login status and trigger quote fetch
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/auth/verify-token", {
                    method: "GET",
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    setIsLoggedIn(true);
                    setUser({ _id: data.user._id, role: data.user.role });
                    if (data.user.role === "client") {
                        console.log("Triggering quote fetch for client ID:", data.user._id);
                        trigger(data.user._id);
                    }
                } else {
                    setIsLoggedIn(false);
                    setUser(null);
                }
            } catch (error) {
                console.error("Error checking login status:", error);
                setIsLoggedIn(false);
                setUser(null);
            }
        };

        checkLoginStatus();
    }, [trigger]);

    // Map API quotes to the Quote interface
    const recentQuotes: Quote[] = Array.isArray(quotes)
        ? quotes.map((quote: any) => ({
            id: quote._id || "",
            taskerName: quote.tasker?.firstName || "Unknown Tasker",
            taskerAvatar: quote.tasker?.profilePicture || "/placeholder.svg",
            service: quote.taskTitle || "Untitled Quote",
            amount: quote.budget || null,
            status: (quote.status || "pending") as "pending" | "sent" | "accepted" | "rejected" | "completed",
            createdAt: quote.createdAt || new Date().toISOString(),
        }))
        : [];

    // Handle delete quote
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this quote?")) return;
        try {
            await deleteRequestQuote(id).unwrap();
            toast.success("Quote deleted successfully!");
            if (user?._id) trigger(user._id); // Refetch quotes
        } catch (err: any) {
            toast.error(`Failed to delete quote: ${err?.data?.message || "Unknown error"}`);
        }
    };

    if (!isLoggedIn || !user || user.role !== "client") {
        return (
            <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Recent Quotes
                    </CardTitle>
                    <CardDescription>Latest quote requests and their status</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-gray-400 text-sm">
                        Please log in as a client to view your quotes.
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (isLoading) {
        return (
            <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Recent Quotes
                    </CardTitle>
                    <CardDescription>Latest quote requests and their status</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-gray-400 text-sm animate-pulse">
                        Loading quotes...
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (isError) {
        return (
            <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Recent Quotes
                    </CardTitle>
                    <CardDescription>Latest quote requests and their status</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-red-400 text-sm">
                        Failed to load quotes: {(error as any)?.data?.message || "Unknown error"}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Recent Quotes
                </CardTitle>
                <CardDescription>Latest quote requests and their status</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recentQuotes.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 text-sm">
                            No quotes found
                        </div>
                    ) : (
                        recentQuotes.map((quote) => {
                            const StatusIcon = statusConfig[quote.status].icon;
                            return (
                                <div
                                    key={quote.id}
                                    className="flex items-center justify-between p-3 rounded-lg border bg-card/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={quote.taskerAvatar || "/placeholder.svg"} />
                                            <AvatarFallback className="text-xs">
                                                {quote.taskerName
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{quote.taskerName}</p>
                                            <p className="text-xs text-muted-foreground truncate">{quote.service}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="text-right">
                                            <p className="text-sm font-semibold">
                                                {quote.amount ? `$${quote.amount.toLocaleString()}` : "N/A"}
                                            </p>
                                            <Badge
                                                variant="outline"
                                                className={`text-xs ${statusConfig[quote.status].color}`}
                                            >
                                                <StatusIcon className="h-3 w-3 mr-1" />
                                                {quote.status}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Eye className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => handleDelete(quote.id)}
                                                disabled={isDeleting}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="mt-4 pt-4 border-t">
                    <Button variant="outline" className="w-full text-sm bg-transparent">
                        <FileText className="h-4 w-4 mr-2" />
                        View All Quotes
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}