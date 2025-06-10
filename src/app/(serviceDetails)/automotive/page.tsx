import AutomotiveBanner from "@/components/servicingDetails/automotive/AutomotiveBanner";
import AutomotivePackageSection from "@/components/servicingDetails/automotive/AutomotivePackageSection";
import AutomotiveServicePackages from "@/components/servicingDetails/automotive/AutomotiveServicePackages";
import Navbar from "@/shared/Navbar";
import React from "react";

const page = () => {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div>
        <AutomotiveBanner/>
      </div>
      <div className="mt-32">
        <AutomotivePackageSection/>
      </div>
      <div className="mt-32">
        <AutomotiveServicePackages/>
      </div>
    </div>
  );
};

export default page;
