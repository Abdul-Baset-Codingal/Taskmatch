/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { FaSpinner, FaUser, FaFileAlt, FaTools, FaConciergeBell, FaCalendarAlt, FaAward, FaChevronDown, FaChevronUp, FaCheckCircle, FaExclamationTriangle, FaEdit, FaSave, FaTimes, FaUpload, FaPlus, FaTrash, FaStar, FaArrowLeft, FaStar as FaStarSolid, FaHourglassHalf, FaUserShield } from 'react-icons/fa';
import { useApproveRejectTaskerMutation, useGetUserByIdQuery, useToggleTaskerProfileCheckMutation, useUpdateUserMutation } from '@/features/auth/authApi';

import { toast } from 'react-toastify';
import Navbar from '@/shared/Navbar';

// Define the User interface based on the provided data structure
interface Availability {
    day: string;
    from: string;
    to: string;
    _id: string;
}

interface Service {
    title: string;
    description: string;
    hourlyRate: number;
    estimatedDuration: string;
    _id: string;
}

interface Review {
    reviewer: string;
    rating: number;
    message: string;
    createdAt: string;
}

interface User {
    _id: string;
    roles: string[];
    currentRole: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    postalCode: string;
    profilePicture: string;
    idType: string;
    passportUrl: string;
    governmentIdFront: string;
    governmentIdBack: string;
    hasInsurance: boolean;
    backgroundCheckConsent: boolean;
    yearsOfExperience: string;
    rating: number;
    reviewCount: number;
    createdAt: string;
    updatedAt: string;
    availability: Availability[];
    categories: string[];
    certifications: string[];
    reviews: Review[];
    serviceAreas: string[];
    services: Service[];
    skills: string[];
    isBlocked: boolean;
    taskerProfileCheck: boolean | null;
}

