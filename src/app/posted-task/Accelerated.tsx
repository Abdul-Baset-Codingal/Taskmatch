import React from "react";

const Accelerated = () => {
  return (
    <div>
      <div className="w-4xl py-16 px-8 shadow-2xl border-t-[6px] border-amber-500 rounded-3xl bg-[#FFF6EB]">
        <div className="flex justify-center">
          <h2 className="text-[#FF7000] text-3xl font-bold">
            What Happens Next (Accelerated Process)
          </h2>
        </div>
        <div className="mt-10 flex flex-col items-start gap-7">
          <div className="flex  gap-6">
            <div className="bg-gradient-to-r from-[#FF9712] to-[#FFB12A] h-10 w-10 rounded-full flex items-center justify-center text-lg text-white font-bold">
              1
            </div>
            <div>
              <h2 className="text-lg font-bold">
                Immediate Tasker Notification
              </h2>
              <p className="mt-1">
                Qualified taskers are being notified right now via push
                notifications and priority alerts about your urgent request.
              </p>
            </div>
          </div>
          <div className="flex  gap-6">
            <div className="bg-gradient-to-r from-[#FF9712] to-[#FFB12A] h-10 w-10 rounded-full flex items-center justify-center text-lg text-white font-bold">
              2
            </div>
            <div>
              <h2 className="text-lg font-bold">Expedited Response Time</h2>
              <p className="mt-1">
                Expect to receive first responses within 10-15 minutes. Taskers
                with urgent availability will be prioritized.
              </p>
            </div>
          </div>
          <div className="flex  gap-6">
            <div className="bg-gradient-to-r from-[#FF9712] to-[#FFB12A] h-10 w-10 rounded-full flex items-center justify-center text-lg text-white font-bold">
              3
            </div>
            <div>
              <h2 className="text-lg font-bold">Quick Decision Timeline</h2>
              <p className="mt-1">
                Review offers as they arrive and select a tasker as quickly as
                possible to maintain urgent priority status.
              </p>
            </div>
          </div>
          <div className="flex  gap-6">
            <div className="bg-gradient-to-r from-[#FF9712] to-[#FFB12A] h-10 w-10 rounded-full flex items-center justify-center text-lg text-white font-bold">
              4
            </div>
            <div>
              <h2 className="text-lg font-bold">Same-Day Task Completion</h2>
              <p className="mt-1">
                Your urgent task is expected to be completed today. Payment will
                be processed securely after completion.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full bg-[#FEE7D4] p-4 flex items-center border-l-4 border-[#FF7000] rounded-2xl mt-10">
          <div className=" flex flex-col items-center ">
            <p className="text-[#FF7000] font-bold">
              URGENT Status Tip:{" "}
              <span className="text-black font-normal text-normal">
                Check your notifications frequently. Most urgent tasks receive
                their first offer within 10 minutes!
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accelerated;
