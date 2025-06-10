import React from "react";
import Image from "next/image";
import client1 from "../../../public/Images/clientImage1.jpg";
import client2 from "../../../public/Images/clientImage2.jpg";
import client3 from "../../../public/Images/clientImage3.jpg";
import client4 from "../../../public/Images/clientImage4.jpg";
import client5 from "../../../public/Images/clientImage5.jpg";

const taskers = [
  {
    name: "David T.",
    image: client1,
    rating: 5.0,
    reviews: 48,
    role: "Moving Expert",
  },
  {
    name: "Mike C.",
    image: client2,
    rating: 4.8,
    reviews: 36,
    role: "Heavy Lifting",
  },
  {
    name: "Sarah J.",
    image: client3,
    rating: 4.9,
    reviews: 62,
    role: "Truck Owner",
  },
  {
    name: "Emily R.",
    image: client4,
    rating: 5.0,
    reviews: 27,
    role: "Furniture Assembly",
  },
  {
    name: "Leo W.",
    image: client5,
    rating: 4.9,
    reviews: 41,
    role: "Moving Team Lead",
  },
];

const EmergencyTaskers = () => {
  return (
    <div className="">
      <div className="w-4xl py-16 px-8 shadow-2xl border-t-[6px] border-amber-500 rounded-3xl bg-[#FFF6EC]">
        <div className="flex justify-center">
          <div className="flex justify-center flex-col text-center">
            <h2 className="text-[#FF7000] text-3xl font-bold">
              Emergency-Ready Taskers
            </h2>
            <p className="mt-3">Top-rated specialists available in your area</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-10">
          {taskers.map((tasker, index) => (
            <div
              key={index}
              className="bg-white shadow rounded-lg p-6 flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 relative rounded-full overflow-hidden border-4 border-[#FF7000] mb-4">
                <Image
                  src={tasker.image}
                  alt={tasker.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="text-[#FF7000] text-2xl">
                ★ {tasker.rating}{" "}
                <span className="text-xs text-gray-500">
                  ({tasker.reviews})
                </span>
              </div>
              <p className="font-semibold mb-1">{tasker.role} Contact</p>
              <h3 className="text-lg font-bold">{tasker.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmergencyTaskers;
