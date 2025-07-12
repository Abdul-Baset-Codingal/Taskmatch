/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import BannerCard from "./BannerCard";
import { FaSpa, FaCalendarAlt } from "react-icons/fa";
import FindTaskersModal from "./FindTaskersModal";
import { FaPlusCircle, FaSearch } from "react-icons/fa";
import Link from "next/link";
const Banner = () => {
  const [clipPath, setClipPath] = useState(
    "polygon(0 0, 100% 0, 100% 210vh, 0 220vh)"
  );
  const [height, setHeight] = useState("120vh");
  const [showOptions, setShowOptions] = useState(false);
  const [option, setOption] = useState<"urgent" | "scheduled" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    const updateClipPath = () => {
      if (window.innerWidth < 768) {
        setClipPath("polygon(0 0, 100% 0, 100% 190vh, 0 200vh)");
        setHeight("200vh");
      } else {
        setClipPath("polygon(0 0, 100% 0, 100% 210vh, 0 120vh)");
        setHeight("120vh");
      }
    };

    updateClipPath();
    window.addEventListener("resize", updateClipPath);
    return () => window.removeEventListener("resize", updateClipPath);
  }, []);

  const handleToggle = () => {
    setShowOptions(!showOptions);
    setOption(null);
  };

  return (
    <div
      className="w-full bg-[#16161A] relative overflow-hidden"
      style={{ height: height, clipPath: clipPath }}
    >
      {/* Bubble Top Left */}
      <div className="absolute z-10 w-[450px] h-[450px] bg-purple-950 opacity-30 rounded-full top-[-60px] left-[-60px] blur-3xl animate-bubbleFloat"></div>
      {/* Bubble Bottom Right */}
      <div className="absolute z-10 w-[400px] h-[400px] bg-green-950 opacity-30 rounded-full bottom-[-80px] right-[80px] blur-2xl animate-bubbleFloat"></div>

      {/* Content Container */}
      <div className="relative z-20 flex justify-center items-center h-full w-full">
        <div className="flex items-center max-w-6xl mx-auto gap-16 w-full justify-center flex-col lg:flex-row px-4">
          {/* Left Text */}
          <div className="text-white max-w-lg">
            <div className="space-y-3">
              {/* Glass background small text */}
              <div className="inline-block px-4 py-1 text-lg rounded-full backdrop-blur-md bg-white/10 border border-white/20  font-medium text-white shadow">
                🍁 We are proudly Canadian
              </div>

              {/* Main heading */}
              <h1 className="text-6xl font-bold leading-snug text-white">
                Need a hand, eh?
                <br />
                We've got you covered.
              </h1>

              {/* Paragraph */}
              <p className="text-lg font-semibold mt-3 text-white">
                Your trusted local service network
              </p>
            </div>


            {/* Search Bar */}
            <div className="mt-6 relative w-full max-w-md">
              <input
                type="text"
                placeholder="what pet service do you need?"
                className="w-full rounded-full py-3 px-5 pr-32 bg-[#252531] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="absolute top-1/2 right-0 -translate-y-1/2 bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition cursor-pointer tranform hover:scale-110 duration-500"
              >
                Search
              </button>
            </div>
            <div className="flex justify-center mt-12">
              <p className="text-white font-bold mr-16">Choose an option:</p>
            </div>

            <div className="max-w-md mt-4">
              <button
                onClick={handleToggle}
                className="flex items-center justify-center gap-2 text-white w-full font-bold bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] px-6 py-3 rounded-4xl hover:shadow-lg hover:shadow-[#8560F1] hover:-translate-y-1 transform transition duration-300 cursor-pointer"
              >
                <FaPlusCircle className="text-white text-lg" />
                Post a Task
              </button>

              {!showOptions && (
                <div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 text-white w-full mt-5 bg-gradient-to-r from-[#FF8906] to-[#FF8906] px-6 py-3 font-bold rounded-4xl hover:shadow-lg hover:shadow-[#FF8906] hover:-translate-y-1 transform transition duration-300 cursor-pointer"
                  >
                    <FaSearch className="text-white text-lg" />
                    Find a Tasker
                  </button>
                  <FindTaskersModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                </div>
              )}
              {showOptions && (
                <div className="flex flex-col gap-4 mt-5">
                  <Link href={'/urgent-task'}>
                    <div
                      onClick={() => setOption("urgent")}
                      className="flex items-start gap-4 bg-[#252531] p-4 rounded-2xl cursor-pointer hover:shadow-lg transition"
                    >
                      <FaSpa className="text-pink-500 text-xl mt-1" />
                      <div>
                        <h4 className="font-semibold capitalize text-white">Urgent</h4>
                        <p className="text-sm text-gray-400">
                          Get pampered as soon as possible
                        </p>
                      </div>
                    </div>
                  </Link>
                  <div
                    onClick={() => setOption("scheduled")}
                    className="flex items-start gap-4 bg-[#252531] p-4 rounded-2xl cursor-pointer hover:shadow-lg transition"
                  >
                    <FaCalendarAlt className="text-pink-500 text-xl mt-1" />
                    <div>
                      <h4 className="font-semibold capitalize text-white">Scheduled</h4>
                      <p className="text-sm text-gray-400">
                        Pick a suitable date and time
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center mt-2">
              <p className="text-white text-sm mr-16">
                Choose the option that works best for you
              </p>
            </div>
          </div>

          <div>
            <BannerCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;