const UserDetailsPage = () => {
    const router = useRouter();
    const params = useParams();
    const { data: user, isLoading, isError, error } = useGetUserByIdQuery(params.id as string);
    const [toggleTaskerProfileCheck] = useToggleTaskerProfileCheckMutation();
    const [approveRejectTasker, { isLoading: isProcessing }] = useApproveRejectTaskerMutation();

    const [updateUser] = useUpdateUserMutation();
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
        personal: true,
        documents: false,
        professional: false,
        services: false,
        availability: false,
        certifications: false,
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedData, setEditedData] = useState<User | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [tempFiles, setTempFiles] = useState<{ [key: string]: File | null }>({});

    // Extract the actual user object from the nested structure (assuming API returns { user: actualUser })
    const actualUser = user?.user || user;

    const isTasker = actualUser?.roles?.includes('tasker') || false;
    const profileCheckStatus = actualUser?.taskerProfileCheck;

    useEffect(() => {
        if (actualUser && isEditMode && !editedData) {
            setEditedData({ ...actualUser });
        }
    }, [actualUser, isEditMode, editedData]);

    const handleInputChange = (field: keyof User, value: any) => {
        if (editedData) {
            setEditedData({ ...editedData, [field]: value });
        }
    };

    const handleArrayInputChange = (field: keyof User, value: string) => {
        if (editedData) {
            const arrayValue = value.split(',').map(item => item.trim()).filter(Boolean);
            setEditedData({ ...editedData, [field]: arrayValue });
        }
    };

    const handleFileChange = (field: string, file: File | null) => {
        setTempFiles(prev => ({ ...prev, [field]: file }));
        // In a real app, you'd upload the file separately and update the URL in editedData
        if (editedData && file) {
            // Placeholder: Simulate URL update; integrate with your file upload API
            setEditedData(prev => ({ ...prev, [field as keyof User]: URL.createObjectURL(file) }));
        }
    };

    const handleSaveChanges = async () => {
        if (!editedData || !actualUser?._id) return;
        setIsSaving(true);
        try {
            // Handle file uploads separately if needed
            const formData = new FormData();
            Object.entries(tempFiles).forEach(([key, file]) => {
                if (file) formData.append(key, file);
            });
            // Assuming updateUser supports FormData or separate upload endpoint
            await updateUser({
                userId: actualUser._id,
                ...editedData,
                ...(Object.keys(tempFiles).length > 0 && { files: formData })
            }).unwrap();
            toast.success("Profile updated successfully!");
            setIsEditMode(false);
            setEditedData(null);
            setTempFiles({});
        } catch (err) {
            console.error('Failed to update profile:', err);
            toast.error("Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
        setEditedData(null);
        setTempFiles({});
    };

    const enterEditMode = () => {
        if (actualUser) {
            setEditedData({ ...actualUser });
            setIsEditMode(true);
        }
    };
    const toggleSection = (section: string) => {
        setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const handleToggleProfileCheck = async () => {
        if (!isTasker) return;
        try {
            await toggleTaskerProfileCheck({
                id: params.id as string,
                approve: !profileCheckStatus, // Toggle between true/false
            }).unwrap();
            // Refetch will happen via invalidatesTags
            toast.success(profileCheckStatus ? "Set under review" : "Profile approved!");
        } catch (err) {
            console.error('Failed to toggle profile check:', err);
            toast.error("Failed to update profile status");
        }
    };

    const addArrayItem = (field: keyof User, item: string) => {
        if (editedData && !editedData[field].includes(item)) {
            setEditedData(prev => ({ ...prev, [field]: [...(prev[field] as string[]), item] }));
        }
    };

    const removeArrayItem = (field: keyof User, item: string) => {
        if (editedData) {
            setEditedData(prev => ({ ...prev, [field]: (prev[field] as string[]).filter(i => i !== item) }));
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <FaSpinner className="animate-spin text-6xl text-blue-600" />
            </div>
        );
    }

    if (isError || !actualUser) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center bg-white p-12 rounded-2xl shadow-xl border border-gray-200 max-w-md mx-auto">
                    <FaUser className="mx-auto text-6xl text-gray-400 mb-4" />
                    <p className="text-gray-700 text-2xl font-bold mb-6">{error ? 'Error fetching user details' : 'User not found'}</p>
                    <button
                        onClick={() => router.back()}
                        className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-300 font-semibold flex items-center gap-2 mx-auto"
                    >
                        <FaArrowLeft /> Go Back
                    </button>
                </div>
            </div>
        );
    }

    const currentData = isEditMode ? editedData || actualUser : actualUser;

    const renderProfileAvatar = () => {
        const hasProfilePic = currentData?.profilePicture && currentData.profilePicture !== '/placeholder-profile.png';
        if (isEditMode) {
            return (
                <div className="relative group">
                    {hasProfilePic ? (
                        <Image
                            src={currentData.profilePicture}
                            alt={`${currentData.firstName} ${currentData.lastName}`}
                            width={120}
                            height={120}
                            className="rounded-full border-4 border-white object-cover w-[120px] h-[120px] shadow-lg"
                        />
                    ) : (
                        <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
                            <FaUser className="w-12 h-12 text-gray-400" />
                        </div>
                    )}
                    <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-3 rounded-full cursor-pointer hover:bg-blue-700 transition duration-300 shadow-md group-hover:scale-110">
                        <FaUpload className="text-lg" />
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleFileChange('profilePicture', e.target.files?.[0] || null)}
                        />
                    </label>
                </div>
            );
        } else {
            return hasProfilePic ? (
                <Image
                    src={currentData.profilePicture}
                    alt={`${currentData.firstName} ${currentData.lastName}`}
                    width={120}
                    height={120}
                    className="rounded-full border-4 border-white object-cover w-[120px] h-[120px] shadow-lg"
                />
            ) : (
                <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
                    <FaUser className="w-12 h-12 text-gray-400" />
                </div>
            );
        }
    };

    const renderStars = (rating: number) => (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <FaStarSolid
                    key={star}
                    className={`text-sm ${star <= Math.round(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
            ))}
        </div>
    );

    return (
        <div>
            <Navbar/>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Breadcrumb */}
                    <nav className="flex items-center mb-6 text-sm text-gray-600">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 hover:text-blue-600 transition duration-200 font-medium"
                        >
                            <FaArrowLeft /> Back to Dashboard
                        </button>
                    </nav>

                    {/* Hero Header */}
                    <div className="bg-white rounded-2xl p-8 mb-8 shadow-xl border border-gray-100 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-100 opacity-50" />
                        <div className="relative flex flex-col lg:flex-row items-center lg:items-start gap-8">
                            <div className="flex-shrink-0">
                                {renderProfileAvatar()}
                            </div>
                            <div className="flex-1 text-center lg:text-left">
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">{currentData?.firstName || 'N/A'} {currentData?.lastName || 'N/A'}</h1>
                                <p className="text-xl text-gray-600 mb-6 capitalize">{currentData?.currentRole || 'N/A'}</p>
                                <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-6">
                                    <span className={`px-6 py-3 rounded-full font-bold text-sm shadow-md ${currentData?.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                        {currentData?.isBlocked ? 'Blocked' : 'Active'}
                                    </span>
                                    {isTasker && (
                                        <span className={`px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 shadow-md ${profileCheckStatus ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {profileCheckStatus ? <FaCheckCircle /> : <FaExclamationTriangle />}
                                            {profileCheckStatus ? 'Approved' : 'Under Review'}
                                        </span>
                                    )}
                                    <span className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-bold text-sm shadow-md">
                                        Joined {new Date(currentData?.createdAt).toLocaleDateString() || 'N/A'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-center lg:justify-start gap-6 text-lg">
                                    <div className="flex items-center gap-2">
                                        {renderStars(currentData?.rating || 0)}
                                        <span className="font-semibold text-gray-700">{currentData?.rating || 0} ({currentData?.reviewCount || 0} reviews)</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 mt-4 lg:mt-0">
                                {isTasker && (
                                    <button
                                        onClick={handleToggleProfileCheck}
                                        className={`px-8 py-4 rounded-xl font-bold text-sm transition duration-300 flex items-center gap-2 shadow-lg ${profileCheckStatus
                                            ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}
                                    >
                                        {profileCheckStatus ? 'Set Under Review' : 'Approve Profile'}
                                    </button>
                                )}
                                {!isEditMode ? (
                                    <button
                                        onClick={enterEditMode}
                                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition duration-300 font-bold text-sm flex items-center gap-2 shadow-lg"
                                    >
                                        <FaEdit /> Edit Profile
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleSaveChanges}
                                            disabled={isSaving}
                                            className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition duration-300 font-bold text-sm flex items-center gap-2 shadow-lg disabled:opacity-50"
                                        >
                                            <FaSave /> {isSaving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="px-8 py-4 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition duration-300 font-bold text-sm flex items-center gap-2 shadow-lg"
                                        >
                                            <FaTimes /> Cancel
                                        </button>
                                    </>
                                )}

                                {/* TASKER APPROVAL PANEL - NEW SYSTEM */}
                             
                            </div>
                            
                        </div>
                    </div>

                    {isTasker && (
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-2xl p-8 mb-10 border-2 border-purple-200">
                            <h2 className="text-3xl font-bold text-purple-900 mb-6 flex items-center gap-3">
                                <FaUserShield className="text-4xl" />
                                Tasker Application Status
                            </h2>

                            {/* Current Status Badge */}
                            <div className="mb-8">
                                <span className={`inline-flex items-center gap-3 px-8 py-4 rounded-full text-xl font-bold shadow-lg ${actualUser.taskerStatus === "approved" ? "bg-green-100 text-green-800" :
                                    actualUser.taskerStatus === "rejected" ? "bg-red-100 text-red-800" :
                                        actualUser.taskerStatus === "under_review" ? "bg-yellow-100 text-yellow-800" :
                                            "bg-gray-100 text-gray-700"
                                    }`}>
                                    {actualUser.taskerStatus === "approved" && <FaCheckCircle />}
                                    {actualUser.taskerStatus === "rejected" && <FaTimes />}
                                    {actualUser.taskerStatus === "under_review" && <FaHourglassHalf className="animate-spin" />}
                                    {actualUser.taskerStatus === "not_applied" && <FaExclamationTriangle />}

                                    {actualUser.taskerStatus === "not_applied" ? "Not Applied" :
                                        actualUser.taskerStatus === "under_review" ? "Under Review" :
                                            actualUser.taskerStatus === "approved" ? "Approved" :
                                                actualUser.taskerStatus === "rejected" ? "Rejected" : "Unknown"}
                                </span>

                                {/* Show rejection reason */}
                                {actualUser.taskerStatus === "rejected" && actualUser.taskerRejectionReason && (
                                    <p className="mt-4 text-red-700 font-semibold text-lg italic">
                                        Reason: {actualUser.taskerRejectionReason}
                                    </p>
                                )}
                            </div>

                            {/* Approve / Reject Buttons */}
                            {(actualUser.taskerStatus === "under_review" || actualUser.taskerStatus === "not_applied") && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <button
                                        onClick={async () => {
                                            try {
                                                await approveRejectTasker({ userId: actualUser._id, action: "approve" }).unwrap();
                                                toast.success("Tasker approved successfully!");
                                            } catch (err: any) {
                                                toast.error(err?.data?.message || "Failed to approve");
                                            }
                                        }}
                                        disabled={isProcessing}
                                        className="px-10 py-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-xl font-bold rounded-xl shadow-xl transform hover:scale-105 transition-all disabled:opacity-70"
                                    >
                                        {isProcessing ? "Processing..." : "Approve as Tasker"}
                                    </button>

                                    <button
                                        onClick={async () => {
                                            const reason = prompt("Reason for rejection (will be shown to user):");
                                            if (!reason?.trim()) {
                                                toast.error("Please provide a reason");
                                                return;
                                            }
                                            try {
                                                await approveRejectTasker({
                                                    userId: actualUser._id,
                                                    action: "reject",
                                                    reason
                                                }).unwrap();
                                                toast.success("Application rejected");
                                            } catch (err: any) {
                                                toast.error(err?.data?.message || "Failed to reject");
                                            }
                                        }}
                                        disabled={isProcessing}
                                        className="px-10 py-6 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white text-xl font-bold rounded-xl shadow-xl transform hover:scale-105 transition-all disabled:opacity-70"
                                    >
                                        {isProcessing ? "Processing..." : "Reject Application"}
                                    </button>
                                </div>
                            )}

                            {/* Re-open if already decided */}
                            {(actualUser.taskerStatus === "approved" || actualUser.taskerStatus === "rejected") && (
                                <div className="text-center mt-6">
                                    <button
                                        onClick={async () => {
                                            try {
                                                await approveRejectTasker({ userId: actualUser._id, action: "approve" }).unwrap();
                                                toast.info("Application reopened for review");
                                            } catch (err: any) {
                                                toast.error("Failed");
                                            }
                                        }}
                                        className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg"
                                    >
                                        Re-open for Review
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Sections - Single Column for Better Flow */}
                    <div className="space-y-6">
                        {/* Personal Information */}
                        <section className="bg-white rounded-2xl p-0 shadow-lg border border-gray-100 overflow-hidden">
                            <button
                                onClick={() => toggleSection('personal')}
                                className="w-full flex justify-between items-center p-6 color1 text-white font-bold  transition duration-300"
                            >
                                <span className="flex items-center gap-3 text-lg">
                                    <FaUser className="text-xl" /> Personal Information
                                </span>
                                {openSections.personal ? <FaChevronUp className="text-white" /> : <FaChevronDown className="text-white" />}
                            </button>
                            {openSections.personal && (
                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="block font-semibold text-gray-700 text-sm uppercase tracking-wide">Email</label>
                                            {isEditMode ? (
                                                <input
                                                    type="email"
                                                    value={editedData?.email || ''}
                                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition duration-300"
                                                />
                                            ) : (
                                                <p className="text-xl text-gray-900 font-medium">{currentData?.email || 'N/A'}</p>
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            <label className="block font-semibold text-gray-700 text-sm uppercase tracking-wide">Phone</label>
                                            {isEditMode ? (
                                                <input
                                                    type="tel"
                                                    value={editedData?.phone || ''}
                                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition duration-300"
                                                />
                                            ) : (
                                                <p className="text-xl text-gray-900 font-medium">{currentData?.phone || 'N/A'}</p>
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            <label className="block font-semibold text-gray-700 text-sm uppercase tracking-wide">Postal Code</label>
                                            {isEditMode ? (
                                                <input
                                                    type="text"
                                                    value={editedData?.postalCode || ''}
                                                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                                                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition duration-300"
                                                />
                                            ) : (
                                                <p className="text-xl text-gray-900 font-medium">{currentData?.postalCode || 'N/A'}</p>
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            <label className="block font-semibold text-gray-700 text-sm uppercase tracking-wide">Last Updated</label>
                                            <p className="text-xl text-gray-600 font-medium">{new Date(currentData?.updatedAt).toLocaleDateString() || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Documents */}
                        <section className="bg-white rounded-2xl p-0 shadow-lg border border-gray-100 overflow-hidden">
                            <button
                                onClick={() => toggleSection('documents')}
                                className="w-full flex justify-between items-center p-6 color1 text-white font-bold  transition duration-300"
                            >
                                <span className="flex items-center gap-3 text-lg">
                                    <FaFileAlt className="text-xl" /> Documents
                                </span>
                                {openSections.documents ? <FaChevronUp className="text-white" /> : <FaChevronDown className="text-white" />}
                            </button>
                            {openSections.documents && (
                                <div className="p-6 space-y-6">
                                    <div className="space-y-4">
                                        <label className="block font-semibold text-gray-700 text-sm uppercase tracking-wide">ID Document ({currentData?.idType || 'N/A'})</label>
                                        {isEditMode ? (
                                            <div className="flex flex-col sm:flex-row gap-4 items-start">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleFileChange(currentData.idType === 'passport' ? 'passportUrl' : 'governmentIdFront', e.target.files?.[0] || null)}
                                                    className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition duration-300"
                                                />
                                                {(currentData?.passportUrl || currentData?.governmentIdFront) && (
                                                    <Image
                                                        src={currentData.passportUrl || currentData.governmentIdFront || ''}
                                                        alt="ID Document"
                                                        width={200}
                                                        height={150}
                                                        className="w-48 h-36 object-cover rounded-xl border-2 border-gray-200 shadow-md"
                                                    />
                                                )}
                                            </div>
                                        ) : (
                                            <>
                                                {(currentData?.passportUrl || currentData?.governmentIdFront) ? (
                                                    <Image
                                                        src={currentData.passportUrl || currentData.governmentIdFront || ''}
                                                        alt="ID Document"
                                                        width={400}
                                                        height={300}
                                                        className="w-full max-w-md h-auto rounded-xl border-2 border-gray-200 shadow-md object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full max-w-md h-64 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                                                        <FaFileAlt className="text-6xl text-gray-400" />
                                                        <p className="text-gray-500 mt-2">No document uploaded</p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    {currentData?.idType === 'governmentID' && (
                                        <div className="space-y-4">
                                            <label className="block font-semibold text-gray-700 text-sm uppercase tracking-wide">ID Back</label>
                                            {isEditMode ? (
                                                <div className="flex flex-col sm:flex-row gap-4 items-start">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleFileChange('governmentIdBack', e.target.files?.[0] || null)}
                                                        className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition duration-300"
                                                    />
                                                    {currentData?.governmentIdBack && (
                                                        <Image
                                                            src={currentData.governmentIdBack}
                                                            alt="ID Back"
                                                            width={200}
                                                            height={150}
                                                            className="w-48 h-36 object-cover rounded-xl border-2 border-gray-200 shadow-md"
                                                        />
                                                    )}
                                                </div>
                                            ) : (
                                                <>
                                                    {currentData?.governmentIdBack ? (
                                                        <Image
                                                            src={currentData.governmentIdBack}
                                                            alt="ID Back"
                                                            width={400}
                                                            height={300}
                                                            className="w-full max-w-md h-auto rounded-xl border-2 border-gray-200 shadow-md object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full max-w-md h-64 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                                                            <FaFileAlt className="text-6xl text-gray-400" />
                                                            <p className="text-gray-500 mt-2">No document uploaded</p>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="block font-semibold text-gray-700 text-sm uppercase tracking-wide">Has Insurance</label>
                                            {isEditMode ? (
                                                <select
                                                    value={editedData?.hasInsurance ? 'yes' : 'no'}
                                                    onChange={(e) => handleInputChange('hasInsurance', e.target.value === 'yes')}
                                                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition duration-300"
                                                >
                                                    <option value="yes">Yes</option>
                                                    <option value="no">No</option>
                                                </select>
                                            ) : (
                                                <div className={`p-4 rounded-xl ${currentData?.hasInsurance ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} font-semibold text-lg`}>
                                                    {currentData?.hasInsurance ? 'Yes' : 'No'}
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            <label className="block font-semibold text-gray-700 text-sm uppercase tracking-wide">Background Check Consent</label>
                                            {isEditMode ? (
                                                <select
                                                    value={editedData?.backgroundCheckConsent ? 'yes' : 'no'}
                                                    onChange={(e) => handleInputChange('backgroundCheckConsent', e.target.value === 'yes')}
                                                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition duration-300"
                                                >
                                                    <option value="yes">Yes</option>
                                                    <option value="no">No</option>
                                                </select>
                                            ) : (
                                                <div className={`p-4 rounded-xl ${currentData?.backgroundCheckConsent ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} font-semibold text-lg`}>
                                                    {currentData?.backgroundCheckConsent ? 'Yes' : 'No'}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Professional Details */}
                        <section className="bg-white rounded-2xl p-0 shadow-lg border border-gray-100 overflow-hidden">
                            <button
                                onClick={() => toggleSection('professional')}
                                className="w-full flex justify-between items-center p-6 color1 text-white font-bold transition duration-300"
                            >
                                <span className="flex items-center gap-3 text-lg">
                                    <FaTools className="text-xl" /> Professional Details
                                </span>
                                {openSections.professional ? <FaChevronUp className="text-white" /> : <FaChevronDown className="text-white" />}
                            </button>
                            {openSections.professional && (
                                <div className="p-6 space-y-6">
                                    <div className="space-y-4">
                                        <label className="block font-semibold text-gray-700 text-sm uppercase tracking-wide">Years of Experience</label>
                                        {isEditMode ? (
                                            <input
                                                type="text"
                                                value={editedData?.yearsOfExperience || ''}
                                                onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
                                                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition duration-300"
                                            />
                                        ) : (
                                            <p className="text-2xl text-gray-900 font-bold">{currentData?.yearsOfExperience?.replace('_', ' ') || 'N/A'}</p>
                                        )}
                                    </div>
                                    <div className="space-y-4">
                                        <label className="block font-semibold text-gray-700 text-sm uppercase tracking-wide">Overall Rating</label>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1 text-2xl">
                                                {renderStars(currentData?.rating || 0)}
                                            </div>
                                            <p className="text-xl text-gray-600">({currentData?.reviewCount || 0} reviews)</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-4">
                                            <label className="block font-semibold text-gray-700 text-sm uppercase tracking-wide">Categories</label>
                                            {isEditMode ? (
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={editedData?.categories?.join(', ') || ''}
                                                        onChange={(e) => handleArrayInputChange('categories', e.target.value)}
                                                        placeholder="e.g., Plumbing, Electrical"
                                                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition duration-300 mb-3"
                                                    />
                                                    <div className="flex flex-wrap gap-2">
                                                        {editedData?.categories?.map((cat, idx) => (
                                                            <span key={idx} className="flex items-center gap-2 bg-gray-200 px-3 py-2 rounded-lg text-sm font-medium">
                                                                {cat}
                                                                <FaTrash className="text-red-500 cursor-pointer hover:text-red-700" size={12} onClick={() => removeArrayItem('categories', cat)} />
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-wrap gap-3">
                                                    {currentData?.categories?.map((category, index) => (
                                                        <span key={index} className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
                                                            {category}
                                                        </span>
                                                    )) || <p className="text-gray-500 italic">No categories listed</p>}
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-4">
                                            <label className="block font-semibold text-gray-700 text-sm uppercase tracking-wide">Skills</label>
                                            {isEditMode ? (
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={editedData?.skills?.join(', ') || ''}
                                                        onChange={(e) => handleArrayInputChange('skills', e.target.value)}
                                                        placeholder="e.g., Welding, Carpentry"
                                                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition duration-300 mb-3"
                                                    />
                                                    <div className="flex flex-wrap gap-2">
                                                        {editedData?.skills?.map((skill, idx) => (
                                                            <span key={idx} className="flex items-center gap-2 bg-gray-200 px-3 py-2 rounded-lg text-sm font-medium">
                                                                {skill}
                                                                <FaTrash className="text-red-500 cursor-pointer hover:text-red-700" size={12} onClick={() => removeArrayItem('skills', skill)} />
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-wrap gap-3">
                                                    {currentData?.skills?.map((skill, index) => (
                                                        <span key={index} className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-bold">
                                                            {skill}
                                                        </span>
                                                    )) || <p className="text-gray-500 italic">No skills listed</p>}
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-4">
                                            <label className="block font-semibold text-gray-700 text-sm uppercase tracking-wide">Service Areas</label>
                                            {isEditMode ? (
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={editedData?.serviceAreas?.join(', ') || ''}
                                                        onChange={(e) => handleArrayInputChange('serviceAreas', e.target.value)}
                                                        placeholder="e.g., Downtown, Suburbs"
                                                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition duration-300 mb-3"
                                                    />
                                                    <div className="flex flex-wrap gap-2">
                                                        {editedData?.serviceAreas?.map((area, idx) => (
                                                            <span key={idx} className="flex items-center gap-2 bg-gray-200 px-3 py-2 rounded-lg text-sm font-medium">
                                                                {area}
                                                                <FaTrash className="text-red-500 cursor-pointer hover:text-red-700" size={12} onClick={() => removeArrayItem('serviceAreas', area)} />
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-wrap gap-3">
                                                    {currentData?.serviceAreas?.map((area, index) => (
                                                        <span key={index} className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-bold">
                                                            {area}
                                                        </span>
                                                    )) || <p className="text-gray-500 italic">No areas listed</p>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Services */}
                        <section className="bg-white rounded-2xl p-0 shadow-lg border border-gray-100 overflow-hidden">
                            <button
                                onClick={() => toggleSection('services')}
                                className="w-full flex justify-between items-center p-6 color1 text-white font-bold  transition duration-300"
                            >
                                <span className="flex items-center gap-3 text-lg">
                                    <FaConciergeBell className="text-xl" /> Services Offered
                                </span>
                                {openSections.services ? <FaChevronUp className="text-white" /> : <FaChevronDown className="text-white" />}
                            </button>
                            {openSections.services && (
                                <div className="p-6">
                                    {currentData?.services?.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {currentData.services.map((service) => (
                                                <div key={service._id} className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-md transition duration-300">
                                                    <h4 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h4>
                                                    <p className="text-gray-700 mb-4 leading-relaxed">{service.description}</p>
                                                    <div className="flex justify-between items-center text-lg font-semibold">
                                                        <span className="text-green-600">${service.hourlyRate}/hr</span>
                                                        <span className="text-blue-600">{service.estimatedDuration} hrs</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <FaConciergeBell className="mx-auto text-6xl text-gray-400 mb-4" />
                                            <p className="text-xl text-gray-500">No services listed</p>
                                        </div>
                                    )}
                                    {isEditMode && (
                                        <button className="w-full mt-6 p-4 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition duration-300 font-bold flex items-center justify-center gap-3">
                                            <FaPlus /> Add New Service
                                        </button>
                                    )}
                                </div>
                            )}
                        </section>

                        {/* Availability */}
                        <section className="bg-white rounded-2xl p-0 shadow-lg border border-gray-100 overflow-hidden">
                            <button
                                onClick={() => toggleSection('availability')}
                                className="w-full flex justify-between items-center p-6 color1 text-white font-bold  transition duration-300"
                            >
                                <span className="flex items-center gap-3 text-lg">
                                    <FaCalendarAlt className="text-xl" /> Availability
                                </span>
                                {openSections.availability ? <FaChevronUp className="text-white" /> : <FaChevronDown className="text-white" />}
                            </button>
                            {openSections.availability && (
                                <div className="p-6">
                                    {currentData?.availability?.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {currentData.availability.map((slot) => (
                                                <div key={slot._id} className="p-4 bg-gradient-to-r from-indigo-50 to-blue-100 rounded-xl border border-indigo-200 flex items-center justify-between hover:shadow-md transition duration-300">
                                                    <span className="font-bold text-gray-900 text-lg">{slot.day}</span>
                                                    <span className="text-indigo-700 font-semibold text-lg">{slot.from?.trim()} - {slot.to?.trim()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <FaCalendarAlt className="mx-auto text-6xl text-gray-400 mb-4" />
                                            <p className="text-xl text-gray-500">No availability set</p>
                                        </div>
                                    )}
                                    {isEditMode && (
                                        <button className="w-full mt-6 p-4 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition duration-300 font-bold flex items-center justify-center gap-3">
                                            <FaPlus /> Add Availability
                                        </button>
                                    )}
                                </div>
                            )}
                        </section>

                        {/* Certifications */}
                        <section className="bg-white rounded-2xl p-0 shadow-lg border border-gray-100 overflow-hidden">
                            <button
                                onClick={() => toggleSection('certifications')}
                                className="w-full flex justify-between items-center p-6 color1 text-white font-bold  transition duration-300"
                            >
                                <span className="flex items-center gap-3 text-lg">
                                    <FaAward className="text-xl" /> Certifications
                                </span>
                                {openSections.certifications ? <FaChevronUp className="text-white" /> : <FaChevronDown className="text-white" />}
                            </button>
                            {openSections.certifications && (
                                <div className="p-6">
                                    {currentData?.certifications?.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {currentData.certifications.map((cert, index) => (
                                                <div key={index} className="relative group">
                                                    <Image
                                                        src={cert}
                                                        alt={`Certification ${index + 1}`}
                                                        width={300}
                                                        height={200}
                                                        className="w-full h-48 object-cover rounded-xl border-2 border-blue-200 shadow-lg hover:shadow-xl transition duration-300"
                                                        onError={(e) => (e.currentTarget.src = '/placeholder-cert.png')}
                                                    />
                                                    {isEditMode && (
                                                        <button className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition duration-300 shadow-lg">
                                                            <FaTrash className="text-sm" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <FaAward className="mx-auto text-6xl text-gray-400 mb-4" />
                                            <p className="text-xl text-gray-500">No certifications uploaded</p>
                                        </div>
                                    )}
                                    {isEditMode && (
                                        <label className="block w-full mt-6 p-4 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition duration-300 cursor-pointer text-center font-bold  items-center justify-center gap-3">
                                            <FaUpload /> Upload Certification
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(`certification_${Date.now()}`, e.target.files?.[0] || null)}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetailsPage;