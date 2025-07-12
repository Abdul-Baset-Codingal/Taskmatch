"use client";

import { useState } from "react";
import { FaMapMarkerAlt, FaClock, FaCalendarAlt, FaDollarSign } from "react-icons/fa";
import { MdAccessTime, MdOutlinePlayArrow } from "react-icons/md";
import { useGetUrgentTasksQuery, useBidOnTaskMutation, useUpdateTaskMutation, useAcceptTaskMutation } from "@/features/api/taskApi";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Navigation } from "swiper/modules";

export default function UrgentTaskCards() {
  const { data: urgentTasks = [], isLoading } = useGetUrgentTasksQuery();
  const [bidOnTask, { isLoading: isBidding }] = useBidOnTaskMutation();
  const [updateTaskStatus, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [acceptTask, { isLoading: isAccepting }] = useAcceptTaskMutation();

  console.log(urgentTasks)

  const [bidModalOpen, setBidModalOpen] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [offerPrice, setOfferPrice] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  if (isLoading) return <p className="text-white text-center">Loading...</p>;


  const openConfirmModal = (taskId) => {
    setSelectedTaskId(taskId);
    setConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setConfirmModalOpen(false);
    setSelectedTaskId(null);
  };

  const confirmAcceptTask = async () => {
    if (!selectedTaskId) return;
    try {
      await acceptTask(selectedTaskId).unwrap();
      toast.success("✅ Task accepted successfully!");
    } catch (err) {
      console.error("Failed to accept task", err);
      toast.error(err?.data?.error || "❌ Failed to accept task.");
    } finally {
      closeConfirmModal();
    }
  };



  const openBidModal = (taskId: string) => {
    setCurrentTaskId(taskId);
    setOfferPrice("");
    setMessage("");
    setBidModalOpen(true);
  };

  const closeBidModal = () => {
    setBidModalOpen(false);
    setCurrentTaskId(null);
  };


  const submitBid = async () => {
    if (!offerPrice || !currentTaskId) return alert("Please enter an offer price");

    try {
      await bidOnTask({ taskId: currentTaskId, offerPrice: Number(offerPrice), message }).unwrap();
      alert("Bid placed successfully!");
      closeBidModal();
    } catch (error) {
      alert("Failed to place bid.");
      console.error(error);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-500 bg-yellow-100";
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

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-[#F45F47] to-[#D77C1C] flex flex-col items-center justify-center gap-10">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white drop-shadow-md">
          URGENT TASKS - Immediate Action Required
        </h1>
        <p className="text-lg mt-2 font-semibold text-white">
          {urgentTasks.length} urgent task{urgentTasks.length !== 1 && "s"}
        </p>
      </div>

      <div className="w-full relative">
        <Swiper
          modules={[Navigation]}
          spaceBetween={30}
          slidesPerView={1}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {urgentTasks.map((task) => (
            <SwiperSlide key={task._id} className="p-4 ">
              <div className="border-2 rounded-3xl border-[#FFA651] p-6 bg-gradient-to-br from-[#FFF9F2] to-[#FFF3E7] shadow-2xl relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-gradient-to-r from-[#FF6B6B] to-[#FFA751] text-white px-4 py-1 rounded-full text-xs font-bold shadow-md">
                  URGENT · ASAP
                </div>

                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-3xl font-bold bg-gradient-to-br from-[#FF7F50] to-[#FFA500] shadow-lg">
                  ⚠️
                </div>

                <div className="flex justify-between items-center mt-4">
                  <h2 className="text-2xl font-extrabold text-[#FF7B00]">
                    {task.taskTitle}
                  </h2>
                  <div className={`text-sm font-bold px-3 py-1 rounded-xl shadow-sm flex items-center gap-2 ${getStatusStyle(task?.status)}`}>
                    <span className={`w-2 h-2 rounded-full inline-block ${getDotColor(task?.status)}`}></span>
                    {task?.status}
                  </div>


                </div>

                <div className="mt-3 space-y-2 text-sm text-[#555] font-medium">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-[#FF7A00]" />
                    {task.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <MdAccessTime className="text-[#FF7A00]" />
                    Schedule: {task.schedule}
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-[#FF7A00]" />
                    Posted: {new Date(task.createdAt).toLocaleString()}
                  </div>
                </div>

                <p className="mt-4 text-[#6B4E2F] bg-[#FFF4E8] p-3 rounded-lg shadow-inner">
                  {task.taskDescription}
                </p>

                <div className="mt-5 flex justify-between items-center text-sm text-[#FF7B00] font-semibold">
                  <div className="flex items-center gap-2 cursor-pointer hover:underline">
                    <MdOutlinePlayArrow />
                    View All Media ({task.photos.length + (task.video ? 1 : 0)})
                  </div>
                  <div className="flex flex-col gap-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <FaClock className="text-[#FF7B00]" />
                      Deadline:{" "}
                      {task.offerDeadline
                        ? new Date(task.offerDeadline).toLocaleDateString("en-GB", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                        : "Unknown"}
                    </div>
                    {task.price && (
                      <div className="flex items-center gap-2">
                        <FaDollarSign className="text-green-500" />
                        Price: ${task.price}
                      </div>
                    )}
                  </div>

                </div>

                <div className="mt-6 flex flex-wrap gap-3">

                  <button
                    onClick={() => openBidModal(task._id)}
                    disabled={task.status === "in progress" || task.status === "completed"}
                    className={`px-4 py-2 rounded-xl font-semibold transition ${task.status === "in progress"
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#FFF1D6] hover:bg-[#FFE5B4] text-[#A15500]"
                      }`}
                  >
                    Bid Now
                  </button>

                  <button
                    onClick={() => openConfirmModal(task._id)}
                    disabled={task.status === "in progress" || task.status === "completed"}
                    className={`px-4 py-2 rounded-xl font-bold transition ${task.status === "in progress"
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-[#FF7B00] hover:bg-[#e76900] text-white"
                      }`}
                  >
                    Accept Now
                  </button>


                </div>
              </div>
            </SwiperSlide>
          ))}

          <div className="swiper-button-prev absolute top-1/2 left-2 z-10 -translate-y-1/2 cursor-pointer text-white text-4xl select-none">
            &#8592;
          </div>
          <div className="swiper-button-next absolute top-1/2 right-2 z-10 -translate-y-1/2 cursor-pointer text-white text-4xl select-none">
            &#8594;
          </div>
        </Swiper>
      </div>

      {/* Bid Modal */}
      {bidModalOpen && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl transform transition-transform duration-300 scale-100">
            <h3 className="text-2xl font-semibold mb-6 text-gray-900">
              Place Your Bid
            </h3>

            <label htmlFor="offerPrice" className="block mb-2 font-medium text-gray-700">
              Offer Price ($):
            </label>
            <input
              id="offerPrice"
              type="number"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              className="w-full mb-6 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
              placeholder="Enter your offer price"
              min="0"
            />

            <label htmlFor="message" className="block mb-2 font-medium text-gray-700">
              Message (optional):
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full mb-6 border border-gray-300 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
              rows={4}
              placeholder="Add a message for the client (optional)"
            />

            <div className="flex justify-end gap-4">
              <button
                onClick={closeBidModal}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold
                 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={submitBid}
                disabled={isBidding}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {isBidding ? "Submitting..." : "Submit Bid"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Confirm Accept Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white max-w-sm w-full rounded-xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Acceptance</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to accept this task?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeConfirmModal}
                className="px-4 py-2 rounded-md font-bold bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmAcceptTask}
                disabled={isUpdating}
                className="px-4 py-2 rounded-md font-bold bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50"
              >
                {isUpdating ? "Accepting..." : "Yes, Accept"}
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
