/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from 'react';
import { FaCalendar, FaClock, FaDollarSign, FaUser, FaCheck } from 'react-icons/fa';
import { HiOutlineCalendar } from 'react-icons/hi';

type Booking = {
    _id: string;
    status: string;
    date: string;
    client: {
        firstName: string;
        lastName: string;
    };
    service: {
        title: string;
        description: string;
        hourlyRate: number;
        estimatedDuration: string;
    };
};

const PendingBookings = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>("all");

    const checkLoginStatus = async () => {
        try {
            const response = await fetch("https://taskmatch-backend.vercel.app/api/auth/verify-token", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setIsLoggedIn(true);
                setUserRole(data.user.currentRole);
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

    const fetchBookings = async () => {
        if (!userId || userRole !== 'tasker') return;

        try {
            setLoading(true);
            const response = await fetch(`https://taskmatch-backend.vercel.app/api/taskerBookings/tasker/${userId}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setBookings(data);
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Failed to fetch bookings");
            }
        } catch (error) {
            if (error instanceof Error) {
                setError("Error fetching bookings: " + error.message);
            } else {
                setError("Error fetching bookings: An unknown error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (bookingId: string, newStatus: string) => {
        try {
            const response = await fetch(`https://taskmatch-backend.vercel.app/api/taskerBookings/${bookingId}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                const updatedBooking = await response.json();
                setBookings((prevBookings) =>
                    prevBookings.map((booking) =>
                        booking._id === bookingId ? updatedBooking.booking : booking
                    )
                );
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Failed to update status");
            }
        } catch (error) {
            if (error instanceof Error) {
                setError("Error updating status: " + error.message);
            } else {
                setError("Error updating status: An unknown error occurred");
            }
        }
    };

    useEffect(() => {
        checkLoginStatus();
    }, []);

    useEffect(() => {
        if (isLoggedIn && userRole === 'tasker' && userId) {
            fetchBookings();
        }
    }, [isLoggedIn, userRole, userId]);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "pending": return "bg-amber-100 text-amber-800";
            case "confirmed": return "bg-[#E5FFDB] text-[#109C3D]";
            case "cancelled": return "bg-red-100 text-red-800";
            case "completed": return "bg-[#063A41] text-white";
            default: return "bg-gray-100 text-gray-600";
        }
    };

 

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const stats = {
        all: bookings.length,
        pending: bookings.filter((b) => b.status === "pending").length,
        confirmed: bookings.filter((b) => b.status === "confirmed").length,
        completed: bookings.filter((b) => b.status === "completed").length,
        cancelled: bookings.filter((b) => b.status === "cancelled").length,
    };

    const filteredBookings = activeTab === "all" ? bookings : bookings.filter((b) => b.status === activeTab);

    // Loading
    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-3 border-[#E5FFDB] border-t-[#109C3D] rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading bookings...</p>
                </div>
            </div>
        );
    }

    // Auth Error
    if (!isLoggedIn || userRole !== 'tasker') {
        return (
            <div className="min-h-screen bg-[#E5FFDB]/20 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-sm w-full border border-[#109C3D]/20">
                    <div className="w-16 h-16 bg-[#E5FFDB] rounded-full flex items-center justify-center mx-auto mb-4">
                        <HiOutlineCalendar className="w-8 h-8 text-[#063A41]" />
                    </div>
                    <h2 className="text-xl font-semibold text-[#063A41] mb-2">Access Restricted</h2>
                    <p className="text-gray-500">Please log in as a tasker to view bookings.</p>
                </div>
            </div>
        );
    }

    // Error
    if (error) {
        return (
            <div className="min-h-screen bg-[#E5FFDB]/20 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-sm w-full border">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-[#063A41] text-white rounded-lg hover:bg-[#063A41]/90"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#E5FFDB]/10">
            {/* Header */}
            <div className="bg-[#063A41]">
                <div className="max-w-5xl mx-auto px-4 py-8">
                    <h1 className="text-2xl font-bold text-white">My Bookings</h1>
                    <p className="text-[#E5FFDB] text-sm mt-1">Manage your service bookings</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="flex gap-6 overflow-x-auto">
                        {[
                            { key: "all", label: "All" },
                            { key: "pending", label: "Pending" },
                            { key: "confirmed", label: "Confirmed" },
                            { key: "completed", label: "Completed" },
                            { key: "cancelled", label: "Cancelled" },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.key
                                        ? "border-[#109C3D] text-[#063A41]"
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                {tab.label}
                                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${activeTab === tab.key
                                        ? "bg-[#E5FFDB] text-[#109C3D]"
                                        : "bg-gray-100 text-gray-600"
                                    }`}>
                                    {stats[tab.key as keyof typeof stats]}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 py-6">
                {filteredBookings.length === 0 ? (
                    <div className="bg-white rounded-lg border p-12 text-center">
                        <div className="w-16 h-16 bg-[#E5FFDB] rounded-full flex items-center justify-center mx-auto mb-4">
                            <HiOutlineCalendar className="w-8 h-8 text-[#109C3D]" />
                        </div>
                        <h3 className="text-lg font-medium text-[#063A41] mb-1">No bookings found</h3>
                        <p className="text-gray-500 text-sm">
                            {activeTab === "all" ? "Your bookings will appear here" : `No ${activeTab} bookings`}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredBookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="bg-white rounded-lg border hover:border-[#109C3D]/30 hover:shadow-md transition-all"
                            >
                                {/* Card Header */}
                                <div className="p-5 border-b">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusStyle(booking.status)}`}>
                                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-[#063A41] mb-1">
                                                {booking.service.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm line-clamp-2">
                                                {booking.service.description}
                                            </p>
                                        </div>

                                        {/* Date Display */}
                                        <div className="text-right flex-shrink-0 bg-[#E5FFDB]/50 rounded-lg p-3 min-w-[100px]">
                                            <p className="text-xs text-[#109C3D] font-medium">Scheduled</p>
                                            <p className="text-lg font-bold text-[#063A41]">
                                                {new Date(booking.date).getDate()}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                {new Date(booking.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Details */}
                                <div className="p-5 bg-gray-50/50">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-[#E5FFDB] rounded-lg flex items-center justify-center">
                                                <FaUser className="w-3.5 h-3.5 text-[#109C3D]" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Booker</p>
                                                <p className="text-sm font-medium text-[#063A41]">
                                                    {booking.client.firstName} {booking.client.lastName}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-[#E5FFDB] rounded-lg flex items-center justify-center">
                                                <FaDollarSign className="w-3.5 h-3.5 text-[#109C3D]" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Rate</p>
                                                <p className="text-sm font-medium text-[#063A41]">
                                                    ${booking.service.hourlyRate}/hr
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-[#E5FFDB] rounded-lg flex items-center justify-center">
                                                <FaClock className="w-3.5 h-3.5 text-[#109C3D]" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Duration</p>
                                                <p className="text-sm font-medium text-[#063A41]">
                                                    {booking.service.estimatedDuration}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-[#E5FFDB] rounded-lg flex items-center justify-center">
                                                <FaCalendar className="w-3.5 h-3.5 text-[#109C3D]" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Time</p>
                                                <p className="text-sm font-medium text-[#063A41]">
                                                    {formatTime(booking.date)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-gray-200">
                                        <p className="text-xs text-gray-400 font-mono">
                                            ID: {booking._id.slice(-10).toUpperCase()}
                                        </p>

                                        {booking.status !== 'completed' && booking.status !== 'cancelled' ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-500">Status:</span>
                                                <select
                                                    value={booking.status}
                                                    onChange={(e) => updateStatus(booking._id, e.target.value)}
                                                    className="px-3 py-1.5 border border-[#109C3D]/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#109C3D] bg-white text-[#063A41] font-medium"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                    <option value="completed">Completed</option>
                                                </select>
                                            </div>
                                        ) : (
                                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${booking.status === 'completed'
                                                    ? 'bg-[#E5FFDB] text-[#109C3D]'
                                                    : 'bg-red-100 text-red-700'
                                                }`}>
                                                <FaCheck className="w-3 h-3" />
                                                <span className="text-sm font-medium">
                                                    {booking.status === 'completed' ? 'Completed' : 'Cancelled'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PendingBookings;