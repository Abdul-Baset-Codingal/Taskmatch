/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import { useState } from "react";
import { FaEnvelope, FaShieldAlt, FaStar, FaUser } from "react-icons/fa";
import BookServiceModal from "./BookServiceModal";
import RequestQuoteModal from "./RequestQuoteModal";
import TaskerProfileModal from "./TaskerProfileModal";
import client from "../../../../public/Images/clientImage1.jpg";

interface Tasker {
    rating: any;
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    profilePicture: any;
    city: string;
    province: string;
    service: string;
    description: string;
    skills: string[];
    rate: number;
    availability: { day: string; from: string; to: string; _id: string }[];
    experience: string;
    hasInsurance: boolean;
    backgroundCheckConsent: boolean;
    categories: string[];
    certifications: string[];
    qualifications: string[];
    serviceAreas: string[];
    services: { title: string; description: string; hourlyRate: number; estimatedDuration: string }[];
    distance?: number;
    reviews?: { rating: number; count: number; comment: string; clientName?: string; clientEmail?: string; clientImage?: string };
}

const FancyCard = ({ tasker, isSelected, onClick }: {
    tasker: Tasker;
    isSelected: boolean;
    onClick: () => void;
}) => {
    const [isBookModalOpen, setIsBookModalOpen] = useState(false);
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const bgColors = [
        "bg-blue-100 text-blue-800",
        "bg-green-100 text-green-800",
        "bg-purple-100 text-purple-800",
        "bg-pink-100 text-pink-800",
        "bg-yellow-100 text-yellow-800",
        "bg-red-100 text-red-800",
        "bg-indigo-100 text-indigo-800",
        "bg-teal-100 text-teal-800",
    ];

    return (
        <>
            <div
                className={`relative bg-white border-t shadow-sm p-4 sm:p-6 rounded-lg cursor-pointer transition-all duration-200 ${isSelected ? "border-l-4 border-[#8560F1] shadow-md" : "border-gray-200 hover:shadow-md"
                    } w-full max-w-2xl mx-auto`}
                onClick={onClick}
            >
                <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                    {/* Profile Picture */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-sm relative flex-shrink-0">
                        {tasker.profilePicture ? (
                            <Image
                                src={client}
                                alt={`${tasker.firstName} ${tasker.lastName}`}
                                width={96}
                                height={96}
                                className="object-cover w-full h-full"
                                priority
                            />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full bg-gray-100">
                                <FaUser className="text-gray-400 text-xl sm:text-2xl" />
                            </div>
                        )}
                        <FaShieldAlt className="absolute bottom-0 right-0 text-blue-500 bg-white rounded-full p-1 text-sm sm:text-base shadow-sm" />
                    </div>

                    {/* Tasker Info */}
                    <div className="flex-1 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-2">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 truncate">
                                {tasker.firstName} {tasker.lastName}
                            </h3>
                            <div className="text-base sm:text-lg md:text-xl font-semibold text-[#8560F1]">
                                {tasker.rate ? `$${tasker.rate}/hr` : "Rate not available"}
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2 sm:mt-3">
                            {tasker.serviceAreas?.map((area, index) => {
                                const randomColor = bgColors[Math.floor(Math.random() * bgColors.length)];
                                return (
                                    <span
                                        key={index}
                                        className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${randomColor}`}
                                    >
                                        {area}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-3 sm:mt-4">
                    <div className="flex items-center gap-1">
                        {tasker.rating ? (
                            Array.from({ length: 5 }).map((_, index) => (
                                <FaStar
                                    key={index}
                                    className={`text-xs sm:text-sm ${index < Math.floor(tasker?.rating ?? 0) ? "text-yellow-400" : "text-gray-300"
                                        }`}
                                />
                            ))
                        ) : (
                            Array.from({ length: 5 }).map((_, index) => (
                                <FaStar key={index} className="text-xs sm:text-sm text-gray-300" />
                            ))
                        )}
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-800">
                      {tasker.rating}
                    </span>
                </div>

                {/* Service Description */}
                <p className="text-xs sm:text-sm text-gray-600 italic mt-1 line-clamp-2">{tasker.service}</p>

                {/* Testimonial */}
                <div className="flex items-start gap-2 sm:gap-3 mt-3 sm:mt-4">
                    {tasker.reviews?.clientImage ? (
                        <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                            <Image
                                src={tasker.reviews.clientImage}
                                alt="Client"
                                fill
                                className="object-cover"
                                priority={false}
                                sizes="40px"
                            />
                        </div>
                    ) : (
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 flex-shrink-0">
                            <FaUser className="text-gray-400 text-sm sm:text-base" />
                        </div>
                    )}
                    <div className="flex-1">
                        <p className="text-xs sm:text-sm text-gray-700 italic line-clamp-2">
                            &quot;{tasker.reviews?.comment || "No testimonial available."}&quot;
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            — {tasker.reviews?.clientName || "Anonymous Client"}{" "}
                            {tasker.reviews?.clientEmail && `(${tasker.reviews.clientEmail})`}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 sm:mt-5">
                    <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-4 mt-4 sm:mt-5">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsBookModalOpen(true);
                            }}
                            className="w-40 sm:w-44 bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] text-white text-xs sm:text-sm py-2 sm:py-3 rounded-full font-semibold hover:opacity-90 transition-all duration-200"
                        >
                            Book Now
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsProfileModalOpen(true);
                            }}
                            className="w-40 sm:w-44 bg-gray-100 text-gray-800 text-xs sm:text-sm py-2 sm:py-3 rounded-full font-semibold hover:bg-gray-200 transition-all duration-200"
                        >
                            View Profile
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsQuoteModalOpen(true);
                            }}
                            className="w-40 sm:w-44 bg-gray-100 text-gray-800 text-xs sm:text-sm py-2 sm:py-3 rounded-full font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <FaEnvelope className="text-sm sm:text-base" />
                            <span>Request Quote</span>
                        </button>
                    </div>

                </div>


            </div>

            {/* Modals */}
            <BookServiceModal
                tasker={tasker}
                isOpen={isBookModalOpen}
                onClose={() => setIsBookModalOpen(false)}
            />
            <RequestQuoteModal
                tasker={{ ...tasker, fullName: `${tasker.firstName} ${tasker.lastName}` }}
                isOpen={isQuoteModalOpen}
                onClose={() => setIsQuoteModalOpen(false)}
            />
            <TaskerProfileModal
                tasker={{ ...tasker, fullName: `${tasker.firstName} ${tasker.lastName}` }}
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}



            />
        </>
    );
};

export default FancyCard;