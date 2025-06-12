import DashboardStats from '@/components/dashboard/tasker/DashboardStats';
import EditProfile from '@/components/dashboard/tasker/EditProfile';
import TaskTabs from '@/components/dashboard/tasker/TaskTabs';
import UrgentTasks from '@/components/dashboard/tasker/UrgentTasks';
import Navbar from '@/shared/Navbar';
import React from 'react';

const page = () => {
    return (
      <div className="">
        <div>
          <Navbar />
        </div>
        <div className="bg-[#724CE9] py-14 px-4 rounded-b-[90px]">
          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold text-center">
            Tasker Dashboard
          </h1>
        </div>
        <div className="">
          <div>
            <UrgentTasks/>
          </div>
          <div>
            <EditProfile/>
          </div>
          <div>
            <DashboardStats/>
          </div>
          <div>
            <TaskTabs/>
          </div>
        </div>
      </div>
    );
};

export default page;