/* eslint-disable @typescript-eslint/ban-ts-comment */
import Image from 'next/image';
import React, { ReactNode, useState } from 'react';
import {
    FaUser,
    FaStar,
    FaTools,
    FaCertificate,
    FaGraduationCap,
    FaShieldAlt,
    FaMapMarkerAlt,
    FaClock,
    FaCheckCircle,
    FaCalendarAlt,
    FaQuoteLeft,
    FaBriefcase,
    FaChevronRight,
    FaRegClock,
    FaUserCheck,
    FaGlobe,
} from "react-icons/fa";
import BookServiceModal from '../routes/urgent-task/BookServiceModal';
import RequestQuoteModal from '../routes/urgent-task/RequestQuoteModal';
import { useGetUserByIdQuery } from "@/features/auth/authApi";

interface Review {
    message: ReactNode;
    rating: number;
    comment: string;
    reviewer: string;
    createdAt: string;
    _id: string;
}

interface Tasker {
    about: string;
    _id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phone: string;
    profilePicture: string | null;
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
    rating?: number;
    reviews?: Review[];
}

// Reviewer Card Component - Fetches and displays reviewer info
const ReviewerCard = ({ review }: { review: Review }) => {
    const { data: reviewerData, isLoading } = useGetUserByIdQuery(review.reviewer, {
        skip: !review.reviewer
    });

    const reviewer = reviewerData?.user;

    const getInitials = (): string => {
        if (reviewer?.firstName && reviewer?.lastName) {
            return `${reviewer.firstName.charAt(0)}${reviewer.lastName.charAt(0)}`.toUpperCase();
        }
        if (reviewer?.firstName) {
            return reviewer.firstName.charAt(0).toUpperCase();
        }
        return 'A';
    };

    const getFullName = (): string => {
        if (reviewer?.firstName && reviewer?.lastName) {
            return `${reviewer.firstName} ${reviewer.lastName}`;
        }
        if (reviewer?.firstName) {
            return reviewer.firstName;
        }
        return 'Anonymous User';
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 animate-pulse">
                <div className="flex items-start gap-3">
                    <div className="w-11 h-11 bg-gray-200 rounded-full flex-shrink-0" />
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                            <div className="h-4 bg-gray-200 rounded w-28" />
                            <div className="h-3 bg-gray-200 rounded w-16" />
                        </div>
                        <div className="flex gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-4 h-4 bg-gray-200 rounded" />
                            ))}
                        </div>
                        <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded w-full" />
                            <div className="h-3 bg-gray-200 rounded w-3/4" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-5 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
            <div className="flex items-start gap-3 sm:gap-4">
                {/* Reviewer Avatar */}
                <div className="relative flex-shrink-0">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                        {reviewer?.profilePicture ? (
                            <Image
                                src={reviewer.profilePicture}
                                alt={getFullName()}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#063A41] to-[#0a5a63] flex items-center justify-center">
                                <span className="text-white text-sm sm:text-base font-bold">
                                    {getInitials()}
                                </span>
                            </div>
                        )}
                    </div>
                    {/* Verified badge if needed */}
                    {reviewer?.isVerified && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                            <FaCheckCircle className="text-white text-[6px]" />
                        </div>
                    )}
                </div>

                {/* Review Content */}
                <div className="flex-1 min-w-0">
                    {/* Header: Name & Date */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div>
                            <h4 className="font-semibold text-[#063A41] text-sm sm:text-base">
                                {getFullName()}
                            </h4>
                            {reviewer?.city && (
                                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                    <FaMapMarkerAlt className="text-[8px]" />
                                    {reviewer.city}
                                </p>
                            )}
                        </div>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                            {formatDate(review.createdAt)}
                        </span>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1 mb-2.5">
                        {Array.from({ length: 5 }).map((_, starIndex) => (
                            <FaStar
                                key={starIndex}
                                className={`text-sm ${starIndex < review.rating
                                    ? "text-yellow-400"
                                    : "text-gray-200"
                                    }`}
                            />
                        ))}
                        <span className="text-xs text-gray-500 ml-1.5">
                            {review.rating}.0
                        </span>
                    </div>

                    {/* Review Message */}
                    <div className="relative">
                        <FaQuoteLeft className="absolute -top-1 -left-1 text-gray-200 text-xs" />
                        <p className="text-gray-600 text-sm leading-relaxed pl-3">
                            {review.message || review.comment || "Great service!"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TaskerProfile = ({ tasker }: { tasker: Tasker }) => {
    const [isBookModalOpen, setIsBookModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

    const openBookModal = (serviceTitle: string) => {
        setSelectedService(serviceTitle);
        setIsBookModalOpen(true);
    };

    const closeBookModal = () => {
        setIsBookModalOpen(false);
        setSelectedService(null);
    };

    const openQuoteModal = () => {
        setIsQuoteModalOpen(true);
    };

    const closeQuoteModal = () => {
        setIsQuoteModalOpen(false);
    };

    const averageRating = tasker.rating || 0;
    const reviewCount = tasker.reviews?.length || 0;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-[#063A41] relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,...')]" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-8">
                        {/* Profile Picture */}
                        <div className="relative">
                            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-4 border-white/20 shadow-xl">
                                {tasker.profilePicture ? (
                                    <Image
                                        src={tasker.profilePicture}
                                        alt={tasker.fullName}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full bg-[#109C3D]">
                                        <FaUser className="text-white text-4xl sm:text-5xl" />
                                    </div>
                                )}
                            </div>
                            {/* Online/Verified Badge */}
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#109C3D] rounded-full flex items-center justify-center border-3 border-white shadow-lg">
                                <FaCheckCircle className="text-white text-sm" />
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                                    {tasker.fullName}
                                </h1>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#109C3D] text-white text-xs font-semibold rounded-full">
                                    <FaCheckCircle className="text-[10px]" />
                                    Verified Pro
                                </span>
                            </div>

                            <p className="text-white/80 text-base sm:text-lg mb-4">
                                {tasker.service || tasker.categories[0] || "Professional Tasker"}
                            </p>

                            {/* Quick Stats */}
                            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                                {/* Rating */}
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                        <FaStar className="text-yellow-400" />
                                        <span className="text-white font-bold text-lg">{averageRating.toFixed(1)}</span>
                                    </div>
                                    <span className="text-white/60 text-sm">({reviewCount} reviews)</span>
                                </div>

                                {/* Location */}
                                {(tasker.city || tasker.province) && (
                                    <div className="flex items-center gap-2 text-white/80">
                                        <FaMapMarkerAlt className="text-[#109C3D]" />
                                        <span className="text-sm">{tasker.city}, {tasker.province}</span>
                                    </div>
                                )}

                                {/* Experience */}
                                {tasker.experience && (
                                    <div className="flex items-center gap-2 text-white/80">
                                        <FaBriefcase className="text-[#109C3D]" />
                                        <span className="text-sm">{tasker.experience}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions - Desktop */}
                        <div className="hidden lg:flex flex-col gap-3 min-w-[200px]">
                            <button
                                onClick={() => openBookModal(tasker.services[0]?.title || '')}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#109C3D] text-white font-semibold rounded-xl hover:bg-[#0d8a35] transition-all shadow-lg"
                            >
                                <FaCalendarAlt />
                                Book Now
                            </button>
                            <button
                                onClick={openQuoteModal}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20"
                            >
                                <FaQuoteLeft />
                                Get Quote
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content Column */}
                    <div className="lg:w-2/3 space-y-6">
                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                                <div className="w-10 h-10 bg-[#E5FFDB] rounded-lg flex items-center justify-center mb-2">
                                    <FaUserCheck className="text-[#109C3D]" />
                                </div>
                                <p className="text-xs text-gray-500">Background</p>
                                <p className="text-sm font-semibold text-[#063A41]">
                                    {tasker.backgroundCheckConsent ? "Verified" : "Pending"}
                                </p>
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                                <div className="w-10 h-10 bg-[#E5FFDB] rounded-lg flex items-center justify-center mb-2">
                                    <FaShieldAlt className="text-[#109C3D]" />
                                </div>
                                <p className="text-xs text-gray-500">Insurance</p>
                                <p className="text-sm font-semibold text-[#063A41]">
                                    {tasker.hasInsurance ? "Covered" : "Not Listed"}
                                </p>
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                                <div className="w-10 h-10 bg-[#E5FFDB] rounded-lg flex items-center justify-center mb-2">
                                    <FaBriefcase className="text-[#109C3D]" />
                                </div>
                                <p className="text-xs text-gray-500">Experience</p>
                                <p className="text-sm font-semibold text-[#063A41]">
                                    {tasker.experience || "N/A"}
                                </p>
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                                <div className="w-10 h-10 bg-[#E5FFDB] rounded-lg flex items-center justify-center mb-2">
                                    <FaTools className="text-[#109C3D]" />
                                </div>
                                <p className="text-xs text-gray-500">Services</p>
                                <p className="text-sm font-semibold text-[#063A41]">
                                    {tasker.services.length} Listed
                                </p>
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-bold text-[#063A41] mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-[#109C3D] rounded-full"></span>
                                About {tasker.firstName}
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                {tasker.about || "This tasker hasn't added a bio yet."}
                            </p>
                        </div>

                        {/* Services Section */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-bold text-[#063A41] mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-[#109C3D] rounded-full"></span>
                                Services Offered
                            </h2>
                            {tasker.services.length > 0 ? (
                                <div className="space-y-3">
                                    {tasker.services.map((service, i) => (
                                        <div
                                            key={i}
                                            onClick={() => openBookModal(service.title)}
                                            className="group p-4 rounded-xl border-2 border-gray-100 hover:border-[#109C3D] bg-gray-50 hover:bg-[#E5FFDB]/30 cursor-pointer transition-all"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-[#063A41] group-hover:text-[#109C3D] transition-colors mb-1">
                                                        {service.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                                                        {service.description}
                                                    </p>
                                                    <div className="flex items-center gap-4">
                                                        <span className="flex items-center gap-1.5 text-sm text-gray-600">
                                                            <FaRegClock className="text-[#109C3D]" />
                                                            {service.estimatedDuration}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <p className="text-2xl font-bold text-[#109C3D]">
                                                        ${service.hourlyRate}
                                                    </p>
                                                    <p className="text-xs text-gray-400">per hour</p>
                                                </div>
                                            </div>
                                            <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                                                <span className="text-sm text-[#109C3D] font-medium group-hover:underline">
                                                    Book this service
                                                </span>
                                                <FaChevronRight className="text-[#109C3D] text-sm group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <FaTools className="text-gray-300 text-3xl mx-auto mb-3" />
                                    <p className="text-gray-500">No services listed yet</p>
                                </div>
                            )}
                        </div>

                        {/* Skills Section */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-bold text-[#063A41] mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-[#109C3D] rounded-full"></span>
                                Skills & Expertise
                            </h2>
                            {tasker.skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {tasker.skills.map((skill, i) => (
                                        <span
                                            key={i}
                                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E5FFDB] text-[#063A41] rounded-full text-sm font-medium"
                                        >
                                            <FaCheckCircle className="text-[#109C3D] text-xs" />
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-4">No skills listed</p>
                            )}
                        </div>

                        {/* Categories Section */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-bold text-[#063A41] mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-[#109C3D] rounded-full"></span>
                                Categories
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {tasker.categories.map((cat, i) => (
                                    <span
                                        key={i}
                                        className="inline-flex items-center px-4 py-2 bg-[#063A41] text-white rounded-full text-sm font-medium"
                                    >
                                        {cat}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Certifications & Qualifications */}
                        {(tasker.certifications.length > 0 || tasker.qualifications.length > 0) && (
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <h2 className="text-xl font-bold text-[#063A41] mb-4 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-[#109C3D] rounded-full"></span>
                                    Certifications & Qualifications
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {tasker.certifications.map((cert, i) => (
                                        <div
                                            key={`cert-${i}`}
                                            className="flex items-center gap-3 p-3 bg-[#E5FFDB]/50 rounded-xl border border-[#109C3D]/10"
                                        >
                                            <div className="w-10 h-10 bg-[#109C3D] rounded-lg flex items-center justify-center flex-shrink-0">
                                                <FaCertificate className="text-white" />
                                            </div>
                                            <span className="text-sm font-medium text-[#063A41]">{cert}</span>
                                        </div>
                                    ))}
                                    {tasker.qualifications.map((qual, i) => (
                                        <div
                                            key={`qual-${i}`}
                                            className="flex items-center gap-3 p-3 bg-[#E5FFDB]/50 rounded-xl border border-[#109C3D]/10"
                                        >
                                            <div className="w-10 h-10 bg-[#063A41] rounded-lg flex items-center justify-center flex-shrink-0">
                                                <FaGraduationCap className="text-white" />
                                            </div>
                                            <span className="text-sm font-medium text-[#063A41]">{qual}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reviews Section - Updated with ReviewerCard */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-[#063A41] flex items-center gap-2">
                                    <span className="w-1 h-6 bg-[#109C3D] rounded-full"></span>
                                    Reviews
                                </h2>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#E5FFDB] rounded-full">
                                    <FaStar className="text-yellow-500" />
                                    <span className="font-bold text-[#063A41]">{averageRating.toFixed(1)}</span>
                                    <span className="text-gray-500 text-sm">({reviewCount})</span>
                                </div>
                            </div>

                            {tasker.reviews && tasker.reviews.length > 0 ? (
                                <div className="space-y-4">
                                    {tasker.reviews.map((review, i) => (
                                        <ReviewerCard key={review._id || i} review={review} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-xl">
                                    <FaStar className="text-gray-200 text-4xl mx-auto mb-3" />
                                    <p className="text-gray-500 font-medium">No reviews yet</p>
                                    <p className="text-gray-400 text-sm mt-1">Be the first to leave a review!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:w-1/3">
                        <div className="lg:sticky lg:top-8 space-y-6">
                            {/* Booking Card */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
                                <div className="text-center mb-6">
                                    <p className="text-sm text-gray-500 mb-1">Starting from</p>
                                    <p className="text-4xl font-bold text-[#109C3D]">
                                        ${(() => {
                                            const rates = tasker.services.map(s => s.hourlyRate).filter(r => typeof r === 'number' && !isNaN(r));
                                            const min = rates.length > 0 ? Math.min(...rates) : undefined;
                                            return min ?? tasker.rate ?? 'N/A';
                                        })()}
                                        <span className="text-base font-normal text-gray-400">/hr</span>
                                    </p>
                                </div>

                                <button
                                    onClick={() => openBookModal(tasker.services[0]?.title || '')}
                                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#109C3D] text-white font-semibold rounded-xl hover:bg-[#0d8a35] transition-all shadow-lg shadow-[#109C3D]/20 mb-3"
                                >
                                    <FaCalendarAlt />
                                    Book Now
                                </button>
                                <button
                                    onClick={openQuoteModal}
                                    className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-[#063A41] text-[#063A41] font-semibold rounded-xl hover:bg-[#063A41] hover:text-white transition-all"
                                >
                                    <FaQuoteLeft />
                                    Request Quote
                                </button>

                                <p className="text-xs text-center text-gray-400 mt-4">
                                    You won&apos;t be charged until the service is complete
                                </p>
                            </div>

                            {/* Availability */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <h3 className="font-semibold text-[#063A41] mb-4 flex items-center gap-2">
                                    <FaClock className="text-[#109C3D]" />
                                    Availability
                                </h3>
                                <div className="space-y-2">
                                    {tasker.availability.map((slot, i) => (
                                        <div
                                            key={slot._id || i}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                        >
                                            <span className="font-medium text-[#063A41] text-sm">{slot.day}</span>
                                            <span className="text-sm text-gray-500">{slot.from} - {slot.to}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Service Areas */}
                            {tasker.serviceAreas.length > 0 && (
                                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                    <h3 className="font-semibold text-[#063A41] mb-4 flex items-center gap-2">
                                        <FaGlobe className="text-[#109C3D]" />
                                        Service Areas
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {tasker.serviceAreas.map((area, i) => (
                                            <span
                                                key={i}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm"
                                            >
                                                <FaMapMarkerAlt className="text-[#109C3D] text-xs" />
                                                {area}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Fixed Bottom Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
                <div className="flex gap-3 max-w-lg mx-auto">
                    <button
                        onClick={openQuoteModal}
                        className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-[#063A41] text-[#063A41] font-semibold rounded-xl"
                    >
                        <FaQuoteLeft />
                        Quote
                    </button>
                    <button
                        onClick={() => openBookModal(tasker.services[0]?.title || '')}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#109C3D] text-white font-semibold rounded-xl shadow-lg"
                    >
                        <FaCalendarAlt />
                        Book Now
                    </button>
                </div>
            </div>

            {/* Spacer for mobile fixed bar */}
            <div className="lg:hidden h-20" />

            {/* Book Service Modal */}
            <BookServiceModal
                //@ts-ignore   
                tasker={tasker}
                isOpen={isBookModalOpen}
                onClose={closeBookModal}
                preSelectedService={selectedService}
            />

            {/* Request Quote Modal */}
            <RequestQuoteModal
                //@ts-ignore   
                tasker={tasker}
                isOpen={isQuoteModalOpen}
                onClose={closeQuoteModal}
            />
        </div>
    );
};

export default TaskerProfile;