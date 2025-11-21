/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Calendar, MapPin, Phone, Clock } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { useState, useEffect } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination, Autoplay } from "swiper/modules";
// import { useGetUserBookingsQuery } from "@/features/api/taskerApi";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import { FaCalendarAlt, FaDollarSign, FaWrench } from "react-icons/fa";

// interface ApiBooking {
//     _id: string;
//     status: "pending" | "confirmed" | "cancelled" | "completed";
//     date: string;
//     client: {
//         firstName: string;
//         lastName: string;
//         phone?: string;
//         avatar?: string;
//         _id: string;
//     };
//     tasker: {
//         firstName: string;
//         lastName: string;
//         fullName: string;
//         profilePicture?: string;
//         phone?: string;
//         email?: string;
//         _id: string;
//     };
//     service: {
//         title: string;
//         description: string;
//         hourlyRate: number;
//         estimatedDuration: string;
//     };
//     location?: string;
//     priority?: "high" | "medium" | "low";
// }

// interface Booking {
//     id: string;
//     clientName: string;
//     clientAvatar?: string;
//     taskerName: string;
//     taskerAvatar?: string;
//     taskerEmail?: string;
//     taskerPhone?: string;
//     service: string;
//     description: string;
//     hourlyRate: number;
//     estimatedDuration: string;
//     date: string;
//     time: string;
//     location: string;
//     phone: string;
//     status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
//     priority: "high" | "medium" | "low";
//     createdAt: string;
// }

// const statusConfig = {
//     confirmed: { color: "bg-green-50 text-green-700 border border-green-200" },
//     pending: { color: "bg-yellow-50 text-yellow-700 border border-yellow-200" },
//     "in-progress": { color: "bg-blue-50 text-blue-700 border border-blue-200" },
//     completed: { color: "bg-gray-50 text-gray-700 border border-gray-200" },
//     cancelled: { color: "bg-red-50 text-red-700 border border-red-200" },
// };



// export function ClientUpcomingBookings() {
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [user, setUser] = useState<{ _id: string; role: string } | null>(null);

//     // Check login status
//     const checkLoginStatus = async () => {
//         try {
//             const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/verify-token`, {
//                 method: "GET",
//                 credentials: "include",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 setIsLoggedIn(true);
//                 setUser({ _id: data.user._id, role: data.user.role });
//                 console.log("Token verified. User logged in:", data.user._id);
//             } else {
//                 setIsLoggedIn(false);
//                 setUser(null);
//                 console.log("Token verification failed. User logged out.");
//             }
//         } catch (error) {
//             setIsLoggedIn(false);
//             setUser(null);
//             console.error("Error verifying token:", error);
//         }
//     };

//     useEffect(() => {
//         checkLoginStatus();
//     }, []);

//     // Fetch bookings using RTK Query
//     const { data: bookings = [], isLoading, isError, error } = useGetUserBookingsQuery(user?._id, {
//         skip: !user?._id || user?.role !== "client",
//     });

//     // Debug bookings
//     useEffect(() => {
//         console.log("Bookings data:", bookings);
//         console.log("Error:", error);
//     }, [bookings, error]);

//     // Map API bookings to component Booking interface and filter upcoming
//     const upcomingBookings: Booking[] = bookings
//         .filter((booking: ApiBooking) => new Date(booking.date) >= new Date()) // Filter upcoming
//         .sort((a: ApiBooking, b: ApiBooking) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sort by date
//         .slice(0, 4) // Limit to 4
//         .map((booking: ApiBooking) => {
//             const bookingDate = new Date(booking.date);
//             return {
//                 id: booking._id,
//                 clientName: `${booking.client.firstName} ${booking.client.lastName}`,
//                 clientAvatar: booking.client.avatar,
//                 taskerName: booking.tasker.fullName,
//                 taskerAvatar: booking.tasker.profilePicture,
//                 taskerEmail: booking.tasker.email,
//                 taskerPhone: booking.tasker.phone,
//                 service: booking.service.title,
//                 description: booking.service.description,
//                 hourlyRate: booking.service.hourlyRate,
//                 estimatedDuration: booking.service.estimatedDuration,
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
//                 status: booking.status,
//                 priority: (booking.priority as "high" | "medium" | "low") || "medium",
//                 createdAt: booking.date,
//             };
//         });

