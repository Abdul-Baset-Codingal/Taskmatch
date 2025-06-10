/* eslint-disable react/no-unescaped-entities */
import { FaCheck, FaUserNurse, FaBaby, FaHeartbeat } from "react-icons/fa";

export default function FamilyCareServiceSection() {
  return (
    <div className="bg-gradient-to-r from-[#F47D61] to-[#C75C8C] py-20 rounded-3xl">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 px-6 lg:px-12">
        {/* Left Side – FamilyCare Service Cards */}
        <div>
          <h2 className="text-4xl font-extrabold text-white mb-5">
            FamilyCare Services
          </h2>
          <p className="text-white text-sm mb-5">
            Choose from our trusted family care services for your loved ones.
          </p>
          <div className="space-y-8">
            {[
              {
                title: "Pediatric Home Visit",
                price: "$80",
                details: ["Health Check", "Vaccination", "Growth Monitoring"],
                badge: "Top Rated",
                badgeColor: "bg-yellow-300 text-pink-800",
                icon: <FaBaby className="text-green-100" />,
              },
              {
                title: "Elderly Care Service",
                price: "$90",
                details: ["Medical Support", "Mobility Help", "Meal Assistance"],
                badge: "Special Offer",
                badgeColor: "bg-red-500 text-white",
                icon: <FaUserNurse className="text-red-300" />,
              },
              {
                title: "Post-Surgery Care",
                price: "$100",
                details: ["Wound Dressing", "Vital Monitoring", "Rehab Exercises"],
                badge: "Premium",
                badgeColor: "bg-white/20 text-white",
                icon: <FaHeartbeat className="text-green-300" />,
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-md rounded-3xl py-4 px-5 shadow-xl border border-white hover:scale-105 transition-transform duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">{card.title}</h3>
                  <span className="text-xl text-white/80 font-bold">{card.price}</span>
                </div>
                <div className="flex flex-wrap gap-3 mb-4">
                  {card.details.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg text-white/90"
                    >
                      <FaCheck className="text-green-300 text-sm" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  {card.icon}
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${card.badgeColor}`}
                  >
                    {card.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side – Booking Form */}
        <div className="bg-white rounded-3xl p-10 shadow-2xl space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Book FamilyCare</h2>
            <p className="text-3xl text-[#C75C8C] font-bold">$80</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Patient's Full Name
              </label>
              <input
                type="text"
                className="w-full bg-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="e.g., John Smith"
              />
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  className="w-full bg-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
              <div className="flex-1 mt-4 md:mt-0">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  defaultValue="10:00"
                  className="w-full bg-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Service Type
            </label>
            <select className="w-full bg-gray-100 rounded-xl px-4 py-3 outline-none">
              <option>Pediatric Home Visit</option>
              <option>Elderly Care Service</option>
              <option>Post-Surgery Care</option>
            </select>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Add-ons:</p>
            <div className="flex flex-wrap gap-4">
              {[
                "Medication Assistance (+$15)",
                "Nutrition Plan (+$10)",
                "Emergency Contact Setup (+$5)",
              ].map((addon, i) => (
                <label
                  key={i}
                  className={`flex items-center gap-3 ${
                    i === 2 ? "w-full" : "w-[calc(50%-0.5rem)]"
                  }`}
                >
                  <input type="checkbox" className="h-5 w-5 text-pink-500" />
                  <span className="text-gray-700">{addon}</span>
                </label>
              ))}
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-[#FF8609] to-[#FF6C32] text-white py-3 rounded-xl font-semibold text-lg hover:opacity-90 transition">
            Book Now & Get Special Care
          </button>

          <p className="text-sm text-center text-gray-600">
            ✓ Reschedule anytime up to 24h before appointment
          </p>
        </div>
      </div>
    </div>
  );
}
