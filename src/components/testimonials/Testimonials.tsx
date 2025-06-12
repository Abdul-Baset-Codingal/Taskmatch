import SectionHeader from "@/resusable/SectionHeader";
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
    {
      title: "Home Office Organization",
      description:
        "Jane was fantastic at organizing my home office! She has an eye for detail and transformed my cluttered space into something functional. The booking process was simple and the price was fair.",
      location: "Los Angeles, CA",
      status: "Completed",
      time: "1 hour ago",
      image: client3,
      name: "Michael R.",
      task: "Home Organization",
    },
  ];

  return (
    <div
      className="w-full bg-[#FDF4F4] relative overflow-hidden py-24 md:py-32"
      style={{
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      }}
    >
      <div>
        <SectionHeader
          title="What Our Customers Say"
          description="Real stories from satisfied customers across the community"
        />
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-16">
        {tasks.map((task, index) => (
          <div
            key={index}
            className="p-8 border-[#8560F1] border-b-4 rounded-xl shadow-xl bg-white h-full transition-all duration-500 hover:scale-105 hover:border-[#E7B6FE]"
          >
            <div className="flex items-center mt-1">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400 text-lg mr-[2px]" />
              ))}
            </div>
            <p className="leading-7 italic mt-6 text-base md:text-lg">
              &quot;{task.description}&quot;
            </p>
            <hr className="mt-6 border-purple-100" />
            <div className="flex items-center gap-3 mt-6">
              <div className="w-14 h-14 md:w-16 md:h-16 relative border-4 border-white shadow-2xl shadow-purple-600 rounded-full overflow-hidden">
                <Image
                  src={task.image}
                  alt="Client"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-base md:text-lg font-semibold">
                  {task.name}
                </p>
                <p className="text-sm text-[#72757E]">{task.task}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
