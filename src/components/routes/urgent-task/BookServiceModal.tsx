/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
    FaClock,
    FaStar,
    FaTimes,
    FaChevronLeft,
    FaChevronRight,
    FaCheckCircle,
    FaCreditCard,
    FaCalendarAlt,
    FaShieldAlt,
    FaArrowLeft,
    FaUser,
    FaCheck,
    FaLock,
} from 'react-icons/fa';
import { useCreateBookingMutation } from '@/features/api/taskerApi';
import { useCreateSetupIntentMutation, useSavePaymentMethodMutation } from '@/features/api/taskApi';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    useStripe,
    useElements,
    CardElement,
} from '@stripe/react-stripe-js';
import Image from 'next/image';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// ============ HELPER FUNCTIONS (OUTSIDE COMPONENT) ============
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const getDayName = (date: Date): string => {
    return DAY_NAMES[date.getDay()];
};

const formatDateForAPI = (date: Date): string => {
    // Create ISO string but preserve local timezone
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};
// ============ END HELPER FUNCTIONS ============

interface Tasker {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    profilePicture: string;
    city: string;
    province: string;
    service: string;
    description: string;
    skills: string[];
    rate: number;
    availability: { day: string; from: string; to: string; _id: string }[];
    experience: string;
    hasInsurance: boolean;
    backgroundCheckConsent: boolean;
    categories: string[];
    certifications: string[];
    qualifications: string[];
    serviceAreas: string[];
    services: { title: string; description: string; hourlyRate: number; estimatedDuration: string }[];
}

interface BookServiceModalProps {
    tasker: Tasker;
    isOpen: boolean;
    onClose: () => void;
}

