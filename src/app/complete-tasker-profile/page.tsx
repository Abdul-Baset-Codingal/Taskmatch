// // pages/update-document/page.tsx

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
// import {
//     useStartStripeOnboardingMutation,
//     useGetStripeConnectStatusQuery,
//     useLazyGetStripeDashboardQuery,
//     useRefreshStripeOnboardingMutation
// } from "@/features/stripe/stripeApi";
// import { checkLoginStatus } from "@/resusable/CheckUser";
// import { toast } from "react-toastify";
// import {
//     Save, Upload, CheckCircle, AlertCircle, User, Shield, FileText, X,
//     Calendar, Edit3, Globe, Clock, Banknote, Lock, AlertTriangle,
//     ExternalLink, CreditCard, RefreshCw, Building2, Briefcase, Check
// } from "lucide-react";
// import { HiOutlineDocumentText } from "react-icons/hi";
// import Navbar from "@/shared/Navbar";

// // ==================== SERVICE CATEGORIES ====================
// const SERVICE_CATEGORIES = [
//     { id: 'handyman', label: 'Handyman & Home Repairs', icon: '🔧' },
//     { id: 'renovation', label: 'Renovation & Moving Help', icon: '🏗️' },
//     { id: 'pet', label: 'Pet Services', icon: '🐕' },
//     { id: 'cleaning', label: 'Cleaning Services', icon: '🧹' },
//     { id: 'peh', label: 'Plumbing, Electrical & HVAC (PEH)', icon: '⚡' },
//     { id: 'automotive', label: 'Automotive Services', icon: '🚗' },
//     { id: 'specialized', label: 'All Other Specialized Services', icon: '⭐' },
// ];

// const MIN_CATEGORIES_REQUIRED = 2;

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
//     return data.data.url;
// };

// const UpdateDocument = () => {
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const fieldsParam = searchParams.get('fields');
//     const missingFields = fieldsParam ? fieldsParam.split(',') : [];
//     const hasMissingFields = missingFields.length > 0;

//     const stripeReturn = searchParams.get('stripe_return');

//     const [user, setUser] = useState<{ _id: string; role: string } | null>(null);

//     // Form data structure matching new schema
//     const [formData, setFormData] = useState({
//         // Personal
//         profilePicture: "" as string,
//         firstName: "" as string,
//         lastName: "" as string,
//         email: "" as string,

//         // Professional
//         dob: "" as string,
//         about: "" as string,
//         yearsOfExperience: "" as string,
//         categories: [] as string[], // ADDED: Service categories

//         // ID Verification - matches nested schema
//         idVerificationType: "" as string,
//         idDocumentFront: "" as string,
//         idDocumentBack: "" as string,
//         idIssueDate: "" as string,
//         idExpiryDate: "" as string,

//         // Insurance - matches nested schema
//         hasInsurance: false as boolean,
//         insuranceDocument: "" as string,
//     });

//     const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({
//         profilePicture: null,
//         idDocumentFront: null,
//         idDocumentBack: null,
//         insuranceDocument: null,
//     });

//     const [isUploading, setIsUploading] = useState(false);
//     const [uploadField, setUploadField] = useState<string | null>(null);
//     const [activeSection, setActiveSection] = useState<string>('personal');
//     const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
//     const [sectionValidation, setSectionValidation] = useState<Record<string, boolean>>({});
//     const [showInsuranceUpload, setShowInsuranceUpload] = useState(false);
//     const [dateErrors, setDateErrors] = useState<{
//         issueDate?: string;
//         expiryDate?: string;
//     }>({});
//     const localUrlsRef = useRef(new Map<string, string>());

//     const today = new Date().toISOString().split('T')[0];
//     const sectionOrder = ['personal', 'professional', 'id-verification', 'payment', 'insurance'];

//     // ==================== STRIPE CONNECT HOOKS ====================
//     const [startStripeOnboarding, { isLoading: isStartingOnboarding }] = useStartStripeOnboardingMutation();
//     const {
//         data: stripeStatus,
//         isLoading: isLoadingStripeStatus,
//         refetch: refetchStripeStatus
//     } = useGetStripeConnectStatusQuery(undefined, {
//         skip: !user?._id,
//         pollingInterval: stripeReturn ? 3000 : 0,
//     });
//     const [getStripeDashboard] = useLazyGetStripeDashboardQuery();
//     const [refreshOnboarding, { isLoading: isRefreshingOnboarding }] = useRefreshStripeOnboardingMutation();

//     // ==================== AUTH & USER DATA ====================
//     useEffect(() => {
//         const fetchUser = async () => {
//             const { isLoggedIn, user } = await checkLoginStatus();
//             if (isLoggedIn) {
//                 setUser(user);
//             } else {
//                 router.push("/authentication");
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

//     useEffect(() => {
//         if (stripeReturn === 'complete') {
//             toast.success('Stripe setup completed! Checking status...');
//             setActiveSection('payment');
//             router.replace('/complete-tasker-profile');
//         } else if (stripeReturn === 'refresh') {
//             toast.info('Please complete Stripe onboarding to receive payments.');
//             setActiveSection('payment');
//             router.replace('/complete-tasker-profile');
//         }
//     }, [stripeReturn, router]);

//     const initialDataLoadedRef = useRef(false);

//     // Load data from new schema structure
//     useEffect(() => {
//         if (userDetails && userDetails.user && user?._id && !initialDataLoadedRef.current) {
//             initialDataLoadedRef.current = true;

//             const userData = userDetails.user;
//             console.log('Loading initial form data from backend:', userData);

//             setFormData({
//                 // Personal
//                 profilePicture: userData.profilePicture || "",
//                 firstName: userData.firstName || "",
//                 lastName: userData.lastName || "",
//                 email: userData.email || "",

//                 // Professional
//                 dob: userData.dob ? new Date(userData.dob).toISOString().split('T')[0] : "",
//                 about: userData.about || "",
//                 yearsOfExperience: userData.yearsOfExperience?.toString() || "",
//                 categories: userData.categories || [], // ADDED

//                 // ID Verification - from nested structure
//                 idVerificationType: userData.idVerification?.type || "",
//                 idDocumentFront: userData.idVerification?.documentFront || "",
//                 idDocumentBack: userData.idVerification?.documentBack || "",
//                 idIssueDate: userData.idVerification?.issueDate
//                     ? new Date(userData.idVerification.issueDate).toISOString().split('T')[0]
//                     : "",
//                 idExpiryDate: userData.idVerification?.expiryDate
//                     ? new Date(userData.idVerification.expiryDate).toISOString().split('T')[0]
//                     : "",

//                 // Insurance - from nested structure
//                 hasInsurance: userData.insurance?.hasInsurance || false,
//                 insuranceDocument: userData.insurance?.documentUrl || "",
//             });

//             setShowInsuranceUpload(userData.insurance?.hasInsurance || false);
//         }
//     }, [userDetails, user?._id]);

//     const refreshDataFromBackend = async () => {
//         initialDataLoadedRef.current = false;
//         await refetch();
//     };

//     useEffect(() => {
//         setShowInsuranceUpload(formData.hasInsurance);
//     }, [formData.hasInsurance]);

//     // ==================== STRIPE CONNECT HELPERS ====================
//     const isStripeConnected =
//         stripeStatus?.status === 'active' &&
//         stripeStatus?.chargesEnabled === true &&
//         stripeStatus?.payoutsEnabled === true;

//     const isStripeIncomplete =
//         stripeStatus?.status === 'pending' &&
//         stripeStatus?.detailsSubmitted === false;

//     const isStripePayoutsPending =
//         stripeStatus?.detailsSubmitted === true &&
//         stripeStatus?.chargesEnabled === true &&
//         stripeStatus?.payoutsEnabled === false;

//     const stripeNeedsOnboarding =
//         !stripeStatus ||
//         stripeStatus?.status === 'not_connected' ||
//         stripeStatus?.connected === false;

//     // Updated Stripe onboarding handlers
//     const handleStartStripeOnboarding = async () => {
//         try {
//             const returnUrl = `${window.location.origin}/complete-tasker-profile?stripe_return=complete`;
//             const refreshUrl = `${window.location.origin}/complete-tasker-profile?stripe_return=refresh`;

//             const result = await startStripeOnboarding({
//                 returnUrl,
//                 refreshUrl
//             }).unwrap();

//             if (result.url) {
//                 window.location.href = result.url;
//             }
//         } catch (error: any) {
//             console.error('Stripe onboarding error:', error);
//             toast.error(error?.data?.error || 'Failed to start Stripe onboarding');
//         }
//     };

//     const handleRefreshOnboarding = async () => {
//         try {
//             const returnUrl = `${window.location.origin}/complete-tasker-profile?stripe_return=complete`;
//             const refreshUrl = `${window.location.origin}/complete-tasker-profile?stripe_return=refresh`;

//             const result = await refreshOnboarding({
//                 returnUrl,
//                 refreshUrl
//             }).unwrap();

//             if (result.url) {
//                 window.location.href = result.url;
//             }
//         } catch (error: any) {
//             console.error('Stripe refresh error:', error);
//             toast.error(error?.data?.error || 'Failed to refresh onboarding link');
//         }
//     };

//     const handleOpenStripeDashboard = async () => {
//         try {
//             const result = await getStripeDashboard().unwrap();
//             if (result.url) {
//                 window.open(result.url, '_blank');
//             }
//         } catch (error: any) {
//             console.error('Stripe dashboard error:', error);
//             toast.error(error?.data?.error || 'Failed to open Stripe dashboard');
//         }
//     };

//     // ==================== CATEGORY HANDLERS ====================
//     const handleCategoryToggle = (categoryId: string) => {
//         setFormData(prev => {
//             const currentCategories = prev.categories || [];
//             const isSelected = currentCategories.includes(categoryId);

//             if (isSelected) {
//                 // Remove category
//                 return {
//                     ...prev,
//                     categories: currentCategories.filter(c => c !== categoryId)
//                 };
//             } else {
//                 // Add category
//                 return {
//                     ...prev,
//                     categories: [...currentCategories, categoryId]
//                 };
//             }
//         });
//     };

//     const getCategoryValidationStatus = () => {
//         const count = formData.categories?.length || 0;
//         if (count === 0) return { status: 'empty', message: `Select at least ${MIN_CATEGORIES_REQUIRED} categories` };
//         if (count < MIN_CATEGORIES_REQUIRED) return { status: 'incomplete', message: `Select ${MIN_CATEGORIES_REQUIRED - count} more category${MIN_CATEGORIES_REQUIRED - count > 1 ? 's' : ''}` };
//         return { status: 'complete', message: `${count} categories selected` };
//     };

//     // ==================== DATE VALIDATION ====================
//     const isCompleteDateString = (dateStr: string): boolean => {
//         if (!dateStr) return false;
//         const parts = dateStr.split('-');
//         return parts.length === 3 && parts[0].length === 4 && parts[1].length === 2 && parts[2].length === 2;
//     };

//     const sanitizeDateValue = (value: string): string => {
//         if (!value) return value;
//         const parts = value.split('-');
//         if (parts[0] && parts[0].length > 4) {
//             parts[0] = parts[0].slice(0, 4);
//             return parts.join('-');
//         }
//         return value;
//     };

//     const validateDates = (issueDate: string, expiryDate: string): { issueDate?: string; expiryDate?: string } => {
//         const errors: { issueDate?: string; expiryDate?: string } = {};
//         const todayDate = new Date();
//         todayDate.setHours(0, 0, 0, 0);

//         if (issueDate) {
//             const issue = new Date(issueDate);
//             if (isNaN(issue.getTime())) {
//                 errors.issueDate = "Invalid date";
//             } else if (issue > todayDate) {
//                 errors.issueDate = "Issue date cannot be in the future";
//             } else if (issue.getFullYear() < 1900) {
//                 errors.issueDate = "Please enter a valid year";
//             }
//         }

//         if (expiryDate) {
//             const expiry = new Date(expiryDate);
//             if (isNaN(expiry.getTime())) {
//                 errors.expiryDate = "Invalid date";
//             } else if (expiry <= todayDate) {
//                 errors.expiryDate = "ID has expired. Please use a valid document";
//             } else if (expiry.getFullYear() > 2099) {
//                 errors.expiryDate = "Please enter a valid year";
//             }
//         }

//         if (issueDate && expiryDate && !errors.issueDate && !errors.expiryDate) {
//             const issue = new Date(issueDate);
//             const expiry = new Date(expiryDate);
//             if (expiry <= issue) {
//                 errors.expiryDate = "Expiry date must be after issue date";
//             }
//         }

//         return errors;
//     };

//     const handleIssueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value;
//         setFormData(prev => ({ ...prev, idIssueDate: value }));
//         const errors = validateDates(value, formData.idExpiryDate);
//         setDateErrors(errors);
//     };

//     const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value;
//         setFormData(prev => ({ ...prev, idExpiryDate: value }));
//         const errors = validateDates(formData.idIssueDate, value);
//         setDateErrors(errors);
//     };

//     const handleDateBlur = () => {
//         const errors = validateDates(formData.idIssueDate, formData.idExpiryDate);
//         setDateErrors(errors);
//     };

//     const areDatesValid = (): boolean => {
//         if (!formData.idIssueDate || !formData.idExpiryDate) return false;
//         if (!isCompleteDateString(formData.idIssueDate) || !isCompleteDateString(formData.idExpiryDate)) return false;
//         const errors = validateDates(formData.idIssueDate, formData.idExpiryDate);
//         return Object.keys(errors).length === 0;
//     };

//     // ==================== VALIDATION ====================
//     const getMissingFields = (sectionId: string): string[] => {
//         const missing: string[] = [];

//         switch (sectionId) {
//             case 'personal':
//                 if (!formData.profilePicture || formData.profilePicture.startsWith('blob:')) missing.push('Profile Picture');
//                 // ADDED: These fields moved from professional
//                 if (!formData.dob) missing.push('Date of Birth');
//                 if (!formData.yearsOfExperience) missing.push('Years of Experience');
//                 if (!formData.about) missing.push('About Me');
//                 break;
//             case 'professional':

//                 // ADDED: Categories validation
//                 if (!formData.categories || formData.categories.length < MIN_CATEGORIES_REQUIRED) {
//                     missing.push(`Service Categories (min ${MIN_CATEGORIES_REQUIRED})`);
//                 }
//                 break;
//             case 'id-verification':
//                 if (!formData.idVerificationType) missing.push('ID Type');
//                 if (formData.idVerificationType) {
//                     if (!formData.idIssueDate) missing.push('Issue Date');
//                     if (!formData.idExpiryDate) missing.push('Expiry Date');
//                     if (!formData.idDocumentFront || formData.idDocumentFront.startsWith('blob:')) {
//                         missing.push('ID Document (Front)');
//                     }
//                     if (formData.idVerificationType === 'governmentID') {
//                         if (!formData.idDocumentBack || formData.idDocumentBack.startsWith('blob:')) {
//                             missing.push('ID Document (Back)');
//                         }
//                     }
//                 }
//                 break;
//             case 'payment':
//                 if (!isStripeConnected) missing.push('Stripe Payment Setup');
//                 break;
//             case 'insurance':
//                 if (formData.hasInsurance && (!formData.insuranceDocument || formData.insuranceDocument.startsWith('blob:'))) {
//                     missing.push('Insurance Document');
//                 }
//                 break;
//         }

//         return missing;
//     };

//     const getNextSection = (currentSection: string): string | null => {
//         const currentIndex = sectionOrder.indexOf(currentSection);
//         if (currentIndex < sectionOrder.length - 1) {
//             return sectionOrder[currentIndex + 1];
//         }
//         return null;
//     };

