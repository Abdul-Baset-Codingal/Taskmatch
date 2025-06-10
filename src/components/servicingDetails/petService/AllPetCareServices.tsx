"use client";
import React from "react";
import {
  FaDog,
  FaCat,
  FaMoon,
  FaHouseUser,
  FaPrescription,
} from "react-icons/fa";
import { MdCheckCircle } from "react-icons/md";

const services = [
  {
    icon: <FaDog />,
    title: "Dog Walking",
    description:
      "Regular exercise and outdoor time for your canine companion with attentive, experienced walkers.",
    features: [
      "Individual or group walks available",
      "Flexible scheduling (30 or 60 minutes)",
      "Regular updates and photos",
      "GPS tracking of walk routes",
      "Basic training reinforcement",
    ],
    price: "Starting at $20 (30-minute walk)",
    availability: "Available Daily",
    responseTime: "< 2 hours",
    accentColor: "[#8762F1]",
  },
  {
    icon: <FaHouseUser />,
    title: "Pet Sitting & Home Visits",
    description:
      "In-home care for pets who are happiest in their own environment while you're away.",
    features: [
      "Feeding and fresh water",
      "Medication administration",
      "Playtime and attention",
      "Litter box/waste cleanup",
      "Plant watering and mail collection",
    ],
    price: "Starting at $25 (30-minute visit)",
    availability: "Available Weekdays",
    responseTime: "< 4 hours",
    accentColor: "[#FF8906]",
  },
  {
    icon: <FaMoon />,
    title: "Overnight Pet Care",
    description:
      "Round-the-clock supervision and companionship for pets who need extra attention.",
    features: [
      "12-hour overnight stays",
      "Evening and morning routines",
      "Regular potty breaks",
      "Comfortable companionship",
      "Home security while you're away",
    ],
    price: "Starting at $75 (per night)",
    availability: "Available Fri–Sun",
    responseTime: "< 6 hours",
    accentColor: "[#29B584]",
  },
  {
    icon: <FaCat />,
    title: "Cat Care Visits",
    description:
      "Specialized visits for feline friends by cat-savvy sitters who understand their unique needs.",
    features: [
      "Feeding and fresh water",
      "Litter box cleaning",
      "Interactive playtime",
      "Brushing and petting",
      "Environmental enrichment",
    ],
    price: "Starting at $20 (30-minute visit)",
    availability: "Available Weekends",
    responseTime: "< 3 hours",
    accentColor: "[#8762F1]",
  },
  {
    icon: <FaPrescription />,
    title: "Medication Administration",
    description:
      "Reliable medication services for pets with special health needs or ongoing treatment.",
    features: [
      "Oral medication administration",
      "Injectable medications",
      "Wound care and cleaning",
      "Special feeding requirements",
      "Medical condition monitoring",
    ],
    price: "Starting at $30 (per visit)",
    availability: "Available Mon–Fri",
    responseTime: "< 2 hours",
    accentColor: "[#FF8906]",
  },
  {
    icon: <FaPrescription />,
    title: "Exotic Pet Care",
    description:
      "Specialized care for birds, reptiles, small mammals, and other exotic pets from knowledgeable caretakers.",
    features: [
      "Habitat maintenance",
      "Specialized feeding",
      "Temperature monitoring",
      "Enrichment activities",
      "Species-specific care routines",
    ],
    price: "Starting at $35 (per visit)",
    availability: "Available Tues & Thurs",
    responseTime: "< 5 hours",
    accentColor: "[#29B584]",
  },
];

const AllPetCareServices = () => {
  return (
    <div>
      <div>
        <div>
          <div className="w-full flex justify-center mt-10">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-[#7F5BF0] to-[#DCACFD] text-transparent bg-clip-text custom-font">
              Our Pet Care Services{" "}
            </h2>
          </div>
          <div className="flex justify-center mt-2">
            <div className="flex rounded-md justify-center h-[4px] w-[70px] bg-gradient-to-r from-[#8560F1] to-[#E7B6FE]"></div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 py-10 bg-gray-50">
        {services.map((svc, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-3xl border-t-4 border-${svc.accentColor} shadow-md hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 p-6 flex flex-col`}
          >
            {/* Icon */}
            <div className="text-4xl text-gray-700 mb-4 flex justify-center">
              {svc.icon}
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-1">
              {svc.title}
            </h2>

            {/* Price */}
            <p className={`text-center font-bold text-${svc.accentColor} mb-3`}>
              {svc.price}
            </p>

            {/* Description */}
            <p className="text-gray-600 text-sm text-center mb-4">
              {svc.description}
            </p>

            {/* Features */}
            <ul className="space-y-2 text-sm text-gray-700 flex-1">
              {svc.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2">
                  <MdCheckCircle
                    className={`text-${svc.accentColor} mt-[2px]`}
                  />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            {/* Tags */}
            <div className="flex justify-center gap-3 mt-6 mb-4 flex-wrap">
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                {svc.availability}
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                Response:{" "}
                <span className="font-semibold">{svc.responseTime}</span>
              </span>
            </div>

            {/* Button */}
            <button
              className={`mt-auto bg-${svc.accentColor} text-white font-semibold py-2 rounded-xl transition duration-300 hover:opacity-90`}
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllPetCareServices;
