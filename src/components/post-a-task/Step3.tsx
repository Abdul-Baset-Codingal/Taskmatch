import React from "react";

const categories = [
  { icon: "🏠", label: "Home cleaning" },
  { icon: "🔧", label: "Handyman" },
  { icon: "🐾", label: "Pet Services" },
  { icon: "🚚", label: "Moving help" },
  { icon: "🚗", label: "Automotive" },
  { icon: "🚕", label: "Ride Services" },
  { icon: "💆", label: "Beauty & Wellness" },
  { icon: "👨‍👩‍👧‍👦", label: "Family & Care" },
  { icon: "🗑️", label: "Junk Removal" },
];

const Step3 = () => {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#8560F1] flex items-center gap-2">
        <span className="ml-1 sm:ml-3 mb-1">📋 Step 3: Task Details</span>
      </h2>

      <div className="mt-6 md:mt-8 bg-[#F4F7FF] rounded-2xl border-l-4 border-[#8560F1] p-6 sm:p-8">
        <p className="text-[#8560F1] text-lg sm:text-xl font-bold">
          💡 Tips for a great task description:
        </p>
        <ul className="list-disc pl-5 mt-4 sm:mt-5 text-base sm:text-lg text-[#72757E] font-medium space-y-2">
          <li>Be specific about what needs to be done</li>
          <li>Mention any special requirements or qualifications needed</li>
          <li>Include any important details about the task environment</li>
        </ul>
      </div>

      <div className="mt-10">
        <p className="font-semibold text-[#72757E] text-base sm:text-lg mb-3">
          Task Title
        </p>
        <input
          type="text"
          placeholder="e.g.. Help moving furniture, Cleaning my house"
          className="w-full border border-[#ccc] shadow-lg rounded-2xl px-4 sm:px-6 py-3 sm:py-4 focus:outline-none focus:ring-2 focus:ring-[#8560F1] hover:border-[#8560F1] transition duration-300"
        />
      </div>

      <div className="mt-10">
        <p className="font-semibold text-[#72757E] text-base sm:text-lg mb-2">
          Task Category
        </p>
        <p className="font-semibold text-[#72757E] text-sm sm:text-base mt-2">
          Select one of the categories below:
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 mt-6 sm:mt-10">
        {categories.map(({ icon, label }, idx) => (
          <div
            key={idx}
            className="group border border-purple-200 hover:border-[#8560F1] transition rounded-xl p-4 cursor-pointer flex flex-col items-center justify-center text-center"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-[#F2EEFD] rounded-full mb-2 text-xl sm:text-2xl">
              {icon}
            </div>
            <p className="text-sm sm:text-base text-[#72757E] font-semibold">
              {label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <p className="font-semibold text-[#72757E] text-base sm:text-lg mb-3">
          Task Description
        </p>
        <textarea
          placeholder="Describe with details what you need help with..."
          rows={6}
          className="w-full border border-[#ccc] shadow-lg rounded-2xl px-4 sm:px-6 py-3 sm:py-4 focus:outline-none focus:ring-2 focus:ring-[#8560F1] hover:border-[#8560F1] transition duration-300 resize-none"
        ></textarea>
      </div>

      <div className="mt-10">
        <p className="font-semibold text-[#72757E] text-base sm:text-lg mb-3">
          Add Photos or Documents (optional)
        </p>
        <div
          className="w-full h-[150px] sm:h-[200px] border-2 border-dashed border-[#ccc] rounded-2xl px-4 sm:px-6 py-8 sm:py-12 bg-white text-center cursor-pointer hover:border-[#8560F1] transition duration-300"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const files = e.dataTransfer.files;
            console.log("Dropped files:", files);
          }}
        >
          <p className="text-sm sm:text-base text-[#72757E] font-medium mt-2">
            Drag & drop your files here or click to upload
          </p>
          <p className="text-sm sm:text-base text-[#72757E] font-medium">
            Supported file types: Images (max 5) and videos (max 20 secs)
          </p>
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              const files = e.target.files;
              console.log("Selected files:", files);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Step3;
