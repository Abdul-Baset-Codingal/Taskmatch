"use client";
import React, { useState } from "react";
import {
  FaBolt,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaFlagCheckered,
  FaUserFriends,
  FaCarSide,
  FaPlane,
  FaTrain,
  FaShoppingBag,
} from "react-icons/fa";

const BannerForm = () => {
  const [selected, setSelected] = useState("urgent");

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">
        🚗 Book a Ride Now
      </h2>

      <div className=" gap-6">
        <div className="bg-[#F6F7FF] p-6 rounded-2xl mt-8">
          <h3 className="text-[#845FF1] font-semibold mb-4">
            How soon do you need a ride?
          </h3>

            {/* Urgent Option */}
            <label
              className={`cursor-pointer block p-4 rounded-xl border transition-all duration-200 ${
                selected === "urgent"
                  ? "bg-white border-[#FF6E31] shadow"
                  : "bg-gray-100 border-transparent hover:bg-gray-200"
              }`}
            >
              <input
                type="radio"
                name="ride_time"
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
                    Driver will arrive as soon as possible
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
                name="ride_time"
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
                    Plan your ride in advance
                  </p>
                </div>
              </div>
            </label>
          </div>

        {/* Pickup Location */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">
            Pickup Location
          </label>
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-2">
            <FaMapMarkerAlt className="text-pink-500" />
            <input
              type="text"
              placeholder="Enter pickup address"
              className="bg-transparent w-full outline-none py-2"
            />
          </div>
        </div>

        {/* Dropoff Location */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">
            Dropoff Location
          </label>
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-2">
            <FaFlagCheckered className="text-green-600" />
            <input
              type="text"
              placeholder="Enter destination"
              className="bg-transparent w-full outline-none py-2"
            />
          </div>
        </div>

        {/* Passengers */}
        <div>
          <label className="block text-sm font-medium mb-1">Passengers</label>
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-2">
            <FaUserFriends className="text-purple-500" />
            <input
              type="number"
              min="1"
              placeholder="1 passenger"
              className="bg-transparent w-full outline-none py-2"
            />
          </div>
        </div>

        {/* Vehicle Type */}
        <div>
          <label className="block text-sm font-medium mb-1">Vehicle Type</label>
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-2">
            <FaCarSide className="text-blue-700" />
            <select className="bg-transparent w-full outline-none py-2">
              <option>Standard</option>
              <option>Luxury</option>
              <option>SUV</option>
            </select>
          </div>
        </div>
      </div>

      {/* Get Fare Button */}
      <div className="mt-6 text-center">
        <button className="bg-gradient-to-r from-[#845FF1] to-[#E3B3FE] hover:bg-[#2c2785] text-white font-semibold w-full py-2.5 rounded-xl transition">
          Get Fare
        </button>
      </div>

      {/* Popular Destinations */}
      <div className="mt-8">
        <h4 className="text-sm font-semibold mb-2 text-gray-600">Popular:</h4>
        <div className="flex flex-wrap gap-4">
          <span className="bg-gray-200 px-4 py-2 rounded-full flex items-center gap-2 text-sm">
            <FaPlane /> Airport
          </span>
          <span className="bg-gray-200 px-4 py-2 rounded-full flex items-center gap-2 text-sm">
            <FaTrain /> Union
          </span>
          <span className="bg-gray-200 px-4 py-2 rounded-full flex items-center gap-2 text-sm">
            <FaShoppingBag /> Eaton
          </span>
        </div>
      </div>
    </div>
  );
};

export default BannerForm;
