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
        <h2 className="text-xl sm:text-3xl md:text-sm font-bold custom-font text-center">
          {title}
        </h2>
      </div>
      <div className="flex justify-center mt-2">
        <div className="flex rounded-md justify-center h-[4px] w-[60px] md:w-[70px] color1"></div>
      </div>
      {description && (
        <p className="mt-2  text-base md:text-4xl text1 font-bold text-center max-w-3xl font-nunito mx-auto">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
