import React from "react";
import Image from "next/image";
import { FiClock, FiUserPlus, FiInfo } from "react-icons/fi";
import client1 from "../../../../public/Images/clientImage2.jpg";
import client2 from "../../../../public/Images/clientImage1.jpg";
import client3 from "../../../../public/Images/clientImage3.jpg";
const pendingBids = [
  {
    id: 1,
    title: "Assemble IKEA Furniture",
    userImage: client1,
    postedBy: "Sarah T.",
    postedDate: "June 11, 2025",
    status: "Awaiting Approval",
  },
  {
    id: 2,
    title: "Clean 2 Bedroom Apartment",
    userImage: client2,
    postedBy: "John D.",
    postedDate: "June 12, 2025",
    status: "Bid Submitted",
  },
  {
    id: 3,
    title: "Mount TV on Wall",
    userImage: client3,
    postedBy: "Emily C.",
    postedDate: "June 13, 2025",
    status: "Under Review",
  },
];

const PendingBids = () => {
  return (
    <section className="max-w-6xl mx-auto bg-gradient-to-r from-purple-300 via-indigo-300 to-blue-300 bg-opacity-50 backdrop-blur-md rounded-xl p-8 shadow-lg text-gray-900">
      <h2 className="text-3xl font-bold mb-10 text-center text-purple-800">
        Pending Bids
      </h2>

      <div className="space-y-8">
        {pendingBids.map((bid) => (
          <div
            key={bid.id}
            className="bg-white/80 rounded-xl shadow-lg border-t-4 border-purple-600 p-6 flex flex-col md:flex-row gap-6 hover:shadow-2xl transition"
          >
            {/* User Image */}
            <div className="relative w-24 h-24 rounded-full overflow-hidden flex-shrink-0 border-4 border-purple-500 shadow-md">
              <Image
                src={bid.userImage}
                alt={bid.postedBy}
                layout="fill"
                objectFit="cover"
              />
            </div>

            {/* Bid Info */}
            <div className="flex flex-col justify-between flex-grow">
              <div>
                <h3 className="text-2xl font-bold text-purple-900">
                  {bid.title}
                </h3>
                <p className="text-gray-700 mt-1 font-medium">
                  Posted by: {bid.postedBy}
                </p>
                <p className="text-gray-600">Date: {bid.postedDate}</p>
                <p className="mt-2 flex items-center gap-2 text-sm text-purple-700 font-semibold">
                  <FiClock /> {bid.status}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 justify-center">
              <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition">
                <FiInfo /> View Bid
              </button>
              <button className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-lg text-sm transition">
                <FiUserPlus /> Withdraw Bid
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PendingBids;
