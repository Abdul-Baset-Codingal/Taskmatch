import React from "react";
import Image from "next/image";

const HowTaskMatchWorks = () => {
  const steps = [
    {
      title: "Get Started Your Way",
      description: (
        <>
          Choose how you want to begin:
          <br />
          <span className="text-[#109C3D] font-semibold">Post a Task</span> — Describe what you need and let Taskers apply.
          <br />
          <span className="text-[#109C3D] font-semibold">Book a Tasker</span> — Pick your favorite Tasker directly and lock them in.
          <br />
          <span className="text-[#109C3D] font-semibold">Request a Quote</span> — Compare prices before deciding.
        </>
      ),
    },
    {
      title: "Choose Your Helper",
      description: (
        <>
          Browse trusted <span className="text-[#109C3D] font-semibold">TaskAllo Taskers</span> nearby.
          <br />
          View verified profiles, transparent pricing, and reviews to find the right fit for you.
        </>
      ),
    },
    {
      title: "Get It Done — Your Way",
      description: (
        <>
          Your task gets completed in person or remotely — whichever works best for you.
          <br />
          Enjoy <span className="text-[#109C3D] font-semibold">flexible options</span>, real-time updates, and reliable service.
        </>
      ),
    },
    {
      title: "Pay Seamlessly",
      description: (
        <>
          Complete your task and pay securely with confidence.
          <br />
          Enjoy cash-free payments and the <span className="text-[#109C3D] font-semibold">TaskAllo Happiness.</span>.
        </>
      ),
    },
  ];

  return (
    <div className="relative w-full min-h-[700px] flex justify-center items-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="/Images/taskMatch works.jpg"
        alt="TaskMatch banner"
        fill
        sizes="100vw"
        priority
        className="object-cover"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#063A41]/95 via-[#063A41]/85 to-[#063A41]/95"></div>
      {/* Content */}
      <div className="relative z-10 w-[1300px] max-w-[95%] text-white text-center px-5 py-16">
        <h2 className="text-sm tracking-wide">
          How TaskAllo Works
        </h2>
        <div className="flex justify-center mt-2">
          <div className="flex rounded-md justify-center h-[4px] w-[60px] md:w-[70px] bg-white mb-5"></div>
        </div>
        <div className="flex justify-center">
          <h2 className="mb-12 text-4xl text-center  max-w-3xl font-nunito font-bold">Finding help shouldn&apos;t be hard. We&lsquo;ve made the process simple and
            secure.</h2>
        </div>
        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-md border border-white/10 p-7 rounded-3xl text-left shadow-xl hover:shadow-[#109C3D]/40 hover:-translate-y-2 transition-all duration-500"
            >
              <h3 className="text-3xl font-semibold mb-3 text-white">
                {step.title}
              </h3>
              <p className="text-white/90 leading-relaxed text-[16.5px] font-light tracking-wide">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowTaskMatchWorks;

