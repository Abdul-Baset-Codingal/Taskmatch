/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetUserByIdQuery } from "@/features/auth/authApi";
import Image from "next/image";
import { ReactNode } from "react";
import {  FaUser } from "react-icons/fa";

interface CommentCardProps {
    taskId: string;
    comment: {
        userId: ReactNode;
        role: any;
        createdAt: string | number | Date;
        _id: string;
        message: string;
        replies?: Array<{
            role: string;
            message: string;
            createdAt: string;
        }>;
    };
    replyingTo: any;
    replyText: string;
    setReplyingTo: (id: string) => void;
    setReplyText: (text: string) => void;
    handleReplySubmit: (taskId: string, commentId: string, replyText: string) => void;
}

const CommentCard = ({
    taskId,
    comment,
    replyingTo,
    replyText,
    setReplyingTo,
    setReplyText,
    handleReplySubmit
}: CommentCardProps) => {
    const { data: user, isLoading } = useGetUserByIdQuery(comment.userId);

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 xs:p-3">
            <div className="flex items-start justify-between mb-1 xs:mb-2">
                <div className="flex items-center gap-2">
                    {/* Profile Picture or Icon */}
                    {user?.profilePicture ? (
                        <Image
                            src={user.profilePicture}
                            alt={user.fullName || "User"}
                            width={24} // same as w-6
                            height={24} // same as h-6
                            className="rounded-full object-cover"
                        />
                    ) : (
                        <FaUser className="w-6 h-6 text-gray-400" />
                    )}

                    <div>
                        <span className="block text-xs xs:text-sm font-bold text-gray-900 capitalize">
                            {isLoading ? "Loading..." : user?.fullName || "Unknown User"}
                        </span>
                        <span className="block text-[10px] xs:text-xs text-gray-500">
                            {user?.email || ""}
                        </span>
                    </div>
                </div>

                {/* Right: Date */}
                <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                    {new Date(comment.createdAt).toLocaleDateString()}
                </span>
            </div>

            {/* Comment Message */}
            <p className="text-xs xs:text-sm text-gray-700 mb-2 xs:mb-3 break-words leading-relaxed">
                {comment.message}
            </p>

            {/* Replies */}
            {(Array.isArray(comment.replies) && comment.replies.length > 0) && (
                <div className="ml-2 xs:ml-4 space-y-2 border-l-2 border-blue-300 pl-2 xs:pl-3">
                    {comment.replies.map((reply, j) => (
                        <div key={j} className="bg-white rounded-lg p-2 xs:p-3 border border-gray-100">
                            <div className="flex items-start justify-between mb-1">
                                <span className="text-xs font-bold text-gray-700 capitalize">
                                    {reply.role}
                                </span>
                                <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                    {new Date(reply.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-xs text-gray-600 break-words leading-relaxed">
                                {reply.message}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Reply Input */}
            <div className="mt-2 xs:mt-3">
                <div className="flex flex-col xs:flex-row gap-2">
                    <input
                        type="text"
                        value={replyingTo === comment._id ? replyText : ""}
                        onChange={(e) => setReplyText(e.target.value)}
                        onFocus={() => setReplyingTo(comment._id)}
                        className="flex-1 px-2 xs:px-3 py-1.5 xs:py-2 text-xs xs:text-sm border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        placeholder="Write a reply..."
                    />
                    <button
                        onClick={() => handleReplySubmit(taskId, comment._id, replyText)}
                        className="px-3 xs:px-4 py-1.5 xs:py-2 bg-blue-500 text-white text-xs xs:text-sm font-semibold rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
                    >
                        Send Reply
                    </button>
                </div>
            </div>
        </div>
    );
};


export default CommentCard ;




