"use client";

import ProtectedRoute from "@/components/protectedRoute";

export default function ClientDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute allowedRoles={["client"]}>
            {children}
        </ProtectedRoute>
    );
}