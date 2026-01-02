// /* eslint-disable react/no-unescaped-entities */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useAcceptBidMutation } from "@/features/api/taskApi";
// import React, { useState } from "react";
// import { toast } from "react-toastify";
// import { FaUser, FaClock, FaCheckCircle, FaStar } from "react-icons/fa";
// import Image from "next/image";
// import { useGetUserByIdQuery } from "@/features/auth/authApi";
// import AcceptBidPaymentModal from "./AcceptBidPaymentModal";
// import Link from "next/link";

// interface BidCardProps {
//     bid: any;
//     taskStatus: string;
//     task: any;
// }

// const BidCard: React.FC<BidCardProps> = ({ bid, taskStatus, task }) => {
//     const [acceptBid, { isLoading: isAccepting }] = useAcceptBidMutation();
//     const { data: taskerResponse, isLoading: isTaskerLoading, error: taskerError } = useGetUserByIdQuery(bid.taskerId);
//     const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

//     const tasker = taskerResponse?.user;

//     const handleAcceptBidClick = () => {
//         setIsPaymentModalOpen(true);
//     };

//     const handlePaymentSuccess = async (paymentIntentId: string) => {
//         try {
//             await acceptBid({
//                 taskId: task._id,
//                 taskerId: bid.taskerId,
//                 paymentIntentId
//             }).unwrap();
//             toast.success("Bid accepted successfully and payment authorized!");
//         } catch (error: any) {
//             console.error("Failed to accept bid:", error);
//             toast.error(error.data?.error || "Failed to accept bid");
//         } finally {
//             setIsPaymentModalOpen(false);
//         }
//     };

//     const formatTime = (dateString: string) => {
//         const date = new Date(dateString);
//         const now = new Date();
//         const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

//         if (diffInHours < 1) return "Just now";
//         if (diffInHours < 24) return `${diffInHours}h ago`;
//         if (diffInHours < 48) return "Yesterday";
//         return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//     };

//     if (isTaskerLoading) {
//         return (
//             <div className="bg-white rounded-lg p-2.5 sm:p-3 animate-pulse">
//                 <div className="flex items-center gap-2">
//                     <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-200" />
//                     <div className="flex-1">
//                         <div className="h-3 bg-gray-200 rounded w-24 mb-1.5" />
//                         <div className="h-2 bg-gray-200 rounded w-16" />
//                     </div>
//                     <div className="h-5 bg-gray-200 rounded w-16" />
//                 </div>
//             </div>
//         );
//     }

//     if (taskerError) {
//         return (
//             <div className="bg-white rounded-lg p-2.5">
//                 <p className="text-xs text-red-500">Error loading tasker</p>
//             </div>
//         );
//     }

//     const taskerName = tasker ? `${tasker.firstName} ${tasker.lastName}` : "Tasker";
//     const initials = tasker?.firstName?.charAt(0)?.toUpperCase() || 'T';

//     return (
//         <>
//             <div className="bg-white rounded-lg border border-gray-100 hover:border-blue-200 p-2.5 sm:p-3 transition-all duration-200 hover:shadow-sm">
//                 {/* Top Row - Avatar, Name, Rating, Time, Price, Accept Button */}
//                 <div className="flex items-center gap-2 sm:gap-3">
//                     {/* Avatar */}
//                     <Link href={`/taskers/${bid.taskerId}`} className="flex-shrink-0 group">
//                         <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-[#109C3D] transition-colors">
//                             {tasker?.profilePicture ? (
//                                 <Image
//                                     src={tasker.profilePicture}
//                                     alt={taskerName}
//                                     width={40}
//                                     height={40}
//                                     className="w-full h-full object-cover"
//                                 />
//                             ) : (
//                                 <div className="w-full h-full bg-gradient-to-br from-[#109C3D] to-[#063A41] flex items-center justify-center">
//                                     <span className="text-white text-xs sm:text-sm font-bold">{initials}</span>
//                                 </div>
//                             )}
//                         </div>
//                     </Link>

//                     {/* Info */}
//                     <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-1.5 flex-wrap">
//                             <Link href={`/taskers/${bid.taskerId}`}>
//                                 <span className="text-xs sm:text-sm font-semibold text-[#063A41] hover:text-[#109C3D] transition-colors">
//                                     {taskerName}
//                                 </span>
//                             </Link>
//                             {tasker?.averageRating && (
//                                 <div className="flex items-center gap-0.5">
//                                     <FaStar className="text-yellow-400 text-[8px] sm:text-[10px]" />
//                                     <span className="text-[10px] sm:text-xs text-gray-500">{tasker.averageRating.toFixed(1)}</span>
//                                 </div>
//                             )}
//                         </div>
//                         <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-400">
//                             <FaClock className="text-[8px] sm:text-[10px]" />
//                             <span>{formatTime(bid.createdAt)}</span>
//                         </div>
//                     </div>

