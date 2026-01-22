// components/admin/AdminTasksTable.tsx
import React from 'react';
import { format } from 'date-fns';
import {
    FiEye,
    FiEdit2,
    FiTrash2,
    FiChevronUp,
    FiChevronDown,
    FiChevronLeft,
    FiChevronRight,
    FiUser,
    FiDollarSign,
    FiMapPin,
    FiClock
} from 'react-icons/fi';

interface Task {
    _id: string;
    taskTitle: string;
    taskDescription: string;
    serviceTitle: string;
    location: string;
    schedule: string;
    status: string;
    price: number;
    client: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        profilePicture?: string;
    };
    acceptedBy?: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    bids: any[];
    createdAt: string;
}

interface Pagination {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

interface Props {
    tasks: Task[];
    pagination?: Pagination;
    isLoading: boolean;
    selectedTasks: string[];
    onSelectAll: (checked: boolean) => void;
    onSelectTask: (taskId: string, checked: boolean) => void;
    onPageChange: (page: number) => void;
    onViewTask: (task: Task) => void;
    onEditTask: (task: Task) => void;
    onDeleteTask: (task: Task) => void;
    onStatusChange: (taskId: string, status: string) => void;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    onSort: (sortBy: string) => void;
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'in progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    requested: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'not completed': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    declined: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
};

const scheduleColors: Record<string, string> = {
    Flexible: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    Schedule: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    Urgent: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

const AdminTasksTable: React.FC<Props> = ({
    tasks,
    pagination,
    isLoading,
    selectedTasks,
    onSelectAll,
    onSelectTask,
    onPageChange,
    onViewTask,
    onEditTask,
    onDeleteTask,
    onStatusChange,
    sortBy,
    sortOrder,
    onSort,
}) => {
    const SortIcon = ({ column }: { column: string }) => {
        if (sortBy !== column) return null;
        return sortOrder === 'asc' ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />;
    };

    const SortableHeader = ({ column, children }: { column: string; children: React.ReactNode }) => (
        <th
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => onSort(column)}
        >
            <div className="flex items-center gap-1">
                {children}
                <SortIcon column={column} />
            </div>
        </th>
    );

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="animate-pulse">
                    <div className="h-12 bg-gray-200 dark:bg-gray-700" />
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700" />
                    ))}
                </div>
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                    <FiClock size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No tasks found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                    Try adjusting your filters to find what you're looking for.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="px-6 py-3 text-left">
                                <input
                                    type="checkbox"
                                    checked={selectedTasks.length === tasks.length && tasks.length > 0}
                                    onChange={(e) => onSelectAll(e.target.checked)}
                                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                                />
                            </th>
                            <SortableHeader column="taskTitle">Task</SortableHeader>
                            <SortableHeader column="status">Status</SortableHeader>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Client
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Tasker
                            </th>
                            <SortableHeader column="price">Price</SortableHeader>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Bids
                            </th>
                            <SortableHeader column="createdAt">Created</SortableHeader>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {tasks.map((task) => (
                            <tr
                                key={task._id}
                                className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${selectedTasks.includes(task._id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                    }`}
                            >
                                <td className="px-6 py-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedTasks.includes(task._id)}
                                        onChange={(e) => onSelectTask(task._id, e.target.checked)}
                                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                                            {task.taskTitle}
                                        </span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${scheduleColors[task.schedule] || 'bg-gray-100 text-gray-700'}`}>
                                                {task.schedule}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                <FiMapPin size={10} />
                                                {task.location?.substring(0, 20)}...
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <select
                                        value={task.status}
                                        onChange={(e) => onStatusChange(task._id, e.target.value)}
                                        className={`text-xs font-medium rounded-full px-3 py-1 border-0 cursor-pointer ${statusColors[task.status]}`}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="in progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                        <option value="requested">Requested</option>
                                        <option value="not completed">Not Completed</option>
                                        <option value="declined">Declined</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4">
                                    {task.client ? (
                                        <div className="flex items-center gap-2">
                                            {task.client.profilePicture ? (
                                                <img
                                                    src={task.client.profilePicture}
                                                    alt=""
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                                    <FiUser size={14} className="text-gray-500" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm text-gray-900 dark:text-white">
                                                    {task.client.firstName} {task.client.lastName}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {task.client.email}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400">N/A</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {task.acceptedBy ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                                                <FiUser size={14} className="text-green-600 dark:text-green-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-900 dark:text-white">
                                                    {task.acceptedBy.firstName} {task.acceptedBy.lastName}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-400 italic">Not assigned</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white">
                                        <FiDollarSign size={14} className="text-green-500" />
                                        {task.price?.toFixed(2) || '0.00'}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                        {task.bids?.length || 0} bids
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                    {format(new Date(task.createdAt), 'MMM d, yyyy')}
                                    <br />
                                    <span className="text-xs">
                                        {format(new Date(task.createdAt), 'h:mm a')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onViewTask(task)}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                                            title="View details"
                                        >
                                            <FiEye size={16} />
                                        </button>
                                        <button
                                            onClick={() => onEditTask(task)}
                                            className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/50 rounded-lg transition-colors"
                                            title="Edit task"
                                        >
                                            <FiEdit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => onDeleteTask(task)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                                            title="Delete task"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && (
                <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Showing{' '}
                            <span className="font-medium text-gray-900 dark:text-white">
                                {(pagination.currentPage - 1) * pagination.limit + 1}
                            </span>{' '}
                            to{' '}
                            <span className="font-medium text-gray-900 dark:text-white">
                                {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)}
                            </span>{' '}
                            of{' '}
                            <span className="font-medium text-gray-900 dark:text-white">
                                {pagination.totalCount}
                            </span>{' '}
                            results
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onPageChange(pagination.currentPage - 1)}
                                disabled={!pagination.hasPrevPage}
                                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <FiChevronLeft size={16} />
                            </button>
                            <div className="flex items-center gap-1">
                                {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                                    let page;
                                    if (pagination.totalPages <= 5) {
                                        page = i + 1;
                                    } else if (pagination.currentPage <= 3) {
                                        page = i + 1;
                                    } else if (pagination.currentPage >= pagination.totalPages - 2) {
                                        page = pagination.totalPages - 4 + i;
                                    } else {
                                        page = pagination.currentPage - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={page}
                                            onClick={() => onPageChange(page)}
                                            className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${page === pagination.currentPage
                                                ? 'bg-emerald-500  hover:bg-emerald-600 text-white'
                                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                onClick={() => onPageChange(pagination.currentPage + 1)}
                                disabled={!pagination.hasNextPage}
                                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <FiChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTasksTable;