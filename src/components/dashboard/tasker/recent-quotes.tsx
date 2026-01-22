
// "use client";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { MessageSquare, Clock, CheckCircle2, XCircle } from "lucide-react";
// import { useGetQuotesByTaskerIdQuery } from "@/features/api/taskerApi";
// import { useEffect, useState } from "react";
// import { formatDistanceToNow } from "date-fns";
// import { skipToken } from "@reduxjs/toolkit/query/react";

// interface Quote {
//     _id: string;
//     client: { firstName: string; lastName: string; avatar?: string };
//     taskTitle: string;
//     budget?: number;
//     status: "pending" | "sent" | "accepted" | "rejected" | "completed";
//     createdAt: string;
// }

// export function RecentQuotes() {
//     const [taskerId, setTaskerId] = useState<string | null>(null);

//     // Simple auth check (you can replace with your existing checkLoginStatus)
//     useEffect(() => {
//         const checkAuth = async () => {
//             try {
//                 const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/verify-token`, {
//                     credentials: "include",
//                 });
//                 if (res.ok) {
//                     const data = await res.json();
//                     if (data.user?.currentRole === "tasker") {
//                         setTaskerId(data.user._id);
//                     }
//                 }
//             } catch (err) {
//                 console.error("Auth check failed", err);
//             }
//         };
//         checkAuth();
//     }, []);

//     const { data: rawData, isLoading, isError } = useGetQuotesByTaskerIdQuery(
//         taskerId ? taskerId : skipToken,
//         { skip: !taskerId }
//     );

//     const quotes: Quote[] = rawData?.quotes || [];

//     // Status config — only your brand colors
//     const getStatusConfig = (status: string) => {
//         switch (status) {
//             case "pending":
//                 return { label: "Pending", icon: Clock, bg: "bg-gray-100", text: "text-gray-700" };
//             case "sent":
//                 return { label: "Sent", icon: MessageSquare, bg: "bg-[#E5FFDB]", text: "text-[#109C3D]" };
//             case "accepted":
//                 return { label: "Accepted", icon: CheckCircle2, bg: "bg-[#E5FFDB]", text: "text-[#109C3D]" };
//             case "rejected":
//                 return { label: "Rejected", icon: XCircle, bg: "bg-red-50", text: "text-red-700" };
//             case "completed":
//                 return { label: "Completed", icon: CheckCircle2, bg: "bg-[#E5FFDB]", text: "text-[#109C3D]" };
//             default:
//                 return { label: status, icon: Clock, bg: "bg-gray-100", text: "text-gray-700" };
//         }
//     };

//     if (!taskerId) {
//         return (
//             <Card className="border-0 shadow-md bg-white">
//                 <CardHeader>
//                     <CardTitle className="text-xl font-bold text-[#063A41]">Recent Quotes</CardTitle>
//                 </CardHeader>
//                 <CardContent className="text-center py-12 text-gray-500">
//                     Please log in as a tasker to view your quotes.
//                 </CardContent>
//             </Card>
//         );
//     }

//     return (
//         <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white">
//             {/* Top green accent */}
//             <div className="absolute inset-x-0 top-0 h-1.5 bg-[#109C3D] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />

//             <CardHeader className="pb-4">
//                 <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                         <div className="p-3 rounded-full bg-[#E5FFDB] shadow-sm">
//                             <MessageSquare className="w-6 h-6 text-[#109C3D]" />
//                         </div>
//                         <div>
//                             <CardTitle className="text-xl font-bold text-[#063A41]">
//                                 Recent Quotes
//                             </CardTitle>
//                             <p className="text-sm text-gray-500">Incoming quote requests</p>
//                         </div>
//                     </div>
//                     <Badge variant="secondary" className="text-sm">
//                         {quotes.length} active
//                     </Badge>
//                 </div>
//             </CardHeader>