// Stripe Payment Form Component
const StripePaymentForm = ({
    amount,
    service,
    selectedDate,
    onPaymentSuccess,
    onCancel,
    taskerName,
}: {
    amount: number;
    service: any;
    taskerId: string;
    selectedDate: Date;
    onPaymentSuccess: (paymentMethodId: string) => void;
    onCancel: () => void;
    taskerName: string;
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [cardComplete, setCardComplete] = useState(false);
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
            const setupIntentResponse = await createSetupIntent().unwrap();
            const { clientSecret } = setupIntentResponse;

            const cardElement = elements.getElement(CardElement);
            if (!cardElement) {
                throw new Error('Card element not found');
            }

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

            const paymentMethodId = typeof setupIntent.payment_method === 'string'
                ? setupIntent.payment_method
                : setupIntent.payment_method.id;

            await savePaymentMethod(paymentMethodId).unwrap();
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
        <div className="w-full">
            {/* Payment Summary Card */}
            <div className="bg-[#E5FFDB] border border-[#109C3D]/20 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-[#063A41]">Service</span>
                    <span className="text-sm font-semibold text-[#063A41]">{service.title}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-[#063A41]">Date</span>
                    <span className="text-sm font-semibold text-[#063A41]">
                        {getDayName(selectedDate)}, {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                </div>
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-[#063A41]">Provider</span>
                    <span className="text-sm font-semibold text-[#063A41]">{taskerName}</span>
                </div>
                <div className="border-t border-[#109C3D]/20 pt-3 mt-3">
                    <div className="flex items-center justify-between">
                        <span className="text-base font-semibold text-[#063A41]">Total Amount</span>
                        <span className="text-xl font-bold text-[#109C3D]">${amount}</span>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl mb-4 flex items-start gap-3">
                    <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FaTimes className="text-red-500 text-xs" />
                    </div>
                    <div>
                        <p className="font-medium text-sm">Payment Error</p>
                        <p className="text-sm mt-0.5">{error}</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-[#063A41] mb-3">
                        Card Information
                    </label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                            <FaCreditCard className="text-gray-400" />
                        </div>
                        <div className="p-4 pl-12 border-2 border-gray-200 rounded-xl bg-white focus-within:border-[#109C3D] focus-within:ring-2 focus-within:ring-[#109C3D]/20 transition-all">
                            <CardElement
                                options={{
                                    style: {
                                        base: {
                                            fontSize: '16px',
                                            color: '#063A41',
                                            fontFamily: 'inherit',
                                            '::placeholder': {
                                                color: '#9CA3AF',
                                            },
                                        },
                                        invalid: {
                                            color: '#DC2626',
                                        },
                                    },
                                }}
                                onChange={(e) => setCardComplete(e.complete)}
                            />
                        </div>
                    </div>
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
                    <FaLock className="text-[#109C3D]" />
                    <span>Your payment is secured with 256-bit SSL encryption</span>
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 text-[#063A41] rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                        disabled={isLoading}
                    >
                        <FaArrowLeft className="text-sm" />
                        Back
                    </button>
                    <button
                        type="submit"
                        disabled={!stripe || isLoading || !cardComplete}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#109C3D] text-white rounded-xl font-semibold hover:bg-[#0d8a35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <FaShieldAlt />
                                Pay ${amount}
                            </>
                        )}
                    </button>
                </div>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-6 pt-2">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <FaShieldAlt className="text-[#109C3D]" />
                        <span>Secure</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <FaCreditCard className="text-[#109C3D]" />
                        <span>Stripe</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <FaCheckCircle className="text-[#109C3D]" />
                        <span>Verified</span>
                    </div>
                </div>
            </form>
        </div>
    );
};

// Payment Wrapper Component
const PaymentWrapper = ({
    amount,
    service,
    taskerId,
    selectedDate,
    onPaymentSuccess,
    onCancel,
    taskerName,
}: {
    amount: number;
    service: any;
    taskerId: string;
    selectedDate: Date;
    onPaymentSuccess: (paymentMethodId: string) => void;
    onCancel: () => void;
    taskerName: string;
}) => {
    return (
        <Elements stripe={stripePromise}>
            <StripePaymentForm
                amount={amount}
                service={service}
                taskerId={taskerId}
                selectedDate={selectedDate}
                onPaymentSuccess={onPaymentSuccess}
                onCancel={onCancel}
                taskerName={taskerName}
            />
        </Elements>
    );
};

// Custom Calendar Component
const CustomCalendar = ({
    selectedDate,
    onDateChange,
    availableDays,
}: {
    selectedDate: Date | null;
    onDateChange: (date: Date | null) => void;
    availableDays: string[];
}) => {
    const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days: (Date | null)[] = [];

        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    };

    const navigateMonth = (direction: number) => {
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(currentMonth.getMonth() + direction);
        setCurrentMonth(newMonth);
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const isSelected = (date: Date) => {
        return selectedDate &&
            date.getDate() === selectedDate.getDate() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear();
    };

    const isPast = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const isDateAvailable = (date: Date): boolean => {
        const dayName = getDayName(date);
        return availableDays.some(day => day.toLowerCase() === dayName.toLowerCase());
    };

    const days = getDaysInMonth(currentMonth);

    return (
        <div className="w-full bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-[#063A41] text-white px-4 py-3 flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => navigateMonth(-1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
                >
                    <FaChevronLeft className="text-sm" />
                </button>
                <h3 className="text-sm font-semibold">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <button
                    type="button"
                    onClick={() => navigateMonth(1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
                >
                    <FaChevronRight className="text-sm" />
                </button>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-100">
                {dayNames.map((day) => (
                    <div key={day} className="py-2 text-center text-xs font-medium text-gray-500">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 p-2 gap-1">
                {days.map((date, index) => {
                    if (!date) {
                        return <div key={index} className="aspect-square" />;
                    }

                    const dayAvailable = isDateAvailable(date);
                    const past = isPast(date);
                    const available = dayAvailable && !past;
                    const selected = isSelected(date);
                    const today = isToday(date);

                    return (
                        <button
                            key={index}
                            type="button"
                            disabled={!available}
                            onClick={() => {
                                if (available) {
                                    onDateChange(date);
                                }
                            }}
                            className={`
                                aspect-square flex items-center justify-center text-sm font-medium rounded-lg transition-all
                                ${selected ? 'bg-[#109C3D] text-white shadow-md' : ''}
                                ${today && !selected ? 'bg-[#E5FFDB] text-[#109C3D] font-bold' : ''}
                                ${available && !selected && !today ? 'text-[#063A41] hover:bg-[#E5FFDB] cursor-pointer' : ''}
                                ${!available ? 'text-gray-300 cursor-not-allowed bg-gray-50' : ''}
                            `}
                        >
                            {date.getDate()}
                        </button>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-[#E5FFDB] border border-[#109C3D]/20" />
                    <span>Today</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-[#109C3D]" />
                    <span>Selected</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-gray-200" />
                    <span>Unavailable</span>
                </div>
            </div>

            {/* Available Days Info */}
            <div className="px-4 py-2 bg-[#E5FFDB]/30 border-t border-gray-100 text-center">
                <p className="text-xs text-[#063A41]">
                    <span className="font-medium">Available:</span>{' '}
                    {availableDays.length > 0 ? availableDays.join(', ') : 'No days available'}
                </p>
            </div>
        </div>
    );
};

// Step Indicator Component
const StepIndicator = ({ currentStep }: { currentStep: number }) => {
    const steps = [
        { number: 1, label: 'Service' },
        { number: 2, label: 'Schedule' },
        { number: 3, label: 'Payment' },
    ];

    return (
        <div className="flex items-center justify-center gap-2 mb-6">
            {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                    <div className="flex items-center gap-2">
                        <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all
                            ${currentStep >= step.number
                                ? 'bg-[#109C3D] text-white'
                                : 'bg-gray-100 text-gray-400'}
                        `}>
                            {currentStep > step.number ? (
                                <FaCheck className="text-xs" />
                            ) : (
                                step.number
                            )}
                        </div>
                        <span className={`text-xs font-medium hidden sm:block ${currentStep >= step.number ? 'text-[#063A41]' : 'text-gray-400'
                            }`}>
                            {step.label}
                        </span>
                    </div>
                    {index < steps.length - 1 && (
                        <div className={`w-8 h-0.5 ${currentStep > step.number ? 'bg-[#109C3D]' : 'bg-gray-200'
                            }`} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

// Main Booking Modal Component
const BookServiceModal: React.FC<BookServiceModalProps> = ({ tasker, isOpen, onClose }) => {
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [showPayment, setShowPayment] = useState(false);
    const [createBooking, { isLoading }] = useCreateBookingMutation();

    // Memoize available days from tasker availability
    const availableDays = useMemo(() => {
        return tasker.availability.map(slot => slot.day);
    }, [tasker.availability]);

    // Debug logging
    useEffect(() => {
        console.log('=== BOOKING MODAL DEBUG ===');
        console.log('Tasker:', tasker.firstName, tasker.lastName);
        console.log('Tasker availability:', tasker.availability);
        console.log('Available days:', availableDays);
        console.log('===========================');
    }, [tasker, availableDays]);

    // Get available time slots for a given date
    const getAvailableSlots = useCallback((date: Date): string[] => {
        const dayName = getDayName(date);
        const availability = tasker.availability.find(
            (slot) => slot.day.toLowerCase() === dayName.toLowerCase()
        );

        if (!availability) {
            console.log(`No availability found for ${dayName}`);
            return [];
        }

        const slots: string[] = [];
        let [startHour, startMinute] = availability.from.split(':').map(Number);
        const [endHour, endMinute] = availability.to.split(':').map(Number);

        while (startHour < endHour || (startHour === endHour && startMinute < endMinute)) {
            const time = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
            slots.push(time);
            startMinute += 60;
            if (startMinute >= 60) {
                startHour += 1;
                startMinute = 0;
            }
        }
        return slots;
    }, [tasker.availability]);

    // Handle time slot selection
    const handleSlotSelection = useCallback((slot: string) => {
        setSelectedSlot(slot);
        if (selectedDate) {
            const [hours, minutes] = slot.split(':').map(Number);
            const newDate = new Date(selectedDate);
            newDate.setHours(hours, minutes, 0, 0);
            setSelectedDate(newDate);
        }
    }, [selectedDate]);

    // Handle service selection
    const handleServiceSelection = useCallback((title: string) => {
        setSelectedService(title);
    }, []);

    // Handle payment success
    const handlePaymentSuccess = useCallback(async (paymentMethodId: string) => {
        if (!selectedService || !selectedDate) return;

        const service = tasker.services.find((s) => s.title === selectedService);
        if (!service) return;

        const dayName = getDayName(selectedDate);
        const formattedDate = formatDateForAPI(selectedDate);

        console.log('=== SUBMITTING BOOKING ===');
        console.log('Selected Date:', selectedDate.toString());
        console.log('Day Name:', dayName);
        console.log('Formatted Date:', formattedDate);
        console.log('Available Days:', availableDays);
        console.log('==========================');

        const bookingData = {
            taskerId: tasker._id,
            service: {
                title: service.title,
                description: service.description,
                hourlyRate: service.hourlyRate,
                estimatedDuration: service.estimatedDuration,
            },
            date: formattedDate,
            dayOfWeek: dayName,
            paymentMethodId,
        }; 
    
        try {
            const response = await createBooking(bookingData).unwrap();
            console.log('Booking successful:', response);

            toast.success('Booking confirmed and payment completed!');
            setTimeout(() => {
                onClose();
                setShowPayment(false);
                setSelectedService(null);
                setSelectedDate(null);
                setSelectedSlot(null);
            }, 2000);
        } catch (err: any) {
            console.error('Error creating booking:', err);
            toast.error(`Booking failed: ${err?.data?.message || 'Unknown error'}`);
        }
    }, [selectedService, selectedDate, tasker, availableDays, createBooking, onClose]);

    // Handle confirm booking (proceed to payment)
    const handleConfirmBooking = useCallback(() => {
        if (!selectedService || !selectedDate || !selectedSlot) {
            toast.error('Please select a service, date, and time slot');
            return;
        }

        const service = tasker.services.find((s) => s.title === selectedService);
        if (!service) {
            toast.error('Selected service not found');
            return;
        }

        // Verify the date is still valid
        const dayName = getDayName(selectedDate);
        const isValidDay = availableDays.some(
            day => day.toLowerCase() === dayName.toLowerCase()
        );

        if (!isValidDay) {
            toast.error(`This tasker is not available on ${dayName}. Please select a different date.`);
            return;
        }

        console.log('Proceeding to payment for:', {
            service: service.title,
            date: selectedDate.toString(),
            dayName,
            slot: selectedSlot,
        });

        setShowPayment(true);
    }, [selectedService, selectedDate, selectedSlot, tasker.services, availableDays]);

    // Handle date change
    const handleDateChange = useCallback((date: Date | null) => {
        if (date) {
            console.log('Date selected:', date.toString(), '- Day:', getDayName(date));
        }
        setSelectedDate(date);
        setSelectedSlot(null);
    }, []);

    // Reset state when modal closes
    const handleClose = useCallback(() => {
        onClose();
        setShowPayment(false);
        setSelectedService(null);
        setSelectedDate(null);
        setSelectedSlot(null);
    }, [onClose]);

    // Don't render if modal is not open
    if (!isOpen) return null;

    const selectedServiceDetails = selectedService
        ? tasker.services.find((s) => s.title === selectedService)
        : null;

    const getCurrentStep = () => {
        if (showPayment) return 3;
        if (selectedService) return 2;
        return 1;
    };

    const availableSlots = selectedDate ? getAvailableSlots(selectedDate) : [];

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[5000] p-4"
            onClick={handleClose}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-lg relative shadow-2xl max-h-[90vh] overflow-hidden animate-modalSlide"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="bg-[#063A41] px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20">
                                {tasker.profilePicture ? (
                                    <Image
                                        src={tasker.profilePicture}
                                        alt={`${tasker.firstName} ${tasker.lastName}`}
                                        width={40}
                                        height={40}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-[#109C3D] flex items-center justify-center">
                                        <FaUser className="text-white" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h2 className="text-white font-semibold">
                                    {showPayment ? 'Complete Payment' : 'Book Service'}
                                </h2>
                                <p className="text-white/70 text-sm">
                                    {tasker.firstName} {tasker.lastName}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <FaTimes />
                        </button>
                    </div>
                </div>

                {/* Step Indicator */}
                <div className="px-6 pt-4">
                    <StepIndicator currentStep={getCurrentStep()} />
                </div>

                {/* Modal Content */}
                <div className="px-6 pb-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                    {!showPayment ? (
                        <div className="space-y-6">
                            {/* Services Section */}
                            <div>
                                <h3 className="text-sm font-semibold text-[#063A41] mb-3 flex items-center gap-2">
                                    <div className="w-6 h-6 bg-[#E5FFDB] rounded-md flex items-center justify-center">
                                        <FaStar className="text-[#109C3D] text-xs" />
                                    </div>
                                    Select a Service
                                </h3>

                                {tasker.services && tasker.services.length > 0 ? (
                                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                        {tasker.services.map((service, index) => {
                                            const isSelected = selectedService === service.title;
                                            return (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => handleServiceSelection(service.title)}
                                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${isSelected
                                                        ? 'border-[#109C3D] bg-[#E5FFDB]/50'
                                                        : 'border-gray-100 hover:border-[#109C3D]/30 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-semibold text-[#063A41] truncate">
                                                                    {service.title}
                                                                </span>
                                                                {isSelected && (
                                                                    <FaCheckCircle className="text-[#109C3D] flex-shrink-0" />
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                                {service.description}
                                                            </p>
                                                        </div>
                                                        <div className="text-right flex-shrink-0">
                                                            <p className="text-lg font-bold text-[#109C3D]">
                                                                ${service.hourlyRate}
                                                            </p>
                                                            <p className="text-xs text-gray-400">per hour</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                                                        <span className="flex items-center gap-1.5 text-xs text-gray-500">
                                                            <FaClock className="text-[#109C3D]" />
                                                            {service.estimatedDuration}
                                                        </span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-gray-50 rounded-xl">
                                        <FaStar className="text-gray-300 text-2xl mx-auto mb-2" />
                                        <p className="text-gray-500 text-sm">No services available</p>
                                    </div>
                                )}
                            </div>

                            {/* Date Section */}
                            {selectedService && (
                                <div>
                                    <h3 className="text-sm font-semibold text-[#063A41] mb-3 flex items-center gap-2">
                                        <div className="w-6 h-6 bg-[#E5FFDB] rounded-md flex items-center justify-center">
                                            <FaCalendarAlt className="text-[#109C3D] text-xs" />
                                        </div>
                                        Choose a Date
                                    </h3>
                                    <CustomCalendar
                                        selectedDate={selectedDate}
                                        onDateChange={handleDateChange}
                                        availableDays={availableDays}
                                    />
                                </div>
                            )}

                            {/* Time Slots Section */}
                            {selectedDate && (
                                <div>
                                    <h3 className="text-sm font-semibold text-[#063A41] mb-3 flex items-center gap-2">
                                        <div className="w-6 h-6 bg-[#E5FFDB] rounded-md flex items-center justify-center">
                                            <FaClock className="text-[#109C3D] text-xs" />
                                        </div>
                                        Available Time Slots
                                        <span className="text-xs font-normal text-gray-500">
                                            ({getDayName(selectedDate)})
                                        </span>
                                    </h3>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                        {availableSlots.length > 0 ? (
                                            availableSlots.map((slot, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => handleSlotSelection(slot)}
                                                    className={`py-2.5 px-3 text-center rounded-lg text-sm font-medium transition-all ${selectedSlot === slot
                                                        ? 'bg-[#109C3D] text-white shadow-md'
                                                        : 'bg-gray-50 text-[#063A41] hover:bg-[#E5FFDB] border border-gray-200 hover:border-[#109C3D]/30'
                                                        }`}
                                                >
                                                    {formatTime(slot)}
                                                </button>
                                            ))
                                        ) : (
                                            <div className="col-span-full text-center py-6 bg-gray-50 rounded-xl">
                                                <FaClock className="text-gray-300 text-xl mx-auto mb-2" />
                                                <p className="text-gray-500 text-sm">No available slots for {getDayName(selectedDate)}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Booking Summary */}
                            {selectedServiceDetails && selectedDate && selectedSlot && (
                                <div className="bg-[#E5FFDB]/50 border border-[#109C3D]/20 rounded-xl p-4">
                                    <h4 className="text-sm font-semibold text-[#063A41] mb-3 flex items-center gap-2">
                                        <FaCheckCircle className="text-[#109C3D]" />
                                        Booking Summary
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Service</span>
                                            <span className="font-medium text-[#063A41]">{selectedServiceDetails.title}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Date</span>
                                            <span className="font-medium text-[#063A41]">
                                                {getDayName(selectedDate)}, {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Time</span>
                                            <span className="font-medium text-[#063A41]">{formatTime(selectedSlot)}</span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t border-[#109C3D]/20">
                                            <span className="font-semibold text-[#063A41]">Total</span>
                                            <span className="font-bold text-[#109C3D] text-lg">${selectedServiceDetails.hourlyRate}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Proceed Button */}
                            <button
                                type="button"
                                onClick={handleConfirmBooking}
                                disabled={!selectedService || !selectedDate || !selectedSlot || isLoading}
                                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#109C3D] text-white rounded-xl font-semibold hover:bg-[#0d8a35] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FaCreditCard />
                                {isLoading ? 'Processing...' : 'Proceed to Payment'}
                            </button>
                        </div>
                    ) : (
                        selectedServiceDetails && selectedDate && (
                            <PaymentWrapper
                                amount={selectedServiceDetails.hourlyRate}
                                service={selectedServiceDetails}
                                taskerId={tasker._id}
                                selectedDate={selectedDate}
                                onPaymentSuccess={handlePaymentSuccess}
                                onCancel={() => setShowPayment(false)}
                                taskerName={`${tasker.firstName} ${tasker.lastName}`}
                            />
                        )
                    )}
                </div>
            </div>

            {/* Custom Animations */}
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

export default BookServiceModal;