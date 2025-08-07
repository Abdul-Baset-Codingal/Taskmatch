/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import {
    FaClock,
    FaDollarSign,
    FaUser,
    FaInfoCircle,
    FaCalendarAlt,
    FaTrash,
    FaLocationArrow,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import {
    useLazyGetRequestQuotesByClientIdQuery,
    useDeleteRequestQuoteMutation,
} from "@/features/api/taskerApi";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";

interface User {
    _id: string;
    role: string;
}

const RequestQuoteByUser: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [trigger, { data: quotes = [], isLoading, error }] =
        useLazyGetRequestQuotesByClientIdQuery();
    const [deleteRequestQuote, { isLoading: isDeleting }] =
        useDeleteRequestQuoteMutation();

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/auth/verify-token",
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setIsLoggedIn(true);
                    setUser({ _id: data.user._id, role: data.user.role });
                    trigger(data.user._id);
                } else {
                    setIsLoggedIn(false);
                    setUser(null);
                }
            } catch (error) {
                console.error("Error checking login status:", error);
                setIsLoggedIn(false);
                setUser(null);
            }
        };

        checkLoginStatus();
    }, [trigger]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this request quote?")) return;

        try {
            await deleteRequestQuote(id).unwrap();
            alert("Request quote deleted successfully!");
            // Refetch quotes after deletion
            if (user?._id) trigger(user._id);
        } catch (err: any) {
            alert(
                `Failed to delete request quote: ${err?.data?.message || "Unknown error"
                }`
            );
        }
    };

    if (!isLoggedIn) {
        return <p>Please log in to view your request quotes.</p>;
    }

    if (isLoading) {
        return <p>Loading request quotes...</p>;
    }

    if (error) {
        return (
            <p className="text-red-500">
                Error: Failed to load request quotes
            </p>
        );
    }

    if (quotes.length === 0) {
        return <p>No request quotes found for your user.</p>;
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-clip-text bg-gradient-to-r from-[#8560F1] to-[#E7B6FE]">
                Manage Your Request Quotes
            </h2>

            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                pagination={{ clickable: true }}
                autoplay={{ delay: 6000 }}
                className="my-8"
                breakpoints={{
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
            >
                {quotes.map((quote: {
                    _id: React.Key | null | undefined; taskTitle: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; taskDescription: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; urgency: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; budget: any; location: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; preferredDateTime: string | number | Date; tasker: {
                        profilePicture: any; fullName: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; email: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; phone: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined;
                    }; status: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; createdAt: string | number | Date;
                }) => (
                    <SwiperSlide key={quote._id}>
                        <div className="relative bg-white rounded-2xl shadow-lg max-w-md mx-auto overflow-hidden transition-all duration-400 hover:shadow-[0_12px_40px_rgba(99,102,241,0.3)] hover:-translate-y-1 border border-indigo-100">
                            {/* Curved Header */}
                            <div className="relative bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-5 rounded-b-[50%_25%] shadow-md">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/40 p-2 rounded-lg shadow-md animate-pulse">
                                        <FaLocationArrow className="text-xl" />
                                    </div>
                                    <h3 className="text-xl font-extrabold truncate">{quote.taskTitle}</h3>
                                </div>
                                {/* Glowing Status Indicator */}
                                <div className="absolute top-3 right-3 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,159,10,0.5)]">
                                    <FaInfoCircle className={`text-base ${quote.status === 'pending' ? 'text-yellow-800' : quote.status === 'accepted' ? 'text-green-800' : 'text-red-800'}`} />
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="p-5 space-y-4">
                                {/* Task Details */}
                                <div className="bg-gradient-to-b from-gray-50 to-white rounded-lg p-3 border border-indigo-100 transition-all duration-300 hover:bg-indigo-50">
                                    <p className="text-sm text-gray-600 italic line-clamp-2 mb-3 text-center">{quote.taskDescription}</p>
                                    <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-gray-700">
                                        <span className="flex items-center gap-1 bg-orange-100 px-2 py-1 rounded-md">
                                            <FaClock className="text-orange-500" />
                                            {quote.urgency}
                                        </span>
                                        <span className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-md">
                                            <FaDollarSign className="text-green-500" />
                                            {quote.budget ?? 'Not specified'}
                                        </span>
                                        <span className="col-span-2 flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-md">
                                            <FaLocationArrow className="text-blue-500" />
                                            {quote.location}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-xs text-gray-700 text-center">
                                        Preferred: {quote.preferredDateTime ? new Date(quote.preferredDateTime).toLocaleString() : 'Flexible'}
                                    </p>
                                </div>

                                {/* Tasker Info */}
                                <div className="flex items-start gap-2 bg-indigo-50 rounded-lg p-3 transition-all duration-300 hover:bg-indigo-100">
                                    <div className="bg-indigo-200 p-1.5 rounded-full w-8 h-8 flex items-center justify-center">
                                        {quote.tasker.profilePicture ? (
                                            <Image
                                                src={quote.tasker.profilePicture}
                                                alt={`${quote.tasker.fullName}'s profile`}
                                                width={32}
                                                height={32}
                                                className="rounded-full object-cover"
                                            />
                                        ) : (
                                            <FaUser className="text-indigo-600 text-base" />
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-700">
                                        <p className="font-semibold text-indigo-700">{quote.tasker.fullName}</p>
                                        <p>{quote.tasker.email}</p>
                                        <p>{quote.tasker.phone}</p>
                                    </div>
                                </div>

                                {/* Footer: Date & Action */}
                                <div className="flex items-center justify-between pt-3 border-t border-indigo-100">
                                    <span className="flex items-center gap-1 text-xs text-gray-600">
                                        <FaCalendarAlt className="text-blue-500" />
                                        {new Date(quote.createdAt).toLocaleDateString()}
                                    </span>
                                    <button
                                        onClick={() => quote._id != null && typeof quote._id === 'string' && handleDelete(quote._id)} className={`flex items-center gap-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold px-3 py-1.5 rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md transform hover:scale-110 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                        disabled={isDeleting}
                                    >
                                        <FaTrash /> {isDeleting ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                            </div>

                            {/* Subtle Background Pattern */}
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/hexellence.png')] opacity-5 pointer-events-none"></div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );

};

export default RequestQuoteByUser;
