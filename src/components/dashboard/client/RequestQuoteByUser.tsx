
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState, useEffect, useMemo } from "react";
import {
    FaClock,
    FaDollarSign,
    FaUser,
    FaCalendarAlt,
    FaTrash,
    FaMapMarkerAlt,
    FaQuoteLeft,
    FaExclamationCircle,
    FaCheckCircle,
    FaHourglass,
    FaChevronLeft,
    FaChevronRight,
    FaClipboardList,
    FaCheck,
    FaTimes,
    FaCreditCard,
    FaReply,
    FaTimesCircle,
    FaGavel,
    FaCalculator,
    FaInfoCircle,
    FaShieldAlt,
    FaReceipt,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import {
    useLazyGetRequestQuotesByClientIdQuery,
    useDeleteRequestQuoteMutation,
    useAcceptBidMutation,
    useRejectBidMutation,
} from "@/features/api/taskerApi";
import { useCreateSetupIntentMutation, useSavePaymentMethodMutation } from "@/features/api/taskApi";
import { toast } from "react-toastify";
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    useStripe,
    useElements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
} from '@stripe/react-stripe-js';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import Link from "next/link";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// ==================== FEE CONSTANTS (Same as Backend) ====================
const PLATFORM_FEE_PERCENT = 0.15;  // 15%
const TAX_PERCENT = 0.13;           // 13% HST

// ==================== INTERFACES ====================
interface User {
    _id: string;
    role: string;
}

interface FeeBreakdown {
    bidAmount: number;
    clientPlatformFee: number;
    taxOnClientFee: number;
    totalClientPays: number;
    taskerPlatformFee: number;
    taskerPayout: number;
    platformTotal: number;
}

interface Bid {
    _id: string;
    bidAmount: number;
    bidDescription: string;
    estimatedDuration: number;
    submittedAt: string;
    status: 'pending' | 'accepted' | 'rejected';
    tasker?: {
        _id: string;
        firstName: string;
        lastName: string;
    };
}

interface Tasker {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
}

interface Quote {
    _id: string;
    taskTitle: string;
    taskDescription: string;
    status: string;
    tasker: Tasker;
    client: { _id: string; firstName: string; lastName: string };
    budget: number | null;
    location: string;
    preferredDateTime: string | null;
    urgency: string;
    createdAt: string;
    bids: Bid[];
}

// ==================== UTILITY FUNCTIONS ====================

// Calculate double-sided fees (same logic as backend)
const 
calculateFees = (bidAmount: number): FeeBreakdown => {
    const bidAmountCents = Math.round(bidAmount * 100);

    // Client side: adds 15% + tax on that fee
    const clientPlatformFee = Math.round(bidAmountCents * PLATFORM_FEE_PERCENT);
    const taxOnClientFee = Math.round(clientPlatformFee * TAX_PERCENT);
    const totalClientPays = bidAmountCents + clientPlatformFee + taxOnClientFee;

    // Tasker side: deducts 15% from bid amount
    const taskerPlatformFee = Math.round(bidAmountCents * PLATFORM_FEE_PERCENT);
    const taskerPayout = bidAmountCents - taskerPlatformFee;

    // Platform keeps both fees
    const platformTotal = clientPlatformFee + taxOnClientFee + taskerPlatformFee;

    return {
        bidAmount: bidAmountCents / 100,
        clientPlatformFee: clientPlatformFee / 100,
        taxOnClientFee: taxOnClientFee / 100,
        totalClientPays: totalClientPays / 100,
        taskerPlatformFee: taskerPlatformFee / 100,
        taskerPayout: taskerPayout / 100,
        platformTotal: platformTotal / 100,
    };
};

// Format currency
const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
    }).format(amount);
};

// Format date
const formatDate = (dateString: string | number | Date): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Format date time
const formatDateTime = (dateString: string | number | Date): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

// Status mapping
const STATUS_MAP: { [key: string]: string } = {
    "All Quotes": "all",
    "Pending": "pending",
    "Bidded": "bidded",
    "Accepted": "accepted",
    "Rejected": "rejected",
    "Completed": "completed",
};

// ==================== ACCEPT BID MODAL COMPONENT ====================
// ==================== ACCEPT BID MODAL COMPONENT ====================
interface AcceptBidModalProps {
    isOpen: boolean;
    onClose: () => void;
    quote: Quote;
    bid: Bid;
    onAccept: (paymentMethodId?: string) => Promise<void>;
    isProcessing: boolean;
    needsPaymentMethod: boolean;
}

