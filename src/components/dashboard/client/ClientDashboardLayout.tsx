// "use client"

// import { CheckSquare, HelpCircle, Home, X } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { useState } from "react"
// import { cn } from "@/app/lib/utils"

// import Link from "next/link"
// import { DashboardContent } from "../tasker/dashboard-content"
// import TaskListSection from "./TaskListSection"
// import RequestQuoteByUser from "./RequestQuoteByUser"
// import AllBookings from "./AllBookings"
// import { DashboardHeader } from "../tasker/dashboard-header"
// import { ClientDashboardContent } from "./ClientDashboardContent"
// import { ClientPayment } from "./ClientPayment"
// import ClientActiveTasks from "./ClientActiveTasks"
// import ClientCompletedTasks from "./ClientCompletedTasks"

// // Debug imports to check for undefined components
// console.log({

//     DashboardContent,
// })

// const sidebarItems = [
//     { title: "Dashboard", icon: Home, component: <ClientDashboardContent />, active: true },
//     { title: "All Tasks", icon: CheckSquare, component: <TaskListSection /> },
//     { title: "Active Tasks", icon: CheckSquare, component: <ClientActiveTasks /> },
//     { title: "Request Quote", icon: CheckSquare, component: <RequestQuoteByUser /> },
//     { title: "All Bookings", icon: CheckSquare, component: <AllBookings /> },
//     { title: "Completed Tasks", icon: CheckSquare, component: <ClientCompletedTasks /> },
//     { title: "Payments", icon: CheckSquare, component: <ClientPayment /> },


// ]

// interface DashboardLayoutProps {
//     isOpen: boolean
//     toggleSidebar: () => void
// }

// const supportItem = {
//     title: "Support",
//     icon: HelpCircle,
//     onClick: () => window.open("mailto:support@taskallo.com", "_blank"), // Example: open email or external support page
// }

// export function ClientDashboardLayout({ isOpen, toggleSidebar }: DashboardLayoutProps) {
//     const [activeItem, setActiveItem] = useState("Dashboard")

//     // Find the active component to render
//     const activeComponent = sidebarItems.find(item => item.title === activeItem)?.component || (
//         <div>Error: Component not found</div>
//     )

//     return (
//         <div className="flex min-h-screen w-full">
//             {/* Sidebar */}
//             <div
//                 className={cn(
//                     "fixed inset-y-0 left-0 w-64 border-r border-border bg-sidebar transform transition-transform duration-300 ease-in-out z-30",
//                     isOpen ? "translate-x-0" : "-translate-x-full",
//                     "lg:translate-x-0 lg:static lg:w-64"
//                 )}
//             >
//                 <div className="flex h-16 items-center border-b border-sidebar-border px-6">
//                     <div className="flex items-center gap-2">
//                         <Link href="/">
//                             <h1 className="text-2xl xs:text-3xl sm:text-3xl lg:text-3xl font-bold color1 bg-clip-text text-transparent">
//                                 TaskAllo
//                             </h1>
//                         </Link>
//                         <span className="w-2 h-2 rounded-full color2 inline-block top-[12px] xs:top-[14px] sm:top-[16px] lg:top-[18px] relative right-[8px] xs:right-[10px] lg:right-[11px] z-10"></span>
//                     </div>
//                     <Button
//                         variant="ghost"
//                         size="icon"
//                         className="ml-auto lg:hidden"
//                         onClick={toggleSidebar}
//                     >
//                         <X className="h-5 w-5" />
//                     </Button>
//                 </div>

//                 <nav className="flex-1 space-y-1 p-4">
//                     {sidebarItems.map((item) => {
//                         const Icon = item.icon
//                         const isActive = activeItem === item.title

//                         return (
//                             <Button
//                                 key={item.title}
//                                 variant={isActive ? "secondary" : "ghost"}
//                                 className={cn(
//                                     "w-full justify-start gap-3 h-10",
//                                     isActive && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
//                                 )}
//                                 onClick={() => {
//                                     setActiveItem(item.title)
//                                     toggleSidebar() // Close sidebar on item click (mobile only)
//                                 }}
//                             >
//                                 <Icon className="h-4 w-4" />
//                                 {item.title}
//                             </Button>
//                         )
//                     })}
//                 </nav>
//                 {/* Support Section at Bottom */}
//                 <div className="border-t border-sidebar-border p-4 mt-auto">
//                     <Button
//                         variant="ghost"
//                         className={cn(
//                             "w-full justify-start gap-3 h-10  hover:color1 hover:text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
//                         )}
//                         onClick={supportItem.onClick}
//                     >
//                         <supportItem.icon className="h-4 w-4" />
//                         {supportItem.title}
//                     </Button>
//                 </div>
//             </div>

//             {/* Main Content Area */}
//             <div className="flex-1 bg-background w-full">
//                 <DashboardHeader isSidebarOpen={isOpen} toggleSidebar={toggleSidebar} />
//                 <div className="p-6">
//                     {activeComponent}
//                 </div>
//             </div>

//             {/* Overlay for mobile when sidebar is open */}
//             {isOpen && (
//                 <div
//                     className="fixed inset-0 bg-black/50 z-20 lg:hidden"
//                     onClick={toggleSidebar}
//                 />
//             )}
//         </div>
//     )
// }


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
import { DashboardHeader } from "../tasker/dashboard-header"; // Reuse header
import { cn } from "@/app/lib/utils";
import { ClientPayment } from "./ClientPayment";
// import logo from "../../../../public/Images/taskalloLogo-removebg-preview.png"
// import Image from "next/image";

const navItems = [
    { title: "Dashboard", icon: Home, component: <ClientDashboardContent /> },
    { title: "All Tasks", icon: CheckSquare, component: <TaskListSection /> },
    { title: "Active Tasks", icon: Clock, component: <ClientActiveTasks /> },
    { title: "Request Quote", icon: MessageSquare, component: <RequestQuoteByUser /> },
    { title: "All Bookings", icon: Calendar, component: <AllBookings /> },
    { title: "Completed Tasks", icon: CheckSquare, component: <ClientCompletedTasks /> },
    { title: "Payments", icon: CreditCard, component: <ClientPayment /> },
];

interface ClientDashboardLayoutProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

export function ClientDashboardLayout({ isOpen, toggleSidebar }: ClientDashboardLayoutProps) {
    const [activeItem, setActiveItem] = useState("Dashboard");

    const activeComponent =
        navItems.find((item) => item.title === activeItem)?.component || (
            <div className="text-center py-20 text-gray-500">Page not found</div>
        );

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
                        <div className="flex items-center gap-2">
                            <Link href="/"> <h1 className="text-2xl xs:text-3xl sm:text-3xl lg:text-3xl font-bold color1 bg-clip-text text-transparent"> Taskallo </h1> </Link>
                        </div>
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

            {/* Main Content - FULL WIDTH */}
            <div className="flex-1 flex flex-col w-full">
                <DashboardHeader isSidebarOpen={isOpen} toggleSidebar={toggleSidebar} />

                {/* FULL WIDTH CONTENT */}
                <main className="flex-1 p-4 lg:p-8">
                    {activeComponent}
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