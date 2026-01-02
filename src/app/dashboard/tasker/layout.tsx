"use client";

import ProtectedRoute from "@/components/protectedRoute";

export default function TaskerDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute allowedRoles={["tasker"]}>
            {children}
        </ProtectedRoute>
    );
}