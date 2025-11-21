/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/resusable/SectionHeader";
import { useGetServicesQuery } from "@/features/api/servicesApi";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { FaArrowRight, FaServicestack, FaTag, FaTools } from "react-icons/fa";
import { IconType } from "react-icons";



const categories = ["All", "Home", "Personal", "Transportations", "Family"];

const PopularServices = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { data: services = [], isLoading } = useGetServicesQuery({});

  console.log(services)
  console.log(services)

  const filteredServices =
    selectedCategory === "All"
      ? services
      : services?.filter((service: { category: string; }) => service.category === selectedCategory);

  return (
    <div className="lg:mt-12 mt-4">
      <SectionHeader
        title="Popular Services"
        description="Find trusted professionals for all your needs, from everyday tasks to specialized help"
      />

      {/* Cards */}
      {isLoading ? (
        <p className="text-center text-gray-500 text-lg mt-10">Loading services...</p>
      ) : (
        <div
          key={selectedCategory}
          className="mt-4 lg:mt-8 lg:w-[1300px] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-center px-4 container mx-auto"
        >
          {filteredServices.map((service: { icon: IconType; _id: any; photos: (string | StaticImport)[]; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; basePrice: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; tags: any[]; description: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, index: any) => {
            const Icon = service.icon || FaTools;

            return (
              <div
                key={service._id || index}
                className=" relative bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:border-transparent hover:-translate-y-3"
              >
                {/* Image - Clean & Sharp */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                  <Image
                    src={service.photos[0]}
                    alt={service.title ? String(service.title) : "Service image"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 400px"
                    priority={index < 3} // Optional: faster load for first few
                  />

                  {/* Premium Price Badge - Top Right */}
                  <div className="absolute top-4 right-4 flex shadow-xl overflow-hidden rounded-xl">
                    <div className="bg-[#109C3D] px-5 py-3 text-white font-bold text-xl">
                      ${service.basePrice}
                    </div>
                    <div className="bg-[#063A41] px-4 py-3 text-white text-sm font-medium flex items-center">
                      /hour
                    </div>
                  </div>
                </div>

                {/* Content - Tight & Elegant */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-[#063A41] line-clamp-2 leading-tight mb-3">
                    {service.title}
                  </h3>

                  {/* Tags - Minimal & Modern */}
                  {service.tags && service.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {service.tags.slice(0, 4).map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#E5FFDB] text-[#109C3D] border border-[#109C3D]/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-6">
                    {service.description}
                  </p>

                  {/* CTA Button - Strong & Clean */}
                  <Link href={`/services/${service._id}`} className="block">
                    <button className="w-full bg-[#063A41] hover:bg-[#109C3D] text-white font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl">
                      Find Taskers
                      <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </Link>
                </div>

                {/* Elegant Hover Accent Line */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#109C3D] via-[#109C3D] to-[#063A41] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            );
          })}
        </div>


      )}


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
