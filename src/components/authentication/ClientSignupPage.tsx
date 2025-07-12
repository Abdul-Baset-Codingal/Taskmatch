"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { FaUserPlus, FaTimes } from "react-icons/fa";

interface ClientSignupModalProps {
    isOpen: boolean;
    onClose: () => void;
    activeModal: string | null;
    setActiveModal: (modal: string | null) => void;
}

const ClientSignupPage: React.FC<ClientSignupModalProps> = ({
    isOpen,
    onClose,
    activeModal,
    setActiveModal,
}) => {
    const originalOverflow = useRef<string>("");

    // Scroll Lock & Active Modal
    useEffect(() => {
        if (isOpen) {
            originalOverflow.current = document.body.style.overflow || "auto";
            document.body.style.overflow = "hidden";
            setActiveModal("client-signup");
        }
        return () => {
            if (activeModal === "client-signup") {
                document.body.style.overflow = originalOverflow.current || "auto";
                setActiveModal(null);
            }
        };
    }, [isOpen, activeModal, setActiveModal]);

    // Escape to Close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]"
            onClick={onClose}
        >
            <div
                className="bg-white w-[95%] sm:w-[90%] md:max-w-md rounded-2xl relative shadow-xl p-6 sm:p-8"
                onClick={(e) => e.stopPropagation()}
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
                    className="absolute top-4 right-4 text-gray-900 hover:text-rose-400 transition z-[10001] p-2 rounded-full"
                    aria-label="Close modal"
                >
                    <FaTimes className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-premium text-amber-500 flex justify-center items-center gap-2">
                        <FaUserPlus />
                        Sign Up as Client
                    </h2>
                </div>

                {/* Signup Form */}
                <form className="space-y-4 sm:space-y-6 glass-effect p-4 rounded-xl">
                    <div>
                        <label htmlFor="name" className="block mb-1 text-sm text-gray-900 text-fancy">
                            Full Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            required
                            placeholder="Enter your name"
                            className="w-full p-3 border border-gray-300 rounded-md text-sm text-fancy focus:ring-2 focus:ring-amber-400"
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
                            className="w-full p-3 border border-gray-300 rounded-md text-sm text-fancy focus:ring-2 focus:ring-amber-400"
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
                            className="w-full p-3 border border-gray-300 rounded-md text-sm text-fancy focus:ring-2 focus:ring-amber-400"
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
                            className="w-full p-3 border border-gray-300 rounded-md text-sm text-fancy focus:ring-2 focus:ring-amber-400"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-amber-400 text-white font-bold py-3 rounded-md hover:bg-amber-500 transition text-sm text-fancy btn-shine"
                    >
                        Create Account
                    </button>

                    <p className="text-xs text-gray-800 text-center mt-4 text-fancy">
                        Already have an account?{" "}
                        <Link href="/login/client">
                            <span className="text-amber-400 hover:text-amber-500 font-semibold">Log in</span>
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default ClientSignupPage;
