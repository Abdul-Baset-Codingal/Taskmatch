/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import Image from "next/image";

import client1 from "../../../../public/Images/clientImage1.jpg";
import client2 from "../../../../public/Images/clientImage2.jpg";
import client3 from "../../../../public/Images/clientImage3.jpg";

type Specialist = {
  name: string;
  role: string;
  reviews: number;
  location: string;
  experience: number;
  quote: string;
  specialties: string[];
  testimonial: string;
  reviewer: string;
  price: number;
  availability: string;
  responseTime: string;
  image: any;
  accentTextClass: string;
  accentBgClass: string;
  accentBg2class: string;
  accentBorderClass: string;
};

const specialists: Specialist[] = [
  {
    name: "Sophia L.",
    role: "Cat Specialist",
    reviews: 45,
    location: "Ottawa, ON",
    experience: 4,
    quote:
      "Certified cat behavior specialist who understands the unique needs of feline friends. I provide calm, patient care for cats of all temperaments.",
    specialties: ["🐱 Cat Sitting", "😌 Shy/Anxious Pets", "🏠 Home Visits"],
    testimonial:
      "Our extremely shy cat actually came out to greet Sophia during visits! I've never seen him warm up to anyone so quickly. She has a real gift with cats.",
    reviewer: "Jennifer K.",
    price: 25,
    availability: "Available all week",
    responseTime: "< 1 hour",
    image: client1,
    accentTextClass: "text-[#8762F1]",
    accentBgClass: "bg-[#8762F1]",
    accentBg2class: "bg-[#F5F3FE]",
    accentBorderClass: "border-[#8762F1]",
  },
  {
    name: "Jack M.",
    role: "Dog Trainer",
    reviews: 42,
    location: "Mississauga, ON",
    experience: 7,
    quote:
      "Former veterinary assistant with extensive experience handling all types of pets. I specialize in high-energy dogs that need plenty of exercise and playtime.",
    specialties: [
      "🏃‍♂️ Active Dog Walking",
      "🎓 Pet Training",
      "❤️‍🩹 Special Needs Pets",
    ],
    testimonial:
      "Jack is incredible with our hyperactive Lab! After his walks, our dog is content and calm. He's also given us great training tips that have made a real difference.",
    reviewer: "Michael R.",
    price: 30,
    availability: "Available weekdays",
    responseTime: "< 3 hours",
    image: client2,
    accentTextClass: "text-[#FF8906]",
    accentBgClass: "bg-[#FF8906]",
    accentBg2class: "bg-[#FDF7F0]",
    accentBorderClass: "border-[#FF8906]",
  },
  {
    name: "Emily R.",
    role: "Cat Specialist",
    location: "Toronto, ON",
    experience: 5,
    quote: "Certified cat specialist with 5 years of experience. I ensure every cat feels safe and loved in my care.",
    specialties: ["🐱 Playtime", "🐾 Grooming", "🏠 Home Visits"],
    testimonial: "Emily is amazing! My cats love her and she's so attentive to their needs.",
    reviewer: "Alex P.",
    price: 28,
    availability: "Weekends",
    responseTime: "< 2 hours",
    image: client3,
    accentTextClass: "text-[#29B584]",
    accentBgClass: "bg-[#29B584]",
    accentBg2class: "bg-[#F0F9F7]",
    accentBorderClass: "border-[#29B584]",
    reviews: 0
  },
];

