/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Calendar, ChevronLeft, ChevronRight, Plus } from "lucide-react";
// import { useState, useEffect, useMemo } from "react";
// import { useGetTasksByClientQuery } from "@/features/api/taskApi";
// import { checkLoginStatus } from "@/resusable/CheckUser";

// interface Task {
//     id: string;
//     title: string;
//     time: string;
//     priority: "high" | "medium" | "low";
//     type: "maintenance" | "installation" | "consultation" | "repair";
// }

// const priorityColors = {
//     high: "bg-red-100 text-red-800 border-red-200",
//     medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
//     low: "bg-green-100 text-green-800 border-green-200",
// };

// const typeColors = {
//     maintenance: "bg-blue-50 border-l-blue-400",
//     installation: "bg-purple-50 border-l-purple-400",
//     consultation: "bg-green-50 border-l-green-400",
//     repair: "bg-orange-50 border-l-orange-400",
// };

// export function ClientTaskCalendar() {
//     const [user, setUser] = useState<{ _id: string } | null>(null);
//     const [currentDate, setCurrentDate] = useState(new Date(2025, 8, 23)); // September 23, 2025
//     const [selectedDate, setSelectedDate] = useState("2025-09-23");

//     // Fetch user data
//     useEffect(() => {
//         const fetchUser = async () => {
//             const { isLoggedIn, user } = await checkLoginStatus();
//             if (isLoggedIn) {
//                 setUser(user);
//                 console.log("User object:", user);
//             }
//         };

//         fetchUser();
//     }, []);

//     // Fetch tasks for the client
//     const {
//         data: clientTasks = [],
//         isLoading,
//         isError,
//     } = useGetTasksByClientQuery(user?._id ? { clientId: user._id } : { clientId: "" }, {
//         skip: !user?._id,
//     });

//     // Map API tasks to tasksByDate structure, filtering for urgent tasks
//     const tasksByDate: Record<string, Task[]> = useMemo(() => {
//         return clientTasks.reduce((acc: Record<string, Task[]>, task: any) => {
//             // Filter for urgent tasks (e.g., extraCharge or priority === "high")
//             const isUrgent = task.extraCharge || task.priority === "high";
//             if (!isUrgent) return acc;

//             const taskDate = new Date(task.createdAt);
//             const dateKey = taskDate.toISOString().split("T")[0]; // e.g., "2025-09-23"
//             const time = taskDate.toLocaleTimeString("en-US", {
//                 hour: "numeric",
//                 minute: "2-digit",
//                 hour12: true,
//             });

//             const taskEntry: Task = {
//                 id: task.id || task._id,
//                 title: task.taskTitle || "Untitled Task",
//                 time,
//                 priority: task.priority
//                     ? task.priority.toLowerCase()
//                     : task.extraCharge
//                         ? "high"
//                         : "medium", // Fallback: extraCharge implies high priority
//                 type: task.serviceTitle
//                     ? task.serviceTitle.toLowerCase().includes("cleaning")
//                         ? "maintenance"
//                         : task.serviceTitle.toLowerCase().includes("installation")
//                             ? "installation"
//                             : task.serviceTitle.toLowerCase().includes("consult")
//                                 ? "consultation"
//                                 : "repair"
//                     : "repair", // Fallback to repair if serviceTitle is missing
//             };

//             if (!acc[dateKey]) {
//                 acc[dateKey] = [];
//             }
//             acc[dateKey].push(taskEntry);
//             return acc;
//         }, {});
//     }, [clientTasks]);

//     const getDaysInMonth = (date: Date) => {
//         const year = date.getFullYear();
//         const month = date.getMonth();
//         const firstDay = new Date(year, month, 1);
//         const lastDay = new Date(year, month + 1, 0);
//         const daysInMonth = lastDay.getDate();
//         const startingDayOfWeek = firstDay.getDay();

//         const days = [];

//         // Add empty cells for days before the first day of the month
//         for (let i = 0; i < startingDayOfWeek; i++) {
//             days.push(null);
//         }

//         // Add days of the month
//         for (let day = 1; day <= daysInMonth; day++) {
//             days.push(day);
//         }

//         return days;
//     };

//     const formatDateKey = (day: number) => {
//         const year = currentDate.getFullYear();
//         const month = currentDate.getMonth();
//         return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
//     };

//     const days = getDaysInMonth(currentDate);
//     const monthNames = [
//         "January",
//         "February",
//         "March",
//         "April",
//         "May",
//         "June",
//         "July",
//         "August",
//         "September",
//         "October",
//         "November",
//         "December",
//     ];

//     const selectedTasks = tasksByDate[selectedDate] || [];

//     if (isLoading) {
//         return (
//             <Card className="hover:shadow-md transition-shadow">
//                 <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                         <Calendar className="h-4 w-4" />
//                         Task Calendar
//                     </CardTitle>
//                     <CardDescription>Upcoming Scheduled tasks</CardDescription>
//                 </CardHeader>
//                 <CardContent className="text-center py-8 text-gray-400 text-sm animate-pulse">
//                     Loading urgent tasks...
//                 </CardContent>
//             </Card>
//         );
//     }

//     if (isError) {
//         return (
//             <Card className="hover:shadow-md transition-shadow">
//                 <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                         <Calendar className="h-4 w-4" />
//                         Task Calendar
//                     </CardTitle>
//                     <CardDescription>Upcoming Scheduled tasks</CardDescription>
//                 </CardHeader>
//                 <CardContent className="text-center py-8 text-red-500 text-sm">
//                     Error loading urgent tasks
//                 </CardContent>
//             </Card>
//         );
//     }

//     return (
//         <Card className="hover:shadow-md transition-shadow">
//             <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                     <Calendar className="h-4 w-4" />
//                     Task Calendar
//                 </CardTitle>
//                 <CardDescription>Upcoming Scheduled tasks</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//                 {/* Calendar Header */}
//                 <div className="flex items-center justify-between">
//                     <h3 className="font-semibold">
//                         {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
//                     </h3>
//                     <div className="flex gap-1">
//                         <Button
//                             variant="outline"
//                             size="icon"
//                             className="h-7 w-7 bg-transparent"
//                             onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
//                         >
//                             <ChevronLeft className="h-3 w-3" />
//                         </Button>
//                         <Button
//                             variant="outline"
//                             size="icon"
//                             className="h-7 w-7 bg-transparent"
//                             onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
//                         >
//                             <ChevronRight className="h-3 w-3" />
//                         </Button>
//                     </div>
//                 </div>

//                 {/* Calendar Grid */}
//                 <div className="grid grid-cols-7 gap-1 text-center">
//                     {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
//                         <div key={day} className="p-2 text-xs font-medium text-muted-foreground">
//                             {day}
//                         </div>
//                     ))}
//                     {days.map((day, index) => {
//                         if (day === null) {
//                             return <div key={index} className="p-2" />;
//                         }

//                         const dateKey = formatDateKey(day);
//                         const hasTasks = tasksByDate[dateKey]?.length > 0;
//                         const isSelected = dateKey === selectedDate;

//                         return (
//                             <button
//                                 key={day}
//                                 className={`p-2 text-xs rounded-md hover:bg-accent transition-colors relative ${isSelected ? "bg-primary text-primary-foreground" : ""}`}
//                                 onClick={() => setSelectedDate(dateKey)}
//                             >
//                                 {day}
//                                 {hasTasks && (
//                                     <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
//                                 )}
//                             </button>
//                         );
//                     })}
//                 </div>

//                 {/* Selected Date Tasks */}
//                 <div className="space-y-2">
//                     <div className="flex items-center justify-between">
//                         <h4 className="font-medium text-sm">Urgent Tasks for {new Date(selectedDate).toLocaleDateString()}</h4>
//                         <Button size="sm" variant="outline" className="h-7 text-xs bg-transparent">
//                             <Plus className="h-3 w-3 mr-1" />
//                             Add Task
//                         </Button>
//                     </div>

//                     {selectedTasks.length > 0 ? (
//                         <div className="space-y-2 max-h-32 overflow-y-auto">
//                             {selectedTasks.map((task) => (
//                                 <div key={task.id} className={`p-2 rounded-md border-l-2 ${typeColors[task.type]} text-xs`}>
//                                     <div className="flex items-center justify-between">
//                                         <span className="font-medium">{task.title}</span>
//                                         <span className={`px-2 py-1 rounded text-xs ${priorityColors[task.priority]}`}>
//                                             {task.priority}
//                                         </span>
//                                     </div>
//                                     <div className="text-muted-foreground mt-1">{task.time}</div>
//                                 </div>
//                             ))}
//                         </div>
//                     ) : (
//                         <p className="text-xs text-muted-foreground">No urgent tasks scheduled for this date</p>
//                     )}
//                 </div>
//             </CardContent>
//         </Card>
//     );
// }


"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from "date-fns";
import { useState, useEffect, useMemo } from "react";
import { useGetTasksByClientQuery } from "@/features/api/taskApi";
import { checkLoginStatus } from "@/resusable/CheckUser";
import { skipToken } from "@reduxjs/toolkit/query/react";

export function ClientTaskCalendar() {
    const [user, setUser] = useState<any>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));

    useEffect(() => {
        const fetchUser = async () => {
            const { isLoggedIn, user } = await checkLoginStatus();
            if (isLoggedIn) setUser(user);
        };
        fetchUser();
    }, []);

    const { data: tasks = [], isLoading } = useGetTasksByClientQuery(
        user?._id ? { clientId: user._id } : skipToken,
        { skip: !user?._id }
    );

    // Build tasks by date
    const tasksByDate = useMemo(() => {
        const map: Record<string, any[]> = {};

        tasks.forEach((task: any) => {
            let taskDate: Date;

            // Use scheduled date if available, otherwise createdAt
            if (task.scheduledDate) {
                taskDate = new Date(task.scheduledDate);
            } else if (task.createdAt) {
                taskDate = new Date(task.createdAt);
            } else {
                return;
            }

            const dateKey = format(taskDate, "yyyy-MM-dd");
            if (!map[dateKey]) map[dateKey] = [];
            map[dateKey].push(task);
        });

        return map;
    }, [tasks]);

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const selectedTasks = tasksByDate[selectedDate] || [];

    const goPrev = () => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
    const goNext = () => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));

    return (
        <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white">
            {/* Top green accent */}
            <div className="absolute inset-x-0 top-0 h-1.5 bg-[#109C3D] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />

            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-[#E5FFDB] shadow-sm">
                            <Calendar className="w-6 h-6 text-[#109C3D]" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold text-[#063A41]">
                                Task Calendar
                            </CardTitle>
                            <p className="text-sm text-gray-500">Your scheduled tasks</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={goPrev} className="h-8 w-8">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium text-[#063A41] min-w-32 text-center">
                            {format(currentMonth, "MMMM yyyy")}
                        </span>
                        <Button variant="ghost" size="icon" onClick={goNext} className="h-8 w-8">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-4">
                {/* Days Header */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-600 mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                        <div key={d}>{d}</div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                    {/* Empty leading cells */}
                    {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                        <div key={`empty-${i}`} />
                    ))}

                    {monthDays.map(day => {
                        const dateKey = format(day, "yyyy-MM-dd");
                        const hasTasks = !!tasksByDate[dateKey];
                        const isSelected = dateKey === selectedDate;
                        const isCurrentDay = isToday(day);

                        return (
                            <button
                                key={dateKey}
                                onClick={() => setSelectedDate(dateKey)}
                                className={`
                  relative h-10 rounded-lg text-sm font-medium transition-all duration-200
                  ${isSelected ? "bg-[#109C3D] text-white shadow-lg" : ""}
                  ${isCurrentDay && !isSelected ? "bg-[#063A41] text-white font-bold" : ""}
                  ${!isSelected && !isCurrentDay ? "hover:bg-gray-100" : ""}
                  ${hasTasks && !isSelected && !isCurrentDay ? "text-[#109C3D] font-bold" : "text-gray-700"}
                `}
                            >
                                {format(day, "d")}
                                {hasTasks && !isSelected && (
                                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#109C3D] rounded-full" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Selected Date Tasks */}
                <div className="mt-6 border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-[#063A41]">
                            {format(selectedDate, "EEEE, MMMM d, yyyy")}
                        </h4>
                        <span className="text-xs text-gray-500">
                            {selectedTasks.length} {selectedTasks.length === 1 ? "task" : "tasks"}
                        </span>
                    </div>

                    {isLoading ? (
                        <p className="text-center py-8 text-gray-400">Loading tasks...</p>
                    ) : selectedTasks.length === 0 ? (
                        <p className="text-center py-8 text-gray-500">No tasks scheduled</p>
                    ) : (
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                            {selectedTasks.map((task: any) => (
                                <div
                                    key={task._id}
                                    className="p-3 rounded-xl bg-gradient-to-r from-[#E5FFDB]/50 to-white border border-[#109C3D]/20 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-medium text-[#063A41] text-sm">{task.taskTitle || "Untitled Task"}</p>
                                            {task.scheduledTime && (
                                                <p className="text-xs text-gray-600 mt-1">{task.scheduledTime}</p>
                                            )}
                                        </div>
                                        {task.status === "completed" ? (
                                            <span className="text-xs px-2 py-1 bg-[#E5FFDB] text-[#109C3D] rounded-full font-medium">
                                                Completed
                                            </span>
                                        ) : task.extraCharge ? (
                                            <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
                                                Urgent
                                            </span>
                                        ) : (
                                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                                                Scheduled
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}