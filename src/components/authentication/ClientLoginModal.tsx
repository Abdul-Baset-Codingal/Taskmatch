/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useEffect, useRef, useState } from "react";
import { FaUser, FaTimes, FaLock, FaEnvelope } from "react-icons/fa";
import Link from "next/link";
import { useLoginMutation } from "@/features/auth/authApi";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { updateTaskField, setPhotos } from "@/features/taskForm/taskFormSlice";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const taskForm = useSelector((state: RootState) => state.taskForm);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
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

  const checkLoginStatus = async () => {
    try {
      const response = await fetch("https://taskmatch-backend.vercel.app/api/auth/verify-token", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setUserRole(data.user.role);
        console.log("Token verified. User logged in:", data.user);
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
        console.log("Token verification failed. User logged out.");
      }
    } catch (error) {
      setIsLoggedIn(false);
      setUserRole(null);
      console.error("Error verifying token:", error);
    }
  };

  const dataURLtoBlob = (dataurl: string) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  // Restore pending task from sessionStorage to Redux (without submitting)
  const restorePendingTask = async () => {
    const pendingStr = sessionStorage.getItem('pendingTaskForm');
    if (!pendingStr) return;

    try {
      const stored = JSON.parse(pendingStr);

      // Restore non-file fields to Redux
      Object.entries(stored).forEach(([key, value]) => {
        if (key !== 'photos' && key !== 'video') {
          dispatch(updateTaskField({ field: key as any, value }));
        }
      });

      // Restore photos
      const photoPromises = stored.photos?.map(async (meta: any) => {
        if (meta?.isString) {
          return meta.value; // Keep as string if it was
        }
        if (meta?.dataURL) {
          const blob = dataURLtoBlob(meta.dataURL);
          return new File([blob], meta.name, { type: meta.type });
        }
        return null;
      }) || [];
      const restoredPhotos = (await Promise.all(photoPromises)).filter(Boolean);
      dispatch(setPhotos(restoredPhotos));

      // Restore video
      const videoMeta = stored.video;
      let restoredVideo = null;
      if (videoMeta) {
        if (videoMeta.isString) {
          restoredVideo = videoMeta.value;
        } else if (videoMeta.dataURL) {
          const blob = dataURLtoBlob(videoMeta.dataURL);
          restoredVideo = new File([blob], videoMeta.name, { type: videoMeta.type });
        }
        dispatch(updateTaskField({ field: "video", value: restoredVideo }));
      }

      sessionStorage.removeItem('pendingTaskForm');
      console.log("Pending task form restored successfully.");
    } catch (error) {
      console.error("Error restoring pending task:", error);
      sessionStorage.removeItem('pendingTaskForm'); // Clear on error to avoid loops
      toast.error("Failed to restore task form. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      toast.success("Login successful!");
      console.log("Login response:", res);
      await checkLoginStatus();
      onClose();

      // Check for pending task after successful login
      const hasPending = !!sessionStorage.getItem('pendingTaskForm');
      if (hasPending) {
        await restorePendingTask();
        router.push("/urgent-task?step=3");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[10000] p-4 modal-fade-in"
      onClick={onClose}
    >
      <style>{`
        .modal-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        .modal-slide-up {
          animation: slideUp 0.4s ease-out;
        }
        .input-focus {
          transition: all 0.3s ease;
        }
        .input-focus:focus {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 156, 61, 0.15);
        }
        .brand-gradient {
          background: linear-gradient(135deg, #063A41 0%, #109C3D 100%);
        }
        .btn-gradient {
          background: linear-gradient(135deg, #109C3D 0%, #0db53a 100%);
          transition: all 0.3s ease;
        }
        .btn-gradient:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(16, 156, 61, 0.3);
        }
        .btn-gradient:active:not(:disabled) {
          transform: translateY(0);
        }
        .btn-gradient:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .input-icon {
          color: #109C3D;
        }
      `}</style>

      <div
        className="bg-white w-full max-w-md rounded-2xl relative shadow-2xl overflow-hidden modal-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white hover:text-gray-200 transition p-2 rounded-full hover:bg-white/10"
          aria-label="Close modal"
        >
          <FaTimes className="w-5 h-5" />
        </button>

        {/* Header with Brand Gradient */}
        <div className="brand-gradient pt-8 pb-12 px-6 text-center relative">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <FaUser className="text-3xl text-white" />
          </div>
          <h2 className="text-3xl text-white font-bold">
            Welcome Back
          </h2>
          <p className="text-white/90 mt-2 text-sm">
            Login to access your account
          </p>
        </div>

        {/* Form Container */}
        <div className="px-6 sm:px-8 py-8 -mt-6 bg-white rounded-t-3xl relative z-10">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email Input */}
            <div>
              <label htmlFor="client-email" className="block text-sm font-medium mb-2" style={{ color: '#063A41' }}>
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="input-icon text-sm" />
                </div>
                <input
                  id="client-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm input-focus"
                  style={{
                    outline: 'none',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#109C3D'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="client-password" className="block text-sm font-medium mb-2" style={{ color: '#063A41' }}>
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="input-icon text-sm" />
                </div>
                <input
                  id="client-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl text-sm input-focus"
                  style={{
                    outline: 'none',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#109C3D'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm font-medium hover:underline transition"
                style={{ color: '#109C3D' }}
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full text-white font-semibold py-3.5 rounded-xl text-sm btn-gradient"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Login to Account"
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup/client">
                <span className="font-semibold hover:underline transition" style={{ color: '#109C3D' }}>
                  Sign Up
                </span>
              </Link>
            </p>
          </div>

          {/* Security Badge */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Your information is secure and encrypted
            </p>
          </div>
        </div>

        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </div>
  );
};

export default ClientLoginModal;