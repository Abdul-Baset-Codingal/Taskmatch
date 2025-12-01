// /* eslint-disable @typescript-eslint/ban-ts-comment */
// // @ts-nocheck
// import React from "react";
// import { RootState } from "@/app/store";
// import { useCheckPaymentMethodQuery } from "@/features/api/taskApi";

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
//     const { data: paymentMethod, isLoading: checkingPayment } = useCheckPaymentMethodQuery();

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

//                     {/* Payment Method Status */}
//                     <div className="mb-6">
//                         <h3 className="text-lg font-bold text-[#063A41] mb-4 flex items-center gap-2">
//                             <svg className="w-5 h-5 text-[#109C3D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
//                             </svg>
//                             Payment Method
//                         </h3>
//                         <div className={`p-4 rounded-lg border-2 ${paymentMethod?.hasPaymentMethod
//                                 ? 'bg-green-50 border-green-200'
//                                 : 'bg-yellow-50 border-yellow-200'
//                             }`}>
//                             {checkingPayment ? (
//                                 <div className="flex items-center gap-3">
//                                     <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#109C3D]"></div>
//                                     <p className="text-[#063A41]">Checking payment method...</p>
//                                 </div>
//                             ) : paymentMethod?.hasPaymentMethod ? (
//                                 <div className="flex items-center gap-3">
//                                     <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
//                                         <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
//                                             <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                                         </svg>
//                                     </div>
//                                     <div>
//                                         <p className="text-green-700 font-medium">Payment method saved</p>
//                                         <p className="text-sm text-green-600">Your card will be authorized when a tasker accepts this task</p>
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <div className="flex items-center gap-3">
//                                     <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
//                                         <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
//                                             <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                                         </svg>
//                                     </div>
//                                     <div>
//                                         <p className="text-yellow-700 font-medium">Payment method required</p>
//                                         <p className="text-sm text-yellow-600">You need to add a payment method before posting tasks</p>
//                                     </div>
//                                 </div>
//                             )}
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
//                                     <p className="text-[#063A41]">Service Fee (8%)</p>
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

//                     {/* Payment Authorization Notice */}
//                     {paymentMethod?.hasPaymentMethod && (
//                         <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
//                             <div className="flex items-start gap-3">
//                                 <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//                                 </svg>
//                                 <div>
//                                     <p className="text-blue-800 font-medium mb-1">Payment Authorization</p>
//                                     <p className="text-blue-700 text-sm">
//                                         Your card will be authorized for <strong>${total}</strong> when a tasker accepts this task.
//                                         The actual charge will only occur after you approve the completed work.
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

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

//                     <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
//                         <p className="text-[#063A41] font-medium text-center">
//                             Ready to post? Qualified taskers will review your task and send you their best quotes.
//                         </p>
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="flex gap-4">
//                         <button
//                             onClick={onClose}
//                             className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 text-[#063A41] font-semibold hover:bg-gray-50 transition-colors"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             onClick={onConfirm}
//                             disabled={isLoading || !paymentMethod?.hasPaymentMethod}
//                             className="flex-1 bg-[#109C3D] px-6 py-3 rounded-lg font-bold text-white hover:bg-[#0d8332] transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             {isLoading ? (
//                                 <span className="flex items-center justify-center gap-2">
//                                     <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
//                                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                                     </svg>
//                                     Posting...
//                                 </span>
//                             ) : !paymentMethod?.hasPaymentMethod ? (
//                                 "Add Payment Method First"
//                             ) : (
//                                 "Confirm & Post Task"
//                             )}
//                         </button>
//                     </div>

//                     {/* Payment Method Required Warning */}
//                     {!paymentMethod?.hasPaymentMethod && !checkingPayment && (
//                         <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//                             <p className="text-red-700 text-sm text-center">
//                                 You must add a payment method before posting tasks.
//                                 Please go back and set up your payment method.
//                             </p>
//                         </div>
//                     )}
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
    const urgentFee = isUrgent ? (budget * 0.20).toFixed(2) : "0.00";
    const subtotal = isUrgent ? (budget + parseFloat(urgentFee)).toFixed(2) : budget.toFixed(2);
    const serviceFee = (parseFloat(subtotal) * 0.08).toFixed(2);
    const tax = (parseFloat(subtotal) * 0.13).toFixed(2);
    const total = (parseFloat(subtotal) + parseFloat(serviceFee) + parseFloat(tax)).toFixed(2);

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
                                        {timing} {isUrgent && '(+20% fee)'}
                                    </p>
                                </div>
                            </div>

                            {/* Budget */}
                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <span className="text-2xl">💰</span>
                                <div className="flex-1">
                                    <p className="font-semibold text-[#063A41]">Your Budget</p>
                                    <p className="text-[#109C3D] font-bold text-lg">${price || "Not specified"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method Status - ALWAYS SHOW PAYMENT REQUIRED */}
                    {/* <div className="mb-6">
                        <h3 className="text-lg font-bold text-[#063A41] mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#109C3D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            Payment Method
                        </h3>
                        <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-yellow-700 font-medium">Payment Required</p>
                                    <p className="text-sm text-yellow-600">You'll need to enter your card details in the next step</p>
                                </div>
                            </div>
                        </div>
                    </div> */}

                    {/* Cost Breakdown */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-[#063A41] mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#109C3D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Cost Breakdown
                        </h3>
                        <div className="bg-gradient-to-br from-[#E5FFDB] to-white p-6 rounded-xl border-2 border-[#109C3D]/20 shadow-sm">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <p className="text-[#063A41]">Task Budget</p>
                                    <p className="text-[#063A41] font-semibold">${price}</p>
                                </div>
                                {isUrgent && (
                                    <div className="flex justify-between items-center text-red-600">
                                        <p className="text-red-600 font-semibold">Urgent Fee (20%)</p>
                                        <p className="text-red-600 font-semibold">+${urgentFee}</p>
                                    </div>
                                )}
                                <div className="flex justify-between items-center">
                                    <p className="text-[#063A41]">Service Fee (8%)</p>
                                    <p className="text-[#063A41] font-semibold">${serviceFee}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-[#063A41]">Tax (HST 13%)</p>
                                    <p className="text-[#063A41] font-semibold">${tax}</p>
                                </div>
                                <div className="flex justify-between items-center border-t-2 border-[#109C3D] pt-3 mt-3">
                                    <p className="font-bold text-[#063A41] text-lg">Total Amount</p>
                                    <p className="text-[#109C3D] font-bold text-xl">${total}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Notice */}
                    {/* <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <p className="text-blue-800 font-medium mb-1">Payment Required</p>
                                <p className="text-blue-700 text-sm">
                                    You'll need to enter your credit card details in the next step.
                                    Your card will be authorized for <strong>${total}</strong> when a tasker accepts this task.
                                </p>
                            </div>
                        </div>
                    </div> */}

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
                            <strong>Note:</strong> {timing === "Urgent" ? "A 20% extra fee applies for urgent tasks." : "Task will be scheduled as per selected time."} By posting, you agree to receive quotes from taskers and our platform terms.
                        </p>
                    </div>

                    {/* <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                        <p className="text-[#063A41] font-medium text-center">
                            Ready to post? You'll enter your payment details in the next step.
                        </p>
                    </div> */}

                    {/* Action Buttons */}
                    {/* In TaskConfirmationModal.tsx - Action Buttons section */}
                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 text-[#063A41] font-semibold hover:bg-gray-50 transition-colors"
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
                                "Post Task"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskConfirmationModal;