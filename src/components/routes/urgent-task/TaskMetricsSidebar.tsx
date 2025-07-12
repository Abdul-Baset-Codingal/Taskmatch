import { FaEye, FaQuoteRight, FaClock, FaFire } from "react-icons/fa";

const TaskMetricsSidebar = () => {
  return (
    <div className=" bg-gradient-to-b from-white to-amber-50 p-6 rounded-2xl fade-in  overflow-y-auto">
      <style>
        {`
          .fade-in {
            animation: fadeIn 1.2s ease-out;
          }
          .metric-float:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .glass-effect {
            background: rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.4);
          }
          .text-fancy {
            font-family: 'Inter', sans-serif;
            letter-spacing: 0.02em;
          }
          .title-glow {
            animation: textGlow 2s ease-in-out infinite alternate;
            font-family: 'Playfair Display', serif;
          }
          .scrollbar-custom::-webkit-scrollbar {
            width: 6px;
          }
          .scrollbar-custom::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
          }
          .scrollbar-custom::-webkit-scrollbar-thumb {
            background: rgba(255, 147, 0, 0.6);
            border-radius: 3px;
          }
          .scrollbar-custom::-webkit-scrollbar-thumb:hover {
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
      <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-3 mb-6 title-glow">
        <span className="text-amber-500 text-3xl">📊</span> Task Metrics
      </h2>
      <div className="space-y-4 scrollbar-custom">
        {[
          {
            icon: <FaEye className="text-amber-500 text-3xl" />,
            label: "Total Views",
            value: "72",
            color: "amber-400",
          },
          {
            icon: <FaQuoteRight className="text-emerald-500 text-3xl" />,
            label: "Active Bids",
            value: "3",
            color: "emerald-400",
          },
          {
            icon: <FaClock className="text-indigo-500 text-3xl" />,
            label: "Avg Response",
            value: "3 min",
            color: "indigo-400",
          },
          {
            icon: <FaFire className="text-rose-500 text-3xl" />,
            label: "Interest Level",
            value: "High interest from taskers",
            color: "rose-400",
          },
        ].map((metric, i) => (
          <div
            key={i}
            className="glass-effect p-4 rounded-lg metric-float"
          >
            <div className="flex items-center gap-3">
              {metric.icon}
              <div>
                <p className="text-gray-800 font-bold text-fancy text-sm">{metric.label}</p>
                <p className="text-gray-700 font-extrabold text-lg text-fancy">{metric.value}</p>
              </div>
            </div>
            <div
              className="mt-2 h-1 rounded-full"
              style={{ background: `linear-gradient(to right, transparent, ${metric.color}, transparent)` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskMetricsSidebar;