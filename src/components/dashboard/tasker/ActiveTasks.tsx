/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  FiMessageCircle,
  FiPhoneCall,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiMapPin,
  FiCalendar,
  FiInfo,
  FiImage,
  FiX,
} from "react-icons/fi";
import { useDeclineByTaskerMutation, useGetTasksByStatusQuery, useGetTasksByTaskerIdAndStatusQuery, useRequestCompletionMutation } from "@/features/api/taskApi";
import defaultAvatar from "../../../../public/Images/clientImage1.jpg"; // fallback

type TaskStatus = "in progress" | "scheduled" | "completed" | "requested" | "not completed";

const statusColors: Record<TaskStatus, string> = {
  "in progress": "bg-amber-200 text-amber-800",
  scheduled: "bg-blue-200 text-blue-800",
  completed: "bg-green-200 text-green-800",
  requested: "bg-purple-200 text-purple-800",
  "not completed": "bg-red-200 text-red-800",
};

const ActiveTasks = () => {

  const [user, setUser] = useState<{ _id: string; role: string } | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status and get user ID
  const checkLoginStatus = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/verify-token`, {
        method: "GET",
        credentials: "include",
      });
      const text = await response.text();
      console.log("Verify token response:", text);
      if (response.ok) {
        const data = JSON.parse(text);
        console.log("Parsed user data:", data);
        setIsLoggedIn(true);
        setUser({ _id: data.user._id, role: data.user.role });
      } else {
        console.error("Verify token failed:", response.status, text);
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
    { skip: !user?._id } // Skip query until user._id is available
  );

  console.log(tasks);

  if (isLoading)
    return (
      <div className="text-center py-12 text-gray-600 text-lg font-medium">
        Loading active tasks...
      </div>
    );
  if (isError)
    return (
      <div className="text-center py-12 text-red-600 text-lg font-medium">
        Failed to load tasks.
      </div>
    );

  return (
    <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Active Tasks
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task: any) => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>
    </section>
  );
};

const TaskCard = ({ task }: { task: any }) => {
  const [showImages, setShowImages] = useState(false);
  const [requestCompletion, { isLoading: isRequesting, error: requestError }] = useRequestCompletionMutation();
  const [declineByTasker, { isLoading: isDeclining, error: declineError }] = useDeclineByTaskerMutation();

  const handleRequestCompletion = async () => {
    try {
      await requestCompletion(task._id).unwrap();
      // Success feedback (optional, since the query refetches automatically)
      alert("Completion requested successfully!");
    } catch (err) {
      // Error feedback
      alert(`Failed to request completion: ${(err as any)?.data?.error || "Unknown error"}`);
    }
  };

  const handleDecline = async () => {
    try {
      await declineByTasker(task._id).unwrap();
      // Success feedback (optional, since the query refetches automatically)
      alert("Task declined successfully!");
    } catch (err) {
      // Error feedback
      alert(`Failed to decline task: ${(err as any)?.data?.error || "Unknown error"}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
      {/* Card Header */}
      <div className="p-6 border-b border-gray-200 flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            {task.taskTitle || "Untitled Task"}
          </h3>
          <p className="text-sm font-medium text-gray-600 mt-1">
            {task.serviceTitle || "Category N/A"}
          </p>
        </div>
        <button
          onClick={handleDecline}
          disabled={isDeclining}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg text-white font-medium transition text-sm ${isDeclining
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-red-600 hover:bg-red-700"
            }`}
        >
          <FiX className="w-3 h-3" />
          {isDeclining ? "Declining..." : "Decline"}
        </button>
      </div>

      {/* Card Body */}
      <div className="p-6">
        <div className="space-y-4">
          {/* Status and Client Info */}
          <div className="flex justify-between items-center">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[task.status as TaskStatus] || "bg-gray-200 text-gray-800"
                }`}
            >
              <FiCheckCircle className="mr-1" />
              {task.status || "N/A"}
            </span>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Client:</span>{" "}
              {task.client?.firstName || "N/A"} {task.client?.lastName || "N/A"}

            </p>
          </div>

          {/* Tasker and Email */}
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Email:</span>{" "}
              {task.client?.email || "N/A"}
            </p>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-500 line-clamp-2">
            {task.taskDescription || "No description provided"}
          </p>

          {/* Bid Info */}
          {task.bids?.length > 0 && (
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Bid:</span> ${task.bids[0].offerPrice}{" "}
             
            </p>
          )}

          {/* Toggleable Image Gallery */}
          <div>
            <button
              onClick={() => setShowImages(!showImages)}
              className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
            >
              <FiImage />
              {showImages ? "Hide Images" : `Show Images (${task.photos?.length || 1})`}
            </button>
            {showImages && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {(task.photos?.length > 0 ? task.photos.slice(0, 3) : [defaultAvatar]).map(
                  (photo: string, index: number) => (
                    <div
                      key={index}
                      className={`relative ${task.photos?.length === 1
                        ? "col-span-3 h-32"
                        : task.photos?.length === 2
                          ? "col-span-1 h-32"
                          : "col-span-1 h-20"
                        } rounded-lg overflow-hidden`}
                    >
                      <Image
                        src={photo}
                        alt={`Task Image ${index + 1}`}
                        layout="fill"
                        objectFit="cover"
                        className="object-center"
                      />
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <FiDollarSign className="text-indigo-600" />
              <span>Price: ${task.price || "N/A"}</span>
            </div>
            <div className="flex items-center gap-1">
              <FiMapPin className="text-red-600" />
              <span>Location: {task.location || "N/A"}</span>
            </div>
            <div className="flex items-center gap-1">
              <FiClock className="text-blue-600" />
              <span>Time: {task.estimatedTime || "N/A"} hr(s)</span>
            </div>
            <div className="flex items-center gap-1">
              <FiCalendar className="text-green-600" />
              <span>
                Deadline:{" "}
                {task.updatedAt
                  ? new Date(task.updatedAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <FiInfo className="text-purple-600" />
              <span>Extra Charge: {task.extraCharge ? "Yes" : "No"}</span>
            </div>
          </div>

          {/* Request Completion Button */}
          {task.status === "in progress" && (
            <button
              onClick={handleRequestCompletion}
              disabled={isRequesting}
              className={`mt-4 w-full py-2 px-4 rounded-lg text-white font-medium transition ${isRequesting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
                }`}
            >
              {isRequesting ? "Requesting..." : "Request Completion"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveTasks;