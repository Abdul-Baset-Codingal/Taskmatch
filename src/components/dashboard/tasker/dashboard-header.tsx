/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Bell, Settings, User, X, Menu, Clock, CheckCircle, MessageCircle, AlertCircle, Package, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { cn } from "@/app/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { checkLoginStatus } from "@/resusable/CheckUser";
import { FaSpinner } from "react-icons/fa";

interface Notification {
    id: string;
    title: string;
    message: string;
    date: string;
    type: string;
    read: boolean;
    relatedId?: string;
}

interface DashboardHeaderProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

export function DashboardHeader({ isSidebarOpen, toggleSidebar }: DashboardHeaderProps) {
    // const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<{
        firstName?: string;
        lastName?: string;
        email?: string;
        avatar?: string;
        currentRole?: string;
    } | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loadingNotifications, setLoadingNotifications] = useState(true);
    const router = useRouter();

    // Check login status and fetch user data
    useEffect(() => {
        const fetchLoginStatus = async () => {
            const { isLoggedIn, user } = await checkLoginStatus();
            setIsLoggedIn(isLoggedIn);
            setUser(user ? {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                avatar: user.profilePicture,
                currentRole: user.currentRole
            } : null);
        };
        fetchLoginStatus();
    }, []);

    // Fetch notifications
    useEffect(() => {
        if (!isLoggedIn) return;

        const fetchNotifications = async () => {
            try {
                setLoadingNotifications(true);
                const response = await fetch("/api/auth/notifications", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                 //    console.log("Notifications received:", data);
                    setNotifications(data.notifications || []);
                    setUnreadCount(data.unreadCount || 0);
                } else {
                 //    console.error("Failed to fetch notifications:", response.status);
                }
            } catch (error) {
              //   console.error("Error fetching notifications:", error);
            } finally {
                setLoadingNotifications(false);
            }
        };

        fetchNotifications();

        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [isLoggedIn]);

    // Handle logout
    const handleLogout = async () => {
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
            if (response.ok) {
                setIsLoggedIn(false);
                setUser(null);
                setNotifications([]);
                setUnreadCount(0);
                router.push("/");
            } else {
               //  console.error("Logout failed with status:", response.status);
            }
        } catch (error) {
         //    console.error("Logout failed", error);
        }
    };

    // Mark notification as read
    const markAsRead = async (id: string) => {
        try {
            const response = await fetch(`/api/auth/notifications/${id}/read`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
               //  console.log("Notification marked as read");

                setNotifications((prev) =>
                    prev.map((notif) =>
                        notif.id === id ? { ...notif, read: true } : notif
                    )
                );

                setUnreadCount((prev) => Math.max(0, prev - 1));
            } else {
              //   console.error("Failed to mark as read:", response.status);
            }
        } catch (error) {
         //    console.error("Error marking as read:", error);
        }
    };

    // Navigate to related content
    const handleNotificationClick = (notification: Notification) => {
        if (!notification.read) {
            markAsRead(notification.id);
        }
    };

    // Get icon for notification type - using only brand colors
    const getNotificationIcon = (type: string) => {
        if (type.includes('task') || type.includes('completion')) {
            return <CheckCircle className="h-4 w-4 text-[#109C3D]" />;
        } else if (type.includes('message') || type.includes('comment')) {
            return <MessageCircle className="h-4 w-4 text-[#063A41]" />;
        } else if (type.includes('bid') || type.includes('quote')) {
            return <Package className="h-4 w-4 text-[#109C3D]" />;
        } else if (type.includes('review')) {
            return <Star className="h-4 w-4 text-[#109C3D]" />;
        } else if (type.includes('booking')) {
            return <Clock className="h-4 w-4 text-[#063A41]" />;
        } else if (type.includes('rejected') || type.includes('declined') || type.includes('cancelled')) {
            return <X className="h-4 w-4 text-red-500" />;
        } else {
            return <AlertCircle className="h-4 w-4 text-[#063A41]" />;
        }
    };

    // Generate fallback initials
    const getInitials = () => {
        if (!user?.firstName || !user?.lastName) return "JD";
        return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    };

    // Check if user is a tasker
    const isTasker = user?.currentRole === 'tasker';

    // Determine if we should show profile picture (only for taskers with avatar)
    const shouldShowProfilePicture = isTasker && user?.avatar;

    return (
        <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6 max-w-full">
                {/* Left Side: Hamburger Menu and Title */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={toggleSidebar}
                    >
                        {isSidebarOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </Button>
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground truncate">
                        {isTasker ? "Tasker's Workspace" : "Booker's Workspace"}
                    </h1>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-2 sm:gap-4">
                    
                    {/* Notifications */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                                {unreadCount > 0 && (
                                    <Badge
                                        className="h-5 w-5 p-0 absolute -top-1 -right-1 flex items-center justify-center text-xs bg-[#d31736] text-white"
                                    >
                                        {unreadCount > 9 ? "9+" : unreadCount}
                                    </Badge>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto" align="end" forceMount>
                            <DropdownMenuLabel className="flex flex-col space-y-1">
                                <p className="text-sm font-semibold leading-none text-[#063A41]">Notifications</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {loadingNotifications ? "Loading..." : `${unreadCount} unread`}
                                </p>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {loadingNotifications ? (
                                <DropdownMenuItem disabled className="justify-center">
                                    <FaSpinner className="animate-spin h-4 w-4 mr-2 text-[#109C3D]" />
                                    Loading notifications...
                                </DropdownMenuItem>
                            ) : notifications.length === 0 ? (
                                <DropdownMenuItem disabled className="justify-center text-muted-foreground">
                                    No new notifications
                                </DropdownMenuItem>
                            ) : (
                                notifications.map((notification) => (
                                    <DropdownMenuItem
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={cn(
                                            "flex flex-col items-start p-3 cursor-pointer hover:bg-[#E5FFDB]",
                                            notification.read ? "opacity-60" : ""
                                        )}
                                    >
                                        <div className="flex items-start gap-3 w-full">
                                            <div className="flex-shrink-0 mt-0.5">
                                                {getNotificationIcon(notification.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium leading-tight text-[#063A41]">
                                                    {notification.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground leading-tight line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {new Date(notification.date).toLocaleString()}
                                                </p>
                                            </div>
                                            {!notification.read && (
                                                <div className="flex-shrink-0">
                                                    <div className="w-2 h-2 rounded-full bg-[#109C3D] animate-pulse" />
                                                </div>
                                            )}
                                        </div>
                                    </DropdownMenuItem>
                                ))
                            )}
                            <DropdownMenuSeparator />
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Settings - Hidden on Mobile */}
                    {/* <Button variant="ghost" size="icon" className="hidden sm:inline-flex hover:bg-[#E5FFDB]">
                        <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button> */}

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-7 w-7 sm:h-8 sm:w-8 rounded-full p-0">
                                <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                                    {shouldShowProfilePicture ? (
                                        <>
                                            <AvatarImage
                                                src={user.avatar}
                                                alt={`${user?.firstName || ''} ${user?.lastName || ''}`}
                                            />
                                            <AvatarFallback
                                                className="bg-[#063A41] text-[#E5FFDB] font-semibold"
                                            >
                                                {getInitials()}
                                            </AvatarFallback>
                                        </>
                                    ) : (
                                        <AvatarFallback
                                            className="bg-[#063A41] text-[#E5FFDB] font-semibold text-xs sm:text-sm"
                                        >
                                            {getInitials()}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        {shouldShowProfilePicture ? (
                                            <>
                                                <AvatarImage
                                                    src={user.avatar}
                                                    alt={`${user?.firstName || ''} ${user?.lastName || ''}`}
                                                />
                                                <AvatarFallback
                                                    className="bg-[#063A41] text-[#E5FFDB] font-semibold"
                                                >
                                                    {getInitials()}
                                                </AvatarFallback>
                                            </>
                                        ) : (
                                            <AvatarFallback
                                                className="bg-[#063A41] text-[#E5FFDB] font-semibold"
                                            >
                                                {getInitials()}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none text-[#063A41]">
                                            {isLoggedIn && user?.firstName && user?.lastName
                                                ? `${user.firstName} ${user.lastName}`
                                                : "Guest"}
                                        </p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {isLoggedIn && user?.email ? user.email : "Not logged in"}
                                        </p>
                                        {/* {isLoggedIn && user?.currentRole && (
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "text-xs w-fit mt-1",
                                                    isTasker
                                                        ? "border-[#109C3D] text-[#109C3D] bg-[#E5FFDB]"
                                                        : "border-[#063A41] text-[#063A41] bg-[#E5FFDB]"
                                                )}
                                            >
                                                {isTasker ? "Tasker" : "Client"}
                                            </Badge>
                                        )} */}
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <Link href={isTasker ? "/complete-tasker-profile" : "/complete-tasker-profile"}>
                                <DropdownMenuItem className="cursor-pointer hover:bg-[#E5FFDB]">
                                    <User className="mr-2 h-4 w-4 text-[#063A41]" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                            </Link>
                            <Link href="/dashboard/settings">
                                <DropdownMenuItem className="cursor-pointer hover:bg-[#E5FFDB] sm:hidden">
                                    <Settings className="mr-2 h-4 w-4 text-[#063A41]" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="cursor-pointer hover:bg-red-50 text-red-600 hover:text-red-700"
                            >
                                <X className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}