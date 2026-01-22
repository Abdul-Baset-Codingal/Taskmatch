// @ts-nocheck

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { FaHandsHelping, FaUser } from "react-icons/fa";
import { useGetUserByIdQuery } from "@/features/auth/authApi";

const TaskerDashboardSection = () => {
    const router = useRouter(); // Initialize router for navigation
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<{ _id: string; role: string } | null>(null);

    // Check login status
    const checkLoginStatus = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/verify-token`, {
                method: "GET",
                credentials: "include",
            });
            const text = await response.text();
            console.log("Verify token response:", text);
            if (response.ok) {
                const data = JSON.parse(text);
                console.log("Parsed user data:", data);
                setIsLoggedIn(true);
                setUser({ _id: data.user._id, role: data.user.role });
            } else {
                console.error("Verify token failed:", response.status, text);
                setIsLoggedIn(false);
                setUser(null);
            }
        } catch (error) {
            console.error("Error checking login status:", error);
            setIsLoggedIn(false);
            setUser(null);
        }
    };

    useEffect(() => {
        checkLoginStatus();
    }, []);

    const { data: userDetails, error: userError, isFetching, isLoading } = useGetUserByIdQuery(user?._id, {
        skip: !user?._id,
    });

    // Log query status
    useEffect(() => {
        if (userError) {
            console.error("getUserById error:", userError);
        }
        if (userDetails) {
            console.log("getUserById success:", userDetails);
        }
        if (isFetching) {
            console.log("getUserById is fetching...");
        }
    }, [userError, userDetails, isFetching]);

    return (
        <section className="relative w-full mx-auto px-6 md:px-12 py-6 rounded-[2rem] overflow-hidden bg-[#0f1123] shadow-[0_0_60px_#2e2c61] border border-white/10">
            <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-[#8f94fb] opacity-20 rounded-full blur-[120px] z-0"></div>
            <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-[#4e54c8] opacity-20 rounded-full blur-[120px] z-0"></div>

            <div className="relative z-10 grid md:grid-cols-3 gap-8 items-center">
                <div className="col-span-2 bg-white/5 rounded-3xl p-8 shadow-[0_0_30px_rgba(255,255,255,0.05)] border border-white/10 hover:scale-[1.02] transition-all duration-300">
                    {isLoading ? (
                        <p className="text-gray-200">Loading user data...</p>
                    ) : userError ? (
                        <p className="text-red-500">Error loading user data: {(userError as any).data?.error || "Unknown error"}</p>
                    ) : (
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="flex items-center gap-5">
                                    <div className="relative w-24 h-24 rounded-full border-4 border-[#ffffff33] overflow-hidden shadow-xl flex items-center justify-center bg-gray-100">
                                        {userDetails?.profilePicture ? (
                                            <Image
                                                src={userDetails?.profilePicture}
                                                alt="Tasker Profile"
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <FaUser className="w-12 h-12 text-gray-400" />
                                        )}
                                    </div>

                                    <div>
                                        <h2 className="text-4xl font-extrabold text-[#8f94fb] mb-3">
                                            {userDetails?.firstName || "N/A"} {userDetails?.lastName || ""}
                                        </h2>
                                        <p className="text-lg text-gray-200">Professional Tasker</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <FaHandsHelping className="text-[#4e54c8] animate-pulse" size={20} />
                                            <span className="text-lg text-gray-200">Top Rated Tasker</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button
                                    onClick={() => router.push("/dashboard/tasker/edit")} // Navigate to edit route
                                    className="text-white bg-white/20 rounded-3xl px-8 py-4 shadow-[0_0_30px_rgba(255,255,255,0.05)] border border-white/10 hover:bg-white/30 transition-all"
                                    disabled={!userDetails}
                                >
                                    Update Profile
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default TaskerDashboardSection;