import { FaBolt, FaClock } from "react-icons/fa";

const UrgentPriority = () => {
  return (
    <div className="bg-gradient-to-r from-[#FF8906] to-orange-300 text-white rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div className="flex items-start gap-4">
        <div className="text-4xl bg-white/20 p-3 rounded-full shadow-lg">
          <FaBolt />
        </div>
        <div>
          <h3 className="text-xl font-bold tracking-wide">⚡ URGENT PRIORITY</h3>
          <p className="text-sm opacity-90 mt-1">
            Your task is prioritized and will receive faster responses from available taskers
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm bg-white/20 px-4 py-2 rounded-xl shadow-md">
        <FaClock className="text-white text-base" />
        <span>⏰ Posted 3 mins ago</span>
      </div>
    </div>
  );
};

export default UrgentPriority;
