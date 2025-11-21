/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/ban-ts-comment */
// // @ts-nocheck
// "use client";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useGetTasksByTaskerIdAndStatusQuery } from "@/features/api/taskApi";
// import { checkLoginStatus } from "@/resusable/CheckUser";
// import { DollarSign, CheckCircle, Clock, AlertCircle } from "lucide-react";
// import { useEffect, useState } from "react";

// export function DashboardStats() {
//     const [user, setUser] = useState(null);

//     // Fetch user data
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

//     // Fetch tasks for different statuses
//     const {
//         data: completedTasks = [],
//         isLoading: isCompletedLoading,
//         isError: isCompletedError,
//     } = useGetTasksByTaskerIdAndStatusQuery(
//         user?._id ? { taskerId: user._id, status: "completed" } : { taskerId: "", status: "completed" },
//         { skip: !user?._id }
//     );

//     const {
//         data: pendingTasks = [],
//         isLoading: isPendingLoading,
//         isError: isPendingError,
//     } = useGetTasksByTaskerIdAndStatusQuery(
//         user?._id ? { taskerId: user._id, status: "pending" } : { taskerId: "", status: "pending" },
//         { skip: !user?._id }
//     );

//     const {
//         data: inProgressTasks = [],
//         isLoading: isInProgressLoading,
//         isError: isInProgressError,
//     } = useGetTasksByTaskerIdAndStatusQuery(
//         user?._id ? { taskerId: user._id, status: "in_progress" } : { taskerId: "", status: "in_progress" },
//         { skip: !user?._id }
//     );

//     // Calculate Total Income from completed tasks
//     const totalIncome = completedTasks.reduce((sum, task) => sum + (task.price || 0), 0);
//     const formattedIncome = new Intl.NumberFormat("en-US", {
//         style: "currency",
//         currency: "USD",
//     }).format(totalIncome);

//     // Dynamic stats array
//     const stats = [
//         {
//             title: "Total Income",
//             value: isCompletedLoading ? "Loading..." : isCompletedError ? "Error" : formattedIncome,
//             change: isCompletedLoading || isCompletedError ? "" : `+${((totalIncome / 10000) * 100).toFixed(1)}%`, // Example: % increase from a baseline of $10,000
//             changeType: "positive" as const,
//             icon: DollarSign,
//             description: "This month",
//             gradient: "from-emerald-500 to-teal-600",
//             bgGradient: "from-emerald-50 to-teal-50",
//             iconColor: "text-emerald-600",
//         },
//         {
//             title: "Completed Tasks",
//             value: isCompletedLoading ? "Loading..." : isCompletedError ? "Error" : completedTasks.length.toString(),
//             change: isCompletedLoading || isCompletedError ? "" : `+${completedTasks.length - 16 >= 0 ? completedTasks.length - 16 : 0}`, // Example: compared to a baseline of 16
//             changeType: "positive" as const,
//             icon: CheckCircle,
//             description: "This week",
//             gradient: "from-blue-500 to-indigo-600",
//             bgGradient: "from-blue-50 to-indigo-50",
//             iconColor: "text-blue-600",
//         },
//         {
//             title: "Pending Tasks",
//             value: isPendingLoading ? "Loading..." : isPendingError ? "Error" : pendingTasks.length.toString(),
//             change: isPendingLoading || isPendingError ? "" : `-${pendingTasks.length - 10 >= 0 ? pendingTasks.length - 10 : 0}`, // Example: compared to a baseline of 10
//             changeType: "positive" as const,
//             icon: Clock,
//             description: "In progress",
//             gradient: "from-amber-500 to-orange-600",
//             bgGradient: "from-amber-50 to-orange-50",
//             iconColor: "text-amber-600",
//         },
//         {
//             title: "In Progress Tasks",
//             value: isInProgressLoading ? "Loading..." : isInProgressError ? "Error" : inProgressTasks.length.toString(),
//             change: isInProgressLoading || isInProgressError ? "" : `+${inProgressTasks.length - 2 >= 0 ? inProgressTasks.length - 2 : 0}`, // Example: compared to a baseline of 2
//             changeType: "negative" as const,
//             icon: AlertCircle,
//             description: "Need attention",
//             gradient: "from-red-500 to-rose-600",
//             bgGradient: "from-red-50 to-rose-50",
//             iconColor: "text-red-600",
//         },
//     ];

//     return (
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
//             {stats.map((stat, index) => {
//                 const Icon = stat.icon;
//                 return (
//                     <Card
//                         key={stat.title}
//                         className={`group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm`}
//                         style={{
//                             animationDelay: `${index * 100}ms`,
//                         }}
//                     >
//                         <div
//                             className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
//                         />
//                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
//                             <CardTitle className="text-sm font-semibold text-slate-600 group-hover:text-slate-700 transition-colors">
//                                 {stat.title}
//                             </CardTitle>
//                             <div
//                                 className={`p-2 rounded-xl bg-white/80 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-110`}
//                             >
//                                 <Icon className={`h-5 w-5 ${stat.iconColor}`} />
//                             </div>
//                         </CardHeader>
//                         <CardContent className="space-y-2">
//                             <div className="text-3xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
//                                 {stat.value}
//                             </div>
//                             <div className="flex items-center gap-2">
//                                 {stat.change && (
//                                     <span
//                                         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${stat.changeType === "positive" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
//                                             }`}
//                                     >
//                                         {stat.change}
//                                     </span>
//                                 )}
//                                 <span className="text-sm text-slate-500">{stat.description}</span>
//                             </div>
//                         </CardContent>
//                     </Card>
//                 );
//             })}
//         </div>
//     );
// }



"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetTasksByTaskerIdAndStatusQuery } from "@/features/api/taskApi";
import { checkLoginStatus } from "@/resusable/CheckUser";
import { skipToken } from "@reduxjs/toolkit/query/react";   // ← THIS WAS MISSING
import { DollarSign, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

export function DashboardStats() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { isLoggedIn, user } = await checkLoginStatus();
            if (isLoggedIn && user?.currentRole === "tasker") {
                setUser(user);
            }
        };
        fetchUser();
    }, []);

    const {
        data: completedTasks = [],
        isLoading: loadingCompleted,
    } = useGetTasksByTaskerIdAndStatusQuery(
        user?._id
            ? { taskerId: user._id, status: "completed" }
            : skipToken,
        { skip: !user?._id }
    );

    const {
        data: pendingTasks = [],
        isLoading: loadingPending,
    } = useGetTasksByTaskerIdAndStatusQuery(
        user?._id
            ? { taskerId: user._id, status: "pending" }
            : skipToken,
        { skip: !user?._id }
    );

    const {
        data: inProgressTasks = [],
        isLoading: loadingInProgress,
    } = useGetTasksByTaskerIdAndStatusQuery(
        user?._id
            ? { taskerId: user._id, status: "in_progress" }
            : skipToken,
        { skip: !user?._id }
    );

    const totalIncome = completedTasks.reduce(
        (sum: number, task: any) => sum + (task.price || 0),
        0
    );

    const stats = [
        {
            title: "Total Earnings",
            value: loadingCompleted ? "—" : `$${totalIncome.toLocaleString()}`,
            icon: DollarSign,
            color: "text-[#109C3D]",
            bg: "bg-[#E5FFDB]",
            description: "From completed tasks",
        },
        {
            title: "Completed Tasks",
            value: loadingCompleted ? "—" : completedTasks.length,
            icon: CheckCircle2,
            color: "text-[#109C3D]",
            bg: "bg-[#E5FFDB]",
            description: "Successfully finished",
        },
        {
            title: "In Progress",
            value: loadingInProgress ? "—" : inProgressTasks.length,
            icon: Clock,
            color: "text-[#063A41]",
            bg: "bg-gray-100",
            description: "Active jobs",
        },
        {
            title: "Pending Approval",
            value: loadingPending ? "—" : pendingTasks.length,
            icon: AlertCircle,
            color: "text-orange-600",
            bg: "bg-orange-50",
            description: "Awaiting confirmation",
        },
    ];

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card
                    key={stat.title}
                    className="relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
                >
                    {/* Subtle green accent on hover */}
                    <div className="absolute inset-x-0 top-0 h-1.5 bg-[#109C3D] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            {stat.title}
                        </CardTitle>
                        <div className={`p-3 rounded-full ${stat.bg} shadow-sm`}>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="text-3xl font-bold text-[#063A41]">
                            {stat.value}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}