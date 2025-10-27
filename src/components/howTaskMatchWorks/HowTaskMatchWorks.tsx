// /* eslint-disable react/no-unescaped-entities */
// "use client";

// import React from "react";

// const cardData = [
//   {
//     title: "Get Started Your Way",
//     description: (
//       <div className="space-y-2">
//         <p className="text-gray-900 text-xs sm:text-sm md:text-base leading-relaxed">
//           Choose how you want to begin:
//         </p>
//         <div className="ml-2 space-y-1">
//           <p>
//             <span className="font-bold text1">Post a Task</span> → Describe what you need and let Helpers apply.
//           </p>
//           <p>
//             <span className="font-bold text1">Book a Tasker</span> → Pick your favorite Helper directly and lock them in.
//           </p>
//           <p>
//             <span className="font-bold text1">Request a Quote</span> → Compare prices before deciding.
//           </p>
//         </div>
//       </div>
//     ),
//   },
//   {
//     title: "Choose Your Helper",
//     description: (
//       <div className="space-y-2">
//         <p className="text-gray-900 text-xs sm:text-sm md:text-base leading-relaxed">
//           Browse trusted TaskAllo Helpers nearby.
//         </p>
//         <div className="ml-2 space-y-1">
//           <p>
//             <span className="font-bold">Verified profiles & background checks</span>
//           </p>
//           <p>
//             <span className="font-bold">Transparent pricing & reviews</span>
//           </p>
//           <p>
//             <span className="font-bold">Pick the Helper that fits your style</span>
//           </p>
//         </div>
//       </div>
//     ),
//   },
//   {
//     title: "Get It Done — Your Way",
//     description: (
//       <div className="space-y-2">
//         <p className="text-gray-900 text-xs sm:text-sm md:text-base leading-relaxed">
//           Your task gets completed in person or remotely depending on what works best.
//         </p>
//         <div className="ml-2 space-y-1">
//           <p>
//             <span className="font-bold">Flexible options: home visits or virtual support</span>
//           </p>
//           <p>
//             <span className="font-bold">Real-time updates & in-app chat</span>
//           </p>
//           <p>
//             <span className="font-bold">Reliable, skilled, and friendly service</span>
//           </p>
//         </div>
//       </div>
//     ),
//   },
//   {
//     title: "Pay Seamlessly",
//     description: (
//       <div className="space-y-2">
//         <p className="text-gray-900 text-xs sm:text-sm md:text-base leading-relaxed">
//           Complete the task and pay with confidence.
//         </p>
//         <div className="ml-2 space-y-1">
//           <p>
//             <span className="font-bold">Secure, cash-free payments</span>
//           </p>
//           <p>
//             <span className="font-bold">Rate & review your Helper</span>
//           </p>
//           <p>
//             <span className="font-bold">TaskAllo Happiness Guarantee</span>
//           </p>
//         </div>
//       </div>
//     ),
//   },
// ];

// const HowTaskMatchWorks = () => {
//   return (
//     <div
//       className="w-full relative overflow-hidden py-8 sm:py-14 md:py-20 px-4 sm:px-6 md:px-10 xl:px-20"
//     >
//       {/* Top-right bubble */}
//       <div className="absolute -top-12 -right-12 w-24 h-24 md:w-[250px] md:h-[250px] bg-white/30 rounded-full opacity-30"></div>

//       {/* Title Section */}
//       <div className="text-center max-w-3xl mx-auto">
//         <h2 className="text-gray-900 text-xl sm:text-3xl md:text-4xl font-bold">
//           How TaskAllo Works
//         </h2>
//         <div className="flex justify-center mt-2 sm:mt-3">
//           <div className="h-1.5 w-14 sm:w-20 md:w-24 color1 rounded-md" />
//         </div>
//         <p className="mt-3 text-gray-900 text-sm sm:text-base md:text-xl font-semibold">
//           Finding help shouldn't be hard. We've made the process simple and
//           secure.
//         </p>
//       </div>

//       {/* Cards Section */}
//       <div className="w-full px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid gap-6 sm:gap-8 justify-center grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
//             {cardData.map((card, index) => (
//               <div
//                 key={index}
//                 className="relative w-full max-w-[320px] mx-auto 
//                      backdrop-blur-lg bg-white/20 border border-white/30 
//                      rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 
//                      text-gray-900 hover:scale-105 transition-transform 
//                      duration-500 overflow-hidden"
//               >
//                 {/* Bubble effect */}
//                 <div className="absolute w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32 
//                           bg-white/20 rounded-full bottom-[-32px] right-[-32px] 
//                           opacity-50 z-0 transition-all duration-500"></div>

//                 {/* Card content */}
//                 <div className="relative z-10">
//                   {/* Hide big index on mobile */}
//                   <h2 className="hidden sm:block text-gray-600 text-4xl md:text-6xl font-bold leading-none">
//                     {index + 1}
//                   </h2>
//                   <h3 className="text-base sm:text-xl md:text-2xl font-bold mb-2 mt-2 sm:mt-4">
//                     {card.title}
//                   </h3>
//                   {card.description}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HowTaskMatchWorks;



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
          <span className="text-[#109C3D] font-semibold">Post a Task</span> — Describe what you need and let Helpers apply.
          <br />
          <span className="text-[#109C3D] font-semibold">Book a Tasker</span> — Pick your favorite Helper directly and lock them in.
          <br />
          <span className="text-[#109C3D] font-semibold">Request a Quote</span> — Compare prices before deciding.
        </>
      ),
    },
    {
      title: "Choose Your Helper",
      description: (
        <>
          Browse trusted <span className="text-[#109C3D] font-semibold">TaskAllo Helpers</span> nearby.
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
          Enjoy cash-free payments and the <span className="text-[#109C3D] font-semibold">TaskAllo Happiness Guarantee</span>.
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
        className="object-cover"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#063A41]/95 via-[#063A41]/85 to-[#063A41]/95"></div>

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

