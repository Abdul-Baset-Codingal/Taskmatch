"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaHandsHelping, FaUser } from "react-icons/fa";
import { useGetUserByIdQuery } from "@/features/auth/authApi";

const TaskerDashboardSection = () => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<{ _id: string; role: string } | null>(null);


    // Check login status
    const checkLoginStatus = async () => {
        try {
            const response = await fetch("https://taskmatch-backend.vercel.app/api/auth/verify-token", {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Verify Token Response:', data);
                setIsLoggedIn(true);
                setUser({ _id: data.user._id, role: data.user.role });
            } else {
                setIsLoggedIn(false);
                setUser(null);
            }
        } catch (error) {
            console.error('Error checking login status:', error);
            setIsLoggedIn(false);
            setUser(null);
        }
    };

    useEffect(() => {
        checkLoginStatus();
    }, []);


    const { data: userDetails} = useGetUserByIdQuery(user?._id, {
        skip: !user?._id, // don't run until we have an id
    });



    return (
        <section className="relative mx-auto px-6 md:px-12 py-6 rounded-[2rem] overflow-hidden bg-[#0f1123] shadow-[0_0_60px_#2e2c61] border border-white/10">
            {/* Background gradient blobs */}
            <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-[#8f94fb] opacity-20 rounded-full blur-[120px] z-0"></div>
            <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-[#4e54c8] opacity-20 rounded-full blur-[120px] z-0"></div>

            {/* Content */}
            <div className="relative z-10 grid md:grid-cols-3 gap-8 items-center">
                {/* Info Block */}
                <div className="col-span-2 bg-white/5 rounded-3xl p-8 shadow-[0_0_30px_rgba(255,255,255,0.05)] border border-white/10 hover:scale-[1.02] transition-all duration-300">
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
                                {userDetails?.fullName}
                            </h2>
                            <p className="text-lg text-gray-200">
                                Professional Tasker
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <FaHandsHelping className="text-[#4e54c8] animate-pulse" size={20} />
                                <span className="text-lg text-gray-200">
                                    Top Rated Tasker
                                </span>
                            </div>
                        </div>
                    </div>

                </div>

                
            </div>
        </section>
    );
};

export default TaskerDashboardSection;