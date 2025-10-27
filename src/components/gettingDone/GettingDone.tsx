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
      className="inline-block color3 backdrop-blur-md p-5 sm:p-6 md:p-7 mx-3 rounded-2xl shadow-lg hover:shadow-[#2CB67D]/40 hover:-translate-y-2 hover:scale-[1.03] transition-all duration-500 border border-white/30 w-[320px] sm:w-[350px] md:w-[380px] lg:w-[400px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#063A41] truncate">
          {task.serviceTitle}
        </h3>
        <p
          className={`px-3 sm:px-4 py-1 text-xs sm:text-sm font-semibold text-white rounded-full shadow-md ${task.status === "in progress"
              ? "bg-[#FF8906]"
              : "bg-[#2CB67D]"
            }`}
        >
          {formatStatus(task.status)}
        </p>
      </div>

      {/* Description */}
      <p className="mt-4 text-sm sm:text-base text-gray-700 leading-relaxed line-clamp-2">
        <span className="font-semibold text-[#109C3D]">{task.taskTitle}</span>: {task.taskDescription}
      </p>

      {/* Time Info */}
      <div className="mt-4 flex items-center gap-2 text-gray-500 text-xs sm:text-sm">
        <BiTimeFive className="text-[#109C3D] text-base" />
        {task.status === "in progress"
          ? `Started ${formatTimeAgo(task.updatedAt)}`
          : formatTimeAgo(task.updatedAt)}
      </div>

      {/* Divider Line */}
      <div className="my-5 h-[1px] bg-gray-200"></div>

      {/* Tasker Info */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 relative rounded-full overflow-hidden border-2 border-[#109C3D]/40 shadow-md flex items-center justify-center bg-gray-100">
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

        <div className="flex flex-col">
          <p className="text-sm sm:text-base font-semibold text-[#063A41]">
            {taskerData?.fullName}
          </p>
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, starIndex) => (
              <FaStar
                key={starIndex}
                className="text-yellow-400 text-[10px] sm:text-[12px] mr-[2px]"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Price */}
      {task.price && (
        <div className="mt-5 text-right">
          <span className="text-xl font-bold text-[#109C3D]">
            ${task.price}
          </span>
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