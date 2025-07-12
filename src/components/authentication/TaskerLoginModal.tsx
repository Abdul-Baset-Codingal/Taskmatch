import React, { useEffect, useRef } from "react";
import { FaBriefcase, FaTimes } from "react-icons/fa";
import Link from "next/link";

interface TaskerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
}

const TaskerLoginModal: React.FC<TaskerLoginModalProps> = ({ isOpen, onClose, activeModal, setActiveModal }) => {
  const originalOverflow = useRef<string>("");

  // Manage body scroll and active modal state
  useEffect(() => {
    if (isOpen) {
      originalOverflow.current = document.body.style.overflow || "auto";
      document.body.style.overflow = "hidden";
      setActiveModal("tasker");
    }

    return () => {
      // Only restore overflow if no other modal is active
      if (activeModal === "tasker") {
        document.body.style.overflow = originalOverflow.current || "auto";
        setActiveModal(null);
      }
    };
  }, [isOpen, activeModal, setActiveModal]);

  // Close on Escape key or backdrop click
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Early return after hooks
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] isolate"
      onClick={onClose}
    >
      <div
        className="bg-white w-[95%] sm:w-[90%] md:max-w-md rounded-2xl relative shadow-xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <style>
          {`
            .fade-in {
              animation: fadeIn 0.5s ease-out;
            }
            .glass-effect {
              background: rgba(255, 255, 255, 0.5);
              backdrop-filter: blur(8px);
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
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(15px); }
              to { opacity: 1; transform: translateY(0); }
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
        <div className="bg-gradient-to-r from-emerald-400 to-teal-400 pt-6 pb-8 text-center rounded-t-2xl fade-in">
          <h2 className="text-2xl sm:text-3xl text-white font-bold text-premium flex items-center justify-center gap-3">
            <FaBriefcase className="text-xl sm:text-2xl" />
            Tasker Login
          </h2>
        </div>

        {/* Form */}
        <div className="glass-effect p-4 sm:p-6 rounded-lg -mt-4">
          <form className="space-y-4 sm:space-y-6">
            <div>
              <label htmlFor="tasker-email" className="block text-sm sm:text-base text-gray-900 text-fancy mb-1">
                Email
              </label>
              <input
                id="tasker-email"
                type="email"
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm sm:text-base text-fancy focus:ring-2 focus:ring-emerald-400"
                placeholder="Enter your email"
                required
                aria-label="Tasker email"
              />
            </div>
            <div>
              <label htmlFor="tasker-password" className="block text-sm sm:text-base text-gray-900 text-fancy mb-1">
                Password
              </label>
              <input
                id="tasker-password"
                type="password"
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm sm:text-base text-fancy focus:ring-2 focus:ring-emerald-400"
                placeholder="Enter your password"
                required
                aria-label="Tasker password"
              />
            </div>
            <Link href="/forgot-password">
              <p className="text-xs sm:text-sm text-emerald-400 hover:text-emerald-500 text-fancy text-right">
                Forgot Password?
              </p>
            </Link>
            <button
              type="submit"
              className="w-full bg-emerald-400 text-white font-bold py-2 sm:py-3 rounded-md hover:bg-emerald-500 transition text-sm sm:text-base text-fancy btn-shine"
              aria-label="Submit tasker login"
            >
              Login
            </button>
          </form>
          <p className="text-xs sm:text-sm text-gray-800 mt-4 sm:mt-6 text-center text-fancy">
            Don’t have an account?{" "}
            <Link href="/signup/tasker">
              <span className="text-emerald-400 hover:text-emerald-500 font-bold">Sign Up as Tasker</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskerLoginModal;