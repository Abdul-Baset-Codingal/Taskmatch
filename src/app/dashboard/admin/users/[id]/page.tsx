/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { FaSpinner, FaUser, FaFileAlt, FaTools, FaConciergeBell, FaCalendarAlt, FaAward, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useGetUserByIdQuery } from '@/features/auth/authApi';

// Define the User interface based on the provided data structure
interface Availability {
    day: string;
    from: string;
    to: string;
    _id: string;
}

interface Service {
    title: string;
    description: string;
    hourlyRate: number;
    estimatedDuration: string;
    _id: string;
}

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    postalCode: string;
    role: string;
    profilePicture: string;
    governmentId: string;
    idType: string;
    govIDBack: string;
    hasInsurance: boolean;
    backgroundCheckConsent: boolean;
    yearsOfExperience: string;
    rating: number;
    reviewCount: number;
    createdAt: string;
    updatedAt: string;
    availability: Availability[];
    categories: string[];
    certifications: string[];
    qualifications: string[];
    reviews: string[];
    serviceAreas: string[];
    services: Service[];
    skills: string[];
    isBlocked: boolean;
}

const UserDetailsPage = () => {
    const router = useRouter();
    const params = useParams();
    const { data: user, isLoading, isError, error } = useGetUserByIdQuery(params.id as string);
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
        personal: true,
        documents: false,
        professional: false,
        services: false,
        availability: false,
        certifications: false,
    });

    const toggleSection = (section: string) => {
        setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-white">
                <FaSpinner className="animate-spin text-4xl text-gray-600" />
            </div>
        );
    }

    if (isError || !user) {
        return (
            <div className="flex justify-center items-center h-screen bg-white">
                <div className="text-center bg-gray-50 p-6 rounded-lg shadow-sm">
                    <p className="text-gray-700 text-xl font-medium mb-4">{error ? 'Error fetching user details' : 'User not found'}</p>
                    <button
                        onClick={() => router.back()}
                        className="px-5 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-200"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header Section */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <Image
                            src={user.profilePicture}
                            alt={`${user.firstName} ${user.lastName}`}
                            width={80}
                            height={80}
                            className="rounded-full border-2 border-gray-200 object-cover"
                            onError={(e) => (e.currentTarget.src = '/placeholder-profile.png')}
                        />
                        <div className="text-center sm:text-left">
                            <h1 className="text-2xl font-semibold text-gray-800">{user.firstName} {user.lastName}</h1>
                            <p className="text-gray-600 capitalize">{user.role}</p>
                            <div className="mt-2 flex flex-col sm:flex-row gap-2 text-sm">
                                <span
                                    className={`px-3 py-1 rounded-full font-medium ${user.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                        }`}
                                >
                                    {user.isBlocked ? 'Blocked' : 'Active'}
                                </span>
                                <span className="px-3 py-1 bg-gray-100 rounded-full font-medium">
                                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-4">
                    {/* Personal Information */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => toggleSection('personal')}
                            className="w-full flex justify-between items-center p-4 bg-gray-50 text-gray-800 font-medium hover:bg-gray-100 transition duration-200"
                        >
                            <span className="flex items-center"><FaUser className="mr-2 text-gray-600" /> Personal Information</span>
                            {openSections.personal ? <FaChevronUp className="text-gray-600" /> : <FaChevronDown className="text-gray-600" />}
                        </button>
                        {openSections.personal && (
                            <div className="p-4 bg-white text-gray-700 space-y-2">
                                <div className="flex items-center">
                                    <span className="w-28 font-medium">Email:</span>
                                    <span>{user.email}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="w-28 font-medium">Phone:</span>
                                    <span>{user.phone}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="w-28 font-medium">Postal Code:</span>
                                    <span>{user.postalCode}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="w-28 font-medium">Last Updated:</span>
                                    <span>{new Date(user.updatedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Documents */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => toggleSection('documents')}
                            className="w-full flex justify-between items-center p-4 bg-gray-50 text-gray-800 font-medium hover:bg-gray-100 transition duration-200"
                        >
                            <span className="flex items-center"><FaFileAlt className="mr-2 text-gray-600" /> Documents</span>
                            {openSections.documents ? <FaChevronUp className="text-gray-600" /> : <FaChevronDown className="text-gray-600" />}
                        </button>
                        {openSections.documents && (
                            <div className="p-4 bg-white text-gray-700 space-y-4">
                                <div>
                                    <p className="font-medium mb-2">Government ID ({user.idType}):</p>
                                    <Image
                                        src={user.governmentId}
                                        alt="Government ID"
                                        width={240}
                                        height={160}
                                        className="w-full max-w-xs h-auto rounded-md border border-gray-200"
                                        onError={(e) => (e.currentTarget.src = '/placeholder-id.png')}
                                    />
                                </div>
                                <div>
                                    <p className="font-medium mb-2">Government ID Back:</p>
                                    {user.govIDBack ? (
                                        <Image
                                            src={user.govIDBack}
                                            alt="Government ID Back"
                                            width={240}
                                            height={160}
                                            className="w-full max-w-xs h-auto rounded-md border border-gray-200"
                                            onError={(e) => (e.currentTarget.src = '/placeholder-id.png')}
                                        />
                                    ) : (
                                        <p className="text-gray-500 bg-gray-50 p-2 rounded-md text-center">N/A</p>
                                    )}
                                </div>
                                <div className="flex items-center">
                                    <span className="w-28 font-medium">Insurance:</span>
                                    <span className={user.hasInsurance ? 'text-green-600' : 'text-red-600'}>
                                        {user.hasInsurance ? 'Yes' : 'No'}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <span className="w-28 font-medium">Background Check:</span>
                                    <span className={user.backgroundCheckConsent ? 'text-green-600' : 'text-red-600'}>
                                        {user.backgroundCheckConsent ? 'Yes' : 'No'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Professional Details */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => toggleSection('professional')}
                            className="w-full flex justify-between items-center p-4 bg-gray-50 text-gray-800 font-medium hover:bg-gray-100 transition duration-200"
                        >
                            <span className="flex items-center"><FaTools className="mr-2 text-gray-600" /> Professional Details</span>
                            {openSections.professional ? <FaChevronUp className="text-gray-600" /> : <FaChevronDown className="text-gray-600" />}
                        </button>
                        {openSections.professional && (
                            <div className="p-4 bg-white text-gray-700 space-y-3">
                                <div className="flex items-center">
                                    <span className="w-28 font-medium">Experience:</span>
                                    <span>{user.yearsOfExperience.replace('_', ' ')}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="w-28 font-medium">Rating:</span>
                                    <span>{user.rating} ({user.reviewCount} reviews)</span>
                                </div>
                                <div>
                                    <span className="font-medium block mb-1">Categories:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {user.categories.map((category, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
                                            >
                                                {category}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <span className="font-medium block mb-1">Skills:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {user.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <span className="font-medium block mb-1">Service Areas:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {user.serviceAreas.map((area, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
                                            >
                                                {area}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Services */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => toggleSection('services')}
                            className="w-full flex justify-between items-center p-4 bg-gray-50 text-gray-800 font-medium hover:bg-gray-100 transition duration-200"
                        >
                            <span className="flex items-center"><FaConciergeBell className="mr-2 text-gray-600" /> Services</span>
                            {openSections.services ? <FaChevronUp className="text-gray-600" /> : <FaChevronDown className="text-gray-600" />}
                        </button>
                        {openSections.services && (
                            <div className="p-4 bg-white space-y-3">
                                {user.services.length > 0 ? (
                                    user.services.map((service) => (
                                        <div
                                            key={service._id}
                                            className="p-3 bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 transition duration-200"
                                        >
                                            <h4 className="text-base font-medium text-gray-800">{service.title}</h4>
                                            <p className="text-sm text-gray-600">{service.description}</p>
                                            <div className="mt-1 flex gap-4 text-sm text-gray-700">
                                                <span>Rate: <strong>${service.hourlyRate}/hr</strong></span>
                                                <span>Duration: <strong>{service.estimatedDuration} hrs</strong></span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center">No services listed</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Availability */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => toggleSection('availability')}
                            className="w-full flex justify-between items-center p-4 bg-gray-50 text-gray-800 font-medium hover:bg-gray-100 transition duration-200"
                        >
                            <span className="flex items-center"><FaCalendarAlt className="mr-2 text-gray-600" /> Availability</span>
                            {openSections.availability ? <FaChevronUp className="text-gray-600" /> : <FaChevronDown className="text-gray-600" />}
                        </button>
                        {openSections.availability && (
                            <div className="p-4 bg-white space-y-2">
                                {user.availability.length > 0 ? (
                                    user.availability.map((slot) => (
                                        <div
                                            key={slot._id}
                                            className="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 transition duration-200"
                                        >
                                            <span className="font-medium text-gray-800">{slot.day}</span>
                                            <span className="text-gray-700">
                                                {slot.from.trim()} - {slot.to.trim()}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center">No availability listed</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Certifications */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => toggleSection('certifications')}
                            className="w-full flex justify-between items-center p-4 bg-gray-50 text-gray-800 font-medium hover:bg-gray-100 transition duration-200"
                        >
                            <span className="flex items-center"><FaAward className="mr-2 text-gray-600" /> Certifications</span>
                            {openSections.certifications ? <FaChevronUp className="text-gray-600" /> : <FaChevronDown className="text-gray-600" />}
                        </button>
                        {openSections.certifications && (
                            <div className="p-4 bg-white">
                                {user.certifications.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {user.certifications.map((cert, index) => (
                                            <div key={index} className="relative">
                                                <Image
                                                    src={cert}
                                                    alt={`Certification ${index + 1}`}
                                                    width={240}
                                                    height={160}
                                                    className="w-full h-auto rounded-md border border-gray-200 hover:opacity-90 transition duration-200"
                                                    onError={(e) => (e.currentTarget.src = '/placeholder-cert.png')}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center">No certifications listed</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={() => router.back()}
                        className="px-5 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-200"
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserDetailsPage;