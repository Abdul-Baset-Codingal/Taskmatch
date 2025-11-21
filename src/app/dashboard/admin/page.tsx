/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck

"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  FaUsers,
  FaTasks,
  FaCogs,
  FaBars,
  FaTimes,
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaDollarSign,
  FaUserPlus,
  FaCheckCircle,
  FaSpinner,
  FaMapMarkerAlt,
  FaChartArea,
  FaClock,
  FaUser,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

import Link from "next/link"; // Assuming you're using Next.js Link
import UserManagementTable from "@/components/dashboard/admin/UserManagementTable";
import TaskManagement from "@/components/dashboard/admin/TaskManagementSection";
import ServiceManagement from "@/components/dashboard/admin/ServiceManagement";

// Existing APIs
import { useGetAllUsersQuery } from "@/features/auth/authApi";
import { useGetAllTasksQuery } from "@/features/api/taskApi";
import { useGetServicesQuery } from "@/features/api/servicesApi";

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview"); // Default to overview
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [revenuePeriod, setRevenuePeriod] = useState<'full' | 'last6'>('full');

  // Fetch data for dynamic stats
  const { data: usersResponse, isLoading: loadingUsers } = useGetAllUsersQuery({ page: 1, limit: 1000 }); // Large limit for growth calculation
  const { data: tasksData, isLoading: loadingTasks } = useGetAllTasksQuery({ page: 1, limit: 1000 });
  const { data: services } = useGetServicesQuery({});

  const users = usersResponse?.users || [];
  const totalUsers = usersResponse?.pagination?.totalUsers || 0;
  const tasks = tasksData?.tasks || [];
  const totalTasks = tasksData?.pagination?.totalTasks || 0;
  const totalServices = services?.length || 0;

  // Recent users: Sort by createdAt descending, take first 10 for table
  const recentUsers = useMemo(() => {
    return [...users]
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .map((user: any) => ({
        id: user.id,
        name: user.firstName || 'Unknown User',
        email: user.email,
        createdAt: new Date(user.createdAt).toLocaleDateString(),
        role: user.currentRole || 'User',
      }));
  }, [users]);

  // Recent tasks: Sort by createdAt descending, take first 10 for table
  const recentTasks = useMemo(() => {
    return [...tasks]
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .map((task: any) => ({
        id: task.id,
        title: task.taskTitle || 'Untitled Task',
        status: task.status || 'Pending',
        assignedTo: task.acceptedBy || 'Unassigned',
        createdAt: new Date(task.createdAt).toLocaleDateString(),
      }));
  }, [tasks]);

  console.log(tasks)

  // Dynamic user growth: Group users by month from createdAt
  const userGrowthData = useMemo(() => {
    if (!users || users.length === 0) return [];

    const monthlyCounts = users.reduce((acc: { [key: string]: number }, user: any) => {
      const date = new Date(user.createdAt);
      const monthYear = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      acc[monthYear] = (acc[monthYear] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(monthlyCounts)
      .sort(([a], [b]) => {
        const [monthA, yearA] = a.split(' ');
        const [monthB, yearB] = b.split(' ');
        const monthIndexA = new Date(`${monthA} 1, ${yearA}`).getTime();
        const monthIndexB = new Date(`${monthB} 1, ${yearB}`).getTime();
        return monthIndexA - monthIndexB;
      })
      .map(([name, users]) => ({ name, users }));
  }, [users]);

  // Dynamic task growth: Similar to users
  const taskGrowthData = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];

    const monthlyCounts = tasks.reduce((acc: { [key: string]: number }, task: any) => {
      const date = new Date(task.createdAt);
      const monthYear = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      acc[monthYear] = (acc[monthYear] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(monthlyCounts)
      .sort(([a], [b]) => {
        const [monthA, yearA] = a.split(' ');
        const [monthB, yearB] = b.split(' ');
        const monthIndexA = new Date(`${monthA} 1, ${yearA}`).getTime();
        const monthIndexB = new Date(`${monthB} 1, ${yearB}`).getTime();
        return monthIndexA - monthIndexB;
      })
      .map(([name, tasks]) => ({ name, tasks }));
  }, [tasks]);

  // Dynamic task status distribution
  const taskStatusData = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];

    const statusCounts = tasks.reduce((acc: { [key: string]: number }, task: any) => {
      const status = task.status || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const total = tasks.length;
    return Object.entries(statusCounts).map(([name, count]) => ({
      name,
      value: Math.round((count / total) * 100)
    }));
  }, [tasks]);

  // Sample revenue and costs data (replace with API when available; assuming monthly data for 2025)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const revenueData = useMemo(() =>
    months.map((month, index) => ({
      name: month,
      revenue: Math.round(18000 + index * 1200 + (Math.random() - 0.5) * 2000),
      costs: Math.round(12000 + index * 800 + (Math.random() - 0.5) * 1500), // Sample costs
    })),
    []
  );

  const filteredRevenueData = useMemo(() =>
    revenuePeriod === 'last6' ? revenueData.slice(-6) : revenueData,
    [revenueData, revenuePeriod]
  );

  const totalRevenue = useMemo(() =>
    revenueData.reduce((sum, d) => sum + d.revenue, 0),
    [revenueData]
  );

  const totalCosts = useMemo(() =>
    revenueData.reduce((sum, d) => sum + d.costs, 0),
    [revenueData]
  );

  const totalProfit = totalRevenue - totalCosts;

  // Profit data
  const profitData = useMemo(() =>
    filteredRevenueData.map(d => ({
      name: d.name,
      profit: d.revenue - d.costs,
    })),
    [filteredRevenueData]
  );

  // Top services by task count (sample; assume services have task associations)
  const topServicesData = useMemo(() => {
    // Mock data; in real, aggregate tasks by serviceId
    const mockServices = services?.slice(0, 5).map((service: any, index: number) => ({
      name: service.name || `Service ${index + 1}`,
      tasks: Math.round(50 + index * 20 + (Math.random() - 0.5) * 30),
      revenue: Math.round(500 + index * 200 + (Math.random() - 0.5) * 100),
    })) || [];
    return mockServices;
  }, [services]);

  // Growth calculations
  const userGrowth = userGrowthData.length > 1 ? Math.round((userGrowthData[userGrowthData.length - 1].users / (userGrowthData[userGrowthData.length - 2]?.users || 1)) * 100 - 100) || 0 : 0;
  const taskGrowth = taskGrowthData.length > 1 ? Math.round((taskGrowthData[taskGrowthData.length - 1].tasks / (taskGrowthData[taskGrowthData.length - 2]?.tasks || 1)) * 100 - 100) || 0 : 0;
  const serviceGrowth = 5; // Placeholder
  const revenueGrowth = useMemo(() => {
    if (revenueData.length < 2) return 0;
    const last = revenueData[revenueData.length - 1].revenue;
    const prev = revenueData[revenueData.length - 2].revenue;
    return Math.round((last - prev) / prev * 100);
  }, [revenueData]);
  const profitGrowth = profitData.length > 1 ? Math.round((profitData[profitData.length - 1].profit / (profitData[profitData.length - 2]?.profit || 1)) * 100 - 100) || 0 : 0;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return '#10B981';
      case 'in progress': return '#3B82F6';
      case 'pending': return '#F59E0B';
      default: return '#EF4444';
    }
  };

  if (loadingUsers || loadingTasks) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-color3 via-white to-color3/50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-color1 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }
  
  console.log(recentUsers)

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8">
            {/* Stats Cards - Improved Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-color1 to-blue-800 text-white">
                    <FaUsers className="w-6 h-6" />
                  </div>
                  <FaChartLine className="text-gray-400 w-5 h-5" />
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text1">{totalUsers}</p>
                  <p className={`text-sm mt-1 ${userGrowth >= 0 ? 'text2' : 'text-red-500'}`}>
                    {userGrowth >= 0 ? `+${userGrowth}%` : `${userGrowth}%`} from last month
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-color2 to-green-600 text-white">
                    <FaTasks className="w-6 h-6" />
                  </div>
                  <FaChartBar className="text-gray-400 w-5 h-5" />
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                  <p className="text-3xl font-bold text1">{totalTasks}</p>
                  <p className={`text-sm mt-1 ${taskGrowth >= 0 ? 'text2' : 'text-red-500'}`}>
                    {taskGrowth >= 0 ? `+${taskGrowth}%` : `${taskGrowth}%`} from last month
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 text-white">
                    <FaCogs className="w-6 h-6" />
                  </div>
                  <FaChartPie className="text-gray-400 w-5 h-5" />
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-600">Total Services</p>
                  <p className="text-3xl font-bold text1">{totalServices}</p>
                  <p className="text-sm text2 mt-1">+{serviceGrowth} new</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                    <FaDollarSign className="w-6 h-6" />
                  </div>
                  <FaUserPlus className="text-gray-400 w-5 h-5" />
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text1">${totalRevenue.toLocaleString()}</p>
                  <p className={`text-sm mt-1 ${revenueGrowth >= 0 ? 'text2' : 'text-red-500'}`}>
                    {revenueGrowth >= 0 ? `+${revenueGrowth}%` : `${revenueGrowth}%`} monthly growth
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <FaDollarSign className="w-6 h-6" />
                  </div>
                  <FaChartArea className="text-gray-400 w-5 h-5" />
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-600">Total Profit</p>
                  <p className="text-3xl font-bold text1">${totalProfit.toLocaleString()}</p>
                  <p className={`text-sm mt-1 ${profitGrowth >= 0 ? 'text2' : 'text-red-500'}`}>
                    {profitGrowth >= 0 ? `+${profitGrowth}%` : `${profitGrowth}%`} growth
                  </p>
                </div>
              </div>
            </div>

            {/* Key Charts Section - Reduced to Important Ones */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Growth Line Chart */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text1 mb-4 flex items-center gap-2">
                  <FaChartLine /> User Growth Over Time
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip formatter={(value) => [`${value} users`, '']} />
                    <Line type="monotone" dataKey="users" stroke="#109C3D" strokeWidth={3} dot={{ fill: '#109C3D', strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Task Status Pie Chart */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text1 mb-4 flex items-center gap-2">
                  <FaChartPie /> Task Status Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={taskStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {taskStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getStatusColor(entry.name)} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value + '%', name]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Monthly Revenue Line Chart */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text1 flex items-center gap-2">
                    <FaChartLine /> Monthly Revenue
                  </h3>
                  <select
                    value={revenuePeriod}
                    onChange={(e) => setRevenuePeriod(e.target.value as 'full' | 'last6')}
                    className="px-3 py-1 rounded border border-gray-300 text-sm bg-white"
                  >
                    <option value="full">Full Year</option>
                    <option value="last6">Last 6 Months</option>
                  </select>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={filteredRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Monthly Profit Bar Chart */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text1 flex items-center gap-2">
                    <FaChartBar /> Monthly Profit
                  </h3>
                  <select
                    value={revenuePeriod}
                    onChange={(e) => setRevenuePeriod(e.target.value as 'full' | 'last6')}
                    className="px-3 py-1 rounded border border-gray-300 text-sm bg-white"
                  >
                    <option value="full">Full Year</option>
                    <option value="last6">Last 6 Months</option>
                  </select>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={profitData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Profit']} />
                    <Bar dataKey="profit" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Services Bar Chart - Important for Services Overview */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text1 mb-4 flex items-center gap-2">
                <FaChartBar /> Top Services by Tasks
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topServicesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#9ca3af" angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Bar dataKey="tasks" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Important Tables Section - Enhanced with Better Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Users Table */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text1 mb-4 flex items-center gap-2">
                  <FaUsers /> Recent Users (Last 10)
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentUsers.map((user, index) => (
                        <tr key={user.id || index} className="hover:bg-gray-50">
                          <td className="px-4 py-2 flex items-center gap-2">
                            <FaUser className="w-4 h-4 text-gray-400" />
                            <span>{user.name}</span>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">{user.email}</td>
                          <td className="px-4 py-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'Admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">{user.createdAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {recentUsers.length === 0 && <p className="text-gray-500 text-center py-4">No recent users</p>}
              </div>

              {/* Recent Tasks Table */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text1 mb-4 flex items-center gap-2">
                  <FaTasks /> Recent Tasks (Last 10)
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentTasks.map((task, index) => (
                        <tr key={task.id || index} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm font-medium text-gray-900">{task.title}</td>
                          <td className="px-4 py-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full  text-white`}>
                              {task.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">{task.assignedTo}</td>
                          <td className="px-4 py-2 text-sm text-gray-500 flex items-center gap-1">
                            <FaClock className="w-3 h-3" />
                            {task.createdAt}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {recentTasks.length === 0 && <p className="text-gray-500 text-center py-4">No recent tasks</p>}
              </div>
            </div>
          </div>
        );
      case "users":
        return <UserManagementTable onEditUser={(user) => console.log("Edit user:", user)} />;
      case "tasks":
        return <TaskManagement />;
      case "services":
        return <ServiceManagement />;
      default:
        return <div className="text-center py-12"><p className="text-gray-500">No content available</p></div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-color3 via-white to-color3/50">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed z-50 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg md:hidden border border-white/50 top-4 left-4"
      >
        {isSidebarOpen ? <FaTimes className="text-color1 w-5 h-5" /> : <FaBars className="text-color1 w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 color1 text-white shadow-2xl transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-300 ease-in-out overflow-y-auto`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header with Logo */}
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white">
                  TaskAllo
                </h1>
                <span className="w-2 h-2 relative top-2 rounded-full color2"></span>
              </Link>
            </div>
            <p className="text-blue-200 mt-2 text-sm">Admin Panel</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2">
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => {
                    setActiveTab("overview");
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === "overview"
                    ? "bg-white/10 text-white border-r-4 border-color2 shadow-md"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  <FaChartBar className="w-5 h-5" />
                  Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab("users");
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === "users"
                    ? "bg-white/10 text-white border-r-4 border-color2 shadow-md"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  <FaUsers className="w-5 h-5" />
                  Users
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab("tasks");
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === "tasks"
                    ? "bg-white/10 text-white border-r-4 border-color2 shadow-md"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  <FaTasks className="w-5 h-5" />
                  Tasks
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab("services");
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === "services"
                    ? "bg-white/10 text-white border-r-4 border-color2 shadow-md"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  <FaCogs className="w-5 h-5" />
                  Services
                </button>
              </li>
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-white/20">
            <button className="w-full py-3 px-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors">
              <FaCheckCircle className="inline mr-2 w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="md:ml-72 p-4 sm:p-6 lg:p-8 min-h-screen">
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text1 capitalize">
            {activeTab === "overview" ? "Dashboard Overview" : activeTab === "users" ? "User Management" : activeTab === "tasks" ? "Task Management" : "Service Management"}
          </h2>
          <p className="text-gray-600 mt-2 text-base sm:text-lg">
            {activeTab === "overview" ? "Welcome back! Here's what's happening on your platform." : activeTab === "users" ? "Manage and monitor user accounts" : activeTab === "tasks" ? "Oversee all tasks and assignments" : "Create and edit services"}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;