/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import {
    CheckSquare,
    FileText,
    Home,
    Users,
    X,
    CreditCard,
    HelpCircle,

} from "lucide-react"
import { Button } from "@/components/ui/button"

import { useState } from "react"
import { cn } from "@/app/lib/utils"
import AvailableTasks from "./AvailableTasks"
import ActiveTasks from "./ActiveTasks"
import PendingBookings from "./PendingBookings"
import TaskerQuotes from "./TaskerQuotes"
import CompletedTasks from "./CompletedTasks"
import { DashboardContent } from "./dashboard-content"
import UrgentTaskCards from "./UrgentTasks"
import { DashboardHeader } from "./dashboard-header"
import Link from "next/link"
import { PaymentTransactions } from "./PaymentTransactions"
import MyServices from "./MyServices"
import UpdateDocument from "./UpdateDocument"
import Image from "next/image"
import logo from "../../public/Images/taskalloLogo-removebg-preview.png"

// Separate PaymentTransactions component


// Debug imports to check for undefined components
console.log({
    UrgentTaskCards,
    AvailableTasks,
    ActiveTasks,
    PendingBookings,
    TaskerQuotes,
    CompletedTasks,
    DashboardContent,
    PaymentTransactions,
})

const sidebarItems = [
    { title: "Dashboard", icon: Home, component: <DashboardContent />, active: true },
    // { title: "Urgent Tasks", icon: CheckSquare, component: <UrgentTaskCards /> },
    // { title: "Find Tasks", icon: CheckSquare, component: <AvailableTasks /> },
    { title: "Active Tasks", icon: CheckSquare, component: <ActiveTasks /> },
    { title: "All Bookings", icon: Users, component: <PendingBookings /> },
    { title: "All Request-Quotes", icon: FileText, component: <TaskerQuotes /> },
    { title: "Completed Tasks", icon: CheckSquare, component: <CompletedTasks /> },
    { title: "My Services", icon: CheckSquare, component: <MyServices /> },
    // { title: "My Profile", icon: FileText, component: <UpdateDocument /> },
    { title: "Payments", icon: CreditCard, component: <PaymentTransactions /> },
    
]

const supportItem = {
    title: "Support",
    icon: HelpCircle,
    onClick: () => window.open("mailto:support@taskallo.com", "_blank"), // Example: open email or external support page
}

interface DashboardLayoutProps {
    isOpen: boolean
    toggleSidebar: () => void
}

export function DashboardLayout({ isOpen, toggleSidebar }: DashboardLayoutProps) {
    const [activeItem, setActiveItem] = useState("Dashboard")

    // Find the active component to render
    const activeComponent = sidebarItems.find(item => item.title === activeItem)?.component || (
        <div>Error: Component not found</div>
    )

    return (
        <div className="flex min-h-screen w-full">
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
                        <div className="flex items-center gap-2">
                            <Link href="/">
                                <Image
                                    src={logo}
                                    alt="TaskAllo Logo"
                                    className="w-24 h-auto xs:w-28 sm:w-32 lg:w-36"
                                    priority
                                />
                            </Link>
                        </div>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {sidebarItems.map((item) => {
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
                        <button
                            className="w-full flex items-center justify-start gap-3 h-11 rounded-xl border border-gray-300 px-4 transition-all hover:border-[#109C3D] hover:text-[#109C3D]"
                            // onClick={() => window.open('mailto:support@taskallo.com', '_blank')}
                        >
                            <HelpCircle className="w-5 h-5" />
                            <span>Support & Help</span>
                        </button>
                  </Link>
                </div>

            </aside>

            {/* Main Content Area */}
            <div className="flex-1 bg-background w-full">
                <DashboardHeader isSidebarOpen={isOpen} toggleSidebar={toggleSidebar} />
                <div className="p-6">
                    {activeComponent}
                </div>
            </div>

            {/* Overlay for mobile when sidebar is open */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}
        </div>
    )
}