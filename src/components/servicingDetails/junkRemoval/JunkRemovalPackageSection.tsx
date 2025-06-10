import { FaCheck, FaTruck, FaRecycle, FaClock } from "react-icons/fa";

export default function JunkRemovalPackageSection() {
  return (
    <div className="bg-gradient-to-r from-[#4B5563] to-[#1F2937] py-20 rounded-3xl">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 px-6 lg:px-12">
        {/* Left Side – Junk Removal Package Cards */}
        <div>
          <h2 className="text-4xl font-extrabold text-white mb-5">
            Schedule Your Pickup Fast
          </h2>
          <p className="text-white text-sm mb-5">
            Choose from our most popular junk removal packages below!
          </p>
          <div className="space-y-8">
            {[
              {
                title: "Standard Junk Pickup",
                price: "$80",
                details: [
                  "Couches, Chairs, Furniture",
                  "Appliance Removal",
                  "General Household Junk",
                ],
                badge: "Popular",
                badgeColor: "bg-yellow-400 text-gray-900",
                icon: <FaTruck className="text-white" />,
              },
              {
                title: "Eco-Friendly Disposal",
                price: "$100",
                details: [
                  "Recycling of Electronics",
                  "Safe Hazardous Waste Handling",
                  "Donation Drop-offs",
                ],
                badge: "Eco",
                badgeColor: "bg-green-600 text-white",
                icon: <FaRecycle className="text-green-300" />,
              },
              {
                title: "Express Same-Day Pickup",
                price: "$150",
                details: [
                  "Fast Scheduling",
                  "Priority Service",
                  "Flexible Time Slots",
                ],
                badge: "Express",
                badgeColor: "bg-red-600 text-white",
                icon: <FaClock className="text-red-400" />,
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
                      <FaCheck className="text-green-400 text-sm" />
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
            <h2 className="text-2xl font-bold text-gray-800">Book Junk Removal</h2>
            <p className="text-3xl text-gray-700 font-bold">$80</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                className="w-full bg-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
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
                  className="w-full bg-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
              <div className="flex-1 mt-4 md:mt-0">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  defaultValue="09:00"
                  className="w-full bg-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Service Type
            </label>
            <select className="w-full bg-gray-100 rounded-xl px-4 py-3 outline-none">
              <option>Standard Junk Pickup</option>
              <option>Eco-Friendly Disposal</option>
              <option>Express Same-Day Pickup</option>
            </select>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Add-ons:</p>
            <div className="flex flex-wrap gap-4">
              {[
                "Large Item Handling (+$30)",
                "Garage Cleanup (+$50)",
                "Estate Clearance (+$100)",
              ].map((addon, i) => (
                <label
                  key={i}
                  className={`flex items-center gap-3 ${
                    i === 2 ? "w-full" : "w-[calc(50%-0.5rem)]"
                  }`}
                >
                  <input type="checkbox" className="h-5 w-5 text-gray-700" />
                  <span className="text-gray-700">{addon}</span>
                </label>
              ))}
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-[#FF8609] to-[#FF6C32] text-white py-3 rounded-xl font-semibold text-lg hover:opacity-90 transition">
            Book Now & Save 20%
          </button>

          <p className="text-sm text-center text-gray-500">
            ✓ Free cancellation up to 24h before
          </p>
        </div>
      </div>
    </div>
  );
}
