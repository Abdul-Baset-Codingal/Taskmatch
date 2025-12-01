/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";
import { useGetTaskersQuery } from "@/features/auth/authApi";
import React, { useState } from "react";
import {
    FaSearch,
    FaFilter,
    FaSortAmountDown,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaStar,
    FaBriefcase,
    FaDollarSign,
    FaTimes,
    FaChevronLeft,
    FaChevronRight,
    FaListUl,
    FaTh,
    FaUserTie,
    FaExclamationCircle,
    FaSlidersH,
    FaCheckCircle,
} from "react-icons/fa";
import BookServiceModal from "./BookServiceModal";
import RequestQuoteModal from "./RequestQuoteModal";
import TaskerProfileModal from "./TaskerProfileModal";
import Image from "next/image";
import TaskerMap from "./TaskerMap";
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
    { label: "Newest First", value: "createdAt-desc", icon: FaCalendarAlt },
    { label: "Highest Rated", value: "rating-desc", icon: FaStar },
    { label: "Price: Low to High", value: "hourlyRate-asc", icon: FaDollarSign },
    { label: "Price: High to Low", value: "hourlyRate-desc", icon: FaDollarSign },
    { label: "Most Experienced", value: "yearsOfExperience-desc", icon: FaBriefcase },
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
    const [showMobileFilters, setShowMobileFilters] = useState(false);

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

    const taskers: Tasker[] = (data?.taskers || []).map((tasker: any) => {
        const serviceAreas = tasker.serviceAreas?.filter((area: string) => area && typeof area === "string") || [];

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
    }).filter((tasker) => true);

    const totalTaskers = data?.pagination?.totalTaskers || 0;
    const totalPages = data?.pagination?.totalPages || 1;

    const activeFiltersCount = [
        serviceType,
        search,
        availability !== "All" ? availability : "",
        rating !== "All Ratings" ? rating : "",
        experience !== "All Levels" ? experience : "",
        minPrice,
        maxPrice,
    ].filter(Boolean).length;

    const clearAllFilters = () => {
        setServiceType("");
        setSearch("");
        setProvince("");
        setAvailability("All");
        setRating("All Ratings");
        setExperience("All Levels");
        setMinPrice("");
        setMaxPrice("");
    };

    // Filter Sidebar Component
    const FilterSidebar = ({ isMobile = false }: { isMobile?: boolean }) => (
        <div className={`${isMobile ? 'p-6' : 'p-6'} space-y-6`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#063A41] flex items-center gap-2">
                    <FaSlidersH className="text-[#109C3D]" />
                    Filters
                </h2>
                {activeFiltersCount > 0 && (
                    <button
                        onClick={clearAllFilters}
                        className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
                    >
                        <FaTimes className="text-xs" />
                        Clear All
                    </button>
                )}
            </div>

            {/* Active Filters Count */}
            {activeFiltersCount > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 bg-[#E5FFDB] rounded-lg">
                    <FaCheckCircle className="text-[#109C3D] text-sm" />
                    <span className="text-sm text-[#063A41] font-medium">
                        {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} applied
                    </span>
                </div>
            )}

            {/* Service Type */}
            <div>
                <label className="block text-sm font-semibold text-[#063A41] mb-2">
                    Service Type
                </label>
                <div className="relative">
                    <select
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#109C3D] focus:ring-2 focus:ring-[#109C3D]/20 transition-all text-sm text-[#063A41] appearance-none bg-white cursor-pointer"
                    >
                        <option value="">All Services</option>
                        {Object.keys(categoryMap).map((key) => (
                            <option key={key} value={key}>
                                {categoryMap[key]}
                            </option>
                        ))}
                    </select>
                    <FaChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs rotate-90 pointer-events-none" />
                </div>
            </div>

        

            {/* Availability */}
            <div>
                <label className="block text-sm font-semibold text-[#063A41] mb-2">
                    Availability
                </label>
                <div className="flex flex-wrap gap-2">
                    {availabilityOptions.map((option) => (
                        <button
                            key={option}
                            onClick={() => setAvailability(option)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${availability === option
                                    ? 'bg-[#109C3D] text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-[#E5FFDB] hover:text-[#063A41]'
                                }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            {/* Rating */}
            <div>
                <label className="block text-sm font-semibold text-[#063A41] mb-2">
                    Minimum Rating
                </label>
                <div className="flex gap-2">
                    {ratingOptions.map((option) => (
                        <button
                            key={option}
                            onClick={() => setRating(option)}
                            className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${rating === option
                                    ? 'bg-[#109C3D] text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-[#E5FFDB] hover:text-[#063A41]'
                                }`}
                        >
                            {option !== "All Ratings" && <FaStar className="text-yellow-400 text-[10px]" />}
                            {option === "All Ratings" ? "All" : `${option}+`}
                        </button>
                    ))}
                </div>
            </div>

            {/* Experience */}
            <div>
                <label className="block text-sm font-semibold text-[#063A41] mb-2">
                    Minimum Experience
                </label>
                <div className="relative">
                    <FaBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="w-full pl-11 pr-10 py-3 rounded-xl border-2 border-gray-200 focus:border-[#109C3D] focus:ring-2 focus:ring-[#109C3D]/20 transition-all text-sm text-[#063A41] appearance-none bg-white cursor-pointer"
                    >
                        {experienceOptions.map((option) => (
                            <option key={option} value={option}>
                                {option === "All Levels" ? "Any Experience" : `${option}+ years`}
                            </option>
                        ))}
                    </select>
                    <FaChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs rotate-90 pointer-events-none" />
                </div>
            </div>

            {/* Price Range */}
            <div>
                <label className="block text-sm font-semibold text-[#063A41] mb-2">
                    Price Range ($/hr)
                </label>
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-full pl-8 pr-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#109C3D] focus:ring-2 focus:ring-[#109C3D]/20 transition-all text-sm text-[#063A41]"
                        />
                    </div>
                    <span className="text-gray-400">—</span>
                    <div className="relative flex-1">
                        <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-full pl-8 pr-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#109C3D] focus:ring-2 focus:ring-[#109C3D]/20 transition-all text-sm text-[#063A41]"
                        />
                    </div>
                </div>
            </div>

            {/* Apply Button - Mobile Only */}
            {isMobile && (
                <button
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full py-3 bg-[#109C3D] text-white font-semibold rounded-xl hover:bg-[#0d8a35] transition-colors"
                >
                    Apply Filters
                </button>
            )}
        </div>
    );

    // Loading State
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#E5FFDB] border-t-[#109C3D] rounded-full animate-spin mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-[#063A41] mb-2">Finding Taskers</h2>
                    <p className="text-gray-500">Loading service providers near you...</p>
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center bg-white rounded-2xl p-8 max-w-md w-full border border-red-100 shadow-sm">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaExclamationCircle className="text-red-500 text-2xl" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Something Went Wrong</h2>
                    <p className="text-gray-500 mb-6">Error loading service providers. Please try again.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2.5 bg-[#109C3D] text-white font-semibold rounded-xl hover:bg-[#0d8a35] transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-[#063A41] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    <div className="text-center">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
                            Find Your Perfect Tasker
                        </h1>
                        <p className="text-white/70 text-sm sm:text-base max-w-2xl mx-auto">
                            Browse verified professionals ready to help with your tasks
                        </p>
                    </div>

                    {/* Quick Search Bar */}
                    <div className="mt-6 max-w-2xl mx-auto">
                        <div className="relative">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, service, or location..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-[#063A41] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#109C3D] shadow-lg text-sm sm:text-base"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch("")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <FaTimes />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Desktop Sidebar */}
                    <div className="hidden lg:block lg:w-80 flex-shrink-0">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm sticky top-6">
                            <FilterSidebar />
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 min-w-0">
                        {/* Toolbar */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                {/* Results Count */}
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#E5FFDB] rounded-lg flex items-center justify-center">
                                        <FaUserTie className="text-[#109C3D]" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[#063A41]">
                                            {taskers.length} Tasker{taskers.length !== 1 ? "s" : ""} Found
                                        </p>
                                        {taskers.length < totalTaskers && totalTaskers > 0 && (
                                            <p className="text-xs text-gray-500">
                                                Filtered from {totalTaskers} total
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    {/* Mobile Filter Button */}
                                    <button
                                        onClick={() => setShowMobileFilters(true)}
                                        className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 text-[#063A41] rounded-lg font-medium text-sm hover:bg-[#E5FFDB] transition-colors"
                                    >
                                        <FaFilter className="text-[#109C3D]" />
                                        Filters
                                        {activeFiltersCount > 0 && (
                                            <span className="w-5 h-5 bg-[#109C3D] text-white text-xs rounded-full flex items-center justify-center">
                                                {activeFiltersCount}
                                            </span>
                                        )}
                                    </button>

                                    {/* Sort Dropdown */}
                                    {/* <div className="relative flex-1 sm:flex-none">
                                        <FaSortAmountDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                        <select
                                            value={sort}
                                            onChange={(e) => setSort(e.target.value)}
                                            className="w-full sm:w-48 pl-10 pr-10 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-[#063A41] focus:outline-none focus:ring-2 focus:ring-[#109C3D]/20 focus:border-[#109C3D] appearance-none cursor-pointer"
                                        >
                                            {sortOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <FaChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs rotate-90 pointer-events-none" />
                                    </div> */}

                                    {/* View Mode Toggle */}
                                    {/* <div className="hidden sm:flex items-center bg-gray-100 rounded-lg p-1">
                                        <button
                                            onClick={() => setViewMode("split")}
                                            className={`p-2 rounded-md transition-colors ${viewMode === "split"
                                                    ? 'bg-white text-[#109C3D] shadow-sm'
                                                    : 'text-gray-400 hover:text-gray-600'
                                                }`}
                                        >
                                            <FaListUl />
                                        </button>
                                        <button
                                            onClick={() => setViewMode("list")}
                                            className={`p-2 rounded-md transition-colors ${viewMode === "list"
                                                    ? 'bg-white text-[#109C3D] shadow-sm'
                                                    : 'text-gray-400 hover:text-gray-600'
                                                }`}
                                        >
                                            <FaTh />
                                        </button>
                                    </div> */}
                                </div>
                            </div>

                            {/* Active Filters Tags */}
                            {/* {activeFiltersCount > 0 && (
                                <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                                    <span className="text-xs text-gray-500">Active:</span>
                                    {serviceType && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E5FFDB] text-[#063A41] rounded-full text-xs font-medium">
                                            {categoryMap[serviceType]}
                                            <button onClick={() => setServiceType("")} className="hover:text-red-500">
                                                <FaTimes className="text-[10px]" />
                                            </button>
                                        </span>
                                    )}
                                    {search && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E5FFDB] text-[#063A41] rounded-full text-xs font-medium">
                                            "{search}"
                                            <button onClick={() => setSearch("")} className="hover:text-red-500">
                                                <FaTimes className="text-[10px]" />
                                            </button>
                                        </span>
                                    )}
                                    {availability !== "All" && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E5FFDB] text-[#063A41] rounded-full text-xs font-medium">
                                            {availability}
                                            <button onClick={() => setAvailability("All")} className="hover:text-red-500">
                                                <FaTimes className="text-[10px]" />
                                            </button>
                                        </span>
                                    )}
                                    {rating !== "All Ratings" && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E5FFDB] text-[#063A41] rounded-full text-xs font-medium">
                                            {rating}+ Stars
                                            <button onClick={() => setRating("All Ratings")} className="hover:text-red-500">
                                                <FaTimes className="text-[10px]" />
                                            </button>
                                        </span>
                                    )}
                                    {experience !== "All Levels" && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E5FFDB] text-[#063A41] rounded-full text-xs font-medium">
                                            {experience}+ Years
                                            <button onClick={() => setExperience("All Levels")} className="hover:text-red-500">
                                                <FaTimes className="text-[10px]" />
                                            </button>
                                        </span>
                                    )}
                                    {(minPrice || maxPrice) && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E5FFDB] text-[#063A41] rounded-full text-xs font-medium">
                                            ${minPrice || '0'} - ${maxPrice || '∞'}
                                            <button onClick={() => { setMinPrice(""); setMaxPrice(""); }} className="hover:text-red-500">
                                                <FaTimes className="text-[10px]" />
                                            </button>
                                        </span>
                                    )}
                                </div>
                            )} */}
                        </div>

                        {/* Tasker Cards */}
                        {taskers.length > 0 ? (
                            <>
                                <div className={
                                    viewMode === "split"
                                        ? "space-y-4"
                                        : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                                }>
                                    {taskers.map((tasker) => (
                                        <FancyCard
                                            key={tasker._id}
                                            tasker={tasker}
                                            isSelected={selectedTasker === tasker._id}
                                            onClick={() => setSelectedTasker(tasker._id)}
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-8 flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                            disabled={page === 1}
                                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#063A41] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E5FFDB] hover:border-[#109C3D] transition-colors"
                                        >
                                            <FaChevronLeft className="text-xs" />
                                            Previous
                                        </button>

                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                let pageNum;
                                                if (totalPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (page <= 3) {
                                                    pageNum = i + 1;
                                                } else if (page >= totalPages - 2) {
                                                    pageNum = totalPages - 4 + i;
                                                } else {
                                                    pageNum = page - 2 + i;
                                                }
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => setPage(pageNum)}
                                                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${page === pageNum
                                                                ? 'bg-[#109C3D] text-white'
                                                                : 'bg-white border border-gray-200 text-[#063A41] hover:bg-[#E5FFDB]'
                                                            }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <button
                                            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                            disabled={page === totalPages}
                                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#063A41] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E5FFDB] hover:border-[#109C3D] transition-colors"
                                        >
                                            Next
                                            <FaChevronRight className="text-xs" />
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                                <div className="w-20 h-20 bg-[#E5FFDB] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaUserTie className="text-[#109C3D] text-3xl" />
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-2">No Taskers Found</h3>
                                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                                    We couldn't find any taskers matching your criteria. Try adjusting your filters.
                                </p>
                                <button
                                    onClick={clearAllFilters}
                                    className="px-6 py-2.5 bg-[#109C3D] text-white font-semibold rounded-xl hover:bg-[#0d8a35] transition-colors"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Modal */}
            {showMobileFilters && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div
                        className="absolute inset-0 bg-[#063A41]/60 backdrop-blur-sm"
                        onClick={() => setShowMobileFilters(false)}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto animate-slideUp">
                        {/* Handle */}
                        <div className="sticky top-0 bg-white pt-3 pb-2 px-4 border-b border-gray-100">
                            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-3" />
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-[#063A41]">Filters</h3>
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        </div>
                        <FilterSidebar isMobile />
                    </div>
                </div>
            )}

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default TaskerSlider;