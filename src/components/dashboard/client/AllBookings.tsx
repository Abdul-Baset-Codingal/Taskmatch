/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect, ReactNode } from "react";
import { FaClock, FaTrash, FaWrench, FaTimes, FaDollarSign, FaUser, FaInfoCircle, FaCalendarAlt } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useDeleteBookingMutation, useGetUserBookingsQuery } from "@/features/api/taskerApi";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface Booking {
    _id: string;
    tasker: {
        profilePicture: string | StaticImport;
        phone: ReactNode;
        email: ReactNode; fullName: string; _id: string
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

const AllBookings: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<{ _id: string; role: string } | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
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
                console.log('Verify Token Response:', data);
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


    // RTK Query hooks for update and delete
    const [deleteBooking, { isLoading: isDeleting, }] = useDeleteBookingMutation();





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

    if (!isLoggedIn || !user) {
        return (
            <div className="container mx-auto py-8 px-4">
                <p className="text-red-500">Please log in to view your bookings.</p>
            </div>
        );
    }

    console.log(bookings)
    return (
        <div className="container mx-auto py-8 px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-clip-text bg-gradient-to-r from-[#8560F1] to-[#E7B6FE]">
                Manage Your Bookings
            </h2>

            {isLoading && <p className="text-gray-600">Loading bookings...</p>}
            {error && (
                <p className="text-red-500">Error: {"Failed to load bookings"}</p>
            )}
            {!isLoading && (!bookings || bookings.length === 0) && (
                <p className="text-gray-600">No bookings found.</p>
            )}

            <div className="">
                {bookings && bookings.length > 0 && (
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 5000 }}
                        className="my-8"
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                    >
                        {bookings.map((booking: Booking) => (
                            <SwiperSlide key={booking._id}>
                                <div className="relative bg-white rounded-3xl mt-20 shadow-xl max-w-md mx-auto overflow-hidden transition-all duration-500 hover:shadow-[0_15px_50px_rgba(79,70,229,0.3)] hover:-translate-y-2 border border-purple-100">
                                    {/* Circular Focal Point */}
                                    <div className="absolute top-[-40px] z-50 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                                        <FaWrench className="text-3xl text-white animate-spin-slow" />
                                    </div>

                                    {/* Main Content */}
                                    <div className="pt-16 pb-6 px-6 space-y-5 bg-gradient-to-b from-purple-50 to-white">
                                        {/* Service Title & Status */}
                                        <div className="text-center">
                                            <h3 className="text-2xl font-extrabold text-gray-800 tracking-tight truncate">{booking.service.title}</h3>
                                            <div className="mt-2 inline-flex items-center gap-2 bg-yellow-100 px-4 py-1.5 rounded-full shadow-sm">
                                                <FaInfoCircle className={`text-lg ${booking.status === 'pending' ? 'text-yellow-600' : 'text-green-600'}`} />
                                                <span className={`text-sm font-bold ${booking.status === 'pending' ? 'text-yellow-600' : 'text-green-600'}`}>
                                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Service Details */}
                                        <div className="bg-white rounded-2xl p-4 shadow-inner border border-purple-100 transition-all duration-300 hover:bg-purple-50">
                                            <p className="text-sm text-gray-600 italic text-center line-clamp-2 mb-3">{booking.service.description}</p>
                                            <div className="flex justify-between text-sm font-semibold text-gray-700">
                                                <span className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-lg">
                                                    <FaClock className="text-orange-500" />
                                                    {booking.service.estimatedDuration}
                                                </span>
                                                <span className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-lg">
                                                    <FaDollarSign className="text-green-500" />
                                                    ${booking.service.hourlyRate}/hr
                                                </span>
                                            </div>
                                        </div>

                                        {/* Tasker Info */}
                                        <div className="bg-indigo-50 rounded-2xl p-4 flex items-center gap-3 transition-all duration-300 hover:bg-indigo-100">
                                            <div className="bg-indigo-200 p-1.5 rounded-full w-8 h-8 flex items-center justify-center">
                                                {booking.tasker.profilePicture ? (
                                                    <Image
                                                        src={booking.tasker.profilePicture}
                                                        alt={`${booking.tasker.fullName}'s profile`}
                                                        width={32}
                                                        height={32}
                                                        className="rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <FaUser className="text-indigo-600 text-base" />
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-700">
                                                <p className="font-semibold text-indigo-700">{booking.tasker.fullName}</p>
                                                {booking.tasker.email && <p className="text-xs">{booking.tasker.email}</p>}
                                                {booking.tasker.phone && <p className="text-xs">{booking.tasker.phone}</p>}
                                            </div>
                                        </div>

                                        {/* Footer: Date & Action */}
                                        <div className="flex items-center justify-between pt-4 border-t border-purple-200">
                                            <span className="flex items-center gap-2 text-sm text-gray-600">
                                                <FaCalendarAlt className="text-blue-500" />
                                                {new Date(booking.createdAt).toLocaleDateString()}
                                            </span>
                                            <button
                                                onClick={() => handleDeleteBooking(booking._id)}
                                                className={`flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold px-4 py-2 rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md transform hover:scale-105 ${isDeleting || user._id !== booking.client._id ? 'opacity-50 cursor-not-allowed' : ''
                                                    }`}
                                                disabled={isDeleting || user._id !== booking.client._id}
                                            >
                                                <FaTrash /> {isDeleting ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Background Pattern */}
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

                                    {/* Custom Animation for Spin */}
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


        </div>
    );
};

export default AllBookings;