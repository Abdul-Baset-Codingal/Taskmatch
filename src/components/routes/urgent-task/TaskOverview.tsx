/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FaClock,
  FaEye,
  FaHouseUser,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaMoneyBillWave,
  FaTag,
  FaChartLine,
} from "react-icons/fa";

const TaskOverview = () => {
  return (
    <div className="bg-gradient-to-br from-white to-orange-50 min-h-screen py-10 px-4 sm:px-8 lg:px-16 font-sans">
      <style>
        {`
          .header-clean {
            background: rgba(255, 255, 255, 0.95);
            border-bottom: 2px solid rgba(255, 147, 0, 0.3);
            position: relative;
            overflow: hidden;
          }
          .fade-in {
            animation: fadeIn 1s ease-out;
          }
          .tag-slide:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .title-underline {
            width: 120px;
            height: 3px;
            background: linear-gradient(to right, #ff9300, #ec4899);
            margin: 0 auto;
            transition: width 0.3s ease;
          }
          .header-clean:hover .title-underline {
            width: 160px;
          }
          .orb-glow {
            animation: orbPulse 2s ease-in-out infinite alternate;
          }
          .hover-float:hover {
            transform: translateY(-6px) rotate(2deg);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
          }
          .glass-effect {
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.3);
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes orbPulse {
            from { box-shadow: 0 0 10px var(--orb-color); }
            to { box-shadow: 0 0 20px var(--orb-color); }
          }
        `}
      </style>

      <div className="w-full mx-auto">
        {/* Header Section - Clean and Minimalist */}
        <div className="relative py-10 px-6 sm:px-8  rounded-xl  overflow-hidden fade-in">
          <style>
            {`
      .fade-in {
        animation: fadeIn 1s ease-out;
      }
      .tag-pop:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .urgent-pulse {
        animation: urgentPulse 1.8s ease-in-out infinite;
      }
      .title-slide {
        animation: slideInTitle 1.2s ease-out;
      }
      .tag-stack {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-end;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes urgentPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.04); }
      }
      @keyframes slideInTitle {
        from { opacity: 0; transform: translateX(-15px); }
        to { opacity: 1; transform: translateX(0); }
      }
    `}
          </style>
          <div className="relative z-10 flex justify-between items-start">
            <div className="ml-4 sm:ml-6">
              <style>
                {`
      .title-slide {
        animation: slideInTitle 1.2s ease-out;
      }
      .tag-pop:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .live-glow {
        animation: liveGlow 2s ease-in-out infinite alternate;
      }
      .text-fancy {
        font-family: 'Inter', sans-serif;
        letter-spacing: 0.02em;
      }
      .title-fancy {
        font-family: 'Playfair Display', serif;
      }
      @keyframes slideInTitle {
        from { opacity: 0; transform: translateX(-15px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes liveGlow {
        from { box-shadow: 0 0 5px rgba(52, 211, 153, 0.5); }
        to { box-shadow: 0 0 10px rgba(52, 211, 153, 0.8); }
      }
    `}
              </style>
              <div className="flex items-center gap-4 mb-4 title-slide relative">
                <span className="text-4xl text-amber-400 transform -rotate-6">📋</span>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 title-fancy">
                    Task Overview
                  </h1>
                  <span className="absolute top-0 -right-8 bg-emerald-500 text-white px-3 py-1 text-xs font-semibold rounded-full tag-pop live-glow">
                    LIVE
                  </span>
                </div>
              </div>
              <p className="text-base sm:text-lg text-gray-600 font-medium max-w-sm text-fancy">
                ⚡ Real-Time Activity Dashboard
              </p>
              <div className="w-24 h-1 mt-2 bg-gradient-to-r from-amber-400 to-rose-400 rounded-full" />
            </div>
            <div className="flex gap-2 mr-4 sm:mr-6">
              <style>
                {`
      .tag-stack {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-end;
      }
      .tag-pop:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .urgent-pulse {
        animation: urgentPulse 1.8s ease-in-out infinite;
      }
      .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        display: inline-block;
        margin-right: 4px;
      }
      @keyframes urgentPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.04); }
      }
    `}
              </style>
              {[
                { text: "URGENT", color: "bg-orange-100 text-orange-700", shadow: "shadow-rose-200/30 urgent-pulse", size: "text-sm px-4 py-1.5", dotColor: "bg-rose-400" },
                { text: "ACTIVE", color: "bg-emerald-100 text-emerald-700", shadow: "shadow-emerald-200/30", size: "text-sm px-4 py-1.5", dotColor: "bg-emerald-400" },
              ].map((tag, i) => (
                <span
                  key={i}
                  className={`${tag.color} ${tag.shadow} ${tag.size} font-semibold rounded-md tag-pop flex items-center`}
                >
                  <span className={`${tag.dotColor} dot`} />
                  {tag.text}
                </span>
              ))}
            </div>
            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-200 opacity-40 animate-pulse" />
          </div>
        </div>

        {/* Stats Section - Floating Orbs */}
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 fade-in">
          {[
            {
              icon: <FaCheckCircle className="text-green-600 text-4xl" />,
              title: "3 Active Bids",
              sub: "Taskers currently bidding",
              color: "rgb(34, 197, 94)",
            },
            {
              icon: <FaEye className="text-blue-600 text-4xl" />,
              title: "16 Viewing Now",
              sub: "Currently checking the task",
              color: "rgb(37, 99, 235)",
            },
            {
              icon: <FaClock className="text-yellow-600 text-4xl" />,
              title: "0:45 Last Activity",
              sub: "45 seconds ago",
              color: "rgb(234, 179, 8)",
            },
            {
              icon: <FaChartLine className="text-purple-600 text-4xl" />,
              title: "95% Response Rate",
              sub: "Taskers respond quickly",
              color: "rgb(147, 51, 234)",
            },
            {
              icon: <span className="text-4xl text-pink-600">💬</span>,
              title: "15 Interested",
              sub: "Taskers showed interest",
              color: "rgb(219, 39, 119)",
            },
            {
              icon: <span className="text-4xl text-cyan-600">🎯</span>,
              title: "Expected Match: 45 min",
              sub: "High confidence estimate",
              color: "rgb(6, 182, 212)",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="relative flex items-center gap-6 hover-float"
              style={{ ["--orb-color" as any]: stat.color }}
            >
              <div className="relative w-16 h-16 flex-shrink-0 orb-glow">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white to-gray-100 opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center">{stat.icon}</div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800">{stat.title}</h3>
                <p className="text-sm text-gray-500">{stat.sub}</p>
              </div>
              <div
                className="absolute top-0 right-0 w-24 h-24 opacity-10"
                style={{ background: `radial-gradient(circle, ${stat.color}, transparent)` }}
              />
            </div>
          ))}
        </div>

        {/* Details Section - Staggered Glassmorphism Layout */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 gap-8 fade-in">
          {[
            {
              icon: <FaHouseUser className="text-orange-500 text-5xl" />,
              title: "Service Type",
              value: "Home Cleaning",
              desc: "Deep cleaning service",
              color: "orange-500",
              transform: "translate-x-4",
            },
            {
              icon: <FaMoneyBillWave className="text-green-500 text-5xl" />,
              title: "Price Range",
              value: "$150 - $200",
              desc: "Based on current bids",
              color: "green-500",
              transform: "-translate-x-4",
            },
            {
              icon: <FaClock className="text-yellow-500 text-5xl" />,
              title: "When Needed",
              value: "As soon as possible",
              desc: "Urgent priority",
              color: "yellow-500",
              transform: "translate-x-4",
            },
            {
              icon: <FaMapMarkerAlt className="text-pink-500 text-5xl" />,
              title: "Location",
              value: "Downtown Toronto, ON",
              desc: "City center area",
              color: "pink-500",
              transform: "-translate-x-4",
            },
            {
              icon: <FaChartLine className="text-indigo-500 text-5xl" />,
              title: "Expected Match",
              value: "Within 45 minutes",
              desc: "High confidence estimate",
              color: "indigo-500",
              transform: "translate-x-4",
            },
            {
              icon: <FaTag className="text-gray-600 text-5xl" />,
              title: "Task ID",
              value: "#TM2024-URG-001",
              desc: "Reference number",
              color: "gray-600",
              transform: "-translate-x-4",
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`relative py-8 px-6 glass-effect rounded-2xl hover-float transform ${item.transform}`}
            >
              <div className="flex items-start gap-5">
                <span className="p-4 rounded-full" style={{ background: `rgba(${item.color.replace('rgb(', '').replace(')', '')}, 0.15)` }}>
                  {item.icon}
                </span>
                <div>
                  <h4 className="text-lg font-bold text-gray-800">{item.title}</h4>
                  <p className="text-xl font-medium text-gray-900">{item.value}</p>
                  <p className="text-sm text-gray-500 mt-2">{item.desc}</p>
                </div>
              </div>
              <div
                className="absolute top-0 left-0 w-full h-1"
                style={{ background: `linear-gradient(to right, ${item.color}, transparent)` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskOverview;