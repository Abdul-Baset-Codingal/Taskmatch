
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect, ReactNode, useMemo } from "react";
import {
    FaClock,
    FaTrash,
    FaTimes,
    FaDollarSign,
    FaUser,
    FaCalendarAlt,
    FaStar,
    FaChevronLeft,
    FaChevronRight,
    FaExclamationCircle,
    FaCheckCircle,
    FaHourglass,
    FaClipboardCheck,
    FaClipboardList,
    FaRegCalendarCheck,
    FaTimesCircle,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useDeleteBookingMutation, useGetUserBookingsQuery } from "@/features/api/taskerApi";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Link from "next/link";

interface Booking {
    date: any;
    review: any;
    _id: string;
    tasker: {
        lastName: ReactNode;
        firstName: ReactNode;
        profilePicture: string | StaticImport;
        phone: ReactNode;
        email: ReactNode;
        fullName: string;
        _id: string;
    };
    client: { fullName: string; _id: string };
    service: { title: string; description: string; hourlyRate: number; estimatedDuration: string };
    status: string;
    createdAt: string;
}

interface UpdateFormData {
    status: string;
    service: {
        title: string;
        description: string;
        hourlyRate: number;
        estimatedDuration: string;
    };
}

interface ReviewFormData {
    rating: number;
    message: string;
}

// Status mapping for filtering
const STATUS_MAP: { [key: string]: string } = {
    "All Bookings": "all",
    "Pending": "pending",
    "Confirmed": "confirmed",
    "Completed": "completed",
    "Cancelled": "cancelled",
};

