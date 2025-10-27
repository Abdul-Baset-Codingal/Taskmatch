"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { FaPlusCircle, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null); // currentRole
  const [userRoles, setUserRoles] = useState<string[]>([]); // array of roles
  const [userId, setUserId] = useState<string | null>(null); // New: user ID for API
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        setIsLoggedIn(false);
        setUserRole(null);
        setUserRoles([]);
        setUserId(null);
        setFirstName(null);
        setLastName(null);
        setEmail(null);
        setProfilePicture(null);
        setShowDropdown(false);
        setErrorMessage(null);
        router.push("/");
      } else {
        console.error("Logout failed with status:", response.status);
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const switchRole = async (newRole: "tasker" | "client") => {
    if (!userId) {
      setErrorMessage("User ID not found.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/auth/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
        credentials: "include",
        
      });

      if (response.ok) {
        await checkLoginStatus();
        setShowDropdown(false);
        setErrorMessage(null);
        toast.success("Role changed successfully")
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Switch role failed:", errorData);

        if (errorData.missingFields && newRole === "tasker") {
          const fieldsQuery = errorData.missingFields.join(",");
          router.push(`/complete-tasker-profile?fields=${fieldsQuery}`);
          setErrorMessage("Please complete your tasker profile to switch.");
        } else {
          setErrorMessage(errorData.message || "Failed to switch role.");
        }
      }
    } catch (error) {
      console.error("Switch role failed", error);
      setErrorMessage("An error occurred while switching roles.");
    }
  };

  const switchToTasker = () => switchRole("tasker");
  const switchToClient = () => switchRole("client");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  // Check login status - Updated for currentRole, roles, and _id
  const checkLoginStatus = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/verify-token", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Verify token data:", data); // Debug log
        setIsLoggedIn(true);
        const currentRole = data.user.currentRole || data.user.role;
        console.log("Setting userRole to:", currentRole); // Debug log
        setUserRole(currentRole); // Fallback for backward compatibility
        setUserRoles(data.user.roles || [data.user.role || "client"]);
        setUserId(data.user._id); // New: Set user ID
        setFirstName(data.user.firstName);
        setLastName(data.user.lastName);
        setEmail(data.user.email);
        setProfilePicture(data.user.profilePicture);
        setErrorMessage(null);
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
        setUserRoles([]);
        setUserId(null);
        setFirstName(null);
        setLastName(null);
        setEmail(null);
        setProfilePicture(null);
        setErrorMessage(null);
      }
    } catch (error) {
      setIsLoggedIn(false);
      setUserRole(null);
      setUserRoles([]);
      setUserId(null);
      setFirstName(null);
      setLastName(null);
      setEmail(null);
      setProfilePicture(null);
      setErrorMessage(null);
      console.error("Verify token failed", error);
    }
  };

  // Run login check on load
  useEffect(() => {
    const fetchLogin = async () => {
      await checkLoginStatus();
    };
    fetchLogin();
  }, []);

  const ProfileAvatar = ({ size = 32 }: { size?: number }) => {
    if (!profilePicture) {
      return (
        <div className={`w-[${size}px] h-[${size}px] rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0`}>
          <FaUser className={`w-[${Math.floor(size / 2)}px] h-[${Math.floor(size / 2)}px] text-gray-500`} />
        </div>
      );
    }

    return (
      <div className={`w-[${size}px] h-[${size}px] rounded-full overflow-hidden flex-shrink-0 relative`}>
        <Image
          src={profilePicture}
          alt="Profile"
          fill
          className="object-cover"
        />
      </div>
    );
  };

  return (
    <div className="flex justify-center">
      <div className="w-full lg:max-w-[1300px] lg:mx-auto h-[80px] bg-white/60 backdrop-blur-md z-50 rounded-[50px]">
        {/* Navbar Content */}
        <div className="relative z-30 flex items-center justify-between px-4 xs:px-6 sm:px-8 lg:px-6 h-full text-gray-900">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/">
              <h1 className="text-2xl xs:text-3xl sm:text-3xl lg:text-3xl font-bold color1 bg-clip-text text-transparent">
                TaskAllo
              </h1>
            </Link>
            <span className="w-2 h-2 rounded-full color2 inline-block top-[12px] xs:top-[14px] sm:top-[16px] lg:top-[18px] relative right-[8px] xs:right-[10px] lg:right-[11px] z-10"></span>
          </div>

          {/* Hamburger for small screens */}
          <div className="lg:hidden z-40">
            <button onClick={toggleMenu}>
              {isOpen ? (
                <FiX className="w-6 h-6 xs:w-6.5 xs:h-6.5 sm:w-7 sm:h-7 text-gray-900" />
              ) : (
                <FiMenu className="w-6 h-6 xs:w-6.5 xs:h-6.5 sm:w-7 sm:h-7 text-gray-900" />
              )}
            </button>
          </div>

          {/* Menu */}
          <ul
            className={`flex flex-col lg:flex-row gap-4 xs:gap-5 sm:gap-6 lg:gap-10 items-start lg:items-center absolute lg:static top-[110px] left-0 w-full lg:w-auto bg-white/95 lg:bg-transparent px-4 xs:px-6 sm:px-8 lg:px-0 py-4 sm:py-6 lg:p-0 transition-all duration-300 ease-in-out ${isOpen ? "flex z-[60]" : "hidden lg:flex"
              }`}
          >
            {/* Become a Tasker - Updated condition based on roles */}
            {/* {!userRoles.includes("tasker") && isLoggedIn && ( */}
             <li>
                <Link href="/tasker-signup">
                  <button className="flex items-center justify-center gap-2 lg:text-md text-white w-full lg:w-auto font-bold color2 hover:color1 px-5 py-3 rounded-4xl hover:shadow-lg hover:-translate-y-1 transform transition duration-300 cursor-pointer">
                    <FaPlusCircle className="text1 hover:text2 text-xl" />
                    Become a Tasker
                  </button>
                </Link>
              </li>
             {/* )} */}

            {/* Dashboard links */}
            <li>
              <Link href="/browse-tasks">
                <button className="relative text-base xs:text-lg sm:text-lg lg:text-sm font-semibold text-gray-900 py-2 xs:py-2.5 sm:py-3 overflow-hidden group cursor-pointer w-full xs:w-auto text-left">
                  Available Tasks
                  <span className="absolute left-0 bottom-0 w-0 h-[3px] color1 transition-all duration-500 group-hover:w-full"></span>
                </button>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/owner">
                <button className="relative text-base xs:text-lg sm:text-lg lg:text-sm font-semibold text-gray-900 py-2 xs:py-2.5 sm:py-3 overflow-hidden group cursor-pointer w-full xs:w-auto text-left">
                  Owner
                  <span className="absolute left-0 bottom-0 w-0 h-[3px] color1 transition-all duration-500 group-hover:w-full"></span>
                </button>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/client">
                <button className="relative text-base xs:text-lg sm:text-lg lg:text-sm font-semibold text-gray-900 py-2 xs:py-2.5 sm:py-3 overflow-hidden group cursor-pointer w-full xs:w-auto text-left">
                  Client
                  <span className="absolute left-0 bottom-0 w-0 h-[3px] color1 transition-all duration-500 group-hover:w-full"></span>
                </button>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/tasker">
                <button className="relative text-base xs:text-lg sm:text-lg lg:text-sm font-semibold text-gray-900 py-2 xs:py-2.5 sm:py-3 overflow-hidden group cursor-pointer w-full xs:w-auto text-left">
                  Tasker
                  <span className="absolute left-0 bottom-0 w-0 h-[3px] color1 transition-all duration-500 group-hover:w-full"></span>
                </button>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/admin">
                <button className="relative text-base xs:text-lg sm:text-lg lg:text-sm font-semibold text-gray-900 py-2 xs:py-2.5 sm:py-3 overflow-hidden group cursor-pointer w-full xs:w-auto text-left">
                  Admin
                  <span className="absolute left-0 bottom-0 w-0 h-[3px] color1 transition-all duration-500 group-hover:w-full"></span>
                </button>
              </Link>
            </li>

            {/* Profile Dropdown or Sign Up / Log In */}
            <li className="relative">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => setShowDropdown((prev) => !prev)}
                    className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-[#063A41]"
                  >
                    <ProfileAvatar size={32} />
                    <span className="hidden lg:block text-sm font-semibold">
                      {firstName} {lastName}
                    </span>
                  </button>
                  {showDropdown && (
                    <div
                      ref={dropdownRef}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl py-3 z-50 border border-gray-200 overflow-hidden"
                    >
                      {/* User Info Header */}
                      <div className="px-4 py-3 bg-gray-50 border-b">
                        <div className="flex items-center gap-3">
                          <ProfileAvatar size={40} />
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              {firstName} {lastName}
                            </p>
                            <p className="text-xs text-gray-500 truncate max-w-[150px]">{email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Role Toggle Section - Updated with conditions */}
                      {(userRoles.length > 0) && (
                        <div className="px-4 py-3 border-b">
                          <p className="text-xs font-medium text-gray-500 mb-2">Switch Role</p>
                          <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                              onClick={switchToTasker}
                              disabled={!userRoles.includes("tasker")}
                              className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${userRole === "tasker"
                                  ? "color1 text-white shadow-sm"
                                  : "text-gray-700 hover:text-gray-900 hover:bg-white"
                                }`}
                            >
                              Tasker
                            </button>
                            <button
                              onClick={switchToClient}
                              disabled={!userRoles.includes("client")}
                              className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${userRole === "client"
                                  ? "color1 text-white shadow-sm"
                                  : "text-gray-700 hover:text-gray-900 hover:bg-white"
                                }`}
                            >
                              Client
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Profile Link */}
                      <Link
                        href="/complete-tasker-profile"
                        className=" px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        <FaUser className="w-4 h-4 text-gray-400" />
                        Profile
                      </Link>

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      >
                        <FiX className="w-4 h-4 text-red-400" />
                        Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link href="/authentication">
                  <button className="bg-gradient-to-r from-[#F48B0C] lg:text-sm to-[#39B376] text-white font-bold px-6 py-3 rounded-full hover:-translate-y-1 transition">
                    Sign Up / Login
                  </button>
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
      {/* Error Toast - Simple implementation */}
      {errorMessage && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-[100] flex items-center">
          {errorMessage}
          <button onClick={() => setErrorMessage(null)} className="ml-2 text-white hover:text-gray-200">×</button>
        </div>
      )}
    </div>
  );
};

export default Navbar;