"use client";
import Image from "next/image";
import client1 from "../../../../public/Images/clientImage1.jpg";
import React, { useState } from "react";
import {
  FaHome,
  FaTruckMoving,
  FaTools,
  FaBoxOpen,
  FaShippingFast,
  FaBars,
  FaTimes,
  FaUsers,
  FaEye,
  FaCheckCircle,
  FaEnvelope,
  FaCode,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaDollarSign,
  FaBookmark,
  FaStar,
  FaClock,
  FaTag,
} from "react-icons/fa";

const TASK_STATUS = [
  { label: "All Tasks", count: 8 },
  { label: "Open for Bids", count: 1 },
  { label: "In Progress", count: 2 },
  { label: "Completed", count: 5 },
  { label: "Cancelled", count: 0 },
];

const TASK_CATEGORIES = [
  { label: "Home Cleaning", count: 3, icon: <FaHome /> },
  { label: "Moving", count: 2, icon: <FaTruckMoving /> },
  { label: "Handyman", count: 1, icon: <FaTools /> },
  { label: "Assembly", count: 1, icon: <FaBoxOpen /> },
  { label: "Delivery", count: 1, icon: <FaShippingFast /> },
];

const SORT_OPTIONS = [
  "Most Recent",
  "Price: High to Low",
  "Price: Low to High",
];

type Task = {
  title: string;
  status: string;
  posted: string;
  price: number;
  priceDisplay: string;
  type: string;
  location: string;
  date: string;
  category: string;
  description: string;
  people: string[];
  bids?: number;
  isNew: boolean;
  isFeatured: boolean;
  hired?: string;
  skills?: string[];
  isUrgent?: boolean;
};

const taskList: Task[] = [
  {
    title: "Help Moving Furniture",
    status: "Open for Bids",
    posted: "April 22, 2023",
    price: 200,
    priceDisplay: "$200",
    type: "Your budget",
    location: "Toronto, ON M5V 2K7",
    date: "April 25, 2023",
    category: "Moving",
    description:
      "Need help moving a sofa, bed, and dining table from my apartment to a new home about 5km away. I'll need someone with a truck who can help load, transport, and unload the furniture.",
    people: ["John D.", "David T."],
    bids: 2,
    isNew: true,
    isFeatured: false,
    skills: ["Heavy Lifting", "Driving", "Furniture Assembly"],
  },
  {
    title: "Deep House Cleaning",
    status: "In Progress",
    posted: "April 10, 2023",
    price: 180,
    priceDisplay: "$180",
    type: "Final price",
    location: "Toronto, ON",
    date: "April 24, 2023",
    category: "Home Cleaning",
    description:
      "Need deep cleaning for 2-bedroom apartment, including oven and refrigerator interiors. All cleaning supplies should be provided by the tasker.",
    people: ["Sarah J."],
    hired: "Sarah J.",
    isNew: false,
    isFeatured: false,
    skills: ["Cleaning", "Attention to Detail"],
  },
];

