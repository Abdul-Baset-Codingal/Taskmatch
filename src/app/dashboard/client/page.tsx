import ClientStats from '@/components/dashboard/client/ClientStats';
import ClientWelcomeSection from '@/components/dashboard/client/ClientWelcomeSection';
import Greeting from '@/components/dashboard/client/Greeting';
import ReferralSection from '@/components/dashboard/client/ReferralSection';
import SavingsAndRewards from '@/components/dashboard/client/SavingsAndRewards';
import Tabs from '@/components/dashboard/client/Tabs';
import TaskListSection from '@/components/dashboard/client/TaskListSection';
import TaskMatchRewards from '@/components/dashboard/client/TaskMatchRewards';
import Navbar from '@/shared/Navbar';
import React from 'react';

const page = () => {
    return (
        <div>
            <div>
                <Navbar />
            </div>
            <div>
                <ClientWelcomeSection />
            </div>
            <div>
                <Greeting />
            </div>
            <div>
                <Tabs />
            </div>
            {/* <div className="mt-10">
                <AllBookings />
            </div>
            <div>
                <RequestQuoteByUser />
            </div> */}
            <div className='mt-10'>
                <TaskListSection />
            </div>
            <div>
                <ClientStats />
            </div>
            <div>
                <TaskMatchRewards />
            </div>
            <div>
                <SavingsAndRewards />
            </div>
            <div>
                <ReferralSection />
            </div>

        </div>
    );
};

export default page;