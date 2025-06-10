import JunkRemovalBanner from '@/components/servicingDetails/junkRemoval/JunkRemovalBanner';
import JunkRemovalIncludedSection from '@/components/servicingDetails/junkRemoval/JunkRemovalIncludedSection';
import JunkRemovalPackageSection from '@/components/servicingDetails/junkRemoval/JunkRemovalPackageSection';
import JunkServicePackages from '@/components/servicingDetails/junkRemoval/JunkServicePackages';
import Navbar from '@/shared/Navbar';
import React from 'react';

const page = () => {
    return (
        <div>
            <div>
                <Navbar/>
            </div>
            <div>
                <JunkRemovalBanner/>
            </div>
            <div className='mt-32'>
              <JunkRemovalPackageSection/>
            </div>
            <div className='mt-32'>
            <JunkServicePackages/>
            </div>
            <div className='mt-32'>
              <JunkRemovalIncludedSection/>
            </div>
        </div>
    );
};

export default page;