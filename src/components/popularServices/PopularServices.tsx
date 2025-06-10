"use client";
import { useState } from "react";
import Image from "next/image";
import SectionHeader from "@/resusable/SectionHeader";
import { FaBroom, FaTools, FaSpa, FaCar, FaBaby, FaDog } from "react-icons/fa";

// Images
import homeCleaning from "../../../public/Images/homeCleaning.jpg";
import handyman from "../../../public/Images/handyman.jpg";
import beautyWellness from "../../../public/Images/beautyWellness.jpg";
import familyCare from "../../../public/Images/familyCare.jpg";
import petServicing from "../../../public/Images/petServicing.jpg";
import automotiveService from "../../../public/Images/automotiveService.jpg";
import Link from "next/link";

// Service data
const servicesData = [
  {
    image: homeCleaning,
    title: "Home Cleaning",
    icon: FaBroom,
    price: 40,
    tags: ["Deep clean", "Move in/out", "Regular"],
    advertise: "Professional cleaners to make your home shine.",
    category: "Home",
    route: "/homeCleaning",
  },
  {
    image: handyman,
    title: "Handyman Service",
    icon: FaTools,
    tags: ["Repairs", "Installation", "Maintenance"],
    price: 55,
    advertise: "Quality repairs, installations, and maintenance for your home.",
    category: "Home",
    route: "/handyMan",
  },
  {
    image: beautyWellness,
    title: "Beauty & Wellness",
    icon: FaSpa,
    price: 50,
    tags: ["Massage", "Facial", "Spa"],
    advertise: "Relaxing treatments to help you look and feel your best.",
    category: "Personal",
    route: "/beautyWellness",
  },
  {
    image: familyCare,
    title: "Family Care",
    icon: FaBaby,
    price: 45,
    tags: ["Elderly", "Children", "Newborns"],
    advertise:
      "Compassionate care services for all ages from newborns to seniors.",
    category: "Family",
    route: "/familyCare",
  },
  {
    image: petServicing,
    title: "Pet Servicing",
    icon: FaDog,
    price: 35,
    tags: ["Dog Walking", "Pet Sitting", "Training"],
    advertise:
      "Trusted care for your furry, feathery, or scaly friends when you're away.",
    category: "Personal",
    route: "/petService",
  },
  {
    image: automotiveService,
    title: "Automotive Service",
    icon: FaCar,
    price: 60,
    tags: ["Oil Change", "Tire Service", "Brake Repair"],
    advertise: "Professional automobile maintenance and repair services.",
    category: "Transportations",
    route: "/automotive",
  },
];

const categories = ["All", "Home", "Personal", "Transportations", "Family"];

const PopularServices = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredServices =
    selectedCategory === "All"
      ? servicesData
      : servicesData.filter((service) => service.category === selectedCategory);

  return (
    <div className="mt-12">
      <SectionHeader
        title="Popular Services"
        description="Find trusted professionals for all your needs, from everyday tasks to specialized help"
      />

      {/* Filters */}
      <div className="mt-12 flex justify-center">
        <div className="flex gap-8 items-center">
          <h2 className="font-semibold">Filter by category:</h2>
          <div className="flex gap-3 flex-wrap justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-3xl cursor-pointer ${
                  selectedCategory === category
                    ? "bg-[#8560F1] text-white font-semibold"
                    : "bg-[#F2EEFD] text-[#8560F1] "
                } hover:-translate-y-1 transform transition duration-300`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards */}
      <div
        key={selectedCategory}
        className="mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-center px-4 container mx-auto"
      >
        {filteredServices.map((service, index) => {
          const Icon = service.icon;
          return (
            <div
              key={service.title}
              className="card-item bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-700 hover:scale-105 hover:shadow-2xl group opacity-0 translate-y-5 animate-[fadeUp_0.6s_ease-out_forwards]"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="w-full h-48 relative overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover rounded-3xl transform transition duration-500 group-hover:scale-110"
                />
              </div>
              <div className="pt-5 pb-20 px-8 space-y-2">
                <div className="text-[#8560F1]">
                  <Icon className="text-5xl ml-6 mt-3" />
                </div>
                <h3 className="text-2xl font-semibold text-black mt-10">
                  {service.title}
                </h3>

                <div className="flex gap-2 mt-4 flex-wrap">
                  {service.tags.map((tag, tagIdx) => (
                    <p
                      key={tagIdx}
                      className="bg-[#F2EEFD] text-[#8560F1] px-3 py-2 rounded-3xl text-sm font-semibold"
                    >
                      {tag}
                    </p>
                  ))}
                </div>

                <p className="text-[#72757E] mt-7">{service.advertise}</p>
                <hr className="mt-12 border-purple-100" />

                <div className="flex items-center justify-between mt-5">
                  <p className="text-lg text-[#8560F1] font-medium">
                    From ${service.price}/hr
                  </p>
                  <Link href={service.route}>
                    <button className="bg-[#8560F1] px-4 text-sm font-bold text-white py-2 rounded-3xl hover:scale-110 transform transition duration-700 hover:bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] cursor-pointer">
                      Book Now
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <style jsx>{`
        @keyframes fadeUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default PopularServices;
