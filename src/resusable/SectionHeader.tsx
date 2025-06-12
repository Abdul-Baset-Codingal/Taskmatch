import React from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
}) => {
  return (
    <div className="px-4">
      <div className="w-full flex justify-center">
        <h2 className="text-3xl md:text-5xl font-bold custom-font text-center">
          {title}
        </h2>
      </div>
      <div className="flex justify-center mt-2">
        <div className="flex rounded-md justify-center h-[4px] w-[60px] md:w-[70px] bg-gradient-to-r from-[#8560F1] to-[#E7B6FE]"></div>
      </div>
      {description && (
        <p className="mt-2 text-base md:text-xl text-[#72757E] font-normal text-center max-w-3xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
