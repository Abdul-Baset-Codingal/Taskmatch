"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateTaskField } from "@/features/taskForm/taskFormSlice";
import Image from "next/image";

import tasker1 from "../../../../public/Images/clientImage5.jpg";
import tasker2 from "../../../../public/Images/clientImage2.jpg";
import tasker3 from "../../../../public/Images/clientImage3.jpg";
import tasker4 from "../../../../public/Images/clientImage4.jpg";

type Props = {
    onContinue: () => void;
};

const servicesData = {
    automotive: {
        icon: "🚗",
        title: "Automotive Service",
        description: "Car maintenance and repair services",
        features: ["🧽 Car washing", "🛢️ Oil changes", "🔧 Basic repairs"],
        taskers: "A, B, C, ...",
    },
    plumbing: {
        icon: "🚿",
        title: "Plumbing Service",
        description: "Fix leaks and install plumbing fixtures",
        features: ["🔩 Pipe fixing", "🚰 Sink installation", "🚽 Toilet repair"],
        taskers: "D, E, F, ...",
    },
    electrical: {
        icon: "💡",
        title: "Electrical Service",
        description: "Electrical repair and installations",
        features: ["🔌 Wiring", "🪛 Switch repair", "💡 Light fixtures"],
        taskers: "G, H, I, ...",
    },
    gardening: {
        icon: "🌿",
        title: "Gardening Service",
        description: "Gardening and landscaping services",
        features: ["🌱 Lawn mowing", "🌼 Planting", "🌳 Tree trimming"],
        taskers: "J, K, L, ...",
    },
} as const;

type ServiceKey = keyof typeof servicesData;

const Service = ({ onContinue }: Props) => {
    const dispatch = useDispatch();
    const [selectedService, setSelectedService] = useState<ServiceKey>("automotive");
    const taskerImages = [tasker1, tasker2, tasker3, tasker4];
    const selectedData = servicesData[selectedService];

    const handleContinue = () => {
        dispatch(updateTaskField({ field: "serviceId", value: selectedService }));
        dispatch(updateTaskField({ field: "serviceTitle", value: selectedData.title }));
        onContinue();
    };

    return (
        <div className="max-w-7xl mx-auto py-10 text-black bg-orange-50">
            <h2 className="text-3xl font-bold mb-6">1. Service</h2>
            <p className="mb-4 text-lg">What service do you need?</p>

            <h3 className="text-2xl font-semibold mb-2">🔥 Trending Services</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {["🧹 Cleaning", "🔧 Handyman", "📦 Moving", "🐕 Pet Care"].map((service, idx) => (
                    <div
                        key={idx}
                        className="bg-white shadow-md border border-gray-200 p-4 rounded-xl flex flex-col items-center transition hover:scale-105 hover:shadow-lg"
                    >
                        <span className="text-3xl">{service.split(" ")[0]}</span>
                        <span className="mt-2 font-medium">{service.split(" ")[1]}</span>
                    </div>
                ))}
            </div>

            <div className="mb-4">
                <h3 className="text-2xl font-semibold mb-2">Or choose from all services:</h3>
                <select
                    className="w-full p-3 rounded-lg border border-gray-300 text-base bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value as ServiceKey)}
                >
                    {Object.keys(servicesData).map((key) => (
                        <option key={key} value={key}>
                            {servicesData[key as ServiceKey].title}
                        </option>
                    ))}
                </select>
            </div>

            <div className="bg-gradient-to-br from-white via-orange-50 to-white p-10 rounded-3xl shadow-2xl border border-orange-100 transition-all duration-300">
                <div className="flex items-start gap-8">
                    <div className="text-5xl bg-orange-100 text-orange-500 p-5 rounded-full shadow-lg">
                        {selectedData.icon}
                    </div>
                    <div className="flex-1">
                        <h4 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                            {selectedData.title}
                            <span className="text-sm bg-purple-600 text-white px-3 py-1 rounded-full">
                                Premium Service
                            </span>
                        </h4>
                        <p className="text-lg text-gray-600 mt-3 italic">{selectedData.description}</p>
                        <ul className="list-disc list-inside text-lg mt-4 text-gray-800 space-y-2">
                            {selectedData.features.map((feature, idx) => (
                                <li key={idx}>{feature}</li>
                            ))}
                        </ul>

                        <div className="mt-6 flex items-center justify-between">
                            <p className="text-xl font-semibold text-gray-900 flex items-center gap-2 select-none">
                                👷‍♂️ Available Taskers:
                                <span className="text-orange-600 font-bold ml-1">
                                    {selectedData.taskers.split(",").length} Taskers
                                </span>
                            </p>
                            <div className="flex -space-x-4 overflow-x-auto md:overflow-visible">
                                {selectedData.taskers.split(",").map((tasker, idx) => (
                                    <div
                                        key={idx}
                                        className="relative"
                                        style={{ zIndex: selectedData.taskers.split(",").length - idx }}
                                    >
                                        <Image
                                            src={taskerImages[idx % taskerImages.length]}
                                            alt={`Tasker ${tasker.trim()}`}
                                            width={48}
                                            height={48}
                                            className="rounded-full border-2 border-white shadow-md cursor-pointer hover:z-10 hover:scale-110 transition-transform duration-300"
                                            title={tasker.trim()}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">  
                <button
                    onClick={handleContinue}
                    className="bg-gradient-to-r from-[#FF8906] to-[#FF8906] px-8 py-4 rounded-2xl font-bold text-white mt-8 hover:shadow-xl hover:shadow-[#FF8906] hover:-translate-y-1 transform transition duration-300"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default Service;
