"use client";
import React from "react";
import { useParams } from "next/navigation";
import Navbar from "@/shared/Navbar";
import TaskerProfile from "@/components/taskerDetails/TaskerProfile";
import { useGetUserByIdQuery } from "@/features/auth/authApi";

// Updated Tasker interface
interface Tasker {
    _id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    about: string;
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
        message: React.ReactNode;
        rating: number;
        comment: string;
        reviewer: string; // reviewer ID
        createdAt: string;
        _id: string;
    }[];
}

const TaskerProfilePage: React.FC = () => {
    const params = useParams();
    const id = params?.id as string | undefined;
    const { data: taskerData, isLoading } = useGetUserByIdQuery(id, { skip: !id });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-primary-dark text-lg">Loading...</p>
            </div>
        );
    }

    if (!taskerData?.user || !id) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-primary-dark text-lg">Tasker not found</p>
            </div>
        );
    }

    const rawTasker = taskerData.user;

    // Prepare tasker with fullName and default values
    const tasker: Tasker = {
        _id: rawTasker._id || id,
        firstName: rawTasker.firstName || '',
        lastName: rawTasker.lastName || '',
        fullName: `${rawTasker.firstName || ''} ${rawTasker.lastName || ''}`.trim() || 'Unknown Tasker',
        about: rawTasker.about || '',
        email: rawTasker.email || '',
        phone: rawTasker.phone || '',
        profilePicture: rawTasker.profilePicture || null,
        city: '', // Can derive from postalCode if needed: rawTasker.postalCode ? rawTasker.postalCode.split(' ')[0] : ''
        province: '', // Not available in data
        service: rawTasker.service || rawTasker.currentRole || 'General Services',
        description: rawTasker.description || rawTasker.about || '',
        skills: rawTasker.skills || [],
        rate: rawTasker.rate || 0,
        availability: rawTasker.availability || [],
        experience: rawTasker.yearsOfExperience || rawTasker.experience || '',
        hasInsurance: rawTasker.hasInsurance || false,
        backgroundCheckConsent: rawTasker.backgroundCheckConsent || false,
        categories: rawTasker.categories || [],
        certifications: rawTasker.certifications || [],
        qualifications: rawTasker.qualifications || [],
        serviceAreas: rawTasker.serviceAreas || [],
        services: rawTasker.services || [],
        distance: rawTasker.distance,
        rating: rawTasker.rating,
        reviews: rawTasker.reviews || [],
    };

    // Note: Reviewer fetching skipped as reviews are empty and to avoid hook issues.
    // If reviews are populated in future, implement with separate queries or lazy.

    return (
        <div>
            <Navbar />
            <TaskerProfile tasker={tasker} />
        </div>
    );
};

export default TaskerProfilePage;