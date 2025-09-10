/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Image from "next/image";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    updateTaskField,
    setPhotos,
} from "@/features/taskForm/taskFormSlice";
import { RootState } from "@/app/store";
import { useSearchParams } from "next/navigation";

type Props = {
    onBack: () => void;
    onContinue: () => void;
};

const servicesData = {
    SelectYourService: {
        title: "Select Your Service",
    },
    handyMan: {
        title: "Handyman, Renovation & Moving Help",
    },
    PetServices: {
        title: "Pet Services",
    },
    CompleteCleaning: {
        title: "Complete Cleaning",
    },
    automotiveServices: {
        title: "Plumbing, Electrical & HVAC (PEH)",
    },
    rideServices: {
        title: "Beauty & Wellness",
    },
    beautyWellness: {
        title: "Everything Else",
    },


} as const;


type ServiceKey = keyof typeof servicesData;

const UrgentTaskDetails = ({ onBack, onContinue }: Props) => {
    const dispatch = useDispatch();
    const taskForm = useSelector((state: RootState) => state.taskForm);
    const [selectedService, setSelectedService] = useState<ServiceKey>(
        (taskForm.serviceId as ServiceKey) || "automotive"
    );
    const [images, setImages] = useState<File[]>(taskForm.photos || []);
    const [customLocation, setCustomLocation] = useState("");
    const searchParams = useSearchParams();
    const searchQuery = searchParams ? searchParams.get("search") || "" : "";
    const [taskInput, setTaskInput] = useState(searchQuery); // State to manage input field
    const [inputValue, setInputValue] = useState(searchQuery);

    // Update input field when searchQuery changes
    useEffect(() => {
        setTaskInput(searchQuery);
    }, [searchQuery]);

    // Update taskTitle with searchQuery
    const isGeneralService =
        searchQuery?.toLowerCase() === "general service";

    // Reset input only when searchQuery changes to "general service"
    useEffect(() => {
        if (isGeneralService) {
            setInputValue(""); // start empty
        } else {
            dispatch(updateTaskField({ field: "taskTitle", value: searchQuery }));
        }
    }, [searchQuery, dispatch, isGeneralService]);

    // Keep redux in sync with input when typing
    useEffect(() => {
        if (isGeneralService) {
            dispatch(updateTaskField({ field: "taskTitle", value: inputValue }));
        }
    }, [inputValue, dispatch, isGeneralService]);


    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        if (!e.target.files) return;
        const newImages = [...images];
        newImages[index] = e.target.files[0];
        setImages(newImages);
        dispatch(setPhotos(newImages));
    };

    const handleServiceChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const serviceKey = e.target.value as ServiceKey;
        setSelectedService(serviceKey);
        dispatch(updateTaskField({ field: "serviceId", value: serviceKey }));
        dispatch(updateTaskField({ field: "serviceTitle", value: servicesData[serviceKey].title }));
    };

    const handleContinue = () => {
        onContinue();
    };

    const handleCustomInput = (value: string) => {
        setCustomLocation(value);
        dispatch(updateTaskField({ field: "location", value }));
    };



    return (
        <div>

            <div className="space-y-6">



                {/* Location Selection UI */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">
                        Service Title <span className="text-red-500">*</span>
                    </label>

                    <>
                        {isGeneralService ? (
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 mb-4"
                            />
                        ) : (
                            <h2 className="text-3xl font-bold mb-6 capitalize">
                                {searchQuery}
                            </h2>
                        )}
                    </>

                    <h3 className="text-sm font-bold mb-3 text-gray-800">📍 Tell us where</h3>


                    <div className="mt-4">
                        <input
                            type="text"
                            value={customLocation}
                            onChange={(e) => handleCustomInput(e.target.value)}
                            placeholder="Enter Your location"
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </div>
                </div>
                {/* Service Selection */}
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Service <span className="text-red-500">*</span>
                    </label>
                    <select
                        className="w-full p-3 rounded-lg border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-orange-400"
                        value={selectedService}
                        onChange={handleServiceChange}
                    >
                        {Object.keys(servicesData).map((key) => (
                            <option key={key} value={key}>
                                {servicesData[key as ServiceKey].title}
                            </option>
                        ))}
                    </select>
                </div>



                {/* Description */}
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Task Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        rows={4}
                        value={taskForm.taskDescription}
                        onChange={(e) =>
                            dispatch(updateTaskField({ field: "taskDescription", value: e.target.value }))
                        }
                        placeholder="Brakes are making noise when I drive. Need someone ASAP."
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    ></textarea>
                    <p className="text-sm text-gray-500 mt-1 cursor-pointer hover:underline">
                        💡 Show tips for better quotes
                    </p>
                </div>



                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        📸 Add Photos (Optional)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {[0, 1, 2].map((index) => (
                            <label
                                key={index}
                                className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex justify-center items-center text-gray-400 cursor-pointer hover:border-orange-400 overflow-hidden relative"
                            >
                                {images[index] ? (
                                    <Image
                                        src={URL.createObjectURL(images[index])}
                                        alt={`Upload ${index}`}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <span>📷 Add Photo {index + 1}</span>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, index)}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </label>
                        ))}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-between pt-6">
                    <button
                        onClick={onBack}
                        className="text-orange-600 font-bold hover:underline"
                    >
                        ← Back
                    </button>
                    <button
                        onClick={handleContinue}
                        className="bg-gradient-to-r from-[#FF8906] to-[#FF8906] px-6 py-3 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-[#FF8906] hover:-translate-y-1 transform transition duration-300"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UrgentTaskDetails;