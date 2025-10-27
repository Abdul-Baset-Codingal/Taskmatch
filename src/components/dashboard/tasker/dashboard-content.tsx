/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { useEffect, useState } from "react";
import { checkLoginStatus } from "@/resusable/CheckUser";
import { DashboardStats } from "./dashboard-stats";
import { IncomeChart } from "./income-chart";

import { RecentQuotes } from "./recent-quotes";
import { TaskCalendar } from "./task-calender";
import { TaskOverview } from "./task-overview";
import { UpcomingBookings } from "./upcoming-bookings";

export function DashboardContent() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { isLoggedIn, user } = await checkLoginStatus();
            if (isLoggedIn) {
                setUser(user);
                console.log("User object:", user);
            }
        };

        fetchUser();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in-50 duration-500">
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-teal-600/10 rounded-2xl blur-3xl" />
                <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-slate-800 bg-clip-text text-transparent">
                                {user
                                    ? `Welcome back, ${user.firstName} ${user.lastName}! 👋`
                                    : "Welcome back! 👋"}
                            </h2>
                            <p className="text-lg text-slate-600 max-w-2xl">
                                Here's what's happening with your tasks today. You're doing
                                great!
                            </p>
                        </div>
                        <div className="hidden lg:block text-right">
                            <div className="text-sm text-slate-500">Today</div>
                            <div className="text-xl font-semibold text-slate-700">
                                {new Date().toLocaleDateString("en-US", {
                                    weekday: "long",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <DashboardStats />

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Income Chart */}
                <div className="lg:col-span-1 animate-in slide-in-from-left-5 duration-700 delay-200">
                    <IncomeChart />
                </div>

                {/* Task Overview */}
                <div className="lg:col-span-1 animate-in slide-in-from-right-5 duration-700 delay-300">
                    <TaskOverview />
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Task Calendar */}
                <div className="lg:col-span-1 animate-in slide-in-from-bottom-5 duration-700 delay-400">
                    <TaskCalendar />
                </div>

                {/* Recent Quotes */}
                <div className="lg:col-span-1 animate-in slide-in-from-bottom-5 duration-700 delay-500">
                    <RecentQuotes />
                </div>

                {/* Upcoming Bookings */}
                <div className="lg:col-span-1 animate-in slide-in-from-bottom-5 duration-700 delay-600">
                    <UpcomingBookings />
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Quick Actions */}
                {/* <div className="lg:col-span-1 animate-in slide-in-from-left-5 duration-700 delay-700">
                    <QuickActions />
                </div> */}

                {/* Recent Activity */}
                {/* <div className="lg:col-span-1 animate-in slide-in-from-right-5 duration-700 delay-800">
                    <RecentActivity />
                </div> */}
            </div>
        </div>
    );
}
