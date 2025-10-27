/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useRouter } from 'next/navigation';
import { FaCheck, FaEdit, FaExclamationTriangle, FaFilter, FaSpinner, FaTrash, FaUser } from 'react-icons/fa';

interface User {
    lastName: React.ReactNode;
    firstName: React.ReactNode;
    isBlocked: any;
    _id: string;
    email: string;
    role: string;
    status: 'Active' | 'Inactive' | 'Suspended';
    createdAt: string;
}

interface UsersTableProps {
    users: User[];
    handleToggleBlock: (id: string, isBlocked: boolean) => void;
    setShowDeleteConfirm: (id: string) => void;
    formatDate: (date: string) => string;
    isDeleting: boolean;
}

const UsersTable: React.FC<UsersTableProps> = ({ users, handleToggleBlock, setShowDeleteConfirm, formatDate, isDeleting }) => {
    const router = useRouter();

    const statusColor: Record<User['status'], string> = {
        Active: 'text-green-600 bg-green-100',
        Inactive: 'text-gray-600 bg-gray-200',
        Suspended: 'text-red-600 bg-red-100',
    };

    const handleEditUser = (user: User) => {
        router.push(`/dashboard/admin/users/${user._id}`);
    };

    return (
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
                                <td className="px-6 py-4 font-medium">{user?.firstName} {user?.lastName}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                        {user._id.slice(-6).toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColor[user.status] || statusColor.Active}`}
                                    >
                                        {user.status || 'Active'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{formatDate(user.createdAt)}</td>
                                <td className="px-6 py-4 flex gap-3 justify-center items-center text-lg">
                                    <button
                                        onClick={() => handleEditUser(user)}
                                        className="text-indigo-600 hover:text-indigo-800 transition"
                                        title="Edit User"
                                    >
                                        <FaEdit />
                                    </button>
                                    {user?.isBlocked ? (
                                        <button
                                            onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                                            className="text-green-600 hover:text-green-800 transition"
                                            title="Unblock User"
                                        >
                                            <FaCheck />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                                            className="text-yellow-500 hover:text-yellow-600 transition"
                                            title="Block User"
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
    );
};

export default UsersTable;