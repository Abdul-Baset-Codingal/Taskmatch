import FamilyCareBanner from '@/components/servicingDetails/familyCare/FamilyCareBanner';
import FamilyCareIncludedSection from '@/components/servicingDetails/familyCare/FamilyCareIncludedSection';
import FamilyCarePackages from '@/components/servicingDetails/familyCare/FamilyCarePackages';
import FamilyCareServiceSection from '@/components/servicingDetails/familyCare/FamilyCareServiceSection';
import Navbar from '@/shared/Navbar';
import React from 'react';

const page = () => {
    return (
        <div>
            <div>
                <Navbar/>
            </div>
            <div>
                <FamilyCareBanner/>
            </div>
            <div className='mt-32'>
              <FamilyCareServiceSection/>
            </div>
            <div className='mt-32'>
                <FamilyCarePackages/>
            </div>
            <div className='mt-32'>
              <FamilyCareIncludedSection/>
            </div>
        </div>
    );
};

export default page;