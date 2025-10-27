"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Calendar, Users, MessageSquare, BarChart3 } from "lucide-react"

const quickActions = [
    {
        title: "New Task",
        description: "Create a new service task",
        icon: Plus,
        color: "bg-primary text-primary-foreground hover:bg-primary/90",
    },
    {
        title: "Generate Quote",
        description: "Create quote for client",
        icon: FileText,
        color: "bg-blue-500 text-white hover:bg-blue-600",
    },
    {
        title: "Schedule Booking",
        description: "Add new appointment",
        icon: Calendar,
        color: "bg-green-500 text-white hover:bg-green-600",
    },
    {
        title: "Add Client",
        description: "Register new client",
        icon: Users,
        color: "bg-purple-500 text-white hover:bg-purple-600",
    },
    {
        title: "Send Message",
        description: "Contact client or team",
        icon: MessageSquare,
        color: "bg-orange-500 text-white hover:bg-orange-600",
    },
    {
        title: "View Reports",
        description: "Check analytics",
        icon: BarChart3,
        color: "bg-teal-500 text-white hover:bg-teal-600",
    },
]

export function QuickActions() {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used actions for faster workflow</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-3">
                    {quickActions.map((action) => {
                        const Icon = action.icon
                        return (
                            <Button
                                key={action.title}
                                variant="outline"
                                className={`h-auto p-4 flex flex-col items-center gap-2 ${action.color} border-0`}
                            >
                                <Icon className="h-5 w-5" />
                                <div className="text-center">
                                    <div className="text-sm font-medium">{action.title}</div>
                                    <div className="text-xs opacity-90">{action.description}</div>
                                </div>
                            </Button>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
