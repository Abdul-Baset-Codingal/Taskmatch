/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import AcceptBidPaymentForm from './AcceptBidPaymentFormContent';
import { toast } from "react-toastify";

interface AcceptBidPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (paymentMethodId: string) => void;
    bidAmount: number;
    taskTitle: string;
    taskerName: string;
    taskId: string;
    taskerId: string;
}

const AcceptBidPaymentModal: React.FC<AcceptBidPaymentModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    bidAmount,
    taskTitle,
    taskerName,
    taskId,
    taskerId
}) => {
    const [paymentCompleted, setPaymentCompleted] = useState(false);
    const [paymentMethodId, setPaymentMethodId] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setPaymentCompleted(false);
            setPaymentMethodId('');
            document.body.style.overflow = 'hidden';
            toast.info('💳 Please set up your payment method to accept this bid');
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handlePaymentSuccess = (methodId: string) => {
        setPaymentCompleted(true);
        setPaymentMethodId(methodId);
        toast.success('Payment method saved! Completing bid acceptance...');
        setTimeout(() => {
            onSuccess(methodId);
            toast.success('Bid accepted successfully! The tasker has been notified.');
        }, 2000);
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
            toast.info('Bid acceptance cancelled');
        }
    };

    if (!mounted) return null;

    const modalContent = (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto my-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-[#063A41]">
                            {paymentCompleted ? 'Payment Method Saved' : 'Secure Payment Setup'}
                        </h2>
                        {!paymentCompleted && (
                            <button
                                onClick={() => {
                                    onClose();
                                    toast.info('Bid acceptance cancelled');
                                }}
                                className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
                            >
                                ×
                            </button>
                        )}
                    </div>

                    {/* Bid & Task Details */}
                    <div className="mb-6 space-y-3">
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-600 mb-1">Task:</p>
                            <p className="font-semibold text-gray-900">{taskTitle}</p>
                        </div>

                        <div className="p-4 bg-green-50 rounded-lg">
                            <p className="text-sm text-green-600 mb-1">Tasker:</p>
                            <p className="font-semibold text-gray-900">{taskerName}</p>
                        </div>

                        <div className="p-4 bg-purple-50 rounded-lg">
                            <p className="text-sm text-purple-600 mb-1">Bid Amount:</p>
                            <p className="text-2xl font-bold text-[#109C3D]">${bidAmount}</p>
                        </div>
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
                                            Payment Method Saved Successfully!
                                        </p>
                                        <p className="text-sm text-green-600 mt-1">
                                            Your payment method has been securely saved for this transaction.
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
                            bidAmount={bidAmount}
                            taskId={taskId}
                            taskerId={taskerId}
                        />
                    )}
                </div>
            </div>
        </div>
    );

    return isOpen ? createPortal(modalContent, document.body) : null;
};

export default AcceptBidPaymentModal;