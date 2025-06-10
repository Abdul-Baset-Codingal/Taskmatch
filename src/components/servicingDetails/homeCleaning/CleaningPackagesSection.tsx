import { FaCheck, FaFire, FaAccusoft } from "react-icons/fa";

export default function CleaningPackagesSection() {
  return (
    <div className="bg-gradient-to-r from-[#7F5AEF] to-[#6548B1] py-20 rounded-3xl">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 px-6 lg:px-12">
        {/* Left Side – Package Cards */}
        <div className="space-y-8">
          {/* Package Card Template */}
          {[
            {
              title: "Standard Clean",
              price: "$120",
              details: ["2 Hours", "1 Cleaner"],
              badge: "Most Popular",
              badgeColor: "bg-yellow-300 text-purple-800",
            },
            {
              title: "Deep Clean",
              price: "$200",
              details: ["4 Hours", "2 Cleaners"],
              icon: <FaFire className="text-red-500" />,
              badge: "20% OFF",
              badgeColor: "bg-red-500 text-white",
            },
            {
              title: "Move In/Out",
              price: "$250",
              details: ["6 Hours", "3 Cleaners"],
              icon: <FaAccusoft className="text-yellow-300" />,
              badge: "Thorough",
              badgeColor: "bg-white/20 text-white",
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur-md rounded-3xl py-4 px-5 shadow-xl border border-white hover:scale-105 transition transform duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-semibold text-white">
                  {card.title}
                </h3>
                <span className="text-xl text-white/80 font-bold">
                  {card.price}
                </span>
              </div>
              <div className="flex flex-wrap gap-3 mb-4">
                {card.details.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg text-white/90"
                  >
                    <FaCheck className="text-green-300" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {card.icon && card.icon}
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full ${card.badgeColor}`}
                >
                  {card.badge}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side – Booking Form */}
        <div className="bg-white rounded-3xl p-10 shadow-2xl space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Book Standard Clean 
            </h2>
            <p className="text-3xl text-[#6548B1] font-bold"> $120</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Your Address
              </label>
              <input
                type="text"
                className="w-full bg-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Enter your address"
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
                  className="w-full bg-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div className="flex-1 mt-4 md:mt-0">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  defaultValue="13:00"
                  className="w-full bg-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Quick Add-ons:
            </p>
            <div className="flex flex-wrap gap-4">
              {[
                "Inside Fridge (+$30)",
                "Inside Oven (+$35)",
                "Windows (+$40)",
              ].map((addon, i) => (
                <label
                  key={i}
                  className={`flex items-center gap-3 ${
                    i === 2 ? "w-full" : "w-[calc(50%-0.5rem)]"
                  }`}
                >
                  <input type="checkbox" className="h-5 w-5 text-purple-500" />
                  <span className="text-gray-700">{addon}</span>
                </label>
              ))}
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-[#FF8609] to-[#FF6C32] text-white py-3 rounded-xl font-semibold text-lg hover:opacity-90 transition">
            Book Now & Save 20%
          </button>

          <p className="text-sm text-center text-gray-600">
            ✓ Free cancellation up to 24h before
          </p>
        </div>
      </div>
    </div>
  );
}
