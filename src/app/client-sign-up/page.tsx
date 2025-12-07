// /* eslint-disable react/no-unescaped-entities */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// import React, { useState, useMemo } from "react";
// import { FaUserPlus, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock, FaCheckCircle, FaCheck, FaTimes } from "react-icons/fa";
// import Link from "next/link";
// import Navbar from "@/shared/Navbar";
// import { useSignupMutation } from "@/features/auth/authApi";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useRouter } from "next/navigation";
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

// const SignupPage = () => {
//     const [agreed, setAgreed] = useState(false);
//     const [signup, { isLoading }] = useSignupMutation();
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [userRole, setUserRole] = useState(null);
//     const selectedRole = "client" as const;
//     const router = useRouter();
//     const [showPassword, setShowPassword] = useState(false);
//     const [passwordFocused, setPasswordFocused] = useState(false);
//     const [phoneFocused, setPhoneFocused] = useState(false);
//     const [postalCodeFocused, setPostalCodeFocused] = useState(false);

//     const togglePasswordVisibility = () => {
//         setShowPassword(!showPassword);
//     };

//     const [formData, setFormData] = useState({
//         firstName: "",
//         lastName: "",
//         email: "",
//         phone: "",
//         postalCode: "",
//         password: "",
//     });

//     // Password validation rules
//     const passwordValidation = useMemo(() => {
//         const password = formData.password;
//         return {
//             minLength: password.length >= 8,
//             hasUppercase: /[A-Z]/.test(password),
//             hasLowercase: /[a-z]/.test(password),
//             hasNumber: /[0-9]/.test(password),
//             hasSpecial: /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\';/`~]/.test(password),
//         };
//     }, [formData.password]);

//     const isPasswordStrong = Object.values(passwordValidation).every(Boolean);

//     // Canadian Postal Code validation
//     // Format: A1A 1A1 (Letter-Number-Letter Space Number-Letter-Number)
//     // First letter cannot be D, F, I, O, Q, U, W, Z
//     const postalCodeValidation = useMemo(() => {
//         const postalCode = formData.postalCode.replace(/\s/g, '').toUpperCase();
//         const validFirstLetters = /^[ABCEGHJKLMNPRSTVXY]/;
//         const validFormat = /^[ABCEGHJKLMNPRSTVXY][0-9][ABCEGHJKLMNPRSTVWXYZ][0-9][ABCEGHJKLMNPRSTVWXYZ][0-9]$/;

//         return {
//             hasValidLength: postalCode.length === 6,
//             hasValidFormat: validFormat.test(postalCode),
//             hasValidFirstLetter: postalCode.length > 0 ? validFirstLetters.test(postalCode) : true,
//         };
//     }, [formData.postalCode]);

//     const isPostalCodeValid = postalCodeValidation.hasValidLength && postalCodeValidation.hasValidFormat;

//     const getPasswordStrength = () => {
//         const validCount = Object.values(passwordValidation).filter(Boolean).length;
//         if (validCount === 0) return { label: '', color: '', width: '0%', bgColor: '#e5e7eb' };
//         if (validCount <= 2) return { label: 'Weak', color: '#ef4444', width: '25%', bgColor: '#fecaca' };
//         if (validCount <= 3) return { label: 'Fair', color: '#f59e0b', width: '50%', bgColor: '#fde68a' };
//         if (validCount <= 4) return { label: 'Good', color: '#3b82f6', width: '75%', bgColor: '#bfdbfe' };
//         return { label: 'Strong', color: '#109C3D', width: '100%', bgColor: '#bbf7d0' };
//     };

//     const passwordStrength = getPasswordStrength();

//     // Format phone number for display
//     const formatPhoneNumber = (value: string) => {
//         const phoneNumber = value.replace(/\D/g, '');

//         if (phoneNumber.length <= 3) {
//             return phoneNumber;
//         } else if (phoneNumber.length <= 6) {
//             return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
//         } else {
//             return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
//         }
//     };

//     // Format Canadian Postal Code (A1A 1A1)
//     const formatPostalCode = (value: string) => {
//         // Remove all non-alphanumeric characters and convert to uppercase
//         const cleaned = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

//         // Limit to 6 characters
//         const limited = cleaned.slice(0, 6);

//         // Apply Canadian postal code pattern: Letter-Number-Letter Number-Letter-Number
//         let formatted = '';
//         for (let i = 0; i < limited.length; i++) {
//             const char = limited[i];
//             const isEvenPosition = i % 2 === 0; // Positions 0, 2, 4 should be letters

//             if (isEvenPosition) {
//                 // Should be a letter
//                 if (/[A-Z]/.test(char)) {
//                     formatted += char;
//                 }
//             } else {
//                 // Should be a number
//                 if (/[0-9]/.test(char)) {
//                     formatted += char;
//                 }
//             }
//         }

//         // Add space after first 3 characters
//         if (formatted.length > 3) {
//             return `${formatted.slice(0, 3)} ${formatted.slice(3)}`;
//         }

//         return formatted;
//     };

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { id, value } = e.target;

//         if (id === 'phone') {
//             const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
//             setFormData({ ...formData, [id]: digitsOnly });
//         } else if (id === 'postalCode') {
//             // Store the raw formatted value
//             const formatted = formatPostalCode(value);
//             setFormData({ ...formData, [id]: formatted });
//         } else {
//             setFormData({ ...formData, [id]: value });
//         }
//     };

//     const checkLoginStatus = async () => {
//         try {
//             const token = localStorage.getItem('token');

