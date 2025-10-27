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
    { title: "Find Tasks", icon: CheckSquare, component: <AvailableTasks /> },
    { title: "Active Tasks", icon: CheckSquare, component: <ActiveTasks /> },
    { title: "All Bookings", icon: Users, component: <PendingBookings /> },
    { title: "All Request-Quotes", icon: FileText, component: <TaskerQuotes /> },
    { title: "Completed Tasks", icon: CheckSquare, component: <CompletedTasks /> },
    { title: "My Services", icon: CheckSquare, component: <MyServices /> },
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
            <div
                className={cn(
                    "fixed inset-y-0 left-0 w-64 border-r border-border bg-sidebar transform transition-transform duration-300 ease-in-out z-30",
                    isOpen ? "translate-x-0" : "-translate-x-full",
                    "lg:translate-x-0 lg:static lg:w-64"
                )}
            >
                <div className="flex h-16 items-center border-b border-sidebar-border px-6">
                    <div className="flex items-center gap-2">
                        <Link href="/">
                            <h1 className="text-2xl xs:text-3xl sm:text-3xl lg:text-3xl font-bold color1 bg-clip-text text-transparent">
                                TaskAllo
                            </h1>
                        </Link>
                        <span className="w-2 h-2 rounded-full color2 inline-block top-[12px] xs:top-[14px] sm:top-[16px] lg:top-[18px] relative right-[8px] xs:right-[10px] lg:right-[11px] z-10"></span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto lg:hidden"
                        onClick={toggleSidebar}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <nav className="flex-1 space-y-1 p-4">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon
                        const isActive = activeItem === item.title

                        return (
                            <Button
                                key={item.title}
                                variant={isActive ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start gap-3 h-10 ",
                                    isActive && "color1 text-sidebar-primary-foreground hover:bg-sidebar-primary/90",
                                    "hover:color1 hover:text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                                )}
                                onClick={() => {
                                    setActiveItem(item.title)
                                    toggleSidebar() // Close sidebar on item click (mobile only)
                                }}
                            >
                                <Icon className="h-4 w-4" />
                                {item.title}
                            </Button>
                        )
                    })}
                </nav>

                {/* Support Section at Bottom */}
                <div className="border-t border-sidebar-border p-4 mt-auto">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start gap-3 h-10  hover:color1 hover:text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                        )}
                        onClick={supportItem.onClick}
                    >
                        <supportItem.icon className="h-4 w-4" />
                        {supportItem.title}
                    </Button>
                </div>
            </div>

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