// MarketOverviewTab.jsx
"use client";

import React from "react";
import { FaBuilding, FaChartPie, FaSortNumericDown } from "react-icons/fa";

const marketTrends = [
  {
    title: "Home Services Demand",
    description:
      "Online demand for home services has increased by 37% YoY, with cleaning and handyman services leading growth. Pandemic-era habits remain persistent in suburban and urban households.",
    trend: "+37% YoY Growth",
  },
  {
    title: "Urban Market Saturation",
    description:
      "Toronto, Ottawa, and Mississauga are reaching saturation. However, expansion into Brampton, London, and Kitchener reveals 25% lower CAC and 18% higher retention.",
    trend: "⚠️ High Competition",
  },
  {
    title: "Mobile Usage",
    description:
      "Over 78% of bookings now come from mobile devices, indicating a shift towards mobile-first experiences. App engagement rates are 62% higher than desktop.",
    trend: "+78% Mobile Engagement",
  },
  {
    title: "Subscription Growth",
    description:
      "TaskMatch Plus subscriptions have grown by 58% over the last 12 months, with bundled service discounts driving recurring revenue.",
    trend: "+58% Annual Growth",
  },
  {
    title: "Weekend Spike",
    description:
      "Weekend bookings account for 46% of total orders. Promotions and weekend surge pricing contribute to a 21% revenue lift.",
    trend: "📈 Peak on Weekends",
  },
  {
    title: "Rural Expansion",
    description:
      "Smaller rural markets like Guelph and Barrie show promising adoption rates. These regions have 2x the average household spending per task.",
    trend: "🌱 New Opportunities",
  },
];

const competitors = [
  { name: "TaskRabbit", rank: 1, marketShare: "26.8%" },
  { name: "TaskMatch", rank: 2, marketShare: "23.5%" },
  { name: "Handy", rank: 3, marketShare: "18.2%" },
  { name: "HomeAdvisor", rank: 4, marketShare: "15.6%" },
  { name: "Others", rank: 5, marketShare: "15.9%" },
];

const MarketOverviewTab = () => {
  return (
    <div className="bg-white text-gray-900 p-10 rounded-3xl space-y-12 shadow-2xl">
      <h2 className="text-4xl font-bold text-center">🌐 Market Overview</h2>
      <p className="text-center max-w-2xl mx-auto text-gray-600">
        Market data shows trends, demand insights, growth opportunities, and
        competition analysis to help drive strategy.
      </p>

      {/* Market Trends Section */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {marketTrends.map((item, index) => (
          <div
            key={index}
            className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-md"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {item.title}
            </h3>
            <p className="text-sm text-gray-600 mb-3">{item.description}</p>
            <p className="text-sm font-bold text-teal-600">{item.trend}</p>
          </div>
        ))}
      </div>

      {/* Competitor Table */}
      <div className="mt-10 bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-md">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          🏆 Market Share Comparison
        </h3>
        <div className="overflow-x-auto mt-6 rounded-2xl border border-gray-200 shadow-md">
          <table className="min-w-full bg-white text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-600 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-6 flex items-center gap-2">
                  <FaSortNumericDown className="text-blue-500" />
                  Rank
                </th>
                <th className="py-3 px-6 flex items-center gap-2">
                  <FaBuilding className="text-indigo-600" />
                  Company
                </th>
                <th className="py-3 px-6 flex items-center gap-2">
                  <FaChartPie className="text-green-500" />
                  Market Share
                </th>
              </tr>
            </thead>
            <tbody>
              {competitors.map((c, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-200 hover:bg-gray-50 transition duration-200"
                >
                  <td className="py-3 px-6 font-semibold text-gray-800">
                    #{c.rank}
                  </td>
                  <td className="py-3 px-6 flex items-center gap-2 font-medium text-gray-900">
                    <FaBuilding className="text-indigo-500" />
                    {c.name}
                  </td>
                  <td className="py-3 px-6">
                    <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold text-xs">
                      {c.marketShare}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MarketOverviewTab;
