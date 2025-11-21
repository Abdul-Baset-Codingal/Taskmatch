/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Calendar, ChevronLeft, ChevronRight, Plus } from "lucide-react";
// import { useState } from "react";
// import {
//     useGetScheduleTasksQuery,
//     useGetFlexibleTasksQuery,
// } from "@/features/api/taskApi";

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

// export function TaskCalendar() {
//     const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 8)); // October 08, 2025
//     const [selectedDate, setSelectedDate] = useState("2025-10-08");

//     // Fetch all tasks
//     const { data: scheduleTasks = [], error: scheduleError, isLoading: scheduleLoading, refetch: refetchSchedule } = useGetScheduleTasksQuery({});
//     const { data: flexibleTasks = [], error: flexibleError, isLoading: flexibleLoading, refetch: refetchFlexible } = useGetFlexibleTasksQuery({});
//     const allTasks = [...scheduleTasks, ...flexibleTasks];
//     const isLoading = scheduleLoading || flexibleLoading;
//     const hasError = scheduleError || flexibleError;

//     // Map API tasks to tasksByDate structure
//     const tasksByDate: Record<string, Task[]> = allTasks.reduce((acc: Record<string, Task[]>, task: any) => {
//         const now = new Date();
//         const deadline = new Date(task.offerDeadline);
//         const diffInMs = deadline.getTime() - now.getTime();
//         const isUrgent = diffInMs > 0 && diffInMs < 24 * 60 * 60 * 1000;

//         const taskDate = task.schedule === "Flexible" ? new Date(task.createdAt) : new Date(task.offerDeadline);
//         const dateKey = taskDate.toISOString().split("T")[0]; // e.g., "2025-10-08"
//         const time = taskDate.toLocaleTimeString("en-US", {
//             hour: "numeric",
//             minute: "2-digit",
//             hour12: true,
//         });

//         const taskEntry: Task = {
//             id: task._id,
//             title: task.taskTitle,
//             time: time,
//             priority: isUrgent ? "high" : "medium",
//             type: task.taskTitle.toLowerCase().includes("cleaning")
//                 ? "maintenance"
//                 : task.taskTitle.toLowerCase().includes("installation")
//                     ? "installation"
//                     : task.taskTitle.toLowerCase().includes("consult")
//                         ? "consultation"
//                         : "repair",
//         };

//         if (!acc[dateKey]) {
//             acc[dateKey] = [];
//         }
//         acc[dateKey].push(taskEntry);
//         return acc;
//     }, {});

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
//                     <CardDescription>Upcoming tasks</CardDescription>
//                 </CardHeader>
//                 <CardContent className="text-center py-8 text-gray-400 text-sm animate-pulse">
//                     Loading tasks...
//                 </CardContent>
//             </Card>
//         );
//     }

//     if (hasError) {
//         return (
//             <Card className="hover:shadow-md transition-shadow">
//                 <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                         <Calendar className="h-4 w-4" />
//                         Task Calendar
//                     </CardTitle>
//                     <CardDescription>Upcoming tasks</CardDescription>
//                 </CardHeader>
//                 <CardContent className="text-center py-8 text-red-600 text-sm">
//                     Error loading tasks
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
//                 <CardDescription>Upcoming tasks</CardDescription>
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
//                                 className={`p-2 text-xs rounded-md hover:bg-accent transition-colors relative ${isSelected ? "bg-primary text-primary-foreground" : ""
//                                     }`}
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
//                         <h4 className="font-medium text-sm">Tasks for {new Date(selectedDate).toLocaleDateString()}</h4>
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
//                         <p className="text-xs text-muted-foreground">No tasks scheduled for this date</p>
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
import { useState } from "react";
import {
    useGetScheduleTasksQuery,
    useGetFlexibleTasksQuery,
} from "@/features/api/taskApi";

export function TaskCalendar() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));

    const { data: scheduled = [] } = useGetScheduleTasksQuery(undefined);
    const { data: flexible = [] } = useGetFlexibleTasksQuery(undefined);
    const allTasks = [...(scheduled || []), ...(flexible || [])];

    // Build tasks by date (yyyy-MM-dd)
    const tasksByDate = allTasks.reduce((acc: Record<string, any[]>, task: any) => {
        let taskDate: Date;

        if (task.schedule === "Flexible") {
            taskDate = new Date(task.createdAt);
        } else if (task.offerDeadline) {
            taskDate = new Date(task.offerDeadline);
        } else {
            return acc;
        }

        const dateKey = format(taskDate, "yyyy-MM-dd");
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(task);
        return acc;
    }, {});

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const selectedTasks = tasksByDate[selectedDate] || [];

    const goToPreviousMonth = () => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
    };

    const goToNextMonth = () => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
    };

    return (
        <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white">
            {/* Top accent */}
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
                            <p className="text-sm text-gray-500">Your upcoming schedule</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={goToPreviousMonth} className="h-8 w-8">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium text-[#063A41] min-w-32 text-center">
                            {format(currentMonth, "MMMM yyyy")}
                        </span>
                        <Button variant="ghost" size="icon" onClick={goToNextMonth} className="h-8 w-8">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-4">
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-600 mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                        <div key={day}>{day}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {/* Leading empty cells */}
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
                  ${isCurrentDay && !isSelected ? "bg-[#063A41] text-white" : ""}
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

                    {selectedTasks.length === 0 ? (
                        <p className="text-center text-sm text-gray-500 py-8">
                            No tasks scheduled
                        </p>
                    ) : (
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                            {selectedTasks.map((task: any) => (
                                <div
                                    key={task._id}
                                    className="p-3 rounded-xl bg-gradient-to-r from-[#E5FFDB]/50 to-white border border-[#109C3D]/20 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-medium text-[#063A41] text-sm">{task.taskTitle}</p>
                                            {task.time && (
                                                <p className="text-xs text-gray-600 mt-1">{task.time}</p>
                                            )}
                                        </div>
                                        {task.schedule === "Flexible" ? (
                                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                                                Flexible
                                            </span>
                                        ) : (
                                            <span className="text-xs px-2 py-1 bg-[#E5FFDB] text-[#109C3D] rounded-full font-medium">
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