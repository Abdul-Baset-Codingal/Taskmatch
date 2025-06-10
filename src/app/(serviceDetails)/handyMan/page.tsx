import HandyManBanner from '@/components/servicingDetails/handyMan/HandyManBanner';
import HandyManPackages from '@/components/servicingDetails/handyMan/HandyManPackages';
import HandymanPackagesSection from '@/components/servicingDetails/handyMan/HandymanPackagesSection';
import Navbar from '@/shared/Navbar';
import React from 'react';

const page = () => {
    return (
        <div>
            <div>
                <Navbar/>
            </div>
            <div>
                <HandyManBanner/>
            </div>
            <div className='mt-32'>
                <HandymanPackagesSection/>
            </div>
            <div className='mt-32'>
                <HandyManPackages/>
            </div>
        </div>
    );
};

export default page;