//                     {/* Price */}
//                     <div className="text-right flex-shrink-0">
//                         <span className="text-sm sm:text-base font-bold text-[#109C3D]">
//                             ${bid.offerPrice}
//                         </span>
//                     </div>

//                     {/* Accept Button - Always shows "Accept" text */}
//                     <button
//                         onClick={handleAcceptBidClick}
//                         disabled={taskStatus !== "pending" || isAccepting}
//                         className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-semibold transition-all flex-shrink-0
//                             ${taskStatus === "pending" && !isAccepting
//                                 ? "bg-gradient-to-r from-[#109C3D] to-[#0d8a35] hover:from-[#0d8a35] hover:to-[#0b7a2f] text-white shadow-sm hover:shadow-md"
//                                 : "bg-gray-100 text-gray-400 cursor-not-allowed"
//                             }`}
//                     >
//                         <FaCheckCircle className="text-[10px] sm:text-xs" />
//                         <span>{isAccepting ? "Accepting..." : "Accept"}</span>
//                     </button>
//                 </div>

//                 {/* Message - Always Visible (if exists) */}
//                 {bid.message && (
//                     <div className="mt-2 pt-2 border-t border-gray-50">
//                         <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed line-clamp-2">
//                             "{bid.message}"
//                         </p>
//                     </div>
//                 )}
//             </div>

//             {/* Payment Modal */}
//             <AcceptBidPaymentModal
//                 isOpen={isPaymentModalOpen}
//                 onClose={() => setIsPaymentModalOpen(false)}
//                 onSuccess={handlePaymentSuccess}
//                 bidAmount={bid.offerPrice}
//                 taskTitle={task.taskTitle}
//                 taskerName={taskerName}
//                 taskId={task._id}
//                 taskerId={bid.taskerId}
//             />
//         </>
//     );
// };

// export default BidCard;


/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAcceptBidMutation } from "@/features/api/taskApi";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaClock, FaCheckCircle, FaStar } from "react-icons/fa";
import Image from "next/image";
import { useGetUserByIdQuery } from "@/features/auth/authApi";
import AcceptBidPaymentModal from "./AcceptBidPaymentModal";
import Link from "next/link";
import { checkLoginStatus } from "@/resusable/CheckUser";

interface BidCardProps {
    bid: any;
    taskStatus: string;
    task: any;
}

interface CurrentUser {
    _id?: string;
    id?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    email?: string;
    phone?: string;
    phoneNumber?: string;
    mobileNumber?: string;
}

