import LiveActivityFeedSection from '@/components/routes/urgent-task/LiveActivityFeedSection';
import LiveBiddingSection from '@/components/routes/urgent-task/LiveBiddingSection';
import QuickActionsSidebar from '@/components/routes/urgent-task/QuickActionsSidebar';
import SupportSidebar from '@/components/routes/urgent-task/SupportSidebar';
import TaskDescriptionSection from '@/components/routes/urgent-task/TaskDescriptionSection';
import TaskMetricsSidebar from '@/components/routes/urgent-task/TaskMetricsSidebar';
import TaskOverview from '@/components/routes/urgent-task/TaskOverview';
import UrgentPriority from '@/components/routes/urgent-task/UrgentPriority';
import Navbar from '@/shared/Navbar';
import React from 'react';

const page = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <UrgentPriority />
      <div className="flex flex-col lg:flex-row gap-x-6 gap-y-6 w-full  px-4 sm:px-8 py-6">
        {/* Dashboard data */}
        <div className="flex-1 space-y-6 lg:w-[80%]">
          <TaskOverview />
          <LiveBiddingSection />
          <TaskDescriptionSection />
          <LiveActivityFeedSection />
        </div>
        {/* Sidebar */}
        <div className="w-full lg:w-[20%]">
          <TaskMetricsSidebar />
          <QuickActionsSidebar/>
          <SupportSidebar/>
        </div>
      </div>
    </div>
  );
};

export default page;