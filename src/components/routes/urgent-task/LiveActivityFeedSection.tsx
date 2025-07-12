import { FaStar, FaEye, FaQuoteRight, FaHeart, FaCheckCircle } from "react-icons/fa";

const LiveActivityFeedSection = () => {
  return (
    <div className="py-12 px-6 sm:px-8 bg-gradient-to-b from-white to-amber-50 rounded-2xl fade-in overflow-hidden">
      <style>
        {`
          .fade-in {
            animation: fadeIn 1.2s ease-out;
          }
          .activity-float:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .glass-effect {
            background: rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.4);
          }
          .timeline-line {
            position: absolute;
            left: 2.5rem;
            top: 0;
            bottom: 0;
            width: 2px;
            background: linear-gradient(to bottom, rgba(255, 147, 0, 0.6), rgba(236, 72, 153, 0.6));
          }
          .text-fancy {
            font-family: 'Inter', sans-serif;
            letter-spacing: 0.02em;
          }
          .text-italic {
            font-family: 'Playfair Display', serif;
            font-style: italic;
          }
          .title-glow {
            animation: textGlow 2s ease-in-out infinite alternate;
            font-family: 'Playfair Display', serif;
          }
          .scrollable-feed {
            max-height: 400px;
            overflow-y: auto;
            padding-right: 8px;
          }
          .scrollable-feed::-webkit-scrollbar {
            width: 6px;
          }
          .scrollable-feed::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
          }
          .scrollable-feed::-webkit-scrollbar-thumb {
            background: rgba(255, 147, 0, 0.6);
            border-radius: 3px;
          }
          .scrollable-feed::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 147, 0, 0.8);
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes textGlow {
            from { text-shadow: 0 0 5px rgba(255, 147, 0, 0.5); }
            to { text-shadow: 0 0 10px rgba(255, 147, 0, 0.7); }
          }
        `}
      </style>
      <div className="w-full mx-auto">
        <div className="flex justify-between items-start mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 flex items-center gap-3 title-glow transform translate-x-2">
            <span className="text-amber-500 text-3xl">🔔</span> Live Activity Feed
          </h2>
        </div>
        <div className="relative scrollable-feed">
          <div className="timeline-line"></div>
          {[
            {
              icon: <FaQuoteRight className="text-indigo-500 text-2xl" />,
              action: "New bid received from Sarah M.",
              details: "Available today, 4.9★ rating",
              time: "Just now",
              link: "View Bid",
              color: "indigo-400",
            },
            {
              icon: <FaEye className="text-amber-500 text-2xl" />,
              action: "Mike D. viewed your task",
              details: "Professional cleaner, 5.0★ rating",
              time: "2 mins ago",
              link: null,
              color: "amber-400",
            },
            {
              icon: <FaQuoteRight className="text-emerald-500 text-2xl" />,
              action: "Alex K. submitted a quote",
              details: "Can start in 2 hours",
              time: "3 mins ago",
              link: "View Quote",
              color: "emerald-400",
            },
            {
              icon: <FaHeart className="text-rose-500 text-2xl" />,
              action: "Emma R. is interested",
              details: "Added your task to favorites",
              time: "5 mins ago",
              link: null,
              color: "rose-400",
            },
            {
              icon: <FaCheckCircle className="text-blue-500 text-2xl" />,
              action: "Your urgent task is now live!",
              details: "Posted successfully and visible to taskers",
              time: "8 mins ago",
              link: null,
              color: "blue-400",
            },
          ].map((activity, i) => (
            <div
              key={i}
              className="relative glass-effect p-4 rounded-lg mb-4 activity-float"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white flex items-center justify-center relative z-10">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 font-bold text-fancy text-base">{activity.action}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-gray-600 text-sm text-italic">{activity.details}</p>
                    {activity.details.includes("★") && (
                      <span className="flex items-center gap-1">
                        {activity.details.match(/\d\.\d/) && (
                          <>
                            {[...Array(parseInt(activity.details.match(/\d\.\d/)![0][0]))].map((_, j) => (
                              <FaStar key={j} className="text-amber-500 text-xs" />
                            ))}
                            {activity.details.match(/\d\.\d/)![0][2] !== "0" && (
                              <FaStar className="text-amber-300 text-xs" />
                            )}
                          </>
                        )}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs text-fancy mt-1">{activity.time}</p>
                  {activity.link && (
                    <a
                      href="#"
                      className="text-indigo-600 text-sm font-bold text-fancy hover:text-indigo-800 transition-colors mt-2 inline-block"
                    >
                      {activity.link}
                    </a>
                  )}
                </div>
              </div>
              <div
                className="absolute top-0 left-0 w-full h-1"
                style={{ background: `linear-gradient(to right, transparent, ${activity.color}, transparent)` }}
              />
            </div>
          ))}
        </div>
        <div className="absolute top-0 left-0 w-6 h-6 rounded-full bg-amber-300 opacity-30 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-rose-300 opacity-30 animate-pulse" />
      </div>
    </div>
  );
};

export default LiveActivityFeedSection;