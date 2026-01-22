import { useEffect, useState } from "react";
import { checkLoginStatus } from "@/resusable/CheckUser";
import { ClientDashboardStats } from "./ClientDashboardStats";
import { ClientTaskOverview } from "./ClientTaskOverview";
import { ClientTaskCalendar } from "./ClientTaskCalender";
import { ClientRecentQuotes } from "./ClientRequestQuotes";
import { ClientUpcomingBookings } from "./ClientUpcomingBookings";
import { ClientProductivityChart } from "./ClientProductivityChart";
import { useGetTasksByClientQuery } from "@/features/api/taskApi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
    FaTasks,
    FaArrowRight,
    FaPlus,
    FaCalendarAlt,
    FaClipboardList,
    FaCheckCircle,
    FaClock,
    FaExclamationCircle,
    FaLightbulb,
    FaRocket,
    FaBell,
    FaHandshake,
    FaStar,
    FaChartLine,
    FaExchangeAlt,
    FaUser,
    FaBriefcase,
} from "react-icons/fa";
import Link from "next/link";

interface ClientDashboardContentProps {
    setActiveItem: (item: string) => void;
}

export function ClientDashboardContent({ setActiveItem }: ClientDashboardContentProps) {
    const [user, setUser] = useState<any>(null);
    const [isSwitching, setIsSwitching] = useState(false);
    const router = useRouter();

    // @ts-ignore
    const { data: clientTasks = [], isLoading } = useGetTasksByClientQuery();

    const fetchUser = async () => {
        const { isLoggedIn, user } = await checkLoginStatus();
        if (isLoggedIn) setUser(user);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    // Check if user has both roles
    const hasBothRoles = user?.roles?.includes("client") && user?.roles?.includes("tasker");
    const currentRole = user?.currentRole || "client";
    const taskerProfileCheck = user?.taskerProfileCheck || false;

    // Switch role function
    const switchRole = async (newRole: "tasker" | "client") => {
        if (!user?._id) {
            toast.error("User ID not found.");
            return;
        }

        if (currentRole === newRole) {
            toast.info(`You're already in ${newRole === "client" ? "Booker" : "Tasker"} mode.`);
            return;
        }

        // Check if tasker profile is complete when switching to tasker
        if (newRole === "tasker" && !taskerProfileCheck) {
            toast.info("Complete your Tasker profile first to unlock this mode.");
            router.push("/complete-tasker-profile");
            return;
        }

        setIsSwitching(true);

        try {
            const response = await fetch(
                `/api/auth/users/${user._id}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ role: newRole }),
                    credentials: "include",
                }
            );

            if (response.ok) {
                toast.success(`Switched to ${newRole === "client" ? "Booker" : "Tasker"} mode!`);

                // Redirect to appropriate dashboard
                if (newRole === "tasker") {
                    router.push("/dashboard/tasker");
                } else {
                    // Refresh current page data
                    await fetchUser();
                }
            } else {
                const errorData = await response.json().catch(() => ({}));

                if (errorData.missingFields && newRole === "tasker") {
                    const fieldsQuery = errorData.missingFields.join(",");
                    toast.error("Tasker profile incomplete. Please complete the required fields.");
                    router.push(`/complete-tasker-profile?fields=${fieldsQuery}`);
                } else {
                    toast.error(errorData.message || `Failed to switch to ${newRole} mode.`);
                }
            }
        } catch (error) {
            console.error("Switch role failed", error);
            toast.error("An error occurred while switching roles.");
        } finally {
            setIsSwitching(false);
        }
    };

    // Get greeting based on time of day
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";
        return "Good evening";
    };

    // Calculate task statistics
    const taskStats = {
        total: clientTasks.length,
        pending: clientTasks.filter((t: any) => t.status === "pending").length,
        active: clientTasks.filter((t: any) => t.status === "in progress").length,
        completed: clientTasks.filter((t: any) => t.status === "completed").length,
        requested: clientTasks.filter((t: any) => t.status === "requested").length,
        withBids: clientTasks.filter((t: any) => t.bids && t.bids.length > 0).length,
    };

    // Check if user is new (no tasks yet)
    const isNewUser = taskStats.total === 0;

    // Get tasks needing attention
    const tasksNeedingAttention = clientTasks.filter(
        (t: any) => t.status === "requested" || (t.bids && t.bids.length > 0 && t.status === "pending")
    );

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    return (
        <div className="space-y-8 pb-12">
            {/* Role Switcher Banner - Show if user has both roles OR can become a tasker */}
            {/* {(hasBothRoles || (user && !user.roles?.includes("tasker"))) && (
                <div className={`border rounded-2xl p-4 sm:p-5 ${hasBothRoles
                        ? "bg-gradient-to-r from-[#E5FFDB] to-[#d4f5c7] border-[#109C3D]/20"
                        : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
                    }`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${hasBothRoles ? "bg-[#109C3D]" : "bg-blue-500"
                                }`}>
                                <FaExchangeAlt className="text-white text-xl" />
                            </div>
                            <div>
                                {hasBothRoles ? (
                                    <>
                                        <h3 className="font-semibold text-[#063A41]">
                                            You're in <span className="text-[#109C3D]">Booker</span> Mode
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-0.5">
                                            Switch to Tasker mode to find work and earn money
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="font-semibold text-[#063A41]">
                                            Want to Earn Money? 💰
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-0.5">
                                            Become a Tasker and start offering your services
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {hasBothRoles ? (
                                <>
                                    <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200">
                                        <button
                                            onClick={() => switchRole("client")}
                                            disabled={isSwitching}
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${currentRole === "client"
                                                    ? "bg-[#109C3D] text-white shadow-md"
                                                    : "text-gray-600 hover:bg-gray-100"
                                                }`}
                                        >
                                            <FaUser className="text-sm" />
                                            <span>Booker</span>
                                            {currentRole === "client" && (
                                                <FaCheckCircle className="text-xs" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => switchRole("tasker")}
                                            disabled={isSwitching}
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${currentRole === "tasker"
                                                    ? "bg-[#109C3D] text-white shadow-md"
                                                    : "text-gray-600 hover:bg-gray-100"
                                                }`}
                                        >
                                            <FaBriefcase className="text-sm" />
                                            <span>Tasker</span>
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => switchRole("tasker")}
                                        disabled={isSwitching}
                                        className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-[#063A41] text-white font-medium rounded-xl hover:bg-[#052e33] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSwitching ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>Switching...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Switch to Tasker</span>
                                                <FaArrowRight className="text-sm" />
                                            </>
                                        )}
                                    </button>
                                </>
                            ) : (
                                <Link href="/complete-tasker-profile">
                                    <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors">
                                        <FaPlus className="text-sm" />
                                        <span>Become a Tasker</span>
                                        <FaArrowRight className="text-sm" />
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )} */}

            {/* <div className="bg-gradient-to-br from-[#063A41] via-[#0a4a52] to-[#063A41] rounded-3xl p-6 sm:p-8 lg:p-10 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#109C3D] rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
                </div>

                <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm">
                                    <span className="w-2 h-2 bg-[#109C3D] rounded-full animate-pulse" />
                                    <span className="text-white/90">{today}</span>
                                </div>

                                {hasBothRoles && (
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#109C3D]/20 backdrop-blur-sm rounded-full text-sm">
                                        <FaUser className="text-[#109C3D] text-xs" />
                                        <span className="text-white font-medium">Booker Mode</span>
                                    </div>
                                )}
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                                {getGreeting()}, {user?.firstName || "there"}! 👋
                            </h1>

                            <p className="text-lg text-white/80 max-w-xl">
                                {isNewUser
                                    ? "Welcome to Taskallo! Ready to get things done? Post your first task and connect with skilled taskers."
                                    : tasksNeedingAttention.length > 0
                                        ? `You have ${tasksNeedingAttention.length} task${tasksNeedingAttention.length > 1 ? 's' : ''} that need${tasksNeedingAttention.length === 1 ? 's' : ''} your attention.`
                                        : "Your dashboard is up to date. Keep track of your tasks and manage everything in one place."}
                            </p>

                            {!isNewUser && (
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {taskStats.pending > 0 && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 text-amber-200 rounded-full text-sm font-medium">
                                            <FaClock className="text-xs" />
                                            {taskStats.pending} Pending
                                        </span>
                                    )}
                                    {taskStats.active > 0 && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 text-blue-200 rounded-full text-sm font-medium">
                                            <FaRocket className="text-xs" />
                                            {taskStats.active} In Progress
                                        </span>
                                    )}
                                    {taskStats.withBids > 0 && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#109C3D]/20 text-green-200 rounded-full text-sm font-medium">
                                            <FaBell className="text-xs" />
                                            {taskStats.withBids} With Bids
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 lg:min-w-[280px]">
                            <button
                                onClick={() => setActiveItem("All Tasks")}
                                className="group flex items-center justify-between gap-3 px-5 py-4 bg-white text-[#063A41] font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#E5FFDB] rounded-lg flex items-center justify-center">
                                        <FaTasks className="text-[#109C3D]" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold">My Posted Tasks</p>
                                        <p className="text-xs text-gray-500 font-normal">
                                            {taskStats.total} total task{taskStats.total !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>
                                <FaArrowRight className="text-gray-400 group-hover:text-[#109C3D] group-hover:translate-x-1 transition-all" />
                            </button>

                            <Link href="/urgent-task?search=general%20service" className="w-full">
                                <button className="w-full group flex items-center justify-center gap-2 px-5 py-4 bg-[#109C3D] text-white font-semibold rounded-xl hover:bg-[#0d8a35] transition-all duration-200 shadow-lg shadow-[#109C3D]/30 hover:shadow-xl hover:shadow-[#109C3D]/40">
                                    <FaPlus className="text-sm group-hover:rotate-90 transition-transform duration-300" />
                                    <span>Post a New Task</span>
                                </button>
                            </Link>

                            {hasBothRoles && (
                                <button
                                    onClick={() => switchRole("tasker")}
                                    disabled={isSwitching}
                                    className="sm:hidden flex items-center justify-center gap-2 px-5 py-3 bg-white/10 backdrop-blur-sm text-white font-medium rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50"
                                >
                                    <FaExchangeAlt className="text-sm" />
                                    <span>Switch to Tasker Mode</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div> */}

            {/* Attention Banner - Show if there are tasks needing attention */}
            {/* {tasksNeedingAttention.length > 0 && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <FaBell className="text-amber-600 text-xl" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-[#063A41]">Tasks Need Your Attention</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                {taskStats.requested > 0 && (
                                    <span>{taskStats.requested} task{taskStats.requested > 1 ? 's' : ''} awaiting your approval. </span>
                                )}
                                {taskStats.withBids > 0 && (
                                    <span>{taskStats.withBids} task{taskStats.withBids > 1 ? 's have' : ' has'} new bids to review.</span>
                                )}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setActiveItem("All Tasks")}
                        className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors whitespace-nowrap"
                    >
                        Review Now
                        <FaArrowRight className="text-sm" />
                    </button>
                </div>
            )} */}

            {/* Stats */}
            <ClientDashboardStats />

            {/* Quick Actions Card - Redesigned */}
          

            {/* Pro Tips for Active Users */}
            {!isNewUser && taskStats.completed >= 1 && (
                <div className="bg-gradient-to-r from-[#063A41] to-[#0a4a52] rounded-2xl p-6 text-white">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                            <FaLightbulb className="text-amber-400 text-xl" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Pro Tip 💡</h3>
                            <p className="text-white/80 mt-1 text-sm">
                                {taskStats.completed >= 5
                                    ? "You're a power user! Consider leaving reviews for your taskers to help the community."
                                    : "Add detailed descriptions and photos to your tasks to get better bids from taskers!"}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Grid - Dashboard Widgets */}
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <ClientTaskCalendar />
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <ClientRecentQuotes />
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <ClientUpcomingBookings />
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <ClientTaskOverview />
                </div>

                <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <ClientProductivityChart />
                </div>
            </div>

            {/* Help Section */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                            <FaExclamationCircle className="text-[#109C3D] text-xl" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-[#063A41]">Need Help?</h3>
                            <p className="text-sm text-gray-500 mt-0.5">
                                Our support team is available 24/7 to assist you with any questions.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/contact-us">
                            <button className="px-4 py-2 bg-[#063A41] text-white text-sm font-medium rounded-lg hover:bg-[#052e33] transition-colors">
                                Contact Support
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}