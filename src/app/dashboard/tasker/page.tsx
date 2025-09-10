
"use client";

import React, { useState } from "react";
import {
  FaTasks,
  FaClipboardList,
  FaCalendarAlt,
  FaTools,
  FaExclamationCircle,
  FaCheckCircle,
  FaDollarSign,
} from "react-icons/fa";
import Navbar from '@/shared/Navbar';
import AvailabilitySchedule from '@/components/dashboard/tasker/AvailabilitySchedule';
import SkillsSection from '@/components/dashboard/tasker/SkillsSection';
import TaskerDashboardSection from '@/components/dashboard/tasker/TaskerDashboardSection';
import TaskTabs from '@/components/dashboard/tasker/TaskTabs';
import UrgentTasks from '@/components/dashboard/tasker/UrgentTasks';
import AvailableTasks from "@/components/dashboard/tasker/AvailableTasks";
import ActiveTasks from "@/components/dashboard/tasker/ActiveTasks";
import CompletedTasks from "@/components/dashboard/tasker/CompletedTasks";
import PendingBookings from "@/components/dashboard/tasker/PendingBookings";

const TaskerDashboard = () => {
  const [activeSection, setActiveSection] = useState('urgent-tasks');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Static stats data
  const stats = [
    {
      title: "Total Tasks",
      value: "25",
      icon: <FaTasks className="text-blue-700 text-3xl animate-pulse" />,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Pending Tasks",
      value: "5",
      icon: <FaClipboardList className="text-yellow-700 text-3xl animate-pulse" />,
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      title: "Completed Tasks",
      value: "20",
      icon: <FaCheckCircle className="text-green-700 text-3xl animate-pulse" />,
      gradient: "from-green-500 to-green-600",
    },
    {
      title: "Total Earned",
      value: "$2,500",
      icon: <FaDollarSign className="text-purple-700 text-3xl animate-pulse" />,
      gradient: "from-purple-500 to-[#8560F1]",
    },
  ];

  // Define sections for sidebar navigation
  const sections = [
    { id: 'urgent-tasks', name: 'Urgent Tasks', icon: FaExclamationCircle, component: <UrgentTasks /> },
    { id: 'tasks', name: 'Tasks', icon: FaClipboardList, component: <TaskTabs /> },
    { id: 'AvailableTasks', name: 'Available Tasks', icon: FaClipboardList, component: <AvailableTasks /> },
    { id: 'ActiveTasks', name: 'Active Tasks', icon: FaClipboardList, component: <ActiveTasks /> },
    { id: 'pendingBookings', name: 'Pending Bookings', icon: FaClipboardList, component: <PendingBookings /> },
    { id: 'completedTasks', name: 'Completed Tasks', icon: FaClipboardList, component: <CompletedTasks /> },

    { id: 'skills', name: 'Skills', icon: FaTools, component: <SkillsSection /> },
    { id: 'availability', name: 'Availability', icon: FaCalendarAlt, component: <AvailabilitySchedule /> },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFC] to-[#EDEEF2]">
      {/* Navbar */}
      <Navbar />

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside
          className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-white to-[#F8F4FF] shadow-2xl md:shadow-lg border-r border-gray-200 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } md:translate-x-0 transition-transform duration-300 ease-in-out h-[100vh] overflow-y-auto`}
        >
          <div className="flex justify-between items-center p-4 md:hidden">
            <h2 className="text-xl font-bold text-gray-900">Menu</h2>
            <button onClick={toggleSidebar} className="text-gray-600 hover:text-[#8560F1]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              {sections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => {
                      setActiveSection(section.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeSection === section.id
                      ? 'bg-gradient-to-r from-[#8560F1] to-[#A78BFA] text-white font-semibold shadow-md'
                      : 'text-gray-700 hover:bg-[#F2EEFD] hover:text-[#8560F1]'
                      }`}
                  >
                    <section.icon className="text-lg" />
                    <span>{section.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Mobile Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="md:hidden fixed top-20 left-4 z-50 p-2 bg-[#8560F1] text-white rounded-full shadow-lg hover:bg-[#A78BFA] transition-colors duration-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Main Content */}
        <main className="flex-1 p-4 ">
          <TaskerDashboardSection />

          {/* Stats Section */}
          <section className="mx-auto mb-8">
            <div className="bg-gradient-to-r from-white to-[#F8F4FF] rounded-2xl shadow-lg p-6 border border-indigo-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className={`relative bg-gradient-to-br ${stat.gradient} text-white p-4 rounded-xl flex items-center gap-3 transition-all duration-300 hover:shadow-[0_8px_20px_rgba(99,102,241,0.3)] hover:-translate-y-1 animate-fadeIn`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="bg-white/30 p-2 rounded-full shadow-md">
                      {stat.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-extrabold">{stat.value}</h3>
                      <p className="text-sm font-semibold">{stat.title}</p>
                    </div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/hexellence.png')] opacity-5 pointer-events-none"></div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Active Section */}
          <div className="bg-white rounded-2xl shadow-lg p-0 md:p-8 transition-all duration-500">
            {sections.find((sec) => sec.id === activeSection)?.component}
          </div>
        </main>
      </div>

      {/* Custom CSS for Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TaskerDashboard;