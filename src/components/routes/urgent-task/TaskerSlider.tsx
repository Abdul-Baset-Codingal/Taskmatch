/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";
import { useGetTaskersQuery } from "@/features/auth/authApi";
import React, { useState } from "react";
import { FaSearch, FaUser, FaMap, FaList, FaStar, FaEnvelope, FaShieldAlt } from "react-icons/fa";
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

// Map normalized values to database values
const categoryMap: { [key: string]: string } = {
    Handyman_Renovation_Moving_Help: "Handyman, Renovation & Moving Help",
    Pet_Services: "Pet Services",
    Complete_Cleaning: "Complete Cleaning",
    Plumbing_Electrical_HVAC_PEH: "Plumbing, Electrical & HVAC (PEH)",
    Beauty_Wellness: "Beauty & Wellness",
};

const TaskerSlider: React.FC<DetailsBannerProps> = ({ service }) => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [province, setProvince] = useState("");
    const [serviceType, setServiceType] = useState(service?.category || "");
    const [viewMode, setViewMode] = useState<"split" | "list">("split");
    const [selectedTasker, setSelectedTasker] = useState<string | null>(null);

    // Transform normalized serviceType to database-compatible value
    const apiCategory = categoryMap[serviceType] || serviceType;

    const { data, isLoading, error } = useGetTaskersQuery({
        category: apiCategory,
        page,
        limit: 20,
        search,
        province,
    });

    console.log("Query parameters:", { category: apiCategory, page, limit: 20, search, province });
    console.log("API response:", data);

    const taskers: Tasker[] = (data?.taskers || []).map((tasker: any) => {
        const serviceAreas = tasker.serviceAreas?.filter((area: string) => area && typeof area === "string") || [];
        console.log(`Tasker ${tasker.firstName} serviceAreas:`, serviceAreas);
        return {
            _id: tasker._id || "unknown",
            firstName: tasker.firstName || "Unknown",
            lastName: tasker.lastName || "Tasker",
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
    }).filter((tasker) => {
        const hasServiceAreas = tasker.serviceAreas.length > 0;
        if (!hasServiceAreas) {
            console.warn(`Tasker ${tasker.firstName} filtered out due to empty serviceAreas`);
        }
        return hasServiceAreas;
    });

    const totalTaskers = data?.pagination?.totalTaskers || 0;

    console.log("Processed taskers:", taskers);

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
        <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="">
                {/* Responsive Container for Sidebar and Main Content */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Sidebar - Filters */}
                    <div className="w-full lg:w-80 bg-white rounded-lg shadow-sm p-4 sm:p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Find a match</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">I&apos;m looking for:</label>
                                <select
                                    value={serviceType}
                                    onChange={(e) => {
                                        console.log("Selected serviceType:", e.target.value);
                                        setServiceType(e.target.value);
                                    }}
                                    className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8560F1] text-sm"
                                >
                                    <option value="">Select Service</option>
                                    <option value="Handyman_Renovation_Moving_Help">Handyman, Renovation & Moving Help</option>
                                    <option value="Pet_Services">Pet Services</option>
                                    <option value="Complete_Cleaning">Complete Cleaning</option>
                                    <option value="Plumbing_Electrical_HVAC_PEH">Plumbing, Electrical & HVAC (PEH)</option>
                                    <option value="Beauty_Wellness">Beauty & Wellness</option>
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
                                onClick={() => setViewMode(viewMode === "split" ? "list" : "split")}
                                className="w-full bg-[#8560F1] text-white px-4 py-2 rounded-md font-medium hover:bg-green-600 transition-all duration-300 text-sm flex items-center justify-center"
                            >
                                {viewMode === "split" ? <FaList className="mr-2" /> : <FaMap className="mr-2" />}
                                {viewMode === "split" ? "List View" : "Map View"}
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {viewMode === "split" ? (
                            <div className="flex flex-col lg:flex-row h-[calc(100vh-6rem)]">
                                {/* Tasker List */}
                                <div className="w-full lg:w-1/2 overflow-y-auto max-h-[calc(100vh-6rem)] custom-scrollbar-hidden">
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
                                {/* Map View - Hidden on smaller screens */}
                                <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-sm overflow-hidden hidden lg:block">
                                    {taskers.length ? (
                                        <TaskerMap
                                            taskers={taskers}
                                            selectedTasker={selectedTasker}
                                            onTaskerSelect={setSelectedTasker}
                                        />
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-gray-600 text-sm sm:text-base">
                                            No service provider locations available to display.
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
                    </div>
                </div>
            </div>

            {/* Custom CSS for Scrollbar and Additional Responsiveness */}
            <style jsx>{`
        .custom-scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar-hidden {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        @media (max-width: 640px) {
          .custom-scrollbar-hidden {
            max-height: calc(100vh - 12rem);
          }
        }
      `}</style>
        </div>
    );
};

export default TaskerSlider;