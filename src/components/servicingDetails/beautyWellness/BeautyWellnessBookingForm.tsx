/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState, useEffect } from "react";
import { FaSpa, FaCalendarAlt, FaClock, FaUserNurse } from "react-icons/fa";
import stylist1 from "../../../../public/Images/clientImage1.jpg";
import stylist2 from "../../../../public/Images/clientImage2.jpg";
import stylist3 from "../../../../public/Images/clientImage3.jpg";
import stylist4 from "../../../../public/Images/clientImage4.jpg";
import Image from "next/image";

export default function BeautyWellnessBookingForm() {
  const [urgency, setUrgency] = useState("urgent");
  const [stylist, setStylist] = useState("random");
  const [serviceType, setServiceType] = useState("Haircut");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("10:00");
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [breakdown, setBreakdown] = useState({
    baseFee: 0,
    urgencyFee: 0,
    stylistFee: 0,
  });

  useEffect(() => {
    let base = 0;
    let urgencyFee = urgency === "urgent" ? 15 : 5;
    const stylistFee = stylist !== "random" ? 10 : 0;

    switch (serviceType) {
      case "Haircut":
        base = 30;
        break;
      case "Facial":
        base = 50;
        break;
      case "Massage":
        base = 70;
        break;
      case "Manicure":
        base = 25;
        break;
      default:
        base = 30;
    }

    const hour = parseInt(time.split(":")[0]);
    if (hour >= 18) urgencyFee += 10;

    const total = base + urgencyFee + stylistFee;
    setEstimatedPrice(total);
    setBreakdown({ baseFee: base, urgencyFee, stylistFee });
  }, [urgency, time, stylist, serviceType]);

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">💆‍♀️ Book Beauty & Wellness</h2>

      {/* Schedule Preference */}
      <div className="bg-[#FFF0F6] p-6 rounded-2xl mb-6">
        <h3 className="text-pink-600 font-semibold mb-4">When would you like the service?</h3>
        <div className="space-y-4">
          {["urgent", "schedule"].map((option) => (
            <label
              key={option}
              className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                urgency === option
                  ? "bg-white border-pink-500 shadow"
                  : "bg-pink-50 hover:bg-pink-100 border-transparent"
              }`}
            >
              <input
                type="radio"
                name="urgency"
                value={option}
                checked={urgency === option}
                onChange={() => setUrgency(option)}
                className="hidden"
              />
              <div className="flex items-start gap-4">
                {option === "urgent" ? (
                  <FaSpa className="text-pink-500 text-xl mt-1" />
                ) : (
                  <FaCalendarAlt className="text-pink-500 text-xl mt-1" />
                )}
                <div>
                  <h4 className="font-semibold capitalize">{option}</h4>
                  <p className="text-sm text-gray-600">
                    {option === "urgent"
                      ? "Get pampered as soon as possible"
                      : "Pick a suitable date and time"}
                  </p>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <div className="flex items-center bg-pink-50 rounded-xl px-4 py-2">
            <FaCalendarAlt className="text-pink-500 mr-3" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent outline-none w-full"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Time</label>
          <div className="flex items-center bg-pink-50 rounded-xl px-4 py-2">
            <FaClock className="text-pink-500 mr-3" />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-transparent outline-none w-full"
            />
          </div>
        </div>
      </div>

      {/* Service Type */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-1">Select Service</label>
        <select
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
          className="w-full mt-1 p-3 rounded-xl bg-pink-50 focus:outline-none"
        >
          <option>Haircut</option>
          <option>Facial</option>
          <option>Massage</option>
          <option>Manicure</option>
        </select>
      </div>

      {/* Preferred Stylist */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">
          Choose Your Preferred Stylist (Optional)
        </label>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2 px-1">
          <div
            onClick={() => setStylist("random")}
            className={`min-w-[200px] p-4 rounded-xl border cursor-pointer ${
              stylist === "random"
                ? "bg-white border-pink-500 shadow"
                : "bg-pink-50 hover:bg-pink-100 border-transparent"
            }`}
          >
            <div className="flex flex-col items-center">
              <FaUserNurse className="text-green-500 text-3xl mb-2" />
              <h4 className="font-semibold">Random Stylist</h4>
              <p className="text-sm text-gray-600 text-center">
                We'll assign the best available stylist for you
              </p>
            </div>
          </div>

          {[stylist1, stylist2, stylist3, stylist4].map((img, i) => {
            const names = ["Mira", "Lena", "Joy", "Sana"];
            const tags = ["Hair Expert", "Massage Pro", "Facial Queen", "Nail Artist"];
            return (
              <div
                key={i}
                onClick={() => setStylist(names[i])}
                className={`min-w-[200px] p-4 rounded-xl border cursor-pointer ${
                  stylist === names[i]
                    ? "bg-white border-purple-500 shadow"
                    : "bg-pink-50 hover:bg-pink-100 border-transparent"
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <Image
                    src={img}
                    alt={names[i]}
                    width={80}
                    height={80}
                    className="rounded-full object-cover mb-2"
                  />
                  <h4 className="font-semibold">{names[i]}</h4>
                  <p className="text-sm text-gray-600">{tags[i]}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Price Summary */}
      <div className="mt-6 p-4 rounded-xl bg-pink-50">
        <h4 className="font-semibold text-pink-600 mb-2">Estimated Price: ${estimatedPrice}</h4>
        <ul className="text-sm text-gray-700 list-disc ml-6">
          <li>Base Fee: ${breakdown.baseFee}</li>
          <li>Urgency Fee: ${breakdown.urgencyFee}</li>
          <li>Stylist Preference Fee: ${breakdown.stylistFee}</li>
        </ul>
      </div>
    </div>
  );
}
