import AdminDashboardSection from '@/components/dashboard/admin/AdminDashboardSection';
import StatsCards from '@/components/dashboard/admin/StatsCards';
import SystemReportCards from '@/components/dashboard/admin/SystemReportCards';
import TabsSection from '@/components/dashboard/admin/TabsSection';
import Navbar from '@/shared/Navbar';
import React from 'react';

const page = () => {
    return (
      <div className="bg-[#F2F5F9]">
        <div>
          <Navbar />
        </div>
        <div>
          <AdminDashboardSection />
        </div>
        <div>
          <SystemReportCards />
        </div>
        <div>
          <StatsCards />
        </div>
        <div>
            <TabsSection/>
        </div>
      </div>
    );
};

export default page;