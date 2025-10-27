/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from 'react';
import { FaAngleRight, FaCalendar, FaClock, FaDollarSign, FaUser } from 'react-icons/fa';

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
    // Add other fields as needed
};

const PendingBookings = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null); // Store tasker ID
    const [bookings, setBookings] = useState<Booking[]>([]);
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
                setUserId(data.user._id); // Store user ID
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
        if (!userId || userRole !== 'tasker') return;

        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/api/taskerBookings/tasker/${userId}`, {
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

    // Update booking status
    const updateStatus = async (bookingId: string, newStatus: string) => {
        try {
            const response = await fetch(`http://localhost:5000/api/taskerBookings/${bookingId}`, {
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

    const getStatusBadge = (status: 'pending' | 'confirmed' | 'cancelled' | 'completed') => {
        const statusStyles = {
            pending: 'bg-gradient-to-r from-yellow-50 to-orange-50 text-yellow-700 border border-yellow-200',
            confirmed: 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200',
            cancelled: 'bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border border-red-200',
            completed: 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200'
        };

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status]} shadow-sm`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${status === 'pending' ? 'bg-yellow-400' :
                        status === 'confirmed' ? 'bg-green-400' :
                            status === 'cancelled' ? 'bg-red-400' :
                                'bg-blue-400'
                    }`}></div>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    if (!isLoggedIn || userRole !== 'tasker') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaAngleRight className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Restricted</h2>
                    <p className="text-gray-600">Please log in as a tasker to view bookings.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                    <FaAngleRight className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Bookings</h2>
                    <p className="text-gray-600">Please wait while we fetch your bookings...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaAngleRight className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="max-w-6xl mx-auto p-6">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                        Tasker Bookings
                    </h1>
                    <p className="text-gray-600 text-lg">Manage your service bookings efficiently</p>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-4 rounded-full"></div>
                </div>

                {bookings.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaCalendar className="w-12 h-12 text-gray-400" />
                        </div>
                        <p className="text-xl text-gray-500">No bookings found</p>
                        <p className="text-gray-400 mt-2">Your upcoming bookings will appear here</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {bookings.map((booking, index) => (
                            <div
                                key={booking._id}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                    animation: 'fadeInUp 0.6s ease-out forwards'
                                }}
                            >
                                <div className="p-8">
                                    {/* Header Section */}
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                                                {booking.service.title}
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed">
                                                {booking.service.description}
                                            </p>
                                        </div>
                                        <div className="ml-6">
                                            {getStatusBadge(booking.status as 'pending' | 'confirmed' | 'cancelled' | 'completed')}
                                        </div>
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                    <FaDollarSign className="w-5 h-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Hourly Rate</p>
                                                    <p className="font-semibold text-gray-800">${booking.service.hourlyRate}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <FaClock className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Duration</p>
                                                    <p className="font-semibold text-gray-800">{booking.service.estimatedDuration}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                                    <FaCalendar className="w-5 h-5 text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Scheduled Date</p>
                                                    <p className="font-semibold text-gray-800">
                                                        {new Date(booking.date).toLocaleDateString('en-US', {
                                                            weekday: 'short',
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                                    <FaUser className="w-5 h-5 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Client</p>
                                                    <p className="font-semibold text-gray-800">
                                                        {booking.client.firstName} {booking.client.lastName}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Section */}
                                    <div className="flex lg:flex-row flex-col lg:gap-0 gap-4 justify-between items-center pt-6 border-t border-gray-100">
                                        <div className="text-sm text-gray-500">
                                            Booking ID: #{booking._id}
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <label className="text-sm font-medium text-gray-700">Update Status:</label>
                                            <select
                                                value={booking.status}
                                                onChange={(e) => updateStatus(booking._id, e.target.value)}
                                                className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 min-w-[140px] font-medium"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="cancelled">Cancelled</option>
                                                <option value="completed">Completed</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default PendingBookings;