// "use client";

// import AllAvailableTasks from '@/components/browse-tasks/AllAvailbleTasks';
// import Navbar from '@/shared/Navbar';
// import React, { useEffect } from 'react';

// const BrowseTasksClient = () => {
//     // useEffect(() => {
//     //     if (!sessionStorage.getItem("reloaded")) {
//     //         sessionStorage.setItem("reloaded", "true");
//     //         window.location.reload();
//     //     } else {
//     //         sessionStorage.removeItem("reloaded");
//     //     }
//     // }, []);

//     return (
//         <div>
//             <Navbar />
//             <AllAvailableTasks />
//         </div>
//     );
// };

// export default BrowseTasksClient;


// app/browse-tasks/BrowseTasksClient.tsx

"use client";

import AllAvailableTasks from '@/components/browse-tasks/AllAvailbleTasks';
import Navbar from '@/shared/Navbar';
import React from 'react';

const BrowseTasksClient = () => {
    return (
        <div>
            <Navbar />

            {/* ✅ SEO Header */}
            <div className="bg-white border-b">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Browse Available Tasks
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Find tasks that match your skills across Canada
                    </p>
                </div>
            </div>

            <AllAvailableTasks />
        </div>
    );
};

export default BrowseTasksClient;