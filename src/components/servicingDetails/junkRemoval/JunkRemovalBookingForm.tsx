/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from "react";
import {
  FaHeartbeat,
  FaCalendarAlt,
  FaClock,
  FaUserCheck,
} from "react-icons/fa";
import Image from "next/image";

// Dummy images - you can replace these with your own junk removal tasker images
import tasker1 from "../../../../public/Images/clientImage1.jpg";
import tasker2 from "../../../../public/Images/clientImage2.jpg";
import tasker3 from "../../../../public/Images/clientImage3.jpg";
import tasker4 from "../../../../public/Images/clientImage4.jpg";

export default function JunkRemovalBookingForm() {
  const [urgency, setUrgency] = useState("urgent");
  const [tasker, setTasker] = useState("random");
  const [customerName, setCustomerName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("09:00");
  const [serviceType, setServiceType] = useState("Small Load");
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [breakdown, setBreakdown] = useState({
    baseFee: 0,
    urgencyFee: 0,
    taskerFee: 0,
  });

  const calculatePrice = () => {
    let base = 0;
    let urgencyFee = 0;
    let taskerFee = 0;

    switch (serviceType) {
      case "Small Load":
        base = 50;
        break;
      case "Medium Load":
        base = 100;
        break;
      case "Large Load":
        base = 150;
        break;
      case "Hazardous Waste":
        base = 200;
        break;
      default:
        base = 50;
    }

    urgencyFee = urgency === "urgent" ? 30 : 15;
    const hour = parseInt(time.split(":")[0], 10);
    if (hour >= 18) urgencyFee += 20;

    if (tasker !== "random") taskerFee = 20;

    const total = base + urgencyFee + taskerFee;
    setEstimatedPrice(total);
    setBreakdown({ baseFee: base, urgencyFee, taskerFee });
  };

  useEffect(() => {
    calculatePrice();
  }, [urgency, serviceType, time, tasker]);

  const taskers = [
    {
      name: "Mike D.",
      rating: "4.9",
      specialty: "Furniture Removal",
      image: tasker1,
    },
    {
      name: "Sara K.",
      rating: "4.8",
      specialty: "Appliance Disposal",
      image: tasker2,
    },
    {
      name: "Jon B.",
      rating: "4.7",
      specialty: "Yard Waste",
      image: tasker3,
    },
    {
      name: "Linda P.",
      rating: "4.6",
      specialty: "Construction Debris",
      image: tasker4,
    },
  ];

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">
        🗑️ Book Junk Removal Service
      </h2>

      {/* Urgency */}
      <div className="bg-[#F6F7FF] p-6 rounded-2xl">
        <h3 className="text-[#845FF1] font-semibold mb-4">
          When do you need the junk removed?
        </h3>
        {["urgent", "schedule"].map((option) => (
          <label
            key={option}
            className={`cursor-pointer block p-4 rounded-xl border mb-4 ${
              urgency === option
                ? "bg-white border-[#FF6E31] shadow"
                : "bg-gray-100 border-transparent hover:bg-gray-200"
            }`}
          >
            <input
              type="radio"
              name="urgency"
              value={option}
              className="hidden"
              checked={urgency === option}
              onChange={() => setUrgency(option)}
            />
            <div className="flex gap-4 items-start">
              {option === "urgent" ? (
                <FaHeartbeat className="text-red-500 text-xl mt-1" />
              ) : (
                <FaCalendarAlt className="text-blue-500 text-xl mt-1" />
              )}
              <div>
                <h4 className="font-semibold capitalize">{option}</h4>
                <p className="text-sm text-gray-600">
                  {option === "urgent"
                    ? "Tasker dispatched ASAP"
                    : "Pick a convenient time"}
                </p>
              </div>
            </div>
          </label>
        ))}
      </div>

      {/* Customer Details */}
      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Your Name</label>
          <input
            type="text"
            className="w-full bg-gray-100 rounded-xl px-4 py-2 outline-none"
            placeholder="e.g. John Doe"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contact Number</label>
          <input
            type="tel"
            className="w-full bg-gray-100 rounded-xl px-4 py-2 outline-none"
            placeholder="e.g. +1234567890"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
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
              value={date}
              onChange={(e) => setDate(e.target.value)}
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
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-transparent w-full outline-none py-2"
            />
          </div>
        </div>
      </div>

      {/* Taskers Slider */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">
          Choose Tasker (Optional)
        </label>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2 px-1">
          {/* Random Option */}
          <div
            onClick={() => setTasker("random")}
            className={`min-w-[200px] cursor-pointer flex-shrink-0 rounded-xl p-4 border ${
              tasker === "random"
                ? "bg-white border-[#FF6E31] shadow"
                : "bg-gray-100 border-transparent hover:bg-gray-200"
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <FaUserCheck className="text-green-500 text-3xl mb-2" />
              <h4 className="font-semibold">Random Match</h4>
              <p className="text-sm text-gray-600 mt-1">
                We’ll assign the best available tasker
              </p>
            </div>
          </div>

          {/* Tasker Cards */}
          {taskers.map((t) => (
            <div
              key={t.name}
              onClick={() => setTasker(t.name)}
              className={`min-w-[200px] cursor-pointer flex-shrink-0 rounded-xl p-4 border ${
                tasker === t.name
                  ? "bg-white border-[#845FF1] shadow"
                  : "bg-gray-100 border-transparent hover:bg-gray-200"
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <Image
                  src={t.image}
                  alt={t.name}
                  width={80}
                  height={80}
                  className="rounded-full object-cover mb-2"
                />
                <h4 className="font-semibold">{t.name}</h4>
                <p className="text-sm text-gray-600">{t.specialty}</p>
                <p className="text-sm text-yellow-500 font-medium mt-1">
                  ⭐ {t.rating}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Type */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">
          Select Load Size
        </label>
        <select
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
          className="w-full bg-gray-100 rounded-xl px-4 py-2 outline-none"
        >
          <option>Small Load</option>
          <option>Medium Load</option>
          <option>Large Load</option>
          <option>Hazardous Waste</option>
        </select>
      </div>

      {/* Price Summary */}
      <div className="mt-6 bg-gray-50 p-4 rounded-xl">
        <h4 className="font-semibold mb-2 text-gray-700">Estimated Price</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>Base Fee: ${breakdown.baseFee}</li>
          <li>Urgency Surcharge: ${breakdown.urgencyFee}</li>
          <li>Tasker Preference: ${breakdown.taskerFee}</li>
        </ul>
        <p className="font-bold text-lg text-black mt-2">
          Total: ${estimatedPrice}
        </p>
      </div>
    </div>
  );
}
