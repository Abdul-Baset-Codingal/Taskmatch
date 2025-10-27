// /* eslint-disable @typescript-eslint/ban-ts-comment */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// import React, { useState, useMemo } from "react";
// import {
//     FaTasks,
//     FaClipboardList,
//     FaCheckCircle,
//     FaDollarSign,
//     FaUserFriends,
//     FaBook,
// } from "react-icons/fa";
// import {  FaAward, FaCodePullRequest, FaWallet } from "react-icons/fa6";
// import { useGetTasksByClientQuery } from "@/features/api/taskApi";
// import Navbar from '@/shared/Navbar';
// import Greeting from '@/components/dashboard/client/Greeting';
// import ReferralSection from '@/components/dashboard/client/ReferralSection';
// import SavingsAndRewards from '@/components/dashboard/client/SavingsAndRewards';
// import TaskListSection from '@/components/dashboard/client/TaskListSection';
// import TaskMatchRewards from '@/components/dashboard/client/TaskMatchRewards';
// import RequestQuoteByUser from '@/components/dashboard/client/RequestQuoteByUser';
// import AllBookings from '@/components/dashboard/client/AllBookings';

// const ClientDashboard = () => {
//     const [activeSection, setActiveSection] = useState('tasks');
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//     // Fetch client tasks for stats
//     // @ts-ignore
//     const { data: clientTasks = [], isLoading: isStatsLoading, isError: isStatsError } = useGetTasksByClientQuery();

//     // Compute stats
//     const stats = useMemo(() => {
//         const totalTasks = clientTasks.length;
//         const pendingTasks = clientTasks.filter((task: any) => task.status === "pending").length;
//         const completedTasks = clientTasks.filter((task: any) => task.status === "completed").length;
//         const totalSpent = clientTasks.reduce((sum: number, task: any) => sum + (task.price || 0), 0);

//         return [
//             {
//                 title: "Total Tasks",
//                 value: totalTasks.toString(),
//                 icon: <FaTasks className="text-blue-700 text-3xl animate-pulse" />,
//                 gradient: "from-blue-500 to-blue-600",
//             },
//             {
//                 title: "Pending Tasks",
//                 value: pendingTasks.toString(),
//                 icon: <FaClipboardList className="text-yellow-700 text-3xl animate-pulse" />,
//                 gradient: "from-yellow-500 to-orange-500",
//             },
//             {
//                 title: "Completed Tasks",
//                 value: completedTasks.toString(),
//                 icon: <FaCheckCircle className="text-green-700 text-3xl animate-pulse" />,
//                 gradient: "from-green-500 to-green-600",
//             },
//             {
//                 title: "Total Spent",
//                 value: `$${totalSpent.toLocaleString()}`,
//                 icon: <FaDollarSign className="text-purple-700 text-3xl animate-pulse" />,
//                 gradient: "from-purple-500 to-[#8560F1]",
//             },
//         ];
//     }, [clientTasks]);

//     const sections = [
//         { id: 'tasks', name: 'Tasks', icon: FaTasks, component: <TaskListSection /> },
//         { id: 'request', name: "Request Quotes", icon: FaCodePullRequest, component: <RequestQuoteByUser /> },
//         { id: 'allBookings', name: "All Bookings", icon: FaBook, component: <AllBookings /> },
//         { id: 'task-matches', name: 'Task Matches', icon: FaAward, component: <TaskMatchRewards /> },
//         { id: 'savings', name: 'Savings & Rewards', icon: FaWallet, component: <SavingsAndRewards /> },
//         { id: 'referrals', name: 'Referrals', icon: FaUserFriends, component: <ReferralSection /> },
       
//     ];

