/* eslint-disable @typescript-eslint/ban-ts-comment */
import Image from 'next/image';
import React, { ReactNode, useState } from 'react';
import { FaUser, FaStar, FaTools, FaCertificate, FaGraduationCap, FaShieldAlt, FaEnvelope, FaPhone } from "react-icons/fa";
import BookServiceModal from '../routes/urgent-task/BookServiceModal';
import RequestQuoteModal from '../routes/urgent-task/RequestQuoteModal';

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
    reviews?: {
        message: ReactNode;
        rating: number;
        comment: string;
        reviewer: string;
        createdAt: string;
        _id: string;
    }[];
}

const TaskerProfile = ({ tasker }: { tasker: Tasker }) => {
    // State for BookServiceModal
    const [isBookModalOpen, setIsBookModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<string | null>(null);
    // State for RequestQuoteModal
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

    // Function to open BookServiceModal with a specific service
    const openBookModal = (serviceTitle: string) => {
        setSelectedService(serviceTitle);
        setIsBookModalOpen(true);
    };

    // Function to close BookServiceModal
    const closeBookModal = () => {
        setIsBookModalOpen(false);
        setSelectedService(null);
    };

    // Function to open RequestQuoteModal
    const openQuoteModal = () => {
        setIsQuoteModalOpen(true);
    };

    // Function to close RequestQuoteModal
    const closeQuoteModal = () => {
        setIsQuoteModalOpen(false);
    };

    return (
        <div className="min-h-screen  ">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Main Content Layout: Flex for desktop, column for mobile */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sticky Booking Sidebar */}
                    <div className="lg:w-1/3 lg:sticky w-full lg:top-20 self-start">
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                            {/* Profile Picture */}
                            <div className="flex justify-center mb-4">
                                <div className="relative h-[130px] w-[130px] rounded-full overflow-hidden border-4 border-primary-light shadow-lg">
                                    {tasker.profilePicture ? (
                                        <Image
                                            src={tasker.profilePicture}
                                            alt={tasker.fullName}
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full bg-primary-light">
                                            <FaUser className="text-primary-dark text-5xl" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Name */}
                            <div className="flex justify-center mb-6">
                                <h2 className="text-3xl font-bold text-primary-dark">{tasker.fullName}</h2>
                            </div>

                            {/* About Section (Shortened for Sidebar) */}
                            {tasker.about && (
                                <div className="mb-4 text-center">
                                    <p className="text-sm text-gray-600 italic leading-relaxed">{tasker.about.substring(0, 100)}...</p>
                                </div>
                            )}

                            {/* Info Section */}
                            <div className="space-y-3 text-center mb-6">
                                <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
                                    <FaEnvelope className="text-primary h-4 w-4" /> {tasker.email}
                                </p>
                                <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
                                    <FaPhone className="text-primary h-4 w-4" /> {tasker.phone}
                                </p>
                                <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: Math.floor(tasker.rating || 0) }).map((_, i) => (
                                            <FaStar key={i} className="text-primary text-sm fill-current" />
                                        ))}
                                        {tasker.rating && tasker.rating % 1 !== 0 && (
                                            <FaStar className="text-primary text-sm" />
                                        )}
                                    </div>
                                    <span className="font-medium text-primary-dark ml-1">{tasker.rating || "No rating"}</span> ·{" "}
                                    <span className="text-gray-500">({(tasker.reviews?.length ?? 0)} reviews)</span>
                                </p>
                            </div>

                            {/* Buttons */}
                            <button
                                onClick={() => openBookModal(tasker.services[0]?.title || '')}
                                className="w-full color1 text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-200 shadow-md mb-3 flex items-center justify-center gap-2"
                            >
                                <FaTools className="h-4 w-4" />
                                Reserve Now
                            </button>
                            <button
                                onClick={openQuoteModal}
                                className="w-full border-2 border-primary text-primary py-3 rounded-lg font-semibold hover:bg-primary-light hover:text-primary-dark transition-all duration-200"
                            >
                                Request Quote
                            </button>

                            <p className="text-xs text-gray-500 mt-4 text-center italic">You won&apos;t be charged yet</p>
                        </div>
                    </div>

                    {/* Main Content Column */}
                    <div className="lg:w-2/3 space-y-8">
                        {/* Categories */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h2 className="text-2xl font-bold text-primary-dark mb-4">Categories</h2>
                            <div className="flex flex-wrap gap-2">
                                {tasker.categories.map((cat, i) => (
                                    <span key={i} className="bg-primary-light text-primary-dark px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                                        {cat}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Highlights */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h2 className="text-2xl font-bold text-primary-dark mb-4">Highlights</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-3 bg-primary-light rounded-lg">
                                    <FaTools className="text-primary h-5 w-5" />
                                    <span className="font-medium text-primary-dark">{tasker.experience || "Experience not provided"}</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-primary-light rounded-lg">
                                    <FaCertificate className="text-primary h-5 w-5" />
                                    <span className="font-medium text-primary-dark">{tasker.hasInsurance ? "Insured" : "No Insurance"}</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-primary-light rounded-lg">
                                    <FaGraduationCap className="text-primary h-5 w-5" />
                                    <span className="font-medium text-primary-dark">{tasker.backgroundCheckConsent ? "Background Checked" : "No Background Check"}</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-primary-light rounded-lg">
                                    <FaShieldAlt className="text-primary h-5 w-5" />
                                    <span className="font-medium text-primary-dark">Verified Tasker</span>
                                </div>
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h2 className="text-2xl font-bold text-primary-dark mb-4">About {tasker.fullName}</h2>
                            <p className="text-gray-600 leading-relaxed">{tasker.about || "No description provided."}</p>
                        </div>

                        {/* Services */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h2 className="text-2xl font-bold text-primary-dark mb-4">What this tasker offers</h2>
                            {tasker.services.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4">
                                    {tasker.services.map((service, i) => (
                                        <div
                                            key={i}
                                            className="p-6 border border-gray-200 rounded-lg bg-gray-50 cursor-pointer hover:bg-primary-light transition-all duration-200 shadow-sm hover:shadow-md hover:border-primary"
                                            onClick={() => openBookModal(service.title)}
                                        >
                                            <h3 className="font-semibold text-xl text-primary-dark mb-2">{service.title}</h3>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-lg font-bold text-primary">
                                                    ${service.hourlyRate}/hr
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    ~{service.estimatedDuration}
                                                </span>
                                            </div>
                                            <p className="text-gray-600">{service.description}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No services listed.</p>
                            )}
                        </div>

                        {/* Skills */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h2 className="text-2xl font-bold text-primary-dark mb-4">Skills and Expertise</h2>
                            {tasker.skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {tasker.skills.map((skill, i) => (
                                        <span key={i} className="bg-primary-light text-primary-dark px-4 py-2 rounded-full font-medium shadow-sm">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No skills added.</p>
                            )}
                        </div>

                        {/* Certifications & Qualifications */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h2 className="text-2xl font-bold text-primary-dark mb-4">Certifications & Qualifications</h2>
                            {tasker.certifications.length === 0 && tasker.qualifications.length === 0 ? (
                                <p className="text-gray-500">No certifications or qualifications listed.</p>
                            ) : (
                                <div className="space-y-3">
                                    {tasker.certifications.map((cert, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-primary-light rounded-lg">
                                            <FaCertificate className="text-primary h-5 w-5" />
                                            <span className="font-medium text-primary-dark">{cert}</span>
                                        </div>
                                    ))}
                                    {tasker.qualifications.map((qual, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-primary-light rounded-lg">
                                            <FaGraduationCap className="text-primary h-5 w-5" />
                                            <span className="font-medium text-primary-dark">{qual}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Availability */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h2 className="text-2xl font-bold text-primary-dark mb-4">Availability</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {tasker.availability.map((slot, i) => (
                                    <div key={slot._id || i} className="p-4 bg-primary-light rounded-lg border border-primary/20 shadow-sm">
                                        <p className="font-semibold text-primary-dark">{slot.day}</p>
                                        <p className="text-sm text-gray-600">{slot.from} - {slot.to}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Service Areas */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h2 className="text-2xl font-bold text-primary-dark mb-4">Service Areas</h2>
                            <div className="flex flex-wrap gap-2">
                                {tasker.serviceAreas.map((area, i) => (
                                    <span key={i} className="bg-primary-light text-primary-dark px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                                        {area}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Reviews */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h2 className="text-2xl font-bold text-primary-dark mb-4">
                                Reviews ({tasker.reviews?.length || 0})
                            </h2>
                            <div className="space-y-4">
                                {tasker.reviews && tasker.reviews.length > 0 ? (
                                    tasker.reviews.map((review, i) => (
                                        <div
                                            key={i}
                                            className="p-5 border border-gray-200 rounded-lg bg-gray-50 shadow-sm"
                                        >
                                            <div className="flex items-start gap-4 mb-3">
                                                <div className="flex-shrink-0">
                                                    <FaUser className="text-primary-dark text-xl mt-1" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <span className="text-sm font-semibold text-primary-dark block">
                                                        {review.reviewer || "Anonymous"}
                                                    </span>
                                                    <div className="flex items-center gap-4 mt-1">
                                                        <div className="flex items-center gap-1">
                                                            {Array.from({ length: 5 }).map((_, starIndex) => (
                                                                <FaStar
                                                                    key={starIndex}
                                                                    className={
                                                                        starIndex < review.rating
                                                                            ? "text-primary h-4 w-4 fill-current"
                                                                            : "text-gray-300 h-4 w-4"
                                                                    }
                                                                />
                                                            ))}
                                                        </div>
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(review.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <p className="text-gray-700 mt-2 text-sm leading-relaxed">{review.message || review.comment}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <FaStar className="text-4xl text-gray-300 mx-auto mb-2" />
                                        <p>No reviews yet. Be the first to leave a review!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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

            {/* Custom Tailwind Colors */}
            <style jsx global>{`
        :root {
          --primary: #109C3D;
          --primary-dark: #063A41;
          --primary-light: #E5FFDB;
        }
        .bg-primary { background-color: var(--primary); }
        .bg-primary-dark { background-color: var(--primary-dark); }
        .bg-primary-light { background-color: var(--primary-light); }
        .text-primary { color: var(--primary); }
        .text-primary-dark { color: var(--primary-dark); }
        .border-primary { border-color: var(--primary); }
        .border-primary\/20 { border-color: rgba(16, 156, 61, 0.2); }
      `}</style>
        </div>
    );
};

export default TaskerProfile;