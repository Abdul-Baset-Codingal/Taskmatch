import CleaningPackages from '@/components/servicingDetails/homeCleaning/CleaningPackages';
import CleaningPackagesSection from '@/components/servicingDetails/homeCleaning/CleaningPackagesSection';
import HomeCleaningBanner from '@/components/servicingDetails/homeCleaning/HomeCleaningBanner';
import Navbar from '@/shared/Navbar';
import React from 'react';

const page = () => {
    return (
        <div>
            <div>
                <Navbar/>
            </div>
            <div>
                <HomeCleaningBanner/>
            </div>
            <div className='mt-24'>
                <CleaningPackagesSection/>
            </div>
              <div className='mt-24'>
                <CleaningPackages/>
            </div>
        </div>
    );
};

export default page;