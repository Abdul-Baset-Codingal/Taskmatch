"use client";
import React, { useState } from "react";
import { FiClock } from "react-icons/fi";
import { MdReportProblem } from "react-icons/md";
import { MdCancel } from "react-icons/md";
import { MdCheckCircle } from "react-icons/md";
import CancelModal from "./CancelModal";
import ConfirmTaskModal from "./ConfirmTaskModal";

const taskInfo = [
  { title: "TASK ID", value: "#T47291" },
  { title: "TASK TYPE", value: "Plumbing Repair" },
  { title: "ADDRESS", value: "123 Main St, Toronto, ON" },
  { title: "PRICE", value: "$120.00" },
];

const TrackTask = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  return (
    <div>
      <div className="flex justify-center mt-6 md:mt-10 px-4 sm:px-6">
        <div className="flex flex-col items-center max-w-6xl w-full gap-6 md:gap-8 shadow-2xl py-6 md:py-10 px-4 sm:px-6 md:px-8">
          {/* Task Details Header */}
          <div className="w-full">
            <h2 className="text-xl md:text-2xl font-semibold">Task Details</h2>
            <div className="flex rounded-md h-[3px] md:h-[4px] w-[60px] md:w-[70px] bg-[#8560F1] mt-1 md:mt-2"></div>
          </div>

          {/* Task Info Cards */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 py-4 md:py-6 w-full">
            {taskInfo.map((info, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg md:rounded-xl p-4 md:p-6 border border-gray-100 hover:border-t-2 md:hover:border-t-4 hover:border-[#8560F1] hover:bg-[#E0E7FF] transition-all"
              >
                <h3 className="text-sm md:text-base text-gray-500 font-semibold">
                  {info.title}
                </h3>
                <p className="font-semibold text-sm md:text-[16px] mt-1">
                  {info.value}
                </p>
              </div>
            ))}
          </div>

          {/* Task Description */}
          <div className="mt-2 md:mt-3 h-auto w-full bg-[#F4F7FF] rounded-xl md:rounded-2xl border-l-2 md:border-l-4 border-[#8560F1] p-4 md:p-6 lg:p-8">
            <p className="text-sm md:text-base text-gray-600">
              Bathroom pipe burst with active water leak. Need immediate help to
              stop water and assess damage. Water is coming from under the sink
              and spreading across the floor. I&#39;ve turned off the main water
              valve for now.
            </p>
          </div>

          {/* Task Progress Header */}
          <div className="w-full mt-4 md:mt-6">
            <h2 className="text-xl md:text-2xl font-semibold">Task Progress</h2>
            <div className="flex rounded-md h-[3px] md:h-[4px] w-[60px] md:w-[70px] bg-[#8560F1] mt-1 md:mt-2"></div>
          </div>

          {/* Progress Card */}
          <div className="mt-2 md:mt-3 h-auto w-full bg-[#E0E7FF] rounded-xl md:rounded-2xl border-l-2 md:border-l-4 border-[#8560F1] p-4 md:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white p-2 text-xl md:text-2xl flex-shrink-0">
                🚗
              </div>
              <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-5">
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-[#3730A3]">
                    Tasker is En Route
                  </h2>
                  <p className="text-sm md:text-base text-gray-600 mt-1">
                    John has accepted your task and is on the way to your
                    location. You can track their progress on the map and
                    contact them if needed.
                  </p>
                </div>
                <button className="flex items-center justify-center gap-2 bg-white text-[#3730A3] font-medium w-full md:w-[160px] py-2 px-3 md:pl-3 shadow-sm rounded-3xl text-sm md:text-base">
                  <FiClock className="text-[#3730A3]" />
                  ETA: 15 min
                </button>
              </div>
            </div>
          </div>

          {/* Task Timeline Header */}
          <div className="w-full mt-6 md:mt-10">
            <h2 className="text-xl md:text-2xl font-semibold">Task Timeline</h2>
            <div className="flex rounded-md h-[3px] md:h-[4px] w-[60px] md:w-[70px] bg-[#8560F1] mt-1 md:mt-2"></div>
          </div>

          {/* Timeline */}
          <div className="mt-6 md:mt-10 w-full">
            <div className="flex flex-col space-y-6 md:space-y-10 relative">
              {/* Timeline Step 1 */}
              <div className="flex items-start w-full">
                <div className="w-24 md:w-32 text-right pr-3 md:pr-4">
                  <p className="text-sm md:text-base text-gray-500 font-semibold">
                    3:30 PM
                  </p>
                  <p className="text-xs text-gray-400 font-semibold">(now)</p>
                </div>
                <div className="relative">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-[#8560F1] rounded-full z-10 border-2 border-white shadow"></div>
                  <div className="absolute top-3 md:top-4 left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-300"></div>
                </div>
                <div className="ml-4 md:ml-6 bg-[#E0E7FF] border-l-2 md:border-l-4 border-[#8560F1] p-3 md:p-5 rounded-lg md:rounded-xl w-full">
                  <h3 className="text-base md:text-lg font-bold">
                    Tasker En Route
                  </h3>
                  <p className="text-sm md:text-base text-gray-600">
                    John is on the way to your location. Estimated arrival in 15
                    minutes.
                  </p>
                </div>
              </div>

              {/* Timeline Step 2 */}
              <div className="flex items-start w-full">
                <div className="w-24 md:w-32 text-right pr-3 md:pr-4">
                  <p className="text-sm md:text-base font-semibold text-gray-500">
                    3:25 PM
                  </p>
                  <p className="text-xs font-semibold text-gray-400">
                    (5 minutes ago)
                  </p>
                </div>
                <div className="relative">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-[#10B981] rounded-full z-10 border-2 border-white shadow"></div>
                  <div className="absolute top-3 md:top-4 left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-300"></div>
                </div>
                <div className="ml-4 md:ml-6 bg-[#E7F8F2] border-l-2 md:border-l-4 border-[#10B981] p-3 md:p-5 rounded-lg md:rounded-xl w-full">
                  <h3 className="text-base md:text-lg font-bold">
                    Tasker Confirmed Tools
                  </h3>
                  <p className="text-sm md:text-base text-gray-600">
                    John has all required equipment and materials for your task.
                  </p>
                </div>
              </div>

              {/* Timeline Step 3 */}
              <div className="flex items-start w-full">
                <div className="w-24 md:w-32 text-right pr-3 md:pr-4">
                  <p className="text-sm md:text-base font-semibold text-gray-500">
                    3:15 PM
                  </p>
                  <p className="text-xs font-semibold text-gray-400">
                    (15 minutes ago)
                  </p>
                </div>
                <div className="relative">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-[#10B981] rounded-full z-10 border-2 border-white shadow"></div>
                  <div className="absolute top-3 md:top-4 left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-300"></div>
                </div>
                <div className="ml-4 md:ml-6 bg-[#E7F8F2] border-l-2 md:border-l-4 border-[#10B981] p-3 md:p-5 rounded-lg md:rounded-xl w-full">
                  <h3 className="text-base md:text-lg font-bold">
                    Tasker Accepted
                  </h3>
                  <p className="text-sm md:text-base text-gray-600">
                    John accepted your task and confirmed he&#39;s available.
                  </p>
                </div>
              </div>

              {/* Timeline Step 4 */}
              <div className="flex items-start w-full">
                <div className="w-24 md:w-32 text-right pr-3 md:pr-4">
                  <p className="text-sm md:text-base font-semibold text-gray-500">
                    3:00 PM
                  </p>
                  <p className="text-xs font-semibold text-gray-400">
                    (30 minutes ago)
                  </p>
                </div>
                <div className="relative">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-[#10B981] rounded-full z-10 border-2 border-white shadow"></div>
                </div>
                <div className="ml-4 md:ml-6 bg-[#E7F8F2] border-l-2 md:border-l-4 border-[#10B981] p-3 md:p-5 rounded-lg md:rounded-xl w-full">
                  <h3 className="text-base md:text-lg font-bold">
                    Task Posted
                  </h3>
                  <p className="text-sm md:text-base text-gray-600">
                    You posted your urgent plumbing repair task.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end items-center w-full mt-6 md:mt-10">
            <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 w-full sm:w-auto">
              {/* Report Issue */}
              <button className="flex items-center justify-center gap-2 px-4 md:px-6 py-2 cursor-pointer border rounded-3xl border-gray-200 text-[#3730A3] font-semibold w-full sm:w-auto text-sm md:text-base">
                <MdReportProblem className="text-lg md:text-xl" />
                Report an Issue
              </button>

              {/* Cancel Task */}
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center justify-center gap-2 px-4 md:px-6 py-2 cursor-pointer border rounded-3xl border-red-200 text-red-400 font-semibold w-full sm:w-auto text-sm md:text-base"
              >
                <MdCancel className="text-lg md:text-xl" />
                Cancel Task
              </button>

              {/* Confirm Completion */}
              <button
                onClick={() => setConfirmModal(true)}
                className="flex items-center justify-center gap-2 px-4 md:px-6 py-2 cursor-pointer border rounded-3xl bg-[#3730A3] text-white font-semibold w-full sm:w-auto text-sm md:text-base"
              >
                <MdCheckCircle className="text-lg md:text-xl" />
                Confirm Task Completion
              </button>

              {/* Modals */}
              <CancelModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
              />
              <ConfirmTaskModal
                confirmModalOpen={confirmModal}
                confirmModalClose={() => setConfirmModal(false)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackTask;
