import { FaEye, FaHeart, FaUsers, FaChartBar } from "react-icons/fa";

const TaskDescriptionSection = () => {
    return (
        <div className="py-12 px-6 sm:px-8 bg-gradient-to-t from-white to-amber-50 rounded-2xl fade-in overflow-hidden">
            <style>
                {`
          .fade-in {
            animation: fadeIn 1.2s ease-out;
          }
          .orb-float:hover {
            transform: translateY(-6px) scale(1.05);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .parchment-effect {
            background: linear-gradient(to bottom, rgba(255, 245, 230, 0.95), rgba(255, 255, 255, 0.9));
            box-shadow: inset 0 0 10px rgba(255, 147, 0, 0.2);
            border: 2px solid rgba(255, 147, 0, 0.3);
          }
          .text-fancy {
            font-family: 'Inter', sans-serif;
            letter-spacing: 0.03em;
          }
          .text-italic {
            font-family: 'Playfair Display', serif;
            font-style: italic;
          }
          .title-pulse {
            animation: titlePulse 2.5s ease-in-out infinite alternate;
            font-family: 'Playfair Display', serif;
          }
          .orb-glow {
            animation: orbGlow 2s ease-in-out infinite alternate;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes titlePulse {
            from { transform: scale(1); }
            to { transform: scale(1.02); }
          }
          @keyframes orbGlow {
            from { box-shadow: 0 0 8px rgba(255, 147, 0, 0.4); }
            to { box-shadow: 0 0 16px rgba(255, 147, 0, 0.6); }
          }
        `}
            </style>
            <div className=" w-full mx-auto">
                <div className="flex justify-between items-start mb-10">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 flex items-center gap-3 title-glow transform translate-x-2">
                        <span className="text-amber-500 text-3xl"></span> Task Description
                    </h2>
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-bold uppercase rounded-full shadow-sm text-fancy mt-4 sm:mt-0">
                        NEW
                    </span>
                </div>
                <div className="relative">
                    <div className="parchment-effect p-6 rounded-xl mb-10 transform -rotate-2">
                        <p className="text-gray-700 text-base text-italic leading-relaxed">
                            Deep cleaning of 3-bedroom apartment. Kitchen, bathrooms, and living areas need thorough cleaning. Special attention needed for kitchen appliances and bathroom fixtures. All supplies provided.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <style>
                            {`
      .orb-float:hover {
        transform: translateY(-6px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .orb-glow {
        animation: orbGlow 2s ease-in-out infinite alternate;
      }
      @keyframes orbGlow {
        from { box-shadow: 0 0 8px rgba(255, 147, 0, 0.4); }
        to { box-shadow: 0 0 16px rgba(255, 147, 0, 0.6); }
      }
    `}
                        </style>
                        {[
                            {
                                icon: <FaEye className="text-amber-500 text-4xl" />,
                                label: "Total Views",
                                value: "57",
                                color: "amber-400",
                                transform: "translate-y-0",
                            },
                            {
                                icon: <FaHeart className="text-rose-500 text-4xl" />,
                                label: "Favorites",
                                value: "8",
                                color: "rose-400",
                                transform: "translate-y-0",
                            },
                            {
                                icon: <FaUsers className="text-emerald-500 text-4xl" />,
                                label: "Interested",
                                value: "15",
                                color: "emerald-400",
                                transform: "translate-y-0",
                            },
                            {
                                icon: <FaChartBar className="text-indigo-500 text-4xl" />,
                                label: "Reach",
                                value: "2.3k",
                                color: "indigo-400",
                                transform: "translate-y-0",
                            },
                        ].map((metric, i) => (
                            <div
                                key={i}
                                className={`bg-white p-6 rounded-xl orb-float orb-glow transform ${metric.transform}`}
                                style={{ background: `radial-gradient(circle, rgba(255, 255, 255, 0.95), rgba(${metric.color.replace('rgb(', '').replace(')', '')}, 0.1))` }}
                            >
                                <div className="flex items-center gap-4">
                                    {metric.icon}
                                    <div>
                                        <p className="text-gray-800 font-bold text-fancy text-base">{metric.label}</p>
                                        <p className="text-gray-700 font-extrabold text-2xl text-fancy">{metric.value}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="absolute top-0 left-0 w-6 h-6 rounded-full bg-amber-300 opacity-30 animate-pulse" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-rose-300 opacity-30 animate-pulse" />
                </div>
            </div>
        </div>
    );
};

export default TaskDescriptionSection;