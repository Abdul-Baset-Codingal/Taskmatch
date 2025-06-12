import SectionHeader from "@/resusable/SectionHeader";
import React from "react";
import client1 from "../../../public/Images/bannerImage1.jpg";
import client2 from "../../../public/Images/clientImage1.jpg";
import client3 from "../../../public/Images/clientImage2.jpg";
import Image from "next/image";
import { HiLocationMarker } from "react-icons/hi";
import { BiTimeFive } from "react-icons/bi";
import { FaStar } from "react-icons/fa";

const RecentlyCompleted = () => {
  const tasks = [
    {
      title: "House Cleaning",
      description: "Helped assemble a full IKEA bedroom set in under 3 hours.",
      location: "New York, NY",
      status:
        "Exceptional tiling work and fixtures installation! John's attention to detail transformed my outdated bathroom into a modern oasis.",
      time: "5 minutes ago",
      image: client1,
      name: "John Doe",
      tags: ["Handyman", "Tilling", "Rennovation"],
      jobs: "29",
    },
    {
      title: "Yard Work",
      description: "Mounted a 55-inch TV and soundbar securely on drywall.",
      location: "San Francisco, CA",
      status:
        "Left my home spotless! Her attention to detail was amazing. Even cleaned areas I didn't think to mention.",
      time: "25 minutes ago",
      image: client2,
      name: "Thomas D.",
      tags: ["Deep clean", "Cleaning", "Windows"],
      jobs: "21",
    },
    {
      title: "Dog Walking",
      description:
        "Deep-cleaned a 2-bedroom apartment with eco-friendly products.",
      location: "Austin, TX",
      status:
        "Handled my antique piano with extreme care. Professional team brought all the proper equipment and blankets.",
      time: "Started 1 hour ago",
      image: client3,
      name: "Sarah L.",
      tags: ["Moving", "Heavy Items", "Speciality"],
      jobs: "41",
    },
  ];
  return (
    <div
      className="w-full relative overflow-hidden py-20"
      style={{
        clipPath: "polygon(0 10vh, 100% 0, 100% 100%, 0 100%)",
        background: "linear-gradient(to right, #F2F5F7, #F2F5F7)",
      }}
    >
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Recently Completed Jobs"
          description="High-quality work from top-rated taskers in your community"
        />
      </div>

      <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-4 md:px-12 container mx-auto">
        {tasks.map((task, index) => (
          <div
            key={index}
            className="p-6 md:p-8 rounded-xl shadow-xl hover:scale-105 transition-transform duration-500 bg-white"
          >
            {/* Client Info */}
            <div className="flex items-center gap-4">
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
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className="text-yellow-400 text-xs mr-[2px]"
                    />
                  ))}
                  <span className="text-yellow-400 text-sm font-semibold ml-1">
                    (38 reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Title and Price */}
            <div className="flex items-center justify-between mt-8">
              <h3 className="text-xl md:text-2xl font-bold">{task.title}</h3>
              <p className="px-4 py-2 text-[#7A51EE] font-bold rounded-3xl text-lg">
                $180
              </p>
            </div>

            {/* Location and Time */}
            <div className="mt-6 flex items-center justify-between text-sm text-[#72757E]">
              <p className="flex items-center gap-1">
                <HiLocationMarker className="text-lg" />
                {task.location}
              </p>
              <p className="flex items-center gap-1">
                <BiTimeFive className="text-lg" />
                {task.time}
              </p>
            </div>

            {/* Description */}
            <p className="mt-6 text-sm text-[#72757E]">{task.description}</p>

            {/* Status Box */}
            <div className="bg-[#F8F7FE] p-4 md:p-6 border-l-4 border-[#7A51EE] mt-6 text-sm md:text-base italic">
              &quot;{task.status}&quot;
            </div>

            {/* Tags */}
            <div className="flex gap-2 flex-wrap mt-6">
              {task.tags.map((tag, i) => (
                <p
                  key={i}
                  className="bg-[#F2EEFD] text-[#8560F1] hover:bg-[#8560F1] hover:text-white px-3 py-1 rounded-3xl text-xs md:text-sm font-semibold transition-transform duration-300 hover:scale-105"
                >
                  {tag}
                </p>
              ))}
            </div>

            {/* Bottom Button and Job Count */}
            <hr className="mt-6 border-purple-100" />
            <div className="flex items-center justify-between mt-6 flex-col md:flex-row gap-3 md:gap-0">
              <button className="bg-white border border-[#8560F1] text-[#8560F1] px-5 py-2 rounded-3xl font-bold hover:bg-[#8560F1] hover:text-white transition duration-500 hover:scale-105">
                View Profile
              </button>
              <p className="text-[#72757E] text-sm">
                {task.jobs} similar jobs completed
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyCompleted;
