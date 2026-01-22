

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { createPortal } from 'react-dom';
// import AcceptBidPaymentForm from './AcceptBidPaymentFormContent';
// import { toast } from "react-toastify";

// interface CustomerInfo {
//     id: string;
//     name: string;
//     email: string;
//     phone?: string;
// }

// interface AcceptBidPaymentModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onSuccess: (paymentMethodId: string) => Promise<void>;
//     bidAmount: number;
//     taskTitle: string;
//     taskerName: string;
//     taskId: string;
//     taskerId: string;
//     customerInfo?: CustomerInfo;
// }

// // Fee calculation constants (DOUBLE-SIDED)
// const PLATFORM_FEE_PERCENT = 0.15; // 15%
// const TAX_PERCENT = 0.13; // 13% HST

// const calculateFees = (bidAmount: number) => {
//     // Client-side fee (15% added on top)
//     const clientPlatformFee = Math.round(bidAmount * PLATFORM_FEE_PERCENT * 100) / 100;
//     const taxOnClientFee = Math.round(clientPlatformFee * TAX_PERCENT * 100) / 100;
//     const totalClientPays = Math.round((bidAmount + clientPlatformFee + taxOnClientFee) * 100) / 100;

//     // Tasker-side fee (15% deducted)
//     const taskerPlatformFee = Math.round(bidAmount * PLATFORM_FEE_PERCENT * 100) / 100;
//     const taskerReceives = Math.round((bidAmount - taskerPlatformFee) * 100) / 100;

//     // Platform total
//     const platformTotal = Math.round((clientPlatformFee + taxOnClientFee + taskerPlatformFee) * 100) / 100;

//     return {
//         bidAmount,
//         clientPlatformFee,
//         taxOnClientFee,
//         totalClientPays,
//         taskerPlatformFee,
//         taskerReceives,
//         platformTotal
//     };
// };

// const AcceptBidPaymentModal: React.FC<AcceptBidPaymentModalProps> = ({
//     isOpen,
//     onClose,
//     onSuccess,
//     bidAmount,
//     taskTitle,
//     taskerName,
//     taskId,
//     taskerId,
//     customerInfo
// }) => {
//     const [paymentCompleted, setPaymentCompleted] = useState(false);
//     const [mounted, setMounted] = useState(false);
//     const [isProcessing, setIsProcessing] = useState(false);

//     // Calculate fees
//     const fees = calculateFees(bidAmount);

//     useEffect(() => {
//         setMounted(true);
//         return () => setMounted(false);
//     }, []);

//     useEffect(() => {
//         if (isOpen) {
//             setPaymentCompleted(false);
//             setIsProcessing(false);
//             document.body.style.overflow = 'hidden';
//         } else {
//             document.body.style.overflow = 'unset';
//         }

//         return () => {
//             document.body.style.overflow = 'unset';
//         };
//     }, [isOpen]);

//     const handlePaymentSuccess = async (paymentMethodId: string) => {
//         setPaymentCompleted(true);
//         setIsProcessing(true);
//         toast.success('Payment method saved! Completing bid acceptance...');

//         try {
//             await onSuccess(paymentMethodId);
//         } catch (error: any) {
//             console.error('Error accepting bid:', error);
//             setPaymentCompleted(false);
//             setIsProcessing(false);
//             toast.error(error.message || 'Failed to accept bid. Please try again.');
//         }
//     };

//     const handleBackdropClick = (e: React.MouseEvent) => {
//         if (e.target === e.currentTarget && !isProcessing) {
//             onClose();
//         }
//     };

//     if (!mounted) return null;

//     const modalContent = (
//         <div
//             className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
//             onClick={handleBackdropClick}
//         >
//             <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto my-auto max-h-[90vh] overflow-y-auto">
//                 <div className="p-6">
//                     {/* Header */}
//                     <div className="flex justify-between items-center mb-4">
//                         <h2 className="text-2xl font-bold text-[#063A41]">
//                             {paymentCompleted ? 'Processing...' : 'Accept Bid & Pay'}
//                         </h2>
//                         {!paymentCompleted && (
//                             <button
//                                 onClick={onClose}
//                                 className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
//                             >
//                                 ×
//                             </button>
//                         )}
//                     </div>

//                     {/* Task & Tasker Info */}
//                     <div className="mb-4 space-y-2">
//                         <div className="p-3 bg-blue-50 rounded-lg">
//                             <p className="text-xs text-blue-600 mb-1">Task:</p>
//                             <p className="font-semibold text-gray-900 text-sm">{taskTitle}</p>
//                         </div>

//                         <div className="p-3 bg-green-50 rounded-lg">
//                             <p className="text-xs text-green-600 mb-1">Tasker:</p>
//                             <p className="font-semibold text-gray-900 text-sm">{taskerName}</p>
//                         </div>
//                     </div>

//                     {/* ⭐ DOUBLE-SIDED FEE BREAKDOWN */}
//                     <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
//                         <h4 className="font-semibold text-gray-700 mb-3 text-sm">Payment Summary</h4>

//                         <div className="space-y-2">
//                             {/* Bid Amount */}
//                             <div className="flex justify-between text-sm">
//                                 <span className="text-gray-600">Bid Amount:</span>
//                                 <span className="font-medium text-gray-900">${fees.bidAmount.toFixed(2)}</span>
//                             </div>

//                             {/* Your Fees Section */}
//                             <div className="pt-2 border-t border-gray-200">
//                                 <p className="text-xs text-gray-500 mb-1">Your Fees:</p>

//                                 <div className="flex justify-between text-sm">
//                                     <span className="text-gray-600 pl-2">Platform Fee (15%):</span>
//                                     <span className="font-medium text-gray-900">+ ${fees.clientPlatformFee.toFixed(2)}</span>
//                                 </div>

//                                 <div className="flex justify-between text-sm">
//                                     <span className="text-gray-600 pl-2">HST (13% on fee):</span>
//                                     <span className="font-medium text-gray-900">+ ${fees.taxOnClientFee.toFixed(2)}</span>
//                                 </div>
//                             </div>

//                             {/* Total Client Pays */}
//                             <div className="border-t border-gray-300 pt-3 mt-3">
//                                 <div className="flex justify-between items-center">
//                                     <span className="font-bold text-gray-900">You Pay:</span>
//                                     <span className="text-2xl font-bold text-[#E53935]">
//                                         ${fees.totalClientPays.toFixed(2)}
//                                     </span>
//                                 </div>
//                             </div>

//                         </div>

//                         <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
//                             <span>🔒</span>
//                             <span>This amount will be held securely until task completion</span>
//                         </p>
//                     </div>

//                     {paymentCompleted ? (
//                         <div className="space-y-4">
//                             <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
//                                 <div className="flex items-center gap-3">
//                                     <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
//                                         <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
//                                             <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                                         </svg>
//                                     </div>
//                                     <div>
//                                         <p className="text-green-700 font-medium">
//                                             Payment Authorized!
//                                         </p>
//                                         <p className="text-sm text-green-600 mt-1">
//                                             ${fees.totalClientPays.toFixed(2)} has been held
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="text-center py-4">
//                                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#109C3D] mx-auto"></div>
//                                 <p className="text-sm text-gray-600 mt-2">Completing bid acceptance...</p>
//                             </div>
//                         </div>
//                     ) : (
//                         <AcceptBidPaymentForm
//                             onSuccess={handlePaymentSuccess}
//                             onError={(error) => {
//                                 console.error('Payment setup error:', error);
//                                 toast.error(`❌ ${error}`);
//                             }}
//                             bidAmount={fees.bidAmount}
//                             totalAmount={fees.totalClientPays}
//                             taskId={taskId}
//                             taskerId={taskerId}
//                             customerInfo={customerInfo}
//                         />
//                     )}
//                 </div>
//             </div>
//         </div>
//     );

//     return isOpen ? createPortal(modalContent, document.body) : null;
// };

// export default AcceptBidPaymentModal;


'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import AcceptBidPaymentForm from './AcceptBidPaymentFormContent';
import { toast } from "react-toastify";

interface CustomerInfo {
    id: string;
    name: string;
    email: string;
    phone?: string;
}

interface AcceptBidPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (paymentMethodId: string) => Promise<void>;
    bidAmount: number;
    taskTitle: string;
    taskerName: string;
    taskId: string;
    taskerId: string;
    customerInfo?: CustomerInfo;
}

// ⭐ DOUBLE-SIDED FEE CONSTANTS
// Client Side
const CLIENT_PLATFORM_FEE_PERCENT = 0.10; // 10%
const RESERVATION_FEE = 5;                 // $5 flat
const CLIENT_TAX_PERCENT = 0.13;           // 13% HST

// Tasker Side
const TASKER_PLATFORM_FEE_PERCENT = 0.12; // 12%
const TASKER_TAX_PERCENT = 0.13;           // 13% tax

const calculateFees = (bidAmount: number) => {
    // ─── CLIENT SIDE ───
    const clientPlatformFee = Math.round(bidAmount * CLIENT_PLATFORM_FEE_PERCENT * 100) / 100;
    const reservationFee = RESERVATION_FEE;
    const clientTax = Math.round(bidAmount * CLIENT_TAX_PERCENT * 100) / 100;
    const totalClientPays = Math.round((bidAmount + clientPlatformFee + reservationFee + clientTax) * 100) / 100;

    // ─── TASKER SIDE ───
    const taskerPlatformFee = Math.round(bidAmount * TASKER_PLATFORM_FEE_PERCENT * 100) / 100;
    const taskerTax = Math.round(bidAmount * TASKER_TAX_PERCENT * 100) / 100;
    const totalTaskerDeductions = Math.round((taskerPlatformFee + taskerTax) * 100) / 100;
    const taskerReceives = Math.round((bidAmount - totalTaskerDeductions) * 100) / 100;

    // ─── PLATFORM ───
    const platformTotal = Math.round((totalClientPays - taskerReceives) * 100) / 100;

    return {
        bidAmount,
        // Client
        clientPlatformFee,
        reservationFee,
        clientTax,
        totalClientPays,
        // Tasker
        taskerPlatformFee,
        taskerTax,
        totalTaskerDeductions,
        taskerReceives,
        // Platform
        platformTotal
    };
};

