import Navbar from "@/shared/Navbar";
import React from "react";
import client1 from "../../../public/Images/clientImage1.jpg";
import Image from "next/image";
import TrackTask from "@/components/track-task/TrackTask";
import { FiMessageCircle, FiPhoneCall, FiRefreshCcw } from "react-icons/fi";

const cards = [
  {
    icon: "🚗",
    title: "Current Status",
    detail: "En Route to Your Location",
  },
  {
    icon: "⏱️",
    title: "Estimated Time of Arrival",
    detail: "15 minutes (ETA 3:45 PM)",
  },
  {
    icon: "📱",
    title: "Contact Info",
    detail: "+1 (555) 123-4567",
  },
  {
    icon: "🚩",
    title: "Current Location",
    detail: "Heading north on King St",
  },
];
const page = () => {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div className="flex justify-center">
        <div className="max-w-5xl w-full bg-[#10B0A9] p-5 flex justify-between rounded-3xl">
          <button className="text-white font-bold px-5 py-2 border rounded-3xl flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-white"></span> Tasker is en
            route to your location
          </button>
          <button className="text-white font-semibold py-2 px-4 shadow-2xl rounded-3xl bg-white/10 flex items-center gap-2">
            <FiRefreshCcw className="text-white text-base" />
            Refresh Status
          </button>
        </div>
      </div>
      <div className="flex justify-center mt-10 ">
        <div className="max-w-5xl py-12 px-8 shadow-2xl w-full ">
          <div className="flex gap-5 items-center">
            {/* Image Section */}
            <div className="w-[100px] h-[100px] relative rounded-full overflow-hidden">
              <Image
                src={client1}
                alt="Client Image"
                layout="fill"
                objectFit="cover"
              />
            </div>

            {/* Text Info Section */}
            <div>
              <h3 className="text-3xl font-bold text-gray-800">John D.</h3>
              <p className="text-[#FF7000]  mt-3">★★★★★ (48 reviews)</p>
              <p className="mt-3 text-gray-500">
                Specializes in: Plumbing, Home Repairs, Electrical
              </p>
              <div className="flex items-center gap-3 mt-3">
                <button className="bg-[#E0E7FF] py-2 px-5 mt-3 text-blue-500 rounded-2xl font-semibold flex items-center gap-2">
                  <FiMessageCircle className="text-blue-500 text-lg" />
                  Message
                </button>

                <button className="bg-[#FEF3C7] py-2 px-5 mt-3 text-yellow-500 rounded-2xl font-semibold flex items-center gap-2">
                  <FiPhoneCall className="text-yellow-500 text-lg" />
                  Call
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-10">
        <div className="flex items-center max-w-5xl w-full gap-8 shadow-2xl p-5">
          {/* location */}
          <div className="w-1/2"></div>
          {/* info */}
          <div className="w-1/2">
            <div className="grid grid-cols-1 gap-6 mt-10">
              {cards.map((card, index) => (
                <div
                  key={index}
                  className="flex items-center gap-5 bg-white shadow-md p-5 rounded-xl border-l-4 border-[#8560F1] hover:bg-[#E0E7FF] hover:border"
                >
                  {/* Icon Section */}
                  <div className="shadow-lg text-white text-3xl rounded-full p-4 flex items-center justify-center w-16 h-16 hover:bg-[#E0E7FF] ">
                    {card.icon}
                  </div>

                  {/* Text Info Section */}
                  <div>
                    <h3 className="text-sm  text-gray-600">
                      {card.title}
                    </h3>
                    <p className="text-lg text-gray-800 font-semibold">{card.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div>
        <TrackTask />
      </div>
    </div>
  );
};

export default page;
