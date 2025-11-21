/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
"use client";

import React, {  useState } from "react";
import { FaSpinner, FaSearch } from "react-icons/fa";
import { useGetAllUsersQuery, useDeleteUserMutation, useBlockUserMutation } from "@/features/auth/authApi"; // Adjust import path
import { toast } from "react-toastify";
import UsersTable from "./UsersTable";

type UserStatus = "Active" | "Inactive" | "Suspended";

interface User {
  lastName: string;
  firstName: string;
  isBlocked: any;
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

const UserManagementTable: React.FC<UserManagementTableProps> = ({ onEditUser }) => {
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

  console.log(usersResponse);

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [blockUser] = useBlockUserMutation();

  const users = usersResponse?.users || [];
  const totalUsers = usersResponse?.pagination?.totalUsers || 0;
  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  // Handle delete user
  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId).unwrap();
      setShowDeleteConfirm(null);
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const handleToggleBlock = async (userId: string, currentStatus: any) => {
    try {
      const shouldBlock = !currentStatus;
      await blockUser({ id: userId, block: shouldBlock }).unwrap();
      toast.success("Status updated successfully");
    } catch (err) {
      console.error("Error blocking/unblocking user", err);
      toast.error("Failed to update status");
    }
  };

  console.log(users);

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
        <div className="text-center">
          <FaSpinner className="animate-spin mx-auto text-4xl text-color1 mb-4" />
          <span className="text-lg text-gray-600">Loading users...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-red-200">
        <div className="max-w-md mx-auto">
          <div className="bg-red-50 rounded-xl p-4 mb-4">
            <FaSpinner className="text-red-500 mx-auto text-4xl mb-2" />
          </div>
          <h3 className="text-xl font-semibold text-color1 mb-2">Error Loading Users</h3>
          <p className="text-gray-600 mb-6">Failed to fetch user data. Please try again.</p>
          <button
            onClick={() => refetch()}
            className="bg-color1 text-white px-6 py-3 rounded-xl hover:bg-opacity-90 transition font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text1">User Management</h2>
          <p className="text-gray-600 mt-1">Manage and monitor user accounts</p>
        </div>
        <div className="text-sm text-gray-600 bg-white/50 px-4 py-2 rounded-xl backdrop-blur-sm">
          Total Users: <span className="font-semibold text2">{totalUsers}</span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-xl border border-white/50 p-6 backdrop-blur-sm">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[250px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-color2 focus:border-transparent transition"
              />
            </div>
          </div>

          <div className="min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-color2 focus:border-transparent"
            >
              <option value="">All Roles</option>
              <option value="client">Client</option>
              <option value="tasker">Tasker</option>
            </select>
          </div>

          <div className="min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Province</label>
            <select
              value={provinceFilter}
              onChange={(e) => setProvinceFilter(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-color2 focus:border-transparent"
            >
              <option value="">All Provinces</option>
              <option value="Dhaka">Dhaka</option>
              <option value="Chittagong">Chittagong</option>
              <option value="Sylhet">Sylhet</option>
              {/* Add more provinces as needed */}
            </select>
          </div>

          <button
            type="submit"
            className="bg-color1 text-white px-6 py-3 rounded-xl hover:bg-opacity-90 transition flex items-center gap-2 font-medium"
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
              className="text-color1 hover:text-color2 transition font-medium underline"
            >
              Clear Filters
            </button>
          )}
        </form>
      </div>

      <UsersTable
        users={users}
        handleToggleBlock={handleToggleBlock}
        setShowDeleteConfirm={setShowDeleteConfirm}
        onEditUser={onEditUser}
        formatDate={formatDate}
        isDeleting={isDeleting}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-white/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-color2"
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
                className="px-4 py-2 bg-color1 text-white rounded-xl hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
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
                      className={`px-4 py-2 rounded-xl transition ${currentPage === pageNumber
                          ? "bg-color2 text-white"
                          : "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
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
                className="px-4 py-2 bg-color1 text-white rounded-xl hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>

            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages} ({totalUsers} total)
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text1 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this user? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(showDeleteConfirm)}
                disabled={isDeleting}
                className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 transition font-medium flex items-center gap-2"
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
        <div className="fixed top-4 right-4 bg-color1 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 backdrop-blur-sm">
          <FaSpinner className="animate-spin" />
          Updating...
        </div>
      )}
    </div>
  );
};

export default UserManagementTable;