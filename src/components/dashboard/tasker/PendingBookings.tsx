"use client";
import React, { useEffect, useState } from 'react';
import { FaUser, FaDollarSign, FaClock, FaCalendar, FaCheckCircle, FaTimesCircle, FaCheck } from 'react-icons/fa';
import { HiOutlineCalendar } from 'react-icons/hi';

type Booking = {
    _id: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
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
            const response = await fetch("/api/auth/verify-token", {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                setIsLoggedIn(true);
                setUserRole(data.user.currentRole);
                setUserId(data.user._id);
            } else {
                setIsLoggedIn(false);
            }
        } catch (error) {
            setIsLoggedIn(false);
        }
    };

    const fetchBookings = async () => {
        if (!userId || userRole !== 'tasker') return;

        try {
            setLoading(true);
            const response = await fetch(`/api/taskerBookings/tasker/${userId}`, {
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                setBookings(data);
            } else {
                setError("Failed to load bookings");
            }
        } catch (err) {
            setError("Network error");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (bookingId: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/taskerBookings/${bookingId}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                const updated = await response.json();
                setBookings(prev => prev.map(b => b._id === bookingId ? updated.booking : b));
            }
        } catch (err) {
            console.error("Failed to update status");
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

    const stats = {
        all: bookings.length,
        pending: bookings.filter(b => b.status === "pending").length,
        confirmed: bookings.filter(b => b.status === "confirmed").length,
        completed: bookings.filter(b => b.status === "completed").length,
        cancelled: bookings.filter(b => b.status === "cancelled").length,
    };

    const filteredBookings = activeTab === "all" ? bookings : bookings.filter(b => b.status === activeTab);

    const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const formatTime = (date: string) => new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#E5FFDB] border-t-[#109C3D] rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading bookings...</p>
                </div>
            </div>
        );
    }

    if (!isLoggedIn || userRole !== 'tasker') {
        return (
            <div className="min-h-screen bg-[#E5FFDB]/20 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-sm w-full border border-[#109C3D]/20">
                    <div className="w-16 h-16 bg-[#E5FFDB] rounded-full flex items-center justify-center mx-auto mb-4">
                        <HiOutlineCalendar className="w-8 h-8 text-[#063A41]" />
                    </div>
                    <h2 className="text-xl font-semibold text-[#063A41] mb-2">Access Restricted</h2>
                    <p className="text-gray-500">Please log in as a tasker</p>
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
                    <p className="text-[#E5FFDB] text-sm mt-1">Manage your scheduled services</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="flex gap-6 overflow-x-auto py-2">
                        {[
                            { key: "all", label: "All" },
                            { key: "pending", label: "Pending" },
                            { key: "confirmed", label: "Confirmed" },
                            { key: "completed", label: "Completed" },
                            { key: "cancelled", label: "Cancelled" },
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`py-4 text-sm font-medium border-b-2 whitespace-nowrap ${activeTab === tab.key
                                    ? "border-[#109C3D] text-[#063A41]"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                {tab.label}
                                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${activeTab === tab.key ? "bg-[#E5FFDB] text-[#109C3D]" : "bg-gray-100 text-gray-600"}`}>
                                    {stats[tab.key as keyof typeof stats]}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bookings List */}
            <div className="max-w-5xl mx-auto px-4 py-6">
                {filteredBookings.length === 0 ? (
                    <div className="bg-white rounded-lg border p-12 text-center">
                        <div className="w-16 h-16 bg-[#E5FFDB] rounded-full flex items-center justify-center mx-auto mb-4">
                            <HiOutlineCalendar className="w-8 h-8 text-[#109C3D]" />
                        </div>
                        <h3 className="text-lg font-medium text-[#063A41] mb-1">No bookings found</h3>
                        <p className="text-gray-500 text-sm">
                            {activeTab === "all" ? "You have no bookings yet" : `No ${activeTab} bookings`}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredBookings.map((booking) => (
                            <div key={booking._id} className="bg-white rounded-lg border hover:border-[#109C3D]/30 hover:shadow-md transition-all">
                                {/* Header */}
                                <div className="p-5 border-b">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`text-xs font-medium px-3 py-1 rounded-full ${booking.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                                        booking.status === 'confirmed' ? 'bg-[#E5FFDB] text-[#109C3D]' :
                                                            booking.status === 'completed' ? 'bg-[#063A41] text-white' :
                                                                'bg-red-100 text-red-800'
                                                    }`}>
                                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                </span>
                                                <span className="text-xs text-gray-400">{formatDate(booking.date)}</span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-[#063A41]">{booking.service.title}</h3>
                                            <p className="text-sm text-gray-600 line-clamp-2 mt-1">{booking.service.description}</p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-xs text-gray-500">Scheduled</p>
                                            <p className="text-2xl font-bold text-[#109C3D]">{new Date(booking.date).getDate()}</p>
                                            <p className="text-xs text-gray-600">{new Date(booking.date).toLocaleDateString('en-US', { month: 'short' })}</p>
                                            <p className="text-sm font-medium text-[#063A41] mt-1">{formatTime(booking.date)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="p-5 bg-[#E5FFDB]/20">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <FaUser className="w-4 h-4 text-[#109C3D]" />
                                            <div>
                                                <p className="text-xs text-gray-500">Client</p>
                                                <p className="font-medium">{booking.client.firstName} {booking.client.lastName}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaDollarSign className="w-4 h-4 text-[#109C3D]" />
                                            <div>
                                                <p className="text-xs text-gray-500">Rate</p>
                                                <p className="font-medium">${booking.service.hourlyRate}/hr</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaClock className="w-4 h-4 text-[#109C3D]" />
                                            <div>
                                                <p className="text-xs text-gray-500">Duration</p>
                                                <p className="font-medium">{booking.service.estimatedDuration}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaCalendar className="w-4 h-4 text-[#109C3D]" />
                                            <div>
                                                <p className="text-xs text-gray-500">Time</p>
                                                <p className="font-medium">{formatTime(booking.date)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons - Logical Flow Only */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                        <p className="text-xs text-gray-400 font-mono">ID: {booking._id.slice(-8).toUpperCase()}</p>

                                        {booking.status === 'pending' && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => updateStatus(booking._id, 'confirmed')}
                                                    className="px-4 py-2 bg-[#109C3D] text-white text-sm font-medium rounded-lg hover:bg-[#0d8534] flex items-center gap-2"
                                                >
                                                    <FaCheckCircle className="w-4 h-4" />
                                                    Confirm
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(booking._id, 'cancelled')}
                                                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 flex items-center gap-2"
                                                >
                                                    <FaTimesCircle className="w-4 h-4" />
                                                    Cancel
                                                </button>
                                            </div>
                                        )}

                                        {booking.status === 'confirmed' && (
                                            <button
                                                onClick={() => updateStatus(booking._id, 'completed')}
                                                className="px-6 py-2 bg-[#063A41] text-white font-medium rounded-lg hover:bg-[#063A41]/90 flex items-center gap-2"
                                            >
                                                <FaCheck className="w-4 h-4" />
                                                Mark as Completed
                                            </button>
                                        )}

                                        {(booking.status === 'completed' || booking.status === 'cancelled') && (
                                            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm ${booking.status === 'completed' ? 'bg-[#E5FFDB] text-[#109C3D]' : 'bg-red-100 text-red-700'
                                                }`}>
                                                <FaCheck className="w-4 h-4" />
                                                {booking.status === 'completed' ? 'Completed' : 'Cancelled'}
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