//             const headers: HeadersInit = {
//                 "Content-Type": "application/json",
//             };

//             if (token) {
//                 headers['Authorization'] = `Bearer ${token}`;
//             }

//             const response = await fetch("http://localhost:5000/api/auth/verify-token", {
//                 method: "GET",
//                 credentials: "include",
//                 headers,
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 setIsLoggedIn(true);
//                 setUserRole(data.user.role);
//             } else {
//                 setIsLoggedIn(false);
//                 setUserRole(null);
//                 localStorage.removeItem('token');
//             }
//         } catch (error) {
//             setIsLoggedIn(false);
//             setUserRole(null);
//             localStorage.removeItem('token');
//         }
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!agreed) {
//             toast.warning("You must agree to the terms first.");
//             return;
//         }

//         if (!isPasswordStrong) {
//             toast.warning("Please create a stronger password that meets all requirements.");
//             return;
//         }

//         if (formData.phone.length < 10) {
//             toast.warning("Please enter a valid 10-digit phone number.");
//             return;
//         }

//         if (!isPostalCodeValid) {
//             toast.warning("Please enter a valid Canadian postal code (e.g., M5V 3L9).");
//             return;
//         }

//         try {
//             const phoneWithCountryCode = `+1${formData.phone}`;
//             const res = await signup({
//                 ...formData,
//                 phone: phoneWithCountryCode,
//                 postalCode: formData.postalCode.replace(/\s/g, ''), // Remove space before sending
//                 role: selectedRole
//             }).unwrap();

//             if (res.token) {
//                 localStorage.setItem('token', res.token);
//             }

//             toast.success("Account created successfully!");
//             await checkLoginStatus();
//             router.push("/");
//         } catch (error: any) {
//             toast.error(error?.data?.message || "Signup failed. Please try again.");
//         }
//     };

//     const headerText = {
//         title: "Create Your Account",
//         subtitle: "Join thousands of people getting tasks done"
//     };

//     const benefits = [
//         { icon: FaCheckCircle, text: "Professionals" },
//         { icon: FaCheckCircle, text: "Secure Payments" },
//         { icon: FaCheckCircle, text: "24/7 Support" }
//     ];

//     const passwordRequirements = [
//         { key: 'minLength', label: 'At least 8 characters', met: passwordValidation.minLength },
//         { key: 'hasUppercase', label: 'One uppercase letter (A-Z)', met: passwordValidation.hasUppercase },
//         { key: 'hasLowercase', label: 'One lowercase letter (a-z)', met: passwordValidation.hasLowercase },
//         { key: 'hasNumber', label: 'One number (0-9)', met: passwordValidation.hasNumber },
//         { key: 'hasSpecial', label: 'One special character (!@#$%^&*)', met: passwordValidation.hasSpecial },
//     ];

//     // Get postal code input border color
//     const getPostalCodeBorderColor = () => {
//         if (!postalCodeFocused && formData.postalCode.length === 0) {
//             return '#e5e7eb';
//         }
//         if (postalCodeFocused) {
//             return '#109C3D';
//         }
//         if (isPostalCodeValid) {
//             return '#109C3D';
//         }
//         if (formData.postalCode.length > 0 && !isPostalCodeValid) {
//             return '#ef4444';
//         }
//         return '#e5e7eb';
//     };

//     return (
//         <div className="min-h-screen bg-white">
//             <style>{`
//                 .brand-gradient {
//                     background: linear-gradient(135deg, #063A41 0%, #109C3D 100%);
//                 }
//                 .btn-gradient {
//                     background: linear-gradient(135deg, #109C3D 0%, #0db53a 100%);
//                     transition: all 0.3s ease;
//                 }
//                 .btn-gradient:hover:not(:disabled) {
//                     transform: translateY(-2px);
//                     box-shadow: 0 6px 20px rgba(16, 156, 61, 0.3);
//                 }
//                 .btn-gradient:active:not(:disabled) {
//                     transform: translateY(0);
//                 }
//                 .btn-gradient:disabled {
//                     opacity: 0.7;
//                     cursor: not-allowed;
//                 }
//                 .input-focus {
//                     transition: all 0.3s ease;
//                 }
//                 .input-focus:focus {
//                     transform: translateY(-2px);
//                     box-shadow: 0 4px 12px rgba(16, 156, 61, 0.15);
//                 }
//                 .input-icon {
//                     color: #109C3D;
//                 }
//                 .fade-in-up {
//                     animation: fadeInUp 0.6s ease-out;
//                 }
//                 @keyframes fadeInUp {
//                     from {
//                         opacity: 0;
//                         transform: translateY(20px);
//                     }
//                     to {
//                         opacity: 1;
//                         transform: translateY(0);
//                     }
//                 }
//                 .checkbox-custom:checked {
//                     background-color: #109C3D;
//                     border-color: #109C3D;
//                 }
//                 .password-requirements {
//                     animation: slideDown 0.3s ease-out;
//                 }
//                 @keyframes slideDown {
//                     from {
//                         opacity: 0;
//                         transform: translateY(-10px);
//                     }
//                     to {
//                         opacity: 1;
//                         transform: translateY(0);
//                     }
//                 }
//                 .requirement-item {
//                     transition: all 0.2s ease;
//                 }
//                 .strength-bar {
//                     transition: all 0.3s ease;
//                 }
//                 .phone-wrapper {
//                     transition: all 0.3s ease;
//                 }
//                 .phone-wrapper:focus-within {
//                     transform: translateY(-2px);
//                     box-shadow: 0 4px 12px rgba(16, 156, 61, 0.15);
//                 }
//                 .phone-wrapper.focused {
//                     border-color: #109C3D !important;
//                 }
//                 .phone-input-inner:focus {
//                     outline: none;
//                 }
//                 .postal-code-wrapper {
//                     transition: all 0.3s ease;
//                 }
//                 .postal-code-wrapper:focus-within {
//                     transform: translateY(-2px);
//                     box-shadow: 0 4px 12px rgba(16, 156, 61, 0.15);
//                 }
//                 .postal-code-input:focus {
//                     outline: none;
//                 }
//                 .validation-icon {
//                     transition: all 0.2s ease;
//                 }
//             `}</style>

//             <Navbar />

//             <div className="min-h-screen flex items-center justify-center px-4 py-12">
//                 <div className="w-full max-w-2xl">

//                     {/* Header Section */}
//                     <div className="text-center mb-8 fade-in-up">
//                         <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 brand-gradient">
//                             <FaUserPlus className="text-3xl text-white" />
//                         </div>
//                         <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: '#063A41' }}>
//                             {headerText.title}
//                         </h1>
//                         <p className="text-gray-600 text-base sm:text-lg">
//                             {headerText.subtitle}
//                         </p>
//                     </div>

//                     {/* Form Card */}
//                     <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 lg:p-10 fade-in-up" style={{ animationDelay: '0.2s' }}>
//                         <form onSubmit={handleSubmit} className="space-y-5">

//                             {/* Name Fields */}
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                 <div>
//                                     <label htmlFor="firstName" className="block text-sm font-medium mb-2" style={{ color: '#063A41' }}>
//                                         First Name
//                                     </label>
//                                     <div className="relative">
//                                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                             <FaUser className="input-icon text-sm" />
//                                         </div>
//                                         <input
//                                             id="firstName"
//                                             type="text"
//                                             required
//                                             placeholder="John"
//                                             value={formData.firstName}
//                                             onChange={handleChange}
//                                             className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm input-focus"
//                                             style={{ outline: 'none' }}
//                                             onFocus={(e) => e.target.style.borderColor = '#109C3D'}
//                                             onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
//                                         />
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <label htmlFor="lastName" className="block text-sm font-medium mb-2" style={{ color: '#063A41' }}>
//                                         Last Name
//                                     </label>
//                                     <div className="relative">
//                                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                             <FaUser className="input-icon text-sm" />
//                                         </div>
//                                         <input
//                                             id="lastName"
//                                             type="text"
//                                             required
//                                             placeholder="Doe"
//                                             value={formData.lastName}
//                                             onChange={handleChange}
//                                             className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm input-focus"
//                                             style={{ outline: 'none' }}
//                                             onFocus={(e) => e.target.style.borderColor = '#109C3D'}
//                                             onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
//                                         />
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Email */}
//                             <div>
//                                 <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#063A41' }}>
//                                     Email Address
//                                 </label>
//                                 <div className="relative">
//                                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                         <FaEnvelope className="input-icon text-sm" />
//                                     </div>
//                                     <input
//                                         id="email"
//                                         type="email"
//                                         required
//                                         placeholder="you@example.com"
//                                         value={formData.email}
//                                         onChange={handleChange}
//                                         className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm input-focus"
//                                         style={{ outline: 'none' }}
//                                         onFocus={(e) => e.target.style.borderColor = '#109C3D'}
//                                         onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
//                                     />
//                                 </div>
//                             </div>

//                             {/* Phone and Postal Code */}
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                 {/* Phone Number Field */}
//                                 <div>
//                                     <label htmlFor="phone" className="block text-sm font-medium mb-2" style={{ color: '#063A41' }}>
//                                         Phone Number
//                                     </label>
//                                     <div
//                                         className={`phone-wrapper flex items-center border-2 rounded-xl overflow-hidden bg-white ${phoneFocused ? 'focused' : ''}`}
//                                         style={{ borderColor: phoneFocused ? '#109C3D' : '#e5e7eb' }}
//                                     >
//                                         <div className="pl-3 flex items-center pointer-events-none">
//                                             <FaPhone className="input-icon text-sm" />
//                                         </div>
//                                         {/* Country Code Section */}
//                                         <div className="flex items-center gap-1.5 px-3 py-3 ">
//                                             <span className="text-sm font-semibold text-gray-700">+1</span>
//                                         </div>

//                                         {/* Input Field */}
//                                         <input
//                                             id="phone"
//                                             type="tel"
//                                             required
//                                             placeholder="(555) 123-4567"
//                                             value={formatPhoneNumber(formData.phone)}
//                                             onChange={handleChange}
//                                             onFocus={() => setPhoneFocused(true)}
//                                             onBlur={() => setPhoneFocused(false)}
//                                             className="phone-input-inner flex-1 px-3 py-3 text-sm bg-transparent border-none outline-none"
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Postal Code - Canadian Format */}
//                                 <div>
//                                     <label htmlFor="postalCode" className="block text-sm font-medium mb-2" style={{ color: '#063A41' }}>
//                                         Postal Code
//                                     </label>
//                                     <div
//                                         className="postal-code-wrapper flex items-center border-2 rounded-xl overflow-hidden bg-white"
//                                         style={{ borderColor: getPostalCodeBorderColor() }}
//                                     >
//                                         <div className="pl-3 flex items-center pointer-events-none">
//                                             <FaMapMarkerAlt className="input-icon text-sm" />
//                                         </div>
//                                         <input
//                                             type="text"
//                                             id="postalCode"
//                                             required
//                                             value={formData.postalCode}
//                                             onChange={handleChange}
//                                             onFocus={() => setPostalCodeFocused(true)}
//                                             onBlur={() => setPostalCodeFocused(false)}
//                                             placeholder="M5V 3L9"
//                                             maxLength={7}
//                                             className="postal-code-input flex-1 px-3 py-3 text-sm bg-transparent border-none uppercase tracking-wider"
//                                             style={{ outline: 'none' }}
//                                         />
//                                         {/* Validation Icon */}
//                                         {formData.postalCode.length > 0 && (
//                                             <div className="pr-3 flex items-center validation-icon">
//                                                 {isPostalCodeValid ? (
//                                                     <FaCheck className="text-sm" style={{ color: '#109C3D' }} />
//                                                 ) : (
//                                                     <FaTimes className="text-sm text-red-500" />
//                                                 )}
//                                             </div>
//                                         )}
//                                     </div>
//                                     {/* Helper Text / Error Message */}
//                                     {/* <div className="mt-1.5">
//                                         {formData.postalCode.length > 0 && !isPostalCodeValid ? (
//                                             <p className="text-xs text-red-500 flex items-center gap-1">
//                                                 <FaTimes className="text-xs" />
//                                                 Enter valid format: A1A 1A1
//                                             </p>
//                                         ) : (
//                                             <p className="text-xs text-gray-500">
//                                                 Canadian format: A1A 1A1
//                                             </p>
//                                         )}
//                                     </div> */}
//                                 </div>
//                             </div>

