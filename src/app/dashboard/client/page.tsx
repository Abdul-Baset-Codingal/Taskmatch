
"use client"

import { ClientDashboardLayout } from "@/components/dashboard/client/ClientDashboardLayout"
import { useState } from "react"

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    <div className="relative flex min-w-0 min-h-screen">
      <ClientDashboardLayout isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </div>
  )
}
