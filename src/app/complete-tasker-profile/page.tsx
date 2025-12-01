// /* eslint-disable react/no-unescaped-entities */
// /* eslint-disable jsx-a11y/alt-text */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/ban-ts-comment */
// // @ts-nocheck

// "use client";

// import React, { useEffect, useState, useRef } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Image from "next/image";
// import { useGetUserByIdQuery, useSubmitTaskerApplicationMutation, useUpdateUserMutation } from "@/features/auth/authApi";
// import { checkLoginStatus } from "@/resusable/CheckUser";
// import { toast } from "react-toastify";
// import { Save, Upload, CheckCircle, AlertCircle, User, Shield, FileText, X, Calendar, Edit3, Globe, Clock, Banknote, ChevronRight, Lock } from "lucide-react";
// import Navbar from "@/shared/Navbar";

// const uploadToImgBB = async (file: File): Promise<string> => {
//     const formData = new FormData();
//     formData.append('image', file);
//     const res = await fetch(
//         'https://api.imgbb.com/1/upload?key=8b35d4601167f12207fbc7c8117f897e',
//         {
//             method: 'POST',
//             body: formData,
//         }
//     );
//     const data = await res.json();
//     if (!data.success) {
//         throw new Error(data.error.message || 'Image upload failed');
//     }
//     return data.data.url; // Return the ImgBB URL
// };

// const UpdateDocument = () => {
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const fieldsParam = searchParams.get('fields');
//     const missingFields = fieldsParam ? fieldsParam.split(',') : [];
//     const hasMissingFields = missingFields.length > 0;
//     const [user, setUser] = useState<{ _id: string; role: string } | null>(null);
//     const [formData, setFormData] = useState({
//         idType: "" as string,
//         passportUrl: "" as string,
//         governmentIdFront: "" as string,
//         governmentIdBack: "" as string,
//         issueDate: "" as string,
//         expiryDate: "" as string,
//         hasInsurance: false as boolean,
//         insuranceDocument: "" as string, // URL
//         backgroundCheckConsent: false as boolean,
//         profilePicture: "" as string, // URL (now supports local blob: URLs)
//         sin: "" as string,
//         firstName: "" as string,
//         lastName: "" as string,
//         email: "" as string,
//         // New profile fields
//         dob: "" as string,
//         about: "" as string,
//         language: "" as string,
//         yearsOfExperience: "" as string,
//         // Bank details
//         accountHolder: "" as string,
//         accountNumber: "" as string,
//         routingNumber: "" as string,
//     });

//     const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({
//         profilePicture: null,
//         passportUrl: null,
//         governmentIdFront: null,
//         governmentIdBack: null,
//         insuranceDocument: null,
//     });

//     const [isUploading, setIsUploading] = useState(false);
//     const [uploadField, setUploadField] = useState<keyof typeof formData | null>(null);
//     const [showInsuranceUpload, setShowInsuranceUpload] = useState(false);
//     const [activeSection, setActiveSection] = useState<string>('professional'); // Default to professional profile
//     const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
//     const [sectionValidation, setSectionValidation] = useState<Record<string, boolean>>({});

//     const localUrlsRef = useRef(new Map<string, string>()); // Track local URLs for cleanup

//     // Check login status
//     useEffect(() => {
//         const fetchUser = async () => {
//             const { isLoggedIn, user } = await checkLoginStatus();
//             if (isLoggedIn) {
//                 setUser(user);
//                 console.log("User object:", user);
//             } else {
//                 router.push("/login");
//             }
//         };
//         fetchUser();
//     }, [router]);

//     const { data: userDetails, refetch, isLoading: isUserLoading } = useGetUserByIdQuery(user?._id || "", {
//         skip: !user?._id,
//     });

//     const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

//     const [submitTaskerApplication, {
//         isLoading: isSubmittingApplication,
//         isSuccess: applicationSubmitted,
//         error: applicationError
//     }] = useSubmitTaskerApplicationMutation();

//     // Compute current date for restrictions
//     const today = "2025-11-14";
//     const minYear = "1900-01-01";
//     const maxFutureYear = "2040-12-31";

//     // UPDATED: Populate formData with userDetails.user (based on API response structure)
//     useEffect(() => {
//         if (userDetails && userDetails.user && user?._id) {
//             console.log('Full userDetails.user:', userDetails.user); // Debug: Log full structure
//             setFormData({
//                 idType: userDetails.user.idType || "",
//                 passportUrl: userDetails.user.passportUrl || "",
//                 governmentIdFront: userDetails.user.governmentIdFront || "",
//                 governmentIdBack: userDetails.user.governmentIdBack || "",
//                 issueDate: userDetails.user.issueDate ? new Date(userDetails.user.issueDate).toISOString().split('T')[0] : "",
//                 expiryDate: userDetails.user.expiryDate ? new Date(userDetails.user.expiryDate).toISOString().split('T')[0] : "",
//                 hasInsurance: userDetails.user.hasInsurance || false,
//                 insuranceDocument: userDetails.user.insuranceDocument || "",
//                 backgroundCheckConsent: userDetails.user.backgroundCheckConsent || false,
//                 profilePicture: userDetails.user.profilePicture || "",
//                 sin: userDetails.user.sin || "",
//                 firstName: userDetails.user.firstName || "",
//                 lastName: userDetails.user.lastName || "",
//                 email: userDetails.user.email || "",
//                 // New profile fields
//                 dob: userDetails.user.dob ? new Date(userDetails.user.dob).toISOString().split('T')[0] : "",
//                 about: userDetails.user.about || "",
//                 language: userDetails.user.language || "",
//                 yearsOfExperience: userDetails.user.yearsOfExperience || "",
//                 // Bank details
//                 accountHolder: userDetails.user.accountHolder || "",
//                 accountNumber: userDetails.user.accountNumber || "",
//                 routingNumber: userDetails.user.routingNumber || "",
//             });
//             setShowInsuranceUpload(userDetails.user.hasInsurance || false);
//             console.log('Populating formData from userDetails.user'); // Debug log
//         }
//     }, [userDetails, user]);

//     // Validate sections and track completion
//     useEffect(() => {
//         const validateSections = () => {
//             const validation: Record<string, boolean> = {};
//             const completed = new Set<string>();

//             // Professional Profile Validation
//             const professionalValid =
//                 formData.dob &&
//                 formData.yearsOfExperience &&
//                 formData.language &&
//                 formData.about;
//             validation.professional = !!professionalValid;
//             if (professionalValid) completed.add('professional');

//             // Personal Info Validation
//             const personalValid =
//                 formData.sin &&
//                 formData.profilePicture &&
//                 !formData.profilePicture.startsWith('blob:');
//             validation.personal = !!personalValid;
//             if (personalValid) completed.add('personal');

//             // ID Verification Validation
//             let idVerificationValid = false;
//             if (formData.idType === "passport") {
//                 idVerificationValid =
//                     formData.passportUrl &&
//                     !formData.passportUrl.startsWith('blob:') &&
//                     formData.issueDate &&
//                     formData.expiryDate;
//             } else if (formData.idType === "governmentID") {
//                 idVerificationValid =
//                     formData.governmentIdFront &&
//                     !formData.governmentIdFront.startsWith('blob:') &&
//                     formData.governmentIdBack &&
//                     !formData.governmentIdBack.startsWith('blob:') &&
//                     formData.issueDate &&
//                     formData.expiryDate;
//             }
//             validation['id-verification'] = !!idVerificationValid;
//             if (idVerificationValid) completed.add('id-verification');

//             // Payment Settings Validation
//             const paymentValid =
//                 formData.accountHolder &&
//                 formData.accountNumber &&
//                 formData.routingNumber;
//             validation.payment = !!paymentValid;
//             if (paymentValid) completed.add('payment');

//             // Insurance Validation
//             const insuranceValid = formData.hasInsurance
//                 ? formData.insuranceDocument && !formData.insuranceDocument.startsWith('blob:')
//                 : true; // If no insurance, it's valid
//             validation.insurance = !!insuranceValid;
//             if (insuranceValid) completed.add('insurance');

//             // Background Check Validation
//             const backgroundValid = formData.backgroundCheckConsent;
//             validation.background = !!backgroundValid;
//             if (backgroundValid) completed.add('background');

//             setSectionValidation(validation);
//             setCompletedSections(completed);
//         };

