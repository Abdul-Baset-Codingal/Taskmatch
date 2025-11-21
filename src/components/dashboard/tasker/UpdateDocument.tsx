/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useGetUserByIdQuery, useUpdateUserMutation } from "@/features/auth/authApi";
import { checkLoginStatus } from "@/resusable/CheckUser";
import { toast } from "react-toastify";
import { Save, Upload, CheckCircle, AlertCircle, User, Shield, FileText, X, Calendar, Edit3, Globe, Clock, Banknote } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/shared/Navbar";
const uploadToImgBB = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(
        `https://api.imgbb.com/1/upload?key=8b35d4601167f12207fbc7c8117f897e`,
        {
            method: 'POST',
            body: formData,
        }
    );
    const data = await res.json();
    if (!data.success) {
        throw new Error(data.error.message || 'Image upload failed');
    }
    return data.data.url; // Return the ImgBB URL
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
        insuranceDocument: "" as string, // URL
        backgroundCheckConsent: false as boolean,
        profilePicture: "" as string, // URL (now supports local blob: URLs)
        sin: "" as string,
        firstName: "" as string,
        lastName: "" as string,
        email: "" as string,
        // New profile fields
        dob: "" as string,
        about: "" as string,
        language: "" as string,
        yearsOfExperience: "" as string,
        // Bank details
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
    const localUrlsRef = useRef(new Map<string, string>()); // Track local URLs for cleanup
    // Check login status
    useEffect(() => {
        const fetchUser = async () => {
            const { isLoggedIn, user } = await checkLoginStatus();
            if (isLoggedIn) {
                setUser(user);
                console.log("User object:", user);
            } else {
                router.push("/login");
            }
        };
        fetchUser();
    }, [router]);
    const { data: userDetails, refetch, isLoading: isUserLoading } = useGetUserByIdQuery(user?._id || "", {
        skip: !user?._id,
    });
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation(); // Ensure this line is present
    // Compute current date for restrictions
    const today = "2025-11-01";
    const minYear = "1900-01-01";
    const maxFutureYear = "2040-12-31";
    // UPDATED: Populate formData with userDetails.user (based on API response structure)
    useEffect(() => {
        if (userDetails && userDetails.user && user?._id) {
            console.log('Full userDetails.user:', userDetails.user); // Debug: Log full structure
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
                // New profile fields
                dob: userDetails.user.dob ? new Date(userDetails.user.dob).toISOString().split('T')[0] : "",
                about: userDetails.user.about || "",
                language: userDetails.user.language || "",
                yearsOfExperience: userDetails.user.yearsOfExperience || "",
                // Bank details
                accountHolder: userDetails.user.accountHolder || "",
                accountNumber: userDetails.user.accountNumber || "",
                routingNumber: userDetails.user.routingNumber || "",
            });
            setShowInsuranceUpload(userDetails.user.hasInsurance || false);
            console.log('Populating formData from userDetails.user'); // Debug log
        }
    }, [userDetails, user]);
    // Cleanup local URLs on unmount
    useEffect(() => {
        return () => {
            localUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
            localUrlsRef.current.clear();
        };
    }, []);
    // Handle file upload (Updated to use ImgBB for images)
    const handleFileUpload = async (file: File, field: keyof typeof formData): Promise<string | null> => {
        if (!file) return null;
        // Check if it's an image; ImgBB is for images only
        if (!file.type.startsWith('image/')) {
            toast.error(`${field} must be an image file.`);
            return null;
        }
        setIsUploading(true);
        setUploadField(field);
        try {
            const url = await uploadToImgBB(file);
            toast.success(`${field} uploaded successfully!`);
            setIsUploading(false);
            setUploadField(null);
            return url;
        } catch (error) {
            console.error("Upload failed:", error);
            toast.error(`Failed to upload ${field}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setIsUploading(false);
            setUploadField(null);
            return null;
        }
    };
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof formData) => {
        const file = e.target.files?.[0];
        if (file) {
            // Create local preview URL immediately
            const localUrl = URL.createObjectURL(file);
            localUrlsRef.current.set(field, localUrl);
            // Set selected file and update formData with local URL for instant preview
            setSelectedFiles(prev => ({ ...prev, [field]: file }));
            setFormData(prev => ({ ...prev, [field]: localUrl }));
            // Upload to server in background
            const uploadedUrl = await handleFileUpload(file, field);
            if (uploadedUrl) {
                // Replace local URL with server URL on success
                setFormData(prev => ({ ...prev, [field]: uploadedUrl }));
                // Cleanup local URL
                const oldLocalUrl = localUrlsRef.current.get(field);
                if (oldLocalUrl) {
                    URL.revokeObjectURL(oldLocalUrl);
                    localUrlsRef.current.delete(field);
                }
            } else {
                // On failure, keep local so user sees it; you can add a "retry" button
            }
            // Clear selected after handling
            setSelectedFiles(prev => ({ ...prev, [field]: null }));
            // Reset input
            e.target.value = '';
        }
    };
    // Clear selected file (before upload or cancel)
    const clearSelectedFile = (field: keyof typeof formData) => {
        const file = selectedFiles[field];
        const localUrl = localUrlsRef.current.get(field);
        if (localUrl) {
            URL.revokeObjectURL(localUrl);
            localUrlsRef.current.delete(field);
        }
        setSelectedFiles(prev => ({ ...prev, [field]: null }));
        // Revert to original (server) URL or empty
        setFormData(prev => ({ ...prev, [field]: '' })); // Or fetch original if needed
    };
    // Get preview URL for display (now prioritizes formData for seamless transition)
    const getPreviewUrl = (field: string): string => {
        return formData[field as keyof typeof formData] || '';
    };
    // Check if it's an image (updated for local/server URLs)
    const isImagePreview = (field: string): boolean => {
        const url = getPreviewUrl(field);
        if (!url) return false;
        // Check extension or blob: prefix
        return /\.(png|jpg|jpeg|gif|webp)$/i.test(url) || url.startsWith('blob:');
    };
    // Check if local (for clear button)
    const isLocalPreview = (field: string): boolean => {
        const url = getPreviewUrl(field);
        return url.startsWith('blob:');
    };
    // Needs unoptimized for NextImage (local/blob or external)
    const needsUnoptimized = (src: string): boolean => !src.startsWith('/'); // Local paths are optimized, others not
    // Render preview component (with fallback)
    const renderPreview = (field: string, alt: string, sizeClass: string, width: number, height: number) => {
        const previewUrl = getPreviewUrl(field);
        if (!previewUrl) return null;
        const commonProps = {
            src: previewUrl,
            alt,
            width,
            height,
            className: `object-cover rounded border ${sizeClass}`,
            unoptimized: needsUnoptimized(previewUrl),
            // Fallback for broken images
            onError: (e: any) => {
                console.warn(`Failed to load preview for ${field}`);
                (e.target as HTMLImageElement).src = '/placeholder-avatar.png'; // Or generic placeholder
            },
        };
        const isImg = isImagePreview(field);
        return (
            <div className="relative inline-block">
                {isImg ? (
                    <Image {...commonProps} />
                ) : (
                    <div className={`${sizeClass} border-2 border-dashed border-gray-300 rounded flex items-center justify-center bg-gray-50`}>
                        <FileText className="h-6 w-6 text-gray-400" />
                        <span className="text-xs text-gray-500 ml-1">Document</span>
                    </div>
                )}
                {isLocalPreview(field) && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => clearSelectedFile(field as keyof typeof formData)}
                        className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
                    >
                        <X className="h-2 w-2" />
                    </Button>
                )}
            </div>
        );
    };
    // Get status badge (updated for local/server distinction)
    const getStatusBadge = (field: string) => {
        const url = getPreviewUrl(field);
        const isLocal = isLocalPreview(field);
        if (isLocal) {
            return (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Preview: Uploading...
                </Badge>
            );
        } else if (url) {
            return (
                <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Uploaded
                </Badge>
            );
        }
        return null;
    };
    const handleIdTypeChange = (value: string) => {
        setFormData({ ...formData, idType: value });
        // Clear opposite fields
        if (value === "passport") {
            setFormData(prev => ({ ...prev, governmentIdFront: "", governmentIdBack: "" }));
        } else if (value === "governmentID") {
            setFormData(prev => ({ ...prev, passportUrl: "" }));
        }
    };
    const handleIssueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value) {
            const date = new Date(value);
            if (isNaN(date.getTime())) {
                toast.error("Please enter a valid issue date.");
                return;
            }
            // Additional check: year must be exactly 4 digits (though format ensures it)
            const year = value.split('-')[0];
            if (year.length !== 4 || isNaN(Number(year))) {
                toast.error("Year must be a valid 4-digit number.");
                return;
            }
        }
        setFormData(prev => ({ ...prev, issueDate: value }));
    };
    const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value) {
            const date = new Date(value);
            if (isNaN(date.getTime())) {
                toast.error("Please enter a valid expiry date.");
                return;
            }
            // Additional check: year must be exactly 4 digits (though format ensures it)
            const year = value.split('-')[0];
            if (year.length !== 4 || isNaN(Number(year))) {
                toast.error("Year must be a valid 4-digit number.");
                return;
            }
        }
        setFormData(prev => ({ ...prev, expiryDate: value }));
    };
    const handleHasInsuranceChange = (checked: boolean) => {
        setFormData({ ...formData, hasInsurance: checked });
        setShowInsuranceUpload(checked);
        if (!checked) {
            setFormData({ ...formData, insuranceDocument: "" });
            // Cleanup local if any
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
    const handleSinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, sin: e.target.value });
    };
    // New handlers for profile fields
    const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value) {
            const date = new Date(value);
            if (isNaN(date.getTime())) {
                toast.error("Please enter a valid date of birth.");
                return;
            }
            const year = value.split('-')[0];
            if (year.length !== 4 || isNaN(Number(year))) {
                toast.error("Year must be a valid 4-digit number.");
                return;
            }
        }
        setFormData(prev => ({ ...prev, dob: value }));
    };
    const handleAboutChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({ ...formData, about: e.target.value });
    };
    const handleLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, language: e.target.value });
    };
    const handleYearsOfExperienceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value && (isNaN(Number(value)) || Number(value) < 0)) {
            toast.error("Years of experience must be a non-negative number.");
            return;
        }
        setFormData({ ...formData, yearsOfExperience: value });
    };
    // Handlers for bank details
    const handleAccountHolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, accountHolder: e.target.value });
    };
    const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, accountNumber: e.target.value });
    };
    const handleRoutingNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, routingNumber: e.target.value });
    };
    // NEW: Individual save handlers for partial updates
    const handleSaveProfessionalProfile = async () => {
        if (!user?._id) {
            toast.error("User not logged in.");
            return;
        }
        // Validate missing fields if specified
        if (hasMissingFields) {
            const relevantMissing = missingFields.filter(f => ['dob', 'yearsOfExperience', 'language', 'about'].includes(f));
            for (const field of relevantMissing) {
                const value = formData[field as keyof typeof formData];
                if (!value) {
                    toast.error(`The field "${field}" is required for Tasker verification.`);
                    return;
                }
                // Additional checks for dates
                if (field === 'dob') {
                    if (value && new Date(value as string).toString() === 'Invalid Date') {
                        toast.error(`Invalid date for ${field}.`);
                        return;
                    }
                }
            }
        }
        // Prepare payload with only relevant fields
        const payload: any = { userId: user._id };
        if (formData.dob) {
            const dobDate = new Date(formData.dob);
            if (!isNaN(dobDate.getTime())) {
                payload.dob = dobDate;
            }
        }
        if (formData.about) payload.about = formData.about;
        if (formData.language) payload.language = formData.language;
        if (formData.yearsOfExperience) payload.yearsOfExperience = formData.yearsOfExperience;
        // If no fields to update, exit
        if (Object.keys(payload).length === 1) {
            toast.info("No changes in professional profile to save.");
            return;
        }
        try {
            const result = await updateUser(payload).unwrap();
            await refetch();
            toast.success("Professional profile updated successfully!");
        } catch (err: any) {
            console.error("Failed to update professional profile:", err);
            toast.error(`Update failed: ${err.data?.error || err.message || "Unknown error"}`);
        }
    };
    const handleSavePersonalInfo = async () => {
        if (!user?._id) {
            toast.error("User not logged in.");
            return;
        }
        // Validate missing fields if specified
        if (hasMissingFields) {
            if (missingFields.includes('sin') && !formData.sin) {
                toast.error("SIN is required for Tasker verification.");
                return;
            }
            if (missingFields.includes('profilePicture') && !formData.profilePicture) {
                toast.error("Profile picture is required for Tasker verification.");
                return;
            }
        }
        // Check for pending local uploads
        if (formData.profilePicture && formData.profilePicture.startsWith('blob:')) {
            toast.warn("Please complete profile picture upload before saving.");
            return;
        }
        // Prepare payload with only relevant fields
        const payload: any = { userId: user._id };
        if (formData.sin) payload.sin = formData.sin;
        if (formData.profilePicture && !formData.profilePicture.startsWith('blob:')) {
            payload.profilePicture = formData.profilePicture;
        }
        // If no fields to update, exit
        if (Object.keys(payload).length === 1) {
            toast.info("No changes in personal info to save.");
            return;
        }
        try {
            const result = await updateUser(payload).unwrap();
            await refetch();
            toast.success("Personal info updated successfully!");
        } catch (err: any) {
            console.error("Failed to update personal info:", err);
            toast.error(`Update failed: ${err.data?.error || err.message || "Unknown error"}`);
        }
    };
    const handleSaveIdVerification = async () => {
        if (!user?._id) {
            toast.error("User not logged in.");
            return;
        }
        // Validate missing fields if specified
        if (hasMissingFields) {
            if (missingFields.includes('idType') && !formData.idType) {
                toast.error("ID type is required for Tasker verification.");
                return;
            }
            if (missingFields.includes('issueDate') && !formData.issueDate) {
                toast.error("Issue date is required for Tasker verification.");
                return;
            }
            if (missingFields.includes('expiryDate') && !formData.expiryDate) {
                toast.error("Expiry date is required for Tasker verification.");
                return;
            }
            if (formData.idType === "passport" && missingFields.includes('passportUrl') && !formData.passportUrl) {
                toast.error("Passport is required for Tasker verification.");
                return;
            }
            if (formData.idType === "governmentID") {
                if (missingFields.includes('governmentIdFront') && !formData.governmentIdFront) {
                    toast.error("Government ID front is required for Tasker verification.");
                    return;
                }
                if (missingFields.includes('governmentIdBack') && !formData.governmentIdBack) {
                    toast.error("Government ID back is required for Tasker verification.");
                    return;
                }
            }
        }
        // Basic validation
        if (!formData.idType) {
            toast.error("Please select an ID type.");
            return;
        }
        if (formData.idType === "passport" && !formData.passportUrl) {
            toast.error("Please upload your passport.");
            return;
        }
        if (formData.idType === "governmentID" && (!formData.governmentIdFront || !formData.governmentIdBack)) {
            toast.error("Please upload front and back of your government ID.");
            return;
        }
        if (formData.idType && (!formData.issueDate || !formData.expiryDate)) {
            toast.error("Please provide issue and expiry dates for your ID.");
            return;
        }
        if (formData.issueDate && formData.expiryDate && new Date(formData.expiryDate) <= new Date(formData.issueDate)) {
            toast.error("Expiry date must be after issue date.");
            return;
        }
        // Check for pending local uploads
        const idFields = formData.idType === "passport" ? ['passportUrl'] : ['governmentIdFront', 'governmentIdBack'];
        for (const f of idFields) {
            const url = formData[f as keyof typeof formData];
            if (url && url.startsWith('blob:')) {
                toast.warn(`Please complete ${f} upload before saving.`);
                return;
            }
        }
        // Prepare payload with only relevant fields
        const payload: any = { userId: user._id, idType: formData.idType };
        if (formData.passportUrl && !formData.passportUrl.startsWith('blob:')) {
            payload.passportUrl = formData.passportUrl;
        }
        if (formData.governmentIdFront && !formData.governmentIdFront.startsWith('blob:')) {
            payload.governmentIdFront = formData.governmentIdFront;
        }
        if (formData.governmentIdBack && !formData.governmentIdBack.startsWith('blob:')) {
            payload.governmentIdBack = formData.governmentIdBack;
        }
        if (formData.issueDate) {
            const issueDate = new Date(formData.issueDate);
            if (!isNaN(issueDate.getTime())) {
                payload.issueDate = issueDate;
            }
        }
        if (formData.expiryDate) {
            const expiryDate = new Date(formData.expiryDate);
            if (!isNaN(expiryDate.getTime())) {
                payload.expiryDate = expiryDate;
            }
        }
        // If no fields to update, exit
        if (Object.keys(payload).length === 2) { // userId + idType, but if no uploads/dates, minimal
            toast.info("No changes in ID verification to save.");
            return;
        }
        try {
            const result = await updateUser(payload).unwrap();
            await refetch();
            toast.success("ID verification updated successfully!");
        } catch (err: any) {
            console.error("Failed to update ID verification:", err);
            toast.error(`Update failed: ${err.data?.error || err.message || "Unknown error"}`);
        }
    };
    const handleSaveInsurance = async () => {
        if (!user?._id) {
            toast.error("User not logged in.");
            return;
        }
        // Validate missing fields if specified
        if (hasMissingFields) {
            if (missingFields.includes('hasInsurance') && formData.hasInsurance === undefined) {
                toast.error("Insurance declaration is required for Tasker verification.");
                return;
            }
            if (formData.hasInsurance && missingFields.includes('insuranceDocument') && !formData.insuranceDocument) {
                toast.error("Insurance document is required for Tasker verification.");
                return;
            }
        }
        // Basic validation
        if (formData.hasInsurance && !formData.insuranceDocument) {
            toast.error("Please upload insurance document if you have insurance.");
            return;
        }
        // Check for pending local uploads
        if (formData.insuranceDocument && formData.insuranceDocument.startsWith('blob:')) {
            toast.warn("Please complete insurance document upload before saving.");
            return;
        }
        // Prepare payload with only relevant fields
        const payload: any = { userId: user._id, hasInsurance: formData.hasInsurance };
        if (formData.insuranceDocument && !formData.insuranceDocument.startsWith('blob:')) {
            payload.insuranceDocument = formData.insuranceDocument;
        }
        // If no changes, exit
        if (!formData.insuranceDocument && formData.hasInsurance === false) {
            toast.info("No changes in insurance to save.");
            return;
        }
        try {
            const result = await updateUser(payload).unwrap();
            await refetch();
            toast.success("Insurance updated successfully!");
        } catch (err: any) {
            console.error("Failed to update insurance:", err);
            toast.error(`Update failed: ${err.data?.error || err.message || "Unknown error"}`);
        }
    };
    const handleSaveBackgroundCheck = async () => {
        if (!user?._id) {
            toast.error("User not logged in.");
            return;
        }
        // Validate missing fields if specified
        if (hasMissingFields && missingFields.includes('backgroundCheckConsent') && !formData.backgroundCheckConsent) {
            toast.error("Background check consent is required for Tasker verification.");
            return;
        }
        // Prepare payload
        const payload = {
            userId: user._id,
            backgroundCheckConsent: formData.backgroundCheckConsent,
        };
        try {
            const result = await updateUser(payload).unwrap();
            await refetch();
            toast.success("Background check consent updated successfully!");
        } catch (err: any) {
            console.error("Failed to update background check:", err);
            toast.error(`Update failed: ${err.data?.error || err.message || "Unknown error"}`);
        }
    };
    const handleSavePaymentSettings = async () => {
        if (!user?._id) {
            toast.error("User not logged in.");
            return;
        }
        // Validate if specified in missing fields
        if (hasMissingFields) {
            if (missingFields.includes('accountHolder') && !formData.accountHolder) {
                toast.error("Account holder name is required.");
                return;
            }
            if (missingFields.includes('accountNumber') && !formData.accountNumber) {
                toast.error("Account number is required.");
                return;
            }
            if (missingFields.includes('routingNumber') && !formData.routingNumber) {
                toast.error("Routing number is required.");
                return;
            }
        }
        // Prepare payload with only relevant fields
        const payload: any = { userId: user._id };
        if (formData.accountHolder) payload.accountHolder = formData.accountHolder;
        if (formData.accountNumber) payload.accountNumber = formData.accountNumber;
        if (formData.routingNumber) payload.routingNumber = formData.routingNumber;
        // If no fields to update, exit
        if (Object.keys(payload).length === 1) {
            toast.info("No changes in payment settings to save.");
            return;
        }
        try {
            const result = await updateUser(payload).unwrap();
            await refetch();
            toast.success("Payment settings updated successfully!");
        } catch (err: any) {
            console.error("Failed to update payment settings:", err);
            toast.error(`Update failed: ${err.data?.error || err.message || "Unknown error"}`);
        }
    };
    const handleSaveChanges = async () => {
        if (!user?._id) {
            toast.error("User not logged in.");
            return;
        }
        // Validate missing fields if specified
        if (hasMissingFields) {
            for (const field of missingFields) {
                const value = formData[field as keyof typeof formData];
                if (!value) {
                    toast.error(`The field "${field}" is required for Tasker verification.`);
                    return;
                }
                // Additional checks for dates
                if (['issueDate', 'expiryDate', 'dob'].includes(field)) {
                    if (value && new Date(value as string).toString() === 'Invalid Date') {
                        toast.error(`Invalid date for ${field}.`);
                        return;
                    }
                }
            }
        }
        // Existing validations (for full profile update)
        if (!hasMissingFields) {
            if (!formData.idType) {
                toast.error("Please select an ID type.");
                return;
            }
            if (formData.idType === "passport" && !formData.passportUrl) {
                toast.error("Please upload your passport.");
                return;
            }
            if (formData.idType === "governmentID" && (!formData.governmentIdFront || !formData.governmentIdBack)) {
                toast.error("Please upload front and back of your government ID.");
                return;
            }
            if (formData.idType && (!formData.issueDate || !formData.expiryDate)) {
                toast.error("Please provide issue and expiry dates for your ID.");
                return;
            }
            if (formData.issueDate && formData.expiryDate && new Date(formData.expiryDate) <= new Date(formData.issueDate)) {
                toast.error("Expiry date must be after issue date.");
                return;
            }
            if (formData.hasInsurance && !formData.insuranceDocument) {
                toast.error("Please upload insurance document if you have insurance.");
                return;
            }
        }
        // Before save, ensure no local URLs are sent (filter them out)
        const cleanFormData = { ...formData };
        const urlFields = ['passportUrl', 'governmentIdFront', 'governmentIdBack', 'insuranceDocument', 'profilePicture'] as const;
        let hasPendingLocal = false;
        urlFields.forEach(key => {
            const value = cleanFormData[key];
            if (typeof value === 'string' && value.startsWith('blob:')) {
                hasPendingLocal = true;
            }
        });
        if (hasPendingLocal) {
            toast.warn(`Please complete uploads before saving.`);
            return; // Abort save if any local pending
        }
        // Prepare payload with proper Date objects
        const payload: any = {
            userId: user._id,
            idType: cleanFormData.idType,
            ...(cleanFormData.idType === "passport" && { passportUrl: cleanFormData.passportUrl }),
            ...(cleanFormData.idType === "governmentID" && {
                governmentIdFront: cleanFormData.governmentIdFront,
                governmentIdBack: cleanFormData.governmentIdBack
            }),
        };
        // Handle dates only if valid
        if (cleanFormData.issueDate) {
            const issueDate = new Date(cleanFormData.issueDate);
            if (!isNaN(issueDate.getTime())) {
                payload.issueDate = issueDate;
            }
        }
        if (cleanFormData.expiryDate) {
            const expiryDate = new Date(cleanFormData.expiryDate);
            if (!isNaN(expiryDate.getTime())) {
                payload.expiryDate = expiryDate;
            }
        }
        payload.hasInsurance = cleanFormData.hasInsurance;
        if (cleanFormData.insuranceDocument) {
            payload.insuranceDocument = cleanFormData.insuranceDocument;
        }
        payload.backgroundCheckConsent = cleanFormData.backgroundCheckConsent;
        if (cleanFormData.profilePicture) {
            payload.profilePicture = cleanFormData.profilePicture;
        }
        if (cleanFormData.sin) {
            payload.sin = cleanFormData.sin;
        }
        // New profile fields
        if (cleanFormData.dob) {
            const dobDate = new Date(cleanFormData.dob);
            if (!isNaN(dobDate.getTime())) {
                payload.dob = dobDate;
            }
        }
        if (cleanFormData.about) {
            payload.about = cleanFormData.about;
        }
        if (cleanFormData.language) {
            payload.language = cleanFormData.language;
        }
        if (cleanFormData.yearsOfExperience) {
            payload.yearsOfExperience = cleanFormData.yearsOfExperience;
        }
        // Bank details
        if (cleanFormData.accountHolder) {
            payload.accountHolder = cleanFormData.accountHolder;
        }
        if (cleanFormData.accountNumber) {
            payload.accountNumber = cleanFormData.accountNumber;
        }
        if (cleanFormData.routingNumber) {
            payload.routingNumber = cleanFormData.routingNumber;
        }
        // Add roles to prevent undefined in validator
        payload.roles = [user.role];
        // Console log the data before sending
        console.log("Data being sent to updateUser:", payload);
        try {
            const result = await updateUser(payload).unwrap();
            // UPDATED: Manually update formData from response to ensure immediate reflection
            if (result.user) {
                setFormData({
                    idType: result.user.idType || "",
                    passportUrl: result.user.passportUrl || "",
                    governmentIdFront: result.user.governmentIdFront || "",
                    governmentIdBack: result.user.governmentIdBack || "",
                    issueDate: result.user.issueDate ? new Date(result.user.issueDate).toISOString().split('T')[0] : "",
                    expiryDate: result.user.expiryDate ? new Date(result.user.expiryDate).toISOString().split('T')[0] : "",
                    hasInsurance: result.user.hasInsurance || false,
                    insuranceDocument: result.user.insuranceDocument || "",
                    backgroundCheckConsent: result.user.backgroundCheckConsent || false,
                    profilePicture: result.user.profilePicture || "",
                    sin: result.user.sin || "",
                    firstName: result.user.firstName || "",
                    lastName: result.user.lastName || "",
                    email: result.user.email || "",
                    dob: result.user.dob ? new Date(result.user.dob).toISOString().split('T')[0] : "",
                    about: result.user.about || "",
                    language: result.user.language || "",
                    yearsOfExperience: result.user.yearsOfExperience || "",
                    accountHolder: result.user.accountHolder || "",
                    accountNumber: result.user.accountNumber || "",
                    routingNumber: result.user.routingNumber || "",
                });
                setShowInsuranceUpload(result.user.hasInsurance || false);
            }
            // Cleanup any remaining local URLs after save
            localUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
            localUrlsRef.current.clear();
            await refetch();
            if (hasMissingFields) {
                toast.success("Required fields completed! You can now switch to Tasker role.");
            } else {
                toast.success("Documents and profile updated successfully!");
            }
        } catch (err: any) {
            console.error("Failed to update:", err);
            toast.error(`Update failed: ${err.data?.error || err.message || "Unknown error"}`);
        }
    };
    if (isUserLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }
    if (!userDetails || !userDetails.user) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <p className="text-slate-600">Loading user details...</p>
            </div>
        );
    }
    return (
        <div>
            <div>
                <Navbar />
            </div>
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        Update Documents & Profile
                    </h1>
                    <p className="text-slate-600">Verify your identity, professional status, and complete your profile details.</p>
                </div>
                {/* Missing Fields Banner */}
                {hasMissingFields && (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h2 className="text-lg font-semibold text-yellow-800 mb-2">Complete Tasker Verification</h2>
                        <p className="text-yellow-700 mb-3">To switch to Tasker role, please fill the following required fields:</p>
                        <div className="flex flex-wrap gap-2">
                            {missingFields.map((field) => (
                                <Badge key={field} variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                    {field}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Profile Information Section */}
                    <Card className="lg:col-span-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg">
                            <CardTitle className="flex items-center gap-3 text-indigo-800">
                                <Edit3 className="h-6 w-6" />
                                Professional Profile
                            </CardTitle>
                            <CardDescription className="text-indigo-600">
                                Add details about yourself to build a complete professional profile.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Date of Birth */}
                            <div className="space-y-2">
                                <Label htmlFor="dob" className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                    <Calendar className="h-4 w-4" />
                                    Date of Birth {hasMissingFields && missingFields.includes('dob') && <span className="text-red-500">*</span>}
                                </Label>
                                <Input
                                    id="dob"
                                    type="date"
                                    value={formData.dob}
                                    onChange={handleDobChange}
                                    max={today}
                                    min={minYear}
                                    className="w-full"
                                    required={hasMissingFields && missingFields.includes('dob')}
                                />
                            </div>
                            {/* Years of Experience */}
                            <div className="space-y-2">
                                <Label htmlFor="yearsOfExperience" className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                    <Clock className="h-4 w-4" />
                                    Years of Experience {hasMissingFields && missingFields.includes('yearsOfExperience') && <span className="text-red-500">*</span>}
                                </Label>
                                <Input
                                    id="yearsOfExperience"
                                    type="number"
                                    min="0"
                                    placeholder="e.g., 5"
                                    value={formData.yearsOfExperience}
                                    onChange={handleYearsOfExperienceChange}
                                    className="w-full"
                                    required={hasMissingFields && missingFields.includes('yearsOfExperience')}
                                />
                            </div>
                            {/* Language */}
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="language" className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                    <Globe className="h-4 w-4" />
                                    Primary Language {hasMissingFields && missingFields.includes('language') && <span className="text-red-500">*</span>}
                                </Label>
                                <Input
                                    id="language"
                                    type="text"
                                    placeholder="e.g., English"
                                    value={formData.language}
                                    onChange={handleLanguageChange}
                                    className="w-full"
                                    required={hasMissingFields && missingFields.includes('language')}
                                />
                            </div>
                            {/* About */}
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="about" className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                    <User className="h-4 w-4" />
                                    About Me {hasMissingFields && missingFields.includes('about') && <span className="text-red-500">*</span>}
                                </Label>
                                <Textarea
                                    id="about"
                                    placeholder="Tell us about your background, skills, and what makes you a great tasker..."
                                    value={formData.about}
                                    onChange={handleAboutChange}
                                    rows={4}
                                    className="w-full"
                                    required={hasMissingFields && missingFields.includes('about')}
                                />
                            </div>
                            {/* NEW: Save button for this section */}
                            <div className="pt-4 border-t md:col-span-2">
                                <Button
                                    onClick={handleSaveProfessionalProfile}
                                    disabled={isUpdating}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    {isUpdating ? "Saving..." : "Save Profile"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Profile Picture Section - Updated for better preview persistence */}
                    <Card className="lg:col-span-1 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                            <CardTitle className="flex items-center gap-3 text-purple-800">
                                <User className="h-6 w-6" />
                                Profile Picture
                            </CardTitle>
                            <CardDescription className="text-purple-600">
                                Upload a professional profile photo.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            {/* First Name */}
                            <div className="space-y-2">
                                <Label htmlFor="firstName" className="block text-sm font-medium text-slate-700">
                                    First Name
                                </Label>
                                <Input
                                    id="firstName"
                                    type="text"
                                    value={formData.firstName}
                                    disabled
                                    className="w-full bg-gray-100"
                                />
                            </div>
                            {/* Last Name */}
                            <div className="space-y-2">
                                <Label htmlFor="lastName" className="block text-sm font-medium text-slate-700">
                                    Last Name
                                </Label>
                                <Input
                                    id="lastName"
                                    type="text"
                                    value={formData.lastName}
                                    disabled
                                    className="w-full bg-gray-100"
                                />
                            </div>
                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full bg-gray-100"
                                />
                            </div>
                            {/* SIN */}
                            <div className="space-y-2">
                                <label htmlFor="sin" className="block text-sm font-medium text-slate-700">
                                    SIN (Social Insurance Number) {hasMissingFields && missingFields.includes('sin') && <span className="text-red-500 ml-1">*</span>}
                                </label>
                                <Input
                                    id="sin"
                                    type="text"
                                    placeholder="e.g., 123456789"
                                    value={formData.sin}
                                    onChange={handleSinChange}
                                    className="w-full"
                                    required={hasMissingFields && missingFields.includes('sin')}
                                />
                            </div>
                            <div className="text-center">
                                <div className="relative mx-auto w-32 h-32">
                                    <Image
                                        src={getPreviewUrl("profilePicture") || "/placeholder-avatar.png"}
                                        alt="Profile"
                                        width={128}
                                        height={128}
                                        className="rounded-full object-cover border-4 border-purple-200"
                                        unoptimized={needsUnoptimized(getPreviewUrl("profilePicture") || "")}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "/placeholder-avatar.png";
                                        }}
                                    />
                                    {isLocalPreview("profilePicture") && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => clearSelectedFile("profilePicture")}
                                            className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    )}
                                </div>
                                <Label htmlFor="profilePicture" className="mt-4 items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-800 block">
                                    <Upload className="h-4 w-4" />
                                    {getPreviewUrl("profilePicture") ? "Update Profile Picture" : "Upload Profile Picture"} {hasMissingFields && missingFields.includes('profilePicture') && <span className="text-red-500">*</span>}
                                </Label>
                                <Input
                                    id="profilePicture"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, "profilePicture")}
                                    className="hidden"
                                    disabled={isUploading}
                                    required={hasMissingFields && missingFields.includes('profilePicture')}
                                />
                                {isUploading && uploadField === "profilePicture" && (
                                    <div className="flex items-center justify-center mt-2">
                                        <div className="animate-spin h-5 w-5 border-b-2 border-blue-500 rounded-full mr-2" />
                                        Uploading...
                                    </div>
                                )}
                                {getStatusBadge("profilePicture")}
                            </div>
                            {/* NEW: Save button for this section */}
                            <div className="pt-4 border-t">
                                <Button
                                    onClick={handleSavePersonalInfo}
                                    disabled={isUpdating}
                                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    {isUpdating ? "Saving..." : "Save Personal Info"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                    {/* ID Verification Section - Similar updates applied implicitly via shared functions */}
                    <Card className="lg:col-span-1 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                            <CardTitle className="flex items-center gap-3 text-blue-800">
                                <FileText className="h-6 w-6" />
                                Government ID Verification
                            </CardTitle>
                            <CardDescription className="text-blue-600">
                                Select your ID type and upload front and back (if applicable).
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="idType" className="block text-sm font-medium text-slate-700 mb-2">
                                        ID Type {hasMissingFields && missingFields.includes('idType') && <span className="text-red-500 ml-1">*</span>}
                                    </Label>
                                    <Select value={formData.idType} onValueChange={handleIdTypeChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select ID type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="passport">Passport</SelectItem>
                                            <SelectItem value="governmentID">Government ID (Front & Back)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {/* Issue and Expiry Dates - Shown after ID selection */}
                                {formData.idType && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <Label className="block mb-2 font-medium text-gray-700">
                                                Issue Date {hasMissingFields && missingFields.includes('issueDate') && <span className="text-red-500 ml-1">*</span>}
                                            </Label>
                                            <Input
                                                type="date"
                                                value={formData.issueDate}
                                                onChange={handleIssueDateChange}
                                                min={minYear}
                                                max={today}
                                                className="w-full rounded-xl border border-gray-300 px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#1A4F93] transition"
                                                required={hasMissingFields && missingFields.includes('issueDate')}
                                            />
                                        </div>
                                        <div>
                                            <Label className="block mb-2 font-medium text-gray-700">
                                                Expiry Date {hasMissingFields && missingFields.includes('expiryDate') && <span className="text-red-500 ml-1">*</span>}
                                            </Label>
                                            <Input
                                                type="date"
                                                value={formData.expiryDate}
                                                onChange={handleExpiryDateChange}
                                                min={today}
                                                max={maxFutureYear}
                                                className="w-full rounded-xl border border-gray-300 px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#1A4F93] transition"
                                                required={hasMissingFields && missingFields.includes('expiryDate')}
                                            />
                                        </div>
                                    </div>
                                )}
                                {/* Conditional ID Uploads */}
                                {formData.idType === "passport" && (
                                    <div>
                                        <Label htmlFor="passportUrl" className="block text-sm font-medium text-slate-700 mb-2">
                                            Passport {hasMissingFields && missingFields.includes('passportUrl') && <span className="text-red-500 ml-1">*</span>}
                                        </Label>
                                        <div className="space-y-2">
                                            <Input
                                                id="passportUrl"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e, "passportUrl")}
                                                className="w-full"
                                                disabled={isUploading}
                                                required={hasMissingFields && missingFields.includes('passportUrl')}
                                            />
                                            {isUploading && uploadField === "passportUrl" && (
                                                <div className="flex items-center justify-center">
                                                    <div className="animate-spin h-4 w-4 border-b-2 border-blue-500 rounded-full mr-2" />
                                                    Uploading...
                                                </div>
                                            )}
                                            {renderPreview("passportUrl", "Passport", "w-24 h-24", 96, 96)}
                                            {getStatusBadge("passportUrl")}
                                        </div>
                                    </div>
                                )}
                                {formData.idType === "governmentID" && (
                                    <div className="space-y-4">
                                        {/* Government ID Front */}
                                        <div>
                                            <Label htmlFor="governmentIdFront" className="block text-sm font-medium text-slate-700 mb-2">
                                                Government ID Front {hasMissingFields && missingFields.includes('governmentIdFront') && <span className="text-red-500 ml-1">*</span>}
                                            </Label>
                                            <div className="space-y-2">
                                                <Input
                                                    id="governmentIdFront"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleFileChange(e, "governmentIdFront")}
                                                    className="w-full"
                                                    disabled={isUploading}
                                                    required={hasMissingFields && missingFields.includes('governmentIdFront')}
                                                />
                                                {isUploading && uploadField === "governmentIdFront" && (
                                                    <div className="flex items-center justify-center">
                                                        <div className="animate-spin h-4 w-4 border-b-2 border-blue-500 rounded-full mr-2" />
                                                        Uploading...
                                                    </div>
                                                )}
                                                {renderPreview("governmentIdFront", "ID Front", "w-24 h-24", 96, 96)}
                                                {getStatusBadge("governmentIdFront")}
                                            </div>
                                        </div>
                                        {/* Government ID Back */}
                                        <div>
                                            <Label htmlFor="governmentIdBack" className="block text-sm font-medium text-slate-700 mb-2">
                                                Government ID Back {hasMissingFields && missingFields.includes('governmentIdBack') && <span className="text-red-500 ml-1">*</span>}
                                            </Label>
                                            <div className="space-y-2">
                                                <Input
                                                    id="governmentIdBack"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleFileChange(e, "governmentIdBack")}
                                                    className="w-full"
                                                    disabled={isUploading}
                                                    required={hasMissingFields && missingFields.includes('governmentIdBack')}
                                                />
                                                {isUploading && uploadField === "governmentIdBack" && (
                                                    <div className="flex items-center justify-center">
                                                        <div className="animate-spin h-4 w-4 border-b-2 border-blue-500 rounded-full mr-2" />
                                                        Uploading...
                                                    </div>
                                                )}
                                                {renderPreview("governmentIdBack", "ID Back", "w-24 h-24", 96, 96)}
                                                {getStatusBadge("governmentIdBack")}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* NEW: Save button for this section */}
                            <div className="pt-4 border-t">
                                <Button
                                    onClick={handleSaveIdVerification}
                                    disabled={isUpdating}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    {isUpdating ? "Saving..." : "Save ID Verification"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Payment Settings Section */}
                    <Card className="lg:col-span-1 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-lg">
                            <CardTitle className="flex items-center gap-3 text-green-800">
                                <Banknote className="h-6 w-6" />
                                Payment Settings
                            </CardTitle>
                            <CardDescription className="text-green-600">
                                Provide your bank details for receiving payments.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="accountHolder" className="block text-sm font-medium text-slate-700">
                                        Account Holder {hasMissingFields && missingFields.includes('accountHolder') && <span className="text-red-500 ml-1">*</span>}
                                    </Label>
                                    <Input
                                        id="accountHolder"
                                        type="text"
                                        placeholder="Full name as on bank account"
                                        value={formData.accountHolder}
                                        onChange={handleAccountHolderChange}
                                        className="w-full"
                                        required={hasMissingFields && missingFields.includes('accountHolder')}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="accountNumber" className="block text-sm font-medium text-slate-700">
                                        Account Number {hasMissingFields && missingFields.includes('accountNumber') && <span className="text-red-500 ml-1">*</span>}
                                    </Label>
                                    <Input
                                        id="accountNumber"
                                        type="text"
                                        placeholder="e.g., 123456789"
                                        value={formData.accountNumber}
                                        onChange={handleAccountNumberChange}
                                        className="w-full"
                                        required={hasMissingFields && missingFields.includes('accountNumber')}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="routingNumber" className="block text-sm font-medium text-slate-700">
                                        Routing Number {hasMissingFields && missingFields.includes('routingNumber') && <span className="text-red-500 ml-1">*</span>}
                                    </Label>
                                    <Input
                                        id="routingNumber"
                                        type="text"
                                        placeholder="e.g., 021000021"
                                        value={formData.routingNumber}
                                        onChange={handleRoutingNumberChange}
                                        className="w-full"
                                        required={hasMissingFields && missingFields.includes('routingNumber')}
                                    />
                                </div>
                            </div>
                            <div className="pt-4 border-t">
                                <Button
                                    onClick={handleSavePaymentSettings}
                                    disabled={isUpdating}
                                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    {isUpdating ? "Saving..." : "Save Payment Settings"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Insurance Section */}
                    <Card className="lg:col-span-1 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-lg">
                            <CardTitle className="flex items-center gap-3 text-emerald-800">
                                <Shield className="h-6 w-6" />
                                Insurance
                            </CardTitle>
                            <CardDescription className="text-emerald-600">
                                Declare if you have professional insurance and upload proof.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="hasInsurance" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                    I have professional insurance {hasMissingFields && missingFields.includes('hasInsurance') && <span className="text-red-500">*</span>}
                                </Label>
                                <Switch
                                    id="hasInsurance"
                                    checked={formData.hasInsurance}
                                    onCheckedChange={handleHasInsuranceChange}
                                />
                            </div>
                            {showInsuranceUpload && (
                                <div className="space-y-4 pt-4 border-t border-emerald-200">
                                    <div>
                                        <Label htmlFor="insuranceDocument" className="block text-sm font-medium text-slate-700 mb-2">
                                            Insurance Document {hasMissingFields && missingFields.includes('insuranceDocument') && <span className="text-red-500 ml-1">*</span>}
                                        </Label>
                                        <div className="space-y-2">
                                            <Input
                                                id="insuranceDocument"
                                                type="file"
                                                accept="image/*" // Limited to images for ImgBB; add PDF handling if needed
                                                onChange={(e) => handleFileChange(e, "insuranceDocument")}
                                                className="w-full"
                                                disabled={isUploading}
                                                required={hasMissingFields && missingFields.includes('insuranceDocument')}
                                            />
                                            {isUploading && uploadField === "insuranceDocument" && (
                                                <div className="flex items-center justify-center">
                                                    <div className="animate-spin h-4 w-4 border-b-2 border-emerald-500 rounded-full mr-2" />
                                                    Uploading...
                                                </div>
                                            )}
                                            {renderPreview("insuranceDocument", "Insurance Doc", "w-24 h-24", 96, 96)}
                                            {getStatusBadge("insuranceDocument")}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* NEW: Save button for this section */}
                            <div className="pt-4 border-t">
                                <Button
                                    onClick={handleSaveInsurance}
                                    disabled={isUpdating}
                                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    {isUpdating ? "Saving..." : "Save Insurance"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Background Check Consent Section */}
                    <Card className="lg:col-span-1 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 rounded-t-lg">
                            <CardTitle className="flex items-center gap-3 text-orange-800">
                                <AlertCircle className="h-6 w-6" />
                                Background Check
                            </CardTitle>
                            <CardDescription className="text-orange-600">
                                Consent to background checks for enhanced trust.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="backgroundCheckConsent"
                                    checked={formData.backgroundCheckConsent}
                                    onCheckedChange={handleBackgroundCheckConsentChange}
                                />
                                <Label htmlFor="backgroundCheckConsent" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    I consent to background checks as part of the verification process. {hasMissingFields && missingFields.includes('backgroundCheckConsent') && <span className="text-red-500">*</span>}
                                </Label>
                            </div>
                            {formData.backgroundCheckConsent && (
                                <Badge variant="default" className="bg-orange-100 text-orange-800">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Consent granted
                                </Badge>
                            )}
                            {/* NEW: Save button for this section */}
                            <div className="pt-4 border-t">
                                <Button
                                    onClick={handleSaveBackgroundCheck}
                                    disabled={isUpdating}
                                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    {isUpdating ? "Saving..." : "Save Background Consent"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
};
export default UpdateDocument;