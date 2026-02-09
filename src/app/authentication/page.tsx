
// /* eslint-disable @typescript-eslint/ban-ts-comment */
// /* eslint-disable react-hooks/exhaustive-deps */
// // @ts-nocheck
// "use client";
// export const dynamic = "force-dynamic";

// import React, { useState, useEffect, Suspense } from "react";
// import { FaHome, FaCheckCircle, FaArrowRight } from "react-icons/fa";
// import Navbar from "@/shared/Navbar";
// import ClientLoginModal from "@/components/authentication/ClientLoginModal";
// import Link from "next/link";
// import { useSearchParams } from "next/navigation";
// import Image from "next/image";
// import loginImage from "../../../public/Images/taskMatch works.jpg";

// const OpenClientLoginOnQuery = ({ setIsClientModalOpen }: { setIsClientModalOpen: (val: boolean) => void }) => {
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     if (!searchParams) return;
//     const shouldOpen = searchParams.get("openClientLogin");
//     if (shouldOpen === "true") {
//       setIsClientModalOpen(true);
//     }
//   }, [searchParams]);

//   return null;
// };

// const JoinTaskMatch = () => {
//   const [isClientModalOpen, setIsClientModalOpen] = useState(false);
//   const [activeModal, setActiveModal] = useState<string | null>(null);

//   return (
//     <div className="min-h-screen bg-white">
//       <Navbar />

//       <style>{`
//         .slide-in-left {
//           animation: slideInLeft 0.8s ease-out;
//         }
//         .slide-in-right {
//           animation: slideInRight 0.8s ease-out;
//         }
//         .fade-in-up {
//           animation: fadeInUp 0.6s ease-out;
//         }
//         .hover-lift {
//           transition: transform 0.3s ease, box-shadow 0.3s ease;
//         }
//         .hover-lift:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 8px 20px rgba(6, 58, 65, 0.15);
//         }
//         .brand-gradient {
//           background: linear-gradient(135deg, #063A41 0%, #109C3D 100%);
//         }
//         .accent-gradient {
//           background: linear-gradient(135deg, #109C3D 0%, #0db53a 100%);
//         }
//         @keyframes slideInLeft {
//           from {
//             opacity: 0;
//             transform: translateX(-30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }
//         @keyframes slideInRight {
//           from {
//             opacity: 0;
//             transform: translateX(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }
//         @keyframes fadeInUp {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .image-overlay {
//           position: relative;
//         }
//         .image-overlay::after {
//           content: '';
//           position: absolute;
//           inset: 0;
//           background: linear-gradient(135deg, rgba(6, 58, 65, 0.7) 0%, rgba(16, 156, 61, 0.5) 100%);
//         }
//         .check-icon {
//           min-width: 20px;
//         }
//       `}</style>

//       <div className="flex min-h-screen ">
//         <Suspense fallback={null}>
//           <OpenClientLoginOnQuery setIsClientModalOpen={setIsClientModalOpen} />
//         </Suspense>

//         {/* Left Side - Image Section */}
//         <div className="hidden lg:flex lg:w-1/2 relative image-overlay">
//           <Image
//             src={loginImage}
//             alt="TaskMatch"
//             fill
//             className="object-cover"
//             priority
//           />
//           <div className="absolute inset-0 z-10 flex items-center justify-center p-12">
//             <div className="text-center slide-in-left">
//               <h2 className="text-4xl xl:text-5xl font-bold text-white mb-6">
//                 Welcome to Taskallo
//               </h2>
//               <p className="text-lg xl:text-xl text-gray-100 max-w-md mx-auto leading-relaxed">
//                 Connect with trusted professionals and get your tasks done efficiently
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Right Side - Content Section */}
//         <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
//           <div className="max-w-xl w-full slide-in-right">

