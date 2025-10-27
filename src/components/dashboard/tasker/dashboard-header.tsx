"use client";

import { Bell, Search, Settings, User, X, Menu, Clock, CheckCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    type: "task-posted" | "task-completed" | "message" | "review";
    read: boolean;
}

interface DashboardHeaderProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

export function DashboardHeader({ isSidebarOpen, toggleSidebar }: DashboardHeaderProps) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<{
        firstName?: string;
        lastName?: string;
        email?: string;
        avatar?: string;
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
            setUser(user ? { firstName: user.firstName, lastName: user.lastName, email: user.email, avatar: user.profilePicture } : null);
        };
        fetchLoginStatus();
    }, []);

    // Fetch notifications
    useEffect(() => {
        if (!isLoggedIn) return;

        const fetchNotifications = async () => {
            try {
                setLoadingNotifications(true);
                const response = await fetch("http://localhost:5000/api/auth/notifications", {
                    method: "GET",
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    setNotifications(data.notifications || []);
                    setUnreadCount(data.unreadCount || 0);
                } else {
                    console.error("Failed to fetch notifications");
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            } finally {
                setLoadingNotifications(false);
            }
        };

        fetchNotifications();
    }, [isLoggedIn]);

    // Handle logout
    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/auth/logout", {
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
                console.error("Logout failed with status:", response.status);
            }
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    // Mark notification as read
    const markAsRead = async (id: string) => {
        try {
            await fetch(`http://localhost:5000/api/auth/notifications/${id}/read`, {
                method: "PATCH",
                credentials: "include",
            });
            setNotifications((prev) =>
                prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };

    // Generate fallback initials
    const getInitials = () => {
        if (!user?.firstName || !user?.lastName) return "JD";
        return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    };

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
                        Dashboard
                    </h1>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Search - Mobile Toggle */}
                    <div className="relative flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="sm:hidden"
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                        >
                            {isSearchOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Search className="h-5 w-5" />
                            )}
                        </Button>

                        {/* Search Input */}
                        <div
                            className={cn(
                                "absolute top-16 left-0 right-0 z-20 bg-card border-b border-border p-4 sm:static sm:p-0 sm:border-0",
                                isSearchOpen ? "block" : "hidden sm:block"
                            )}
                        >
                            <div className="relative max-w-full">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search tasks, clients..."
                                    className="w-full sm:w-40 md:w-64 pl-10"
                                    onBlur={() => setIsSearchOpen(false)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notifications */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                                {unreadCount > 0 && (
                                    <Badge
                                        variant="destructive"
                                        className="h-5 w-5 p-0 absolute -top-1 -right-1 flex items-center justify-center text-xs"
                                    >
                                        {unreadCount > 9 ? "9+" : unreadCount}
                                    </Badge>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto" align="end" forceMount>
                            <DropdownMenuLabel className="flex flex-col space-y-1">
                                <p className="text-sm font-semibold leading-none">Notifications</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {loadingNotifications ? "Loading..." : `${notifications.length} recent activities`}
                                </p>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {loadingNotifications ? (
                                <DropdownMenuItem disabled className="justify-center">
                                    <FaSpinner className="animate-spin h-4 w-4 mr-2" />
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
                                        onClick={() => !notification.read && markAsRead(notification.id)}
                                        className={cn(
                                            "flex flex-col items-start p-3 cursor-pointer hover:bg-accent",
                                            notification.read ? "opacity-60" : ""
                                        )}
                                    >
                                        <div className="flex items-start gap-3 w-full">
                                            <div className="flex-shrink-0 mt-0.5">
                                                {notification.type === "task-posted" && <CheckCircle className="h-4 w-4 text-green-500" />}
                                                {notification.type === "task-completed" && <CheckCircle className="h-4 w-4 text-blue-500" />}
                                                {notification.type === "message" && <MessageCircle className="h-4 w-4 text-purple-500" />}
                                                {notification.type === "review" && <Clock className="h-4 w-4 text-orange-500" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium leading-tight truncate">{notification.title}</p>
                                                <p className="text-xs text-muted-foreground leading-tight truncate">{notification.message}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{new Date(notification.date).toLocaleString()}</p>
                                            </div>
                                            {!notification.read && (
                                                <div className="flex-shrink-0">
                                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                                </div>
                                            )}
                                        </div>
                                    </DropdownMenuItem>
                                ))
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="justify-center text-sm">
                                <Link href="/notifications" className="flex items-center gap-2">
                                    View All Notifications
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Settings - Hidden on Mobile */}
                    <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
                        <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-7 w-7 sm:h-8 sm:w-8 rounded-full">
                                <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                                    <AvatarImage src={user?.avatar || "/professional-avatar.jpg"} alt="User" />
                                    <AvatarFallback>{getInitials()}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {isLoggedIn && user?.firstName && user?.lastName
                                            ? `${user.firstName} ${user.lastName}`
                                            : "Guest"}
                                    </p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {isLoggedIn && user?.email ? user.email : "Not logged in"}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <Link href={"/dashboard/tasker/edit"}>
                                <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}