//             <CardContent>
//                 {isLoading ? (
//                     <div className="space-y-4">
//                         {[...Array(4)].map((_, i) => (
//                             <div key={i} className="flex items-center gap-4 animate-pulse">
//                                 <div className="w-10 h-10 bg-gray-200 rounded-full" />
//                                 <div className="flex-1 space-y-2">
//                                     <div className="h-4 bg-gray-200 rounded w-48" />
//                                     <div className="h-3 bg-gray-200 rounded w-32" />
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 ) : isError ? (
//                     <div className="text-center py-12 text-red-600">Failed to load quotes</div>
//                 ) : quotes.length === 0 ? (
//                     <div className="text-center py-12 text-gray-500">
//                         <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
//                         <p className="font-medium">No quotes yet</p>
//                         <p className="text-sm">Quote requests from clients will appear here</p>
//                     </div>
//                 ) : (
//                     <div className="space-y-4">
//                         {quotes.slice(0, 5).map((quote) => {
//                             const status = getStatusConfig(quote.status);
//                             const StatusIcon = status.icon;
//                             const clientName = `${quote.client?.firstName || ""} ${quote.client?.lastName || ""}`.trim() || "Anonymous Client";

//                             return (
//                                 <div
//                                     key={quote._id}
//                                     className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
//                                 >
//                                     <div className="flex items-center gap-4">
//                                         <Avatar className="h-10 w-10 ring-2 ring-white shadow-md">
//                                             <AvatarImage src={quote.client?.avatar} />
//                                             <AvatarFallback className="bg-[#063A41] text-white text-sm">
//                                                 {clientName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
//                                             </AvatarFallback>
//                                         </Avatar>

//                                         <div>
//                                             <p className="font-medium text-[#063A41]">{clientName}</p>
//                                             <p className="text-sm text-gray-600 truncate max-w-48">{quote.taskTitle}</p>
//                                             <p className="text-xs text-gray-500 mt-1">
//                                                 {formatDistanceToNow(new Date(quote.createdAt), { addSuffix: true })}
//                                             </p>
//                                         </div>
//                                     </div>

//                                     <div className="flex items-center gap-3">
//                                         <div className="text-right">
//                                             <p className="font-bold text-[#109C3D]">
//                                                 {quote.budget ? `$${quote.budget.toLocaleString()}` : "Custom"}
//                                             </p>
//                                             <Badge className={`mt-1 text-xs font-medium ${status.bg} ${status.text} border-0`}>
//                                                 <StatusIcon className="w-3 h-3 mr-1" />
//                                                 {status.label}
//                                             </Badge>
//                                         </div>
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 )}
//             </CardContent>
//         </Card>
//     );
// }

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useGetQuotesByTaskerIdQuery } from "@/features/api/taskerApi";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { skipToken } from "@reduxjs/toolkit/query/react";

interface Quote {
    _id: string;
    client: { firstName: string; lastName: string; avatar?: string };
    taskTitle: string;
    budget?: number;
    status: "pending" | "sent" | "accepted" | "rejected" | "completed";
    createdAt: string;
}

export function RecentQuotes() {
    const [taskerId, setTaskerId] = useState<string | null>(null);

    // Simple auth check (you can replace with your existing checkLoginStatus)
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch(`/api/auth/verify-token`, {
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.user?.currentRole === "tasker") {
                        setTaskerId(data.user._id);
                    }
                }
            } catch (err) {
                console.error("Auth check failed", err);
            }
        };
        checkAuth();
    }, []);

    const { data: rawData, isLoading, isError, error } = useGetQuotesByTaskerIdQuery(
        taskerId ? taskerId : skipToken,
        { skip: !taskerId }
    );

    const quotes: Quote[] = rawData?.quotes || [];

    // Check if it's an empty/not found error vs actual error
    const isEmptyOrNotFound =
        (error as any)?.status === 404 ||
        (error as any)?.status === 400 ||
        (error as any)?.data?.message?.toLowerCase()?.includes("no quotes") ||
        (error as any)?.data?.message?.toLowerCase()?.includes("not found");

    const isActualError = isError && !isEmptyOrNotFound;

    // Status config — only your brand colors
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

    // Check if we should show empty state
    const showEmptyState = quotes.length === 0 || isEmptyOrNotFound;

    if (!taskerId) {
        return (
            <Card className="border-0 shadow-md bg-white">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-[#063A41]">Recent Quotes</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-12 text-gray-500">
                    Please log in as a tasker to view your quotes.
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
                                Recent Quotes
                            </CardTitle>
                            <p className="text-sm text-gray-500">Incoming quote requests</p>
                        </div>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                        {quotes.length} active
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
                ) : isActualError ? (
                    // Only show error for actual errors, not empty/not found
                    <div className="text-center py-12 text-red-600">
                        <XCircle className="w-12 h-12 mx-auto mb-4 text-red-300" />
                        <p className="font-medium">Failed to load quotes</p>
                        <p className="text-sm text-gray-500 mt-1">Please try again later</p>
                    </div>
                ) : showEmptyState ? (
                    // Show empty state for both empty data and "not found" errors
                    <div className="text-center py-12 text-gray-500">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="font-medium">No quotes yet</p>
                        <p className="text-sm">Quote requests from clients will appear here</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {quotes.slice(0, 5).map((quote) => {
                            const status = getStatusConfig(quote.status);
                            const StatusIcon = status.icon;
                            const clientName = `${quote.client?.firstName || ""} ${quote.client?.lastName || ""}`.trim() || "Anonymous Client";

                            return (
                                <div
                                    key={quote._id}
                                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                                >
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-10 w-10 ring-2 ring-white shadow-md">
                                            <AvatarImage src={quote.client?.avatar} />
                                            <AvatarFallback className="bg-[#063A41] text-white text-sm">
                                                {clientName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div>
                                            <p className="font-medium text-[#063A41]">{clientName}</p>
                                            <p className="text-sm text-gray-600 truncate max-w-48">{quote.taskTitle}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {formatDistanceToNow(new Date(quote.createdAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="font-bold text-[#109C3D]">
                                                {quote.budget ? `$${quote.budget.toLocaleString()}` : "Custom"}
                                            </p>
                                            <Badge className={`mt-1 text-xs font-medium ${status.bg} ${status.text} border-0`}>
                                                <StatusIcon className="w-3 h-3 mr-1" />
                                                {status.label}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}