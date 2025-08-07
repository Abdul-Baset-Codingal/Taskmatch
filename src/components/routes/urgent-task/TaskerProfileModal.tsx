/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaUser, FaStar, FaTools, FaCertificate, FaGraduationCap, FaChevronDown, FaChevronUp, FaBriefcase, FaClock } from "react-icons/fa";
import Image from "next/image";

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
    const experiencePercentage = Math.min((experienceYears / 20) * 100, 100); // Cap at 20 years for progress bar

    return (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-[9999] transition-opacity duration-500">
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl transform transition-all duration-500 scale-100 hover:scale-[1.01] font-['Inter']">
                <div className="flex flex-col md:flex-row">
                    <div className="bg-[#8560F1] p-6 md:w-1/3 flex flex-col items-center text-center text-white rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-[#E7B6FE] transition-colors duration-200"
                            aria-label="Close modal"
                        >
                            &times;
                        </button>
                        <div className="relative mb-4">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                {tasker.profilePicture ? (
                                    <Image
                                        src={tasker.profilePicture}
                                        alt={tasker.fullName}
                                        width={128}
                                        height={128}
                                        className="object-cover"
                                        priority
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-32 h-32 bg-gray-300 rounded-full">
                                        <FaUser className="text-gray-500 text-4xl" />
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-0 -right-0 w-10 h-10 rounded-full flex items-center justify-center">
                                <FaStar className="text-[#FF8609] text-3xl" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-white mb-2">{tasker.fullName}</h2>
                        <p className="text-sm font-['Lora'] italic text-white/90 mb-4 flex items-center gap-2 justify-center">
                            <FaBriefcase className="text-[#E7B6FE]" />
                            {tasker.service}
                        </p>
                        <div className="space-y-3 text-sm font-medium tracking-wide">
                            <a
                                href={`mailto:${tasker.email}`}
                                className="flex items-center gap-2 hover:text-[#E7B6FE] transition-colors duration-200"
                            >
                                <FaEnvelope className="text-[#E7B6FE]" />
                                {tasker.email}
                            </a>
                            <a
                                href={`tel:${tasker.phone}`}
                                className="flex items-center gap-2 hover:text-[#E7B6FE] transition-colors duration-200"
                            >
                                <FaPhoneAlt className="text-[#E7B6FE]" />
                                {tasker.phone}
                            </a>
                            <p className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-[#E7B6FE]" />
                                {tasker.city}, {tasker.province}
                            </p>
                            <p className="flex items-center gap-2">
                                <FaStar className="text-[#E7B6FE]" />
                                ${tasker.rate}/hr
                            </p>
                            <p className="flex items-center gap-2">
                                <FaTools className="text-[#E7B6FE]" />
                                {tasker.experience}
                            </p>
                            <p className="flex items-center gap-2">
                                <FaCertificate className="text-[#E7B6FE]" />
                                {tasker.hasInsurance ? "✔️ Insured" : "❌ No Insurance"}
                            </p>
                            <p className="flex items-center gap-2">
                                <FaGraduationCap className="text-[#E7B6FE]" />
                                {tasker.backgroundCheckConsent ? "✔️ Background Check" : "❌ No Background Check"}
                            </p>
                        </div>
                        <div className="mt-6 w-full">
                            <div className="flex items-center gap-2 mb-2">
                                <FaTools className="text-[#E7B6FE] text-lg" />
                                <span className="text-sm font-semibold tracking-tight">Experience Level</span>
                            </div>
                            <div className="w-full bg-white/30 rounded-full h-2.5">
                                <div
                                    className="bg-[#E7B6FE] h-2.5 rounded-full transition-all duration-500"
                                    style={{ width: `${experiencePercentage}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-white/80 mt-2 font-['Lora'] tracking-wide">{experienceYears} years of experience</p>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="p-6 md:w-2/3 space-y-4 overflow-y-auto max-h-[80vh]">
                        {/* About */}
                        <div className="bg-white/70 rounded-xl shadow-sm p-4">
                            <button
                                onClick={() => toggleSection('about')}
                                className="w-full flex justify-between items-center text-lg font-semibold text-[#8560F1] tracking-tight"
                            >
                                <span className="flex items-center gap-2">
                                    <FaTools className="text-[#FF8609]" />
                                    About
                                </span>
                                {openSections.about ? <FaChevronUp className="text-[#8560F1]" /> : <FaChevronDown className="text-[#8560F1]" />}
                            </button>
                            {openSections.about && (
                                <div className="mt-3">
                                    <p className="text-sm text-gray-700 font-['Lora'] leading-relaxed bg-[#E7B6FE]/10 p-3 rounded-lg">
                                        {tasker.description || "No description provided."}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Service Areas */}
                        <div className="bg-white/70 rounded-xl shadow-sm p-4">
                            <button
                                onClick={() => toggleSection('serviceAreas')}
                                className="w-full flex justify-between items-center text-lg font-semibold text-[#8560F1] tracking-tight"
                            >
                                <span className="flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-[#FF8609]" />
                                    Service Areas
                                </span>
                                {openSections.serviceAreas ? <FaChevronUp className="text-[#8560F1]" /> : <FaChevronDown className="text-[#8560F1]" />}
                            </button>
                            {openSections.serviceAreas && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {tasker.serviceAreas?.length > 0 ? (
                                        tasker.serviceAreas.map((area, i) => (
                                            <span
                                                key={i}
                                                className="bg-[#FF8609]/10 text-[#FF6C32] px-3 py-1 rounded-full text-sm font-medium tracking-wide hover:bg-[#FF8609]/20 transition-colors duration-200"
                                            >
                                                {area}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400 italic text-sm font-['Lora'] tracking-wide">No service areas listed</span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Skills */}
                        <div className="bg-white/70 rounded-xl shadow-sm p-4">
                            <button
                                onClick={() => toggleSection('skills')}
                                className="w-full flex justify-between items-center text-lg font-semibold text-[#8560F1] tracking-tight"
                            >
                                <span className="flex items-center gap-2">
                                    <FaTools className="text-[#FF8609]" />
                                    Skills
                                </span>
                                {openSections.skills ? <FaChevronUp className="text-[#8560F1]" /> : <FaChevronDown className="text-[#8560F1]" />}
                            </button>
                            {openSections.skills && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {tasker.skills?.length > 0 ? (
                                        tasker.skills.map((skill, i) => (
                                            <span
                                                key={i}
                                                className="bg-[#8560F1]/10 text-[#8560F1] px-3 py-1 rounded-full text-sm font-medium tracking-wide hover:bg-[#8560F1]/20 transition-colors duration-200"
                                            >
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400 italic text-sm font-['Lora'] tracking-wide">No skills listed</span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Certifications */}
                        <div className="bg-white/70 rounded-xl shadow-sm p-4">
                            <button
                                onClick={() => toggleSection('certifications')}
                                className="w-full flex justify-between items-center text-lg font-semibold text-[#8560F1] tracking-tight"
                            >
                                <span className="flex items-center gap-2">
                                    <FaCertificate className="text-[#FF8609]" />
                                    Certifications
                                </span>
                                {openSections.certifications ? <FaChevronUp className="text-[#8560F1]" /> : <FaChevronDown className="text-[#8560F1]" />}
                            </button>
                            {openSections.certifications && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {tasker.certifications?.length > 0 ? (
                                        tasker.certifications.map((cert, i) => (
                                            <span
                                                key={i}
                                                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium tracking-wide hover:bg-green-200 transition-colors duration-200"
                                            >
                                                {cert}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400 italic text-sm font-['Lora'] tracking-wide">No certifications listed</span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Qualifications */}
                        <div className="bg-white/70 rounded-xl shadow-sm p-4">
                            <button
                                onClick={() => toggleSection('qualifications')}
                                className="w-full flex justify-between items-center text-lg font-semibold text-[#8560F1] tracking-tight"
                            >
                                <span className="flex items-center gap-2">
                                    <FaGraduationCap className="text-[#FF8609]" />
                                    Qualifications
                                </span>
                                {openSections.qualifications ? <FaChevronUp className="text-[#8560F1]" /> : <FaChevronDown className="text-[#8560F1]" />}
                            </button>
                            {openSections.qualifications && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {tasker.qualifications?.length > 0 ? (
                                        tasker.qualifications.map((qual, i) => (
                                            <span
                                                key={i}
                                                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium tracking-wide hover:bg-blue-200 transition-colors duration-200"
                                            >
                                                {qual}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400 italic text-sm font-['Lora'] tracking-wide">No qualifications listed</span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Services */}
                        <div className="bg-white/70 rounded-xl shadow-sm p-4">
                            <button
                                onClick={() => toggleSection('services')}
                                className="w-full flex justify-between items-center text-lg font-semibold text-[#8560F1] tracking-tight"
                            >
                                <span className="flex items-center gap-2">
                                    <FaBriefcase className="text-[#FF8609]" />
                                    Services
                                </span>
                                {openSections.services ? <FaChevronUp className="text-[#8560F1]" /> : <FaChevronDown className="text-[#8560F1]" />}
                            </button>
                            {openSections.services && (
                                <div className="mt-3 space-y-3">
                                    {tasker.services?.length > 0 ? (
                                        tasker.services.map((service, i) => (
                                            <div
                                                key={i}
                                                className="bg-[#E7B6FE]/10 p-4 rounded-lg shadow-sm hover:bg-[#E7B6FE]/20 transition-colors duration-200"
                                            >
                                                <strong className="text-[#8560F1] font-semibold tracking-tight">{service.title}</strong>
                                                <p className="text-sm text-gray-700 font-['Lora'] leading-relaxed mt-1">{service.description}</p>
                                                <span className="block text-[#FF8609] text-sm font-medium tracking-wide mt-1">(${service.hourlyRate}/hr, ~{service.estimatedDuration})</span>
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-gray-400 italic text-sm font-['Lora'] tracking-wide">No services listed</span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Availability */}
                        <div className="bg-white/70 rounded-xl shadow-sm p-4">
                            <button
                                onClick={() => toggleSection('availability')}
                                className="w-full flex justify-between items-center text-lg font-semibold text-[#8560F1] tracking-tight"
                            >
                                <span className="flex items-center gap-2">
                                    <FaClock className="text-[#FF8609]" />
                                    Availability
                                </span>
                                {openSections.availability ? <FaChevronUp className="text-[#8560F1]" /> : <FaChevronDown className="text-[#8560F1]" />}
                            </button>
                            {openSections.availability && (
                                <div className="mt-3 space-y-2">
                                    {tasker.availability?.length > 0 ? (
                                        tasker.availability.map((slot, i) => (
                                            <div
                                                key={i}
                                                className="bg-[#E7B6FE]/10 p-3 rounded-lg shadow-sm hover:bg-[#E7B6FE]/20 transition-colors duration-200"
                                            >
                                                <p className="text-sm text-gray-700 font-['Lora'] leading-relaxed">
                                                    <strong className="text-[#8560F1]">{slot.day}</strong>: {slot.from} - {slot.to}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-gray-400 italic text-sm font-['Lora'] tracking-wide">No availability listed</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-white/70 p-4 rounded-b-3xl flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gradient-to-r from-[#8560F1] to-[#FF8609] text-white px-8 py-3 rounded-full font-semibold tracking-wide hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskerProfileModal;
