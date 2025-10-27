/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Send, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetQuotesByTaskerIdQuery } from "@/features/api/taskerApi";
import { useState, useEffect } from "react";

// Define the Quote interface to match the component's needs
interface Quote {
    id: string;
    clientName: string;
    clientAvatar?: string;
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

export function RecentQuotes() {
    const [user, setUser] = useState<{ _id: string; role: string } | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check login status
    const checkLoginStatus = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/verify-token`, {
                method: "GET",
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                setIsLoggedIn(true);
                setUser({ _id: data.user._id, role: data.user.role });
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

    useEffect(() => {
        checkLoginStatus();
    }, []);

    // Fetch quotes using the API hook
    const {
        data,
        isLoading,
        isError,
        error,
    } = useGetQuotesByTaskerIdQuery(user?._id || '', { skip: !user?._id });

    // Map API tasks to the Quote interface
    const recentQuotes: Quote[] = Array.isArray(data?.quotes)
        ? data.quotes.map((task: any) => ({
            id: task._id,
            clientName: task.client?.firstName && task.client?.lastName
                ? `${task.client.firstName} ${task.client.lastName}`
                : "Unknown Client",
            clientAvatar: task.client?.avatar || "/placeholder.svg",
            service: task.taskTitle,
            amount: task.budget || null,
            status: task.status as "pending" | "sent" | "accepted" | "rejected" | "completed",
            createdAt: task.createdAt,
        }))
        : [];

    if (!isLoggedIn || !user || user.role !== "tasker") {
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
                        Please log in as a tasker to view your quotes.
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
                        Failed to load quotes: {error?.data?.message || "Unknown error"}
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
                                            <AvatarImage src={quote.clientAvatar || "/placeholder.svg"} />
                                            <AvatarFallback className="text-xs">
                                                {quote.clientName
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{quote.clientName}</p>
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
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Eye className="h-3 w-3" />
                                        </Button>
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