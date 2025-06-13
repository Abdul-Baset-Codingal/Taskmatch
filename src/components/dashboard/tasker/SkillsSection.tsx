"use client"
import React, { useState } from "react";
import { FiPlusCircle, FiXCircle } from "react-icons/fi";

const initialSkills = [
  "Handyman",
  "Plumbing",
  "Electrical",
  "Painting",
  "Furniture Assembly",
  "Home Cleaning",
];

const SkillsSection = () => {
  const [skills, setSkills] = useState(initialSkills);
  const [showInput, setShowInput] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    const skill = newSkill.trim();
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      setNewSkill("");
      setShowInput(false);
    }
  };

  const handleDeleteSkill = (skillToDelete: string) => {
    setSkills(skills.filter((skill) => skill !== skillToDelete));
  };

  return (
    <section className="max-w-6xl mx-auto bg-gradient-to-br from-purple-400 via-pink-200 to-blue-300 rounded-xl p-8 shadow-lg text-gray-900 mt-10">
      <h2 className="text-3xl font-bold mb-8 text-center text-purple-800">
        Your Skills
      </h2>

      <div className="flex flex-wrap gap-4 justify-center mb-8">
        {skills.map((skill, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 bg-purple-100 text-purple-900 px-4 py-2 rounded-full font-medium shadow hover:scale-105 transition-transform duration-200"
          >
            <span>{skill}</span>
            <button
              onClick={() => handleDeleteSkill(skill)}
              className="hover:text-red-600 transition"
            >
              <FiXCircle className="text-lg" />
            </button>
          </div>
        ))}
      </div>

      {showInput ? (
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="px-4 py-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow"
            placeholder="Enter a new skill"
          />
          <button
            onClick={handleAddSkill}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Add
          </button>
        </div>
      ) : (
        <div className="flex justify-center">
          <button
            onClick={() => setShowInput(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-full font-semibold shadow transition"
          >
            <FiPlusCircle className="text-xl" /> Add Skill
          </button>
        </div>
      )}
    </section>
  );
};

export default SkillsSection;
