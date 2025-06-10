import React from "react";
import { MdCheckCircle } from "react-icons/md";

const wellnessPackages = [
  {
    id: 1,
    accent: "#C084FC",
    header: "RELAX & REVIVE",
    emoji: "💆‍♀️",
    title: "Spa Therapy",
    price: "$120",
    subtitle: "Rejuvenating full-body experience",
    features: [
      "60-minute full-body massage",
      "Aromatherapy included",
      "Herbal steam session",
      "Skincare consultation",
      "Complimentary detox drink",
    ],
    buttonText: "Book Spa Session",
  },
  {
    id: 2,
    accent: "#60A5FA",
    header: "GLAM UP ⭐",
    emoji: "💄",
    title: "Beauty Makeover",
    price: "$200",
    subtitle: "Complete beauty transformation",
    features: [
      "Professional makeup",
      "Hair styling & trim",
      "Facial treatment",
      "Manicure & pedicure",
      "Skin hydration pack",
      "Before/After photo shoot",
    ],
    buttonText: "Book Makeover",
  },
  {
    id: 3,
    accent: "#34D399",
    header: "FIT & FRESH",
    emoji: "🧘‍♀️",
    title: "Wellness Routine",
    price: "$80/month",
    subtitle: "Monthly wellness subscription",
    features: [
      "Weekly yoga classes",
      "Nutritional coaching",
      "Meditation sessions",
      "Skin health checkup",
      "Personalized care plan",
    ],
    buttonText: "Join Wellness Plan",
  },
];

const BeautyWellnessServicePackages = () => {
  return (
    <div>
      {/* Section Header */}
      <div className="w-full flex justify-center mt-10">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-[#C084FC] to-[#34D399] text-transparent bg-clip-text">
          Beauty & Wellness Packages 💖
        </h2>
      </div>
      <div className="flex justify-center mt-2">
        <div className="h-[4px] w-[70px] rounded-md bg-gradient-to-r from-[#C084FC] to-[#34D399]"></div>
      </div>
      <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-4xl mt-5 p-6 md:p-8 text-center space-y-4">
        <p className="text-lg font-medium text-gray-700">
          Transform your beauty and wellness journey with our expertly curated
          <span className="font-bold text-[#C084FC]"> premium care packages</span>. Relax, refresh, and radiate confidence.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6 bg-gray-50">
        {wellnessPackages.map((pkg) => (
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

export default BeautyWellnessServicePackages;
