import { FaTruckMoving, FaUserShield, FaBoxOpen, FaCouch } from "react-icons/fa";

export default function FancyIncludedInEveryMoveSection() {
  const features = [
    {
      icon: <FaTruckMoving className="text-4xl text-white" />,
      title: "Professional Movers",
      desc: "Experienced and courteous moving professionals ensure safe handling.",
    },
    {
      icon: <FaUserShield className="text-4xl text-white" />,
      title: "Insurance Coverage",
      desc: "Full protection for your belongings during the entire move.",
    },
    {
      icon: <FaBoxOpen className="text-4xl text-white" />,
      title: "Packing Materials",
      desc: "We bring all boxes, tapes, and wraps to secure your items.",
    },
    {
      icon: <FaCouch className="text-4xl text-white" />,
      title: "Furniture Protection",
      desc: "Free padding, blankets, and disassembly/reassembly included.",
    },
  ];

  return (
    <section className="bg-gradient-to-r from-[#7F5AEF] to-[#6548B1] py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <h2 className="text-4xl font-extrabold text-white text-center mb-4">
          📦 Included in Every Move
        </h2>
        <p className="text-center text-white/80 mb-12 text-sm max-w-2xl mx-auto">
          These perks are standard in every move — no extra fees, just extra care.
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