//     const navigateToNextSection = () => {
//         const nextSection = getNextSection(activeSection);
//         if (nextSection) {
//             setActiveSection(nextSection);
//             window.scrollTo({ top: 0, behavior: 'smooth' });
//             toast.info(`Moving to ${sections.find(s => s.id === nextSection)?.label} section`);
//         } else {
//             toast.success("🎉 All sections completed! You can now submit your application.");
//         }
//     };

//     // Validate sections
//     useEffect(() => {
//         const validateSections = () => {
//             const validation: Record<string, boolean> = {};
//             const completed = new Set<string>();

//             // const personalValid = formData.profilePicture && !formData.profilePicture.startsWith('blob:');
//             // validation.personal = !!personalValid;
//             // if (personalValid) completed.add('personal');

//             // // UPDATED: Added categories validation
//             // const professionalValid = formData.dob &&
//             //     formData.yearsOfExperience &&
//             //     formData.about &&
//             //     formData.categories &&
//             //     formData.categories.length >= MIN_CATEGORIES_REQUIRED;
//             // validation.professional = !!professionalValid;
//             // if (professionalValid) completed.add('professional');
//             const personalValid = formData.profilePicture &&
//                 !formData.profilePicture.startsWith('blob:') &&
//                 formData.dob &&
//                 formData.yearsOfExperience &&
//                 formData.about;
//             validation.personal = !!personalValid;
//             if (personalValid) completed.add('personal');

//             // UPDATED: Professional only checks categories
//             const professionalValid = formData.categories &&
//                 formData.categories.length >= MIN_CATEGORIES_REQUIRED;
//             validation.professional = !!professionalValid;
//             if (professionalValid) completed.add('professional');

//             let idVerificationValid = false;
//             if (formData.idVerificationType && formData.idIssueDate && formData.idExpiryDate) {
//                 const hasFront = formData.idDocumentFront && !formData.idDocumentFront.startsWith('blob:');
//                 if (formData.idVerificationType === 'passport' || formData.idVerificationType === 'driverLicense') {
//                     idVerificationValid = !!hasFront;
//                 } else if (formData.idVerificationType === 'governmentID') {
//                     const hasBack = formData.idDocumentBack && !formData.idDocumentBack.startsWith('blob:');
//                     idVerificationValid = !!(hasFront && hasBack);
//                 }
//             }
//             validation['id-verification'] = idVerificationValid;
//             if (idVerificationValid) completed.add('id-verification');

//             const paymentValid = isStripeConnected;
//             validation.payment = !!paymentValid;
//             if (paymentValid) completed.add('payment');

//             const insuranceValid = formData.hasInsurance ? !!(formData.insuranceDocument && !formData.insuranceDocument.startsWith('blob:')) : true;
//             validation.insurance = insuranceValid;
//             if (insuranceValid) completed.add('insurance');

//             setSectionValidation(validation);
//             setCompletedSections(completed);
//         };
//         validateSections();
//     }, [formData, isStripeConnected]);

//     useEffect(() => {
//         return () => {
//             localUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
//             localUrlsRef.current.clear();
//         };
//     }, []);

//     // ==================== FILE HANDLERS ====================
//     const handleFileUpload = async (file: File, field: string): Promise<string | null> => {
//         if (!file) return null;
//         if (!file.type.startsWith('image/')) {
//             toast.error(`${field} must be an image file.`);
//             return null;
//         }
//         setIsUploading(true);
//         setUploadField(field);
//         try {
//             const url = await uploadToImgBB(file);
//             toast.success(`Uploaded successfully!`);
//             setIsUploading(false);
//             setUploadField(null);
//             return url;
//         } catch (error) {
//             console.error('Upload error:', error);
//             toast.error(`Failed to upload`);
//             setIsUploading(false);
//             setUploadField(null);
//             return null;
//         }
//     };

//     const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
//         const file = e.target.files?.[0];
//         if (file) {
//             const localUrl = URL.createObjectURL(file);
//             localUrlsRef.current.set(field, localUrl);
//             setSelectedFiles(prev => ({ ...prev, [field]: file }));
//             setFormData(prev => ({ ...prev, [field]: localUrl }));

//             const uploadedUrl = await handleFileUpload(file, field);
//             if (uploadedUrl) {
//                 console.log(`✅ File uploaded for ${field}:`, uploadedUrl);
//                 setFormData(prev => ({ ...prev, [field]: uploadedUrl }));
//                 const oldLocalUrl = localUrlsRef.current.get(field);
//                 if (oldLocalUrl) {
//                     URL.revokeObjectURL(oldLocalUrl);
//                     localUrlsRef.current.delete(field);
//                 }
//             }
//             setSelectedFiles(prev => ({ ...prev, [field]: null }));
//             e.target.value = '';
//         }
//     };

//     const getPreviewUrl = (field: string): string => {
//         return formData[field as keyof typeof formData] as string || '';
//     };

//     const isLocalPreview = (field: string): boolean => {
//         const url = getPreviewUrl(field);
//         return url.startsWith('blob:');
//     };

//     const needsUnoptimized = (src: string): boolean => !src.startsWith('/');

//     // ==================== FORM HANDLERS ====================
//     const handleIdTypeChange = (value: string) => {
//         setFormData(prev => ({
//             ...prev,
//             idVerificationType: value,
//             idDocumentFront: "",
//             idDocumentBack: "",
//         }));
//     };

//     const handleHasInsuranceChange = (checked: boolean) => {
//         setFormData(prev => ({
//             ...prev,
//             hasInsurance: checked,
//             insuranceDocument: checked ? prev.insuranceDocument : ""
//         }));
//         setShowInsuranceUpload(checked);

//         if (!checked) {
//             const localUrl = localUrlsRef.current.get('insuranceDocument');
//             if (localUrl) {
//                 URL.revokeObjectURL(localUrl);
//                 localUrlsRef.current.delete('insuranceDocument');
//             }
//             setSelectedFiles(prev => ({ ...prev, insuranceDocument: null }));
//         }
//     };

//     const canAccessSection = (sectionId: string) => {
//         const currentIndex = sectionOrder.indexOf(sectionId);
//         if (currentIndex === 0) return true;
//         for (let i = 0; i < currentIndex; i++) {
//             if (!completedSections.has(sectionOrder[i])) {
//                 return false;
//             }
//         }
//         return true;
//     };

//     const handleSectionChange = (sectionId: string) => {
//         if (canAccessSection(sectionId)) {
//             setActiveSection(sectionId);
//         } else {
//             toast.error("Please complete previous sections first.");
//         }
//     };

//     // ==================== SAVE HANDLERS ====================
//     // const handleSavePersonalInfo = async () => {
//     //     if (!user?._id) return toast.error("User not logged in.");
//     //     if (formData.profilePicture?.startsWith('blob:')) return toast.warn("Please wait for upload to complete.");

//     //     const missing = getMissingFields('personal');
//     //     if (missing.length > 0) {
//     //         return toast.error(`Please fill in: ${missing.join(', ')}`);
//     //     }

//     //     const payload: any = { userId: user._id };
//     //     if (formData.profilePicture && !formData.profilePicture.startsWith('blob:')) {
//     //         payload.profilePicture = formData.profilePicture;
//     //     }

//     //     console.log('💾 Saving personal info:', payload);

//     //     try {
//     //         await updateUser(payload).unwrap();
//     //         await refetch();
//     //         toast.success("Personal info saved!");
//     //         navigateToNextSection();
//     //     } catch (err: any) {
//     //         console.error('Save error:', err);
//     //         toast.error(`Failed: ${err.data?.error || err.message}`);
//     //     }
//     // };

//     const handleSavePersonalInfo = async () => {
//         if (!user?._id) return toast.error("User not logged in.");
//         if (formData.profilePicture?.startsWith('blob:')) return toast.warn("Please wait for upload to complete.");

//         const missing = getMissingFields('personal');
//         if (missing.length > 0) {
//             return toast.error(`Please fill in: ${missing.join(', ')}`);
//         }

//         const payload: any = { userId: user._id };
//         if (formData.profilePicture && !formData.profilePicture.startsWith('blob:')) {
//             payload.profilePicture = formData.profilePicture;
//         }
//         // ADDED: Include dob, about, yearsOfExperience
//         if (formData.dob) payload.dob = new Date(formData.dob);
//         if (formData.about) payload.about = formData.about;
//         if (formData.yearsOfExperience) payload.yearsOfExperience = parseInt(formData.yearsOfExperience, 10);

//         console.log('💾 Saving personal info:', payload);

//         try {
//             await updateUser(payload).unwrap();
//             await refetch();
//             toast.success("Personal info saved!");
//             navigateToNextSection();
//         } catch (err: any) {
//             console.error('Save error:', err);
//             toast.error(`Failed: ${err.data?.error || err.message}`);
//         }
//     };

//     // const handleSaveProfessionalProfile = async () => {
//     //     if (!user?._id) return toast.error("User not logged in.");

//     //     const missing = getMissingFields('professional');
//     //     if (missing.length > 0) {
//     //         return toast.error(`Please fill in: ${missing.join(', ')}`);
//     //     }

//     //     const payload: any = { userId: user._id };
//     //     if (formData.dob) payload.dob = new Date(formData.dob);
//     //     if (formData.about) payload.about = formData.about;
//     //     if (formData.yearsOfExperience) payload.yearsOfExperience = parseInt(formData.yearsOfExperience, 10);
//     //     // ADDED: Include categories
//     //     if (formData.categories && formData.categories.length >= MIN_CATEGORIES_REQUIRED) {
//     //         payload.categories = formData.categories;
//     //     }

//     //     console.log('💾 Saving professional profile:', payload);

//     //     try {
//     //         await updateUser(payload).unwrap();
//     //         await refetch();
//     //         toast.success("Professional profile saved!");
//     //         navigateToNextSection();
//     //     } catch (err: any) {
//     //         console.error('Save error:', err);
//     //         toast.error(`Failed: ${err.data?.error || err.message}`);
//     //     }
//     // };




//     const handleSaveProfessionalProfile = async () => {
//         if (!user?._id) return toast.error("User not logged in.");

//         const missing = getMissingFields('professional');
//         if (missing.length > 0) {
//             return toast.error(`Please fill in: ${missing.join(', ')}`);
//         }

//         const payload: any = { userId: user._id };
//         // REMOVED: dob, about, yearsOfExperience - now only categories
//         if (formData.categories && formData.categories.length >= MIN_CATEGORIES_REQUIRED) {
//             payload.categories = formData.categories;
//         }

//         console.log('💾 Saving professional profile:', payload);

//         try {
//             await updateUser(payload).unwrap();
//             await refetch();
//             toast.success("Service categories saved!");
//             navigateToNextSection();
//         } catch (err: any) {
//             console.error('Save error:', err);
//             toast.error(`Failed: ${err.data?.error || err.message}`);
//         }
//     };

//     const handleSaveIdVerification = async () => {
//         if (!user?._id) return toast.error("User not logged in.");
//         if (!formData.idVerificationType) return toast.error("Please select ID type.");

//         if (formData.idDocumentFront?.startsWith('blob:')) {
//             return toast.warn("Please wait for front document upload to complete.");
//         }
//         if (formData.idVerificationType === 'governmentID' && formData.idDocumentBack?.startsWith('blob:')) {
//             return toast.warn("Please wait for back document upload to complete.");
//         }

//         if (!formData.idIssueDate) {
//             return toast.error("Please enter the issue date.");
//         }
//         if (!formData.idExpiryDate) {
//             return toast.error("Please enter the expiry date.");
//         }

//         const errors = validateDates(formData.idIssueDate, formData.idExpiryDate);
//         setDateErrors(errors);

//         if (errors.issueDate) {
//             return toast.error(errors.issueDate);
//         }
//         if (errors.expiryDate) {
//             return toast.error(errors.expiryDate);
//         }

//         const missing = getMissingFields('id-verification');
//         if (missing.length > 0) {
//             return toast.error(`Please fill in: ${missing.join(', ')}`);
//         }

//         const payload: any = {
//             userId: user._id,
//             idVerification: {
//                 type: formData.idVerificationType,
//                 documentFront: formData.idDocumentFront,
//                 documentBack: formData.idVerificationType === 'governmentID' ? formData.idDocumentBack : null,
//                 issueDate: new Date(formData.idIssueDate),
//                 expiryDate: new Date(formData.idExpiryDate),
//                 verified: false,
//             }
//         };

//         console.log('💾 Saving ID verification:', payload);

//         try {
//             const result = await updateUser(payload).unwrap();
//             console.log('✅ Update result:', result);
//             await refetch();
//             toast.success("ID verification saved!");
//             navigateToNextSection();
//         } catch (err: any) {
//             console.error('❌ Save error:', err);
//             toast.error(`Failed: ${err.data?.error || err.data?.message || err.message || 'Unknown error'}`);
//         }
//     };

//     const handleContinueFromPayment = () => {
//         if (!isStripeConnected) {
//             return toast.error("Please complete Stripe payment setup to continue.");
//         }
//         toast.success("Payment setup verified!");
//         navigateToNextSection();
//     };

//     const handleSaveInsurance = async () => {
//         if (!user?._id) return toast.error("User not logged in.");
//         if (formData.insuranceDocument?.startsWith('blob:')) return toast.warn("Please wait for upload to complete.");

//         const missing = getMissingFields('insurance');
//         if (missing.length > 0) {
//             return toast.error(`Please fill in: ${missing.join(', ')}`);
//         }

//         const payload: any = {
//             userId: user._id,
//             insurance: {
//                 hasInsurance: formData.hasInsurance,
//                 documentUrl: formData.hasInsurance ? formData.insuranceDocument : null,
//                 verified: false,
//             }
//         };

//         console.log('💾 Saving insurance:', payload);

//         try {
//             await updateUser(payload).unwrap();
//             await refetch();
//             toast.success("Insurance saved!");
//             toast.success("🎉 All sections completed! You can now submit your application.");
//         } catch (err: any) {
//             console.error('Save error:', err);
//             toast.error(`Failed: ${err.data?.error || err.message}`);
//         }
//     };

//     // ==================== UI HELPERS ====================
//     const sections = [
//         { id: 'personal', label: 'Personal', icon: User },
//         { id: 'professional', label: 'Professional', icon: Edit3 },
//         { id: 'id-verification', label: 'ID Verification', icon: FileText },
//         { id: 'payment', label: 'Payment', icon: CreditCard },
//         { id: 'insurance', label: 'Insurance', icon: Shield },
//     ];

//     const MissingFieldsAlert = ({ sectionId }: { sectionId: string }) => {
//         const missing = getMissingFields(sectionId);
//         if (missing.length === 0) return null;

//         return (
//             <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
//                 <div className="flex items-start gap-3">
//                     <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
//                     <div>
//                         <p className="text-sm font-medium text-amber-800">Missing Required Fields</p>
//                         <p className="text-sm text-amber-700 mt-1">
//                             Please complete: <span className="font-medium">{missing.join(', ')}</span>
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     const isProfileVerified = userDetails?.user?.taskerStatus === "approved";
//     const lockedSectionsWhenVerified = ['personal', 'professional', 'id-verification'];
//     const isSectionLocked = (sectionId: string): boolean => {
//         return isProfileVerified && lockedSectionsWhenVerified.includes(sectionId);
//     };

//     const LockedSectionAlert = ({ sectionId }: { sectionId: string }) => {
//         if (!isSectionLocked(sectionId)) return null;

//         return (
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
//                 <div className="flex items-start gap-3">
//                     <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
//                     <div>
//                         <p className="text-sm font-medium text-blue-800">Section Locked</p>
//                         <p className="text-sm text-blue-700 mt-1">
//                             This section cannot be edited after profile verification.
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     // ==================== LOADING STATE ====================
//     if (isUserLoading) {
//         return (
//             <div className="min-h-screen bg-white flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="w-12 h-12 border-3 border-[#E5FFDB] border-t-[#109C3D] rounded-full animate-spin mx-auto mb-4"></div>
//                     <p className="text-gray-500">Loading your profile...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (!userDetails || !userDetails.user) {
//         return (
//             <div className="min-h-screen bg-[#E5FFDB]/20 flex items-center justify-center p-4">
//                 <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-sm w-full border border-[#109C3D]/20">
//                     <div className="w-16 h-16 bg-[#E5FFDB] rounded-full flex items-center justify-center mx-auto mb-4">
//                         <HiOutlineDocumentText className="w-8 h-8 text-[#063A41]" />
//                     </div>
//                     <h2 className="text-xl font-semibold text-[#063A41] mb-2">Loading Profile</h2>
//                     <p className="text-gray-500">Please wait...</p>
//                 </div>
//             </div>
//         );
//     }

//     const allSectionsCompleted = completedSections.size === sections.length;
//     const canSubmitApplication = allSectionsCompleted &&
//         (userDetails?.user?.taskerStatus === "not_applied" || userDetails?.user?.taskerStatus === "rejected") &&
//         !applicationSubmitted;

//     // ==================== RENDER ====================
//     return (
//         <div className="min-h-screen bg-[#E5FFDB]/10">
//             <Navbar />

//             {/* Header */}
//             <div className="bg-[#063A41]">
//                 <div className="max-w-5xl mx-auto px-4 py-8">
//                     <h1 className="text-2xl font-bold text-white">Update Documents & Profile</h1>
//                     <p className="text-[#E5FFDB] text-sm mt-1">Complete your verification to become a tasker</p>

//                     {/* Progress Bar */}
//                     <div className="mt-6">
//                         <div className="flex justify-between items-center mb-2">
//                             <span className="text-sm text-[#E5FFDB]">
//                                 {completedSections.size} of {sections.length} completed
//                             </span>
//                             <span className="text-sm font-medium text-white">
//                                 {Math.round((completedSections.size / sections.length) * 100)}%
//                             </span>
//                         </div>
//                         <div className="w-full bg-white/20 rounded-full h-2">
//                             <div
//                                 className="bg-[#109C3D] h-2 rounded-full transition-all duration-500"
//                                 style={{ width: `${(completedSections.size / sections.length) * 100}%` }}
//                             ></div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Tabs */}
//             <div className="bg-white border-b sticky top-0 z-10">
//                 <div className="max-w-5xl mx-auto px-4">
//                     <div className="flex gap-1 overflow-x-auto py-2">
//                         {sections.map((section) => {
//                             const Icon = section.icon;
//                             const isActive = activeSection === section.id;
//                             const isCompleted = completedSections.has(section.id);
//                             const canAccess = canAccessSection(section.id);
//                             const hasMissing = getMissingFields(section.id).length > 0;

//                             return (
//                                 <button
//                                     key={section.id}
//                                     onClick={() => handleSectionChange(section.id)}
//                                     disabled={!canAccess}
//                                     className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${isActive
//                                         ? "bg-[#063A41] text-white"
//                                         : isCompleted
//                                             ? "bg-[#E5FFDB] text-[#109C3D]"
//                                             : canAccess
//                                                 ? "text-gray-500 hover:bg-gray-100"
//                                                 : "text-gray-300 cursor-not-allowed"
//                                         }`}
//                                 >
//                                     {!canAccess ? (
//                                         <Lock className="w-4 h-4" />
//                                     ) : isCompleted ? (
//                                         <CheckCircle className="w-4 h-4" />
//                                     ) : (
//                                         <Icon className="w-4 h-4" />
//                                     )}
//                                     {section.label}
//                                     {canAccess && hasMissing && !isCompleted && (
//                                         <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full"></span>
//                                     )}
//                                 </button>
//                             );
//                         })}
//                     </div>
//                 </div>
//             </div>

//             {/* Content */}
//             <div className="max-w-5xl mx-auto px-4 py-6">

//                 {/* ==================== PERSONAL SECTION ==================== */}
//                 {activeSection === 'personal' && (
//                     <div className="space-y-4">
//                         <LockedSectionAlert sectionId="personal" />
//                         <MissingFieldsAlert sectionId="personal" />

//                         <div className={`bg-white rounded-lg border p-5 ${isSectionLocked('personal') ? 'opacity-75' : ''}`}>
//                             <h3 className="font-medium text-[#063A41] mb-4 flex items-center gap-2">
//                                 Personal Information
//                                 {isSectionLocked('personal') && <Lock className="w-4 h-4 text-blue-500" />}
//                             </h3>

//                             {/* Profile Picture */}
//                             <div className="flex items-center gap-6 mb-6 pb-6 border-b">
//                                 <div className="relative">
//                                     <Image
//                                         src={getPreviewUrl("profilePicture") || "/placeholder-avatar.png"}
//                                         alt="Profile"
//                                         width={80}
//                                         height={80}
//                                         className="rounded-full object-cover border-2 border-[#E5FFDB]"
//                                         unoptimized={needsUnoptimized(getPreviewUrl("profilePicture") || "")}
//                                     />
//                                     {isUploading && uploadField === "profilePicture" && (
//                                         <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
//                                             <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                                         </div>
//                                     )}
//                                 </div>
//                                 <div>
//                                     {!isSectionLocked('personal') && (
//                                         <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#E5FFDB] text-[#063A41] rounded-lg hover:bg-[#d4f5c8] transition-colors">
//                                             <Upload className="w-4 h-4" />
//                                             Upload Photo
//                                             <input
//                                                 type="file"
//                                                 accept="image/*"
//                                                 onChange={(e) => handleFileChange(e, "profilePicture")}
//                                                 className="hidden"
//                                                 disabled={isUploading}
//                                             />
//                                         </label>
//                                     )}
//                                     {getPreviewUrl("profilePicture") && !isLocalPreview("profilePicture") && (
//                                         <span className="ml-2 text-xs text-[#109C3D]">✓ Uploaded</span>
//                                     )}
//                                     {isLocalPreview("profilePicture") && (
//                                         <span className="ml-2 text-xs text-amber-600">Uploading...</span>
//                                     )}
//                                 </div>
//                             </div>

//                             <div className="space-y-4">
//                                 <div className="grid md:grid-cols-2 gap-4">
//                                     <div>
//                                         <label className="block text-sm font-medium text-[#063A41] mb-1">First Name</label>
//                                         <input
//                                             type="text"
//                                             value={formData.firstName}
//                                             disabled
//                                             className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-[#063A41] mb-1">Last Name</label>
//                                         <input
//                                             type="text"
//                                             value={formData.lastName}
//                                             disabled
//                                             className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500"
//                                         />
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-[#063A41] mb-1">Email</label>
//                                     <input
//                                         type="email"
//                                         value={formData.email}
//                                         disabled
//                                         className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500"
//                                     />
//                                 </div>

//                                 {/* ADDED: Date of Birth, Years of Experience, About Me */}
//                                 <div className="pt-4 border-t">
//                                     <div className="grid md:grid-cols-2 gap-4">
//                                         <div>
//                                             <label className="block text-sm font-medium text-[#063A41] mb-1">
//                                                 Date of Birth
//                                                 {!formData.dob && <span className="text-amber-600 ml-1">* Required</span>}
//                                             </label>
//                                             <input
//                                                 type="date"
//                                                 value={formData.dob}
//                                                 onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
//                                                 max={today}
//                                                 disabled={isSectionLocked('personal')}
//                                                 className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent ${isSectionLocked('personal') ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : !formData.dob ? 'border-amber-300 bg-amber-50/30' : 'border-gray-200'}`}
//                                             />
//                                         </div>
//                                         <div>
//                                             <label className="block text-sm font-medium text-[#063A41] mb-1">
//                                                 Years of Experience
//                                                 {!formData.yearsOfExperience && <span className="text-amber-600 ml-1">* Required</span>}
//                                             </label>
//                                             <input
//                                                 type="number"
//                                                 min="0"
//                                                 placeholder="e.g., 5"
//                                                 value={formData.yearsOfExperience}
//                                                 onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
//                                                 disabled={isSectionLocked('personal')}
//                                                 className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent ${isSectionLocked('personal') ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : !formData.yearsOfExperience ? 'border-amber-300 bg-amber-50/30' : 'border-gray-200'}`}
//                                             />
//                                         </div>
//                                     </div>
//                                     <div className="mt-4">
//                                         <label className="block text-sm font-medium text-[#063A41] mb-1">
//                                             About Me
//                                             {!formData.about && <span className="text-amber-600 ml-1">* Required</span>}
//                                         </label>
//                                         <textarea
//                                             rows={4}
//                                             placeholder="Tell us about yourself and your professional background..."
//                                             value={formData.about}
//                                             onChange={(e) => setFormData({ ...formData, about: e.target.value })}
//                                             disabled={isSectionLocked('personal')}
//                                             className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent resize-none ${isSectionLocked('personal') ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : !formData.about ? 'border-amber-300 bg-amber-50/30' : 'border-gray-200'}`}
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         <button
//                             onClick={handleSavePersonalInfo}
//                             disabled={isUpdating || isUploading || isSectionLocked('personal')}
//                             className={`w-full py-3 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${isSectionLocked('personal') ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#109C3D] text-white hover:bg-[#0d8534] disabled:opacity-50'}`}
//                         >
//                             {isSectionLocked('personal') ? (
//                                 <>
//                                     <Lock className="w-4 h-4" />
//                                     Section Locked
//                                 </>
//                             ) : (
//                                 <>
//                                     <Save className="w-4 h-4" />
//                                     {isUpdating ? "Saving..." : "Save & Continue →"}
//                                 </>
//                             )}
//                         </button>
//                     </div>
//                 )}

//                 {/* ==================== PROFESSIONAL SECTION ==================== */}
//                 {/* ==================== PROFESSIONAL SECTION ==================== */}
//                 {activeSection === 'professional' && (
//                     <div className="space-y-4">
//                         <LockedSectionAlert sectionId="professional" />
//                         <MissingFieldsAlert sectionId="professional" />

//                         {/* ==================== SERVICE CATEGORIES SECTION ==================== */}
//                         <div className={`bg-white rounded-lg border p-5 ${isSectionLocked('professional') ? 'opacity-75' : ''}`}>
//                             <div className="flex items-center justify-between mb-4">
//                                 <h3 className="font-medium text-[#063A41] flex items-center gap-2">
//                                     <Briefcase className="w-5 h-5" />
//                                     Service Categories
//                                     {isSectionLocked('professional') && <Lock className="w-4 h-4 text-blue-500" />}
//                                 </h3>
//                                 <div className="flex items-center gap-2">
//                                     {(() => {
//                                         const validation = getCategoryValidationStatus();
//                                         return (
//                                             <span className={`text-sm flex items-center gap-1 ${validation.status === 'complete'
//                                                 ? 'text-[#109C3D]'
//                                                 : 'text-amber-600'
//                                                 }`}>
//                                                 {validation.status === 'complete' ? (
//                                                     <CheckCircle className="w-4 h-4" />
//                                                 ) : (
//                                                     <AlertCircle className="w-4 h-4" />
//                                                 )}
//                                                 {validation.message}
//                                             </span>
//                                         );
//                                     })()}
//                                 </div>
//                             </div>

//                             <p className="text-sm text-gray-600 mb-4">
//                                 Select the service categories you can provide. You must select at least {MIN_CATEGORIES_REQUIRED} categories.
//                             </p>

//                             <div className="grid sm:grid-cols-2 gap-3">
//                                 {SERVICE_CATEGORIES.map((category) => {
//                                     const isSelected = formData.categories?.includes(category.id);
//                                     return (
//                                         <button
//                                             key={category.id}
//                                             type="button"
//                                             onClick={() => !isSectionLocked('professional') && handleCategoryToggle(category.id)}
//                                             disabled={isSectionLocked('professional')}
//                                             className={`relative flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${isSectionLocked('professional')
//                                                 ? 'bg-gray-50 border-gray-200 cursor-not-allowed'
//                                                 : isSelected
//                                                     ? 'bg-[#E5FFDB] border-[#109C3D] shadow-sm'
//                                                     : 'bg-white border-gray-200 hover:border-[#109C3D]/50 hover:bg-[#E5FFDB]/20'
//                                                 }`}
//                                         >
//                                             {/* Checkbox indicator */}
//                                             <div className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${isSelected
//                                                 ? 'bg-[#109C3D] border-[#109C3D]'
//                                                 : 'border-gray-300 bg-white'
//                                                 }`}>
//                                                 {isSelected && (
//                                                     <Check className="w-4 h-4 text-white" />
//                                                 )}
//                                             </div>

//                                             {/* Icon */}
//                                             <span className="text-2xl flex-shrink-0">{category.icon}</span>

//                                             {/* Label */}
//                                             <span className={`text-sm font-medium ${isSelected ? 'text-[#063A41]' : 'text-gray-700'
//                                                 }`}>
//                                                 {category.label}
//                                             </span>

//                                             {/* Selected badge */}
//                                             {isSelected && (
//                                                 <span className="absolute top-2 right-2">
//                                                     <CheckCircle className="w-4 h-4 text-[#109C3D]" />
//                                                 </span>
//                                             )}
//                                         </button>
//                                     );
//                                 })}
//                             </div>

//                             {/* Selected categories summary */}
//                             {formData.categories && formData.categories.length > 0 && (
//                                 <div className="mt-4 pt-4 border-t">
//                                     <p className="text-sm text-gray-600 mb-2">Selected categories:</p>
//                                     <div className="flex flex-wrap gap-2">
//                                         {formData.categories.map((catId) => {
//                                             const category = SERVICE_CATEGORIES.find(c => c.id === catId);
//                                             if (!category) return null;
//                                             return (
//                                                 <span
//                                                     key={catId}
//                                                     className="inline-flex items-center gap-1 px-3 py-1 bg-[#E5FFDB] text-[#063A41] text-sm rounded-full"
//                                                 >
//                                                     <span>{category.icon}</span>
//                                                     <span>{category.label}</span>
//                                                     {!isSectionLocked('professional') && (
//                                                         <button
//                                                             type="button"
//                                                             onClick={() => handleCategoryToggle(catId)}
//                                                             className="ml-1 hover:text-red-500 transition-colors"
//                                                         >
//                                                             <X className="w-3 h-3" />
//                                                         </button>
//                                                     )}
//                                                 </span>
//                                             );
//                                         })}
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Warning if less than minimum */}
//                             {formData.categories && formData.categories.length > 0 && formData.categories.length < MIN_CATEGORIES_REQUIRED && (
//                                 <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
//                                     <p className="text-sm text-amber-700 flex items-center gap-2">
//                                         <AlertTriangle className="w-4 h-4 flex-shrink-0" />
//                                         Please select {MIN_CATEGORIES_REQUIRED - formData.categories.length} more category{MIN_CATEGORIES_REQUIRED - formData.categories.length > 1 ? 's' : ''} to continue.
//                                     </p>
//                                 </div>
//                             )}
//                         </div>