//     if (!isLoggedIn || !user || user.role !== "client") {
//         return (
//             <Card className="hover:shadow-md transition-shadow">
//                 <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                         <Calendar className="h-4 w-4" />
//                         Upcoming Bookings
//                     </CardTitle>
//                     <CardDescription>Your upcoming booked services</CardDescription>
//                 </CardHeader>
//                 <CardContent className="text-center py-8 text-gray-400 text-sm">
//                     Please log in as a client to view your bookings.
//                 </CardContent>
//             </Card>
//         );
//     }

//     if (isLoading) {
//         return (
//             <Card className="hover:shadow-md transition-shadow">
//                 <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                         <Calendar className="h-4 w-4" />
//                         Upcoming Bookings
//                     </CardTitle>
//                     <CardDescription>Your upcoming booked services</CardDescription>
//                 </CardHeader>
//                 <CardContent className="text-center py-8 text-gray-400 text-sm animate-pulse">
//                     Loading bookings...
//                 </CardContent>
//             </Card>
//         );
//     }

//     if (isError) {
//         return (
//             <Card className="hover:shadow-md transition-shadow">
//                 <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                         <Calendar className="h-4 w-4" />
//                         Upcoming Bookings
//                     </CardTitle>
//                     <CardDescription>Your upcoming booked services</CardDescription>
//                 </CardHeader>
//                 <CardContent className="text-center py-8 text-red-400 text-sm">
//                     Failed to load bookings: {(error as any)?.data?.message || "Unknown error"}
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
//                 <CardDescription>Your upcoming booked services</CardDescription>
//             </CardHeader>
//             <CardContent>
//                 {upcomingBookings.length === 0 ? (
//                     <div className="text-center py-8 text-gray-400 text-sm">No upcoming bookings found</div>
//                 ) : (
//                     <Swiper
//                         modules={[Navigation, Pagination, Autoplay]}
//                         spaceBetween={16}
//                         slidesPerView={1}
//                         pagination={{ clickable: true }}
//                         autoplay={{ delay: 5000 }}
//                         className="my-6"
//                         breakpoints={{
//                             640: { slidesPerView: 1, spaceBetween: 16 },
//                             768: { slidesPerView: 2, spaceBetween: 20 },
//                             1024: { slidesPerView: 2, spaceBetween: 24 },
//                         }}
//                     >
//                         {upcomingBookings.map((booking) => (
//                             <SwiperSlide key={booking.id}>
//                                 <div className="relative bg-white rounded-2xl shadow-md max-w-full mx-auto overflow-hidden transition-all duration-500 hover:shadow-[0_12px_40px_rgba(79,70,229,0.2)] hover:-translate-y-1 border border-purple-100">
//                                     <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-xl ring-3 ring-white">
//                                         <FaWrench className="text-2xl text-white animate-spin-slow" />
//                                     </div>
//                                     <div className="pt-12 pb-4 px-4 space-y-4 bg-gradient-to-b from-purple-50 to-white relative z-10">
//                                         <div className="text-center">
//                                             <h3 className="text-lg font-bold text-gray-800 tracking-tight line-clamp-1">{booking.service}</h3>
//                                             <span className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium shadow-sm transition-all ${statusConfig[booking.status]?.color || "bg-gray-50 text-gray-700 border border-gray-200"}`}>
//                                                 <Clock className="h-3 w-3" />
//                                                 {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
//                                             </span>
//                                         </div>
//                                         <div className="bg-white rounded-xl p-3 shadow-inner border border-purple-100 transition-all duration-300 hover:bg-purple-50">
//                                             <p className="text-xs text-gray-600 italic text-center line-clamp-2 mb-2">{booking.description}</p>
//                                             <div className="flex flex-col justify-between text-xs font-semibold text-gray-700 gap-2">
//                                                 <span className="flex items-center justify-center gap-1.5 bg-orange-50 px-2 py-1 rounded-lg">
//                                                     <Clock className="text-orange-500 h-3 w-3" />
//                                                     {booking.estimatedDuration}
//                                                 </span>
//                                                 <span className="flex items-center justify-center gap-1.5 bg-green-50 px-2 py-1 rounded-lg">
//                                                     <FaDollarSign className="text-green-500 h-3 w-3" />
//                                                     ${booking.hourlyRate}/hr
//                                                 </span>
//                                             </div>
//                                         </div>
//                                         <div className="bg-indigo-50 rounded-xl p-3 flex items-center gap-2 transition-all duration-300 hover:bg-indigo-100 border border-indigo-100">
//                                             <Avatar className="h-8 w-8">
//                                                 <AvatarImage src={booking.taskerAvatar || "/placeholder.svg"} />
//                                                 <AvatarFallback className="text-xs">
//                                                     {booking.taskerName
//                                                         .split(" ")
//                                                         .map((n) => n[0])
//                                                         .join("")}
//                                                 </AvatarFallback>
//                                             </Avatar>
//                                             <div className="text-xs text-gray-700 leading-tight">
//                                                 <p className="font-semibold text-indigo-700 line-clamp-1">{booking.taskerName}</p>
//                                                 {booking.taskerPhone && <p className="text-xs line-clamp-1">{booking.taskerPhone}</p>}
//                                             </div>
//                                         </div>
//                                         <div className="flex flex-col items-center justify-between pt-3 border-t border-purple-200 gap-2">
//                                             <span className="flex items-center gap-1.5 text-xs text-gray-600">
//                                                 <FaCalendarAlt className="text-blue-500 h-3 w-3" />
//                                                 {booking.date} at {booking.time}
//                                             </span>
//                                             <div className="flex gap-2">
//                                                 <Button variant="outline" size="sm" className="flex-1 text-xs h-7 bg-transparent">
//                                                     <Phone className="h-3 w-3 mr-1" />
//                                                     Call
//                                                 </Button>
//                                                 <Button variant="outline" size="sm" className="flex-1 text-xs h-7 bg-transparent">
//                                                     <MapPin className="h-3 w-3 mr-1" />
//                                                     Navigate
//                                                 </Button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
//                                     <style>
//                                         {`
//                                             @keyframes spin-slow {
//                                                 0% { transform: rotate(0deg); }
//                                                 100% { transform: rotate(360deg); }
//                                             }
//                                             .animate-spin-slow {
//                                                 animation: spin-slow 10s linear infinite;
//                                             }
//                                         `}
//                                     </style>
//                                 </div>
//                             </SwiperSlide>
//                         ))}
//                     </Swiper>
//                 )}

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
import { useGetUserBookingsQuery } from "@/features/api/taskerApi";
import { useEffect, useState } from "react";
import { format, isToday, isTomorrow, formatDistanceToNow } from "date-fns";
import { skipToken } from "@reduxjs/toolkit/query/react";

export function ClientUpcomingBookings() {
    const [clientId, setClientId] = useState<string | null>(null);

    const { data: bookings = [], isLoading, isError } = useGetUserBookingsQuery(
        clientId ? clientId : skipToken,
        { skip: !clientId }
    );

    // Auth check
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("/api/auth/verify-token", { credentials: "include" });
                if (res.ok) {
                    const data = await res.json();
                    if (data.user?.currentRole === "client") {
                        setClientId(data.user._id);
                    }
                }
            } catch (err) {
                console.error("Auth failed", err);
            }
        };
        checkAuth();
    }, []);

    // Filter & sort upcoming bookings
    const upcoming = bookings
        .filter((b: any) => new Date(b.date) >= new Date() && b.status !== "cancelled" && b.status !== "completed")
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5);

    const formatBookingDate = (dateStr: string) => {
        const date = new Date(dateStr);
        if (isToday(date)) return "Today";
        if (isTomorrow(date)) return "Tomorrow";
        return format(date, "EEE, MMM d");
    };

    const formatBookingTime = (dateStr: string) => format(new Date(dateStr), "h:mm a");

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

    if (!clientId) {
        return (
            <Card className="border-0 shadow-md bg-white">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-[#063A41]">Upcoming Bookings</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-12 text-gray-500">
                    Log in as a client to view your bookings
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
                    <div className="text-center py-12 text-red-600">Failed to load bookings</div>
                ) : upcoming.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="font-medium">No upcoming bookings</p>
                        <p className="text-sm">Your schedule is clear</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {upcoming.map((booking: any) => {
                            const status = getStatusBadge(booking.status);
                            const taskerName = booking.tasker?.fullName || `${booking.tasker?.firstName || ""} ${booking.tasker?.lastName || ""}`.trim() || "Unknown Tasker";

                            return (
                                <div
                                    key={booking._id}
                                    className="p-4 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4 flex-1">
                                            <Avatar className="h-11 w-11 ring-2 ring-white shadow-md">
                                                <AvatarImage src={booking.tasker?.profilePicture} />
                                                <AvatarFallback className="bg-[#063A41] text-white text-sm font-medium">
                                                    {taskerName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-[#063A41]">{taskerName}</p>
                                                <p className="text-sm text-gray-600 truncate">{booking.service?.title || "Service"}</p>

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
                                            Call Tasker
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
                            <a href="/client/bookings">
                                View All Bookings →
                            </a>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}