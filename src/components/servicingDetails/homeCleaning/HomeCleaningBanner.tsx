"use client";
import React, { useEffect, useState } from "react";
import CleaningBookingForm from "./CleaningBookingForm";

const HomeCleaningBanner = () => {
  const [clipPath, setClipPath] = useState(
    "polygon(0 0, 100% 0, 100% 200vh, 0 210vh)"
  );

  useEffect(() => {
    const updateClipPath = () => {
      if (window.innerWidth < 768) {
        // For small devices (below md breakpoint)
        setClipPath("polygon(0 0, 100% 0, 100% 350vh, 0 350vh)");
      } else {
        // For medium and larger devices
        setClipPath("polygon(0 0, 100% 0, 100% 200vh, 0 210vh)");
      }
    };

    updateClipPath(); // initial check

    window.addEventListener("resize", updateClipPath);
    return () => window.removeEventListener("resize", updateClipPath);
  }, []);

  return (
    <div
      className="w-full bg-[#16161A] relative overflow-hidden"
      style={{
        height: "auto",
        clipPath: clipPath,
      }}
    >
      {/* ... rest of your component */}
      {/* Bubble Top Left */}
      <div className="absolute z-10 w-[350px] h-[350px] bg-purple-950 opacity-30 rounded-full top-[-60px] left-[-60px] blur-3xl animate-bubbleFloat"></div>

      {/* Bubble Bottom Right */}
      <div className="absolute z-10 w-[300px] h-[300px] bg-green-950 opacity-30 rounded-full bottom-[-80px] right-[40px] blur-2xl animate-bubbleFloat"></div>

      {/* Content Container */}
      <div className="relative z-20 flex justify-center items-center w-full px-4 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto w-full">
          {/* Left Text Section */}
          <div className="text-white w-full max-w-xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight md:leading-snug text-center lg:text-left">
              Get Your Home <br />
              <span className="bg-gradient-to-r from-[#FF8609] to-[#FF6C32] text-transparent bg-clip-text">
                Pet Care Services
              </span>
            </h1>

            <p className="text-base sm:text-lg font-medium mt-4 text-center lg:text-left text-white/80">
              Book trusted professionals who will make your home shine while you
              focus on what matters most.
            </p>

            {/* Info Cards */}
            <div className="flex flex-col sm:flex-row gap-6 mt-8">
              {/* Card 1 */}
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-5 rounded-2xl shadow-md w-full sm:w-1/2">
                <div className="text-yellow-400 text-3xl">⭐</div>
                <div>
                  <h3 className="text-white font-semibold text-base sm:text-lg">
                    4.9/5 Rating
                  </h3>
                  <p className="text-white/70 text-sm">
                    Based on 2,500+ reviews
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-5 rounded-2xl shadow-md w-full sm:w-1/2">
                <div className="text-green-400 text-3xl">✓</div>
                <div>
                  <h3 className="text-white font-semibold text-base sm:text-lg">
                    100% Guaranteed
                  </h3>
                  <p className="text-white/70 text-sm">
                    Satisfaction or free reclean
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
              <button className="text-white text-base sm:text-lg bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] px-8 py-4 rounded-3xl font-semibold hover:shadow-lg hover:shadow-[#8560F1] hover:-translate-y-1 transform transition duration-300">
                Book Now
              </button>
              <button className="text-white text-base sm:text-lg border border-[#28B584] px-8 py-4 rounded-3xl font-semibold hover:shadow-lg hover:shadow-[#28B584] hover:-translate-y-1 transform transition duration-300">
                View Pricing
              </button>
            </div>
          </div>

          {/* Right Form Section */}
          <div className="w-full max-w-xl">
            <CleaningBookingForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeCleaningBanner;
