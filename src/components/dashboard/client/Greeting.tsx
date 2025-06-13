"use client";
import React from "react";
import { FiBell } from "react-icons/fi";

const Greeting = () => {
  return (
    <section className="max-w-6xl mt-10 mx-auto bg-gradient-to-tr from-pink-100 via-orange-100 to-yellow-100 rounded-3xl shadow-xl p-10  text-gray-900">
      <div className="grid md:grid-cols-3 gap-8 items-center">
        {/* Info Block */}
        <div className="col-span-2">
          <h2 className="text-4xl font-extrabold text-orange-700 mb-3">
            Welcome back, <span className="text-pink-700">Michael!</span>
          </h2>
          <p className="text-lg text-gray-800">
            🎯 You have{" "}
            <span className="font-bold text-orange-600">2 tasks</span> scheduled
            this week
            <br />
            📬 And <span className="font-bold text-pink-600">1 new bid</span> on
            your moving task.
          </p>
        </div>

        {/* Button Block */}
        <div className="flex justify-center md:justify-end">
          <button className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl text-lg shadow-lg transition-all duration-300">
            <FiBell size={20} />
            View Updates
          </button>
        </div>
      </div>
    </section>
  );
};

export default Greeting;
