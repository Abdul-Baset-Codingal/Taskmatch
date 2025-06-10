"use client";
import SectionHeader from "@/resusable/SectionHeader";
import React from "react";
import { HiLocationMarker } from "react-icons/hi";
import { BiTimeFive } from "react-icons/bi";
import client1 from "../../../public/Images/bannerImage1.jpg";
import client2 from "../../../public/Images/clientImage1.jpg";
import client3 from "../../../public/Images/clientImage2.jpg";
import Image from "next/image";
import { FaStar } from "react-icons/fa";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const tasks = [
  {
    title: "House Cleaning",
    description: "Helped assemble a full IKEA bedroom set in under 3 hours.",
    location: "New York, NY",
    status: "Completed",
    time: "5 minutes ago",
    image: client1,
    name: "John Doe",
  },
  {
    title: "Yard Work",
    description: "Mounted a 55-inch TV and soundbar securely on drywall.",
    location: "San Francisco, CA",
    status: "Completed",
    time: "25 minutes ago",
    image: client2,
    name: "Thomas D.",
  },
  {
    title: "Dog Walking",
    description:
      "Deep-cleaned a 2-bedroom apartment with eco-friendly products.",
    location: "Austin, TX",
    status: "In Progress",
    time: "Started 1 hour ago",
    image: client3,
    name: "Sarah L.",
  },
  {
    title: "Furniture Assembly",
    description: "Assembled a full dining table set with 6 chairs.",
    location: "Chicago, IL",
    status: "Completed",
    time: "2 hours ago",
    image: client2,
    name: "Emma R.",
  },
  {
    title: "Grocery Delivery",
    description: "Picked up and delivered groceries from local store.",
    location: "Boston, MA",
    status: "In Progress",
    time: "Just now",
    image: client1,
    name: "Michael K.",
  },
];

const GettingDone = () => {
  return (
    <div className="pt-20 ">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="See What Others Are Getting Done"
          description="Live tasks happening in your area right now"
        />

        <Swiper
          pagination={{ clickable: true }}
          spaceBetween={30}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 3 },
            1536: { slidesPerView: 3 },
          }}
          className="mt-20"
        >
          {tasks.map((task, index) => (
            <SwiperSlide key={index}>
              <div className="p-8 mb-20 rounded-xl shadow-xl hover:scale-105 transition-transform duration-500 bg-white h-full">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold mb-2">{task.title}</h3>
                  <p
                    className={`px-5 py-2 text-white font-bold rounded-3xl text-sm ${
                      task.status === "In Progress"
                        ? "bg-[#FF8906]"
                        : "bg-[#2CB67D]"
                    }`}
                  >
                    {task.status}
                  </p>
                </div>
                <div className="mt-8 flex items-center justify-between">
                  <p className="text-[#72757E] text-sm flex items-center gap-1">
                    <HiLocationMarker className="text-lg" />
                    {task.location}
                  </p>
                  <p className="text-[#72757E] text-sm flex items-center gap-1">
                    <BiTimeFive className="text-lg" />
                    {task.time}
                  </p>
                </div>
                <p className="mt-8 mb-3 font-medium">{task.description}</p>
                <div className="flex items-center gap-3 mt-8">
                  <div className="w-16 h-16 relative border-4 border-white shadow-2xl shadow-purple-600 rounded-full overflow-hidden">
                    <Image
                      src={task.image}
                      alt="Client"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{task.name}</p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, index) => (
                        <FaStar
                          key={index}
                          className="text-yellow-400 text-xs mr-[2px]"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default GettingDone;
