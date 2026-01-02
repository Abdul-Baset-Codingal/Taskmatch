/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { usePostTaskMutation } from "@/features/api/taskApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import TaskConfirmationModal from "./TaskConfirmationModal";
import { checkLoginStatus } from "@/resusable/CheckUser";
import { updateTaskField, setPhotos } from "@/features/taskForm/taskFormSlice";

type Props = {
    onBack: () => void;
};

const servicesData = {
    handyMan: {
        title: "Handyman & Home Repairs",
    },
    PetServices: {
        title: "Pet Services",
    },
    CompleteCleaning: {
        title: "Cleaning Services",
    },
    plumbingElectricalHVAC: {
        title: "Plumbing, Electrical & HVAC (PEH)",
    },
    automotiveServices: {
        title: "Automotive Services",
    },
    beautyWellness: {
        title: "All Other Specialized Services",
    },
} as const;

const InputField = ({ field, value, type = "text", placeholder, className = "w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#109C3D]", onChange }: { field: string; value: any; type?: string; placeholder?: string; className?: string; onChange: (value: string) => void }) => (
    <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
    />
);

const TextAreaField = ({ field, value, placeholder, className = "w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#109C3D] resize-none", onChange }: { field: string; value: any; placeholder?: string; className?: string; onChange: (value: string) => void }) => (
    <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
        rows={3}
    />
);

const SelectField = ({ value, onChange, options, placeholder, className = "w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#109C3D]" }: { value: string; onChange: (value: string) => void; options: typeof servicesData; placeholder: string; className?: string }) => (
    <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={className}
    >
        <option value="">{placeholder}</option>
        {Object.entries(options)
            .filter(([key]) => key !== 'SelectYourService')
            .map(([key, { title }]) => (
                <option key={key} value={key}>
                    {title}
                </option>
            ))}
    </select>
);

const dataURLtoBlob = (dataurl: string) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
};

