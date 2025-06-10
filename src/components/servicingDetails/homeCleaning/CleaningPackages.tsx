import React from "react";
import { MdCheckCircle } from "react-icons/md";
const packages = [
  {
    id: 1,
    accent: "#7F5AEF",
    header: "POPULAR",
    emoji: "🧼",
    title: "Standard Cleaning",
    price: "$120",
    subtitle: "Our most popular service for regularly maintained homes",
    features: [
      "Vacuum and mop all floors",
      "Dust all surfaces and furniture",
      "Clean kitchen appliance exteriors",
      "Sanitize bathrooms",
      "Make beds (linens must be provided)",
      "Empty trash bins",
    ],
    buttonText: "Book Standard Clean",
  },
  {
    id: 2,
    accent: "#EF4444",
    header: "DEEP CLEAN 🔥",
    emoji: "🧽",
    title: "Deep Cleaning",
    price: "$200",
    subtitle: "Perfect for homes that need extra attention",
    features: [
      "Everything in Standard Cleaning",
      "Clean inside microwave and fridge",
      "Scrub sink and drain",
      "Clean inside cabinets",
      "Detail clean baseboards",
      "Remove limescale from shower/bath",
      "Clean interior windows",
      "Detail blinds and light fixtures",
    ],
    buttonText: "Book Deep Clean",
  },
  {
    id: 3,
    accent: "#FBBF24",
    header: "MOVE IN/OUT ✨",
    emoji: "🚚",
    title: "Move In/Out Cleaning",
    price: "$250",
    subtitle: "Comprehensive cleaning for moving or prepping a property",
    features: [
      "Everything in Deep Cleaning",
      "Clean inside all cabinets and drawers",
      "Clean inside oven",
      "Clean interior windows and tracks",
      "Deep clean refrigerator",
      "Spot clean walls",
      "Clean all light fixtures",
      "Clean interior/exterior of all appliances",
    ],
    buttonText: "Book Move In/Out",
  },
];

const CleaningPackages = () => {
  return (
    <div>
      <div>
        <div>
          <div className="w-full flex justify-center mt-10">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-[#7F5BF0] to-[#DCACFD] text-transparent bg-clip-text custom-font">
              Cleaning Packages✨{" "}
            </h2>
          </div>
          <div className="flex justify-center mt-2">
            <div className="flex rounded-md justify-center h-[4px] w-[70px] bg-gradient-to-r from-[#8560F1] to-[#E7B6FE]"></div>
          </div>
          <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-4xl mt-5 p-6 md:p-8 text-center space-y-4">
            <p className="text-lg font-medium text-gray-700">
              Save money by bundling pet care services together. Our packages
              are designed for different needs and situations at{" "}
              <span className="font-bold text-[#8560F1]">
                discounted rates.
              </span>
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
              <div style={{ backgroundColor: pkg.accent }}>
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

export default CleaningPackages;
