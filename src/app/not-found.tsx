'use client';

import React from 'react';
import Link from 'next/link';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center ">
            <div className="flex flex-col items-center space-y-8 max-w-md mx-auto p-6">

                {/* Fancy 404 Icon */}
                <div className="relative w-32 h-32">
                    <div className="absolute inset-0 w-32 h-32 color1 rounded-full animate-[spin_3s_linear_infinite] shadow-[0_10px_30px_rgba(6,58,65,0.3)]"></div>

                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <svg
                            className="w-16 h-16 text2 animate-[pulse_1.5s_ease-in-out_infinite]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>

                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-4 color2 rounded-full animate-[ping_1s_ease-in-out_infinite]"></div>
                </div>

                {/* 404 Title */}
                <h1 className="text-4xl font-bold bg-clip-text text-transparent text-center animate-[fadeInUp_0.6s_ease-out] color1">
                    404 - Lost in Space
                </h1>

                {/* Message */}
                <p className="text-lg text1 text-center leading-relaxed animate-[fadeInUp_0.8s_ease-out]">
                    This page seems to have wandered off. Let’s get you back to TaskMatch!
                </p>

                {/* Home Button */}
                <Link
                    href="/"
                    className="px-8 py-3 color2 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 animate-[fadeInUp_1s_ease-out]"
                >
                    Back to Home
                </Link>
            </div>

            <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default NotFound;