const SpecialistCard = ({ specialist }: { specialist: Specialist }) => {
  const {
    name,
    role,
    reviews,
    location,
    experience,
    quote,
    specialties,
    testimonial,
    reviewer,
    price,
    availability,
    responseTime,
    image,
    accentTextClass,
    accentBgClass,
    accentBg2class,
    accentBorderClass,
  } = specialist;

  return (
    <div className="bg-white transform transition-all duration-700 hover:scale-105 hover:shadow-2xl rounded-[42px] shadow-lg p-8 max-w-lg mx-auto flex flex-col gap-4 text-gray-800 relative">
      {/* Accent bar at the top */}
      <div
        className={`absolute top-0 left-0 right-0 h-2 rounded-t-3xl ${accentBgClass}`}
      />

      {/* Profile */}
      <div className="flex items-center gap-5 relative z-10">
        <div className="inline-block bg-white rounded-full p-1 border-4 border-white shadow-md">
          <Image
            src={image}
            alt={name}
            width={96}
            height={96}
            className="rounded-full object-cover"
          />
        </div>

        <div>
          <h3 className={`text-2xl font-extrabold ${accentTextClass}`}>
            {role.toUpperCase()}
          </h3>
          <p className="text-xl font-semibold">{name}</p>
          <p className={`${accentTextClass} font-bold`}>
            ★★★★★ <span className="text-gray-600">({reviews} reviews)</span>
          </p>
          <p className="text-gray-700 italic">{location}</p>
        </div>
      </div>

      {/* Experience & Quote */}
      <div
        className={`border-l-4 ${accentBg2class} ${accentBorderClass} rounded-2xl pl-4 pt-4 pb-2 italic font-medium text-gray-900 text-sm relative z-10`}
      >
        <p className="mb-1">
          <span className="font-bold">Experience:</span> {experience} years
        </p>
        <p className="mb-2 text-gray-700">“{quote}”</p>
      </div>

      {/* Specialties */}
      <div className="relative z-10">
        <h4 className={`font-semibold text-lg mb-1 ${accentTextClass}`}>
          ⭐ Specialties:
        </h4>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          {specialties.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>

      {/* Testimonial */}
      <blockquote
        className={`border-l-4 ${accentBg2class} ${accentBorderClass} p-6 italic text-gray-800 mt-4 relative z-10 rounded-3xl`}
      >
        “{testimonial}”
        <footer
          className={`mt-1 font-bold ${accentTextClass}`}
        >{`- ${reviewer}`}</footer>
      </blockquote>

      {/* Pricing & Availability Card - Fancy Version */}
      <div
        className={`${accentBg2class} border-[#FF8906]/30 rounded-2xl shadow-xl p-6 mt-6 w-full max-w-xl mx-auto`}
      >
        <h2
          className={`text-2xl font-bold ${accentTextClass} mb-5 flex items-center gap-2`}
        >
          <svg
            className={`w-6 h-6 ${accentTextClass} `}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8c1.333-2.667 4-4 6-4s4 1.333 4 4-2.667 6-8 12c-5.333-6-8-9.333-8-12s2.667-4 4-4 4 1.333 6 4z"
            />
          </svg>
          Pricing & Availability
        </h2>

        <div className="flex flex-wrap gap-4 items-center text-[#333] font-medium">
          <span
            className={`bg-${accentBg2class} ${accentTextClass} rounded-full px-4 py-2 shadow-inner text-sm font-semibold`}
          >
            ${price}/hour
          </span>
          <span
            className={`bg-${accentBg2class} ${accentTextClass} rounded-full px-4 py-2 shadow-inner text-sm font-semibold`}
          >
            {availability}
          </span>
          <span
            className={`bg-${accentBg2class} ${accentTextClass} rounded-full px-4 py-2 shadow-inner text-sm font-semibold`}
          >
            Response time: <span className="font-bold">{responseTime}</span>
          </span>
        </div>
      </div>

      {/* Book Button */}
      <button
        className={`${accentBgClass} text-white font-bold rounded-xl px-6 py-2 shadow-lg relative z-10 hover:opacity-90 transition`}
      >
        Book {name.split(" ")[0]} Now
      </button>
    </div>
  );
};

const SpecialistCardsGrid = () => {
  return (
    <div className="bg-[#F3F6FF]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-10 bg-gray-50 min-h-screen">
        {specialists.map((specialist, i) => (
          <SpecialistCard key={i} specialist={specialist} />
        ))}
      </div>
      <div className="flex justify-center mt-6">
       <button className="bg-gradient-to-r from-[#8E6AF2] to-[#E2B3FE] text-lg rounded-4xl py-4 px-12 text-white font-bold">Browse All Pet Specialists</button>
      </div>
    </div>
  );
};

export default SpecialistCardsGrid;
