/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import React, { useEffect } from "react";
import { FaSearch, FaStar, FaTimes, FaCheckCircle } from "react-icons/fa";
import Image from "next/image";
import tasker1 from "../../../public/Images/clientImage1.jpg";
import tasker2 from "../../../public/Images/clientImage3.jpg";
import tasker3 from "../../../public/Images/clientImage3.jpg";

interface FindTaskersModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FindTaskersModal: React.FC<FindTaskersModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    // Disable body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] isolate">
            <div className="bg-white w-[95%] sm:w-[90%] md:max-w-2xl lg:max-w-4xl rounded-2xl relative shadow-xl max-h-[90vh] overflow-y-auto">
                <style>
                    {`
            .fade-in {
              animation: fadeIn 0.5s ease-out;
            }
            .glass-effect {
              background: rgba(255, 255, 255, 0.3);
              backdrop-filter: blur(8px);
              border: 1px solid rgba(255, 255, 255, 0.4);
            }
            .tasker-float:hover {
              transform: translateY(-4px);
              box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
              transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            .text-fancy {
              font-family: 'Inter', sans-serif;
              letter-spacing: 0.02em;
            }
            .text-italic {
              font-family: 'Playfair Display', serif;
              font-style: italic;
            }
            .title-glow {
              animation: textGlow 2s ease-in-out infinite alternate;
            }
            .scrollbar-custom::-webkit-scrollbar {
              width: 6px;
            }
            .scrollbar-custom::-webkit-scrollbar-track {
              background: rgba(255, 255, 255, 0.1);
              border-radius: 3px;
            }
            .scrollbar-custom::-webkit-scrollbar-thumb {
              background: rgba(255, 147, 0, 0.6);
              border-radius: 3px;
            }
            .scrollbar-custom::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 147, 0, 0.8);
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(15px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes textGlow {
              from { text-shadow: 0 0 5px rgba(255, 147, 0, 0.5); }
              to { text-shadow: 0 0 10px rgba(255, 147, 0, 0.7); }
            }
          `}
                </style>
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white hover:text-rose-400 transition z-[10001] bg-black/30 p-1.5 sm:p-2 rounded-full backdrop-blur-md"
                >
                    <FaTimes size={18} className="sm:w-5 sm:h-5" />
                </button>

                {/* Header */}
                <div className="bg-gradient-to-r from-amber-400 to-rose-400 pt-5 sm:pt-6 pb-8 sm:pb-10 text-center fade-in">
                    <h2 className="text-xl sm:text-2xl md:text-3xl text-white font-extrabold title-glow flex items-center justify-center gap-2 sm:gap-3">
                        <FaSearch className="text-lg sm:text-xl md:text-2xl" />
                        Find Perfect Taskers
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base text-white mt-1 sm:mt-2 text-fancy">
                        Search by reviews, ratings, and price range
                    </p>
                </div>

                {/* Filters */}
                <div className="px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 pb-5 sm:pb-6 -mt-5 sm:-mt-6 md:-mt-8">
                    <div className="glass-effect p-2.5 sm:p-3 md:p-4 rounded-lg shadow-inner">
                        <style>
                            {`
                .glass-effect {
                  background: rgba(255, 255, 255, 0.5);
                  backdrop-filter: blur(8px);
                  border: 1px solid rgba(255, 255, 255, 0.4);
                }
                .filter-text {
                  opacity: 1 !important;
                  color: #111827 !important; /* text-gray-900 */
                }
                .filter-select {
                  background: rgba(255, 255, 255, 0.9);
                  opacity: 1 !important;
                  color: #111827 !important; /* text-gray-900 */
                }
                .filter-select:hover, .filter-text:hover {
                  opacity: 1 !important;
                  color: #111827 !important;
                }
              `}
                        </style>
                        <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 text-fancy filter-text">
                            Search Filters
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                            <div>
                                <label className="text-sm sm:text-base md:text-lg text-gray-900 text-fancy filter-text">Service Type</label>
                                <select className="w-full mt-1 p-1 sm:p-1.5 md:p-2 border border-gray-300 rounded-md text-sm sm:text-base text-fancy filter-select">
                                    <option>All Services</option>
                                    <option>Cleaning</option>
                                    <option>Handyman</option>
                                    <option>Moving</option>
                                    <option>Painting</option>
                                    <option>Gardening</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm sm:text-base md:text-lg text-gray-900 text-fancy filter-text">Price Range (per hour)</label>
                                <select className="w-full mt-1 p-1 sm:p-1.5 md:p-2 border border-gray-300 rounded-md text-sm sm:text-base text-fancy filter-select">
                                    <option>Any Price</option>
                                    <option>$10-$20</option>
                                    <option>$20-$30</option>
                                    <option>$30-$50</option>
                                    <option>$50+</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm sm:text-base md:text-lg text-gray-900 text-fancy filter-text">Minimum Rating</label>
                                <select className="w-full mt-1 p-1 sm:p-1.5 md:p-2 border border-gray-300 rounded-md text-sm sm:text-base text-fancy filter-select">
                                    <option>Any Rating</option>
                                    <option>4.0+</option>
                                    <option>4.5+</option>
                                    <option>5.0</option>
                                </select>
                            </div>
                        </div>
                        <button className="mt-2 sm:mt-3 md:mt-4 w-full bg-amber-400 text-white font-bold py-1 sm:py-1.5 md:py-2 rounded-md hover:bg-amber-500 transition text-sm sm:text-base text-fancy">
                            Search Taskers
                        </button>
                    </div>
                </div>
                {/* Taskers List */}
                <div className="px-3 sm:px-4 md:px-6 pb-5 sm:pb-6 md:pb-8">
                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4 text-fancy">
                        Available Taskers
                    </h3>
                    <div className="space-y-2 sm:space-y-3 md:space-y-4 scrollbar-custom max-h-[50vh] overflow-y-auto">
                        {[
                            {
                                name: "Sarah Martinez",
                                image: tasker1,
                                rate: "$28/hr",
                                rating: 4.9,
                                reviews: 127,
                                badge: "TOP RATED",
                                specialty: "Home Cleaning Specialist • 8 years experience",
                                description:
                                    "Professional deep cleaning expert with eco-friendly products. I take pride in making every home spotless and fresh. Specializing in move-in/move-out cleaning and regular maintenance.",
                                tags: ["Eco-Friendly", "Deep Cleaning", "Move-in/Move-out", "Same Day"],
                                stats: [
                                    { label: "Tasks Completed", value: "250+" },
                                    { label: "On-time Rate", value: "98%" },
                                    { label: "Response Time", value: "2 hrs" },
                                ],
                                color: "amber-400",
                            },
                            {
                                name: "Mike Davidson",
                                image: tasker2,
                                rate: "$32/hr",
                                rating: 4.8,
                                reviews: 203,
                                badge: "EXPERIENCED",
                                specialty: "Professional Handyman • 15 years experience",
                                description:
                                    "Veteran handyman with expertise in home repairs, installations, and maintenance. From plumbing fixes to furniture assembly, I handle it all with precision and care. Licensed and insured professional.",
                                tags: ["Plumbing", "Electrical", "Furniture Assembly", "Licensed"],
                                stats: [
                                    { label: "Jobs Done", value: "420+" },
                                    { label: "Satisfaction", value: "96%" },
                                    { label: "Response Time", value: "1 hr" },
                                ],
                                color: "emerald-400",
                            },
                            {
                                name: "Alex Kim",
                                image: tasker3,
                                rate: "$25/hr",
                                rating: 5.0,
                                reviews: 89,
                                badge: "PERFECT RATING",
                                specialty: "Moving & Delivery Expert • 6 years experience",
                                description:
                                    "Reliable moving specialist with a perfect 5-star rating. I handle residential and commercial moves with care and efficiency. From packing to delivery, your belongings are safe with me.",
                                tags: ["Residential Moving", "Packing Expert", "Same Day", "Insured"],
                                stats: [
                                    { label: "Moves Done", value: "180+" },
                                    { label: "On-time", value: "100%" },
                                    { label: "Response Time", value: "30 min" },
                                ],
                                color: "rose-400",
                            },
                        ].map((tasker, i) => (
                            <div
                                key={i}
                                className="glass-effect p-3 sm:p-3 md:p-4 rounded-lg tasker-float relative"
                            >
                                {tasker.badge && (
                                    <span className="absolute -top-1 sm:-top-2 md:-top-3 -right-1 sm:-right-2 md:-right-3 bg-rose-500 text-white px-1 sm:px-1.5 md:px-2 py-0.5 text-[10px] sm:text-xs font-bold rounded-full shadow-md text-fancy">
                                        {tasker.badge}
                                    </span>
                                )}
                                <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                                    <Image
                                        src={tasker.image}
                                        alt={tasker.name}
                                        width={40}
                                        height={40}
                                        className="w-10 h-10 sm:w-12 sm:h-12 md:w-12 md:h-12 rounded-full object-cover"
                                        sizes="(min-width: 640px) 48px, 40px"
                                        placeholder="blur"
                                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8//8/AwAI/AL+5ezb4AAAAABJRU5ErkJggg=="
                                    />
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-0.5 sm:mb-1 md:mb-2">
                                            <h4 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 text-fancy">
                                                {tasker.name}
                                            </h4>
                                            <span className="text-gray-700 font-bold text-sm sm:text-base md:text-lg text-fancy">
                                                {tasker.rate}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1 md:mb-2">
                                            <span className="flex items-center gap-0.5 sm:gap-1">
                                                {[...Array(Math.floor(tasker.rating))].map((_, j) => (
                                                    <FaStar key={j} className="text-amber-500 text-[10px] sm:text-xs md:text-sm" />
                                                ))}
                                                {tasker.rating % 1 !== 0 && (
                                                    <FaStar className="text-amber-300 text-[10px] sm:text-xs md:text-sm" />
                                                )}
                                            </span>
                                            <span className="text-gray-600 text-[10px] sm:text-xs md:text-sm text-fancy">
                                                {tasker.rating}
                                            </span>
                                            <span className="text-gray-500 text-[10px] sm:text-xs md:text-sm text-fancy">
                                                ({tasker.reviews} reviews)
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-[10px] sm:text-xs md:text-sm text-italic mb-0.5 sm:mb-1 md:mb-2">
                                            {tasker.specialty}
                                        </p>
                                        <p className="text-gray-600 text-[10px] sm:text-xs md:text-sm mb-1 sm:mb-2 md:mb-3 text-fancy">
                                            {tasker.description}
                                        </p>
                                        <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2 mb-1 sm:mb-2 md:mb-3">
                                            {tasker.tags.map((tag, j) => (
                                                <span
                                                    key={j}
                                                    className="bg-gray-100 text-gray-700 px-1 sm:px-1.5 md:px-2 py-0.5 text-[9px] sm:text-xs rounded-full text-fancy"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-3 gap-1 sm:gap-1.5 md:gap-2 mb-1 sm:mb-2 md:mb-3">
                                            {tasker.stats.map((stat, j) => (
                                                <div key={j} className="text-center">
                                                    <p className="text-gray-700 font-bold text-[10px] sm:text-xs md:text-sm text-fancy">
                                                        {stat.value}
                                                    </p>
                                                    <p className="text-gray-500 text-[9px] sm:text-[10px] md:text-xs text-fancy">
                                                        {stat.label}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                        <button className="w-full bg-indigo-600 text-white font-bold py-1 sm:py-1.5 md:py-2 rounded-md hover:bg-indigo-700 transition text-[10px] sm:text-xs md:text-sm text-fancy flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2">
                                            <FaCheckCircle className="text-sm sm:text-base md:text-lg" />
                                            Select {tasker.name.split(" ")[0]}
                                        </button>
                                    </div>
                                </div>
                                <div
                                    className="mt-1 sm:mt-2 md:mt-3 h-0.5 sm:h-1 rounded-full"
                                    style={{ background: `linear-gradient(to right, transparent, ${tasker.color}, transparent)` }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FindTaskersModal;