
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useGetUserByIdQuery, useSubmitTaskerApplicationMutation, useUpdateUserMutation } from "@/features/auth/authApi";
import { checkLoginStatus } from "@/resusable/CheckUser";
import { toast } from "react-toastify";
import { Save, Upload, CheckCircle, AlertCircle, User, Shield, FileText, X, Calendar, Edit3, Globe, Clock, Banknote, Lock } from "lucide-react";
import { HiOutlineDocumentText } from "react-icons/hi";
import Navbar from "@/shared/Navbar";

const uploadToImgBB = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(
        'https://api.imgbb.com/1/upload?key=8b35d4601167f12207fbc7c8117f897e',
        {
            method: 'POST',
            body: formData,
        }
    );
    const data = await res.json();
    if (!data.success) {
        throw new Error(data.error.message || 'Image upload failed');
    }
    return data.data.url;
};

const UpdateDocument = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const fieldsParam = searchParams.get('fields');
    const missingFields = fieldsParam ? fieldsParam.split(',') : [];
    const hasMissingFields = missingFields.length > 0;
    const [user, setUser] = useState<{ _id: string; role: string } | null>(null);
    const [formData, setFormData] = useState({
        idType: "" as string,
        passportUrl: "" as string,
        governmentIdFront: "" as string,
        governmentIdBack: "" as string,
        issueDate: "" as string,
        expiryDate: "" as string,
        hasInsurance: false as boolean,
        insuranceDocument: "" as string,
        backgroundCheckConsent: false as boolean,
        profilePicture: "" as string,
        sin: "" as string,
        firstName: "" as string,
        lastName: "" as string,
        email: "" as string,
        dob: "" as string,
        about: "" as string,
        language: "" as string,
        yearsOfExperience: "" as string,
        accountHolder: "" as string,
        accountNumber: "" as string,
        routingNumber: "" as string,
    });

    const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({
        profilePicture: null,
        passportUrl: null,
        governmentIdFront: null,
        governmentIdBack: null,
        insuranceDocument: null,
    });

    const [isUploading, setIsUploading] = useState(false);
    const [uploadField, setUploadField] = useState<keyof typeof formData | null>(null);
    const [showInsuranceUpload, setShowInsuranceUpload] = useState(false);
    const [activeSection, setActiveSection] = useState<string>('personal');
    const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
    const [sectionValidation, setSectionValidation] = useState<Record<string, boolean>>({});

    const localUrlsRef = useRef(new Map<string, string>());

    const today = "2025-11-14";
    const minYear = "1900-01-01";
    const maxFutureYear = "2040-12-31";

    useEffect(() => {
        const fetchUser = async () => {
            const { isLoggedIn, user } = await checkLoginStatus();
            if (isLoggedIn) {
                setUser(user);
            } else {
                router.push("/login");
            }
        };
        fetchUser();
    }, [router]);

    const { data: userDetails, refetch, isLoading: isUserLoading } = useGetUserByIdQuery(user?._id || "", {
        skip: !user?._id,
    });

    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

    const [submitTaskerApplication, {
        isLoading: isSubmittingApplication,
        isSuccess: applicationSubmitted,
        error: applicationError
    }] = useSubmitTaskerApplicationMutation();

    useEffect(() => {
        if (userDetails && userDetails.user && user?._id) {
            setFormData({
                idType: userDetails.user.idType || "",
                passportUrl: userDetails.user.passportUrl || "",
                governmentIdFront: userDetails.user.governmentIdFront || "",
                governmentIdBack: userDetails.user.governmentIdBack || "",
                issueDate: userDetails.user.issueDate ? new Date(userDetails.user.issueDate).toISOString().split('T')[0] : "",
                expiryDate: userDetails.user.expiryDate ? new Date(userDetails.user.expiryDate).toISOString().split('T')[0] : "",
                hasInsurance: userDetails.user.hasInsurance || false,
                insuranceDocument: userDetails.user.insuranceDocument || "",
                backgroundCheckConsent: userDetails.user.backgroundCheckConsent || false,
                profilePicture: userDetails.user.profilePicture || "",
                sin: userDetails.user.sin || "",
                firstName: userDetails.user.firstName || "",
                lastName: userDetails.user.lastName || "",
                email: userDetails.user.email || "",
                dob: userDetails.user.dob ? new Date(userDetails.user.dob).toISOString().split('T')[0] : "",
                about: userDetails.user.about || "",
                // language: userDetails.user.language || "",
                yearsOfExperience: userDetails.user.yearsOfExperience || "",
                accountHolder: userDetails.user.accountHolder || "",
                accountNumber: userDetails.user.accountNumber || "",
                routingNumber: userDetails.user.routingNumber || "",
            });
            setShowInsuranceUpload(userDetails.user.hasInsurance || false);
        }
    }, [userDetails, user]);

    useEffect(() => {
        const validateSections = () => {
            const validation: Record<string, boolean> = {};
            const completed = new Set<string>();

            const personalValid = formData.sin && formData.profilePicture && !formData.profilePicture.startsWith('blob:');
            validation.personal = !!personalValid;
            if (personalValid) completed.add('personal');

            const professionalValid = formData.dob && formData.yearsOfExperience  && formData.about;
            validation.professional = !!professionalValid;
            if (professionalValid) completed.add('professional');

            let idVerificationValid = false;
            if (formData.idType === "passport") {
                idVerificationValid = formData.passportUrl && !formData.passportUrl.startsWith('blob:') && formData.issueDate && formData.expiryDate;
            } else if (formData.idType === "governmentID") {
                idVerificationValid = formData.governmentIdFront && !formData.governmentIdFront.startsWith('blob:') && formData.governmentIdBack && !formData.governmentIdBack.startsWith('blob:') && formData.issueDate && formData.expiryDate;
            }
            validation['id-verification'] = !!idVerificationValid;
            if (idVerificationValid) completed.add('id-verification');

            const paymentValid = formData.accountHolder && formData.accountNumber && formData.routingNumber;
            validation.payment = !!paymentValid;
            if (paymentValid) completed.add('payment');

            const insuranceValid = formData.hasInsurance ? formData.insuranceDocument && !formData.insuranceDocument.startsWith('blob:') : true;
            validation.insurance = !!insuranceValid;
            if (insuranceValid) completed.add('insurance');

            const backgroundValid = formData.backgroundCheckConsent;
            validation.background = !!backgroundValid;
            if (backgroundValid) completed.add('background');

            setSectionValidation(validation);
            setCompletedSections(completed);
        };

        validateSections();
    }, [formData]);

    useEffect(() => {
        return () => {
            localUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
            localUrlsRef.current.clear();
        };
    }, []);

    const handleFileUpload = async (file: File, field: keyof typeof formData): Promise<string | null> => {
        if (!file) return null;
        if (!file.type.startsWith('image/')) {
            toast.error(`${field} must be an image file.`);
            return null;
        }
        setIsUploading(true);
        setUploadField(field);
        try {
            const url = await uploadToImgBB(file);
            toast.success(`Uploaded successfully!`);
            setIsUploading(false);
            setUploadField(null);
            return url;
        } catch (error) {
            // console.error("Upload failed:", error);
            toast.error(`Failed to upload`);
            setIsUploading(false);
            setUploadField(null);
            return null;
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof formData) => {
        const file = e.target.files?.[0];
        if (file) {
            const localUrl = URL.createObjectURL(file);
            localUrlsRef.current.set(field, localUrl);
            setSelectedFiles(prev => ({ ...prev, [field]: file }));
            setFormData(prev => ({ ...prev, [field]: localUrl }));
            const uploadedUrl = await handleFileUpload(file, field);
            if (uploadedUrl) {
                setFormData(prev => ({ ...prev, [field]: uploadedUrl }));
                const oldLocalUrl = localUrlsRef.current.get(field);
                if (oldLocalUrl) {
                    URL.revokeObjectURL(oldLocalUrl);
                    localUrlsRef.current.delete(field);
                }
            }
            setSelectedFiles(prev => ({ ...prev, [field]: null }));
            e.target.value = '';
        }
    };

    const clearSelectedFile = (field: keyof typeof formData) => {
        const localUrl = localUrlsRef.current.get(field);
        if (localUrl) {
            URL.revokeObjectURL(localUrl);
            localUrlsRef.current.delete(field);
        }
        setSelectedFiles(prev => ({ ...prev, [field]: null }));
        setFormData(prev => ({ ...prev, [field]: '' }));
    };

    const getPreviewUrl = (field: string): string => {
        return formData[field as keyof typeof formData] || '';
    };

    const isLocalPreview = (field: string): boolean => {
        const url = getPreviewUrl(field);
        return url.startsWith('blob:');
    };

    const needsUnoptimized = (src: string): boolean => !src.startsWith('/');

    const handleIdTypeChange = (value: string) => {
        setFormData({ ...formData, idType: value });
        if (value === "passport") {
            setFormData(prev => ({ ...prev, governmentIdFront: "", governmentIdBack: "" }));
        } else if (value === "governmentID") {
            setFormData(prev => ({ ...prev, passportUrl: "" }));
        }
    };

    const handleIssueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, issueDate: e.target.value }));
    };

    const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, expiryDate: e.target.value }));
    };

    const handleHasInsuranceChange = (checked: boolean) => {
        setFormData({ ...formData, hasInsurance: checked });
        setShowInsuranceUpload(checked);
        if (!checked) {
            setFormData({ ...formData, insuranceDocument: "" });
            const localUrl = localUrlsRef.current.get('insuranceDocument');
            if (localUrl) {
                URL.revokeObjectURL(localUrl);
                localUrlsRef.current.delete('insuranceDocument');
            }
            setSelectedFiles(prev => ({ ...prev, insuranceDocument: null }));
        }
    };

    const handleBackgroundCheckConsentChange = (checked: boolean) => {
        setFormData({ ...formData, backgroundCheckConsent: checked });
    };

    const canAccessSection = (sectionId: string) => {
        const sectionOrder = ['personal', 'professional',  'id-verification', 'payment', 'insurance', 'background'];
        const currentIndex = sectionOrder.indexOf(sectionId);
        if (currentIndex === 0) return true;
        for (let i = 0; i < currentIndex; i++) {
            if (!completedSections.has(sectionOrder[i])) {
                return false;
            }
        }
        return true;
    };

    const handleSectionChange = (sectionId: string) => {
        if (canAccessSection(sectionId)) {
            setActiveSection(sectionId);
        } else {
            toast.error("Please complete previous sections first.");
        }
    };

    // Save handlers
    const handleSaveProfessionalProfile = async () => {
        if (!user?._id) return toast.error("User not logged in.");
        const payload: any = { userId: user._id };
        if (formData.dob) payload.dob = new Date(formData.dob);
        if (formData.about) payload.about = formData.about;
        // if (formData.language) payload.language = formData.language;
        if (formData.yearsOfExperience) payload.yearsOfExperience = formData.yearsOfExperience;
        if (Object.keys(payload).length === 1) return toast.info("No changes to save.");
        try {
            await updateUser(payload).unwrap();
            await refetch();
            toast.success("Profile saved!");
        } catch (err: any) {
            toast.error(`Failed: ${err.data?.error || err.message}`);
        }
    };

    const handleSavePersonalInfo = async () => {
        if (!user?._id) return toast.error("User not logged in.");
        if (formData.profilePicture?.startsWith('blob:')) return toast.warn("Please wait for upload to complete.");
        const payload: any = { userId: user._id };
        if (formData.sin) payload.sin = formData.sin;
        if (formData.profilePicture && !formData.profilePicture.startsWith('blob:')) payload.profilePicture = formData.profilePicture;
        if (Object.keys(payload).length === 1) return toast.info("No changes to save.");
        try {
            await updateUser(payload).unwrap();
            await refetch();
            toast.success("Personal info saved!");
        } catch (err: any) {
            toast.error(`Failed: ${err.data?.error || err.message}`);
        }
    };

    const handleSaveIdVerification = async () => {
        if (!user?._id) return toast.error("User not logged in.");
        if (!formData.idType) return toast.error("Please select ID type.");
        const payload: any = { userId: user._id, idType: formData.idType };
        if (formData.passportUrl && !formData.passportUrl.startsWith('blob:')) payload.passportUrl = formData.passportUrl;
        if (formData.governmentIdFront && !formData.governmentIdFront.startsWith('blob:')) payload.governmentIdFront = formData.governmentIdFront;
        if (formData.governmentIdBack && !formData.governmentIdBack.startsWith('blob:')) payload.governmentIdBack = formData.governmentIdBack;
        if (formData.issueDate) payload.issueDate = new Date(formData.issueDate);
        if (formData.expiryDate) payload.expiryDate = new Date(formData.expiryDate);
        try {
            await updateUser(payload).unwrap();
            await refetch();
            toast.success("ID verification saved!");
        } catch (err: any) {
            toast.error(`Failed: ${err.data?.error || err.message}`);
        }
    };

    const handleSavePaymentSettings = async () => {
        if (!user?._id) return toast.error("User not logged in.");
        const payload: any = { userId: user._id };
        if (formData.accountHolder) payload.accountHolder = formData.accountHolder;
        if (formData.accountNumber) payload.accountNumber = formData.accountNumber;
        if (formData.routingNumber) payload.routingNumber = formData.routingNumber;
        if (Object.keys(payload).length === 1) return toast.info("No changes to save.");
        try {
            await updateUser(payload).unwrap();
            await refetch();
            toast.success("Payment settings saved!");
        } catch (err: any) {
            toast.error(`Failed: ${err.data?.error || err.message}`);
        }
    };

    const handleSaveInsurance = async () => {
        if (!user?._id) return toast.error("User not logged in.");
        if (formData.insuranceDocument?.startsWith('blob:')) return toast.warn("Please wait for upload to complete.");
        const payload: any = { userId: user._id, hasInsurance: formData.hasInsurance };
        if (formData.insuranceDocument && !formData.insuranceDocument.startsWith('blob:')) payload.insuranceDocument = formData.insuranceDocument;
        try {
            await updateUser(payload).unwrap();
            await refetch();
            toast.success("Insurance saved!");
        } catch (err: any) {
            toast.error(`Failed: ${err.data?.error || err.message}`);
        }
    };

    const handleSaveBackgroundCheck = async () => {
        if (!user?._id) return toast.error("User not logged in.");
        try {
            await updateUser({ userId: user._id, backgroundCheckConsent: formData.backgroundCheckConsent }).unwrap();
            await refetch();
            toast.success("Consent saved!");
        } catch (err: any) {
            toast.error(`Failed: ${err.data?.error || err.message}`);
        }
    };

    const sections = [
        { id: 'personal', label: 'Personal', icon: User },
        { id: 'professional', label: 'Professional', icon: Edit3 },
        { id: 'id-verification', label: 'ID Verification', icon: FileText },
        { id: 'payment', label: 'Payment', icon: Banknote },
        { id: 'insurance', label: 'Insurance', icon: Shield },
        { id: 'background', label: 'Background', icon: AlertCircle },
    ];

    // Loading
    if (isUserLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-3 border-[#E5FFDB] border-t-[#109C3D] rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!userDetails || !userDetails.user) {
        return (
            <div className="min-h-screen bg-[#E5FFDB]/20 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-sm w-full border border-[#109C3D]/20">
                    <div className="w-16 h-16 bg-[#E5FFDB] rounded-full flex items-center justify-center mx-auto mb-4">
                        <HiOutlineDocumentText className="w-8 h-8 text-[#063A41]" />
                    </div>
                    <h2 className="text-xl font-semibold text-[#063A41] mb-2">Loading Profile</h2>
                    <p className="text-gray-500">Please wait...</p>
                </div>
            </div>
        );
    }

    const allSectionsCompleted = completedSections.size === sections.length;
    const canSubmitApplication = allSectionsCompleted &&
        (userDetails?.user?.taskerStatus === "not_applied" || userDetails?.user?.taskerStatus === "rejected");

    return (
        <div className="min-h-screen bg-[#E5FFDB]/10">
            <Navbar />

            {/* Header */}
            <div className="bg-[#063A41]">
                <div className="max-w-5xl mx-auto px-4 py-8">
                    <h1 className="text-2xl font-bold text-white">Update Documents & Profile</h1>
                    <p className="text-[#E5FFDB] text-sm mt-1">Complete your verification to become a tasker</p>

                    {/* Progress Bar */}
                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-[#E5FFDB]">
                                {completedSections.size} of {sections.length} completed
                            </span>
                            <span className="text-sm font-medium text-white">
                                {Math.round((completedSections.size / sections.length) * 100)}%
                            </span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                            <div
                                className="bg-[#109C3D] h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(completedSections.size / sections.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="flex gap-1 overflow-x-auto py-2">
                        {sections.map((section) => {
                            const Icon = section.icon;
                            const isActive = activeSection === section.id;
                            const isCompleted = completedSections.has(section.id);
                            const canAccess = canAccessSection(section.id);

                            return (
                                <button
                                    key={section.id}
                                    onClick={() => handleSectionChange(section.id)}
                                    disabled={!canAccess}
                                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${isActive
                                        ? "bg-[#063A41] text-white"
                                        : isCompleted
                                            ? "bg-[#E5FFDB] text-[#109C3D]"
                                            : canAccess
                                                ? "text-gray-500 hover:bg-gray-100"
                                                : "text-gray-300 cursor-not-allowed"
                                        }`}
                                >
                                    {!canAccess ? (
                                        <Lock className="w-4 h-4" />
                                    ) : isCompleted ? (
                                        <CheckCircle className="w-4 h-4" />
                                    ) : (
                                        <Icon className="w-4 h-4" />
                                    )}
                                    {section.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Missing Fields Alert */}
            {hasMissingFields && (
                <div className="max-w-5xl mx-auto px-4 mt-6">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <p className="text-sm text-amber-800">
                            <strong>Required fields:</strong> {missingFields.join(', ')}
                        </p>
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 py-6">
                {/* Professional Profile */}
                {activeSection === 'professional' && (
                    <div className="space-y-4">
                        <div className="bg-white rounded-lg border p-5">
                            <h3 className="font-medium text-[#063A41] mb-4">Professional Details</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#063A41] mb-1">Date of Birth</label>
                                    <input
                                        type="date"
                                        value={formData.dob}
                                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                        max={today}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#063A41] mb-1">Years of Experience</label>
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="e.g., 5"
                                        value={formData.yearsOfExperience}
                                        onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent"
                                    />
                                </div>
                                {/* <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-[#063A41] mb-1">Primary Language</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., English"
                                        value={formData.language}
                                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent"
                                    />
                                </div> */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-[#063A41] mb-1">About Me</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Tell us about yourself..."
                                        value={formData.about}
                                        onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleSaveProfessionalProfile}
                            disabled={isUpdating}
                            className="w-full py-3 bg-[#109C3D] text-white font-medium rounded-lg hover:bg-[#0d8534] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {isUpdating ? "Saving..." : "Save & Continue"}
                        </button>
                    </div>
                )}

                {/* Personal Info */}
                {activeSection === 'personal' && (
                    <div className="space-y-4">
                        <div className="bg-white rounded-lg border p-5">
                            <h3 className="font-medium text-[#063A41] mb-4">Personal Information</h3>

                            {/* Profile Picture */}
                            <div className="flex items-center gap-6 mb-6 pb-6 border-b">
                                <div className="relative">
                                    <Image
                                        src={getPreviewUrl("profilePicture") || "/placeholder-avatar.png"}
                                        alt="Profile"
                                        width={80}
                                        height={80}
                                        className="rounded-full object-cover border-2 border-[#E5FFDB]"
                                        unoptimized={needsUnoptimized(getPreviewUrl("profilePicture") || "")}
                                    />
                                    {isUploading && uploadField === "profilePicture" && (
                                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#E5FFDB] text-[#063A41] rounded-lg hover:bg-[#d4f5c8] transition-colors">
                                        <Upload className="w-4 h-4" />
                                        Upload Photo
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, "profilePicture")}
                                            className="hidden"
                                            disabled={isUploading}
                                        />
                                    </label>
                                    {getPreviewUrl("profilePicture") && !isLocalPreview("profilePicture") && (
                                        <span className="ml-2 text-xs text-[#109C3D]">✓ Uploaded</span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#063A41] mb-1">First Name</label>
                                        <input
                                            type="text"
                                            value={formData.firstName}
                                            disabled
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#063A41] mb-1">Last Name</label>
                                        <input
                                            type="text"
                                            value={formData.lastName}
                                            disabled
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#063A41] mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#063A41] mb-1">SIN (Social Insurance Number)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., 123456789"
                                        value={formData.sin}
                                        onChange={(e) => setFormData({ ...formData, sin: e.target.value })}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleSavePersonalInfo}
                            disabled={isUpdating}
                            className="w-full py-3 bg-[#109C3D] text-white font-medium rounded-lg hover:bg-[#0d8534] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {isUpdating ? "Saving..." : "Save & Continue"}
                        </button>
                    </div>
                )}

                {/* ID Verification */}
                {activeSection === 'id-verification' && (
                    <div className="space-y-4">
                        <div className="bg-white rounded-lg border p-5">
                            <h3 className="font-medium text-[#063A41] mb-4">ID Verification</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#063A41] mb-1">ID Type</label>
                                    <select
                                        value={formData.idType}
                                        onChange={(e) => handleIdTypeChange(e.target.value)}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent"
                                    >
                                        <option value="">Select ID type</option>
                                        <option value="passport">Passport</option>
                                        <option value="governmentID">Government ID (Front & Back)</option>
                                    </select>
                                </div>

                                {formData.idType && (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#063A41] mb-1">Issue Date</label>
                                            <input
                                                type="date"
                                                value={formData.issueDate}
                                                onChange={handleIssueDateChange}
                                                max={today}
                                                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#063A41] mb-1">Expiry Date</label>
                                            <input
                                                type="date"
                                                value={formData.expiryDate}
                                                onChange={handleExpiryDateChange}
                                                min={today}
                                                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                )}

                                {formData.idType === "passport" && (
                                    <div>
                                        <label className="block text-sm font-medium text-[#063A41] mb-2">Passport</label>
                                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                                            {getPreviewUrl("passportUrl") ? (
                                                <div className="space-y-3">
                                                    <Image
                                                        src={getPreviewUrl("passportUrl")}
                                                        alt="Passport"
                                                        width={120}
                                                        height={80}
                                                        className="mx-auto rounded-lg object-cover"
                                                        unoptimized
                                                    />
                                                    {!isLocalPreview("passportUrl") && (
                                                        <span className="text-xs text-[#109C3D]">✓ Uploaded</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-gray-400">
                                                    <FileText className="w-8 h-8 mx-auto mb-2" />
                                                    <p className="text-sm">Upload passport image</p>
                                                </div>
                                            )}
                                            <label className="mt-3 cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#E5FFDB] text-[#063A41] rounded-lg hover:bg-[#d4f5c8] transition-colors">
                                                <Upload className="w-4 h-4" />
                                                {getPreviewUrl("passportUrl") ? "Change" : "Upload"}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleFileChange(e, "passportUrl")}
                                                    className="hidden"
                                                    disabled={isUploading}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {formData.idType === "governmentID" && (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#063A41] mb-2">ID Front</label>
                                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                                                {getPreviewUrl("governmentIdFront") ? (
                                                    <Image
                                                        src={getPreviewUrl("governmentIdFront")}
                                                        alt="ID Front"
                                                        width={100}
                                                        height={60}
                                                        className="mx-auto rounded-lg object-cover"
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <FileText className="w-8 h-8 mx-auto text-gray-300" />
                                                )}
                                                <label className="mt-2 cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 bg-[#E5FFDB] text-[#063A41] text-sm rounded-lg">
                                                    <Upload className="w-3 h-3" />
                                                    Upload
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleFileChange(e, "governmentIdFront")}
                                                        className="hidden"
                                                        disabled={isUploading}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#063A41] mb-2">ID Back</label>
                                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                                                {getPreviewUrl("governmentIdBack") ? (
                                                    <Image
                                                        src={getPreviewUrl("governmentIdBack")}
                                                        alt="ID Back"
                                                        width={100}
                                                        height={60}
                                                        className="mx-auto rounded-lg object-cover"
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <FileText className="w-8 h-8 mx-auto text-gray-300" />
                                                )}
                                                <label className="mt-2 cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 bg-[#E5FFDB] text-[#063A41] text-sm rounded-lg">
                                                    <Upload className="w-3 h-3" />
                                                    Upload
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleFileChange(e, "governmentIdBack")}
                                                        className="hidden"
                                                        disabled={isUploading}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={handleSaveIdVerification}
                            disabled={isUpdating}
                            className="w-full py-3 bg-[#109C3D] text-white font-medium rounded-lg hover:bg-[#0d8534] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {isUpdating ? "Saving..." : "Save & Continue"}
                        </button>
                    </div>
                )}

                {/* Payment Settings */}
                {activeSection === 'payment' && (
                    <div className="space-y-4">
                        <div className="bg-white rounded-lg border p-5">
                            <h3 className="font-medium text-[#063A41] mb-4">Payment Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#063A41] mb-1">Account Holder Name</label>
                                    <input
                                        type="text"
                                        placeholder="Full name as on bank account"
                                        value={formData.accountHolder}
                                        onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#063A41] mb-1">Account Number</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., 123456789"
                                        value={formData.accountNumber}
                                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#063A41] mb-1">Routing Number</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., 021000021"
                                        value={formData.routingNumber}
                                        onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleSavePaymentSettings}
                            disabled={isUpdating}
                            className="w-full py-3 bg-[#109C3D] text-white font-medium rounded-lg hover:bg-[#0d8534] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {isUpdating ? "Saving..." : "Save & Continue"}
                        </button>
                    </div>
                )}

                {/* Insurance */}
                {activeSection === 'insurance' && (
                    <div className="space-y-4">
                        <div className="bg-white rounded-lg border p-5">
                            <h3 className="font-medium text-[#063A41] mb-4">Insurance</h3>

                            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                                <span className="text-sm font-medium text-[#063A41]">I have professional insurance</span>
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={formData.hasInsurance}
                                        onChange={(e) => handleHasInsuranceChange(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#109C3D]"></div>
                                </div>
                            </label>

                            {showInsuranceUpload && (
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-[#063A41] mb-2">Insurance Document</label>
                                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                                        {getPreviewUrl("insuranceDocument") ? (
                                            <div className="space-y-3">
                                                <Image
                                                    src={getPreviewUrl("insuranceDocument")}
                                                    alt="Insurance"
                                                    width={120}
                                                    height={80}
                                                    className="mx-auto rounded-lg object-cover"
                                                    unoptimized
                                                />
                                                {!isLocalPreview("insuranceDocument") && (
                                                    <span className="text-xs text-[#109C3D]">✓ Uploaded</span>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-gray-400">
                                                <FileText className="w-8 h-8 mx-auto mb-2" />
                                                <p className="text-sm">Upload insurance document</p>
                                            </div>
                                        )}
                                        <label className="mt-3 cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#E5FFDB] text-[#063A41] rounded-lg hover:bg-[#d4f5c8] transition-colors">
                                            <Upload className="w-4 h-4" />
                                            {getPreviewUrl("insuranceDocument") ? "Change" : "Upload"}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e, "insuranceDocument")}
                                                className="hidden"
                                                disabled={isUploading}
                                            />
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleSaveInsurance}
                            disabled={isUpdating}
                            className="w-full py-3 bg-[#109C3D] text-white font-medium rounded-lg hover:bg-[#0d8534] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {isUpdating ? "Saving..." : "Save & Continue"}
                        </button>
                    </div>
                )}

                {/* Background Check */}
                {activeSection === 'background' && (
                    <div className="space-y-4">
                        <div className="bg-white rounded-lg border p-5">
                            <h3 className="font-medium text-[#063A41] mb-4">Background Check Consent</h3>

                            <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.backgroundCheckConsent}
                                    onChange={(e) => handleBackgroundCheckConsentChange(e.target.checked)}
                                    className="mt-1 w-5 h-5 text-[#109C3D] border-gray-300 rounded focus:ring-[#109C3D]"
                                />
                                <span className="text-sm text-[#063A41]">
                                    I consent to background checks as part of the verification process. This helps ensure trust and safety on our platform.
                                </span>
                            </label>

                            {formData.backgroundCheckConsent && (
                                <div className="mt-4 flex items-center gap-2 text-[#109C3D]">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="text-sm font-medium">Consent granted</span>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleSaveBackgroundCheck}
                            disabled={isUpdating}
                            className="w-full py-3 bg-[#109C3D] text-white font-medium rounded-lg hover:bg-[#0d8534] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {isUpdating ? "Saving..." : "Save"}
                        </button>
                    </div>
                )}

                {/* Submit Application Section */}
                <div className="mt-8">
                    {!allSectionsCompleted && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
                            <h3 className="text-lg font-semibold text-amber-800 mb-2">Complete All Sections</h3>
                            <p className="text-amber-700">
                                {sections.length - completedSections.size} section(s) remaining before you can submit.
                            </p>
                        </div>
                    )}

                    {canSubmitApplication && (
                        <div className="bg-[#E5FFDB] border border-[#109C3D] rounded-lg p-6 text-center">
                            <h3 className="text-xl font-bold text-[#063A41] mb-2">Ready to Submit!</h3>
                            <p className="text-gray-600 mb-6">Your profile is complete. Submit for admin review.</p>
                            <button
                                onClick={async () => {
                                    try {
                                        await submitTaskerApplication().unwrap();
                                        toast.success("Application submitted!");
                                        router.push('/');
                                    } catch (err: any) {
                                        toast.error(err?.data?.message || "Failed to submit.");
                                    }
                                }}
                                disabled={isSubmittingApplication}
                                className="px-8 py-3 bg-[#063A41] text-white font-bold rounded-lg hover:bg-[#0a4a52] transition-colors"
                            >
                                {isSubmittingApplication ? "Submitting..." : "Submit Application"}
                            </button>
                        </div>
                    )}

                    {userDetails?.user?.taskerStatus === "under_review" && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                            <div className="flex items-center justify-center gap-3 mb-2">
                                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                <h3 className="text-lg font-semibold text-blue-800">Under Review</h3>
                            </div>
                            <p className="text-blue-700">Our team is reviewing your application (24-48 hours).</p>
                        </div>
                    )}

                    {userDetails?.user?.taskerStatus === "approved" && (
                        <div className="bg-[#E5FFDB] border border-[#109C3D] rounded-lg p-6 text-center">
                            <div className="flex items-center justify-center gap-2 text-[#109C3D] mb-2">
                                <CheckCircle className="w-6 h-6" />
                                <h3 className="text-lg font-bold">Approved!</h3>
                            </div>
                            <p className="text-[#063A41]">You can now switch to Tasker mode from the navbar.</p>
                        </div>
                    )}

                    {userDetails?.user?.taskerStatus === "rejected" && !canSubmitApplication && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                            <h3 className="text-lg font-semibold text-red-800 mb-2">Application Rejected</h3>
                            <p className="text-red-700 mb-2">
                                Reason: {userDetails.user.taskerRejectionReason || "Not provided"}
                            </p>
                            <p className="text-gray-600 text-sm">Complete all sections to resubmit.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UpdateDocument;