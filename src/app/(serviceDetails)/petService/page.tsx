import AllPetCareServices from "@/components/servicingDetails/petService/AllPetCareServices";
import CarePackageCards from "@/components/servicingDetails/petService/CarePackageCards";
import PetCareSection from "@/components/servicingDetails/petService/PetCareSection";
import PetCareSpecialists from "@/components/servicingDetails/petService/PetCareSpecialists";
import PetServiceBanner from "@/components/servicingDetails/petService/PetServiceBanner";
import PetServiceCards from "@/components/servicingDetails/petService/PetServiceCards";
import SpecialistCardsGrid from "@/components/servicingDetails/petService/SpecialistCardsGrid";
import Navbar from "@/shared/Navbar";
import React from "react";

const page = () => {
  return (
    <div className="bg-[#F3F6FF]">
      <div>
        <Navbar />
      </div>
      <div>
        <PetServiceBanner />
      </div>
      <div className="mt-24">
        <PetCareSection />
      </div>
      <div className="mt-14">
        <PetServiceCards />
      </div>
      <div className="mt-24">
        <PetCareSpecialists />
      </div>
      <div className="mt-12">
        <SpecialistCardsGrid />
      </div>
      <div className="mt-[150px]">
        <AllPetCareServices />
      </div>
      <div className="mt-24">
        <CarePackageCards />
      </div>
    </div>
  );
};

export default page;
