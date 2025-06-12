/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Image from "next/image";
import { FiInfo, FiClock } from "react-icons/fi";
import image1 from "../../../../public/Images/automotiveService.jpg"
import image2 from "../../../../public/Images/beautyWellness.jpg";
import image3 from "../../../../public/Images/catSitting.jpg";


type Urgency = "High" | "Medium" | "Low";

type Task = {
  id: number;
  title: string;
  description: string;
  categories: string[];
  urgency: Urgency;
  postedTime: string;
  image: any;
};

const availableTasks: Task[] = [
  {
    id: 1,
    title: "Install ceiling fan",
    description: "Need an expert to install a ceiling fan in living room",
    categories: ["Electrical", "Home Repairs"],
    urgency: "Medium",
    postedTime: "2 hours ago",
    image: image1,
  },
  {
    id: 2,
    title: "Garden landscaping",
    description:
      "Looking for someone to redesign my garden and plant new flowers",
    categories: ["Gardening", "Landscaping"],
    urgency: "Low",
    postedTime: "1 day ago",
    image: image2,
  },
  {
    id: 3,
    title: "AC Maintenance",
    description: "Air conditioner not cooling properly, requires inspection",
    categories: ["Appliance Repair"],
    urgency: "High",
    postedTime: "30 minutes ago",
    image: image3,
  },
];

const urgencyColors: Record<Urgency, string> = {
  High: "bg-red-400 text-red-900",
  Medium: "bg-yellow-400 text-yellow-900",
  Low: "bg-green-400 text-green-900",
};

const AvailableTasks = () => {
  return (
    <section className="max-w-6xl mx-auto bg-gradient-to-r from-purple-300 via-indigo-300 to-blue-300 bg-opacity-50 backdrop-blur-md rounded-xl p-8 shadow-lg text-gray-900">
      <h2 className="text-3xl font-bold mb-10 text-center text-purple-800">
        Available Tasks
      </h2>

      <div className="space-y-8">
        {availableTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white/80 rounded-xl shadow-lg border-t-4 border-purple-600 p-6 flex flex-col md:flex-row gap-6 hover:shadow-2xl transition"
          >
            {/* Image */}
            <div className="relative w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 border-4 border-purple-500 shadow-md">
              <Image
                src={task.image}
                alt={task.title}
                layout="fill"
                objectFit="cover"
              />
            </div>

            {/* Info */}
            <div className="flex flex-col justify-between flex-grow">
              <div>
                <h3 className="text-2xl font-bold text-purple-900">
                  {task.title}
                </h3>
                <p className="text-gray-700 mt-2">{task.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {task.categories.map((cat) => (
                    <span
                      key={cat}
                      className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-6 mt-6 text-gray-700 font-semibold items-center">
                <div className="flex items-center gap-2">
                  <FiClock className="text-xl text-purple-600" />
                  <span>Posted: {task.postedTime}</span>
                </div>

                <div
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    urgencyColors[task.urgency] || "bg-gray-400 text-gray-900"
                  }`}
                >
                  Urgency: {task.urgency}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 justify-center">
              <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition">
                <FiInfo /> View Details
              </button>
              <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition">
                Apply
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AvailableTasks;
