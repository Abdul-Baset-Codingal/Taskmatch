import { useEffect, useState } from "react";
import { checkLoginStatus } from "@/resusable/CheckUser";
import { DashboardStats } from "./dashboard-stats";
import { IncomeChart } from "./income-chart";
import { RecentQuotes } from "./recent-quotes";
import { TaskCalendar } from "./task-calender";
import { TaskOverview } from "./task-overview";
import { UpcomingBookings } from "./upcoming-bookings";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
    FaExchangeAlt,
    FaUser,
    FaBriefcase,
    FaCheckCircle,
    FaArrowRight,
} from "react-icons/fa";

export function DashboardContent() {
    const [user, setUser] = useState<any>(null);
    const [isSwitching, setIsSwitching] = useState(false);
    const router = useRouter();

    const fetchUser = async () => {
        const { isLoggedIn, user } = await checkLoginStatus();
        if (isLoggedIn) setUser(user);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    // Check if user has both roles
    const hasBothRoles = user?.roles?.includes("client") && user?.roles?.includes("tasker");
    const currentRole = user?.currentRole || "tasker";

    // Switch role function
    const switchRole = async (newRole: "tasker" | "client") => {
        if (!user?._id) {
            toast.error("User ID not found.");
            return;
        }

        if (currentRole === newRole) {
            toast.info(`You're already in ${newRole} mode.`);
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
                if (newRole === "client") {
                    router.push("/dashboard/client");
                } else {
                    // Refresh current page data
                    await fetchUser();
                }
            } else {
                const errorData = await response.json().catch(() => ({}));
                toast.error(errorData.message || `Failed to switch to ${newRole} mode.`);
            }
        } catch (error) {
            console.error("Switch role failed", error);
            toast.error("An error occurred while switching roles.");
        } finally {
            setIsSwitching(false);
        }
    };

    const calculateProfileProgress = (user: any) => {
        if (!user || user.currentRole !== "tasker") return 100;

        const checks = [
            !!user.profilePicture,
            !!user.about,
            !!user.dob,
            !!user.address?.postalCode || !!user.postalCode,
            Array.isArray(user.categories) && user.categories.length > 0,
            !!user.yearsOfExperience,
            Array.isArray(user.services) && user.services.length > 0,
            !!user.idType,
            user.idType === "passport" ? !!user.passportUrl : !!user.governmentIdFront && !!user.governmentIdBack,
            !!user.issueDate,
            !!user.expiryDate,
            !!user.sin,
            !!user.backgroundCheckConsent,
            Array.isArray(user.availability) && user.availability.length > 0,
        ];

        const filled = checks.filter(Boolean).length;
        return Math.round((filled / checks.length) * 100);
    };

    const progress = user ? calculateProfileProgress(user) : 0;
    const isComplete = progress === 100;
    const isTasker = user?.currentRole === "tasker";

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    return (
        <div className="space-y-10 pb-12">
            {/* Role Switcher Banner - Show if user has both roles */}
            {hasBothRoles && (
                <div className="bg-gradient-to-r from-[#E5FFDB] to-[#d4f5c7] border border-[#109C3D]/20 rounded-2xl p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#109C3D] rounded-xl flex items-center justify-center flex-shrink-0">
                                <FaExchangeAlt className="text-white text-xl" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-[#063A41]">
                                    You're in <span className="text-[#109C3D]">Tasker</span> Mode
                                </h3>
                                <p className="text-sm text-gray-600 mt-0.5">
                                    Switch to Booker mode to post and manage your own tasks
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Role Toggle Buttons */}
                            <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200">
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
                                    {currentRole === "tasker" && (
                                        <FaCheckCircle className="text-xs" />
                                    )}
                                </button>
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
                                </button>
                            </div>

                            {/* Quick Switch Button */}
                            <button
                                onClick={() => switchRole("client")}
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
                                        <span>Switch to Booker</span>
                                        <FaArrowRight className="text-sm" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Clean Hero Section */}
            <div className="bg-[#063A41] rounded-3xl p-8 lg:p-12 text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                                Welcome back, {user?.firstName || "Tasker"}! 👋
                            </h1>
                            <p className="mt-4 text-xl text-white/90">{today}</p>
                            <p className="mt-3 text-lg text-white/70 max-w-2xl">
                                Manage your bookings, track earnings, and stay on top of new opportunities.
                            </p>

                            {/* Current Role Badge */}
                            {hasBothRoles && (
                                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full">
                                    <FaBriefcase className="text-[#109C3D] text-sm" />
                                    <span className="text-sm font-medium">Tasker Mode</span>
                                </div>
                            )}
                        </div>

                        {/* Profile Completion - Only for Taskers */}
                        {isTasker && (
                            <div className="bg-white rounded-2xl shadow-xl p-7 w-full lg:w-96">
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="text-lg font-semibold text-[#063A41]">Profile Completion</h3>
                                    <span className={`text-2xl font-bold ${isComplete ? "text-[#109C3D]" : "text-[#063A41]"}`}>
                                        {progress}%
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-5">
                                    <div
                                        className="h-full bg-[#109C3D] transition-all duration-1000 ease-out"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>

                                <p className="text-sm text-gray-600 mb-5">
                                    {isComplete
                                        ? "Your profile is complete and ready to attract more clients!"
                                        : "Finish setting up your profile to increase bookings and visibility."}
                                </p>

                                {!isComplete && (
                                    <Link href="/complete-tasker-profile">
                                        <button className="w-full bg-[#109C3D] hover:bg-[#063A41] text-white font-semibold py-3.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg">
                                            Complete Profile →
                                        </button>
                                    </Link>
                                )}

                                {isComplete && (
                                    <div className="text-center">
                                        <span className="inline-flex items-center gap-2 text-[#109C3D] font-semibold">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Profile Complete
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <DashboardStats />

            {/* Main Grid */}
            <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
                <div className="xl:col-span-2">
                    <IncomeChart />
                </div>
                <div>
                    <TaskOverview />
                </div>

                <div className="lg:col-span-2 xl:col-span-1">
                    <TaskCalendar />
                </div>
                <div>
                    <RecentQuotes />
                </div>
                <div>
                    <UpcomingBookings />
                </div>
            </div>
        </div>
    );
}