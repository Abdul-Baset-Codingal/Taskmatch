import SectionHeader from "@/resusable/SectionHeader";;
import client1 from "../../../public/Images/bannerImage1.jpg";
import client2 from "../../../public/Images/clientImage1.jpg";
import client3 from "../../../public/Images/clientImage2.jpg";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import React from "react";

const Testimonials = () => {
  const tasks = [
    {
      title: "House Cleaning",
      description:
        "Exceptional tiling work and fixtures installation! John's attention to detail transformed my outdated bathroom into a modern oasis.",
      location: "New York, NY",
      status: "Completed",
      time: "5 minutes ago",
      image: client1,
      name: "John Doe",
      task: "Handyman",
    },
    {
      title: "Yard Work",
      description:
        "Left my home spotless! Her attention to detail was amazing. Even cleaned areas I didn't think to mention.",
      location: "San Francisco, CA",
      status: "Completed",
      time: "25 minutes ago",
      image: client2,
      name: "Thomas D.",
      task: "Deep clean",
    },
  ];
  return (
    <div
      className="w-full  bg-[#FDF4F4] relative overflow-hidden py-32"
      style={{
        height: "200vh",
        clipPath: "polygon(0 0, 100% 0, 100% 190vh, 0 200vh)",
      }}
    >
      <div>
        <SectionHeader
          title="What Our Customers Say"
          description="Real stories from satisfied customers across the community"
        />{" "}
      </div>
      <div className="div flex justify-center mt-12 gap-12">
        {tasks.map((task, index) => (
          <div key={index}>
            <div className="p-12 border-[#8560F1] border-b-4 w-[400px] rounded-xl shadow-xl bg-white h-full transition-all duration-500 hover:scale-105 hover:border-[#E7B6FE]">
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className="text-yellow-400 text-lg mr-[2px]"
                  />
                ))}
              </div>
              <p className="leading-7 italic mt-8 text-lg">
                &quot;{task.description}&quot;
              </p>
              <hr className="mt-6 border-purple-100" />
              <div className="flex items-center gap-3 mt-8">
                <div className="w-16 h-16 relative border-4 border-white shadow-2xl shadow-purple-600 rounded-full overflow-hidden">
                  <Image
                    src={task.image}
                    alt="Client"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-lg font-semibold">{task.name}</p>
                  <p className=" text-[#72757E]">{task.task}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-12 gap-12">
        <div>
          <div className="p-12 border-[#8560F1] border-b-4 w-[400px] rounded-xl shadow-xl bg-white h-full transition-all duration-500 hover:scale-105 hover:border-[#E7B6FE]">
            <div className="flex items-center mt-1">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className="text-yellow-400 text-lg mr-[2px]"
                />
              ))}
            </div>
            <p className="leading-7 italic mt-8 text-lg">
              &quot;Jane was fantastic at organizing my home office! She has an
              eye for detail and transformed my cluttered space into something
              functional. The booking process was simple and the price was
              fair&quot;
            </p>
            <hr className="mt-6 border-purple-100" />
            <div className="flex items-center gap-3 mt-8">
              <div className="w-16 h-16 relative border-4 border-white shadow-2xl shadow-purple-600 rounded-full overflow-hidden">
                <Image
                  src={client3}
                  alt="Client"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-lg font-semibold">Michael R.</p>
                <p className=" text-[#72757E]">Home Organization</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