//             {/* Header */}
//             <div className="text-center mb-10 fade-in-up">
//               <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: '#063A41' }}>
//                 Get Started Today
//               </h1>
//               <p className="text-gray-600 text-base sm:text-lg">
//                 Join thousands of satisfied people who trust Taskallo
//               </p>
//             </div>

//             {/* Main Card */}
//             <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10 hover-lift fade-in-up" style={{ animationDelay: '0.2s' }}>
//               <div className="flex items-center gap-4 mb-6">
//                 <div className="w-12 h-12 rounded-full flex items-center justify-center accent-gradient">
//                   <FaHome className="text-white text-xl" />
//                 </div>
//                 <div>
//                   <h2 className="text-2xl font-bold" style={{ color: '#063A41' }}>
//                     I Need Help
//                   </h2>
//                   <p className="text-sm text-gray-500">Post tasks & hire professionals</p>
//                 </div>
//               </div>

//               <div className="mb-8 p-4 rounded-lg" style={{ backgroundColor: '#E5FFDB' }}>
//                 <ul className="space-y-3">
//                   {[
//                     "Post any task you need help with",
//                     "Get quotes from professionals",
//                     "Secure payment protection",
//                     "24/7 customer support"
//                   ].map((item, i) => (
//                     <li key={i} className="flex gap-3 items-start" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
//                       <FaCheckCircle className="text-xl check-icon flex-shrink-0 mt-0.5" style={{ color: '#109C3D' }} />
//                       <span className="text-sm font-medium" style={{ color: '#063A41' }}>{item}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               <Link href="/client-sign-up">
//                 <button className="w-full accent-gradient text-white font-semibold py-4 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group">
//                   <span>Sign Up</span>
//                   <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
//                 </button>
//               </Link>
//             </div>

//             {/* Login Section */}
//             <div className="mt-8 text-center fade-in-up" style={{ animationDelay: '0.4s' }}>
//               <p className="text-gray-600 mb-4">
//                 Already have an account?
//               </p>
//               <button
//                 onClick={() => setIsClientModalOpen(true)}
//                 className="font-semibold text-lg hover:underline transition-all"
//                 style={{ color: '#109C3D' }}
//               >
//                 Login to Your Account →
//               </button>
//             </div>

//             {/* Trust Indicators */}
//             <div className="mt-10 pt-8 border-t border-gray-200 fade-in-up" style={{ animationDelay: '0.5s' }}>
//               <div className="grid grid-cols-3 gap-4 text-center">
//                 <div>
//                   <p className="text-2xl font-bold" style={{ color: '#063A41' }}>10K+</p>
//                   <p className="text-xs text-gray-500 mt-1">Active Users</p>
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold" style={{ color: '#063A41' }}>50K+</p>
//                   <p className="text-xs text-gray-500 mt-1">Tasks Completed</p>
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold" style={{ color: '#063A41' }}>4.9★</p>
//                   <p className="text-xs text-gray-500 mt-1">Average Rating</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modals */}
//       <ClientLoginModal
//         isOpen={isClientModalOpen}
//         onClose={() => setIsClientModalOpen(false)}
//         activeModal={activeModal}
//         setActiveModal={setActiveModal}
//       />
//     </div>
//   );
// };

// export default JoinTaskMatch;


