"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FiMapPin, FiClock, FiCalendar, FiImage, FiChevronDown, FiChevronUp, FiCheck } from "react-icons/fi";
import { FaUser, FaDollarSign } from "react-icons/fa";
import { HiOutlineClipboardCheck } from "react-icons/hi";
import { useGetTasksByTaskerIdAndStatusQuery } from "@/features/api/taskApi";
import { format } from "date-fns";

const CompletedTasks = () => {
  const [user, setUser] = useState<{ _id: string; currentRole: string } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/auth/verify-token`, {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser({ _id: data.user._id, currentRole: data.user.currentRole });
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setAuthChecked(true);
      }
    };
    checkLogin();
  }, []);

  const { data: tasks = [], isLoading, isError, error } = useGetTasksByTaskerIdAndStatusQuery(
    user?._id ? { taskerId: user._id, status: "completed" } : { taskerId: "", status: "completed" },
    { skip: !user?._id || !authChecked }
  );

  console.log(tasks)

  const isEmpty = tasks.length === 0;

  // Loading State
  if (!authChecked || isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-[#E5FFDB] border-t-[#109C3D] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading completed tasks...</p>
        </div>
      </div>
    );
  }

  // Auth Error
  if (!user || user.currentRole !== "tasker") {
    return (
      <div className="min-h-screen bg-[#E5FFDB]/20 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-sm w-full border border-[#109C3D]/20">
          <div className="w-16 h-16 bg-[#E5FFDB] rounded-full flex items-center justify-center mx-auto mb-4">
            <HiOutlineClipboardCheck className="w-8 h-8 text-[#063A41]" />
          </div>
          <h2 className="text-xl font-semibold text-[#063A41] mb-2">Access Restricted</h2>
          <p className="text-gray-500">Please log in as a tasker to view completed tasks.</p>
        </div>
      </div>
    );
  }

  // Actual Error
  if (isError && !isEmpty) {
    return (
      <div className="min-h-screen bg-[#E5FFDB]/20 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-sm w-full border">
          <p className="text-red-500 mb-4">Failed to load completed tasks</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-[#063A41] text-white rounded-lg hover:bg-[#063A41]/90">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E5FFDB]/10">
      {/* Header - Same as TaskerQuotes */}
      <div className="bg-[#063A41]">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-white">Completed Tasks</h1>
          <p className="text-[#E5FFDB] text-sm mt-1">All your successfully finished jobs</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {isEmpty ? (
          <div className="bg-white rounded-lg border p-12 text-center">
            <div className="w-16 h-16 bg-[#E5FFDB] rounded-full flex items-center justify-center mx-auto mb-4">
              <HiOutlineClipboardCheck className="w-8 h-8 text-[#109C3D]" />
            </div>
            <h3 className="text-lg font-medium text-[#063A41] mb-1">No completed tasks yet</h3>
            <p className="text-gray-500 text-sm">Your completed jobs will appear here once finished</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task: any) => (
              <CompletedTaskCard key={task._id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CompletedTaskCard = ({ task }: { task: any }) => {
  const [showImages, setShowImages] = useState(false);

  return (
    <div className="bg-white rounded-lg border hover:border-[#109C3D]/30 hover:shadow-md transition-all">
      {/* Header */}
      <div className="p-5 border-b">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium px-2 py-1 rounded bg-[#063A41] text-white flex items-center gap-1">
                <FiCheck className="w-3 h-3" />
                Completed
              </span>
              <span className="text-xs text-gray-400">
                {task.completedAt ? format(new Date(task.completedAt), "MMM d, yyyy") : format(new Date(task.updatedAt), "MMM d, yyyy")}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-[#063A41] mb-1">{task.taskTitle || "Untitled Task"}</h3>
            <p className="text-gray-600 text-sm line-clamp-2">{task.taskDescription || "No description"}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-gray-500">Earned</p>
            <p className="text-2xl font-bold text-[#109C3D] flex items-center justify-end gap-1">
              <FaDollarSign className="w-5 h-5" />
              {task.acceptedBidAmount}
            </p>
          </div>
        </div>

        {/* Task Details */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <FaUser className="w-3.5 h-3.5 text-[#109C3D]" />
            <span>{task.client?.firstName} {task.client?.lastName}</span>
          </div>
          {task.location && (
            <div className="flex items-center gap-1.5">
              <FiMapPin className="w-3.5 h-3.5 text-[#109C3D]" />
              <span>{task.location}</span>
            </div>
          )}
          {task.estimatedTime && (
            <div className="flex items-center gap-1.5">
              <FiClock className="w-3.5 h-3.5 text-[#109C3D]" />
              <span>{task.estimatedTime} hr(s)</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <FiCalendar className="w-3.5 h-3.5 text-[#109C3D]" />
            <span>{format(new Date(task.preferredDateTime || task.createdAt), "MMM d, yyyy")}</span>
          </div>
        </div>
      </div>

      {/* Photos Section */}
      {task.photos?.length > 0 && (
        <div className="bg-[#E5FFDB]/30 p-5">
          <button
            onClick={() => setShowImages(!showImages)}
            className="flex items-center justify-between w-full text-sm font-medium text-[#063A41] hover:text-[#109C3D] transition-colors"
          >
            <span className="flex items-center gap-2">
              <FiImage className="w-4 h-4" />
              Task Photos ({task.photos.length})
            </span>
            {showImages ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
          </button>

          {showImages && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-4">
              {task.photos.map((photo: string, index: number) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={photo}
                    alt={`Completed task ${index + 1}`}
                    fill
                    className="object-cover transition-transform hover:scale-110"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="px-5 py-3 bg-[#E5FFDB] flex items-center justify-center gap-2">
        <FiCheck className="w-4 h-4 text-[#109C3D]" />
        <span className="text-sm font-semibold text-[#063A41]">Task Successfully Completed</span>
      </div>
    </div>
  );
};

export default CompletedTasks;