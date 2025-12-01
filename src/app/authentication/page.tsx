/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect, Suspense } from "react";
import { FaHome, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import Navbar from "@/shared/Navbar";
import ClientLoginModal from "@/components/authentication/ClientLoginModal";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import loginImage from "../../../public/Images/taskMatch works.jpg";

const OpenClientLoginOnQuery = ({ setIsClientModalOpen }: { setIsClientModalOpen: (val: boolean) => void }) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) return;
    const shouldOpen = searchParams.get("openClientLogin");
    if (shouldOpen === "true") {
      setIsClientModalOpen(true);
    }
  }, [searchParams]);

  return null;
};

const JoinTaskMatch = () => {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <style>{`
        .slide-in-left {
          animation: slideInLeft 0.8s ease-out;
        }
        .slide-in-right {
          animation: slideInRight 0.8s ease-out;
        }
        .fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(6, 58, 65, 0.15);
        }
        .brand-gradient {
          background: linear-gradient(135deg, #063A41 0%, #109C3D 100%);
        }
        .accent-gradient {
          background: linear-gradient(135deg, #109C3D 0%, #0db53a 100%);
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .image-overlay {
          position: relative;
        }
        .image-overlay::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(6, 58, 65, 0.7) 0%, rgba(16, 156, 61, 0.5) 100%);
        }
        .check-icon {
          min-width: 20px;
        }
      `}</style>

      <div className="flex min-h-screen ">
        <Suspense fallback={null}>
          <OpenClientLoginOnQuery setIsClientModalOpen={setIsClientModalOpen} />
        </Suspense>

        {/* Left Side - Image Section */}
        <div className="hidden lg:flex lg:w-1/2 relative image-overlay">
          <Image
            src={loginImage}
            alt="TaskMatch"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 z-10 flex items-center justify-center p-12">
            <div className="text-center slide-in-left">
              <h2 className="text-4xl xl:text-5xl font-bold text-white mb-6">
                Welcome to TaskAllo
              </h2>
              <p className="text-lg xl:text-xl text-gray-100 max-w-md mx-auto leading-relaxed">
                Connect with trusted professionals and get your tasks done efficiently
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Content Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
          <div className="max-w-xl w-full slide-in-right">

            {/* Header */}
            <div className="text-center mb-10 fade-in-up">
              <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: '#063A41' }}>
                Get Started Today
              </h1>
              <p className="text-gray-600 text-base sm:text-lg">
                Join thousands of satisfied clients who trust TaskAllo
              </p>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10 hover-lift fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center accent-gradient">
                  <FaHome className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: '#063A41' }}>
                    I Need Help
                  </h2>
                  <p className="text-sm text-gray-500">Post tasks & hire professionals</p>
                </div>
              </div>

              <div className="mb-8 p-4 rounded-lg" style={{ backgroundColor: '#E5FFDB' }}>
                <ul className="space-y-3">
                  {[
                    "Post any task you need help with",
                    "Get quotes from verified professionals",
                    "Secure payment protection",
                    "24/7 customer support"
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 items-start" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                      <FaCheckCircle className="text-xl check-icon flex-shrink-0 mt-0.5" style={{ color: '#109C3D' }} />
                      <span className="text-sm font-medium" style={{ color: '#063A41' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/client-sign-up">
                <button className="w-full accent-gradient text-white font-semibold py-4 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group">
                  <span>Sign Up</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>

            {/* Login Section */}
            <div className="mt-8 text-center fade-in-up" style={{ animationDelay: '0.4s' }}>
              <p className="text-gray-600 mb-4">
                Already have an account?
              </p>
              <button
                onClick={() => setIsClientModalOpen(true)}
                className="font-semibold text-lg hover:underline transition-all"
                style={{ color: '#109C3D' }}
              >
                Login to Your Account →
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-10 pt-8 border-t border-gray-200 fade-in-up" style={{ animationDelay: '0.5s' }}>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold" style={{ color: '#063A41' }}>10K+</p>
                  <p className="text-xs text-gray-500 mt-1">Active Users</p>
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: '#063A41' }}>50K+</p>
                  <p className="text-xs text-gray-500 mt-1">Tasks Completed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: '#063A41' }}>4.9★</p>
                  <p className="text-xs text-gray-500 mt-1">Average Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ClientLoginModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        activeModal={activeModal}
        setActiveModal={setActiveModal}
      />
    </div>
  );
};

export default JoinTaskMatch;