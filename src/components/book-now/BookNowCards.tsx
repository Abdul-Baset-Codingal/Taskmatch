import React from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";

import tasker1 from "../../../public/Images/clientImage1.jpg";
import tasker2 from "../../../public/Images/clientImage2.jpg";
import tasker3 from "../../../public/Images/clientImage3.jpg";
import tasker4 from "../../../public/Images/clientImage4.jpg";
import tasker5 from "../../../public/Images/clientImage5.jpg";

const taskers = [
  {
    img: tasker1,
    name: "Emily R.",
    elite: true,
    rating: 5,
    reviews: 52,
    rate: 40,
    description:
      "Certified cleaning professional with 8+ years of experience. I specialize in deep cleaning, post-construction, and move-in/out cleaning. I guarantee a thorough job that will exceed your expectations.",
    services: [
      "Deep Cleaning",
      "Post-Construction",
      "Move In/Out",
      "Organizing",
    ],
    metrics: {
      completion: "100%",
      onTime: "100%",
      responseTime: "15 min",
    },
  },
  {
    img: tasker2,
    name: "David M.",
    elite: false,
    rating: 4,
    reviews: 34,
    rate: 35,
    description:
      "Experienced handyman offering services for repairs, furniture assembly, and home maintenance. Known for quick fixes and reliable service.",
    services: ["Furniture Assembly", "Minor Repairs", "Mounting"],
    metrics: {
      completion: "98%",
      onTime: "97%",
      responseTime: "30 min",
    },
  },
  {
    img: tasker3,
    name: "Sarah K.",
    elite: true,
    rating: 5,
    reviews: 60,
    rate: 50,
    description:
      "Professional organizer and cleaner. I help transform cluttered spaces into clean, functional environments with attention to detail.",
    services: ["Organizing", "Deep Cleaning", "Decluttering"],
    metrics: {
      completion: "100%",
      onTime: "99%",
      responseTime: "10 min",
    },
  },
  {
    img: tasker4,
    name: "James T.",
    elite: false,
    rating: 4,
    reviews: 27,
    rate: 45,
    description:
      "Skilled mover with 5+ years of experience. I ensure safe and efficient moving services including packing, lifting, and unloading.",
    services: ["Moving", "Packing", "Unloading"],
    metrics: {
      completion: "96%",
      onTime: "95%",
      responseTime: "20 min",
    },
  },
  {
    img: tasker5,
    name: "Olivia W.",
    elite: true,
    rating: 5,
    reviews: 48,
    rate: 55,
    description:
      "Detail-oriented cleaner with specialty in post-event and post-renovation cleaning. I bring my own supplies and work to perfection.",
    services: ["Post-Event Cleaning", "Move In/Out", "Brings Supplies"],
    metrics: {
      completion: "99%",
      onTime: "100%",
      responseTime: "12 min",
    },
  },
];

const BookNowCards = () => {
  return (
    <div className="grid grid-cols-1 gap-6">
      {taskers.map((t, idx) => (
        <div
          key={idx}
          className="w-full bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center p-6 gap-4">
            <Image
              src={t.img}
              alt={t.name}
              width={100}
              height={100}
              className="rounded-xl"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold">{t.name}</h3>
                {t.elite && (
                  <span className="px-2 py-0.5 bg-[#E8F5E9] text-green-600 text-xs font-medium rounded-full">
                    Elite Tasker
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 mt-1 text-sm text-[#F5A623]">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <FaStar key={i} />
                  ))}
                <span className="text-[#72757E] ml-2">
                  ({t.reviews} reviews)
                </span>
              </div>
            </div>
            <div className="ml-auto text-right">
              <p className="text-3xl text-[#8560F1] font-semibold">${t.rate}</p>
              <p className="text-sm text-[#72757E]">per hour</p>
            </div>
          </div>

          {/* Description */}
          <div className="px-6 pb-6">
            <p className="text-[#72757E] mb-4">{t.description}</p>

            {/* Services */}
            <div className="flex flex-wrap gap-2 mb-4">
              {t.services.map((svc, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-[#F3EDFF] text-[#8560F1] text-xs font-semibold rounded-full"
                >
                  {svc}
                </span>
              ))}
            </div>
            <hr className="my-5 border-t border-[#8560F1]" />
            {/* Metrics */}
            <div className="flex justify-between w-full items-center">
              <div>
                <div className="grid grid-cols-3 text-center text-sm text-[#72757E] my-5">
                  <div>
                    <p className="font-semibold text-[#2E2E2E]">
                      {t.metrics.completion}
                    </p>
                    <p>Completion</p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#2E2E2E]">
                      {t.metrics.onTime}
                    </p>
                    <p>On Time</p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#2E2E2E]">
                      {t.metrics.responseTime}
                    </p>
                    <p>Response Time</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3  ">
                <button className="px-4 py-2 text-sm font-semibold text-[#8560F1] border border-[#8560F1] rounded-lg hover:bg-[#f3edff] transition">
                  View Profile
                </button>
                <button className="px-4 py-2 text-sm font-semibold text-white bg-[#8560F1] rounded-lg hover:bg-[#6f48e1] transition">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookNowCards;
