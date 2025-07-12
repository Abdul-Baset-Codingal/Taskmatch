import AvailabilitySchedule from '@/components/dashboard/tasker/AvailabilitySchedule';
import DashboardStats from '@/components/dashboard/tasker/DashboardStats';
import SkillsSection from '@/components/dashboard/tasker/SkillsSection';
import TaskerDashboardSection from '@/components/dashboard/tasker/TaskerDashboardSection';
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
      <div>
        <TaskerDashboardSection />
      </div>
      <div className="mt-32">
        <div>
          <UrgentTasks />
        </div>
      
        <div>
          <DashboardStats />
        </div>
        <div>
          <TaskTabs />
        </div>
        <div>
          <SkillsSection />
        </div>
        <div>
          <AvailabilitySchedule />
        </div>
      </div>
    </div>
  );
};

export default page;