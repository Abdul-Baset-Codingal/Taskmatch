"use client";

import AllAvailableTasks from '@/components/browse-tasks/AllAvailbleTasks';
import Navbar from '@/shared/Navbar';
import React, { useEffect } from 'react';

const BrowseTasksClient = () => {
    useEffect(() => {
        if (!sessionStorage.getItem("reloaded")) {
            sessionStorage.setItem("reloaded", "true");
            window.location.reload();
        } else {
            sessionStorage.removeItem("reloaded");
        }
    }, []);

    return (
        <div>
            <Navbar />
            <AllAvailableTasks />
        </div>
    );
};

export default BrowseTasksClient;