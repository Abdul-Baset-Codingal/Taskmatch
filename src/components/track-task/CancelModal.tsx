import React from "react";
import { MdCheckCircle, MdClose, MdOutlineCancel } from "react-icons/md";

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CancelModal: React.FC<CancelModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* Modal */}
      <div className="bg-white w-11/12 max-w-lg rounded-2xl relative shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-4 right-4 text-white hover:text-red-400 transition z-10 bg-black/30 p-2 rounded-full backdrop-blur-md"
        >
          <MdClose size={22} />
        </button>

        <div className="flex justify-center text-center bg-gradient-to-r from-[#F49D0B] to-[#DB7906] pt-6 ">
          <div>
            <h2 className="text-2xl  mb-2 text-white font-bold">
              Task Cancellation
            </h2>
            <p className="mb-12 text-sm text-white">
              Please review the cancellation details below
            </p>
            <div className="flex justify-center items-center text-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center absolute top-24 shadow-2xl ">
                <p className="text-3xl relative bottom-1">⚠️</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 mb-4 p-4 mt-8 mx-2">
          <div>
            <h3 className="font-semibold">Cancellation Fee Will Apply</h3>
            <p className="text-gray-600 text-sm">
              Since your tasker is already en route, cancelling this task will
              incur the following charges:
            </p>
          </div>
        </div>

        <div className="bg-[#FEF3C7] border border-[#DB7906] p-4 rounded-lg mb-4 mx-6">
          <p className="font-semibold">Cancellation Fee:</p>
          <p className="text-lg text-red-500 font-bold">$35.00</p>
          <p className="text-sm text-gray-600">(35% of task price)</p>
          <p className="text-gray-600 text-sm mt-2">
            This covers tasker&#39;s travel time and preparation costs.
          </p>
        </div>

        <div className="mb-6 p-6">
          <h4 className="font-semibold mb-2">Cancellation Policy</h4>
          <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
            <li>
              Cancellations after a tasker has been assigned incur a fee based
              on task progress
            </li>
            <li>
              Tasks cancelled when a tasker is en route are subject to a higher
              fee
            </li>
            <li>
              Full refunds are only available before a tasker has been assigned
            </li>
          </ul>
        </div>

        <p className="text-gray-600 text-sm mb-6 px-6">
          The cancellation fee will be charged to your payment method on file.
        </p>

        <div className="flex justify-end gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-5 py-2 font-bold cursor-pointer rounded-3xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            <MdCheckCircle className="text-lg" />
            Keep Task
          </button>

          <button
            onClick={() => {
              onClose();
            }}
            className="flex items-center gap-2 px-5 py-2 cursor-pointer font-bold rounded-3xl bg-[#F49D0B] text-white hover:bg-[#DB7906] transition"
          >
            <MdOutlineCancel className="text-lg" />
            Confirm Cancellation
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelModal;
