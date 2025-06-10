"use client";
import React from "react";
import Image from "next/image";
import { FaDog, FaCat } from "react-icons/fa";
import { MdOutlinePets } from "react-icons/md";

const services = [
  {
    title: "Dog Walking Services",
    image: "/Images/dogWalking.jpg",
    icon: <FaDog />,
    tags: ["30-Min Walks", "60-Min Walks", "Group Walks"],
    advertise:
      "Regular exercise and bathroom breaks for your canine companion, ensuring they stay healthy and happy.",
    price: 20,
    stats: ["250+ Walkers", "15k+ Walks", "4.9 Rating"],
    quote:
      '"Absolutely love the dog walkers! My pup is always so happy and tired after his walks."',
    name: "- Alex K.",
  },
  {
    title: "Cat Sitting Services",
    image: "/Images/catSitting.jpg",
    icon: <FaCat />,
    tags: ["Daily Visits", "Litter Box", "Playtime"],
    advertise:
      "In-home visits for your feline friend, including feeding, litter box cleaning, and interactive play.",
    price: 18,
    stats: ["200+ Sitters", "12k+ Visits", "4.8 Rating"],
    quote:
      '"My cat is very particular, but she loves our TaskMatch sitter! Peace of mind while traveling."',
    name: "- Maria J.",
  },
  {
    title: "Exotic Pet Care Services",
    image: "/Images/exotingPetCare.jpg",
    icon: <MdOutlinePets />,
    tags: ["Reptiles", "Birds", "Small Mammals"],
    advertise:
      "Specialized care for exotic pets including reptiles, birds, small mammals, and more.",
    price: 25,
    stats: ["75+ Specialists", "3k+ Services", "4.9 Rating"],
    quote:
      '"Finally found someone who understands reptiles! My bearded dragon is in excellent hands."',
    name: "- Jordan T.",
  },
];

const PetServiceCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
      {services.map((service, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-700 hover:scale-105 hover:shadow-2xl "
        >
          <div className="w-full h-48 relative">
            <Image
              src={service.image}
              alt={service.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="text-[#8560F1] text-5xl">{service.icon}</div>
            <h3 className="text-2xl font-bold">{service.title}</h3>

            <div className="flex gap-2 flex-wrap">
              {service.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-[#F2EEFD] text-[#8560F1] px-3 py-1 rounded-3xl text-sm font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
            {/* Advertise Text */}
            <p className="text-[16px] text-gray-600 leading-relaxed  bg-gradient-to-br from-[#f3e8ff] to-[#ede9fe] border border-[#d8b4fe] px-6 py-4 rounded-2xl shadow-inner tracking-wide">
              {service.advertise}
            </p>

            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-4 mt-6 text-center">
              {service.stats.map((stat, i) => {
                const [value, ...labelParts] = stat.split(" ");
                const label = labelParts.join(" ");
                return (
                  <div
                    key={i}
                    className="bg-gradient-to-tr from-[#ede9fe] to-[#f3e8ff] p-4 rounded-2xl shadow-lg border border-[#e2d3fe] hover:shadow-xl transition duration-300"
                  >
                    <p className="text-3xl font-extrabold text-[#7c3aed] drop-shadow-sm tracking-tight">
                      {value}
                    </p>
                    <p className="text-sm mt-1 text-[#5b4b8a] font-semibold tracking-wide uppercase">
                      {label}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Quote Box */}
            <blockquote className="mt-8 bg-white border-l-4 border-[#c084fc] p-6 rounded-xl shadow-md">
              <p className="italic text-gray-600 text-[15px] font-medium leading-relaxed relative before:content-['“'] before:text-3xl before:text-[#c084fc] before:absolute before:-top-2 before:-left-3">
                {service.quote}
              </p>
            </blockquote>

            <p className="text-right text-sm text-gray-500 font-medium">
              {service.name}
            </p>

            <div className="mt-4 flex justify-between items-center">
              <p className="text-[#8560F1] font-semibold">
                From ${service.price}/visit
              </p>
              <button className="bg-[#8560F1] text-white px-4 py-2 rounded-full text-sm hover:bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] transition font-bold">
                Book Now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PetServiceCards;
