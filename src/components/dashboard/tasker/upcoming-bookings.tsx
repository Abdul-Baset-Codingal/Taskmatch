/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Phone, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useEffect, useState } from "react";

interface ApiBooking {
    _id: string;
    status: "pending" | "confirmed" | "cancelled" | "completed";
    date: string;
    client: {
        firstName: string;
        lastName: string;
        phone?: string;
        avatar?: string;
    };
    service: {
        title: string;
        description: string;
        hourlyRate: number;
        estimatedDuration: string;
    };
    location?: string;
    priority?: "high" | "medium" | "low";
    // Add other fields as needed
}

interface Booking {
    id: string;
    clientName: string;
    clientAvatar?: string;
    service: string;
    date: string;
    time: string;
    location: string;
    phone: string;
    status: "confirmed" | "pending" | "in-progress" | "completed" | "cancelled";
    priority: "high" | "medium" | "low";
}

const statusConfig = {
    confirmed: { color: "bg-green-100 text-green-800 border-green-200" },
    pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    "in-progress": { color: "bg-blue-100 text-blue-800 border-blue-200" },
    completed: { color: "bg-gray-100 text-gray-800 border-gray-200" },
    cancelled: { color: "bg-red-100 text-red-800 border-red-200" },
};

const priorityConfig = {
    high: { color: "bg-red-100 text-red-800 border-red-200" },
    medium: { color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    low: { color: "bg-green-100 text-green-800 border-green-200" },
};

export function UpcomingBookings() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [bookings, setBookings] = useState<ApiBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Check login status and get user ID
    const checkLoginStatus = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/auth/verify-token", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setIsLoggedIn(true);
                setUserRole(data.user.role);
                setUserId(data.user._id);
                console.log("Token verified. User logged in:", data.user._id);
            } else {
                setIsLoggedIn(false);
                setUserRole(null);
                setUserId(null);
                console.log("Token verification failed. User logged out.");
            }
        } catch (error) {
            setIsLoggedIn(false);
            setUserRole(null);
            setUserId(null);
            console.error("Error verifying token:", error);
        }
    };

    // Fetch bookings by tasker ID
    const fetchBookings = async () => {
        if (!userId || userRole !== "tasker") return;

        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`http://localhost:5000/api/taskerBookings/tasker/${userId}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setBookings(Array.isArray(data) ? data : []);
                console.log("booking", data)
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Failed to fetch bookings");
            }
        } catch (error) {
            setError("Error fetching bookings: " + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkLoginStatus();
    }, []);

    useEffect(() => {
        if (isLoggedIn && userRole === "tasker" && userId) {
            fetchBookings();
        }
    }, [isLoggedIn, userRole, userId]);

    // Map API bookings to component Booking interface and filter upcoming
    const upcomingBookings: Booking[] = bookings
        .filter((booking) => new Date(booking.date) >= new Date()) // Filter upcoming
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sort by date ascending
        .slice(0, 4) // Limit to 4 like static
        .map((booking) => {
            const bookingDate = new Date(booking.date);
            return {
                id: booking._id,
                clientName: `${booking.client.firstName} ${booking.client.lastName}`,
                clientAvatar: booking.client.avatar || undefined,
                service: booking.service.title,
                date: bookingDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                }),
                time: bookingDate.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                }),
                location: booking.location || "N/A",
                phone: booking.client.phone || "N/A",
                status: booking.status as any, // Map directly, adjust if needed (e.g., 'cancelled' to 'rejected' if mismatch)
                priority: (booking.priority as "high" | "medium" | "low") || "medium",
            };
        });

    if (!isLoggedIn || userRole !== "tasker") {
        return (
            <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Upcoming Bookings
                    </CardTitle>
                    <CardDescription>Next appointments and service calls</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-8 text-gray-400 text-sm">
                    Please log in as a tasker to view your bookings.
                </CardContent>
            </Card>
        );
    }

    if (loading) {
        return (
            <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Upcoming Bookings
                    </CardTitle>
                    <CardDescription>Next appointments and service calls</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-8 text-gray-400 text-sm animate-pulse">
                    Loading bookings...
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Upcoming Bookings
                    </CardTitle>
                    <CardDescription>Next appointments and service calls</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-8 text-red-400 text-sm">
                    {error}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Upcoming Bookings
                </CardTitle>
                <CardDescription>Next appointments and service calls</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {upcomingBookings.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 text-sm">No upcoming bookings found</div>
                    ) : (
                        upcomingBookings.map((booking) => (
                            <div key={booking.id} className="p-3 rounded-lg border bg-card/50 space-y-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={booking.clientAvatar || "/placeholder.svg"} />
                                            <AvatarFallback className="text-xs">
                                                {booking.clientName
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium">{booking.clientName}</p>
                                            <p className="text-xs text-muted-foreground">{booking.service}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <Badge variant="outline" className={`text-xs ${statusConfig[booking.status]?.color || "bg-gray-100 text-gray-800 border-gray-200"}`}>
                                            {booking.status}
                                        </Badge>
                                        <Badge variant="outline" className={`text-xs ${priorityConfig[booking.priority]?.color || "bg-gray-100 text-gray-800 border-gray-200"}`}>
                                            {booking.priority}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-3 w-3" />
                                        <span>
                                            {new Date(booking.date).toLocaleDateString()} at {booking.time}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-3 w-3" />
                                        <span className="truncate">{booking.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-3 w-3" />
                                        <span>{booking.phone}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <Button variant="outline" size="sm" className="flex-1 text-xs h-7 bg-transparent">
                                        <Phone className="h-3 w-3 mr-1" />
                                        Call
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex-1 text-xs h-7 bg-transparent">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        Navigate
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-4 pt-4 border-t">
                    <Button variant="outline" className="w-full text-sm bg-transparent">
                        <Calendar className="h-4 w-4 mr-2" />
                        View All Bookings
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}