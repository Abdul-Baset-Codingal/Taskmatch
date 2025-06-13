"use client";
import React from "react";
import { FaCrown, FaArrowRight, FaCheckCircle } from "react-icons/fa";
import {
  GiSilverBullet,
  GiGoldBar,
  GiDiamondHard,
} from "react-icons/gi";

const TaskMatchRewards = () => {
  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto bg-gradient-to-br from-purple-200 via-white to-blue-200 rounded-3xl shadow-2xl p-10 relative overflow-hidden backdrop-blur-xl border border-gray-300">
        {/* Decorative Background Icon */}
        <div className="absolute right-5 top-5 text-purple-300 opacity-10 text-[140px] pointer-events-none">
          <FaCrown />
        </div>

        <div className="relative z-10 text-center space-y-8">
          <h2 className="text-4xl font-bold text-purple-800">
            Your TaskMatch Rewards
          </h2>

          {/* Tier Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-purple-100 border border-purple-400 rounded-full text-purple-700 font-semibold shadow-md">
            <FaCrown /> Silver Tier
          </div>

          {/* Member Status */}
          <p className="text-lg text-gray-800 font-medium w-full">
            <strong>Silver Member Status:</strong> 8 tasks completed, 4 more to
            Gold
          </p>

          {/* Progress Bar with Tiers & Icons */}
          <div className="text-left max-w-4xl mx-auto space-y-3">
            <p className="text-gray-700 font-semibold">65% to Gold Tier</p>
            <div className="relative w-full h-5 rounded-full bg-gradient-to-r from-gray-100 via-white to-gray-200 shadow-inner overflow-hidden">
              <div
                className="absolute h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 transition-all duration-700"
                style={{ width: "65%" }}
              />
            </div>

            {/* Tier Markers with Icons */}
            <div className="flex justify-between mt-2 text-sm text-gray-700 font-medium">
              <div className="flex items-center gap-1">
                <GiSilverBullet className="text-yellow-700" /> Bronze
              </div>
              <div className="flex items-center gap-1">
                <GiSilverBullet className="text-gray-500" /> Silver
              </div>
              <div className="flex items-center gap-1">
                <GiGoldBar className="text-yellow-500" /> Gold
              </div>
              <div className="flex items-center gap-1">
                <GiDiamondHard className="text-blue-500" /> Platinum
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="text-left max-w-4xl mx-auto mt-6 space-y-4">
            <h3 className="text-2xl font-semibold text-purple-700 mb-2">
              Silver Tier Benefits
            </h3>
            <ul className="grid sm:grid-cols-2 gap-3 text-gray-800 text-base">
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                Priority customer support
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                5% bonus points on all tasks
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                Access to exclusive taskers
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                Special member-only promotions
              </li>
            </ul>
          </div>

          {/* CTA Button */}
          <button className="mt-6 inline-flex items-center gap-3 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white text-lg font-semibold rounded-xl shadow transition">
            View All Membership Perks <FaArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TaskMatchRewards;
