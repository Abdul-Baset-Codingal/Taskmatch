// components/BidConfirmationModal.tsx
"use client";
import React, { useMemo } from "react";
import { createPortal } from "react-dom";
import {
    FiX,
    FiDollarSign,
    FiPercent,
    FiCheckCircle,
    FiAlertCircle,
    FiArrowRight,
    FiInfo,
} from "react-icons/fi";
import { MdOutlineAccountBalance } from "react-icons/md";

interface BidConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    bidAmount: number;
    taskTitle: string;
    isLoading?: boolean;
}

// Fee configuration - easy to update
const FEE_CONFIG = {
    PLATFORM_FEE: 0.15,    // 8% platform fee
    PLATFORM_LABEL: "Platform Fee",
};

const BidConfirmationModal: React.FC<BidConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    bidAmount,
    taskTitle,
    isLoading = false,
}) => {
    // Calculate all the amounts
    const calculations = useMemo(() => {
        const grossAmount = bidAmount;
        const platformFee = grossAmount * FEE_CONFIG.PLATFORM_FEE;
        const totalDeductions = platformFee;
        const netEarnings = grossAmount - totalDeductions;
        const totalDeductionPercent = FEE_CONFIG.PLATFORM_FEE * 100;

        return {
            grossAmount,
            platformFee,
            totalDeductions,
            netEarnings,
            totalDeductionPercent,
            platformPercent: FEE_CONFIG.PLATFORM_FEE * 100,
        };
    }, [bidAmount]);

    if (!isOpen) return null;

    const modalContent = (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-br from-[#063A41] to-[#0a5a63] px-6 py-5 relative overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />

                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                                <FiDollarSign className="text-white" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">
                                    Confirm Your Bid
                                </h3>
                                <p className="text-white/70 text-sm mt-0.5">
                                    Review your earnings breakdown
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        >
                            <FiX className="text-white" size={20} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6">
                    {/* Task Title */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            Task
                        </p>
                        <p className="text-[#063A41] font-semibold text-sm line-clamp-2">
                            {taskTitle}
                        </p>
                    </div>

                    {/* Earnings Breakdown */}
                    <div className="space-y-4">
                        {/* Your Bid */}
                        <div className="flex items-center justify-between p-4 bg-[#E5FFDB]/50 rounded-2xl border border-[#109C3D]/20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#109C3D]/20 flex items-center justify-center">
                                    <FiDollarSign className="text-[#109C3D]" size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold text-[#063A41]">Your Bid Amount</p>
                                    <p className="text-xs text-gray-500">Gross amount</p>
                                </div>
                            </div>
                            <span className="text-xl font-bold text-[#063A41]">
                                ${calculations.grossAmount.toFixed(2)}
                            </span>
                        </div>

                        {/* Deductions Section */}
                        <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                            <div className="flex items-center gap-2 mb-2">
                                <FiAlertCircle className="text-gray-400" size={16} />
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    Deductions
                                </span>
                            </div>

                            {/* Platform Fee */}
                            <div className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                        <MdOutlineAccountBalance className="text-purple-500" size={14} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-700 text-sm">
                                            {FEE_CONFIG.PLATFORM_LABEL}
                                        </p>

                                    </div>
                                </div>
                                <span className="font-semibold text-red-500">
                                    -${calculations.platformFee.toFixed(2)}
                                </span>
                            </div>
                        </div>



                        {/* Net Earnings */}
                        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-[#109C3D] to-[#063A41] rounded-2xl shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                                    <FiCheckCircle className="text-white" size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-white text-lg">You'll Receive</p>
                                    <p className="text-white/70 text-xs">After all deductions</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-3xl font-black text-white">
                                    ${calculations.netEarnings.toFixed(2)}
                                </span>
                                <p className="text-white/60 text-xs mt-0.5">CAD</p>
                            </div>
                        </div>
                    </div>

                    {/* Info Note */}
                    <div className="mt-5 flex items-start gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
                        <FiInfo className="text-blue-500 flex-shrink-0 mt-0.5" size={16} />
                        <p className="text-xs text-blue-700 leading-relaxed">
                            Payment will be released to your account after the client confirms
                            task completion. Funds are held securely until then.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-6 py-3.5 border-2 border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 order-2 sm:order-1"
                        >
                            Go Back
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="flex-1 px-6 py-3.5 bg-gradient-to-r from-[#109C3D] to-[#0d8a35] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#109C3D]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 order-1 sm:order-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Submitting...</span>
                                </>
                            ) : (
                                <>
                                    <span>Confirm Bid</span>
                                    <FiArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Use portal to render modal at document body level
    if (typeof window !== "undefined") {
        return createPortal(modalContent, document.body);
    }

    return null;
};

export default BidConfirmationModal;