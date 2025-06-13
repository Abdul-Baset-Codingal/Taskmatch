"use client";
import React from "react";
import {
  FaEnvelope,
  FaShareAlt,
  FaTwitter,
  FaPaperPlane,
  FaUserPlus,
  FaGift,
  FaUsers,
  FaArrowRight,
} from "react-icons/fa";

const ReferralSection = () => {
  return (
    <section className="py-12 px-4 bg-gradient-to-tr from-[#f0f4ff] via-[#e4ecff] to-[#f7f9ff]">
      <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side */}
        <div className="bg-gradient-to-br from-[#a1c4fd] to-[#c2e9fb] p-10 text-white flex flex-col justify-center relative">
          <div className="absolute top-4 right-4 text-white/30 text-6xl">
            <FaUsers />
          </div>
          <h2 className="text-4xl font-extrabold flex items-center gap-3 mb-4 drop-shadow-md">
            <FaUserPlus className="text-white/90" />
            Refer & Earn Rewards
          </h2>
          <p className="text-lg mb-3">
            Invite friends and both receive{" "}
            <strong className="text-yellow-300 font-bold">$30 credit</strong> on their
            first task!
          </p>
          <div className="mt-6">
            <div className="inline-flex items-center gap-3 bg-white/20 px-6 py-3 rounded-xl font-bold text-xl tracking-wide backdrop-blur-lg shadow-lg border border-white/30">
              <FaGift className="text-yellow-300 text-2xl" />
              MICHAEL30
            </div>
            <p className="text-sm mt-2 opacity-80">Your unique referral code</p>
            <p className="mt-4 text-white font-medium text-base">
              🎉 <span className="font-bold">3 friends</span> have already
              joined using your code!
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="p-10 bg-white flex flex-col justify-center gap-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FaArrowRight className="text-blue-500" /> Share Your Referral Code
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg shadow-lg hover:from-blue-600 hover:to-cyan-600 transition">
              <FaEnvelope /> Email
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white rounded-lg shadow-lg hover:from-purple-600 hover:to-fuchsia-600 transition">
              <FaShareAlt /> Share
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-sky-500 to-blue-400 text-white rounded-lg shadow-lg hover:from-sky-600 hover:to-blue-500 transition">
              <FaTwitter /> Tweet
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-400 to-green-500 text-white rounded-lg shadow-lg hover:from-teal-500 hover:to-green-600 transition">
              <FaPaperPlane /> Send
            </button>
          </div>

          <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition">
            Track Your Referrals
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReferralSection;
