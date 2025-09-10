/* eslint-disable @typescript-eslint/no-explicit-any */
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useState } from "react";
import { useGetUserByIdQuery } from "@/features/auth/authApi";
import Image from "next/image";

export default function CommentsSection({ comments }: { comments: any[] }) {
    const [showComments, setShowComments] = useState(false);

    return (
        <div className="mt-6">
            {/* Toggle */}
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setShowComments(!showComments)}
            >
                <h4 className="font-semibold text-gray-800">Comments</h4>
                {showComments ? (
                    <FaChevronUp className="text-gray-600" />
                ) : (
                    <FaChevronDown className="text-gray-600" />
                )}
            </div>

            {showComments && (
                <>
                    {comments?.length > 0 ? (
                        <div className="mt-2 space-y-4">
                            {comments.map((comment) => (
                                <CommentItem key={comment._id} comment={comment} />
                            ))}
                        </div>
                    ) : (
                        <p className="mt-2 text-gray-500 italic">No comments yet.</p>
                    )}
                </>
            )}
        </div>
    );
}

function CommentItem({ comment }: { comment: any }) {
    const { data: user, isLoading } = useGetUserByIdQuery(comment?.userId, {
        skip: !comment?.userId
    });
    console.log(user)
    console.log(comment)

    return (
        <div className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-start gap-3">
                {/* Profile Picture */}
                {isLoading ? (
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                ) : (
                        <Image
                            src={user?.profilePicture ?? "/default-avatar.png"}
                            alt={user?.fullName ?? "User"}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                )}

                {/* Comment Content */}
                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">
                            {isLoading ? "Loading..." : user?.fullName || "Unknown User"}
                        </span>
                        <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                    </div>
                    <p className="text-gray-600 mt-1">{comment.message}</p>
                </div>
            </div>
        </div>
    );
}
