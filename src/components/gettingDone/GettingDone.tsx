"use client";

import React from "react";
import { BiTimeFive } from "react-icons/bi";
import { FaStar, FaUser } from "react-icons/fa";
import Image from "next/image";
import Marquee from "react-marquee-slider";
import SectionHeader from "@/resusable/SectionHeader";

// Default avatar if no image is provided
import { useGetCompletedAndInProgressTasksQuery } from "@/features/api/taskApi";
import defaultAvatar from "../../../public/Images/clientImage1.jpg";
import { useGetUserByIdQuery } from "@/features/auth/authApi";

// Interface for task data
interface Task {
  _id: string;
  serviceTitle: string;
  taskTitle: string;
  taskDescription: string;
  location: string;
  status: string;
  price?: number;
  updatedAt: string;
  acceptedBy?: string;
  client: {
    fullName: string;
  };
}

// TaskCard component to handle individual task rendering with tasker data
const TaskCard = ({ task, index }: { task: Task; index: number }) => {
  // Fetch tasker data only if acceptedBy exists
  const { data: taskerData } = useGetUserByIdQuery(task.acceptedBy, {
    skip: !task.acceptedBy, // Skip query if no acceptedBy ID
  });

  console.log(taskerData)

  // Function to format time difference
  const formatTimeAgo = (dateString: string | number | Date) => {
    const now = new Date();
    const taskDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - taskDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  // Function to format status display text
  const formatStatus = (status: string) => {
    if (status === "in progress") return "In Progress";
    if (status === "completed") return "Completed";
    return status;
  };



  return (
    <div
      key={task._id || index}
      className="inline-block p-4 sm:p-6 md:p-8 mx-3 rounded-xl shadow-xl hover:scale-105 transition-transform duration-500 bg-white h-full w-[320px] sm:w-[350px] md:w-[380px] lg:w-[400px] marquee-card"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm sm:text-base md:text-lg font-bold mb-2 truncate">
          {task.serviceTitle}
        </h3>
        <p
          className={`px-3 sm:px-4 py-1.5 text-white font-bold rounded-3xl text-xs ${task.status === "in progress" ? "bg-[#FF8906]" : "bg-[#2CB67D]"
            }`}
        >
          {formatStatus(task.status)}
        </p>
      </div>

      <div className="mt-4 sm:mt-6 flex items-center justify-between">
       
        <p className="text-[#72757E] text-xs flex items-center gap-1">
          <BiTimeFive className="text-base" />
          {task.status === "in progress"
            ? `Started ${formatTimeAgo(task.updatedAt)}`
            : formatTimeAgo(task.updatedAt)}
        </p>
      </div>

      {/* Clamp description to avoid breaking layout */}
      <p className="mt-4 sm:mt-6 mb-3 font-medium text-xs sm:text-sm md:text-base line-clamp-2">
        {task.taskTitle}: {task.taskDescription}
      </p>

      <div className="flex items-center gap-3 mt-4 sm:mt-6">
        <div className="w-10 sm:w-12 h-10 sm:h-12 relative border-4 border-white shadow-2xl shadow-purple-600 rounded-full overflow-hidden flex items-center justify-center bg-gray-100 text-gray-500">
          {taskerData?.profilePicture ? (
            <Image
              src={taskerData.profilePicture}
              alt="Tasker"
              fill
              className="object-cover"
              onError={(e) => {
                e.currentTarget.src = defaultAvatar.src;
              }}
            />
          ) : (
            <FaUser className="w-6 h-6 text-gray-400" />
          )}
        </div>

        <div>
          <p className="text-sm sm:text-base font-semibold">
            {taskerData?.fullName}
          </p>
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, starIndex) => (
              <FaStar
                key={starIndex}
                className="text-yellow-400 text-[8px] sm:text-[10px] mr-[2px]"
              />
            ))}
          </div>
        </div>
      </div>

      {task.price && (
        <div className="mt-3 text-right">
          <span className="text-lg font-bold text-green-600">${task.price}</span>
        </div>
      )}
    </div>

  );
};

const GettingDone = () => {
  const { data, isLoading, error } = useGetCompletedAndInProgressTasksQuery({});

  if (isLoading) {
    return (
      <div className="pt-4">
        <div className="mx-auto px-4">
          <SectionHeader
            title="See What Others Are Getting Done"
            description="Live tasks happening in your area right now"
          />
          <div className="mt-4 flex justify-center">
            <p className="text-gray-500">Loading tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-4">
        <div className="mx-auto px-4">
          <SectionHeader
            title="See What Others Are Getting Done"
            description="Live tasks happening in your area right now"
          />
          <div className="mt-4 flex justify-center">
            <p className="text-red-500">Error loading tasks</p>
          </div>
        </div>
      </div>
    );
  }

  const tasks: Task[] = data?.tasks || [];

  if (tasks.length === 0) {
    return (
      <div className="pt-4">
        <div className="mx-auto px-4">
          <SectionHeader
            title="See What Others Are Getting Done"
            description="Live tasks happening in your area right now"
          />
          <div className="mt-4 flex justify-center">
            <p className="text-gray-500">No tasks available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-4">
      <div className="mx-auto px-4">
        <SectionHeader
          title="See What Others Are Getting Done"
          description="Live tasks happening in your area right now"
        />

        <div className="mt-4">
          <Marquee
            velocity={20}
            direction="ltr"
            scatterRandomly={false}
            resetAfterTries={0}
            onInit={() => { }}
            onFinish={() => { }}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task._id || index} task={task} index={index} />
            ))}
          </Marquee>
        </div>
      </div>

      {/* Custom CSS for Marquee Scaling */}
      <style jsx>{`
        .marquee-card {
          transition: transform 0.3s ease;
        }
        .marquee-card:hover {
          transform: scale(1.05);
        }
        @media (max-width: 640px) {
          .marquee-card {
            width: 260px;
          }
        }
      `}</style>
    </div>
  );
};

export default GettingDone;