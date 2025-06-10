import React from "react";
import FamilyCareBookingForm from "./FamilyCareBookingForm";

const FamilyCareBanner = () => {
  return (
    <div
      className="w-full bg-[#16161A] relative overflow-hidden"
      style={{
        height: "220vh",
        clipPath: "polygon(0 0, 100% 0, 100% 210vh, 0 220vh)",
      }}
    >
      {/* Bubble Top Left */}
      <div className="absolute z-10 w-[450px] h-[450px] bg-purple-950 opacity-30 rounded-full top-[-60px] left-[-60px] blur-3xl animate-bubbleFloat"></div>

      {/* Bubble Bottom Right */}
      <div className="absolute z-10 w-[400px] h-[400px] bg-green-950 opacity-30 rounded-full bottom-[-80px] right-[80px] blur-2xl animate-bubbleFloat"></div>

      {/* Content Container */}
      <div className="relative z-20 flex justify-center items-center h-full w-full">
        <div className="flex items-center max-w-6xl mx-auto gap-16  w-full justify-center">
          {/* Left Text */}
          <div className="text-white max-w-lg">
            <h1 className="text-6xl font-bold leading-snug">
              Compassionate <br />
              <span className="bg-gradient-to-r from-[#FF8609] to-[#FF6C32] text-transparent bg-clip-text">
                FamilyCare Services{" "}
              </span>
            </h1>
            <p className="text-lg font-semibold mt-3">
              Dedicated caregivers and health professionals focused on providing
              nurturing, reliable, and personalized care for every member of
              your family.
            </p>

            <div className="flex flex-col md:flex-row gap-6 mt-10">
              {/* Card 1 - Rating */}
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-md w-full md:w-1/2">
                <div className="text-yellow-400 text-3xl">⭐</div>
                <div>
                  <h3 className="text-white font-bold text-lg">4.9/5 Rating</h3>
                  <p className="text-white/80 text-sm">
                    Based on 2,500+ reviews
                  </p>
                </div>
              </div>

              {/* Card 2 - Guarantee */}
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-md w-full md:w-1/2">
                <div className="text-green-400 text-3xl">✓</div>
                <div>
                  <h3 className="text-white font-bold text-lg">
                    100% Guaranteed
                  </h3>
                  <p className="text-white/80 text-sm">
                    Satisfaction or free reclean
                  </p>
                </div>
              </div>
            </div>
            {/* buttons */}
            <div>
              <div className="mt-6 flex items-center gap-5">
                <button className="text-white text-lg bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] px-10 py-5 font-semibold rounded-4xl  hover:shadow-lg hover:shadow-[#8560F1] hover:-translate-y-1 transform transition duration-300 cursor-pointer">
                  Book Now
                </button>
                <button className="text-white text-lg bg-transparent border border-[#28B584] px-10 py-5 font-semibold rounded-4xl  hover:shadow-lg hover:shadow-[#28B584] hover:-translate-y-1 transform transition duration-300 cursor-pointer">
                  View Pricing
                </button>
              </div>
            </div>
          </div>
          <div>
            <FamilyCareBookingForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyCareBanner;
