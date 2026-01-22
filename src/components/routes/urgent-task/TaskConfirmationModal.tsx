
// /* eslint-disable @typescript-eslint/ban-ts-comment */
// // @ts-nocheck
// import React from "react";
// import { RootState } from "@/app/store";

// type TaskConfirmationModalProps = {
//     isOpen: boolean;
//     onClose: () => void;
//     onConfirm: () => void;
//     taskForm: RootState["taskForm"];
//     timing: string;
//     price: string;
//     info: string;
//     isLoading: boolean;
// };

// const TaskConfirmationModal = ({
//     isOpen,
//     onClose,
//     onConfirm,
//     taskForm,
//     timing,
//     price,
//     info,
//     isLoading,
// }: TaskConfirmationModalProps) => {
//     if (!isOpen) return null;

//     const budget = parseFloat(price) || 0;
//     const isUrgent = timing === "Urgent";
//     const urgentFee = isUrgent ? (budget * 0.20).toFixed(2) : "0.00";
//     const subtotal = isUrgent ? (budget + parseFloat(urgentFee)).toFixed(2) : budget.toFixed(2);
//     const serviceFee = (parseFloat(subtotal) * 0.08).toFixed(2);
//     const tax = (parseFloat(subtotal) * 0.13).toFixed(2);
//     const total = (parseFloat(subtotal) + parseFloat(serviceFee) + parseFloat(tax)).toFixed(2);

//     return (
//         <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
//             {/* Overlay */}
//             <div
//                 className="fixed inset-0 bg-black/60 backdrop-blur-sm"
//                 onClick={onClose}
//             ></div>

//             {/* Modal */}
//             <div className="bg-white rounded-2xl shadow-2xl z-50 max-w-2xl w-full 
//                     max-h-[90vh] overflow-y-auto">

//                 {/* Header */}
//                 <div className="bg-[#063A41] text-white px-8 py-6 rounded-t-2xl">
//                     <h2 className="text-2xl font-bold flex items-center gap-3">
//                         <svg className="w-8 h-8 text-[#E5FFDB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                         </svg>
//                         Confirm Your Task
//                     </h2>
//                     <p className="text-[#E5FFDB] text-sm mt-2">Review the details before posting</p>
//                 </div>

//                 {/* Content */}
//                 <div className="p-8">
//                     {/* Task Details Section */}
//                     <div className="mb-6">
//                         <h3 className="text-lg font-bold text-[#063A41] mb-4 flex items-center gap-2">
//                             <svg className="w-5 h-5 text-[#109C3D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                             </svg>
//                             Task Details
//                         </h3>
//                         <div className="grid gap-4">
//                             {/* Service */}
//                             <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
//                                 <span className="text-2xl">🔧</span>
//                                 <div className="flex-1">
//                                     <p className="font-semibold text-[#063A41]">Service</p>
//                                     <p className="text-[#109C3D] font-medium">{taskForm.serviceTitle || "Not specified"}</p>
//                                 </div>
//                             </div>

//                             {/* Location */}
//                             <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
//                                 <span className="text-2xl">📍</span>
//                                 <div className="flex-1">
//                                     <p className="font-semibold text-[#063A41]">Location</p>
//                                     <p className="text-gray-700">{taskForm.location || "Not specified"}</p>
//                                 </div>
//                             </div>

//                             {/* Timing */}
//                             <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
//                                 <span className="text-2xl">⏰</span>
//                                 <div className="flex-1">
//                                     <p className="font-semibold text-[#063A41]">When</p>
//                                     <p className={`font-medium capitalize ${isUrgent ? 'text-red-600' : 'text-[#109C3D]'}`}>
//                                         {timing} {isUrgent && '(+20% fee)'}
//                                     </p>
//                                 </div>
//                             </div>

