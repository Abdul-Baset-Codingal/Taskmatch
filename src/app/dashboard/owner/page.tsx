import OwnerDashboardSection from '@/components/dashboard/owner/OwnerDashboardSection';
import Navbar from '@/shared/Navbar';
import React from 'react';
import DashboardStatsSection from './DashboardStatsSection';
import OwnerTabs from '@/components/dashboard/owner/OwnerTabs';

const page = () => {
    return (
      <div>
        <div>
          <Navbar />
        </div>
        <div>
          <OwnerDashboardSection />
        </div>
        <div>
            <DashboardStatsSection/>
        </div>
       <div>
        <OwnerTabs/>
       </div>
      </div>
    );
};

export default page;