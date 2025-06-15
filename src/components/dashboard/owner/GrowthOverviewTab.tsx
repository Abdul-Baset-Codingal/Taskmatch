"use client";

import React from "react";
import {
  FaUserPlus,
  FaCity,
  FaExpandAlt,
  FaRocket,
  FaArrowUp,
} from "react-icons/fa";

const GrowthOverviewTab = () => {
  return (
    <section className="bg-gray-50 text-gray-900 px-6 md:px-16 py-16 rounded-3xl shadow-2xl">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-5xl font-bold mb-4">📈 Growth Overview</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore how TaskMatch is scaling through user growth, revenue
            acceleration, and strategic city expansion.
          </p>
        </div>

        {/* User + Revenue Highlights */}
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <FaUserPlus className="text-pink-500" /> User Acquisition
            </h3>
            <p className="text-gray-700">
              We’ve experienced a{" "}
              <strong className="text-pink-600">+78% growth</strong> in our
              active user base, aiming to reach <strong>15,250 users</strong>{" "}
              this year through targeted marketing and referral incentives.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-pink-200 shadow">
                <h4 className="font-bold text-pink-700 text-xl">6,100</h4>
                <p className="text-sm text-gray-600">Taskers</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-pink-200 shadow">
                <h4 className="font-bold text-pink-700 text-xl">8,390</h4>
                <p className="text-sm text-gray-600">Clients</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <FaRocket className="text-indigo-600" /> Revenue Forecast
            </h3>
            <p className="text-gray-700">
              Forecasted to reach{" "}
              <strong className="text-indigo-700">$18.5M</strong> over the next
              12 months with a steady growth across quarters:
            </p>

            <ul className="grid grid-cols-2 gap-3 text-sm text-gray-700">
              <li>
                Q1: <span className="text-indigo-700 font-semibold">$4.1M</span>
              </li>
              <li>
                Q2: <span className="text-indigo-700 font-semibold">$4.5M</span>
              </li>
              <li>
                Q3: <span className="text-indigo-700 font-semibold">$4.8M</span>
              </li>
              <li>
                Q4: <span className="text-indigo-700 font-semibold">$5.1M</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Ontario Market Expansion - Timeline */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <FaCity className="text-green-600" /> Ontario Market Expansion
            (2024)
          </h3>
          <div className="border-l-4 border-green-300 pl-6 space-y-6 relative">
            <div className="before:absolute before:w-3 before:h-3 before:bg-green-600 before:rounded-full before:-left-1.5 before:top-1">
              <h4 className="font-semibold text-lg">Q1 – Brampton</h4>
              <p className="text-gray-600 text-sm">
                Entered a high-demand suburban region to tap new clients.
              </p>
            </div>
            <div className="before:absolute before:w-3 before:h-3 before:bg-green-600 before:rounded-full before:-left-1.5 before:top-[85px]">
              <h4 className="font-semibold text-lg">Q2 – London, Kitchener</h4>
              <p className="text-gray-600 text-sm">
                Expanding westward for better Ontario footprint.
              </p>
            </div>
            <div className="before:absolute before:w-3 before:h-3 before:bg-green-600 before:rounded-full before:-left-1.5 before:top-[170px]">
              <h4 className="font-semibold text-lg">Q3 – Windsor</h4>
              <p className="text-gray-600 text-sm">
                Launching near border city with logistics advantage.
              </p>
            </div>
            <div className="before:absolute before:w-3 before:h-3 before:bg-green-600 before:rounded-full before:-left-1.5 before:top-[255px]">
              <h4 className="font-semibold text-lg">Q4 – Vaughan</h4>
              <p className="text-gray-600 text-sm">
                Northern GTA expansion to reach enterprise clients.
              </p>
            </div>
          </div>
        </div>

        {/* Engagement + Scalability */}
        <div className="grid md:grid-cols-2 gap-12 mt-16">
          <div className="bg-white border border-cyan-200 rounded-2xl p-6 shadow">
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2 text-cyan-700">
              <FaArrowUp /> Engagement Uplift
            </h3>
            <p className="text-gray-700">
              Platform usage has increased <strong>+22%</strong> thanks to
              improved onboarding, mobile-first experience, and gamified loyalty
              programs.
            </p>
          </div>

          <div className="bg-white border border-purple-200 rounded-2xl p-6 shadow">
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2 text-purple-700">
              <FaExpandAlt /> Product Scalability
            </h3>
            <p className="text-gray-700">
              We’ve boosted capacity by <strong>34%</strong> using containerized
              services and real-time workload orchestration.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GrowthOverviewTab;
