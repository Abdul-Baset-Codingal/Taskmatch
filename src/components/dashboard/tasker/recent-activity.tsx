"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, CheckCircle, AlertCircle, FileText, Calendar } from "lucide-react"

interface ActivityItem {
    id: string
    type: "task_completed" | "quote_sent" | "booking_scheduled" | "payment_received" | "task_overdue"
    title: string
    description: string
    timestamp: string
    status?: "success" | "warning" | "error" | "info"
}

const recentActivity: ActivityItem[] = [
    {
        id: "1",
        type: "task_completed",
        title: "Kitchen Repair Completed",
        description: "Successfully completed repair work for Sarah Johnson",
        timestamp: "2 hours ago",
        status: "success",
    },
    {
        id: "2",
        type: "quote_sent",
        title: "Quote Sent",
        description: "Bathroom renovation quote sent to Mike Chen",
        timestamp: "4 hours ago",
        status: "info",
    },
    {
        id: "3",
        type: "booking_scheduled",
        title: "New Booking",
        description: "HVAC maintenance scheduled for tomorrow",
        timestamp: "6 hours ago",
        status: "info",
    },
    {
        id: "4",
        type: "payment_received",
        title: "Payment Received",
        description: "$3,500 payment received from Emily Davis",
        timestamp: "1 day ago",
        status: "success",
    },
    {
        id: "5",
        type: "task_overdue",
        title: "Task Overdue",
        description: "Electrical work for Robert Wilson is overdue",
        timestamp: "1 day ago",
        status: "error",
    },
]

const activityConfig = {
    task_completed: { icon: CheckCircle, color: "text-green-600" },
    quote_sent: { icon: FileText, color: "text-blue-600" },
    booking_scheduled: { icon: Calendar, color: "text-purple-600" },
    payment_received: { icon: CheckCircle, color: "text-green-600" },
    task_overdue: { icon: AlertCircle, color: "text-red-600" },
}

const statusConfig = {
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    error: "bg-red-100 text-red-800 border-red-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
}

export function RecentActivity() {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Recent Activity
                </CardTitle>
                <CardDescription>Latest updates and notifications</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recentActivity.map((activity) => {
                        const ActivityIcon = activityConfig[activity.type].icon
                        return (
                            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-card/50 border">
                                <div className={`mt-0.5 ${activityConfig[activity.type].color}`}>
                                    <ActivityIcon className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">{activity.title}</p>
                                        {activity.status && (
                                            <Badge variant="outline" className={`text-xs ${statusConfig[activity.status]}`}>
                                                {activity.status}
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
