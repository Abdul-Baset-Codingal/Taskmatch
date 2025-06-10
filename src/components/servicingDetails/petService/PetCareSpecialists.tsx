import React from "react";


const PetCareSpecialists = () => {
  return (
    <div>
      <div>
        <div className="w-full flex justify-center mt-10">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-[#7F5BF0] to-[#DCACFD] text-transparent bg-clip-text custom-font">
            Our Pet Care Specialists✨{" "}
          </h2>
        </div>
        <div className="flex justify-center mt-2">
          <div className="flex rounded-md justify-center h-[4px] w-[70px] bg-gradient-to-r from-[#8560F1] to-[#E7B6FE]"></div>
        </div>
        <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-4xl mt-5 p-6 md:p-8 text-center space-y-4">
          <p className="text-lg font-medium text-gray-700">
            Choose from our network of experienced, vetted pet care
            professionals. Each specialist is rated by customers and has a
            genuine love for animals.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PetCareSpecialists;
