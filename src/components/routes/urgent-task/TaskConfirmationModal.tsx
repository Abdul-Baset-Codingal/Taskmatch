import React from "react";
import { RootState } from "@/app/store";

type TaskConfirmationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    taskForm: RootState["taskForm"];
    timing: string;
    price: string;
    info: string;
    isLoading: boolean;
};

const TaskConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    taskForm,
    timing,
    price,
    info,
    isLoading,
}: TaskConfirmationModalProps) => {
    if (!isOpen) return null;

    // Formatting monetary values to 2 decimal places
    const serviceFee = (parseFloat(price) * 0.08).toFixed(2);
    const tax = (parseFloat(price) * 0.13).toFixed(2);
    const total = (parseFloat(price) + parseFloat(serviceFee) + parseFloat(tax)).toFixed(2);

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black opacity-50"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="bg-white p-8 rounded-2xl shadow-2xl z-50 max-w-lg w-full mx-4 
                    max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    ✅ Confirm Task Posting
                </h2>

                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Task Details</h3>
                    <div className="grid gap-4 text-gray-700">
                        {/* Service */}
                        <div className="flex items-start gap-3">
                            <span className="text-lg">🔧</span>
                            <div>
                                <p className="font-medium">Service</p>
                                <p className="text-orange-600">{taskForm.serviceTitle || "Not specified"}</p>
                            </div>
                        </div>
                        {/* Location */}
                        <div className="flex items-start gap-3">
                            <span className="text-lg">📍</span>
                            <div>
                                <p className="font-medium">Location</p>
                                <p className="text-gray-600">{taskForm.location || "Not specified"}</p>
                            </div>
                        </div>
                        {/* Timing */}
                        <div className="flex items-start gap-3">
                            <span className="text-lg">⏱️</span>
                            <div>
                                <p className="font-medium">Timing</p>
                                <p className="text-orange-600 capitalize">{timing}</p>
                            </div>
                        </div>
                        {/* Budget */}
                        <div className="flex items-start gap-3">
                            <span className="text-lg">💰</span>
                            <div>
                                <p className="font-medium">Budget</p>
                                <p className="text-orange-600 font-bold">${price || "Not specified"}</p>
                            </div>
                        </div>
                        {/* Estimated Time */}
                        <div className="flex items-start gap-3">
                            <span className="text-lg">🕒</span>
                            <div>
                                <p className="font-medium">Estimated Time</p>
                                <p className="text-gray-600">{taskForm.estimatedTime || "Not specified"} hours</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cost Breakdown */}
                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <span className="text-lg">💰</span> Cost Breakdown
                    </h3>
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-300 shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="grid gap-3 text-gray-800">
                            <div className="flex justify-between items-center">
                                <p className="font-medium text-gray-700">Estimated Budget ${price}</p>
                                <p className="text-orange-600 font-semibold">${price}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="font-medium text-gray-700">TaskMatch Service Fee (8%)</p>
                                <p className="text-orange-600 font-semibold">${serviceFee}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="font-medium text-gray-700">Tax (HST 13%)</p>
                                <p className="text-orange-600 font-semibold">${tax}</p>
                            </div>
                            <div className="flex justify-between items-center border-t border-orange-200 pt-3 mt-3">
                                <p className="font-bold text-gray-800 text-lg">TOTAL AMOUNT</p>
                                <p className="text-orange-700 font-bold text-lg">${total}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-6 bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h3 className="text-lg font-semibold text-orange-600 mb-2">Additional Information</h3>
                    <p className="text-sm text-gray-700 mb-2">
                        {info || "No additional details provided."}
                    </p>
                    <p className="text-sm text-gray-600">
                        Note: {timing === "Urgent" ? "A 20% extra fee applies for urgent tasks." : "Task will be scheduled as per selected time."}
                        By posting, you agree to receive quotes from taskers and our platform terms.
                    </p>
                </div>

                <p className="text-gray-700 mb-6 font-medium">
                    Are you sure you want to post this task? Once posted, taskers can start sending offers.
                </p>

                <div className="flex justify-end gap-4 bottom-0 bg-white pt-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-[#FF8906] to-[#FF8906] px-6 py-3 rounded-xl font-bold text-white hover:shadow-lg disabled:opacity-50"
                    >
                        {isLoading ? "Posting..." : "Confirm & Post"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskConfirmationModal;