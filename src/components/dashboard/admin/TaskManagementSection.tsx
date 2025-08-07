/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback, useMemo } from 'react';
import { useGetAllTasksQuery, useDeleteTaskAdminMutation, useGetTaskFiltersQuery, useBulkDeleteTasksMutation, useUpdateTaskMutation, } from "@/features/api/taskApi"; // Adjust import path
import { FaBriefcase, FaCheckCircle, FaChevronLeft, FaChevronRight, FaEdit, FaSearch, FaSpinner, FaTools, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';



const TaskManagement = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    status: '',
    priority: '',
    price: '',
    serviceTitle: '',
  });
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  // Open edit mode and preload form data
  const startEditing = (task: { _id: React.SetStateAction<null>; title: any; status: any; priority: any; price: { toString: () => any; }; serviceTitle: any; }) => {
    setEditingTaskId(task._id);
    setEditFormData({
      title: task.title || '',
      status: task.status || '',
      priority: task.priority || '',
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
    } catch (error) {
      console.error('Update failed:', error);
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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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

  // Define priority keys as a union of string literals
  type Priority = 'Urgent' | 'Today' | 'Tommorow';

  // Strongly typed statusClasses object
  const statusClasses: Record<Status, string> = {
    completed: 'bg-green-100 text-green-800',
    'in progress': 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
    requested: 'bg-red-100 text-red-800',
  };

  // Strongly typed priorityClasses object
  const priorityClasses: Record<Priority, string> = {
    Urgent: 'bg-red-100 text-red-800',
    Today: 'bg-yellow-100 text-yellow-800',
    Tommorow: 'bg-green-100 text-green-800',
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
        toast.success("Task deleted succesfully !!")
      } catch (error) {


        console.error('Failed to delete task:', error);
        alert('Failed to delete task. Please try again.');
      }
    }
  }, [deleteTask]);

  const handleBulkDelete = useCallback(async () => {
    if (selectedTasks.length === 0) return;

    if (window.confirm(`Are you sure you want to delete ${selectedTasks.length} tasks?`)) {
      try {
        await bulkDeleteTasks(selectedTasks).unwrap();
        setSelectedTasks([]);
      } catch (error) {
        console.error('Failed to bulk delete tasks:', error);
        alert('Failed to delete tasks. Please try again.');
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

  // Loading state
  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto lg:px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Task Management</h2>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="text-4xl text-blue-500" />
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
    <section className="max-w-7xl mx-auto lg:px-6 py-12">
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
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              filterOptions?.statuses?.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))
            }
          </select>

          {/* Priority Filter */}
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Priority</option>
            {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              filterOptions?.priorities?.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))
            }
          </select>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Category</option>
            {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              filterOptions?.categories?.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))
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
              {isBulkDeleting ? <FaSpinner /> : <FaTrash />}
              Delete Selected
            </button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-xl">
        <table className="min-w-full text-left text-gray-800 table-auto">
          <thead className="bg-gray-100 text-sm uppercase tracking-wide">
            <tr>
              <th className="px-6 py-4">
                <input
                  type="checkbox"
                  checked={tasks.length > 0 && selectedTasks.length === tasks.length}
                  onChange={handleSelectAll}
                  className="rounded"
                />
              </th>
              <th className="px-6 py-4">Task</th>
              <th className="px-6 py-4">Assigned To</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Priority</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="text-sm divide-y divide-gray-100">
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                  <p className="text-lg font-medium">No tasks found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </td>
              </tr>
            ) : (
              tasks.map((task: { _id: any; title: any; client?: any; taskTitle?: any; serviceTitle: any; status: any; priority: any; schedule?: any; price: any; dueTime?: any; }) => (
                <tr
                  key={task._id}
                  className={`hover:bg-gray-50 transition duration-200 ${selectedTasks.includes(task._id) ? 'bg-blue-50' : ''
                    }`}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedTasks.includes(task._id)}
                      onChange={() => handleSelectTask(task._id)}
                      className="rounded"
                    />
                  </td>

                  {/* Title - editable */}
                  <td className="px-6 py-4 font-medium whitespace-normal">
                    {editingTaskId === task._id ? (
                      <input
                        type="text"
                        name="title"
                        value={editFormData.title}
                        onChange={handleChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      task.title
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 relative rounded-full overflow-hidden border shrink-0">
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                          {task.client?.fullName?.charAt(0) || 'U'}
                        </div>
                      </div>
                      <span>{task.client?.fullName || 'Unassigned'}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <FaBriefcase className="text-indigo-500" />
                      <span>{task.taskTitle}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingTaskId === task._id ? (
                      <input
                        type="text"
                        name="serviceTitle"
                        value={editFormData.serviceTitle}
                        onChange={handleChange}
                        className="border rounded px-2 py-1 w-28"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <FaTools className="text-teal-500" />
                        <span>{task.serviceTitle}</span>
                      </div>
                    )}
                  </td>



                  {/* Status - editable select */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingTaskId === task._id ? (
                      <select
                        name="status"
                        value={editFormData.status}
                        onChange={handleChange}
                        className="border rounded px-2 py-1"
                      >
                        <option value="completed">Completed</option>
                        <option value="in progress">In Progress</option>
                        <option value="pending">Pending</option>
                        <option value="requested">Requested</option>
                      </select>
                    ) : (


                      <span
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        className={`inline-block px-5 py-1 text-xs rounded-full font-medium ${statusClasses[task.status] ?? 'bg-gray-100 text-gray-800'
                          }`}
                      >
                        {task.status}
                      </span>
                    )}
                  </td>

                  {/* Priority - editable select */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingTaskId === task._id ? (
                      <select
                        name="priority"
                        value={editFormData.priority}
                        onChange={handleChange}
                        className="border rounded px-2 py-1"
                      >
                        <option value="Urgent">Urgent</option>
                        <option value="Today">Today</option>
                        <option value="Tommorow">Tommorow</option>
                      </select>
                    ) : (

                      <span
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${priorityClasses[task.priority] ?? 'bg-gray-100 text-gray-800'
                          }`}
                      >
                        {task.schedule}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingTaskId === task._id ? (
                      <input
                        type="number"
                        name="price"
                        value={editFormData.price}
                        onChange={handleChange}
                        className="border rounded px-2 py-1 w-24"
                      />
                    ) : (
                      <div className="flex flex-col">
                        <span>${task.price}</span>
                        <span className="text-xs text-gray-500">{task.dueTime}</span>
                      </div>
                    )}
                  </td>


                  {/* Actions */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-4 text-lg">
                      {editingTaskId === task._id ? (
                        <>
                          <button
                            onClick={() => handleSave(task._id)}
                            disabled={isUpdating}
                            className="text-green-600 hover:text-green-800 transition"
                            title="Save"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-red-600 hover:text-red-800 transition"
                            title="Cancel"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(task)}
                            className="text-blue-600 hover:text-blue-800 transition"
                            title="Edit task"
                          >
                            <FaEdit />
                          </button>

                          {task.status !== 'Completed' && (
                            <button
                              className="text-green-600 hover:text-green-800 transition"
                              title="Mark as completed"
                            // Add your mark complete handler here
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
                            {isDeleting ? <FaSpinner /> : <FaTrash />}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
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
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, pagination.totalTasks)} of {pagination.totalTasks} tasks
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
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
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