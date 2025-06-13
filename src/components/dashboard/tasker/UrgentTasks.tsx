import { FaMapMarkerAlt, FaClock, FaCalendarAlt } from "react-icons/fa";
import { MdAccessTime, MdOutlinePlayArrow } from "react-icons/md";

const urgentTasks = [
  {
    title: "Water Leak Emergency",
    price: "$120",
    location: "Downtown Toronto, ON · 2.4 miles away",
    eta: "ETA: 18 min",
    posted: "Posted: 14 minutes ago",
    description:
      "Bathroom pipe burst with active water leak. Need immediate help to stop water and assess damage.",
    mediaCount: 3,
    deadline: "Deadline: 50:03",
  },
  {
    title: "Lockout Assistance",
    price: "$75",
    location: "Scarborough, ON · 5.2 miles away",
    eta: "ETA: 25 min",
    posted: "Posted: 32 minutes ago",
    description:
      "Locked out of apartment. Need help getting in. Have ID and proof of residence ready to show.",
    mediaCount: 2,
    deadline: "Deadline: 82:55",
  },
];

export default function UrgentTaskCards() {
  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-[#F45F47] to-[#D77C1C] flex flex-col items-center justify-center gap-10">
      {/* Section Title */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white drop-shadow-md">
          URGENT TASKS - Immediate Action Required
        </h1>
        <p className="text-lg mt-2 font-semibold text-white ">2 new tasks</p>
      </div>

      {/* Cards Container */}
      <div className="flex flex-wrap justify-center items-center gap-8">
        {urgentTasks.map((task, index) => (
          <div
            key={index}
            className="w-full sm:w-[450px] border-2 rounded-3xl border-[#FFA651] p-6 bg-gradient-to-br from-[#FFF9F2] to-[#FFF3E7] shadow-2xl shadow-[#FF9800]/30 relative overflow-hidden"
          >
            {/* Badge */}
            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#FF6B6B] to-[#FFA751] text-white px-4 py-1 rounded-full text-xs font-bold shadow-md">
              URGENT · ASAP
            </div>

            {/* Icon */}
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-3xl font-bold bg-gradient-to-br from-[#FF7F50] to-[#FFA500] shadow-lg">
              ⚠️
            </div>

            {/* Title & Price */}
            <div className="flex justify-between items-center mt-4">
              <h2 className="text-2xl font-extrabold text-[#FF7B00]">
                {task.title}
              </h2>
              <div className="text-xl font-bold text-[#FF5722] bg-[#FFE9DC] px-3 py-1 rounded-xl shadow-sm">
                {task.price}
              </div>
            </div>

            {/* Info Section */}
            <div className="mt-3 space-y-2 text-sm text-[#555] font-medium">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#FF7A00]" />
                {task.location}
              </div>
              <div className="flex items-center gap-2">
                <MdAccessTime className="text-[#FF7A00]" />
                {task.eta}
              </div>
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-[#FF7A00]" />
                {task.posted}
              </div>
            </div>

            {/* Description */}
            <p className="mt-4 text-[#6B4E2F] bg-[#FFF4E8] p-3 rounded-lg shadow-inner">
              {task.description}
            </p>

            {/* Media & Deadline */}
            <div className="mt-5 flex justify-between items-center text-sm text-[#FF7B00] font-semibold">
              <div className="flex items-center gap-2 cursor-pointer hover:underline">
                <MdOutlinePlayArrow />
                View All Media ({task.mediaCount})
              </div>
              <div className="flex items-center gap-2">
                <FaClock />
                {task.deadline}
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="bg-[#FFE3DC] hover:bg-[#FFCCCB] text-[#D63A3A] font-semibold px-4 py-2 rounded-xl transition">
                Decline
              </button>
              <button className="bg-[#FFF1D6] hover:bg-[#FFE5B4] text-[#A15500] font-semibold px-4 py-2 rounded-xl transition">
                Join Pool
              </button>
              <button className="bg-[#FF7B00] hover:bg-[#e76900] text-white font-bold px-4 py-2 rounded-xl transition">
                Accept Now · {task.price}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
