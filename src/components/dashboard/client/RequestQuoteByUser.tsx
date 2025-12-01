/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* Updated Frontend Component (components/RequestQuoteByUser.tsx or similar)
   - Added Stripe payment integration for accepting bids
   - Added payment form when accepting bids
   - Uses setup intent approach similar to your working payment system
*/

import React, { useState, useEffect } from "react";
import {
    FaClock,
    FaDollarSign,
    FaUser,
    FaCalendarAlt,
    FaTrash,
    FaMapMarkerAlt,
    FaQuoteLeft,
    FaEnvelope,
    FaExclamationCircle,
    FaCheckCircle,
    FaHourglass,
    FaChevronLeft,
    FaChevronRight,
    FaClipboardList,
    FaPlusCircle,
    FaCheck,
    FaTimes,
    FaCreditCard,
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
    CardElement,
} from '@stripe/react-stripe-js';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import Link from "next/link";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface User {
    _id: string;
    role: string;
}

interface Bid {
    _id: string;
    bidAmount: number;
    bidDescription: string;
    estimatedDuration: number;
    submittedAt: string;
    status: 'pending' | 'accepted' | 'rejected';
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

// Stripe Payment Form Component for Quotes
const StripePaymentForm = ({
    amount,
    quote,
    bid,
    onPaymentSuccess,
    onCancel
}: {
    amount: number;
    quote: Quote;
    bid: Bid;
    onPaymentSuccess: (paymentMethodId: string) => void;
    onCancel: () => void;
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [createSetupIntent] = useCreateSetupIntentMutation();
    const [savePaymentMethod] = useSavePaymentMethodMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) {
            setError('Payment system not ready. Please try again.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // 1. Create SetupIntent
            const setupIntentResponse = await createSetupIntent().unwrap();
            const { clientSecret } = setupIntentResponse;

            // 2. Get card element
            const cardElement = elements.getElement(CardElement);
            if (!cardElement) {
                throw new Error('Card element not found');
            }

            // 3. Confirm card setup with Stripe
            const { error: stripeError, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: 'Customer',
                    },
                },
            });

            if (stripeError) {
                throw new Error(stripeError.message || 'Card setup failed');
            }

            if (!setupIntent?.payment_method) {
                throw new Error('No payment method returned from Stripe');
            }

            // Extract the payment method ID
            const paymentMethodId = typeof setupIntent.payment_method === 'string'
                ? setupIntent.payment_method
                : setupIntent.payment_method.id;

            // 4. Save payment method to your backend
            await savePaymentMethod(paymentMethodId).unwrap();