//     const toggleSidebar = () => {
//         setIsSidebarOpen(!isSidebarOpen);
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-[#F9FAFC] to-[#EDEEF2]">
//             {/* Navbar */}
//             <Navbar />

//             <div className="flex flex-col md:flex-row">
//                 {/* Sidebar */}
//                 <aside
//                     className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-white to-[#F8F4FF] shadow-2xl md:shadow-lg border-r border-gray-200 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
//                         } md:translate-x-0 transition-transform duration-300 ease-in-out h-[100vh] overflow-y-auto`}
//                 >
//                     <div className="flex justify-between items-center p-4 md:hidden">
//                         <h2 className="text-xl font-bold text-gray-900">Menu</h2>
//                         <button onClick={toggleSidebar} className="text-gray-600 hover:text-[#8560F1]">
//                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                             </svg>
//                         </button>
//                     </div>
//                     <nav className="p-4">
//                         <ul className="space-y-2">
//                             {sections.map((section) => (
//                                 <li key={section.id}>
//                                     <button
//                                         onClick={() => {
//                                             setActiveSection(section.id);
//                                             setIsSidebarOpen(false);
//                                         }}
//                                         className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeSection === section.id
//                                                 ? 'bg-gradient-to-r from-[#8560F1] to-[#A78BFA] text-white font-semibold shadow-md'
//                                                 : 'text-gray-700 hover:bg-[#F2EEFD] hover:text-[#8560F1]'
//                                             }`}
//                                     >
//                                         <section.icon className="text-lg" />
//                                         <span>{section.name}</span>
//                                     </button>
//                                 </li>
//                             ))}
//                         </ul>
//                     </nav>
//                 </aside>

//                 {/* Mobile Sidebar Toggle Button */}
//                 <button
//                     onClick={toggleSidebar}
//                     className="md:hidden fixed top-20 left-4 z-50 p-2 bg-[#8560F1] text-white rounded-full shadow-lg hover:bg-[#A78BFA] transition-colors duration-300"
//                 >
//                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
//                     </svg>
//                 </button>

//                 {/* Main Content */}
//                 <main className="flex-1 p-4 md:p-8">
//                     <Greeting />

//                     {/* Stats Section */}
//                     <section className="mx-auto mb-8">
//                         {isStatsLoading ? (
//                             <p className="text-center text-gray-600 text-xl font-semibold animate-pulse">Loading stats...</p>
//                         ) : isStatsError ? (
//                             <p className="text-center text-red-600 text-xl font-semibold">Error loading stats!</p>
//                         ) : (
//                             <div className="bg-gradient-to-r from-white to-[#F8F4FF] rounded-2xl shadow-lg p-6 border border-indigo-100">
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                                     {stats.map((stat, index) => (
//                                         <div
//                                             key={index}
//                                             className={`relative bg-gradient-to-br ${stat.gradient} text-white p-4 rounded-xl flex items-center gap-3 transition-all duration-300 hover:shadow-[0_8px_20px_rgba(99,102,241,0.3)] hover:-translate-y-1 animate-fadeIn`}
//                                             style={{ animationDelay: `${index * 0.1}s` }}
//                                         >
//                                             <div className="bg-white/30 p-2 rounded-full shadow-md">
//                                                 {stat.icon}
//                                             </div>
//                                             <div>
//                                                 <h3 className="text-2xl font-extrabold">{stat.value}</h3>
//                                                 <p className="text-sm font-semibold">{stat.title}</p>
//                                             </div>
//                                             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/hexellence.png')] opacity-5 pointer-events-none"></div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}
//                     </section>

//                     {/* Active Section */}
//                     <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 transition-all duration-500">
//                         {sections.find((sec) => sec.id === activeSection)?.component}
//                     </div>
//                 </main>
//             </div>

//             {/* Custom CSS for Animations */}
//             <style jsx>{`
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.5s ease-out;
//         }
//       `}</style>
//         </div>
//     );
// };

// export default ClientDashboard;

"use client"

import { ClientDashboardLayout } from "@/components/dashboard/client/ClientDashboardLayout"
import { useState } from "react"

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    <div className="relative flex min-w-0 min-h-screen">
      <ClientDashboardLayout isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </div>
  )
}
