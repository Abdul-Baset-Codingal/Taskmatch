import React from "react";
import { FaMapMarkerAlt, FaFlagCheckered } from "react-icons/fa";
const featureData = [
  {
    icon: "🔔",
    title: "Real-time Notifications",
    description:
      "Get instant alerts about driver location, arrival times, and trip updates directly on your device.",
  },
  {
    icon: "🔄",
    title: "One-click Rebooking",
    description:
      "Easily book your frequent trips with just one tap, saving time and streamlining your experience.",
  },
  {
    icon: "🎁",
    title: "Exclusive Mobile Deals",
    description:
      "Access special promotions, discounts and offers only available to our mobile app users.",
  },
  {
    icon: "🧭",
    title: "Smart Navigation",
    description:
      "Let the app guide you with optimized routes, real-time traffic updates, and smart ETA tracking.",
  },
];
const GetMobileApp = () => {
  return (
    <div>
      <div className="px-4 sm:px-8 md:px-20">
        <div className="flex justify-center items-center">
          <h2 className="text-[#2A3B8F] text-5xl font-bold">
            Get Our Mobile App
          </h2>
        </div>
        <div className="flex justify-center mt-5">
          <div className="flex rounded-md justify-center h-[4px] w-[90px] color1"></div>
        </div>
        <div className="flex justify-center mt-3  text-center">
          <p className="w-[600px] text-lg text-[#7B809E]">
            Experience the full power of TaskMatch in your pocket with real-time
            tracking, faster bookings, and exclusive mobile discounts.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-around items-center custom-font mt-12">
          {/* video phone */}
          <div
            className="relative flex justify-center 
                h-[300px] w-[150px] sm:h-[350px] sm:w-[180px] 
                md:h-[470px] md:w-[250px] border-4 border-black 
                rounded-2xl shadow-lg bg-white p-1 overflow-hidden"
          >
            {/* Top Bars */}
            <span className="absolute top-0 border border-black bg-black w-16 sm:w-20 h-2 z-50 rounded-br-xl rounded-bl-xl"></span>
            <span className="absolute -right-2 top-12 sm:top-14 border-4 border-black z-50 h-5 sm:h-7 rounded-md"></span>
            <span className="absolute -right-2 bottom-28 sm:bottom-36 border-4 border-black z-50 h-8 sm:h-10 rounded-md"></span>

            {/* Inner Form Card */}
            <div className="flex flex-col justify-between h-full w-full bg-[#F0F1F5] rounded-xl p-3">
              {/* Inputs Section */}
              <div>
                <h2 className="text-center text-gray-700 font-semibold mb-2">
                  Where to?
                </h2>
                <div className="space-y-2">
                  <div className="flex items-center bg-white rounded-xl shadow-inner px-3 py-2">
                    <FaMapMarkerAlt className="text-pink-500 text-lg" />
                    <input
                      type="text"
                      placeholder="Current Location"
                      className="ml-2 w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
                    />
                  </div>
                  <div className="flex items-center bg-white rounded-xl shadow-inner px-3 py-2">
                    <FaFlagCheckered className="text-green-500 text-lg" />
                    <input
                      type="text"
                      placeholder="Enter destination"
                      className="ml-2 w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Type Toggle */}
              <div>
                <div className="flex bg-white rounded-xl overflow-hidden shadow">
                  <button className="flex-1 py-2 text-center text-gray-700 hover:bg-gray-100 transition">
                    Standard
                  </button>
                  <button className="flex-1 py-2 text-center text-gray-700 hover:bg-gray-100 transition">
                    Premium
                  </button>
                </div>
              </div>

              {/* Footer: ETA, Fare & Button */}
              <div className="text-center space-y-2">
                <span className="inline-block bg-white rounded-full px-3 py-1 text-xs font-medium text-gray-600 shadow-sm">
                  5 min away
                </span>
                <div className="text-2xl font-bold text-gray-900">$25</div>
                <button
                  className="w-full py-2 bg-gradient-to-r from-[#FF6E31] to-[#FF860A] 
                         text-white rounded-xl shadow-lg hover:from-[#FF7A3A] 
                         hover:to-[#FF4C00] transition"
                >
                  Book Ride Now
                </button>
              </div>
            </div>
          </div>
          <div className="mb-6 md:mb-0">
            <div className="space-y-5 px-4 mx-auto">
              {featureData.map((item, idx) => (
                <div
                  key={idx}
                  className="w-full bg-white shadow-xl rounded-3xl px-4 py-8 flex items-start gap-4 border border-gray-200 hover:shadow-lg transition"
                >
                  <div className="text-3xl">{item.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#2A3B8F] mb-1">
                      {item.title}
                    </h3>
                    <p className="text-[#7B809E] text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetMobileApp;
