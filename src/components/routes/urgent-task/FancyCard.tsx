/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */

import Image from "next/image";
import { useState, useEffect } from "react";
import { FaClock, FaEnvelope, FaShieldAlt, FaStar, FaUser } from "react-icons/fa";
import BookServiceModal from "./BookServiceModal";
import RequestQuoteModal from "./RequestQuoteModal";
import TaskerProfileModal from "./TaskerProfileModal";
import Link from "next/link";
import { checkLoginStatus } from "@/resusable/CheckUser";

interface Tasker {
    rating: any;
    _id: string;
    odooId?: string;
    odooPartnerId?: string;
    odooUserId?: string;
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
    reviews?: {
        length: number;
        reduce(arg0: (sum: any, review: any) => any, arg1: number): unknown;
        rating: number;
        count: number;
        comment: string;
        clientName?: string;
        clientEmail?: string;
        clientImage?: string;
    };
}

interface CurrentUser {
    _id?: string;
    id?: string;
    odooId?: string;
    email?: string;
}

const FancyCard = ({ tasker, isSelected, onClick }: {
    tasker: Tasker;
    isSelected: boolean;
    onClick: () => void;
}) => {
    const [isBookModalOpen, setIsBookModalOpen] = useState(false);
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [isOwnProfile, setIsOwnProfile] = useState(false);

    // Check if current user is viewing their own profile
    useEffect(() => {
        const checkUser = async () => {
            try {
                const { isLoggedIn, user } = await checkLoginStatus();
                if (isLoggedIn && user) {
                    setCurrentUser(user);

                    // Check if the logged-in user is the same as the tasker
                    // Compare by multiple identifiers to ensure accurate matching
                    const isSameUser =
                        (user._id && user._id === tasker._id) ||
                        (user.id && user.id === tasker._id) ||
                        (user.odooId && user.odooId === tasker.odooId) ||
                        (user.email && user.email === tasker.email);

                    setIsOwnProfile(isSameUser);
                }
            } catch (error) {
                console.error("Error checking user status:", error);
                setIsOwnProfile(false);
            }
        };
        checkUser();
    }, [tasker._id, tasker.odooId, tasker.email]);

    console.log(tasker);
    console.log("Is own profile:", isOwnProfile);

    return (
        <div
            className={`relative bg-white border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg ${isSelected ? "border-[#8560F1] shadow-lg" : "border-gray-200"} w-full`}
            onClick={onClick}
        >
            {/* Own Profile Badge */}
            {isOwnProfile && (
                <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full border border-yellow-300 z-10">
                    Your Profile
                </div>
            )}

            <div className="flex flex-col sm:flex-row w-full">
                <div className="flex flex-col items-center sm:items-start">
                    {/* Header with Profile and Basic Info */}
                    <div className="px-3 sm:px-4 pt-3 sm:pt-4 pb-2 items-center sm:items-start gap-3 sm:gap-4">
                        {/* Profile Picture - Top Left */}
                        <div className="w-[100px] sm:w-16 md:w-[150px] h-[100px] sm:h-16 md:h-[150px] rounded-full overflow-hidden flex-shrink-0">
                            {tasker.profilePicture ? (
                                <Image
                                    src={tasker.profilePicture}
                                    alt={`${tasker.firstName} ${tasker.lastName}`}
                                    width={150}
                                    height={150}
                                    className="object-cover w-full h-full"
                                    priority
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full bg-gray-100">
                                    <FaUser className="text-gray-400 text-lg sm:text-xl md:text-2xl" />
                                </div>
                            )}
                        </div>
                        <div className="flex justify-center">
                            <div className="flex justify-center">
                                {isOwnProfile ? (
                                    <Link
                                        href="/dashboard/profile"
                                        className="font-bold text-blue-600 cursor-pointer p-2 text-sm sm:text-base hover:text-blue-800 transition-colors"
                                    >
                                        Edit Profile
                                    </Link>
                                ) : (
                                    <Link
                                        href={`/taskers/${tasker._id}`}
                                        className="font-bold text-green-800 cursor-pointer p-2 text-sm sm:text-base hover:text-green-600 transition-colors"
                                    >
                                        View Profile
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full">
                    {/* Service Categories */}
                    <div className="px-3 sm:px-4 py-2 sm:py-3 border-b w-full border-gray-100">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between">
                            <h3 className="text-lg sm:text-xl md:text-3xl font-bold text-gray-900 truncate">
                                {tasker.firstName} {tasker.lastName}
                            </h3>
                            <span className="text-sm sm:text-base md:text-2xl font-bold text-gray-900 mt-1 sm:mt-0">
                                ${tasker.rate}/hr
                            </span>
                        </div>

                        {/* All Other Info - Right Side */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 sm:gap-5 lg:gap-7 mt-1 sm:mt-2 flex-wrap">
                                <div className="flex items-center gap-1">
                                    {tasker.reviews && tasker.reviews.length > 0 ? (
                                        <>
                                            <FaStar className="text-yellow-400 text-sm sm:text-base md:text-lg" />
                                            <span className="text-sm sm:text-base md:text-lg font-medium text-gray-700">
                                                {((tasker.reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) as number) / tasker.reviews.length).toFixed(1)}
                                            </span>
                                            <span className="text-xs sm:text-sm md:text-base text-gray-500">({tasker.reviews.length})</span>
                                        </>
                                    ) : (
                                        <span className="text-sm sm:text-base md:text-lg text-gray-500">No reviews</span>
                                    )}
                                </div>
                                <span className="text-xs sm:text-sm md:text-base text-gray-500">
                                    {tasker.experience === "1_3" ? "1-3 years exp" : tasker.experience}
                                </span>
                                {(tasker.hasInsurance || tasker.backgroundCheckConsent) && (
                                    <span className="text-green-700 flex items-center gap-1 text-xs sm:text-sm md:text-base">
                                        <FaShieldAlt className="text-xs sm:text-sm md:text-base" />
                                        Verified
                                    </span>
                                )}
                            </div>
                        </div>
                        <h4 className="text-xs font-medium text-gray-500 mb-1 sm:mb-2 mt-2 sm:mt-4">Services:</h4>
                        <div className="flex flex-wrap gap-1">
                            {tasker.categories?.slice(0, 3).map((category, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 bg-[#d8e7e6] text-[#2F6F69] rounded text-xs font-medium border border-blue-200"
                                >
                                    {category}
                                </span>
                            ))}
                            {tasker.categories && tasker.categories.length > 3 && (
                                <span className="px-2 py-1 text-gray-500 text-xs">
                                    +{tasker.categories.length - 3} more
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Service Areas */}
                    <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-100">
                        <h4 className="text-xs font-medium text-gray-500 mb-1 sm:mb-2">Areas:</h4>
                        <div className="flex flex-wrap gap-1">
                            {tasker.serviceAreas?.map((area, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                                >
                                    {area}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Primary Service Description */}
                    <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-100">
                        {tasker.services && tasker.services.length > 0 ? (
                            <div>
                                <h4 className="text-xs sm:text-sm font-medium text-gray-900 capitalize mb-1">
                                    {tasker.services[0].title}
                                </h4>
                                <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-1">
                                    {tasker.services[0].description}
                                </p>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <FaClock className="text-xs" />
                                    <span>{tasker.services[0].estimatedDuration}</span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                                {tasker.description !== "No description available." ? tasker.description : `Professional ${tasker.service} services`}
                            </p>
                        )}
                    </div>

                    {/* Latest Review */}
                    {tasker.reviews && tasker.reviews.length > 0 && (
                        <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-100 bg-gray-100 mx-3 sm:mx-4">
                            <div className="flex items-start gap-2">
                                <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
                                    <FaUser className="text-gray-400 text-xs" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1 mb-1">
                                        {Array.from({ length: 5 }).map((_, index) => (
                                            <FaStar
                                                key={index}
                                                className={`text-xs ${index < tasker.reviews[0].rating ? "text-yellow-400" : "text-gray-300"}`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-600 italic line-clamp-2">
                                        &quot;{tasker.reviews[0].message}&quot;
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        — Recent client review
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="p-3 sm:p-4">
                        <div className="space-y-2">
                            {/* Show message if own profile */}
                            {isOwnProfile && (
                                <p className="text-xs text-amber-600 text-center mb-2 font-medium">
                                    You cannot book your own services
                                </p>
                            )}
                            <div className="flex flex-col sm:flex-row w-full gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!isOwnProfile) {
                                            setIsBookModalOpen(true);
                                        }
                                    }}
                                    disabled={isOwnProfile}
                                    className={`w-full sm:w-[50%] text-sm py-2 sm:py-2.5 rounded font-medium transition-colors duration-200 ${isOwnProfile
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : "color1 text-white hover:bg-[#7451E8]"
                                        }`}
                                    title={isOwnProfile ? "You cannot book yourself" : "Select & Continue"}
                                >
                                    Select & Continue
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!isOwnProfile) {
                                            setIsQuoteModalOpen(true);
                                        }
                                    }}
                                    disabled={isOwnProfile}
                                    className={`flex-1 border text-sm py-2 rounded font-medium transition-colors duration-200 flex items-center justify-center gap-1 ${isOwnProfile
                                            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                                            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                                        }`}
                                    title={isOwnProfile ? "You cannot request a quote from yourself" : "Request Quote"}
                                >
                                    <FaEnvelope className="text-xs" />
                                    Quote
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals - Only render if not own profile */}
            {!isOwnProfile && (
                <>
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
                </>
            )}
            <TaskerProfileModal
                tasker={{ ...tasker, fullName: `${tasker.firstName} ${tasker.lastName}` }}
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
            />
        </div>
    );
};

export default FancyCard;