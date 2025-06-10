import { FaTruck, FaRecycle, FaHandsHelping, FaClock } from "react-icons/fa";

export default function JunkRemovalIncludedSection() {
  const features = [
    {
      icon: <FaTruck className="text-4xl text-white" />,
      title: "Fast & Reliable Pickup",
      desc: "We pick up your junk quickly and efficiently, saving you time and effort.",
    },
    {
      icon: <FaRecycle className="text-4xl text-white" />,
      title: "Eco-Friendly Disposal",
      desc: "Committed to recycling and disposing of junk responsibly to protect the environment.",
    },
    {
      icon: <FaHandsHelping className="text-4xl text-white" />,
      title: "Professional Assistance",
      desc: "Our friendly team helps you declutter with care and expertise.",
    },
    {
      icon: <FaClock className="text-4xl text-white" />,
      title: "Flexible Scheduling",
      desc: "Choose a pickup time that fits your busy lifestyle.",
    },
  ];

  return (
    <section className="bg-gradient-to-r from-[#7F5AEF] to-[#6548B1] py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <h2 className="text-4xl font-extrabold text-white text-center mb-4">
          🗑️ Included in JunkRemoval Service
        </h2>
        <p className="text-center text-white/80 mb-12 text-sm max-w-2xl mx-auto">
          Experience hassle-free junk removal with our comprehensive service features.
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
