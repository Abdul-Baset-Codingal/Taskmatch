"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import Image from "next/image";
import {
  FiCheckCircle,
  FiMapPin,
  FiClock,
  FiCalendar,
  FiInfo,
  FiImage,
} from "react-icons/fi";
import { useGetTasksByStatusQuery } from "@/features/api/taskApi";
import { FaUser } from "react-icons/fa";

const CompletedTasks = () => {
  const {
    data: tasks = [],
    isLoading,
    isError,
  } = useGetTasksByStatusQuery("completed");


  if (isLoading)
    return (
      <div className="text-center py-16 text-gray-400 text-lg font-medium animate-pulse">
        Loading completed tasks...
      </div>
    );
  if (isError)
    return (
      <div className="text-center py-16 text-red-400 text-lg font-medium">
        Failed to load completed tasks.
      </div>
    );

  return (
    <section className="max-w-7xl mx-auto py-16 px-6">
      <h2 className="text-4xl font-bold  text-center mb-14">
        ✅ Completed Tasks
      </h2>

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task: any) => (
          <CompletedTaskCard key={task._id} task={task} />
        ))}
      </div>
    </section>
  );
};

const CompletedTaskCard = ({ task }: { task: any }) => {
  const [showImages, setShowImages] = useState(false);

  return (
    <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 overflow-hidden group">
      {/* Completed Badge */}
      <div className="absolute top-0 left-0 bg-gradient-to-r from-green-400 to-green-600 px-4 py-1 rounded-br-xl text-xs font-semibold text-white shadow-md">
        <div className="flex items-center gap-1">
          <FiCheckCircle /> Completed
        </div>
      </div>

      {/* Price Badge */}
      <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 rounded-bl-xl text-lg font-bold text-white shadow-md">
        ${task.price || "N/A"}
      </div>

      <div className="p-6 flex flex-col gap-5">
        {/* Header */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-500 transition-colors duration-300 line-clamp-2">
            {task.taskTitle || "Untitled Task"}
          </h3>
          <p className="text-sm font-medium text-indigo-600 mt-1">
            {task.serviceTitle || "Category N/A"}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-3">
          {task.taskDescription || "No description provided"}
        </p>

        {/* Client Info */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200">
            <FaUser className="w-6 h-6 text-gray-600" />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">
              {task.client?.fullName || "N/A"}
            </p>
            <p className="text-xs text-gray-500">
              {task.client?.email || "N/A"}
            </p>
          </div>
        </div>


        {/* Gallery */}
        {task.photos?.length > 0 && (
          <div>
            <button
              onClick={() => setShowImages(!showImages)}
              className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <FiImage />
              {showImages
                ? "Hide Images"
                : `Show Images (${task.photos?.length})`}
            </button>
            {showImages && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {task.photos.slice(0, 3).map((photo: string, index: number) => (
                  <div
                    key={index}
                    className="relative h-24 rounded-lg overflow-hidden group"
                  >
                    <Image
                      src={photo}
                      alt={`Task Image ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <InfoItem icon={<FiMapPin />} label={task.location || "N/A"} full />
          <InfoItem
            icon={<FiClock />}
            label={`${task.estimatedTime || "N/A"} hr(s)`}
          />
          <InfoItem
            icon={<FiCalendar />}
            label={
              task.offerDeadline
                ? new Date(task.offerDeadline).toLocaleDateString()
                : "N/A"
            }
          />
          <InfoItem
            icon={<FiInfo />}
            label={`Extra Charge: ${task.extraCharge ? "Yes" : "No"}`}
            full
          />
          
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({
  icon,
  label,
  full = false,
}: {
  icon: React.ReactNode;
  label: string;
  full?: boolean;
}) => (
  <div
    className={`flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-gray-700 border border-gray-200 ${full ? "col-span-2" : ""
      }`}
  >
    <span className="text-indigo-500">{icon}</span>
    <span className="text-sm">{label}</span>
  </div>
);

export default CompletedTasks;
