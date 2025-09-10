/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { FiX, FiCalendar, FiClock, FiMapPin, FiUser } from "react-icons/fi";
import { MdWorkOutline } from "react-icons/md";

type TaskCostBreakdownModalProps = {
    isOpen: boolean;
    onClose: () => void;
    task: any;
    onConfirm: () => void;
    isAccepting: boolean;
};

const TaskCostBreakdownModal: React.FC<TaskCostBreakdownModalProps> = ({
    isOpen,
    onClose,
    task,
    onConfirm,
    isAccepting,
}) => {
    if (!isOpen || !task) return null;

    // Example cost breakdown
    const serviceFee = task.price * 0.1; // 10% service fee
    const platformFee = 5; // fixed fee
    const totalCost = task.price + serviceFee + platformFee;

    const postedTime = new Date(task.createdAt).toLocaleString();
    const deadlineTime = new Date(task.offerDeadline).toLocaleString();

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-y-scroll max-h-[80vh]">
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b">
                    <h3 className="text-xl font-bold text-gray-900">Task Details & Cost Breakdown</h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Task Info */}
                <div className="p-6 space-y-6">
                    {/* Title & Location */}
                    <div className="flex items-center gap-3">
                        <MdWorkOutline className="text-3xl text-teal-600" />
                        <div>
                            <h4 className="font-semibold text-gray-800 text-lg">{task.taskTitle}</h4>
                            <p className="text-gray-500 text-sm flex items-center gap-1">
                                <FiMapPin className="text-teal-500" /> {task.location}
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">Description</p>
                        <p className="text-gray-700 mt-1 leading-relaxed">{task.taskDescription}</p>
                    </div>

                    {/* More Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                        <div className="flex items-start gap-2">
                            <FiUser className="text-teal-600 mt-0.5" />
                            <div>
                                <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">Client</p>
                                <p className="text-gray-800 font-medium">
                                    {task.client?.fullName || "N/A"}{" "}
                                    <span className="text-gray-500 text-sm">
                                        ({task.client?.email || "N/A"})
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2">
                            <FiCalendar className="text-teal-600 mt-0.5" />
                            <div>
                                <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">Deadline</p>
                                <p className="text-gray-800 font-medium">{deadlineTime}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2">
                            <FiClock className="text-teal-600 mt-0.5" />
                            <div>
                                <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">Posted</p>
                                <p className="text-gray-800 font-medium">{postedTime}</p>
                            </div>
                        </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="space-y-3 border-t pt-4">
                        <h4 className="text-lg font-semibold text-gray-800">Cost Breakdown</h4>
                        <div className="flex justify-between text-gray-700">
                            <span>Base Price</span>
                            <span>${task.price}</span>
                        </div>
                        <div className="flex justify-between text-gray-700">
                            <span>Service Fee (10%)</span>
                            <span>${serviceFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-700">
                            <span>Platform Fee</span>
                            <span>${platformFee.toFixed(2)}</span>
                        </div>
                        <hr />
                        <div className="flex justify-between font-semibold text-lg text-gray-900">
                            <span>Total Cost</span>
                            <span>${totalCost.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 p-5 border-t">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isAccepting}
                        className="px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-teal-600 to-teal-800 text-white hover:from-teal-700 hover:to-teal-900 shadow-md transition"
                    >
                        {isAccepting ? "Accepting..." : "Confirm & Accept"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskCostBreakdownModal;
