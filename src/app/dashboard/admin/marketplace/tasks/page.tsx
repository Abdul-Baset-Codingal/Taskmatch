"use client"
// pages/admin/AdminTasksDashboard.tsx
import React, { useState, useMemo } from 'react';


import {
    FiRefreshCw,
    FiDownload,
    FiTrash2,
    FiBarChart2,
    FiList
} from 'react-icons/fi';
import { useBulkDeleteAdminTasksMutation, useChangeTaskStatusMutation, useDeleteAdminTaskMutation, useGetAdminTasksQuery, useGetTaskStatisticsQuery } from '@/features/api/adminTaskApi';
import { toast } from 'react-toastify';
import AdminTasksTable from '@/components/dashboard/admin/AdminTasksTable';
import AdminTaskFilters from '@/components/dashboard/admin/AdminTaskFilters';
import AdminTaskStats from '@/components/dashboard/admin/AdminTaskStats';
import ConfirmDeleteModal from '@/components/dashboard/admin/ConfirmDeleteModal';
import EditTaskModal from '@/components/dashboard/admin/EditTaskModal';
import TaskDetailModal from '@/components/dashboard/admin/TaskDetailModal';

const AdminTasksDashboard: React.FC = () => {
    // View state
    const [activeView, setActiveView] = useState<'list' | 'stats'>('list');

    // Filter state
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        status: '',
        schedule: '',
        search: '',
        sortBy: 'createdAt',
        sortOrder: 'desc' as 'asc' | 'desc',
        startDate: '',
        endDate: '',
        minPrice: undefined as number | undefined,
        maxPrice: undefined as number | undefined,
    });

    // Selection state
    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

    // Modal states
    const [detailModalTask, setDetailModalTask] = useState<any>(null);
    const [editModalTask, setEditModalTask] = useState<any>(null);
    const [deleteModalTask, setDeleteModalTask] = useState<any>(null);
    const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

    // Queries
    const { data: tasksData, isLoading, isFetching, refetch } = useGetAdminTasksQuery(filters);
    const { data: statsData } = useGetTaskStatisticsQuery();

    // Mutations
    const [deleteTask, { isLoading: isDeleting }] = useDeleteAdminTaskMutation();
    const [bulkDeleteTasks, { isLoading: isBulkDeleting }] = useBulkDeleteAdminTasksMutation();
    const [changeStatus] = useChangeTaskStatusMutation();

    // Handlers
    const handleFilterChange = (newFilters: Partial<typeof filters>) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters,
            page: newFilters.page || 1 // Reset to page 1 on filter change
        }));
        setSelectedTasks([]);
    };

    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked && tasksData?.data) {
            setSelectedTasks(tasksData.data.map(task => task._id));
        } else {
            setSelectedTasks([]);
        }
    };

    const handleSelectTask = (taskId: string, checked: boolean) => {
        if (checked) {
            setSelectedTasks(prev => [...prev, taskId]);
        } else {
            setSelectedTasks(prev => prev.filter(id => id !== taskId));
        }
    };

    const handleDeleteTask = async () => {
        if (!deleteModalTask) return;

        try {
            await deleteTask(deleteModalTask._id).unwrap();
            toast.success('Task deleted successfully');
            setDeleteModalTask(null);
            // If details modal was open for this task, close it too
            if (detailModalTask?._id === deleteModalTask._id) {
                setDetailModalTask(null);
            }
            refetch(); // Refresh list
        } catch (error: any) {
            console.error("Delete failed:", error);
            toast.error(error.data?.message || 'Failed to delete task');
        }
    };

    const handleBulkDelete = async () => {
        try {
            const result = await bulkDeleteTasks(selectedTasks).unwrap();
            toast.success(`${result.deletedCount} tasks deleted successfully`);
            setShowBulkDeleteModal(false);
            setSelectedTasks([]);
        } catch (error: any) {
            toast.error(error.data?.message || 'Failed to delete tasks');
        }
    };

    const handleStatusChange = async (taskId: string, status: string) => {
        try {
            await changeStatus({ taskId, status }).unwrap();
            toast.success(`Status changed to ${status}`);
        } catch (error: any) {
            toast.error(error.data?.message || 'Failed to change status');
        }
    };

    const handleExport = async (format: 'json' | 'csv') => {
        try {
            const queryParams = new URLSearchParams({
                format,
                ...(filters.status && { status: filters.status }),
                ...(filters.startDate && { startDate: filters.startDate }),
                ...(filters.endDate && { endDate: filters.endDate }),
            });

            window.open(
                `/api/admin/tasks/export?${queryParams.toString()}`,
                '_blank'
            );
        } catch (error) {
            toast.error('Failed to export tasks');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow">
                <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Task Management
                            </h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Manage and monitor all tasks in the system
                            </p>
                        </div>

                        <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
                            {/* View Toggle */}
                            <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                                <button
                                    onClick={() => setActiveView('list')}
                                    className={`px-4 py-2 flex items-center gap-2 text-sm font-medium transition-colors ${activeView === 'list'
                                        ? 'bg-emerald-500  hover:bg-emerald-600 text-white'
                                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    <FiList size={16} />
                                    List
                                </button>
                                <button
                                    onClick={() => setActiveView('stats')}
                                    className={`px-4 py-2 flex items-center gap-2 text-sm font-medium transition-colors ${activeView === 'stats'
                                        ? 'bg-emerald-500  hover:bg-emerald-600 text-white'
                                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    <FiBarChart2 size={16} />
                                    Stats
                                </button>
                            </div>

                            {/* Refresh Button */}
                            <button
                                onClick={() => refetch()}
                                disabled={isFetching}
                                className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2 text-sm font-medium transition-colors"
                            >
                                <FiRefreshCw className={isFetching ? 'animate-spin' : ''} size={16} />
                                Refresh
                            </button>

                            {/* Export Dropdown */}
                            <div className="relative group">
                                <button className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2 text-sm font-medium transition-colors">
                                    <FiDownload size={16} />
                                    Export
                                </button>
                                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                    <button
                                        onClick={() => handleExport('csv')}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-t-lg"
                                    >
                                        Export as CSV
                                    </button>
                                    <button
                                        onClick={() => handleExport('json')}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-b-lg"
                                    >
                                        Export as JSON
                                    </button>
                                </div>
                            </div>

                            {/* Bulk Delete */}
                            {selectedTasks.length > 0 && (
                                <button
                                    onClick={() => setShowBulkDeleteModal(true)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 text-sm font-medium transition-colors"
                                >
                                    <FiTrash2 size={16} />
                                    Delete ({selectedTasks.length})
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeView === 'stats' ? (
                    <AdminTaskStats data={statsData?.data} />
                ) : (
                    <>
                        {/* Filters */}
                        <AdminTaskFilters
                            filters={filters}
                            onFilterChange={handleFilterChange}
                        />

                        {/* Tasks Table */}
                        <AdminTasksTable
                            tasks={tasksData?.data || []}
                            pagination={tasksData?.pagination}
                            isLoading={isLoading}
                            selectedTasks={selectedTasks}
                            onSelectAll={handleSelectAll}
                            onSelectTask={handleSelectTask}
                            onPageChange={handlePageChange}
                            onViewTask={setDetailModalTask}
                            onEditTask={setEditModalTask}
                            onDeleteTask={setDeleteModalTask}
                            onStatusChange={handleStatusChange}
                            sortBy={filters.sortBy}
                            sortOrder={filters.sortOrder}
                            onSort={(sortBy) => {
                                const newOrder = filters.sortBy === sortBy && filters.sortOrder === 'desc' ? 'asc' : 'desc';
                                handleFilterChange({ sortBy, sortOrder: newOrder });
                            }}
                        />
                    </>
                )}
            </div>

            {/* Modals */}
            {detailModalTask && (
                <TaskDetailModal
                    task={detailModalTask}
                    onClose={() => setDetailModalTask(null)}
                    onEdit={() => {
                        setEditModalTask(detailModalTask);
                        setDetailModalTask(null);
                    }}
                    onDelete={() => {
                        setDeleteModalTask(detailModalTask);
                        setDetailModalTask(null);
                    }}
                />
            )}

            {editModalTask && (
                <EditTaskModal
                    task={editModalTask}
                    onClose={() => setEditModalTask(null)}
                    onSuccess={() => {
                        setEditModalTask(null);
                        refetch();
                    }}
                />
            )}

            {deleteModalTask && (
                <ConfirmDeleteModal
                    title="Delete Task"
                    message={`Are you sure you want to delete "${deleteModalTask.taskTitle}"? This action cannot be undone.`}
                    isLoading={isDeleting}
                    onConfirm={handleDeleteTask}
                    onCancel={() => setDeleteModalTask(null)}
                />
            )}

            {showBulkDeleteModal && (
                <ConfirmDeleteModal
                    title="Delete Multiple Tasks"
                    message={`Are you sure you want to delete ${selectedTasks.length} tasks? This action cannot be undone.`}
                    isLoading={isBulkDeleting}
                    onConfirm={handleBulkDelete}
                    onCancel={() => setShowBulkDeleteModal(false)}
                />
            )}
        </div>
    );
};

export default AdminTasksDashboard;