//         validateSections();
//     }, [formData]);

//     // Cleanup local URLs on unmount
//     useEffect(() => {
//         return () => {
//             localUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
//             localUrlsRef.current.clear();
//         };
//     }, []);

//     // Handle file upload (Updated to use ImgBB for images)
//     const handleFileUpload = async (file: File, field: keyof typeof formData): Promise<string | null> => {
//         if (!file) return null;
//         // Check if it's an image; ImgBB is for images only
//         if (!file.type.startsWith('image/')) {
//             toast.error(`${field} must be an image file.`);
//             return null;
//         }
//         setIsUploading(true);
//         setUploadField(field);
//         try {
//             const url = await uploadToImgBB(file);
//             toast.success(`${field} uploaded successfully!`);
//             setIsUploading(false);
//             setUploadField(null);
//             return url;
//         } catch (error) {
//             console.error("Upload failed:", error);
//             toast.error(`Failed to upload ${field}: ${error instanceof Error ? error.message : 'Unknown error'}`);
//             setIsUploading(false);
//             setUploadField(null);
//             return null;
//         }
//     };

//     const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof formData) => {
//         const file = e.target.files?.[0];
//         if (file) {
//             // Create local preview URL immediately
//             const localUrl = URL.createObjectURL(file);
//             localUrlsRef.current.set(field, localUrl);
//             // Set selected file and update formData with local URL for instant preview
//             setSelectedFiles(prev => ({ ...prev, [field]: file }));
//             setFormData(prev => ({ ...prev, [field]: localUrl }));
//             // Upload to server in background
//             const uploadedUrl = await handleFileUpload(file, field);
//             if (uploadedUrl) {
//                 // Replace local URL with server URL on success
//                 setFormData(prev => ({ ...prev, [field]: uploadedUrl }));
//                 // Cleanup local URL
//                 const oldLocalUrl = localUrlsRef.current.get(field);
//                 if (oldLocalUrl) {
//                     URL.revokeObjectURL(oldLocalUrl);
//                     localUrlsRef.current.delete(field);
//                 }
//             } else {
//                 // On failure, keep local so user sees it; you can add a "retry" button
//             }
//             // Clear selected after handling
//             setSelectedFiles(prev => ({ ...prev, [field]: null }));
//             // Reset input
//             e.target.value = '';
//         }
//     };

//     // Clear selected file (before upload or cancel)
//     const clearSelectedFile = (field: keyof typeof formData) => {
//         const file = selectedFiles[field];
//         const localUrl = localUrlsRef.current.get(field);
//         if (localUrl) {
//             URL.revokeObjectURL(localUrl);
//             localUrlsRef.current.delete(field);
//         }
//         setSelectedFiles(prev => ({ ...prev, [field]: null }));
//         // Revert to original (server) URL or empty
//         setFormData(prev => ({ ...prev, [field]: '' })); // Or fetch original if needed
//     };

//     // Get preview URL for display (now prioritizes formData for seamless transition)
//     const getPreviewUrl = (field: string): string => {
//         return formData[field as keyof typeof formData] || '';
//     };

//     // Check if it's an image (updated for local/server URLs)
//     const isImagePreview = (field: string): boolean => {
//         const url = getPreviewUrl(field);
//         if (!url) return false;
//         // Check extension or blob: prefix
//         return /\.(png|jpg|jpeg|gif|webp)$/i.test(url) || url.startsWith('blob:');
//     };

//     // Check if local (for clear button)
//     const isLocalPreview = (field: string): boolean => {
//         const url = getPreviewUrl(field);
//         return url.startsWith('blob:');
//     };

//     // Needs unoptimized for NextImage (local/blob or external)
//     const needsUnoptimized = (src: string): boolean => !src.startsWith('/'); // Local paths are optimized, others not

//     // Render preview component (with fallback)
//     const renderPreview = (field: string, alt: string, sizeClass: string, width: number, height: number) => {
//         const previewUrl = getPreviewUrl(field);
//         if (!previewUrl) return null;
//         const commonProps = {
//             src: previewUrl,
//             alt,
//             width,
//             height,
//             className: `object-cover rounded-lg border-2 ${sizeClass} shadow-md`,
//             style: { borderColor: '#063A41' },
//             unoptimized: needsUnoptimized(previewUrl),
//             // Fallback for broken images
//             onError: (e: any) => {
//                 console.warn(`Failed to load preview for ${field}`);
//                 (e.target as HTMLImageElement).src = '/placeholder-avatar.png'; // Or generic placeholder
//             },
//         };
//         const isImg = isImagePreview(field);
//         return (
//             <div className="relative inline-block">
//                 {isImg ? (
//                     <Image {...commonProps} />
//                 ) : (
//                     <div className={`${sizeClass} border-2 border-dashed rounded-lg flex items-center justify-center bg-[#E5FFDB] shadow-md`} style={{ borderColor: '#063A41' }}>
//                         <FileText className="h-6 w-6 text-[#063A41]" />
//                         <span className="text-xs text-[#063A41] ml-1">Document</span>
//                     </div>
//                 )}
//                 {isLocalPreview(field) && (
//                     <button
//                         onClick={() => clearSelectedFile(field as keyof typeof formData)}
//                         className="absolute -top-1 -right-1 h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full border-0 shadow-md transition-all"
//                     >
//                         <X className="h-3 w-3" />
//                     </button>
//                 )}
//             </div>
//         );
//     };

//     // Get status badge (updated for local/server distinction)
//     const getStatusBadge = (field: string) => {
//         const url = getPreviewUrl(field);
//         const isLocal = isLocalPreview(field);
//         if (isLocal) {
//             return (
//                 <span className="inline-flex items-center px-3 py-1 bg-[#109C3D] text-white text-xs rounded-full shadow-sm">
//                     <CheckCircle className="h-3 w-3 mr-1" />
//                     Preview: Uploading...
//                 </span>
//             );
//         } else if (url) {
//             return (
//                 <span className="inline-flex items-center px-3 py-1 bg-[#E5FFDB] text-[#063A41] text-xs rounded-full shadow-sm border" style={{ borderColor: '#109C3D' }}>
//                     <CheckCircle className="h-3 w-3 mr-1" />
//                     Uploaded
//                 </span>
//             );
//         }
//         return null;
//     };

//     const handleIdTypeChange = (value: string) => {
//         setFormData({ ...formData, idType: value });
//         // Clear opposite fields
//         if (value === "passport") {
//             setFormData(prev => ({ ...prev, governmentIdFront: "", governmentIdBack: "" }));
//         } else if (value === "governmentID") {
//             setFormData(prev => ({ ...prev, passportUrl: "" }));
//         }
//     };

//     const handleIssueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value;
//         if (value) {
//             const date = new Date(value);
//             if (isNaN(date.getTime())) {
//                 toast.error("Please enter a valid issue date.");
//                 return;
//             }
//             // Additional check: year must be exactly 4 digits (though format ensures it)
//             const year = value.split('-')[0];
//             if (year.length !== 4 || isNaN(Number(year))) {
//                 toast.error("Year must be a valid 4-digit number.");
//                 return;
//             }
//         }
//         setFormData(prev => ({ ...prev, issueDate: value }));
//     };

//     const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value;
//         if (value) {
//             const date = new Date(value);
//             if (isNaN(date.getTime())) {
//                 toast.error("Please enter a valid expiry date.");
//                 return;
//             }
//             // Additional check: year must be exactly 4 digits (though format ensures it)
//             const year = value.split('-')[0];
//             if (year.length !== 4 || isNaN(Number(year))) {
//                 toast.error("Year must be a valid 4-digit number.");
//                 return;
//             }
//         }
//         setFormData(prev => ({ ...prev, expiryDate: value }));
//     };

//     const handleHasInsuranceChange = (checked: boolean) => {
//         setFormData({ ...formData, hasInsurance: checked });
//         setShowInsuranceUpload(checked);
//         if (!checked) {
//             setFormData({ ...formData, insuranceDocument: "" });
//             // Cleanup local if any
//             const localUrl = localUrlsRef.current.get('insuranceDocument');
//             if (localUrl) {
//                 URL.revokeObjectURL(localUrl);
//                 localUrlsRef.current.delete('insuranceDocument');
//             }
//             setSelectedFiles(prev => ({ ...prev, insuranceDocument: null }));
//         }
//     };

