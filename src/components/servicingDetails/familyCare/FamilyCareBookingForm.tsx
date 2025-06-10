/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from "react";
import {
  FaHeartbeat,
  FaCalendarAlt,
  FaClock,
  FaUserCheck,
} from "react-icons/fa";
import nurse1 from "../../../../public/Images/clientImage1.jpg";
import nurse2 from "../../../../public/Images/clientImage2.jpg";
import nurse3 from "../../../../public/Images/clientImage3.jpg";
import nurse4 from "../../../../public/Images/clientImage4.jpg";
import Image from "next/image";

export default function FamilyCareBookingForm() {
  const [urgency, setUrgency] = useState("urgent");
  const [caregiver, setCaregiver] = useState("random");
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("09:00");
  const [serviceType, setServiceType] = useState("Wellness Check");
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [breakdown, setBreakdown] = useState({
    baseFee: 0,
    urgencyFee: 0,
    caregiverFee: 0,
  });

  const calculatePrice = () => {
    let base = 0;
    let urgencyFee = 0;
    let caregiverFee = 0;

    switch (serviceType) {
      case "Wellness Check":
        base = 60;
        break;
      case "Elderly Care":
        base = 100;
        break;
      case "Pediatric Visit":
        base = 80;
        break;
      case "Post-Surgery Care":
        base = 120;
        break;
      default:
        base = 60;
    }

    if (urgency === "urgent") urgencyFee = 25;
    else urgencyFee = 15;

    const hour = parseInt(time.split(":")[0], 10);
    if (hour >= 18) urgencyFee += 10;

    if (caregiver !== "random") caregiverFee = 15;

    const total = base + urgencyFee + caregiverFee;
    setEstimatedPrice(total);
    setBreakdown({ baseFee: base, urgencyFee, caregiverFee });
  };

  useEffect(() => {
    calculatePrice();
  }, [urgency, serviceType, time, caregiver]);

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">
        🏥 Book FamilyCare Service
      </h2>

      {/* Urgency */}
      <div className="bg-[#F6F7FF] p-6 rounded-2xl">
        <h3 className="text-[#845FF1] font-semibold mb-4">
          When do you need assistance?
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
                    ? "Caregiver dispatched ASAP"
                    : "Pick a convenient time"}
                </p>
              </div>
            </div>
          </label>
        ))}
      </div>

      {/* Patient Details */}
      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Patient Name</label>
          <input
            type="text"
            className="w-full bg-gray-100 rounded-xl px-4 py-2 outline-none"
            placeholder="e.g. John Doe"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Patient Age</label>
          <input
            type="number"
            className="w-full bg-gray-100 rounded-xl px-4 py-2 outline-none"
            placeholder="e.g. 65"
            value={patientAge}
            onChange={(e) => setPatientAge(e.target.value)}
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

      {/* Preferred Caregiver */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">
          Choose Caregiver (Optional)
        </label>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2 px-1">
          {/* Random Option */}
          <div
            onClick={() => setCaregiver("random")}
            className={`min-w-[200px] cursor-pointer flex-shrink-0 rounded-xl p-4 border ${
              caregiver === "random"
                ? "bg-white border-[#FF6E31] shadow"
                : "bg-gray-100 border-transparent hover:bg-gray-200"
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <FaUserCheck className="text-green-500 text-3xl mb-2" />
              <h4 className="font-semibold">Random Match</h4>
              <p className="text-sm text-gray-600 mt-1">
                We’ll assign the best available caregiver
              </p>
            </div>
          </div>

          {/* Caregiver Cards */}
          {[
            { name: "Nurse Joy", rating: "5.0", tag: "Elder Care", image: nurse1 },
            { name: "Dr. Linda", rating: "4.9", tag: "Wellness Checks", image: nurse2 },
            { name: "Anna B.", rating: "4.8", tag: "Post-Surgery", image: nurse3 },
            { name: "Tom R.", rating: "4.7", tag: "Child Care", image: nurse4 },
          ].map((n) => (
            <div
              key={n.name}
              onClick={() => setCaregiver(n.name)}
              className={`min-w-[200px] cursor-pointer flex-shrink-0 rounded-xl p-4 border ${
                caregiver === n.name
                  ? "bg-white border-[#845FF1] shadow"
                  : "bg-gray-100 border-transparent hover:bg-gray-200"
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <Image
                  src={n.image}
                  alt={n.name}
                  width={80}
                  height={80}
                  className="rounded-full object-cover mb-2"
                />
                <h4 className="font-semibold">{n.name}</h4>
                <p className="text-sm text-gray-600">{n.tag}</p>
                <p className="text-sm text-yellow-500 font-medium mt-1">
                  ⭐ {n.rating}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Type */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">
          Select Service Type
        </label>
        <select
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
          className="w-full bg-gray-100 rounded-xl px-4 py-2 outline-none"
        >
          <option>Wellness Check</option>
          <option>Elderly Care</option>
          <option>Pediatric Visit</option>
          <option>Post-Surgery Care</option>
        </select>
      </div>

      {/* Price Summary */}
      <div className="mt-6 bg-gray-50 p-4 rounded-xl">
        <h4 className="font-semibold mb-2 text-gray-700">Estimated Price</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>Base Fee: ${breakdown.baseFee}</li>
          <li>Urgency Surcharge: ${breakdown.urgencyFee}</li>
          <li>Caregiver Preference: ${breakdown.caregiverFee}</li>
        </ul>
        <p className="font-bold text-lg text-black mt-2">
          Total: ${estimatedPrice}
        </p>
      </div>
    </div>
  );
}