const UrgentTaskSummary = ({ onBack }: Props) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const taskForm = useSelector((state: RootState) => state.taskForm);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [localForm, setLocalForm] = useState(taskForm);
    const [postTask, { isLoading, isError, isSuccess }] = usePostTaskMutation();
    const [isRestoring, setIsRestoring] = useState(false);
    const [roleSwitchModalOpen, setRoleSwitchModalOpen] = useState(false);
    const [switching, setSwitching] = useState(false);
    const [roleToggle, setRoleToggle] = useState<'tasker' | 'client'>('tasker');

    // New state for location and schedule modes
    const [locationType, setLocationType] = useState<'remote' | 'in-person'>('remote');
    const [scheduleType, setScheduleType] = useState<'Schedule' | 'Flexible'>('Flexible');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [province, setProvince] = useState('');
    const [scheduledDate, setScheduledDate] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');


    const taskFormWithDefaults = useMemo(() => ({
        ...taskForm,
        serviceId: taskForm.serviceId || 'handyMan',
        serviceTitle: taskForm.serviceTitle || servicesData['handyMan']?.title || 'Handyman & Home Repairs',
    }), [taskForm]);


    useEffect(() => {
        const fetchUser = async () => {
            const { isLoggedIn, user: fetchedUser } = await checkLoginStatus();
            if (isLoggedIn) {
                setUser(fetchedUser);
                console.log("User object:", fetchedUser);

                const pendingStr = sessionStorage.getItem('pendingTaskForm');
                if (pendingStr) {
                    setIsRestoring(true);
                    try {
                        await restoreAndSubmit(pendingStr);
                    } catch (error) {
                        console.error("Restore failed:", error);
                        toast.error("Failed to restore task. Data may be lost—please refill.");
                        sessionStorage.removeItem('pendingTaskForm');
                    } finally {
                        setIsRestoring(false);
                    }
                }
            }
        };
        fetchUser();
    }, []);

    const handleLocalChange = (field: keyof typeof taskForm, value: any) => {
        setLocalForm((prev) => ({ ...prev, [field]: value }));
    };

    const syncToRedux = () => {
        Object.entries(localForm).forEach(([key, value]) => {
            dispatch(updateTaskField({ field: key as keyof typeof taskForm, value }));
        });

        // Sync location
        if (locationType === 'in-person') {
            const components = [street, city, province].filter(Boolean);
            const fullAddress = components.join(', ');
            dispatch(updateTaskField({ field: 'location', value: fullAddress }));
        } else {
            dispatch(updateTaskField({ field: 'location', value: 'Remote' }));
        }

        // Sync schedule
        if (scheduleType === 'Schedule' && scheduledDate && scheduledTime) {
            dispatch(updateTaskField({ field: 'schedule', value: 'Schedule' }));
            // Combine date and time into ISO string for customDeadline
            const combinedDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
            dispatch(updateTaskField({ field: 'customDeadline', value: combinedDateTime.toISOString() }));
        } else if (scheduleType === 'Schedule' && scheduledDate) {
            // If only date is provided
            dispatch(updateTaskField({ field: 'schedule', value: 'Schedule' }));
            const combinedDateTime = new Date(`${scheduledDate}T00:00`);
            dispatch(updateTaskField({ field: 'customDeadline', value: combinedDateTime.toISOString() }));
        } else {
            dispatch(updateTaskField({ field: 'schedule', value: 'Flexible' }));
            dispatch(updateTaskField({ field: 'customDeadline', value: '' }));
        }
    };

    const savePendingTask = async () => {
        const photoPromises = (taskForm.photos || []).map((photo) => {
            if (typeof photo === 'string') {
                return Promise.resolve({ isString: true, value: photo });
            }
            if (photo instanceof File || photo instanceof Blob) {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve({ name: photo.name || 'photo.jpg', type: photo.type || 'image/jpeg', dataURL: reader.result as string });
                    reader.onerror = reject;
                    reader.readAsDataURL(photo);
                });
            }
            return Promise.resolve(null);
        });

        const photosMeta = (await Promise.all(photoPromises)).filter(Boolean);

        let videoMeta = null;
        const video = taskForm.video;
        if (typeof video === 'string') {
            videoMeta = { isString: true, value: video };
        } else if (video instanceof File || video instanceof Blob) {
            videoMeta = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve({ name: video.name || 'video.mp4', type: video.type || 'video/mp4', dataURL: reader.result as string });
                reader.onerror = reject;
                reader.readAsDataURL(video);
            });
        }

        const toStore = {
            ...taskForm,
            photos: photosMeta,
            video: videoMeta,
        };

        sessionStorage.setItem('pendingTaskForm', JSON.stringify(toStore));
    };

    const restoreAndSubmit = async (storedStr: string) => {
        console.log("Starting restore...");
        const stored = JSON.parse(storedStr);
        console.log(`Restoring ${stored.photos?.length || 0} photos, video: ${!!stored.video}`);

        Object.entries(stored).forEach(([key, value]) => {
            if (key !== 'photos' && key !== 'video') {
                dispatch(updateTaskField({ field: key as any, value }));
            }
        });

        const photoPromises = stored.photos.map(async (meta: any) => {
            if (meta.isString) {
                return meta.value;
            }
            const blob = dataURLtoBlob(meta.dataURL);
            return new File([blob], meta.name, { type: meta.type });
        });
        const restoredPhotos = await Promise.all(photoPromises);
        dispatch(setPhotos(restoredPhotos));

        let restoredVideo = null;
        const videoMeta = stored.video;
        if (videoMeta) {
            if (videoMeta.isString) {
                restoredVideo = videoMeta.value;
            } else {
                const blob = dataURLtoBlob(videoMeta.dataURL);
                restoredVideo = new File([blob], videoMeta.name, { type: videoMeta.type });
            }
            dispatch(updateTaskField({ field: "video", value: restoredVideo }));
        }

        sessionStorage.removeItem('pendingTaskForm');

        console.log("Restore complete, submitting...");
        await handleSubmit();
    };

    const handleSubmit = async () => {
        const formData = new FormData();

        // Use defaults if not set
        const serviceId = taskForm.serviceId || 'handyMan';
        const serviceTitle = taskForm.serviceTitle || servicesData['handyMan']?.title || 'Handyman & Home Repairs';

        formData.append("serviceId", serviceId);
        formData.append("serviceTitle", serviceTitle);
        formData.append("taskTitle", taskForm.taskTitle || "");
        formData.append("estimatedTime", taskForm.estimatedTime ? String(taskForm.estimatedTime) : "1");
        formData.append("taskDescription", taskForm.taskDescription || "");
        formData.append("location", taskForm.location || "");
        formData.append("schedule", taskForm.schedule || "");
        formData.append("extraCharge", (taskForm.schedule === "Urgent").toString());
        formData.append("additionalInfo", taskForm.additionalInfo || "");
        formData.append("price", taskForm.price || "");
        formData.append("client", user?._id || "");

        let finalDeadline: Date | null = null;
        const now = new Date();
        if (taskForm.schedule === "Today") {
            switch (taskForm.offerDeadline) {
                case "1 Hour":
                    finalDeadline = new Date(now.getTime() + 1 * 60 * 60 * 1000);
                    break;
                case "3 Hours":
                    finalDeadline = new Date(now.getTime() + 3 * 60 * 60 * 1000);
                    break;
                case "6 Hours":
                    finalDeadline = new Date(now.getTime() + 6 * 60 * 60 * 1000);
                    break;
                case "12 Hours":
                    finalDeadline = new Date(now.getTime() + 12 * 60 * 60 * 1000);
                    break;
                case "24 Hours":
                    finalDeadline = new Date(now.getTime() + 24 * 60 * 60 * 1000);
                    break;
                default:
                    finalDeadline = null;
            }
        } else if (
            taskForm.schedule === "Schedule" &&
            typeof taskForm.customDeadline === "string" &&
            taskForm.customDeadline
        ) {
            finalDeadline = new Date(taskForm.customDeadline);
        }

        if (finalDeadline) {
            formData.append("offerDeadline", finalDeadline.toISOString());
        }

        taskForm.photos.forEach((file: string | Blob) => {
            if (typeof file === 'string') {
            } else if (file instanceof Blob) {
                formData.append("photos", file);
            }
        });

        if (taskForm.video) {
            if (typeof taskForm.video === 'string') {
            } else if (taskForm.video instanceof Blob) {
                formData.append("video", taskForm.video);
            }
        }

        try {
            await postTask(formData).unwrap();
            toast.success("Task posted successfully!", {
                onClose: () => router.push("/dashboard/client"),
                autoClose: 2000,
            });
            setIsModalOpen(false); // Close confirmation modal after success
        } catch (err) {
            console.error("Error posting task:", JSON.stringify(err, null, 2));
            toast.error("Failed to post task.");
        }
    };

    useEffect(() => {
        // Set default service values if not already set
        if (!taskForm.serviceId) {
            dispatch(updateTaskField({ field: 'serviceId', value: 'handyMan' }));
        }
        if (!taskForm.serviceTitle) {
            dispatch(updateTaskField({ field: 'serviceTitle', value: servicesData['handyMan']?.title || 'Handyman & Home Repairs' }));
        }
    }, []); // Run once on mount



    const toggleEditMode = () => {
        if (editMode) {
            if (window.confirm("Discard changes?")) {
                setEditMode(false);
            }
        } else {
            // Create a copy of taskForm for local editing
            // If serviceId is empty but we have a default, use 'handyMan'
            const serviceId = taskForm.serviceId || 'handyMan';
            const serviceTitle = taskForm.serviceTitle || servicesData['handyMan']?.title || '';

            setLocalForm({
                ...taskForm,
                serviceId,
                serviceTitle,
                photos: [...taskForm.photos],
                video: taskForm.video
            });

            // Initialize location states based on current values
            if (taskForm.location === 'Remote' || !taskForm.location) {
                setLocationType('remote');
                setStreet('');
                setCity('');
                setProvince('');
            } else {
                setLocationType('in-person');
                const parts = (taskForm.location || '').split(',').map(p => p.trim());
                if (parts.length >= 3) {
                    const provincePart = parts.pop() || '';
                    const cityPart = parts.pop() || '';
                    const streetPart = parts.join(', ');
                    setProvince(provincePart);
                    setCity(cityPart);
                    setStreet(streetPart);
                } else if (parts.length === 2) {
                    setStreet(parts[0]);
                    setCity(parts[1]);
                    setProvince('');
                } else {
                    setStreet(taskForm.location || '');
                    setCity('');
                    setProvince('');
                }
            }

            // Initialize schedule states based on current values
            if (taskForm.schedule === 'Flexible' || !taskForm.schedule) {
                setScheduleType('Flexible');
                setScheduledDate('');
                setScheduledTime('');
            } else if (taskForm.schedule === 'Schedule') {
                setScheduleType('Schedule');
                if (taskForm.customDeadline) {
                    try {
                        const dateObj = new Date(taskForm.customDeadline);
                        if (!isNaN(dateObj.getTime())) {
                            const year = dateObj.getFullYear();
                            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                            const day = String(dateObj.getDate()).padStart(2, '0');
                            setScheduledDate(`${year}-${month}-${day}`);

                            const hours = String(dateObj.getHours()).padStart(2, '0');
                            const minutes = String(dateObj.getMinutes()).padStart(2, '0');
                            setScheduledTime(`${hours}:${minutes}`);
                        } else {
                            setScheduledDate('');
                            setScheduledTime('');
                        }
                    } catch (error) {
                        console.error('Error parsing customDeadline:', error);
                        setScheduledDate('');
                        setScheduledTime('');
                    }
                } else {
                    setScheduledDate('');
                    setScheduledTime('');
                }
            } else {
                setScheduleType('Schedule');
                try {
                    const dateObj = new Date(taskForm.schedule);
                    if (!isNaN(dateObj.getTime())) {
                        const year = dateObj.getFullYear();
                        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                        const day = String(dateObj.getDate()).padStart(2, '0');
                        setScheduledDate(`${year}-${month}-${day}`);

                        const hours = String(dateObj.getHours()).padStart(2, '0');
                        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
                        setScheduledTime(`${hours}:${minutes}`);
                    } else {
                        setScheduleType('Flexible');
                        setScheduledDate('');
                        setScheduledTime('');
                    }
                } catch (error) {
                    setScheduleType('Flexible');
                    setScheduledDate('');
                    setScheduledTime('');
                }
            }

            setEditMode(true);
        }
    };

    const getCurrentValue = (field: keyof typeof taskForm) => {
        const value = editMode ? localForm[field] : taskForm[field];

        // Handle default values for specific fields
        if (field === 'serviceId' && !value) {
            return 'handyMan';
        }
        if (field === 'serviceTitle' && !value) {
            return servicesData['handyMan']?.title || '';
        }

        return value;
    };
    const handleSwitch = async () => {
        if (!user?._id) {
            toast.error("User ID not found.");
            return;
        }

        setSwitching(true);
        try {
            const response = await fetch(`http://localhost:5000/api/auth/users/${user._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: "client" }),
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to switch role");
            }

            const { isLoggedIn, user: newUser } = await checkLoginStatus();
            if (isLoggedIn) {
                setUser(newUser);
            }

            setRoleSwitchModalOpen(false);
            toast.success("Switched to Client successfully!");
            setIsModalOpen(true);
        } catch (err) {
            console.error("Error switching role:", err);
            toast.error("Failed to switch role. Please try again.");
        } finally {
            setSwitching(false);
        }
    };

    const handlePostClick = async () => {
        if (!user) {
            await savePendingTask();
            router.push("/authentication");
            return;
        }

        if (editMode) {
            syncToRedux();
        }

        // Ensure serviceId and serviceTitle have values before proceeding
        if (!taskForm.serviceId) {
            dispatch(updateTaskField({ field: 'serviceId', value: 'handyMan' }));
        }
        if (!taskForm.serviceTitle) {
            dispatch(updateTaskField({ field: 'serviceTitle', value: servicesData['handyMan']?.title || 'Handyman & Home Repairs' }));
        }

        if (user.currentRole === 'tasker') {
            setRoleToggle('tasker');
            setRoleSwitchModalOpen(true);
            return;
        }

        setIsModalOpen(true);
    };
    const calculateTotalAmount = () => {
        const budget = parseFloat(taskForm.price) || 0;
        const isUrgent = taskForm.schedule === "Urgent";
        const urgentFee = isUrgent ? budget * 0.20 : 0;
        const subtotal = budget + urgentFee;
        const serviceFee = subtotal * 0.08;
        const tax = subtotal * 0.13;
        return subtotal + serviceFee + tax;
    };


    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-[#063A41] text-white py-8 px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-2">Review your task</h1>
                    <p className="text-[#E5FFDB] text-sm">Step 3 of 3</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden mb-6">
                    {/* Task Summary Card */}
                    <div className="bg-[#E5FFDB] px-6 py-4 border-b-2 border-gray-200">
                        <h2 className="text-xl font-bold text-[#063A41] flex items-center gap-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Task Summary
                        </h2>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Task Title */}
                        <div className="pb-6 border-b border-gray-200">
                            <p className="text-sm text-gray-500 mb-2">Task Title</p>
                            {editMode ? (
                                <InputField
                                    field="taskTitle"
                                    value={localForm.taskTitle}
                                    placeholder="Enter task title"
                                    onChange={(v) => handleLocalChange('taskTitle', v)}
                                />
                            ) : (
                                <p className="text-lg font-semibold text-[#063A41]">
                                    {getCurrentValue('taskTitle') || "Not specified"}
                                </p>
                            )}
                        </div>

                        {/* Service & Location Row */}
                        <div className="grid md:grid-cols-2 gap-6 pb-6 border-b border-gray-200">
                            <div>
                                <p className="text-sm text-gray-500 mb-2">Category</p>
                                {editMode ? (
                                    <SelectField
                                        value={localForm.serviceId || 'handyMan'}
                                        onChange={(newValue) => {
                                            handleLocalChange('serviceId', newValue);
                                            const selected = servicesData[newValue as keyof typeof servicesData];
                                            if (selected && selected.title) {
                                                handleLocalChange('serviceTitle', selected.title);
                                            }
                                        }}
                                        options={servicesData}
                                        placeholder="Select service"
                                    />
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#109C3D]">🔧</span>
                                        <p className="font-medium text-[#063A41]">
                                            {getCurrentValue('serviceTitle') || servicesData['handyMan']?.title || "Not specified"}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-2">Location</p>
                                {editMode ? (
                                    <div className="space-y-3">
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setLocationType('remote')}
                                                className={`flex-1 p-3 rounded-lg border-2 font-medium transition-all ${locationType === 'remote'
                                                    ? 'border-[#109C3D] bg-[#E5FFDB] text-[#063A41]'
                                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                    }`}
                                            >
                                                🌐 Remote
                                            </button>
                                            <button
                                                onClick={() => setLocationType('in-person')}
                                                className={`flex-1 p-3 rounded-lg border-2 font-medium transition-all ${locationType === 'in-person'
                                                    ? 'border-[#109C3D] bg-[#E5FFDB] text-[#063A41]'
                                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                    }`}
                                            >
                                                📍 In-Person
                                            </button>
                                        </div>
                                        {locationType === 'in-person' && (
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-[#063A41] font-semibold mb-1 text-sm">Street Address</label>
                                                    <input
                                                        type="text"
                                                        value={street}
                                                        onChange={(e) => setStreet(e.target.value)}
                                                        placeholder="Street Address"
                                                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#109C3D]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[#063A41] font-semibold mb-1 text-sm">City</label>
                                                    <input
                                                        type="text"
                                                        value={city}
                                                        onChange={(e) => setCity(e.target.value)}
                                                        placeholder="City"
                                                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#109C3D]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[#063A41] font-semibold mb-1 text-sm">Province</label>
                                                    <input
                                                        type="text"
                                                        value={province}
                                                        onChange={(e) => setProvince(e.target.value)}
                                                        placeholder="Province"
                                                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#109C3D]"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#109C3D]">
                                            {getCurrentValue('location') === 'Remote' ? '🌐' : '📍'}
                                        </span>
                                        <p className="font-medium text-[#063A41]">
                                            {getCurrentValue('location') || "Not specified"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="pb-6 border-b border-gray-200">
                            <p className="text-sm text-gray-500 mb-2">Description</p>
                            {editMode ? (
                                <TextAreaField
                                    field="taskDescription"
                                    value={localForm.taskDescription}
                                    placeholder="Enter task description"
                                    onChange={(v) => handleLocalChange('taskDescription', v)}
                                />
                            ) : (
                                <p className="text-[#063A41] leading-relaxed">
                                    {getCurrentValue('taskDescription') || "Not specified"}
                                </p>
                            )}
                        </div>

                        {/* Timing & Estimated Time Row */}
                        <div className="grid md:grid-cols-1 gap-6 pb-6 border-b border-gray-200">
                            <div>
                                <p className="text-sm text-gray-500 mb-2">When</p>
                                {editMode ? (
                                    <div className="space-y-3">
                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setScheduleType('Flexible')}
                                                className={`flex-1 p-3 rounded-lg border-2 font-medium transition-all ${scheduleType === 'Flexible'
                                                    ? 'border-[#109C3D] bg-[#E5FFDB] text-[#063A41]'
                                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                    }`}
                                            >
                                                🔄 Flexible
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setScheduleType('Schedule')}
                                                className={`flex-1 p-3 rounded-lg border-2 font-medium transition-all ${scheduleType === 'Schedule'
                                                    ? 'border-[#109C3D] bg-[#E5FFDB] text-[#063A41]'
                                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                    }`}
                                            >
                                                📅 Schedule
                                            </button>
                                        </div>
                                        {scheduleType === 'Schedule' && (
                                            <div className="grid grid-cols-2 gap-3">
                                                <input
                                                    type="date"
                                                    value={scheduledDate}
                                                    onChange={(e) => setScheduledDate(e.target.value)}
                                                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#109C3D]"
                                                    min={new Date().toISOString().split('T')[0]} // Prevent past dates
                                                />
                                                <input
                                                    type="time"
                                                    value={scheduledTime}
                                                    onChange={(e) => setScheduledTime(e.target.value)}
                                                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#109C3D]"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#109C3D]">⏰</span>
                                        <p className="font-medium text-[#063A41]">
                                            {getCurrentValue('schedule') || "Not specified"}
                                        </p>
                                        {taskForm.schedule === 'Schedule' && taskForm.customDeadline && (
                                            <span className="text-sm text-gray-500">
                                                ({new Date(taskForm.customDeadline).toLocaleString()})
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Budget */}
                        <div className="pb-6 border-b border-gray-200">
                            <p className="text-sm text-gray-500 mb-2">Your Budget</p>
                            {editMode ? (
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#063A41] font-semibold">$</span>
                                    <InputField
                                        field="price"
                                        value={localForm.price}
                                        type="number"
                                        placeholder="Enter amount"
                                        className="w-full p-3 pl-8 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#109C3D] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        onChange={(v) => handleLocalChange('price', v)}
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span className="text-[#109C3D]">💰</span>
                                    <p className="font-semibold text-[#063A41] text-xl">
                                        {getCurrentValue('price') ? `${getCurrentValue('price')}` : "Taskers will provide quotes"}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Additional Info */}
                        <div>
                            <p className="text-sm text-gray-500 mb-2">Additional Information</p>
                            {editMode ? (
                                <TextAreaField
                                    field="additionalInfo"
                                    value={localForm.additionalInfo}
                                    placeholder="Enter additional info"
                                    onChange={(v) => handleLocalChange('additionalInfo', v)}
                                />
                            ) : (
                                <p className="text-[#063A41] leading-relaxed">
                                    {getCurrentValue('additionalInfo') || "None provided"}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Info Box */}
                <div className="bg-[#E5FFDB] border-l-4 border-[#109C3D] p-6 rounded-lg mb-8">
                    <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-[#109C3D] flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <p className="font-semibold text-[#063A41] mb-1">What happens next?</p>
                            <p className="text-sm text-gray-700">
                                Once you post your task, qualified taskers will review it and send you their quotes. You can then choose the best tasker for your job!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-6 border-t-2 border-gray-100">
                    <button
                        onClick={onBack}
                        className="text-[#063A41] font-semibold hover:text-[#109C3D] transition-colors flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>

                    <div className="flex gap-4">
                        {editMode ? (
                            <>
                                <button
                                    onClick={() => {
                                        syncToRedux();
                                        setEditMode(false);
                                    }}
                                    className="bg-[#109C3D] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0d8332] transition-colors shadow-md"
                                >
                                    ✓ Save Changes
                                </button>
                                <button
                                    onClick={toggleEditMode}
                                    className="bg-gray-200 text-[#063A41] px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={toggleEditMode}
                                    className="bg-gray-200 text-[#063A41] px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                                >
                                    ✏️ Edit Details
                                </button>
                                <button
                                    onClick={handlePostClick}
                                    disabled={isLoading}
                                    className="bg-[#109C3D] text-white px-10 py-3 rounded-lg font-bold hover:bg-[#0d8332] transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? "Posting..." : "Post Task"}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Error/Success Messages */}
            {isError && (
                <div className="max-w-4xl mx-auto px-6 mb-4">
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <p className="text-red-700 font-semibold">
                            Error posting task. Please try again.
                        </p>
                    </div>
                </div>
            )}

            {isSuccess && (
                <div className="max-w-4xl mx-auto px-6 mb-4">
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                        <p className="text-green-700 font-semibold">
                            Task posted successfully!
                        </p>
                    </div>
                </div>
            )}

            {/* Restoring Modal */}
            {isRestoring && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl shadow-2xl flex items-center gap-4">
                        <svg className="animate-spin h-8 w-8 text-[#109C3D]" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span className="text-[#063A41] font-semibold">Restoring your task...</span>
                    </div>
                </div>
            )}

            {/* Role Switch Modal */}
            {roleSwitchModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full">
                        <div className="flex items-center justify-center mb-6">
                            <div className="p-4 bg-[#E5FFDB] rounded-full">
                                <svg className="w-8 h-8 text-[#109C3D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-[#063A41] text-center">Switch to Client Mode</h3>
                        <p className="mb-6 text-gray-600 text-center">
                            To post tasks, you need to switch to Client mode. You can switch back anytime from your profile.
                        </p>
                        <div className="flex items-center justify-center mb-6 p-4 bg-gray-50 rounded-xl">
                            <span className={`px-4 py-2 rounded-lg font-semibold transition-colors ${roleToggle === 'tasker' ? 'bg-gray-200 text-gray-700' : 'text-gray-500'}`}>
                                Tasker
                            </span>
                            <label className="relative inline-flex items-center mx-4 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={roleToggle === 'client'}
                                    onChange={(e) => setRoleToggle(e.target.checked ? 'client' : 'tasker')}
                                    disabled={switching}
                                />
                                <div className="relative w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#109C3D]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#109C3D]"></div>
                            </label>
                            <span className={`px-4 py-2 rounded-lg font-semibold transition-colors ${roleToggle === 'client' ? 'bg-[#E5FFDB] text-[#063A41]' : 'text-gray-500'}`}>
                                Client
                            </span>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setRoleSwitchModalOpen(false);
                                    setRoleToggle('tasker');
                                }}
                                disabled={switching}
                                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold text-gray-700 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSwitch}
                                disabled={roleToggle !== 'client' || switching}
                                className="flex-1 px-6 py-3 bg-[#109C3D] hover:bg-[#0d8332] disabled:bg-gray-400 rounded-lg font-bold text-white transition-all disabled:opacity-50 shadow-md"
                            >
                                {switching ? "Switching..." : "Switch"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer position="top-right" autoClose={3000} />
            {/* Modals at the bottom of your parent component */}
            <TaskConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={() => {
                    setIsModalOpen(false);
                    handleSubmit();
                }}
                taskForm={taskFormWithDefaults}
                timing={taskFormWithDefaults.schedule || ""}
                price={taskFormWithDefaults.price || ""}
                info={taskFormWithDefaults.additionalInfo || ""}
                isLoading={isLoading}
            />
        </div>
    );
};

export default UrgentTaskSummary;