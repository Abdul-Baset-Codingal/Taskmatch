/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import {
  FiMapPin,
  FiUser,
  FiDollarSign,
  FiClock,
  FiMessageCircle,
  FiChevronDown,
  FiChevronUp,
  FiCalendar,
} from "react-icons/fi";
import { MdWorkOutline } from "react-icons/md";
import {
  useGetTasksExcludingStatusQuery,
  useBidOnTaskMutation,
  useAcceptTaskMutation,
  useAddCommentMutation,
  useRequestCompletionMutation
} from "@/features/api/taskApi";

// Temporary: You need to add this mutation to your API slice if you want comments


const AvailableTasks = () => {
  const { data: tasks, error, isLoading, refetch } = useGetTasksExcludingStatusQuery("completed");
  const [requestCompletion] = useRequestCompletionMutation();

  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [bidFormOpenId, setBidFormOpenId] = useState<string | null>(null);
  const [bidOfferPrice, setBidOfferPrice] = useState<number | "">("");
  const [bidMessage, setBidMessage] = useState("");
  const [commentMessage, setCommentMessage] = useState("");
  const [commentFormOpenId, setCommentFormOpenId] = useState<string | null>(null);

  const [addBid, { isLoading: isBidding }] = useBidOnTaskMutation();
  const [acceptTask, { isLoading: isAccepting }] = useAcceptTaskMutation();

  // Uncomment and implement this mutation in your API slice for comments:
  const [addComment, { isLoading: isCommenting }] = useAddCommentMutation();

  const toggleComments = (id: string) => {
    setExpandedTaskId((prev) => (prev === id ? null : id));
  };

  const toggleBidForm = (id: string) => {
    setBidFormOpenId((prev) => (prev === id ? null : id));
    setBidOfferPrice("");
    setBidMessage("");
  };

  const toggleCommentForm = (id: string) => {
    setCommentFormOpenId((prev) => (prev === id ? null : id));
    setCommentMessage("");
  };

  if (isLoading) return <p className="text-center p-8 text-teal-600 font-medium">Loading tasks...</p>;
  if (error) return <p className="text-center p-8 text-red-600 font-semibold">Error loading tasks</p>;

  const handlePlaceBid = async (taskId: string) => {
    if (bidOfferPrice === "" || bidOfferPrice <= 0) {
      alert("Please enter a valid offer price");
      return;
    }
    try {
      await addBid({ taskId, offerPrice: bidOfferPrice, message: bidMessage }).unwrap();
      alert("Bid placed successfully!");
      toggleBidForm(taskId);
      refetch();
    } catch (err) {
      alert("Failed to place bid");
      console.error(err);
    }
  };

  const handleAcceptTask = async (taskId: string) => {
    if (!window.confirm("Are you sure you want to accept this task?")) return;
    try {
      await acceptTask(taskId).unwrap();
      alert("Task accepted!");
      refetch();
    } catch (err) {
      alert("Failed to accept task");
      console.error(err);
    }
  };

  const handleRequestCompletion = async (taskId: any) => {
    if (!window.confirm("Are you sure you want to request task completion?")) return;

    try {
      await requestCompletion(taskId).unwrap();
      alert("Completion request sent!");
      refetch();
    } catch (err) {
      console.error(err);
      alert("Failed to request completion.");
    }
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
      refetch();
    } catch (err) {
      alert("Failed to add comment");
      console.error(err);
    }
  };

  return (
    <section className="max-w-6xl mx-auto py-10 px-4">
      <h2 className="text-4xl font-bold text-center text-[#0f172a] mb-10">🧰 Available Tasks</h2>

      <div className="space-y-8">
        {tasks?.length === 0 ? (
          <p className="text-center text-gray-600">No tasks available right now.</p>
        ) : (
          tasks.map((task: any) => {
            const postedTime = new Date(task.createdAt).toLocaleString();
            const deadlineTime = new Date(task.offerDeadline).toLocaleString();
            const isOpen = expandedTaskId === task._id;
            const isBidFormOpen = bidFormOpenId === task._id;
            const isCommentFormOpen = commentFormOpenId === task._id;

            const isAccepted = task.status === "in progress" || task.status === "completed";

            return (
              <div
                key={task._id}
                className="flex flex-col md:flex-row rounded-2xl bg-white border border-gray-200 shadow-lg overflow-hidden transition hover:shadow-xl"
              >
                {/* Left Sidebar */}
                <div className="bg-gradient-to-r from-[#FF6B6B] to-[#FFA751] text-white w-full md:w-40 flex flex-col justify-center items-center p-6">
                  <MdWorkOutline className="text-4xl mb-3" />
                  <span className="text-xs uppercase bg-white/20 px-3 py-1 rounded-full font-semibold tracking-wide">
                    {task.schedule}
                  </span>

                </div>

                {/* Content */}
                <div className="flex-1 p-6 space-y-4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <h3 className="text-2xl font-bold text-gray-800">{task.taskTitle}</h3>
                    <p className="text-sm text-gray-500 mt-1 md:mt-0">
                      <FiClock className="inline mr-1" />
                      {postedTime}
                    </p>
                  </div>

                  <p className="text-gray-700 text-base flex items-start gap-2">
                    <FiMessageCircle className="mt-1 text-[#FF6B6B]" />
                    {task.taskDescription}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                    <p className="flex items-center gap-2">
                      <FiMapPin className="text-[#FF6B6B]" />
                      <strong>Location:</strong> {task.location}
                    </p>
                    <p className="flex items-center gap-2">
                      <FiUser className="text-[#FF6B6B]" />
                      <strong>Client:</strong> {task.client?.fullName || "N/A"} (
                      {task.client?.email || "N/A"})
                    </p>
                    <p className="flex items-center gap-2">
                      <FiDollarSign className="text-[#FF6B6B]" />
                      <strong>Price:</strong> {task.price ? `$${task.price}` : "Not provided"}
                    </p>
                    <p className="flex items-center gap-2">
                      <FiCalendar className="text-[#FF6B6B]" />
                      <strong>Deadline:</strong> {deadlineTime}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    {task.status === "in progress" ? (
                      <button
                        onClick={() => handleRequestCompletion(task._id)}
                        className="w-full sm:w-auto py-2 px-4 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
                      >
                        📩 Request Completion
                      </button>
                    ) : task.status === "pending" ? (
                      <>
                        <button
                          disabled={isAccepted || isBidding}
                          onClick={() => toggleBidForm(task._id)}
                          className={`flex-1 py-2 px-4 rounded-xl font-semibold transition
        ${isAccepted ? "bg-gray-400 cursor-not-allowed" : "bg-[#FF6B6B] text-white hover:bg-[#e65a5a]"}`}
                        >
                          💰 Place Bid
                        </button>
                        <button
                          disabled={isAccepted || isAccepting}
                          onClick={() => handleAcceptTask(task._id)}
                          className={`flex-1 py-2 px-4 rounded-xl font-semibold transition
        ${isAccepted ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-[#FF6B6B] to-[#FFA751] text-white hover:from-[#e65a5a] hover:to-[#e6a751]"}`}
                        >
                          ✅ Accept Task
                        </button>
                      </>
                    ) : null}

                    {/* Comment Button (Always Show) */}
                    <button
                      onClick={() => toggleCommentForm(task._id)}
                      className="flex-1 py-2 px-4 rounded-xl font-semibold bg-teal-600 text-white hover:bg-teal-700 transition"
                    >
                      💬 Comment ({task.comments?.length || 0})
                    </button>
                  </div>



                  {/* Bid Form */}
                  {isBidFormOpen && (
                    <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-300">
                      <h4 className="font-semibold mb-2">Place Your Bid</h4>
                      <input
                        type="number"
                        min={1}
                        placeholder="Offer Price ($)"
                        className="w-full p-2 mb-2 border rounded"
                        value={bidOfferPrice}
                        onChange={(e) => setBidOfferPrice(Number(e.target.value))}
                      />
                      <textarea
                        placeholder="Message (optional)"
                        className="w-full p-2 mb-2 border rounded"
                        value={bidMessage}
                        onChange={(e) => setBidMessage(e.target.value)}
                      />
                      <button
                        onClick={() => handlePlaceBid(task._id)}
                        disabled={isBidding}
                        className="bg-[#FF6B6B] text-white px-4 py-2 rounded font-semibold hover:bg-[#e65a5a]"
                      >
                        Submit Bid
                      </button>
                      <button
                        onClick={() => toggleBidForm(task._id)}
                        disabled={isBidding}
                        className="ml-4 px-4 py-2 rounded border border-gray-400 hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {isCommentFormOpen && (
                    <div className="mt-6 bg-gradient-to-br from-white via-gray-50 to-white border border-gray-200 shadow-xl rounded-2xl p-6 transition-all duration-300">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-full bg-teal-100 text-teal-700">
                          💬
                        </div>
                        <h4 className="text-xl font-semibold text-gray-800">Add a Comment</h4>
                      </div>

                      {/* Textarea */}
                      <textarea
                        placeholder="Write your thoughts here..."
                        className="w-full p-4 border border-gray-300 rounded-xl text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition resize-none"
                        rows={4}
                        value={commentMessage}
                        onChange={(e) => setCommentMessage(e.target.value)}
                      />

                      {/* Buttons */}
                      <div className="flex justify-end gap-3 mt-5">
                        <button
                          onClick={() => toggleCommentForm(task._id)}
                          disabled={isCommenting}
                          className="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition duration-200"
                        >
                          Cancel
                        </button>

                        <button
                          onClick={() => handleAddComment(task._id)}
                          disabled={isCommenting}
                          className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 rounded-lg shadow-md transition duration-200"
                        >
                          {isCommenting ? "Submitting..." : "Submit Comment"}
                        </button>
                      </div>
                    </div>
                  )}


                  {/* Comments toggle */}
                  <div className="mt-6">
                    <button
                      onClick={() => toggleComments(task._id)}
                      className="flex items-center gap-2 text-sm text-[#FF6B6B] font-semibold hover:underline"
                    >
                      {isOpen ? (
                        <>
                          <FiChevronUp /> Hide Comments ({task.comments?.length || 0})
                        </>
                      ) : (
                        <>
                          <FiChevronDown /> Show Comments ({task.comments?.length || 0})
                        </>
                      )}
                    </button>

                    {isOpen && (
                      <div className="mt-3">
                        {task.comments?.length === 0 ? (
                          <p className="text-sm text-gray-500">No comments yet.</p>
                        ) : (
                          <div className="space-y-3 mt-2">
                            {task.comments.map((comment: any, idx: number) => (
                              <div key={idx} className="bg-teal-50 p-3 rounded-lg border border-teal-200">
                                <p className="text-sm text-teal-900 font-medium">
                                  {task.client?.fullName}: {comment.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(comment.createdAt).toLocaleString()}
                                </p>
                                {comment.replies?.length > 0 && (
                                  <div className="mt-2 ml-4 border-l-2 border-teal-300 pl-3 space-y-2">
                                    {comment.replies.map((reply: any, ridx: number) => (
                                      <div key={ridx} className="text-sm">
                                        <p className="text-teal-700 font-semibold">
                                          {reply.role.toUpperCase()}:{" "}
                                          <span className="font-normal">{reply.message}</span>
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {new Date(reply.createdAt).toLocaleString()}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default AvailableTasks;