//                         <button
//                             onClick={handleSaveProfessionalProfile}
//                             disabled={isUpdating || isSectionLocked('professional') || (formData.categories?.length || 0) < MIN_CATEGORIES_REQUIRED}
//                             className={`w-full py-3 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${isSectionLocked('professional')
//                                 ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                                 : (formData.categories?.length || 0) < MIN_CATEGORIES_REQUIRED
//                                     ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                                     : 'bg-[#109C3D] text-white hover:bg-[#0d8534] disabled:opacity-50'
//                                 }`}
//                         >
//                             {isSectionLocked('professional') ? (
//                                 <>
//                                     <Lock className="w-4 h-4" />
//                                     Section Locked
//                                 </>
//                             ) : (formData.categories?.length || 0) < MIN_CATEGORIES_REQUIRED ? (
//                                 <>
//                                     <AlertCircle className="w-4 h-4" />
//                                     Select at least {MIN_CATEGORIES_REQUIRED} categories to continue
//                                 </>
//                             ) : (
//                                 <>
//                                     <Save className="w-4 h-4" />
//                                     {isUpdating ? "Saving..." : "Save & Continue →"}
//                                 </>
//                             )}
//                         </button>
//                     </div>
//                 )}

//                 {/* ==================== ID VERIFICATION SECTION ==================== */}
//                 {activeSection === 'id-verification' && (
//                     <div className="space-y-4">
//                         <LockedSectionAlert sectionId="id-verification" />
//                         <MissingFieldsAlert sectionId="id-verification" />

//                         <div className={`bg-white rounded-lg border p-5 ${isSectionLocked('id-verification') ? 'opacity-75' : ''}`}>
//                             <h3 className="font-medium text-[#063A41] mb-4 flex items-center gap-2">
//                                 ID Verification
//                                 {isSectionLocked('id-verification') && <Lock className="w-4 h-4 text-blue-500" />}
//                             </h3>

//                             <div className="space-y-4">
//                                 {/* ID Type Selection */}
//                                 <div>
//                                     <label className="block text-sm font-medium text-[#063A41] mb-1">
//                                         ID Type
//                                         {!formData.idVerificationType && <span className="text-amber-600 ml-1">* Required</span>}
//                                     </label>
//                                     <select
//                                         value={formData.idVerificationType}
//                                         onChange={(e) => handleIdTypeChange(e.target.value)}
//                                         disabled={isSectionLocked('id-verification')}
//                                         className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent ${isSectionLocked('id-verification') ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : !formData.idVerificationType ? 'border-amber-300 bg-amber-50/30' : 'border-gray-200'}`}
//                                     >
//                                         <option value="">Select ID type</option>
//                                         <option value="passport">Passport</option>
//                                         <option value="governmentID">Government ID (Front & Back)</option>
//                                         <option value="driverLicense">Driver's License</option>
//                                     </select>
//                                 </div>

//                                 {/* Issue Date and Expiry Date */}
//                                 {formData.idVerificationType && (
//                                     <div className="grid md:grid-cols-2 gap-4">
//                                         {/* Issue Date */}
//                                         <div>
//                                             <label className="block text-sm font-medium text-[#063A41] mb-1">
//                                                 <Calendar className="w-4 h-4 inline mr-1" />
//                                                 Issue Date
//                                                 {!formData.idIssueDate && <span className="text-amber-600 ml-1">* Required</span>}
//                                             </label>
//                                             <input
//                                                 type="date"
//                                                 value={formData.idIssueDate}
//                                                 onChange={handleIssueDateChange}
//                                                 onBlur={handleDateBlur}
//                                                 min="1900-01-01"
//                                                 max={today}
//                                                 disabled={isSectionLocked('id-verification')}
//                                                 className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent ${isSectionLocked('id-verification')
//                                                     ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
//                                                     : dateErrors.issueDate
//                                                         ? 'border-red-400 bg-red-50/30'
//                                                         : formData.idIssueDate && !dateErrors.issueDate
//                                                             ? 'border-green-400 bg-green-50/30'
//                                                             : !formData.idIssueDate
//                                                                 ? 'border-amber-300 bg-amber-50/30'
//                                                                 : 'border-gray-200'
//                                                     }`}
//                                             />
//                                             {dateErrors.issueDate ? (
//                                                 <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
//                                                     <AlertCircle className="w-3 h-3" />
//                                                     {dateErrors.issueDate}
//                                                 </p>
//                                             ) : formData.idIssueDate && !dateErrors.issueDate ? (
//                                                 <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
//                                                     <CheckCircle className="w-3 h-3" />
//                                                     Valid issue date
//                                                 </p>
//                                             ) : (
//                                                 <p className="text-xs text-gray-500 mt-1">When was your ID issued?</p>
//                                             )}
//                                         </div>

//                                         {/* Expiry Date */}
//                                         <div>
//                                             <label className="block text-sm font-medium text-[#063A41] mb-1">
//                                                 <Calendar className="w-4 h-4 inline mr-1" />
//                                                 Expiry Date
//                                                 {!formData.idExpiryDate && <span className="text-amber-600 ml-1">* Required</span>}
//                                             </label>
//                                             <input
//                                                 type="date"
//                                                 value={formData.idExpiryDate}
//                                                 onChange={handleExpiryDateChange}
//                                                 onBlur={handleDateBlur}
//                                                 min={formData.idIssueDate ? formData.idIssueDate : today}
//                                                 max="2099-12-31"
//                                                 disabled={isSectionLocked('id-verification')}
//                                                 className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent ${isSectionLocked('id-verification')
//                                                     ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
//                                                     : dateErrors.expiryDate
//                                                         ? 'border-red-400 bg-red-50/30'
//                                                         : formData.idExpiryDate && !dateErrors.expiryDate
//                                                             ? 'border-green-400 bg-green-50/30'
//                                                             : !formData.idExpiryDate
//                                                                 ? 'border-amber-300 bg-amber-50/30'
//                                                                 : 'border-gray-200'
//                                                     }`}
//                                             />
//                                             {dateErrors.expiryDate ? (
//                                                 <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
//                                                     <AlertCircle className="w-3 h-3" />
//                                                     {dateErrors.expiryDate}
//                                                 </p>
//                                             ) : formData.idExpiryDate && !dateErrors.expiryDate ? (
//                                                 <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
//                                                     <CheckCircle className="w-3 h-3" />
//                                                     Valid expiry date
//                                                 </p>
//                                             ) : (
//                                                 <p className="text-xs text-gray-500 mt-1">Must be a valid, non-expired document</p>
//                                             )}
//                                         </div>
//                                     </div>
//                                 )}

//                                 {/* Document uploads based on ID type */}
//                                 {formData.idVerificationType && (
//                                     <div className={`grid ${formData.idVerificationType === 'governmentID' ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-4`}>
//                                         {/* Front Document */}
//                                         <div>
//                                             <label className="block text-sm font-medium text-[#063A41] mb-2">
//                                                 {formData.idVerificationType === 'passport' ? 'Passport Photo Page' :
//                                                     formData.idVerificationType === 'driverLicense' ? "Driver's License (Front)" :
//                                                         'ID Front'}
//                                                 {(!formData.idDocumentFront || formData.idDocumentFront.startsWith('blob:')) && <span className="text-amber-600 ml-1">* Required</span>}
//                                             </label>
//                                             <div className={`border-2 border-dashed rounded-lg p-6 text-center ${!formData.idDocumentFront ? 'border-amber-300 bg-amber-50/30' : 'border-gray-200'}`}>
//                                                 {getPreviewUrl("idDocumentFront") ? (
//                                                     <div className="space-y-3">
//                                                         <Image
//                                                             src={getPreviewUrl("idDocumentFront")}
//                                                             alt="ID Front"
//                                                             width={120}
//                                                             height={80}
//                                                             className="mx-auto rounded-lg object-cover"
//                                                             unoptimized
//                                                         />
//                                                         {isUploading && uploadField === "idDocumentFront" ? (
//                                                             <span className="text-xs text-amber-600">Uploading...</span>
//                                                         ) : !isLocalPreview("idDocumentFront") ? (
//                                                             <span className="text-xs text-[#109C3D]">✓ Uploaded</span>
//                                                         ) : (
//                                                             <span className="text-xs text-amber-600">Processing...</span>
//                                                         )}
//                                                     </div>
//                                                 ) : (
//                                                     <div className="text-gray-400">
//                                                         <FileText className="w-8 h-8 mx-auto mb-2" />
//                                                         <p className="text-sm">Upload document image</p>
//                                                     </div>
//                                                 )}
//                                                 {!isSectionLocked('id-verification') && (
//                                                     <label className="mt-3 cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#E5FFDB] text-[#063A41] rounded-lg hover:bg-[#d4f5c8] transition-colors">
//                                                         <Upload className="w-4 h-4" />
//                                                         {getPreviewUrl("idDocumentFront") ? "Change" : "Upload"}
//                                                         <input
//                                                             type="file"
//                                                             accept="image/*"
//                                                             onChange={(e) => handleFileChange(e, "idDocumentFront")}
//                                                             className="hidden"
//                                                             disabled={isUploading}
//                                                         />
//                                                     </label>
//                                                 )}
//                                             </div>
//                                         </div>

//                                         {/* Back Document - Only for governmentID */}
//                                         {formData.idVerificationType === 'governmentID' && (
//                                             <div>
//                                                 <label className="block text-sm font-medium text-[#063A41] mb-2">
//                                                     ID Back
//                                                     {(!formData.idDocumentBack || formData.idDocumentBack.startsWith('blob:')) && <span className="text-amber-600 ml-1">* Required</span>}
//                                                 </label>
//                                                 <div className={`border-2 border-dashed rounded-lg p-6 text-center ${!formData.idDocumentBack ? 'border-amber-300 bg-amber-50/30' : 'border-gray-200'}`}>
//                                                     {getPreviewUrl("idDocumentBack") ? (
//                                                         <div className="space-y-3">
//                                                             <Image
//                                                                 src={getPreviewUrl("idDocumentBack")}
//                                                                 alt="ID Back"
//                                                                 width={120}
//                                                                 height={80}
//                                                                 className="mx-auto rounded-lg object-cover"
//                                                                 unoptimized
//                                                             />
//                                                             {isUploading && uploadField === "idDocumentBack" ? (
//                                                                 <span className="text-xs text-amber-600">Uploading...</span>
//                                                             ) : !isLocalPreview("idDocumentBack") ? (
//                                                                 <span className="text-xs text-[#109C3D]">✓ Uploaded</span>
//                                                             ) : (
//                                                                 <span className="text-xs text-amber-600">Processing...</span>
//                                                             )}
//                                                         </div>
//                                                     ) : (
//                                                         <div className="text-gray-400">
//                                                             <FileText className="w-8 h-8 mx-auto mb-2" />
//                                                             <p className="text-sm">Upload back of ID</p>
//                                                         </div>
//                                                     )}
//                                                     {!isSectionLocked('id-verification') && (
//                                                         <label className="mt-3 cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#E5FFDB] text-[#063A41] rounded-lg hover:bg-[#d4f5c8] transition-colors">
//                                                             <Upload className="w-4 h-4" />
//                                                             {getPreviewUrl("idDocumentBack") ? "Change" : "Upload"}
//                                                             <input
//                                                                 type="file"
//                                                                 accept="image/*"
//                                                                 onChange={(e) => handleFileChange(e, "idDocumentBack")}
//                                                                 className="hidden"
//                                                                 disabled={isUploading}
//                                                             />
//                                                         </label>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>
//                                 )}

//                                 {/* Info message */}
//                                 {formData.idVerificationType && (
//                                     <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
//                                         <p className="text-xs text-blue-700">
//                                             <strong>Note:</strong> Ensure your ID is clearly visible and not expired.
//                                             Your document will be verified by our team within 24-48 hours.
//                                         </p>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         <button
//                             onClick={handleSaveIdVerification}
//                             disabled={
//                                 isUpdating ||
//                                 isUploading ||
//                                 isSectionLocked('id-verification') ||
//                                 !!dateErrors.issueDate ||
//                                 !!dateErrors.expiryDate
//                             }
//                             className={`w-full py-3 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${isSectionLocked('id-verification') || dateErrors.issueDate || dateErrors.expiryDate
//                                 ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                                 : 'bg-[#109C3D] text-white hover:bg-[#0d8534] disabled:opacity-50'
//                                 }`}
//                         >
//                             {isSectionLocked('id-verification') ? (
//                                 <>
//                                     <Lock className="w-4 h-4" />
//                                     Section Locked
//                                 </>
//                             ) : dateErrors.issueDate || dateErrors.expiryDate ? (
//                                 <>
//                                     <AlertCircle className="w-4 h-4" />
//                                     Fix Date Errors to Continue
//                                 </>
//                             ) : isUploading ? (
//                                 <>
//                                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                                     Uploading...
//                                 </>
//                             ) : (
//                                 <>
//                                     <Save className="w-4 h-4" />
//                                     {isUpdating ? "Saving..." : "Save & Continue →"}
//                                 </>
//                             )}
//                         </button>
//                     </div>
//                 )}

//                 {/* ==================== PAYMENT SECTION ==================== */}
//                 {activeSection === 'payment' && (
//                     <div className="space-y-4">
//                         <MissingFieldsAlert sectionId="payment" />

//                         <div className="bg-white rounded-lg border p-5">
//                             <h3 className="font-medium text-[#063A41] mb-4 flex items-center gap-2">
//                                 <CreditCard className="w-5 h-5" />
//                                 Payment Setup
//                             </h3>

//                             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
//                                 <div className="flex items-start gap-3">
//                                     <Building2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
//                                     <div>
//                                         <p className="text-sm font-medium text-blue-800">Secure Payments with Stripe</p>
//                                         <p className="text-sm text-blue-700 mt-1">
//                                             We use Stripe to securely process payments. You'll be redirected to Stripe to set up your bank account.
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>

