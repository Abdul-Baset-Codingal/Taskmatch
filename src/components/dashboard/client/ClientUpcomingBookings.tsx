/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { useGetUserBookingsQuery } from "@/features/api/taskerApi";
import { useEffect, useState, useMemo } from "react";
import { format, isToday, isTomorrow, formatDistanceToNow, startOfDay } from "date-fns";
import { skipToken } from "@reduxjs/toolkit/query/react";

export function ClientUpcomingBookings() {
    const [clientId, setClientId] = useState<string | null>(null);

    const {
        data: response,
        isLoading,
        isError,
        error,
        refetch
    } = useGetUserBookingsQuery(
        clientId ?? skipToken
    );

    // Auth check
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/auth/verify-token", {
                    credentials: "include"
                });

                if (!res.ok) {
                    console.error("Auth response not ok:", res.status);
                    return;
                }

                const data = await res.json();
                console.log("🔍 Auth data:", data);

                if (data.user?.currentRole === "client" && data.user?._id) {
                    setClientId(data.user._id);
                } else {
                    console.warn("User is not a client or missing ID:", data.user);
                }
            } catch (err) {
                console.error("Auth check failed:", err);
            }
        };
        checkAuth();
    }, []);

    // Process bookings with proper null checks
    const bookings = useMemo(() => {
        if (!response) return [];

        // Handle different response structures
        const data = Array.isArray(response)
            ? response
            : response?.data || response?.bookings || [];

        console.log("🔍 Processed bookings array:", data);
        return data;
    }, [response]);

    // Filter upcoming bookings
    const upcoming = useMemo(() => {
        if (!bookings.length) return [];

        const todayStart = startOfDay(new Date());

        const filtered = bookings
            .filter((b: any) => {
                // Handle different date field names
                const dateValue = b.date || b.scheduledDate || b.bookingDate;
                if (!dateValue) {
                    console.warn("Booking missing date:", b);
                    return false;
                }

                const bookingDate = new Date(dateValue);
                const status = b.status?.toLowerCase();

                const isValid = !isNaN(bookingDate.getTime());
                const isUpcoming = bookingDate >= todayStart;
                const isActive = status !== "cancelled" && status !== "completed";

                return isValid && isUpcoming && isActive;
            })
            .sort((a: any, b: any) => {
                const dateA = new Date(a.date || a.scheduledDate || a.bookingDate);
                const dateB = new Date(b.date || b.scheduledDate || b.bookingDate);
                return dateA.getTime() - dateB.getTime();
            })
            .slice(0, 5);

        console.log("🔍 Filtered upcoming:", filtered);
        return filtered;
    }, [bookings]);

    const formatBookingDate = (dateStr: string) => {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return "Invalid date";
        if (isToday(date)) return "Today";
        if (isTomorrow(date)) return "Tomorrow";
        return format(date, "EEE, MMM d");
    };

    const formatBookingTime = (dateStr: string) => {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return "";
        return format(date, "h:mm a");
    };

    const getStatusBadge = (status: string) => {
        const s = status?.toLowerCase() || "";
        switch (s) {
            case "confirmed":
            case "in_progress":
            case "in-progress":
                return { label: "Confirmed", bg: "bg-[#E5FFDB]", text: "text-[#109C3D]" };
            case "pending":
                return { label: "Pending", bg: "bg-yellow-100", text: "text-yellow-700" };
            default:
                return { label: status || "Unknown", bg: "bg-gray-100", text: "text-gray-700" };
        }
    };

    // Loading state
    if (!clientId && !isLoading) {
        return (
            <Card className="border-0 shadow-md bg-white">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-[#063A41]">
                        Upcoming Bookings
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center py-12 text-gray-500">
                    Log in as a client to view your bookings
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-[#109C3D]" />

            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-[#E5FFDB] shadow-sm">
                            <Calendar className="w-6 h-6 text-[#109C3D]" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold text-[#063A41]">
                                Upcoming Bookings
                            </CardTitle>
                            <p className="text-sm text-gray-500">Your scheduled services</p>
                        </div>
                    </div>
                    <Badge className="bg-[#E5FFDB] text-[#109C3D] font-medium">
                        {upcoming.length} upcoming
                    </Badge>
                </div>
            </CardHeader>

            <CardContent>
                {isLoading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4 animate-pulse">
                                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-40" />
                                    <div className="h-3 bg-gray-200 rounded w-32" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : isError ? (
                    <div className="text-center py-12">
                        <p className="text-red-600 mb-4">Failed to load bookings</p>
                        <p className="text-sm text-gray-500 mb-4">
                            {(error as any)?.message || "Unknown error"}
                        </p>
                        <Button onClick={() => refetch()} variant="outline" size="sm">
                            Retry
                        </Button>
                    </div>
                ) : upcoming.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="font-medium">No upcoming bookings</p>
                        <p className="text-sm">Your schedule is clear</p>
                        {bookings.length > 0 && (
                            <p className="text-xs mt-2 text-gray-400">
                                ({bookings.length} total bookings found, none upcoming)
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {upcoming.map((booking: any) => {
                            const status = getStatusBadge(booking.status);
                            const dateField = booking.date || booking.scheduledDate;
                            const tasker = booking.tasker || {};
                            const taskerName = tasker.fullName ||
                                `${tasker.firstName || ""} ${tasker.lastName || ""}`.trim() ||
                                "Unknown Tasker";

                            return (
                                <div
                                    key={booking._id}
                                    className="p-4 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4 flex-1">
                                            <Avatar className="h-11 w-11 ring-2 ring-white shadow-md">
                                                <AvatarImage src={tasker.profilePicture} />
                                                <AvatarFallback className="bg-[#063A41] text-white text-sm font-medium">
                                                    {taskerName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-[#063A41]">{taskerName}</p>
                                                <p className="text-sm text-gray-600 truncate">
                                                    {booking.service?.title || booking.serviceType || "Service"}
                                                </p>

                                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        <span>
                                                            {formatBookingDate(dateField)} at {formatBookingTime(dateField)}
                                                        </span>
                                                    </div>
                                                    {booking.location && (
                                                        <div className="flex items-center gap-1">
                                                            <MapPin className="w-3.5 h-3.5" />
                                                            <span className="truncate max-w-32">
                                                                {booking.location}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <Badge className={`${status.bg} ${status.text} border-0 font-medium text-xs`}>
                                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                                {status.label}
                                            </Badge>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {formatDistanceToNow(new Date(dateField), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* <div className="flex gap-2 mt-4">
                                        <Button size="sm" variant="outline" className="flex-1 h-9 text-xs font-medium">
                                            <Phone className="w-3.5 h-3.5 mr-1.5" />
                                            Call Tasker
                                        </Button>
                                        <Button size="sm" className="flex-1 h-9 text-xs font-medium bg-[#109C3D] hover:bg-[#063A41]">
                                            <MapPin className="w-3.5 h-3.5 mr-1.5" />
                                            Directions
                                        </Button>
                                    </div> */}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* {upcoming.length > 0 && (
                    <div className="mt-6 pt-4 border-t">
                        <Button variant="outline" className="w-full font-medium" asChild>
                            <a href="/client/bookings">View All Bookings →</a>
                        </Button>
                    </div>
                )} */}
            </CardContent>
        </Card>
    );
}