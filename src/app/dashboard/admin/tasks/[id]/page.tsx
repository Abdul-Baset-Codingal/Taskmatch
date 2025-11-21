/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client"
import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useGetTaskByIdQuery, useUpdateTaskMutation } from '@/features/api/taskApi';
import { useDispatch, useSelector } from 'react-redux';
import { authApi } from '@/features/auth/authApi';
import { FaArrowLeft, FaSave, FaSpinner, FaTrash, FaUpload, FaEdit, FaPlus, FaUser, FaCamera, FaVideo, FaComment, FaDollarSign, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Navbar from '@/shared/Navbar';

const TaskEditPage = () => {
    const router = useRouter();
    const params = useParams();
    const taskId = params.id as string;

    const { data: taskData, isLoading, error } = useGetTaskByIdQuery(taskId);
    const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        taskTitle: '',
        taskDescription: '',
        additionalInfo: '',
        price: '',
        estimatedTime: '',
        schedule: '',
        location: '',
        status: '',
        serviceId: '',
        serviceTitle: '',
        extraCharge: false,
    });

    const [newPhotos, setNewPhotos] = useState<FileList | null>(null);
    const [newVideo, setNewVideo] = useState<File | null>(null);
    const [photosToRemove, setPhotosToRemove] = useState<string[]>([]);
    const [videoToRemove, setVideoToRemove] = useState(false);

    // Comments editing states
    const [newComment, setNewComment] = useState({ message: '', role: 'admin' as 'admin' | 'client' | 'tasker' });
    const [editingComment, setEditingComment] = useState<{ id: string; message: string } | null>(null);

    // Helper function to get display name from user object or ID
    const getUserDisplay = (user: any): string => {
        if (!user) return 'Unknown';
        if (typeof user === 'string') return user;
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
        return fullName || user.email || user.name || user._id || 'Unknown';
    };

    const getUserInitial = (user: any): string => {
        if (!user) return 'U';
        if (typeof user === 'string') return user.charAt(0).toUpperCase();
        return (user.firstName || user.email || user._id || '').charAt(0).toUpperCase();
    };

    // User fetching
    const [userIds, setUserIds] = useState<string[]>([]);
    useEffect(() => {
        if (taskData) {
            const ids = new Set<string>();
            // Handle client ID
            const rawClient = taskData.client;
            let clientId: string | null = null;
            if (rawClient) {
                if (typeof rawClient === 'string') {
                    clientId = rawClient;
                } else if (rawClient._id && typeof rawClient._id === 'string') {
                    clientId = rawClient._id;
                }
            }
            if (clientId) ids.add(clientId);

            // Handle acceptedBy ID
            const rawAccepted = taskData.acceptedBy;
            let acceptedId: string | null = null;
            if (rawAccepted) {
                if (typeof rawAccepted === 'string') {
                    acceptedId = rawAccepted;
                } else if (rawAccepted._id && typeof rawAccepted._id === 'string') {
                    acceptedId = rawAccepted._id;
                }
            }
            if (acceptedId) ids.add(acceptedId);

            // Comments userIds
            taskData.comments?.forEach((c: any) => {
                if (c.userId && typeof c.userId === 'string') {
                    ids.add(c.userId);
                }
            });

            setUserIds(Array.from(ids));
        }
    }, [taskData]);

    // Fetch users manually
    useEffect(() => {
        if (userIds.length === 0) return;
        userIds.forEach((id) => {
            dispatch(authApi.endpoints.getUserById.initiate(id));
        });
    }, [userIds, dispatch]);

    // Select auth state
    const authState = useSelector((state: any) => state[authApi.reducerPath]);

    // Build userMap from cache
    const userMap = useMemo(() => {
        const map: Record<string, any> = {};
        if (!authState?.queries) return map;
        userIds.forEach((id) => {
            const cacheKey = `getUserById("${id}")`;
            const queryState = authState.queries[cacheKey];
            map[id] = queryState?.data;
        });
        return map;
    }, [userIds, authState]);

    // Client and Accepted displays - ensure strings
    const rawClient = taskData?.client;
    let clientId: string | null = null;
    if (rawClient) {
        if (typeof rawClient === 'string') {
            clientId = rawClient;
        } else if (rawClient._id && typeof rawClient._id === 'string') {
            clientId = rawClient._id;
        }
    }
    const clientUser = clientId ? userMap[clientId] : null;
    const clientDisplay = getUserDisplay(clientUser || rawClient);
    const clientInitial = getUserInitial(clientUser || rawClient);

    const rawAccepted = taskData?.acceptedBy;
    let acceptedId: string | null = null;
    if (rawAccepted) {
        if (typeof rawAccepted === 'string') {
            acceptedId = rawAccepted;
        } else if (rawAccepted._id && typeof rawAccepted._id === 'string') {
            acceptedId = rawAccepted._id;
        }
    }
    const acceptedUser = acceptedId ? userMap[acceptedId] : null;
    const acceptedDisplay = rawAccepted ? getUserDisplay(acceptedUser || rawAccepted) : 'None';
    const acceptedInitial = getUserInitial(acceptedUser || rawAccepted);

    useEffect(() => {
        if (taskData) {
            setFormData({
                taskTitle: taskData.taskTitle || '',
                taskDescription: taskData.taskDescription || '',
                additionalInfo: taskData.additionalInfo || '',
                price: taskData.price?.toString() || '',
                estimatedTime: taskData.estimatedTime || '',
                schedule: taskData.schedule || '',
                location: taskData.location || '',
                status: taskData.status || '',
                serviceId: taskData.serviceId || '',
                serviceTitle: taskData.serviceTitle || '',
                extraCharge: taskData.extraCharge || false,
            });
        }
    }, [taskData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as any;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'photos' | 'video') => {
        if (e.target.files) {
            if (type === 'photos') {
                setNewPhotos(e.target.files);
            } else {
                setNewVideo(e.target.files?.[0] || null);
            }
        }
    };

    const handleRemovePhoto = (url: string) => {
        setPhotosToRemove((prev) => [...prev, url]);
    };

    const handleRemoveVideo = () => {
        setVideoToRemove(true);
    };

    // Comments handlers
    const handleNewCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewComment((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddComment = async () => {
        if (!newComment.message.trim()) return;
        try {
            const newC = {
                message: newComment.message,
                role: newComment.role,
                userId: null, // TODO: Set to current admin user ID
                createdAt: new Date().toISOString(),
                replies: [],
            };
            await updateTask({ taskId, updateData: { comments: [...(taskData.comments || []), newC] } }).unwrap();
            setNewComment({ message: '', role: 'admin' });
            toast.success('Comment added successfully!');
        } catch (err) {
            toast.error('Failed to add comment.');
        }
    };

    const startEditComment = (comment: any) => {
        setEditingComment({ id: comment._id, message: comment.message });
    };

    const handleEditCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditingComment((prev) => ({ ...prev!, message: e.target.value }));
    };

    const saveEditComment = async () => {
        if (!editingComment) return;
        try {
            const updatedComments = (taskData.comments || []).map((c: any) =>
                c._id === editingComment.id ? { ...c, message: editingComment.message } : c
            );
            await updateTask({ taskId, updateData: { comments: updatedComments } }).unwrap();
            setEditingComment(null);
            toast.success('Comment updated successfully!');
        } catch (err) {
            toast.error('Failed to update comment.');
        }
    };

    const cancelEditComment = () => {
        setEditingComment(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Prepare update data (excluding media for now; assume API handles multipart separately or adjust as needed)
            const updatePayload = {
                ...formData,
                price: parseFloat(formData.price),
                estimatedTime: formData.estimatedTime ? parseInt(formData.estimatedTime) : undefined,
                photosToRemove,
                videoToRemove,
                // Media uploads would need separate handling, e.g., presigned URLs or FormData
            };

            await updateTask({ taskId, updateData: updatePayload }).unwrap();
            toast.success('Task updated successfully!');
            router.back(); // Or router.push('/dashboard/admin/tasks');
        } catch (err) {
            toast.error('Failed to update task.');
        }
    };

    const handleCancel = () => {
        router.back();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <FaSpinner className="text-4xl text-blue-500 animate-spin" />
            </div>
        );
    }

    if (error || !taskData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Task not found</h2>
                    <button onClick={handleCancel} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                        Back to Tasks
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between lg:flex-row flex-col">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleCancel}
                            className="p-3 text-gray-500 hover:text-gray-700 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                        >
                            <FaArrowLeft className="text-xl" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Edit Task #{taskId}</h1>
                            <p className="text-gray-600 mt-1">Update task details and media</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleCancel}
                            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isUpdating}
                            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                        >
                            {isUpdating ? <FaSpinner className="animate-spin" /> : <FaSave />}
                            Save Changes
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Basic Info Section */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <FaUser className="text-blue-500" />
                                Basic Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Task Title *</label>
                                    <input
                                        type="text"
                                        name="taskTitle"
                                        value={formData.taskTitle}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
                                        <select
                                            name="serviceId"
                                            value={formData.serviceId}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        >
                                            <option value="handyMan">Handyman, Renovation & Moving Help</option>
                                            <option value="plumbing">Plumbing</option>
                                            <option value="electrical">Electrical</option>
                                        </select>
                                    </div>
                                    <input
                                        type="text"
                                        name="serviceTitle"
                                        value={formData.serviceTitle}
                                        onChange={handleInputChange}
                                        placeholder="Custom service title"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="in progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                        <option value="requested">Requested</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Schedule</label>
                                    <select
                                        name="schedule"
                                        value={formData.schedule}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    >
                                        <option value="Flexible">Flexible</option>
                                        <option value="Urgent">Urgent</option>
                                        <option value="Today">Today</option>
                                        <option value="Tomorrow">Tomorrow</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                    <div className="relative">
                                        <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Task Description *</label>
                                    <textarea
                                        name="taskDescription"
                                        value={formData.taskDescription}
                                        onChange={handleInputChange}
                                        rows={4}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Info</label>
                                    <textarea
                                        name="additionalInfo"
                                        value={formData.additionalInfo}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Pricing Section */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <FaDollarSign className="text-green-500" />
                                <FaClock className="text-orange-500" />
                                Pricing & Time
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            min="0"
                                            step="0.01"
                                            className="w-full pl-7 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Time (hours)</label>
                                    <input
                                        type="number"
                                        name="estimatedTime"
                                        value={formData.estimatedTime}
                                        onChange={handleInputChange}
                                        min="0"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                                        <input
                                            type="checkbox"
                                            name="extraCharge"
                                            checked={formData.extraCharge}
                                            onChange={handleInputChange}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                                        />
                                        <span className="text-sm text-gray-700 font-medium">Extra Charge Applicable</span>
                                    </label>
                                </div>
                            </div>
                        </section>

                        {/* Media Section */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <FaCamera className="text-purple-500" />
                                <FaVideo className="text-pink-500" />
                                Media
                            </h2>
                            <div className="space-y-6">
                                {/* Photos */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-4">Photos</label>
                                    <label className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                                        <FaUpload className="text-gray-400" />
                                        <span className="text-sm text-gray-600 font-medium">Add Photos</span>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'photos')}
                                            className="hidden"
                                        />
                                    </label>
                                    {(taskData.photos && taskData.photos.length > 0) || (newPhotos && newPhotos.length > 0) ? (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                            {taskData.photos?.map((photo: string, index: number) => (
                                                <div key={`existing-${index}`} className="relative group">
                                                    <Image
                                                        src={photo}
                                                        alt={`Task photo ${index + 1}`}
                                                        width={150}
                                                        height={120}
                                                        className="w-full h-24 object-cover rounded-xl"
                                                    />
                                                    {!photosToRemove.includes(photo) && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemovePhoto(photo)}
                                                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm"
                                                        >
                                                            <FaTrash className="text-xs" />
                                                        </button>
                                                    )}
                                                    {photosToRemove.includes(photo) && (
                                                        <div className="absolute inset-0 bg-red-100 rounded-xl flex items-center justify-center">
                                                            <span className="text-red-600 text-xs font-medium">Removing</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            {newPhotos && Array.from(newPhotos).map((file, index) => (
                                                <div key={`new-${index}`} className="relative bg-gray-100 rounded-xl overflow-hidden">
                                                    <Image
                                                        src={URL.createObjectURL(file)}
                                                        alt={file.name}
                                                        width={150}
                                                        height={120}
                                                        className="w-full h-24 object-cover"
                                                    />
                                                    <span className="absolute bottom-1 right-1 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                                                        New
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-sm mt-2">No photos added yet.</p>
                                    )}
                                </div>

                                {/* Video */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-4">Video</label>
                                    <label className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                                        <FaUpload className="text-gray-400" />
                                        <span className="text-sm text-gray-600 font-medium">Add Video</span>
                                        <input
                                            type="file"
                                            accept="video/*"
                                            onChange={(e) => handleFileChange(e, 'video')}
                                            className="hidden"
                                        />
                                    </label>
                                    {taskData.video && !videoToRemove && (
                                        <div className="relative group mt-4">
                                            <video
                                                src={taskData.video}
                                                controls
                                                className="w-full max-w-sm h-32 object-cover rounded-xl"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleRemoveVideo}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm"
                                            >
                                                <FaTrash className="text-xs" />
                                            </button>
                                        </div>
                                    )}
                                    {videoToRemove && <p className="text-red-600 text-sm mt-2 font-medium">Video will be removed</p>}
                                    {newVideo && (
                                        <div className="relative mt-4 bg-gray-100 rounded-xl overflow-hidden">
                                            <video
                                                src={URL.createObjectURL(newVideo)}
                                                controls
                                                className="w-full max-w-sm h-32 object-cover"
                                            />
                                            <span className="absolute bottom-1 right-1 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                                                New
                                            </span>
                                        </div>
                                    )}
                                    {!taskData.video && !newVideo && !videoToRemove && (
                                        <p className="text-gray-500 text-sm mt-2">No video added yet.</p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Client & Bids Section */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <FaUser className="text-indigo-500" />
                                Client & Bids
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
                                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                                        <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                                            {clientInitial}
                                        </div>
                                        <span className="text-sm text-gray-900 font-medium">{clientDisplay}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Accepted By</label>
                                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                                        <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                                            {acceptedInitial}
                                        </div>
                                        <span className="text-sm text-gray-900 font-medium">{acceptedDisplay}</span>
                                    </div>
                                </div>
                                {taskData.bids && taskData.bids.length > 0 && (
                                    <div className="md:col-span-2">
                                        <p className="text-sm text-gray-600 flex items-center gap-1">
                                            <span>Bids:</span>
                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">{taskData.bids.length}</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar for Comments */}
                    <div className="lg:col-span-1">
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <FaComment className="text-teal-500" />
                                Comments ({taskData.comments?.length || 0})
                            </h2>

                            <div className="space-y-4 max-h-96 overflow-y-auto mb-6 pr-2">
                                {taskData.comments?.map((comment: any, index: number) => {
                                    const commenter = comment.userId ? userMap[comment.userId] : null;
                                    const commenterDisplay = getUserDisplay(commenter || comment.userId);
                                    const commenterInitial = getUserInitial(commenter || comment.userId);

                                    const roleColor = {
                                        admin: 'bg-purple-100 text-purple-800 border-purple-200',
                                        client: 'bg-blue-100 text-blue-800 border-blue-200',
                                        tasker: 'bg-green-100 text-green-800 border-green-200',
                                    }[comment.role] || 'bg-gray-100 text-gray-800 border-gray-200';

                                    // Block handler
                                    const blockComment = async () => {
                                        if (!confirm("Block this comment? It will be hidden from all users.")) return;

                                        const updatedComments = taskData.comments.map((c: any) =>
                                            c._id === comment._id
                                                ? { ...c, isBlocked: true, blockReason: "Violates community guidelines" }
                                                : c
                                        );

                                        try {
                                            await updateTask({ taskId, updateData: { comments: updatedComments } }).unwrap();
                                            toast.success("Comment blocked");
                                        } catch {
                                            toast.error("Failed to block comment");
                                        }
                                    };

                                    const blockReply = async (replyId: string) => {
                                        if (!confirm("Block this reply?")) return;

                                        const updatedComments = taskData.comments.map((c: any) => {
                                            if (c._id === comment._id) {
                                                return {
                                                    ...c,
                                                    replies: c.replies.map((r: any) =>
                                                        r._id === replyId ? { ...r, isBlocked: true } : r
                                                    ),
                                                };
                                            }
                                            return c;
                                        });

                                        try {
                                            await updateTask({ taskId, updateData: { comments: updatedComments } }).unwrap();
                                            toast.success("Reply blocked");
                                        } catch {
                                            toast.error("Failed to block reply");
                                        }
                                    };

                                    // Edit mode
                                    if (editingComment?.id === comment._id) {
                                        return (
                                            <div key={comment._id || index} className="border-l-4 border-blue-500 bg-gray-50 p-4 rounded-xl space-y-3">
                                                <textarea
                                                    value={editingComment.message}
                                                    onChange={handleEditCommentChange}
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                                                />
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={saveEditComment}
                                                        disabled={isUpdating}
                                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={cancelEditComment}
                                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div
                                            key={comment._id || index}
                                            className={`border-l-4 pl-4 p-4 rounded-xl ${roleColor} relative group`}
                                        >
                                            {/* Block Button - Only show if not blocked */}
                                            {!comment.isBlocked && (
                                                <button
                                                    onClick={blockComment}
                                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-800 text-xs font-semibold hover:underline"
                                                    title="Block this comment"
                                                >
                                                    Block
                                                </button>
                                            )}

                                            <div className="flex items-start gap-3 mb-3">
                                                <div className="w-8 h-8 bg-gray-300 text-gray-700 rounded-full flex items-center justify-center text-xs font-medium">
                                                    {commenterInitial}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-gray-900">{commenterDisplay}</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-white/80">
                                                            {comment.role}
                                                        </span>
                                                        {comment.isBlocked && (
                                                            <span className="text-red-600 font-bold text-xs">BLOCKED</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Blocked Message */}
                                            {comment.isBlocked ? (
                                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm italic">
                                                    This message was removed for violating our community guidelines.
                                                </div>
                                            ) : (
                                                <>
                                                    <p className="text-sm text-gray-700 mb-2 leading-relaxed">{comment.message}</p>
                                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                                        <span>{new Date(comment.createdAt).toLocaleString()}</span>
                                                        <button
                                                            onClick={() => startEditComment(comment)}
                                                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                                        >
                                                            <FaEdit className="text-xs" /> Edit
                                                        </button>
                                                    </div>
                                                </>
                                            )}

                                            {/* Replies */}
                                            {comment.replies?.length > 0 && (
                                                <div className="mt-4 ml-10 space-y-3 border-l-2 border-gray-200 pl-4">
                                                    {comment.replies.map((reply: any) => {
                                                        const replyUser = reply.userId ? userMap[reply.userId] : null;
                                                        const replyDisplay = getUserDisplay(replyUser || reply.userId);
                                                        const replyInitial = getUserInitial(replyUser || reply.userId);

                                                        return (
                                                            <div key={reply._id} className="bg-gray-50 p-3 rounded-lg relative group">
                                                                {!reply.isBlocked && (
                                                                    <button
                                                                        onClick={() => blockReply(reply._id)}
                                                                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 text-xs font-semibold hover:underline"
                                                                    >
                                                                        Block
                                                                    </button>
                                                                )}

                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <div className="w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs">
                                                                        {replyInitial}
                                                                    </div>
                                                                    <span className="text-xs font-medium text-gray-800">{replyDisplay}</span>
                                                                    <span className="text-xs text-gray-500">
                                                                        · {new Date(reply.createdAt).toLocaleTimeString()}
                                                                    </span>
                                                                </div>

                                                                {reply.isBlocked ? (
                                                                    <p className="text-xs italic text-red-600">
                                                                        This reply was removed for violating our guidelines.
                                                                    </p>
                                                                ) : (
                                                                    <p className="text-sm text-gray-700">{reply.message}</p>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                }) || (
                                        <p className="text-gray-500 text-sm text-center py-8">No comments yet.</p>
                                    )}
                            </div>

                            {/* Add New Comment */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Add New Comment</h3>
                                <div className="space-y-3">
                                    <select
                                        name="role"
                                        value={newComment.role}
                                        onChange={handleNewCommentChange}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="client">Client</option>
                                        <option value="tasker">Tasker</option>
                                    </select>
                                    <textarea
                                        name="message"
                                        value={newComment.message}
                                        onChange={handleNewCommentChange}
                                        placeholder="Enter your comment..."
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                                    />
                                    <button
                                        onClick={handleAddComment}
                                        disabled={isUpdating || !newComment.message.trim()}
                                        className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 text-sm font-medium"
                                    >
                                        <FaPlus /> Add Comment
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskEditPage;