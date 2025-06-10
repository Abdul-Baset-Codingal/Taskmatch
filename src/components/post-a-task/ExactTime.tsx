import React from "react";

const ExactTime = () => {
  return (
    <div>
      <p className="font-semibold text-[#72757E] text-lg mb-4">
        Preferred time window{" "}
        <span className="text-white px-3 py-1 bg-orange-500 text-xs font-medium rounded-2xl ml-2">
          Required
        </span>
      </p>

      <select className="w-full text-[#72757E] font-semibold border border-[#ccc] rounded-2xl px-6 py-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#8560F1] hover:border-[#8560F1] transition duration-300 appearance-none bg-[url('data:image/svg+xml;utf8,<svg fill=%27%2372757E%27 height=%2716%27 viewBox=%270 0 24 24%27 width=%2716%27 xmlns=%27http://www.w3.org/2000/svg%27><path d=%27M7 10l5 5 5-5z%27/></svg>')] bg-no-repeat bg-[right_1.5rem_center]">
        <optgroup label="Morning" className="text-[#72757E] font-semibold">
          <option>6:00 am</option>
          <option>6:30 am</option>
          <option>7:00 am</option>
          <option>7:30 am</option>
          <option>8:00 am</option>
          <option>8:30 am</option>
          <option>9:00 am</option>
          <option>9:30 am</option>
          <option>10:00 am</option>
          <option>10:30 am</option>
          <option>11:00 am</option>
          <option>11:30 am</option>
        </optgroup>
        <optgroup label="Afternoon" className="text-[#72757E] font-semibold">
          <option>12:00 pm</option>
          <option>12:30 pm</option>
          <option>1:00 pm</option>
          <option>1:30 pm</option>
          <option>2:00 pm</option>
          <option>2:30 pm</option>
          <option>3:00 pm</option>
          <option>3:30 pm</option>
          <option>4:00 pm</option>
          <option>4:30 pm</option>
          <option>5:00 pm</option>
          <option>5:30 pm</option>
        </optgroup>
        <optgroup label="Evening" className="text-[#72757E] font-semibold">
          <option>6:00 pm</option>
          <option>6:30 pm</option>
          <option>7:00 pm</option>
          <option>7:30 pm</option>
          <option>8:00 pm</option>
          <option>8:30 pm</option>
          <option>9:00 pm</option>
        </optgroup>
      </select>
      <p className="text-sm font-semibold text-[#72757E] mt-4">
        Popular times:
      </p>

      <div className="mt-2 flex flex-wrap gap-3">
        <span className="px-4 py-2 bg-[#F3EDFF] text-[#72757E] font-semibold rounded-full shadow-sm hover:bg-[#e1d5fb] cursor-pointer transition">
          9:00 am
        </span>
        <span className="px-4 py-2 bg-[#F3EDFF] text-[#72757E] font-semibold rounded-full shadow-sm hover:bg-[#e1d5fb] cursor-pointer transition">
          11:00 am
        </span>
        <span className="px-4 py-2 bg-[#F3EDFF] text-[#72757E] font-semibold rounded-full shadow-sm hover:bg-[#e1d5fb] cursor-pointer transition">
          2:30 pm
        </span>
        <span className="px-4 py-2 bg-[#F3EDFF] text-[#72757E] font-semibold rounded-full shadow-sm hover:bg-[#e1d5fb] cursor-pointer transition">
          5:00 pm
        </span>
      </div>
      <div className="mt-8 h-[70px] bg-[#FFF9F2] border border-[#FF7600] rounded-3xl p-5">
        <p className="text-[#72757E] text-sm font-medium">
          ⚠️
          <span className="font-bold text-[#72757E] text-normal ml-2">
            Note:
          </span>{" "}
          Selecting an exact start time may limit available taskers. Only choose
          this if your task must start at a specific time.
        </p>
      </div>
    </div>
  );
};

export default ExactTime;
