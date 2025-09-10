/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { FaClock, FaStar, FaTimes, FaWrench, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { useCreateBookingMutation } from '@/features/api/taskerApi';
import { toast } from 'react-toastify';

interface Tasker {
    _id: string;
    firstName: string;
    lastName: string; email: string;
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

const CustomCalendar = ({ selectedDate, onDateChange, isDateAvailable }: {
    selectedDate: Date | null;
    onDateChange: (date: Date | null) => void;
    isDateAvailable: (date: Date) => boolean;
}) => {
    const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add all days of the month
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
        return date &&
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const isSelected = (date: Date) => {
        return selectedDate && date &&
            date.getDate() === selectedDate.getDate() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear();
    };

    const days = getDaysInMonth(currentMonth);

    return (
        <div className="w-full bg-white rounded-lg shadow-md border-none overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] text-white p-4 flex items-center justify-between">
                <button
                    onClick={() => navigateMonth(-1)}
                    className="p-1 hover:bg-white/20 rounded transition-all duration-200"
                >
                    <FaChevronLeft />
                </button>
                <h3 className="text-lg font-semibold">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <button
                    onClick={() => navigateMonth(1)}
                    className="p-1 hover:bg-white/20 rounded transition-all duration-200"
                >
                    <FaChevronRight />
                </button>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 bg-gray-50 border-b">
                {dayNames.map((day) => (
                    <div key={day} className="p-3 text-center text-sm font-medium text-gray-600">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7">
                {days.map((date, index) => (
                    <div
                        key={index}
                        className={`
                            aspect-square flex items-center justify-center text-sm font-medium cursor-pointer transition-all duration-200 border-r border-b border-gray-100 last:border-r-0
                            ${!date ? 'cursor-default' : ''}
                            ${date && isToday(date) ? 'bg-[#FF8609] text-white font-bold' : ''}
                            ${date && isSelected(date) ? 'bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] text-white font-bold' : ''}
                            ${date && !isToday(date) && !isSelected(date) && isDateAvailable(date) ? 'text-gray-800 hover:bg-[#E7B6FE]/30' : ''}
                            ${date && !isDateAvailable(date) ? 'text-gray-300 cursor-not-allowed' : ''}
                            ${!date ? '' : isDateAvailable(date) ? 'hover:scale-95' : ''}
                        `}
                        onClick={() => {
                            if (date && isDateAvailable(date)) {
                                onDateChange(date);
                            }
                        }}
                    >
                        {date ? date.getDate() : ''}
                    </div>
                ))}
            </div>
        </div>
    );
};

const BookServiceModal: React.FC<BookServiceModalProps> = ({ tasker, isOpen, onClose }) => {
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [createBooking, { isLoading, error }] = useCreateBookingMutation();

    useEffect(() => {
        console.log('All Cookies:', Cookies.get());
        console.log('isLoggedIn:', Cookies.get('isLoggedIn'));
        console.log('Tasker Services:', tasker.services);
    }, [tasker.services]);

    if (!isOpen) return null;

    const getAvailableSlots = (date: Date): string[] => {
        const dayName = date.toLocaleString('en-US', { weekday: 'long' });
        const availability = tasker.availability.find((slot) => slot.day === dayName);
        if (!availability) return [];

        const slots: string[] = [];
        let [startHour, startMinute] = availability.from.split(':').map(Number);
        const [endHour, endMinute] = availability.to.split(':').map(Number);

        while (startHour < endHour || (startHour === endHour && startMinute < endMinute)) {
            const time = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
            slots.push(time);
            startMinute += 60; // 1-hour slots
            if (startMinute >= 60) {
                startHour += 1;
                startMinute = 0;
            }
        }
        return slots;
    };

    const isDateAvailable = (date: Date): boolean => {
        const dayName = date.toLocaleString('en-US', { weekday: 'long' });
        return tasker.availability.some((slot) => slot.day === dayName);
    };

    const handleSlotSelection = (slot: string) => {
        setSelectedSlot(slot);
        if (selectedDate) {
            const [hours, minutes] = slot.split(':').map(Number);
            const newDate = new Date(selectedDate);
            newDate.setHours(hours, minutes, 0, 0);
            setSelectedDate(newDate);
        }
    };

    const handleConfirmBooking = async () => {
        console.log('handleConfirmBooking called');

        // Test toast immediately
        toast.info('Function called - testing toast!');

        if (!tasker.services || tasker.services.length === 0) {
            console.log('No services available');
            alert('No services available for this tasker'); // Fallback alert
            toast.error('No services available for this tasker');
            return;
        }
        if (!selectedService) {
            console.log('No service selected');
            alert('Please select a service'); // Fallback alert
            toast.error('Please select a service');
            return;
        }
        if (!selectedDate || !selectedSlot) {
            console.log('No date or slot selected');
            alert('Please select a date and time slot'); // Fallback alert
            toast.error('Please select a date and time slot');
            return;
        }

        const service = tasker.services.find((s) => s.title === selectedService);
        if (!service || !service.title || !service.description || !service.hourlyRate || !service.estimatedDuration) {
            console.log('Selected Service:', selectedService, 'Found Service:', service);
            alert('Selected service is invalid or missing required details'); // Fallback alert
            toast.error('Selected service is invalid or missing required details');
            return;
        }

        const bookingData = {
            taskerId: tasker._id,
            service: {
                title: service.title,
                description: service.description,
                hourlyRate: service.hourlyRate,
                estimatedDuration: service.estimatedDuration,
            },
            date: selectedDate.toISOString(),
        };

        console.log('Booking Data:', bookingData);

        try {
            const token = Cookies.get('token');
            console.log('Sending Token:', token);
            console.log('About to call createBooking...');

            const response = await createBooking(bookingData).unwrap();
            console.log('Booking successful:', response);

            // Try multiple ways to show success
            alert('Booking created successfully!'); // Fallback alert
            toast.success('🎉 Booking created successfully!');
            toast('✅ Success: Booking created!', { type: 'success' });

            setTimeout(() => {
                onClose();
            }, 2000);

        } catch (err: any) {
            console.error('Error creating booking:', err);
            console.log('Error details:', {
                message: err?.message,
                data: err?.data,
                status: err?.status
            });

            const errorMessage = err?.data?.message || err?.message || 'Unknown error';
            alert(`Failed to create booking: ${errorMessage}`); // Fallback alert
            toast.error(`❌ Failed to create booking: ${errorMessage}`, {
                style: { zIndex: 99999 },
                className: 'toast-above-modal',
                toastId: 'booking-error' // Prevent duplicates
            });

            // Force toast container to higher z-index
            const toastContainer = document.querySelector('.Toastify__toast-container');
            if (toastContainer) {
                (toastContainer as HTMLElement).style.zIndex = '99999';
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[5000] animate-fade-in p-4">
            <div className="bg-white rounded-2xl p-6 max-w-[750px] w-full relative shadow-xl transform transition-all duration-300 scale-100 hover:scale-105 max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-[#FF8609] transition-all duration-200"
                >
                    <FaTimes className="text-xl" />
                </button>
                <h2 className="text-xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] bg-clip-text ">
                    Book a Service
                </h2>

                <h3 className="text-md font-semibold text-gray-700 mb-3">Select a Date</h3>
                <div className="mb-4 w-full">
                    <CustomCalendar
                        selectedDate={selectedDate}
                        onDateChange={(date) => {
                            setSelectedDate(date);
                            setSelectedSlot(null); // Reset slot when date changes
                        }}
                        isDateAvailable={isDateAvailable}
                    />
                </div>

                {selectedDate && (
                    <div className="mb-4">
                        <h3 className="text-md font-semibold text-gray-700 mb-2">
                            Available Slots for {selectedDate.toLocaleDateString()}
                        </h3>
                        <div className="grid grid-cols-4 gap-2">
                            {getAvailableSlots(selectedDate).length > 0 ? (
                                getAvailableSlots(selectedDate).map((slot, index) => (
                                    <div
                                        key={index}
                                        className={`p-2 text-center rounded-lg text-[#8560F1] font-medium cursor-pointer transition-all duration-200 text-sm ${selectedSlot === slot
                                            ? 'bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] text-white'
                                            : 'bg-gradient-to-r from-[#E7B6FE]/20 to-[#8560F1]/20 hover:bg-[#8560F1]/30'
                                            }`}
                                        onClick={() => handleSlotSelection(slot)}
                                    >
                                        {slot}
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-600 col-span-4 text-sm">No available slots for this day.</p>
                            )}
                        </div>
                    </div>
                )}

                <h3 className="text-md font-semibold text-gray-700 mb-3">Choose a Service</h3>
                {tasker.services && tasker.services.length > 0 ? (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                        {tasker.services.map((service, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-lg shadow-sm cursor-pointer transition-all duration-200 ${selectedService === service.title
                                    ? 'bg-[#E7B6FE]/20 border-[#8560F1]'
                                    : 'bg-white hover:bg-[#E7B6FE]/10'
                                    } border`}
                                onClick={() => setSelectedService(service.title)}
                            >
                                <div className="flex items-center gap-2">
                                    <FaWrench className="text-[#FF8609] text-md" />
                                    <span className="font-semibold text-[#8560F1]">{service.title}</span>
                                </div>
                                <p className="text-xs text-gray-600 mt-1 italic">{service.description}</p>
                                <div className="flex justify-between text-xs text-gray-700 mt-2 font-medium">
                                    <span className="flex items-center gap-1">
                                        <FaStar className="text-[#FF8609]" /> ${service.hourlyRate}/hr
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FaClock className="text-[#8560F1]" /> {service.estimatedDuration}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600 text-sm">No services available for this tasker.</p>
                )}
                {error && (
                    <p className="text-red-500 text-xs mt-3">
                        Error: {
                            'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data
                                ? (error.data as any).message
                                : 'Failed to create booking'
                        }
                    </p>
                )}
                <button
                    onClick={handleConfirmBooking}
                    className="w-full mt-4 bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] text-white py-2 rounded-lg font-semibold shadow-md hover:from-[#FF8609] hover:to-[#FF6C32] transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                    disabled={!selectedService || !selectedDate || !selectedSlot || isLoading || !tasker.services || tasker.services.length === 0}
                >
                    {isLoading ? 'Booking...' : 'Confirm Booking'}
                </button>
            </div>
        </div>
    );
};

export default BookServiceModal;