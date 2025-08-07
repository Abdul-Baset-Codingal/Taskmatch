/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useGetTaskersQuery } from "@/features/auth/authApi";
import React, { useState } from "react";
import { FaSearch, FaMapMarkerAlt, FaUser, FaMap, FaList, FaStar, FaEnvelope, FaCheckCircle, FaShieldAlt } from "react-icons/fa";
import BookServiceModal from "./BookServiceModal";
import RequestQuoteModal from "./RequestQuoteModal";
import TaskerProfileModal from "./TaskerProfileModal";
import Image from "next/image";
import TaskerMap from "./TaskerMap";
import client from "../../../../public/Images/clientImage1.jpg"
interface Tasker {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    profilePicture: any;
    city: string;
    province: string;
    service: string;
    description: string;
    skills: string[];
    rate: number;
    availability: { day: string; from: string; to: string }[];
    experience: string;
    hasInsurance: boolean;
    backgroundCheckConsent: boolean;
    categories: string[];
    certifications: string[];
    qualifications: string[];
    serviceAreas: string[];
    services: { title: string; description: string; hourlyRate: number; estimatedDuration: string }[];
    distance?: number;
    reviews?: { rating: number; count: number; comment: string };
}

interface DetailsBannerProps {
    service?: { category: string };
}

