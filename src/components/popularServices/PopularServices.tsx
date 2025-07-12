/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/resusable/SectionHeader";
import { useGetServicesQuery } from "@/features/api/servicesApi";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { FaTools } from "react-icons/fa";



const categories = ["All", "Home", "Personal", "Transportations", "Family"];

const PopularServices = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { data: services = [], isLoading } = useGetServicesQuery({});

  console.log(services)

  const filteredServices =
    selectedCategory === "All"
      ? services
      : services?.filter((service: { category: string; }) => service.category === selectedCategory);

  return (
    <div className="mt-12">
      <SectionHeader
        title="Popular Services"
        description="Find trusted professionals for all your needs, from everyday tasks to specialized help"
      />

      {/* Filters */}
      <div className="mt-12 flex justify-center px-4">
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
      </div>

      {/* Cards */}
      {isLoading ? (
        <p className="text-center text-gray-500 text-lg mt-10">Loading services...</p>
      ) : (
        <div
          key={selectedCategory}
          className="mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-center px-4 container mx-auto"
        >
          {filteredServices.map((service: { icon: any; _id: any; photos: (string | StaticImport)[]; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; tags: any[]; description: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; price: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, index: number) => {
            const Icon = service.icon || FaTools; 
            return (
              <div
                key={service._id || index}
                className="card-item bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-700 hover:scale-105 hover:shadow-2xl group opacity-0 translate-y-5 animate-[fadeUp_0.6s_ease-out_forwards]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-full h-48 relative overflow-hidden">
                  <Image
                    src={service.photos[0]} 
                    alt={typeof service.title === "string" ? service.title : "Service image"}
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
                    {service.tags?.map((tag, tagIdx) => (
                      <p
                        key={tagIdx}
                        className="bg-[#F2EEFD] text-[#8560F1] px-3 py-2 rounded-3xl text-sm font-semibold"
                      >
                        {tag}
                      </p>
                    ))}
                  </div>

                  <p className="text-[#72757E] mt-7">{service.description}</p>
                  <hr className="mt-12 border-purple-100" />

                  <div className="flex items-center justify-between mt-5">
                    <p className="text-lg text-[#8560F1] font-medium">
                      From ${service.price}/hr
                    </p>
                    <Link href={`/services/${service._id}`}>
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
