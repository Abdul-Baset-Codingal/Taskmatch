// @ts-nocheck
"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(
                    "/api/auth/verify-token",
                    {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    router.replace(`/authentication?redirect=${encodeURIComponent(pathname)}`);
                    return;
                }

                const data = await response.json();
                const userRole = data.user?.currentRole;

                if (!userRole) {
                    router.replace("/authentication");
                    return;
                }

                if (!allowedRoles.includes(userRole)) {
                    router.replace(`/dashboard/${userRole}`);
                    return;
                }

                setIsAuthorized(true);
            } catch (error) {
                console.error("Auth check failed:", error);
                router.replace("/authentication");
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router, allowedRoles, pathname]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-[#109C3D]/20 rounded-full"></div>
                        <div className="w-20 h-20 border-4 border-[#109C3D] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                    </div>
                    <p className="text-gray-600 font-medium mt-6">Verifying access...</p>
                    <p className="text-gray-400 text-sm mt-2">Please wait</p>
                </div>
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    return <>{children}</>;
};

export default ProtectedRoute;