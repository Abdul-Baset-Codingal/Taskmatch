/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useEffect, useRef, useState } from "react";
import { FaUser, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { useLoginMutation } from "@/features/auth/authApi"; // adjust path if needed
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface ClientLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
}

const ClientLoginModal: React.FC<ClientLoginModalProps> = ({
  isOpen,
  onClose,
  activeModal,
  setActiveModal,
}) => {
  const originalOverflow = useRef<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    if (isOpen) {
      originalOverflow.current = document.body.style.overflow || "auto";
      document.body.style.overflow = "hidden";
      setActiveModal("client");
    }
    return () => {
      if (activeModal === "client") {
        document.body.style.overflow = originalOverflow.current || "auto";
        setActiveModal(null);
      }
    };
  }, [isOpen, activeModal, setActiveModal]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      Cookies.set("token", res.token, { expires: 7, sameSite: "strict" });
      toast.success("Login successful!");
      console.log("Login response:", res);

      onClose(); // close the modal (optional)
      router.push("/"); // redirect to home page
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error?.data?.message || "Login failed. Please try again.");
    }
  };


  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] isolate"
      onClick={onClose}
    >
      <div
        className="bg-white w-[95%] sm:w-[90%] md:max-w-md rounded-2xl relative shadow-xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ... styles skipped for brevity ... */}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-900 hover:text-rose-400 transition z-[10001] p-2 rounded-full"
          aria-label="Close modal"
        >
          <FaTimes className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 to-rose-400 pt-6 pb-8 text-center rounded-t-2xl fade-in">
          <h2 className="text-2xl sm:text-3xl text-white font-bold text-premium flex items-center justify-center gap-3">
            <FaUser className="text-xl sm:text-2xl" />
            Client Login
          </h2>
        </div>

        {/* Form */}
        <div className="glass-effect p-4 sm:p-6 rounded-lg -mt-4">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label htmlFor="client-email" className="block text-sm mb-1 text-gray-900">Email</label>
              <input
                id="client-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-amber-400"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label htmlFor="client-password" className="block text-sm mb-1 text-gray-900">Password</label>
              <input
                id="client-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-amber-400"
                placeholder="Enter your password"
                required
              />
            </div>
            <Link href="/forgot-password" className="text-xs sm:text-sm text-amber-400 hover:text-amber-500 block text-right">
              Forgot Password?
            </Link>
            <button
              type="submit"
              className="w-full bg-amber-400 text-white font-bold py-2 sm:py-3 rounded-md hover:bg-amber-500 transition text-sm sm:text-base btn-shine"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="text-xs sm:text-sm text-gray-800 mt-4 text-center">
            Don’t have an account?{" "}
            <Link href="/signup/client">
              <span className="text-amber-400 hover:text-amber-500 font-bold">Sign Up as Client</span>
            </Link>
          </p>
        </div>

        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </div>
  );
};

export default ClientLoginModal;
