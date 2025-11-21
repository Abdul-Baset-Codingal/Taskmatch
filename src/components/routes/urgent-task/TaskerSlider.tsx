/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";
import { useGetTaskersQuery } from "@/features/auth/authApi";
import React, { useState } from "react";
import { FaSearch, FaSort } from "react-icons/fa";
import BookServiceModal from "./BookServiceModal";
import RequestQuoteModal from "./RequestQuoteModal";
import TaskerProfileModal from "./TaskerProfileModal";
import Image from "next/image";
import TaskerMap from "./TaskerMap";
import client from "../../../../public/Images/clientImage1.jpg";
import FancyCard from "./FancyCard";

interface Tasker {
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

const categoryMap: { [key: string]: string } = {
    Handyman_Renovation_Moving_Help: "Handyman & Home Repairs",
    Pet_Services: "Pet Services",
    Complete_Cleaning: "Cleaning Services",
    Plumbing_Electrical_HVAC_PEH: "Plumbing, Electrical & HVAC (PEH)",
    Beauty_Wellness: "Automotive Services",
    All_Other_Specialized_Services: "All Other Specialized Services"
};

const availabilityOptions = ["All", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const ratingOptions = ["All Ratings", "4", "3", "2", "1"];
const experienceOptions = ["All Levels", "1", "3", "5", "10"];
const sortOptions = [
    { label: "Newest First", value: "createdAt-desc" },
    { label: "Highest Rated", value: "rating-desc" },
    { label: "Price: Low to High", value: "hourlyRate-asc" },
    { label: "Price: High to Low", value: "hourlyRate-desc" },
    { label: "Experience: High to Low", value: "yearsOfExperience-desc" },
];

const TaskerSlider: React.FC<DetailsBannerProps> = ({ service }) => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [province, setProvince] = useState("");
    const [serviceType, setServiceType] = useState(service?.category || "");
    const [availability, setAvailability] = useState("All");
    const [rating, setRating] = useState("All Ratings");
    const [experience, setExperience] = useState("All Levels");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sort, setSort] = useState("createdAt-desc");
    const [viewMode, setViewMode] = useState<"split" | "list">("split");
    const [selectedTasker, setSelectedTasker] = useState<string | null>(null);

    const apiCategory = categoryMap[serviceType] || serviceType;

    const queryParams = {
        category: apiCategory,
        page,
        limit: 20,
        search,
        province,
        availability,
        rating: rating === "All Ratings" ? "" : rating,
        experience: experience === "All Levels" ? "" : experience,
        minPrice,
        maxPrice,
        sort,
    };

    const { data, isLoading, error } = useGetTaskersQuery(queryParams);

    console.log("Query parameters:", queryParams);
    console.log("API response:", data);

    const taskers: Tasker[] = (data?.taskers || []).map((tasker: any) => {
        const serviceAreas = tasker.serviceAreas?.filter((area: string) => area && typeof area === "string") || [];

        // TEMP DEBUG LOGS (remove in production):
        console.log("Raw tasker.serviceAreas from API:", tasker.serviceAreas);
        console.log("Filtered serviceAreas:", serviceAreas);
        console.log("Full mapped tasker:", { ...tasker, serviceAreas }); // Redact sensitive fields if needed

        return {
            _id: tasker._id || "unknown",
            firstName: tasker.firstName || "Unknown",
            lastName: tasker.lastName || "Tasker",
            email: tasker.email || "N/A",
            phone: tasker.phone || "N/A",
            profilePicture: tasker.profilePicture || "https://via.placeholder.com/150",
            city: tasker.address?.city || "Unknown",
            province: tasker.address?.province || "Unknown",
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
            reviews: tasker.reviews || { rating: tasker.rating || 0, count: tasker.reviews?.length || 0, comment: "Great service!" },
        };
    }).filter((tasker) => {
        // Updated: Allow taskers with empty serviceAreas (e.g., they serve all areas)
        const hasServiceAreas = tasker.serviceAreas.length > 0;
        if (!hasServiceAreas) {
            console.warn(`Tasker ${tasker.firstName} has no specific service areas (showing anyway - assumes serves all areas)`);
        }
        return true; // Always include; add other filters here if needed
    });

    const totalTaskers = data?.pagination?.totalTaskers || 0;
    const totalPages = data?.pagination?.totalPages || 1;

    console.log(taskers)

    if (isLoading) {
        return (
            <div className="bg-white py-8 px-4 text-center min-h-screen flex items-center justify-center">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Find the Perfect Match</h1>
                    <p className="text-gray-600 text-sm sm:text-base">Loading service providers...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white py-8 px-4 text-center min-h-screen flex items-center justify-center">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Find the Perfect Match</h1>
                    <p className="text-red-600 text-sm sm:text-base">Error loading service providers: {error.toString()}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center ">
            <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 font-sans">
                <div className="flex flex-col lg:flex-row lg:gap-2 gap-6 lg:w-6xl ">
                    {/* Left Sidebar - Filters */}
                    <div className="w-full lg:w-[30%] bg-white rounded-lg shadow-sm p-4 sm:p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Find a match</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">Service Type</label>
                                <select
                                    value={serviceType}
                                    onChange={(e) => setServiceType(e.target.value)}
                                    className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8560F1] text-sm"
                                >
                                    <option value="">Select Service</option>
                                    {Object.keys(categoryMap).map((key) => (
                                        <option key={key} value={key}>
                                            {categoryMap[key]}
                                        </option>
                                    ))}
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
                                <label className="text-sm font-medium text-gray-600 mb-1 block">Availability</label>
                                <select
                                    value={availability}
                                    onChange={(e) => setAvailability(e.target.value)}
                                    className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8560F1] text-sm"
                                >
                                    {availabilityOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">Minimum Rating</label>
                                <select
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                    className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8560F1] text-sm"
                                >
                                    {ratingOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">Minimum Experience (Years)</label>
                                <select
                                    value={experience}
                                    onChange={(e) => setExperience(e.target.value)}
                                    className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8560F1] text-sm"
                                >
                                    {experienceOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">Price Range ($/hr)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="w-1/2 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8560F1] text-sm"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="w-1/2 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8560F1] text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 w-full lg:w-[60%]">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800 ml-5">
                                {taskers.length} Tasker{taskers.length !== 1 ? "s" : ""} Found
                                {taskers.length < totalTaskers && totalTaskers > 0 && (
                                    <span className="text-sm text-gray-500 ml-2">(filtered from {totalTaskers} total)</span>
                                )}
                            </h2>
                            <div className="flex items-center gap-2">
                                <select
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                    className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8560F1] text-sm"
                                >
                                    {sortOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>

                            </div>
                        </div>
                        {viewMode === "split" ? (
                            <div className="flex flex-col lg:flex-row h-[calc(100vh-6rem)]">
                                <div className="w-full overflow-y-auto max-h-[calc(100vh-6rem)] custom-scrollbar-hidden">
                                    {taskers.length ? (
                                        <div className="space-y-4 p-4">
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
                                        <div className="text-center text-gray-600 text-sm sm:text-base py-8">
                                            No service providers found for the selected filters.
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
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
                                    <div className="text-center text-gray-600 text-sm sm:text-base py-8 col-span-full">
                                        No service providers found for the selected filters.
                                    </div>
                                )}
                            </div>
                        )}
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-4">
                                <button
                                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={page === totalPages}
                                    className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <style jsx>{`
          .custom-scrollbar-hidden::-webkit-scrollbar {
            display: none;
          }
          .custom-scrollbar-hidden {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          @media (max-width: 640px) {
            .custom-scrollbar-hidden {
              max-height: calc(100vh - 12rem);
            }
          }
        `}</style>
            </div>
        </div>
    );
};

export default TaskerSlider;