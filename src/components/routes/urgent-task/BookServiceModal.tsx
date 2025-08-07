/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/routes/urgent-task/BookServiceModal.tsx
import { useEffect, useState } from 'react';
import { FaClock, FaStar, FaTimes, FaWrench } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { useCreateBookingMutation } from '@/features/api/taskerApi';
import { toast } from 'react-toastify';

interface Tasker {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    profilePicture: string;
    city: string;
    province: string;
    service: string;
    description: string;
    skills: string[];
    rate: number;
    availability: { day: string; from: string; to: string }[];
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

const BookServiceModal: React.FC<BookServiceModalProps> = ({ tasker, isOpen, onClose }) => {
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [createBooking, { isLoading, error }] = useCreateBookingMutation();

    useEffect(() => {
        console.log('All Cookies:', Cookies.get());
        console.log('isLoggedIn:', Cookies.get('isLoggedIn')); // Debug: Should show "true"
    }, []);

    if (!isOpen) return null;

    const handleConfirmBooking = async () => {
        console.log('Tasker ID:', tasker._id);

        if (!selectedService) {
            alert('Please select a service');
            return;
        }

        const service = tasker.services.find((s) => s.title === selectedService);
        if (!service) {
            alert('Selected service not found');
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
        };

        try {
            const response = await createBooking(bookingData).unwrap();
            console.log('Booking Response:', response);
            toast.success('Booking created successfully!');
            onClose();
        } catch (err: any) {
            console.error('Error creating booking:', err);
            alert(`Failed to create booking: ${err?.data?.message || 'Unknown error'}`);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-3xl p-8 max-w-lg w-full mx-4 relative shadow-2xl transform transition-all duration-500 scale-100 hover:scale-105">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-[#FF8609] transition-all duration-300"
                >
                    <FaTimes className="text-2xl" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 bg-clip-text bg-gradient-to-r from-[#8560F1] to-[#E7B6FE]">
                    Quick Book Service
                </h2>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Choose from Available Services</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {tasker.services.map((service, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded-lg shadow-md cursor-pointer transition-all duration-300 ${selectedService === service.title ? 'bg-[#E7B6FE]/20 border-[#8560F1]' : 'bg-white hover:bg-[#E7B6FE]/10'
                                } border`}
                            onClick={() => setSelectedService(service.title)}
                        >
                            <div className="flex items-center gap-2">
                                <FaWrench className="text-[#FF8609] text-lg animate-pulse" />
                                <span className="font-semibold text-[#8560F1]">{service.title}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-2 italic">{service.description}</p>
                            <div className="flex justify-between text-sm text-gray-700 mt-3 font-medium">
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
                {error && (
                    <p className="text-red-500 text-sm mt-4">
                        Error: { 'Failed to create booking'}
                    </p>
                )}
                <button
                    onClick={handleConfirmBooking}
                    className="w-full mt-6 bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] text-white py-3 rounded-lg font-bold shadow-lg hover:from-[#FF8609] hover:to-[#FF6C32] transition-all duration-500 transform hover:scale-105 disabled:opacity-50"
                    disabled={!selectedService || isLoading}
                >
                    {isLoading ? 'Booking...' : 'Confirm Booking'}
                </button>
            </div>
        </div>
    );
};

export default BookServiceModal;