            // 5. Call success callback with payment method ID
            onPaymentSuccess(paymentMethodId);
            toast.success('Payment method saved successfully!');

        } catch (err: any) {
            console.error('Payment error details:', err);
            let errorMessage = 'Payment setup failed';

            if (err?.data?.error) {
                errorMessage = err.data.error;
            } else if (err?.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
            toast.error(`Payment failed: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaCreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <p className="text-blue-700 font-medium">
                        Secure Payment Required
                    </p>
                    <p className="text-sm text-blue-600 mt-1">
                        Total Amount: <span className="font-bold">${amount}</span>
                    </p>
                    <p className="text-xs text-blue-500 mt-1">
                        Task: {quote.taskTitle}
                    </p>
                </div>
            </div>

            {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
                    <strong>Payment Error:</strong> {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Details
                    </label>
                    <div className="p-3 border border-gray-300 rounded-md bg-white">
                        <CardElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#424770',
                                        '::placeholder': {
                                            color: '#aab7c4',
                                        },
                                    },
                                    invalid: {
                                        color: '#9e2146',
                                    },
                                },
                            }}
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!stripe || isLoading}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Processing...
                            </>
                        ) : (
                            <>
                                <FaCreditCard />
                                Pay ${amount}
                            </>
                        )}
                    </button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                    🔒 Powered by Stripe - Your payment information is secure and encrypted
                </p>
            </form>
        </div>
    );
};

// Payment Wrapper for Quotes
const QuotePaymentWrapper = ({
    amount,
    quote,
    bid,
    onPaymentSuccess,
    onCancel
}: {
    amount: number;
    quote: Quote;
    bid: Bid;
    onPaymentSuccess: (paymentMethodId: string) => void;
    onCancel: () => void;
}) => {
    return (
        <Elements stripe={stripePromise}>
            <StripePaymentForm
                amount={amount}
                quote={quote}
                bid={bid}
                onPaymentSuccess={onPaymentSuccess}
                onCancel={onCancel}
            />
        </Elements>
    );
};

const RequestQuoteByUser: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
    const [selectedBidForPayment, setSelectedBidForPayment] = useState<{ quoteId: string, bidId: string } | null>(null);

    const [trigger, { data: quotes = [], isLoading, error }] =
        useLazyGetRequestQuotesByClientIdQuery();
    const [deleteRequestQuote, { isLoading: isDeleting }] =
        useDeleteRequestQuoteMutation();

    const [acceptBid] = useAcceptBidMutation();
    const [rejectBid] = useRejectBidMutation();

    console.log(quotes);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/auth/verify-token",
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
        } catch (err: any) {
            alert(
                `Failed to delete request quote: ${err?.data?.message || "Unknown error"}`
            );
        }
    };

    // Handle starting payment process for bid acceptance
    const handleAcceptBidWithPayment = (quoteId: string, bidId: string) => {
        setSelectedBidForPayment({ quoteId, bidId });
    };

    // Handle canceling payment
    const handleCancelPayment = () => {
        setSelectedBidForPayment(null);
    };

    // Handle successful payment
    const handlePaymentSuccess = async (paymentMethodId: string) => {
        if (!selectedBidForPayment) return;

        try {
            await acceptBid({
                quoteId: selectedBidForPayment.quoteId,
                bidId: selectedBidForPayment.bidId,
                paymentMethodId
            }).unwrap();

            toast.success('Payment completed and bid accepted successfully!');
            setSelectedBidForPayment(null);
            if (user?._id) trigger(user._id);
        } catch (err: any) {
            toast.error(`Payment successful but bid acceptance failed: ${err?.data?.message || 'Unknown error'}`);
        }
    };

    // Handle reject bid (no payment required)
    const handleRejectBid = async (quoteId: string, bidId: string) => {
        try {
            await rejectBid({ quoteId, bidId }).unwrap();
            if (user?._id) trigger(user._id);
            toast.success('Bid rejected successfully!');
        } catch (err: any) {
            toast.error(`Failed to reject bid: ${err?.data?.message || "Unknown error"}`);
        }
    };

    const getStatusConfig = (status: string) => {
        const configs: { [key: string]: { bg: string; text: string; icon: React.ReactNode; label: string } } = {
            pending: {
                bg: "bg-amber-50",
                text: "text-amber-700",
                icon: <FaHourglass className="text-amber-500" />,
                label: "Pending"
            },
            bidded: {
                bg: "bg-blue-50",
                text: "text-blue-700",
                icon: <FaDollarSign className="text-blue-500" />,
                label: "Bidded"
            },
            accepted: {
                bg: "bg-[#E5FFDB]",
                text: "text-[#109C3D]",
                icon: <FaCheckCircle className="text-[#109C3D]" />,
                label: "Accepted"
            },
            rejected: {
                bg: "bg-red-50",
                text: "text-red-700",
                icon: <FaExclamationCircle className="text-red-500" />,
                label: "Rejected"
            },
            completed: {
                bg: "bg-green-50",
                text: "text-green-700",
                icon: <FaCheckCircle className="text-green-500" />,
                label: "Completed"
            },
        };
        return configs[status] || configs.pending;
    };

    const getUrgencyConfig = (urgency: string) => {
        const lower = urgency?.toLowerCase() || '';
        if (lower.includes('urgent') || lower.includes('high')) {
            return { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" };
        }
        if (lower.includes('medium')) {
            return { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" };
        }
        return { bg: "bg-[#E5FFDB]", text: "text-[#063A41]", dot: "bg-[#109C3D]" };
    };

    const formatDate = (dateString: string | number | Date) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatDateTime = (dateString: string | number | Date) => {
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

    // Helper function to get selected bid and quote for payment
    const getSelectedBidAndQuote = () => {
        if (!selectedBidForPayment) return null;

        const quote = quotes.find((q: Quote) => q._id === selectedBidForPayment.quoteId);
        if (!quote) return null;

        const bid = quote.bids.find((b: Bid) => b._id === selectedBidForPayment.bidId);
        if (!bid) return null;

        return { quote, bid };
    };

    const selectedBidData = getSelectedBidAndQuote();

    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
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
                    <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <span className="text-sm text-gray-500">Total Quotes:</span>
                        <span className="text-lg font-bold text-[#109C3D]">{quotes.length}</span>
                    </div>
                </div>
            </div>

            {/* Payment Modal Overlay */}
            {selectedBidData && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-modalSlide">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-[#063A41]">
                                    Accept Bid & Pay
                                </h3>
                                <button
                                    onClick={handleCancelPayment}
                                    className="text-gray-400 hover:text-gray-600 text-2xl"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-600 mb-1">Bid Amount:</p>
                                <p className="text-2xl font-bold text-[#109C3D]">${selectedBidData.bid.bidAmount}</p>
                                <p className="text-xs text-blue-500 mt-1">
                                    Task: {selectedBidData.quote.taskTitle}
                                </p>
                                {selectedBidData.bid.bidDescription && (
                                    <p className="text-sm text-blue-600 mt-2">{selectedBidData.bid.bidDescription}</p>
                                )}
                            </div>

                            <QuotePaymentWrapper
                                amount={selectedBidData.bid.bidAmount}
                                quote={selectedBidData.quote}
                                bid={selectedBidData.bid}
                                onPaymentSuccess={handlePaymentSuccess}
                                onCancel={handleCancelPayment}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Swiper Container */}
            <div className="max-w-7xl mx-auto relative">
                <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-[#063A41] hover:bg-[#E5FFDB] hover:text-[#109C3D] transition-all lg:flex">
                    <FaChevronLeft className="text-sm" />
                </button>
                <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-[#063A41] hover:bg-[#E5FFDB] hover:text-[#109C3D] transition-all lg:flex">
                    <FaChevronRight className="text-sm" />
                </button>

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
                    {quotes.map((quote: Quote) => {
                        const statusConfig = getStatusConfig(quote.status);
                        const urgencyConfig = getUrgencyConfig(quote.urgency);
                        const bids: Bid[] = quote.bids || [];

                        return (
                            <SwiperSlide key={quote._id}>
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full">
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

                                    {/* Card Body */}
                                    <div className="p-4 space-y-4">
                                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                                            {quote.taskDescription || "No description provided"}
                                        </p>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
                                                <div className="w-7 h-7 bg-[#E5FFDB] rounded-md flex items-center justify-center flex-shrink-0">
                                                    <FaDollarSign className="text-[#109C3D] text-xs" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] text-gray-400 uppercase">Budget</p>
                                                    <p className="text-xs font-semibold text-[#063A41] truncate">
                                                        {quote.budget ? `$${quote.budget}` : 'Not set'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
                                                <div className="w-7 h-7 bg-[#E5FFDB] rounded-md flex items-center justify-center flex-shrink-0">
                                                    <FaClock className="text-[#109C3D] text-xs" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] text-gray-400 uppercase">Urgency</p>
                                                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${urgencyConfig.text}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${urgencyConfig.dot}`}></span>
                                                        {quote.urgency || 'Normal'}
                                                    </span>
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

                                        {quote.preferredDateTime && (
                                            <div className="flex items-center gap-2 text-xs text-gray-500 bg-amber-50 p-2 rounded-lg">
                                                <FaCalendarAlt className="text-amber-500 flex-shrink-0" />
                                                <span>Preferred: {formatDateTime(quote.preferredDateTime)}</span>
                                            </div>
                                        )}

                                        {/* Bids Section */}
                                        {quote.status === 'bidded' && bids.length > 0 && (
                                            <div className="border-t border-gray-100 pt-4">
                                                <p className="text-[10px] text-gray-400 uppercase mb-3 flex items-center gap-1">
                                                    <FaDollarSign className="text-xs" /> Bids Received ({bids.length})
                                                </p>
                                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                                    {bids.map((bid: Bid) => (
                                                        <div key={bid._id} className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                                            <div className="flex justify-between items-start mb-1">
                                                                <span className="text-sm font-bold text-blue-700">${bid.bidAmount}</span>
                                                                <span className="text-xs text-gray-500">{formatDate(bid.submittedAt)}</span>
                                                            </div>
                                                            {bid.bidDescription && (
                                                                <p className="text-xs text-gray-600 mb-1">{bid.bidDescription}</p>
                                                            )}
                                                            <p className="text-xs text-gray-500 mb-2">Est. {bid.estimatedDuration}h</p>
                                                            {bid.status === 'pending' && (
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={() => handleAcceptBidWithPayment(quote._id, bid._id)}
                                                                        className="flex-1 px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 flex items-center justify-center gap-1"
                                                                    >
                                                                        <FaCheck className="text-xs" /> Accept & Pay
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleRejectBid(quote._id, bid._id)}
                                                                        className="flex-1 px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 flex items-center justify-center gap-1"
                                                                    >
                                                                        <FaTimes className="text-xs" /> Reject
                                                                    </button>
                                                                </div>
                                                            )}
                                                            {bid.status === 'accepted' && (
                                                                <span className="text-xs text-green-600 font-medium">Accepted</span>
                                                            )}
                                                            {bid.status === 'rejected' && (
                                                                <span className="text-xs text-red-600 font-medium">Rejected</span>
                                                            )}
                                                        </div>
                                                    ))}
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
                                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                                        <button
                                            onClick={() => quote._id && handleDeleteClick(quote._id)}
                                            disabled={isDeleting}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-red-200 text-red-600 font-medium rounded-xl hover:bg-red-50 hover:border-red-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <FaTrash className="text-sm" />
                                            Delete Request
                                        </button>
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>

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