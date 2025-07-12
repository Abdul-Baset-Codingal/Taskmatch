import { FaListAlt, FaUsers, FaEdit, FaMapPin } from "react-icons/fa";

const QuickActionsSidebar = () => {
  return (
    <div className="w-full bg-gradient-to-b from-white to-rose-50 p-6 rounded-2xl fade-in mt-6">
      <style>
        {`
          .fade-in {
            animation: fadeIn 1.2s ease-out;
          }
          .action-float:hover {
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
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes textGlow {
            from { text-shadow: 0 0 5px rgba(236, 72, 153, 0.5); }
            to { text-shadow: 0 0 10px rgba(236, 72, 153, 0.7); }
          }
        `}
      </style>
      <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-3 mb-6 title-glow">
        <span className="text-rose-500 text-3xl">⚡</span> Quick Actions
      </h2>
      <div className="space-y-4">
        {[
          {
            icon: <FaListAlt className="text-indigo-500 text-2xl" />,
            action: "View All Bids",
            subtitle: "3 new proposals",
            color: "indigo-400",
          },
          {
            icon: <FaUsers className="text-emerald-500 text-2xl" />,
            action: "Browse Taskers",
            subtitle: "Invite directly",
            color: "emerald-400",
          },
          {
            icon: <FaEdit className="text-amber-500 text-2xl" />,
            action: "Edit Task",
            subtitle: "Modify details",
            color: "amber-400",
          },
          {
            icon: <FaMapPin className="text-rose-500 text-2xl" />,
            action: "Track Progress",
            subtitle: "Real-time updates",
            color: "rose-400",
          },
        ].map((action, i) => (
          <div
            key={i}
            className="glass-effect p-4 rounded-lg action-float cursor-pointer"
          >
            <div className="flex items-center gap-3">
              {action.icon}
              <div>
                <p className="text-gray-800 font-bold text-fancy text-base">{action.action}</p>
                <p className="text-gray-600 text-sm text-fancy">{action.subtitle}</p>
              </div>
            </div>
            <div
              className="mt-2 h-1 rounded-full"
              style={{ background: `linear-gradient(to right, transparent, ${action.color}, transparent)` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsSidebar;