// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react-hooks/exhaustive-deps */
// "use client";

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Calendar, MapPin, Phone, Clock } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import React, { useEffect, useState } from "react";

// interface ApiBooking {
//     _id: string;
//     status: "pending" | "confirmed" | "cancelled" | "completed";
//     date: string;
//     client: {
//         firstName: string;
//         lastName: string;
//         phone?: string;
//         avatar?: string;
//     };
//     service: {
//         title: string;
//         description: string;
//         hourlyRate: number;
//         estimatedDuration: string;
//     };
//     location?: string;
//     priority?: "high" | "medium" | "low";
//     // Add other fields as needed
// }

// interface Booking {
//     id: string;
//     clientName: string;
//     clientAvatar?: string;
//     service: string;
//     date: string;
//     time: string;
//     location: string;
//     phone: string;
//     status: "confirmed" | "pending" | "in-progress" | "completed" | "cancelled";
//     priority: "high" | "medium" | "low";
// }

// const statusConfig = {
//     confirmed: { color: "bg-green-100 text-green-800 border-green-200" },
//     pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
//     "in-progress": { color: "bg-blue-100 text-blue-800 border-blue-200" },
//     completed: { color: "bg-gray-100 text-gray-800 border-gray-200" },
//     cancelled: { color: "bg-red-100 text-red-800 border-red-200" },
// };

// const priorityConfig = {
//     high: { color: "bg-red-100 text-red-800 border-red-200" },
//     medium: { color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
//     low: { color: "bg-green-100 text-green-800 border-green-200" },
// };

// export function UpcomingBookings() {
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [userRole, setUserRole] = useState<string | null>(null);
//     const [userId, setUserId] = useState<string | null>(null);
//     const [bookings, setBookings] = useState<ApiBooking[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     // Check login status and get user ID
//     const checkLoginStatus = async () => {
//         try {
//             const response = await fetch("http://localhost:5000/api/auth/verify-token", {
//                 method: "GET",
//                 credentials: "include",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 setIsLoggedIn(true);
//                 setUserRole(data.user.role);
//                 setUserId(data.user._id);
//                 console.log("Token verified. User logged in:", data.user._id);
//             } else {
//                 setIsLoggedIn(false);
//                 setUserRole(null);
//                 setUserId(null);
//                 console.log("Token verification failed. User logged out.");
//             }
//         } catch (error) {
//             setIsLoggedIn(false);
//             setUserRole(null);
//             setUserId(null);
//             console.error("Error verifying token:", error);
//         }
//     };

//     // Fetch bookings by tasker ID
//     const fetchBookings = async () => {
//         if (!userId || userRole !== "tasker") return;

//         try {
//             setLoading(true);
//             setError(null);
//             const response = await fetch(`http://localhost:5000/api/taskerBookings/tasker/${userId}`, {
//                 method: "GET",
//                 credentials: "include",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 setBookings(Array.isArray(data) ? data : []);
//                 console.log("booking", data)
//             } else {
//                 const errorData = await response.json();
//                 setError(errorData.message || "Failed to fetch bookings");
//             }
//         } catch (error) {
//             setError("Error fetching bookings: " + (error as Error).message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         checkLoginStatus();
//     }, []);

//     useEffect(() => {
//         if (isLoggedIn && userRole === "tasker" && userId) {
//             fetchBookings();
//         }
//     }, [isLoggedIn, userRole, userId]);

//     // Map API bookings to component Booking interface and filter upcoming
//     const upcomingBookings: Booking[] = bookings
//         .filter((booking) => new Date(booking.date) >= new Date()) // Filter upcoming
//         .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sort by date ascending
//         .slice(0, 4) // Limit to 4 like static
//         .map((booking) => {
//             const bookingDate = new Date(booking.date);
//             return {
//                 id: booking._id,
//                 clientName: `${booking.client.firstName} ${booking.client.lastName}`,
//                 clientAvatar: booking.client.avatar || undefined,
//                 service: booking.service.title,
//                 date: bookingDate.toLocaleDateString("en-US", {
//                     month: "short",
//                     day: "numeric",
//                     year: "numeric",
//                 }),
//                 time: bookingDate.toLocaleTimeString("en-US", {
//                     hour: "numeric",
//                     minute: "2-digit",
//                     hour12: true,
//                 }),
//                 location: booking.location || "N/A",
//                 phone: booking.client.phone || "N/A",
//                 status: booking.status as any, // Map directly, adjust if needed (e.g., 'cancelled' to 'rejected' if mismatch)
//                 priority: (booking.priority as "high" | "medium" | "low") || "medium",
//             };
//         });

//     if (!isLoggedIn || userRole !== "tasker") {
//         return (
//             <Card className="hover:shadow-md transition-shadow">
//                 <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                         <Calendar className="h-4 w-4" />
//                         Upcoming Bookings
//                     </CardTitle>
//                     <CardDescription>Next appointments and service calls</CardDescription>
//                 </CardHeader>
//                 <CardContent className="text-center py-8 text-gray-400 text-sm">
//                     Please log in as a tasker to view your bookings.
//                 </CardContent>
//             </Card>
//         );
//     }

//     if (loading) {
//         return (
//             <Card className="hover:shadow-md transition-shadow">
//                 <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                         <Calendar className="h-4 w-4" />
//                         Upcoming Bookings
//                     </CardTitle>
//                     <CardDescription>Next appointments and service calls</CardDescription>
//                 </CardHeader>
//                 <CardContent className="text-center py-8 text-gray-400 text-sm animate-pulse">
//                     Loading bookings...
//                 </CardContent>
//             </Card>
//         );
//     }

//     if (error) {
//         return (
//             <Card className="hover:shadow-md transition-shadow">
//                 <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                         <Calendar className="h-4 w-4" />
//                         Upcoming Bookings
//                     </CardTitle>
//                     <CardDescription>Next appointments and service calls</CardDescription>
//                 </CardHeader>
//                 <CardContent className="text-center py-8 text-red-400 text-sm">
//                     {error}
//                 </CardContent>
//             </Card>
//         );
//     }

//     return (
//         <Card className="hover:shadow-md transition-shadow">
//             <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                     <Calendar className="h-4 w-4" />
//                     Upcoming Bookings
//                 </CardTitle>
//                 <CardDescription>Next appointments and service calls</CardDescription>
//             </CardHeader>
//             <CardContent>
//                 <div className="space-y-4">
//                     {upcomingBookings.length === 0 ? (
//                         <div className="text-center py-8 text-gray-400 text-sm">No upcoming bookings found</div>
//                     ) : (
//                         upcomingBookings.map((booking) => (
//                             <div key={booking.id} className="p-3 rounded-lg border bg-card/50 space-y-3">
//                                 <div className="flex items-start justify-between">
//                                     <div className="flex items-center gap-3">
//                                         <Avatar className="h-8 w-8">
//                                             <AvatarImage src={booking.clientAvatar || "/placeholder.svg"} />
//                                             <AvatarFallback className="text-xs">
//                                                 {booking.clientName
//                                                     .split(" ")
//                                                     .map((n) => n[0])
//                                                     .join("")}
//                                             </AvatarFallback>
//                                         </Avatar>
//                                         <div>
//                                             <p className="text-sm font-medium">{booking.clientName}</p>
//                                             <p className="text-xs text-muted-foreground">{booking.service}</p>
//                                         </div>
//                                     </div>
//                                     <div className="flex gap-1">
//                                         <Badge variant="outline" className={`text-xs ${statusConfig[booking.status]?.color || "bg-gray-100 text-gray-800 border-gray-200"}`}>
//                                             {booking.status}
//                                         </Badge>
//                                         <Badge variant="outline" className={`text-xs ${priorityConfig[booking.priority]?.color || "bg-gray-100 text-gray-800 border-gray-200"}`}>
//                                             {booking.priority}
//                                         </Badge>
//                                     </div>
//                                 </div>

//                                 <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground">
//                                     <div className="flex items-center gap-2">
//                                         <Clock className="h-3 w-3" />
//                                         <span>
//                                             {new Date(booking.date).toLocaleDateString()} at {booking.time}
//                                         </span>
//                                     </div>
//                                     <div className="flex items-center gap-2">
//                                         <MapPin className="h-3 w-3" />
//                                         <span className="truncate">{booking.location}</span>
//                                     </div>
//                                     <div className="flex items-center gap-2">
//                                         <Phone className="h-3 w-3" />
//                                         <span>{booking.phone}</span>
//                                     </div>
//                                 </div>

//                                 <div className="flex gap-2 pt-2">
//                                     <Button variant="outline" size="sm" className="flex-1 text-xs h-7 bg-transparent">
//                                         <Phone className="h-3 w-3 mr-1" />
//                                         Call
//                                     </Button>
//                                     <Button variant="outline" size="sm" className="flex-1 text-xs h-7 bg-transparent">
//                                         <MapPin className="h-3 w-3 mr-1" />
//                                         Navigate
//                                     </Button>
//                                 </div>
//                             </div>
//                         ))
//                     )}
//                 </div>

//                 <div className="mt-4 pt-4 border-t">
//                     <Button variant="outline" className="w-full text-sm bg-transparent">
//                         <Calendar className="h-4 w-4 mr-2" />
//                         View All Bookings
//                     </Button>
//                 </div>
//             </CardContent>
//         </Card>
//     );
// }


"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MapPin, Phone, Clock, CheckCircle2 } from "lucide-react";
import { format, isToday, isTomorrow, formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";

interface ApiBooking {
    _id: string;
    status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
    date: string;
    client: {
        firstName: string;
        lastName: string;
        phone?: string;
        avatar?: string;
    };
    service: {
        title: string;
        hourlyRate: number;
        estimatedDuration: string;
    };
    location?: string;
}

export function UpcomingBookings() {
    const [bookings, setBookings] = useState<ApiBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [taskerId, setTaskerId] = useState<string | null>(null);

    // Verify login + get tasker ID
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("/api/auth/verify-token", { credentials: "include" });
                if (res.ok) {
                    const data = await res.json();
                    if (data.user?.currentRole === "tasker") {
                        setTaskerId(data.user._id);
                    }
                }
            } catch (err) {
                console.error("Auth failed", err);
            }
        };
        checkAuth();
    }, []);

    // Fetch bookings
    useEffect(() => {
        if (!taskerId) return;

        const fetchBookings = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/taskerBookings/tasker/${taskerId}`, {
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    setBookings(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                console.error("Failed to load bookings", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [taskerId]);

    // Filter & sort upcoming bookings
    const upcoming = bookings
        .filter(b => new Date(b.date) >= new Date() && b.status !== "cancelled" && b.status !== "completed")
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "confirmed":
            case "in_progress":
                return { label: "Confirmed", bg: "bg-[#E5FFDB]", text: "text-[#109C3D]" };
            case "pending":
                return { label: "Pending", bg: "bg-gray-100", text: "text-gray-700" };
            default:
                return { label: status, bg: "bg-gray-100", text: "text-gray-700" };
        }
    };

    const formatBookingDate = (dateStr: string) => {
        const date = new Date(dateStr);
        if (isToday(date)) return "Today";
        if (isTomorrow(date)) return "Tomorrow";
        return format(date, "EEE, MMM d");
    };

    const formatBookingTime = (dateStr: string) => {
        return format(new Date(dateStr), "h:mm a");
    };

    if (!taskerId) {
        return (
            <Card className="border-0 shadow-md bg-white">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-[#063A41]">Upcoming Bookings</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-12 text-gray-500">
                    Log in as a tasker to view your schedule
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
                            <Calendar className="w-6 h-6 text-[#109C3D]" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold text-[#063A41]">
                                Upcoming Bookings
                            </CardTitle>
                            <p className="text-sm text-gray-500">Your next appointments</p>
                        </div>
                    </div>
                    <Badge className="bg-[#E5FFDB] text-[#109C3D] font-medium">
                        {upcoming.length} upcoming
                    </Badge>
                </div>
            </CardHeader>

            <CardContent>
                {loading ? (
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
                ) : upcoming.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="font-medium">No upcoming bookings</p>
                        <p className="text-sm">Your schedule is clear for now</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {upcoming.map((booking) => {
                            const status = getStatusBadge(booking.status);
                            const clientName = `${booking.client.firstName} ${booking.client.lastName}`;

                            return (
                                <div
                                    key={booking._id}
                                    className="p-4 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4 flex-1">
                                            <Avatar className="h-11 w-11 ring-2 ring-white shadow-md">
                                                <AvatarImage src={booking.client.avatar} />
                                                <AvatarFallback className="bg-[#063A41] text-white text-sm font-medium">
                                                    {clientName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-[#063A41]">{clientName}</p>
                                                <p className="text-sm text-gray-600 truncate">{booking.service.title}</p>

                                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        <span>
                                                            {formatBookingDate(booking.date)} at {formatBookingTime(booking.date)}
                                                        </span>
                                                    </div>
                                                    {booking.location && (
                                                        <div className="flex items-center gap-1">
                                                            <MapPin className="w-3.5 h-3.5" />
                                                            <span className="truncate max-w-32">{booking.location}</span>
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
                                                {formatDistanceToNow(new Date(booking.date), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-4">
                                        <Button size="sm" variant="outline" className="flex-1 h-9 text-xs font-medium">
                                            <Phone className="w-3.5 h-3.5 mr-1.5" />
                                            Call Client
                                        </Button>
                                        <Button size="sm" className="flex-1 h-9 text-xs font-medium bg-[#109C3D] hover:bg-[#063A41]">
                                            <MapPin className="w-3.5 h-3.5 mr-1.5" />
                                            Directions
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {upcoming.length > 0 && (
                    <div className="mt-6 pt-4 border-t">
                        <Button variant="outline" className="w-full font-medium" asChild>
                            <a href="/tasker/bookings">
                                View Full Schedule →
                            </a>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}