"use client";
import React from "react";

const TaskerBanner = () => {
    return (
        <div className="relative bg-black text-white py-48 px-6 text-center overflow-hidden">
            {/* Glowing Bubbles */}
            <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-purple-900 opacity-30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-rose-900 opacity-30 rounded-full blur-3xl animate-pulse"></div>

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-premium mb-4">
                    Become a Tasker in Canada
                </h1>
                <p className="text-lg sm:text-xl text-gray-200 font-medium mb-4">
                    Join our community of skilled professionals and start earning on your schedule
                </p>
                <div className="mt-6 inline-block px-6 py-5 rounded-4xl bg-white/10 backdrop-blur-md border border-white/20 animate-bounce">
                    <p className="flex items-center gap-2 text-xl font-semibold text-white">
                        <span className="text-2xl">🍁</span>
                        Serving communities across Canada
                    </p>
                </div>

            </div>
        </div>
    );
};

export default TaskerBanner;
