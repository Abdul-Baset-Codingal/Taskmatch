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
        <div className="min-h-screen lg:mt-[150px] mt-[80px]">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Main Content Layout: Flex for desktop, column for mobile */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sticky Booking Sidebar */}
                    <div className="lg:w-1/3 lg:sticky w-full lg:top-20 self-start">
                        <div className="bg-white p-6">
                            {/* Profile Picture */}
                            <div className="flex justify-center">
                                <div className="relative h-[130px] w-[130px] rounded-full overflow-hidden border-2 border-white shadow-md">
                                    {tasker.profilePicture ? (
                                        <Image
                                            src={tasker.profilePicture}
                                            alt={tasker.fullName}
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full bg-gray-200">
                                            <FaUser className="text-gray-400 text-6xl" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Name */}
                            <div className="flex justify-center mt-4">
                                <h2 className="text-2xl font-semibold text-gray-800">{tasker.fullName}</h2>
                            </div>
                            {/* about section */}


                            {/* Info Section */}
                            <div className="mt-4 space-y-2 text-center">
                                <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
                                    <FaEnvelope className="text-coral-500" /> {tasker.email}
                                </p>
                                <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
                                    <FaPhone className="text-coral-500" /> {tasker.phone}
                                </p>
                                <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
                                    <FaStar className="text-black text-xs" />
                                    <span className="font-medium">{tasker.rating || "No rating"}</span> ·{" "}
                                    {(tasker.reviews?.length ?? 0)} reviews
                                </p>
                            </div>

                            {/* Buttons */}
                            <button className="w-full bg-coral-500 text-white py-3 rounded-lg font-medium hover:bg-coral-600 mb-2 transition">
                                Reserve
                            </button>
                            <button
                                onClick={openQuoteModal}
                                className="w-full border border-coral-500 text-coral-500 py-3 rounded-lg font-medium hover:bg-coral-100 transition"
                            >
                                Request Quote
                            </button>

                            <p className="text-xs text-gray-500 mt-4 text-center">You won&apos;t be charged yet</p>
                        </div>
                    </div>

                    {/* Main Content Column */}
                    <div className="lg:w-2/3">
                        {/* Categories */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Categories</h2>
                            <div className="flex flex-wrap gap-2">
                                {tasker.categories.map((cat, i) => (
                                    <span key={i} className="bg-gray-100 text-black px-3 py-1 rounded-full text-sm">
                                        {cat}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Highlights */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Highlights</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <FaTools className="text-black" />
                                    <span>{tasker.experience || "Experience not provided"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaCertificate className="text-black" />
                                    <span>{tasker.hasInsurance ? "Insured" : "No Insurance"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaGraduationCap className="text-black" />
                                    <span>{tasker.backgroundCheckConsent ? "Background Checked" : "No Background Check"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaShieldAlt className="text-black" />
                                    <span>Verified Tasker</span>
                                </div>
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">About {tasker.fullName}</h2>
                            <p className="text-gray-600">{tasker.about || "No description provided."}</p>
                        </div>

                        {/* Services */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">What this tasker offers</h2>
                            {tasker.services.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4">
                                    {tasker.services.map((service, i) => (
                                        <div
                                            key={i}
                                            className="p-4 border rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
                                            onClick={() => openBookModal(service.title)}
                                        >
                                            <h3 className="font-medium text-lg">{service.title}</h3>
                                            <span className="text-sm text-coral-600">
                                                ${service.hourlyRate}/hr · ~{service.estimatedDuration}
                                            </span>
                                            <p className="text-sm text-gray-600 mb-1 mt-2">{service.description}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No services listed.</p>
                            )}
                        </div>

                        {/* Skills */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Skills and Expertise</h2>
                            {tasker.skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {tasker.skills.map((skill, i) => (
                                        <span key={i} className="bg-coral-100 text-coral-800  py-1 rounded-full ">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No skills added.</p>
                            )}
                        </div>

                        {/* Certifications & Qualifications */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Certifications & Qualifications</h2>
                            {tasker.certifications.length === 0 && tasker.qualifications.length === 0 ? (
                                <p className="text-gray-500">No certifications or qualifications listed.</p>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    {tasker.certifications.map((cert, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <FaCertificate className="text-green-500" />
                                            <span>{cert}</span>
                                        </div>
                                    ))}
                                    {tasker.qualifications.map((qual, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <FaGraduationCap className="text-blue-500" />
                                            <span>{qual}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Availability */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Availability</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {tasker.availability.map((slot, i) => (
                                    <div key={slot._id || i} className="p-3 bg-gray-50 rounded-lg border">
                                        <p className="font-medium">{slot.day}</p>
                                        <p className="text-sm text-gray-600">{slot.from} - {slot.to}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Service Areas */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Service Areas</h2>
                            <div className="flex flex-wrap gap-2">
                                {tasker.serviceAreas.map((area, i) => (
                                    <span key={i} className="bg-gray-100 text-black px-3 py-1 rounded-full text-sm">
                                        {area}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Reviews */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">
                                Reviews ({tasker.reviews?.length || 0})
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {tasker.reviews && tasker.reviews.length > 0 ? (
                                    tasker.reviews.map((review, i) => (
                                        <div
                                            key={i}
                                            className="p-4 border rounded-lg bg-white shadow-sm flex flex-col"
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <FaUser className="text-gray-500 text-lg" />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {review.reviewer || "Anonymous"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center mb-2 gap-5">
                                                <div className="flex items-center gap-1 text-xs">
                                                    {Array.from({ length: 5 }).map((_, starIndex) => (
                                                        <FaStar
                                                            key={starIndex}
                                                            className={
                                                                starIndex < review.rating
                                                                    ? "text-black"
                                                                    : "text-gray-300"
                                                            }
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-xs text-gray-500 mt-auto">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <p className="text-gray-600 mb-1 text-sm">{review.message}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No reviews yet.</p>
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
          --coral-100: #FFE4E1;
          --coral-500: #FF6B6B;
          --coral-600: #FF5555;
          --teal-100: #E6FFFA;
          --teal-500: #38B2AC;
          --teal-600: #2C7A7B;
          --teal-800: #234E52;
        }
      `}</style>
        </div>
    );
};

export default TaskerProfile;