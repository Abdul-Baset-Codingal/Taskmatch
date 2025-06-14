"use client";

import React from "react";
import {
  FaExclamationCircle,
  FaUserShield,
} from "react-icons/fa";

const SystemReportCards = () => {
  return (
    <div className="max-w-7xl mx-auto mt-16 px-6 py-12 rounded-3xl bg-gradient-to-r from-[#FF4B4B] to-[#FC6969] text-white shadow-[0_0_30px_#fc5c5c80] space-y-8">
      <h2 className="text-3xl font-bold text-white mb-4">
        SYSTEM REPORTS - Issues Requiring Attention
      </h2>

      {/* Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1 - High Priority */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-md border border-white/20 hover:scale-[1.02] transition">
          <div className="flex items-center justify-between mb-3">
            <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-sm">
              HIGH PRIORITY
            </span>
            <span className="text-sm text-white/80 font-bold">
              Reported: 2 hours ago
            </span>
          </div>
          <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
            <FaExclamationCircle className="text-yellow-300" />
            Payment Processing Error
          </h3>
          <p className="text-sm text-white/80 mb-3">
            Module: <span className="text-white">Payment Gateway</span>
          </p>
          <p className="text-sm leading-relaxed text-white/90 mb-4">
            Multiple users experiencing failed payment transactions. Error logs
            show API timeout with payment processor. Affecting approximately 15%
            of transactions.
          </p>
          <div className="flex gap-4">
            <button className="bg-white text-[#FF4B4B] px-4 py-2 rounded-full font-semibold hover:bg-white/90 transition">
              Assign
            </button>
            <button className="bg-transparent border border-white text-white px-4 py-2 rounded-full font-semibold hover:bg-white/20 transition">
              Resolve Issue
            </button>
          </div>
        </div>

        {/* Card 2 - Medium Priority */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-md border border-white/20 hover:scale-[1.02] transition">
          <div className="flex items-center justify-between mb-3">
            <span className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-sm">
              MEDIUM PRIORITY
            </span>
            <span className="text-sm text-white/80 font-bold">
              Reported: 5 hours ago
            </span>
          </div>
          <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
            <FaUserShield className="text-white" />
            User Account Verification
          </h3>
          <p className="text-sm text-white/80 mb-3">
            Module: <span className="text-white">User Authentication</span>
          </p>
          <p className="text-sm leading-relaxed text-white/90 mb-4">
            Email verification links not being received by some users. Support
            has received 12 tickets related to this issue in the last 24 hours.
          </p>
          <div className="flex gap-4">
            <button className="bg-white text-[#FF4B4B] px-4 py-2 rounded-full font-semibold hover:bg-white/90 transition">
              Assign
            </button>
            <button className="bg-transparent border border-white text-white px-4 py-2 rounded-full font-semibold hover:bg-white/20 transition">
              Resolve Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemReportCards;
