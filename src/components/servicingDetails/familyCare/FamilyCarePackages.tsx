import React from "react";
import { MdCheckCircle } from "react-icons/md";

const familyCarePackages = [
  {
    id: 1,
    accent: "#2563EB", // Blue
    header: "CHILD CARE",
    emoji: "🧒",
    title: "Child Care",
    price: "$79",
    subtitle: "Essential care for little ones",
    features: [
      "Nutritional planning",
      "Daily activity sessions",
      "Regular health checks",
      "Emotional support",
      "Qualified caregivers",
    ],
    buttonText: "Enroll in Child Care",
  },
  {
    id: 2,
    accent: "#10B981", // Green
    header: "ELDERLY CARE ❤️",
    emoji: "👴",
    title: "Elderly Care",
    price: "$129",
    subtitle: "Comfort and care for seniors",
    features: [
      "Medication management",
      "Personal hygiene support",
      "Daily exercise routines",
      "Mental wellness activities",
      "24/7 emergency support",
    ],
    buttonText: "Get Elderly Care",
  },
  {
    id: 3,
    accent: "#F97316", // Orange
    header: "FAMILY WELLNESS",
    emoji: "👨‍👩‍👧‍👦",
    title: "Family Wellness",
    price: "$199",
    subtitle: "Holistic care for the entire family",
    features: [
      "Routine health screenings",
      "Nutrition & fitness plans",
      "Mental health support",
      "Family bonding sessions",
      "Monthly wellness reports",
    ],
    buttonText: "Join Wellness Program",
  },
];

const FamilyCarePackages = () => {
  return (
    <div>
      {/* Section Header */}
      <div className="w-full flex justify-center mt-10">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-[#2563EB] to-[#F97316] text-transparent bg-clip-text">
          Family Care Service Packages 🏡
        </h2>
      </div>
      <div className="flex justify-center mt-2">
        <div className="flex rounded-md justify-center h-[4px] w-[70px] bg-gradient-to-r from-[#2563EB] to-[#F97316]"></div>
      </div>
      <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-4xl mt-5 p-6 md:p-8 text-center space-y-4">
        <p className="text-lg font-medium text-gray-700">
          Prioritize your loved ones with our trusted{" "}
          <span className="font-bold text-[#10B981]">family care packages</span>.
          Compassionate support at affordable rates.
        </p>
      </div>

      {/* Package Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6 bg-gray-50">
        {familyCarePackages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-[30px] shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 overflow-hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4" style={{ backgroundColor: pkg.accent }}>
                <p
                  className="text-sm font-bold uppercase text-center mb-1 text-white"
                  style={{ opacity: 0.9 }}
                >
                  {pkg.header}
                </p>
                <div className="flex justify-center mb-2">
                  <span className="text-5xl">{pkg.emoji}</span>
                </div>
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
              <p className="text-center text-gray-600 mb-4 px-4">{pkg.subtitle}</p>

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

export default FamilyCarePackages;
