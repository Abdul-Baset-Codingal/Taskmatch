// components/admin/ActivityChart.tsx
"use client";

import React from "react";
import { useGetLogStatsQuery } from "@/features/api/adminLogApi";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
} from "recharts";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

export default function ActivityCharts() {
    const { data: statsData, isLoading } = useGetLogStatsQuery();
    const stats = statsData?.stats;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const dailyData =
        stats?.dailyStats?.map((day) => ({
            date: day._id,
            total: day.total,
            logins: day.logins,
            signups: day.signups,
            failures: day.failures,
        })) || [];

    const moduleData =
        stats?.byModule?.map((item) => ({
            name: item._id,
            value: item.count,
        })) || [];

    const statusData =
        stats?.byStatus?.map((item) => ({
            name: item._id,
            value: item.count,
        })) || [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Activity Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Activity (Last 7 Days)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={dailyData}>
                        <defs>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                        <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#FFF",
                                border: "1px solid #E5E7EB",
                                borderRadius: "8px",
                            }}
                        />
                        <Area type="monotone" dataKey="total" stroke="#3B82F6" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={2} />
                        <Area type="monotone" dataKey="logins" stroke="#10B981" fill="transparent" strokeWidth={2} />
                        <Area type="monotone" dataKey="failures" stroke="#EF4444" fill="transparent" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm text-gray-600">Total</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm text-gray-600">Logins</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-sm text-gray-600">Failures</span>
                    </div>
                </div>
            </div>

            {/* Module Distribution */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity by Module</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={moduleData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                            {moduleData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Status Distribution */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity by Status</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={statusData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} stroke="#9CA3AF" width={80} />
                        <Tooltip />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                            {statusData.map((entry, index) => {
                                const colors: Record<string, string> = {
                                    success: "#10B981",
                                    failure: "#EF4444",
                                    pending: "#F59E0B",
                                    warning: "#F97316",
                                };
                                return <Cell key={`cell-${index}`} fill={colors[entry.name] || "#6B7280"} />;
                            })}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}