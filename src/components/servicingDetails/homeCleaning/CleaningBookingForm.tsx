/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import {
  FaBolt,
  FaCalendarAlt,
  FaHome,
  FaClock,
  FaUserCheck,
} from "react-icons/fa";
import client1 from "../../../../public/Images/clientImage1.jpg";
import client2 from "../../../../public/Images/clientImage2.jpg";
import client3 from "../../../../public/Images/clientImage3.jpg";
import client4 from "../../../../public/Images/clientImage4.jpg";
import Image from "next/image";

export default function CleaningBookingForm() {
  const [selected, setSelected] = useState("urgent");
  const [cleaner, setCleaner] = useState("random");

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">
        🧹 Book a Cleaning Now
      </h2>

      <div className="bg-[#F6F7FF] p-6 rounded-2xl">
        <h3 className="text-[#845FF1] font-semibold mb-4">
          How soon do you need cleaning?
        </h3>

        {/* Urgent Option */}
        <label
          className={`cursor-pointer block p-4 rounded-xl border transition-all duration-200 mb-4 ${
            selected === "urgent"
              ? "bg-white border-[#FF6E31] shadow"
              : "bg-gray-100 border-transparent hover:bg-gray-200"
          }`}
        >
          <input
            type="radio"
            name="cleaning_time"
            value="urgent"
            className="hidden"
            checked={selected === "urgent"}
            onChange={() => setSelected("urgent")}
          />
          <div className="flex gap-4 items-start">
            <FaBolt className="text-yellow-500 text-xl mt-1" />
            <div>
              <h4 className="font-semibold">Urgent - ASAP</h4>
              <p className="text-sm text-gray-600">
                Cleaner will arrive as soon as possible
              </p>
            </div>
          </div>
        </label>

        {/* Schedule Option */}
        <label
          className={`cursor-pointer block p-4 rounded-xl border transition-all duration-200 ${
            selected === "schedule"
              ? "bg-white border-[#FF6E31] shadow"
              : "bg-gray-100 border-transparent hover:bg-gray-200"
          }`}
        >
          <input
            type="radio"
            name="cleaning_time"
            value="schedule"
            className="hidden"
            checked={selected === "schedule"}
            onChange={() => setSelected("schedule")}
          />
          <div className="flex gap-4 items-start">
            <FaCalendarAlt className="text-blue-500 text-xl mt-1" />
            <div>
              <h4 className="font-semibold">Schedule Timeline</h4>
              <p className="text-sm text-gray-600">
                Plan your cleaning in advance
              </p>
            </div>
          </div>
        </label>
      </div>

      {/* Address */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-1">Home Address</label>
        <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-2">
          <FaHome className="text-pink-500" />
          <input
            type="text"
            placeholder="Enter your home address"
            className="bg-transparent w-full outline-none py-2"
          />
        </div>
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-2">
            <FaCalendarAlt className="text-blue-500" />
            <input
              type="date"
              className="bg-transparent w-full outline-none py-2"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Time</label>
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-2">
            <FaClock className="text-purple-500" />
            <input
              type="time"
              className="bg-transparent w-full outline-none py-2"
            />
          </div>
        </div>
      </div>

      {/* Choose Cleaner */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">
          Choose Your Preferred Cleaner (Optional)
        </label>

        {/* Slider container */}
        <div className="relative overflow-hidden">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2 px-1">
            {/* Random Match */}
            <div
              onClick={() => setCleaner("random")}
              className={`min-w-[200px] cursor-pointer flex-shrink-0 rounded-xl p-4 border transition ${
                cleaner === "random"
                  ? "bg-white border-[#FF6E31] shadow"
                  : "bg-gray-100 border-transparent hover:bg-gray-200"
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <FaUserCheck className="text-green-500 text-3xl mb-2" />
                <h4 className="font-semibold">Random Match</h4>
                <p className="text-sm text-gray-600 mt-1">
                  We'll assign you a top-rated cleaner.
                </p>
              </div>
            </div>

            {/* Cleaner Cards */}
            {[
              {
                name: "Sarah J.",
                rating: "4.9",
                tag: "Deep Clean Pro",
                image: client1,
              },
              {
                name: "Michael T.",
                rating: "4.8",
                tag: "Eco Friendly",
                image: client2,
              },
              {
                name: "Emily R.",
                rating: "5.0",
                tag: "Move-in Expert",
                image: client3,
              },
              {
                name: "David K.",
                rating: "4.7",
                tag: "Pet Friendly",
                image: client4,
              },
            ].map((c) => (
              <div
                key={c.name}
                onClick={() => setCleaner(c.name)}
                className={`min-w-[200px] cursor-pointer flex-shrink-0 rounded-xl p-4 border transition ${
                  cleaner === c.name
                    ? "bg-white border-[#845FF1] shadow"
                    : "bg-gray-100 border-transparent hover:bg-gray-200"
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <Image
                    src={c.image}
                    alt={c.name}
                    width={80}
                    height={80}
                    className="rounded-full object-cover mb-2"
                  />

                  <h4 className="font-semibold">{c.name}</h4>
                  <p className="text-sm text-gray-600">{c.tag}</p>
                  <p className="text-sm text-yellow-500 font-medium mt-1">
                    ⭐ {c.rating}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Home Size & Cleaning Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <label className="block text-sm font-medium mb-1">Home Size</label>
          <select className="w-full bg-gray-100 rounded-xl px-4 py-2 outline-none">
            <option>1 Bedroom</option>
            <option>2 Bedroom</option>
            <option>3 Bedroom</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Cleaning Type
          </label>
          <select className="w-full bg-gray-100 rounded-xl px-4 py-2 outline-none">
            <option>Standard Clean</option>
            <option>Deep Clean</option>
            <option>Move-In</option>
          </select>
        </div>
      </div>

      {/* Get Price Button */}
      <div className="mt-6 text-center">
        <button className="bg-gradient-to-r from-[#845FF1] to-[#E3B3FE] hover:bg-[#2c2785] text-white font-semibold w-full py-2.5 rounded-xl transition">
          Get Price Estimate
        </button>
      </div>

      {/* Popular Options */}
      <div className="mt-8">
        <h4 className="text-sm font-semibold mb-2 text-gray-600">Popular:</h4>
        <div className="flex flex-wrap gap-4">
          <span className="bg-gray-200 px-4 py-2 rounded-full text-sm">
            ✨ Standard
          </span>
          <span className="bg-gray-200 px-4 py-2 rounded-full text-sm">
            🧹 Deep Clean
          </span>
          <span className="bg-gray-200 px-4 py-2 rounded-full text-sm">
            📦 Move-In
          </span>
        </div>
      </div>
    </div>
  );
}
