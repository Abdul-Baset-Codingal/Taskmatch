/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/resusable/SectionHeader";
import { useGetServicesQuery } from "@/features/api/servicesApi";
import { FaArrowRight, FaStar, FaClock, FaUsers } from "react-icons/fa";

const PopularServices = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { data: services = [], isLoading } = useGetServicesQuery({});

  const filteredServices =
    selectedCategory === "All"
      ? services
      : services?.filter((service: { category: string }) => service.category === selectedCategory);

  return (
    <section className="py-16 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-[#E5FFDB] text-[#109C3D] text-sm font-semibold rounded-full mb-4">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#063A41] mb-4">
            Popular Services
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Find trusted professionals for all your needs, from everyday tasks to specialized help
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[#E5FFDB] border-t-[#109C3D] rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Loading services...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredServices.map((service: any, index: number) => (
                <Link
                  key={service._id || index}
                  href={`/services/${service._id}`}
                  className="group"
                >
                  <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#109C3D]/20 transition-all duration-500 h-full flex flex-col">
                    {/* Image Container */}
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={service.photos?.[0] || "/placeholder.jpg"}
                        alt={service.title || "Service"}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 400px"
                        priority={index < 3}
                      />

                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#063A41]/80 via-[#063A41]/20 to-transparent" />

                      {/* Price Badge */}
                      <div className="absolute top-4 left-4">
                        <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text1">
                              ${service.basePrice}
                            </span>
                            <span className="text-sm text-gray-500">/hr</span>
                          </div>
                        </div>
                      </div>

                      {/* Title on Image */}
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight line-clamp-2">
                          {service.title}
                        </h3>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-grow">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4 min-h-[32px]">
                        {service.tags?.slice(0, 3).map((tag: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-[#E5FFDB] text-[#063A41] text-xs font-medium rounded-lg"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Description */}
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-5 flex-grow min-h-[40px]">
                        {service.description}
                      </p>

                      {/* CTA */}
                      <div className="flex items-center justify-between">
                        <span className="text-[#109C3D] font-semibold text-sm group-hover:text-[#063A41] transition-colors">
                          Find Taskers
                        </span>
                        <div className="w-10 h-10 rounded-full bg-[#063A41] group-hover:bg-[#109C3D] flex items-center justify-center transition-all duration-300 group-hover:translate-x-1">
                          <FaArrowRight className="text-white text-sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* View All Button */}
            {filteredServices.length > 6 && (
              <div className="text-center mt-12">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#063A41] hover:bg-[#109C3D] text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  View All Services
                  <FaArrowRight className="text-sm" />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default PopularServices;