/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { FiMenu, FiX, FiChevronDown, FiBell, FiClock, FiAlertCircle } from "react-icons/fi";
import { FaPlusCircle, FaUser, FaBriefcase, FaClipboardList, FaTasks, FaUserShield, FaRedo } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import logo from "../../public/Images/ChatGPT_Image_Dec_10__2025__04_46_12_PM-removebg-preview.png"


const serviceCategories = [
  {
    title: 'Plumbing Services',
    href: '/services/toronto/plumber',
    description: 'Licensed plumbers for repairs and installations',
  },
  {
    title: 'Handyman & Home Repairs',
    href: '/services/toronto/handyman',
    description: 'Furniture assembly, painting, drywall, and more',
  },
  {
    title: 'Pet Services',
    href: '/services/toronto/pet-services',
    description: 'Dog walking, pet sitting, grooming, and boarding',
  },
  {
    title: 'Cleaning Services',
    href: '/services/toronto/cleaning-services',
    description: 'House cleaning, deep cleaning, move-in/out',
  },
  {
    title: 'Automotive Services',
    href: '/services/toronto/automotive-services',
    description: 'Car repair, oil changes, brake service',
  },
  {
    title: 'Specialized Services',
    href: '/services/toronto/specialized-services',
    description: 'Moving help, junk removal, and custom tasks',
  },
];

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

  // CHANGED: From taskerProfileCheck to taskerStatus
  const [taskerStatus, setTaskerStatus] = useState<string>("not_applied");

  const [wasLoggedIn, setWasLoggedIn] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);


  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [showMobileServices, setShowMobileServices] = useState(false);
  const servicesDropdownRef = useRef<HTMLDivElement>(null);

  // Close services dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        servicesDropdownRef.current &&
        !servicesDropdownRef.current.contains(event.target as Node)
      ) {
        setShowServicesDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


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
      const response = await fetch("/api/auth/notifications", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUnreadNotifications(data.unreadCount || 0);
      }
    } catch (error) {
      // Silent fail
    }
  };

  // Fetch notifications when user logs in or role changes
  useEffect(() => {
    if (isLoggedIn) {
      fetchNotificationCount();
      const interval = setInterval(fetchNotificationCount, 30000);
      return () => clearInterval(interval);
    } else {
      setUnreadNotifications(0);
    }
  }, [isLoggedIn, userRole]);

  const handleLogout = async () => {
    console.log("=== FRONTEND LOGOUT DEBUG ===");

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        clearAuthState();
        router.push("/");
        toast.success("Logged out successfully!");
      } else {
        console.error("Logout failed:", data);
        toast.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
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
    setTaskerStatus("not_applied"); // CHANGED
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
      const response = await fetch(`/api/auth/users/${userId}`, {
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
        fetchNotificationCount();
      } else {
        const errorData = await response.json().catch(() => ({}));

        if (errorData.missingFields && newRole === "tasker") {
          const fieldsQuery = errorData.missingFields.join(",");
          toast.error("Tasker profile incomplete. Please complete the required fields.");
          router.push(`/complete-tasker-profile?fields=${fieldsQuery}`);
        } else {
          toast.error(errorData.message || `Failed to switch to ${newRole} mode.`);
        }
      }
    } catch (error) {
      toast.error("An error occurred while switching roles.");
    }
  };

  // UPDATED: Switch to Tasker with taskerStatus check
  const switchToTasker = () => {
    // Check tasker status instead of taskerProfileCheck
    if (taskerStatus !== "approved") {
      switch (taskerStatus) {
        case "under_review":
          toast.info("Your tasker application is currently under review. Please wait for approval.");
          break;
        case "rejected":
          toast.error("Your tasker application was rejected. Please update your documents and reapply.");
          router.push("/complete-tasker-profile");
          break;
        case "not_applied":
        default:
          toast.info("Complete your Tasker profile first to unlock this mode.");
          router.push("/complete-tasker-profile");
          break;
      }
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
      const response = await fetch("/api/auth/verify-token", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setWasLoggedIn(false);
        const currentRole = data.user.currentRole || data.user.role;
        setUserRole(currentRole);
        console.log("User data:", data.user);

        const rawRoles = data.user.roles || [data.user.currentRole || "client"];
        const validRoles = rawRoles.filter((role: string) =>
          role && typeof role === 'string' && (role === 'client' || role === 'tasker' || role === 'admin')
        );
        setUserRoles(validRoles.length > 0 ? validRoles : ['client']);

        // CHANGED: Use taskerStatus instead of taskerProfileCheck
        setTaskerStatus(data.user.taskerStatus || "not_applied");

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
        setTaskerStatus("not_applied"); // CHANGED
        setFirstName(null);
        setLastName(null);
        setEmail(null);
        setProfilePicture(null);
        setErrorMessage(null);
        setUnreadNotifications(0);

        if (response.status === 401 && prevLoggedIn) {
          toast.warn("Session expired. Please log in again.");
          router.push("/authentication");
        }
      }
    } catch (error) {
      const prevLoggedIn = isLoggedIn;
      setIsLoggedIn(false);
      setUserRole(null);
      setUserRoles([]);
      setUserId(null);
      setTaskerStatus("not_applied"); // CHANGED
      setFirstName(null);
      setLastName(null);
      setEmail(null);
      setProfilePicture(null);
      setErrorMessage(null);
      setUnreadNotifications(0);
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
          return baseLinks;
      }

      baseLinks.push({
        href: workspaceHref,
        label: "My Workspace",
        icon: workspaceIcon,
        showBadge: true
      });
    }

    return baseLinks;
  };

  const navLinks = getNavLinks();

  // UPDATED: Helper function to get tasker button config based on status
  // const getTaskerButtonConfig = () => {
  //   switch (taskerStatus) {
  //     case "approved":
  //       return null; // Don't show button - they're already a tasker
  //     case "under_review":
  //       return {
  //         label: "Application Under Review",
  //         icon: FiClock,
  //         href: null,
  //         disabled: true,
  //         className: "bg-amber-500 cursor-not-allowed",
  //         onClick: () => toast.info("Your application is being reviewed. We'll notify you once it's processed.")
  //       };
  //     case "rejected":
  //       return {
  //         label: "Reapply as Tasker",
  //         icon: FaRedo,
  //         href: "/complete-tasker-profile",
  //         disabled: false,
  //         className: "color2",
  //         onClick: null
  //       };
  //     case "not_applied":
  //     default:
  //       return {
  //         label: "Become a Tasker",
  //         icon: FaPlusCircle,
  //         href: "/complete-tasker-profile",
  //         disabled: false,
  //         className: "color2",
  //         onClick: null
  //       };
  //   }
  // };

  // UPDATED: Helper function to get tasker button config based on status and login state
  const getTaskerButtonConfig = () => {
    // 1. New Logic: If user is NOT logged in
    if (!isLoggedIn) {
      return {
        label: "Become a Tasker",
        icon: FaPlusCircle,
        href: "/authentication", // Navigate to Login/Signup page
        disabled: false,
        className: "color2",
        onClick: null
      };
    }

    // 2. Existing Logic: If user IS logged in, check specific status
    switch (taskerStatus) {
      case "approved":
        return null; // Don't show button - they're already a tasker
      case "under_review":
        return {
          label: "Application Under Review",
          icon: FiClock,
          href: null,
          disabled: true,
          className: "bg-amber-500 cursor-not-allowed",
          onClick: () => toast.info("Your application is being reviewed. We'll notify you once it's processed.")
        };
      case "rejected":
        return {
          label: "Reapply as Tasker",
          icon: FaRedo,
          href: "/complete-tasker-profile",
          disabled: false,
          className: "color2",
          onClick: null
        };
      case "not_applied":
      default:
        return {
          label: "Become a Tasker",
          icon: FaPlusCircle,
          href: "/complete-tasker-profile",
          disabled: false,
          className: "color2",
          onClick: null
        };
    }
  };

  const taskerButtonConfig = getTaskerButtonConfig();

  // UPDATED: Helper to get status badge for dropdown
  const getTaskerStatusBadge = () => {
    switch (taskerStatus) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            Approved Tasker
          </span>
        );
      case "under_review":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
            <FiClock className="w-3 h-3" />
            Under Review
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
            <FiAlertCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    // <>
    //   <nav
    //     className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'
    //       }`}
    //   >
    //     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    //       <div
    //         className={`relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg transition-all duration-300 ${isScrolled ? 'shadow-xl' : 'shadow-md'
    //           }`}
    //       >
    //         <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 lg:h-20">
    //           {/* Logo */}
    //           <div className="flex items-center gap-2">
    //             <Link href="/">
    //               <Image
    //                 src={logo}
    //                 alt="TaskAllo Logo"
    //                 className="w-24 h-auto xs:w-28 sm:w-32 lg:w-36"
    //                 priority
    //               />
    //             </Link>
    //           </div>

    //           {/* Desktop Navigation */}
    //           <div className="hidden lg:flex items-center gap-8">
    //             {/* Become a Tasker Button */}
    //             {isLoggedIn && taskerButtonConfig && (
    //               taskerButtonConfig.href ? (
    //                 <Link href={taskerButtonConfig.href}>
    //                   <button
    //                     className={`flex items-center gap-2 px-5 py-2.5 ${taskerButtonConfig.className} text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300`}
    //                     disabled={taskerButtonConfig.disabled}
    //                   >
    //                     <taskerButtonConfig.icon className="text-lg" />
    //                     <span className="text-sm">{taskerButtonConfig.label}</span>
    //                   </button>
    //                 </Link>
    //               ) : (
    //                 <button
    //                   onClick={taskerButtonConfig.onClick}
    //                   className={`flex items-center gap-2 px-5 py-2.5 ${taskerButtonConfig.className} text-white font-semibold rounded-full transition-all duration-300`}
    //                   disabled={taskerButtonConfig.disabled}
    //                 >
    //                   <taskerButtonConfig.icon className="text-lg" />
    //                   <span className="text-sm">{taskerButtonConfig.label}</span>
    //                 </button>
    //               )
    //             )}

    //             {/* Navigation Links */}
    //             <div className="flex items-center gap-4">
    //               {/* ========== SERVICES DROPDOWN - DESKTOP ========== */}
    //               <div className="relative" ref={servicesDropdownRef}>
    //                 <button
    //                   onClick={() => setShowServicesDropdown(!showServicesDropdown)}
    //                   onMouseEnter={() => setShowServicesDropdown(true)}
    //                   className="relative flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-all duration-200 group"
    //                 >
    //                   <span className="font-medium">Services</span>
    //                   <FiChevronDown
    //                     className={`w-4 h-4 transition-transform duration-200 ${showServicesDropdown ? 'rotate-180' : ''
    //                       }`}
    //                   />
    //                   <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 color1 transition-all duration-300 group-hover:w-3/4"></span>
    //                 </button>

    //                 {/* Services Dropdown Menu */}
    //                 {showServicesDropdown && (
    //                   <div
    //                     className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fadeIn z-50"
    //                     onMouseLeave={() => setShowServicesDropdown(false)}
    //                   >
    //                     {/* Dropdown Header */}
    //                     <div className="px-5 py-4 bg-gradient-to-r from-[#063A41] to-[#0a4f59] text-white">
    //                       <p className="font-semibold">Our Services</p>
    //                       <p className="text-sm text-gray-200">Toronto & GTA</p>
    //                     </div>

    //                     {/* Service Links */}
    //                     <div className="py-2">
    //                       {serviceCategories.map((service, index) => (
    //                         <Link
    //                           key={index}
    //                           href={service.href}
    //                           onClick={() => setShowServicesDropdown(false)}
    //                           className="flex flex-col px-5 py-3 hover:bg-gray-50 transition-colors duration-150 group"
    //                         >
    //                           <span className="font-medium text-[#063A41] group-hover:text-[#109C3D] transition-colors">
    //                             {service.title}
    //                           </span>
    //                           <span className="text-xs text-gray-500 mt-0.5">
    //                             {service.description}
    //                           </span>
    //                         </Link>
    //                       ))}
    //                     </div>

    //                     {/* Dropdown Footer */}
    //                     <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
    //                       <Link
    //                         href="/browse-tasks"
    //                         onClick={() => setShowServicesDropdown(false)}
    //                         className="text-sm font-medium text-[#109C3D] hover:text-[#063A41] transition-colors flex items-center gap-1"
    //                       >
    //                         View All Available Tasks
    //                         <span className="text-lg">→</span>
    //                       </Link>
    //                     </div>
    //                   </div>
    //                 )}
    //               </div>
    //               {/* ========== END SERVICES DROPDOWN - DESKTOP ========== */}

    //               {/* Other Navigation Links */}
    //               {navLinks.map((link) => {
    //                 const Icon = link.icon;
    //                 return (
    //                   <Link key={link.href} href={link.href}>
    //                     <button className="relative flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-all duration-200 group">
    //                       <Icon className="w-4 h-4 text-gray-700 group-hover:text-gray-900 flex-shrink-0" />
    //                       <span className="font-medium">{link.label}</span>
    //                       {link.showBadge && unreadNotifications > 0 && (
    //                         <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
    //                           {unreadNotifications > 99 ? '99+' : unreadNotifications}
    //                         </span>
    //                       )}
    //                       <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 color1 transition-all duration-300 group-hover:w-3/4"></span>
    //                     </button>
    //                   </Link>
    //                 );
    //               })}
    //             </div>

    //             {/* Profile Dropdown or Auth Button */}
    //             {isLoggedIn ? (
    //               <div className="relative" ref={dropdownRef}>
    //                 <button
    //                   onClick={() => setShowDropdown(!showDropdown)}
    //                   className="relative flex items-center gap-3 px-4 py-2 rounded-full hover:bg-gray-100 transition-all duration-200 group"
    //                 >
    //                   <ProfileAvatar size={36} />
    //                   <div className="flex-1 min-w-0">
    //                     <p className="font-semibold text-gray-900 truncate text-sm">
    //                       {firstName} {lastName}
    //                     </p>
    //                   </div>
    //                 </button>

    //                 {/* Dropdown Menu */}
    //                 {showDropdown && (
    //                   <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fadeIn">
    //                     {/* User Info with Tasker Status Badge */}
    //                     <div className="px-6 py-4 color3 border-b border-gray-100">
    //                       <div className="flex items-center gap-3">
    //                         <ProfileAvatar size={48} />
    //                         <div className="flex-1 min-w-0">
    //                           <p className="font-semibold text-gray-900 truncate">
    //                             {firstName} {lastName}
    //                           </p>
    //                           <p className="text-sm text-gray-600 truncate">{email}</p>
    //                           {/* Tasker Status Badge */}
    //                           <div className="mt-1">
    //                             {getTaskerStatusBadge()}
    //                           </div>
    //                           {unreadNotifications > 0 && (
    //                             <p className="text-xs text-red-600 mt-1">
    //                               <FiBell className="inline w-3 h-3 mr-1" />
    //                               {unreadNotifications} unread notification{unreadNotifications !== 1 ? 's' : ''}
    //                             </p>
    //                           )}
    //                         </div>
    //                       </div>
    //                     </div>

    //                     {/* Role Switcher */}
    //                     <div className="px-6 py-4 border-b border-gray-100">
    //                       <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
    //                         Switch Role
    //                       </p>
    //                       <div className="flex gap-2">
    //                         <button
    //                           onClick={switchToTasker}
    //                           disabled={taskerStatus !== "approved"}
    //                           className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${userRole === "tasker"
    //                               ? "color1 text-white shadow-md"
    //                               : taskerStatus === "approved"
    //                                 ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
    //                                 : "bg-gray-100 text-gray-400 cursor-not-allowed"
    //                             }`}
    //                           title={taskerStatus !== "approved" ? `Tasker status: ${taskerStatus}` : "Switch to Tasker"}
    //                         >
    //                           <div className="flex items-center justify-center gap-1">
    //                             Tasker
    //                             {taskerStatus === "under_review" && (
    //                               <FiClock className="w-3 h-3 text-amber-500" />
    //                             )}
    //                           </div>
    //                         </button>
    //                         <button
    //                           onClick={switchToClient}
    //                           className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${userRole === "client"
    //                               ? "color1 text-white shadow-md"
    //                               : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    //                             }`}
    //                         >
    //                           Booker
    //                         </button>
    //                       </div>
    //                       {/* Status message under role switcher */}
    //                       {taskerStatus === "under_review" && (
    //                         <p className="text-xs text-amber-600 mt-2 text-center">
    //                           Your tasker application is being reviewed
    //                         </p>
    //                       )}
    //                       {taskerStatus === "rejected" && (
    //                         <p className="text-xs text-red-600 mt-2 text-center">
    //                           Application rejected. <Link href="/update-document" className="underline" onClick={() => setShowDropdown(false)}>Reapply here</Link>
    //                         </p>
    //                       )}
    //                       {taskerStatus === "not_applied" && (
    //                         <p className="text-xs text-gray-500 mt-2 text-center">
    //                           <Link href="/update-document" className="text-blue-600 underline" onClick={() => setShowDropdown(false)}>Apply to become a Tasker</Link>
    //                         </p>
    //                       )}
    //                     </div>

    //                     {/* Menu Items */}
    //                     <div className="py-2">
    //                       <Link
    //                         href={taskerStatus === "approved" ? "/complete-tasker-profile" : "/complete-booker-profile"}
    //                         onClick={() => setShowDropdown(false)}
    //                         className="flex items-center gap-3 px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
    //                       >
    //                         <FaUser className="w-4 h-4 text-gray-400" />
    //                         <span className="font-medium">My Profile</span>
    //                       </Link>
    //                       <button
    //                         onClick={handleLogout}
    //                         className="w-full flex items-center gap-3 px-6 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
    //                       >
    //                         <FiX className="w-4 h-4" />
    //                         <span className="font-medium">Logout</span>
    //                       </button>
    //                     </div>
    //                   </div>
    //                 )}
    //               </div>
    //             ) : (
    //               <Link href="/authentication">
    //                 <button className="px-6 py-2.5 color2 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300">
    //                   Sign Up / Login
    //                 </button>
    //               </Link>
    //             )}
    //           </div>

    //           {/* Mobile Menu Button */}
    //           <button
    //             onClick={toggleMenu}
    //             className="lg:hidden relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
    //             aria-label="Toggle menu"
    //           >
    //             {unreadNotifications > 0 && !isOpen && (
    //               <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
    //                 {unreadNotifications > 9 ? '9+' : unreadNotifications}
    //               </span>
    //             )}
    //             {isOpen ? (
    //               <FiX className="w-6 h-6 text-gray-900" />
    //             ) : (
    //               <FiMenu className="w-6 h-6 text-gray-900" />
    //             )}
    //           </button>
    //         </div>

    //         {/* Mobile Menu */}
    //         <div
    //           className={`lg:hidden transition-all duration-300 ease-in-out ${isOpen ? 'block' : 'hidden'
    //             }`}
    //         >
    //           <div
    //             className="px-4 pb-6 pt-2 border-t border-gray-100 max-h-[70vh] overflow-y-auto"
    //             style={{ WebkitOverflowScrolling: 'touch' }}
    //           >
    //             {/* User Info Mobile with Tasker Status */}
    //             {isLoggedIn && (
    //               <div className="flex items-center gap-3 p-4 mb-4 color3 rounded-xl">
    //                 <ProfileAvatar size={48} />
    //                 <div className="flex-1 min-w-0">
    //                   <p className="font-semibold text-gray-900 truncate">
    //                     {firstName} {lastName}
    //                   </p>
    //                   <p className="text-sm text-gray-600 truncate">{email}</p>
    //                   <div className="flex items-center gap-2 mt-1 flex-wrap">
    //                     <p className="text-xs text-gray-500 capitalize">{userRole} Mode</p>
    //                     {getTaskerStatusBadge()}
    //                     {unreadNotifications > 0 && (
    //                       <>
    //                         <span className="text-gray-300">|</span>
    //                         <p className="text-xs text-red-600 font-medium">
    //                           {unreadNotifications} notification{unreadNotifications !== 1 ? 's' : ''}
    //                         </p>
    //                       </>
    //                     )}
    //                   </div>
    //                 </div>
    //               </div>
    //             )}

    //             {/* Role Switcher Mobile */}
    //             {isLoggedIn && (
    //               <div className="mb-4 p-4 bg-gray-50 rounded-xl">
    //                 <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
    //                   Switch Role
    //                 </p>
    //                 <div className="flex gap-2">
    //                   <button
    //                     onClick={() => {
    //                       switchToTasker();
    //                       if (taskerStatus === "approved") {
    //                         setIsOpen(false);
    //                       }
    //                     }}
    //                     disabled={taskerStatus !== "approved"}
    //                     className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${userRole === "tasker"
    //                         ? "color1 text-white"
    //                         : taskerStatus === "approved"
    //                           ? "bg-white text-gray-700 border border-gray-200"
    //                           : "bg-gray-200 text-gray-400 cursor-not-allowed"
    //                       }`}
    //                   >
    //                     <div className="flex items-center justify-center gap-1">
    //                       Tasker
    //                       {taskerStatus === "under_review" && <FiClock className="w-3 h-3 text-amber-500" />}
    //                     </div>
    //                   </button>
    //                   <button
    //                     onClick={() => {
    //                       switchToClient();
    //                       setIsOpen(false);
    //                     }}
    //                     className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${userRole === "client"
    //                         ? "color1 text-white"
    //                         : "bg-white text-gray-700 border border-gray-200"
    //                       }`}
    //                   >
    //                     Booker
    //                   </button>
    //                 </div>
    //                 {/* Status message for mobile */}
    //                 {taskerStatus === "under_review" && (
    //                   <p className="text-xs text-amber-600 mt-2 text-center">
    //                     Application under review
    //                   </p>
    //                 )}
    //                 {taskerStatus === "rejected" && (
    //                   <p className="text-xs text-red-600 mt-2 text-center">
    //                     <Link href="/update-document" className="underline" onClick={() => setIsOpen(false)}>
    //                       Reapply as Tasker
    //                     </Link>
    //                   </p>
    //                 )}
    //               </div>
    //             )}

    //             {/* Become Tasker Mobile */}
    //             {isLoggedIn && taskerButtonConfig && (
    //               taskerButtonConfig.href ? (
    //                 <Link href={taskerButtonConfig.href} onClick={() => setIsOpen(false)}>
    //                   <button
    //                     className={`w-full flex items-center justify-center gap-2 px-5 py-3 mb-4 ${taskerButtonConfig.className} text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300`}
    //                     disabled={taskerButtonConfig.disabled}
    //                   >
    //                     <taskerButtonConfig.icon className="text-lg" />
    //                     <span>{taskerButtonConfig.label}</span>
    //                   </button>
    //                 </Link>
    //               ) : (
    //                 <button
    //                   onClick={() => {
    //                     if (taskerButtonConfig.onClick) {
    //                       taskerButtonConfig.onClick();
    //                     }
    //                     setIsOpen(false);
    //                   }}
    //                   className={`w-full flex items-center justify-center gap-2 px-5 py-3 mb-4 ${taskerButtonConfig.className} text-white font-semibold rounded-xl transition-all duration-300`}
    //                   disabled={taskerButtonConfig.disabled}
    //                 >
    //                   <taskerButtonConfig.icon className="text-lg" />
    //                   <span>{taskerButtonConfig.label}</span>
    //                 </button>
    //               )
    //             )}

    //             {/* ========== SERVICES DROPDOWN - MOBILE ========== */}
    //             <div className="mb-4">
    //               <button
    //                 onClick={() => setShowMobileServices(!showMobileServices)}
    //                 className="w-full flex items-center justify-between px-4 py-3 text-left text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors duration-150"
    //               >
    //                 <span className="font-semibold">Services</span>
    //                 <FiChevronDown
    //                   className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${showMobileServices ? 'rotate-180' : ''
    //                     }`}
    //                 />
    //               </button>

    //               {showMobileServices && (
    //                 <div className="mt-2 bg-white rounded-xl border border-gray-100 overflow-hidden">
    //                   {serviceCategories.map((service, index) => (
    //                     <Link
    //                       key={index}
    //                       href={service.href}
    //                       onClick={() => {
    //                         setShowMobileServices(false);
    //                         setIsOpen(false);
    //                       }}
    //                       className={`flex flex-col px-4 py-3 hover:bg-gray-50 transition-colors duration-150 ${index !== serviceCategories.length - 1 ? 'border-b border-gray-100' : ''
    //                         }`}
    //                     >
    //                       <span className="font-medium text-[#063A41]">
    //                         {service.title}
    //                       </span>
    //                       <span className="text-xs text-gray-500 mt-0.5">
    //                         {service.description}
    //                       </span>
    //                     </Link>
    //                   ))}

    //                   {/* View All Link */}
    //                   <Link
    //                     href="/browse-tasks"
    //                     onClick={() => {
    //                       setShowMobileServices(false);
    //                       setIsOpen(false);
    //                     }}
    //                     className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 text-[#109C3D] font-medium text-sm hover:bg-gray-100 transition-colors"
    //                   >
    //                     View All Available Tasks
    //                     <span>→</span>
    //                   </Link>
    //                 </div>
    //               )}
    //             </div>
    //             {/* ========== END SERVICES DROPDOWN - MOBILE ========== */}

    //             {/* Navigation Links Mobile */}
    //             <div className="space-y-1 mb-4">
    //               {navLinks.map((link) => {
    //                 const Icon = link.icon;
    //                 return (
    //                   <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
    //                     <button className="relative w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-150">
    //                       <Icon className="w-4 h-4 text-gray-400" />
    //                       <span className="font-medium flex-1">{link.label}</span>
    //                       {link.showBadge && unreadNotifications > 0 && (
    //                         <span className="min-w-[24px] px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
    //                           {unreadNotifications > 99 ? '99+' : unreadNotifications}
    //                         </span>
    //                       )}
    //                     </button>
    //                   </Link>
    //                 );
    //               })}
    //             </div>

    //             {/* Auth Buttons Mobile */}
    //             {isLoggedIn ? (
    //               <div className="space-y-2 pt-4 border-t border-gray-200">
    //                 <Link
    //                   href="/complete-tasker-profile"
    //                   onClick={() => setIsOpen(false)}
    //                 >
    //                   <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-150">
    //                     <FaUser className="w-4 h-4 text-gray-400" />
    //                     <span className="font-medium">My Profile</span>
    //                   </button>
    //                 </Link>
    //                 <button
    //                   onClick={handleLogout}
    //                   className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
    //                 >
    //                   <FiX className="w-4 h-4" />
    //                   <span className="font-medium">Logout</span>
    //                 </button>
    //               </div>
    //             ) : (
    //               <Link href="/authentication" onClick={() => setIsOpen(false)}>
    //                 <button className="w-full px-6 py-3 color2 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300">
    //                   Sign Up / Login
    //                 </button>
    //               </Link>
    //             )}
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </nav>

    //   {/* Spacer to prevent content from hiding under fixed navbar */}
    //   <div className="h-24 lg:h-28"></div>

    //   {/* Error Toast */}
    //   {errorMessage && (
    //     <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-[100] flex items-center gap-3 animate-slideIn">
    //       <span>{errorMessage}</span>
    //       <button
    //         onClick={() => setErrorMessage(null)}
    //         className="text-white hover:text-gray-200 font-bold text-xl"
    //       >
    //         ×
    //       </button>
    //     </div>
    //   )}

    //   <style jsx>{`
    //     @keyframes fadeIn {
    //       from {
    //         opacity: 0;
    //         transform: translateY(-10px);
    //       }
    //       to {
    //         opacity: 1;
    //         transform: translateY(0);
    //       }
    //     }

    //     @keyframes slideIn {
    //       from {
    //         transform: translateX(100%);
    //       }
    //       to {
    //         transform: translateX(0);
    //       }
    //     }

    //     .animate-fadeIn {
    //       animation: fadeIn 0.2s ease-out;
    //     }

    //     .animate-slideIn {
    //       animation: slideIn 0.3s ease-out;
    //     }
    //   `}</style>
    // </>

    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-1 sm:py-2' : 'py-2 sm:py-3 md:py-4'
          }`}
      >
        <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8">
          <div
            className={`relative bg-white/90 backdrop-blur-lg rounded-xl sm:rounded-2xl transition-all duration-300 ${isScrolled ? 'shadow-xl' : 'shadow-lg'
              }`}
          >
            <div className="flex items-center justify-between px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 h-14 xs:h-15 sm:h-16 md:h-18 lg:h-20">

              {/* Logo */}
              <Link href="/" className="flex-shrink-0">
                <Image
                  src={logo}
                  alt="TaskAllo Logo"
                  className="w-20 xs:w-22 sm:w-26 md:w-28 lg:w-32 xl:w-36 h-auto"
                  priority
                />
              </Link>

              {/* Desktop Navigation - Shows on lg and above */}
              <div className="hidden lg:flex items-center gap-3 xl:gap-6">

                {/* Become a Tasker Button */}
                {/* {isLoggedIn && taskerButtonConfig && ( */}
                {/* Mobile Become Tasker Button */}
                {taskerButtonConfig && (
                  taskerButtonConfig.href ? (
                    <Link href={taskerButtonConfig.href}>
                      <button
                        className={`flex items-center gap-1.5 xl:gap-2 px-3 xl:px-5 py-2 xl:py-2.5 ${taskerButtonConfig.className} text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 text-xs xl:text-sm whitespace-nowrap`}
                        disabled={taskerButtonConfig.disabled}
                      >
                        <taskerButtonConfig.icon className="text-sm xl:text-lg flex-shrink-0" />
                        <span>{taskerButtonConfig.label}</span>
                      </button>
                    </Link>
                  ) : (
                    <button
                      onClick={taskerButtonConfig.onClick}
                      className={`flex items-center gap-1.5 xl:gap-2 px-3 xl:px-5 py-2 xl:py-2.5 ${taskerButtonConfig.className} text-white font-semibold rounded-full transition-all duration-300 text-xs xl:text-sm whitespace-nowrap`}
                      disabled={taskerButtonConfig.disabled}
                    >
                      <taskerButtonConfig.icon className="text-sm xl:text-lg flex-shrink-0" />
                      <span>{taskerButtonConfig.label}</span>
                    </button>
                  )
                )}

                {/* Navigation Links Container */}
                <div className="flex items-center gap-1 xl:gap-2">

                  {/* Services Dropdown */}
                  <div className="relative" ref={servicesDropdownRef}>
                    <button
                      onClick={() => setShowServicesDropdown(!showServicesDropdown)}
                      onMouseEnter={() => setShowServicesDropdown(true)}
                      className="flex items-center gap-1 px-2.5 xl:px-4 py-2 text-xs xl:text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-all duration-200 whitespace-nowrap"
                    >
                      <span>Services</span>
                      <FiChevronDown
                        className={`w-3.5 h-3.5 xl:w-4 xl:h-4 transition-transform duration-200 ${showServicesDropdown ? 'rotate-180' : ''
                          }`}
                      />
                    </button>

                    {/* Services Dropdown Menu */}
                    {showServicesDropdown && (
                      <div
                        className="absolute top-full left-0 mt-2 w-64 xl:w-80 bg-white rounded-xl xl:rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fadeIn z-50"
                        onMouseLeave={() => setShowServicesDropdown(false)}
                      >
                        {/* Header */}
                        <div className="px-4 xl:px-5 py-3 xl:py-4 bg-gradient-to-r from-[#063A41] to-[#0a4f59] text-white">
                          <p className="font-semibold text-sm xl:text-base">Our Services</p>
                          <p className="text-xs xl:text-sm text-gray-200">Toronto & GTA</p>
                        </div>

                        {/* Service Links */}
                        <div className="py-1 max-h-64 xl:max-h-80 overflow-y-auto">
                          {serviceCategories.map((service, index) => (
                            <Link
                              key={index}
                              href={service.href}
                              onClick={() => setShowServicesDropdown(false)}
                              className="flex flex-col px-4 xl:px-5 py-2.5 xl:py-3 hover:bg-gray-50 transition-colors group"
                            >
                              <span className="font-medium text-xs xl:text-sm text-[#063A41] group-hover:text-[#109C3D] transition-colors">
                                {service.title}
                              </span>
                              <span className="text-[10px] xl:text-xs text-gray-500 mt-0.5 line-clamp-1">
                                {service.description}
                              </span>
                            </Link>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="px-4 xl:px-5 py-2.5 xl:py-3 bg-gray-50 border-t border-gray-100">
                          <Link
                            href="/browse-tasks"
                            onClick={() => setShowServicesDropdown(false)}
                            className="text-xs xl:text-sm font-medium text-[#109C3D] hover:text-[#063A41] transition-colors flex items-center gap-1"
                          >
                            View All Available Tasks
                            <span>→</span>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Other Navigation Links */}
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <button className="relative px-2.5 xl:px-4 py-2 text-xs xl:text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-all duration-200 whitespace-nowrap">
                        {link.label}
                        {link.showBadge && unreadNotifications > 0 && (
                          <span className="absolute -top-1 -right-1 min-w-[16px] xl:min-w-[20px] h-4 xl:h-5 px-1 bg-red-500 text-white text-[10px] xl:text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                            {unreadNotifications > 99 ? '99+' : unreadNotifications}
                          </span>
                        )}
                      </button>
                    </Link>
                  ))}
                </div>

                {/* Profile Dropdown or Auth Button */}
                {isLoggedIn ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="flex items-center gap-2 xl:gap-3 px-2 xl:px-3 py-1.5 rounded-full hover:bg-gray-100 transition-all duration-200"
                    >
                      <ProfileAvatar size={32} />
                      <span className="hidden xl:block font-semibold text-gray-900 text-sm max-w-[100px] truncate">
                        {firstName}
                      </span>
                      <FiChevronDown className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-gray-500 flex-shrink-0" />
                    </button>

                    {/* Profile Dropdown Menu */}
                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-60 xl:w-72 bg-white rounded-xl xl:rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fadeIn z-50">
                        {/* User Info */}
                        <div className="px-4 xl:px-6 py-3 xl:py-4 color3 border-b border-gray-100">
                          <div className="flex items-center gap-2 xl:gap-3">
                            <ProfileAvatar size={40} />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 truncate text-sm">
                                {firstName} {lastName}
                              </p>
                              <p className="text-xs text-gray-600 truncate">{email}</p>
                              <div className="mt-1">{getTaskerStatusBadge()}</div>
                              {unreadNotifications > 0 && (
                                <p className="text-[10px] xl:text-xs text-red-600 mt-1 flex items-center gap-1">
                                  <FiBell className="w-3 h-3" />
                                  {unreadNotifications} unread
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Role Switcher */}
                        <div className="px-4 xl:px-6 py-3 xl:py-4 border-b border-gray-100">
                          <p className="text-[10px] xl:text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 xl:mb-3">
                            Switch Role
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={switchToTasker}
                              disabled={taskerStatus !== "approved"}
                              className={`flex-1 py-2 px-3 rounded-lg xl:rounded-xl text-xs xl:text-sm font-medium transition-all duration-200 ${userRole === "tasker"
                                  ? "color1 text-white shadow-md"
                                  : taskerStatus === "approved"
                                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                }`}
                              title={taskerStatus !== "approved" ? `Status: ${taskerStatus}` : "Switch to Tasker"}
                            >
                              <span className="flex items-center justify-center gap-1">
                                Tasker
                                {taskerStatus === "under_review" && <FiClock className="w-3 h-3 text-amber-500" />}
                              </span>
                            </button>
                            <button
                              onClick={switchToClient}
                              className={`flex-1 py-2 px-3 rounded-lg xl:rounded-xl text-xs xl:text-sm font-medium transition-all duration-200 ${userRole === "client"
                                  ? "color1 text-white shadow-md"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                              Booker
                            </button>
                          </div>

                          {/* Status Messages */}
                          {taskerStatus === "under_review" && (
                            <p className="text-[10px] xl:text-xs text-amber-600 mt-2 text-center">
                              Application under review
                            </p>
                          )}
                          {taskerStatus === "rejected" && (
                            <p className="text-[10px] xl:text-xs text-red-600 mt-2 text-center">
                              Rejected. <Link href="/complete-tasker-profile" className="underline" onClick={() => setShowDropdown(false)}>Reapply</Link>
                            </p>
                          )}
                          {taskerStatus === "not_applied" && (
                            <p className="text-[10px] xl:text-xs text-gray-500 mt-2 text-center">
                              <Link href="/complete-tasker-profile" className="text-blue-600 underline" onClick={() => setShowDropdown(false)}>Become a Tasker</Link>
                            </p>
                          )}
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                          <Link
                            href={taskerStatus === "approved" ? "/complete-tasker-profile" : "/complete-booker-profile"}
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-2 xl:gap-3 px-4 xl:px-6 py-2.5 xl:py-3 text-xs xl:text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <FaUser className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-gray-400" />
                            <span className="font-medium">My Profile</span>
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 xl:gap-3 px-4 xl:px-6 py-2.5 xl:py-3 text-xs xl:text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <FiX className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
                            <span className="font-medium">Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/authentication">
                    <button className="px-4 xl:px-6 py-2 xl:py-2.5 color2 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 text-xs xl:text-sm whitespace-nowrap">
                      Sign Up / Login
                    </button>
                  </Link>
                )}
              </div>

              {/* Mobile Menu Button - Shows below lg */}
              <button
                onClick={toggleMenu}
                className="lg:hidden relative p-2 sm:p-2.5 rounded-lg hover:bg-gray-100 transition-colors duration-200 touch-manipulation"
                aria-label="Toggle menu"
              >
                {unreadNotifications > 0 && !isOpen && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
                {isOpen ? (
                  <FiX className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" />
                ) : (
                  <FiMenu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" />
                )}
              </button>
            </div>

            {/* Mobile Menu Panel */}
            <div
              className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
              <div
                className="px-3 xs:px-4 pb-4 sm:pb-6 pt-2 border-t border-gray-100 overflow-y-auto overscroll-contain"
                style={{ maxHeight: 'calc(80vh - 60px)', WebkitOverflowScrolling: 'touch' }}
              >

                {/* Mobile User Info */}
                {isLoggedIn && (
                  <div className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 mb-3 color3 rounded-xl">
                    <ProfileAvatar size={44} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                        {firstName} {lastName}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">{email}</p>
                      <div className="flex items-center flex-wrap gap-1.5 mt-1">
                        <span className="text-[10px] sm:text-xs text-gray-500 capitalize">{userRole}</span>
                        {getTaskerStatusBadge()}
                        {unreadNotifications > 0 && (
                          <span className="text-[10px] sm:text-xs text-red-600 font-medium">
                            • {unreadNotifications} new
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Mobile Role Switcher */}
                {isLoggedIn && (
                  <div className="mb-3 p-3 sm:p-4 bg-gray-50 rounded-xl">
                    <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 sm:mb-3">
                      Switch Role
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          switchToTasker();
                          if (taskerStatus === "approved") setIsOpen(false);
                        }}
                        disabled={taskerStatus !== "approved"}
                        className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all ${userRole === "tasker"
                            ? "color1 text-white"
                            : taskerStatus === "approved"
                              ? "bg-white text-gray-700 border border-gray-200 active:bg-gray-100"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed"
                          }`}
                      >
                        <span className="flex items-center justify-center gap-1">
                          Tasker
                          {taskerStatus === "under_review" && <FiClock className="w-3 h-3 text-amber-500" />}
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          switchToClient();
                          setIsOpen(false);
                        }}
                        className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all ${userRole === "client"
                            ? "color1 text-white"
                            : "bg-white text-gray-700 border border-gray-200 active:bg-gray-100"
                          }`}
                      >
                        Booker
                      </button>
                    </div>

                    {/* Mobile Status Messages */}
                    {taskerStatus === "under_review" && (
                      <p className="text-[10px] sm:text-xs text-amber-600 mt-2 text-center">Under review</p>
                    )}
                    {taskerStatus === "rejected" && (
                      <p className="text-[10px] sm:text-xs text-red-600 mt-2 text-center">
                        <Link href="/complete-tasker-profile" className="underline" onClick={() => setIsOpen(false)}>Reapply</Link>
                      </p>
                    )}
                  </div>
                )}

                {/* Mobile Become Tasker Button */}
                {/* {isLoggedIn && taskerButtonConfig && ( */}
                {/* Mobile Become Tasker Button */}
                {taskerButtonConfig && (
                  taskerButtonConfig.href ? (
                    <Link href={taskerButtonConfig.href} onClick={() => setIsOpen(false)} className="block mb-3">
                      <button
                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 ${taskerButtonConfig.className} text-white font-semibold rounded-xl transition-all text-sm`}
                        disabled={taskerButtonConfig.disabled}
                      >
                        <taskerButtonConfig.icon className="text-lg" />
                        <span>{taskerButtonConfig.label}</span>
                      </button>
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        taskerButtonConfig.onClick?.();
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 mb-3 ${taskerButtonConfig.className} text-white font-semibold rounded-xl transition-all text-sm`}
                      disabled={taskerButtonConfig.disabled}
                    >
                      <taskerButtonConfig.icon className="text-lg" />
                      <span>{taskerButtonConfig.label}</span>
                    </button>
                  )
                )}

                {/* Mobile Services Dropdown */}
                <div className="mb-3">
                  <button
                    onClick={() => setShowMobileServices(!showMobileServices)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left text-gray-700 bg-gray-50 hover:bg-gray-100 active:bg-gray-100 rounded-xl transition-colors"
                  >
                    <span className="font-semibold text-sm sm:text-base">Services</span>
                    <FiChevronDown
                      className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-transform duration-200 ${showMobileServices ? 'rotate-180' : ''
                        }`}
                    />
                  </button>

                  <div
                    className={`transition-all duration-300 overflow-hidden ${showMobileServices ? 'max-h-[400px] opacity-100 mt-2' : 'max-h-0 opacity-0'
                      }`}
                  >
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                      <div className="max-h-64 overflow-y-auto">
                        {serviceCategories.map((service, index) => (
                          <Link
                            key={index}
                            href={service.href}
                            onClick={() => {
                              setShowMobileServices(false);
                              setIsOpen(false);
                            }}
                            className={`flex flex-col px-4 py-3 hover:bg-gray-50 active:bg-gray-50 transition-colors ${index !== serviceCategories.length - 1 ? 'border-b border-gray-100' : ''
                              }`}
                          >
                            <span className="font-medium text-sm text-[#063A41]">{service.title}</span>
                            <span className="text-[11px] sm:text-xs text-gray-500 mt-0.5 line-clamp-1">
                              {service.description}
                            </span>
                          </Link>
                        ))}
                      </div>
                      <Link
                        href="/browse-tasks"
                        onClick={() => {
                          setShowMobileServices(false);
                          setIsOpen(false);
                        }}
                        className="flex items-center justify-center gap-1.5 px-4 py-3 bg-gray-50 text-[#109C3D] font-medium text-sm hover:bg-gray-100 active:bg-gray-100 transition-colors border-t border-gray-100"
                      >
                        View All Tasks <span>→</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Mobile Navigation Links */}
                <div className="space-y-1 mb-3">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
                      <button className="w-full flex items-center justify-between px-4 py-3 text-left text-gray-700 hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-colors">
                        <span className="font-medium text-sm sm:text-base">{link.label}</span>
                        {link.showBadge && unreadNotifications > 0 && (
                          <span className="min-w-[22px] px-1.5 py-0.5 bg-red-500 text-white text-[11px] font-bold rounded-full text-center">
                            {unreadNotifications > 99 ? '99+' : unreadNotifications}
                          </span>
                        )}
                      </button>
                    </Link>
                  ))}
                </div>

                {/* Mobile Auth Section */}
                {isLoggedIn ? (
                  <div className="space-y-1 pt-3 border-t border-gray-200">
                    <Link
                      href={taskerStatus === "approved" ? "/complete-tasker-profile" : "/complete-booker-profile"}
                      onClick={() => setIsOpen(false)}
                    >
                      <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-colors">
                        <FaUser className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-sm sm:text-base">My Profile</span>
                      </button>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 active:bg-red-100 rounded-xl transition-colors"
                    >
                      <FiX className="w-4 h-4" />
                      <span className="font-medium text-sm sm:text-base">Logout</span>
                    </button>
                  </div>
                ) : (
                  <Link href="/authentication" onClick={() => setIsOpen(false)} className="block">
                    <button className="w-full px-6 py-3 color2 text-white font-semibold rounded-xl hover:shadow-lg active:scale-[0.98] transition-all text-sm sm:text-base">
                      Sign Up / Login
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-[72px] xs:h-[76px] sm:h-20 md:h-[88px] lg:h-28" />

      {/* Error Toast */}
      {errorMessage && (
        <div className="fixed top-2 left-2 right-2 sm:top-4 sm:left-auto sm:right-4 sm:max-w-sm bg-red-500 text-white px-4 py-3 rounded-xl shadow-lg z-[100] flex items-center gap-3 animate-slideIn">
          <span className="flex-1 text-sm">{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-white hover:text-gray-200 font-bold text-xl leading-none p-1 touch-manipulation"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      )}

      <style jsx>{`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-100%); }
      to { opacity: 1; transform: translateY(0); }
    }

    .animate-fadeIn {
      animation: fadeIn 0.2s ease-out forwards;
    }

    .animate-slideIn {
      animation: slideIn 0.3s ease-out forwards;
    }

    /* Hide scrollbar but keep functionality */
    .overflow-y-auto {
      scrollbar-width: thin;
      scrollbar-color: #d1d5db transparent;
    }

    .overflow-y-auto::-webkit-scrollbar {
      width: 4px;
    }

    .overflow-y-auto::-webkit-scrollbar-track {
      background: transparent;
    }

    .overflow-y-auto::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 4px;
    }

    /* Better touch targets on mobile */
    @media (max-width: 640px) {
      button, a {
        min-height: 44px;
      }
    }
  `}</style>
    </>
  );
};

export default Navbar;

