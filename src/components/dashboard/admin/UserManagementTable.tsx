/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaExclamationTriangle,
  FaCheck,
  FaSpinner,
  FaSearch,
  FaFilter,
  FaUser,
} from "react-icons/fa";
import { useGetAllUsersQuery, useDeleteUserMutation } from "@/features/auth/authApi"; // Adjust import path

type UserStatus = "Active" | "Inactive" | "Suspended";

interface User {
  fullName: string;
  _id: string;
  name: string;
  email: string;
  id?: string;
  role: string;
  status: UserStatus;
  createdAt: string;
  profileImage?: any;
  province?: string;
}

interface UserManagementTableProps {
  onEditUser?: (user: User) => void;
  onViewUser?: (user: User) => void;
}

const statusColor: Record<UserStatus, string> = {
  Active: "text-green-600 bg-green-100",
  Inactive: "text-gray-600 bg-gray-200",
  Suspended: "text-red-600 bg-red-100",
};

const UserManagementTable: React.FC<UserManagementTableProps> = ({
  onEditUser,
}) => {
  // State for filters and pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // RTK Query hooks
  const {
    data: usersResponse,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllUsersQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    role: roleFilter,
    province: provinceFilter,
  });

  console.log(usersResponse)

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const users = usersResponse?.users || [];
  const totalUsers = usersResponse?.pagination?.totalUsers || 0;
  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  // Handle delete user
  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId).unwrap();
      setShowDeleteConfirm(null);
      // Show success message (you can use a toast library)
      console.log("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      // Show error message
    }
  };

  // Handle status toggle (you might need to add this to your API)
  const handleStatusToggle = (user: User) => {
    // This would require a status update mutation in your API
    console.log("Toggle status for user:", user._id);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
        <span className="ml-2 text-lg">Loading users...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto lg:p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Users</h3>
          <p className="text-red-600 mb-4">Failed to fetch user data. Please try again.</p>
          <button
            onClick={() => refetch()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <div className="text-sm text-gray-600">
          Total Users: <span className="font-semibold">{totalUsers}</span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Roles</option>
            <option value="client">Client</option>
            <option value="tasker">Tasker</option>
          </select>

          <select
            value={provinceFilter}
            onChange={(e) => setProvinceFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Provinces</option>
            <option value="Dhaka">Dhaka</option>
            <option value="Chittagong">Chittagong</option>
            <option value="Sylhet">Sylhet</option>
            {/* Add more provinces as needed */}
          </select>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <FaSearch />
            Search
          </button>

          {(searchTerm || roleFilter || provinceFilter) && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setRoleFilter("");
                setProvinceFilter("");
                setCurrentPage(1);
              }}
              className="text-gray-600 hover:text-gray-800 transition"
            >
              Clear Filters
            </button>
          )}
        </form>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
        <table className="w-full text-left min-w-[900px]">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-4">Profile</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">User ID</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {users.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <FaFilter className="text-4xl text-gray-300 mb-2" />
                    <p className="text-lg">No users found</p>
                    <p className="text-sm">Try adjusting your search criteria</p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user: User) => (
                <tr
                  key={user._id}
                  className="border-b hover:bg-gray-50 transition duration-200"
                >
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-full">
                      <FaUser className="w-6 h-6 text-gray-600" />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">{user?.fullName}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {user.id || user._id.slice(-6).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColor[user.status] || statusColor.Active
                        }`}
                    >
                      {user.status || "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4">{formatDate(user.createdAt)}</td>
                  <td className="px-6 py-4 flex gap-3 justify-center items-center text-lg">
                    <button
                      onClick={() => onEditUser?.(user)}
                      className="text-indigo-600 hover:text-indigo-800 transition"
                      title="Edit User"
                    >
                      <FaEdit />
                    </button>
                    {user.status === "Suspended" ? (
                      <button
                        onClick={() => handleStatusToggle(user)}
                        className="text-green-600 hover:text-green-800 transition"
                        title="Activate User"
                      >
                        <FaCheck />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusToggle(user)}
                        className="text-yellow-500 hover:text-yellow-600 transition"
                        title="Suspend User"
                      >
                        <FaExclamationTriangle />
                      </button>
                    )}
                    <button
                      onClick={() => setShowDeleteConfirm(user._id)}
                      className="text-red-600 hover:text-red-800 transition"
                      title="Delete User"
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaTrash />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-2 py-1"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>per page</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || isFetching}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = Math.max(1, currentPage - 2) + i;
                if (pageNumber > totalPages) return null;

                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    disabled={isFetching}
                    className={`px-3 py-1 border rounded ${currentPage === pageNumber
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 hover:bg-gray-50"
                      } disabled:opacity-50`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || isFetching}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>

          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages} ({totalUsers} total)
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(showDeleteConfirm)}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete User"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading overlay for refetching */}
      {isFetching && !isLoading && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <FaSpinner className="animate-spin" />
          Updating...
        </div>
      )}
    </section>
  );
};

export default UserManagementTable;