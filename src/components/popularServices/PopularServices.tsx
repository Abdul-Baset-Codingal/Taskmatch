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
                className="relative group color3 p-5 rounded-2xl hover:rounded-2xl overflow-hidden  transition-all duration-500 transform hover:-translate-y-2 min-h-[450px]  flex flex-col"
              >
                {/* Image Section with Overlay */}
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={service.photos[0]}
                    alt={typeof service.title === "string" ? service.title : "Service image"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 rounded-2xl"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  {/* Price Badge */}
                  <div className="absolute bottom-0 left-[80px] color2 text-white text-2xl px-5 py-2 rounded-tl-[4px]   font-semibold shadow-lg transform group-hover:scale-105 transition-all duration-300">
                    ${service.basePrice}.00
                  </div>
                  <div className="absolute bottom-0 left-[180px] color1 text-white text-lg px-5 py-[10px] rounded-tr-[4px]   font-semibold shadow-lg transform group-hover:scale-105 transition-all duration-300">
                    Per Hour
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-2xl font-bold font-sans text1 tracking-tight">
                      {service.title}
                    </h3>
                  </div>

                  <div className="flex flex-col flex-wrap gap-2 mb-4">
                    {service.tags?.map((tag, tagIdx) => (
                      <span
                        key={tagIdx}
                        className="text-[#2F6F69] px-3 py-[2px] rounded-full font-medium tracking-wide transition-all duration-300"
                      >
                        <div className="flex items-center gap-2">
                          <FaTag className="text-[#2F6F69]" />
                          <span>{tag}</span>
                        </div>
                      </span>
                    ))}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                    {service.description}
                  </p>

                  {/* CTA */}
                  <div className="flex justify-center">
                    <Link href={`/services/${service._id}`}>
                      <button className="w-[250px] color2 px-6 py-3 rounded-3xl text-white  font-semibold tracking-wide shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3">
                        Explore Taskers
                        <span className="flex items-center justify-center w-7 h-7 rounded-full color1 transition-all duration-300 group-hover:color2">
                          <FaArrowRight className="text-white text-sm" />
                        </span>
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
