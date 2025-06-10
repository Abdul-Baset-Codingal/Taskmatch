import BookNowCards from "@/components/book-now/BookNowCards";
import BookNowFilters from "@/components/book-now/BookNowFilters";
import Navbar from "@/shared/Navbar";
import React from "react";

const page = () => {
  return (
    <div className="bg-[#F9F9F9]">
      <div>
        <Navbar />
      </div>
      <div className="">
        <div className="flex justify-center max-w-6xl mx-auto  mt-16">
          {" "}
          <div className="w-full flex gap-8">
            <div className="w-1/4">
              <BookNowFilters />
            </div>
            <div className="w-3/4">
              <BookNowCards />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
