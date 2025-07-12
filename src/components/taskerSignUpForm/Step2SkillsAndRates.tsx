/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import {
    FaBroom,
    FaWrench,
    FaBoxOpen,
    FaCouch,
    FaBolt,
    FaShower,
    FaPaintRoller,
    FaSeedling,
    FaPaw,
    FaSnowflake,
    FaLaptopCode,
    FaPlus,
} from "react-icons/fa";
import { GiSkills } from "react-icons/gi";
import { useDispatch } from "react-redux";
import { setStep2 } from "@/features/form/formSlice";

const serviceCategories = [
    { label: "Cleaning", value: "cleaning", icon: <FaBroom /> },
    { label: "Handyman", value: "handyman", icon: <FaWrench /> },
    { label: "Moving", value: "moving", icon: <FaBoxOpen /> },
    { label: "Furniture Assembly", value: "furniture_assembly", icon: <FaCouch /> },
    { label: "Electrical", value: "electrical", icon: <FaBolt /> },
    { label: "Plumbing", value: "plumbing", icon: <FaShower /> },
    { label: "Painting", value: "painting", icon: <FaPaintRoller /> },
    { label: "Gardening", value: "gardening", icon: <FaSeedling /> },
    { label: "Pet Care", value: "pet_care", icon: <FaPaw /> },
    { label: "Snow Removal", value: "snow_removal", icon: <FaSnowflake /> },
    { label: "Tech Help", value: "tech_help", icon: <FaLaptopCode /> },
    { label: "Other", value: "other", icon: <FaPlus /> },
];

const qualifications = [
    "Red Seal Certification",
    "Provincial Trade License",
    "Health & Safety Certification",
    "First Aid & CPR",
    "WHMIS Certification",
];

const durations = [
    "Less than 1 hour",
    "1-2 hours",
    "2-4 hours",
    "4-8 hours",
    "More than 8 hours",
];

type Service = {
    title: string;
    description: string;
    rate: string;
    duration: string;
};

type Props = {
    onNext: (data: any) => void;
    onBack: () => void;
};

