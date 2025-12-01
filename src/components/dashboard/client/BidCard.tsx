/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAcceptBidMutation } from "@/features/api/taskApi";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaUser, FaClock, FaMoneyBillWave, FaCheckCircle } from "react-icons/fa";
import Image from "next/image";
import { useGetUserByIdQuery } from "@/features/auth/authApi";
import AcceptBidPaymentModal from "./AcceptBidPaymentModal"; // You'll create this

interface BidCardProps {
    bid: any;
    taskStatus: string;
    task: any;
}

const BidCard: React.FC<BidCardProps> = ({ bid, taskStatus, task }) => {
    const [acceptBid, { isLoading: isAccepting }] = useAcceptBidMutation();
    const { data: taskerResponse, isLoading: isTaskerLoading, error: taskerError } = useGetUserByIdQuery(bid.taskerId);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const tasker = taskerResponse?.user;

    const handleAcceptBidClick = () => {
        setIsPaymentModalOpen(true);
    };

    const handlePaymentSuccess = async (paymentIntentId: string) => {
        try {
            await acceptBid({
                taskId: task._id,
                taskerId: bid.taskerId,
                paymentIntentId // Pass the payment intent ID to your backend
            }).unwrap();
            toast.success("Bid accepted successfully and payment authorized!");
        } catch (error: any) {
            console.error("Failed to accept bid:", error);
            toast.error(error.data?.error || "Failed to accept bid");
        } finally {
            setIsPaymentModalOpen(false);
        }
    };

    if (isTaskerLoading) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 xs:p-3">
                <p className="text-xs xs:text-sm text-gray-700">Loading tasker data...</p>
            </div>
        );
    }

    if (taskerError) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 xs:p-3">
                <p className="text-xs xs:text-sm text-red-600">Error loading tasker data</p>
            </div>
        );
    }

    return (
        <>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 p-3 hover:shadow-md transition-all duration-300 hover:border-blue-300">
                {/* Tasker Info */}
                <div className="flex items-center gap-3 mb-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                            {tasker?.profilePicture ? (
                                <Image
                                    src={tasker.profilePicture}
                                    alt={tasker.firstName + " " + tasker.lastName || "Tasker"}
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                                    <FaUser className="text-blue-600 text-lg" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                            {tasker?.firstName + " " + tasker?.lastName || "Anonymous Tasker"}
                        </p>
                        {tasker?.email && (
                            <p className="text-xs text-gray-600 truncate">
                                {tasker.email}
                            </p>
                        )}
                    </div>
                </div>

                {/* Bid Details */}
                <div className="space-y-2">
                    {/* Price */}
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <FaMoneyBillWave className="text-green-600 text-sm" />
                            Offer Price:
                        </span>
                        <span className="text-lg font-bold text-green-700">
                            ${bid.offerPrice}
                        </span>
                    </div>

                    {/* Message */}
                    {bid.message && (
                        <div className="bg-white rounded-lg p-3 border border-blue-100">
                            <p className="text-sm text-gray-700 leading-relaxed break-words">
                                "{bid.message}"
                            </p>
                        </div>
                    )}

                    {/* Date */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                            <FaClock className="text-gray-400" />
                            {new Date(bid.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>

                    {/* Accept Button */}
                    <div className="flex justify-end pt-2">
                        <button
                            onClick={handleAcceptBidClick}
                            disabled={taskStatus !== "pending" || isAccepting}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105
                                ${taskStatus === "pending" && !isAccepting
                                    ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                        >
                            <FaCheckCircle className="text-sm" />
                            {isAccepting ? "Accepting..." : "Accept Bid"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Payment Modal for Bid Acceptance */}
            <AcceptBidPaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                onSuccess={handlePaymentSuccess}
                bidAmount={bid.offerPrice}
                taskTitle={task.taskTitle}
                taskerName={tasker?.firstName + " " + tasker?.lastName || "Tasker"}
                taskId={task._id}
                taskerId={bid.taskerId}
            />
        </>
    );
};

export default BidCard;