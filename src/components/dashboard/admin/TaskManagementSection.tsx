/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
import React, { useState, useCallback, useMemo } from 'react';
import { useGetAllTasksQuery, useDeleteTaskAdminMutation, useGetTaskFiltersQuery, useBulkDeleteTasksMutation, useUpdateTaskMutation, } from "@/features/api/taskApi"; // Adjust import path
import {  FaCheckCircle, FaChevronLeft, FaChevronRight, FaEdit, FaSearch, FaSpinner, FaTools, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';



const TaskManagement = () => {

  const router = useRouter();
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({
    status: '',
    schedule: '',
    serviceId: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    taskTitle: '',
    status: '',
    schedule: '',
    price: '',
    serviceTitle: '',
  });
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  // Open edit mode and preload form data
  const startEditing = (task: { _id: React.SetStateAction<null>; taskTitle: any; status: any; schedule: any; price: { toString: () => any; }; serviceTitle: any; }) => {
    setEditingTaskId(task._id);
    setEditFormData({
      taskTitle: task.taskTitle || '',
      status: task.status || '',
      schedule: task.schedule || '',
      price: task.price?.toString() || '',
      serviceTitle: task.serviceTitle || '',
    });
  };



  // Handle input/select change
  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit the update
  const handleSave = async (taskId: any) => {
    try {
      await updateTask({ taskId, updateData: editFormData }).unwrap();
      setEditingTaskId(null);
      toast.success("Task updated successfully!");
    } catch (error) {
      console.error('Update failed:', error);
      toast.error("Failed to update task.");
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingTaskId(null);
  };
  // Build query parameters
  const queryParams = useMemo(() => ({
    page: currentPage,
    limit: pageSize,
    search: searchTerm,
    ...filters
  }), [currentPage, pageSize, searchTerm, filters]);

  // API hooks
  const { data: tasksData, isLoading, isError, error } = useGetAllTasksQuery(queryParams);
  // @ts-ignore
  const { data: filterOptions } = useGetTaskFiltersQuery();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskAdminMutation();
  const [bulkDeleteTasks, { isLoading: isBulkDeleting }] = useBulkDeleteTasksMutation();

  // Extract data
  const tasks = tasksData?.tasks || [];
  const pagination = tasksData?.pagination || {};

  // Status and priority styling
  // Define status keys as a union of string literals
  type Status = 'completed' | 'in progress' | 'pending' | 'requested';

  // Define schedule keys as a union of string literals (adapted from data)
  type Schedule = 'Flexible' | 'Urgent' | 'Today' | 'Tomorrow';

  // Strongly typed statusClasses object
  const statusClasses: Record<Status, string> = {
    completed: 'bg-green-100 text-green-800',
    'in progress': 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
    requested: 'bg-red-100 text-red-800',
  };

  // Strongly typed scheduleClasses object (adapted for schedule)
  const scheduleClasses: Record<Schedule, string> = {
    Flexible: 'bg-green-100 text-green-800',
    Urgent: 'bg-red-100 text-red-800',
    Today: 'bg-yellow-100 text-yellow-800',
    Tomorrow: 'bg-blue-100 text-blue-800',
  };


  // Handlers
  const handleSearch = useCallback((e: { target: { value: React.SetStateAction<string>; }; }) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  }, []);

  const handleFilterChange = useCallback((filterName: any, value: any) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  }, []);

  const handlePageChange = useCallback((newPage: React.SetStateAction<number>) => {
    setCurrentPage(newPage);
  }, []);

  const handleDeleteTask = useCallback(async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId).unwrap();
        // Remove from selected tasks if it was selected
        setSelectedTasks(prev => prev.filter(id => id !== taskId));
        toast.success("Task deleted successfully!");
      } catch (error) {
        console.error('Failed to delete task:', error);
        toast.error('Failed to delete task. Please try again.');
      }
    }
  }, [deleteTask]);

  const handleBulkDelete = useCallback(async () => {
    if (selectedTasks.length === 0) return;

    if (window.confirm(`Are you sure you want to delete ${selectedTasks.length} tasks?`)) {
      try {
        await bulkDeleteTasks(selectedTasks).unwrap();
        setSelectedTasks([]);
        toast.success("Selected tasks deleted successfully!");
      } catch (error) {
        console.error('Failed to bulk delete tasks:', error);
        toast.error('Failed to delete tasks. Please try again.');
      }
    }
  }, [selectedTasks, bulkDeleteTasks]);

  const handleSelectTask = useCallback((taskId: string) => {
    setSelectedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  }, []);


  const handleSelectAll = useCallback(() => {
    if (selectedTasks.length === tasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(tasks.map((task: { _id: any; }) => task._id));
    }
  }, [selectedTasks.length, tasks]);

  const handleMarkComplete = useCallback(async (taskId: string) => {
    try {
      await updateTask({ taskId, updateData: { status: 'completed' } }).unwrap();
      toast.success("Task marked as completed!");
    } catch (error) {
      console.error('Failed to mark as completed:', error);
      toast.error('Failed to mark task as completed.');
    }
  }, [updateTask]);

  // Loading state
  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto lg:px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Task Management</h2>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="text-4xl text-blue-500 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (isError) {
    return (
      <section className="max-w-7xl mx-auto lg:px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Task Management</h2>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center text-red-600">
            <p className="text-lg font-medium">Error loading tasks</p>

            <p className="text-sm">
              {'status' in (error || {})
                ? (error as any)?.data?.message || 'Something went wrong'
                : (error as any)?.message || 'Something went wrong'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  console.log(tasks)

  return (
    <section className=" mx-auto lg:px-6 py-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Task Management</h2>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-xl mb-6 p-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 min-w-64">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            {
              // @ts-ignore
              filterOptions?.statuses?.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))
            }
          </select>

          {/* Schedule Filter (adapted from priority) */}
          <select
            value={filters.schedule}
            onChange={(e) => handleFilterChange('schedule', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Schedules</option>
            {
              // @ts-ignore
              filterOptions?.schedules?.map((schedule) => (
                <option key={schedule} value={schedule}>
                  {schedule}
                </option>
              )) || (
                <>
                  <option value="Flexible">Flexible</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Today">Today</option>
                  <option value="Tomorrow">Tomorrow</option>
                </>
              )
            }
          </select>

          {/* Service Filter (adapted from category) */}
          <select
            value={filters.serviceId}
            onChange={(e) => handleFilterChange('serviceId', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Services</option>
            {
              // @ts-ignore
              filterOptions?.services?.map((service) => (
                <option key={service.serviceId} value={service.serviceId}>
                  {service.serviceTitle}
                </option>
              )) || (
                <>
                  <option value="handyMan">Handyman</option>
                </>
              )
            }
          </select>

        </div>

        {/* Bulk Actions */}
        {selectedTasks.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedTasks.length} task(s) selected
            </span>
            <button
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isBulkDeleting ? <FaSpinner className="animate-spin" /> : <FaTrash />}
              Delete Selected
            </button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-xl">
        <table className="min-w-full text-left text-gray-800 table-auto">
          <thead className="bg-gray-100 text-sm uppercase tracking-wide">
            <tr>
              <th className="w-4 px-2 py-4">
                <input
                  type="checkbox"
                  checked={tasks.length > 0 && selectedTasks.length === tasks.length}
                  onChange={handleSelectAll}
                  className="rounded"
                />
              </th>
              <th className="w-48 px-3 py-4">Task</th>
              <th className="w-32 px-3 py-4">Client</th>
              <th className="w-32 px-3 py-4">Service</th>
              <th className="w-24 px-3 py-4">Status</th>
              <th className="w-24 px-3 py-4">Schedule</th>
              <th className="w-20 px-3 py-4">Price</th>
              <th className="w-24 px-3 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="text-sm divide-y divide-gray-100">
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  <p className="text-lg font-medium">No tasks found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </td>
              </tr>
            ) : (
              tasks.map((task: { _id: any; taskTitle: any; client?: any; taskDescription?: any; additionalInfo?: any; serviceTitle: any; status: any; schedule?: any; price: any; estimatedTime?: any; comments?: any; photos?: any; location?: any; acceptedBy?: any; }) => {
                const description = task.taskDescription || task.additionalInfo || '';
                return (
                  <tr
                    key={task._id}
                    className={`hover:bg-gray-50 transition duration-200 ${selectedTasks.includes(task._id) ? 'bg-blue-50' : ''
                      }`}
                  >
                    <td className="px-2 py-4">
                      <input
                        type="checkbox"
                        checked={selectedTasks.includes(task._id)}
                        onChange={() => handleSelectTask(task._id)}
                        className="rounded"
                      />
                    </td>

                    {/* Task - condensed with tooltip for full desc */}
                    <td className="px-3 py-4 max-w-[192px]">
                      {editingTaskId === task._id ? (
                        <input
                          type="text"
                          name="taskTitle"
                          value={editFormData.taskTitle}
                          onChange={handleChange}
                          className="border rounded px-2 py-1 w-full text-xs"
                          placeholder="Task title"
                        />
                      ) : (
                        <div className="space-y-1">
                          <div
                            className="font-medium truncate"
                            title={task.taskTitle}
                          >
                            {task.taskTitle}
                          </div>
                          {description && (
                            <div
                              className="text-xs text-gray-500 truncate"
                              title={description}
                            >
                              {description}
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="px-3 py-4">
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 relative rounded-full overflow-hidden border  flex-shrink-0 mt-0.5">
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                            {task.client?.email?.charAt(0)?.toUpperCase() || 'C'}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <span
                            className="block font-medium text-xs truncate max-w-[100px]"
                            title={task.client?.email || 'Unassigned'}
                          >
                            {task.client?.email || 'Unassigned'}
                          </span>
                          {task.acceptedBy && (
                            <span className="text-xs text-gray-500 block truncate" title={`Accepted by: ${task.acceptedBy}`}>
                              {task.acceptedBy}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-4">
                      {editingTaskId === task._id ? (
                        <input
                          type="text"
                          name="serviceTitle"
                          value={editFormData.serviceTitle}
                          onChange={handleChange}
                          className="border rounded px-2 py-1 w-full text-xs"
                        />
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <FaTools className="text-teal-500 flex-shrink-0 text-xs" />
                          <span
                            className="text-xs truncate max-w-[120px]"
                            title={task.serviceTitle}
                          >
                            {task.serviceTitle}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Status - editable select */}
                    <td className="px-3 py-4">
                      {editingTaskId === task._id ? (
                        <select
                          name="status"
                          value={editFormData.status}
                          onChange={handleChange}
                          className="border rounded px-2 py-1 text-xs w-full"
                        >
                          <option value="pending">Pending</option>
                          <option value="in progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="requested">Requested</option>
                        </select>
                      ) : (
                        <span
                          // @ts-ignore
                          className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${statusClasses[task.status as Status] ?? 'bg-gray-100 text-gray-800'
                            }`}
                        >
                          {task.status}
                        </span>
                      )}
                    </td>

                    {/* Schedule - editable select (adapted from priority) */}
                    <td className="px-3 py-4">
                      {editingTaskId === task._id ? (
                        <select
                          name="schedule"
                          value={editFormData.schedule}
                          onChange={handleChange}
                          className="border rounded px-2 py-1 text-xs w-full"
                        >
                          <option value="Flexible">Flexible</option>
                          <option value="Urgent">Urgent</option>
                          <option value="Today">Today</option>
                          <option value="Tomorrow">Tomorrow</option>
                        </select>
                      ) : (
                        <span
                          // @ts-ignore
                          className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${scheduleClasses[task.schedule as Schedule] ?? 'bg-gray-100 text-gray-800'
                            }`}
                        >
                          {task.schedule}
                        </span>
                      )}
                    </td>

                    <td className="px-3 py-4">
                      {editingTaskId === task._id ? (
                        <input
                          type="number"
                          name="price"
                          value={editFormData.price}
                          onChange={handleChange}
                          className="border rounded px-2 py-1 w-full text-xs"
                          min="0"
                        />
                      ) : (
                        <div className="text-xs space-y-0.5">
                          <span className="font-medium block">${task.price}</span>
                          <span className="text-gray-500">{task.estimatedTime ? `${task.estimatedTime}h` : 'N/A'}</span>
                        </div>
                      )}
                    </td>


                    {/* Actions */}
                    <td className="px-3 py-4 text-center">
                      <div className="flex justify-center gap-1.5 text-sm">
                        {editingTaskId === task._id ? (
                          <>
                            <button
                              onClick={() => handleSave(task._id)}
                              disabled={isUpdating}
                              className="text-green-600 hover:text-green-800 transition disabled:opacity-50"
                              title="Save"
                            >
                              <FaCheckCircle />
                            </button>
                            <button
                              onClick={handleCancel}
                              className="text-red-600 hover:text-red-800 transition"
                              title="Cancel"
                            >
                              <FaEdit className="rotate-180" />
                            </button>
                          </>
                        ) : (
                          <>
                              <button
                                onClick={() => router.push(`/dashboard/admin/tasks/${task._id}`)}
                                className="text-blue-600 hover:text-blue-800 transition"
                                title="Edit task"
                              >
                                <FaEdit />
                              </button>

                            {task.status !== 'completed' && (
                              <button
                                onClick={() => handleMarkComplete(task._id)}
                                className="text-green-600 hover:text-green-800 transition"
                                title="Mark as completed"
                                disabled={isUpdating}
                              >
                                <FaCheckCircle />
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteTask(task._id)}
                              disabled={isDeleting}
                              className="text-red-600 hover:text-red-800 transition disabled:opacity-50"
                              title="Delete task"
                            >
                              {isDeleting ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                            </button>
                          </>
                        )}
                        {(task.comments?.length > 0 || task.photos?.length > 0) && (
                          <div className="flex gap-0.5 ml-1">
                            {task.comments?.length > 0 && (
                              <span className="text-xs text-gray-500" title={`Comments: ${task.comments.length}`}>
                                💬{task.comments.length}
                              </span>
                            )}
                            {task.photos?.length > 0 && (
                              <span className="text-xs text-gray-500" title={`Photos: ${task.photos.length}`}>
                                📷{task.photos.length}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white rounded-2xl shadow-xl mt-6 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, pagination.totalTasks || 0)} of {pagination.totalTasks || 0} tasks
              </span>

              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <FaChevronLeft />
              </button>

              {/* Page numbers */}
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages || 0) }, (_, i) => {
                  let pageNum;
                  if ((pagination.totalPages || 0) <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= (pagination.totalPages || 0) - 2) {
                    pageNum = (pagination.totalPages || 0) - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 rounded-lg ${pageNum === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TaskManagement;