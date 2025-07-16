"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import bannerImage1 from "../../../public/Images/bannerImage1.jpg";
import bannerImage2 from "../../../public/Images/bannerImage2.jpg";
import { FaStar } from "react-icons/fa";

const cardData = [
  {
    image: bannerImage1,
    name: "John Doe",
    text: `Professional plumbing service! Fixed my leaking pipes in record time and left everything spotless.`,
    rate: "$55/hr",
  },
  {
    image: bannerImage2,
    name: "Thomas D.",
    text: `Amazing carpenter! Thomas created custom shelving that perfectly fits our awkward space. Great attention to detail.`,
    rate: "$60/hr",
  },
];

const BannerCard = () => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); 
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % cardData.length); 
        setFade(true); 
      }, 700); 
    }, 4000); 

    return () => clearInterval(interval);
  }, []);

  const card = cardData[index];

  return (
    <div>
      <div
        className={`bg-[#252531] rounded-2xl p-8 max-w-md w-full shadow-lg transform ${
          fade
            ? "  opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
        } transition-all duration-500 ease-in-out`}
      >
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 relative border-4 border-white shadow-2xl shadow-purple-600 rounded-full overflow-hidden">
            <Image
              src={card.image}
              alt="Banner"
              fill
              className="object-cover"
            />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white">{card.name}</h2>
            <div className="flex items-center mt-1">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className="text-yellow-400 text-xs mr-[2px]"
                />
              ))}
              <span className="text-yellow-400 text-sm font-semibold">
                (48)
              </span>
            </div>
          </div>
        </div>

        <p className="text-gray-300 my-6 border-l-[3px] border-gray-600 pl-10 italic">
          &quot;{card.text}&quot;
        </p>

        <div className="mt-16">
          <hr className="border-gray-600" />
        </div>

        <div className="flex justify-between items-center mt-4">
          <div>
            <h2 className="text-3xl text-white font-bold">{card.rate}</h2>
            <div className="h-[3px] w-[30px] bg-[#FF8906] mt-2"></div>
          </div>
          <div>
            <button className="text-white text-lg bg-[#FF8906] px-6 py-3 font-semibold rounded-4xl  hover:shadow-lg hover:shadow-[#FF8906] hover:-translate-y-1 transform transition duration-300 cursor-pointer">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerCard;