const BidCard: React.FC<BidCardProps> = ({ bid, taskStatus, task }) => {
    const [acceptBid, { isLoading: isAccepting }] = useAcceptBidMutation();
    const { data: taskerResponse, isLoading: isTaskerLoading, error: taskerError } = useGetUserByIdQuery(bid.taskerId);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    // State for current user from checkLoginStatus
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    const tasker = taskerResponse?.user;

    // Check login status on component mount
    useEffect(() => {
        const fetchUserStatus = async () => {
            try {
                setIsCheckingAuth(true);
                const { isLoggedIn, user } = await checkLoginStatus();
                if (isLoggedIn && user) {
                    setCurrentUser(user);
                } else {
                    setCurrentUser(null);
                }
            } catch (error) {
                console.error("Error checking login status:", error);
                setCurrentUser(null);
            } finally {
                setIsCheckingAuth(false);
            }
        };

        fetchUserStatus();
    }, []);

    const handleAcceptBidClick = async () => {
        // Re-verify login status before opening payment modal
        const { isLoggedIn, user } = await checkLoginStatus();

        if (!isLoggedIn || !user) {
            toast.error("Please log in to accept bids");
            return;
        }

        // Update current user with fresh data
        setCurrentUser(user);
        setIsPaymentModalOpen(true);
    };

    // const handlePaymentSuccess = async (paymentIntentId: string) => {
    //     try {
    //         await acceptBid({
    //             taskId: task._id,
    //             taskerId: bid.taskerId,
    //             paymentIntentId
    //         }).unwrap();
    //         toast.success("Bid accepted successfully and payment authorized!");
    //     } catch (error: any) {
    //         console.error("Failed to accept bid:", error);
    //         toast.error(error.data?.error || "Failed to accept bid");
    //     } finally {
    //         setIsPaymentModalOpen(false);
    //     }
    // };

    // BidCard.tsx

    const handlePaymentSuccess = async (paymentMethodId: string) => {  // ⭐ Renamed parameter
        try {
            await acceptBid({
                taskId: task._id,
                taskerId: bid.taskerId,
                paymentMethodId: paymentMethodId  // ⭐ Changed from paymentIntentId
            }).unwrap();
            toast.success("Bid accepted successfully and payment authorized!");
        } catch (error: any) {
            console.error("Failed to accept bid:", error);
            toast.error(error.data?.message || error.data?.error || "Failed to accept bid");
        } finally {
            setIsPaymentModalOpen(false);
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return "Just now";
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInHours < 48) return "Yesterday";
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    if (isTaskerLoading) {
        return (
            <div className="bg-white rounded-lg p-2.5 sm:p-3 animate-pulse">
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-200" />
                    <div className="flex-1">
                        <div className="h-3 bg-gray-200 rounded w-24 mb-1.5" />
                        <div className="h-2 bg-gray-200 rounded w-16" />
                    </div>
                    <div className="h-5 bg-gray-200 rounded w-16" />
                </div>
            </div>
        );
    }

    if (taskerError) {
        return (
            <div className="bg-white rounded-lg p-2.5">
                <p className="text-xs text-red-500">Error loading tasker</p>
            </div>
        );
    }

    const taskerName = tasker ? `${tasker.firstName} ${tasker.lastName}` : "Tasker";
    const initials = tasker?.firstName?.charAt(0)?.toUpperCase() || 'T';

    // Prepare customer info for payment modal
    const customerInfo = currentUser ? {
        id: currentUser._id || currentUser.id || '',
        name: `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.name || 'Customer',
        email: currentUser.email || '',
        phone: currentUser.phone || currentUser.phoneNumber || currentUser.mobileNumber || ''
    } : undefined;

    return (
        <>
            <div className="bg-white rounded-lg border border-gray-100 hover:border-blue-200 p-2.5 sm:p-3 transition-all duration-200 hover:shadow-sm">
                {/* Top Row - Avatar, Name, Rating, Time, Price, Accept Button */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Avatar */}
                    <Link href={`/taskers/${bid.taskerId}`} className="flex-shrink-0 group">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-[#109C3D] transition-colors">
                            {tasker?.profilePicture ? (
                                <Image
                                    src={tasker.profilePicture}
                                    alt={taskerName}
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-[#109C3D] to-[#063A41] flex items-center justify-center">
                                    <span className="text-white text-xs sm:text-sm font-bold">{initials}</span>
                                </div>
                            )}
                        </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <Link href={`/taskers/${bid.taskerId}`}>
                                <span className="text-xs sm:text-sm font-semibold text-[#063A41] hover:text-[#109C3D] transition-colors">
                                    {taskerName}
                                </span>
                            </Link>
                            {tasker?.averageRating && (
                                <div className="flex items-center gap-0.5">
                                    <FaStar className="text-yellow-400 text-[8px] sm:text-[10px]" />
                                    <span className="text-[10px] sm:text-xs text-gray-500">{tasker.averageRating.toFixed(1)}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-400">
                            <FaClock className="text-[8px] sm:text-[10px]" />
                            <span>{formatTime(bid.createdAt)}</span>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="text-right flex-shrink-0">
                        <span className="text-sm sm:text-base font-bold text-[#109C3D]">
                            ${bid.offerPrice}
                        </span>
                    </div>

                    {/* Accept Button */}
                    <button
                        onClick={handleAcceptBidClick}
                        disabled={taskStatus !== "pending" || isAccepting || isCheckingAuth}
                        className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-semibold transition-all flex-shrink-0
                            ${taskStatus === "pending" && !isAccepting && !isCheckingAuth
                                ? "bg-gradient-to-r from-[#109C3D] to-[#0d8a35] hover:from-[#0d8a35] hover:to-[#0b7a2f] text-white shadow-sm hover:shadow-md"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        <FaCheckCircle className="text-[10px] sm:text-xs" />
                        <span>
                            {isCheckingAuth
                                ? "Loading..."
                                : isAccepting
                                    ? "Accepting..."
                                    : "Accept"
                            }
                        </span>
                    </button>
                </div>

                {/* Message */}
                {bid.message && (
                    <div className="mt-2 pt-2 border-t border-gray-50">
                        <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed line-clamp-2">
                            "{bid.message}"
                        </p>
                    </div>
                )}
            </div>

            {/* Payment Modal with Customer Info */}
            <AcceptBidPaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                onSuccess={handlePaymentSuccess}
                bidAmount={bid.offerPrice}
                taskTitle={task.taskTitle}
                taskerName={taskerName}
                taskId={task._id}
                taskerId={bid.taskerId}
                customerInfo={customerInfo}
            />
        </>
    );
};

export default BidCard;