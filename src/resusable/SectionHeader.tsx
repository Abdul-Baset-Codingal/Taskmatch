import React from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, description }) => {
  return (
    <div>
      <div className="w-full flex justify-center">
        <h2 className="text-5xl font-bold custom-font">{title}</h2>
      </div>
      <div className="flex justify-center mt-2">
        <div className="flex rounded-md justify-center h-[4px] w-[70px] bg-gradient-to-r from-[#8560F1] to-[#E7B6FE]"></div>
      </div>
      {description && (
        <p className="mt-2 flex justify-center text-[#72757E] text-xl font-normal text-center px-4">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
