import { FaChild, FaHeartbeat, FaHandsHelping, FaHome } from "react-icons/fa";

export default function FamilyCareIncludedSection() {
  const features = [
    {
      icon: <FaChild className="text-4xl text-white" />,
      title: "Child-Friendly Environment",
      desc: "Safe and fun spaces designed specifically for children of all ages.",
    },
    {
      icon: <FaHeartbeat className="text-4xl text-white" />,
      title: "Health & Wellness Monitoring",
      desc: "Regular check-ups and personalized wellness tracking for the whole family.",
    },
    {
      icon: <FaHandsHelping className="text-4xl text-white" />,
      title: "Supportive Staff",
      desc: "Friendly caregivers and experts to guide and support every step.",
    },
    {
      icon: <FaHome className="text-4xl text-white" />,
      title: "Comfort Like Home",
      desc: "Warm, welcoming atmosphere that makes families feel at ease.",
    },
  ];

  return (
    <section className="bg-gradient-to-r from-[#7F5AEF] to-[#6548B1] py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <h2 className="text-4xl font-extrabold text-white text-center mb-4">
          👨‍👩‍👧‍👦 Included in FamilyCare
        </h2>
        <p className="text-center text-white/80 mb-12 text-sm max-w-2xl mx-auto">
          Discover the thoughtful care and amenities every family enjoys with us.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-white shadow-lg hover:scale-[1.05] transition-transform duration-300 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition duration-500 rounded-2xl pointer-events-none" />
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-white/90">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
