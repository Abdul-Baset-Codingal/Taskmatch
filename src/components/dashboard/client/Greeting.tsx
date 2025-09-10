/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useGetTasksByClientQuery } from "@/features/api/taskApi";
import { useGetUserByIdQuery } from "@/features/auth/authApi";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaTasks } from "react-icons/fa";

const Greeting = () => {
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
        setIsLoggedIn(true);
        setUser({ _id: data.user._id, role: data.user.role });
      } else {
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

  // Fetch full user details
  const { data: userDetails } = useGetUserByIdQuery(user?._id, {
    skip: !user?._id,
  });

  // ✅ Fetch tasks by logged-in client
  const { data: clientTasks, isLoading: tasksLoading } = useGetTasksByClientQuery(undefined, {
    skip: !isLoggedIn, // only fetch if logged in
  });

  // ✅ Filter "in progress" tasks
  const inProgressTasks = clientTasks?.filter((task: any) => task.status === "in progress") || [];

  return (
    <section className="relative mx-auto px-6 md:px-12 py-6 rounded-[2rem] overflow-hidden bg-[#0f1123] shadow-[0_0_60px_#2e2c61] border border-white/10">
      {/* Background gradient blobs */}
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-[#8f94fb] opacity-20 rounded-full blur-[120px] z-0"></div>
      <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-[#4e54c8] opacity-20 rounded-full blur-[120px] z-0"></div>

      {/* Content */}
      <div className="relative z-10 grid md:grid-cols-3 gap-8 items-center">
        {/* Info Block */}
        <div className="col-span-2 bg-white/5 rounded-3xl p-8 shadow-[0_0_30px_rgba(255,255,255,0.05)] border border-white/10 hover:scale-[1.02] transition-all duration-300">
          <h2 className="text-4xl font-extrabold text-[#8f94fb] mb-3">
            Welcome back,{" "}
            <span className="text-[#4e54c8]">{userDetails?.fullName}!</span>
          </h2>

          <p className="text-lg text-gray-200">
            🎯 You have{" "}
            <span className="font-bold text-[#8f94fb]">
              {tasksLoading ? "..." : inProgressTasks.length}
            </span>{" "}
            tasks in progress
            <br />
          </p>
        </div>

        {/* Button Block */}
        <div className="flex justify-center md:justify-end">
          <Link href={"/urgent-task"}>
            <button className="flex items-center gap-2 bg-gradient-to-r from-[#8f94fb] to-[#4e54c8] text-white px-6 py-3 rounded-full font-bold shadow-xl hover:scale-105 transition">
              <FaTasks size={20} />
              Post a Task
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Greeting;