//                             {/* Password */}
//                             <div>
//                                 <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: '#063A41' }}>
//                                     Create Password
//                                 </label>
//                                 <div className="relative">
//                                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                         <FaLock className="input-icon text-sm" />
//                                     </div>
//                                     <input
//                                         id="password"
//                                         type={showPassword ? 'text' : 'password'}
//                                         required
//                                         placeholder="••••••••"
//                                         value={formData.password}
//                                         onChange={handleChange}
//                                         className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl text-sm input-focus"
//                                         style={{ outline: 'none' }}
//                                         onFocus={(e) => {
//                                             e.target.style.borderColor = '#109C3D';
//                                             setPasswordFocused(true);
//                                         }}
//                                         onBlur={(e) => {
//                                             e.target.style.borderColor = '#e5e7eb';
//                                             if (formData.password.length === 0) {
//                                                 setPasswordFocused(false);
//                                             }
//                                         }}
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={togglePasswordVisibility}
//                                         className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition"
//                                         aria-label={showPassword ? 'Hide password' : 'Show password'}
//                                     >
//                                         {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
//                                     </button>
//                                 </div>

//                                 {/* Password Strength Indicator */}
//                                 {(passwordFocused || formData.password.length > 0) && (
//                                     <div className="mt-3 password-requirements">
//                                         {/* Strength Bar */}
//                                         <div className="mb-3">
//                                             <div className="flex items-center justify-between mb-1.5">
//                                                 <span className="text-xs font-medium text-gray-600">Password Strength</span>
//                                                 {passwordStrength.label && (
//                                                     <span
//                                                         className="text-xs font-semibold"
//                                                         style={{ color: passwordStrength.color }}
//                                                     >
//                                                         {passwordStrength.label}
//                                                     </span>
//                                                 )}
//                                             </div>
//                                             <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
//                                                 <div
//                                                     className="h-full rounded-full strength-bar"
//                                                     style={{
//                                                         width: passwordStrength.width,
//                                                         backgroundColor: passwordStrength.color
//                                                     }}
//                                                 />
//                                             </div>
//                                         </div>

//                                         {/* Requirements List */}
//                                         <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
//                                             <p className="text-xs font-semibold text-gray-700 mb-2">Password must contain:</p>
//                                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
//                                                 {passwordRequirements.map((req) => (
//                                                     <div
//                                                         key={req.key}
//                                                         className="flex items-center gap-2 requirement-item"
//                                                     >
//                                                         {req.met ? (
//                                                             <FaCheck className="text-xs flex-shrink-0" style={{ color: '#109C3D' }} />
//                                                         ) : (
//                                                             <FaTimes className="text-xs text-gray-400 flex-shrink-0" />
//                                                         )}
//                                                         <span
//                                                             className={`text-xs ${req.met ? 'font-medium' : 'text-gray-500'}`}
//                                                             style={req.met ? { color: '#109C3D' } : {}}
//                                                         >
//                                                             {req.label}
//                                                         </span>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Terms Checkbox */}
//                             <div className="p-4 rounded-xl" style={{ backgroundColor: '#E5FFDB' }}>
//                                 <div className="flex items-start gap-3">
//                                     <input
//                                         id="terms"
//                                         type="checkbox"
//                                         required
//                                         checked={agreed}
//                                         onChange={() => setAgreed(!agreed)}
//                                         className="mt-1 w-4 h-4 rounded border-gray-300 checkbox-custom cursor-pointer"
//                                         style={{ accentColor: '#109C3D' }}
//                                     />
//                                     <label htmlFor="terms" className="text-sm cursor-pointer" style={{ color: '#063A41' }}>
//                                         I agree to the{" "}
//                                         <Link href="/terms" className="font-semibold hover:underline" style={{ color: '#109C3D' }}>
//                                             Terms of Service
//                                         </Link>
//                                         {" "}and{" "}
//                                         <Link href="/privacy" className="font-semibold hover:underline" style={{ color: '#109C3D' }}>
//                                             Privacy Policy
//                                         </Link>
//                                     </label>
//                                 </div>
//                             </div>

