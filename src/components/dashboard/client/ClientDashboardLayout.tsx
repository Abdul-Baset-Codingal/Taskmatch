"use client";

import {
    Home,
    CheckSquare,
    MessageSquare,
    Calendar,
    Clock,
    CreditCard,
    HelpCircle,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";

// Client Components
import { ClientDashboardContent } from "./ClientDashboardContent";
import TaskListSection from "./TaskListSection";
import ClientActiveTasks from "./ClientActiveTasks";
import RequestQuoteByUser from "./RequestQuoteByUser";
import AllBookings from "./AllBookings";
import ClientCompletedTasks from "./ClientCompletedTasks";
import { DashboardHeader } from "../tasker/dashboard-header";
import { cn } from "@/app/lib/utils";
import { ClientPayment } from "./ClientPayment";
import { MdAnalytics } from "react-icons/md";

interface ClientDashboardLayoutProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

export function ClientDashboardLayout({ isOpen, toggleSidebar }: ClientDashboardLayoutProps) {
    const [activeItem, setActiveItem] = useState("Posted Tasks");

    // Navigation items with component names (not JSX)
    const navItems = [
        { title: "Posted Tasks", icon: CheckSquare },
        { title: "Active Tasks", icon: Clock },
        { title: "Requested Quotes", icon: MessageSquare },
        { title: "Booked Tasks", icon: Calendar },
        { title: "Completed Tasks", icon: CheckSquare },
        { title: "Analytics", icon: MdAnalytics },
        { title: "Payments", icon: CreditCard },
    ];

    // Render component based on activeItem
    const renderComponent = () => {
        switch (activeItem) {
            case "Analytics":
                return <ClientDashboardContent setActiveItem={setActiveItem} />;
            case "Posted Tasks":
                return <TaskListSection />;
            case "Active Tasks":
                return <ClientActiveTasks />;
            case "Requested Quotes":
                return <RequestQuoteByUser />;
            case "Booked Tasks":
                return <AllBookings />;
            case "Completed Tasks":
                return <ClientCompletedTasks />;
            case "Payments":
                return <ClientPayment />;
            default:
                return <div className="text-center py-20 text-gray-500">Page not found</div>;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 w-[100%]">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-xl transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                    <Link href="/" className="flex items-center gap-2">
                        <h1 className="text-2xl xs:text-3xl sm:text-3xl lg:text-3xl font-bold color1 bg-clip-text text-transparent">
                            Taskallo
                        </h1>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeItem === item.title;

                        return (
                            <Button
                                key={item.title}
                                variant={isActive ? "default" : "ghost"}
                                className={cn(
                                    "w-full justify-start gap-3 h-11 rounded-xl font-medium transition-all",
                                    isActive
                                        ? "color1 text-white shadow-md hover:color1"
                                        : "text-gray-700 hover:bg-gray-100 hover:text-[#109C3D]"
                                )}
                                onClick={() => {
                                    setActiveItem(item.title);
                                    if (window.innerWidth < 1024) toggleSidebar();
                                }}
                            >
                                <Icon className="w-5 h-5" />
                                {item.title}
                            </Button>
                        );
                    })}
                </nav>

                {/* Support */}
                <div className="p-4 border-t border-gray-200">
                    <Link href={'/contact-us'}>
                        <button className="w-full flex items-center justify-start gap-3 h-11 rounded-xl border border-gray-300 px-4 transition-all hover:border-[#109C3D] hover:text-[#109C3D]">
                            <HelpCircle className="w-5 h-5" />
                            <span>Support & Help</span>
                        </button>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col w-full">
                <DashboardHeader isSidebarOpen={isOpen} toggleSidebar={toggleSidebar} />
                <main className="flex-1 p-4 lg:p-8">
                    {renderComponent()}
                </main>
            </div>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}
        </div>
    );
}