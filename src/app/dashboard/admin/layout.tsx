// "use client";

// import ProtectedRoute from "@/components/protectedRoute";

// export default function AdminDashboardLayout({
//     children,
// }: {
//     children: React.ReactNode;
// }) {
//     return (
//         <ProtectedRoute allowedRoles={["admin"]}>
//             {children}
//         </ProtectedRoute>
//     );
// }


// app/dashboard/admin/layout.tsx
"use client";

import ProtectedRoute from "@/components/protectedRoute";
import AdminDashboard from "./page";

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute allowedRoles={["admin"]}>
            <div className="min-h-screen bg-gray-50">
                {/* Admin Sidebar */}
                <AdminDashboard />

                {/* Main Content Area */}
                <main className="lg:ml-72 min-h-screen">
                    {/* Top Header Bar */}
                    <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
                        <div className="px-6 py-4 flex items-center justify-between">
                            {/* Spacer for mobile menu button */}
                            <div className="lg:hidden w-10" />

                            <h2 className="text-lg font-semibold text-gray-800">
                                Admin Panel
                            </h2>

                            <div className="flex items-center gap-4">
                                {/* You can add notifications, profile, etc. here */}
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <div className="p-6">
                        {children}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}