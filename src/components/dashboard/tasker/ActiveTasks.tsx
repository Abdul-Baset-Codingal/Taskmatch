/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiMapPin,
  FiCalendar,
  FiInfo,
  FiImage,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiLoader,
} from "react-icons/fi";
import { useDeclineByTaskerMutation, useGetTasksByTaskerIdAndStatusQuery, useRequestCompletionMutation } from "@/features/api/taskApi";
import { FaUser } from "react-icons/fa";
import { HiOutlineClipboardList } from "react-icons/hi";
import defaultAvatar from "../../../../public/Images/clientImage1.jpg";
import { toast } from "react-toastify";

type TaskStatus = "in progress" | "scheduled" | "completed" | "requested" | "not completed";

const ActiveTasks = () => {
  const [user, setUser] = useState<{ _id: string; role: string } | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLoginStatus = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/verify-token`, {
        method: "GET",
        credentials: "include",
      });
      const text = await response.text();
      if (response.ok) {
        const data = JSON.parse(text);
        setIsLoggedIn(true);
        setUser({ _id: data.user._id, role: data.user.role });
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking login status:", error);
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const {
    data: tasks = [],
    isLoading,
    isError
  } = useGetTasksByTaskerIdAndStatusQuery(
    user?._id ? { taskerId: user._id, status: "in progress" } : { taskerId: "", status: "in progress" },
    { skip: !user?._id }
  );

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-[#E5FFDB] border-t-[#109C3D] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading active tasks...</p>
        </div>
      </div>
    );
  }

  // Auth Error
  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen bg-[#E5FFDB]/20 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-sm w-full border border-[#109C3D]/20">
          <div className="w-16 h-16 bg-[#E5FFDB] rounded-full flex items-center justify-center mx-auto mb-4">
            <HiOutlineClipboardList className="w-8 h-8 text-[#063A41]" />
          </div>
          <h2 className="text-xl font-semibold text-[#063A41] mb-2">Access Restricted</h2>
          <p className="text-gray-500">Please log in to view active tasks.</p>
        </div>
      </div>
    );
  }

  // Error
  if (isError) {
    return (
      <div className="min-h-screen bg-[#E5FFDB]/20 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-sm w-full border">
          <p className="text-red-500 mb-4">Failed to load active tasks</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#063A41] text-white rounded-lg hover:bg-[#063A41]/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E5FFDB]/10">
      {/* Header */}
      <div className="bg-[#063A41]">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Active Tasks</h1>
              <p className="text-[#E5FFDB] text-sm mt-1">Tasks currently in progress</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
              <p className="text-2xl font-bold text-white">{tasks.length}</p>
              <p className="text-[#E5FFDB] text-xs">In Progress</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {tasks.length === 0 ? (
          <div className="bg-white rounded-lg border p-12 text-center">
            <div className="w-16 h-16 bg-[#E5FFDB] rounded-full flex items-center justify-center mx-auto mb-4">
              <HiOutlineClipboardList className="w-8 h-8 text-[#109C3D]" />
            </div>
            <h3 className="text-lg font-medium text-[#063A41] mb-1">No active tasks</h3>
            <p className="text-gray-500 text-sm">Tasks in progress will appear here</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task: any) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const TaskCard = ({ task }: { task: any }) => {
  const [showImages, setShowImages] = useState(false);
  const [requestCompletion, { isLoading: isRequesting }] = useRequestCompletionMutation();
  const [declineByTasker, { isLoading: isDeclining }] = useDeclineByTaskerMutation();

  const handleRequestCompletion = async () => {
    try {
      await requestCompletion(task._id).unwrap();
      toast.success("Completion requested successfully!");
    } catch (err) {
      toast.error(`Failed to request completion: ${(err as any)?.data?.error || "Unknown error"}`);
    }
  };

  const handleDecline = async () => {
    try {
      await declineByTasker(task._id).unwrap();
      toast.success("Task declined successfully!");
    } catch (err) {
      toast.error(`Failed to decline task: ${(err as any)?.data?.error || "Unknown error"}`);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "in progress": return "bg-amber-100 text-amber-800";
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-[#E5FFDB] text-[#109C3D]";
      case "requested": return "bg-purple-100 text-purple-800";
      case "not completed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-lg border hover:border-[#109C3D]/30 hover:shadow-md transition-all overflow-hidden">
      {/* Card Header */}
      <div className="p-5 border-b">
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded ${getStatusStyle(task.status)}`}>
            <FiClock className="w-3 h-3" />
            {task.status || "N/A"}
          </span>
          <button
            onClick={handleDecline}
            disabled={isDeclining}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition ${isDeclining
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-red-50 text-red-600 hover:bg-red-100"
              }`}
          >
            <FiX className="w-3 h-3" />
            {isDeclining ? "..." : "Decline"}
          </button>
        </div>

        <h3 className="text-lg font-semibold text-[#063A41] mb-1 line-clamp-2">
          {task.taskTitle || "Untitled Task"}
        </h3>

        {task.serviceTitle && (
          <p className="text-sm text-[#109C3D] font-medium">
            {task.serviceTitle}
          </p>
        )}

        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
          {task.taskDescription || "No description provided"}
        </p>
      </div>

      {/* Client Info */}
      <div className="px-5 py-4 bg-[#E5FFDB]/30 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-[#109C3D]/20">
            <FaUser className="w-4 h-4 text-[#109C3D]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#063A41]">
              {task.client?.firstName || "N/A"} {task.client?.lastName || ""}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {task.client?.email || "No email provided"}
            </p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-5">
        {/* Price & Bid */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Task Price</p>
            <p className="text-xl font-bold text-[#109C3D]">${task.price || "N/A"}</p>
          </div>
          {task.bids?.length > 0 && (
            <div className="text-right">
              <p className="text-xs text-gray-500">Your Bid</p>
              <p className="text-lg font-semibold text-[#063A41]">${task.bids[0].offerPrice}</p>
            </div>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <InfoItem
            icon={<FiMapPin className="w-3.5 h-3.5" />}
            label={task.location || "N/A"}
          />
          <InfoItem
            icon={<FiClock className="w-3.5 h-3.5" />}
            label={`${task.estimatedTime || "N/A"} hr(s)`}
          />
          <InfoItem
            icon={<FiCalendar className="w-3.5 h-3.5" />}
            label={task.updatedAt ? new Date(task.updatedAt).toLocaleDateString() : "N/A"}
          />
          <InfoItem
            icon={<FiInfo className="w-3.5 h-3.5" />}
            label={task.extraCharge ? "Extra Charge" : "No Extra"}
          />
        </div>

        {/* Photo Gallery */}
        {(task.photos?.length > 0 || true) && (
          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={() => setShowImages(!showImages)}
              className="flex items-center justify-between w-full text-sm font-medium text-[#063A41] hover:text-[#109C3D] transition-colors"
            >
              <span className="flex items-center gap-2">
                <FiImage className="w-4 h-4" />
                Task Photos ({task.photos?.length || 1})
              </span>
              {showImages ? (
                <FiChevronUp className="w-4 h-4" />
              ) : (
                <FiChevronDown className="w-4 h-4" />
              )}
            </button>

            {showImages && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {(task.photos?.length > 0 ? task.photos.slice(0, 3) : [defaultAvatar]).map(
                  (photo: string, index: number) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
                    >
                      <Image
                        src={photo}
                        alt={`Task Image ${index + 1}`}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Button */}
      {task.status === "in progress" && (
        <div className="px-5 pb-5">
          <button
            onClick={handleRequestCompletion}
            disabled={isRequesting}
            className={`w-full py-3 px-4 rounded-lg font-medium transition flex items-center justify-center gap-2 ${isRequesting
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-[#109C3D] text-white hover:bg-[#0d8534]"
              }`}
          >
            {isRequesting ? (
              <>
                <FiLoader className="w-4 h-4 animate-spin" />
                Requesting...
              </>
            ) : (
              <>
                <FiCheckCircle className="w-4 h-4" />
                Request Completion
              </>
            )}
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="px-5 py-3 bg-gray-50 border-t">
        <p className="text-xs text-gray-400 font-mono">
          ID: {task._id?.slice(-10).toUpperCase()}
        </p>
      </div>
    </div>
  );
};

const InfoItem = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <div className="flex items-center gap-2 text-sm text-gray-600">
    <span className="text-[#109C3D]">{icon}</span>
    <span className="truncate">{label}</span>
  </div>
);

export default ActiveTasks;