const FancyCard = ({ tasker, isSelected, onClick }: {
    tasker: Tasker,
    isSelected: boolean,
    onClick: () => void
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
                className={`relative bg-white border-t shadow-md p-6   cursor-pointer  ${isSelected
                    ? "border-[#8560F1] border-l-4 "
                    : "border-gray-200 hover:shadow-lg "
                    }`}
                onClick={onClick}
            >


                <div className="flex flex-col lg:flex-row items-start gap-5">
                    <div className="w-[100px] h-[100px] rounded-full overflow-hidden shadow-sm relative">
                        {tasker.profilePicture ? (
                            <Image
                                src={client}
                                alt={tasker.fullName}
                                width={100}
                                height={100}
                                className="object-cover w-full h-full"
                                priority
                            />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full bg-gray-100">
                                <FaUser className="text-gray-400 text-3xl" />
                            </div>
                        )}
                        {/* Badge Icon */}
                        <FaShieldAlt className="absolute bottom-0 right-0 text-blue-500 bg-white rounded-full p-[2px] text-[18px] shadow-sm" />
                    </div>
                    {/* Info */}
                    <div className="flex-1 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-1">
                            <h3 className="text-3xl font-semibold text-gray-800">{tasker.fullName}</h3>
                            {/* Tasker Rate */}
                            <div className="text-2xl font-semibold text-[#8560F1]">
                                {tasker.rate ? `$${tasker.rate}/hr` : 'Rate not available'}
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {tasker.serviceAreas?.map((area, index) => {
                                const randomColor = bgColors[Math.floor(Math.random() * bgColors.length)];
                                return (
                                    <span
                                        key={index}
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${randomColor}`}
                                    >
                                        {area}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </div>
                {/* Rating */}
                <div className="flex items-center gap-2 mt-4">
                    <div className="flex items-center gap-1">
                        {/* Dynamic Stars based on rating */}
                        {tasker.reviews?.rating ? (
                            Array.from({ length: 5 }).map((_, index) => (
                                <FaStar
                                    key={index}
                                    className={`text-sm ${index < Math.floor(tasker.reviews.rating)
                                        ? 'text-yellow-400'
                                        : 'text-gray-300'
                                        }`}
                                />
                            ))
                        ) : (
                            Array.from({ length: 5 }).map((_, index) => (
                                <FaStar key={index} className="text-sm text-yellow-400" />
                            ))
                        )}
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                        {tasker.reviews
                            ? `${tasker.reviews.rating.toFixed(1)} (${tasker.reviews.count} reviews)`
                            : '5.0 (0 reviews)'}
                    </span>
                </div>

                {/* Service */}
                <p className="text-sm text-gray-600 italic mt-1">{tasker.service}</p>

                <div className="mt-4 flex items-start gap-3">
                    {/* Client Image or FaUser Icon */}
                    {tasker.reviews?.clientImage ? (
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200">
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
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                            <FaUser className="text-gray-400 text-lg" />
                        </div>
                    )}
                    {/* Testimonial Content */}
                    <div>
                        <p className="text-sm text-gray-700 italic line-clamp-3">
                            "{tasker.reviews?.comment || 'No testimonial available.'}"
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            — {tasker.reviews?.clientName || 'Anonymous Client'}{' '}
                            {tasker.reviews?.clientEmail && `(${tasker.reviews.clientEmail})`}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-5">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsBookModalOpen(true);
                        }}
                        className="flex-1 bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] text-white text-sm py-2.5 rounded-full font-semibold hover:bg-green-600 transition"
                    >
                        Book Now
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsProfileModalOpen(true);
                        }}
                        className="flex-1 bg-gray-100 text-gray-800 text-sm py-2.5 rounded-full font-semibold hover:bg-gray-200 transition"
                    >
                        View Profile
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsQuoteModalOpen(true);
                        }}
                        className="w-[45px] h-[42px] bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 flex items-center justify-center transition"
                    >
                        <FaEnvelope className="text-base" />
                    </button>
                </div>
            </div>

            {/* Modals */}
            <BookServiceModal
                tasker={tasker}
                isOpen={isBookModalOpen}
                onClose={() => setIsBookModalOpen(false)}
            />
            <RequestQuoteModal
                tasker={tasker}
                isOpen={isQuoteModalOpen}
                onClose={() => setIsQuoteModalOpen(false)}
            />
            <TaskerProfileModal
                tasker={tasker}
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
            />
        </>

    );
};

const TaskerSlider: React.FC<DetailsBannerProps> = ({ service }) => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [province, setProvince] = useState('');
    const [serviceType, setServiceType] = useState(service?.category || '');
    const [viewMode, setViewMode] = useState<'split' | 'list'>('split');
    const [selectedTasker, setSelectedTasker] = useState<string | null>(null);

    const { data, isLoading, error } = useGetTaskersQuery({
        category: serviceType,
        page,
        limit: 20,
        search,
        province,
    });

    const taskers: Tasker[] = (data?.taskers || []).map((tasker: any) => {
        const serviceAreas = tasker.serviceAreas?.filter((area: string) => area && typeof area === 'string') || [];
        if (serviceAreas.length === 0) {
            console.warn(`Tasker ${tasker.fullName} has no valid service areas`);
        }
        return {
            _id: tasker._id || "unknown",
            fullName: tasker.fullName || "Unknown Tasker",
            email: tasker.email || "N/A",
            phone: tasker.phone || "N/A",
            profilePicture: tasker.profilePicture || "https://via.placeholder.com/150",
            city: tasker.address?.city || "Unknown",
            province: tasker.address?.postalCode?.startsWith("M") ? "ON" : "Unknown",
            service: tasker.services?.[0]?.title || "General Services",
            description: tasker.about || "No description available.",
            skills: tasker.skills || [],
            rate: tasker.services?.[0]?.hourlyRate || 0,
            availability: tasker.availability || [],
            experience: tasker.yearsOfExperience || "0 years",
            hasInsurance: tasker.hasInsurance || false,
            backgroundCheckConsent: tasker.backgroundCheckConsent || false,
            categories: tasker.categories || [],
            certifications: tasker.certifications || [],
            qualifications: tasker.qualifications || [],
            serviceAreas,
            services: tasker.services || [],
            distance: tasker.distance || Math.random() * 10,
            reviews: tasker.reviews || { rating: 5.0, count: 0, comment: "Great service!" },
        };
    }).filter(tasker => tasker.serviceAreas.length > 0);

    const totalTaskers = data?.pagination?.totalTaskers || 0;
    console.log(taskers)

    if (isLoading) {
        return (
            <div className="bg-white py-12 px-4 text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Find the Perfect Match</h1>
                <p className="text-gray-600 text-base">Loading service providers...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white py-12 px-4 text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Find the Perfect Match</h1>
                <p className="text-red-600 text-base">Error loading service providers: {error.toString()}</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-8 font-sans">
            <div className="w-full mx-auto px-4 flex flex-col lg:flex-row   
            
            
            ">
                {/* Left Sidebar - Filters */}
                <div className="w-full lg:w-80 bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Find a match</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600 mb-1 block">I'm looking for:</label>
                            <select
                                value={serviceType}
                                onChange={(e) => setServiceType(e.target.value)}
                                className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8560F1] text-sm"
                            >
                                <option value="">Select Service</option>
                                <option value="Boarding">Boarding</option>
                                <option value="House Sitting">House Sitting</option>
                                <option value="Drop-In Visits">Drop-In Visits</option>
                                <option value="Doggy Day Care">Doggy Day Care</option>
                                <option value="Dog Walking">Dog Walking</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600 mb-1 block">Location</label>
                            <div className="relative">
                                <FaSearch className="absolute top-3 left-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="City or postal code"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8560F1] text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600 mb-1 block">Province</label>
                            <select
                                value={province}
                                onChange={(e) => setProvince(e.target.value)}
                                className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8560F1] text-sm"
                            >
                                <option value="">All Provinces</option>
                                <option value="ON">Ontario</option>
                                <option value="BC">British Columbia</option>
                                <option value="AB">Alberta</option>
                                <option value="QC">Quebec</option>
                            </select>
                        </div>
                        <button
                            onClick={() => setViewMode(viewMode === 'split' ? 'list' : 'split')}
                            className="w-full bg-[#8560F1] text-white px-4 py-2 rounded-md font-medium hover:bg-green-600 transition-all duration-300 text-sm"
                        >
                            {viewMode === 'split' ? <FaList className="inline mr-2" /> : <FaMap className="inline mr-2" />}
                            {viewMode === 'split' ? 'List View' : 'Map View'}
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">


                    {viewMode === 'split' ? (
                        <div className="flex  h-[calc(100vh)]">
                            <div className="w-1/2 overflow-y-auto custom-scrollbar-hidden">
                                {taskers.length ? (
                                    <div className="">
                                        {taskers.map((tasker) => (
                                            <FancyCard
                                                key={tasker._id}
                                                tasker={tasker}
                                                isSelected={selectedTasker === tasker._id}
                                                onClick={() => setSelectedTasker(tasker._id)}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-600 text-base py-8">
                                        No service providers found for the selected filters.
                                    </div>
                                )}
                            </div>
                            <div className="w-1/2 bg-white rounded-lg shadow-sm overflow-hidden">
                                {taskers.length ? (
                                    <TaskerMap
                                        taskers={taskers}
                                        selectedTasker={selectedTasker}
                                        onTaskerSelect={setSelectedTasker}
                                    />
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-600">
                                        No service provider locations available to display.
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {taskers.length ? (
                                taskers.map((tasker) => (
                                    <FancyCard
                                        key={tasker._id}
                                        tasker={tasker}
                                        isSelected={false}
                                        onClick={() => { }}
                                    />
                                ))
                            ) : (
                                <div className="text-center text-gray-600 text-base py-8 col-span-full">
                                    No service providers found for the selected filters.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>


        </div>
    );
};

export default TaskerSlider;