/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetUserByIdQuery } from "@/features/auth/authApi";
import { FaUser } from "react-icons/fa";
import Image from "next/image";

const CommentItem = ({ comment }: { comment: any }) => {
    const { data: userData, isLoading } = useGetUserByIdQuery(comment.userId?._id);

    return (
        <div className="bg-teal-50 p-4 rounded-lg border border-teal-100 shadow-sm">
            <div className="flex items-center gap-2">
                {isLoading ? (
                    <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                ) : userData?.profilePicture ? (
                        <div className="relative w-10 h-10">
                        <Image
                            src={userData.profilePicture}
                            alt={userData.fullName || "User"}
                            fill
                            className="rounded-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-500  shadow-md">
                        <FaUser className="w-[20px] h-[20px] text-white" />
                    </div>
                )}

                <p className="text-sm text-teal-900 font-medium">
                    {isLoading ? "Loading..." : userData?.fullName || "Unknown User"}:{" "}
                    {comment.message}
                </p>
            </div>

            <p className="text-xs text-gray-500 mt-1">

                
                {new Date(comment.createdAt).toLocaleString()}
            </p>

            {comment.replies?.length > 0 && (
                <div className="mt-2 ml-4 border-l-2 border-teal-200 pl-3 space-y-2">
                    {comment.replies.map((reply: any, ridx: number) => (
                        <div key={ridx} className="text-sm">
                            <p className="text-teal-700 font-medium">
                                {reply.role.toUpperCase()}:{" "}
                                <span className="font-normal">{reply.message}</span>
                            </p>
                            <p className="text-xs text-gray-500">
                                {new Date(reply.createdAt).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentItem;