//                             {isLoadingStripeStatus ? (
//                                 <div className="text-center py-8">
//                                     <div className="w-10 h-10 border-3 border-[#E5FFDB] border-t-[#109C3D] rounded-full animate-spin mx-auto mb-3"></div>
//                                     <p className="text-gray-500 text-sm">Checking payment status...</p>
//                                 </div>
//                             ) : isStripeConnected ? (
//                                 <div className="text-center py-6">
//                                     <div className="w-16 h-16 bg-[#E5FFDB] rounded-full flex items-center justify-center mx-auto mb-4">
//                                         <CheckCircle className="w-8 h-8 text-[#109C3D]" />
//                                     </div>
//                                     <h4 className="text-lg font-semibold text-[#063A41] mb-2">Payment Account Active!</h4>
//                                     <p className="text-gray-600 mb-6">Your payment account is fully set up.</p>
//                                     <button
//                                         onClick={handleOpenStripeDashboard}
//                                         className="inline-flex items-center gap-2 px-5 py-2 border border-[#635BFF] text-[#635BFF] rounded-lg hover:bg-[#635BFF]/5"
//                                     >
//                                         View Stripe Dashboard
//                                         <ExternalLink className="w-4 h-4" />
//                                     </button>
//                                 </div>
//                             ) : stripeNeedsOnboarding ? (
//                                 <div className="text-center py-6">
//                                     <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                                         <CreditCard className="w-8 h-8 text-gray-400" />
//                                     </div>
//                                     <h4 className="text-lg font-semibold text-[#063A41] mb-2">Set Up Your Payment Account</h4>
//                                     <p className="text-gray-600 mb-6 max-w-md mx-auto">
//                                         Connect your bank account to receive payments when you complete tasks.
//                                     </p>
//                                     <button
//                                         onClick={handleStartStripeOnboarding}
//                                         disabled={isStartingOnboarding}
//                                         className="inline-flex items-center gap-2 px-6 py-3 bg-[#635BFF] text-white font-medium rounded-lg hover:bg-[#5851ea] disabled:opacity-50"
//                                     >
//                                         {isStartingOnboarding ? (
//                                             <>
//                                                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                                                 Setting up...
//                                             </>
//                                         ) : (
//                                             <>
//                                                 Set Up with Stripe
//                                                 <ExternalLink className="w-4 h-4" />
//                                             </>
//                                         )}
//                                     </button>
//                                 </div>
//                             ) : isStripeIncomplete ? (
//                                 <div className="text-center py-6">
//                                     <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                                         <AlertCircle className="w-8 h-8 text-amber-600" />
//                                     </div>
//                                     <h4 className="text-lg font-semibold text-[#063A41] mb-2">Complete Your Payment Setup</h4>
//                                     <p className="text-gray-600 mb-6">You started but didn't finish setting up.</p>
//                                     <button
//                                         onClick={handleRefreshOnboarding}
//                                         disabled={isRefreshingOnboarding}
//                                         className="inline-flex items-center gap-2 px-6 py-3 bg-[#635BFF] text-white font-medium rounded-lg hover:bg-[#5851ea] disabled:opacity-50"
//                                     >
//                                         {isRefreshingOnboarding ? (
//                                             <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                                         ) : (
//                                             <ExternalLink className="w-4 h-4" />
//                                         )}
//                                         Continue Setup
//                                     </button>
//                                 </div>
//                             ) : isStripePayoutsPending ? (
//                                 <div className="text-center py-6">
//                                     <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                                         <RefreshCw className="w-8 h-8 text-amber-600" />
//                                     </div>
//                                     <h4 className="text-lg font-semibold text-[#063A41] mb-2">Verification In Progress</h4>
//                                     <p className="text-gray-600 mb-4">Stripe is verifying your information.</p>
//                                     <div className="flex gap-3 justify-center">
//                                         <button
//                                             onClick={handleRefreshOnboarding}
//                                             disabled={isRefreshingOnboarding}
//                                             className="inline-flex items-center gap-2 px-5 py-2 bg-[#635BFF] text-white rounded-lg hover:bg-[#5851ea] disabled:opacity-50"
//                                         >
//                                             <ExternalLink className="w-4 h-4" />
//                                             Complete on Stripe
//                                         </button>
//                                         <button
//                                             onClick={() => refetchStripeStatus()}
//                                             className="inline-flex items-center gap-2 px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
//                                         >
//                                             <RefreshCw className="w-4 h-4" />
//                                             Refresh
//                                         </button>
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <div className="text-center py-6">
//                                     <button
//                                         onClick={handleStartStripeOnboarding}
//                                         disabled={isStartingOnboarding}
//                                         className="inline-flex items-center gap-2 px-6 py-3 bg-[#635BFF] text-white font-medium rounded-lg hover:bg-[#5851ea] disabled:opacity-50"
//                                     >
//                                         Set Up Payment Account
//                                     </button>
//                                 </div>
//                             )}
//                         </div>

//                         <button
//                             onClick={handleContinueFromPayment}
//                             disabled={!isStripeConnected}
//                             className={`w-full py-3 font-medium rounded-lg flex items-center justify-center gap-2 ${isStripeConnected
//                                 ? 'bg-[#109C3D] text-white hover:bg-[#0d8534]'
//                                 : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                                 }`}
//                         >
//                             {isStripeConnected ? (
//                                 <>
//                                     <CheckCircle className="w-4 h-4" />
//                                     Continue →
//                                 </>
//                             ) : (
//                                 <>
//                                     <Lock className="w-4 h-4" />
//                                     Complete Payment Setup to Continue
//                                 </>
//                             )}
//                         </button>
//                     </div>
//                 )}

//                 {/* ==================== INSURANCE SECTION ==================== */}
//                 {activeSection === 'insurance' && (
//                     <div className="space-y-4">
//                         <MissingFieldsAlert sectionId="insurance" />

//                         <div className="bg-white rounded-lg border p-5">
//                             <h3 className="font-medium text-[#063A41] mb-4">Insurance</h3>

//                             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                                 <span className="text-sm font-medium text-[#063A41]">
//                                     I have professional insurance
//                                 </span>
//                                 <button
//                                     type="button"
//                                     role="switch"
//                                     aria-checked={formData.hasInsurance}
//                                     onClick={() => handleHasInsuranceChange(!formData.hasInsurance)}
//                                     className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${formData.hasInsurance ? 'bg-[#109C3D]' : 'bg-gray-200'}`}
//                                 >
//                                     <span
//                                         className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition ${formData.hasInsurance ? 'translate-x-5' : 'translate-x-0'}`}
//                                     />
//                                 </button>
//                             </div>

//                             {showInsuranceUpload && (
//                                 <div className="mt-4">
//                                     <label className="block text-sm font-medium text-[#063A41] mb-2">
//                                         Insurance Document
//                                         {formData.hasInsurance && (!formData.insuranceDocument || formData.insuranceDocument.startsWith('blob:')) && <span className="text-amber-600 ml-1">* Required</span>}
//                                     </label>
//                                     <div className={`border-2 border-dashed rounded-lg p-6 text-center ${formData.hasInsurance && !formData.insuranceDocument ? 'border-amber-300 bg-amber-50/30' : 'border-gray-200'}`}>
//                                         {getPreviewUrl("insuranceDocument") ? (
//                                             <div className="space-y-3">
//                                                 <Image src={getPreviewUrl("insuranceDocument")} alt="Insurance" width={120} height={80} className="mx-auto rounded-lg object-cover" unoptimized />
//                                                 {isUploading && uploadField === "insuranceDocument" ? (
//                                                     <span className="text-xs text-amber-600">Uploading...</span>
//                                                 ) : !isLocalPreview("insuranceDocument") ? (
//                                                     <span className="text-xs text-[#109C3D]">✓ Uploaded</span>
//                                                 ) : (
//                                                     <span className="text-xs text-amber-600">Processing...</span>
//                                                 )}
//                                             </div>
//                                         ) : (
//                                             <div className="text-gray-400">
//                                                 <FileText className="w-8 h-8 mx-auto mb-2" />
//                                                 <p className="text-sm">Upload insurance document</p>
//                                             </div>
//                                         )}
//                                         <label className="mt-3 cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#E5FFDB] text-[#063A41] rounded-lg hover:bg-[#d4f5c8]">
//                                             <Upload className="w-4 h-4" />
//                                             {getPreviewUrl("insuranceDocument") ? "Change" : "Upload"}
//                                             <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "insuranceDocument")} className="hidden" disabled={isUploading} />
//                                         </label>
//                                     </div>
//                                 </div>
//                             )}

//                             {!showInsuranceUpload && (
//                                 <p className="text-sm text-gray-500 mt-3">
//                                     If you don't have insurance, you can proceed to submit your application.
//                                 </p>
//                             )}
//                         </div>

//                         <button
//                             onClick={handleSaveInsurance}
//                             disabled={isUpdating || isUploading}
//                             className="w-full py-3 bg-[#109C3D] text-white font-medium rounded-lg hover:bg-[#0d8534] disabled:opacity-50 flex items-center justify-center gap-2"
//                         >
//                             <Save className="w-4 h-4" />
//                             {isUpdating ? "Saving..." : isUploading ? "Uploading..." : "Complete & Save"}
//                         </button>
//                     </div>
//                 )}

//                 {/* ==================== SUBMIT APPLICATION ==================== */}
//                 <div className="mt-8">
//                     {!allSectionsCompleted && !applicationSubmitted && userDetails?.user?.taskerStatus !== "under_review" && (
//                         <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
//                             <div className="flex items-start gap-3">
//                                 <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
//                                 <div>
//                                     <h3 className="text-lg font-semibold text-amber-800 mb-2">Complete All Sections</h3>
//                                     <p className="text-amber-700 mb-3">
//                                         {sections.length - completedSections.size} section(s) remaining.
//                                     </p>
//                                     <div className="space-y-2">
//                                         {sections.filter(s => !completedSections.has(s.id)).map(section => {
//                                             const missing = getMissingFields(section.id);
//                                             return (
//                                                 <div key={section.id} className="text-sm">
//                                                     <span className="font-medium text-amber-800">{section.label}:</span>
//                                                     <span className="text-amber-700 ml-2">
//                                                         {missing.length > 0 ? missing.join(', ') : 'Complete this section'}
//                                                     </span>
//                                                 </div>
//                                             );
//                                         })}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {canSubmitApplication && (
//                         <div className="bg-[#E5FFDB] border border-[#109C3D] rounded-lg p-6 text-center">
//                             <div className="flex items-center justify-center gap-2 mb-2">
//                                 <CheckCircle className="w-6 h-6 text-[#109C3D]" />
//                                 <h3 className="text-xl font-bold text-[#063A41]">
//                                     {userDetails?.user?.taskerStatus === "rejected" ? "Ready to Resubmit!" : "Ready to Submit!"}
//                                 </h3>
//                             </div>
//                             <p className="text-gray-600 mb-6">
//                                 {userDetails?.user?.taskerStatus === "rejected"
//                                     ? "You've updated your profile. Submit again for admin review."
//                                     : "Your profile is complete. Submit for admin review."}
//                             </p>
//                             <button
//                                 onClick={async () => {
//                                     try {
//                                         const result = await submitTaskerApplication().unwrap();
//                                         toast.success(result.message || "Application submitted successfully!");
//                                         await refetch();
//                                         router.push('/');
//                                     } catch (err: any) {
//                                         toast.error(err?.data?.message || "Failed to submit.");
//                                     }
//                                 }}
//                                 disabled={isSubmittingApplication || applicationSubmitted}
//                                 className="px-8 py-3 bg-[#063A41] text-white font-bold rounded-lg hover:bg-[#0a4a52] disabled:opacity-50"
//                             >
//                                 {isSubmittingApplication ? (
//                                     <span className="flex items-center justify-center gap-2">
//                                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                                         Submitting...
//                                     </span>
//                                 ) : userDetails?.user?.taskerStatus === "rejected"
//                                     ? "Resubmit Application"
//                                     : "Submit Application"}
//                             </button>
//                         </div>
//                     )}

//                     {(userDetails?.user?.taskerStatus === "under_review" || applicationSubmitted) && (
//                         <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
//                             <div className="flex items-center justify-center gap-3 mb-2">
//                                 <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//                                 <h3 className="text-lg font-semibold text-blue-800">Application Under Review</h3>
//                             </div>
//                             <p className="text-blue-700">Our team is reviewing your application. This typically takes 24-48 hours.</p>
//                         </div>
//                     )}

//                     {userDetails?.user?.taskerStatus === "approved" && (
//                         <div className="bg-[#E5FFDB] border border-[#109C3D] rounded-lg p-6 text-center">
//                             <div className="flex items-center justify-center gap-2 text-[#109C3D] mb-2">
//                                 <CheckCircle className="w-6 h-6" />
//                                 <h3 className="text-lg font-bold">Application Approved!</h3>
//                             </div>
//                             <p className="text-[#063A41] mb-4">Congratulations! You're now approved as a tasker.</p>
//                             <button
//                                 onClick={() => router.push('/dashboard/tasker')}
//                                 className="px-6 py-2 bg-[#109C3D] text-white rounded-lg hover:bg-[#0d8534]"
//                             >
//                                 Go to Tasker Dashboard
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UpdateDocument;


// pages/update-document/page.tsx

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
import {
    Save, Upload, CheckCircle, AlertCircle, User, Shield, FileText, X,
    Calendar, Edit3, Globe, Clock, Banknote, Lock, AlertTriangle,
    ExternalLink, CreditCard, RefreshCw, Building2, Briefcase, Check,
    Building, Hash, Eye, EyeOff
} from "lucide-react";
import { HiOutlineDocumentText } from "react-icons/hi";
import Navbar from "@/shared/Navbar";

// ==================== SERVICE CATEGORIES ====================
const SERVICE_CATEGORIES = [
    { id: 'handyman', label: 'Handyman & Home Repairs', icon: '🔧' },
    { id: 'renovation', label: 'Renovation & Moving Help', icon: '🏗️' },
    { id: 'pet', label: 'Pet Services', icon: '🐕' },
    { id: 'cleaning', label: 'Cleaning Services', icon: '🧹' },
    { id: 'peh', label: 'Plumbing, Electrical & HVAC (PEH)', icon: '⚡' },
    { id: 'automotive', label: 'Automotive Services', icon: '🚗' },
    { id: 'specialized', label: 'All Other Specialized Services', icon: '⭐' },
];

