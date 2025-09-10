/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/resusable/SectionHeader";
import { useGetServicesQuery } from "@/features/api/servicesApi";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { FaTools } from "react-icons/fa";
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

      {/* Filters */}
      {/* <div className="mt-12 flex justify-center px-4">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-center text-center">
          <h2 className="font-semibold text-lg lg:text-xl">
            Filter by category:
          </h2>
          <div className="flex gap-3 flex-wrap justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 md:px-6 md:py-3 rounded-3xl cursor-pointer ${selectedCategory === category
                  ? "bg-[#8560F1] text-white font-semibold"
                  : "bg-[#F2EEFD] text-[#8560F1]"
                  } hover:-translate-y-1 transform transition duration-300 text-sm md:text-base`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div> */}

      {/* Cards */}
      {isLoading ? (
        <p className="text-center text-gray-500 text-lg mt-10">Loading services...</p>
      ) : (
          <div
            key={selectedCategory}
            className="mt-4 lg:mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-center px-4 container mx-auto"
          >
            {filteredServices.map((service: { icon: IconType; _id: any; photos: (string | StaticImport)[]; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; basePrice: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; tags: any[]; description: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, index: any) => {
              const Icon = service.icon || FaTools;

              return (
                <div
                  key={service._id || index}
                  className="relative group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                >
                  {/* Image Section with Overlay */}
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={service.photos[0]}
                      alt={typeof service.title === "string" ? service.title : "Service image"}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    {/* Price Badge */}
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-[#6B46C1] to-[#A78BFA] text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg transform group-hover:scale-105 transition-all duration-300">
                      ${service.basePrice}/hr
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex flex-col justify-between bg-gradient-to-br from-white to-[#F8F4FF]">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-4">
                     
                      <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                        {service.title}
                      </h3>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {service.tags?.map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className="bg-[#EDE9FE] text-[#6B46C1] px-3 py-1 rounded-full text-xs font-medium tracking-wide hover:bg-[#D6BCFA] hover:text-white transition-all duration-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                      {service.description}
                    </p>

                    {/* CTA */}
                    <div>
                      <Link href={`/services/${service._id}`}>
                        <button className="w-full bg-gradient-to-r from-[#6B46C1] to-[#A78BFA] px-6 py-3 rounded-xl text-white font-semibold tracking-wide shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                          Book Now
                        </button>
                      </Link>
                    </div>
                  </div>

                  {/* Decorative Element */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#A78BFA]/20 to-transparent rounded-full -mr-12 -mt-12 group-hover:scale-125 transition-all duration-500"></div>
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
