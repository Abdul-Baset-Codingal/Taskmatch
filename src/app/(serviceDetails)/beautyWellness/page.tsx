import BeautyBanner from "@/components/servicingDetails/beautyWellness/BeautyBanner";
import BeautyWellnessPackageSection from "@/components/servicingDetails/beautyWellness/BeautyWellnessPackageSection";
import BeautyWellnessServicePackages from "@/components/servicingDetails/beautyWellness/BeautyWellnessServicePackages";
import WellnessIncludedSection from "@/components/servicingDetails/beautyWellness/WellnessIncludedSection";
import Navbar from "@/shared/Navbar";
import React from "react";

const page = () => {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div>
        <BeautyBanner />
      </div>
      <div className="mt-32">
        <BeautyWellnessPackageSection />
      </div>
      <div className="mt-32">
        <BeautyWellnessServicePackages />
      </div>
      <div className="mt-32"> 
        <WellnessIncludedSection/>
      </div>
    </div>
  );
};

export default page;
