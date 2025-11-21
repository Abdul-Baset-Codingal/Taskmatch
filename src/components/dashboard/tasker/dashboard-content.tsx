/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react/no-unescaped-entities */
// /* eslint-disable @typescript-eslint/ban-ts-comment */
// // @ts-nocheck
// import { useEffect, useState } from "react";
// import { checkLoginStatus } from "@/resusable/CheckUser";
// import { DashboardStats } from "./dashboard-stats";
// import { IncomeChart } from "./income-chart";

// import { RecentQuotes } from "./recent-quotes";
// import { TaskCalendar } from "./task-calender";
// import { TaskOverview } from "./task-overview";
// import { UpcomingBookings } from "./upcoming-bookings";
// import Link from "next/link";

// export function DashboardContent() {
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

//     const calculateProfileProgress = (user) => {
//         if (!user || user.currentRole !== 'tasker') return 100;

//         // Define required fields for tasker profile completion
//         const requiredFields = [
//             // Basic profile
//             'profilePicture',
//             'about',
//             'dob',
//             // Address (all subfields)
//             () =>   !!user.address?.postalCode,
//             // Preferences
//             // 'language',
// //            'travelDistance',
//             // Expertise
//             () => user.categories && user.categories.length > 0,
//             // () => user.skills && user.skills.length > 0,
//             'yearsOfExperience',
//             // () => user.qualifications && user.qualifications.length > 0,
//             // Services
//             () => user.services && user.services.length > 0,
//             // ID Verification
//             'idType',
//             () => {
//                 if (user.idType === 'passport') return !!user.passportUrl;
//                 return !!user.governmentIdFront && !!user.governmentIdBack;
//             },
//             'issueDate',
//             'expiryDate',
//             // Legal/Compliance
//             'sin',
//             // () => user.certifications && user.certifications.length > 0,
//             'backgroundCheckConsent',
//             // 'hasInsurance',

//             // Availability
//             () => user.availability && user.availability.length > 0,
//             // () => user.serviceAreas && user.serviceAreas.length > 0,
//             // Consents
//             // 'acceptedTerms',
//             // 'acceptedTaxResponsibility',
//             // 'confirmedInfo',
//             // 'acceptedPipeda',
//         ];

//         let filledCount = 0;
//         requiredFields.forEach((field) => {
//             if (typeof field === 'function') {
//                 if (field(user)) filledCount++;
//             } else if (user[field]) {
//                 filledCount++;
//             }
//         });

//         const total = requiredFields.length;
//         return Math.round((filledCount / total) * 100);
//     };

//     const progress = calculateProfileProgress(user);
//     const isProfileComplete = progress === 100;
//     const showProfileProgress = user?.currentRole === 'tasker';

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

//                             <div className="hidden lg:block ">
//                                 <div className="text-sm text-slate-500">Today</div>
//                                 <div className="text-xl font-semibold text-slate-700">
//                                     {new Date().toLocaleDateString("en-US", {
//                                         weekday: "long",
//                                         month: "short",
//                                         day: "numeric",
//                                     })}
//                                 </div>
//                             </div>
//                             {/* Tasker Profile Progress */}

//                         </div>
//                         {showProfileProgress && (
//                             <div className="mt-6 p-5 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-xl border border-amber-200/50 shadow-md backdrop-blur-sm">
//                                 <div className="flex items-center justify-between mb-3">
//                                     <div className="flex items-center gap-2">
//                                         <div className="relative">
//                                             <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
//                                                 <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                                                 </svg>
//                                             </div>
//                                         </div>
//                                         <span className="text-sm font-semibold text-gray-800">Profile Setup</span>
//                                     </div>
//                                     <span className="text-lg font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
//                                         {progress}%
//                                     </span>
//                                 </div>

//                                 {/* Enhanced Circular Progress */}
//                                 <div className="flex justify-center mb-4">
//                                     <div className="relative">
//                                         <svg className="w-20 h-20 -rotate-90 transform transition-all duration-1000 ease-out" viewBox="0 0 36 36">
//                                             {/* Background Circle */}
//                                             <path
//                                                 d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
//                                                 fill="none"
//                                                 stroke="#e5e7eb"
//                                                 strokeWidth="2.8"
//                                             />
//                                             {/* Progress Circle with Gradient Simulation */}
//                                             <path
//                                                 d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
//                                                 fill="none"
//                                                 stroke="url(#gradient)"
//                                                 strokeWidth="2.8"
//                                                 strokeLinecap="round"
//                                                 strokeDasharray={`${(progress / 100) * 100}, 100`}
//                                                 strokeDashoffset="0"
//                                             />
//                                             {/* Gradient Definition */}
//                                             <defs>
//                                                 <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
//                                                     <stop offset="0%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
//                                                     <stop offset="50%" style={{ stopColor: '#d97706', stopOpacity: 1 }} />
//                                                     <stop offset="100%" style={{ stopColor: '#b45309', stopOpacity: 1 }} />
//                                                 </linearGradient>
//                                             </defs>
//                                         </svg>
//                                         {/* Center Icon */}
//                                         <div className="absolute inset-0 flex items-center justify-center">
//                                             <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${isProfileComplete ? 'bg-green-500' : 'bg-amber-500'}`}>
//                                                 {isProfileComplete ? (
//                                                     <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
//                                                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                                                     </svg>
//                                                 ) : (
//                                                     <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                                                     </svg>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="text-center space-y-2">
//                                     <p className={`text-xs font-medium ${isProfileComplete ? 'text-green-700' : 'text-amber-800'}`}>
//                                         {isProfileComplete
//                                             ? "Your profile is fully set up and ready to go! "
//                                             : "Finish your profile to unlock more opportunities and start getting tasks."
//                                         }
//                                     </p>
//                                     <Link
//                                         href="#"
//                                         className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 shadow-sm ${isProfileComplete
//                                             ? 'bg-green-100 text-green-700 hover:bg-green-200 hover:shadow-md'
//                                             : 'bg-amber-100 text-amber-700 hover:bg-amber-200 hover:shadow-md'
//                                             }`}
//                                     >
//                                         {isProfileComplete ? (
//                                             <>
//                                                 <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
//                                                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                                                 </svg>
//                                                 All Set
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//                                                 </svg>
//                                                 Complete Profile
//                                             </>
//                                         )}
//                                     </Link>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* Stats Cards */}
//             <DashboardStats />