//     const handleBackgroundCheckConsentChange = (checked: boolean) => {
//         setFormData({ ...formData, backgroundCheckConsent: checked });
//     };

//     const handleSinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFormData({ ...formData, sin: e.target.value });
//     };

//     // New handlers for profile fields
//     const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value;
//         if (value) {
//             const date = new Date(value);
//             if (isNaN(date.getTime())) {
//                 toast.error("Please enter a valid date of birth.");
//                 return;
//             }
//             const year = value.split('-')[0];
//             if (year.length !== 4 || isNaN(Number(year))) {
//                 toast.error("Year must be a valid 4-digit number.");
//                 return;
//             }
//         }
//         setFormData(prev => ({ ...prev, dob: value }));
//     };

//     const handleAboutChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//         setFormData({ ...formData, about: e.target.value });
//     };

//     const handleLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFormData({ ...formData, language: e.target.value });
//     };

//     const handleYearsOfExperienceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value;
//         if (value && (isNaN(Number(value)) || Number(value) < 0)) {
//             toast.error("Years of experience must be a non-negative number.");
//             return;
//         }
//         setFormData({ ...formData, yearsOfExperience: value });
//     };

//     // Handlers for bank details
//     const handleAccountHolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFormData({ ...formData, accountHolder: e.target.value });
//     };

//     const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFormData({ ...formData, accountNumber: e.target.value });
//     };

//     const handleRoutingNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFormData({ ...formData, routingNumber: e.target.value });
//     };

//     // Check if section can be accessed (all previous sections must be completed)
//     const canAccessSection = (sectionId: string) => {
//         const sectionOrder = ['professional', 'personal', 'id-verification', 'payment', 'insurance', 'background'];
//         const currentIndex = sectionOrder.indexOf(sectionId);

//         if (currentIndex === 0) return true; // First section is always accessible

//         // Check if all previous sections are completed
//         for (let i = 0; i < currentIndex; i++) {
//             if (!completedSections.has(sectionOrder[i])) {
//                 return false;
//             }
//         }
//         return true;
//     };

//     // Handle section change with validation
//     const handleSectionChange = (sectionId: string) => {
//         if (canAccessSection(sectionId)) {
//             setActiveSection(sectionId);
//         } else {
//             toast.error("Please complete the previous sections first.");
//         }
//     };

//     // NEW: Individual save handlers for partial updates
//     const handleSaveProfessionalProfile = async () => {
//         if (!user?._id) {
//             toast.error("User not logged in.");
//             return;
//         }
//         // Validate missing fields if specified
//         if (hasMissingFields) {
//             const relevantMissing = missingFields.filter(f => ['dob', 'yearsOfExperience', 'language', 'about'].includes(f));
//             for (const field of relevantMissing) {
//                 const value = formData[field as keyof typeof formData];
//                 if (!value) {
//                     toast.error(`The field "${field}" is required for Tasker verification.`);
//                     return;
//                 }
//                 // Additional checks for dates
//                 if (field === 'dob') {
//                     if (value && new Date(value as string).toString() === 'Invalid Date') {
//                         toast.error(`Invalid date for ${field}.`);
//                         return;
//                     }
//                 }
//             }
//         }
//         // Prepare payload with only relevant fields
//         const payload: any = { userId: user._id };
//         if (formData.dob) {
//             const dobDate = new Date(formData.dob);
//             if (!isNaN(dobDate.getTime())) {
//                 payload.dob = dobDate;
//             }
//         }
//         if (formData.about) payload.about = formData.about;
//         if (formData.language) payload.language = formData.language;
//         if (formData.yearsOfExperience) payload.yearsOfExperience = formData.yearsOfExperience;
//         // If no fields to update, exit
//         if (Object.keys(payload).length === 1) {
//             toast.info("No changes in professional profile to save.");
//             return;
//         }
//         try {
//             const result = await updateUser(payload).unwrap();
//             await refetch();
//             toast.success("Professional profile updated successfully!");
//         } catch (err: any) {
//             console.error("Failed to update professional profile:", err);
//             toast.error(`Update failed: ${err.data?.error || err.message || "Unknown error"}`);
//         }
//     };

//     const handleSavePersonalInfo = async () => {
//         if (!user?._id) {
//             toast.error("User not logged in.");
//             return;
//         }
//         // Validate missing fields if specified
//         if (hasMissingFields) {
//             if (missingFields.includes('sin') && !formData.sin) {
//                 toast.error("SIN is required for Tasker verification.");
//                 return;
//             }
//             if (missingFields.includes('profilePicture') && !formData.profilePicture) {
//                 toast.error("Profile picture is required for Tasker verification.");
//                 return;
//             }
//         }
//         // Check for pending local uploads
//         if (formData.profilePicture && formData.profilePicture.startsWith('blob:')) {
//             toast.warn("Please complete profile picture upload before saving.");
//             return;
//         }
//         // Prepare payload with only relevant fields
//         const payload: any = { userId: user._id };
//         if (formData.sin) payload.sin = formData.sin;
//         if (formData.profilePicture && !formData.profilePicture.startsWith('blob:')) {
//             payload.profilePicture = formData.profilePicture;
//         }
//         // If no fields to update, exit
//         if (Object.keys(payload).length === 1) {
//             toast.info("No changes in personal info to save.");
//             return;
//         }
//         try {
//             const result = await updateUser(payload).unwrap();
//             await refetch();
//             toast.success("Personal info updated successfully!");
//         } catch (err: any) {
//             console.error("Failed to update personal info:", err);
//             toast.error(`Update failed: ${err.data?.error || err.message || "Unknown error"}`);
//         }
//     };

//     const handleSaveIdVerification = async () => {
//         if (!user?._id) {
//             toast.error("User not logged in.");
//             return;
//         }
//         // Validate missing fields if specified
//         if (hasMissingFields) {
//             if (missingFields.includes('idType') && !formData.idType) {
//                 toast.error("ID type is required for Tasker verification.");
//                 return;
//             }
//             if (missingFields.includes('issueDate') && !formData.issueDate) {
//                 toast.error("Issue date is required for Tasker verification.");
//                 return;
//             }
//             if (missingFields.includes('expiryDate') && !formData.expiryDate) {
//                 toast.error("Expiry date is required for Tasker verification.");
//                 return;
//             }
//             if (formData.idType === "passport" && missingFields.includes('passportUrl') && !formData.passportUrl) {
//                 toast.error("Passport is required for Tasker verification.");
//                 return;
//             }
//             if (formData.idType === "governmentID") {
//                 if (missingFields.includes('governmentIdFront') && !formData.governmentIdFront) {
//                     toast.error("Government ID front is required for Tasker verification.");
//                     return;
//                 }
//                 if (missingFields.includes('governmentIdBack') && !formData.governmentIdBack) {
//                     toast.error("Government ID back is required for Tasker verification.");
//                     return;
//                 }
//             }
//         }
//         // Basic validation
//         if (!formData.idType) {
//             toast.error("Please select an ID type.");
//             return;
//         }
//         if (formData.idType === "passport" && !formData.passportUrl) {
//             toast.error("Please upload your passport.");
//             return;
//         }
//         if (formData.idType === "governmentID" && (!formData.governmentIdFront || !formData.governmentIdBack)) {
//             toast.error("Please upload front and back of your government ID.");
//             return;
//         }
//         if (formData.idType && (!formData.issueDate || !formData.expiryDate)) {
//             toast.error("Please provide issue and expiry dates for your ID.");
//             return;
//         }
//         if (formData.issueDate && formData.expiryDate && new Date(formData.expiryDate) <= new Date(formData.issueDate)) {
//             toast.error("Expiry date must be after issue date.");
//             return;
//         }
//         // Check for pending local uploads
//         const idFields = formData.idType === "passport" ? ['passportUrl'] : ['governmentIdFront', 'governmentIdBack'];
//         for (const f of idFields) {
//             const url = formData[f as keyof typeof formData];
//             if (url && url.startsWith('blob:')) {
//                 toast.warn(`Please complete ${f} upload before saving.`);
//                 return;
//             }
//         }
//         // Prepare payload with only relevant fields
//         const payload: any = { userId: user._id, idType: formData.idType };
//         if (formData.passportUrl && !formData.passportUrl.startsWith('blob:')) {
//             payload.passportUrl = formData.passportUrl;
//         }
//         if (formData.governmentIdFront && !formData.governmentIdFront.startsWith('blob:')) {
//             payload.governmentIdFront = formData.governmentIdFront;
//         }
//         if (formData.governmentIdBack && !formData.governmentIdBack.startsWith('blob:')) {
//             payload.governmentIdBack = formData.governmentIdBack;
//         }
//         if (formData.issueDate) {
//             const issueDate = new Date(formData.issueDate);
//             if (!isNaN(issueDate.getTime())) {
//                 payload.issueDate = issueDate;
//             }
//         }
//         if (formData.expiryDate) {
//             const expiryDate = new Date(formData.expiryDate);
//             if (!isNaN(expiryDate.getTime())) {
//                 payload.expiryDate = expiryDate;
//             }
//         }
//         // If no fields to update, exit
//         if (Object.keys(payload).length === 2) { // userId + idType, but if no uploads/dates, minimal
//             toast.info("No changes in ID verification to save.");
//             return;
//         }
//         try {
//             const result = await updateUser(payload).unwrap();
//             await refetch();
//             toast.success("ID verification updated successfully!");
//         } catch (err: any) {
//             console.error("Failed to update ID verification:", err);
//             toast.error(`Update failed: ${err.data?.error || err.message || "Unknown error"}`);
//         }
//     };

//     const handleSaveInsurance = async () => {
//         if (!user?._id) {
//             toast.error("User not logged in.");
//             return;
//         }
//         // Validate missing fields if specified
//         if (hasMissingFields) {
//             if (missingFields.includes('hasInsurance') && formData.hasInsurance === undefined) {
//                 toast.error("Insurance declaration is required for Tasker verification.");
//                 return;
//             }
//             if (formData.hasInsurance && missingFields.includes('insuranceDocument') && !formData.insuranceDocument) {
//                 toast.error("Insurance document is required for Tasker verification.");
//                 return;
//             }
//         }
//         // Basic validation
//         if (formData.hasInsurance && !formData.insuranceDocument) {
//             toast.error("Please upload insurance document if you have insurance.");
//             return;
//         }
//         // Check for pending local uploads
//         if (formData.insuranceDocument && formData.insuranceDocument.startsWith('blob:')) {
//             toast.warn("Please complete insurance document upload before saving.");
//             return;
//         }
//         // Prepare payload with only relevant fields
//         const payload: any = { userId: user._id, hasInsurance: formData.hasInsurance };
//         if (formData.insuranceDocument && !formData.insuranceDocument.startsWith('blob:')) {
//             payload.insuranceDocument = formData.insuranceDocument;
//         }
//         // If no changes, exit
//         if (!formData.insuranceDocument && formData.hasInsurance === false) {
//             toast.info("No changes in insurance to save.");
//             return;
//         }
//         try {
//             const result = await updateUser(payload).unwrap();
//             await refetch();
//             toast.success("Insurance updated successfully!");
//         } catch (err: any) {
//             console.error("Failed to update insurance:", err);
//             toast.error(`Update failed: ${err.data?.error || err.message || "Unknown error"}`);
//         }
//     };

//     const handleSaveBackgroundCheck = async () => {
//         if (!user?._id) {
//             toast.error("User not logged in.");
//             return;
//         }
//         // Validate missing fields if specified
//         if (hasMissingFields && missingFields.includes('backgroundCheckConsent') && !formData.backgroundCheckConsent) {
//             toast.error("Background check consent is required for Tasker verification.");
//             return;
//         }
//         // Prepare payload
//         const payload = {
//             userId: user._id,
//             backgroundCheckConsent: formData.backgroundCheckConsent,
//         };
//         try {
//             const result = await updateUser(payload).unwrap();
//             await refetch();
//             toast.success("Background check consent updated successfully!");
//         } catch (err: any) {
//             console.error("Failed to update background check:", err);
//             toast.error(`Update failed: ${err.data?.error || err.message || "Unknown error"}`);
//         }
//     };

//     const handleSavePaymentSettings = async () => {
//         if (!user?._id) {
//             toast.error("User not logged in.");
//             return;
//         }
//         // Validate if specified in missing fields
//         if (hasMissingFields) {
//             if (missingFields.includes('accountHolder') && !formData.accountHolder) {
//                 toast.error("Account holder name is required.");
//                 return;
//             }
//             if (missingFields.includes('accountNumber') && !formData.accountNumber) {
//                 toast.error("Account number is required.");
//                 return;
//             }
//             if (missingFields.includes('routingNumber') && !formData.routingNumber) {
//                 toast.error("Routing number is required.");
//                 return;
//             }
//         }
//         // Prepare payload with only relevant fields
//         const payload: any = { userId: user._id };
//         if (formData.accountHolder) payload.accountHolder = formData.accountHolder;
//         if (formData.accountNumber) payload.accountNumber = formData.accountNumber;
//         if (formData.routingNumber) payload.routingNumber = formData.routingNumber;
//         // If no fields to update, exit
//         if (Object.keys(payload).length === 1) {
//             toast.info("No changes in payment settings to save.");
//             return;
//         }
//         try {
//             const result = await updateUser(payload).unwrap();
//             await refetch();
//             toast.success("Payment settings updated successfully!");
//         } catch (err: any) {
//             console.error("Failed to update payment settings:", err);
//             toast.error(`Update failed: ${err.data?.error || err.message || "Unknown error"}`);
//         }
//     };

//     const sections = [
//         { id: 'professional', title: 'Professional Profile', icon: Edit3, color: 'text1' },
//         { id: 'personal', title: 'Personal Info', icon: User, color: 'text1' },
//         { id: 'id-verification', title: 'ID Verification', icon: FileText, color: 'text1' },
//         { id: 'payment', title: 'Payment Settings', icon: Banknote, color: 'text1' },
//         { id: 'insurance', title: 'Insurance', icon: Shield, color: 'text1' },
//         { id: 'background', title: 'Background Check', icon: AlertCircle, color: 'text1' },
//     ];

