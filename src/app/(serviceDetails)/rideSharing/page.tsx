import GetMobileApp from "@/components/servicingDetails/rideSharing/GetMobileApp";
import PromoCard from "@/components/servicingDetails/rideSharing/PromoCard";
import RideAdvertise from "@/components/servicingDetails/rideSharing/RideAdvertise";
import RideBanner from "@/components/servicingDetails/rideSharing/RideBanner";
import Navbar from "@/shared/Navbar";
import React from "react";

const page = () => {
  return (
    <div className="bg-[#F0F3FF]">
      <div>
        <Navbar />
      </div>
      <div>
        <RideBanner />
      </div>
      <div className="mt-28">
        <GetMobileApp />
      </div>
      <div className="mt-28">
        <PromoCard />
      </div>
        <div className="mt-28">
        <RideAdvertise />
      </div>
    </div>
  );
};

export default page;
