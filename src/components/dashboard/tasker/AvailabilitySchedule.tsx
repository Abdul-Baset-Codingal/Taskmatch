"use client";
import React, { useState } from "react";
import { FiPlusCircle, FiTrash2, FiCalendar, FiClock } from "react-icons/fi";

const initialSchedule = [
  { day: "Monday", time: "9:00 AM - 12:00 PM" },
  { day: "Wednesday", time: "2:00 PM - 5:00 PM" },
  { day: "Friday", time: "10:00 AM - 1:00 PM" },
];

const AvailabilitySchedule = () => {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [newDay, setNewDay] = useState("");
  const [newTime, setNewTime] = useState("");

  const handleAddSchedule = () => {
    if (newDay && newTime) {
      setSchedule([...schedule, { day: newDay, time: newTime }]);
      setNewDay("");
      setNewTime("");
    }
  };

  const handleDelete = (index: number) => {
    const updated = [...schedule];
    updated.splice(index, 1);
    setSchedule(updated);
  };

  return (
    <section className="max-w-6xl mx-auto bg-gradient-to-br from-blue-300 via-white to-purple-300 rounded-2xl p-10 shadow-2xl text-gray-900 mt-12">
      <h2 className="text-4xl font-extrabold mb-10 text-center text-blue-900 drop-shadow-md">
        <FiCalendar className="inline-block mr-2 text-blue-800" />
        Availability Schedule
      </h2>

      <ul className="space-y-5 mb-10">
        {schedule.map((slot, index) => (
          <li
            key={index}
            className="flex justify-between items-center bg-white/90 border border-blue-200 px-6 py-4 rounded-xl shadow hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start gap-4">
              <div className="text-blue-600 text-xl pt-1">
                <FiCalendar />
              </div>
              <div>
                <p className="font-bold text-xl">{slot.day}</p>
                <p className="text-sm text-gray-700 flex items-center gap-1">
                  <FiClock className="text-gray-500" /> {slot.time}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDelete(index)}
              className="text-red-500 hover:text-red-700 transition"
              title="Delete"
            >
              <FiTrash2 size={22} />
            </button>
          </li>
        ))}
      </ul>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-center">
        <div className="relative w-60">
          <FiCalendar className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Day (e.g., Tuesday)"
            value={newDay}
            onChange={(e) => setNewDay(e.target.value)}
            className="pl-10 pr-4 py-2 border border-blue-300 rounded-lg w-full shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="relative w-60">
          <FiClock className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Time (e.g., 3PM - 6PM)"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="pl-10 pr-4 py-2 border border-blue-300 rounded-lg w-full shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          onClick={handleAddSchedule}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
        >
          <FiPlusCircle size={20} />
          Add Slot
        </button>
      </div>
    *!!!!
    </section>
  );
};

export default AvailabilitySchedule;