//     const renderSectionContent = () => {
//         switch (activeSection) {
//             case 'professional':
//                 return (
//                     <div className="p-6 space-y-6 bg-white">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             {/* Date of Birth */}
//                             <div className="space-y-2">
//                                 <label htmlFor="dob" className="flex items-center gap-2 text-sm font-medium text-[#063A41]">
//                                     <Calendar className="h-4 w-4 text-[#109C3D]" />
//                                     Date of Birth {hasMissingFields && missingFields.includes('dob') && <span className="text-red-500">*</span>}
//                                 </label>
//                                 <input
//                                     id="dob"
//                                     type="date"
//                                     value={formData.dob}
//                                     onChange={handleDobChange}
//                                     max={today}
//                                     min={minYear}
//                                     className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent shadow-sm transition-all"
//                                     style={{ borderColor: '#063A41' }}
//                                     required={hasMissingFields && missingFields.includes('dob')}
//                                 />
//                             </div>
//                             {/* Years of Experience */}
//                             <div className="space-y-2">
//                                 <label htmlFor="yearsOfExperience" className="flex items-center gap-2 text-sm font-medium text-[#063A41]">
//                                     <Clock className="h-4 w-4 text-[#109C3D]" />
//                                     Years of Experience {hasMissingFields && missingFields.includes('yearsOfExperience') && <span className="text-red-500">*</span>}
//                                 </label>
//                                 <input
//                                     id="yearsOfExperience"
//                                     type="number"
//                                     min="0"
//                                     placeholder="e.g., 5"
//                                     value={formData.yearsOfExperience}
//                                     onChange={handleYearsOfExperienceChange}
//                                     className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent shadow-sm transition-all"
//                                     style={{ borderColor: '#063A41' }}
//                                     required={hasMissingFields && missingFields.includes('yearsOfExperience')}
//                                 />
//                             </div>
//                             {/* Language */}
//                             <div className="space-y-2 md:col-span-2">
//                                 <label htmlFor="language" className="flex items-center gap-2 text-sm font-medium text-[#063A41]">
//                                     <Globe className="h-4 w-4 text-[#109C3D]" />
//                                     Primary Language {hasMissingFields && missingFields.includes('language') && <span className="text-red-500">*</span>}
//                                 </label>
//                                 <input
//                                     id="language"
//                                     type="text"
//                                     placeholder="e.g., English"
//                                     value={formData.language}
//                                     onChange={handleLanguageChange}
//                                     className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent shadow-sm transition-all"
//                                     style={{ borderColor: '#063A41' }}
//                                     required={hasMissingFields && missingFields.includes('language')}
//                                 />
//                             </div>
//                             {/* About */}
//                             <div className="space-y-2 md:col-span-2">
//                                 <label htmlFor="about" className="flex items-center gap-2 text-sm font-medium text-[#063A41]">
//                                     <User className="h-4 w-4 text-[#109C3D]" />
//                                     About Me {hasMissingFields && missingFields.includes('about') && <span className="text-red-500">*</span>}
//                                 </label>
//                                 <textarea
//                                     id="about"
//                                     placeholder="Tell us about your background, skills, and what makes you a great tasker..."
//                                     value={formData.about}
//                                     onChange={handleAboutChange}
//                                     rows={4}
//                                     className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent shadow-sm transition-all resize-vertical"
//                                     style={{ borderColor: '#063A41' }}
//                                     required={hasMissingFields && missingFields.includes('about')}
//                                 />
//                             </div>
//                         </div>
//                         <div className="pt-4 border-t" style={{ borderColor: '#E5FFDB' }}>
//                             <button
//                                 onClick={handleSaveProfessionalProfile}
//                                 disabled={isUpdating}
//                                 className="w-full p-3 bg-gradient-to-r from-[#063A41] to-[#109C3D] hover:from-[#063A41] hover:to-[#109C3D] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 font-medium"
//                             >
//                                 <Save className="h-4 w-4 mr-2 inline" />
//                                 {isUpdating ? "Saving..." : "Save Profile"}
//                             </button>
//                         </div>
//                     </div>
//                 );
//             case 'personal':
//                 return (
//                     <div className="p-6 space-y-6 bg-white">
//                         {/* First Name */}
//                         <div className="space-y-2">
//                             <label htmlFor="firstName" className="block text-sm font-medium text-[#063A41]">
//                                 First Name
//                             </label>
//                             <input
//                                 id="firstName"
//                                 type="text"
//                                 value={formData.firstName}
//                                 disabled
//                                 className="w-full p-3 border rounded-lg bg-[#E5FFDB] text-[#063A41] shadow-sm"
//                                 style={{ borderColor: '#063A41' }}
//                             />
//                         </div>
//                         {/* Last Name */}
//                         <div className="space-y-2">
//                             <label htmlFor="lastName" className="block text-sm font-medium text-[#063A41]">
//                                 Last Name
//                             </label>
//                             <input
//                                 id="lastName"
//                                 type="text"
//                                 value={formData.lastName}
//                                 disabled
//                                 className="w-full p-3 border rounded-lg bg-[#E5FFDB] text-[#063A41] shadow-sm"
//                                 style={{ borderColor: '#063A41' }}
//                             />
//                         </div>
//                         {/* Email */}
//                         <div className="space-y-2">
//                             <label htmlFor="email" className="block text-sm font-medium text-[#063A41]">
//                                 Email
//                             </label>
//                             <input
//                                 id="email"
//                                 type="email"
//                                 value={formData.email}
//                                 disabled
//                                 className="w-full p-3 border rounded-lg bg-[#E5FFDB] text-[#063A41] shadow-sm"
//                                 style={{ borderColor: '#063A41' }}
//                             />
//                         </div>
//                         {/* SIN */}
//                         <div className="space-y-2">
//                             <label htmlFor="sin" className="block text-sm font-medium text-[#063A41]">
//                                 SIN (Social Insurance Number) {hasMissingFields && missingFields.includes('sin') && <span className="text-red-500 ml-1">*</span>}
//                             </label>
//                             <input
//                                 id="sin"
//                                 type="text"
//                                 placeholder="e.g., 123456789"
//                                 value={formData.sin}
//                                 onChange={handleSinChange}
//                                 className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent shadow-sm transition-all"
//                                 style={{ borderColor: '#063A41' }}
//                                 required={hasMissingFields && missingFields.includes('sin')}
//                             />
//                         </div>
//                         <div className="text-center space-y-4">
//                             <div className="relative mx-auto w-32 h-32 shadow-lg rounded-full overflow-hidden border-4" style={{ borderColor: '#E5FFDB' }}>
//                                 <Image
//                                     src={getPreviewUrl("profilePicture") || "/placeholder-avatar.png"}
//                                     alt="Profile"
//                                     width={128}
//                                     height={128}
//                                     className="rounded-full object-cover"
//                                     unoptimized={needsUnoptimized(getPreviewUrl("profilePicture") || "")}
//                                     onError={(e) => {
//                                         (e.target as HTMLImageElement).src = "/placeholder-avatar.png";
//                                     }}
//                                 />
//                                 {isLocalPreview("profilePicture") && (
//                                     <button
//                                         onClick={() => clearSelectedFile("profilePicture")}
//                                         className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full border-0 shadow-md transition-all"
//                                     >
//                                         <X className="h-3 w-3" />
//                                     </button>
//                                 )}
//                             </div>
//                             <label htmlFor="profilePicture" className="mt-4 items-center gap-2 cursor-pointer text-[#063A41] hover:text-[#109C3D] block font-medium transition-colors">
//                                 <Upload className="h-4 w-4 inline" />
//                                 {getPreviewUrl("profilePicture") ? "Update Profile Picture" : "Upload Profile Picture"} {hasMissingFields && missingFields.includes('profilePicture') && <span className="text-red-500">*</span>}
//                             </label>
//                             <input
//                                 id="profilePicture"
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={(e) => handleFileChange(e, "profilePicture")}
//                                 className="hidden"
//                                 disabled={isUploading}
//                                 required={hasMissingFields && missingFields.includes('profilePicture')}
//                             />
//                             {isUploading && uploadField === "profilePicture" && (
//                                 <div className="flex items-center justify-center mt-2">
//                                     <div className="animate-spin h-5 w-5 border-b-2 rounded-full mr-2" style={{ borderColor: '#109C3D' }} />
//                                     <span className="text-[#063A41]">Uploading...</span>
//                                 </div>
//                             )}
//                             {getStatusBadge("profilePicture")}
//                         </div>
//                         <div className="pt-4 border-t" style={{ borderColor: '#E5FFDB' }}>
//                             <button
//                                 onClick={handleSavePersonalInfo}
//                                 disabled={isUpdating}
//                                 className="w-full p-3 bg-gradient-to-r from-[#063A41] to-[#109C3D] hover:from-[#063A41] hover:to-[#109C3D] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 font-medium"
//                             >
//                                 <Save className="h-4 w-4 mr-2 inline" />
//                                 {isUpdating ? "Saving..." : "Save Personal Info"}
//                             </button>
//                         </div>
//                     </div>
//                 );
//             case 'id-verification':
//                 return (
//                     <div className="p-6 space-y-6 bg-white">
//                         <div className="space-y-4">
//                             <div>
//                                 <label htmlFor="idType" className="block text-sm font-medium text-[#063A41] mb-2">
//                                     ID Type {hasMissingFields && missingFields.includes('idType') && <span className="text-red-500 ml-1">*</span>}
//                                 </label>
//                                 <select
//                                     id="idType"
//                                     value={formData.idType}
//                                     onChange={(e) => handleIdTypeChange(e.target.value)}
//                                     className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent shadow-sm transition-all"
//                                     style={{ borderColor: '#063A41' }}
//                                 >
//                                     <option value="">Select ID type</option>
//                                     <option value="passport">Passport</option>
//                                     <option value="governmentID">Government ID (Front & Back)</option>
//                                 </select>
//                             </div>
//                             {/* Issue and Expiry Dates - Shown after ID selection */}
//                             {formData.idType && (
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                                     <div>
//                                         <label className="block mb-2 font-medium text-[#063A41]">
//                                             Issue Date {hasMissingFields && missingFields.includes('issueDate') && <span className="text-red-500 ml-1">*</span>}
//                                         </label>
//                                         <input
//                                             type="date"
//                                             value={formData.issueDate}
//                                             onChange={handleIssueDateChange}
//                                             min={minYear}
//                                             max={today}
//                                             className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent shadow-sm transition-all"
//                                             style={{ borderColor: '#063A41' }}
//                                             required={hasMissingFields && missingFields.includes('issueDate')}
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="block mb-2 font-medium text-[#063A41]">
//                                             Expiry Date {hasMissingFields && missingFields.includes('expiryDate') && <span className="text-red-500 ml-1">*</span>}
//                                         </label>
//                                         <input
//                                             type="date"
//                                             value={formData.expiryDate}
//                                             onChange={handleExpiryDateChange}
//                                             min={today}
//                                             max={maxFutureYear}
//                                             className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent shadow-sm transition-all"
//                                             style={{ borderColor: '#063A41' }}
//                                             required={hasMissingFields && missingFields.includes('expiryDate')}
//                                         />
//                                     </div>
//                                 </div>
//                             )}
//                             {/* Conditional ID Uploads */}
//                             {formData.idType === "passport" && (
//                                 <div>
//                                     <label htmlFor="passportUrl" className="block text-sm font-medium text-[#063A41] mb-2">
//                                         Passport {hasMissingFields && missingFields.includes('passportUrl') && <span className="text-red-500 ml-1">*</span>}
//                                     </label>
//                                     <div className="space-y-2">
//                                         <input
//                                             id="passportUrl"
//                                             type="file"
//                                             accept="image/*"
//                                             onChange={(e) => handleFileChange(e, "passportUrl")}
//                                             className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent shadow-sm transition-all"
//                                             style={{ borderColor: '#063A41' }}
//                                             disabled={isUploading}
//                                             required={hasMissingFields && missingFields.includes('passportUrl')}
//                                         />
//                                         {isUploading && uploadField === "passportUrl" && (
//                                             <div className="flex items-center justify-center">
//                                                 <div className="animate-spin h-4 w-4 border-b-2 rounded-full mr-2" style={{ borderColor: '#109C3D' }} />
//                                                 <span className="text-[#063A41]">Uploading...</span>
//                                             </div>
//                                         )}
//                                         {renderPreview("passportUrl", "Passport", "w-24 h-24", 96, 96)}
//                                         {getStatusBadge("passportUrl")}
//                                     </div>
//                                 </div>
//                             )}
//                             {formData.idType === "governmentID" && (
//                                 <div className="space-y-4">
//                                     {/* Government ID Front */}
//                                     <div>
//                                         <label htmlFor="governmentIdFront" className="block text-sm font-medium text-[#063A41] mb-2">
//                                             Government ID Front {hasMissingFields && missingFields.includes('governmentIdFront') && <span className="text-red-500 ml-1">*</span>}
//                                         </label>
//                                         <div className="space-y-2">
//                                             <input
//                                                 id="governmentIdFront"
//                                                 type="file"
//                                                 accept="image/*"
//                                                 onChange={(e) => handleFileChange(e, "governmentIdFront")}
//                                                 className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent shadow-sm transition-all"
//                                                 style={{ borderColor: '#063A41' }}
//                                                 disabled={isUploading}
//                                                 required={hasMissingFields && missingFields.includes('governmentIdFront')}
//                                             />
//                                             {isUploading && uploadField === "governmentIdFront" && (
//                                                 <div className="flex items-center justify-center">
//                                                     <div className="animate-spin h-4 w-4 border-b-2 rounded-full mr-2" style={{ borderColor: '#109C3D' }} />
//                                                     <span className="text-[#063A41]">Uploading...</span>
//                                                 </div>
//                                             )}
//                                             {renderPreview("governmentIdFront", "ID Front", "w-24 h-24", 96, 96)}
//                                             {getStatusBadge("governmentIdFront")}
//                                         </div>
//                                     </div>
//                                     {/* Government ID Back */}
//                                     <div>
//                                         <label htmlFor="governmentIdBack" className="block text-sm font-medium text-[#063A41] mb-2">
//                                             Government ID Back {hasMissingFields && missingFields.includes('governmentIdBack') && <span className="text-red-500 ml-1">*</span>}
//                                         </label>
//                                         <div className="space-y-2">
//                                             <input
//                                                 id="governmentIdBack"
//                                                 type="file"
//                                                 accept="image/*"
//                                                 onChange={(e) => handleFileChange(e, "governmentIdBack")}
//                                                 className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent shadow-sm transition-all"
//                                                 style={{ borderColor: '#063A41' }}
//                                                 disabled={isUploading}
//                                                 required={hasMissingFields && missingFields.includes('governmentIdBack')}
//                                             />
//                                             {isUploading && uploadField === "governmentIdBack" && (
//                                                 <div className="flex items-center justify-center">
//                                                     <div className="animate-spin h-4 w-4 border-b-2 rounded-full mr-2" style={{ borderColor: '#109C3D' }} />
//                                                     <span className="text-[#063A41]">Uploading...</span>
//                                                 </div>
//                                             )}
//                                             {renderPreview("governmentIdBack", "ID Back", "w-24 h-24", 96, 96)}
//                                             {getStatusBadge("governmentIdBack")}
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                         <div className="pt-4 border-t" style={{ borderColor: '#E5FFDB' }}>
//                             <button
//                                 onClick={handleSaveIdVerification}
//                                 disabled={isUpdating}
//                                 className="w-full p-3 bg-gradient-to-r from-[#063A41] to-[#109C3D] hover:from-[#063A41] hover:to-[#109C3D] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 font-medium"
//                             >
//                                 <Save className="h-4 w-4 mr-2 inline" />
//                                 {isUpdating ? "Saving..." : "Save ID Verification"}
//                             </button>
//                         </div>
//                     </div>
//                 );
//             case 'payment':
//                 return (
//                     <div className="p-6 space-y-6 bg-white">
//                         <div className="space-y-4">
//                             <div>
//                                 <label htmlFor="accountHolder" className="block text-sm font-medium text-[#063A41]">
//                                     Account Holder {hasMissingFields && missingFields.includes('accountHolder') && <span className="text-red-500 ml-1">*</span>}
//                                 </label>
//                                 <input
//                                     id="accountHolder"
//                                     type="text"
//                                     placeholder="Full name as on bank account"
//                                     value={formData.accountHolder}
//                                     onChange={handleAccountHolderChange}
//                                     className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent shadow-sm transition-all"
//                                     style={{ borderColor: '#063A41' }}
//                                     required={hasMissingFields && missingFields.includes('accountHolder')}
//                                 />
//                             </div>
//                             <div>
//                                 <label htmlFor="accountNumber" className="block text-sm font-medium text-[#063A41]">
//                                     Account Number {hasMissingFields && missingFields.includes('accountNumber') && <span className="text-red-500 ml-1">*</span>}
//                                 </label>
//                                 <input
//                                     id="accountNumber"
//                                     type="text"
//                                     placeholder="e.g., 123456789"
//                                     value={formData.accountNumber}
//                                     onChange={handleAccountNumberChange}
//                                     className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent shadow-sm transition-all"
//                                     style={{ borderColor: '#063A41' }}
//                                     required={hasMissingFields && missingFields.includes('accountNumber')}
//                                 />
//                             </div>
//                             <div>
//                                 <label htmlFor="routingNumber" className="block text-sm font-medium text-[#063A41]">
//                                     Routing Number {hasMissingFields && missingFields.includes('routingNumber') && <span className="text-red-500 ml-1">*</span>}
//                                 </label>
//                                 <input
//                                     id="routingNumber"
//                                     type="text"
//                                     placeholder="e.g., 021000021"
//                                     value={formData.routingNumber}
//                                     onChange={handleRoutingNumberChange}
//                                     className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent shadow-sm transition-all"
//                                     style={{ borderColor: '#063A41' }}
//                                     required={hasMissingFields && missingFields.includes('routingNumber')}
//                                 />
//                             </div>
//                         </div>
//                         <div className="pt-4 border-t" style={{ borderColor: '#E5FFDB' }}>
//                             <button
//                                 onClick={handleSavePaymentSettings}
//                                 disabled={isUpdating}
//                                 className="w-full p-3 bg-gradient-to-r from-[#063A41] to-[#109C3D] hover:from-[#063A41] hover:to-[#109C3D] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 font-medium"
//                             >
//                                 <Save className="h-4 w-4 mr-2 inline" />
//                                 {isUpdating ? "Saving..." : "Save Payment Settings"}
//                             </button>
//                         </div>
//                     </div>
//                 );
//             case 'insurance':
//                 return (
//                     <div className="p-6 space-y-6 bg-white">
//                         <div className="flex items-center justify-between p-4 bg-[#E5FFDB] rounded-lg shadow-sm">
//                             <label htmlFor="hasInsurance" className="text-sm font-medium text-[#063A41] flex items-center gap-2">
//                                 I have professional insurance {hasMissingFields && missingFields.includes('hasInsurance') && <span className="text-red-500">*</span>}
//                             </label>
//                             <label className="relative inline-block cursor-pointer">
//                                 <input
//                                     type="checkbox"
//                                     id="hasInsurance"
//                                     checked={formData.hasInsurance}
//                                     onChange={(e) => handleHasInsuranceChange(e.target.checked)}
//                                     className="sr-only peer"
//                                 />
//                                 <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#109C3D]"></div>
//                             </label>
//                         </div>
//                         {showInsuranceUpload && (
//                             <div className="space-y-4 pt-4 border-t" style={{ borderColor: '#E5FFDB' }}>
//                                 <div>
//                                     <label htmlFor="insuranceDocument" className="block text-sm font-medium text-[#063A41] mb-2">
//                                         Insurance Document {hasMissingFields && missingFields.includes('insuranceDocument') && <span className="text-red-500 ml-1">*</span>}
//                                     </label>
//                                     <div className="space-y-2">
//                                         <input
//                                             id="insuranceDocument"
//                                             type="file"
//                                             accept="image/*" // Limited to images for ImgBB; add PDF handling if needed
//                                             onChange={(e) => handleFileChange(e, "insuranceDocument")}
//                                             className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent shadow-sm transition-all"
//                                             style={{ borderColor: '#063A41' }}
//                                             disabled={isUploading}
//                                             required={hasMissingFields && missingFields.includes('insuranceDocument')}
//                                         />
//                                         {isUploading && uploadField === "insuranceDocument" && (
//                                             <div className="flex items-center justify-center">
//                                                 <div className="animate-spin h-4 w-4 border-b-2 rounded-full mr-2" style={{ borderColor: '#109C3D' }} />
//                                                 <span className="text-[#063A41]">Uploading...</span>
//                                             </div>
//                                         )}
//                                         {renderPreview("insuranceDocument", "Insurance Doc", "w-24 h-24", 96, 96)}
//                                         {getStatusBadge("insuranceDocument")}
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                         <div className="pt-4 border-t" style={{ borderColor: '#E5FFDB' }}>
//                             <button
//                                 onClick={handleSaveInsurance}
//                                 disabled={isUpdating}
//                                 className="w-full p-3 bg-gradient-to-r from-[#063A41] to-[#109C3D] hover:from-[#063A41] hover:to-[#109C3D] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 font-medium"
//                             >
//                                 <Save className="h-4 w-4 mr-2 inline" />
//                                 {isUpdating ? "Saving..." : "Save Insurance"}
//                             </button>
//                         </div>
//                     </div>
//                 );
//             case 'background':
//                 return (
//                     <div className="p-6 space-y-6 bg-white">
//                         <div className="flex items-center space-x-2 p-4 bg-[#E5FFDB] rounded-lg shadow-sm">
//                             <input
//                                 type="checkbox"
//                                 id="backgroundCheckConsent"
//                                 checked={formData.backgroundCheckConsent}
//                                 onChange={(e) => handleBackgroundCheckConsentChange(e.target.checked)}
//                                 className="w-5 h-5 text-[#109C3D] bg-[#E5FFDB] border rounded focus:ring-[#109C3D] focus:ring-2"
//                                 style={{ borderColor: '#063A41' }}
//                             />
//                             <label htmlFor="backgroundCheckConsent" className="text-sm leading-none text-[#063A41]">
//                                 I consent to background checks as part of the verification process. {hasMissingFields && missingFields.includes('backgroundCheckConsent') && <span className="text-red-500">*</span>}
//                             </label>
//                         </div>
//                         {formData.backgroundCheckConsent && (
//                             <span className="inline-flex items-center px-3 py-1 bg-[#109C3D] text-white text-xs rounded-full shadow-sm">
//                                 <CheckCircle className="h-3 w-3 mr-1" />
//                                 Consent granted
//                             </span>
//                         )}
//                         <div className="pt-4 border-t" style={{ borderColor: '#E5FFDB' }}>
//                             <button
//                                 onClick={handleSaveBackgroundCheck}
//                                 disabled={isUpdating}
//                                 className="w-full p-3 bg-gradient-to-r from-[#063A41] to-[#109C3D] hover:from-[#063A41] hover:to-[#109C3D] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 font-medium"
//                             >
//                                 <Save className="h-4 w-4 mr-2 inline" />
//                                 {isUpdating ? "Saving..." : "Save Background Consent"}
//                             </button>
//                         </div>
//                     </div>
//                 );
//             default:
//                 return null;
//         }
//     };

//     if (isUserLoading) {
//         return (
//             <div className="flex justify-center items-center min-h-[400px]">
//                 <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{ borderColor: '#063A41' }}></div>
//             </div>
//         );
//     }

//     if (!userDetails || !userDetails.user) {
//         return (
//             <div className="flex justify-center items-center min-h-[400px]">
//                 <p className="text-[#063A41]">Loading user details...</p>
//             </div>
//         );
//     }

//     // Check if all sections are completed
//     const allSectionsCompleted = completedSections.size === sections.length;
//     const canSubmitApplication = allSectionsCompleted &&
//         (userDetails?.user?.taskerStatus === "not_applied" || userDetails?.user?.taskerStatus === "rejected");

//     return (
//         <div>
//             <div>
//                 <Navbar />
//             </div>
//             <div className="container mx-auto px-4 py-8 max-w-7xl">
//                 <div className="mb-8">
//                     <h1 className="text-4xl font-bold bg-gradient-to-r from-[#063A41] to-[#109C3D] bg-clip-text text-transparent mb-2">
//                         Update Documents & Profile
//                     </h1>
//                     <p className="text-[#063A41]">Verify your identity, professional status, and complete your profile details.</p>

//                     {/* Progress Indicator */}
//                     <div className="mt-6">
//                         <div className="flex justify-between items-center mb-2">
//                             <span className="text-sm font-medium text-[#063A41]">
//                                 Progress: {completedSections.size} of {sections.length} sections completed
//                             </span>
//                             <span className="text-sm font-medium text-[#063A41]">
//                                 {Math.round((completedSections.size / sections.length) * 100)}%
//                             </span>
//                         </div>
//                         <div className="w-full bg-gray-200 rounded-full h-2.5">
//                             <div
//                                 className="bg-[#109C3D] h-2.5 rounded-full transition-all duration-500"
//                                 style={{ width: `${(completedSections.size / sections.length) * 100}%` }}
//                             ></div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Missing Fields Banner */}
//                 {hasMissingFields && (
//                     <div className="mb-6 p-4 bg-[#E5FFDB] border-2 rounded-lg shadow-sm" style={{ borderColor: '#109C3D' }}>
//                         <h2 className="text-lg font-semibold text-[#063A41] mb-2">Complete Tasker Verification</h2>
//                         <p className="text-[#063A41] mb-3">To switch to Tasker role, please fill the following required fields:</p>
//                         <div className="flex flex-wrap gap-2">
//                             {missingFields.map((field) => (
//                                 <span key={field} className="px-3 py-1 bg-[#109C3D] text-white border text-xs rounded-full shadow-sm" style={{ borderColor: '#109C3D' }}>
//                                     {field}
//                                 </span>
//                             ))}
//                         </div>
//                     </div>
//                 )}