//                             {/* Submit Button */}
//                             <button
//                                 type="submit"
//                                 disabled={isLoading || !isPasswordStrong || !isPostalCodeValid}
//                                 className="w-full text-white font-semibold py-3.5 rounded-xl text-sm btn-gradient"
//                             >
//                                 {isLoading ? (
//                                     <span className="flex items-center justify-center gap-2">
//                                         <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
//                                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                                         </svg>
//                                         Creating Account...
//                                     </span>
//                                 ) : (
//                                     "Create Account"
//                                 )}
//                             </button>

//                             {/* Login Link */}
//                             <div className="text-center pt-4">
//                                 <p className="text-sm text-gray-600">
//                                     Already have an account?{" "}
//                                     <Link
//                                         href="/authentication?openClientLogin=true"
//                                         className="font-semibold hover:underline"
//                                         style={{ color: '#109C3D' }}
//                                     >
//                                         Log in
//                                     </Link>
//                                 </p>
//                             </div>
//                         </form>

//                         {/* Benefits Section */}
//                         <div className="mt-8 pt-8 border-t border-gray-200">
//                             <p className="text-xs font-semibold text-center mb-4" style={{ color: '#063A41' }}>
//                                 What you'll get:
//                             </p>
//                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
//                                 {benefits.map((benefit, index) => (
//                                     <div key={index} className="flex flex-col items-center">
//                                         <benefit.icon className="text-xl mb-2" style={{ color: '#109C3D' }} />
//                                         <p className="text-xs text-gray-600">{benefit.text}</p>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <ToastContainer position="top-center" autoClose={3000} />
//         </div>
//     );
// };

// export default SignupPage;



/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useMemo } from "react";
import { FaUserPlus, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock, FaCheckCircle, FaCheck, FaTimes } from "react-icons/fa";
import Link from "next/link";
import Navbar from "@/shared/Navbar";
import { useSignupMutation } from "@/features/auth/authApi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const SignupPage = () => {
    const [agreed, setAgreed] = useState(false);
    const [signup, { isLoading }] = useSignupMutation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const selectedRole = "client" as const;
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [phoneFocused, setPhoneFocused] = useState(false);
    const [postalCodeFocused, setPostalCodeFocused] = useState(false);
    const [showOtpForm, setShowOtpForm] = useState(false);
    const [otpCode, setOtpCode] = useState("");
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        postalCode: "",
        password: "",
    });

    // Password validation rules
    const passwordValidation = useMemo(() => {
        const password = formData.password;
        return {
            minLength: password.length >= 8,
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecial: /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\';/`~]/.test(password),
        };
    }, [formData.password]);

    const isPasswordStrong = Object.values(passwordValidation).every(Boolean);

    // Canadian Postal Code validation
    // Format: A1A 1A1 (Letter-Number-Letter Space Number-Letter-Number)
    // First letter cannot be D, F, I, O, Q, U, W, Z
    const postalCodeValidation = useMemo(() => {
        const postalCode = formData.postalCode.replace(/\s/g, '').toUpperCase();
        const validFirstLetters = /^[ABCEGHJKLMNPRSTVXY]/;
        const validFormat = /^[ABCEGHJKLMNPRSTVXY][0-9][ABCEGHJKLMNPRSTVWXYZ][0-9][ABCEGHJKLMNPRSTVWXYZ][0-9]$/;

        return {
            hasValidLength: postalCode.length === 6,
            hasValidFormat: validFormat.test(postalCode),
            hasValidFirstLetter: postalCode.length > 0 ? validFirstLetters.test(postalCode) : true,
        };
    }, [formData.postalCode]);

    const isPostalCodeValid = postalCodeValidation.hasValidLength && postalCodeValidation.hasValidFormat;

    const getPasswordStrength = () => {
        const validCount = Object.values(passwordValidation).filter(Boolean).length;
        if (validCount === 0) return { label: '', color: '', width: '0%', bgColor: '#e5e7eb' };
        if (validCount <= 2) return { label: 'Weak', color: '#ef4444', width: '25%', bgColor: '#fecaca' };
        if (validCount <= 3) return { label: 'Fair', color: '#f59e0b', width: '50%', bgColor: '#fde68a' };
        if (validCount <= 4) return { label: 'Good', color: '#3b82f6', width: '75%', bgColor: '#bfdbfe' };
        return { label: 'Strong', color: '#109C3D', width: '100%', bgColor: '#bbf7d0' };
    };

    const passwordStrength = getPasswordStrength();

    // Format phone number for display
    const formatPhoneNumber = (value: string) => {
        const phoneNumber = value.replace(/\D/g, '');

        if (phoneNumber.length <= 3) {
            return phoneNumber;
        } else if (phoneNumber.length <= 6) {
            return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
        } else {
            return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
        }
    };

    // Format Canadian Postal Code (A1A 1A1)
    const formatPostalCode = (value: string) => {
        // Remove all non-alphanumeric characters and convert to uppercase
        const cleaned = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

        // Limit to 6 characters
        const limited = cleaned.slice(0, 6);

        // Apply Canadian postal code pattern: Letter-Number-Letter Number-Letter-Number
        let formatted = '';
        for (let i = 0; i < limited.length; i++) {
            const char = limited[i];
            const isEvenPosition = i % 2 === 0; // Positions 0, 2, 4 should be letters

            if (isEvenPosition) {
                // Should be a letter
                if (/[A-Z]/.test(char)) {
                    formatted += char;
                }
            } else {
                // Should be a number
                if (/[0-9]/.test(char)) {
                    formatted += char;
                }
            }
        }

        // Add space after first 3 characters
        if (formatted.length > 3) {
            return `${formatted.slice(0, 3)} ${formatted.slice(3)}`;
        }

        return formatted;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;

        if (id === 'phone') {
            const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
            setFormData({ ...formData, [id]: digitsOnly });
        } else if (id === 'postalCode') {
            // Store the raw formatted value
            const formatted = formatPostalCode(value);
            setFormData({ ...formData, [id]: formatted });
        } else {
            setFormData({ ...formData, [id]: value });
        }
    };

    const checkLoginStatus = async () => {
        try {
            const token = localStorage.getItem('token');

            const headers: HeadersInit = {
                "Content-Type": "application/json",
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch("https://taskmatch-backend.vercel.app/api/auth/verify-token", {
                method: "GET",
                credentials: "include",
                headers,
            });

            if (response.ok) {
                const data = await response.json();
                setIsLoggedIn(true);
                setUserRole(data.user.role);
            } else {
                setIsLoggedIn(false);
                setUserRole(null);
                localStorage.removeItem('token');
            }
        } catch (error) {
            setIsLoggedIn(false);
            setUserRole(null);
            localStorage.removeItem('token');
        }
    };

    const sendOtp = async () => {
        setIsSendingOtp(true);
        try {
            const response = await fetch("https://taskmatch-backend.vercel.app/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email }),
            });

            if (!response.ok) {
                throw new Error("Failed to send OTP");
            }

            toast.success("OTP sent to your email!");
            setShowOtpForm(true);
        } catch (error: any) {
            toast.error(error.message || "Failed to send OTP. Please try again.");
        } finally {
            setIsSendingOtp(false);
        }
    };

    const verifyOtp = async () => {
        setIsVerifyingOtp(true);
        try {
            const phoneWithCountryCode = `+1${formData.phone}`;
            const res = await signup({
                ...formData,
                phone: phoneWithCountryCode,
                postalCode: formData.postalCode.replace(/\s/g, ''), // Remove space before sending
                role: selectedRole,
                otp: otpCode,
            }).unwrap();

            if (res.token) {
                localStorage.setItem('token', res.token);
            }

            toast.success("Account created successfully!");
            await checkLoginStatus();
            router.push("/");
        } catch (error: any) {
            toast.error(error?.data?.message || "OTP verification failed. Please try again.");
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!agreed) {
            toast.warning("You must agree to the terms first.");
            return;
        }

        if (!isPasswordStrong) {
            toast.warning("Please create a stronger password that meets all requirements.");
            return;
        }

        if (formData.phone.length < 10) {
            toast.warning("Please enter a valid 10-digit phone number.");
            return;
        }

        if (!isPostalCodeValid) {
            toast.warning("Please enter a valid Canadian postal code (e.g., M5V 3L9).");
            return;
        }

        // Instead of direct signup, send OTP first
        await sendOtp();
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otpCode.length !== 6) {
            toast.warning("Please enter a valid 6-digit OTP.");
            return;
        }
        await verifyOtp();
    };

    const headerText = {
        title: "Create Your Account",
        subtitle: "Join thousands of people getting tasks done"
    };

    const benefits = [
        { icon: FaCheckCircle, text: "Professionals" },
        { icon: FaCheckCircle, text: "Secure Payments" },
        { icon: FaCheckCircle, text: "24/7 Support" }
    ];

    const passwordRequirements = [
        { key: 'minLength', label: 'At least 8 characters', met: passwordValidation.minLength },
        { key: 'hasUppercase', label: 'One uppercase letter (A-Z)', met: passwordValidation.hasUppercase },
        { key: 'hasLowercase', label: 'One lowercase letter (a-z)', met: passwordValidation.hasLowercase },
        { key: 'hasNumber', label: 'One number (0-9)', met: passwordValidation.hasNumber },
        { key: 'hasSpecial', label: 'One special character (!@#$%^&*)', met: passwordValidation.hasSpecial },
    ];

    // Get postal code input border color
    const getPostalCodeBorderColor = () => {
        if (!postalCodeFocused && formData.postalCode.length === 0) {
            return '#e5e7eb';
        }
        if (postalCodeFocused) {
            return '#109C3D';
        }
        if (isPostalCodeValid) {
            return '#109C3D';
        }
        if (formData.postalCode.length > 0 && !isPostalCodeValid) {
            return '#ef4444';
        }
        return '#e5e7eb';
    };

    return (
        <div className="min-h-screen bg-white">
            <style>{`
        .brand-gradient {
          background: linear-gradient(135deg, #063A41 0%, #109C3D 100%);
        }
        .btn-gradient {
          background: linear-gradient(135deg, #109C3D 0%, #0db53a 100%);
          transition: all 0.3s ease;
        }
        .btn-gradient:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(16, 156, 61, 0.3);
        }
        .btn-gradient:active:not(:disabled) {
          transform: translateY(0);
        }
        .btn-gradient:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .input-focus {
          transition: all 0.3s ease;
        }
        .input-focus:focus {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 156, 61, 0.15);
        }
        .input-icon {
          color: #109C3D;
        }
        .fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .checkbox-custom:checked {
          background-color: #109C3D;
          border-color: #109C3D;
        }
        .password-requirements {
          animation: slideDown 0.3s ease-out;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .requirement-item {
          transition: all 0.2s ease;
        }
        .strength-bar {
          transition: all 0.3s ease;
        }
        .phone-wrapper {
          transition: all 0.3s ease;
        }
        .phone-wrapper:focus-within {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 156, 61, 0.15);
        }
        .phone-wrapper.focused {
          border-color: #109C3D !important;
        }
        .phone-input-inner:focus {
          outline: none;
        }
        .postal-code-wrapper {
          transition: all 0.3s ease;
        }
        .postal-code-wrapper:focus-within {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 156, 61, 0.15);
        }
        .postal-code-input:focus {
          outline: none;
        }
        .validation-icon {
          transition: all 0.2s ease;
        }
      `}</style>

            <Navbar />

            <div className="min-h-screen flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-2xl">

                    {/* Header Section */}
                    <div className="text-center mb-8 fade-in-up">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 brand-gradient">
                            <FaUserPlus className="text-3xl text-white" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: '#063A41' }}>
                            {headerText.title}
                        </h1>
                        <p className="text-gray-600 text-base sm:text-lg">
                            {headerText.subtitle}
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 lg:p-10 fade-in-up" style={{ animationDelay: '0.2s' }}>
                        {!showOtpForm ? (
                            <form onSubmit={handleSubmit} className="space-y-5">

                                {/* Name Fields */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium mb-2" style={{ color: '#063A41' }}>
                                            First Name
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaUser className="input-icon text-sm" />
                                            </div>
                                            <input
                                                id="firstName"
                                                type="text"
                                                required
                                                placeholder="John"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm input-focus"
                                                style={{ outline: 'none' }}
                                                onFocus={(e) => e.target.style.borderColor = '#109C3D'}
                                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium mb-2" style={{ color: '#063A41' }}>
                                            Last Name
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaUser className="input-icon text-sm" />
                                            </div>
                                            <input
                                                id="lastName"
                                                type="text"
                                                required
                                                placeholder="Doe"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm input-focus"
                                                style={{ outline: 'none' }}
                                                onFocus={(e) => e.target.style.borderColor = '#109C3D'}
                                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#063A41' }}>
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaEnvelope className="input-icon text-sm" />
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            required
                                            placeholder="you@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm input-focus"
                                            style={{ outline: 'none' }}
                                            onFocus={(e) => e.target.style.borderColor = '#109C3D'}
                                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                        />
                                    </div>
                                </div>

                                {/* Phone and Postal Code */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Phone Number Field */}
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium mb-2" style={{ color: '#063A41' }}>
                                            Phone Number
                                        </label>
                                        <div
                                            className={`phone-wrapper flex items-center border-2 rounded-xl overflow-hidden bg-white ${phoneFocused ? 'focused' : ''}`}
                                            style={{ borderColor: phoneFocused ? '#109C3D' : '#e5e7eb' }}
                                        >
                                            <div className="pl-3 flex items-center pointer-events-none">
                                                <FaPhone className="input-icon text-sm" />
                                            </div>
                                            {/* Country Code Section */}
                                            <div className="flex items-center gap-1.5 px-3 py-3 ">
                                                <span className="text-sm font-semibold text-gray-700">+1</span>
                                            </div>

                                            {/* Input Field */}
                                            <input
                                                id="phone"
                                                type="tel"
                                                required
                                                placeholder="(555) 123-4567"
                                                value={formatPhoneNumber(formData.phone)}
                                                onChange={handleChange}
                                                onFocus={() => setPhoneFocused(true)}
                                                onBlur={() => setPhoneFocused(false)}
                                                className="phone-input-inner flex-1 px-3 py-3 text-sm bg-transparent border-none outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Postal Code - Canadian Format */}
                                    <div>
                                        <label htmlFor="postalCode" className="block text-sm font-medium mb-2" style={{ color: '#063A41' }}>
                                            Postal Code
                                        </label>
                                        <div
                                            className="postal-code-wrapper flex items-center border-2 rounded-xl overflow-hidden bg-white"
                                            style={{ borderColor: getPostalCodeBorderColor() }}
                                        >
                                            <div className="pl-3 flex items-center pointer-events-none">
                                                <FaMapMarkerAlt className="input-icon text-sm" />
                                            </div>
                                            <input
                                                type="text"
                                                id="postalCode"
                                                required
                                                value={formData.postalCode}
                                                onChange={handleChange}
                                                onFocus={() => setPostalCodeFocused(true)}
                                                onBlur={() => setPostalCodeFocused(false)}
                                                placeholder="M5V 3L9"
                                                maxLength={7}
                                                className="postal-code-input flex-1 px-3 py-3 text-sm bg-transparent border-none uppercase tracking-wider"
                                                style={{ outline: 'none' }}
                                            />
                                            {/* Validation Icon */}
                                            {formData.postalCode.length > 0 && (
                                                <div className="pr-3 flex items-center validation-icon">
                                                    {isPostalCodeValid ? (
                                                        <FaCheck className="text-sm" style={{ color: '#109C3D' }} />
                                                    ) : (
                                                        <FaTimes className="text-sm text-red-500" />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        {/* Helper Text / Error Message */}
                                        {/* <div className="mt-1.5">
                      {formData.postalCode.length > 0 && !isPostalCodeValid ? (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <FaTimes className="text-xs" />
                          Enter valid format: A1A 1A1
                        </p>
                      ) : (
                        <p className="text-xs text-gray-500">
                          Canadian format: A1A 1A1
                        </p>
                      )}
                    </div> */}
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: '#063A41' }}>
                                        Create Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaLock className="input-icon text-sm" />
                                        </div>
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl text-sm input-focus"
                                            style={{ outline: 'none' }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = '#109C3D';
                                                setPasswordFocused(true);
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = '#e5e7eb';
                                                if (formData.password.length === 0) {
                                                    setPasswordFocused(false);
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition"
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        >
                                            {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                                        </button>
                                    </div>

                                    {/* Password Strength Indicator */}
                                    {(passwordFocused || formData.password.length > 0) && (
                                        <div className="mt-3 password-requirements">
                                            {/* Strength Bar */}
                                            <div className="mb-3">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className="text-xs font-medium text-gray-600">Password Strength</span>
                                                    {passwordStrength.label && (
                                                        <span
                                                            className="text-xs font-semibold"
                                                            style={{ color: passwordStrength.color }}
                                                        >
                                                            {passwordStrength.label}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full strength-bar"
                                                        style={{
                                                            width: passwordStrength.width,
                                                            backgroundColor: passwordStrength.color
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Requirements List */}
                                            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                                                <p className="text-xs font-semibold text-gray-700 mb-2">Password must contain:</p>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                                    {passwordRequirements.map((req) => (
                                                        <div
                                                            key={req.key}
                                                            className="flex items-center gap-2 requirement-item"
                                                        >
                                                            {req.met ? (
                                                                <FaCheck className="text-xs flex-shrink-0" style={{ color: '#109C3D' }} />
                                                            ) : (
                                                                <FaTimes className="text-xs text-gray-400 flex-shrink-0" />
                                                            )}
                                                            <span
                                                                className={`text-xs ${req.met ? 'font-medium' : 'text-gray-500'}`}
                                                                style={req.met ? { color: '#109C3D' } : {}}
                                                            >
                                                                {req.label}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Terms Checkbox */}
                                <div className="p-4 rounded-xl" style={{ backgroundColor: '#E5FFDB' }}>
                                    <div className="flex items-start gap-3">
                                        <input
                                            id="terms"
                                            type="checkbox"
                                            required
                                            checked={agreed}
                                            onChange={() => setAgreed(!agreed)}
                                            className="mt-1 w-4 h-4 rounded border-gray-300 checkbox-custom cursor-pointer"
                                            style={{ accentColor: '#109C3D' }}
                                        />
                                        <label htmlFor="terms" className="text-sm cursor-pointer" style={{ color: '#063A41' }}>
                                            I agree to the{" "}
                                            <Link href="/terms" className="font-semibold hover:underline" style={{ color: '#109C3D' }}>
                                                Terms of Service
                                            </Link>
                                            {" "}and{" "}
                                            <Link href="/privacy" className="font-semibold hover:underline" style={{ color: '#109C3D' }}>
                                                Privacy Policy
                                            </Link>
                                        </label>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSendingOtp || isLoading || !isPasswordStrong || !isPostalCodeValid}
                                    className="w-full text-white font-semibold py-3.5 rounded-xl text-sm btn-gradient"
                                >
                                    {isSendingOtp ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Sending OTP...
                                        </span>
                                    ) : (
                                        "Send OTP"
                                    )}
                                </button>

                                {/* Login Link */}
                                <div className="text-center pt-4">
                                    <p className="text-sm text-gray-600">
                                        Already have an account?{" "}
                                        <Link
                                            href="/authentication?openClientLogin=true"
                                            className="font-semibold hover:underline"
                                            style={{ color: '#109C3D' }}
                                        >
                                            Log in
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleOtpSubmit} className="space-y-5">
                                {/* OTP Input */}
                                <div>
                                    <label htmlFor="otp" className="block text-sm font-medium mb-2" style={{ color: '#063A41' }}>
                                        Enter OTP (sent to {formData.email})
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaEnvelope className="input-icon text-sm" />
                                        </div>
                                        <input
                                            id="otp"
                                            type="text"
                                            required
                                            placeholder="123456"
                                            value={otpCode}
                                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm input-focus"
                                            style={{ outline: 'none' }}
                                            onFocus={(e) => e.target.style.borderColor = '#109C3D'}
                                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                        />
                                    </div>
                                </div>

                                {/* Verify Button */}
                                <button
                                    type="submit"
                                    disabled={isVerifyingOtp || isLoading || otpCode.length !== 6}
                                    className="w-full text-white font-semibold py-3.5 rounded-xl text-sm btn-gradient"
                                >
                                    {isVerifyingOtp ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Verifying OTP...
                                        </span>
                                    ) : (
                                        "Verify OTP & Create Account"
                                    )}
                                </button>

                                {/* Resend OTP */}
                                <div className="text-center pt-4">
                                    <button
                                        type="button"
                                        onClick={sendOtp}
                                        disabled={isSendingOtp}
                                        className="text-sm font-semibold hover:underline"
                                        style={{ color: '#109C3D' }}
                                    >
                                        Resend OTP
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Benefits Section */}
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <p className="text-xs font-semibold text-center mb-4" style={{ color: '#063A41' }}>
                                What you'll get:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex flex-col items-center">
                                        <benefit.icon className="text-xl mb-2" style={{ color: '#109C3D' }} />
                                        <p className="text-xs text-gray-600">{benefit.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ToastContainer position="top-center" autoClose={3000} />
        </div>
    );
};

export default SignupPage;