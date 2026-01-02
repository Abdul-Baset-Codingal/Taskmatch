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
  const { data: taskerData } = useGetUserByIdQuery(task.acceptedBy!, {
    skip: !task.acceptedBy,
  });

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const updated = new Date(date);
    const minutes = Math.floor((now.getTime() - updated.getTime()) / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const isInProgress = task.status === "in progress";

  return (
    <div
      key={task._id || index}
      className="group relative mx-6 w-[380px] h-[320px] rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-gray-200 hover:-translate-y-1 flex flex-col"
    >
      {/* Clean Header */}
      <div className="p-6 pb-4 flex-1 flex flex-col min-h-0">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-semibold text-[#063A41] line-clamp-1 leading-tight flex-1" title={task.serviceTitle}>
            {task.serviceTitle}
          </h3>

          <span
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 ${isInProgress
                ? "bg-orange-100 text-orange-700"
                : "bg-[#109C3D]/10 text-[#109C3D]"
              }`}
          >
            {isInProgress ? "In Progress" : "Completed"}
          </span>
        </div>

        {/* Task Title */}
        <h4 className="mt-4 text-lg font-medium text-[#109C3D] line-clamp-1 truncate" title={task.taskTitle}>
          {task.taskTitle}
        </h4>

        {/* Description */}
        <p className="mt-2 text-gray-600 text-sm leading-relaxed line-clamp-2 flex-1" title={task.taskDescription}>
          {task.taskDescription}
        </p>

        {/* Time */}
        <div className="mt-auto pt-4 flex items-center gap-2 text-gray-500 text-xs">
          <BiTimeFive className="text-[#109C3D] shrink-0" />
          <span className="truncate">
            {isInProgress ? "Started" : "Completed"} {formatTimeAgo(task.updatedAt)}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 shrink-0" />

      {/* Footer – Tasker + Price */}
      <div className="p-6 pt-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-200 shrink-0">
            {taskerData?.user?.profilePicture ? (
              <Image
                src={taskerData.user.profilePicture}
                alt={taskerData.user.firstName || "Tasker"}
                width={56}
                height={56}
                className="object-cover w-full h-full"
                onError={(e) => (e.currentTarget.src = defaultAvatar.src)}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <FaUser className="text-2xl text-gray-400" />
              </div>
            )}
          </div>

          {/* Name + Rating */}
          <div className="min-w-0 flex-1">
            <p className="font-medium text-[#063A41] truncate" title={`${taskerData?.user?.firstName} ${taskerData?.user?.lastName}`}>
              {taskerData?.user?.firstName} {taskerData?.user?.lastName}
            </p>
            <div className="flex items-center gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="w-3.5 h-3.5 text-yellow-500 fill-current shrink-0" />
              ))}
              <span className="text-xs text-gray-500 ml-1">5.0</span>
            </div>
          </div>
        </div>

        {/* Price – only if exists */}
        {task.price && (
          <div className="text-right shrink-0 ml-4">
            <span className="text-2xl font-bold text-[#063A41]">
              ${task.price}
            </span>
          </div>
        )}
      </div>

      {/* Subtle hover accent line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#109C3D] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
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