const MIN_CATEGORIES_REQUIRED = 2;

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
    const [showAccountNumber, setShowAccountNumber] = useState(false);

    // Form data structure matching new schema
    const [formData, setFormData] = useState({
        // Personal
        profilePicture: "" as string,
        firstName: "" as string,
        lastName: "" as string,
        email: "" as string,

        // Professional
        dob: "" as string,
        about: "" as string,
        yearsOfExperience: "" as string,
        categories: [] as string[],

        // ID Verification - matches nested schema
        idVerificationType: "" as string,
        idDocumentFront: "" as string,
        idDocumentBack: "" as string,
        idIssueDate: "" as string,
        idExpiryDate: "" as string,

        // Bank Account Information - NEW
        accountHolderName: "" as string,
        accountNumber: "" as string,
        routingNumber: "" as string,
        bankName: "" as string,
        accountType: "checking" as string, // checking or savings

        // Insurance - matches nested schema
        hasInsurance: false as boolean,
        insuranceDocument: "" as string,
    });

    const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({
        profilePicture: null,
        idDocumentFront: null,
        idDocumentBack: null,
        insuranceDocument: null,
    });

    const [isUploading, setIsUploading] = useState(false);
    const [uploadField, setUploadField] = useState<string | null>(null);
    const [activeSection, setActiveSection] = useState<string>('personal');
    const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
    const [sectionValidation, setSectionValidation] = useState<Record<string, boolean>>({});
    const [showInsuranceUpload, setShowInsuranceUpload] = useState(false);
    const [dateErrors, setDateErrors] = useState<{
        issueDate?: string;
        expiryDate?: string;
    }>({});
    const localUrlsRef = useRef(new Map<string, string>());

    const today = new Date().toISOString().split('T')[0];
    const sectionOrder = ['personal', 'professional', 'id-verification', 'payment', 'insurance'];

    // ==================== AUTH & USER DATA ====================
    useEffect(() => {
        const fetchUser = async () => {
            const { isLoggedIn, user } = await checkLoginStatus();
            if (isLoggedIn) {
                setUser(user);
            } else {
                router.push("/authentication");
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

    const initialDataLoadedRef = useRef(false);

    // Load data from new schema structure
    useEffect(() => {
        if (userDetails && userDetails.user && user?._id && !initialDataLoadedRef.current) {
            initialDataLoadedRef.current = true;

            const userData = userDetails.user;
            console.log('Loading initial form data from backend:', userData);

            setFormData({
                // Personal
                profilePicture: userData.profilePicture || "",
                firstName: userData.firstName || "",
                lastName: userData.lastName || "",
                email: userData.email || "",

                // Professional
                dob: userData.dob ? new Date(userData.dob).toISOString().split('T')[0] : "",
                about: userData.about || "",
                yearsOfExperience: userData.yearsOfExperience?.toString() || "",
                categories: userData.categories || [],

                // ID Verification - from nested structure
                idVerificationType: userData.idVerification?.type || "",
                idDocumentFront: userData.idVerification?.documentFront || "",
                idDocumentBack: userData.idVerification?.documentBack || "",
                idIssueDate: userData.idVerification?.issueDate
                    ? new Date(userData.idVerification.issueDate).toISOString().split('T')[0]
                    : "",
                idExpiryDate: userData.idVerification?.expiryDate
                    ? new Date(userData.idVerification.expiryDate).toISOString().split('T')[0]
                    : "",

                // Bank Account Information - NEW
                accountHolderName: userData.bankAccount?.accountHolderName || "",
                accountNumber: userData.bankAccount?.accountNumber || "",
                routingNumber: userData.bankAccount?.routingNumber || "",
                bankName: userData.bankAccount?.bankName || "",
                accountType: userData.bankAccount?.accountType || "checking",

                // Insurance - from nested structure
                hasInsurance: userData.insurance?.hasInsurance || false,
                insuranceDocument: userData.insurance?.documentUrl || "",
            });

            setShowInsuranceUpload(userData.insurance?.hasInsurance || false);
        }
    }, [userDetails, user?._id]);

    const refreshDataFromBackend = async () => {
        initialDataLoadedRef.current = false;
        await refetch();
    };

    useEffect(() => {
        setShowInsuranceUpload(formData.hasInsurance);
    }, [formData.hasInsurance]);

    // ==================== CATEGORY HANDLERS ====================
    const handleCategoryToggle = (categoryId: string) => {
        setFormData(prev => {
            const currentCategories = prev.categories || [];
            const isSelected = currentCategories.includes(categoryId);

            if (isSelected) {
                // Remove category
                return {
                    ...prev,
                    categories: currentCategories.filter(c => c !== categoryId)
                };
            } else {
                // Add category
                return {
                    ...prev,
                    categories: [...currentCategories, categoryId]
                };
            }
        });
    };

    const getCategoryValidationStatus = () => {
        const count = formData.categories?.length || 0;
        if (count === 0) return { status: 'empty', message: `Select at least ${MIN_CATEGORIES_REQUIRED} categories` };
        if (count < MIN_CATEGORIES_REQUIRED) return { status: 'incomplete', message: `Select ${MIN_CATEGORIES_REQUIRED - count} more category${MIN_CATEGORIES_REQUIRED - count > 1 ? 's' : ''}` };
        return { status: 'complete', message: `${count} categories selected` };
    };

    // ==================== DATE VALIDATION ====================
    const isCompleteDateString = (dateStr: string): boolean => {
        if (!dateStr) return false;
        const parts = dateStr.split('-');
        return parts.length === 3 && parts[0].length === 4 && parts[1].length === 2 && parts[2].length === 2;
    };

    const sanitizeDateValue = (value: string): string => {
        if (!value) return value;
        const parts = value.split('-');
        if (parts[0] && parts[0].length > 4) {
            parts[0] = parts[0].slice(0, 4);
            return parts.join('-');
        }
        return value;
    };

    const validateDates = (issueDate: string, expiryDate: string): { issueDate?: string; expiryDate?: string } => {
        const errors: { issueDate?: string; expiryDate?: string } = {};
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);

        if (issueDate) {
            const issue = new Date(issueDate);
            if (isNaN(issue.getTime())) {
                errors.issueDate = "Invalid date";
            } else if (issue > todayDate) {
                errors.issueDate = "Issue date cannot be in the future";
            } else if (issue.getFullYear() < 1900) {
                errors.issueDate = "Please enter a valid year";
            }
        }

        if (expiryDate) {
            const expiry = new Date(expiryDate);
            if (isNaN(expiry.getTime())) {
                errors.expiryDate = "Invalid date";
            } else if (expiry <= todayDate) {
                errors.expiryDate = "ID has expired. Please use a valid document";
            } else if (expiry.getFullYear() > 2099) {
                errors.expiryDate = "Please enter a valid year";
            }
        }

        if (issueDate && expiryDate && !errors.issueDate && !errors.expiryDate) {
            const issue = new Date(issueDate);
            const expiry = new Date(expiryDate);
            if (expiry <= issue) {
                errors.expiryDate = "Expiry date must be after issue date";
            }
        }

        return errors;
    };

    const handleIssueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, idIssueDate: value }));
        const errors = validateDates(value, formData.idExpiryDate);
        setDateErrors(errors);
    };

    const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, idExpiryDate: value }));
        const errors = validateDates(formData.idIssueDate, value);
        setDateErrors(errors);
    };

    const handleDateBlur = () => {
        const errors = validateDates(formData.idIssueDate, formData.idExpiryDate);
        setDateErrors(errors);
    };

    const areDatesValid = (): boolean => {
        if (!formData.idIssueDate || !formData.idExpiryDate) return false;
        if (!isCompleteDateString(formData.idIssueDate) || !isCompleteDateString(formData.idExpiryDate)) return false;
        const errors = validateDates(formData.idIssueDate, formData.idExpiryDate);
        return Object.keys(errors).length === 0;
    };

    // ==================== VALIDATION ====================
    const getMissingFields = (sectionId: string): string[] => {
        const missing: string[] = [];

        switch (sectionId) {
            case 'personal':
                if (!formData.profilePicture || formData.profilePicture.startsWith('blob:')) missing.push('Profile Picture');
                if (!formData.dob) missing.push('Date of Birth');
                if (!formData.yearsOfExperience) missing.push('Years of Experience');
                if (!formData.about) missing.push('About Me');
                break;
            case 'professional':
                if (!formData.categories || formData.categories.length < MIN_CATEGORIES_REQUIRED) {
                    missing.push(`Service Categories (min ${MIN_CATEGORIES_REQUIRED})`);
                }
                break;
            case 'id-verification':
                if (!formData.idVerificationType) missing.push('ID Type');
                if (formData.idVerificationType) {
                    if (!formData.idIssueDate) missing.push('Issue Date');
                    if (!formData.idExpiryDate) missing.push('Expiry Date');
                    if (!formData.idDocumentFront || formData.idDocumentFront.startsWith('blob:')) {
                        missing.push('ID Document (Front)');
                    }
                    if (formData.idVerificationType === 'governmentID') {
                        if (!formData.idDocumentBack || formData.idDocumentBack.startsWith('blob:')) {
                            missing.push('ID Document (Back)');
                        }
                    }
                }
                break;
            case 'payment':
                // Bank Account validation
                if (!formData.accountHolderName) missing.push('Account Holder Name');
                if (!formData.accountNumber) missing.push('Account Number');
                if (!formData.routingNumber) missing.push('Routing Number');
                if (!formData.bankName) missing.push('Bank Name');
                if (!formData.accountType) missing.push('Account Type');
                break;
            case 'insurance':
                if (formData.hasInsurance && (!formData.insuranceDocument || formData.insuranceDocument.startsWith('blob:'))) {
                    missing.push('Insurance Document');
                }
                break;
        }

        return missing;
    };

    const getNextSection = (currentSection: string): string | null => {
        const currentIndex = sectionOrder.indexOf(currentSection);
        if (currentIndex < sectionOrder.length - 1) {
            return sectionOrder[currentIndex + 1];
        }
        return null;
    };

    const navigateToNextSection = () => {
        const nextSection = getNextSection(activeSection);
        if (nextSection) {
            setActiveSection(nextSection);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            toast.info(`Moving to ${sections.find(s => s.id === nextSection)?.label} section`);
        } else {
            toast.success("🎉 All sections completed! You can now submit your application.");
        }
    };

    // Validate sections
    useEffect(() => {
        const validateSections = () => {
            const validation: Record<string, boolean> = {};
            const completed = new Set<string>();

            const personalValid = formData.profilePicture &&
                !formData.profilePicture.startsWith('blob:') &&
                formData.dob &&
                formData.yearsOfExperience &&
                formData.about;
            validation.personal = !!personalValid;
            if (personalValid) completed.add('personal');

            // Professional only checks categories
            const professionalValid = formData.categories &&
                formData.categories.length >= MIN_CATEGORIES_REQUIRED;
            validation.professional = !!professionalValid;
            if (professionalValid) completed.add('professional');

            let idVerificationValid = false;
            if (formData.idVerificationType && formData.idIssueDate && formData.idExpiryDate) {
                const hasFront = formData.idDocumentFront && !formData.idDocumentFront.startsWith('blob:');
                if (formData.idVerificationType === 'passport' || formData.idVerificationType === 'driverLicense') {
                    idVerificationValid = !!hasFront;
                } else if (formData.idVerificationType === 'governmentID') {
                    const hasBack = formData.idDocumentBack && !formData.idDocumentBack.startsWith('blob:');
                    idVerificationValid = !!(hasFront && hasBack);
                }
            }
            validation['id-verification'] = idVerificationValid;
            if (idVerificationValid) completed.add('id-verification');

            // Bank account validation
            const paymentValid = formData.accountHolderName &&
                formData.accountNumber &&
                formData.routingNumber &&
                formData.bankName &&
                formData.accountType;
            validation.payment = !!paymentValid;
            if (paymentValid) completed.add('payment');

            const insuranceValid = formData.hasInsurance ? !!(formData.insuranceDocument && !formData.insuranceDocument.startsWith('blob:')) : true;
            validation.insurance = insuranceValid;
            if (insuranceValid) completed.add('insurance');

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

    // ==================== FILE HANDLERS ====================
    const handleFileUpload = async (file: File, field: string): Promise<string | null> => {
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
            console.error('Upload error:', error);
            toast.error(`Failed to upload`);
            setIsUploading(false);
            setUploadField(null);
            return null;
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const file = e.target.files?.[0];
        if (file) {
            const localUrl = URL.createObjectURL(file);
            localUrlsRef.current.set(field, localUrl);
            setSelectedFiles(prev => ({ ...prev, [field]: file }));
            setFormData(prev => ({ ...prev, [field]: localUrl }));

            const uploadedUrl = await handleFileUpload(file, field);
            if (uploadedUrl) {
                console.log(`✅ File uploaded for ${field}:`, uploadedUrl);
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

    const getPreviewUrl = (field: string): string => {
        return formData[field as keyof typeof formData] as string || '';
    };

    const isLocalPreview = (field: string): boolean => {
        const url = getPreviewUrl(field);
        return url.startsWith('blob:');
    };

    const needsUnoptimized = (src: string): boolean => !src.startsWith('/');

    // ==================== FORM HANDLERS ====================
    const handleIdTypeChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            idVerificationType: value,
            idDocumentFront: "",
            idDocumentBack: "",
        }));
    };

    const handleHasInsuranceChange = (checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            hasInsurance: checked,
            insuranceDocument: checked ? prev.insuranceDocument : ""
        }));
        setShowInsuranceUpload(checked);

        if (!checked) {
            const localUrl = localUrlsRef.current.get('insuranceDocument');
            if (localUrl) {
                URL.revokeObjectURL(localUrl);
                localUrlsRef.current.delete('insuranceDocument');
            }
            setSelectedFiles(prev => ({ ...prev, insuranceDocument: null }));
        }
    };

    const canAccessSection = (sectionId: string) => {
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

    // ==================== SAVE HANDLERS ====================
    const handleSavePersonalInfo = async () => {
        if (!user?._id) return toast.error("User not logged in.");
        if (formData.profilePicture?.startsWith('blob:')) return toast.warn("Please wait for upload to complete.");

        const missing = getMissingFields('personal');
        if (missing.length > 0) {
            return toast.error(`Please fill in: ${missing.join(', ')}`);
        }

        const payload: any = { userId: user._id };
        if (formData.profilePicture && !formData.profilePicture.startsWith('blob:')) {
            payload.profilePicture = formData.profilePicture;
        }
        if (formData.dob) payload.dob = new Date(formData.dob);
        if (formData.about) payload.about = formData.about;
        if (formData.yearsOfExperience) payload.yearsOfExperience = parseInt(formData.yearsOfExperience, 10);

        console.log('💾 Saving personal info:', payload);

        try {
            await updateUser(payload).unwrap();
            await refetch();
            toast.success("Personal info saved!");
            navigateToNextSection();
        } catch (err: any) {
            console.error('Save error:', err);
            toast.error(`Failed: ${err.data?.error || err.message}`);
        }
    };

    const handleSaveProfessionalProfile = async () => {
        if (!user?._id) return toast.error("User not logged in.");

        const missing = getMissingFields('professional');
        if (missing.length > 0) {
            return toast.error(`Please fill in: ${missing.join(', ')}`);
        }

        const payload: any = { userId: user._id };
        if (formData.categories && formData.categories.length >= MIN_CATEGORIES_REQUIRED) {
            payload.categories = formData.categories;
        }

        console.log('💾 Saving professional profile:', payload);

        try {
            await updateUser(payload).unwrap();
            await refetch();
            toast.success("Service categories saved!");
            navigateToNextSection();
        } catch (err: any) {
            console.error('Save error:', err);
            toast.error(`Failed: ${err.data?.error || err.message}`);
        }
    };

    const handleSaveIdVerification = async () => {
        if (!user?._id) return toast.error("User not logged in.");
        if (!formData.idVerificationType) return toast.error("Please select ID type.");

        if (formData.idDocumentFront?.startsWith('blob:')) {
            return toast.warn("Please wait for front document upload to complete.");
        }
        if (formData.idVerificationType === 'governmentID' && formData.idDocumentBack?.startsWith('blob:')) {
            return toast.warn("Please wait for back document upload to complete.");
        }

        if (!formData.idIssueDate) {
            return toast.error("Please enter the issue date.");
        }
        if (!formData.idExpiryDate) {
            return toast.error("Please enter the expiry date.");
        }

        const errors = validateDates(formData.idIssueDate, formData.idExpiryDate);
        setDateErrors(errors);

        if (errors.issueDate) {
            return toast.error(errors.issueDate);
        }
        if (errors.expiryDate) {
            return toast.error(errors.expiryDate);
        }

        const missing = getMissingFields('id-verification');
        if (missing.length > 0) {
            return toast.error(`Please fill in: ${missing.join(', ')}`);
        }

        const payload: any = {
            userId: user._id,
            idVerification: {
                type: formData.idVerificationType,
                documentFront: formData.idDocumentFront,
                documentBack: formData.idVerificationType === 'governmentID' ? formData.idDocumentBack : null,
                issueDate: new Date(formData.idIssueDate),
                expiryDate: new Date(formData.idExpiryDate),
                verified: false,
            }
        };

        console.log('💾 Saving ID verification:', payload);

        try {
            const result = await updateUser(payload).unwrap();
            console.log('✅ Update result:', result);
            await refetch();
            toast.success("ID verification saved!");
            navigateToNextSection();
        } catch (err: any) {
            console.error('❌ Save error:', err);
            toast.error(`Failed: ${err.data?.error || err.data?.message || err.message || 'Unknown error'}`);
        }
    };

    // NEW: Bank Account Save Handler
    const handleSaveBankAccount = async () => {
        if (!user?._id) return toast.error("User not logged in.");

        const missing = getMissingFields('payment');
        if (missing.length > 0) {
            return toast.error(`Please fill in: ${missing.join(', ')}`);
        }

        // Basic validation
        if (formData.accountNumber.length < 4) {
            return toast.error("Please enter a valid account number");
        }
        if (formData.routingNumber.length < 9) {
            return toast.error("Please enter a valid routing number");
        }

        const payload: any = {
            userId: user._id,
            bankAccount: {
                accountHolderName: formData.accountHolderName,
                accountNumber: formData.accountNumber,
                routingNumber: formData.routingNumber,
                bankName: formData.bankName,
                accountType: formData.accountType,
                verified: false,
            }
        };

        console.log('💾 Saving bank account info:', payload);

        try {
            await updateUser(payload).unwrap();
            await refetch();
            toast.success("Bank account information saved!");
            navigateToNextSection();
        } catch (err: any) {
            console.error('Save error:', err);
            toast.error(`Failed: ${err.data?.error || err.message}`);
        }
    };

    const handleSaveInsurance = async () => {
        if (!user?._id) return toast.error("User not logged in.");
        if (formData.insuranceDocument?.startsWith('blob:')) return toast.warn("Please wait for upload to complete.");

        const missing = getMissingFields('insurance');
        if (missing.length > 0) {
            return toast.error(`Please fill in: ${missing.join(', ')}`);
        }

        const payload: any = {
            userId: user._id,
            insurance: {
                hasInsurance: formData.hasInsurance,
                documentUrl: formData.hasInsurance ? formData.insuranceDocument : null,
                verified: false,
            }
        };

        console.log('💾 Saving insurance:', payload);

        try {
            await updateUser(payload).unwrap();
            await refetch();
            toast.success("Insurance saved!");
            toast.success("🎉 All sections completed! You can now submit your application.");
        } catch (err: any) {
            console.error('Save error:', err);
            toast.error(`Failed: ${err.data?.error || err.message}`);
        }
    };

    // ==================== UI HELPERS ====================
    const sections = [
        { id: 'personal', label: 'Personal', icon: User },
        { id: 'professional', label: 'Professional', icon: Edit3 },
        { id: 'id-verification', label: 'ID Verification', icon: FileText },
        { id: 'payment', label: 'Bank Account', icon: Building2 }, // Changed from Payment
        { id: 'insurance', label: 'Insurance', icon: Shield },
    ];

    const MissingFieldsAlert = ({ sectionId }: { sectionId: string }) => {
        const missing = getMissingFields(sectionId);
        if (missing.length === 0) return null;

        return (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-amber-800">Missing Required Fields</p>
                        <p className="text-sm text-amber-700 mt-1">
                            Please complete: <span className="font-medium">{missing.join(', ')}</span>
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    const isProfileVerified = userDetails?.user?.taskerStatus === "approved";
    const lockedSectionsWhenVerified = ['personal', 'professional', 'id-verification'];
    const isSectionLocked = (sectionId: string): boolean => {
        return isProfileVerified && lockedSectionsWhenVerified.includes(sectionId);
    };

    const LockedSectionAlert = ({ sectionId }: { sectionId: string }) => {
        if (!isSectionLocked(sectionId)) return null;

        return (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-blue-800">Section Locked</p>
                        <p className="text-sm text-blue-700 mt-1">
                            This section cannot be edited after profile verification.
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    // ==================== LOADING STATE ====================
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
        (userDetails?.user?.taskerStatus === "not_applied" || userDetails?.user?.taskerStatus === "rejected") &&
        !applicationSubmitted;

    // ==================== RENDER ====================
    return (
        <div className="min-h-screen bg-[#E5FFDB]/10">
            <Navbar />

            {/* Header - same as before */}
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
                            const hasMissing = getMissingFields(section.id).length > 0;

                            return (
                                <button
                                    key={section.id}
                                    onClick={() => handleSectionChange(section.id)}
                                    disabled={!canAccess}
                                    className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${isActive
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
                                    {canAccess && hasMissing && !isCompleted && (
                                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full"></span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 py-6">

                {/* Personal, Professional, ID Verification sections remain the same */}
                {/* ... (keep all existing sections until payment) ... */}


                {activeSection === 'personal' && (
                    <div className="space-y-4">
                        <LockedSectionAlert sectionId="personal" />
                        <MissingFieldsAlert sectionId="personal" />

                        <div className={`bg-white rounded-lg border p-5 ${isSectionLocked('personal') ? 'opacity-75' : ''}`}>
                            <h3 className="font-medium text-[#063A41] mb-4 flex items-center gap-2">
                                Personal Information
                                {isSectionLocked('personal') && <Lock className="w-4 h-4 text-blue-500" />}
                            </h3>

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
                                    {!isSectionLocked('personal') && (
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
                                    )}
                                    {getPreviewUrl("profilePicture") && !isLocalPreview("profilePicture") && (
                                        <span className="ml-2 text-xs text-[#109C3D]">✓ Uploaded</span>
                                    )}
                                    {isLocalPreview("profilePicture") && (
                                        <span className="ml-2 text-xs text-amber-600">Uploading...</span>
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

                                <div className="pt-4 border-t">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#063A41] mb-1">
                                                Date of Birth
                                                {!formData.dob && <span className="text-amber-600 ml-1">* Required</span>}
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.dob}
                                                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                                max={today}
                                                disabled={isSectionLocked('personal')}
                                                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent ${isSectionLocked('personal') ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : !formData.dob ? 'border-amber-300 bg-amber-50/30' : 'border-gray-200'}`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#063A41] mb-1">
                                                Years of Experience
                                                {!formData.yearsOfExperience && <span className="text-amber-600 ml-1">* Required</span>}
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                placeholder="e.g., 5"
                                                value={formData.yearsOfExperience}
                                                onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                                                disabled={isSectionLocked('personal')}
                                                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent ${isSectionLocked('personal') ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : !formData.yearsOfExperience ? 'border-amber-300 bg-amber-50/30' : 'border-gray-200'}`}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-[#063A41] mb-1">
                                            About Me
                                            {!formData.about && <span className="text-amber-600 ml-1">* Required</span>}
                                        </label>
                                        <textarea
                                            rows={4}
                                            placeholder="Tell us about yourself and your professional background..."
                                            value={formData.about}
                                            onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                                            disabled={isSectionLocked('personal')}
                                            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent resize-none ${isSectionLocked('personal') ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : !formData.about ? 'border-amber-300 bg-amber-50/30' : 'border-gray-200'}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSavePersonalInfo}
                            disabled={isUpdating || isUploading || isSectionLocked('personal')}
                            className={`w-full py-3 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${isSectionLocked('personal') ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#109C3D] text-white hover:bg-[#0d8534] disabled:opacity-50'}`}
                        >
                            {isSectionLocked('personal') ? (
                                <>
                                    <Lock className="w-4 h-4" />
                                    Section Locked
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    {isUpdating ? "Saving..." : "Save & Continue →"}
                                </>
                            )}
                        </button>
                    </div>
                )}
                {activeSection === 'professional' && (
                    <div className="space-y-4">
                        <LockedSectionAlert sectionId="professional" />
                        <MissingFieldsAlert sectionId="professional" />

                        <div className={`bg-white rounded-lg border p-5 ${isSectionLocked('professional') ? 'opacity-75' : ''}`}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-medium text-[#063A41] flex items-center gap-2">
                                    <Briefcase className="w-5 h-5" />
                                    Service Categories
                                    {isSectionLocked('professional') && <Lock className="w-4 h-4 text-blue-500" />}
                                </h3>
                                <div className="flex items-center gap-2">
                                    {(() => {
                                        const validation = getCategoryValidationStatus();
                                        return (
                                            <span
                                                className={`text-sm flex items-center gap-1 ${validation.status === 'complete'
                                                    ? 'text-[#109C3D]'
                                                    : 'text-amber-600'
                                                    }`}
                                            >
                                                {validation.status === 'complete' ? (
                                                    <CheckCircle className="w-4 h-4" />
                                                ) : (
                                                    <AlertCircle className="w-4 h-4" />
                                                )}
                                                {validation.message}
                                            </span>
                                        );
                                    })()}
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 mb-4">
                                Select the service categories you can provide. You must select at least {MIN_CATEGORIES_REQUIRED} categories.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-3">
                                {SERVICE_CATEGORIES.map((category) => {
                                    const isSelected = formData.categories?.includes(category.id);
                                    return (
                                        <button
                                            key={category.id}
                                            type="button"
                                            onClick={() =>
                                                !isSectionLocked('professional') &&
                                                handleCategoryToggle(category.id)
                                            }
                                            disabled={isSectionLocked('professional')}
                                            className={`relative flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${isSectionLocked('professional')
                                                ? 'bg-gray-50 border-gray-200 cursor-not-allowed'
                                                : isSelected
                                                    ? 'bg-[#E5FFDB] border-[#109C3D] shadow-sm'
                                                    : 'bg-white border-gray-200 hover:border-[#109C3D]/50 hover:bg-[#E5FFDB]/20'
                                                }`}
                                        >
                                            <div
                                                className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${isSelected
                                                    ? 'bg-[#109C3D] border-[#109C3D]'
                                                    : 'border-gray-300 bg-white'
                                                    }`}
                                            >
                                                {isSelected && (
                                                    <Check className="w-4 h-4 text-white" />
                                                )}
                                            </div>

                                            <span className="text-2xl flex-shrink-0">
                                                {category.icon}
                                            </span>

                                            <span
                                                className={`text-sm font-medium ${isSelected
                                                    ? 'text-[#063A41]'
                                                    : 'text-gray-700'
                                                    }`}
                                            >
                                                {category.label}
                                            </span>

                                            {isSelected && (
                                                <span className="absolute top-2 right-2">
                                                    <CheckCircle className="w-4 h-4 text-[#109C3D]" />
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {formData.categories && formData.categories.length > 0 && (
                                <div className="mt-4 pt-4 border-t">
                                    <p className="text-sm text-gray-600 mb-2">
                                        Selected categories:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.categories.map((catId) => {
                                            const category = SERVICE_CATEGORIES.find(
                                                (c) => c.id === catId
                                            );
                                            if (!category) return null;
                                            return (
                                                <span
                                                    key={catId}
                                                    className="inline-flex items-center gap-1 px-3 py-1 bg-[#E5FFDB] text-[#063A41] text-sm rounded-full"
                                                >
                                                    <span>{category.icon}</span>
                                                    <span>{category.label}</span>
                                                    {!isSectionLocked('professional') && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleCategoryToggle(catId)
                                                            }
                                                            className="ml-1 hover:text-red-500 transition-colors"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    )}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {formData.categories &&
                                formData.categories.length > 0 &&
                                formData.categories.length < MIN_CATEGORIES_REQUIRED && (
                                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                        <p className="text-sm text-amber-700 flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                            Please select{' '}
                                            {MIN_CATEGORIES_REQUIRED -
                                                formData.categories.length}{' '}
                                            more category
                                            {MIN_CATEGORIES_REQUIRED -
                                                formData.categories.length >
                                                1
                                                ? 's'
                                                : ''}{' '}
                                            to continue.
                                        </p>
                                    </div>
                                )}
                        </div>

                        <button
                            onClick={handleSaveProfessionalProfile}
                            disabled={
                                isUpdating ||
                                isSectionLocked('professional') ||
                                (formData.categories?.length || 0) <
                                MIN_CATEGORIES_REQUIRED
                            }
                            className={`w-full py-3 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${isSectionLocked('professional')
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : (formData.categories?.length || 0) <
                                    MIN_CATEGORIES_REQUIRED
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-[#109C3D] text-white hover:bg-[#0d8534] disabled:opacity-50'
                                }`}
                        >
                            {isSectionLocked('professional') ? (
                                <>
                                    <Lock className="w-4 h-4" />
                                    Section Locked
                                </>
                            ) : (formData.categories?.length || 0) <
                                MIN_CATEGORIES_REQUIRED ? (
                                <>
                                    <AlertCircle className="w-4 h-4" />
                                    Select at least {MIN_CATEGORIES_REQUIRED} categories to continue
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    {isUpdating ? "Saving..." : "Save & Continue →"}
                                </>
                            )}
                        </button>
                    </div>
                )}

                {activeSection === 'id-verification' && (
                    <div className="space-y-4">
                        <LockedSectionAlert sectionId="id-verification" />
                        <MissingFieldsAlert sectionId="id-verification" />

                        <div className={`bg-white rounded-lg border p-5 ${isSectionLocked('id-verification') ? 'opacity-75' : ''}`}>
                            <h3 className="font-medium text-[#063A41] mb-4 flex items-center gap-2">
                                ID Verification
                                {isSectionLocked('id-verification') && <Lock className="w-4 h-4 text-blue-500" />}
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#063A41] mb-1">
                                        ID Type
                                        {!formData.idVerificationType && <span className="text-amber-600 ml-1">* Required</span>}
                                    </label>
                                    <select
                                        value={formData.idVerificationType}
                                        onChange={(e) => handleIdTypeChange(e.target.value)}
                                        disabled={isSectionLocked('id-verification')}
                                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent ${isSectionLocked('id-verification')
                                                ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
                                                : !formData.idVerificationType
                                                    ? 'border-amber-300 bg-amber-50/30'
                                                    : 'border-gray-200'
                                            }`}
                                    >
                                        <option value="">Select ID type</option>
                                        <option value="passport">Passport</option>
                                        <option value="governmentID">Government ID (Front & Back)</option>
                                        <option value="driverLicense">Driver's License</option>
                                    </select>
                                </div>

                                {formData.idVerificationType && (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#063A41] mb-1">
                                                <Calendar className="w-4 h-4 inline mr-1" />
                                                Issue Date
                                                {!formData.idIssueDate && <span className="text-amber-600 ml-1">* Required</span>}
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.idIssueDate}
                                                onChange={handleIssueDateChange}
                                                onBlur={handleDateBlur}
                                                min="1900-01-01"
                                                max={today}
                                                disabled={isSectionLocked('id-verification')}
                                                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent ${isSectionLocked('id-verification')
                                                        ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
                                                        : dateErrors.issueDate
                                                            ? 'border-red-400 bg-red-50/30'
                                                            : formData.idIssueDate && !dateErrors.issueDate
                                                                ? 'border-green-400 bg-green-50/30'
                                                                : !formData.idIssueDate
                                                                    ? 'border-amber-300 bg-amber-50/30'
                                                                    : 'border-gray-200'
                                                    }`}
                                            />
                                            {dateErrors.issueDate ? (
                                                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" />
                                                    {dateErrors.issueDate}
                                                </p>
                                            ) : formData.idIssueDate && !dateErrors.issueDate ? (
                                                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Valid issue date
                                                </p>
                                            ) : (
                                                <p className="text-xs text-gray-500 mt-1">When was your ID issued?</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[#063A41] mb-1">
                                                <Calendar className="w-4 h-4 inline mr-1" />
                                                Expiry Date
                                                {!formData.idExpiryDate && <span className="text-amber-600 ml-1">* Required</span>}
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.idExpiryDate}
                                                onChange={handleExpiryDateChange}
                                                onBlur={handleDateBlur}
                                                min={formData.idIssueDate ? formData.idIssueDate : today}
                                                max="2099-12-31"
                                                disabled={isSectionLocked('id-verification')}
                                                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent ${isSectionLocked('id-verification')
                                                        ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
                                                        : dateErrors.expiryDate
                                                            ? 'border-red-400 bg-red-50/30'
                                                            : formData.idExpiryDate && !dateErrors.expiryDate
                                                                ? 'border-green-400 bg-green-50/30'
                                                                : !formData.idExpiryDate
                                                                    ? 'border-amber-300 bg-amber-50/30'
                                                                    : 'border-gray-200'
                                                    }`}
                                            />
                                            {dateErrors.expiryDate ? (
                                                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" />
                                                    {dateErrors.expiryDate}
                                                </p>
                                            ) : formData.idExpiryDate && !dateErrors.expiryDate ? (
                                                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Valid expiry date
                                                </p>
                                            ) : (
                                                <p className="text-xs text-gray-500 mt-1">Must be a valid, non-expired document</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {formData.idVerificationType && (
                                    <div className={`grid ${formData.idVerificationType === 'governmentID'
                                            ? 'md:grid-cols-2'
                                            : 'md:grid-cols-1'
                                        } gap-4`}>
                                        <div>
                                            <label className="block text-sm font-medium text-[#063A41] mb-2">
                                                {formData.idVerificationType === 'passport'
                                                    ? 'Passport Photo Page'
                                                    : formData.idVerificationType === 'driverLicense'
                                                        ? "Driver's License (Front)"
                                                        : 'ID Front'}
                                                {(!formData.idDocumentFront ||
                                                    formData.idDocumentFront.startsWith('blob:')) && (
                                                        <span className="text-amber-600 ml-1">* Required</span>
                                                    )}
                                            </label>

                                            <div className={`border-2 border-dashed rounded-lg p-6 text-center ${!formData.idDocumentFront
                                                    ? 'border-amber-300 bg-amber-50/30'
                                                    : 'border-gray-200'
                                                }`}>
                                                {getPreviewUrl("idDocumentFront") ? (
                                                    <div className="space-y-3">
                                                        <Image
                                                            src={getPreviewUrl("idDocumentFront")}
                                                            alt="ID Front"
                                                            width={120}
                                                            height={80}
                                                            className="mx-auto rounded-lg object-cover"
                                                            unoptimized
                                                        />

                                                        {isUploading && uploadField === "idDocumentFront" ? (
                                                            <span className="text-xs text-amber-600">Uploading...</span>
                                                        ) : !isLocalPreview("idDocumentFront") ? (
                                                            <span className="text-xs text-[#109C3D]">✓ Uploaded</span>
                                                        ) : (
                                                            <span className="text-xs text-amber-600">Processing...</span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="text-gray-400">
                                                        <FileText className="w-8 h-8 mx-auto mb-2" />
                                                        <p className="text-sm">Upload document image</p>
                                                    </div>
                                                )}

                                                {!isSectionLocked('id-verification') && (
                                                    <label className="mt-3 cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#E5FFDB] text-[#063A41] rounded-lg hover:bg-[#d4f5c8] transition-colors">
                                                        <Upload className="w-4 h-4" />
                                                        {getPreviewUrl("idDocumentFront") ? "Change" : "Upload"}
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleFileChange(e, "idDocumentFront")}
                                                            className="hidden"
                                                            disabled={isUploading}
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                        </div>

                                        {formData.idVerificationType === 'governmentID' && (
                                            <div>
                                                <label className="block text-sm font-medium text-[#063A41] mb-2">
                                                    ID Back
                                                    {(!formData.idDocumentBack ||
                                                        formData.idDocumentBack.startsWith('blob:')) && (
                                                            <span className="text-amber-600 ml-1">* Required</span>
                                                        )}
                                                </label>

                                                <div className={`border-2 border-dashed rounded-lg p-6 text-center ${!formData.idDocumentBack
                                                        ? 'border-amber-300 bg-amber-50/30'
                                                        : 'border-gray-200'
                                                    }`}>
                                                    {getPreviewUrl("idDocumentBack") ? (
                                                        <div className="space-y-3">
                                                            <Image
                                                                src={getPreviewUrl("idDocumentBack")}
                                                                alt="ID Back"
                                                                width={120}
                                                                height={80}
                                                                className="mx-auto rounded-lg object-cover"
                                                                unoptimized
                                                            />

                                                            {isUploading && uploadField === "idDocumentBack" ? (
                                                                <span className="text-xs text-amber-600">Uploading...</span>
                                                            ) : !isLocalPreview("idDocumentBack") ? (
                                                                <span className="text-xs text-[#109C3D]">✓ Uploaded</span>
                                                            ) : (
                                                                <span className="text-xs text-amber-600">Processing...</span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="text-gray-400">
                                                            <FileText className="w-8 h-8 mx-auto mb-2" />
                                                            <p className="text-sm">Upload back of ID</p>
                                                        </div>
                                                    )}

                                                    {!isSectionLocked('id-verification') && (
                                                        <label className="mt-3 cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#E5FFDB] text-[#063A41] rounded-lg hover:bg-[#d4f5c8] transition-colors">
                                                            <Upload className="w-4 h-4" />
                                                            {getPreviewUrl("idDocumentBack") ? "Change" : "Upload"}
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => handleFileChange(e, "idDocumentBack")}
                                                                className="hidden"
                                                                disabled={isUploading}
                                                            />
                                                        </label>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {formData.idVerificationType && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                                        <p className="text-xs text-blue-700">
                                            <strong>Note:</strong> Ensure your ID is clearly visible and not expired.
                                            Your document will be verified by our team within 24-48 hours.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleSaveIdVerification}
                            disabled={
                                isUpdating ||
                                isUploading ||
                                isSectionLocked('id-verification') ||
                                !!dateErrors.issueDate ||
                                !!dateErrors.expiryDate
                            }
                            className={`w-full py-3 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${isSectionLocked('id-verification') ||
                                    dateErrors.issueDate ||
                                    dateErrors.expiryDate
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-[#109C3D] text-white hover:bg-[#0d8534] disabled:opacity-50'
                                }`}
                        >
                            {isSectionLocked('id-verification') ? (
                                <>
                                    <Lock className="w-4 h-4" />
                                    Section Locked
                                </>
                            ) : dateErrors.issueDate || dateErrors.expiryDate ? (
                                <>
                                    <AlertCircle className="w-4 h-4" />
                                    Fix Date Errors to Continue
                                </>
                            ) : isUploading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    {isUpdating ? "Saving..." : "Save & Continue →"}
                                </>
                            )}
                        </button>
                    </div>
                )}
                {/* ==================== PAYMENT SECTION - NEW BANK ACCOUNT ==================== */}
                {activeSection === 'payment' && (
                    <div className="space-y-4">
                        <MissingFieldsAlert sectionId="payment" />

                        <div className="bg-white rounded-lg border p-5">
                            <h3 className="font-medium text-[#063A41] mb-4 flex items-center gap-2">
                                <Building2 className="w-5 h-5" />
                                Bank Account Information
                            </h3>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <div className="flex items-start gap-3">
                                    <Building className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-blue-800">Secure Payment Information</p>
                                        <p className="text-sm text-blue-700 mt-1">
                                            Your bank account information will be used to receive payments for completed tasks.
                                            This information is encrypted and stored securely.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Account Holder Name */}
                                <div>
                                    <label className="block text-sm font-medium text-[#063A41] mb-1">
                                        Account Holder Name
                                        {!formData.accountHolderName && <span className="text-amber-600 ml-1">* Required</span>}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter full name as it appears on bank account"
                                        value={formData.accountHolderName}
                                        onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent ${!formData.accountHolderName ? 'border-amber-300 bg-amber-50/30' : 'border-gray-200'
                                            }`}
                                    />
                                </div>

                                {/* Bank Name */}
                                <div>
                                    <label className="block text-sm font-medium text-[#063A41] mb-1">
                                        Bank Name
                                        {!formData.bankName && <span className="text-amber-600 ml-1">* Required</span>}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., TD Bank, RBC, Bank of America"
                                        value={formData.bankName}
                                        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent ${!formData.bankName ? 'border-amber-300 bg-amber-50/30' : 'border-gray-200'
                                            }`}
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    {/* Account Number */}
                                    <div>
                                        <label className="block text-sm font-medium text-[#063A41] mb-1">
                                            Account Number
                                            {!formData.accountNumber && <span className="text-amber-600 ml-1">* Required</span>}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showAccountNumber ? "text" : "password"}
                                                placeholder="Enter account number"
                                                value={formData.accountNumber}
                                                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value.replace(/\D/g, '') })}
                                                className={`w-full p-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent ${!formData.accountNumber ? 'border-amber-300 bg-amber-50/30' : 'border-gray-200'
                                                    }`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowAccountNumber(!showAccountNumber)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            >
                                                {showAccountNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Routing Number */}
                                    <div>
                                        <label className="block text-sm font-medium text-[#063A41] mb-1">
                                            Routing Number
                                            {!formData.routingNumber && <span className="text-amber-600 ml-1">* Required</span>}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="9-digit routing number"
                                                maxLength={9}
                                                value={formData.routingNumber}
                                                onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value.replace(/\D/g, '') })}
                                                className={`w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent ${!formData.routingNumber ? 'border-amber-300 bg-amber-50/30' : 'border-gray-200'
                                                    }`}
                                            />
                                            <Hash className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        </div>
                                        {formData.routingNumber && formData.routingNumber.length !== 9 && (
                                            <p className="text-xs text-amber-600 mt-1">Routing number must be 9 digits</p>
                                        )}
                                    </div>
                                </div>

                                {/* Account Type */}
                                <div>
                                    <label className="block text-sm font-medium text-[#063A41] mb-1">
                                        Account Type
                                        {!formData.accountType && <span className="text-amber-600 ml-1">* Required</span>}
                                    </label>
                                    <select
                                        value={formData.accountType}
                                        onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#109C3D] focus:border-transparent ${!formData.accountType ? 'border-amber-300 bg-amber-50/30' : 'border-gray-200'
                                            }`}
                                    >
                                        <option value="checking">Checking Account</option>
                                        <option value="savings">Savings Account</option>
                                    </select>
                                </div>

                                {/* Security Notice */}
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-4">
                                    <div className="flex items-start gap-2">
                                        <Lock className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-medium text-gray-700">Your information is secure</p>
                                            <p className="text-xs text-gray-600 mt-1">
                                                Bank details are encrypted and will only be used for transferring your earnings.
                                                We never store or display your full account number.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSaveBankAccount}
                            disabled={isUpdating ||
                                !formData.accountHolderName ||
                                !formData.accountNumber ||
                                !formData.routingNumber ||
                                !formData.bankName ||
                                formData.routingNumber.length !== 9}
                            className={`w-full py-3 font-medium rounded-lg flex items-center justify-center gap-2 ${formData.accountHolderName && formData.accountNumber && formData.routingNumber && formData.bankName && formData.routingNumber.length === 9
                                ? 'bg-[#109C3D] text-white hover:bg-[#0d8534]'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            {isUpdating ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save & Continue →
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* Insurance section and submit application sections remain the same */}
                {/* ... (keep all remaining sections) ... */}

                {/* ==================== INSURANCE SECTION ==================== */}
                {
                    activeSection === 'insurance' && (
                        <div className="space-y-4">
                            <MissingFieldsAlert sectionId="insurance" />

                            <div className="bg-white rounded-lg border p-5">
                                <h3 className="font-medium text-[#063A41] mb-4">Insurance</h3>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <span className="text-sm font-medium text-[#063A41]">
                                        I have professional insurance
                                    </span>
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={formData.hasInsurance}
                                        onClick={() => handleHasInsuranceChange(!formData.hasInsurance)}
                                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${formData.hasInsurance ? 'bg-[#109C3D]' : 'bg-gray-200'}`}
                                    >
                                        <span
                                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition ${formData.hasInsurance ? 'translate-x-5' : 'translate-x-0'}`}
                                        />
                                    </button>
                                </div>

                                {showInsuranceUpload && (
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-[#063A41] mb-2">
                                            Insurance Document
                                            {formData.hasInsurance && (!formData.insuranceDocument || formData.insuranceDocument.startsWith('blob:')) && <span className="text-amber-600 ml-1">* Required</span>}
                                        </label>
                                        <div className={`border-2 border-dashed rounded-lg p-6 text-center ${formData.hasInsurance && !formData.insuranceDocument ? 'border-amber-300 bg-amber-50/30' : 'border-gray-200'}`}>
                                            {getPreviewUrl("insuranceDocument") ? (
                                                <div className="space-y-3">
                                                    <Image src={getPreviewUrl("insuranceDocument")} alt="Insurance" width={120} height={80} className="mx-auto rounded-lg object-cover" unoptimized />
                                                    {isUploading && uploadField === "insuranceDocument" ? (
                                                        <span className="text-xs text-amber-600">Uploading...</span>
                                                    ) : !isLocalPreview("insuranceDocument") ? (
                                                        <span className="text-xs text-[#109C3D]">✓ Uploaded</span>
                                                    ) : (
                                                        <span className="text-xs text-amber-600">Processing...</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-gray-400">
                                                    <FileText className="w-8 h-8 mx-auto mb-2" />
                                                    <p className="text-sm">Upload insurance document</p>
                                                </div>
                                            )}
                                            <label className="mt-3 cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#E5FFDB] text-[#063A41] rounded-lg hover:bg-[#d4f5c8]">
                                                <Upload className="w-4 h-4" />
                                                {getPreviewUrl("insuranceDocument") ? "Change" : "Upload"}
                                                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "insuranceDocument")} className="hidden" disabled={isUploading} />
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {!showInsuranceUpload && (
                                    <p className="text-sm text-gray-500 mt-3">
                                        If you don't have insurance, you can proceed to submit your application.
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={handleSaveInsurance}
                                disabled={isUpdating || isUploading}
                                className="w-full py-3 bg-[#109C3D] text-white font-medium rounded-lg hover:bg-[#0d8534] disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                {isUpdating ? "Saving..." : isUploading ? "Uploading..." : "Complete & Save"}
                            </button>
                        </div>
                    )
                }

                {/* ==================== SUBMIT APPLICATION ==================== */}
                <div className="mt-8">
                    {!allSectionsCompleted && !applicationSubmitted && userDetails?.user?.taskerStatus !== "under_review" && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                                <div>
                                    <h3 className="text-lg font-semibold text-amber-800 mb-2">Complete All Sections</h3>
                                    <p className="text-amber-700 mb-3">
                                        {sections.length - completedSections.size} section(s) remaining.
                                    </p>
                                    <div className="space-y-2">
                                        {sections.filter(s => !completedSections.has(s.id)).map(section => {
                                            const missing = getMissingFields(section.id);
                                            return (
                                                <div key={section.id} className="text-sm">
                                                    <span className="font-medium text-amber-800">{section.label}:</span>
                                                    <span className="text-amber-700 ml-2">
                                                        {missing.length > 0 ? missing.join(', ') : 'Complete this section'}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {canSubmitApplication && (
                        <div className="bg-[#E5FFDB] border border-[#109C3D] rounded-lg p-6 text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <CheckCircle className="w-6 h-6 text-[#109C3D]" />
                                <h3 className="text-xl font-bold text-[#063A41]">
                                    {userDetails?.user?.taskerStatus === "rejected" ? "Ready to Resubmit!" : "Ready to Submit!"}
                                </h3>
                            </div>
                            <p className="text-gray-600 mb-6">
                                {userDetails?.user?.taskerStatus === "rejected"
                                    ? "You've updated your profile. Submit again for admin review."
                                    : "Your profile is complete. Submit for admin review."}
                            </p>
                            <button
                                onClick={async () => {
                                    try {
                                        const result = await submitTaskerApplication().unwrap();
                                        toast.success(result.message || "Application submitted successfully!");
                                        await refetch();
                                        router.push('/');
                                    } catch (err: any) {
                                        toast.error(err?.data?.message || "Failed to submit.");
                                    }
                                }}
                                disabled={isSubmittingApplication || applicationSubmitted}
                                className="px-8 py-3 bg-[#063A41] text-white font-bold rounded-lg hover:bg-[#0a4a52] disabled:opacity-50"
                            >
                                {isSubmittingApplication ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Submitting...
                                    </span>
                                ) : userDetails?.user?.taskerStatus === "rejected"
                                    ? "Resubmit Application"
                                    : "Submit Application"}
                            </button>
                        </div>
                    )}

                    {(userDetails?.user?.taskerStatus === "under_review" || applicationSubmitted) && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                            <div className="flex items-center justify-center gap-3 mb-2">
                                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                <h3 className="text-lg font-semibold text-blue-800">Application Under Review</h3>
                            </div>
                            <p className="text-blue-700">Our team is reviewing your application. This typically takes 24-48 hours.</p>
                        </div>
                    )}

                    {userDetails?.user?.taskerStatus === "approved" && (
                        <div className="bg-[#E5FFDB] border border-[#109C3D] rounded-lg p-6 text-center">
                            <div className="flex items-center justify-center gap-2 text-[#109C3D] mb-2">
                                <CheckCircle className="w-6 h-6" />
                                <h3 className="text-lg font-bold">Application Approved!</h3>
                            </div>
                            <p className="text-[#063A41] mb-4">Congratulations! You're now approved as a tasker.</p>
                            <button
                                onClick={() => router.push('/dashboard/tasker')}
                                className="px-6 py-2 bg-[#109C3D] text-white rounded-lg hover:bg-[#0d8534]"
                            >
                                Go to Tasker Dashboard
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default UpdateDocument;








