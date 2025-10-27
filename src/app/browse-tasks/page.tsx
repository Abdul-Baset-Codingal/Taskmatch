import AllAvailableTasks from '@/components/browse-tasks/AllAvailbleTasks';
import Navbar from '@/shared/Navbar';
import React from 'react';

const page = () => {
    return (
        <div>
            <div>
                <Navbar />
            </div>
            <div>
                <AllAvailableTasks/>
            </div>
        </div>
    );
};

export default page;