/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAcceptBidMutation } from "@/features/api/taskApi";
import React from "react";
import { toast } from "react-toastify";
import { FaUser } from "react-icons/fa";
import Image from "next/image";
import { useGetUserByIdQuery } from "@/features/auth/authApi";

interface BidCardProps {
    bid: any;
    taskStatus: string;
    task: any;
}

const BidCard: React.FC<BidCardProps> = ({ bid, taskStatus, task }) => {
    const [acceptBid, { isLoading: isAccepting }] = useAcceptBidMutation();
    const { data: tasker, isLoading: isTaskerLoading, error: taskerError } = useGetUserByIdQuery(bid.taskerId);

    const handleAcceptBid = async () => {
        try {
            await acceptBid({ taskId: task._id, taskerId: bid.taskerId }).unwrap();
            toast.success("Bid accepted successfully");
        } catch (error: any) {
            console.error("Failed to accept bid:", error);
            toast.error(error.data?.error || "Failed to accept bid");
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
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 xs:p-3">
            {/* Tasker Info */}
            <div className="flex items-center mb-2">
                <div className="w-10 h-10 mr-2 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
                    {tasker?.profilePicture ? (
                        <Image
                            src={tasker.profilePicture}
                            alt={`${tasker.fullName}'s profile picture`}
                            width={40}
                            height={40}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <FaUser className="text-gray-500 text-xl" />
                    )}
                </div>
                <div>
                    <p className="text-xs xs:text-sm font-semibold text-gray-800">
                        {tasker?.fullName || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-500">{tasker?.email || "No email available"}</p>
                </div>
            </div>

            {/* Price + Date */}
            <div className="flex items-center justify-between mb-1 xs:mb-2">
                <span className="text-sm xs:text-base font-bold text-green-600">
                    ${bid.offerPrice}
                </span>
                <span className="text-xs text-gray-500 flex-shrink-0">
                    {new Date(bid.createdAt).toLocaleDateString()}
                </span>
            </div>

            {/* Message */}
            <p className="text-xs xs:text-sm text-gray-700 break-words mb-2">
                {bid.message}
            </p>

            {/* Accept Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleAcceptBid}
                    disabled={taskStatus !== "pending" || isAccepting}
                    className={`text-xs xs:text-sm px-3 py-1 rounded-md transition-colors
                        ${taskStatus === "pending" && !isAccepting
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                >
                    {isAccepting ? "Accepting..." : "Accept Bid"}
                </button>
            </div>
        </div>
    );
};

export default BidCard;