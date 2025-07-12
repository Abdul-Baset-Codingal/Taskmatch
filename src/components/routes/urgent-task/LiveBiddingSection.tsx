import { FaStar } from "react-icons/fa";

const LiveBiddingSection = () => {
  return (
    <div className="py-12 px-6 sm:px-8 bg-gradient-to-br from-white to-orange-50 rounded-2xl fade-in overflow-hidden">
      <style>
        {`
          .fade-in {
            animation: fadeIn 1.2s ease-out;
          }
          .bid-float:hover {
            transform: translateY(-6px) rotate(2deg);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .recommended-glow {
            animation: glowPulse 2s ease-in-out infinite alternate;
          }
          .glass-effect {
            background: rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.4);
          }
          .holo-line {
            background: linear-gradient(to right, transparent, rgba(255, 147, 0, 0.6), rgba(236, 72, 153, 0.6), transparent);
          }
          .title-glow {
            animation: textGlow 2s ease-in-out infinite alternate;
            font-family: 'Playfair Display', serif;
          }
          .text-fancy {
            font-family: 'Inter', sans-serif;
            letter-spacing: 0.02em;
          }
          .text-italic {
            font-family: 'Playfair Display', serif;
            font-style: italic;
          }
          .rate-pulse {
            animation: ratePulse 2s ease-in-out infinite alternate;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes glowPulse {
            from { box-shadow: 0 0 10px rgba(255, 147, 0, 0.6), 0 0 20px rgba(236, 72, 153, 0.4); }
            to { box-shadow: 0 0 20px rgba(255, 147, 0, 0.8), 0 0 30px rgba(236, 72, 153, 0.6); }
          }
          @keyframes textGlow {
            from { text-shadow: 0 0 5px rgba(255, 147, 0, 0.5); }
            to { text-shadow: 0 0 10px rgba(255, 147, 0, 0.7); }
          }
          @keyframes ratePulse {
            from { text-shadow: 0 0 5px rgba(0, 0, 0, 0.2); }
            to { text-shadow: 0 0 10px rgba(0, 0, 0, 0.4); }
          }
        `}
      </style>
      <div className="w-full mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 title-pulse transform translate-x-4">
            💰 Live Bidding Activity
          </h2>
          <div className="flex flex-col items-end gap-2 mt-4 sm:mt-0">
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 text-xs font-bold uppercase rounded-full shadow-sm text-fancy">
              NEW
            </span>
            <span className="text-gray-600 text-sm font-medium text-fancy">
              Updated 23 sec ago
            </span>
          </div>
        </div>
        <div className="relative space-y-8">
          {[
            {
              name: "Sarah M.",
              rate: "$85/hr",
              rating: 4.9,
              availability: "Available immediately",
              reviews: "127 reviews",
              total: "$276",
              recommended: false,
              transform: "translate-x-4",
              color: "amber-400",
              rateColor: "text-amber-600",
            },
            {
              name: "Alex K.",
              rate: "$78/hr",
              rating: 5.0,
              availability: "Can start in 2 hours",
              reviews: "89 reviews",
              total: "$255",
              recommended: false,
              transform: "-translate-x-4",
              color: "emerald-400",
              rateColor: "text-emerald-600",
            },
            {
              name: "Mike D.",
              rate: "$82/hr",
              rating: 4.8,
              availability: "15 years experience",
              reviews: "203 reviews",
              total: "$264",
              recommended: true,
              transform: "translate-x-8",
              color: "rose-400",
              rateColor: "text-rose-600",
            },
          ].map((bid, i) => (
            <div
              key={i}
              className={`relative glass-effect p-6 rounded-2xl bid-float transform ${bid.transform} ${
                bid.recommended ? "recommended-glow border-2 border-rose-400" : ""
              }`}
            >
              {bid.recommended && (
                <span className="absolute -top-3 -right-3 bg-rose-500 text-white px-3 py-1 text-xs font-bold uppercase rounded-full shadow-md text-fancy">
                  RECOMMENDED
                </span>
              )}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-extrabold text-gray-800 text-fancy">{bid.name}</h3>
                  <span className={`${bid.rateColor} font-bold text-2xl rate-pulse`}>{bid.rate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    {[...Array(Math.floor(bid.rating))].map((_, j) => (
                      <FaStar key={j} className="text-amber-500 text-sm" />
                    ))}
                    {bid.rating % 1 !== 0 && <FaStar className="text-amber-300 text-sm" />}
                  </span>
                  <span className="text-gray-600 text-sm text-fancy">{bid.rating}</span>
                </div>
                <p className="text-gray-600 text-sm text-italic">{bid.availability}</p>
                <p className="text-gray-500 text-xs text-fancy">{bid.reviews}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-800 font-extrabold text-xl text-fancy">Total: {bid.total}</span>
                  <a
                    href="#"
                    className="text-indigo-600 text-sm font-bold text-fancy hover:text-indigo-800 transition-colors"
                  >
                    View Full Receipt
                  </a>
                </div>
              </div>
              <div
                className="absolute bottom-0 left-0 w-full h-1 holo-line"
                style={{ background: `linear-gradient(to right, transparent, ${bid.color}, transparent)` }}
              />
              <div
                className="absolute top-0 right-0 w-16 h-16 rounded-full opacity-20"
                style={{ background: `radial-gradient(circle, ${bid.color}, transparent)` }}
              />
            </div>
          ))}
          <div className="absolute top-0 left-0 w-6 h-6 rounded-full bg-amber-300 opacity-30 animate-pulse" />
          <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-rose-300 opacity-30 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default LiveBiddingSection;