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
      className="w-full relative overflow-hidden min-h-[190vh] py-20"
      style={{
        clipPath: "polygon(0 10vh, 100% 0, 100% 180vh, 0 190vh)",
        background: "linear-gradient(to right, #F2F5F7, #F2F5F7)",
      }}
    >
      <div className="container mx-auto px-4 mt-8">
        <SectionHeader
          title="Recently Completed Jobs"
          description="High-quality work from top-rated taskers in your community

"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20 px-6 mx-auto container">
        {tasks.map((task, index) => (
          <div
            key={index}
            className="p-8 mb-20 rounded-xl shadow-xl hover:scale-105 transition-transform duration-500  h-full"
          >
            <div className="flex items-center gap-3 ">
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
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      className="text-yellow-400 text-xs mr-[2px]"
                    />
                  ))}{" "}
                  <span className="text-yellow-400 text-sm font-semibold">
                    (38 reviews)
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-8">
              <h3 className="text-3xl font-bold mb-2">{task.title}</h3>
              <p
                className={`px-5 py-2 text-[#7A51EE] font-bold rounded-3xl text-xl `}
              >
                $180
              </p>
            </div>
            <div className="mt-8 flex items-center justify-between">
              <p className="text-[#72757E] text-sm flex items-center gap-1">
                <HiLocationMarker className="text-lg " />
                {task.location}
              </p>
              <p className="text-[#72757E] text-sm flex items-center gap-1">
                <BiTimeFive className="text-lg" />
                {task.time}
              </p>
            </div>
            <p className="mt-8 mb-3  text-[#72757E]">{task.description}</p>
            <div className="bg-[#F8F7FE] p-8 border-l-4 border-[#7A51EE] mt-8">
              <p className="leading-7 italic">&quot;{task.status}&quot;</p>
            </div>

            <div className="flex gap-2 mt-6 flex-wrap">
              {task.tags.map((tag, tagIdx) => (
                <p
                  key={tagIdx}
                  className="bg-[#F2EEFD] text-[#8560F1] hover:bg-[#8560F1] hover:text-[#F2EEFD] hover:scale-105 hover:transition duration-700 px-3 py-2 rounded-3xl text-sm font-semibold"
                >
                  {tag}
                </p>
              ))}
            </div>
            <hr className="mt-6 border-purple-100" />
            <div className="flex items-center justify-between mt-6">
              <button className="bg-white border border-[#8560F1] text-[#8560F1] px-6  font-bold hover:text-white py-3 rounded-3xl hover:scale-110 transform transition duration-700 hover:bg-[#8560F1] cursor-pointer">
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
