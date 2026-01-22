// components/dashboard/admin/TaskDetailModal.tsx
import React, { useState } from 'react';
import { format } from 'date-fns';
import {
    FiX,
    FiEdit2,
    FiTrash2,
    FiUser,
    FiMapPin,
    FiClock,
    FiDollarSign,
    FiCalendar,
    FiMessageSquare,
    FiFileText,
    FiCheckCircle,
    FiAlertCircle,
    FiCreditCard,
    FiChevronRight,
    FiMail,
    FiPhone,
    FiHash,
    FiInfo,
    FiExternalLink,
    FiShield
} from 'react-icons/fi';

interface Task {
    _id: string;
    taskTitle: string;
    taskDescription: string;
    serviceTitle?: string;
    location: string;
    schedule: string;
    status: string;
    price: number;
    estimatedTime?: string;
    additionalInfo?: string;
    offerDeadline?: string;
    extraCharge?: number;
    client: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        profilePicture?: string;
        createdAt?: string;
    };
    acceptedBy?: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        profilePicture?: string;
    };
    bids: Array<{
        _id: string;
        taskerId: {
            _id: string;
            firstName: string;
            lastName: string;
            email: string;
            profilePicture?: string;
        };
        offerPrice?: number;
        price?: number;
        message?: string;
        createdAt: string;
    }>;
    comments?: Array<{
        _id: string;
        userId: {
            firstName: string;
            lastName: string;
            profilePicture?: string;
        };
        content: string;
        createdAt: string;
        isBlocked?: boolean;
    }>;
    payment?: {
        status: string;
        paymentIntentId?: string;
        totalClientPays?: number;
        taskerReceives?: number;
        taskerPayout?: number;
        applicationFee?: number;
        refundedAt?: Date;
        refundReason?: string;
    };
    createdAt: string;
    completedAt?: string;
}

interface Props {
    task: Task;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

const getStatusConfig = (status: string) => {
    const configs: Record<string, { bg: string; text: string; dot: string }> = {
        pending: { bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-700 dark:text-amber-400', dot: 'bg-amber-500' },
        'in progress': { bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-700 dark:text-blue-400', dot: 'bg-blue-500' },
        completed: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500' },
        requested: { bg: 'bg-violet-50 dark:bg-violet-500/10', text: 'text-violet-700 dark:text-violet-400', dot: 'bg-violet-500' },
        'not completed': { bg: 'bg-orange-50 dark:bg-orange-500/10', text: 'text-orange-700 dark:text-orange-400', dot: 'bg-orange-500' },
        declined: { bg: 'bg-red-50 dark:bg-red-500/10', text: 'text-red-700 dark:text-red-400', dot: 'bg-red-500' },
        cancelled: { bg: 'bg-gray-50 dark:bg-gray-500/10', text: 'text-gray-700 dark:text-gray-400', dot: 'bg-gray-500' },
    };
    return configs[status] || configs.pending;
};

const getScheduleConfig = (schedule: string) => {
    const configs: Record<string, { icon: string; color: string }> = {
        Flexible: { icon: '🕐', color: 'text-emerald-600 dark:text-emerald-400' },
        Schedule: { icon: '📅', color: 'text-blue-600 dark:text-blue-400' },
        Urgent: { icon: '⚡', color: 'text-red-600 dark:text-red-400' },
    };
    return configs[schedule] || { icon: '📋', color: 'text-gray-600' };
};

const TaskDetailModal: React.FC<Props> = ({ task, onClose, onEdit, onDelete }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'bids' | 'comments' | 'payment'>('overview');
    const [selectedBid, setSelectedBid] = useState<string | null>(null);

    const statusConfig = getStatusConfig(task.status);
    const scheduleConfig = getScheduleConfig(task.schedule);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: FiFileText, count: null },
        { id: 'bids', label: 'Bids', icon: FiDollarSign, count: task.bids?.length || 0 },
        { id: 'comments', label: 'Comments', icon: FiMessageSquare, count: task.comments?.length || 0 },
        { id: 'payment', label: 'Payment', icon: FiCreditCard, count: null },
    ];

    const getPaymentStatusIcon = () => {
        switch (task.payment?.status) {
            case 'captured':
            case 'succeeded':
                return <FiCheckCircle className="text-emerald-500" size={20} />;
            case 'refunded':
                return <FiAlertCircle className="text-red-500" size={20} />;
            default:
                return <FiClock className="text-amber-500" size={20} />;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col">

                {/* Top Bar - Minimal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig.bg}`}>
                            <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
                            <span className={`text-sm font-medium capitalize ${statusConfig.text}`}>
                                {task.status}
                            </span>
                        </div>
                        <span className="text-gray-300 dark:text-gray-600">|</span>
                        <span className={`text-sm font-medium ${scheduleConfig.color}`}>
                            {scheduleConfig.icon} {task.schedule}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={onEdit}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all duration-200"
                            title="Edit"
                        >
                            <FiEdit2 size={18} />
                        </button>
                        <button
                            onClick={onDelete}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all duration-200"
                            title="Delete"
                        >
                            <FiTrash2 size={18} />
                        </button>
                        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                        >
                            <FiX size={18} />
                        </button>
                    </div>
                </div>

                {/* Title Section */}
                <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                        {task.taskTitle}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1.5">
                            <FiHash size={14} />
                            {task._id.slice(-8).toUpperCase()}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <FiCalendar size={14} />
                            {format(new Date(task.createdAt), 'MMM d, yyyy')}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <FiMapPin size={14} />
                            {task.location}
                        </span>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="px-6 border-b border-gray-100 dark:border-gray-800 ">
                    <nav className="flex gap-1 -mb-px overflow-x-scroll">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all  duration-200 ${activeTab === tab.id
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                    }`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                                {tab.count !== null && tab.count > 0 && (
                                    <span className={`px-1.5 py-0.5 text-xs rounded-full ${activeTab === tab.id
                                        ? 'bg-blue-100 text-emerald-600 dark:bg-blue-500/20 dark:text-emerald-400'
                                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                        }`}>
                                        {tab.count}
                                    </span>
                                )}
                                {activeTab === tab.id && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500  hover:bg-emerald-600 rounded-full" />
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-6">

                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                {/* Two Column Layout */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                                    {/* Main Content - Left Side */}
                                    <div className="lg:col-span-2 space-y-6">

                                        {/* Description Card */}
                                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
                                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                                <FiFileText size={16} className="text-gray-400" />
                                                Description
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                                                {task.taskDescription}
                                            </p>
                                        </div>

                                        {/* Additional Info */}
                                        {task.additionalInfo && (
                                            <div className="bg-amber-50 dark:bg-amber-500/10 rounded-xl p-5 border border-amber-100 dark:border-amber-500/20">
                                                <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-3 flex items-center gap-2">
                                                    <FiInfo size={16} />
                                                    Additional Information
                                                </h3>
                                                <p className="text-amber-700 dark:text-amber-300 text-sm leading-relaxed">
                                                    {task.additionalInfo}
                                                </p>
                                            </div>
                                        )}

                                        {/* Quick Stats */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                                                        <FiDollarSign className="text-emerald-600 dark:text-emerald-400" size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Budget</p>
                                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                            ${task.price?.toFixed(0)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                                                        <FiDollarSign className="text-blue-600 dark:text-blue-400" size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Bids</p>
                                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                            {task.bids?.length || 0}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {task.estimatedTime && (
                                                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center">
                                                            <FiClock className="text-violet-600 dark:text-violet-400" size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                                                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                                {task.estimatedTime}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {task.extraCharge !== undefined && task.extraCharge > 0 && (
                                                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center">
                                                            <FiDollarSign className="text-orange-600 dark:text-orange-400" size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">Extra</p>
                                                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                                +${task.extraCharge}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Sidebar - Right Side */}
                                    <div className="space-y-4">

                                        {/* Client Card */}
                                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                                            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
                                                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Client
                                                </h3>
                                            </div>
                                            <div className="p-4">
                                                {task.client ? (
                                                    <div className="flex items-start gap-3">
                                                        {task.client.profilePicture ? (
                                                            <img
                                                                src={task.client.profilePicture}
                                                                alt=""
                                                                className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700"
                                                            />
                                                        ) : (
                                                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium">
                                                                {task.client.firstName?.[0]}{task.client.lastName?.[0]}
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-gray-900 dark:text-white truncate">
                                                                {task.client.firstName} {task.client.lastName}
                                                            </p>
                                                            <a href={`mailto:${task.client.email}`} className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 truncate mt-0.5">
                                                                <FiMail size={12} />
                                                                <span className="truncate">{task.client.email}</span>
                                                            </a>
                                                            {task.client.phone && (
                                                                <a href={`tel:${task.client.phone}`} className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mt-0.5">
                                                                    <FiPhone size={12} />
                                                                    {task.client.phone}
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-gray-400 italic">No client data</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Tasker Card */}
                                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                                            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
                                                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Assigned Tasker
                                                </h3>
                                            </div>
                                            <div className="p-4">
                                                {task.acceptedBy ? (
                                                    <div className="flex items-start gap-3">
                                                        {task.acceptedBy.profilePicture ? (
                                                            <img
                                                                src={task.acceptedBy.profilePicture}
                                                                alt=""
                                                                className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-100 dark:ring-emerald-500/30"
                                                            />
                                                        ) : (
                                                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-medium">
                                                                {task.acceptedBy.firstName?.[0]}{task.acceptedBy.lastName?.[0]}
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-1.5">
                                                                <p className="font-medium text-gray-900 dark:text-white truncate">
                                                                    {task.acceptedBy.firstName} {task.acceptedBy.lastName}
                                                                </p>
                                                                <FiCheckCircle className="text-emerald-500 flex-shrink-0" size={14} />
                                                            </div>
                                                            <a href={`mailto:${task.acceptedBy.email}`} className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 truncate mt-0.5">
                                                                <FiMail size={12} />
                                                                <span className="truncate">{task.acceptedBy.email}</span>
                                                            </a>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
                                                        <div className="w-11 h-11 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                                            <FiUser size={18} className="text-gray-400" />
                                                        </div>
                                                        <span className="text-sm">Not assigned yet</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Timeline Card */}
                                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                                            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
                                                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Timeline
                                                </h3>
                                            </div>
                                            <div className="p-4 space-y-3">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-500 dark:text-gray-400">Created</span>
                                                    <span className="text-gray-900 dark:text-white font-medium">
                                                        {format(new Date(task.createdAt), 'MMM d, yyyy h:mm a')}
                                                    </span>
                                                </div>
                                                {task.completedAt && (
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-500 dark:text-gray-400">Completed</span>
                                                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                                            {format(new Date(task.completedAt), 'MMM d, yyyy h:mm a')}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Bids Tab */}
                        {activeTab === 'bids' && (
                            <div>
                                {task.bids && task.bids.length > 0 ? (
                                    <div className="space-y-3">
                                        {task.bids.map((bid, index) => (
                                            <div
                                                key={bid._id}
                                                className={`bg-white dark:bg-gray-800 rounded-xl border transition-all duration-200 overflow-hidden ${selectedBid === bid._id
                                                        ? 'border-blue-200 dark:border-blue-500/50 ring-1 ring-blue-100 dark:ring-blue-500/20'
                                                        : 'border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600'
                                                    }`}
                                            >
                                                <div
                                                    className="flex items-center justify-between p-4 cursor-pointer"
                                                    onClick={() => setSelectedBid(selectedBid === bid._id ? null : bid._id)}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-xs font-medium text-gray-400 w-6">
                                                            #{index + 1}
                                                        </span>
                                                        {bid.taskerId?.profilePicture ? (
                                                            <img
                                                                src={bid.taskerId.profilePicture}
                                                                alt=""
                                                                className="w-10 h-10 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white text-sm font-medium">
                                                                {bid.taskerId?.firstName?.[0]}{bid.taskerId?.lastName?.[0]}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-medium text-gray-900 dark:text-white">
                                                                {bid.taskerId?.firstName} {bid.taskerId?.lastName}
                                                            </p>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                {bid.taskerId?.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <div className="text-right">
                                                            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                                                ${(bid.offerPrice || bid.price)?.toFixed(2)}
                                                            </p>
                                                            <p className="text-xs text-gray-400">
                                                                {format(new Date(bid.createdAt), 'MMM d, h:mm a')}
                                                            </p>
                                                        </div>
                                                        <FiChevronRight
                                                            size={18}
                                                            className={`text-gray-400 transition-transform duration-200 ${selectedBid === bid._id ? 'rotate-90' : ''
                                                                }`}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Expanded Content */}
                                                {selectedBid === bid._id && bid.message && (
                                                    <div className="px-4 pb-4 pt-0">
                                                        <div className="ml-10 pl-4 border-l-2 border-gray-100 dark:border-gray-700">
                                                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                                                                Message
                                                            </p>
                                                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                                                {bid.message}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-16">
                                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                                            <FiDollarSign className="text-gray-400" size={28} />
                                        </div>
                                        <p className="text-gray-500 dark:text-gray-400 font-medium">No bids received yet</p>
                                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                            Bids will appear here once taskers make offers
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Comments Tab */}
                        {activeTab === 'comments' && (
                            <div>
                                {task.comments && task.comments.length > 0 ? (
                                    <div className="space-y-4">
                                        {task.comments.map((comment) => (
                                            <div
                                                key={comment._id}
                                                className={`flex gap-3 ${comment.isBlocked ? 'opacity-60' : ''}`}
                                            >
                                                {comment.userId?.profilePicture ? (
                                                    <img
                                                        src={comment.userId.profilePicture}
                                                        alt=""
                                                        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                                                        <FiUser size={14} className="text-gray-500" />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className={`rounded-2xl rounded-tl-md px-4 py-3 ${comment.isBlocked
                                                            ? 'bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20'
                                                            : 'bg-gray-100 dark:bg-gray-800'
                                                        }`}>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {comment.userId?.firstName} {comment.userId?.lastName}
                                                            </span>
                                                            {comment.isBlocked && (
                                                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400">
                                                                    <FiShield size={10} />
                                                                    Blocked
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                                            {comment.content}
                                                        </p>
                                                    </div>
                                                    <span className="text-xs text-gray-400 mt-1 ml-2">
                                                        {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-16">
                                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                                            <FiMessageSquare className="text-gray-400" size={28} />
                                        </div>
                                        <p className="text-gray-500 dark:text-gray-400 font-medium">No comments yet</p>
                                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                            Comments and questions will appear here
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Payment Tab */}
                        {activeTab === 'payment' && (
                            <div>
                                {task.payment?.paymentIntentId || task.payment?.status ? (
                                    <div className="space-y-6">
                                        {/* Payment Status Banner */}
                                        <div className={`flex items-center gap-4 p-4 rounded-xl ${task.payment.status === 'captured' || task.payment.status === 'succeeded'
                                                ? 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20'
                                                : task.payment.status === 'refunded'
                                                    ? 'bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20'
                                                    : 'bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20'
                                            }`}>
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${task.payment.status === 'captured' || task.payment.status === 'succeeded'
                                                    ? 'bg-emerald-100 dark:bg-emerald-500/20'
                                                    : task.payment.status === 'refunded'
                                                        ? 'bg-red-100 dark:bg-red-500/20'
                                                        : 'bg-amber-100 dark:bg-amber-500/20'
                                                }`}>
                                                {getPaymentStatusIcon()}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-medium ${task.payment.status === 'captured' || task.payment.status === 'succeeded'
                                                        ? 'text-emerald-700 dark:text-emerald-400'
                                                        : task.payment.status === 'refunded'
                                                            ? 'text-red-700 dark:text-red-400'
                                                            : 'text-amber-700 dark:text-amber-400'
                                                    }`}>
                                                    Payment {task.payment.status === 'captured' ? 'Successful' : task.payment.status}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Transaction has been processed
                                                </p>
                                            </div>
                                        </div>

                                        {/* Payment Breakdown */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">Client Paid</span>
                                                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                                                        <FiCreditCard className="text-blue-600 dark:text-blue-400" size={16} />
                                                    </div>
                                                </div>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    ${task.payment.totalClientPays?.toFixed(2) || '0.00'}
                                                </p>
                                            </div>

                                            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">Tasker Receives</span>
                                                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                                                        <FiUser className="text-emerald-600 dark:text-emerald-400" size={16} />
                                                    </div>
                                                </div>
                                                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                                    ${(task.payment.taskerReceives || task.payment.taskerPayout)?.toFixed(2) || '0.00'}
                                                </p>
                                            </div>

                                            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">Platform Fee</span>
                                                    <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center">
                                                        <FiShield className="text-violet-600 dark:text-violet-400" size={16} />
                                                    </div>
                                                </div>
                                                <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                                                    ${task.payment.applicationFee?.toFixed(2) || '0.00'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Payment ID */}
                                        {task.payment.paymentIntentId && (
                                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                                            Payment Intent ID
                                                        </p>
                                                        <code className="text-sm text-gray-900 dark:text-white font-mono">
                                                            {task.payment.paymentIntentId}
                                                        </code>
                                                    </div>
                                                    <button
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                                                        onClick={() => navigator.clipboard.writeText(task.payment?.paymentIntentId || '')}
                                                    >
                                                        <FiExternalLink size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Refund Info */}
                                        {task.payment.status === 'refunded' && (
                                            <div className="bg-red-50 dark:bg-red-500/10 rounded-xl p-4 border border-red-100 dark:border-red-500/20">
                                                <h4 className="text-sm font-medium text-red-800 dark:text-red-400 mb-2">
                                                    Refund Information
                                                </h4>
                                                {task.payment.refundedAt && (
                                                    <p className="text-sm text-red-700 dark:text-red-300">
                                                        Refunded on: {format(new Date(task.payment.refundedAt), 'MMM d, yyyy h:mm a')}
                                                    </p>
                                                )}
                                                {task.payment.refundReason && (
                                                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                                        Reason: {task.payment.refundReason}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-16">
                                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                                            <FiCreditCard className="text-gray-400" size={28} />
                                        </div>
                                        <p className="text-gray-500 dark:text-gray-400 font-medium">No payment information</p>
                                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                            Payment details will appear once a transaction is made
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                    <div className="text-xs text-gray-400">
                        Last updated: {format(new Date(task.createdAt), 'MMM d, yyyy h:mm a')}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            Close
                        </button>
                        <button
                            onClick={onEdit}
                            className="px-4 py-2 text-sm font-medium text-white bg-emerald-500  hover:bg-emerald-600 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <FiEdit2 size={14} />
                            Edit Task
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailModal;