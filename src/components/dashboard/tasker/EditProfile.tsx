import React from "react";
import Image from "next/image";
import client1 from "../../../../public/Images/clientImage2.jpg";

const EditProfile = () => {
  return (
    <div className="flex justify-center  px-4 ">
      <div className="w-full max-w-6xl py-8 px-6 shadow-2xl rounded-xl bg-[#D4DAE0]">
        <div className="flex items-center justify-between gap-6">
          {/* Left Side: Image + Text */}
          <div className="flex items-center gap-6">
            {/* Image */}
            <div className="w-[100px] h-[100px] relative rounded-full overflow-hidden">
              <Image
                src={client1}
                alt="Client Image"
                layout="fill"
                objectFit="cover"
              />
            </div>

            {/* Text Info */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800">John Smith</h3>
              <p className="text-[#FF7000] mt-2">★★★★★ (4.9)</p>
              <p className="mt-2 text-green-700 bg-green-100 font-semibold px-3 py-1 rounded-full inline-block text-sm">
                Available for tasks
              </p>
            </div>
          </div>

          {/* Right Side: Button */}
          <div>
            <button className="bg-[#FF7000] hover:bg-[#e66300] text-white font-semibold py-2 px-6 rounded-2xl transition">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
