import React from "react";

const features = [
  {
    icon: "✓",
    title: "Verified Drivers",
    description: "Background-checked & experienced",
  },
  {
    icon: "🛡️",
    title: "Safety Guarantee",
    description: "Secure and insured rides",
  },
  {
    icon: "⭐",
    title: "4.9/5 Rating",
    description: "From over 420 reviews",
  },
  {
    icon: "⏱️",
    title: "Fast Response",
    description: "Average pickup time: 10 min",
  },
];

const RideAdvertise = () => {
  return (
    <div className="w-full px-4 py-10 bg-white rounded-4xl shadow-2xl mb-40">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {features.map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-xl  flex gap-4 items-start  transition"
          >
            <div
              className={`text-white text-3xl w-16 h-16 flex items-center justify-center rounded-xl ${
                idx === 0
                  ? "bg-gradient-to-br from-[#9470F2] to-[#D6ABFC]"
                  : idx === 1
                  ? "bg-gradient-to-br from-[#4B5EE5] to-[#4422B1]"
                  : idx === 2
                  ? "bg-gradient-to-br from-[#FF9A0B] to-[#FF5D0B]"
                  : "bg-gradient-to-br from-[#33B77D] to-[#21A956]"
              }`}
            >
              {item.icon}
            </div>
            <div>
              <h4 className="font-bold text-2xl text-gray-800 mb-1">{item.title}</h4>
              <p className=" text-gray-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RideAdvertise;
