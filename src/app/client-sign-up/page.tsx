/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import Link from "next/link";
import Navbar from "@/shared/Navbar";
import { useSignupMutation } from "@/features/auth/authApi"; // ⬅️ Make sure the path is correct
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const ClientSignupPage = () => {
    const [agreed, setAgreed] = useState(false);
    const [signup, { isLoading }] = useSignupMutation();
    const router = useRouter();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        province: "",
        password: "",
    });

    const provinces = [
        "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador",
        "Nova Scotia", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan"
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!agreed) {
            toast.warning("You must agree to the terms first.");
            return;
        }

        const finalData = {
            ...formData,
            role: "client",
        };

        try {
            const res = await signup(finalData).unwrap();

            // ✅ Set cookie like login
            Cookies.set("token", res.token, {
                expires: 7,
                sameSite: "strict",
                secure: process.env.NODE_ENV === "production",
            });

            toast.success("Account created successfully!");
            console.log("Signup success:", res);

            // Redirect and open login modal (or skip modal since you're already logged in)
            router.push("/");
        } catch (error: any) {
            console.error("Signup error:", error);
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
                        <div>
                            <label htmlFor="fullName" className="block text-sm mb-1 text-gray-900">Full Name</label>
                            <input id="fullName" type="text" required placeholder="Your full name"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-amber-400" />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm mb-1 text-gray-900">Email Address</label>
                            <input id="email" type="email" required placeholder="example@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-amber-400" />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm mb-1 text-gray-900">Phone Number</label>
                            <input id="phone" type="tel" required placeholder="+1 (555) 123-4567"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-amber-400" />
                        </div>

                        <div>
                            <label htmlFor="province" className="block text-sm mb-1 text-gray-900">Province</label>
                            <select id="province" required
                                value={formData.province}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-amber-400">
                                <option value="">Select Province</option>
                                {provinces.map((prov) => (
                                    <option key={prov} value={prov}>{prov}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm mb-1 text-gray-900">Create Password</label>
                            <input id="password" type="password" required placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-amber-400" />
                        </div>

                        <div className="flex items-center gap-2">
                            <input id="terms" type="checkbox" required checked={agreed} onChange={() => setAgreed(!agreed)} />
                            <label htmlFor="terms" className="text-xs text-gray-700">
                                I agree to the{" "}
                                <Link href="/terms" className="text-amber-500 hover:underline">Terms of Service</Link> and{" "}
                                <Link href="/privacy" className="text-amber-500 hover:underline">Privacy Policy</Link>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-amber-400 text-white font-bold py-3 rounded-md hover:bg-amber-500 transition text-sm"
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