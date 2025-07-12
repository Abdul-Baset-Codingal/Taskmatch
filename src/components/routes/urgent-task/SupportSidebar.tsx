/* eslint-disable react/no-unescaped-entities */
import { FaHeadset, FaLifeRing, FaEnvelopeOpenText } from "react-icons/fa";

const SupportSidebar = () => {
  return (
    <div className="bg-gradient-to-b from-white to-orange-50 p-6 rounded-2xl fade-in overflow-y-auto">
      <style>
        {`
          .fade-in {
            animation: fadeIn 1.2s ease-out;
          }
          .support-float:hover {
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
            from { text-shadow: 0 0 5px rgba(255, 147, 0, 0.5); }
            to { text-shadow: 0 0 10px rgba(255, 147, 0, 0.7); }
          }
        `}
      </style>

      <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-3 mb-6 title-glow">
        <span className="text-orange-500 text-3xl">💬</span> Need Help?
      </h2>

      <div className="glass-effect p-4 rounded-lg support-float">
        <div className="flex items-start gap-4">
          <FaHeadset className="text-orange-500 text-4xl" />
          <div>
            <p className="text-fancy text-sm text-gray-800 font-semibold">
              Our support team is here to assist you 24/7
            </p>
            <p className="text-gray-600 text-xs mt-1">We're just a message away whenever you need help.</p>
          </div>
        </div>
        <button className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all duration-300">
          <div className="flex items-center justify-center gap-2">
            <FaEnvelopeOpenText className="text-white" />
            Contact Support
          </div>
        </button>
      </div>

      <div className="mt-6 glass-effect p-4 rounded-lg support-float flex items-start gap-4">
        <FaLifeRing className="text-indigo-500 text-3xl" />
        <div>
          <p className="text-sm font-bold text-gray-800 text-fancy">Live Chat Available</p>
          <p className="text-xs text-gray-600">Connect instantly with an agent through our in-app live chat.</p>
        </div>
      </div>
    </div>
  );
};

export default SupportSidebar;
