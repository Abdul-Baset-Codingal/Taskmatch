"use client";

import ProtectedRoute from "@/components/protectedRoute";

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute allowedRoles={["admin"]}>
            {children}
        </ProtectedRoute>
    );
}