//                 <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//                     {/* Left Sidebar */}
//                     <div className="lg:col-span-1 space-y-2">
//                         {sections.map((section) => {
//                             const Icon = section.icon;
//                             const isActive = activeSection === section.id;
//                             const isCompleted = completedSections.has(section.id);
//                             const canAccess = canAccessSection(section.id);

//                             return (
//                                 <button
//                                     key={section.id}
//                                     className={`w-full justify-start space-x-3 p-4 rounded-lg transition-all duration-300 transform ${canAccess ? 'hover:scale-105' : ''} ${isActive
//                                             ? 'bg-[#E5FFDB] text-[#063A41] shadow-lg border-2'
//                                             : isCompleted
//                                                 ? 'bg-green-50 text-green-700 border border-green-200'
//                                                 : canAccess
//                                                     ? 'bg-white text-gray-500 hover:bg-[#E5FFDB] hover:text-[#063A41] hover:shadow-md border border-gray-200'
//                                                     : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
//                                         }`}
//                                     style={isActive ? { borderColor: '#109C3D' } : isCompleted ? { borderColor: '#10B981' } : {}}
//                                     onClick={() => canAccess && handleSectionChange(section.id)}
//                                     disabled={!canAccess}
//                                 >
//                                     <div className="flex items-center space-x-3">
//                                         {!canAccess ? (
//                                             <Lock className="h-5 w-5 text-gray-400" />
//                                         ) : (
//                                             <Icon className={`h-5 w-5 ${isActive ? 'text-[#109C3D]' :
//                                                     isCompleted ? 'text-green-600' :
//                                                         'text-gray-400'
//                                                 }`} />
//                                         )}
//                                         <span className="text-left font-medium">{section.title}</span>
//                                     </div>

