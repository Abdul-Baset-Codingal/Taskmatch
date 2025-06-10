import IncludedInEveryMoveSection from "@/components/servicingDetails/movingService/IncludedInEveryMoveSection";
import MovingBanner from "@/components/servicingDetails/movingService/MovingBanner";
import MovingPackagesSection from "@/components/servicingDetails/movingService/MovingPackagesSection";
import MovingServicePackages from "@/components/servicingDetails/movingService/MovingServicePackages";
import Navbar from "@/shared/Navbar";
import React from "react";

const page = () => {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div>
        <MovingBanner />
      </div>
      <div className="mt-32">
        <MovingPackagesSection />
      </div>
      <div className="mt-32">
        <MovingServicePackages />
      </div>
      <div className="mt-32">
        <IncludedInEveryMoveSection />
      </div>
    </div>
  );
};

export default page;