const Step2SkillsAndRates = ({ onNext, onBack }: Props) => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [skillsArray, setSkillsArray] = useState<string[]>([]);
    const [skillInput, setSkillInput] = useState<string>("");
    const [experience, setExperience] = useState("");
    const [selectedQualifications, setSelectedQualifications] = useState<string[]>([]);
    const [services, setServices] = useState<Service[]>([
        { title: "", description: "", rate: "", duration: "" },
    ]);

    const dispatch = useDispatch();


    const toggleCategory = (value: string) => {
        setSelectedCategories((prev) =>
            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
        );
    };

    const toggleQualification = (qual: string) => {
        setSelectedQualifications((prev) =>
            prev.includes(qual) ? prev.filter((q) => q !== qual) : [...prev, qual]
        );
    };

    const addSkill = () => {
        if (skillInput.trim()) {
            setSkillsArray([...skillsArray, skillInput.trim()]);
            setSkillInput("");
        }
    };

    const removeSkill = (index: number) => {
        setSkillsArray(skillsArray.filter((_, i) => i !== index));
    };

    const addService = () => {
        setServices([...services, { title: "", description: "", rate: "", duration: "" }]);
    };

    const removeService = (index: number) => {
        setServices(services.filter((_, i) => i !== index));
    };

    const updateService = (index: number, field: keyof Service, value: string) => {
        const updated = [...services];
        updated[index][field] = value;
        setServices(updated);
    };

    const handleNext = () => {
        const readableCategories = serviceCategories
            .filter((cat) => selectedCategories.includes(cat.value))
            .map((cat) => cat.label.replace(/^[^\w\s]|_/g, '').trim()); // remove emoji for cleaner value if needed

        const formattedServices = services.map((s) => ({
            title: s.title,
            description: s.description,
            rate: parseFloat(s.rate),
            duration: s.duration,
        }));

        const payload = {
            serviceCategories: readableCategories,
            skills: skillsArray,
            experienceYears: experience,
            qualifications: selectedQualifications,
            services: formattedServices,
        };

        dispatch(setStep2(payload)); 
        onNext(payload); 
    };

    return (
        <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-lg p-10">
            <h2 className="text-3xl font-semibold flex items-center gap-3 mb-8 text-[#1A4F93]">
                <GiSkills /> Skills & Services
            </h2>

            {/* Service Categories */}
            <div className="mb-8">
                <label className="block mb-3 font-semibold text-black text-lg">
                    Service Categories *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {serviceCategories.map(({ label, value, icon }) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => toggleCategory(value)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold border transition 
                                ${selectedCategories.includes(value)
                                    ? "bg-gradient-to-r from-[#C9303C] to-[#1A4F93] text-white border-transparent"
                                    : "border-gray-300 text-gray-700 hover:border-[#1A4F93]"}`}
                        >
                            <span className="text-lg">{icon}</span> {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Skills */}
            <div className="mb-8">
                <label className="block mb-3 font-semibold text-black text-lg">
                    Specific Skills & Expertise
                </label>
                <div className="flex gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Enter a skill"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        className="flex-1 rounded-xl border border-gray-300 px-5 py-3"
                    />
                    <button
                        type="button"
                        onClick={addSkill}
                        className="px-4 py-3 bg-[#1A4F93] text-white font-bold rounded-xl"
                    >
                        Add
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {skillsArray.map((skill, i) => (
                        <span
                            key={i}
                            className="bg-[#C9303C] text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                            {skill}
                            <button onClick={() => removeSkill(i)}>&times;</button>
                        </span>
                    ))}
                </div>
            </div>

            {/* Experience */}
            <div className="mb-8">
                <label className="block mb-3 font-semibold text-black text-lg">Years of Experience *</label>
                <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-5 py-3"
                >
                    <option value="">Select experience</option>
                    <option value="less_than_1">Less than 1 year</option>
                    <option value="1_3">1 - 3 years</option>
                    <option value="3_5">3 - 5 years</option>
                    <option value="5_plus">5+ years</option>
                </select>
            </div>

            {/* Qualifications */}
            <div className="mb-8">
                <label className="block mb-3 font-semibold text-black text-lg">Professional Qualifications</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {qualifications.map((qual) => (
                        <label key={qual} className="inline-flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={selectedQualifications.includes(qual)}
                                onChange={() => toggleQualification(qual)}
                                className="form-checkbox text-[#1A4F93]"
                            />
                            {qual}
                        </label>
                    ))}
                </div>
            </div>

            {/* Services */}
            <div className="mb-8">
                <label className="block mb-3 font-semibold text-black text-lg">Your Services *</label>
                {services.map((service, i) => (
                    <div key={i} className="mb-6 border border-gray-300 p-4 rounded-xl relative">
                        <button
                            type="button"
                            onClick={() => removeService(i)}
                            disabled={services.length === 1}
                            className="absolute top-0 right-1 text-red-600"
                        >
                            &times;
                        </button>
                        <input
                            type="text"
                            placeholder="Service Title"
                            value={service.title}
                            onChange={(e) => updateService(i, "title", e.target.value)}
                            className="w-full mb-3 rounded-xl border px-4 py-2"
                        />
                        <textarea
                            rows={2}
                            placeholder="Description"
                            value={service.description}
                            onChange={(e) => updateService(i, "description", e.target.value)}
                            className="w-full mb-3 rounded-xl border px-4 py-2"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                                type="number"
                                min={15}
                                placeholder="Rate (CAD)"
                                value={service.rate}
                                onChange={(e) => updateService(i, "rate", e.target.value)}
                                className="rounded-xl border px-4 py-2"
                            />
                            <select
                                value={service.duration}
                                onChange={(e) => updateService(i, "duration", e.target.value)}
                                className="rounded-xl border px-4 py-2"
                            >
                                <option value="">Select duration</option>
                                {durations.map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addService}
                    className="mt-2 text-[#1A4F93] font-bold px-6 flex items-center gap-2 py-3 border-2 border-[#1A4F93] rounded-xl"
                >
                    <FaPlus /> Add Another Service
                </button>
            </div>

            <div className="flex justify-between mt-10">
                <button
                    onClick={onBack}
                    type="button"
                    className="px-10 py-3 font-bold border-2 border-[#1A4F93] rounded-xl text-[#1A4F93] hover:bg-[#1A4F93] hover:text-white"
                >
                    ← Back
                </button>
                <button
                    onClick={handleNext}
                    type="button"
                    className="px-12 py-3 bg-gradient-to-r from-[#C9303C] to-[#1A4F93] text-white font-extrabold rounded-xl shadow-lg"
                >
                    Next Step →
                </button>
            </div>
        </div>
    );
};

export default Step2SkillsAndRates;