//                                     <div className="flex items-center ml-auto">
//                                         {isCompleted && (
//                                             <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
//                                         )}
//                                         {isActive && <ChevronRight className="h-5 w-5 text-[#109C3D]" />}
//                                     </div>
//                                 </button>
//                             );
//                         })}
//                     </div>

//                     {/* Main Content */}
//                     <div className="lg:col-span-3">
//                         <div className="shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-xl overflow-hidden border" style={{ borderColor: '#E5FFDB' }}>
//                             <div className="p-6 color1 text-white shadow-lg">
//                                 <h2 className="flex items-center gap-3 text-white font-bold text-xl">
//                                     {sections.find(s => s.id === activeSection)?.title}
//                                     {completedSections.has(activeSection) && (
//                                         <CheckCircle className="h-5 w-5 text-green-300" />
//                                     )}
//                                 </h2>
//                                 <p className="mt-2 opacity-90">
//                                     {activeSection === 'professional' && 'Add details about yourself to build a complete professional profile.'}
//                                     {activeSection === 'personal' && 'Upload a professional profile photo and update personal details.'}
//                                     {activeSection === 'id-verification' && 'Select your ID type and upload front and back (if applicable).'}
//                                     {activeSection === 'payment' && 'Provide your bank details for receiving payments.'}
//                                     {activeSection === 'insurance' && 'Declare if you have professional insurance and upload proof.'}
//                                     {activeSection === 'background' && 'Consent to background checks for enhanced trust.'}
//                                 </p>
//                             </div>
//                             {renderSectionContent()}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Submit Application Section */}
//                 <div className="mt-12">
//                     {/* 1. Missing fields → red warning */}
//                     {hasMissingFields && (
//                         <div className="p-8 bg-red-50 border-2 border-red-400 rounded-2xl text-center">
//                             <h3 className="text-2xl font-bold text-red-800 mb-4">
//                                 Complete Required Fields First
//                             </h3>
//                             <p className="text-red-700 text-lg">
//                                 You still need to fill: <strong>{missingFields.join(', ')}</strong>
//                             </p>
//                         </div>
//                     )}

//                     {/* 2. Incomplete sections warning */}
//                     {!allSectionsCompleted && !hasMissingFields && (
//                         <div className="p-8 bg-yellow-50 border-2 border-yellow-400 rounded-2xl text-center">
//                             <h3 className="text-2xl font-bold text-yellow-800 mb-4">
//                                 Complete All Sections First
//                             </h3>
//                             <p className="text-yellow-700 text-lg">
//                                 Please complete all {sections.length} sections before submitting your application.
//                                 <br />
//                                 <strong>{sections.length - completedSections.size} section(s) remaining.</strong>
//                             </p>
//                         </div>
//                     )}

//                     {/* 3. Ready to submit → big orange button */}
//                     {canSubmitApplication && (
//                         <div className="p-8 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-500 rounded-2xl text-center shadow-2xl">
//                             <h3 className="text-4xl font-bold text-amber-900 mb-4">
//                                 {userDetails?.user?.taskerStatus === "rejected" ? "Resubmit Your Application" : "You're Ready!"}
//                             </h3>
//                             <p className="text-xl text-gray-700 mb-10 max-w-3xl mx-auto">
//                                 {userDetails?.user?.taskerStatus === "rejected"
//                                     ? "Your profile is now complete. You can resubmit it for admin approval."
//                                     : "Your profile is 100% complete. Submit it now for admin approval."}
//                             </p>
//                             <button
//                                 onClick={async () => {
//                                     try {
//                                         await submitTaskerApplication().unwrap();
//                                         toast.success("Application submitted! Our team is reviewing it now (24-48 hrs)");
//                                         router.push('/');
//                                         // This triggers refetch of useGetUserByIdQuery because of invalidatesTags
//                                         // → Banner instantly changes to "Under Review"
//                                     } catch (err: any) {
//                                         console.error(err);
//                                         toast.error(err?.data?.message || "Failed to submit. Try again.");
//                                     }
//                                 }}
//                                 disabled={isSubmittingApplication}
//                                 className="px-16 py-7 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1"
//                             >
//                                 {isSubmittingApplication
//                                     ? "Submitting..."
//                                     : userDetails?.user?.taskerStatus === "rejected"
//                                         ? "Resubmit Application"
//                                         : "Submit for Admin Review"}
//                             </button>
//                         </div>
//                     )}

//                     {/* 4. Under review */}
//                     {userDetails?.user?.taskerStatus === "under_review" && (
//                         <div className="p-10 bg-blue-50 border-2 border-blue-500 rounded-2xl text-center">
//                             <div className="flex items-center justify-center gap-4 mb-6">
//                                 <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-blue-600"></div>
//                                 <h3 className="text-4xl font-bold text-blue-900">Under Review ⏳</h3>
//                             </div>
//                             <p className="text-xl text-blue-800">
//                                 Thank you! Our team is reviewing your application.<br />
//                                 You'll get a notification once approved (usually within 24–48 hours).
//                             </p>
//                         </div>
//                     )}

//                     {/* 5. Approved */}
//                     {userDetails?.user?.taskerStatus === "approved" && (
//                         <div className="p-10 bg-green-50 border-2 border-green-500 rounded-2xl text-center">
//                             <h3 className="text-4xl font-bold text-green-800 mb-6">Approved! 🎉</h3>
//                             <p className="text-xl text-green-700">
//                                 Congratulations! You can now switch to Tasker mode from the navbar.
//                             </p>
//                         </div>
//                     )}

//                     {/* 6. Rejected but can resubmit (shown when sections are incomplete) */}
//                     {userDetails?.user?.taskerStatus === "rejected" && !canSubmitApplication && (
//                         <div className="p-10 bg-red-50 border-2 border-red-500 rounded-2xl text-center">
//                             <h3 className="text-4xl font-bold text-red-800 mb-6">Application Rejected</h3>
//                             <p className="text-xl text-red-700 mb-4">
//                                 Reason: {userDetails.user.taskerRejectionReason || "Not provided"}
//                             </p>
//                             <p className="text-gray-600 mb-6">
//                                 Please complete all sections to resubmit your application.
//                             </p>
//                             <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 inline-block">
//                                 <p className="text-yellow-800">
//                                     <strong>Progress:</strong> {completedSections.size} of {sections.length} sections completed
//                                 </p>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UpdateDocument;



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
    const [activeSection, setActiveSection] = useState<string>('professional');
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
                language: userDetails.user.language || "",
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

            const professionalValid = formData.dob && formData.yearsOfExperience && formData.language && formData.about;
            validation.professional = !!professionalValid;
            if (professionalValid) completed.add('professional');

            const personalValid = formData.sin && formData.profilePicture && !formData.profilePicture.startsWith('blob:');
            validation.personal = !!personalValid;
            if (personalValid) completed.add('personal');

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
            console.error("Upload failed:", error);
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
        const sectionOrder = ['professional', 'personal', 'id-verification', 'payment', 'insurance', 'background'];
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
        if (formData.language) payload.language = formData.language;
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
        { id: 'professional', label: 'Professional', icon: Edit3 },
        { id: 'personal', label: 'Personal', icon: User },
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
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-[#063A41] mb-1">Primary Language</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., English"
                                        value={formData.language}
                                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent"
                                    />
                                </div>
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