export default function TaskListSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Tasks");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Most Recent");
  const [showSidebar, setShowSidebar] = useState(false);

  const filteredTasks = taskList
    .filter((task) => {
      if (selectedStatus !== "All Tasks" && task.status !== selectedStatus)
        return false;
      if (selectedCategory !== "All" && task.category !== selectedCategory)
        return false;
      if (
        searchTerm &&
        !task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !task.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "Price: High to Low") return b.price - a.price;
      if (sortBy === "Price: Low to High") return a.price - b.price;
      return new Date(b.posted).getTime() - new Date(a.posted).getTime();
    });

  return (
    <section className="min-h-screen bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-5">
      <div className="flex justify-between items-center mb-6">
        <button
          className="md:hidden text-3xl text-purple-700"
          onClick={() => setShowSidebar(true)}
        >
          <FaBars />
        </button>
      </div>

      <div className="flex flex-col md:flex-row max-w-7xl mx-auto gap-8 relative">
        {/* Sidebar */}
        {showSidebar && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}

        <aside
          className={`z-50 md:static fixed top-0 left-0 h-full w-80 bg-white p-8 overflow-y-auto transition-transform duration-300
          ${
            showSidebar ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 rounded-xl shadow-lg`}
        >
          <div className="flex justify-between items-center md:hidden mb-6">
            <h2 className="text-xl font-bold">Filters</h2>
            <button
              onClick={() => setShowSidebar(false)}
              className="text-2xl text-red-500"
            >
              <FaTimes />
            </button>
          </div>

          {/* Search */}
          <div className="mb-8">
            <label
              htmlFor="search"
              className="block text-gray-800 font-bold mb-3 text-lg"
            >
              Search Tasks
            </label>
            <input
              id="search"
              type="search"
              placeholder="Search by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-5 py-3 text-lg font-medium placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-300 transition"
            />
          </div>

          {/* Status Filter */}
          <div className="mb-8">
            <h3 className="font-bold text-xl mb-5 text-purple-700 tracking-wide">
              Filter by Status
            </h3>
            <ul className="space-y-3">
              {TASK_STATUS.map(({ label, count }) => (
                <li key={label}>
                  <button
                    onClick={() => {
                      setSelectedStatus(label);
                      setShowSidebar(false);
                    }}
                    className={`w-full text-left px-5 py-3 rounded-xl font-semibold transition ${
                      selectedStatus === label
                        ? "bg-purple-600 text-white shadow-lg"
                        : "hover:bg-purple-100 text-purple-800"
                    }`}
                  >
                    {label} <span className="font-bold ml-2">({count})</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <h3 className="font-bold text-xl mb-5 text-blue-700 tracking-wide">
              Filter by Category
            </h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setShowSidebar(false);
                  }}
                  className={`w-full text-left px-5 py-3 rounded-xl font-semibold transition ${
                    selectedCategory === "All"
                      ? "bg-blue-600 text-white shadow-lg"
                      : "hover:bg-blue-100 text-blue-800"
                  }`}
                >
                  All
                </button>
              </li>
              {TASK_CATEGORIES.map(({ label, count, icon }) => (
                <li key={label}>
                  <button
                    onClick={() => {
                      setSelectedCategory(label);
                      setShowSidebar(false);
                    }}
                    className={`flex items-center gap-4 w-full text-left px-5 py-3 rounded-xl font-semibold transition ${
                      selectedCategory === label
                        ? "bg-blue-600 text-white shadow-lg"
                        : "hover:bg-blue-100 text-blue-800"
                    }`}
                  >
                    <span className="text-2xl">{icon}</span>
                    {label}
                    <span className="ml-auto font-bold">({count})</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Sort By */}
          <div>
            <h3 className="font-bold text-xl mb-4 text-pink-700 tracking-wide">
              Sort By
            </h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-5 py-3 text-lg font-medium focus:outline-none focus:ring-4 focus:ring-pink-300 transition"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </aside>

        {/* Main Task List */}
        <main className="flex-1 flex flex-col gap-10">
          {filteredTasks.length === 0 ? (
            <p className="text-center text-gray-600 text-xl font-semibold">
              No tasks found.
            </p>
          ) : (
            filteredTasks.map((task, idx) => (
              <article
                key={idx}
                className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] max-w-4xl mx-auto my-6"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Left Section - Task Overview with Gradient */}
                  <div className="bg-gradient-to-br from-purple-600 to-indigo-500 text-white p-6 lg:w-80 flex flex-col justify-between relative overflow-hidden">
                    {/* Decorative Element */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <FaTag className="text-lg" />
                        <p className="uppercase text-xs font-semibold tracking-widest">
                          {task.type || "Task"}
                        </p>
                      </div>
                      <h3 className="text-3xl font-extrabold tracking-tight">
                        {task.priceDisplay}
                      </h3>
                      <p className="text-sm mt-2 opacity-80">
                        Budget: {task.priceDisplay}
                      </p>
                    </div>
                    <div className="mt-4 flex flex-col gap-2">
                      {task.isUrgent && (
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse inline-flex items-center gap-1">
                          🚨 Urgent
                        </span>
                      )}
                      {task.isNew && (
                        <span className="bg-yellow-400 text-gray-900 w-[80px] px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                          🔥 New
                        </span>
                      )}
                      <div className="flex items-center gap-2 text-sm mt-2">
                        <FaClock />
                        <span>Posted: {task.posted || "Just now"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Task Details */}
                  <div className="flex-1 p-6 lg:p-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                        {task.title}
                      </h2>
                      <div className="flex items-center gap-3">
                        {task.isFeatured && (
                          <FaStar
                            className="text-yellow-400 text-lg animate-pulse"
                            title="Featured Task"
                          />
                        )}
                        <button className="text-gray-500 hover:text-purple-600 transition-transform hover:scale-110">
                          <FaBookmark
                            className="text-lg"
                            title="Bookmark Task"
                          />
                        </button>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                      {task.description}
                    </p>

                    {/* Task Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm mb-6">
                      {/* Location */}
                      <div className="flex items-center gap-2 bg-pink-50 border border-pink-200 px-4 py-2 rounded-xl shadow-sm">
                        <FaMapMarkerAlt className="text-pink-500 text-lg" />
                        <span className="font-medium">
                          {task.location || "Remote"}
                        </span>
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-xl shadow-sm">
                        <FaCalendarAlt className="text-blue-500 text-lg" />
                        <span className="font-medium">
                          {task.date || "Flexible"}
                        </span>
                      </div>

                      {/* Status */}
                      <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 px-4 py-2 rounded-xl shadow-sm">
                        <FaDollarSign className="text-teal-500 text-lg" />
                        <span className="font-medium">
                          {task.status || "Open"}
                        </span>
                      </div>

                      {/* Bids */}
                      <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 px-4 py-2 rounded-xl shadow-sm">
                        <FaUsers className="text-purple-500 text-lg" />
                        <span className="font-medium">
                          {task.bids || 0} bids
                        </span>
                      </div>
                    </div>

                    {/* Skills */}
                    {task.skills && task.skills.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <FaCode className="text-indigo-500" />
                          Skills Required
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {task.skills.map((skill, i) => (
                            <span
                              key={i}
                              className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-purple-100 transition"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* People and Actions */}
                    <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                      <div className="flex items-center -space-x-3">
                        {task.people && task.people.length > 0 ? (
                          task.people.slice(0, 3).map((person, i) => (
                            <Image
                              key={i}
                              src={client1} // Replace with dynamic avatar if available
                              alt={person}
                              width={36}
                              height={36}
                              className="rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
                              title={person}
                            />
                          ))
                        ) : (
                          <FaUsers className="text-gray-400 text-2xl" />
                        )}
                        {task.people && task.people.length > 3 && (
                          <span className="text-xs text-gray-500 ml-2">
                            +{task.people.length - 3}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {task.status === "Open for Bids" ? (
                          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2 text-sm shadow-md">
                            <FaEye />
                            View Bids
                          </button>
                        ) : (
                          <p className="text-green-600 font-semibold flex items-center gap-2 text-sm">
                            <FaCheckCircle />
                            Hired: {task.hired}
                          </p>
                        )}
                        <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition flex items-center gap-2 text-sm shadow-md">
                          <FaEnvelope />
                          Contact
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </main>
      </div>
    </section>
  );
}
