// @ts-nocheck
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
    FaUserPlus, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt,
    FaLock, FaCheckCircle, FaCheck, FaTimes, FaSpinner,
    FaExclamationTriangle
} from "react-icons/fa";
import Link from "next/link";
import Navbar from "@/shared/Navbar";
import { useSignupMutation } from "@/features/auth/authApi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

// Debounce hook for real-time validation
const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

// Validation status type
type ValidationStatus = 'idle' | 'checking' | 'available' | 'exists' | 'invalid';

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
    const [emailFocused, setEmailFocused] = useState(false);
    const [showOtpForm, setShowOtpForm] = useState(false);
    const [otpCode, setOtpCode] = useState("");
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

    // Email validation states
    const [emailStatus, setEmailStatus] = useState<ValidationStatus>('idle');
    const [emailMessage, setEmailMessage] = useState('');

    // Phone validation states
    const [phoneStatus, setPhoneStatus] = useState<ValidationStatus>('idle');
    const [phoneMessage, setPhoneMessage] = useState('');

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

    // Debounce email and phone inputs (500ms delay)
    const debouncedEmail = useDebounce(formData.email, 500);
    const debouncedPhone = useDebounce(formData.phone, 500);

    // Email format validation
    const isValidEmailFormat = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Phone format validation (10 digits)
    const isValidPhoneFormat = (phone: string) => {
        return phone.length === 10;
    };

    // Check email availability
    const checkEmailAvailability = useCallback(async (email: string) => {
        if (!email || !isValidEmailFormat(email)) {
            if (email && !isValidEmailFormat(email)) {
                setEmailStatus('invalid');
                setEmailMessage('Please enter a valid email address');
            } else {
                setEmailStatus('idle');
                setEmailMessage('');
            }
            return;
        }

        setEmailStatus('checking');
        setEmailMessage('Checking availability...');

        try {
            const response = await fetch(
                `/api/auth/check-email?email=${encodeURIComponent(email)}`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            const data = await response.json();

            if (data.exists) {
                setEmailStatus('exists');
                setEmailMessage('This email is already registered');
            } else if (data.valid === false) {
                setEmailStatus('invalid');
                setEmailMessage('Please enter a valid email address');
            } else {
                setEmailStatus('available');
                setEmailMessage('Email is available');
            }
        } catch (error) {
            console.error('Error checking email:', error);
            setEmailStatus('idle');
            setEmailMessage('');
        }
    }, []);

    // Check phone availability
    const checkPhoneAvailability = useCallback(async (phone: string) => {
        if (!phone || !isValidPhoneFormat(phone)) {
            if (phone && !isValidPhoneFormat(phone)) {
                setPhoneStatus('invalid');
                setPhoneMessage('Please enter a valid 10-digit phone number');
            } else {
                setPhoneStatus('idle');
                setPhoneMessage('');
            }
            return;
        }

        setPhoneStatus('checking');
        setPhoneMessage('Checking availability...');

        try {
            const response = await fetch(
                `/api/auth/check-phone?phone=${encodeURIComponent(phone)}`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            const data = await response.json();

            if (data.exists) {
                setPhoneStatus('exists');
                setPhoneMessage('This phone number is already registered');
            } else if (data.valid === false) {
                setPhoneStatus('invalid');
                setPhoneMessage('Please enter a valid phone number');
            } else {
                setPhoneStatus('available');
                setPhoneMessage('Phone number is available');
            }
        } catch (error) {
            console.error('Error checking phone:', error);
            setPhoneStatus('idle');
            setPhoneMessage('');
        }
    }, []);

    // Effect to check email when debounced value changes
    useEffect(() => {
        checkEmailAvailability(debouncedEmail);
    }, [debouncedEmail, checkEmailAvailability]);

    // Effect to check phone when debounced value changes
    useEffect(() => {
        checkPhoneAvailability(debouncedPhone);
    }, [debouncedPhone, checkPhoneAvailability]);

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

    // Check if email and phone are valid for submission
    const isEmailValid = emailStatus === 'available';
    const isPhoneValid = phoneStatus === 'available';

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
        const cleaned = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        const limited = cleaned.slice(0, 6);

        let formatted = '';
        for (let i = 0; i < limited.length; i++) {
            const char = limited[i];
            const isEvenPosition = i % 2 === 0;

            if (isEvenPosition) {
                if (/[A-Z]/.test(char)) {
                    formatted += char;
                }
            } else {
                if (/[0-9]/.test(char)) {
                    formatted += char;
                }
            }
        }

        if (formatted.length > 3) {
            return `${formatted.slice(0, 3)} ${formatted.slice(3)}`;
        }

        return formatted;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;

        if (id === 'phone') {
            const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
            // Reset phone status when user starts typing
            setPhoneStatus('idle');
            setPhoneMessage('');
            setFormData({ ...formData, [id]: digitsOnly });
        } else if (id === 'postalCode') {
            const formatted = formatPostalCode(value);
            setFormData({ ...formData, [id]: formatted });
        } else if (id === 'email') {
            // Reset email status when user starts typing
            setEmailStatus('idle');
            setEmailMessage('');
            setFormData({ ...formData, [id]: value });
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

            const response = await fetch("/api/auth/verify-token", {
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
            const response = await fetch("/api/auth/send-otp", {
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
                postalCode: formData.postalCode.replace(/\s/g, ''),
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

        if (!isEmailValid) {
            if (emailStatus === 'exists') {
                toast.error("This email is already registered. Please use a different email or login.");
            } else if (emailStatus === 'invalid') {
                toast.warning("Please enter a valid email address.");
            } else {
                toast.warning("Please wait for email verification to complete.");
            }
            return;
        }

        if (!isPhoneValid) {
            if (phoneStatus === 'exists') {
                toast.error("This phone number is already registered. Please use a different number or login.");
            } else if (phoneStatus === 'invalid') {
                toast.warning("Please enter a valid 10-digit phone number.");
            } else if (formData.phone.length < 10) {
                toast.warning("Please enter a valid 10-digit phone number.");
            } else {
                toast.warning("Please wait for phone verification to complete.");
            }
            return;
        }

        if (!isPasswordStrong) {
            toast.warning("Please create a stronger password that meets all requirements.");
            return;
        }

        if (!isPostalCodeValid) {
            toast.warning("Please enter a valid Canadian postal code (e.g., M5V 3L9).");
            return;
        }

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

    // Get email input styles based on status
    const getEmailBorderColor = () => {
        if (!emailFocused && formData.email.length === 0) {
            return '#e5e7eb';
        }
        if (emailFocused && emailStatus === 'idle') {
            return '#109C3D';
        }
        switch (emailStatus) {
            case 'checking':
                return '#3b82f6';
            case 'available':
                return '#109C3D';
            case 'exists':
            case 'invalid':
                return '#ef4444';
            default:
                return emailFocused ? '#109C3D' : '#e5e7eb';
        }
    };

    const getEmailIcon = () => {
        switch (emailStatus) {
            case 'checking':
                return <FaSpinner className="text-sm text-blue-500 animate-spin" />;
            case 'available':
                return <FaCheck className="text-sm" style={{ color: '#109C3D' }} />;
            case 'exists':
            case 'invalid':
                return <FaTimes className="text-sm text-red-500" />;
            default:
                return null;
        }
    };

    const getEmailMessageColor = () => {
        switch (emailStatus) {
            case 'checking':
                return '#3b82f6';
            case 'available':
                return '#109C3D';
            case 'exists':
            case 'invalid':
                return '#ef4444';
            default:
                return '#6b7280';
        }
    };

    // Get phone input styles based on status
    const getPhoneBorderColor = () => {
        if (!phoneFocused && formData.phone.length === 0) {
            return '#e5e7eb';
        }
        if (phoneFocused && phoneStatus === 'idle') {
            return '#109C3D';
        }
        switch (phoneStatus) {
            case 'checking':
                return '#3b82f6';
            case 'available':
                return '#109C3D';
            case 'exists':
            case 'invalid':
                return '#ef4444';
            default:
                return phoneFocused ? '#109C3D' : '#e5e7eb';
        }
    };

    const getPhoneIcon = () => {
        switch (phoneStatus) {
            case 'checking':
                return <FaSpinner className="text-sm text-blue-500 animate-spin" />;
            case 'available':
                return <FaCheck className="text-sm" style={{ color: '#109C3D' }} />;
            case 'exists':
            case 'invalid':
                return <FaTimes className="text-sm text-red-500" />;
            default:
                return null;
        }
    };

    const getPhoneMessageColor = () => {
        switch (phoneStatus) {
            case 'checking':
                return '#3b82f6';
            case 'available':
                return '#109C3D';
            case 'exists':
            case 'invalid':
                return '#ef4444';
            default:
                return '#6b7280';
        }
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
                .email-wrapper {
                    transition: all 0.3s ease;
                }
                .email-wrapper:focus-within {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(16, 156, 61, 0.15);
                }
                .email-input:focus {
                    outline: none;
                }
                .status-message {
                    animation: fadeIn 0.2s ease-out;
                }
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                @keyframes spin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
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
                                                placeholder="Alex"
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
                                                placeholder="Smith"
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

                                {/* Email with Real-time Validation */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#063A41' }}>
                                        Email Address
                                    </label>
                                    <div
                                        className="email-wrapper flex items-center border-2 rounded-xl overflow-hidden bg-white"
                                        style={{ borderColor: getEmailBorderColor() }}
                                    >
                                        <div className="pl-3 flex items-center pointer-events-none">
                                            <FaEnvelope className="input-icon text-sm" />
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            required
                                            placeholder="AlexSmith@gmail.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            onFocus={() => setEmailFocused(true)}
                                            onBlur={() => setEmailFocused(false)}
                                            className="email-input flex-1 px-3 py-3 text-sm bg-transparent border-none"
                                            style={{ outline: 'none' }}
                                        />
                                        {formData.email.length > 0 && (
                                            <div className="pr-3 flex items-center validation-icon">
                                                {getEmailIcon()}
                                            </div>
                                        )}
                                    </div>
                                    {emailMessage && formData.email.length > 0 && (
                                        <div className="mt-1.5 status-message">
                                            <p
                                                className="text-xs flex items-center gap-1"
                                                style={{ color: getEmailMessageColor() }}
                                            >
                                                {emailStatus === 'exists' && (
                                                    <>
                                                        <FaTimes className="text-xs" />
                                                        {emailMessage}
                                                        <Link
                                                            href="/authentication?openClientLogin=true"
                                                            className="ml-1 underline font-medium hover:no-underline"
                                                        >
                                                            Login instead?
                                                        </Link>
                                                    </>
                                                )}
                                                {emailStatus === 'available' && (
                                                    <>
                                                        <FaCheck className="text-xs" />
                                                        {emailMessage}
                                                    </>
                                                )}
                                                {emailStatus === 'checking' && (
                                                    <>
                                                        <FaSpinner className="text-xs animate-spin" />
                                                        {emailMessage}
                                                    </>
                                                )}
                                                {emailStatus === 'invalid' && (
                                                    <>
                                                        <FaTimes className="text-xs" />
                                                        {emailMessage}
                                                    </>
                                                )}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Phone Number with Real-time Validation */}
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium mb-2" style={{ color: '#063A41' }}>
                                        Phone Number
                                    </label>
                                    <div
                                        className="phone-wrapper flex items-center border-2 rounded-xl overflow-hidden bg-white"
                                        style={{ borderColor: getPhoneBorderColor() }}
                                    >
                                        <div className="pl-3 flex items-center pointer-events-none">
                                            <FaPhone className="input-icon text-sm" />
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-3">
                                            <span className="text-sm font-semibold text-gray-700">+1</span>
                                        </div>
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
                                        {formData.phone.length > 0 && (
                                            <div className="pr-3 flex items-center validation-icon">
                                                {getPhoneIcon()}
                                            </div>
                                        )}
                                    </div>
                                    {phoneMessage && formData.phone.length > 0 && (
                                        <div className="mt-1.5 status-message">
                                            <p
                                                className="text-xs flex items-center gap-1"
                                                style={{ color: getPhoneMessageColor() }}
                                            >
                                                {phoneStatus === 'exists' && (
                                                    <>
                                                        <FaTimes className="text-xs" />
                                                        {phoneMessage}
                                                        <Link
                                                            href="/authentication?openClientLogin=true"
                                                            className="ml-1 underline font-medium hover:no-underline"
                                                        >
                                                            Login instead?
                                                        </Link>
                                                    </>
                                                )}
                                                {phoneStatus === 'available' && (
                                                    <>
                                                        <FaCheck className="text-xs" />
                                                        {phoneMessage}
                                                    </>
                                                )}
                                                {phoneStatus === 'checking' && (
                                                    <>
                                                        <FaSpinner className="text-xs animate-spin" />
                                                        {phoneMessage}
                                                    </>
                                                )}
                                                {phoneStatus === 'invalid' && (
                                                    <>
                                                        <FaTimes className="text-xs" />
                                                        {phoneMessage}
                                                    </>
                                                )}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Postal Code */}
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
                                            <Link href="/terms" className="font-semibold hover:underline" style={{ color: '#109C3D' }}>
                                                Privacy Policy
                                            </Link>
                                        </label>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={
                                        isSendingOtp ||
                                        isLoading ||
                                        !isPasswordStrong ||
                                        !isPostalCodeValid ||
                                        !isEmailValid ||
                                        !isPhoneValid ||
                                        emailStatus === 'checking' ||
                                        phoneStatus === 'checking'
                                    }
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
                                    ) : emailStatus === 'checking' || phoneStatus === 'checking' ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Verifying...
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
                                        {/* Add this spam notice box - using FaExclamationTriangle */}
                                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-start gap-2">
                                            <FaExclamationTriangle className="text-amber-500 text-sm mt-0.5 flex-shrink-0" />
                                            <p className="text-xs text-amber-700">
                                                <span className="font-semibold">Can't find the email?</span> Please check your spam or junk folder.
                                            </p>
                                        </div>
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