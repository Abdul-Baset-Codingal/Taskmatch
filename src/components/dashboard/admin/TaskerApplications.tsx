/* eslint-disable @typescript-eslint/no-explicit-any */
// components/dashboard/admin/TaskerApplications.tsx
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FaUserCheck, FaClock, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEye } from 'react-icons/fa';

interface TaskerApplication {
    profilePicture: any;
    _id: string;
    firstName: string; 
    lastName: string; 
    email: string;
    phone: string;
    postalCode: string;
    createdAt: string;
    qualifications: string[];
    skills: string[];
}

interface TaskerApplicationsProps {
    applications: TaskerApplication[];
    onApprove: (userId: string) => void;
    onReject: (userId: string) => void;
}

const TaskerApplications: React.FC<TaskerApplicationsProps> = ({
    applications,
}) => {
    const router = useRouter();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleViewDetails = (applicationId: string) => {
        // Navigate to application details page
        router.push(`/dashboard/admin/users/${applicationId}`);
    };

    if (!applications || applications.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
                <FaUserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Pending Applications</h3>
                <p className="text-gray-500">There are no tasker applications under review at the moment.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-bold">{applications.length}</h3>
                        <p className="text-yellow-100">Pending Tasker Applications</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-xl">
                        <FaClock className="w-8 h-8" />
                    </div>
                </div>
                <p className="text-yellow-100 text-sm mt-2">
                    These applications require your review and approval
                </p>
            </div>

            {/* Applications Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Applicant
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Contact Info
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Qualifications
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Skills
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Applied Date
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {applications.map((application) => (
                                <tr
                                    key={application._id}
                                    className="hover:bg-gray-50 transition-colors duration-150"
                                >
                                    {/* Applicant */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
                                                {application.profilePicture ? (
                                                    <Image
                                                        src={application.profilePicture}
                                                        alt="Profile"
                                                        width={40}
                                                        height={40}
                                                        className="object-cover w-full h-full"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-color1 text-white font-semibold text-sm">
                                                        {application.firstName[0]}
                                                        {application.lastName[0]}
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <div className="font-semibold text-gray-900">
                                                    {application.firstName} {application.lastName}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Contact Info */}
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <FaEnvelope className="w-3 h-3 text-blue-500" />
                                                <span className="truncate max-w-[150px]">{application.email}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <FaPhone className="w-3 h-3 text-green-500" />
                                                <span>{application.phone}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <FaMapMarkerAlt className="w-3 h-3 text-red-500" />
                                                <span>{application.postalCode}</span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Qualifications */}
                                    <td className="px-6 py-4">
                                        {application.qualifications && application.qualifications.length > 0 ? (
                                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                {application.qualifications.slice(0, 3).map((qualification, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                                                    >
                                                        {qualification}
                                                    </span>
                                                ))}
                                                {application.qualifications.length > 3 && (
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                                        +{application.qualifications.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-gray-500 text-sm">None</span>
                                        )}
                                    </td>

                                    {/* Skills */}
                                    <td className="px-6 py-4">
                                        {application.skills && application.skills.length > 0 ? (
                                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                {application.skills.slice(0, 3).map((skill, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                                {application.skills.length > 3 && (
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                                        +{application.skills.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-gray-500 text-sm">None</span>
                                        )}
                                    </td>

                                    {/* Applied Date */}
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {formatDate(application.createdAt)}
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                                            Under Review
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleViewDetails(application._id)}
                                            className="flex items-center space-x-2 px-4 py-2 color1 text-white rounded-lg font-medium transition-colors duration-200"
                                        >
                                            <FaEye className="w-4 h-4" />
                                            <span>View Details</span>
                                        </button>
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

export default TaskerApplications;