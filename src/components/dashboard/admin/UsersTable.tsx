/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useRouter } from "next/navigation";
import {
    FaCheck,
    FaEdit,
    FaExclamationTriangle,
    FaFilter,
    FaSpinner,
    FaTrash,
    FaUser,
} from "react-icons/fa";

interface User {
    currentRole: string;
    lastName: string;
    firstName: string;
    isBlocked: any;
    _id: string;
    email: string;
    role: string;
    status: "Active" | "Inactive" | "Suspended";
    createdAt: string;
}

interface UsersTableProps {
    users: User[];
    handleToggleBlock: (id: string, isBlocked: boolean) => void;
    setShowDeleteConfirm: (id: string | null) => void;
    onEditUser?: (user: User) => void;
    formatDate: (date: string) => string;
    isDeleting: boolean;
}

const UsersTable: React.FC<UsersTableProps> = ({
    users,
    handleToggleBlock,
    setShowDeleteConfirm,
    onEditUser,
    formatDate,
    isDeleting,
}) => {
    const router = useRouter();

    const statusColor: Record<User["status"], string> = {
        Active: "bg-green-100 text-green-800 border-green-200",
        Inactive: "bg-gray-100 text-gray-800 border-gray-200",
        Suspended: "bg-red-100 text-red-800 border-red-200",
    };

    const getRoleClassName = (role: string) => {
        if (role === 'tasker') {
            return 'color2 text-white';
        } else if (role === 'client') {
            return 'color1 text-white';
        }
        return 'bg-gray-100 text-gray-800';
    };

    const handleEditUser = (user: User) => {
        if (onEditUser) {
            onEditUser(user);
        }
        router.push(`/dashboard/admin/users/${user._id}`);
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-white/50">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gradient-to-r from-color1 to-color2 text-white">
                        <tr>
                            <th className="px-6 py-4 text-left font-semibold uppercase text-xs tracking-wider">
                                Profile
                            </th>
                            <th className="px-6 py-4 text-left font-semibold uppercase text-xs tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-4 text-left font-semibold uppercase text-xs tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-4 text-left font-semibold uppercase text-xs tracking-wider">
                                User ID
                            </th>
                            <th className="px-6 py-4 text-left font-semibold uppercase text-xs tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-4 text-left font-semibold uppercase text-xs tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left font-semibold uppercase text-xs tracking-wider">
                                Joined
                            </th>
                            <th className="px-6 py-4 text-center font-semibold uppercase text-xs tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                                    <div className="flex flex-col items-center space-y-4">
                                        <FaFilter className="text-6xl text-color3 mb-4" />
                                        <h3 className="text-xl font-semibold text1">No users found</h3>
                                        <p className="text-gray-500">Try adjusting your search criteria</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            users.map((user: User) => (
                                <tr
                                    key={user._id}
                                    className="hover:bg-color3 transition duration-200"
                                >
                                    <td className="px-6 py-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-color1 to-color2 flex items-center justify-center overflow-hidden">
                                            <FaUser className="w-6 h-6 text-white" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-900">
                                        {user.firstName} {user.lastName}
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        <div className="truncate max-w-xs">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                                            {user._id.slice(-6).toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-3 py-1 text-xs rounded-full font-semibold ${getRoleClassName(user.currentRole)}`}>
                                            {user.currentRole}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${statusColor[user.status] || statusColor.Active
                                                }`}
                                        >
                                            {user.status || "Active"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">
                                        {formatDate(user.createdAt)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => handleEditUser(user)}
                                                className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-full transition"
                                                title="Edit User"
                                            >
                                                <FaEdit className="w-4 h-4" />
                                            </button>
                                            {user?.isBlocked ? (
                                                <button
                                                    onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                                                    className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-full transition"
                                                    title="Unblock User"
                                                >
                                                    <FaCheck className="w-4 h-4" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                                                    className="p-2 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-full transition"
                                                    title="Block User"
                                                >
                                                    <FaExclamationTriangle className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => setShowDeleteConfirm(user._id)}
                                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition"
                                                title="Delete User"
                                                disabled={isDeleting}
                                            >
                                                {isDeleting ? (
                                                    <FaSpinner className="animate-spin w-4 h-4" />
                                                ) : (
                                                    <FaTrash className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersTable;