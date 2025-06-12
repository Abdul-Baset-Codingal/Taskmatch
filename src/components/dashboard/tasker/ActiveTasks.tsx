/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Image from "next/image";
import client1 from "../../../../public/Images/clientImage2.jpg";
import client2 from "../../../../public/Images/clientImage1.jpg";


import {
  FiMessageCircle,
  FiPhoneCall,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";

type TaskStatus = "In Progress" | "Scheduled" | "Completed";

interface ActiveTask {
  id: number;
  title: string;
  assignedTo: string;
  reviews: number;
  categories: string;
  status: TaskStatus;
  eta: string;
  contact: string;
  location: string;
  image: any;
}

const activeTasks: ActiveTask[] = [
  {
    id: 1,
    title: "Fix leaking faucet",
    assignedTo: "John D.",
    reviews: 48,
    categories: "Plumbing, Home Repairs",
    status: "In Progress",
    eta: "15 minutes (ETA 3:45 PM)",
    contact: "+1 (555) 123-4567",
    location: "Heading north on King St",
    image: client1,
  },
  {
    id: 2,
    title: "Electrical wiring check",
    assignedTo: "Anna K.",
    reviews: 30,
    categories: "Electrical",
    status: "Scheduled",
    eta: "Tomorrow 9:00 AM",
    contact: "+1 (555) 987-6543",
    location: "Downtown Apartment 301",
    image: client2,
  },
];

const statusColors: Record<TaskStatus, string> = {
  "In Progress": "bg-yellow-400 text-yellow-900",
  Scheduled: "bg-blue-400 text-blue-900",
  Completed: "bg-green-400 text-green-900",
};

const ActiveTasks = () => {
  return (
    <section className="max-w-6xl mx-auto bg-gradient-to-r from-purple-300 via-indigo-300 to-blue-300 bg-opacity-50 rounded-xl p-8 shadow-lg text-gray-900">
      <h2 className="text-3xl font-bold mb-10 text-center text-purple-800">
        Active Tasks
      </h2>

      <div className="space-y-8">
        {activeTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white/80 rounded-xl shadow-lg border-t-4 border-purple-600 p-6 flex flex-col md:flex-row gap-6 hover:shadow-2xl transition"
          >
            {/* Image */}
            <div className="relative w-28 h-28 rounded-full overflow-hidden flex-shrink-0 border-4 border-purple-500 shadow-md">
              <Image
                src={task.image}
                alt={task.assignedTo}
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
                <p className="text-purple-700 font-semibold mt-1">
                  {task.assignedTo}
                </p>
                <p className="text-yellow-500 font-semibold mt-1">
                  ★★★★★ ({task.reviews} reviews)
                </p>
                <p className="mt-1 text-gray-700 italic">{task.categories}</p>
              </div>

              <div className="flex flex-wrap gap-4 mt-4 text-gray-700 font-semibold">
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-xl text-yellow-600" />
                  <span>Status:</span>
                  <span
                    className={`ml-1 inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      statusColors[task.status] || "bg-gray-400 text-gray-900"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <FiClock className="text-xl text-purple-600" />
                  <span>ETA:</span>
                  <span>{task.eta}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 justify-center">
              <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition">
                <FiMessageCircle /> Message Tasker
              </button>
              <button className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg text-sm transition">
                <FiPhoneCall /> Call Tasker
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ActiveTasks;
