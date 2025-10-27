/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Key, useState } from "react";
import { FaMapMarkerAlt, FaClock, FaCalendarAlt, FaDollarSign, FaUser, FaInfoCircle } from "react-icons/fa";
import { useGetUrgentTasksQuery, useBidOnTaskMutation, useAcceptTaskMutation, useAddCommentMutation } from "@/features/api/taskApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import CommentItem from "./CommentItem";

export default function UrgentTaskCards() {
  const { data: urgentTasks = [], isLoading } = useGetUrgentTasksQuery({});
  const [bidOnTask, { isLoading: isBidding }] = useBidOnTaskMutation();
  const [acceptTask, { isLoading: isAccepting }] = useAcceptTaskMutation();
  const [bidModalOpen, setBidModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<any | null>(null);
  const [offerPrice, setOfferPrice] = useState("");
  const [message, setMessage] = useState("");
  const [bidMessage, setBidMessage] = useState("");
  const [commentMessage, setCommentMessage] = useState("");
  const [commentFormOpenId, setCommentFormOpenId] = useState<string | null>(null);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const [addComment, { isLoading: isCommenting },] = useAddCommentMutation();

  const toggleComments = (id: string) => {
    setExpandedTaskId((prev) => (prev === id ? null : id));
  };

  console.log(urgentTasks)

  const toggleCommentForm = (id: string) => {
    setCommentFormOpenId((prev) => (prev === id ? null : id));
    setCommentMessage("");
  };
  const getFileUrl = (filename: string | null | undefined): string | undefined => {
    if (!filename) return undefined;
    if (filename.startsWith("http://") || filename.startsWith("https://")) {
      return filename;
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://taskmatch-backend-hiza.onrender.com";
    return `${baseUrl}/Uploads/${filename}`;
  };

  const getVideoType = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'mp4':
      case 'webm':
      case 'ogg':
        return extension;
      default:
        return 'mp4';
    }
  };

  if (isLoading) return <p className="text-white text-center text-xl font-bold">Loading Urgent Tasks...</p>;

  const openBidModal = (taskId: string) => {
    setCurrentTask(urgentTasks.find((task: any) => task._id === taskId));
    setOfferPrice("");
    setMessage("");
    setBidModalOpen(true);
  };

  const closeBidModal = () => {
    setBidModalOpen(false);
    setCurrentTask(null);
    setOfferPrice("");
    setMessage("");
  };

  const submitBid = async () => {
    if (!offerPrice || !currentTask?._id) return toast.error("Please enter an offer price");
    try {
      await bidOnTask({ taskId: currentTask._id, offerPrice: Number(offerPrice), message }).unwrap();
      toast.success("Bid placed successfully!");
      closeBidModal();
    } catch (error) {
      toast.error("Failed to place bid.");
      console.error(error);
    }
  };

  const openConfirmModal = (task: any) => {
    setCurrentTask(task);
    setConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setConfirmModalOpen(false);
    setCurrentTask(null);
  };

  const openDetailsModal = (task: any) => {
    setCurrentTask(task);
    setDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setCurrentTask(null);
  };

  const confirmAcceptTask = async () => {
    if (!currentTask?._id) return;
    try {
      await acceptTask(currentTask._id).unwrap();
      toast.success("✅ Task accepted successfully!");
      closeConfirmModal();
    } catch (err) {
      console.error("Failed to accept task", err);
      const errorMessage =
        typeof err === "object" && err !== null && "data" in err && typeof (err as any).data?.error === "string"
          ? (err as any).data.error
          : "❌ Failed to accept task.";
      toast.error(errorMessage);
      closeConfirmModal();
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "in progress":
        return "text-blue-600 bg-blue-100";
      case "completed":
        return "text-green-600 bg-green-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getDotColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "in progress":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const calculateTimeToRespond = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();
    if (diff <= 0) return "Expired";
    const hours = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, "0");
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, "0");
    const seconds = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const calculateTimePosted = (createdAt: string) => {
    const now = new Date();
    const postedDate = new Date(createdAt);
    const diffMs = now.getTime() - postedDate.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`;
    if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;
    return `${years} year${years !== 1 ? "s" : ""} ago`;
  };


  const calculateCommentTime = (commentTime: string) => {
    const now = new Date();
    const commentDate = new Date(commentTime);
    const diff = now.getTime() - commentDate.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours < 1) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  };



  const handleAddComment = async (taskId: string) => {
    if (commentMessage.trim() === "") {
      alert("Comment cannot be empty");
      return;
    }
    try {
      await addComment({ taskId, message: commentMessage }).unwrap();
      alert("Comment added!");
      toggleCommentForm(taskId);
    } catch (err) {
      alert("Failed to add comment");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-100 flex flex-col items-center gap-6">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 drop-shadow-md">Urgent Tasks</h1>
        <p className="text-lg mt-2 font-semibold text-gray-600">
          {urgentTasks.length} critical task{urgentTasks.length !== 1 && "s"} needing immediate attention
        </p>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
        {urgentTasks.map((task: any) => (
          <div
            key={task._id}
            className="bg-[#FEE2E2] rounded-lg shadow-md border-l-4 border-red-500 flex flex-col transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
          >
            {/* Header */}
            <div className="p-3 flex justify-between items-center border-b border-red-200 relative">
              <div className="max-w-[70%]">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                  {task.serviceTitle}
                </p>
                <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                  {task.taskTitle}
                </h3>
              </div>
              <div className="text-green-600 px-3 py-1 rounded-full flex items-center text-2xl font-bold">
                ${task.price}
              </div>
            </div>

            {/* Content */}
            <div className="p-3 flex-1 flex flex-col gap-2 text-sm">
              {/* Client Info and Posted Time */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-700">
                  <FaUser className="text-red-500 text-sm" />
                  <span className="font-medium">{task.client?.firstName || 'N/A'} {task.client?.lastName || 'N/A'}</span>
                </div>
                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusStyle(task.status)}`}>
                  <span className={`w-2 h-2 rounded-full ${getDotColor(task.status)}`}></span>
                  <span>{task.status}</span>
                </div>
              </div>

              {/* Task Details */}
              <div className="flex justify-between lg:flex-row flex-col mb-2 gap-2 text-gray-700">
                <div className="flex items-start gap-1.5">
                  <FaMapMarkerAlt className="text-red-500 mt-0.5 text-sm" />
                  <span className="break-words">{task.location}</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <FaCalendarAlt className="text-red-500 mt-0.5 text-sm" />
                  <span className="text-xs text-gray-500">{calculateTimePosted(task.createdAt)}</span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white border-l-4 border-purple-500 p-2 rounded-md">
                <h4 className="font-semibold text-gray-800 text-sm mb-1">Description</h4>
                <p className="text-gray-600 text-sm line-clamp-3">{task.taskDescription}</p>
              </div>

              {/* Media */}
              {(task.photos?.length > 0 || task.video) && (
                <div className="mt-2">
                  {task?.photos?.length > 0 && (
                    <div className="mb-2">
                      <h4 className="font-semibold text-gray-800 text-sm">Photos</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {task.photos.map((photo: string | null | undefined, index: Key | null | undefined) => (
                          <div key={index} className="relative h-[70px] w-[90px] rounded-md overflow-hidden">
                            <Image
                              src={getFileUrl(photo) ?? "/default-placeholder.png"}
                              alt={`Task photo`}
                              fill
                              className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => window.open(getFileUrl(photo) ?? "/default-placeholder.png", "_blank")}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {task.video && (
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm">Video</h4>
                      <video
                        controls
                        className="w-full max-w-[200px] rounded-md shadow-sm"
                        preload="metadata"
                      >
                        <source
                          src={getFileUrl(task.video)}
                          type={`video/${getVideoType(task.video)}`}
                        />
                      </video>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="mt-2 flex flex-col sm:flex-row gap-2 w-full">
                {/* Accept Now */}
                <button
                  onClick={() => openConfirmModal(task)}
                  disabled={
                    task.status === "in progress" ||
                    task.status === "completed" ||
                    task.status === "requested" ||
                    isAccepting
                  }
                  className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors duration-200 flex items-center justify-center gap-1 
              ${task.status === "in progress" ||
                      task.status === "completed" ||
                      task.status === "requested"
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-[#6366F1] text-white hover:bg-purple-50 hover:text-[#6366F1]"
                    }`}
                >
                  <FaDollarSign className="text-sm" />
                  <span>{task.price}</span>
                  <span>
                    {isAccepting && currentTask?._id === task._id
                      ? "Accepting..."
                      : "Accept Now"}
                  </span>
                </button>

                {/* Bid Now */}
                <button
                  onClick={() => openBidModal(task._id)}
                  disabled={
                    task.status === "in progress" ||
                    task.status === "completed" ||
                    task.status === "requested" ||
                    isBidding
                  }
                  className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors duration-200 
              ${task.status === "in progress" ||
                      task.status === "completed" ||
                      task.status === "requested"
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#F3F4F6] text-gray-700 hover:bg-gray-300"
                    }`}
                >
                  {isBidding && currentTask?._id === task._id ? "Submitting..." : "Bid Now"}
                </button>

                {/* View Details */}
                <button
                  onClick={() => openDetailsModal(task)}
                  className="flex-1 py-2 text-sm font-semibold rounded-md transition-colors duration-200 bg-[#F3F4F6] text-gray-700 hover:bg-gray-300"
                >
                  View Details
                </button>

                {/* Comment Button */}
                <button
                  onClick={() => toggleCommentForm(task._id)}
                  className="flex-1 py-2 text-sm font-semibold rounded-md transition-colors duration-200 bg-[#F3F4F6] text-gray-700 hover:bg-gray-300 flex items-center justify-center gap-1"
                >
                  💬 Comment ({task.comments?.length || 0})
                </button>
              </div>

              {/* Comment Form */}
              {commentFormOpenId === task._id && (
                <div className="mt-6 bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-full bg-teal-100 text-teal-600">
                      💬
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800">Add a Comment</h4>
                  </div>
                  <textarea
                    placeholder="Write your thoughts here..."
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    rows={4}
                    value={commentMessage}
                    onChange={(e) => setCommentMessage(e.target.value)}
                  />
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={() => toggleCommentForm(task._id)}
                      disabled={isCommenting}
                      className="px-6 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-shadow shadow-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleAddComment(task._id)}
                      disabled={isCommenting}
                      className="px-6 py-2 text-sm font-medium text-white bg-[#6366F1] rounded-lg transition-shadow shadow-sm hover:shadow-md"
                    >
                      {isCommenting ? "Submitting..." : "Submit Comment"}
                    </button>
                  </div>
                </div>
              )}

              {/* Comments Toggle */}
              <div className="mt-6">
                <button
                  onClick={() => toggleComments(task._id)}
                  className="flex items-center gap-2 text-sm font-medium text-[#6366F1] transition"
                >
                  {expandedTaskId === task._id ? (
                    <>
                      <FiChevronUp /> Hide Comments ({task.comments?.length || 0})
                    </>
                  ) : (
                    <>
                      <FiChevronDown /> Show Comments ({task.comments?.length || 0})
                    </>
                  )}
                </button>

                {expandedTaskId === task._id && (
                  <div className="mt-4 space-y-3">
                    {task.comments?.length === 0 ? (
                      <p className="text-sm text-gray-500">No comments yet.</p>
                    ) : (
                      task.comments.map((comment: any, idx: number) => (
                        <CommentItem key={idx} comment={comment} />
                      ))
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bid Modal */}
      {bidModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Place Your Bid</h3>
              <button onClick={closeBidModal} className="text-gray-600 hover:text-gray-800 text-xl">&times;</button>
            </div>
            <label htmlFor="offerPrice" className="block mb-1 font-semibold text-gray-800 text-sm">
              Offer Price ($):
            </label>
            <input
              id="offerPrice"
              type="number"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              className="w-full mb-4 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter your offer price"
              min="0"
            />
            <label htmlFor="message" className="block mb-1 font-semibold text-gray-800 text-sm">
              Message (optional):
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full mb-4 border border-gray-300 rounded-md px-3 py-1.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
              rows={3}
              placeholder="Add a message for the client (optional)"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={closeBidModal}
                className="px-4 py-1.5 text-sm font-semibold bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={submitBid}
                disabled={isBidding}
                className="px-4 py-1.5 text-sm font-semibold bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-60"
              >
                {isBidding ? "Submitting..." : "Submit Bid"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Accept Modal */}
      {/* Confirm Accept Modal */}
      {confirmModalOpen && currentTask && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 transform transition-transform duration-300 scale-100 max-h-[90vh] overflow-y-scroll ">

            {/* Header */}
            <div className="flex justify-between items-center mb-5 border-b border-gray-200 pb-3">
              <h2 className="text-2xl font-bold text-gray-800">Confirm Task Acceptance</h2>
              <button
                onClick={closeConfirmModal}
                className="text-gray-400 hover:text-gray-700 text-3xl font-light transition-colors"
              >
                &times;
              </button>
            </div>

            {/* Task Title */}
            <h3 className="text-xl font-semibold text-gray-900 mb-5">{currentTask.taskTitle}</h3>

            {/* Task Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              {/* Client */}
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl shadow-sm">
                <svg className="w-6 h-6 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 8a7 7 0 0 1 14 0H3z" />
                </svg>
                <div>
                  <p className="text-gray-500 text-xs font-medium">Client</p>
                  <p className="text-gray-800 text-sm font-semibold">{currentTask.client?.fullName || 'N/A'}</p>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl shadow-sm">
                <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-11H9v2h2V7zm0 4H9v4h2v-4z" />
                </svg>
                <div>
                  <p className="text-gray-500 text-xs font-medium">Price</p>
                  <p className="text-gray-800 text-sm font-semibold">${currentTask.price}</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl shadow-sm">
                <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 0 0-6 6c0 4 6 10 6 10s6-6 6-10a6 6 0 0 0-6-6zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
                </svg>
                <div>
                  <p className="text-gray-500 text-xs font-medium">Location</p>
                  <p className="text-gray-800 text-sm font-semibold">{currentTask.location}</p>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl shadow-sm">
                <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6 2a1 1 0 0 0-1 1v1H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1V3a1 1 0 0 0-1-1h-2v2H8V2H6z" />
                </svg>
                <div>
                  <p className="text-gray-500 text-xs font-medium">Task Posted</p>
                  <p className="text-gray-800 text-sm font-semibold">{calculateTimePosted(currentTask.createdAt)}
                  </p>                </div>
              </div>

              {/* Time to respond */}
              {/* <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-xl shadow-sm sm:col-span-2">
                <svg className="w-6 h-6 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm1 9H9V6h2v5z" />
                </svg>
                <div>
                  <p className="text-gray-500 text-xs font-medium">Time to Respond</p>
                  <p className="text-gray-800 text-sm font-semibold">{calculateTimePosted(currentTask.createdAt)}
                  </p>
                </div>
              </div> */}
            </div>

            {/* Cost Breakdown */}
            <div className="mb-6 rounded-2xl bg-white shadow-md border border-gray-200">
              <div className="p-5">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  💰 Cost Breakdown
                </h4>

                <div className="space-y-3 text-sm">
                  {/* Base Price */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Base Price</span>
                    <span className="font-medium text-gray-800">${currentTask.price.toFixed(2)}</span>
                  </div>

                  {/* Service Fee */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Service Fee (10%)</span>
                    <span className="font-medium text-red-500">
                      - ${(currentTask.price * 0.1).toFixed(2)}
                    </span>
                  </div>

                  {/* Tax */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tax (5%)</span>
                    <span className="font-medium text-red-500">
                      - ${(currentTask.price * 0.05).toFixed(2)}
                    </span>
                  </div>

                  {/* Total */}
                  <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                    <span className="text-gray-900 font-semibold">Total You’ll Earn</span>
                    <span className="text-green-600 font-bold text-base">
                      ${(currentTask.price - currentTask.price * 0.1 - currentTask.price * 0.05).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>



            {/* Info Note */}
            <p className="text-gray-600 text-sm mb-6">
              By accepting this task, you commit to completing it at the specified price. The task will be assigned to you immediately, and the client will be notified.
            </p>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={closeConfirmModal}
                className="px-5 py-2 text-sm font-semibold bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAcceptTask}
                disabled={isAccepting}
                className="px-5 py-2 text-sm font-semibold bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-60 transition-colors"
              >
                {isAccepting ? "Accepting..." : "Accept Task"}
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Details Modal */}
      {detailsModalOpen && currentTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[80vh] overflow-y-auto">

            {/* Header */}
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-gray-800">Task Information</h2>
              <button
                onClick={closeDetailsModal}
                className="text-gray-500 hover:text-gray-800 text-2xl transition-colors"
              >
                &times;
              </button>
            </div>

            {/* Task Title */}
            <h3 className="text-xl font-semibold text-gray-800 mb-5">{currentTask.taskTitle}</h3>
            {/* Task Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Client */}
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl shadow-sm border border-gray-200">
                <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 8a7 7 0 0 1 14 0H3z" />
                </svg>
                <div>
                  <p className="text-gray-500 text-xs font-medium">Client</p>
                  <p className="text-gray-800 text-sm font-semibold">{currentTask.client?.fullName || 'N/A'}</p>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl shadow-sm border border-gray-200">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-11H9v2h2V7zm0 4H9v4h2v-4z" />
                </svg>
                <div>
                  <p className="text-gray-500 text-xs font-medium">Price</p>
                  <p className="text-gray-800 text-sm font-semibold">${currentTask.price}</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl shadow-sm border border-gray-200">
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 0 0-6 6c0 4 6 10 6 10s6-6 6-10a6 6 0 0 0-6-6zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
                </svg>
                <div>
                  <p className="text-gray-500 text-xs font-medium">Location</p>
                  <p className="text-gray-800 text-sm font-semibold">{currentTask.location}</p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a8 8 0 0 0-8 8h2a6 6 0 0 1 12 0h2a8 8 0 0 0-8-8z" />
                  </svg>
                  <div>
                    <p className="text-gray-500 text-xs font-medium">Status</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(currentTask.status)}`}>
                  <span className={`w-2 h-2 rounded-full ${getDotColor(currentTask.status)}`}></span>
                  {currentTask.status}
                </span>
              </div>
            </div>


            {/* Conversations Header */}
            <h4 className="text-gray-700 font-semibold text-sm mb-3">Conversations with Taskers</h4>
            <p className="text-gray-600 text-sm mb-2">
              All Conversations ({currentTask.comments?.length || 0})
            </p>

            {/* Users List */}
            <div className="flex flex-wrap gap-2 mb-4">
              {currentTask.comments?.map((comment: any, index: Key) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full hover:bg-purple-200 transition-colors cursor-pointer"
                >
                  {comment.user?.name || 'Unknown'}
                </span>
              ))}
            </div>

            {/* Comments Section */}
            <div className="space-y-4">
              {currentTask.comments?.map((comment: any, index: Key) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 border-b last:border-b-0 pb-3 last:pb-0"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-sm">
                    {comment.user?.name?.charAt(0) || 'U'}
                  </div>

                  {/* Comment Content */}
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium text-sm">{comment.user?.name || 'Unknown'}</p>
                    <p className="text-gray-600 text-sm">{comment.text}</p>
                    <span className="text-gray-400 text-xs">{calculateCommentTime(comment.createdAt)}</span>

                    {/* Bid Info */}
                    {comment.bid && (
                      <p className="text-gray-700 text-xs mt-1 px-2 py-0.5 inline-block bg-yellow-100 rounded-full">
                        Bid: ${comment.bid}{' '}
                        {comment.bid === currentTask.price
                          ? '(Accepts listed price)'
                          : comment.bid < currentTask.price
                            ? '(Lower than listed price)'
                            : '(Higher than listed price)'}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Close Button */}
            <div className="flex justify-end mt-5">
              <button
                onClick={closeDetailsModal}
                className="px-5 py-2 text-sm font-semibold bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}