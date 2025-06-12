/* eslint-disable react/no-unescaped-entities */
import React from "react";
import Image from "next/image";
import { FiCheckCircle, FiStar, FiMessageSquare } from "react-icons/fi";
import client1 from "../../../../public/Images/clientImage2.jpg";
import client2 from "../../../../public/Images/clientImage1.jpg";
import client3 from "../../../../public/Images/clientImage3.jpg";

const completedTasks = [
  {
    id: 1,
    title: "Fix leaking kitchen faucet",
    taskerName: "Alice M.",
    taskerImage: client1,
    completionDate: "June 10, 2025",
    rating: 5,
    feedback:
      "Alice was professional and fixed the leak quickly. Highly recommended!",
  },
  {
    id: 2,
    title: "Paint living room walls",
    taskerName: "Bob K.",
    taskerImage: client2,
    completionDate: "June 8, 2025",
    rating: 4,
    feedback:
      "Good job painting with attention to detail. Slight delay but overall satisfied.",
  },
  {
    id: 3,
    title: "Repair garage door opener",
    taskerName: "Charlie R.",
    taskerImage: client3,
    completionDate: "June 5, 2025",
    rating: 5,
    feedback:
      "Fast and effective repair, door works perfectly now. Thanks Charlie!",
  },
];

const CompletedTasks = () => {
  return (
    <section className="max-w-6xl mx-auto bg-gradient-to-r from-purple-300 via-indigo-300 to-blue-300 bg-opacity-50 backdrop-blur-md rounded-xl p-8 shadow-lg text-gray-900">
      <h2 className="text-3xl font-bold mb-10 text-center text-purple-800">
        Completed Tasks
      </h2>

      <div className="space-y-8">
        {completedTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white/80 rounded-xl shadow-lg border-t-4 border-purple-600 p-6 flex flex-col md:flex-row gap-6 hover:shadow-2xl transition"
          >
            {/* Tasker Image */}
            <div className="relative w-24 h-24 rounded-full overflow-hidden flex-shrink-0 border-4 border-purple-500 shadow-md">
              <Image
                src={task.taskerImage}
                alt={task.taskerName}
                layout="fill"
                objectFit="cover"
              />
            </div>

            {/* Task Info */}
            <div className="flex flex-col justify-between flex-grow">
              <div>
                <h3 className="text-2xl font-bold text-purple-900">
                  {task.title}
                </h3>
                <p className="text-gray-700 mt-1 font-semibold">
                  Completed on: {task.completionDate}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`text-xl ${
                        i < task.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-gray-600 ml-2">
                    ({task.rating} stars)
                  </span>
                </div>
                <p className="text-gray-600 mt-3 italic">"{task.feedback}"</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 justify-center">
              <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition">
                <FiCheckCircle /> View Details
              </button>
              <button className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg text-sm transition">
                <FiMessageSquare /> Leave Feedback
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CompletedTasks;
