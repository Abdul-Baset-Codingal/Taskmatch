"use client";
import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

const categories = [
  { icon: "🧹", label: "Home Cleaning" },
  { icon: "🔧", label: "Handyman" },
  { icon: "📦", label: "Moving" },
  { icon: "🪑", label: "Furniture Assembly" },
  { icon: "🧽", label: "Deep Cleaning" },
  { icon: "🔨", label: "Minor Repairs" },
];
const timeOptions = ["Anytime", "Morning", "Afternoon", "Evening"];
const availabilityOptions = ["Today", "Tomorrow", "This Week", "Choose Date"];

const additionalOptions = [
  "Elite Taskers",
  "Quick Responders",
  "Background Checked",
  "Verified Reviews",
  "Brings Supplies",
];
const BookNowFilters = () => {
  const [price, setPrice] = useState(25); // Initial value
  const [selectedRating, setSelectedRating] = useState(null);

  const ratings = [3, 4, 5];
  const [selectedOption, setSelectedOption] = useState(null);
  const [customDate, setCustomDate] = useState("");

  const [selectedTime, setSelectedTime] = useState("Anytime");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const toggleFilter = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };
  return (
    <div className="grid grid-cols-1 gap-4 p-2">
      {categories.map((item, index) => (
        <div
          key={index}
          className="group border border-purple-200 hover:border-[#8560F1] transition rounded-xl p-2 cursor-pointer flex  items-center justify-center text-center gap-3"
        >
          <div className="w-14 h-14 flex items-center justify-center bg-[#F2EEFD] rounded-full mb-2 text-2xl">
            {item.icon}
          </div>
          <p className="text-sm text-[#72757E] font-semibold">{item.label}</p>
        </div>
      ))}

      <div className="mt-8">
        {/* Price Range Slider */}
        <h2 className="text-lg font-semibold">Price Range</h2>
        <fieldset className="flex items-center space-x-3 mt-5">
          <span className=" text-[#8560F1] font-semibold">${price}/hr</span>
          <input
            id="slider"
            type="range"
            min="25"
            max="75"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full h-2 rounded-lg cursor-pointer accent-[#8560F1]"
          />
          <span className=" text-[#8560F1] font-semibold">$75/hr</span>
        </fieldset>
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Tasker Rating</h2>
        <div className="flex flex-col space-y-2">
          {ratings.map((rating) => (
            <label
              key={rating}
              className={`flex items-center space-x-2 cursor-pointer px-4 py-2 rounded-lg border transition ${
                selectedRating === rating
                  ? "border-[#8560F1] bg-[#F2EEFD]"
                  : "border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={selectedRating === rating}
                onChange={() => setSelectedRating(rating)}
                className="hidden"
              />
              <div className="flex text-[#8560F1]">
                {Array(rating)
                  .fill()
                  .map((_, i) => (
                    <FaStar key={i} />
                  ))}
              </div>
              <span className="text-sm text-[#72757E]">{rating} Star</span>
            </label>
          ))}
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Availability</h2>

        <div className="grid grid-cols-2 gap-3">
          {availabilityOptions.map((option) => (
            <button
              key={option}
              onClick={() => {
                setSelectedOption(option);
                if (option !== "Choose Date") setCustomDate(""); // reset custom date
              }}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                selectedOption === option
                  ? "border-[#8560F1] bg-[#F2EEFD] text-[#8560F1]"
                  : "border-gray-300 text-[#72757E]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {selectedOption === "Choose Date" && (
          <div className="mt-4">
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="border px-4 py-2 rounded-md w-full text-sm text-[#72757E] focus:outline-none focus:ring-2 focus:ring-[#8560F1]"
            />
          </div>
        )}
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Time of Day</h2>

        <div className="grid grid-cols-2 gap-3">
          {timeOptions.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                selectedTime === time
                  ? "border-[#8560F1] bg-[#F2EEFD] text-[#8560F1]"
                  : "border-gray-300 text-[#72757E]"
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Additional Filters</h2>
        <div className="space-y-3">
          {additionalOptions.map((option) => (
            <label
              key={option}
              className="flex items-center space-x-3 text-[#72757E] text-sm font-medium"
            >
              <input
                type="checkbox"
                value={option}
                checked={selectedFilters.includes(option)}
                onChange={() => toggleFilter(option)}
                className="accent-[#8560F1] w-4 h-4"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="mt-8 flex flex-col items-center space-y-4">
        {/* Apply Filters */}
        <button
          onClick={() => {
            // Apply logic here
            console.log("Filters applied");
          }}
          className="bg-[#8560F1] hover:bg-[#6c44e0] text-white font-semibold py-2 px-4 w-full rounded-4xl transition duration-200"
        >
          Apply Filters
        </button>

        {/* Reset Filters */}
        <button
          onClick={() => {
            // Reset logic here
            console.log("Filters reset");
          }}
          className="bg-[#F1EFFF] hover:bg-[#e2d8ff] text-[#8560F1] font-semibold py-2 px-4 w-full rounded-4xl transition duration-200 border border-[#8560F1]"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default BookNowFilters;
