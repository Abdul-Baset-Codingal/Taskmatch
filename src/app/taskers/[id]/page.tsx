/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect, ReactNode } from "react";
import { useParams } from "next/navigation";
import { FaUser, FaStar, FaTools, FaCertificate, FaGraduationCap, FaShieldAlt, FaEnvelope, FaPhone } from "react-icons/fa";
import Image from "next/image";
import Navbar from "@/shared/Navbar";
import TaskerProfile from "@/components/taskerDetails/TaskerProfile";

// Updated Tasker interface
interface Tasker {
    _id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    about:string;
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
    reviews?: {
        message: ReactNode;
        rating: number;
        comment: string;
        reviewer: string; // Changed from clientName/clientEmail/clientImage to reviewer ID
        createdAt: string;
        _id: string;
    }[];
}

// Interface for reviewer data
interface Reviewer {
    _id: string;
    firstName: string;
    lastName: string;
    fullName: string;
}

// Fetch tasker data from your backend API
async function fetchTasker(id: string): Promise<Tasker | null> {
    try {
        const response = await fetch(`http://localhost:5000/api/auth/users/single/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                // Add authentication headers if required
            },
        });
        if (!response.ok) {
            console.error("Failed to fetch tasker:", response.statusText);
            return null;
        }
        const data = await response.json();
        return {
            _id: data._id,
            firstName: data.firstName,
            lastName: data.lastName,
            fullName: `${data.firstName} ${data.lastName}`,
            email: data.email,
            about:data.about,
            phone: data.phone,
            profilePicture: data.profilePicture || null,
            city: data.city,
            province: data.province,
            service: data.service,
            description: data.description,
            skills: data.skills || [],
            rate: data.rate,
            availability: data.availability || [],
            experience: data.experience,
            hasInsurance: data.hasInsurance,
            backgroundCheckConsent: data.backgroundCheckConsent,
            categories: data.categories || [],
            certifications: data.certifications || [],
            qualifications: data.qualifications || [],
            serviceAreas: data.serviceAreas || [],
            services: data.services || [],
            distance: data.distance,
            rating: data.rating,
            reviews: data.reviews || [],
        };
    } catch (error) {
        console.error("Error fetching tasker:", error);
        return null;
    }
}

// Fetch reviewer data by ID
async function fetchReviewer(reviewerId: string): Promise<Reviewer | null> {
    try {
        const response = await fetch(`http://localhost:5000/api/auth/users/single/${reviewerId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                // Add authentication headers if required
            },
        });
        if (!response.ok) {
            console.error("Failed to fetch reviewer:", response.statusText);
            return null;
        }
        const data = await response.json();
        return {
            _id: data._id,
            firstName: data.firstName,
            lastName: data.lastName,
            fullName: `${data.firstName} ${data.lastName}`,
        };
    } catch (error) {
        console.error("Error fetching reviewer:", error);
        return null;
    }
}

const TaskerProfilePage: React.FC = () => {
    const params = useParams();
    const id = params ? params["id"] : undefined;
    const [tasker, setTasker] = useState<Tasker | null>(null);
    const [loading, setLoading] = useState(true);
    const [reviewers, setReviewers] = useState<{ [key: string]: Reviewer }>({});

    useEffect(() => {
        if (id && typeof id === "string") {
            fetchTasker(id).then(async (data) => {
                if (data && data.reviews && data.reviews.length > 0) {
                    // Fetch reviewer details for each review
                    const reviewerPromises = data.reviews.map((review) =>
                        fetchReviewer(review.reviewer).then((reviewer) => ({
                            reviewerId: review.reviewer,
                            reviewer,
                        }))
                    );
                    const reviewerResults = await Promise.all(reviewerPromises);
                    const reviewerMap = reviewerResults.reduce((acc, { reviewerId, reviewer }) => {
                        if (reviewer) acc[reviewerId] = reviewer;
                        return acc;
                    }, {} as { [key: string]: Reviewer });
                    setReviewers(reviewerMap);
                }
                setTasker(data);
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-teal-800 text-lg">Loading...</p>
            </div>
        );
    }

    if (!tasker) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-teal-800 text-lg">Tasker not found</p>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <TaskerProfile tasker={tasker} />
        </div>
    );
};

export default TaskerProfilePage;