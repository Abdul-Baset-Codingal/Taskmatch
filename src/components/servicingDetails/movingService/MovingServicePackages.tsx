import React from "react";
import { MdCheckCircle } from "react-icons/md";

const movingPackages = [
  {
    id: 1,
    accent: "#29B584",
    header: "LOCAL MOVE",
    emoji: "🚚",
    title: "Local Move",
    price: "$200",
    subtitle: "Efficient relocation within city limits",
    features: [
      "Up to 3 hours of service",
      "2 Movers included",
      "Moving truck & equipment",
      "Loading & unloading",
      "Furniture padding & protection",
      "1-month storage option",
    ],
    buttonText: "Book Local Move",
  },
  {
    id: 2,
    accent: "#FF8906",
    header: "LONG DISTANCE ⭐",
    emoji: "🌍",
    title: "Long Distance Move",
    price: "$800",
    subtitle: "Professional moving across states",
    features: [
      "Full-service packing & unpacking",
      "Custom crating for valuables",
      "Climate-controlled truck",
      "2-day transit guarantee",
      "Insurance coverage included",
      "Free in-home estimate",
    ],
    buttonText: "Book Long Distance",
  },
  {
    id: 3,
    accent: "#EF4444",
    header: "HOURLY MOVE",
    emoji: "⏱️",
    title: "Hourly Move",
    price: "$100/hr",
    subtitle: "Flexible hourly moving assistance",
    features: [
      "Pay by the hour",
      "1-2 Movers available",
      "Basic loading & unloading",
      "DIY packing support",
      "No minimum hours",
    ],
    buttonText: "Book Hourly Move",
  },
];

const MovingServicePackages = () => {
  return (
    <div>
      {/* Section Header */}
      <div className="w-full flex justify-center mt-10">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-[#29B584] to-[#EF4444] text-transparent bg-clip-text">
          Moving Service Packages✨
        </h2>
      </div>
      <div className="flex justify-center mt-2">
        <div className="flex rounded-md justify-center h-[4px] w-[70px] bg-gradient-to-r from-[#29B584] to-[#EF4444]"></div>
      </div>
      <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-4xl mt-5 p-6 md:p-8 text-center space-y-4">
        <p className="text-lg font-medium text-gray-700">
          Whether you’re moving across town or across the country, our packages
          ensure a smooth, stress-free relocation at{" "}
          <span className="font-bold text-[#29B584]">competitive rates</span>.
        </p>
      </div>

      {/* Package Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6 bg-gray-50">
        {movingPackages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-[30px] shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 overflow-hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4" style={{ backgroundColor: pkg.accent }}>
                {pkg.header && (
                  <p
                    className="text-sm font-bold uppercase text-center mb-1 text-white"
                    style={{ opacity: 0.9 }}
                  >
                    {pkg.header}
                  </p>
                )}
                {pkg.emoji && (
                  <div className="flex justify-center mb-2">
                    <span className="text-5xl">{pkg.emoji}</span>
                  </div>
                )}
                <h2 className="text-center text-2xl font-extrabold text-white">
                  {pkg.title}
                </h2>
              </div>

              {/* Price */}
              <p
                className="text-center text-2xl font-bold my-3"
                style={{ color: pkg.accent }}
              >
                {pkg.price}
              </p>

              {/* Subtitle */}
              {pkg.subtitle && (
                <p className="text-center text-gray-600 mb-4 px-4">
                  {pkg.subtitle}
                </p>
              )}

              {/* Features */}
              <ul className="space-y-2 mb-6 px-6">
                {pkg.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <MdCheckCircle
                      className="mt-[3px]"
                      style={{
                        color: pkg.accent,
                        minWidth: "1rem",
                        minHeight: "1rem",
                      }}
                    />
                    <span className="flex-1 text-gray-700 text-sm">{feat}</span>
                  </li>
                ))}
              </ul>

              {/* Spacer to push button down */}
              <div className="flex-grow" />

              {/* Book Button */}
              <button
                className="mt-auto w-full py-2 rounded-2xl text-white font-semibold shadow-lg hover:opacity-90 transition duration-300"
                style={{ backgroundColor: pkg.accent }}
              >
                {pkg.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovingServicePackages;
