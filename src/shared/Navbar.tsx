/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { FiMenu, FiX, FiChevronDown, FiBell } from "react-icons/fi";
import { FaPlusCircle, FaUser, FaBriefcase, FaClipboardList, FaTasks, FaUserShield } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import logo from "../../public/Images/taskalloLogo-removebg-preview.png"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [taskerProfileCheck, setTaskerProfileCheck] = useState(false);
  const [wasLoggedIn, setWasLoggedIn] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0); // Add notification count state
  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [router]);

  // Fetch notifications count
  const fetchNotificationCount = async () => {
    if (!isLoggedIn) return;

    try {
      const response = await fetch("https://taskmatch-backend.vercel.app/api/auth/notifications", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUnreadNotifications(data.unreadCount || 0);
      } else {
       // console.error("Failed to fetch notifications");
      }
    } catch (error) {
    //  console.error("Error fetching notifications:", error);
    }
  };

  // Fetch notifications when user logs in or role changes
  useEffect(() => {
    if (isLoggedIn) {
      fetchNotificationCount();

      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotificationCount, 30000);

      return () => clearInterval(interval);
    } else {
      setUnreadNotifications(0);
    }
  }, [isLoggedIn, userRole]);

  // const handleLogout = async () => {
  //   try {
  //     const response = await fetch("/api/auth/logout", {
  //       method: "POST",
  //       credentials: "include",
  //     });
  //     if (response.ok) {
  //       setWasLoggedIn(true);
  //       setIsLoggedIn(false);
  //       setUserRole(null);
  //       setUserRoles([]);
  //       setUserId(null);
  //       setFirstName(null);
  //       setLastName(null);
  //       setEmail(null);
  //       setProfilePicture(null);
  //       setTaskerProfileCheck(false);
  //       setShowDropdown(false);
  //       setErrorMessage(null);
  //       setIsOpen(false);
  //       setUnreadNotifications(0); // Reset notification count
  //       router.push("/");
  //       toast.success("Logged out successfully!");
  //     } else {
  //    //   console.error("Logout failed with status:", response.status);
  //       toast.error("Logout failed. Please try again.");
  //     }
  //   } catch (error) {
  //   //  console.error("Logout failed", error);
  //     toast.error("An error occurred during logout.");
  //   }
  // };


  const handleLogout = async () => {
    console.log("=== FRONTEND LOGOUT DEBUG ===");

    try {
      const response = await fetch("https://taskmatch-backend.vercel.app/api/auth/logout", {
        method: "POST",
        credentials: "include",  // ← This is REQUIRED
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", [...response.headers.entries()]);

      const data = await response.json();
      console.log("Response data:", data);

      // Check if cookies still exist after logout
      console.log("Document cookies after logout:", document.cookie);

      if (response.ok) {
        // Force clear on frontend
        clearAuthState();
        router.push("/");
        toast.success("Logged out successfully!");
      } else {
        console.error("Logout failed:", data);
        toast.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local state
      clearAuthState();
      toast.error("Logout error, cleared local state");
    }
  };

  const clearAuthState = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setUserRoles([]);
    setUserId(null);
    setFirstName(null);
    setLastName(null);
    setEmail(null);
    setProfilePicture(null);
    setTaskerProfileCheck(false);
    setShowDropdown(false);
    setErrorMessage(null);
    setIsOpen(false);
    setUnreadNotifications(0);
  };



  const switchRole = async (newRole: "tasker" | "client") => {
    if (!userId) {
      toast.error("User ID not found.");
      return;
    }

    try {
      const response = await fetch(`https://taskmatch-backend.vercel.app/api/auth/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
        credentials: "include",
      });

      if (response.ok) {
        await checkLoginStatus();
        toast.success(`Switched to ${newRole} mode successfully!`);
        setShowDropdown(false);
        setErrorMessage(null);
        // Refresh notification count after role switch
        fetchNotificationCount();
      } else {
        const errorData = await response.json().catch(() => ({}));
      //  console.error("Switch role failed:", errorData);

        if (errorData.missingFields && newRole === "tasker") {
          const fieldsQuery = errorData.missingFields.join(",");
          toast.error("Tasker profile incomplete. Please complete the required fields.");
          router.push(`/complete-tasker-profile?fields=${fieldsQuery}`);
        } else {
          toast.error(errorData.message || `Failed to switch to ${newRole} mode.`);
        }
      }
    } catch (error) {
   //   console.error("Switch role failed", error);
      toast.error("An error occurred while switching roles.");
    }
  };

  const switchToTasker = () => {
    if (!taskerProfileCheck) {
      toast.info("Complete your Tasker profile first to unlock this mode.");
      router.push("/complete-tasker-profile");
      setShowDropdown(false);
      return;
    }
    switchRole("tasker");
  };

  const switchToClient = () => switchRole("client");

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

  const checkLoginStatus = async () => {
    try {
      const response = await fetch("https://taskmatch-backend.vercel.app/api/auth/verify-token", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setWasLoggedIn(false);
        const currentRole = data.user.currentRole || data.user.role;
        setUserRole(currentRole);
        console.log(data.user)

      //  console.log(data.user)

        const rawRoles = data.user.roles || [data.user.currentRole || "client"];
        const validRoles = rawRoles.filter((role: string) =>
          role && typeof role === 'string' && (role === 'client' || role === 'tasker' || role === 'admin')
        );
        setUserRoles(validRoles.length > 0 ? validRoles : ['client']);
        setTaskerProfileCheck(data.user.taskerProfileCheck || false);
        setUserId(data.user._id);
        setFirstName(data.user.firstName);
        setLastName(data.user.lastName);
        setEmail(data.user.email);
        setProfilePicture(data.user.profilePicture);
        setErrorMessage(null);
      } else {
        const prevLoggedIn = isLoggedIn;
        setIsLoggedIn(false);
        setUserRole(null);
        setUserRoles([]);
        setUserId(null);
        setTaskerProfileCheck(false);
        setFirstName(null);
        setLastName(null);
        setEmail(null);
        setProfilePicture(null);
        setErrorMessage(null);
        setUnreadNotifications(0); // Reset notification count

        if (response.status === 401 && prevLoggedIn) {
       //   console.warn("Verify-token failed with status: 401 - Session expired, clearing auth state.");
          toast.warn("Session expired. Please log in again.");
          router.push("/authentication");
        }
      }
    } catch (error) {
    //  console.error("Verify token failed", error);
      const prevLoggedIn = isLoggedIn;
      setIsLoggedIn(false);
      setUserRole(null);
      setUserRoles([]);
      setUserId(null);
      setTaskerProfileCheck(false);
      setFirstName(null);
      setLastName(null);
      setEmail(null);
      setProfilePicture(null);
      setErrorMessage(null);
      setUnreadNotifications(0); // Reset notification count
      if (prevLoggedIn) {
        toast.error("Authentication check failed. Please refresh or log in.");
      }
    }
  };

  useEffect(() => {
    const fetchLogin = async () => {
      await checkLoginStatus();
    };
    fetchLogin();
  }, []);

  const ProfileAvatar = ({ size = 32 }: { size?: number }) => {
    if (!profilePicture) {
      return (
        <div
          className="rounded-full color1 flex items-center justify-center flex-shrink-0"
          style={{ width: `${size}px`, height: `${size}px` }}
        >
          <FaUser
            className="text-white"
            style={{ width: `${Math.floor(size / 2)}px`, height: `${Math.floor(size / 2)}px` }}
          />
        </div>
      );
    }

    return (
      <div
        className="rounded-full overflow-hidden flex-shrink-0 relative ring-2 ring-white shadow-md"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <Image
          src={profilePicture}
          alt="Profile"
          fill
          className="object-cover"
        />
      </div>
    );
  };

  // Dynamic nav links based on user role
  const getNavLinks = () => {
    const baseLinks = [{ href: "/browse-tasks", label: "Browse Tasks", icon: FaTasks, showBadge: false }];

    if (isLoggedIn && userRole) {
      let workspaceHref: string;
      let workspaceIcon: React.ComponentType<any>;

      switch (userRole) {
        case "client":
          workspaceHref = "/dashboard/client";
          workspaceIcon = FaClipboardList;
          break;
        case "tasker":
          workspaceHref = "/dashboard/tasker";
          workspaceIcon = FaTasks;
          break;
        case "admin":
          workspaceHref = "/dashboard/admin";
          workspaceIcon = FaUserShield;
          break;
        default:
          return baseLinks; // Fallback if role is unknown
      }
      
      baseLinks.push({
        href: workspaceHref,
        label: "My Workspace",
        icon: workspaceIcon,
        showBadge: true // Mark this link to show the notification badge
      });
    }

    return baseLinks;
  };

  const navLinks = getNavLinks();

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg transition-all duration-300 ${isScrolled ? 'shadow-xl' : 'shadow-md'
              }`}
          >
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 lg:h-20">
              {/* Logo */}
              {/* <div className="flex items-center gap-2">
                <Link href="/">
                  <Image
                    src={logo}
                    alt="TaskAllo Logo"
                    className="w-24 h-auto xs:w-28 sm:w-32 lg:w-36"
                    priority
                  />
                </Link>
              </div> */}
              <div className="flex items-center gap-2"> <Link href="/"> <h1 className="text-2xl xs:text-3xl sm:text-3xl lg:text-3xl font-bold color1 bg-clip-text text-transparent"> Taskallo </h1> </Link> 
              {/* <span className="w-2 h-2 rounded-full color2 inline-block top-[12px] xs:top-[14px] sm:top-[16px] lg:top-[18px] relative right-[8px] xs:right-[10px] lg:right-[11px] z-10"></span> */}
               </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-8">
                {/* Become a Tasker Button */}
                {!userRoles.includes("tasker") && isLoggedIn && (
                  <Link href="/complete-tasker-profile">
                    <button className="flex items-center gap-2 px-5 py-2.5 color2 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300">
                      <FaPlusCircle className="text-lg" />
                      <span className="text-sm">Become a Tasker</span>
                    </button>
                  </Link>
                )}

                {/* Navigation Links */}
                <div className="flex items-center gap-4">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link key={link.href} href={link.href}>
                        <button className="relative flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-all duration-200 group">
                          <Icon className="w-4 h-4 text-gray-700 group-hover:text-gray-900 flex-shrink-0" />
                          <span className="font-medium">{link.label}</span>
                          {/* Notification Badge */}
                          {link.showBadge && unreadNotifications > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                              {unreadNotifications > 99 ? '99+' : unreadNotifications}
                            </span>
                          )}
                          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 color1 transition-all duration-300 group-hover:w-3/4"></span>
                        </button>
                      </Link>
                    );
                  })}
                </div>

                {/* Profile Dropdown or Auth Button */}
                {isLoggedIn ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="relative flex items-center gap-3 px-4 py-2 rounded-full hover:bg-gray-100 transition-all duration-200 group"
                    >
                      {/* Notification dot on profile */}
                      {/* {unreadNotifications > 0 && (
                        <>
                          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
                        </>
                      )} */}
                      <ProfileAvatar size={36} />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate text-sm">
                          {firstName} {lastName}
                        </p>
                      </div>                    </button>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                      <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fadeIn">
                        {/* User Info with Notification */}
                        <div className="px-6 py-4 color3 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <ProfileAvatar size={48} />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 truncate">
                                {firstName} {lastName}
                              </p>
                              <p className="text-sm text-gray-600 truncate">{email}</p>
                              {/* Notification count in dropdown */}
                              {unreadNotifications > 0 && (
                                <p className="text-xs text-red-600 mt-1">
                                  <FiBell className="inline w-3 h-3 mr-1" />
                                  {unreadNotifications} unread notification{unreadNotifications !== 1 ? 's' : ''}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Role Switcher */}
                        <div className="px-6 py-4 border-b border-gray-100">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                            Switch Role
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={switchToTasker}
                              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${userRole === "tasker"
                                ? "color1 text-white shadow-md"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                              Tasker
                            </button>
                            <button
                              onClick={switchToClient}
                              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${userRole === "client"
                                ? "color1 text-white shadow-md"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                              Booker
                            </button>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <Link
                            href="/complete-tasker-profile"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-3 px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                          >
                            <FaUser className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">My Profile</span>
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-6 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                          >
                            <FiX className="w-4 h-4" />
                            <span className="font-medium">Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/authentication">
                    <button className="px-6 py-2.5 color2 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300">
                      Sign Up / Login
                    </button>
                  </Link>
                )}
              </div>

              {/* Mobile Menu Button with Notification Badge */}
              <button
                onClick={toggleMenu}
                className="lg:hidden relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {/* Mobile notification badge */}
                {unreadNotifications > 0 && !isOpen && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
                {isOpen ? (
                  <FiX className="w-6 h-6 text-gray-900" />
                ) : (
                  <FiMenu className="w-6 h-6 text-gray-900" />
                )}
              </button>
            </div>

            {/* Mobile Menu */}
            <div
              className={`lg:hidden transition-all duration-300 ease-in-out ${isOpen ? 'block' : 'hidden'
                }`}
            >
              <div className="px-4 pb-6 pt-2 border-t border-gray-100 max-h-[70vh] overflow-y-auto"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {/* User Info Mobile with Notification Count */}
                {isLoggedIn && (
                  <div className="flex items-center gap-3 p-4 mb-4 color3 rounded-xl">
                    <ProfileAvatar size={48} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {firstName} {lastName}
                      </p>
                      <p className="text-sm text-gray-600 truncate">{email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-500 capitalize">{userRole} Mode</p>
                        {unreadNotifications > 0 && (
                          <>
                            <span className="text-gray-300">•</span>
                            <p className="text-xs text-red-600 font-medium">
                              {unreadNotifications} notification{unreadNotifications !== 1 ? 's' : ''}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Role Switcher Mobile */}
                {isLoggedIn && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Switch Role
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          switchToTasker();
                          setIsOpen(false);
                        }}
                        className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${userRole === "tasker"
                          ? "color1 text-white"
                          : "bg-white text-gray-700 border border-gray-200"
                          }`}
                      >
                        Tasker
                      </button>
                      <button
                        onClick={() => {
                          switchToClient();
                          setIsOpen(false);
                        }}
                        className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${userRole === "client"
                          ? "color1 text-white"
                          : "bg-white text-gray-700 border border-gray-200"
                          }`}
                      >
                        Booker
                      </button>
                    </div>
                  </div>
                )}

                {/* Become Tasker Mobile */}
                {!userRoles.includes("tasker") && isLoggedIn && (
                  <Link href="/tasker-signup" onClick={() => setIsOpen(false)}>
                    <button className="w-full flex items-center justify-center gap-2 px-5 py-3 mb-4 color2 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300">
                      <FaPlusCircle className="text-lg" />
                      <span>Become a Tasker</span>
                    </button>
                  </Link>
                )}

                {/* Navigation Links Mobile */}
                <div className="space-y-1 mb-4">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
                        <button className="relative w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-150">
                          <Icon className="w-4 h-4 text-gray-400" />
                          <span className="font-medium flex-1">{link.label}</span>
                          {/* Mobile notification badge */}
                          {link.showBadge && unreadNotifications > 0 && (
                            <span className="min-w-[24px] px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                              {unreadNotifications > 99 ? '99+' : unreadNotifications}
                            </span>
                          )}
                        </button>
                      </Link>
                    );
                  })}
                </div>

                {/* Auth Buttons Mobile */}
                {isLoggedIn ? (
                  <div className="space-y-2 pt-4 border-t border-gray-200">
                    <Link href="/complete-tasker-profile" onClick={() => setIsOpen(false)}>
                      <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-150">
                        <FaUser className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">My Profile</span>
                      </button>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                    >
                      <FiX className="w-4 h-4" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                ) : (
                  <Link href="/authentication" onClick={() => setIsOpen(false)}>
                    <button className="w-full px-6 py-3 color2 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300">
                      Sign Up / Login
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div className="h-24 lg:h-28"></div>

      {/* Error Toast */}
      {errorMessage && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-[100] flex items-center gap-3 animate-slideIn">
          <span>{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-white hover:text-gray-200 font-bold text-xl"
          >
            ×
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;