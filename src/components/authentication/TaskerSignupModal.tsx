"use client";
import React from "react";
import { FaUserPlus } from "react-icons/fa";

interface TaskerSignupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TaskerSignupModal: React.FC<TaskerSignupModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] isolate"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8  relative"
            >
                <style>
                    {`
          .glass-effect {
            background: rgba(255, 255, 255, 0.6);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.4);
          }
          .text-fancy {
            font-family: 'Inter', sans-serif;
            letter-spacing: 0.02em;
          }
          .text-premium {
            font-family: 'Playfair Display', serif;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          }
          .btn-shine {
            position: relative;
            overflow: hidden;
          }
          .btn-shine::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(
              to right,
              rgba(255, 255, 255, 0),
              rgba(255, 255, 255, 0.3),
              rgba(255, 255, 255, 0)
            );
            transform: rotate(45deg);
            transition: transform 0.5s ease;
          }
          .btn-shine:hover::after {
            transform: rotate(45deg) translateX(100%);
          }
        `}
                </style>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
                >
                    ×
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-premium text-emerald-500 flex justify-center items-center gap-2">
                        <FaUserPlus />
                        Sign Up as Tasker
                    </h2>
                </div>

                {/* Signup Form */}
                <form className="space-y-4 sm:space-y-6">
                    <div>
                        <label htmlFor="name" className="block mb-1 text-sm text-gray-900 text-fancy">
                            Full Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            required
                            placeholder="Enter your name"
                            className="w-full p-3 border border-gray-300 rounded-md text-sm text-fancy focus:ring-2 focus:ring-emerald-400"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block mb-1 text-sm text-gray-900 text-fancy">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            placeholder="Enter your email"
                            className="w-full p-3 border border-gray-300 rounded-md text-sm text-fancy focus:ring-2 focus:ring-emerald-400"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block mb-1 text-sm text-gray-900 text-fancy">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            placeholder="Create a password"
                            className="w-full p-3 border border-gray-300 rounded-md text-sm text-fancy focus:ring-2 focus:ring-emerald-400"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirm-password" className="block mb-1 text-sm text-gray-900 text-fancy">
                            Confirm Password
                        </label>
                        <input
                            id="confirm-password"
                            type="password"
                            required
                            placeholder="Confirm your password"
                            className="w-full p-3 border border-gray-300 rounded-md text-sm text-fancy focus:ring-2 focus:ring-emerald-400"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-emerald-400 text-white font-bold py-3 rounded-md hover:bg-emerald-500 transition text-sm text-fancy btn-shine"
                    >
                        Create Account
                    </button>

                    <p className="text-xs text-gray-800 text-center mt-4 text-fancy">
                        Already have an account?{" "}
                        <span className="text-emerald-400 hover:text-emerald-500 font-semibold cursor-pointer">
                            Log in
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default TaskerSignupModal;
