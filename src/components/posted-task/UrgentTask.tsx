import React from "react";

const UrgentTask = () => {
  return (
    <div>
      <div className="w-4xl py-16 px-8 shadow-2xl border-t-[6px] border-amber-500 rounded-3xl bg-white">
        <div className="flex justify-center ">
          <div className="flex justify-center flex-col">
            <h2 className="text-[#FF7000] text-3xl font-bold">
              Your Urgent Task Stats
            </h2>
            <p className="mt-3 ">
              Real-time metrics for your high-priority moving task
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-10">
          {/* Card 1 */}
          <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center">
            <div className="bg-[#FF7000] rounded-full p-4 mb-4">
              <span className="text-white text-2xl">👥</span>
            </div>
            <div className="text-5xl font-bold text-[#FF7000]">22</div>
            <div className="text-gray-500 mt-1 text-center">
              Taskers currently active
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center">
            <div className="bg-[#FF7000] rounded-full p-4 mb-4">
              <span className="text-white text-2xl">🚚</span>
            </div>
            <div className="text-5xl font-bold text-[#FF7000]">15</div>
            <div className="text-gray-500 mt-1 text-center">
              Moving specialists nearby
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center">
            <div className="bg-[#FF7000] rounded-full p-4 mb-4">
              <span className="text-white text-2xl">⭐</span>
            </div>
            <div className="text-5xl font-bold text-[#FF7000]">4.8</div>
            <div className="text-gray-500 mt-1 text-center">
              Avg. tasker rating in your area
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center">
            <div className="bg-[#FF7000] rounded-full p-4 mb-4">
              <span className="text-white text-2xl">⏱️</span>
            </div>
            <div className="text-5xl font-bold text-[#FF7000]">10</div>
            <div className="text-gray-500 mt-1 text-center">
              Average urgent response time
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrgentTask;
