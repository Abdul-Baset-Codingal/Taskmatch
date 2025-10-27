/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect, ReactNode } from "react";
import { FaClock, FaTrash, FaWrench, FaTimes, FaDollarSign, FaUser, FaInfoCircle, FaCalendarAlt, FaStar } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useDeleteBookingMutation, useGetUserBookingsQuery } from "@/features/api/taskerApi";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface Booking {
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

const AllBookings: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<{ _id: string; role: string } | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
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
            console.error('Error checking login status:', error);
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

    // RTK Query hooks for delete
    const [deleteBooking, { isLoading: isDeleting }] = useDeleteBookingMutation();

    const handleDeleteBooking = async (id: string) => {
        if (!confirm("Are you sure you want to delete this booking?")) return;

        try {
            await deleteBooking(id).unwrap();
            alert("Booking deleted successfully!");
        } catch (err: any) {
            console.error("Error deleting booking:", err);
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
            console.error("Error submitting review:", error);
            alert("Server error");
        }
    };

    if (!isLoggedIn || !user) {
        return (
            <div className="container mx-auto py-8 px-4">
                <p className="text-red-500">Please log in to view your bookings.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 bg-clip-text bg-gradient-to-r from-[#8560F1] to-[#E7B6FE]">
                Manage Your Bookings
            </h2>

            {isLoading && <p className="text-gray-600 text-sm sm:text-base">Loading bookings...</p>}
            {error && (
                <p className="text-red-500 text-sm sm:text-base">Error: {"Failed to load bookings"}</p>
            )}
            {!isLoading && (!bookings || bookings.length === 0) && (
                <p className="text-gray-600 text-sm sm:text-base">No bookings found.</p>
            )}

            <div className="">
                {bookings && bookings.length > 0 && (
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={16}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 5000 }}
                        className="my-6 sm:my-8"
                        breakpoints={{
                            640: { slidesPerView: 1, spaceBetween: 16 },
                            768: { slidesPerView: 2, spaceBetween: 20 },
                            1024: { slidesPerView: 2, spaceBetween: 24 },
                        }}
                    >
                        {bookings.map((booking: Booking) => (
                            <SwiperSlide key={booking._id}>
                                <div className="relative bg-white rounded-2xl sm:rounded-3xl mt-16 sm:mt-20 shadow-md sm:shadow-lg max-w-full sm:max-w-md mx-auto overflow-hidden transition-all duration-500 hover:shadow-[0_12px_40px_rgba(79,70,229,0.2)] hover:-translate-y-1 border border-purple-100">
                                    <div className="absolute -top-10 sm:-top-12 z-50 left-1/2 transform -translate-x-1/2 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-xl ring-3 sm:ring-4 ring-white">
                                        <FaWrench className="text-2xl sm:text-3xl text-white animate-spin-slow" />
                                    </div>
                                    <div className="pt-12 sm:pt-16 pb-4 sm:pb-6 px-4 sm:px-6 space-y-4 sm:space-y-5 bg-gradient-to-b from-purple-50 to-white relative z-10">
                                        <div className="text-center">
                                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 tracking-tight line-clamp-1">{booking.service.title}</h3>
                                            <span className={`mt-2 sm:mt-3 inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium shadow-sm transition-all 
                                        ${booking.status === 'pending'
                                                    ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                                                    : 'bg-green-50 text-green-700 border border-green-200'}`}>
                                                <FaInfoCircle className="text-xs sm:text-sm" />
                                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                            </span>
                                        </div>
                                        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-inner border border-purple-100 transition-all duration-300 hover:bg-purple-50">
                                            <p className="text-xs sm:text-sm text-gray-600 italic text-center line-clamp-2 mb-2 sm:mb-3">{booking.service.description}</p>
                                            <div className="flex flex-col sm:flex-row justify-between text-xs sm:text-sm font-semibold text-gray-700 gap-2 sm:gap-0">
                                                <span className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 bg-orange-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                                                    <FaClock className="text-orange-500 text-xs sm:text-sm" />
                                                    {booking.service.estimatedDuration}
                                                </span>
                                                <span className="flex items-center justify-center sm:justify-end gap-1.5 sm:gap-2 bg-green-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                                                    <FaDollarSign className="text-green-500 text-xs sm:text-sm" />
                                                    ${booking.service.hourlyRate}/hr
                                                </span>
                                            </div>
                                        </div>
                                        <div className="bg-indigo-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3 transition-all duration-300 hover:bg-indigo-100 border border-indigo-100">
                                            <div className="bg-indigo-200 p-1 sm:p-1.5 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center overflow-hidden">
                                                {booking.tasker.profilePicture ? (
                                                    <Image
                                                        src={booking.tasker.profilePicture}
                                                        alt={`${booking.tasker.fullName}'s profile`}
                                                        width={32}
                                                        height={32}
                                                        className="rounded-full object-cover sm:w-10 sm:h-10"
                                                    />
                                                ) : (
                                                    <FaUser className="text-indigo-600 text-sm sm:text-lg" />
                                                )}
                                            </div>
                                            <div className="text-xs sm:text-sm text-gray-700 leading-tight">
                                                <p className="font-semibold text-indigo-700 line-clamp-1">{booking.tasker.fullName}</p>
                                                {booking.tasker.email && <p className="text-xs line-clamp-1">{booking.tasker.email}</p>}
                                                {booking.tasker.phone && <p className="text-xs line-clamp-1">{booking.tasker.phone}</p>}
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-center justify-between pt-3 sm:pt-4 border-t border-purple-200 gap-2 sm:gap-0">
                                            <span className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600">
                                                <FaCalendarAlt className="text-blue-500 text-xs sm:text-sm" />
                                                {new Date(booking.createdAt).toLocaleDateString()}
                                            </span>
                                            <div className="flex gap-2">
                                                {booking.status === "completed" && user._id === booking.client._id && !booking.review && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedBooking(booking);
                                                            setIsReviewModalOpen(true);
                                                        }}
                                                        className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-md transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:scale-105 text-xs sm:text-sm"
                                                    >
                                                        <FaStar /> Add Review
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteBooking(booking._id)}
                                                    className={`flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-md transition-all duration-300 hover:from-red-600 hover:to-red-700 hover:scale-105 text-xs sm:text-sm
                                                ${isDeleting || user._id !== booking.client._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    disabled={isDeleting || user._id !== booking.client._id}
                                                >
                                                    <FaTrash /> {isDeleting ? 'Deleting...' : 'Delete'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
                                    <style>
                                        {`
                                    @keyframes spin-slow {
                                        0% { transform: rotate(0deg); }
                                        100% { transform: rotate(360deg); }
                                    }
                                    .animate-spin-slow {
                                        animation: spin-slow 10s linear infinite;
                                    }
                                `}
                                    </style>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>

            {/* Review Modal */}
            {isReviewModalOpen && selectedBooking && (
                <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg p-4 sm:p-6 transform transition-all duration-300">
                        <div className="flex justify-between items-center mb-4 sm:mb-6">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800">Add Review for {selectedBooking.tasker.firstName} {selectedBooking.tasker.lastName}</h3>
                            <button
                                onClick={() => setIsReviewModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                            >
                                <FaTimes className="text-lg sm:text-xl" />
                            </button>
                        </div>
                        <div className="space-y-4 sm:space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                                <div className="flex gap-1 sm:gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar
                                            key={star}
                                            className={`text-2xl sm:text-3xl cursor-pointer transition-colors duration-200 ${star <= reviewFormData.rating ? 'text-yellow-400' : 'text-gray-300'
                                                }`}
                                            onClick={() => setReviewFormData((prev) => ({ ...prev, rating: star }))}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Review Message</label>
                                <textarea
                                    name="message"
                                    value={reviewFormData.message}
                                    onChange={handleReviewInputChange}
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm sm:text-base p-3 sm:p-4"
                                    rows={4}
                                    required
                                    placeholder="Share your experience..."
                                />
                            </div>
                            <div className="flex justify-end gap-2 sm:gap-3">
                                <button
                                    onClick={() => setIsReviewModalOpen(false)}
                                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 text-sm sm:text-base transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleReviewSubmit(selectedBooking._id)}
                                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 text-sm sm:text-base transition-all duration-200 disabled:opacity-50"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
};

export default AllBookings;