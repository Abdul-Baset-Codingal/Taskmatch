/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { FaUserPlus, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock, FaCheckCircle } from "react-icons/fa";
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const checkLoginStatus = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/auth/verify-token", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setIsLoggedIn(true);
                setUserRole(data.user.role);
                console.log("Token verified. User logged in:", data.user);
            } else {
                setIsLoggedIn(false);
                setUserRole(null);
                console.log("Token verification failed. User logged out.");
            }
        } catch (error) {
            setIsLoggedIn(false);
            setUserRole(null);
            console.error("Error verifying token:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!agreed) {
            toast.warning("You must agree to the terms first.");
            return;
        }

        try {
            const res = await signup({ ...formData, role: selectedRole }).unwrap();
            toast.success("Account created successfully!");
            console.log("Signup success:", res);
            await checkLoginStatus();
            router.push("/");
        } catch (error: any) {
            toast.error(error?.data?.message || "Signup failed. Please try again.");
        }
    };

    const headerText = {
        title: "Create Your Client Account",
        subtitle: "Join thousands of people getting tasks done"
    };

    const benefits = [
        { icon: FaCheckCircle, text: "Verified Professionals" },
        { icon: FaCheckCircle, text: "Secure Payments" },
        { icon: FaCheckCircle, text: "24/7 Support" }
    ];

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
            `}</style>

            <Navbar />

            <div className="min-h-screen flex items-center justify-center px-4 py-12 pt-24">
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
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium mb-2" style={{ color: '#063A41' }}>
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaPhone className="input-icon text-sm" />
                                        </div>
                                        <input
                                            id="phone"
                                            type="tel"
                                            required
                                            placeholder="+1 (555) 123-4567"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm input-focus"
                                            style={{ outline: 'none' }}
                                            onFocus={(e) => e.target.style.borderColor = '#109C3D'}
                                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="postalCode" className="block text-sm font-medium mb-2" style={{ color: '#063A41' }}>
                                        Postal Code
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaMapMarkerAlt className="input-icon text-sm" />
                                        </div>
                                        <input
                                            type="text"
                                            id="postalCode"
                                            required
                                            value={formData.postalCode}
                                            onChange={handleChange}
                                            placeholder="12345"
                                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm input-focus"
                                            style={{ outline: 'none' }}
                                            onFocus={(e) => e.target.style.borderColor = '#109C3D'}
                                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                        />
                                    </div>
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
                                        onFocus={(e) => e.target.style.borderColor = '#109C3D'}
                                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
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
                                <p className="text-xs text-gray-500 mt-2">
                                    Must be at least 8 characters long
                                </p>
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
                                        className="mt-1 w-4 h-4 rounded border-gray-300 checkbox-custom"
                                        style={{ accentColor: '#109C3D' }}
                                    />
                                    <label htmlFor="terms" className="text-sm" style={{ color: '#063A41' }}>
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
                                disabled={isLoading}
                                className="w-full text-white font-semibold py-3.5 rounded-xl text-sm btn-gradient"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Creating Account...
                                    </span>
                                ) : (
                                    "Create Client Account"
                                )}
                            </button>

                            {/* Login Link */}
                            <div className="text-center pt-4">
                                <p className="text-sm text-gray-600">
                                    Already have an account?{" "}
                                    <Link href="/authentication" className="font-semibold hover:underline" style={{ color: '#109C3D' }}>
                                        Log in
                                    </Link>
                                </p>
                            </div>
                        </form>

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