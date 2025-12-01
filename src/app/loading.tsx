'use client';

import React from 'react';

const Loading = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center space-y-6">
                {/* Animated Loader with Logo Colors */}
                <div className="relative w-24 h-24">
            <div className="absolute inset-0 w-24 h-24 border-4 border-t-transparent border-gradient-to-r from-gray-900 to-[#063A41] rounded-full animate-[spin_1.5s_linear_infinite] shadow-[0_0_15px_rgba(16, 156, 61)]"></div>
                    <div className="absolute w-4 h-4 rounded-full color2 animate-[orbit_1.5s_linear_infinite] top-0 left-1/2 transform -translate-x-1/2"></div>
                </div>
                <h2 className="text-xl font-bold color1 bg-clip-text text-transparent animate-[pulse_2s_ease-in-out_infinite]">
                    Loading Taskallo...
                </h2>
            </div>

            <style jsx>{`
        @keyframes orbit {
          0% {
            transform: translateX(-50%) translateY(0) rotate(0deg) translateY(40px);
          }
          100% {
            transform: translateX(-50%) translateY(0) rotate(360deg) translateY(40px);
          }
        }
      `}</style>
        </div>
    );
};

export default Loading;