//                             {/* Budget */}
//                             <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
//                                 <span className="text-2xl">💰</span>
//                                 <div className="flex-1">
//                                     <p className="font-semibold text-[#063A41]">Your Budget</p>
//                                     <p className="text-[#109C3D] font-bold text-lg">${price || "Not specified"}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Cost Breakdown */}
//                     <div className="mb-6">
//                         <h3 className="text-lg font-bold text-[#063A41] mb-4 flex items-center gap-2">
//                             <svg className="w-5 h-5 text-[#109C3D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                             </svg>
//                             Cost Breakdown
//                         </h3>
//                         <div className="bg-gradient-to-br from-[#E5FFDB] to-white p-6 rounded-xl border-2 border-[#109C3D]/20 shadow-sm">
//                             <div className="space-y-3">
//                                 <div className="flex justify-between items-center">
//                                     <p className="text-[#063A41]">Task Budget</p>
//                                     <p className="text-[#063A41] font-semibold">${price}</p>
//                                 </div>
//                                 {isUrgent && (
//                                     <div className="flex justify-between items-center text-red-600">
//                                         <p className="text-red-600 font-semibold">Urgent Fee (20%)</p>
//                                         <p className="text-red-600 font-semibold">+${urgentFee}</p>
//                                     </div>
//                                 )}
//                                 <div className="flex justify-between items-center">
//                                     <p className="text-[#063A41]">Service Fee </p>
//                                     <p className="text-[#063A41] font-semibold">${serviceFee}</p>
//                                 </div>
//                                 <div className="flex justify-between items-center">
//                                     <p className="text-[#063A41]">Tax (HST 13%)</p>
//                                     <p className="text-[#063A41] font-semibold">${tax}</p>
//                                 </div>
//                                 <div className="flex justify-between items-center border-t-2 border-[#109C3D] pt-3 mt-3">
//                                     <p className="font-bold text-[#063A41] text-lg">Total Amount</p>
//                                     <p className="text-[#109C3D] font-bold text-xl">${total}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Additional Information */}
//                     <div className="mb-6 bg-[#E5FFDB] border-l-4 border-[#109C3D] p-5 rounded-lg">
//                         <h3 className="text-base font-bold text-[#063A41] mb-2 flex items-center gap-2">
//                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                             </svg>
//                             Additional Information
//                         </h3>
//                         <p className="text-sm text-[#063A41] mb-3">
//                             {info || "No additional details provided."}
//                         </p>
//                         <p className="text-sm text-gray-700">
//                             <strong>Note:</strong> {timing === "Urgent" ? "A 20% extra fee applies for urgent tasks." : "Task will be scheduled as per selected time."} By posting, you agree to receive quotes from taskers and our platform terms.
//                         </p>
//                     </div>

//                     {/* Action Buttons */}
//                     {/* In TaskConfirmationModal.tsx - Action Buttons section */}
//                     <div className="flex gap-4">
//                         <button
//                             onClick={onClose}
//                             className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 text-[#063A41] font-semibold hover:bg-gray-50 transition-colors"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             onClick={onConfirm}
//                             disabled={isLoading}
//                             className="flex-1 bg-[#109C3D] px-6 py-3 rounded-lg font-bold text-white hover:bg-[#0d8332] transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             {isLoading ? (
//                                 <span className="flex items-center justify-center gap-2">
//                                     <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
//                                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                                     </svg>
//                                     Processing...
//                                 </span>
//                             ) : (
//                                 "Post Task"
//                             )}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TaskConfirmationModal;



/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
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

// ⭐ FEE CONSTANTS - Double-sided fee structure
// Client Side
const CLIENT_PLATFORM_FEE_PERCENT = 0.10; // 10%
const RESERVATION_FEE = 5;                 // $5 flat
const CLIENT_TAX_PERCENT = 0.13;           // 13% HST
const URGENT_FEE_PERCENT = 0.20;           // 20% urgent fee

