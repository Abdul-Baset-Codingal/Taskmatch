/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode, useState } from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaUser, FaStar, FaTools, FaCertificate, FaGraduationCap, FaChevronDown, FaChevronUp, FaBriefcase, FaClock } from "react-icons/fa";
import Image from "next/image";

interface Tasker {
    lastName: ReactNode;
    firstName: ReactNode;
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
}

const TaskerProfileModal = ({ tasker, isOpen, onClose }: {
    tasker: Tasker,
    isOpen: boolean,
    onClose: () => void
}) => {
    const [openSections, setOpenSections] = useState({
        about: true,
        serviceAreas: true,
        skills: true,
        certifications: true,
        qualifications: true,
        services: true,
        availability: true,
    });

    if (!isOpen) return null;

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Convert experience to a number for progress bar (assuming experience is in format "X years")
    const experienceYears = parseInt(tasker.experience) || 0;
    const experiencePercentage = Math.min((experienceYears / 20) * 100, 100);

    return (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-[9999] transition-opacity duration-500">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg transition-all duration-300 lg:mx-0 mx-8">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-coral-100 to-teal-100 p-6 rounded-t-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-coral-500 text-2xl transition-colors"
                    aria-label="Close modal"
                >
                    &times;
                </button>
                <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-teal-500 shadow-md">
                            {tasker.profilePicture ? (
                                <Image
                                    src={tasker.profilePicture}
                                    alt={tasker.fullName}
                                    width={96}
                                    height={96}
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full">
                                    <FaUser className="text-gray-400 text-3xl" />
                                </div>
                            )}
                        </div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 bg-coral-500 rounded-full flex items-center justify-center">
                            <FaStar className="text-white text-lg" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-semibold text-teal-800 mb-1">{tasker.firstName} {tasker.lastName}</h2>
                    <p className="text-sm text-teal-600 flex items-center gap-1 mb-4">
                        <FaBriefcase className="text-coral-500" />
                        {tasker.service}
                    </p>
                </div>
            </div>

            {/* Profile Info */}
            <div className="p-6 bg-gray-50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
                    <a href={`mailto:${tasker.email}`} className="flex items-center gap-2 hover:text-coral-500 transition-colors">
                        <FaEnvelope className="text-teal-500" />
                        {tasker.email}
                    </a>
                    <a href={`tel:${tasker.phone}`} className="flex items-center gap-2 hover:text-coral-500 transition-colors">
                        <FaPhoneAlt className="text-teal-500" />
                        {tasker.phone}
                    </a>
                    <p className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-teal-500" />
                        {tasker.city}, {tasker.province}
                    </p>
                    <p className="flex items-center gap-2">
                        <FaStar className="text-teal-500" />
                        ${tasker.rate}/hr
                    </p>
                    <p className="flex items-center gap-2">
                        <FaTools className="text-teal-500" />
                        {tasker.experience}
                    </p>
                    <p className="flex items-center gap-2">
                        <FaCertificate className="text-teal-500" />
                        {tasker.hasInsurance ? "✔️ Insured" : "❌ No Insurance"}
                    </p>
                    <p className="flex items-center gap-2">
                        <FaGraduationCap className="text-teal-500" />
                        {tasker.backgroundCheckConsent ? "✔️ Background Check" : "❌ No Background Check"}
                    </p>
                </div>
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <FaTools className="text-teal-500 text-lg" />
                        <span className="font-semibold text-teal-800">Experience Level</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-3">
                        <div
                            className="bg-gradient-to-r from-coral-500 to-teal-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${experiencePercentage}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{experienceYears} years of experience</p>
                </div>
            </div>

            {/* Collapsible Sections */}
            <div className="p-6 space-y-4">
                {/* About */}
                <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <button
                        onClick={() => toggleSection('about')}
                        className="w-full p-4 flex justify-between items-center text-teal-800 font-semibold"
                    >
                        <span className="flex items-center gap-2">
                            <FaTools className="text-coral-500" />
                            About
                        </span>
                        {openSections.about ? <FaChevronUp className="text-teal-500" /> : <FaChevronDown className="text-teal-500" />}
                    </button>
                    {openSections.about && (
                        <div className="p-4 border-t border-gray-100">
                            <p className="text-sm text-gray-600">{tasker.description || "No description provided."}</p>
                        </div>
                    )}
                </div>

                {/* Service Areas */}
                <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <button
                        onClick={() => toggleSection('serviceAreas')}
                        className="w-full p-4 flex justify-between items-center text-teal-800 font-semibold"
                    >
                        <span className="flex items-center gap-2">
                            <FaMapMarkerAlt className="text-coral-500" />
                            Service Areas
                        </span>
                        {openSections.serviceAreas ? <FaChevronUp className="text-teal-500" /> : <FaChevronDown className="text-teal-500" />}
                    </button>
                    {openSections.serviceAreas && (
                        <div className="p-4 border-t border-gray-100 flex flex-wrap gap-2">
                            {tasker.serviceAreas?.length > 0 ? (
                                tasker.serviceAreas.map((area, i) => (
                                    <span
                                        key={i}
                                        className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm hover:bg-teal-200 transition-colors"
                                    >
                                        {area}
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-500 text-sm">No service areas listed</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Skills */}
                <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <button
                        onClick={() => toggleSection('skills')}
                        className="w-full p-4 flex justify-between items-center text-teal-800 font-semibold"
                    >
                        <span className="flex items-center gap-2">
                            <FaTools className="text-coral-500" />
                            Skills
                        </span>
                        {openSections.skills ? <FaChevronUp className="text-teal-500" /> : <FaChevronDown className="text-teal-500" />}
                    </button>
                    {openSections.skills && (
                        <div className="p-4 border-t border-gray-100 flex flex-wrap gap-2">
                            {tasker.skills?.length > 0 ? (
                                tasker.skills.map((skill, i) => (
                                    <span
                                        key={i}
                                        className="bg-coral-100 text-coral-800 px-3 py-1 rounded-full text-sm hover:bg-coral-200 transition-colors"
                                    >
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-500 text-sm">No skills listed</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Certifications */}
                <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <button
                        onClick={() => toggleSection('certifications')}
                        className="w-full p-4 flex justify-between items-center text-teal-800 font-semibold"
                    >
                        <span className="flex items-center gap-2">
                            <FaCertificate className="text-coral-500" />
                            Certifications
                        </span>
                        {openSections.certifications ? <FaChevronUp className="text-teal-500" /> : <FaChevronDown className="text-teal-500" />}
                    </button>
                    {openSections.certifications && (
                        <div className="p-4 border-t border-gray-100 flex flex-wrap gap-2">
                            {tasker.certifications?.length > 0 ? (
                                tasker.certifications.map((cert, i) => (
                                    <span
                                        key={i}
                                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm hover:bg-green-200 transition-colors"
                                    >
                                        {cert}
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-500 text-sm">No certifications listed</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Qualifications */}
                <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <button
                        onClick={() => toggleSection('qualifications')}
                        className="w-full p-4 flex justify-between items-center text-teal-800 font-semibold"
                    >
                        <span className="flex items-center gap-2">
                            <FaGraduationCap className="text-coral-500" />
                            Qualifications
                        </span>
                        {openSections.qualifications ? <FaChevronUp className="text-teal-500" /> : <FaChevronDown className="text-teal-500" />}
                    </button>
                    {openSections.qualifications && (
                        <div className="p-4 border-t border-gray-100 flex flex-wrap gap-2">
                            {tasker.qualifications?.length > 0 ? (
                                tasker.qualifications.map((qual, i) => (
                                    <span
                                        key={i}
                                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition-colors"
                                    >
                                        {qual}
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-500 text-sm">No qualifications listed</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Services */}
                <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <button
                        onClick={() => toggleSection('services')}
                        className="w-full p-4 flex justify-between items-center text-teal-800 font-semibold"
                    >
                        <span className="flex items-center gap-2">
                            <FaBriefcase className="text-coral-500" />
                            Services
                        </span>
                        {openSections.services ? <FaChevronUp className="text-teal-500" /> : <FaChevronDown className="text-teal-500" />}
                    </button>
                    {openSections.services && (
                        <div className="p-4 border-t border-gray-100 space-y-3">
                            {tasker.services?.length > 0 ? (
                                tasker.services.map((service, i) => (
                                    <div key={i} className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                                        <h3 className="text-teal-800 font-semibold">{service.title}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                                        <span className="block text-coral-600 text-sm mt-1">
                                            ${service.hourlyRate}/hr, ~{service.estimatedDuration}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <span className="text-gray-500 text-sm">No services listed</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Availability */}
                <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <button
                        onClick={() => toggleSection('availability')}
                        className="w-full p-4 flex justify-between items-center text-teal-800 font-semibold"
                    >
                        <span className="flex items-center gap-2">
                            <FaClock className="text-coral-500" />
                            Availability
                        </span>
                        {openSections.availability ? <FaChevronUp className="text-teal-500" /> : <FaChevronDown className="text-teal-500" />}
                    </button>
                    {openSections.availability && (
                        <div className="p-4 border-t border-gray-100 space-y-2">
                            {tasker.availability?.length > 0 ? (
                                tasker.availability.map((slot, i) => (
                                    <div key={i} className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                                        <p className="text-sm text-gray-600">
                                            <strong className="text-teal-800">{slot.day}:</strong> {slot.from} - {slot.to}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <span className="text-gray-500 text-sm">No availability listed</span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 flex justify-center rounded-b-2xl">
                <button
                    onClick={onClose}
                    className="bg-coral-500 text-white px-6 py-2 rounded-full hover:bg-coral-600 transition-colors shadow-sm hover:shadow-md"
                >
                    Close
                </button>
            </div>
        </div>

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

export default TaskerProfileModal;