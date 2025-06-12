import Link from "next/link";
import React from "react";

const Step5 = () => {
  const summary = [
    { label: "Title", value: "Help Moving Furniture" },
    { label: "Category", value: "Moving" },
    {
      label: "Location",
      value: "At my place - 123 Main St, Toronto, ON M5V 2K7",
    },
    { label: "Date & Time", value: "April 25, 2023 - Morning (8am-12pm)" },
    { label: "Budget", value: "$200 total" },
    {
      label: "Description",
      value:
        "Need help moving a sofa, bed, and dining table from my apartment to a new home about 5km away. I'll need someone with a truck who can help load, transport, and unload the furniture.",
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <h2 className="text-2xl md:text-4xl font-semibold text-[#8560F1] flex items-center gap-2">
        <span className="ml-2 md:ml-3 mb-1">✅ Step 5: Review &amp; Post</span>
      </h2>

      <div className="mt-6 md:mt-8">
        <h2 className="text-xl md:text-2xl font-semibold text-[#8560F1]">
          Task Summary
        </h2>
        <div className="h-[4px] w-[60px] mt-2 bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] rounded"></div>

        <div className="mt-6 space-y-6 bg-[#F9F8FF] p-4 md:p-6 rounded-2xl shadow">
          {summary.map(({ label, value }, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-start sm:gap-2"
            >
              <div className="flex items-center gap-2">
                <p className="text-[#72757E] font-bold">{label}</p>
                <span className="w-2 h-2 bg-[#8560F1] rounded-full"></span>
              </div>
              <p className="text-[#72757E] mt-2 sm:mt-0">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 md:mt-8 bg-[#F4F7FF] rounded-2xl border-l-4 border-[#8560F1] p-4 md:p-8">
        <div className="flex items-start gap-3">
          <input type="checkbox" className="w-5 h-5 accent-[#8560F1] mt-1" />
          <p className="text-[#72757E] font-medium text-sm md:text-base">
            I agree to TaskMatch&#39;s{" "}
            <span className="text-[#8560F1] underline cursor-pointer">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-[#8560F1] underline cursor-pointer">
              Privacy Policy
            </span>
            . I understand that my personal information will be processed as
            described in the Privacy Policy.
          </p>
        </div>
      </div>

      <Link href={'/track-task'}>
        <button className="w-full py-4 md:py-5 bg-[#8560F1] mt-6 md:mt-8 rounded-2xl text-white font-semibold text-base md:text-lg shadow-md hover:bg-[#6F3DE9] transition duration-300">
          Post My Task
        </button>
      </Link>

      <div className="mt-6 md:mt-8 flex flex-col items-center text-center space-y-4">
        <p className="text-[#72757E] font-medium text-sm md:text-base">
          By posting this task, you&#39;ll receive offers from taskers in your
          area who can help you get it done.
        </p>
        <p className="text-[#8560F1] font-medium text-base md:text-lg">
          Ready to get your task done? 🚀
        </p>
      </div>
    </div>
  );
};

export default Step5;
