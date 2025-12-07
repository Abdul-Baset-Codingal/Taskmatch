/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react/no-unescaped-entities */
// /* eslint-disable @typescript-eslint/ban-ts-comment */
// // @ts-nocheck
// import { useEffect, useState } from "react";
// import { checkLoginStatus } from "@/resusable/CheckUser";
// import { ClientDashboardStats } from "./ClientDashboardStats";
// import { ClientSpentChart } from "./ClientIncomeChart";
// import { ClientTaskOverview } from "./ClientTaskOverview";
// import { ClientTaskCalendar } from "./ClientTaskCalender";
// import { ClientRecentQuotes } from "./ClientRequestQuotes";
// import { ClientUpcomingBookings } from "./ClientUpcomingBookings";


// export function ClientDashboardContent() {
//     const [user, setUser] = useState(null);

//     useEffect(() => {
//         const fetchUser = async () => {
//             const { isLoggedIn, user } = await checkLoginStatus();
//             if (isLoggedIn) {
//                 setUser(user);
//                 console.log("User object:", user);
//             }
//         };

//         fetchUser();
//     }, []);

//     return (
//         <div className="space-y-8 animate-in fade-in-50 duration-500">
//             <div className="relative">
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-teal-600/10 rounded-2xl blur-3xl" />
//                 <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
//                     <div className="flex items-center justify-between">
//                         <div className="space-y-2">
//                             <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-slate-800 bg-clip-text text-transparent">
//                                 {user
//                                     ? `Welcome back, ${user.firstName} ${user.lastName}! 👋`
//                                     : "Welcome back! 👋"}
//                             </h2>
//                             <p className="text-lg text-slate-600 max-w-2xl">
//                                 Here's what's happening with your tasks today. You're doing
//                                 great!
//                             </p>
//                         </div>
//                         <div className="hidden lg:block text-right">
//                             <div className="text-sm text-slate-500">Today</div>
//                             <div className="text-xl font-semibold text-slate-700">
//                                 {new Date().toLocaleDateString("en-US", {
//                                     weekday: "long",
//                                     month: "short",
//                                     day: "numeric",
//                                 })}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Stats Cards */}
//             <ClientDashboardStats />

//             <div className="grid gap-8 lg:grid-cols-2">
//                 {/* Income Chart */}
//                 <div className="lg:col-span-1 animate-in slide-in-from-left-5 duration-700 delay-200">
//                     <ClientSpentChart />
//                 </div>

//                 {/* Task Overview */}
//                 <div className="lg:col-span-1 animate-in slide-in-from-right-5 duration-700 delay-300">
//                     <ClientTaskOverview />
//                 </div>
//             </div>

//             <div className="grid gap-8 lg:grid-cols-3">
//                 {/* Task Calendar */}
//                 <div className="lg:col-span-1 animate-in slide-in-from-bottom-5 duration-700 delay-400">
//                     <ClientTaskCalendar />
//                 </div>

//                 {/* Recent Quotes */}
//                 <div className="lg:col-span-1 animate-in slide-in-from-bottom-5 duration-700 delay-500">
//                     <ClientRecentQuotes />
//                 </div>

//                 {/* Upcoming Bookings */}
//                 <div className="lg:col-span-1 animate-in slide-in-from-bottom-5 duration-700 delay-600">
//                     <ClientUpcomingBookings />
//                 </div>
//             </div>
//         </div>
//     );
// }


import { useEffect, useState } from "react";
import { checkLoginStatus } from "@/resusable/CheckUser";
import { ClientDashboardStats } from "./ClientDashboardStats";
import { ClientTaskOverview } from "./ClientTaskOverview";
import { ClientTaskCalendar } from "./ClientTaskCalender";
import { ClientRecentQuotes } from "./ClientRequestQuotes";
import { ClientUpcomingBookings } from "./ClientUpcomingBookings";
import { ClientProductivityChart } from "./ClientProductivityChart";

export function ClientDashboardContent() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { isLoggedIn, user } = await checkLoginStatus();
            if (isLoggedIn) setUser(user);
        };
        fetchUser();
    }, []);

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    return (
        <div className="space-y-10 pb-12">
            {/* Hero Section */}
            <div className="bg-[#063A41] rounded-3xl p-8 lg:p-12 text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                                Hi {user?.firstName || "there"}! 👋
                            </h1>
                            <p className="mt-4 text-xl text-white/90">{today}</p>
                            <p className="mt-3 text-lg text-white/70 max-w-2xl">
                                Manage your tasks, track spending, and stay connected with your taskers — all in one place.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <ClientDashboardStats />

            {/* Main Grid */}
            <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
                {/* Spending Chart - Larger */}
                <div>
                    <ClientTaskCalendar />
                </div>

                <div>
                    <ClientRecentQuotes />
                </div>

                {/* Upcoming Bookings */}
                <div>
                    <ClientUpcomingBookings />
                </div>
              
                {/* Task Overview */}
                <div>
                    <ClientTaskOverview />
                </div>
                {/* Calendar */}
            
                {/* Recent Quotes */}
                <div className="xl:col-span-2">
                    <ClientProductivityChart />
                </div>

            </div>
        </div>
    );
}