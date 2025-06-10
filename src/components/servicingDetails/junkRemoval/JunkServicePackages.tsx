import React from "react";
import { MdCheckCircle } from "react-icons/md";

const junkRemovalPackages = [
  {
    id: 1,
    accent: "#F97316", // orange
    header: "QUICK & EASY",
    emoji: "🚛",
    title: "Standard Junk Pickup",
    price: "$100",
    subtitle: "Fast removal for household junk",
    features: [
      "Up to 3 cubic yards of junk",
      "Same-day pickup available",
      "Safe disposal & recycling",
      "Friendly professional crew",
      "No hidden fees",
    ],
    buttonText: "Book Standard Pickup",
  },
  {
    id: 2,
    accent: "#EF4444", // red
    header: "HEAVY DUTY",
    emoji: "🏗️",
    title: "Construction Debris Removal",
    price: "$250",
    subtitle: "Efficient cleanup for building sites",
    features: [
      "Up to 10 cubic yards of debris",
      "Removal of concrete, wood, metals",
      "Licensed disposal facilities",
      "Flexible scheduling",
      "Competitive pricing",
    ],
    buttonText: "Book Debris Removal",
  },
  {
    id: 3,
    accent: "#10B981", // green
    header: "ECO FRIENDLY",
    emoji: "♻️",
    title: "Recycling & Donation Pickup",
    price: "Varies",
    subtitle: "Responsible removal & reuse",
    features: [
      "Electronics recycling",
      "Furniture donation pickup",
      "Eco-conscious sorting",
      "Donation receipts available",
      "Community focused",
    ],
    buttonText: "Schedule Pickup",
  },
];

const JunkServicePackages = () => {
  return (
    <div>
      {/* Section Header */}
      <div className="w-full flex justify-center mt-10">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-[#F97316] to-[#10B981] text-transparent bg-clip-text">
          Junk Removal Packages ♻️
        </h2>
      </div>
      <div className="flex justify-center mt-2">
        <div className="h-[4px] w-[70px] rounded-md bg-gradient-to-r from-[#F97316] to-[#10B981]"></div>
      </div>
      <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-4xl mt-5 p-6 md:p-8 text-center space-y-4">
        <p className="text-lg font-medium text-gray-700">
          Clear out clutter and reclaim your space with our reliable and
          <span className="font-bold text-[#F97316]"> professional junk removal</span> services.
          Fast, eco-friendly, and hassle-free.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6 bg-gray-50">
        {junkRemovalPackages.map((pkg) => (
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
              <p className="text-center text-gray-600 mb-4 px-4">
                {pkg.subtitle}
              </p>

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
                    <span className="text-gray-700 text-sm">{feat}</span>
                  </li>
                ))}
              </ul>

              {/* Button */}
              <div className="flex-grow" />
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

export default JunkServicePackages;