/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect, Suspense } from "react";
import { FaTools, FaCalendarCheck, FaArrowRight, FaCheckCircle, FaInfoCircle } from "react-icons/fa";
import Navbar from "@/shared/Navbar";
import ClientLoginModal from "@/components/authentication/ClientLoginModal";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

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

  const handleRoleClick = (role: "tasker" | "booker") => {
    localStorage.setItem("userIntendedRole", role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <style>{`
        .fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        .card-hover {
          transition: all 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(6, 58, 65, 0.12);
        }
        .btn-green {
          background: linear-gradient(135deg, #109C3D 0%, #0db53a 100%);
          transition: all 0.3s ease;
        }
        .btn-green:hover {
          box-shadow: 0 6px 20px rgba(16, 156, 61, 0.4);
        }
        .btn-dark {
          background: linear-gradient(135deg, #063A41 0%, #0a5561 100%);
          transition: all 0.3s ease;
        }
        .btn-dark:hover {
          box-shadow: 0 6px 20px rgba(6, 58, 65, 0.4);
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
      `}</style>

      <Suspense fallback={null}>
        <OpenClientLoginOnQuery setIsClientModalOpen={setIsClientModalOpen} />
      </Suspense>

      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">

        {/* Header */}
        <div className="text-center mb-10 fade-in-up">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3" style={{ color: '#063A41' }}>
            Join Taskallo
          </h1>
          <p className="text-gray-500 text-base sm:text-lg">
            Choose how you'd like to get started
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">

          {/* Tasker Card */}
          <div
            className="fade-in-up bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 card-hover flex flex-col"
            style={{ animationDelay: '0.1s' }}
          >
            {/* Icon */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
              style={{ backgroundColor: '#E5FFDB' }}
            >
              <FaTools className="text-3xl" style={{ color: '#109C3D' }} />
            </div>

            {/* Content */}
            <h2 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: '#063A41' }}>
              Become a Tasker
            </h2>
            <p className="text-gray-500 text-sm mb-5">
              Earn money by completing tasks for people in your area
            </p>

            {/* Features */}
            <ul className="space-y-2.5 mb-6 flex-1">
              {[
                "Set your own hours",
                "Choose your tasks",
                "Get paid weekly",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCheckCircle className="text-sm flex-shrink-0" style={{ color: '#109C3D' }} />
                  {item}
                </li>
              ))}
            </ul>

            {/* Note */}
            <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50 mb-5">
              <FaInfoCircle className="text-blue-500 flex-shrink-0 mt-0.5 text-sm" />
              <p className="text-xs text-blue-700">
                Taskers can also book tasks as a client!
              </p>
            </div>

            {/* Button */}
            <Link
              href="/client-sign-up"
              onClick={() => handleRoleClick("tasker")}
              className="block"
            >
              <button className="w-full btn-green text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 group">
                <span>Sign Up as Tasker</span>
                <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

          {/* Booker Card */}
          <div
            className="fade-in-up bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 card-hover flex flex-col"
            style={{ animationDelay: '0.2s' }}
          >
            {/* Icon */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
              style={{ backgroundColor: '#E8F4FD' }}
            >
              <FaCalendarCheck className="text-3xl" style={{ color: '#063A41' }} />
            </div>

            {/* Content */}
            <h2 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: '#063A41' }}>
              Become a Booker
            </h2>
            <p className="text-gray-500 text-sm mb-5">
              Get help with everyday tasks from trusted local professionals
            </p>

            {/* Features */}
            <ul className="space-y-2.5 mb-6 flex-1">
              {[
                "Post any task",
                "Compare quotes",
                "Secure payments",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCheckCircle className="text-sm flex-shrink-0" style={{ color: '#109C3D' }} />
                  {item}
                </li>
              ))}
            </ul>

            {/* Spacer to match height */}
            <div className="p-3 rounded-xl bg-gray-50 mb-5">
              <p className="text-xs text-gray-500">
                Perfect for busy people who need an extra hand.
              </p>
            </div>

            {/* Button */}
            <Link
              href="/client-sign-up"
              onClick={() => handleRoleClick("booker")}
              className="block"
            >
              <button className="w-full btn-dark text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 group">
                <span>Sign Up as Booker</span>
                <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

        </div>

        {/* Login Section */}
        <div className="mt-10 text-center fade-in-up" style={{ animationDelay: '0.3s' }}>
          <p className="text-gray-500">
            Already have an account?{" "}
            <button
              onClick={() => setIsClientModalOpen(true)}
              className="font-semibold hover:underline"
              style={{ color: '#109C3D' }}
            >
              Log In
            </button>
          </p>
        </div>

      </div>

      {/* Login Modal */}
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