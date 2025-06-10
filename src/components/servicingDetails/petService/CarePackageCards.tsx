"use client";
import React from "react";
import { MdCheckCircle } from "react-icons/md";

const packages = [
  {
    id: 1,
    accent: "#8762F1",
    header: "WEEKDAY CARE",
    emoji: "🐕",
    title: "For Working Pet Parents",
    price: "$85",
    subtitle: null,
    features: [
      "Five 30-minute walks (Mon–Fri)",
      "Same walker each day",
      "Photo updates after each walk",
      "Flexible scheduling window",
      "Fresh water refill",
      "Basic training reinforcement",
    ],
    buttonText: "Book This Package",
  },
  {
    id: 2,
    accent: "#FF8906",
    header: "MOST POPULAR ⭐",
    emoji: "🏠",
    title: "Weekend Getaway",
    price: "$199",
    subtitle: "Perfect for short trips",
    features: [
      "3 nights of overnight care",
      "2 additional daytime visits",
      "Daily photo and video updates",
      "Home security checks",
      "Plant watering and mail collection",
      "Up to 3 pets included",
      "Basic medication administration",
    ],
    buttonText: "Book This Package",
  },
  {
    id: 3,
    accent: "#29B584",
    header: "FELINE CARE",
    emoji: "🐱",
    title: "Cat Care Package",
    price: "$120",
    subtitle: "One week of feline care",
    features: [
      "7 daily visits (30 minutes each)",
      "Feeding and fresh water",
      "Litter box cleaning",
      "Interactive playtime",
      "Home security checks",
      "Daily photo updates",
      "Up to 3 cats included",
    ],
    buttonText: "Book This Package",
  },
];

const CarePackageCards = () => {
  return (
    <div>
      <div>
        <div>
          <div className="w-full flex justify-center mt-10">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-[#7F5BF0] to-[#DCACFD] text-transparent bg-clip-text custom-font">
              Care Packages✨{" "}
            </h2>
          </div>
          <div className="flex justify-center mt-2">
            <div className="flex rounded-md justify-center h-[4px] w-[70px] bg-gradient-to-r from-[#8560F1] to-[#E7B6FE]"></div>
          </div>
          <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-4xl mt-5 p-6 md:p-8 text-center space-y-4">
            <p className="text-lg font-medium text-gray-700">
              Save money by bundling pet care services together. Our packages
              are designed for different needs and situations at{" "}
              <span className="font-bold text-[#8560F1]">discounted rates.</span>
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6 bg-gray-50">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-[30px] shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 relative overflow-hidden"
          >
            <div className=" pb-6 flex flex-col h-full">
              <div className={`bg-[${pkg.accent}]`}>
                {/* Optional Header */}
                {pkg.header && (
                  <p
                    className="text-sm font-bold uppercase text-center mb-2"
                    style={{ color: pkg.accent }}
                  >
                    {pkg.header}
                  </p>
                )}

                {/* Emoji (if any) */}
                {pkg.emoji && (
                  <div className="flex justify-center mb-2">
                    <span className="text-5xl">{pkg.emoji}</span>
                  </div>
                )}

                {/* Title */}
                <h2 className="text-center text-2xl font-extrabold mb-1 text-white">
                  {pkg.title}
                </h2>
              </div>

              {/* Price */}
              <p
                className="text-center text-2xl  font-bold mb-3"
                style={{ color: pkg.accent }}
              >
                {pkg.price}
                <span className="text-[16px]">/week</span>
              </p>

              {/* Subtitle (if any) */}
              {pkg.subtitle && (
                <p className="text-center text-gray-600 mb-4">{pkg.subtitle}</p>
              )}

              {/* Features */}
              <ul className="space-y-2 mb-6 mx-5">
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
              <div className="flex-grow " />

              {/* Book Button */}
              <button
                className="mt-auto w-full py-2 rounded-2xl  text-white font-semibold shadow-lg hover:opacity-90 transition duration-300"
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

export default CarePackageCards;