const AllBookings: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<{ _id: string; role: string } | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string>("All Bookings");
    const [reviewFormData, setReviewFormData] = useState<ReviewFormData>({
        rating: 0,
        message: "",
    });
    const [formData, setFormData] = useState<UpdateFormData>({
        status: "pending",
        service: { title: "", description: "", hourlyRate: 0, estimatedDuration: "" },
    });

    // Check login status
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
            } else {
                setIsLoggedIn(false);
                setUser(null);
            }
        } catch (error) {
            setIsLoggedIn(false);
            setUser(null);
        }
    };

    useEffect(() => {
        checkLoginStatus();
    }, []);

    // Fetch bookings for the user
    const { data: bookings = [], isLoading, error } = useGetUserBookingsQuery(user?._id, {
        skip: !user?._id,
    });

    console.log(bookings)
    // Status cards configuration with dynamic counts
    const BOOKING_STATUS = useMemo(() => {
        const statusCounts = bookings.reduce(
            (acc: { [key: string]: number }, booking: Booking) => {
                const status = booking.status || "pending";
                acc[status] = (acc[status] || 0) + 1;
                return acc;
            },
            {}
        );

        return [
            {
                label: "All Bookings",
                count: bookings.length,
                icon: FaClipboardList,
                color: "bg-[#063A41]"
            },
            {
                label: "Pending",
                count: statusCounts["pending"] || 0,
                icon: FaHourglass,
                color: "bg-amber-500"
            },
            {
                label: "Confirmed",
                count: statusCounts["confirmed"] || 0,
                icon: FaRegCalendarCheck,
                color: "bg-blue-500"
            },
            {
                label: "Completed",
                count: statusCounts["completed"] || 0,
                icon: FaCheckCircle,
                color: "bg-[#109C3D]"
            },
            {
                label: "Cancelled",
                count: statusCounts["cancelled"] || 0,
                icon: FaTimesCircle,
                color: "bg-red-500"
            },
        ];
    }, [bookings]);

    // Filter bookings based on selected status
    const filteredBookings = useMemo(() => {
        if (selectedStatus === "All Bookings") {
            return bookings;
        }
        const statusValue = STATUS_MAP[selectedStatus];
        return bookings.filter((booking: Booking) => booking.status === statusValue);
    }, [bookings, selectedStatus]);

    // RTK Query hooks for delete
    const [deleteBooking, { isLoading: isDeleting }] = useDeleteBookingMutation();

    const handleDeleteClick = (id: string) => {
        setBookingToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteBooking = async () => {
        if (!bookingToDelete) return;

        try {
            await deleteBooking(bookingToDelete).unwrap();
            setIsDeleteModalOpen(false);
            setBookingToDelete(null);
        } catch (err: any) {
            alert(`Failed to delete booking: ${err?.data?.message || "Unknown error"}`);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        if (name.startsWith("service.")) {
            const field = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                service: { ...prev.service, [field]: value },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleReviewInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setReviewFormData((prev) => ({ ...prev, [name]: name === "rating" ? parseInt(value) : value }));
    };

    const handleReviewSubmit = async (bookingId: string) => {
        try {
            const response = await fetch("http://localhost:5000/api/taskerBookings/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ bookingId, ...reviewFormData }),
            });

            if (response.ok) {
                alert("Review submitted successfully!");
                setIsReviewModalOpen(false);
                setReviewFormData({ rating: 0, message: "" });
            } else {
                const errorData = await response.json();
                alert(`Failed to submit review: ${errorData.message || "Unknown error"}`);
            }
        } catch (error) {
            alert("Server error");
        }
    };

    const getStatusConfig = (status: string) => {
        const configs: { [key: string]: { bg: string; text: string; icon: React.ReactNode; label: string } } = {
            pending: {
                bg: "bg-amber-50",
                text: "text-amber-700",
                icon: <FaHourglass className="text-amber-500" />,
                label: "Pending"
            },
            confirmed: {
                bg: "bg-blue-50",
                text: "text-blue-700",
                icon: <FaRegCalendarCheck className="text-blue-500" />,
                label: "Confirmed"
            },
            completed: {
                bg: "bg-[#E5FFDB]",
                text: "text-[#109C3D]",
                icon: <FaCheckCircle className="text-[#109C3D]" />,
                label: "Completed"
            },
            cancelled: {
                bg: "bg-red-50",
                text: "text-red-700",
                icon: <FaTimesCircle className="text-red-500" />,
                label: "Cancelled"
            },
        };
        return configs[status] || configs.pending;
    };

    // Format booking date (e.g., "Dec 29, 2025")
    const formatBookingDate = (dateString: string | Date) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Format booking time (e.g., "1:00 AM")
    const formatBookingTime = (dateString: string | Date) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    // Get time until booking (e.g., "In 3 days", "Tomorrow", "In 2 hours")
    const getTimeUntilBooking = (dateString: string | Date) => {
        const bookingDate = new Date(dateString);
        const now = new Date();
        const diffMs = bookingDate.getTime() - now.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffMs / (1000 * 60));

        if (diffDays > 1) {
            return `📅 Scheduled in ${diffDays} days`;
        } else if (diffDays === 1) {
            return `📅 Tomorrow at ${formatBookingTime(dateString)}`;
        } else if (diffHours > 1) {
            return `⏰ Starting in ${diffHours} hours`;
        } else if (diffHours === 1) {
            return `⏰ Starting in 1 hour`;
        } else if (diffMinutes > 0) {
            return `⏰ Starting in ${diffMinutes} minutes`;
        } else {
            return `🔴 Starting now!`;
        }
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    };

    // Not logged in state
    if (!isLoggedIn || !user) {
        return (
            <div className="min-h-[400px] flex items-center justify-center px-4">
                <div className="text-center bg-white rounded-2xl border border-gray-100 p-8 max-w-md w-full">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaUser className="text-red-500 text-2xl" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#063A41] mb-2">Login Required</h3>
                    <p className="text-gray-500 text-sm">Please log in to view your bookings.</p>
                </div>
            </div>
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#E5FFDB] border-t-[#109C3D] rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-[#063A41] font-medium">Loading your bookings...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-[400px] flex items-center justify-center px-4">
                <div className="text-center bg-white rounded-2xl border border-red-100 p-8 max-w-md w-full">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaExclamationCircle className="text-red-500 text-2xl" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Bookings</h3>
                    <p className="text-gray-500 text-sm">Failed to load bookings. Please try again later.</p>
                </div>
            </div>
        );
    }

    // Empty state (no bookings at all)
    if (!bookings || bookings.length === 0) {
        return (
            <div className="min-h-[400px] flex items-center justify-center px-4">
                <div className="text-center bg-white rounded-2xl border border-gray-100 p-8 max-w-md w-full">
                    <div className="w-20 h-20 bg-[#E5FFDB] rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaClipboardCheck className="text-[#109C3D] text-3xl" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#063A41] mb-2">No Bookings Yet</h3>
                    <p className="text-gray-500 text-sm mb-6">You haven't made any bookings yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#063A41] flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#E5FFDB] rounded-xl flex items-center justify-center">
                                <FaClipboardCheck className="text-[#109C3D]" />
                            </div>
                            My Bookings
                        </h2>
                        <p className="text-gray-500 mt-1 text-sm sm:text-base">
                            Manage and track all your service bookings
                        </p>
                    </div>
                </div>
            </div>

            {/* Status Filter Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                    {BOOKING_STATUS.map(({ label, count, icon: Icon, color }) => (
                        <button
                            key={label}
                            onClick={() => setSelectedStatus(label)}
                            className={`relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm border-2 transition-all duration-200 hover:shadow-md ${selectedStatus === label
                                ? "border-[#109C3D] shadow-md"
                                : "border-transparent hover:border-gray-200"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                    <Icon className="text-white text-lg sm:text-xl" />
                                </div>
                                <div className="text-left min-w-0">
                                    <p className="text-xs text-gray-500 truncate">{label}</p>
                                    <p className="text-xl sm:text-2xl font-bold text-[#063A41]">{count}</p>
                                </div>
                            </div>
                            {selectedStatus === label && (
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#109C3D] rounded-t-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Empty State for Filtered Results */}
            {filteredBookings.length === 0 && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                        <div className="w-20 h-20 bg-[#E5FFDB] rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaClipboardCheck className="text-[#109C3D] text-3xl" />
                        </div>
                        <h3 className="text-xl font-bold text-[#063A41] mb-2">
                            No {selectedStatus === "All Bookings" ? "" : selectedStatus} Bookings
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {selectedStatus === "All Bookings"
                                ? "You don't have any bookings yet."
                                : `You don't have any ${selectedStatus.toLowerCase()} bookings at the moment.`}
                        </p>
                        {selectedStatus !== "All Bookings" && (
                            <button
                                onClick={() => setSelectedStatus("All Bookings")}
                                className="px-6 py-2.5 bg-[#109C3D] text-white font-medium rounded-xl hover:bg-[#0d8534] transition-colors"
                            >
                                View All Bookings
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Swiper Container */}
            {filteredBookings.length > 0 && (
                <div className="max-w-7xl mx-auto relative">
                    {/* Results count */}
                    <div className="mb-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Showing <span className="font-semibold text-[#063A41]">{filteredBookings.length}</span> {selectedStatus === "All Bookings" ? "booking" : selectedStatus.toLowerCase() + " booking"}{filteredBookings.length !== 1 ? "s" : ""}
                        </p>
                    </div>

                    {/* Custom Navigation */}
                    <button className="swiper-button-prev-bookings absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 lg:-translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-100 items-center justify-center text-[#063A41] hover:bg-[#E5FFDB] hover:text-[#109C3D] transition-all hidden md:flex">
                        <FaChevronLeft className="text-sm" />
                    </button>
                    <button className="swiper-button-next-bookings absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 lg:translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-100 items-center justify-center text-[#063A41] hover:bg-[#E5FFDB] hover:text-[#109C3D] transition-all hidden md:flex">
                        <FaChevronRight className="text-sm" />
                    </button>

                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1}
                        pagination={{
                            clickable: true,
                            bulletClass: 'swiper-pagination-bullet !bg-gray-300 !opacity-100',
                            bulletActiveClass: '!bg-[#109C3D]',
                        }}
                        navigation={{
                            prevEl: '.swiper-button-prev-bookings',
                            nextEl: '.swiper-button-next-bookings',
                        }}
                        autoplay={{ delay: 5000, disableOnInteraction: true }}
                        className="pb-12"
                        breakpoints={{
                            640: { slidesPerView: 1, spaceBetween: 16 },
                            768: { slidesPerView: 2, spaceBetween: 20 },
                            1024: { slidesPerView: 2, spaceBetween: 24 },
                        }}
                    >
                        {filteredBookings.map((booking: Booking) => {
                            const statusConfig = getStatusConfig(booking.status);
                            const canDelete = user._id === booking.client._id;
                            const canReview = booking.status === "completed" && user._id === booking.client._id && !booking.review;

                            // ✅ Check if booking date is in the past
                            const isDatePassed = booking.date ? new Date(booking.date) < new Date() : false;

                            return (
                                <SwiperSlide key={booking._id}>
                                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full flex flex-col">
                                        {/* Card Header */}
                                        <div className="bg-[#063A41] p-4 sm:p-5">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg sm:text-xl font-bold text-white truncate mb-2">
                                                        {booking.service.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm">
                                                        <FaCalendarAlt className="flex-shrink-0" />
                                                        <span>Booked: {formatDateTime(booking.createdAt)}</span>
                                                    </div>
                                                </div>
                                                {/* Status Badge */}
                                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                                                    {statusConfig.icon}
                                                    <span className="hidden sm:inline">{statusConfig.label}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ✅ NEW: Scheduled Date/Time Banner */}
                                        {booking.date && (
                                            <div className={`px-4 sm:px-5 py-3 flex items-center justify-between ${isDatePassed
                                                    ? 'bg-gray-100 border-b border-gray-200'
                                                    : 'bg-gradient-to-r from-blue-500 to-blue-600'
                                                }`}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDatePassed ? 'bg-gray-200' : 'bg-white/20'
                                                        }`}>
                                                        <FaClock className={`text-lg ${isDatePassed ? 'text-gray-500' : 'text-white'}`} />
                                                    </div>
                                                    <div>
                                                        <p className={`text-xs uppercase tracking-wide ${isDatePassed ? 'text-gray-500' : 'text-white/80'
                                                            }`}>
                                                            Scheduled For
                                                        </p>
                                                        <p className={`font-bold ${isDatePassed ? 'text-gray-600' : 'text-white'
                                                            }`}>
                                                            {formatBookingDate(booking.date)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className={`text-right ${isDatePassed ? 'text-gray-500' : 'text-white/90'}`}>
                                                    <p className="text-xs uppercase">Time</p>
                                                    <p className="font-semibold">{formatBookingTime(booking.date)}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Card Body */}
                                        <div className="p-4 sm:p-5 space-y-4 flex-1">
                                            {/* Service Description */}
                                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                                                {booking.service.description}
                                            </p>

                                            {/* Service Details */}
                                            <div className="grid grid-cols-2 gap-3">
                                                {/* Duration */}
                                                <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl">
                                                    <div className="w-8 h-8 bg-[#E5FFDB] rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <FaClock className="text-[#109C3D] text-sm" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[10px] text-gray-400 uppercase">Duration</p>
                                                        <p className="text-xs font-semibold text-[#063A41] truncate">
                                                            {booking.service.estimatedDuration}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Rate */}
                                                <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl">
                                                    <div className="w-8 h-8 bg-[#E5FFDB] rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <FaDollarSign className="text-[#109C3D] text-sm" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[10px] text-gray-400 uppercase">Rate</p>
                                                        <p className="text-xs font-semibold text-[#109C3D]">
                                                            ${booking.service.hourlyRate}/hr
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ✅ NEW: Countdown or Date Status */}
                                            {booking.date && !isDatePassed && booking.status !== 'completed' && booking.status !== 'cancelled' && (
                                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                                                    <div className="flex items-center gap-2">
                                                        <FaCalendarAlt className="text-amber-500 flex-shrink-0" />
                                                        <span className="text-sm text-amber-700">
                                                            {getTimeUntilBooking(booking.date)}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Tasker Info */}
                                            <div className="border-t border-gray-100 pt-4">
                                                <p className="text-[10px] text-gray-400 uppercase mb-2">Service Provider</p>
                                                <Link
                                                    href={`/taskers/${booking.tasker._id}`}
                                                    className="flex items-center gap-3 p-3 bg-[#E5FFDB]/50 rounded-xl border border-[#109C3D]/10 group hover:border-[#109C3D]/30 transition-colors"
                                                >
                                                    <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#109C3D]/20 group-hover:border-[#109C3D] transition-colors">
                                                        {booking.tasker.profilePicture ? (
                                                            <Image
                                                                src={booking.tasker.profilePicture}
                                                                alt={`${booking.tasker.fullName}'s profile`}
                                                                width={44}
                                                                height={44}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-[#109C3D]/20 flex items-center justify-center group-hover:bg-[#109C3D]/30 transition-colors">
                                                                <FaUser className="text-[#109C3D]" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-semibold text-[#063A41] truncate group-hover:text-[#109C3D] transition-colors">
                                                            {booking.tasker.firstName} {booking.tasker.lastName}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>

                                        {/* Card Footer */}
                                        <div className="px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 border-t border-gray-100 mt-auto">
                                            <div className="flex flex-wrap gap-2">
                                                {/* Review Button */}
                                                {canReview && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedBooking(booking);
                                                            setIsReviewModalOpen(true);
                                                        }}
                                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#063A41] text-white font-medium rounded-xl hover:bg-[#052e33] transition-colors text-sm"
                                                    >
                                                        <FaStar className="text-yellow-400" />
                                                        Add Review
                                                    </button>
                                                )}

                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => handleDeleteClick(booking._id)}
                                                    disabled={isDeleting || !canDelete}
                                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-red-200 text-red-600 font-medium rounded-xl hover:bg-red-50 hover:border-red-300 transition-all text-sm
                                            ${(isDeleting || !canDelete) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    <FaTrash className="text-xs" />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
            )}

            {/* Review Modal */}
            {isReviewModalOpen && selectedBooking && (
                <div
                    className="fixed inset-0 bg-[#063A41]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={() => setIsReviewModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-modalSlide"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="bg-[#063A41] px-6 py-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-white">
                                    Review for {selectedBooking.tasker.firstName} {selectedBooking.tasker.lastName}
                                </h3>
                                <button
                                    onClick={() => setIsReviewModalOpen(false)}
                                    className="text-white/70 hover:text-white transition-colors p-1"
                                >
                                    <FaTimes className="text-lg" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-5">
                            {/* Rating */}
                            <div>
                                <label className="block text-sm font-medium text-[#063A41] mb-3">
                                    How would you rate this service?
                                </label>
                                <div className="flex gap-2 justify-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setReviewFormData((prev) => ({ ...prev, rating: star }))}
                                            className="focus:outline-none transform transition-transform hover:scale-110"
                                        >
                                            <FaStar
                                                className={`text-3xl transition-colors duration-200 ${star <= reviewFormData.rating ? 'text-yellow-400' : 'text-gray-200'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                {reviewFormData.rating > 0 && (
                                    <p className="text-center text-sm text-gray-500 mt-2">
                                        {reviewFormData.rating === 5 ? "Excellent!" :
                                            reviewFormData.rating === 4 ? "Very Good" :
                                                reviewFormData.rating === 3 ? "Good" :
                                                    reviewFormData.rating === 2 ? "Fair" : "Poor"}
                                    </p>
                                )}
                            </div>

                            {/* Review Message */}
                            <div>
                                <label className="block text-sm font-medium text-[#063A41] mb-2">
                                    Your Review
                                </label>
                                <textarea
                                    name="message"
                                    value={reviewFormData.message}
                                    onChange={handleReviewInputChange}
                                    className="w-full rounded-xl border-2 border-gray-200 focus:border-[#109C3D] focus:ring-0 transition-colors p-4 text-sm resize-none"
                                    rows={4}
                                    placeholder="Share your experience with this service..."
                                    required
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setIsReviewModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 border-2 border-gray-200 text-[#063A41] rounded-xl font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleReviewSubmit(selectedBooking._id)}
                                    disabled={reviewFormData.rating === 0}
                                    className="flex-1 px-4 py-2.5 bg-[#109C3D] text-white rounded-xl font-medium hover:bg-[#0d8a35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Submit Review
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div
                    className="fixed inset-0 bg-[#063A41]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setIsDeleteModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-modalSlide"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Content */}
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaTrash className="text-red-500 text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold text-[#063A41] mb-2">
                                Delete Booking?
                            </h3>
                            <p className="text-gray-500 text-sm">
                                This action cannot be undone. The booking will be permanently removed from your records.
                            </p>
                        </div>

                        {/* Modal Actions */}
                        <div className="flex gap-3 p-4 bg-gray-50 border-t border-gray-100">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="flex-1 px-4 py-2.5 border-2 border-gray-200 text-[#063A41] font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteBooking}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <FaTrash className="text-sm" />
                                        Delete
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes modalSlide {
                    from {
                        opacity: 0;
                        transform: translateY(-20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                .animate-modalSlide {
                    animation: modalSlide 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default AllBookings;