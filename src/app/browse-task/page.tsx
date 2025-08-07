"use client";
import { useGetTasksByStatusQuery } from "@/features/api/taskApi";
import AllTasks from "@/components/browse-tasks/AllTasks";
import MapLocation from "@/components/browse-tasks/MapLocation";
import Navbar from "@/shared/Navbar";
import React, { useState } from "react";

const Page = () => {
    const { data: tasks, error, isLoading } = useGetTasksByStatusQuery("pending");
    const [selectedTask, setSelectedTask] = useState(null);

    const handleTaskSelect = (task) => {
        setSelectedTask(task);
        console.log("Task selected:", task);
    };

    return (
        <div>
            <nav>
                <Navbar />
            </nav>
            <div className="flex justify-center">
                <div className="w-7xl">
                    <div className="flex w-[100%] h-[100vh]">
                        {/* All tasks */}
                        <div className="w-[40%]">
                            <AllTasks
                                tasks={tasks}
                                isLoading={isLoading}
                                error={error}
                                selectedTask={selectedTask}
                                onTaskSelect={handleTaskSelect}
                            />
                        </div>
                        {/* Map */}
                        <div className="w-[60%] h-[100vh]">
                            <MapLocation
                                selectedTask={selectedTask}
                                tasks={tasks || []} // Ensure it's always an array
                                isLoading={isLoading}
                                error={error}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;