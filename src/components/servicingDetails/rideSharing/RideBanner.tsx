"use client";
import React from "react";
import RideBannerForm from "./RideBannerForm";
import ridingBanner from "../../../../public/Images/ridingBanner.jpg";

const RideBanner = () => {
  return (
    <div
      className="w-full relative overflow-hidden"
      style={{
        height: "155vh",
        clipPath: "polygon(0 0, 100% 0, 100% 145vh, 0 155vh)",
        backgroundImage: `url(${ridingBanner.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Colored shade overlay */}
      <div className="absolute inset-0 bg-[#31295B]/80 z-10" />

      {/* Content Container */}
      <div className="relative z-20 flex justify-center items-center h-full w-full">
        <div className="flex items-center max-w-6xl mx-auto gap-16 px-6 w-full justify-center">
          {/* Left Text */}
          <div className="text-white w-[45%]">
            <button className="text-white px-5 py-2 bg-gradient-to-r from-[#FF860A] to-[#FF6E31] rounded-3xl font-bold">
              ⭐ PREMIUM SERVICE
            </button>
            <h1 className="text-6xl font-bold leading-snug mt-6">
              Modern <br />
              <span className="text-[#FF6E31]">Ride Sharing</span> <br />
              Services
            </h1>
            <p className="text-lg font-semibold mt-3">
              Reliable, affordable transportation services for all your needs.
              Get where you need to go with our network of trusted drivers.
            </p>
          </div>

          {/* Form */}
          <div className="w-[55%]">
            <RideBannerForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideBanner;
