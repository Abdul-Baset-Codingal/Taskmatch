"use client"

import { DashboardLayout } from "@/components/dashboard/tasker/dashboard-sidebar"
import { useState } from "react"

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    <div className="relative flex min-w-0 min-h-screen">
      <DashboardLayout isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </div>
  )
}
