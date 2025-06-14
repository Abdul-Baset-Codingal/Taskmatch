"use client";

import React from "react";
import Image from "next/image";
import {
  FaEdit,
  FaTrash,
  FaExclamationTriangle,
  FaCheck,
} from "react-icons/fa";

type UserStatus = "Active" | "Inactive" | "Suspended";

interface User {
  name: string;
  email: string;
  id: string;
  role: string;
  status: UserStatus;
  joined: string;
  image: string;
}

const users: User[] = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    id: "USR-8294",
    role: "Tasker",
    status: "Active",
    joined: "Apr 15, 2024",
    image: "/Images/clientImage1.jpg",
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    id: "USR-7845",
    role: "Client",
    status: "Active",
    joined: "Mar 22, 2024",
    image: "/Images/clientImage2.jpg",
  },
  {
    name: "Michael Robertson",
    email: "michael.r@example.com",
    id: "USR-5623",
    role: "Admin",
    status: "Active",
    joined: "Jan 10, 2024",
    image: "/Images/clientImage3.jpg",
  },
  {
    name: "David Clark",
    email: "david.c@example.com",
    id: "USR-9102",
    role: "Tasker",
    status: "Suspended",
    joined: "Feb 28, 2024",
    image: "/Images/clientImage4.jpg",
  },
  {
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    id: "USR-3478",
    role: "Client",
    status: "Inactive",
    joined: "Apr 05, 2024",
    image: "/Images/clientImage5.jpg",
  },
];

const statusColor: Record<UserStatus, string> = {
  Active: "text-green-600 bg-green-100",
  Inactive: "text-gray-600 bg-gray-200",
  Suspended: "text-red-600 bg-red-100",
};

const UserManagementTable = () => {
  return (
    <section className="max-w-7xl mx-auto lg:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">User Management</h2>
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
            {users.map((user, i) => (
              <tr
                key={i}
                className="border-b hover:bg-gray-50 transition duration-200"
              >
                <td className="px-6 py-4">
                  <div className="w-12 h-12 relative">
                    <Image
                      src={user.image}
                      alt={user.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 font-medium">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.id}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      statusColor[user.status]
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4">{user.joined}</td>
                <td className="px-6 py-4 flex gap-3 justify-center items-center text-lg">
                  <button className="text-indigo-600 hover:text-indigo-800">
                    <FaEdit />
                  </button>
                  {user.status === "Suspended" ? (
                    <button className="text-green-600 hover:text-green-800">
                      <FaCheck />
                    </button>
                  ) : (
                    <button className="text-yellow-500 hover:text-yellow-600">
                      <FaExclamationTriangle />
                    </button>
                  )}
                  <button className="text-red-600 hover:text-red-800">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default UserManagementTable;