const AcceptBidPaymentModal: React.FC<AcceptBidPaymentModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    bidAmount,
    taskTitle,
    taskerName,
    taskId,
    taskerId,
    customerInfo
}) => {
    const [paymentCompleted, setPaymentCompleted] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Calculate fees
    const fees = calculateFees(bidAmount);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setPaymentCompleted(false);
            setIsProcessing(false);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handlePaymentSuccess = async (paymentMethodId: string) => {
        setPaymentCompleted(true);
        setIsProcessing(true);
        toast.success('Payment method saved! Completing bid acceptance...');

        try {
            await onSuccess(paymentMethodId);
        } catch (error: any) {
            console.error('Error accepting bid:', error);
            setPaymentCompleted(false);
            setIsProcessing(false);
            toast.error(error.message || 'Failed to accept bid. Please try again.');
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && !isProcessing) {
            onClose();
        }
    };

    if (!mounted) return null;

    const modalContent = (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto my-auto max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-[#063A41]">
                            {paymentCompleted ? 'Processing...' : 'Accept Bid & Pay'}
                        </h2>
                        {!paymentCompleted && (
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
                            >
                                ×
                            </button>
                        )}
                    </div>

                    {/* Task & Tasker Info */}
                    <div className="mb-4 space-y-2">
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-xs text-blue-600 mb-1">Task:</p>
                            <p className="font-semibold text-gray-900 text-sm">{taskTitle}</p>
                        </div>

                        <div className="p-3 bg-green-50 rounded-lg">
                            <p className="text-xs text-green-600 mb-1">Tasker:</p>
                            <p className="font-semibold text-gray-900 text-sm">{taskerName}</p>
                        </div>
                    </div>

                    {/* ⭐ DOUBLE-SIDED FEE BREAKDOWN */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <h4 className="font-semibold text-gray-700 mb-3 text-sm">Payment Summary</h4>

                        <div className="space-y-2">
                            {/* Bid Amount */}
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Task Price:</span>
                                <span className="font-medium text-gray-900">${fees.bidAmount.toFixed(2)}</span>
                            </div>

                            {/* Client Fees Section */}
                            <div className="pt-2 border-t border-gray-200">
                                <p className="text-xs text-gray-500 mb-1">Your Fees:</p>

                                {/* Platform Fee (10%) */}
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 pl-2">Platform Fee:</span>
                                    <span className="font-medium text-gray-900">+ ${fees.clientPlatformFee.toFixed(2)}</span>
                                </div>

                                {/* Reservation Fee ($5) */}
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 pl-2">Reservation Fee:</span>
                                    <span className="font-medium text-gray-900">+ ${fees.reservationFee.toFixed(2)}</span>
                                </div>

                                {/* HST (13%) */}
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 pl-2">HST (13%):</span>
                                    <span className="font-medium text-gray-900">+ ${fees.clientTax.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Total Client Pays */}
                            <div className="border-t-2 border-gray-300 pt-3 mt-3">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-900">You Pay:</span>
                                    <span className="text-2xl font-bold text-[#E53935]">
                                        ${fees.totalClientPays.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                          
                        </div>

                        <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                            <span>🔒</span>
                            <span>Amount held securely until task completion</span>
                        </p>
                    </div>

                    {paymentCompleted ? (
                        <div className="space-y-4">
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-green-700 font-medium">
                                            Payment Authorized!
                                        </p>
                                        <p className="text-sm text-green-600 mt-1">
                                            ${fees.totalClientPays.toFixed(2)} has been held
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center py-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#109C3D] mx-auto"></div>
                                <p className="text-sm text-gray-600 mt-2">Completing bid acceptance...</p>
                            </div>
                        </div>
                    ) : (
                        <AcceptBidPaymentForm
                            onSuccess={handlePaymentSuccess}
                            onError={(error) => {
                                console.error('Payment setup error:', error);
                                toast.error(`❌ ${error}`);
                            }}
                            bidAmount={fees.bidAmount}
                            totalAmount={fees.totalClientPays}
                            taskId={taskId}
                            taskerId={taskerId}
                            customerInfo={customerInfo}
                        />
                    )}
                </div>
            </div>
        </div>
    );

    return isOpen ? createPortal(modalContent, document.body) : null;
};

export default AcceptBidPaymentModal;