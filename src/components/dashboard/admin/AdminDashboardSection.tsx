"use client";

import React from "react";
import Image from "next/image";
import { FaUserEdit, FaPlus, FaQuestionCircle, FaStar } from "react-icons/fa";
import client1 from "../../../../public/Images/clientImage1.jpg";

const AdminDashboardSection = () => {
  return (
    <section className="relative max-w-7xl mx-auto mt-24 px-6 md:px-12 py-20 rounded-[2rem] overflow-hidden bg-[#0f1123] shadow-[0_0_60px_#2e2c61] border border-white/10">
      {/* Background gradient blob */}
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-[#8f94fb] opacity-20 rounded-full blur-[120px] z-0"></div>
      <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-[#4e54c8] opacity-20 rounded-full blur-[120px] z-0"></div>

      {/* Content */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        {/* Left Panel - User Card */}
        <div className="bg-white/5 rounded-3xl p-8 shadow-[0_0_30px_rgba(255,255,255,0.05)] border border-white/10 hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center gap-5">
            <div className="relative w-24 h-24 rounded-full border-4 border-[#ffffff33] overflow-hidden shadow-xl">
              <Image
                src={client1}
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl text-white font-bold">Michael Robertson</h2>
              <p className="text-sm text-gray-300 mt-1">System Administrator</p>
              <div className="flex items-center gap-2 mt-2">
                <FaStar className="text-yellow-400 animate-pulse" />
                <span className="text-sm text-white/80">Pro User</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-8">
            <button className="flex items-center gap-2 bg-gradient-to-r from-purple-400 to-blue-400 text-white px-5 py-2 rounded-full font-medium shadow-md hover:scale-105 transition-all duration-200">
              <FaUserEdit />
              Edit Profile
            </button>
            <button className="flex items-center gap-2 text-white/80 hover:text-white hover:underline transition">
              <FaQuestionCircle />
              Help
            </button>
          </div>
        </div>

        {/* Right Panel - Call to Action */}
        <div className="flex flex-col md:items-end gap-6">
          <div className="bg-gradient-to-br from-[#ffffff22] to-[#ffffff08] p-6 rounded-2xl backdrop-blur-md border border-white/10 text-right shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-white">
              Welcome to Admin Panel
            </h3>
            <p className="text-gray-300 text-sm">
              Manage users, handle tasks, and monitor system stats from here.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-white text-[#4e54c8] px-6 py-3 rounded-full font-bold shadow-xl hover:scale-105 transition">
            <FaPlus />
            New User
          </button>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboardSection;
