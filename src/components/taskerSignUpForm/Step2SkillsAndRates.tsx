/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import {
    FaBroom,
    FaWrench,
    FaBoxOpen,
    FaCouch,
    FaPlus,
} from "react-icons/fa";
import { GiSkills } from "react-icons/gi";
import { useDispatch } from "react-redux";
import { setStep2 } from "@/features/form/formSlice";

const serviceCategories = [
    { label: "Complete Cleaning", value: "Complete Cleaning", icon: <FaBroom /> },
    { label: "Pet Services", value: "Pet Services", icon: <FaWrench /> },
    { label: "Handyman, Renovation & Moving Help ", value: "Handyman, Renovation & Moving Help", icon: <FaBoxOpen /> },
    { label: "Plumbing, Electrical & HVAC (PEH)", value: "Plumbing, Electrical & HVAC (PEH)", icon: <FaCouch /> },
    { label: "Beauty & Wellness ", value: "Beauty & Wellness ", icon: <FaWrench /> },
    { label: "Everything Else", value: "Everything Else", icon: <FaWrench /> },
];

type Service = {
    title: string;
    description: string;
    hourlyRate: string;
};

type Props = {
    onNext: (data: any) => void;
    onBack: () => void;
};

const Step2SkillsAndRates = ({ onNext, onBack }: Props) => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [skillsText, setSkillsText] = useState<string>("");
    const [experience, setExperience] = useState("");
    const [qualifications, setQualifications] = useState("");
    const [services, setServices] = useState<Service[]>([
        { title: "", description: "", hourlyRate: "" },
    ]);

    const dispatch = useDispatch();

    const toggleCategory = (value: string) => {
        console.log("Toggled category:", value); // Debug
        setSelectedCategories((prev) => {
            const newCategories = prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value];
            console.log("Updated selectedCategories:", newCategories); // Debug
            return newCategories;
        });
    };

    const addService = () => {
        if (services.length < 3) {
            setServices([...services, { title: "", description: "", hourlyRate: "" }]);
        }
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
            .map((cat) => cat.label.replace(/^[^\w\s]|_/g, '').trim());

        const formattedServices = services.map((s) => ({
            title: s.title,
            description: s.description,
            hourlyRate: parseFloat(s.hourlyRate),
        }));

        const payload = {
            serviceCategories: readableCategories,
            skills: skillsText,
            experienceYears: experience,
            qualifications: qualifications,
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
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold border transition text-left h-full
                ${selectedCategories.includes(value)
                                    ? "bg-gradient-to-r from-[#C9303C] to-[#1A4F93] text-white border-transparent"
                                    : "border-gray-300 text-gray-700 hover:border-[#1A4F93]"}`}
                        >
                            <span className="text-lg shrink-0">{icon}</span>
                            <span className="flex-1 break-words leading-snug">{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Skills */}
            <div className="mb-8">
                <label className="block mb-3 font-semibold text-black text-lg">
                    Specific Skills & Expertise
                </label>
                <textarea
                    rows={3}
                    placeholder="Describe your skills and expertise here"
                    value={skillsText}
                    onChange={(e) => setSkillsText(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A4F93]"
                />
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
                <label className="block mb-3 font-semibold text-black text-lg">
                    Professional Qualifications <span className="text-sm text-gray-500">(if any)</span>
                </label>
                <input
                    type="text"
                    value={qualifications}
                    onChange={(e) => setQualifications(e.target.value)}
                    placeholder="Type your qualifications here"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A4F93]"
                />
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
                        <input
                            type="number"
                            min={15}
                            placeholder="Hourly Rate (CAD)"
                            value={service.hourlyRate}
                            onChange={(e) => updateService(i, "hourlyRate", e.target.value)}
                            className="w-full rounded-xl border px-4 py-2"
                        />
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addService}
                    disabled={services.length >= 3}
                    className="mt-2 text-[#1A4F93] font-bold px-6 flex items-center gap-2 py-3 border-2 border-[#1A4F93] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
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