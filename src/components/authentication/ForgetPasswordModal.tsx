// @ts-nocheck
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { FaTimes, FaEnvelope, FaArrowLeft, FaLock, FaCheck, FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast } from "react-toastify";
import Link from "next/link";
import {
    useForgotPasswordMutation,
    useVerifyResetOtpMutation,
    useResetPasswordMutation,
    useResendResetOtpMutation,
} from "@/features/auth/authApi";

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBackToLogin: () => void;
}

type Step = "email" | "otp" | "reset" | "success";

// Email validation status type
type EmailStatus = 'idle' | 'checking' | 'exists' | 'not-found' | 'invalid';

// Debounce hook
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

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
    isOpen,
    onClose,
    onBackToLogin,
}) => {
    const originalOverflow = useRef<string>("");
    const [step, setStep] = useState<Step>("email");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resetToken, setResetToken] = useState("");
    const [resendTimer, setResendTimer] = useState(0);

    // Password error state for same password validation
    const [passwordError, setPasswordError] = useState<string>("");

    // Email validation states
    const [emailStatus, setEmailStatus] = useState<EmailStatus>('idle');
    const [emailMessage, setEmailMessage] = useState('');
    const [emailFocused, setEmailFocused] = useState(false);

    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    // RTK Query mutations
    const [forgotPassword, { isLoading: isSendingEmail }] = useForgotPasswordMutation();
    const [verifyResetOtp, { isLoading: isVerifying }] = useVerifyResetOtpMutation();
    const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();
    const [resendResetOtp, { isLoading: isResending }] = useResendResetOtpMutation();

    // Password strength
    const [passwordStrength, setPasswordStrength] = useState({
        hasMinLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
    });


    // Debounce email input (500ms delay)
    const debouncedEmail = useDebounce(email, 500);

    // Email format validation
    const isValidEmailFormat = (emailValue: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(emailValue);
    };

    // Check email existence (for forgot password, email should EXIST)
    const checkEmailExists = useCallback(async (emailValue: string) => {
        if (!emailValue || !isValidEmailFormat(emailValue)) {
            if (emailValue && !isValidEmailFormat(emailValue)) {
                setEmailStatus('invalid');
                setEmailMessage('Please enter a valid email address');
            } else {
                setEmailStatus('idle');
                setEmailMessage('');
            }
            return;
        }

        setEmailStatus('checking');
        setEmailMessage('Checking email...');

        try {
            const response = await fetch(
                `/api/auth/check-email?email=${encodeURIComponent(emailValue)}`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            const data = await response.json();

            if (data.exists) {
                setEmailStatus('exists');
                setEmailMessage('Email found! You can reset your password.');
            } else if (data.valid === false) {
                setEmailStatus('invalid');
                setEmailMessage('Please enter a valid email address');
            } else {
                setEmailStatus('not-found');
                setEmailMessage('No account found with this email');
            }
        } catch (error) {
            console.error('Error checking email:', error);
            setEmailStatus('idle');
            setEmailMessage('');
        }
    }, []);

    // Effect to check email when debounced value changes
    useEffect(() => {
        if (step === 'email') {
            checkEmailExists(debouncedEmail);
        }
    }, [debouncedEmail, checkEmailExists, step]);

    // Check if email is valid for submission (email must exist)
    const isEmailValidForReset = emailStatus === 'exists';

    useEffect(() => {
        if (isOpen) {
            originalOverflow.current = document.body.style.overflow || "auto";
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = originalOverflow.current || "auto";
        }
        return () => {
            document.body.style.overflow = originalOverflow.current || "auto";
        };
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) handleClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    // Resend timer countdown
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    // Password strength checker
    useEffect(() => {
        setPasswordStrength({
            hasMinLength: newPassword.length >= 8,
            hasUppercase: /[A-Z]/.test(newPassword),
            hasLowercase: /[a-z]/.test(newPassword),
            hasNumber: /[0-9]/.test(newPassword),
        });
    }, [newPassword]);

    const handleClose = () => {
        document.body.style.overflow = originalOverflow.current || "auto";
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setStep("email");
        setEmail("");
        setOtp(["", "", "", "", "", ""]);
        setNewPassword("");
        setConfirmPassword("");
        setResetToken("");
        setResendTimer(0);
        setEmailStatus('idle');
        setEmailMessage('');
        setPasswordError(""); // Reset password error
    };

    // Handle email change
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmailStatus('idle');
        setEmailMessage('');
        setEmail(value);
    };

    // Handle new password change - clear error when user types
    const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewPassword(value);
        // Clear the password error when user starts typing
        if (passwordError) {
            setPasswordError("");
        }
    };

    // Handle OTP input
    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) {
            const pastedValue = value.slice(0, 6).split("");
            const newOtp = [...otp];
            pastedValue.forEach((char, i) => {
                if (index + i < 6) newOtp[index + i] = char;
            });
            setOtp(newOtp);
            const nextIndex = Math.min(index + pastedValue.length, 5);
            otpRefs.current[nextIndex]?.focus();
            return;
        }

        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    // Step 1: Send email
    const handleSendEmail = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isEmailValidForReset) {
            if (emailStatus === 'not-found') {
                toast.error("No account found with this email. Please check and try again.");
            } else if (emailStatus === 'invalid') {
                toast.warning("Please enter a valid email address.");
            } else if (emailStatus === 'checking') {
                toast.info("Please wait while we verify your email.");
            } else {
                toast.warning("Please enter your email address.");
            }
            return;
        }

        try {
            await forgotPassword({ email }).unwrap();
            toast.success("Reset code sent to your email!");
            setStep("otp");
            setResendTimer(60);
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to send reset code");
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpValue = otp.join("");
        if (otpValue.length !== 6) {
            toast.error("Please enter the complete 6-digit code");
            return;
        }

        try {
            const result = await verifyResetOtp({ email, otp: otpValue }).unwrap();
            if (result.resetToken) {
                setResetToken(result.resetToken);
            }
            toast.success("Code verified successfully!");
            setStep("reset");
        } catch (error: any) {
            toast.error(error?.data?.message || "Invalid code");
        }
    };

    // Step 3: Reset password
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        // Clear any previous password error
        setPasswordError("");

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        const requestData = {
            email,
            otp: otp.join(""),
            resetToken,
            newPassword,
            confirmPassword,
        };

        try {
            await resetPassword(requestData).unwrap();
            toast.success("Password reset successful! 🎉");
            setStep("success");
        } catch (error: any) {
            const errorMessage = error?.data?.message || "Failed to reset password";

            // Check if the error is about same/current password
            if (errorMessage.toLowerCase().includes("same") ||
                errorMessage.toLowerCase().includes("current password") ||
                errorMessage.toLowerCase().includes("previous password") ||
                errorMessage.toLowerCase().includes("already") ||
                errorMessage.toLowerCase().includes("different")) {
                // Show inline error instead of toast
                setPasswordError("This is already your current password. Please choose a different password.");
                // Clear password fields
                setNewPassword("");
                setConfirmPassword("");
            } else if (errorMessage.toLowerCase().includes("expired")) {
                toast.error("⏰ " + errorMessage);
                setStep("email");
                resetForm();
            } else if (errorMessage.toLowerCase().includes("invalid")) {
                toast.error("❌ " + errorMessage);
            } else {
                toast.error(errorMessage);
            }
        }
    };

    // Resend OTP
    const handleResendOtp = async () => {
        try {
            await resendResetOtp({ email }).unwrap();
            toast.success("New code sent!");
            setResendTimer(60);
            setOtp(["", "", "", "", "", ""]);
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to resend code");
        }
    };

    const getStrengthScore = () => Object.values(passwordStrength).filter(Boolean).length;

    const getStrengthColor = () => {
        const score = getStrengthScore();
        if (score <= 1) return "bg-red-500";
        if (score <= 2) return "bg-yellow-500";
        if (score <= 3) return "bg-blue-500";
        return "bg-green-500";
    };

    // Get email input styles based on status
    const getEmailBorderColor = () => {
        if (!emailFocused && email.length === 0) {
            return '#e5e7eb';
        }
        if (emailFocused && emailStatus === 'idle') {
            return '#109C3D';
        }
        switch (emailStatus) {
            case 'checking':
                return '#3b82f6';
            case 'exists':
                return '#109C3D';
            case 'not-found':
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
            case 'exists':
                return <FaCheck className="text-sm" style={{ color: '#109C3D' }} />;
            case 'not-found':
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
            case 'exists':
                return '#109C3D';
            case 'not-found':
            case 'invalid':
                return '#ef4444';
            default:
                return '#6b7280';
        }
    };

    // Get password input border color based on error state
    const getPasswordBorderColor = () => {
        if (passwordError) {
            return '#ef4444'; // Red when there's an error
        }
        return '#e5e7eb'; // Default gray
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4"
            onClick={handleClose}
        >
            <style>{`
        .brand-gradient { background: linear-gradient(135deg, #063A41 0%, #109C3D 100%); }
        .btn-gradient { background: linear-gradient(135deg, #109C3D 0%, #0db53a 100%); transition: all 0.3s ease; }
        .btn-gradient:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(16, 156, 61, 0.3); }
        .btn-gradient:disabled { opacity: 0.7; cursor: not-allowed; }
        .input-focus:focus { border-color: #109C3D; box-shadow: 0 4px 12px rgba(16, 156, 61, 0.15); }
        .input-error { border-color: #ef4444 !important; }
        .input-error:focus { border-color: #ef4444 !important; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15) !important; }
        .otp-input { width: 48px; height: 56px; text-align: center; font-size: 24px; font-weight: bold; }
        .email-wrapper {
          transition: all 0.3s ease;
        }
        .email-wrapper:focus-within {
          box-shadow: 0 4px 12px rgba(16, 156, 61, 0.15);
        }
        .email-input:focus {
          outline: none;
        }
        .email-status-message {
          animation: fadeIn 0.2s ease-out;
        }
        .password-error-box {
          animation: shake 0.5s ease-in-out, fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .validation-icon {
          transition: all 0.2s ease;
        }
      `}</style>

            <div
                className="bg-white w-full max-w-md rounded-2xl relative shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-10 text-white hover:text-gray-200 transition p-2 rounded-full hover:bg-white/10"
                    aria-label="Close modal"
                >
                    <FaTimes className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="brand-gradient pt-8 pb-12 px-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        {step === "success" ? (
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : step === "reset" ? (
                            <FaLock className="text-3xl text-white" />
                        ) : (
                            <FaEnvelope className="text-3xl text-white" />
                        )}
                    </div>
                    <h2 className="text-2xl text-white font-bold">
                        {step === "email" && "Forgot Password?"}
                        {step === "otp" && "Enter Code"}
                        {step === "reset" && "Reset Password"}
                        {step === "success" && "Password Reset!"}
                    </h2>
                    <p className="text-white/90 mt-2 text-sm">
                        {step === "email" && "Enter your email to receive a reset code"}
                        {step === "otp" && "We sent a 6-digit code to your email"}
                        {step === "reset" && "Create a new secure password"}
                        {step === "success" && "Your password has been updated"}
                    </p>
                </div>

                <div className="px-6 sm:px-8 py-8 -mt-6 bg-white rounded-t-3xl">
                    {/* Step 1: Email with Real-time Validation */}
                    {step === "email" && (
                        <form onSubmit={handleSendEmail} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: "#063A41" }}>
                                    Email Address
                                </label>
                                <div
                                    className="email-wrapper flex items-center border-2 rounded-xl overflow-hidden bg-white"
                                    style={{ borderColor: getEmailBorderColor() }}
                                >
                                    <div className="pl-3 flex items-center pointer-events-none">
                                        <FaEnvelope className="text-sm" style={{ color: "#109C3D" }} />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        onFocus={() => setEmailFocused(true)}
                                        onBlur={() => setEmailFocused(false)}
                                        className="email-input flex-1 px-3 py-3 text-sm bg-transparent border-none"
                                        placeholder="Enter your email"
                                        required
                                    />
                                    {email.length > 0 && (
                                        <div className="pr-3 flex items-center validation-icon">
                                            {getEmailIcon()}
                                        </div>
                                    )}
                                </div>

                                {emailMessage && email.length > 0 && (
                                    <div className="mt-1.5 email-status-message">
                                        <p
                                            className="text-xs flex items-center gap-1"
                                            style={{ color: getEmailMessageColor() }}
                                        >
                                            {emailStatus === 'not-found' && (
                                                <>
                                                    <FaTimes className="text-xs" />
                                                    {emailMessage}
                                                    <span className="ml-1">
                                                        <Link
                                                            href="/client-sign-up"
                                                            className="underline font-medium hover:no-underline"
                                                            onClick={handleClose}
                                                        >
                                                            Create account?
                                                        </Link>
                                                    </span>
                                                </>
                                            )}
                                            {emailStatus === 'exists' && (
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

                            <button
                                type="submit"
                                className="w-full text-white font-semibold py-3.5 rounded-xl text-sm btn-gradient"
                                disabled={isSendingEmail || !isEmailValidForReset || emailStatus === 'checking'}
                            >
                                {isSendingEmail ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Sending...
                                    </span>
                                ) : emailStatus === 'checking' ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Verifying Email...
                                    </span>
                                ) : (
                                    "Send Reset Code"
                                )}
                            </button>
                        </form>
                    )}

                    {/* Step 2: OTP Verification */}
                    {step === "otp" && (
                        <form onSubmit={handleVerifyOtp} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium mb-3 text-center" style={{ color: "#063A41" }}>
                                    Enter the 6-digit code sent to <br />
                                    <span className="font-semibold">{email}</span>
                                </label>
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-start gap-2">
                                    <FaExclamationTriangle className="text-amber-500 text-sm mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-amber-700">
                                        <span className="font-semibold">Can't find the email?</span> Please check your spam or junk folder.
                                    </p>
                                </div>

                                <div className="flex justify-center gap-2">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => { otpRefs.current[index] = el; }}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={6}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                            className="otp-input border-2 border-gray-200 rounded-xl input-focus outline-none"
                                        />
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full text-white font-semibold py-3.5 rounded-xl text-sm btn-gradient"
                                disabled={isVerifying || otp.join("").length !== 6}
                            >
                                {isVerifying ? "Verifying..." : "Verify Code"}
                            </button>

                            <div className="text-center">
                                {resendTimer > 0 ? (
                                    <p className="text-sm text-gray-500">
                                        Resend code in <span className="font-semibold">{resendTimer}s</span>
                                    </p>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={isResending}
                                        className="text-sm font-semibold hover:underline"
                                        style={{ color: "#109C3D" }}
                                    >
                                        {isResending ? "Sending..." : "Resend Code"}
                                    </button>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => setStep("email")}
                                className="w-full text-sm text-gray-600 hover:underline"
                            >
                                Use a different email
                            </button>
                        </form>
                    )}

                    {/* Step 3: Reset Password */}
                    {step === "reset" && (
                        <form onSubmit={handleResetPassword} className="space-y-5">
                            {/* Same Password Error Alert Box */}
                            {passwordError && (
                                <div className="password-error-box bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                        <FaExclamationTriangle className="text-red-500 text-sm" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-red-800">
                                            Same Password Detected
                                        </p>
                                        <p className="text-xs text-red-600 mt-0.5">
                                            {passwordError}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setPasswordError("")}
                                        className="flex-shrink-0 text-red-400 hover:text-red-600 transition"
                                    >
                                        <FaTimes className="text-xs" />
                                    </button>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: "#063A41" }}>
                                    New Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="text-sm" style={{ color: passwordError ? "#ef4444" : "#109C3D" }} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={handleNewPasswordChange}
                                        className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl text-sm outline-none transition-all duration-200 ${passwordError
                                            ? 'input-error border-red-400 focus:border-red-400'
                                            : 'border-gray-200 input-focus'
                                            }`}
                                        placeholder="Enter new password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                                    </button>
                                </div>

                                {/* Password Strength */}
                                {newPassword && !passwordError && (
                                    <div className="mt-2">
                                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${getStrengthColor()} transition-all duration-300`}
                                                style={{ width: `${(getStrengthScore() / 4) * 100}%` }}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-1 mt-2 text-xs">
                                            <span className={passwordStrength.hasMinLength ? "text-green-600" : "text-gray-400"}>
                                                ✓ 8+ characters
                                            </span>
                                            <span className={passwordStrength.hasUppercase ? "text-green-600" : "text-gray-400"}>
                                                ✓ Uppercase
                                            </span>
                                            <span className={passwordStrength.hasLowercase ? "text-green-600" : "text-gray-400"}>
                                                ✓ Lowercase
                                            </span>
                                            <span className={passwordStrength.hasNumber ? "text-green-600" : "text-gray-400"}>
                                                ✓ Number
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: "#063A41" }}>
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="text-sm" style={{ color: "#109C3D" }} />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl text-sm input-focus outline-none"
                                        placeholder="Confirm new password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                                    </button>
                                </div>
                                {confirmPassword && (
                                    <p className={`mt-1 text-xs ${newPassword === confirmPassword ? "text-green-500" : "text-red-500"}`}>
                                        {newPassword === confirmPassword ? "Passwords match ✓" : "Passwords do not match"}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full text-white font-semibold py-3.5 rounded-xl text-sm btn-gradient"
                                disabled={isResetting || newPassword !== confirmPassword || newPassword.length < 8}
                            >
                                {isResetting ? "Resetting..." : "Reset Password"}
                            </button>
                        </form>
                    )}

                    {/* Step 4: Success */}
                    {step === "success" && (
                        <div className="text-center space-y-4">
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                <p className="text-sm text-green-800">
                                    Your password has been successfully reset. You can now login with your new password.
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    resetForm();
                                    onBackToLogin();
                                }}
                                className="w-full text-white font-semibold py-3.5 rounded-xl text-sm btn-gradient"
                            >
                                Back to Login
                            </button>
                        </div>
                    )}

                    {/* Back to Login (for non-success steps) */}
                    {step !== "success" && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <button
                                onClick={() => {
                                    resetForm();
                                    onBackToLogin();
                                }}
                                className="w-full flex items-center justify-center gap-2 text-sm font-medium transition hover:underline"
                                style={{ color: "#063A41" }}
                            >
                                <FaArrowLeft className="text-xs" />
                                Back to Login
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordModal;