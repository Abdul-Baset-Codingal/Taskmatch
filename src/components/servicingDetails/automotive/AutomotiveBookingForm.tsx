/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from "react";
import {
  FaCar,
  FaBolt,
  FaCalendarAlt,
  FaClock,
  FaUserCheck,
} from "react-icons/fa";
import mech1 from "../../../../public/Images/clientImage1.jpg";
import mech2 from "../../../../public/Images/clientImage2.jpg";
import mech3 from "../../../../public/Images/clientImage3.jpg";
import mech4 from "../../../../public/Images/clientImage4.jpg";
import Image from "next/image";

export default function AutomotiveBookingForm() {
  // State for urgency (urgent or schedule)
  const [urgency, setUrgency] = useState("urgent");
  // State for preferred mechanic (random or specific)
  const [mechanic, setMechanic] = useState("random");
  // State for vehicle details
  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  // State for date and time inputs
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("09:00");
  // State for selected service type
  const [serviceType, setServiceType] = useState("Oil Change");
  // State to hold the calculated estimated price
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  // Detailed breakdown for summary
  const [breakdown, setBreakdown] = useState({
    baseFee: 0,
    urgencyFee: 0,
    mechanicFee: 0,
  });

  // Price calculation logic based on selected options
  const calculatePrice = () => {
    let base = 0;
    let urgencyFee = 0;
    let mechanicFee = 0;

    // Base price by automotive service type
    switch (serviceType) {
      case "Oil Change":
        base = 50;
        break;
      case "Tire Rotation":
        base = 40;
        break;
      case "Brake Service":
        base = 100;
        break;
      case "Engine Diagnostic":
        base = 80;
        break;
      default:
        base = 50;
    }

    // Surcharge for urgency
    if (urgency === "urgent") {
      urgencyFee = 20;
    } else {
      urgencyFee = 10;
    }

    // Evening surcharge (after 5 PM)
    const hour = parseInt(time.split(":")[0], 10);
    if (hour >= 17) {
      urgencyFee += 15;
    }

    // Preferred mechanic surcharge
    if (mechanic !== "random") {
      mechanicFee = 10;
    }

    const total = base + urgencyFee + mechanicFee;
    setEstimatedPrice(total);
    setBreakdown({ baseFee: base, urgencyFee, mechanicFee });
  };

  // Re-calculate whenever dependencies change
  useEffect(() => {
    calculatePrice();
  }, [urgency, serviceType, time, mechanic]);

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">
        🚗 Book Automotive Service Now
      </h2>

      {/* Time Selection */}
      <div className="bg-[#F6F7FF] p-6 rounded-2xl">
        <h3 className="text-[#845FF1] font-semibold mb-4">
          When do you need service?
        </h3>

        {/* Urgent Option */}
        <label
          className={`cursor-pointer block p-4 rounded-xl border transition-all duration-200 mb-4 ${
            urgency === "urgent"
              ? "bg-white border-[#FF6E31] shadow"
              : "bg-gray-100 border-transparent hover:bg-gray-200"
          }`}
        >
          <input
            type="radio"
            name="service_time"
            value="urgent"
            className="hidden"
            checked={urgency === "urgent"}
            onChange={() => setUrgency("urgent")}
          />
          <div className="flex gap-4 items-start">
            <FaBolt className="text-yellow-500 text-xl mt-1" />
            <div>
              <h4 className="font-semibold">Urgent - ASAP</h4>
              <p className="text-sm text-gray-600">
                Mechanic dispatched as soon as possible
              </p>
            </div>
          </div>
        </label>

        {/* Schedule Option */}
        <label
          className={`cursor-pointer block p-4 rounded-xl border transition-all duration-200 ${
            urgency === "schedule"
              ? "bg-white border-[#FF6E31] shadow"
              : "bg-gray-100 border-transparent hover:bg-gray-200"
          }`}
        >
          <input
            type="radio"
            name="service_time"
            value="schedule"
            className="hidden"
            checked={urgency === "schedule"}
            onChange={() => setUrgency("schedule")}
          />
          <div className="flex gap-4 items-start">
            <FaCalendarAlt className="text-blue-500 text-xl mt-1" />
            <div>
              <h4 className="font-semibold">Schedule Service</h4>
              <p className="text-sm text-gray-600">
                Pick a date for your appointment
              </p>
            </div>
          </div>
        </label>
      </div>

      {/* Vehicle Details */}
      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Vehicle Make</label>
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-2">
            <FaCar className="text-blue-500" />
            <input
              type="text"
              placeholder="e.g. Toyota"
              value={vehicleMake}
              onChange={(e) => setVehicleMake(e.target.value)}
              className="bg-transparent w-full outline-none py-2"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Vehicle Model</label>
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-2">
            <FaCar className="text-green-500" />
            <input
              type="text"
              placeholder="e.g. Camry"
              value={vehicleModel}
              onChange={(e) => setVehicleModel(e.target.value)}
              className="bg-transparent w-full outline-none py-2"
            />
          </div>
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

      {/* Preferred Mechanic */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">
          Choose Your Preferred Mechanic (Optional)
        </label>
        <div className="relative overflow-hidden">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2 px-1">
            {/* Random Match Option */}
            <div
              onClick={() => setMechanic("random")}
              className={`min-w-[200px] cursor-pointer flex-shrink-0 rounded-xl p-4 border transition ${
                mechanic === "random"
                  ? "bg-white border-[#FF6E31] shadow"
                  : "bg-gray-100 border-transparent hover:bg-gray-200"
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <FaUserCheck className="text-green-500 text-3xl mb-2" />
                <h4 className="font-semibold">Random Match</h4>
                <p className="text-sm text-gray-600 mt-1">
                  We’ll assign the best available mechanic
                </p>
              </div>
            </div>

            {/* Mechanic Cards */}
            {[
              {
                name: "Joe M.",
                rating: "4.9",
                tag: "Engine Specialist",
                image: mech1,
              },
              {
                name: "Sara L.",
                rating: "4.8",
                tag: "Brake Expert",
                image: mech2,
              },
              {
                name: "Mike T.",
                rating: "5.0",
                tag: "Tire Technician",
                image: mech3,
              },
              {
                name: "Anna R.",
                rating: "4.7",
                tag: "Oil Change Pro",
                image: mech4,
              },
            ].map((m) => (
              <div
                key={m.name}
                onClick={() => setMechanic(m.name)}
                className={`min-w-[200px] cursor-pointer flex-shrink-0 rounded-xl p-4 border transition ${
                  mechanic === m.name
                    ? "bg-white border-[#845FF1] shadow"
                    : "bg-gray-100 border-transparent hover:bg-gray-200"
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <Image
                    src={m.image}
                    alt={m.name}
                    width={80}
                    height={80}
                    className="rounded-full object-cover mb-2"
                  />
                  <h4 className="font-semibold">{m.name}</h4>
                  <p className="text-sm text-gray-600">{m.tag}</p>
                  <p className="text-sm text-yellow-500 font-medium mt-1">
                    ⭐ {m.rating}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Type */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-1">Service Type</label>
        <select
          className="w-full bg-gray-100 rounded-xl px-4 py-2 outline-none"
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
        >
          <option>Oil Change</option>
          <option>Tire Rotation</option>
          <option>Brake Service</option>
          <option>Engine Diagnostic</option>
        </select>
      </div>

      {/* Booking Summary */}
      <div className="mt-8 bg-gray-50 rounded-2xl p-6 shadow-md">
        <h4 className="text-lg font-semibold mb-3 text-gray-700 text-center">
          Booking Summary
        </h4>
        <ul className="text-gray-800 space-y-2">
          <li className="flex justify-between">
            <span className="font-medium">Service Type:</span>
            <span>{serviceType}</span>
          </li>
          <li className="flex justify-between">
            <span className="font-medium">Urgency:</span>
            <span className="capitalize">{urgency}</span>
          </li>
          <li className="flex justify-between">
            <span className="font-medium">Date & Time:</span>
            <span>
              {date} @ {time}
            </span>
          </li>
          <li className="flex justify-between">
            <span className="font-medium">Vehicle Make:</span>
            <span>{vehicleMake || "N/A"}</span>
          </li>
          <li className="flex justify-between">
            <span className="font-medium">Vehicle Model:</span>
            <span>{vehicleModel || "N/A"}</span>
          </li>
          <li className="flex justify-between">
            <span className="font-medium">Mechanic:</span>
            <span>{mechanic === "random" ? "Random Match" : mechanic}</span>
          </li>
        </ul>

        <div className="mt-4 border-t pt-3 space-y-1 text-gray-800">
          <div className="flex justify-between">
            <span>Base Fee:</span>
            <span>${breakdown.baseFee}</span>
          </div>
          <div className="flex justify-between">
            <span>Urgency Fee:</span>
            <span>${breakdown.urgencyFee}</span>
          </div>
          <div className="flex justify-between">
            <span>Mechanic Fee:</span>
            <span>${breakdown.mechanicFee}</span>
          </div>
          <div className="flex justify-between font-semibold text-green-600 pt-2">
            <span>Grand Total:</span>
            <span>${estimatedPrice}</span>
          </div>
        </div>
      </div>

      {/* Book Now Button */}
      <div className="mt-6 text-center">
        <button className="bg-gradient-to-r from-[#845FF1] to-[#E3B3FE] text-white font-semibold w-full py-2.5 rounded-xl hover:opacity-90 transition">
          Book Now
        </button>
      </div>

      {/* Popular Tags */}
      <div className="mt-8">
        <h4 className="text-sm font-semibold mb-2 text-gray-600">Popular:</h4>
        <div className="flex flex-wrap gap-4">
          <span className="bg-gray-200 px-4 py-2 rounded-full text-sm">
            🛢️ Oil Change
          </span>
          <span className="bg-gray-200 px-4 py-2 rounded-full text-sm">
            🚗 Tire Rotation
          </span>
          <span className="bg-gray-200 px-4 py-2 rounded-full text-sm">
            🛠️ Brake Service
          </span>
        </div>
      </div>
    </div>
  );
}
