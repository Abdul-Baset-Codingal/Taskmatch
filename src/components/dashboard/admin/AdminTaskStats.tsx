// components/admin/AdminTaskStats.tsx
import React from 'react';
import {
    FiCheckCircle,
    FiClock,
    FiDollarSign,
    FiTrendingUp,
    FiUsers,
    FiActivity
} from 'react-icons/fi';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    BarChart,
    Bar
} from 'recharts';

interface StatsData {
    totalTasks: number;
    statusCounts: Record<string, number>;
    scheduleCounts: Record<string, number>;
    paymentStats: Array<{ _id: string; count: number; totalAmount: number }>;
    recentTasks: any[];
    topClients: Array<{ _id: string; taskCount: number; firstName: string; lastName: string; email: string }>;
    topTaskers: Array<{ _id: string; taskCount: number; firstName: string; lastName: string; email: string }>;
    priceStats: { avgPrice: number; minPrice: number; maxPrice: number; totalRevenue: number };
    dailyStats: Array<{ _id: string; count: number }>;
}

interface Props {
    data?: StatsData;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6B7280'];

const AdminTaskStats: React.FC<Props> = ({ data }) => {
    if (!data) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Format data for charts
    const statusChartData = Object.entries(data.statusCounts).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value
    }));

    const scheduleChartData = Object.entries(data.scheduleCounts).map(([name, value]) => ({
        name,
        value
    }));

    const dailyChartData = data.dailyStats.map(item => ({
        date: item._id,
        tasks: item.count
    }));

    const StatCard = ({ title, value, icon: Icon, color, subValue }: any) => (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
                    {subValue && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subValue}</p>
                    )}
                </div>
                <div className={`p-3 rounded-full ${color}`}>
                    <Icon size={24} className="text-white" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Tasks"
                    value={data.totalTasks}
                    icon={FiActivity}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Completed"
                    value={data.statusCounts.completed || 0}
                    icon={FiCheckCircle}
                    color="bg-green-500"
                    subValue={`${((data.statusCounts.completed || 0) / data.totalTasks * 100).toFixed(1)}% completion rate`}
                />
                <StatCard
                    title="In Progress"
                    value={data.statusCounts['in progress'] || 0}
                    icon={FiClock}
                    color="bg-yellow-500"
                />
                <StatCard
                    title="Total Revenue"
                    value={`$${data.priceStats.totalRevenue?.toFixed(2) || '0.00'}`}
                    icon={FiDollarSign}
                    color="bg-purple-500"
                    subValue={`Avg: $${data.priceStats.avgPrice?.toFixed(2) || '0.00'}`}
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Tasks Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Tasks Created (Last 30 Days)
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dailyChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 10 }}
                                    tickFormatter={(value) => value.split('-').slice(1).join('/')}
                                />
                                <YAxis />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1F2937',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="tasks"
                                    stroke="#3B82F6"
                                    fill="#3B82F6"
                                    fillOpacity={0.3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status Distribution */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Task Status Distribution
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusChartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Second Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Schedule Distribution */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Schedule Types
                    </h3>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={scheduleChartData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={70} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#10B981" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Clients */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <FiUsers className="text-blue-500" />
                        Top Clients
                    </h3>
                    <div className="space-y-3">
                        {data.topClients.map((client, index) => (
                            <div key={client._id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-300">
                                        {index + 1}
                                    </span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {client.firstName} {client.lastName}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {client.email}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                    {client.taskCount} tasks
                                </span>
                            </div>
                        ))}
                        {data.topClients.length === 0 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                                No data available
                            </p>
                        )}
                    </div>
                </div>

                {/* Top Taskers */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <FiTrendingUp className="text-green-500" />
                        Top Taskers
                    </h3>
                    <div className="space-y-3">
                        {data.topTaskers.map((tasker, index) => (
                            <div key={tasker._id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-xs font-medium text-green-600 dark:text-green-300">
                                        {index + 1}
                                    </span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {tasker.firstName} {tasker.lastName}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {tasker.email}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                    {tasker.taskCount} completed
                                </span>
                            </div>
                        ))}
                        {data.topTaskers.length === 0 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                                No data available
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Tasks */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Recent Tasks
                </h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {data.recentTasks.map((task) => (
                                <tr key={task._id}>
                                    <td className="py-3 text-sm text-gray-900 dark:text-white">
                                        {task.taskTitle}
                                    </td>
                                    <td className="py-3 text-sm text-gray-500 dark:text-gray-400">
                                        {task.client?.firstName} {task.client?.lastName}
                                    </td>
                                    <td className="py-3">
                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                task.status === 'in progress' ? 'bg-blue-100 text-blue-800' :
                                                    task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                            }`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td className="py-3 text-sm text-gray-900 dark:text-white">
                                        ${task.price?.toFixed(2)}
                                    </td>
                                    <td className="py-3 text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(task.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminTaskStats;