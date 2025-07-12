"use client";
import React, { useState } from "react";
import { FaHome, FaBriefcase, FaCheckCircle, FaStar, FaClock, FaShieldAlt, FaFire } from "react-icons/fa";
import Navbar from "@/shared/Navbar";
import ClientLoginModal from "@/components/authentication/ClientLoginModal";
import TaskerLoginModal from "@/components/authentication/TaskerLoginModal";
import TaskerSignupModal from "@/components/authentication/TaskerSignupModal";
import Link from "next/link";

const JoinTaskMatch = () => {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isTaskerModalOpen, setIsTaskerModalOpen] = useState(false);
  const [isTaskerSignupModalOpen, setIsTaskerSignupModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-purple-50">
      <Navbar />
      <div className="flex flex-col items-center justify-center px-4 sm:px-8 py-12 sm:py-16">
        <style>{`
          .fade-in { animation: fadeIn 1s ease-out; }
          .title-glow { animation: textGlow 2s ease-in-out infinite alternate; }
          .card-float:hover {
            transform: translateY(-6px) scale(1.05);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .glass-effect {
            background: rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.4);
            position: relative;
            overflow: hidden;
          }
          .client-card::before, .tasker-card::before {
            content: ''; position: absolute; inset: 0;
            border: 2px solid transparent; z-index: -1;
          }
          .client-card::before {
            border-image: linear-gradient(to right, #FBBF24, #F43F5E) 1;
          }
          .tasker-card::before {
            border-image: linear-gradient(to right, #10B981, #2DD4BF) 1;
          }
          .client-glow:hover { box-shadow: 0 0 20px rgba(255, 147, 0, 0.3); }
          .tasker-glow:hover { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
          .text-fancy {
            font-family: 'Inter', sans-serif;
            letter-spacing: 0.02em;
          }
          .text-premium {
            font-family: 'Playfair Display', serif;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          }
          .icon-pulse {
            animation: pulse 1.5s infinite ease-in-out;
          }
          .icon-pulse:hover {
            transform: scale(1.2);
            transition: transform 0.3s ease;
          }
          .btn-shine {
            position: relative;
            overflow: hidden;
          }
          .btn-shine::after {
            content: '';
            position: absolute;
            top: -50%; left: -50%; width: 200%; height: 200%;
            background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0));
            transform: rotate(45deg);
            transition: transform 0.5s ease;
          }
          .btn-shine:hover::after {
            transform: rotate(45deg) translateX(100%);
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes textGlow {
            from { text-shadow: 0 0 5px rgba(255, 147, 0, 0.5); }
            to { text-shadow: 0 0 10px rgba(255, 147, 0, 0.7); }
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        `}</style>

        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 text-premium fade-in">Join TaskMatch</h1>
          <p className="text-gray-700 mt-4 text-fancy">Choose how you want to use our platform to get started with the right experience</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl w-full">
          {/* Client Card */}
          <div className="glass-effect p-6 sm:p-8 rounded-2xl card-float fade-in client-card client-glow">
            <div className="flex items-center gap-4 mb-6">
              <FaHome className="text-amber-400 text-3xl icon-pulse" />
              <h2 className="text-2xl font-bold text-premium text-gray-900">I Need Help</h2>
            </div>
            <p className="text-gray-800 text-fancy mb-4">Get tasks done by trusted professionals in your area</p>
            <ul className="space-y-2 mb-6 text-gray-800 text-fancy">
              {["Post any task you need help with", "Get quotes from verified professionals", "Secure payment protection", "24/7 customer support"].map((item, i) => (
                <li key={i} className="flex gap-2 items-center">
                  <FaCheckCircle className="text-amber-400 text-sm icon-pulse" /> {item}
                </li>
              ))}
            </ul>
            <Link href={'/client-sign-up'}>
              <button className="w-full bg-gradient-to-r from-amber-400 to-rose-400 text-white font-bold py-3 rounded-md hover:from-amber-500 hover:to-rose-500 transition text-sm text-fancy btn-shine">
                Sign Up as Client
              </button>
            </Link>
          </div>

          {/* Tasker Card */}
          <div className="glass-effect p-6 sm:p-8 rounded-2xl card-float fade-in tasker-card tasker-glow">
            <div className="flex items-center gap-4 mb-6">
              <FaBriefcase className="text-emerald-400 text-3xl icon-pulse" />
              <h2 className="text-2xl font-bold text-premium text-gray-900">Start Earning Today</h2>
            </div>

            <p className="text-gray-800 text-fancy mb-4">
              Turn your skills into income — flexible work on your schedule
            </p>

            <ul className="space-y-2 mb-4 text-gray-800 text-fancy">
              {[FaStar, FaClock, FaShieldAlt, FaFire].map((Icon, i) => {
                const texts = [
                  "High Earnings: $25-$150/hour",
                  "Flexible Hours: Work when you want",
                  "Rating Protection: Fair review system",
                  "Get Featured: Stand out to clients",
                ];
                return (
                  <li key={i} className="flex gap-2 items-center">
                    <Icon className="text-emerald-400 text-sm icon-pulse" />
                    {texts[i]}
                  </li>
                );
              })}
            </ul>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mb-4 text-fancy">
              <div>
                <p className="text-xl font-bold text-emerald-500">50K+</p>
                <p className="text-xs text-gray-600">Active Taskers</p>
              </div>
              <div>
                <p className="text-xl font-bold text-emerald-500">4.8★</p>
                <p className="text-xs text-gray-600">Average Rating</p>
              </div>
              <div>
                <p className="text-xl font-bold text-emerald-500">$2.5M+</p>
                <p className="text-xs text-gray-600">Paid Monthly</p>
              </div>
              <div>
                <p className="text-2xl">🇨🇦</p>
                <p className="text-xs text-gray-600">Canadian Standards</p>
              </div>
            </div>

            {/* Compliance Info */}
            <p className="text-[13px] text-gray-700 mb-4 leading-snug">
              All requirements include <strong>Canadian ID verification</strong>, background checks, and tax compliance support. <br />
              <span className="text-emerald-500 font-medium">Professional licensing assistance</span> available.
            </p>

            <button
              onClick={() => setIsTaskerSignupModalOpen(true)}
              className="w-full bg-gradient-to-r from-emerald-400 to-teal-400 text-white font-bold py-3 rounded-md hover:from-emerald-500 hover:to-teal-500 transition text-sm text-fancy btn-shine"
            >
              Sign Up as Tasker
            </button>
          </div>

        </div>



        {/* Login Section */}
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-700 text-fancy mb-3">Already have an account?</p>
          <div className="flex justify-center gap-6">
            <button
              onClick={() => setIsClientModalOpen(true)}
              className="text-amber-400 hover:text-amber-500 font-bold text-fancy"
            >
              Client Login
            </button>
            <button
              onClick={() => setIsTaskerModalOpen(true)}
              className="text-emerald-400 hover:text-emerald-500 font-bold text-fancy"
            >
              Tasker Login
            </button>
          </div>
        </div>

        {/* Modals */}
        <ClientLoginModal
          isOpen={isClientModalOpen}
          onClose={() => setIsClientModalOpen(false)}
          activeModal={activeModal}
          setActiveModal={setActiveModal}
        />
        <TaskerLoginModal
          isOpen={isTaskerModalOpen}
          onClose={() => setIsTaskerModalOpen(false)}
          activeModal={activeModal}
          setActiveModal={setActiveModal}
        />
        <TaskerSignupModal
          isOpen={isTaskerSignupModalOpen}
          onClose={() => setIsTaskerSignupModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default JoinTaskMatch;
