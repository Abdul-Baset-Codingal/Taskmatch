import React, { useState } from "react";
import { MdClose, MdCheckCircle } from "react-icons/md";
import tasker from "../../../public/Images/clientImage2.jpg";
import Image from "next/image";

interface ConfirmModalProps {
  confirmModalOpen: boolean;
  confirmModalClose: () => void;
}

const ConfirmTaskModal: React.FC<ConfirmModalProps> = ({
  confirmModalOpen,
  confirmModalClose,
}) => {
  const [rating, setRating] = useState(0);
  const [tip, setTip] = useState<number | string>(0);
  const [customTip, setCustomTip] = useState("");
  const [feedback, setFeedback] = useState("");

  if (!confirmModalOpen) return null;

  return (
    <div className="fixed inset-0 rounded-2xl bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl relative shadow-xl max-h-[95vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={confirmModalClose}
          className="absolute top-4 right-4 cursor-pointer text-white hover:text-red-400 transition z-10 bg-black/30 p-2 rounded-full backdrop-blur-md"
        >
          <MdClose size={22} />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center bg-gradient-to-r from-[#4F46E3] to-[#3831A6] pt-6 pb-20 rounded-t-3xl relative">
          <h2 className="text-3xl font-bold text-white drop-shadow-md">Task Complete!</h2>
          <p className="text-sm text-white/80 mt-1">Your task has been successfully completed</p>
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl absolute -bottom-12 bg-white">
            <Image
              src={tasker}
              alt="Tasker"
              fill
              className="object-cover rounded-full"
              sizes="96px"
            />
          </div>
        </div>

        {/* Body */}
        <div className="mt-16 px-6 pb-6 space-y-6 text-gray-800 font-medium">
          {/* Rate Section */}
          <div>
            <h3 className="text-xl font-semibold text-center">Rate Your Experience</h3>
            <div className="flex gap-2 mt-3 justify-center">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  onClick={() => setRating(i)}
                  className={`text-3xl transition transform ${
                    i <= rating
                      ? "text-yellow-400 scale-110"
                      : "text-gray-300 hover:text-yellow-300"
                  } hover:scale-125 duration-300 ease-in-out`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Tip Section */}
          <div>
            <h3 className="text-xl font-semibold mb-3 text-center">Add a Tip (Optional)</h3>
            <div className="grid grid-cols-2 gap-3">
              {[10, 15, 20, 25].map((pct) => (
                <button
                  key={pct}
                  onClick={() => {
                    setTip(pct);
                    setCustomTip("");
                  }}
                  className={`py-2 px-4 rounded-xl border transition duration-300 font-semibold ${
                    tip === pct
                      ? "bg-gradient-to-r from-[#6D5DFB] to-[#4338CA] text-white shadow-md"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {pct}% (${((120 * pct) / 100).toFixed(0)})
                </button>
              ))}
              <input
                type="text"
                placeholder="Custom tip"
                value={customTip}
                onChange={(e) => {
                  setCustomTip(e.target.value);
                  setTip("custom");
                }}
                className="col-span-2 p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500 text-center">Based on task price: $120.00</p>
          </div>

          {/* Feedback Section */}
          <div>
            <h3 className="text-xl font-semibold mb-2 text-center">Share Your Feedback (Optional)</h3>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us about your experience with John..."
              className="w-full p-4 h-28 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none resize-none transition duration-300 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.3)]"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                // Handle submit logic here
                confirmModalClose();
              }}
              className="flex justify-center items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4F46E3] to-[#3730A3] text-white rounded-3xl font-semibold w-full shadow-lg hover:scale-105 hover:shadow-xl transition text-lg"
            >
              <MdCheckCircle className="text-2xl" />
              <span className="text-center">Submit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmTaskModal;
