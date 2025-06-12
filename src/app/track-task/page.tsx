"use client";

import Navbar from "@/shared/Navbar";
import React from "react";
import client1 from "../../../public/Images/clientImage1.jpg";
import Image from "next/image";
import TrackTask from "@/components/track-task/TrackTask";
import { FiMessageCircle, FiPhoneCall, FiRefreshCcw } from "react-icons/fi";

const cards = [
  {
    icon: "🚗",
    title: "Current Status",
    detail: "En Route to Your Location",
  },
  {
    icon: "⏱️",
    title: "Estimated Time of Arrival",
    detail: "15 minutes (ETA 3:45 PM)",
  },
  {
    icon: "📱",
    title: "Contact Info",
    detail: "+1 (555) 123-4567",
  },
  {
    icon: "🚩",
    title: "Current Location",
    detail: "Heading north on King St",
  },
];

const page = () => {
  return (
    <div>
      <Navbar />

      {/* Status Header */}
      <div className="flex justify-center mt-6 px-4">
        <div className="w-full max-w-5xl bg-[#10B0A9] p-5 flex flex-col lg:flex-row justify-between items-center gap-4 rounded-3xl">
          <button className="text-white font-bold px-5 py-2 border rounded-3xl flex items-center gap-2 text-sm text-center">
            <span className="w-3 h-3 rounded-full bg-white"></span> Tasker is en
            route to your location
          </button>
          <button className="text-white font-semibold py-2 px-4 shadow-2xl rounded-3xl bg-white/10 flex items-center gap-2 text-sm">
            <FiRefreshCcw className="text-white text-base" />
            Refresh Status
          </button>
        </div>
      </div>

      {/* Client Info */}
      <div className="flex justify-center mt-10 px-4">
        <div className="w-full max-w-5xl py-8 px-6 shadow-2xl rounded-xl bg-white">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {/* Image */}
            <div className="w-[100px] h-[100px] relative rounded-full overflow-hidden">
              <Image
                src={client1}
                alt="Client Image"
                layout="fill"
                objectFit="cover"
              />
            </div>

            {/* Text Info */}
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-gray-800">John D.</h3>
              <p className="text-[#FF7000] mt-2">★★★★★ (48 reviews)</p>
              <p className="mt-2 text-gray-500">
                Specializes in: Plumbing, Home Repairs, Electrical
              </p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-3 mt-4">
                <button className="bg-[#E0E7FF] py-2 px-4 text-blue-500 rounded-2xl font-semibold flex items-center justify-center gap-2 text-sm">
                  <FiMessageCircle className="text-blue-500 text-lg" />
                  Message
                </button>
                <button className="bg-[#FEF3C7] py-2 px-4 text-yellow-500 rounded-2xl font-semibold flex items-center justify-center gap-2 text-sm">
                  <FiPhoneCall className="text-yellow-500 text-lg" />
                  Call
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Info Section */}
      <div className="flex justify-center mt-10 px-4">
        <div className="w-full max-w-5xl shadow-2xl p-6 rounded-xl bg-white flex flex-col lg:flex-row gap-8">
          {/* Map / Location Section (Placeholder) */}
          <div className="w-full lg:w-1/2 h-60 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm">
            Map / Location Preview
          </div>

          {/* Info Cards */}
          <div className="w-full lg:w-1/2">
            <div className="grid grid-cols-1 gap-5">
              {cards.map((card, index) => (
                <div
                  key={index}
                  className="flex items-center gap-5 bg-white shadow-md p-5 rounded-xl border-l-4 border-[#8560F1] hover:bg-[#E0E7FF] transition"
                >
                  {/* Icon */}
                  <div className="bg-[#8560F1] text-white text-2xl rounded-full p-3 w-12 h-12 flex items-center justify-center">
                    {card.icon}
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className="text-sm text-gray-600">{card.title}</h3>
                    <p className="text-base font-semibold text-gray-800">
                      {card.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tracking Component */}
      <div className="mt-12">
        <TrackTask />
      </div>
    </div>
  );
};

export default page;