// Tasker Side
const TASKER_PLATFORM_FEE_PERCENT = 0.12; // 12%
const TASKER_TAX_PERCENT = 0.13;           // 13% tax

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

    const budget = parseFloat(price) || 0;
    const isUrgent = timing === "Urgent";

    // ⭐ CLIENT SIDE CALCULATIONS
    // Urgent fee (20% if urgent)
    const urgentFee = isUrgent ? budget * URGENT_FEE_PERCENT : 0;

    // Base amount (budget + urgent fee if applicable)
    const baseAmount = budget + urgentFee;

    // Platform Fee: 10% of base amount
    const clientPlatformFee = baseAmount * CLIENT_PLATFORM_FEE_PERCENT;

    // Reservation Fee: $5 flat
    const reservationFee = RESERVATION_FEE;

    // HST: 13% of base amount
    const clientTax = baseAmount * CLIENT_TAX_PERCENT;

    // Total Client Pays
    const totalClientPays = baseAmount + clientPlatformFee + reservationFee + clientTax;

    // ⭐ TASKER SIDE CALCULATIONS (for display purposes)
    // Tasker Platform Fee: 12% of base amount
    const taskerPlatformFee = baseAmount * TASKER_PLATFORM_FEE_PERCENT;

    // Tasker Tax: 13% of base amount
    const taskerTax = baseAmount * TASKER_TAX_PERCENT;

    // Tasker Receives
    const taskerReceives = baseAmount - taskerPlatformFee - taskerTax;

    // ⭐ PLATFORM KEEPS
    const platformKeeps = totalClientPays - taskerReceives;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="bg-white rounded-2xl shadow-2xl z-50 max-w-2xl w-full 
                    max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="bg-[#063A41] text-white px-8 py-6 rounded-t-2xl">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        <svg className="w-8 h-8 text-[#E5FFDB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Confirm Your Task
                    </h2>
                    <p className="text-[#E5FFDB] text-sm mt-2">Review the details before posting</p>
                </div>

                {/* Content */}
                <div className="p-8">
                    {/* Task Details Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-[#063A41] mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#109C3D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Task Details
                        </h3>
                        <div className="grid gap-4">
                            {/* Service */}
                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <span className="text-2xl">🔧</span>
                                <div className="flex-1">
                                    <p className="font-semibold text-[#063A41]">Service</p>
                                    <p className="text-[#109C3D] font-medium">{taskForm.serviceTitle || "Not specified"}</p>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <span className="text-2xl">📍</span>
                                <div className="flex-1">
                                    <p className="font-semibold text-[#063A41]">Location</p>
                                    <p className="text-gray-700">{taskForm.location || "Not specified"}</p>
                                </div>
                            </div>

                            {/* Timing */}
                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <span className="text-2xl">⏰</span>
                                <div className="flex-1">
                                    <p className="font-semibold text-[#063A41]">When</p>
                                    <p className={`font-medium capitalize ${isUrgent ? 'text-red-600' : 'text-[#109C3D]'}`}>
                                        {timing} {isUrgent && '(+20% urgent fee)'}
                                    </p>
                                </div>
                            </div>

                            {/* Budget */}
                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <span className="text-2xl">💰</span>
                                <div className="flex-1">
                                    <p className="font-semibold text-[#063A41]">Your Budget</p>
                                    <p className="text-[#109C3D] font-bold text-lg">${budget.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ⭐ UPDATED Cost Breakdown */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-[#063A41] mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#109C3D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Cost Breakdown
                        </h3>
                        <div className="bg-gradient-to-br from-[#E5FFDB] to-white p-6 rounded-xl border-2 border-[#109C3D]/20 shadow-sm">
                            <div className="space-y-3">
                                {/* Task Budget */}
                                <div className="flex justify-between items-center">
                                    <p className="text-[#063A41]">Task Budget</p>
                                    <p className="text-[#063A41] font-semibold">${budget.toFixed(2)}</p>
                                </div>

                                {/* Urgent Fee (if applicable) */}
                                {isUrgent && (
                                    <div className="flex justify-between items-center">
                                        <p className="text-red-600 font-medium flex items-center gap-1">
                                            <span>⚡</span> Urgent Fee (20%)
                                        </p>
                                        <p className="text-red-600 font-semibold">+ ${urgentFee.toFixed(2)}</p>
                                    </div>
                                )}

                                {/* Subtotal if urgent */}
                                {isUrgent && (
                                    <div className="flex justify-between items-center border-t border-gray-200 pt-2">
                                        <p className="text-[#063A41] font-medium">Subtotal</p>
                                        <p className="text-[#063A41] font-semibold">${baseAmount.toFixed(2)}</p>
                                    </div>
                                )}

                                {/* Service Fees Header */}
                                <div className="border-t border-gray-200 pt-3 mt-2">
                                    <p className="text-sm text-gray-500 mb-2">Service Fees:</p>
                                </div>

                                {/* Platform Fee (10%) */}
                                <div className="flex justify-between items-center pl-3">
                                    <p className="text-[#063A41]">Platform Fee (10%)</p>
                                    <p className="text-[#063A41] font-semibold">+ ${clientPlatformFee.toFixed(2)}</p>
                                </div>

                                {/* Reservation Fee ($5) */}
                                <div className="flex justify-between items-center pl-3">
                                    <p className="text-[#063A41]">Reservation Fee</p>
                                    <p className="text-[#063A41] font-semibold">+ ${reservationFee.toFixed(2)}</p>
                                </div>

                                {/* HST (13%) */}
                                <div className="flex justify-between items-center pl-3">
                                    <p className="text-[#063A41]">HST (13%)</p>
                                    <p className="text-[#063A41] font-semibold">+ ${clientTax.toFixed(2)}</p>
                                </div>

                                {/* Total */}
                                <div className="flex justify-between items-center border-t-2 border-[#109C3D] pt-4 mt-4">
                                    <p className="font-bold text-[#063A41] text-lg">Total You Pay</p>
                                    <p className="text-[#E53935] font-bold text-2xl">${totalClientPays.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                

                    {/* Additional Information */}
                    <div className="mb-6 bg-[#E5FFDB] border-l-4 border-[#109C3D] p-5 rounded-lg">
                        <h3 className="text-base font-bold text-[#063A41] mb-2 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Additional Information
                        </h3>
                        <p className="text-sm text-[#063A41] mb-3">
                            {info || "No additional details provided."}
                        </p>
                        <p className="text-sm text-gray-700">
                            <strong>Note:</strong> {isUrgent
                                ? "A 20% urgent fee has been added for priority matching."
                                : "Task will be scheduled as per selected time."
                            } By posting, you agree to receive quotes from taskers and our platform terms.
                        </p>
                    </div>

                    {/* Fee Summary Note */}
                    <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-xs text-blue-700 flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">ℹ️</span>
                            <span>
                                <strong>How fees work:</strong> You pay the task amount plus 10% platform fee, $5 reservation fee, and 13% HST.
                            </span>
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 text-[#063A41] font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="flex-1 bg-[#109C3D] px-6 py-3 rounded-lg font-bold text-white hover:bg-[#0d8332] transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                <>
                                    Post Task - ${totalClientPays.toFixed(2)}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskConfirmationModal;