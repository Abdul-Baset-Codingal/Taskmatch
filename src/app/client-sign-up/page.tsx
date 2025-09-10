/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import Link from "next/link";
import Navbar from "@/shared/Navbar";
import { useSignupMutation } from "@/features/auth/authApi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const ClientSignupPage = () => {
    const [agreed, setAgreed] = useState(false);
    const [signup, { isLoading }] = useSignupMutation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
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
            const response = await fetch("https://taskmatch-backend.vercel.app/api/auth/verify-token", {
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
            const res = await signup({ ...formData, role: "client" }).unwrap();

            toast.success("Account created successfully!");
            console.log("Signup success:", res);

            await checkLoginStatus();
            router.push("/");
        } catch (error: any) {
            toast.error(error?.data?.message || "Signup failed. Please try again.");
        }
    };

    return (
        <div>
            <Navbar />

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#8B65F2] to-[#E4B3FF] px-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8 my-5">

                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold text-amber-500 flex justify-center items-center gap-2">
                            <FaUserPlus />
                            Create Client Account
                        </h2>
                        <p className="text-sm text-gray-700 mt-1">
                            Join thousands of people getting tasks done
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* First Name and Last Name in a grid */}
                        <div className="grid grid-cols-1  gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm mb-1 text-gray-900">First Name</label>
                                <input
                                    id="firstName"
                                    type="text"
                                    required
                                    placeholder="First name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-amber-400"
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm mb-1 text-gray-900">Last Name</label>
                                <input
                                    id="lastName"
                                    type="text"
                                    required
                                    placeholder="Last name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-amber-400"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm mb-1 text-gray-900">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                required
                                placeholder="example@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-amber-400"
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm mb-1 text-gray-900">Phone Number</label>
                            <input
                                id="phone"
                                type="tel"
                                required
                                placeholder="+1 (555) 123-4567"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-amber-400"
                            />
                        </div>

                        <div>
                            <label htmlFor="postalCode" className="block text-sm mb-1 text-gray-900">
                                Postal Code
                            </label>
                            <input
                                type="text"
                                id="postalCode"
                                required
                                value={formData.postalCode}
                                onChange={handleChange}
                                placeholder="Enter your postal code"
                                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-amber-400"
                            />
                        </div>

                        <div className="relative">
                            <label htmlFor="password" className="block text-sm mb-1 text-gray-900">
                                Create Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-amber-400"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                id="terms"
                                type="checkbox"
                                required
                                checked={agreed}
                                onChange={() => setAgreed(!agreed)}
                            />
                            <label htmlFor="terms" className="text-xs text-gray-700">
                                I agree to the{" "}
                                <Link href="/terms" className="text-amber-500 hover:underline">Terms of Service</Link> and{" "}
                                <Link href="/privacy" className="text-amber-500 hover:underline">Privacy Policy</Link>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-amber-400 text-white font-bold py-3 rounded-md hover:bg-amber-500 transition text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Creating Account..." : "Create Account"}
                        </button>

                        <p className="text-xs text-center text-gray-700">
                            Already have an account?{" "}
                            <Link href="/login/client" className="text-amber-400 hover:text-amber-500 font-semibold">
                                Log in
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
            <ToastContainer position="top-center" autoClose={3000} />
        </div>
    );
};

export default ClientSignupPage;