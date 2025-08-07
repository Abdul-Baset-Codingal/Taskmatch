import React from 'react';
import {
    FaTimes,
    FaTasks,
    FaDollarSign,
    FaMapMarkerAlt,
    FaClock,
    FaTools,
    FaInfoCircle,
    FaUser,
    FaEnvelope,
    FaImages,
    FaPlay,
    FaCalendarAlt,
    FaExclamationTriangle,
    FaCheckCircle,
    FaGavel
} from "react-icons/fa";

const TaskDetailsModal = ({ task, isOpen, onClose }) => {
    if (!isOpen || !task) return null;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <FaClock className="text-yellow-500" />;
            case 'completed':
                return <FaCheckCircle className="text-green-500" />;
            case 'in-progress':
                return <FaTools className="text-blue-500" />;
            default:
                return <FaInfoCircle className="text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'text-yellow-600 bg-yellow-100';
            case 'completed':
                return 'text-green-600 bg-green-100';
            case 'in-progress':
                return 'text-blue-600 bg-blue-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/10 bg-opacity-50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden transform transition-all">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] px-8 py-6 relative">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-white hover:text-gray-200 text-2xl transition-colors p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
                        >
                            <FaTimes />
                        </button>
                        <div className="flex items-center gap-4 text-white">
                            <FaTasks className="text-3xl animate-bounce" />
                            <div>
                                <h2 className="text-2xl font-bold mb-1">{task.taskTitle}</h2>
                                <p className="text-lg opacity-90">{task.serviceTitle}</p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="max-h-[calc(90vh-140px)] overflow-y-auto p-8">
                        {/* Status and Price Bar */}
                        <div className="flex items-center justify-between mb-8 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border">
                            <div className="flex items-center gap-3">
                                {getStatusIcon(task.status)}
                                <span className={`px-4 py-2 rounded-full font-semibold text-sm ${getStatusColor(task.status)}`}>
                                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 bg-gradient-to-r from-[#F48B0C] to-[#E7B6FE] text-white px-6 py-3 rounded-full">
                                <FaDollarSign className="text-xl" />
                                <span className="text-2xl font-bold">{task.price}</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FaInfoCircle className="text-[#8560F1]" />
                                Task Description
                            </h3>
                            <p className="text-gray-600 text-lg leading-relaxed bg-gray-50 p-6 rounded-2xl">
                                {task.taskDescription}
                            </p>
                        </div>

                        {/* Key Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border">
                                <div className="flex items-center gap-3 mb-3">
                                    <FaMapMarkerAlt className="text-2xl text-[#8560F1]" />
                                    <h4 className="text-lg font-semibold text-gray-800">Location</h4>
                                </div>
                                <p className="text-gray-600 text-lg">{task.location}</p>
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border">
                                <div className="flex items-center gap-3 mb-3">
                                    <FaClock className="text-2xl text-[#8560F1]" />
                                    <h4 className="text-lg font-semibold text-gray-800">Schedule</h4>
                                </div>
                                <p className="text-gray-600 text-lg">{task.schedule}</p>
                            </div>

                            <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-2xl border">
                                <div className="flex items-center gap-3 mb-3">
                                    <FaCalendarAlt className="text-2xl text-[#8560F1]" />
                                    <h4 className="text-lg font-semibold text-gray-800">Posted</h4>
                                </div>
                                <p className="text-gray-600 text-lg">{formatDate(task.createdAt)}</p>
                            </div>

                            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-2xl border">
                                <div className="flex items-center gap-3 mb-3">
                                    <FaExclamationTriangle className="text-2xl text-[#F48B0C]" />
                                    <h4 className="text-lg font-semibold text-gray-800">Extra Charges</h4>
                                </div>
                                <p className={`text-lg font-semibold ${task.extraCharge ? 'text-orange-600' : 'text-green-600'}`}>
                                    {task.extraCharge ? 'May Apply' : 'Fixed Price'}
                                </p>
                            </div>
                        </div>

                        {/* Client Information */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FaUser className="text-[#8560F1]" />
                                Client Information
                            </h3>
                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-2xl border">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] rounded-full flex items-center justify-center">
                                        <FaUser className="text-2xl text-white" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800">{task.client.fullName}</h4>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <FaEnvelope className="text-[#8560F1]" />
                                            <span>{task.client.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Information */}
                        {task.additionalInfo && (
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <FaInfoCircle className="text-[#8560F1]" />
                                    Additional Information
                                </h3>
                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border">
                                    <p className="text-gray-600 text-lg leading-relaxed">{task.additionalInfo}</p>
                                </div>
                            </div>
                        )}

                        {/* Media Section */}
                        {(task.photos?.length > 0 || task.video) && (
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <FaImages className="text-[#8560F1]" />
                                    Media
                                </h3>

                                {/* Photos */}
                                {task.photos?.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="text-lg font-semibold text-gray-700 mb-3">Photos</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {task.photos.map((photo, index) => (
                                                <div key={index} className="relative group overflow-hidden rounded-2xl shadow-lg">
                                                    <img
                                                        src={photo}
                                                        alt={`Task photo ${index + 1}`}
                                                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        <div className="absolute bottom-2 left-2 text-white text-sm font-medium">
                                                            Photo {index + 1}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Video */}
                                {task.video && (
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-700 mb-3">Video</h4>
                                        <div className="relative group overflow-hidden rounded-2xl shadow-lg">
                                            <video
                                                src={task.video}
                                                controls
                                                className="w-full h-64 object-cover rounded-2xl"
                                            >
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Bids Section */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FaGavel className="text-[#8560F1]" />
                                Bids ({task.bids?.length || 0})
                            </h3>
                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-2xl border text-center">
                                {task.bids?.length > 0 ? (
                                    <p className="text-gray-600 text-lg">
                                        This task has received {task.bids.length} bid{task.bids.length !== 1 ? 's' : ''}
                                    </p>
                                ) : (
                                    <p className="text-gray-500 text-lg">No bids received yet</p>
                                )}
                            </div>
                        </div>
                        {/* Footer */}
                        <div className="bg-gray-50 px-8 py-6 border-t">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    Last updated: {formatDate(task.updatedAt)}
                                </div>
                                <button
                                    onClick={onClose}
                                    className="bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] text-white px-6 py-3 rounded-full hover:from-[#F48B0C] hover:to-[#E7B6FE] transition-all duration-300 font-semibold"
                                >
                                    Close Details
                                </button>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default TaskDetailsModal;