const AcceptBidModal: React.FC<AcceptBidModalProps> = ({
    isOpen,
    onClose,
    quote,
    bid,
    onAccept,
    isProcessing,
    needsPaymentMethod,
}) => {
    const fees = useMemo(() => calculateFees(bid.bidAmount), [bid.bidAmount]);
    const [localProcessing, setLocalProcessing] = useState(false);

    // Handle payment success from the form
    const handlePaymentFormSuccess = async (paymentMethodId: string) => {
        console.log('Payment form success, paymentMethodId:', paymentMethodId);
        setLocalProcessing(true);
        try {
            await onAccept(paymentMethodId);
        } finally {
            setLocalProcessing(false);
        }
    };

    if (!isOpen) return null;

    const processing = isProcessing || localProcessing;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={!processing ? onClose : undefined}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modalSlide max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#109C3D] to-[#0d8534] px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <FaCheckCircle className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Accept Bid</h3>
                                <p className="text-white/80 text-sm">Review payment details</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            disabled={processing}
                            className="text-white/70 hover:text-white transition-colors p-2 disabled:opacity-50"
                        >
                            <FaTimes className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Task Info */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Task</p>
                        <p className="font-semibold text-[#063A41] text-lg">{quote.taskTitle}</p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                            <FaUser className="w-3 h-3 text-[#109C3D]" />
                            <span>Tasker: {quote.tasker.firstName} {quote.tasker.lastName}</span>
                        </div>
                    </div>

                    {/* Bid Details */}
                    <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
                        <div className="flex items-center gap-2 mb-3">
                            <FaGavel className="w-4 h-4 text-blue-600" />
                            <span className="font-semibold text-blue-800">Bid Details</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-blue-600">Bid Amount</p>
                                <p className="text-2xl font-bold text-blue-800">{formatCurrency(bid.bidAmount)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-blue-600">Duration</p>
                                <p className="text-lg font-semibold text-blue-800">
                                    {bid.estimatedDuration} hour{bid.estimatedDuration !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                        {bid.bidDescription && (
                            <div className="mt-3 pt-3 border-t border-blue-200">
                                <p className="text-sm text-blue-700 italic">&quot;{bid.bidDescription}&quot;</p>
                            </div>
                        )}
                    </div>

                    {/* Fee Breakdown */}
                    <div className="space-y-4">
                        {/* What You Pay */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                            <div className="flex items-center gap-2 mb-3">
                                <FaReceipt className="w-4 h-4 text-amber-600" />
                                <span className="font-semibold text-amber-800">What You&apos;ll Pay</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Bid Amount</span>
                                    <span className="font-medium">{formatCurrency(fees.bidAmount)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Platform Fee </span>
                                    <span className="text-amber-600">+{formatCurrency(fees.clientPlatformFee)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">HST (13% on fee)</span>
                                    <span className="text-amber-600">+{formatCurrency(fees.taxOnClientFee)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2 border-t border-amber-300">
                                    <span className="text-amber-800">Total</span>
                                    <span className="text-amber-800">{formatCurrency(fees.totalClientPays)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Security Note */}
                        <div className="bg-blue-50 rounded-lg p-3 flex items-start gap-3 border border-blue-100">
                            <FaShieldAlt className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-blue-800">Payment Protection</p>
                                <p className="text-xs text-blue-600 mt-1">
                                    Your payment of {formatCurrency(fees.totalClientPays)} will be held securely until the task is completed.
                                    The tasker will receive {formatCurrency(fees.taskerPayout)} after completion.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form (if needed) */}
                    {needsPaymentMethod && (
                        <div className="mt-6">
                            <Elements stripe={stripePromise}>
                                <PaymentFormInModal
                                    amount={fees.totalClientPays}
                                    onPaymentSuccess={handlePaymentFormSuccess}
                                    onCancel={onClose}
                                    isProcessing={processing}
                                />
                            </Elements>
                        </div>
                    )}
                </div>

                {/* Footer Actions (if not showing payment form) */}
                {!needsPaymentMethod && (
                    <div className="px-6 py-4 bg-gray-50 border-t flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={processing}
                            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onAccept()}
                            disabled={processing}
                            className="flex-1 px-4 py-3 bg-[#109C3D] text-white font-medium rounded-xl hover:bg-[#0d8534] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {processing ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <FaCreditCard className="w-4 h-4" />
                                    Pay {formatCurrency(fees.totalClientPays)}
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes modalSlide {
                    from {
                        opacity: 0;
                        transform: translateY(-20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                .animate-modalSlide {
                    animation: modalSlide 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

// ==================== PAYMENT FORM IN MODAL ====================
const PaymentFormInModal = ({
    amount,
    onPaymentSuccess,
    onCancel,
    isProcessing: externalProcessing,
}: {
    amount: number;
    onPaymentSuccess: (paymentMethodId: string) => void;
    onCancel: () => void;
    isProcessing: boolean;
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [createSetupIntent] = useCreateSetupIntentMutation();
    const [savePaymentMethod] = useSavePaymentMethodMutation();

    // ✅ Format Canadian Postal Code (A1A 1A1)
    const formatCanadianPostalCode = (value: string): string => {
        // Remove all non-alphanumeric characters and convert to uppercase
        const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '');

        // Format as A1A 1A1
        if (cleaned.length <= 3) {
            return cleaned;
        }
        return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)}`;
    };

    const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCanadianPostalCode(e.target.value);
        if (formatted.replace(/\s/g, '').length <= 6) {
            setPostalCode(formatted);
        }
    };

    // ✅ Validate Canadian Postal Code
    const isValidCanadianPostalCode = (code: string): boolean => {
        const regex = /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i;
        return regex.test(code.replace(/\s/g, ''));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            setError('Payment system not ready. Please try again.');
            return;
        }

        if (!isValidCanadianPostalCode(postalCode)) {
            setError('Please enter a valid Canadian postal code (e.g., A1A 1A1).');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            console.log('Step 1: Creating setup intent...');
            const setupIntentResponse = await createSetupIntent().unwrap();
            const { clientSecret } = setupIntentResponse;
            console.log('Step 1 complete: Got client secret');

            const cardNumberElement = elements.getElement(CardNumberElement);
            if (!cardNumberElement) {
                throw new Error('Card element not found');
            }

            console.log('Step 2: Confirming card setup...');
            const { error: stripeError, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
                payment_method: {
                    card: cardNumberElement,
                    billing_details: {
                        address: {
                            postal_code: postalCode.replace(/\s/g, ''), // Remove space for Stripe
                            country: 'CA',
                        },
                    },
                },
            });

            if (stripeError) {
                throw new Error(stripeError.message || 'Card setup failed');
            }

            if (!setupIntent?.payment_method) {
                throw new Error('No payment method returned from Stripe');
            }

            const paymentMethodId = typeof setupIntent.payment_method === 'string'
                ? setupIntent.payment_method
                : setupIntent.payment_method.id;

            console.log('Step 2 complete: Payment method ID:', paymentMethodId);

            console.log('Step 3: Saving payment method to backend...');
            await savePaymentMethod(paymentMethodId).unwrap();
            console.log('Step 3 complete: Payment method saved');

            console.log('Step 4: Calling onPaymentSuccess with:', paymentMethodId);
            onPaymentSuccess(paymentMethodId);

        } catch (err: any) {
            console.error('Payment error:', err);
            setError(err?.data?.error || err?.data?.message || err?.message || 'Payment setup failed');
            setIsLoading(false);
        }
    };

    const processing = isLoading || externalProcessing;

    // Stripe Element Styles
    const elementStyle = {
        style: {
            base: {
                fontSize: '16px',
                color: '#063A41',
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontSmoothing: 'antialiased',
                '::placeholder': {
                    color: '#9ca3af',
                },
            },
            invalid: {
                color: '#dc2626',
                iconColor: '#dc2626',
            },
            complete: {
                color: '#109C3D',
                iconColor: '#109C3D',
            },
        },
    };

    return (
        <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center gap-2 mb-4">
                <FaCreditCard className="w-5 h-5 text-[#063A41]" />
                <span className="font-semibold text-[#063A41]">Add Payment Method</span>
            </div>

            {error && (
                <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg mb-4 text-sm">
                    <strong>Error:</strong> {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Card Number */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Card Number
                    </label>
                    <div className="px-4 py-3 border border-gray-200 rounded-xl bg-white focus-within:ring-2 focus-within:ring-[#109C3D] focus-within:border-transparent transition-all">
                        <CardNumberElement options={elementStyle} />
                    </div>
                </div>

                {/* Expiry, CVC, and Postal Code Row */}
                <div className="grid grid-cols-3 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Expiry
                        </label>
                        <div className="px-4 py-3 border border-gray-200 rounded-xl bg-white focus-within:ring-2 focus-within:ring-[#109C3D] focus-within:border-transparent transition-all">
                            <CardExpiryElement options={elementStyle} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            CVC
                        </label>
                        <div className="px-4 py-3 border border-gray-200 rounded-xl bg-white focus-within:ring-2 focus-within:ring-[#109C3D] focus-within:border-transparent transition-all">
                            <CardCvcElement options={elementStyle} />
                        </div>
                    </div>
                    <div>
                        <label className=" text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                            Postal Code
                            <span className="text-xs">🇨🇦</span>
                        </label>
                        <input
                            type="text"
                            value={postalCode}
                            onChange={handlePostalCodeChange}
                            placeholder="A1A 1A1"
                            maxLength={7}
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent uppercase text-[#063A41] transition-all ${postalCode && !isValidCanadianPostalCode(postalCode)
                                    ? 'border-red-300 bg-red-50'
                                    : postalCode && isValidCanadianPostalCode(postalCode)
                                        ? 'border-[#109C3D] bg-green-50'
                                        : 'border-gray-200 bg-white'
                                }`}
                            disabled={processing}
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
                        disabled={processing}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!stripe || processing || !isValidCanadianPostalCode(postalCode)}
                        className="flex-1 px-4 py-3 bg-[#109C3D] text-white font-medium rounded-xl hover:bg-[#0d8534] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {processing ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Processing...
                            </>
                        ) : (
                            <>
                                <FaCreditCard className="w-4 h-4" />
                                Pay {formatCurrency(amount)}
                            </>
                        )}
                    </button>
                </div>

                <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
                    <FaShieldAlt className="w-3 h-3" />
                    Secured by Stripe
                </p>
            </form>
        </div>
    );
};
// ==================== MAIN COMPONENT ====================
const RequestQuoteByUser: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string>("All Quotes");

    // Accept Bid Modal State
    const [acceptModalState, setAcceptModalState] = useState<{
        isOpen: boolean;
        quote: Quote | null;
        bid: Bid | null;
        needsPaymentMethod: boolean;
    }>({
        isOpen: false,
        quote: null,
        bid: null,
        needsPaymentMethod: false,
    });
    const [isAccepting, setIsAccepting] = useState(false);

    const [trigger, { data: quotes = [], isLoading, error }] =
        useLazyGetRequestQuotesByClientIdQuery();
    const [deleteRequestQuote, { isLoading: isDeleting }] =
        useDeleteRequestQuoteMutation();

    const [acceptBid] = useAcceptBidMutation();
    const [rejectBid] = useRejectBidMutation();

    // Status cards with correct backend statuses
    const QUOTE_STATUS = useMemo(() => {
        const statusCounts = quotes.reduce(
            (acc: { [key: string]: number }, quote: Quote) => {
                const status = quote.status || "pending";
                acc[status] = (acc[status] || 0) + 1;
                return acc;
            },
            {}
        );

        return [
            { label: "All Quotes", count: quotes.length, icon: FaClipboardList, color: "bg-[#063A41]" },
            { label: "Pending", count: statusCounts["pending"] || 0, icon: FaHourglass, color: "bg-amber-500" },
            { label: "Bidded", count: statusCounts["bidded"] || 0, icon: FaGavel, color: "bg-blue-500" },
            { label: "Accepted", count: statusCounts["accepted"] || 0, icon: FaCheckCircle, color: "bg-[#109C3D]" },
            { label: "Rejected", count: statusCounts["rejected"] || 0, icon: FaTimesCircle, color: "bg-red-500" },
            { label: "Completed", count: statusCounts["completed"] || 0, icon: FaCheck, color: "bg-purple-500" },
        ];
    }, [quotes]);

    // Filter quotes based on selected status
    const filteredQuotes = useMemo(() => {
        if (selectedStatus === "All Quotes") {
            return quotes;
        }
        const statusValue = STATUS_MAP[selectedStatus];
        return quotes.filter((quote: Quote) => quote.status === statusValue);
    }, [quotes, selectedStatus]);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/auth/verify-token`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setIsLoggedIn(true);
                    setUser({ _id: data.user._id, role: data.user.role });
                    trigger(data.user._id);
                } else {
                    setIsLoggedIn(false);
                    setUser(null);
                }
            } catch (error) {
                console.error("Error checking login status:", error);
                setIsLoggedIn(false);
                setUser(null);
            }
        };

        checkLoginStatus();
    }, [trigger]);

    // Open Accept Bid Modal
    const handleOpenAcceptModal = (quote: Quote, bid: Bid) => {
        setAcceptModalState({
            isOpen: true,
            quote,
            bid,
            needsPaymentMethod: false,
        });
    };

    // Close Accept Bid Modal
    const handleCloseAcceptModal = () => {
        if (!isAccepting) {
            setAcceptModalState({
                isOpen: false,
                quote: null,
                bid: null,
                needsPaymentMethod: false,
            });
        }
    };

    // Handle Accept Bid
    // Handle Accept Bid
    const handleAcceptBid = async (paymentMethodId?: string) => {
        if (!acceptModalState.quote || !acceptModalState.bid) return;

        console.log('=== handleAcceptBid called ===');
        console.log('paymentMethodId:', paymentMethodId);
        console.log('Quote ID:', acceptModalState.quote._id);
        console.log('Bid ID:', acceptModalState.bid._id);

        setIsAccepting(true);

        try {
            const payload: any = {
                quoteId: acceptModalState.quote._id,
                bidId: acceptModalState.bid._id,
            };

            // ✅ KEY FIX: Include paymentMethodId if provided
            if (paymentMethodId) {
                payload.paymentMethodId = paymentMethodId;
            }

            console.log('Sending acceptBid with payload:', payload);

            const result = await acceptBid(payload).unwrap();

            console.log('acceptBid result:', result);

            const fees = calculateFees(acceptModalState.bid.bidAmount);
            toast.success(
                `🎉 Bid accepted! Total charged: ${formatCurrency(fees.totalClientPays)}`,
                { autoClose: 5000 }
            );

            // Close modal and refresh
            setAcceptModalState({
                isOpen: false,
                quote: null,
                bid: null,
                needsPaymentMethod: false,
            });

            if (user?._id) trigger(user._id);

        } catch (err: any) {
            console.error('Accept bid error:', err);

            if (err?.data?.code === 'NO_PAYMENT_METHOD') {
                // Show payment form
                console.log('No payment method, showing payment form');
                setAcceptModalState(prev => ({
                    ...prev,
                    needsPaymentMethod: true,
                }));
            } else {
                toast.error(err?.data?.message || 'Failed to accept bid');
            }
        } finally {
            setIsAccepting(false);
        }
    };

    // Handle Reject Bid
    const handleRejectBid = async (quoteId: string, bidId: string) => {
        if (!confirm('Are you sure you want to reject this bid?')) return;

        try {
            await rejectBid({ quoteId, bidId }).unwrap();
            if (user?._id) trigger(user._id);
            toast.success('Bid rejected');
        } catch (err: any) {
            toast.error(`Failed to reject bid: ${err?.data?.message || "Unknown error"}`);
        }
    };

    // Handle Delete
    const handleDeleteClick = (id: string) => {
        setSelectedQuoteId(id);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedQuoteId) return;

        try {
            await deleteRequestQuote(selectedQuoteId).unwrap();
            setDeleteModalOpen(false);
            setSelectedQuoteId(null);
            if (user?._id) trigger(user._id);
            toast.success('Quote deleted');
        } catch (err: any) {
            toast.error(`Failed to delete: ${err?.data?.message || "Unknown error"}`);
        }
    };

    // Get status config
    const getStatusConfig = (status: string) => {
        const configs: { [key: string]: { bg: string; text: string; icon: React.ReactNode; label: string } } = {
            pending: { bg: "bg-amber-50", text: "text-amber-700", icon: <FaHourglass className="text-amber-500" />, label: "Pending" },
            bidded: { bg: "bg-blue-50", text: "text-blue-700", icon: <FaGavel className="text-blue-500" />, label: "Bidded" },
            accepted: { bg: "bg-[#E5FFDB]", text: "text-[#109C3D]", icon: <FaCheckCircle className="text-[#109C3D]" />, label: "Accepted" },
            rejected: { bg: "bg-red-50", text: "text-red-700", icon: <FaTimesCircle className="text-red-500" />, label: "Rejected" },
            completed: { bg: "bg-purple-50", text: "text-purple-700", icon: <FaCheck className="text-purple-500" />, label: "Completed" },
        };
        return configs[status] || configs.pending;
    };

    // Get urgency config
    const getUrgencyConfig = (urgency: string) => {
        const lower = urgency?.toLowerCase() || '';
        if (lower.includes('urgent') || lower.includes('high') || lower.includes('as soon as possible')) {
            return { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" };
        }
        if (lower.includes('medium') || lower.includes('within a week')) {
            return { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" };
        }
        return { bg: "bg-[#E5FFDB]", text: "text-[#063A41]", dot: "bg-[#109C3D]" };
    };

    // Get accepted bid from a quote
    const getAcceptedBid = (quote: Quote): Bid | null => {
        if (!quote.bids || quote.bids.length === 0) return null;
        return quote.bids.find(bid => bid.status === 'accepted') || null;
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-3 border-[#E5FFDB] border-t-[#109C3D] rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading your quotes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8">
            {/* Accept Bid Modal */}
            {acceptModalState.isOpen && acceptModalState.quote && acceptModalState.bid && (
                <AcceptBidModal
                    isOpen={acceptModalState.isOpen}
                    onClose={handleCloseAcceptModal}
                    quote={acceptModalState.quote}
                    bid={acceptModalState.bid}
                    onAccept={handleAcceptBid}
                    isProcessing={isAccepting}
                    needsPaymentMethod={acceptModalState.needsPaymentMethod}
                />
            )}

            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#063A41] flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#E5FFDB] rounded-xl flex items-center justify-center">
                                <FaQuoteLeft className="text-[#109C3D]" />
                            </div>
                            My Quote Requests
                        </h2>
                        <p className="text-gray-500 mt-1 text-sm sm:text-base">
                            Track and manage your sent quote requests
                        </p>
                    </div>
                </div>
            </div>

            {/* Status Filter Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                    {QUOTE_STATUS.map(({ label, count, icon: Icon, color }) => (
                        <button
                            key={label}
                            onClick={() => setSelectedStatus(label)}
                            className={`relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm border-2 transition-all duration-200 hover:shadow-md ${selectedStatus === label
                                ? "border-[#109C3D] shadow-md"
                                : "border-transparent hover:border-gray-200"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                    <Icon className="text-white text-lg sm:text-xl" />
                                </div>
                                <div className="text-left min-w-0">
                                    <p className="text-xs text-gray-500 truncate">{label}</p>
                                    <p className="text-xl sm:text-2xl font-bold text-[#063A41]">{count}</p>
                                </div>
                            </div>
                            {selectedStatus === label && (
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#109C3D] rounded-t-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Empty State */}
            {filteredQuotes.length === 0 && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                        <div className="w-20 h-20 bg-[#E5FFDB] rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaQuoteLeft className="text-[#109C3D] text-3xl" />
                        </div>
                        <h3 className="text-xl font-bold text-[#063A41] mb-2">
                            {selectedStatus === "All Quotes"
                                ? "No Quote Requests Yet"
                                : `No ${selectedStatus} Quotes`}
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {selectedStatus === "All Quotes"
                                ? "Start by requesting quotes from taskers for your tasks."
                                : `You don't have any ${selectedStatus.toLowerCase()} quote requests at the moment.`}
                        </p>
                        {selectedStatus !== "All Quotes" && (
                            <button
                                onClick={() => setSelectedStatus("All Quotes")}
                                className="px-6 py-2.5 bg-[#109C3D] text-white font-medium rounded-xl hover:bg-[#0d8534] transition-colors"
                            >
                                View All Quotes
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Swiper Container */}
            {filteredQuotes.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-[#063A41] hover:bg-[#E5FFDB] hover:text-[#109C3D] transition-all  lg:flex">
                        <FaChevronLeft className="text-sm" />
                    </button>
                    <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-[#063A41] hover:bg-[#E5FFDB] hover:text-[#109C3D] transition-all  lg:flex">
                        <FaChevronRight className="text-sm" />
                    </button>

                    {/* Results count */}
                    <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Showing <span className="font-semibold text-[#063A41]">{filteredQuotes.length}</span> {selectedStatus === "All Quotes" ? "quote" : selectedStatus.toLowerCase() + " quote"}{filteredQuotes.length !== 1 ? "s" : ""}
                        </p>
                    </div>

                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={24}
                        slidesPerView={1}
                        pagination={{
                            clickable: true,
                            bulletClass: 'swiper-pagination-bullet !bg-gray-300 !opacity-100',
                            bulletActiveClass: '!bg-[#109C3D]',
                        }}
                        navigation={{
                            prevEl: '.swiper-button-prev-custom',
                            nextEl: '.swiper-button-next-custom',
                        }}
                        autoplay={{ delay: 6000, disableOnInteraction: true }}
                        className="pb-12"
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                    >
                        {filteredQuotes.map((quote: Quote) => {
                            const statusConfig = getStatusConfig(quote.status);
                            const urgencyConfig = getUrgencyConfig(quote.urgency);
                            const bids: Bid[] = quote.bids || [];
                            const acceptedBid = getAcceptedBid(quote);
                            const acceptedBidFees = acceptedBid ? calculateFees(acceptedBid.bidAmount) : null;

                            return (
                                <SwiperSlide key={quote._id}>
                                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full flex flex-col">
                                        {/* Card Header */}
                                        <div className="bg-[#063A41] p-4 relative">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg font-bold text-white truncate mb-1">
                                                        {quote.taskTitle}
                                                    </h3>
                                                    <div className="flex items-center gap-2">
                                                        <FaCalendarAlt className="text-white/60 text-xs" />
                                                        <span className="text-white/80 text-xs">
                                                            {formatDate(quote.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                                                    {statusConfig.icon}
                                                    <span className="hidden sm:inline">{statusConfig.label}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Accepted Bid Amount Display with Fee Breakdown */}
                                        {quote.status === 'accepted' && acceptedBid && acceptedBidFees && (
                                            <div className="bg-gradient-to-r from-[#109C3D] to-[#0d8534] p-4 text-white">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                                            <FaCheckCircle className="text-2xl" />
                                                        </div>
                                                        <div>
                                                            <p className="text-white/80 text-xs uppercase tracking-wide">Accepted Bid</p>
                                                            <p className="text-2xl font-bold">{formatCurrency(acceptedBid.bidAmount)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-white/80 text-xs">Duration</p>
                                                        <p className="text-sm font-medium">{acceptedBid.estimatedDuration}h</p>
                                                    </div>
                                                </div>
                                                {/* Fee breakdown summary */}
                                                <div className="bg-white/10 rounded-lg p-3 space-y-1 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-white/70">You Paid</span>
                                                        <span className="font-semibold">{formatCurrency(acceptedBidFees.totalClientPays)}</span>
                                                    </div>
                                                  
                                                </div>
                                                {acceptedBid.bidDescription && (
                                                    <p className="mt-2 text-sm text-white/90 bg-white/10 p-2 rounded-lg">
                                                        &quot;{acceptedBid.bidDescription}&quot;
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* Completed Status with Amount */}
                                        {quote.status === 'completed' && acceptedBid && acceptedBidFees && (
                                            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4 text-white">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                                            <FaCheck className="text-2xl" />
                                                        </div>
                                                        <div>
                                                            <p className="text-white/80 text-xs uppercase tracking-wide">Completed</p>
                                                            <p className="text-2xl font-bold">{formatCurrency(acceptedBidFees.totalClientPays)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
                                                        ✓ Done
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Card Body */}
                                        <div className="p-4 space-y-4 flex-1">
                                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                                                {quote.taskDescription || "No description provided"}
                                            </p>

                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
                                                    <div className="w-7 h-7 bg-[#E5FFDB] rounded-md flex items-center justify-center flex-shrink-0">
                                                        <FaDollarSign className="text-[#109C3D] text-xs" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[10px] text-gray-400 uppercase">Your Budget</p>
                                                        <p className="text-xs font-semibold text-[#063A41] truncate">
                                                            {quote.budget ? `$${quote.budget}` : 'Not set'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
                                                    <div className="w-7 h-7 bg-[#E5FFDB] rounded-md flex items-center justify-center flex-shrink-0">
                                                        <FaGavel className="text-[#109C3D] text-xs" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[10px] text-gray-400 uppercase">Bids</p>
                                                        <p className="text-xs font-semibold text-[#063A41] truncate">
                                                            {bids.length} received
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
                                                <div className="w-7 h-7 bg-[#E5FFDB] rounded-md flex items-center justify-center flex-shrink-0">
                                                    <FaMapMarkerAlt className="text-[#109C3D] text-xs" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-[10px] text-gray-400 uppercase">Location</p>
                                                    <p className="text-xs font-medium text-[#063A41] truncate">
                                                        {quote.location || 'Not specified'}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Urgency Badge */}
                                            {quote.urgency && (
                                                <div className={`flex items-center gap-2 text-xs p-2 rounded-lg ${urgencyConfig.bg}`}>
                                                    <div className={`w-2 h-2 rounded-full ${urgencyConfig.dot}`}></div>
                                                    <span className={urgencyConfig.text}>{quote.urgency}</span>
                                                </div>
                                            )}

                                            {quote.preferredDateTime && (
                                                <div className="flex items-center gap-2 text-xs text-gray-500 bg-amber-50 p-2 rounded-lg">
                                                    <FaCalendarAlt className="text-amber-500 flex-shrink-0" />
                                                    <span>Preferred: {formatDateTime(quote.preferredDateTime)}</span>
                                                </div>
                                            )}

                                            {/* Bids Section - Show for 'bidded' status with Fee Preview */}
                                            {quote.status === 'bidded' && bids.length > 0 && (
                                                <div className="border-t border-gray-100 pt-4">
                                                    <p className="text-[10px] text-gray-400 uppercase mb-3 flex items-center gap-1">
                                                        <FaGavel className="text-xs" /> Bids Received ({bids.length})
                                                    </p>
                                                    <div className="space-y-3 max-h-64 overflow-y-auto">
                                                        {bids.map((bid: Bid) => {
                                                            const bidFees = calculateFees(bid.bidAmount);

                                                            return (
                                                                <div
                                                                    key={bid._id}
                                                                    className={`p-3 rounded-lg border ${bid.status === 'pending'
                                                                        ? 'bg-blue-50 border-blue-100'
                                                                        : bid.status === 'accepted'
                                                                            ? 'bg-green-50 border-green-200'
                                                                            : 'bg-gray-50 border-gray-200'
                                                                        }`}
                                                                >
                                                                    <div className="flex justify-between items-start mb-2">
                                                                        <div>
                                                                            <span className={`text-lg font-bold ${bid.status === 'pending'
                                                                                ? 'text-blue-700'
                                                                                : bid.status === 'accepted'
                                                                                    ? 'text-green-700'
                                                                                    : 'text-gray-500'
                                                                                }`}>
                                                                                {formatCurrency(bid.bidAmount)}
                                                                            </span>
                                                                            <span className="text-xs text-gray-500 ml-2">
                                                                                ({bid.estimatedDuration}h)
                                                                            </span>
                                                                        </div>
                                                                        <span className="text-xs text-gray-400">
                                                                            {formatDate(bid.submittedAt)}
                                                                        </span>
                                                                    </div>

                                                                    {bid.bidDescription && (
                                                                        <p className="text-xs text-gray-600 mb-2 line-clamp-2 italic">
                                                                            &quot;{bid.bidDescription}&quot;
                                                                        </p>
                                                                    )}

                                                                    {/* Fee Preview for Pending Bids */}
                                                                    {bid.status === 'pending' && (
                                                                        <div className="bg-white/80 rounded-lg p-2 mb-3 text-xs space-y-1 border border-gray-100">
                                                                            <div className="flex justify-between text-gray-600">
                                                                                <span className="flex items-center gap-1">
                                                                                    <FaReceipt className="w-3 h-3" />
                                                                                    You&apos;ll Pay:
                                                                                </span>
                                                                                <span className="font-bold text-amber-700">
                                                                                    {formatCurrency(bidFees.totalClientPays)}
                                                                                </span>
                                                                            </div>
                                                                           
                                                                        </div>
                                                                    )}

                                                                    {/* Action Buttons */}
                                                                    {bid.status === 'pending' && (
                                                                        <div className="flex gap-2">
                                                                            <button
                                                                                onClick={() => handleOpenAcceptModal(quote, bid)}
                                                                                className="flex-1 px-3 py-2 bg-[#109C3D] text-white text-xs font-medium rounded-lg hover:bg-[#0d8534] flex items-center justify-center gap-1.5 transition-colors"
                                                                            >
                                                                                <FaCheck className="w-3 h-3" />
                                                                                Accept & Pay
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleRejectBid(quote._id, bid._id)}
                                                                                className="px-3 py-2 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors"
                                                                                title="Reject Bid"
                                                                            >
                                                                                <FaTimes />
                                                                            </button>
                                                                        </div>
                                                                    )}

                                                                    {bid.status === 'accepted' && (
                                                                        <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                                                                            <FaCheckCircle /> Accepted
                                                                        </div>
                                                                    )}
                                                                    {bid.status === 'rejected' && (
                                                                        <div className="flex items-center gap-1 text-xs text-red-600 font-medium">
                                                                            <FaTimesCircle /> Rejected
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Show pending message if no bids yet */}
                                            {quote.status === 'pending' && bids.length === 0 && (
                                                <div className="border-t border-gray-100 pt-4">
                                                    <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                                                        <FaHourglass className="text-amber-500 flex-shrink-0" />
                                                        <div>
                                                            <p className="text-sm font-medium text-amber-700">Waiting for Bid</p>
                                                            <p className="text-xs text-amber-600">The tasker hasn&apos;t responded yet</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Tasker Info */}
                                            <div className="border-t border-gray-100 pt-4">
                                                <p className="text-[10px] text-gray-400 uppercase mb-2">Sent to Tasker</p>
                                                <Link
                                                    href={`/taskers/${quote.tasker?._id}`}
                                                    className="flex items-center gap-3 p-3 bg-[#E5FFDB]/50 rounded-xl border border-[#109C3D]/10 group hover:border-[#109C3D]/30 transition-colors"
                                                >
                                                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#109C3D]/20 group-hover:border-[#109C3D] transition-colors">
                                                        {quote.tasker?.profilePicture ? (
                                                            <Image
                                                                src={quote.tasker.profilePicture}
                                                                alt={`${quote.tasker.firstName} ${quote.tasker.lastName}'s profile`}
                                                                width={40}
                                                                height={40}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-[#109C3D]/20 flex items-center justify-center group-hover:bg-[#109C3D]/30 transition-colors">
                                                                <FaUser className="text-[#109C3D]" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-semibold text-[#063A41] truncate group-hover:text-[#109C3D] transition-colors">
                                                            {quote.tasker?.firstName || 'Unknown Tasker'} {quote.tasker?.lastName || ''}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>

                                        {/* Card Footer */}
                                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 mt-auto">
                                            {/* Only show delete for pending/bidded quotes */}
                                            {['pending', 'bidded'].includes(quote.status) && (
                                                <button
                                                    onClick={() => quote._id && handleDeleteClick(quote._id)}
                                                    disabled={isDeleting}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-red-200 text-red-600 font-medium rounded-xl hover:bg-red-50 hover:border-red-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <FaTrash className="text-sm" />
                                                    Delete Request
                                                </button>
                                            )}
                                       
                                            {/* Show completed message */}
                                            {quote.status === 'completed' && (
                                                <div className="text-center text-sm text-purple-600 font-medium py-2">
                                                    ✅ This task has been completed
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && (
                <div
                    className="fixed inset-0 bg-[#063A41]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setDeleteModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-modalSlide"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaTrash className="text-red-500 text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold text-[#063A41] mb-2">
                                Delete Quote Request?
                            </h3>
                            <p className="text-gray-500 text-sm">
                                This action cannot be undone. The quote request will be permanently removed.
                            </p>
                        </div>

                        <div className="flex gap-3 p-4 bg-gray-50 border-t border-gray-100">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="flex-1 px-4 py-2.5 border-2 border-gray-200 text-[#063A41] font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <FaTrash className="text-sm" />
                                        Delete
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes modalSlide {
                    from {
                        opacity: 0;
                        transform: translateY(-20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                .animate-modalSlide {
                    animation: modalSlide 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default RequestQuoteByUser;