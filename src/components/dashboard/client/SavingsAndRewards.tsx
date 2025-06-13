/* eslint-disable react/no-unescaped-entities */
"use client";
import React from "react";
import {
  FaPiggyBank,
  FaHistory,
  FaGift,
  FaCoins,
} from "react-icons/fa";

const SavingsAndRewards = () => {
  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Savings Card */}
        <div className="bg-gradient-to-br from-green-100 to-green-200 border-l-8 border-green-400 rounded-2xl shadow-lg p-8 flex flex-col gap-5">
          <div className="flex items-center gap-4 text-green-700">
            <FaPiggyBank className="text-4xl" />
            <div>
              <h3 className="text-2xl font-bold">SAVINGS</h3>
              <p className="text-sm font-medium">Platform Savings</p>
            </div>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-gray-800">$320</h2>
            <p className="text-gray-600 text-base mt-2">
              You've saved 25% compared to industry rates!
            </p>
          </div>

          <div className="flex justify-between text-sm font-medium text-gray-700">
            <span>TaskMatch</span>
            <span>Industry Avg</span>
          </div>

          <button className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition">
            <FaHistory /> View History
          </button>
        </div>

        {/* Rewards Card */}
        <div className="bg-gradient-to-br from-purple-100 to-purple-200 border-l-8 border-purple-500 rounded-2xl shadow-lg p-8 flex flex-col gap-5">
          <div className="flex items-center gap-4 text-purple-700">
            <FaGift className="text-4xl" />
            <div>
              <h3 className="text-2xl font-bold">REWARDS</h3>
              <p className="text-sm font-medium">Reward Points</p>
            </div>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-gray-800">
              450{" "}
              <span className="text-lg font-medium text-purple-600">
                points
              </span>
            </h2>
            <p className="text-gray-600 text-base mt-2">
              Current Value: <strong>$45 OFF</strong>
            </p>
          </div>

          <div className="text-sm text-gray-700 font-medium">
            Earn 10 points per $100 spent! <br />
            <span className="text-red-500">Points expire in 45 days</span>
          </div>

          <button className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition">
            <FaCoins /> Redeem Points
          </button>
        </div>
      </div>
    </section>
  );
};

export default SavingsAndRewards;
