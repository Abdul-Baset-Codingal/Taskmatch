import React from "react";
import Image from "next/image";
import { FiCheckCircle, FiStar, FiMessageSquare } from "react-icons/fi";
import { useGetTasksByStatusQuery } from "@/features/api/taskApi"; // Adjust import path

const CompletedTasks = () => {
  // Fetch tasks with status 'completed'
  const { data: tasks, error, isLoading } = useGetTasksByStatusQuery("completed");

  if (isLoading) return <p className="text-center p-8">Loading completed tasks...</p>;
  if (error) return <p className="text-center p-8 text-red-600">Failed to load completed tasks</p>;

  return (
    <section className="max-w-6xl mx-auto bg-gradient-to-r from-purple-300 via-indigo-300 to-blue-300 bg-opacity-50 backdrop-blur-md rounded-xl p-8 shadow-lg text-gray-900">
      <h2 className="text-3xl font-bold mb-10 text-center text-purple-800">Completed Tasks</h2>

      <div className="space-y-8">
        {(!tasks || tasks.length === 0) && (
          <p className="text-center text-gray-700">No completed tasks found.</p>
        )}

        {tasks?.map((task: any) => (
          <div
            key={task._id}
            className="bg-white/80 rounded-xl shadow-lg border-t-4 border-purple-600 p-6 flex flex-col md:flex-row gap-6 hover:shadow-2xl transition"
          >
            {/* Tasker Image */}
            <div className="relative w-24 h-24 rounded-full overflow-hidden flex-shrink-0 border-4 border-purple-500 shadow-md">
              {task.taskerImageUrl ? (
                <Image
                  src={task.taskerImageUrl}
                  alt={task.taskerName || "Tasker"}
                  layout="fill"
                  objectFit="cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-300 text-gray-600">
                  No Image
                </div>
              )}
            </div>

            {/* Task Info */}
            <div className="flex flex-col justify-between flex-grow">
              <div>
                <h3 className="text-2xl font-bold text-purple-900">{task.title}</h3>
                <p className="text-gray-700 mt-1 font-semibold">
                  Completed on: {new Date(task.completedAt || task.updatedAt || task.createdAt).toLocaleDateString()}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`text-xl ${i < (task.rating || 0) ? "text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="text-gray-600 ml-2">({task.rating || 0} stars)</span>
                </div>
                <p className="text-gray-600 mt-3 italic">"{task.feedback || "No feedback provided"}"</p>
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