//             <div className="grid gap-8 lg:grid-cols-2">
//                 {/* Income Chart */}
//                 <div className="lg:col-span-1 animate-in slide-in-from-left-5 duration-700 delay-200">
//                     <IncomeChart />
//                 </div>

//                 {/* Task Overview */}
//                 <div className="lg:col-span-1 animate-in slide-in-from-right-5 duration-700 delay-300">
//                     <TaskOverview />
//                 </div>
//             </div>

//             <div className="grid gap-8 lg:grid-cols-3">
//                 {/* Task Calendar */}
//                 <div className="lg:col-span-1 animate-in slide-in-from-bottom-5 duration-700 delay-400">
//                     <TaskCalendar />
//                 </div>

//                 {/* Recent Quotes */}
//                 <div className="lg:col-span-1 animate-in slide-in-from-bottom-5 duration-700 delay-500">
//                     <RecentQuotes />
//                 </div>

//                 {/* Upcoming Bookings */}
//                 <div className="lg:col-span-1 animate-in slide-in-from-bottom-5 duration-700 delay-600">
//                     <UpcomingBookings />
//                 </div>
//             </div>
//         </div>
//     );
// }



import { useEffect, useState } from "react";
import { checkLoginStatus } from "@/resusable/CheckUser";
import { DashboardStats } from "./dashboard-stats";
import { IncomeChart } from "./income-chart";
import { RecentQuotes } from "./recent-quotes";
import { TaskCalendar } from "./task-calender";
import { TaskOverview } from "./task-overview";
import { UpcomingBookings } from "./upcoming-bookings";
import Link from "next/link";

export function DashboardContent() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { isLoggedIn, user } = await checkLoginStatus();
            if (isLoggedIn) setUser(user);
        };
        fetchUser();
    }, []);

    const calculateProfileProgress = (user: any) => {
        if (!user || user.currentRole !== "tasker") return 100;

        const checks = [
            !!user.profilePicture,
            !!user.about,
            !!user.dob,
            !!user.address?.postalCode,
            Array.isArray(user.categories) && user.categories.length > 0,
            !!user.yearsOfExperience,
            Array.isArray(user.services) && user.services.length > 0,
            !!user.idType,
            user.idType === "passport" ? !!user.passportUrl : !!user.governmentIdFront && !!user.governmentIdBack,
            !!user.issueDate,
            !!user.expiryDate,
            !!user.sin,
            !!user.backgroundCheckConsent,
            Array.isArray(user.availability) && user.availability.length > 0,
        ];

        const filled = checks.filter(Boolean).length;
        return Math.round((filled / checks.length) * 100);
    };

    const progress = user ? calculateProfileProgress(user) : 0;
    const isComplete = progress === 100;
    const isTasker = user?.currentRole === "tasker";

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    return (
        <div className="space-y-10 pb-12">
            {/* Clean Hero Section - Your Brand Only */}
            <div className="bg-[#063A41] rounded-3xl p-8 lg:p-12 text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                                Welcome back, {user?.firstName || "Tasker"}! 👋
                            </h1>
                            <p className="mt-4 text-xl text-white/90">{today}</p>
                            <p className="mt-3 text-lg text-white/70 max-w-2xl">
                                Manage your bookings, track earnings, and stay on top of new opportunities.
                            </p>
                        </div>

                        {/* Profile Completion - Only for Taskers */}
                        {isTasker && (
                            <div className="bg-white rounded-2xl shadow-xl p-7 w-full lg:w-96">
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="text-lg font-semibold text-[#063A41]">Profile Completion</h3>
                                    <span className={`text-2xl font-bold ${isComplete ? "text-[#109C3D]" : "text-[#063A41]"}`}>
                                        {progress}%
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-5">
                                    <div
                                        className="h-full bg-[#109C3D] transition-all duration-1000 ease-out"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>

                                <p className="text-sm text-gray-600 mb-5">
                                    {isComplete
                                        ? "Your profile is complete and ready to attract more clients!"
                                        : "Finish setting up your profile to increase bookings and visibility."}
                                </p>

                                {!isComplete && (
                                    <Link href="/tasker/profile">
                                        <button className="w-full bg-[#109C3D] hover:bg-[#063A41] text-white font-semibold py-3.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg">
                                            Complete Profile →
                                        </button>
                                    </Link>
                                )}

                                {isComplete && (
                                    <div className="text-center">
                                        <span className="inline-flex items-center gap-2 text-[#109C3D] font-semibold">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Profile Complete
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <DashboardStats />

            {/* Main Grid */}
            <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
                <div className="xl:col-span-2">
                    <IncomeChart />
                </div>
                <div>
                    <TaskOverview />
                </div>

                <div className="lg:col-span-2 xl:col-span-1">
                    <TaskCalendar />
                </div>
                <div>
                    <RecentQuotes />
                </div>
                <div>
                    <UpcomingBookings />
                </div>
            </div>
        </div>
    );
}