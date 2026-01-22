"use client";
import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaMapMarkerAlt,
  FaClock,
  FaDollarSign,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { HiOutlineClipboardList } from "react-icons/hi";
import {
  useDeclineByTaskerMutation,
  useGetTasksByTaskerIdAndStatusQuery,
  useRequestCompletionMutation,
} from "@/features/api/taskApi";
import { toast } from "react-toastify";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function ActiveTasks() {
  const [user, setUser] = useState<{ _id: string; currentRole: string } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch(`/api/auth/verify-token`, {
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

  const {
    data: tasks = [],
    isLoading,
    isError,
    error,
  } = useGetTasksByTaskerIdAndStatusQuery(
    user?._id
      ? { taskerId: user._id, status: "in progress" }
      : { taskerId: "", status: "in progress" },
    { skip: !user?._id || !authChecked, refetchOnMountOrArgChange: true }
  );

  const isEmpty = tasks.length === 0;

  // Loading
  if (!authChecked || isLoading) {
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
  if (!user || user.currentRole !== "tasker") {
    return (
      <div className="min-h-screen bg-[#E5FFDB]/20 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-sm w-full border border-[#109C3D]/20">
          <div className="w-16 h-16 bg-[#E5FFDB] rounded-full flex items-center justify-center mx-auto mb-4">
            <HiOutlineClipboardList className="w-8 h-8 text-[#063A41]" />
          </div>
          <h2 className="text-xl font-semibold text-[#063A41] mb-2">Access Restricted</h2>
          <p className="text-gray-500">Please log in as a tasker to view active tasks.</p>
        </div>
      </div>
    );
  }

  // Error
  if (isError) {
    return (
      <div className="min-h-screen bg-[#E5FFDB]/20 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-sm w-full border">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTimes className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load tasks</h3>
          <p className="text-gray-500 text-sm mb-4">Something went wrong. Please try again.</p>
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
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-white">Active Tasks</h1>
          <p className="text-[#E5FFDB] text-sm mt-1">Tasks you're currently working on</p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4">
          <div className="py-4 flex items-center gap-4">
            <span className="text-sm font-medium text-[#063A41]">In Progress</span>
            <span className="bg-[#E5FFDB] text-[#109C3D] text-xs px-2 py-0.5 rounded-full font-medium">
              {tasks.length}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {isEmpty ? (
          <div className="bg-white rounded-lg border p-12 text-center">
            <div className="w-16 h-16 bg-[#E5FFDB] rounded-full flex items-center justify-center mx-auto mb-4">
              <HiOutlineClipboardList className="w-8 h-8 text-[#109C3D]" />
            </div>
            <h3 className="text-lg font-medium text-[#063A41] mb-1">No active tasks</h3>
            <p className="text-gray-500 text-sm">
              Tasks you're working on will appear here
            </p>
            <p className="text-gray-400 text-xs mt-3">
              Once a client accepts your bid, the task will show up here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task: any) => (
              <ActiveTaskCard key={task._id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const ActiveTaskCard = ({ task }: { task: any }) => {
  const [requestCompletion, { isLoading: isRequesting }] = useRequestCompletionMutation();
  const [declineByTasker, { isLoading: isDeclining }] = useDeclineByTaskerMutation();

  const handleRequestCompletion = async () => {
    try {
      await requestCompletion(task._id).unwrap();
      toast.success("Completion requested successfully!");
    } catch (err: any) {
      toast.error(err?.data?.error || "Failed to request completion");
    }
  };

  const handleDecline = async () => {
    if (confirm("Are you sure you want to decline this task?")) {
      try {
        await declineByTasker(task._id).unwrap();
        toast.success("Task declined successfully!");
      } catch (err: any) {
        toast.error(err?.data?.error || "Failed to decline task");
      }
    }
  };

  return (
    <div className="bg-white rounded-lg border hover:border-[#109C3D]/30 hover:shadow-md transition-all">
      {/* Task Header */}
      <div className="p-5 border-b">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium px-2 py-1 rounded bg-blue-100 text-blue-800">
                In Progress
              </span>
              <span className="text-xs text-gray-400">{formatDate(task.createdAt)}</span>
            </div>
            <h3 className="text-lg font-semibold text-[#063A41] mb-1">{task.taskTitle}</h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {task.taskDescription || "No description provided"}
            </p>
          </div>
          {(task.price || task.bids?.[0]?.offerPrice) && (
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-gray-500">Price</p>
              <p className="text-xl font-bold text-[#109C3D]">
                ${task.acceptedBidAmount}
              </p>
            </div>
          )}
        </div>

        {/* Task Details */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
         
          {task.location && (
            <div className="flex items-center gap-1.5">
              <FaMapMarkerAlt className="w-3.5 h-3.5 text-[#109C3D]" />
              <span>{task.location}</span>
            </div>
          )}
          {task.preferredDateTime && (
            <div className="flex items-center gap-1.5">
              <FaClock className="w-3.5 h-3.5 text-[#109C3D]" />
              <span>{formatDateTime(task.preferredDateTime)}</span>
            </div>
          )}
          {task.estimatedTime && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                {task.estimatedTime} hr(s)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Client Section */}
      <div className="bg-[#E5FFDB]/30 p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-[#063A41] flex items-center gap-2">
            <FaUser className="w-4 h-4 text-[#109C3D]" />
            Client Details
          </h4>
        </div>

        <div className="bg-white rounded-lg border border-[#109C3D]/20 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#109C3D] to-[#063A41] flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {task.client?.firstName?.charAt(0) || "C"}
              </span>
            </div>
            <div>
              <p className="font-semibold text-[#063A41]">
                {task.client?.firstName} {task.client?.lastName}
              </p>
              <p className="text-xs text-gray-500">{task.client?.email || "Client"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium px-2 py-1 rounded bg-[#109C3D] text-white">
              Assigned
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-5 py-4 border-t bg-white flex items-center justify-between gap-3">
        <button
          onClick={handleDecline}
          disabled={isDeclining}
          className="flex items-center gap-2 px-4 py-2 border-2 border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FaTimes className="w-3.5 h-3.5" />
          {isDeclining ? "Declining..." : "Decline Task"}
        </button>

        <button
          onClick={handleRequestCompletion}
          disabled={isRequesting}
          className="flex items-center gap-2 px-6 py-2 bg-[#109C3D] text-white text-sm font-medium rounded-lg hover:bg-[#0d8534] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isRequesting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Requesting...
            </>
          ) : (
            <>
              <FaCheck className="w-3.5 h-3.5" />
              Request Completion
            </>
          )}
        </button>
      </div>
    </div>
  );
};